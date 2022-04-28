import { ContentObject, OpenAPIObject, ParameterObject, PathsObject, RequestBodyObject, ResponseObject, ResponsesObject, SchemaObject, SchemasObject } from "openapi3-ts";

export const HttpCode: Named[] = [
    {
        name: '200',
        description: 'OK'
    },
    {
        name: '400',
        description: 'Bad Request'
    },
    {
        name: '401',
        description: 'Unauthorized'
    },
    {
        name: '403',
        description: 'Forbidden'
    },
    {
        name: '404',
        description: 'Not Found'
    },
    {
        name: '405',
        description: 'Unsupported Media'
    },
    {
        name: '500',
        description: 'Internal Server Error'
    },
]

export const TypeMapping = [
    {
        internalType: 'string',
        openapi: {
            type: 'string'
        }
    },
    {
        internalType: 'timestamp',
        openapi: {
            type: 'string',
            format: 'date-time'
        }
    },
    {
        internalType: 'uuid',
        openapi: {
            type: 'string',
            format: 'uuid'
        }
    },
    {
        internalType: 'binary',
        openapi: {
            type: 'string',
            format: 'binary'
        }
    },
    {
        internalType: 'number',
        openapi: {
            type: 'number'
        }
    },
    {
        internalType: 'boolean',
        openapi: {
            type: 'boolean'
        }
    },
]

export interface Named {
    name: string;
    description?: string;
}

export interface Typed {
    type: string;
    array?: boolean;
}

export interface Field extends Named, Typed {
    required?: boolean;
}

export interface Entity extends Named {
    fields: Field[];
}

export interface Param extends Field {
    in: 'query' | 'header' | 'path' | 'cookie';
}

export interface Content extends Typed {
    mime: string;
}

export interface Response extends Named {
    content: Content[];
}

export interface RequestBody {
    description?: string;
    content: Content[];
}

export interface Path {
    path: string;
    operations: Operation[];
}

export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete'

export interface Operation extends Named {
    method: HttpMethod;
    params?: Param[];
    requestBody?: RequestBody;
    responses: Response[];
}

export interface API extends Named {
    version: string;
    entities: Entity[];
    paths: Path[];
}

const typeToOpenAPI = (internal: Typed): SchemaObject => {
    const openapiType = TypeMapping.find(t => t.internalType === internal.type)?.openapi || {
        '$ref': `#/components/schemas/${internal.type}`
    };
    return internal.array ? {
        type: 'array',
        items: openapiType
    } : openapiType as any
}

const refRegex = /#\/components\/schemas\/(?<entity>\S+)/;

const extractEntityFromRef = (ref: string): string => {
    const rex = refRegex.exec(ref);
    if (rex && rex[1]) {
        return rex[1];
    }
    return 'string'
}

const typeToInternal = (api: SchemaObject): Typed => {
    if (api.$ref) {
        return { type: extractEntityFromRef(api.$ref) }
    }
    if (api.type === 'array') {
        return {
            ...typeToInternal(api.items!),
            array: true
        }
    }
    const internalType = TypeMapping.find(t => t.openapi.type === api.type && (!t.openapi.format || t.openapi.format === api.format));
    return { type: internalType?.internalType || 'string' }
}


const requestBodyToInternal = (body: RequestBodyObject): RequestBody | undefined => {
    if (!body) return undefined;
    return {
        description: body.description,
        content: Object.entries(body.content).map((ckv: [a: string, b: any]) => ({
            mime: ckv[0],
            ...typeToInternal(ckv[1].schema)
        }))
    }
}


export const toOpenAPI = (internal: API): OpenAPIObject => {

    const paths: PathsObject = {};

    internal.paths.forEach(p => {
        paths[p.path] = {};
        p.operations.forEach(op => {
            const responses: ResponsesObject = {};
            op.responses.forEach(r => {
                const content: ContentObject = {};
                r.content.forEach(c => {
                    content[c.mime] = { schema: typeToOpenAPI(c) };
                });
                responses[r.name] = {
                    description: r.description,
                    content
                }
            })
            paths[p.path][op.method] = {
                parameters: op.params?.map(p => ({
                    in: p.in,
                    name: p.name,
                    desription: p.description,
                    required: p.required,
                    schema: typeToOpenAPI(p)
                })),
                responses
            }
        })
    });

    const schemas: SchemasObject = {}

    internal.entities.forEach(e => {
        const properties: { [p: string]: SchemaObject } = {};
        e.fields.forEach(f => {
            properties[f.name] = typeToOpenAPI(f);
        })
        schemas[e.name] = {
            type: 'object',
            properties
        };

    })

    return {
        openapi: '3.0.0',
        info: {
            title: internal.name,
            version: internal.version,
            description: internal.description
        },
        paths,
        components: {
            schemas
        }
    }
}



export const toInternal = (api: OpenAPIObject): API => {

    return {
        name: api.info.title,
        version: api.info.version,
        description: api.info.description,
        paths: Object.entries(api.paths).map(pkv => ({
            path: pkv[0],
            operations: Object.entries(pkv[1]).map((okv: [a: string, b: any]) => ({
                method: okv[0] as any,
                name: okv[1].operationId,
                description: okv[1].description,
                params: okv[1].parameters?.map((p: ParameterObject) => ({
                    name: p.name,
                    description: p.description,
                    ...typeToInternal(p.schema as SchemaObject)
                })),
                requestBody: requestBodyToInternal(okv[1].requestBody),
                responses: Object.entries(okv[1].responses).map((rkv: [c: string, r: any]) => ({
                    name: rkv[0],
                    description: rkv[1].description,
                    content: Object.entries(rkv[1].content).map((ckv: [m: string, c: any]) => ({
                        mime: ckv[0],
                        ...typeToInternal(ckv[1].schema)
                    }))
                }))
            }))
        })),
        entities: Object.entries(api.components?.schemas!).map((mkv: [a: string, b: SchemaObject]) => ({
            name: mkv[0],
            fields: Object.entries(mkv[1].properties!).map((pkv: [a: string, b: SchemaObject]) => ({
                name: pkv[0],
                required: mkv[1].required?.includes(pkv[0]),
                ...typeToInternal(pkv[1])
            }))
        })).sort((e1, e2) => e1.name.localeCompare(e2.name))
    }
}

export interface TreeModel extends Named {
    value?: any;
    children?: TreeModel[]
}