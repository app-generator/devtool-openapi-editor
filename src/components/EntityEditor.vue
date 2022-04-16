<template>
  <v-expansion-panel>
    <v-expansion-panel-title>{{ editedName }}</v-expansion-panel-title>
    <v-expansion-panel-text>
      <v-text-field
        v-model="editedName"
        label="Entity name"
        variant="outlined"
        required
        @change="onEdit"
      ></v-text-field>
      <v-banner one line>
        <v-banner-text>Fields</v-banner-text>
        <v-banner-actions>
          <v-btn size="small" icon @click="addField()">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-banner-actions>
      </v-banner>
      <v-expansion-panels>
        <FieldEditor
          v-for="field of fields"
          :api="api"
          :entity="entity"
          :field="field"
          :key="field"
          @codeChange="onEdit()"
        />
      </v-expansion-panels>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { OpenAPIObject, SchemaObject } from "openapi3-ts";
import { PropType } from "vue";
import FieldEditor from "./FieldEditor.vue";

@Options({
  props: {
    api: {
      type: Object as PropType<OpenAPIObject>,
      required: true,
    },
    entity: {
      type: String,
      required: true,
    },
    watch: {
      api: {
        handler: "onApiChanged",
        deep: true,
        immediate: true,
      },
    },
  },
  emits: ["codeChange"],
  components: {
    FieldEditor,
  },
})
export default class EntityEditor extends Vue {
  api!: OpenAPIObject;
  entity!: string;

  editedName: string = "";
  editedEntity: SchemaObject = {};

  get entities(): string[] {
    return Object.keys(this.api.components!.schemas!);
  }

  get fields(): string[] {
    if (this.editedEntity.properties) {
      return Object.keys(this.editedEntity.properties!);
    }
    return [];
  }

  onApiChanged(updated: OpenAPIObject) {
    this.editedEntity = updated.components!.schemas![this.entity];
  }

  async mounted() {
    if (this.entity !== "__new") {
      this.editedName = this.entity;
    }
    this.editedEntity = this.api.components!.schemas![this.entity];
  }

  onEdit() {
    if (this.editedName && this.editedName !== this.entity) {
      delete this.api.components!.schemas![this.entity];
      this.api.components!.schemas![this.editedName!] = this.editedEntity;
    }
    this.$emit("codeChange", this.api);
  }

  addField() {
    this.editedEntity.properties!.__new = {};
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.v-card {
  margin-top: 1rem;
}
span.title {
  margin-left: 1rem;
}
</style>
