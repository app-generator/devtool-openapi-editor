<template>
  <Tree
    :forceExpand="op.name === forceExpand.key"
    showDelete
    @delete="deleteOperation()"
  >
    <template v-slot:label> {{ op.method }}</template>
    <template v-slot:children>
      <Tree
        showEdit
        @save="
          op.method = editValue;
          editValue = '';
          onEdit();
        "
        @cancel="editValue = ''"
        @edit="editValue = op.method"
      >
        <template v-slot:label> Method </template>
        <template v-slot:value>{{ op.method }}</template>
        <template v-slot:editor>
          <v-select
            v-model="editValue"
            density="compact"
            variant="outlined"
            :items="httpMethods"
          ></v-select>
        </template>
      </Tree>
      <Tree
        showEdit
        @save="
          op.name = editValue;
          editValue = '';
          onEdit();
        "
        @cancel="editValue = ''"
        @edit="editValue = op.name"
      >
        <template v-slot:label> Name </template>
        <template v-slot:value>{{ op.name }}</template>
        <template v-slot:editor>
          <v-text-field
            v-model="editValue"
            density="compact"
            variant="outlined"
          ></v-text-field>
        </template>
      </Tree>
      <Tree showAdd @add="addParam()">
        <template v-slot:label> Parameters </template>
        <template v-slot:children>
          <ParamEditor
            v-for="param of op.params"
            :key="param.name"
            :op="op"
            :param="param"
          />
        </template>
      </Tree>
      <RequestBodyEditor :op="op" />
      <Tree showAdd @add="addResponse()">
        <template v-slot:label> Responses </template>
        <template v-slot:children>
          <ResponseEditor
            v-for="re of op.responses"
            :key="re.name"
            :re="re"
            :op="op"
          />
        </template>
      </Tree> </template
  ></Tree>
</template>

<script lang="ts">
import { Options } from "vue-class-component";
import BaseEditor from "./BaseEditor";
import ParamEditor from "./ParamEditor.vue";
import ResponseEditor from "./ResponseEditor.vue";
import RequestBodyEditor from "./RequestBodyEditor.vue";
import Tree from "./Tree.vue";
import { Operation, Path } from "../model";

@Options({
  components: {
    Tree,
    ParamEditor,
    ResponseEditor,
    RequestBodyEditor
  },
  props: {
    op: Object,
    path: Object,
  },
})
export default class OperationEditor extends BaseEditor {
  op!: Operation;
  path!: Path;

  deleteOperation() {
    this.path.operations = this.path.operations.filter(
      (op) => op.method !== this.op.method
    );
    this.onEdit();
  }

  addParam() {
    const name = `Param_${this.op.params!.length + 1}`;
    this.op.params!.push({
      in: "query",
      name,
      type: "string",
      required: false,
      array: false
    });
    this.onForceExpand(name);
    this.onEdit();
  }

  addResponse() {
    const name = "200";
    this.op.responses!.push({
      name,
      description: "Operation Response",
      content: [],
    });
    this.onForceExpand(name);
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
