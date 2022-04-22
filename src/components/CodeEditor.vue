<template>
  <div id="editor"></div>
  <pre><code>{{internal}}</code></pre>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import loader from "@monaco-editor/loader";
import Ajv from "ajv-draft-04";
import { OpenAPIObject } from "openapi3-ts";
import { toInternal, toOpenAPI } from "./model";

const schemaUrl =
  "https://raw.githubusercontent.com/OAI/OpenAPI-Specification/main/schemas/v3.0/schema.json";

@Options({})
export default class CodeEditor extends Vue {
  private monacoModel?: any;

  private apiTxt: string = "";

  get internal(): string {
    try {
      return JSON.stringify(
        toInternal(JSON.parse(this.apiTxt || "")),
        null,
        "\t"
      );
    } catch (err) {
      return "";
    }
  }

  async mounted() {
    this.apiTxt = JSON.stringify(toOpenAPI(this.$store.state.api), null, "\t");
    this.$store.watch(
      (state) => state.api,
      (api) => {
        this.apiTxt = JSON.stringify(toOpenAPI(api), null, "\t");
        if (this.monacoModel) {
          this.monacoModel.setValue(this.apiTxt);
        }
      }
    );

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
          const data: OpenAPIObject = JSON.parse(raw);
          if (validate(data)) {
            this.$store.commit("update", toInternal(data));
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
  height: 80vh;
}
</style>
