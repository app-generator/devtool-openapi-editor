<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-title>API Information</v-expansion-panel-title>
      <v-expansion-panel-text>
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
      </v-expansion-panel-text>
    </v-expansion-panel>
    <v-expansion-panel>
      <v-expansion-panel-title>Entities</v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-btn size="small" icon @click="addEntity()">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-expansion-panels class="entities">
          <EntityEditor
            :api="api"
            v-for="entity of entities"
            :key="entity"
            :entity="entity"
          />
        </v-expansion-panels>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { OpenAPIObject } from "openapi3-ts";
import { PropType } from "vue";
import EntityEditor from "./EntityEditor.vue";

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
  components: {
    EntityEditor,
  },
})
export default class VisualEditor extends Vue {
  api!: OpenAPIObject;
  displayed = "basic";

  onApiChanged(updated: OpenAPIObject) {
    console.log(updated);
  }

  get entities(): string[] {
    return Object.keys(this.api.components!.schemas!);
  }

  addEntity() {
    this.api.components!.schemas!.__new = {
      type: "object",
      properties: {},
    };
  }

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
span.title {
  margin-left: 1rem;
}
.entities {
  margin-top: 1rem;
}
</style>
