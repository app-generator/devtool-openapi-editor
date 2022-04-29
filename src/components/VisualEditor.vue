<template>
  <Tree>
    <template v-slot:label> API Information </template>
    <template v-slot:children>
      <Tree
        showEdit
        @save="
          api.name = editValue;
          editValue = '';
          onEdit();
        "
        @cancel="editValue = ''"
        @edit="editValue = api.name"
      >
        <template v-slot:label> Title </template>
        <template v-slot:value>{{ api.name }}</template>
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
          api.version = editValue;
          editValue = '';
          onEdit();
        "
        @cancel="editValue = ''"
        @edit="editValue = api.version"
      >
        <template v-slot:label> Version </template>
        <template v-slot:value>{{ api.version }}</template>
        <template v-slot:editor>
          <v-text-field
            v-model="editValue"
            density="compact"
            variant="outlined"
          ></v-text-field>
        </template>
      </Tree>
      <Tree showEdit>
        <template v-slot:label> Description </template>
        <template v-slot:value>{{ api.description }}</template>
        <template v-slot:editor>
          <v-text-field
            v-model="editValue"
            density="compact"
            variant="outlined"
          ></v-text-field>
        </template>
      </Tree>
    </template>
  </Tree>
  <Tree showAdd @add="addEntity()">
    <template v-slot:label>Entities</template>
    <template v-slot:children>
      <EntityEditor
        v-for="entity of api.entities"
        :key="entity.name"
        :entity="entity"
      />
    </template>
  </Tree>
  <Tree showAdd @add="addPath()">
    <template v-slot:label>Paths</template>
    <template v-slot:children>
      <PathEditor
        v-for="path of api.paths"
        :key="path.path"
        :path="path"
      /> </template
  ></Tree>
</template>

<script lang="ts">
import { Options } from "vue-class-component";
import BaseEditor from "./BaseEditor";
import EntityEditor from "./EntityEditor.vue";
import PathEditor from "./PathEditor.vue";
import Tree from "./Tree.vue";

@Options({
  components: {
    Tree,
    EntityEditor,
    PathEditor,
  },
})
export default class VisualEditor extends BaseEditor {
  addEntity() {
    const name = `Entity_${this.api.entities.length + 1}`;
    this.api.entities.push({
      fields: [],
      name,
    });
    this.onForceExpand(name);
    this.onEdit();
  }

  addPath() {
    const path = `/path_${this.api.paths.length + 1}`;
    this.api.paths.push({
      path,
      operations: [],
    });
    this.onForceExpand(path);
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
