<template>
  <v-container>
    <v-row class="top-buttons">
      <v-btn @click="downloadJson()">Download JSON</v-btn>
      <v-btn @click="downloadYaml()">Download YAML</v-btn>
    </v-row>
    <v-row>
      <v-col cols="6">
        <VisualEditor />
      </v-col>
      <v-col cols="6">
        <CodeEditor />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { API, toOpenAPI } from "@/model";
import { Options, Vue } from "vue-class-component";
import CodeEditor from "./CodeEditor.vue";
import VisualEditor from "./VisualEditor.vue";
import yaml from "js-yaml";

@Options({
  props: {},
  components: {
    CodeEditor,
    VisualEditor,
  },
})
export default class Dashboard extends Vue {
  get api(): API {
    return this.$store.state.api;
  }

  downloadJson() {
    this.download(
      `${this.api.name}.json`,
      JSON.stringify(toOpenAPI(this.api),null,"\t"),
      "application/json"
    );
  }

  downloadYaml() {
    this.download(
      `${this.api.name}.yaml`,
      yaml.dump(toOpenAPI(this.api)),
      "application/yaml"
    );
  }

  private download(filename: string, text: string, mime: string) {
    var element = document.createElement("a");
    element.setAttribute(
      "href",
      `data:${mime},${encodeURIComponent(text)}`
    );
    element.setAttribute("download", filename);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.v-container {
  margin-top: 5vh;
  width: 100%;
  display:flex;
  flex-direction: column;
}
.top-buttons {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;

  button{
    margin:2rem;
  }
}
</style>
