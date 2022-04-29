import { API, HttpCode, TypeMapping } from "@/model";
import _ from "lodash";
import { Vue } from "vue-class-component";

export default class VisualEditor extends Vue {
    editValue: any = "";

    get api(): API {
        return this.$store.state.api;
    }

    get forceExpand(): { key: string } {
        return this.$store.state.forceExpand;
    }

    onEdit() {
        this.$store.commit("update", _.cloneDeep(this.api));
    }

    onForceExpand(k: string) {
        this.$store.commit("expand", k);
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

    get httpCodes(): { title: string; value: string }[] {
        return HttpCode.map((c) => ({
            title: `${c.name} -- ${c.description}`,
            value: c.name,
        }));
    }

    get paramInOptions(): string[] {
        return ["query", "header", "path", "cookie"];
    }

    get mimeTypes(): string[] {
        return ["application/json", "application/xml", "text/pdf"];
    }
}