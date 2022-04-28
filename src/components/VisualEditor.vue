<template>
  <Tree>
    <template v-slot:label> API Information </template>
    <template v-slot:children>
      <Tree
        showEdit
        @save="
          api.name = editValue;
          editValue = '';
          onEdit();
        "
        @cancel="editValue = ''"
        @edit="editValue = api.name"
      >
        <template v-slot:label> Title </template>
        <template v-slot:value>{{ api.name }}</template>
        <template v-slot:editor>
          <v-text-field
            v-model="editValue"
            density="compact"
            variant="outlined"
          ></v-text-field>
        </template>
      </Tree>
      <Tree
        showEdit
        @save="
          api.version = editValue;
          editValue = '';
          onEdit();
        "
        @cancel="editValue = ''"
        @edit="editValue = api.version"
      >
        <template v-slot:label> Version </template>
        <template v-slot:value>{{ api.version }}</template>
        <template v-slot:editor>
          <v-text-field
            v-model="editValue"
            density="compact"
            variant="outlined"
          ></v-text-field>
        </template>
      </Tree>
      <Tree showEdit>
        <template v-slot:label> Description </template>
        <template v-slot:value>{{ api.description }}</template>
        <template v-slot:editor>
          <v-text-field
            v-model="editValue"
            density="compact"
            variant="outlined"
          ></v-text-field>
        </template>
      </Tree>
    </template>
  </Tree>
  <Tree showAdd @add="addEntity()">
    <template v-slot:label>Entities</template>
    <template v-slot:children>
      <Tree
        v-for="entity of api.entities"
        :key="entity.name"
        showDelete
        :forceExpand="entity.name === forceExpandKey"
        @delete="deleteEntity(entity.name)"
      >
        <template v-slot:label> {{ entity.name }} </template>
        <template v-slot:children>
          <Tree
            showEdit
            @save="
              entity.name = editValue;
              editValue = '';
              onEdit();
            "
            @cancel="editValue = ''"
            @edit="editValue = entity.name"
          >
            <template v-slot:label> Entity Name: </template>
            <template v-slot:value>{{ entity.name }}</template>
            <template v-slot:editor>
              <v-text-field
                v-model="editValue"
                density="compact"
                variant="outlined"
              ></v-text-field>
            </template>
          </Tree>
          <Tree showAdd @add="addField(entity)">
            <template v-slot:label> Fields </template>
            <template v-slot:children>
              <Tree
                v-for="field of entity.fields"
                :key="field.name"
                :forceExpand="field.name === forceExpandKey"
                showDelete
                @delete="deleteField(entity, field.name)"
              >
                <template v-slot:label>{{ field.name }}</template>
                <template v-slot:children>
                  <Tree
                    showEdit
                    @save="
                      field.name = editValue;
                      editValue = '';
                      onEdit();
                    "
                    @cancel="editValue = ''"
                    @edit="editValue = field.name"
                  >
                    <template v-slot:label> Name </template>
                    <template v-slot:value>{{ field.name }}</template>
                    <template v-slot:editor>
                      <v-text-field
                        v-model="editValue"
                        density="compact"
                        variant="outlined"
                      ></v-text-field>
                    </template>
                  </Tree>
                  <Tree
                    showEdit
                    @save="
                      field.type = editValue;
                      editValue = '';
                      onEdit();
                    "
                    @cancel="editValue = ''"
                    @edit="editValue = field.type"
                  >
                    <template v-slot:label> Type </template>
                    <template v-slot:value>{{ field.type }}</template>
                    <template v-slot:editor>
                      <v-select
                        v-model="editValue"
                        density="compact"
                        variant="outlined"
                        :items="fieldTypes"
                      ></v-select>
                    </template>
                  </Tree>
                  <Tree
                    showEdit
                    @save="
                      field.required = editValue;
                      editValue = '';
                      onEdit();
                    "
                    @cancel="editValue = ''"
                    @edit="editValue = field.required"
                  >
                    <template v-slot:label> Required </template>
                    <template v-slot:value>{{ field.required }}</template>
                    <template v-slot:editor>
                      <v-checkbox
                        v-model="editValue"
                        density="compact"
                        variant="outlined"
                      ></v-checkbox>
                    </template>
                  </Tree>
                </template>
              </Tree>
            </template>
          </Tree>
        </template>
      </Tree>
    </template>
  </Tree>
  <Tree showAdd @add="addPath()">
    <template v-slot:label>Paths</template>
    <template v-slot:children>
      <Tree
        v-for="path of api.paths"
        :forceExpand="path.path === forceExpandKey"
        :key="path.path"
        showDelete
        @delete="deletePath(path.path)"
      >
        <template v-slot:label> {{ path.path }} </template>
        <template v-slot:children>
          <Tree
            showEdit
            @save="
              path.path = editValue;
              editValue = '';
              onEdit();
            "
            @cancel="editValue = ''"
            @edit="editValue = path.path"
          >
            <template v-slot:label> Path </template>
            <template v-slot:value>{{ path.path }}</template>
            <template v-slot:editor>
              <v-text-field
                v-model="editValue"
                density="compact"
                variant="outlined"
              ></v-text-field>
            </template>
          </Tree>
          <Tree showAdd @add="addOperation(path)">
            <template v-slot:label> Operation </template>
            <template v-slot:children>
              <Tree
                v-for="op of path.operations"
                :forceExpand="op.name === forceExpandKey"
                :key="op.method"
                showDelete
                @delete="deleteOperation(path, op.method)"
              >
                <template v-slot:label> {{ op.method }}</template>
                <template v-slot:children>
                  <Tree
                    showEdit
                    @save="
                      op.method = editValue;
                      editValue = '';
                      onEdit();
                    "
                    @cancel="editValue = ''"
                    @edit="editValue = op.method"
                  >
                    <template v-slot:label> Method </template>
                    <template v-slot:value>{{ op.method }}</template>
                    <template v-slot:editor>
                      <v-select
                        v-model="editValue"
                        density="compact"
                        variant="outlined"
                        :items="httpMethods"
                      ></v-select>
                    </template>
                  </Tree>
                  <Tree
                    showEdit
                    @save="
                      op.name = editValue;
                      editValue = '';
                      onEdit();
                    "
                    @cancel="editValue = ''"
                    @edit="editValue = op.name"
                  >
                    <template v-slot:label> Name </template>
                    <template v-slot:value>{{ op.name }}</template>
                    <template v-slot:editor>
                      <v-text-field
                        v-model="editValue"
                        density="compact"
                        variant="outlined"
                      ></v-text-field>
                    </template>
                  </Tree>
                  <Tree showAdd @add="addParam(op)">
                    <template v-slot:label> Parameters </template>
                    <template v-slot:children>
                      <Tree
                        v-for="param of op.params"
                        :forceExpand="param.name === forceExpandKey"
                        :key="param.name"
                        showDelete
                        @delete="deleteParam(op, param.name)"
                      >
                        <template v-slot:label> {{ param.name }}</template>
                        <template v-slot:children>
                          <Tree
                            showEdit
                            @save="
                              param.name = editValue;
                              forceExpandKey = param.name;
                              editValue = '';
                              onEdit();
                            "
                            @cancel="editValue = ''"
                            @edit="editValue = param.name"
                          >
                            <template v-slot:label> Name </template>
                            <template v-slot:value>{{ param.name }}</template>
                            <template v-slot:editor>
                              <v-text-field
                                v-model="editValue"
                                density="compact"
                                variant="outlined"
                              ></v-text-field>
                            </template>
                          </Tree>
                          <Tree
                            showEdit
                            @save="
                              param.in = editValue;
                              editValue = '';
                              onEdit();
                            "
                            @cancel="editValue = ''"
                            @edit="editValue = param.in"
                          >
                            <template v-slot:label> In </template>
                            <template v-slot:value>{{ param.in }}</template>
                            <template v-slot:editor>
                              <v-select
                                v-model="editValue"
                                density="compact"
                                variant="outlined"
                                :items="paramInOptions"
                              ></v-select>
                            </template>
                          </Tree>
                          <Tree
                            showEdit
                            @save="
                              param.type = editValue;
                              editValue = '';
                              onEdit();
                            "
                            @cancel="editValue = ''"
                            @edit="editValue = param.type"
                          >
                            <template v-slot:label> Type </template>
                            <template v-slot:value>{{ param.type }}</template>
                            <template v-slot:editor>
                              <v-select
                                v-model="editValue"
                                density="compact"
                                variant="outlined"
                                :items="fieldTypes"
                              ></v-select>
                            </template>
                          </Tree>
                        </template>
                      </Tree>
                    </template>
                  </Tree>
                  <Tree showAdd @add="addResponse(op)">
                    <template v-slot:label> Responses </template>
                    <template v-slot:children>
                      <Tree
                        v-for="re of op.responses"
                        :forceExpand="re.name === forceExpandKey"
                        :key="re.name"
                        showDelete
                        @delete="deleteResponse(op, re.name)"
                      >
                        <template v-slot:label> {{ re.name }}</template>
                        <template v-slot:children>
                          <Tree
                            showEdit
                            @save="
                              re.name = editValue;
                              forceExpandKey = re.name;
                              editValue = '';
                              onEdit();
                            "
                            @cancel="editValue = ''"
                            @edit="editValue = re.name"
                          >
                            <template v-slot:label> Response Code </template>
                            <template v-slot:value>{{ re.name }}</template>
                            <template v-slot:editor>
                              <v-select
                                v-model="editValue"
                                density="compact"
                                variant="outlined"
                                :items="httpCodes"
                              ></v-select>
                            </template>
                          </Tree>
                          <Tree showAdd @add="addResponseContent(re)">
                            <template v-slot:label> Content </template>
                            <template v-slot:children>
                              <Tree
                                v-for="c of re.content"
                                :forceExpand="c.mime === forceExpandKey"
                                :key="c.mime"
                                showDelete
                                @delete="deleteResponseContent(re, c.mime)"
                              >
                                <template v-slot:label> {{ c.mime }}</template>
                                <template v-slot:children>
                                  <Tree
                                    showEdit
                                    @save="
                                      c.mime = editValue;
                                      editValue = '';
                                      onEdit();
                                    "
                                    @cancel="editValue = ''"
                                    @edit="editValue = c.mime"
                                  >
                                    <template v-slot:label>
                                      Mime Type
                                    </template>
                                    <template v-slot:value>{{
                                      c.mime
                                    }}</template>
                                    <template v-slot:editor>
                                      <v-select
                                        v-model="editValue"
                                        density="compact"
                                        variant="outlined"
                                        :items="mimeTypes"
                                      ></v-select>
                                    </template>
                                  </Tree>
                                  <Tree
                                    showEdit
                                    @save="
                                      c.type = editValue;
                                      editValue = '';
                                      onEdit();
                                    "
                                    @cancel="editValue = ''"
                                    @edit="editValue = c.type"
                                  >
                                    <template v-slot:label> Type </template>
                                    <template v-slot:value>{{
                                      c.type
                                    }}</template>
                                    <template v-slot:editor>
                                      <v-select
                                        v-model="editValue"
                                        density="compact"
                                        variant="outlined"
                                        :items="fieldTypes"
                                      ></v-select>
                                    </template>
                                  </Tree>
                                </template>
                              </Tree>
                            </template>
                          </Tree>
                        </template>
                      </Tree>
                    </template>
                  </Tree> </template
              ></Tree> </template></Tree></template
      ></Tree> </template
  ></Tree>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Tree from "./Tree.vue";
import _ from "lodash";
import {
  API,
  Entity,
  HttpCode,
  HttpMethod,
  Operation,
  Path,
  Response,
  TypeMapping,
} from "../model";

@Options({
  components: {
    Tree,
  },
})
export default class VisualEditor extends Vue {
  editValue: any = "";
  forceExpandKey?: string;

  get api(): API {
    return this.$store.state.api;
  }

  onEdit() {
    this.$store.commit("update", _.cloneDeep(this.api));
  }

  addEntity() {
    const name = `Entity_${this.api.entities.length + 1}`;
    this.api.entities.push({
      fields: [],
      name,
    });
    this.forceExpandKey = name;
    this.onEdit();
  }

  deleteEntity(name: string) {
    this.api.entities = this.api.entities.filter((e) => e.name !== name);
    this.onEdit();
  }

  addField(entity: Entity) {
    const name = `Field_${entity.fields.length + 1}`;
    entity.fields.push({
      name,
      type: "string",
      required: false,
    });
    this.forceExpandKey = name;
    this.onEdit();
  }

  deleteField(entity: Entity, name: string) {
    entity.fields = entity.fields.filter((f) => f.name !== name);
    this.onEdit();
  }

  addPath() {
    const path = `/path_${this.api.paths.length + 1}`;
    this.api.paths.push({
      path,
      operations: [],
    });
    this.forceExpandKey = path;
    this.onEdit();
  }

  deletePath(path: string) {
    this.api.paths = this.api.paths.filter((p) => p.path !== path);
    this.onEdit();
  }

  addOperation(path: Path) {
    const name = `Operation_${path.operations.length + 1}`;
    path.operations.push({
      method: "get",
      name,
      responses: [],
      params: [],
      description: "A REST operation",
    });
    this.forceExpandKey = name;
    this.onEdit();
  }

  deleteOperation(path: Path, method: HttpMethod) {
    path.operations = path.operations.filter((op) => op.method !== method);
    this.onEdit();
  }

  addParam(op: Operation) {
    const name = `Param_${op.params!.length + 1}`;
    op.params!.push({
      in: "query",
      name,
      type: "string",
    });
    this.forceExpandKey = name;
    this.onEdit();
  }

  deleteParam(op: Operation, name: string) {
    op.params = op.params?.filter((p) => p.name !== name);
    this.onEdit();
  }

  addResponse(op: Operation) {
    const name = "200";
    op.responses!.push({
      name,
      description: "Operation Response",
      content: [],
    });
    this.forceExpandKey = name;
    this.onEdit();
  }

  deleteResponse(op: Operation, name: string) {
    op.responses = op.responses?.filter((p) => p.name !== name);
    this.onEdit();
  }

  addResponseContent(re: Response) {
    const mime = "application/json";
    re.content!.push({
      mime,
      type: "string",
    });
    this.forceExpandKey = mime;
    this.onEdit();
  }

  deleteResponsContent(re: Response, mime: string) {
    re.content = re.content?.filter((p) => p.mime !== mime);
    this.onEdit();
  }

  get fieldTypes(): string[] {
    return [
      ...TypeMapping.map((m) => m.internalType),
      ...this.api.entities.map((e) => e.name),
    ];
  }

  get httpMethods(): string[] {
    return ["get", "post", "put", "patch", "delete"];
  }

  get httpCodes(): {title:string,value:string}[] {
    return HttpCode.map(c=>({
      title: `${c.name} -- ${c.description}`,
      value: c.name
    }));
  }

  get paramInOptions(): string[] {
    return ["query", "header", "path", "cookie"];
  }

  get mimeTypes(): string[] {
    return ["application/json", "application/xml", "text/pdf"];
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.v-card {
  margin-bottom: 1rem;
}
span.title {
  margin-left: 1rem;
}
.entities {
  margin-top: 1rem;
}
.add-entity {
  margin-top: 1rem;
  margin-bottom: 1rem;
}
.v-btn {
  margin-left: 1rem;
}
</style>
