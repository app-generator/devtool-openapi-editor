<template>
  <Tree
    :forceExpand="param.name === forceExpand.key"
    showDelete
    @delete="deleteParam()"
  >
    <template v-slot:label> {{ param.name }}</template>
    <template v-slot:children>
      <Tree
        showEdit
        @save="
          param.name = editValue;
          onForceExpand(param.name);
          editValue = '';
          onEdit();
        "
        @cancel="editValue = ''"
        @edit="editValue = param.name"
      >
        <template v-slot:label> Name </template>
        <template v-slot:value>{{ param.name }}</template>
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
          param.in = editValue;
          editValue = '';
          onEdit();
        "
        @cancel="editValue = ''"
        @edit="editValue = param.in"
      >
        <template v-slot:label> In </template>
        <template v-slot:value>{{ param.in }}</template>
        <template v-slot:editor>
          <v-select
            v-model="editValue"
            density="compact"
            variant="outlined"
            :items="paramInOptions"
          ></v-select>
        </template>
      </Tree>
      <Tree
        showEdit
        @save="
          param.type = editValue;
          editValue = '';
          onEdit();
        "
        @cancel="editValue = ''"
        @edit="editValue = param.type"
      >
        <template v-slot:label> Type </template>
        <template v-slot:value>{{ param.type }}</template>
        <template v-slot:editor>
          <v-select
            v-model="editValue"
            density="compact"
            variant="outlined"
            :items="fieldTypes"
          ></v-select>
        </template>
      </Tree>
    </template>
  </Tree>
</template>

<script lang="ts">
import { Options } from "vue-class-component";
import BaseEditor from "./BaseEditor";
import Tree from "./Tree.vue";
import { Operation, Param } from "../model";

@Options({
  components: {
    Tree,
  },
  props: {
    op: Object,
    param: Object,
  },
})
export default class ParamEditor extends BaseEditor {
  param!: Param;
  op!: Operation;

  deleteParam() {
    this.op.params = this.op.params?.filter((p) => p.name !== this.param.name);
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
