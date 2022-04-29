<template>
  <Tree
    :forceExpand="re.name === forceExpand.key"
    showDelete
    @delete="deleteResponse()"
  >
    <template v-slot:label> {{ re.name }}</template>
    <template v-slot:children>
      <Tree
        showEdit
        @save="
          re.name = editValue;
          onForceExpand(re.name);
          editValue = '';
          onEdit();
        "
        @cancel="editValue = ''"
        @edit="editValue = re.name"
      >
        <template v-slot:label> Response Code </template>
        <template v-slot:value>{{ re.name }}</template>
        <template v-slot:editor>
          <v-select
            v-model="editValue"
            density="compact"
            variant="outlined"
            :items="httpCodes"
          ></v-select>
        </template>
      </Tree>
      <Tree showAdd @add="addResponseContent()">
        <template v-slot:label> Content </template>
        <template v-slot:children>
          <Tree
            v-for="c of re.content"
            :forceExpand="c.mime === forceExpand.key"
            :key="c.mime"
            showDelete
            @delete="deleteResponseContent(c.mime)"
          >
            <template v-slot:label> {{ c.mime }}</template>
            <template v-slot:children>
              <Tree
                showEdit
                @save="
                  c.mime = editValue;
                  editValue = '';
                  onEdit();
                "
                @cancel="editValue = ''"
                @edit="editValue = c.mime"
              >
                <template v-slot:label> Mime Type </template>
                <template v-slot:value>{{ c.mime }}</template>
                <template v-slot:editor>
                  <v-select
                    v-model="editValue"
                    density="compact"
                    variant="outlined"
                    :items="mimeTypes"
                  ></v-select>
                </template>
              </Tree>
              <Tree
                showEdit
                @save="
                  c.array = editValue;
                  editValue = '';
                  onEdit();
                "
                @cancel="editValue = ''"
                @edit="editValue = c.array"
              >
                <template v-slot:label> Array </template>
                <template v-slot:value>{{ c.array }}</template>
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
                  c.type = editValue;
                  editValue = '';
                  onEdit();
                "
                @cancel="editValue = ''"
                @edit="editValue = c.type"
              >
                <template v-slot:label> Type </template>
                <template v-slot:value>{{ c.type }}</template>
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
      </Tree>
    </template>
  </Tree>
</template>

<script lang="ts">
import { Options } from "vue-class-component";
import BaseEditor from "./BaseEditor";
import Tree from "./Tree.vue";
import { Operation, Response } from "../model";

@Options({
  components: {
    Tree,
  },
  props: {
    op: Object,
    re: Object,
  },
})
export default class ResponseEditor extends BaseEditor {
  op!: Operation;
  re!: Response;

  deleteResponse() {
    this.op.responses = this.op.responses?.filter(
      (p) => p.name !== this.re.name
    );
    this.onEdit();
  }

  addResponseContent() {
    const mime = "application/json";
    this.re.content!.push({
      mime,
      type: "string",
      array: false
    });
    this.onForceExpand(mime);
    this.onEdit();
  }

  deleteResponseContent(mime: string) {
    this.re.content = this.re.content?.filter((p) => p.mime !== mime);
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
