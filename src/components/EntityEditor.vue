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
import FieldEditor from "./FieldEditor.vue";

@Options({
  props: {
    entity: {
      type: String,
      required: true,
    },
  },
  components: {
    FieldEditor,
  },
})
export default class EntityEditor extends Vue {
  entity!: string;

  editedName: string = "";
  editedEntity: SchemaObject = { properties: {} };
  async mounted() {
    if (this.entity !== "__new") {
      this.editedName = this.entity;
    }
    this.editedEntity = this.api.components!.schemas![this.entity]!;
  }

  get api(): OpenAPIObject {
    return this.$store.state.api;
  }

  get entities(): string[] {
    return Object.keys(this.api?.components!.schemas!);
  }

  get fields(): string[] {
    const entity = this.api!.components!.schemas![this.entity] as SchemaObject;
    return Object.keys(entity.properties!);
  }

  onEdit() {
    if (this.editedName && this.editedName !== this.entity) {
      delete this.api!.components!.schemas![this.entity];
    }
    this.api!.components!.schemas![this.editedName!] = this.editedEntity;
    this.$store.commit("update", this.api);
  }

  addField() {
    this.editedEntity.properties!.__new = {};
    this.onEdit();
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
