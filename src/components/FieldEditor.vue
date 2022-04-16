<template>
  <v-expansion-panel>
    <v-expansion-panel-title>{{ editedName }}</v-expansion-panel-title>
    <v-expansion-panel-text>
      <v-text-field
        v-model="editedName"
        label="Field name"
        variant="outlined"
        required
        @change="onEdit"
      ></v-text-field>
      <v-combobox
        v-model="editedField.type"
        :items="['string','number']"
        label="Type"        
        variant="outlined"
        dense
      ></v-combobox>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { OpenAPIObject, SchemaObject } from "openapi3-ts";
import { PropType } from "vue";

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
    field: {
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
})
export default class FieldEditor extends Vue {
  api!: OpenAPIObject;
  entity!: string;
  field!: string;

  editedName: string = "";
  editedField: SchemaObject = {};

  onApiChanged(updated: OpenAPIObject) {
    const entity = updated.components!.schemas![this.entity] as SchemaObject;
    this.editedField = entity.properties![this.field];
  }

  async mounted() {
    if (this.entity !== "__new") {
      this.editedName = this.field;
      const entity = this.api.components!.schemas![this.entity] as SchemaObject;
      this.editedField = entity.properties![this.field];
    }
  }

  onEdit() {
    if (this.editedName && this.editedName !== this.field) {
      const entity = this.api.components!.schemas![this.entity] as SchemaObject;
      delete entity.properties![this.field];
      entity.properties![this.editedName!] = this.editedField;
    }
    this.$emit("codeChange", this.api);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
