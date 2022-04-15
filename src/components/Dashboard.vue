<template>
  <v-toolbar collapse>
    <v-app-bar-nav-icon></v-app-bar-nav-icon>
    <v-toolbar-title>OpenAPI Builder</v-toolbar-title>
  </v-toolbar>
  <CodeEditor :api="api" />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { OpenAPIObject } from "openapi3-ts";
import CodeEditor from "./CodeEditor.vue";

@Options({
  props: {},
  components: {
    CodeEditor,
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
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
