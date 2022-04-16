<template>
  <v-card>
    <v-card-title>
      <v-btn size="small" icon @click="displayed = 'basic'">
        <v-icon>{{
          displayed === "basic" ? "mdi-chevron-down" : "mdi-chevron-right"
        }}</v-icon>
      </v-btn>
      <span class="title">API Information</span></v-card-title
    >
    <v-card-text v-show="displayed === 'basic'">
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="api.info.title"
            label="API Title"
            variant="outlined"
            required
            @change="onEdit"
          ></v-text-field>
          <v-text-field
            v-model="api.info.version"
            label="Version"
            variant="outlined"
            required
            @change="onEdit"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <v-card>
    <v-card-title>
      <v-btn size="small" icon @click="displayed = 'entities'">
        <v-icon>{{
          displayed === "entities" ? "mdi-chevron-down" : "mdi-chevron-right"
        }}</v-icon>
      </v-btn>
      <span class="title">Entities</span></v-card-title
    >
    <v-card-text v-show="displayed === 'entities'">
      Here be dragons
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { OpenAPIObject } from "openapi3-ts";

@Options({
  props: {
    api: undefined,
  },
  emits: ["codeChange"],
})
export default class VisualEditor extends Vue {
  api!: OpenAPIObject;
  displayed = "basic";

  onEdit() {
    this.$emit("codeChange", this.api);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.v-card {
  margin-bottom: 1rem;
}
span.title{
  margin-left:1rem;
}
</style>
