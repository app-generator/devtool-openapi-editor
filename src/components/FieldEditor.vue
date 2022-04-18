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
        v-if="editedField"
        v-model="editedField.type"
        :items="['string', 'number']"
        label="Type"
        @change="onEdit"
        variant="outlined"
        dense
      ></v-combobox>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { OpenAPIObject, SchemaObject } from "openapi3-ts";

@Options({
  props: {
    entity: {
      type: String,
      required: true,
    },
    field: {
      type: String,
      required: true,
    },
  },
})
export default class FieldEditor extends Vue {
  entity!: string;
  field!: string;

  editedName: string = "";
  editedField: SchemaObject = {};

  async mounted() {
    if (this.field !== "__new") {
      this.editedName = this.field;
    }
    const entity = this.api!.components!.schemas![this.entity] as SchemaObject;
    return entity.properties![this.field];
  }

  get api(): OpenAPIObject {
    return this.$store.state.api;
  }

  onEdit() {
    const entity = this.api!.components!.schemas![this.entity] as SchemaObject;
    if (this.editedName && this.editedName !== this.field) {
      delete entity.properties![this.field];
    }
    entity.properties![this.editedName!] = this.editedField;

    this.$store.commit("update", this.api);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
