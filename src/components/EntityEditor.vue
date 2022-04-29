<template>
  <Tree
    showDelete
    :forceExpand="entity.name === forceExpand.key"
    @delete="deleteEntity()"
  >
    <template v-slot:label> {{ entity.name }} </template>
    <template v-slot:children>
      <Tree
        showEdit
        @save="
          entity.name = editValue;
          onForceExpand(entity.name);
          editValue = '';
          onEdit();
        "
        @cancel="editValue = ''"
        @edit="editValue = entity.name"
      >
        <template v-slot:label> Entity Name: </template>
        <template v-slot:value>{{ entity.name }}</template>
        <template v-slot:editor>
          <v-text-field
            v-model="editValue"
            density="compact"
            variant="outlined"
          ></v-text-field>
        </template>
      </Tree>
      <Tree showAdd @add="addField()">
        <template v-slot:label> Fields </template>
        <template v-slot:children>
          <Tree
            v-for="field of entity.fields"
            :key="field.name"
            :forceExpand="field.name === forceExpand.key"
            showDelete
            @delete="deleteField(field.name)"
          >
            <template v-slot:label>{{ field.name }}</template>
            <template v-slot:children>
              <Tree
                showEdit
                @save="
                  field.name = editValue;
                  onForceExpand(field.name);
                  editValue = '';
                  onEdit();
                "
                @cancel="editValue = ''"
                @edit="editValue = field.name"
              >
                <template v-slot:label> Name </template>
                <template v-slot:value>{{ field.name }}</template>
                <template v-slot:editor>
                  <v-text-field
                    v-model="editValue"
                    density="compact"
                    variant="outlined"
                  ></v-text-field>
                </template>
              </Tree>
              <Tree
                showEdit
                @save="
                  field.array = editValue;
                  editValue = '';
                  onEdit();
                "
                @cancel="editValue = ''"
                @edit="editValue = field.array"
              >
                <template v-slot:label> Array </template>
                <template v-slot:value>{{ field.array }}</template>
                <template v-slot:editor>
                  <v-checkbox
                    v-model="editValue"
                    density="compact"
                    variant="outlined"
                  ></v-checkbox>
                </template>
              </Tree>
              <Tree
                showEdit
                @save="
                  field.type = editValue;
                  editValue = '';
                  onEdit();
                "
                @cancel="editValue = ''"
                @edit="editValue = field.type"
              >
                <template v-slot:label> Type </template>
                <template v-slot:value>{{ field.type }}</template>
                <template v-slot:editor>
                  <v-select
                    v-model="editValue"
                    density="compact"
                    variant="outlined"
                    :items="fieldTypes"
                  ></v-select>
                </template>
              </Tree>
              <Tree
                showEdit
                @save="
                  field.required = editValue;
                  editValue = '';
                  onEdit();
                "
                @cancel="editValue = ''"
                @edit="editValue = field.required"
              >
                <template v-slot:label> Required </template>
                <template v-slot:value>{{ field.required }}</template>
                <template v-slot:editor>
                  <v-checkbox
                    v-model="editValue"
                    density="compact"
                    variant="outlined"
                  ></v-checkbox>
                </template>
              </Tree>
            </template>
          </Tree>
        </template>
      </Tree>
    </template>
  </Tree>
</template>

<script lang="ts">
import { Options } from "vue-class-component";
import BaseEditor from "./BaseEditor";
import Tree from "./Tree.vue";
import { Entity } from "../model";

@Options({
  components: {
    Tree,
  },
  props: {
    entity: Object,
  },
})
export default class EntityEditor extends BaseEditor {
  entity!: Entity;

  deleteEntity() {
    this.api.entities = this.api.entities.filter(
      (e) => e.name !== this.entity.name
    );
    this.onEdit();
  }

  addField() {
    const name = `Field_${this.entity.fields.length + 1}`;
    this.entity.fields.push({
      name,
      type: "string",
      required: false,
      array: false
    });
    this.onForceExpand(name);
    this.onEdit();
  }

  deleteField(name: string) {
    this.entity.fields = this.entity.fields.filter((f) => f.name !== name);
    this.onEdit();
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.v-btn {
  margin-left: 1rem;
}
</style>
