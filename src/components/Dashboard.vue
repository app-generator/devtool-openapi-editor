<template>
  <v-app-bar collapse>
    <v-app-bar-nav-icon />
  </v-app-bar>
  <v-container>
    <v-row>
      <v-col cols="6">
        <VisualEditor :api="api" @codeChange="onEdit" />
      </v-col>
      <v-col cols="6">
        <CodeEditor :api="api" @codeChange="onEdit" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { OpenAPIObject } from "openapi3-ts";
import CodeEditor from "./CodeEditor.vue";
import VisualEditor from "./VisualEditor.vue";

@Options({
  props: {},
  components: {
    CodeEditor,
    VisualEditor,
  },
})
export default class Dashboard extends Vue {
  api: OpenAPIObject = {
    openapi: "3.0.0",
    info: {
      title: "My New API",
      version: "1.0.0",
    },
    paths: {},
    components: {
      schemas: {},
      securitySchemes: {},
    },
  };

  onEdit(event: any) {
    this.api = event;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.v-container {
  margin-top: 5vh;
  height: 90vh;
  width: 100vw;
  max-width: none;
  .v-row {
    height: 100%;
    .v-col {
      height: 100%;
    }
  }
}
</style>
