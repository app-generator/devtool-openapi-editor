<template>
  <v-card>
    <v-card-text><pre><code>{{ apiYaml }}</code></pre></v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { OpenAPIObject } from "openapi3-ts";
import { dump } from "js-yaml";

@Options({
  props: {
    api: undefined,
  },
})
export default class CodeEditor extends Vue {
  api!: OpenAPIObject;

  get apiYaml(): string {
    return dump(this.api);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
