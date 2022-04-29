<template>
  <Tree
    :forceExpand="path.path === forceExpand.key"
    showDelete
    @delete="deletePath()"
  >
    <template v-slot:label> {{ path.path }} </template>
    <template v-slot:children>
      <Tree
        showEdit
        @save="
          path.path = editValue;
          editValue = '';
          onEdit();
        "
        @cancel="editValue = ''"
        @edit="editValue = path.path"
      >
        <template v-slot:label> Path </template>
        <template v-slot:value>{{ path.path }}</template>
        <template v-slot:editor>
          <v-text-field
            v-model="editValue"
            density="compact"
            variant="outlined"
          ></v-text-field>
        </template>
      </Tree>
      <Tree showAdd @add="addOperation()">
        <template v-slot:label> Operation </template>
        <template v-slot:children>
          <OperationEditor
            v-for="op of path.operations"
            :key="op.method"
            :op="op"
            :path="path"
          /> </template></Tree></template
  ></Tree>
</template>

<script lang="ts">
import { Options } from "vue-class-component";
import BaseEditor from "./BaseEditor";
import OperationEditor from "./OperationEditor.vue";
import Tree from "./Tree.vue";
import { Path } from "../model";

@Options({
  components: {
    Tree,
    OperationEditor
  },
  props: {
    path: Object,
  },
})
export default class PathEditor extends BaseEditor {
  path!: Path;

  deletePath() {
    this.api.paths = this.api.paths.filter((p) => p.path !== this.path.path);
    this.onEdit();
  }

  addOperation() {
    const name = `Operation_${this.path.operations.length + 1}`;
    this.path.operations.push({
      method: "get",
      name,
      responses: [],
      params: [],
      description: "A REST operation",
    });
    this.forceExpand.key = name;
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
