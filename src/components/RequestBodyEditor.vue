<template>
  <Tree
    :showAdd="!op.requestBody"
    :showDelete="!!op.requestBody"
    @add="addRequestBody()"
    @delete="deleteRequestBody()"
  >
    <template v-slot:label> Request Body </template>
    <template v-slot:children>
      <Tree
        v-if="!!op.requestBody"
        showEdit
        @save="
          op.requestBody.description = editValue;
          editValue = '';
          onEdit();
        "
        @cancel="editValue = ''"
        @edit="editValue = op.requestBody.description"
      >
        <template v-slot:label> Description </template>
        <template v-slot:value>{{ op.requestBody.description }}</template>
        <template v-slot:editor>
          <v-text-field
            v-model="editValue"
            density="compact"
            variant="outlined"
          ></v-text-field>
        </template>
      </Tree>
      <Tree
        v-if="!!op.requestBody"
        showAdd
        @add="addRequestBodyContent()"
      >
        <template v-slot:label> Content </template>
        <template v-slot:children>
          <Tree
            v-for="c of op.requestBody.content"
            :forceExpand="c.mime === forceExpand.key"
            :key="c.mime"
            showDelete
            @delete="deleteRequestBodyContent(c.mime)"
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
import { Operation } from "../model";

@Options({
  components: {
    Tree,
  },
  props: {
    op: Object,
  },
})
export default class RequestBodyEditor extends BaseEditor {
  op!: Operation;

  addRequestBody() {
    this.op.requestBody = {
      description: "Request body",
      content: [],
    };
    this.onEdit();
  }

  deleteRequestBody() {
    this.op.requestBody = undefined;
    this.onEdit();
  }

  addRequestBodyContent() {
    const mime = "application/json";
    this.op.requestBody!.content!.push({
      mime,
      type: "string",
    });
    this.onForceExpand(mime);
    this.onEdit();
  }

  deleteRequestBodyContent(mime: string) {
    this.op.requestBody!.content = this.op.requestBody!.content?.filter(
      (p) => p.mime !== mime
    );
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
