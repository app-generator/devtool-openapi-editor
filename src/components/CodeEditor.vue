<template>
  <div id="editor"></div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { OpenAPIObject } from "openapi3-ts";
import loader from "@monaco-editor/loader";
import Ajv from "ajv-draft-04";
import { PropType } from "vue";

const schemaUrl =
  "https://raw.githubusercontent.com/OAI/OpenAPI-Specification/main/schemas/v3.0/schema.json";

@Options({
  props: {
    api: {
      type: Object as PropType<OpenAPIObject>,
      required: true,
    },
  },
  watch: {
    api: {
      handler: "onApiChanged",
      deep: true,
      immediate: true,
    },
  },
  emits: ["codeChange"],
})
export default class CodeEditor extends Vue {
  api!: OpenAPIObject;

  private apiTxt?: string;

  private monacoModel?: any;

  onApiChanged(updated: any) {
    this.apiTxt = JSON.stringify(updated, null, "\t");
    if (this.monacoModel) {
      this.monacoModel.setValue(this.apiTxt);
    }
  }

  async mounted() {
    const schemaResponse = await fetch(schemaUrl);
    const schema = await schemaResponse.json();
    const monaco = await loader.init();
    const ajv = new Ajv({
      validateFormats: false,
      strict: false,
      validateSchema: false,
      allErrors: true,
    });
    const validate = ajv.compile(schema);

    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      schemas: [
        {
          uri: schemaUrl,
          fileMatch: ["api.json"],
          schema,
        },
      ],
    });
    const modelUri = monaco.Uri.parse("internal://api.json");
    this.monacoModel =
      monaco.editor.getModel(modelUri) ||
      monaco.editor.createModel(this.apiTxt || "", "json", modelUri);
    monaco.editor.create(document.getElementById("editor") as any, {
      language: "json",
      model: this.monacoModel,
    });
    this.monacoModel.onDidChangeContent(() => {
      try {
        const raw = this.monacoModel.getValue();
        if (raw !== this.apiTxt) {
          this.apiTxt = raw;
          const data = JSON.parse(raw);
          if (validate(data)) {
            this.$emit("codeChange", data);
          }
        }
      } catch (err) {
        // throws if the model is not json
      }
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
div#editor {
  width: 100%;
  height: 100%;
}
</style>
