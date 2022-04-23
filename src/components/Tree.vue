<template>
  <div class="tree-box">
    <div
      class="tree-node"
      @mouseenter="showActions = true"
      @mouseleave="showActions = false"
    >
      <v-btn
        size="x-small"
        flat
        :icon="expanded ? 'mdi-chevron-down' : 'mdi-chevron-right'"
        v-if="hasChildren"
        @click="expanded = !expanded"
      >
      </v-btn>
      <span class="tree-node-label"><slot name="label"></slot></span>
      <span class="tree-node-value" v-if="!editMode"
        ><slot name="value"></slot
      ></span>
      <span class="tree-node-editor" v-else><slot name="editor"></slot></span>
      <span class="tree-node-action-box">
        <v-btn
          v-if="showActions && showEdit && !editMode"
          size="x-small"
          flat
          icon="mdi-form-textbox"
          @click="
            editMode = true;
            $emit('edit');
          "
        ></v-btn>
        <v-btn
          v-if="showActions && showAdd"
          size="x-small"
          flat
          icon="mdi-plus"
          @click="expanded=true;$emit('add')"
        ></v-btn>
        <v-btn
          v-if="showActions && showDelete && !editMode"
          size="x-small"
          flat
          icon="mdi-trash-can-outline"
          @click="$emit('delete')"
        ></v-btn>
        <v-btn
          v-if="editMode"
          size="x-small"
          flat
          icon="mdi-check"
          @click="
            editMode = false;
            $emit('save');
          "
        ></v-btn>
        <v-btn
          v-if="editMode"
          size="x-small"
          flat
          icon="mdi-close"
          @click="
            editMode = false;
            $emit('cancel');
          "
        ></v-btn>
      </span>
    </div>
    <div class="subtree-box" v-if="expanded">
      <slot name="children"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    showEdit: Boolean,
    showDelete: Boolean,
    showAdd: Boolean,
  },
})
export default class Tree extends Vue {
  expanded = false;
  showActions = false;
  editMode = false;
  showEdit?: boolean;
  showDelete?: boolean;
  showAdd?: boolean;

  get hasChildren(): boolean {
    return !!this.$slots.children;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.tree-box {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0.5rem;

  div.tree-node {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 2rem;
    padding: 0.2rem;

    .v-btn {
      margin: 0.2rem;
    }

    .tree-node-label {
      margin-right: 0.5rem;
    }
    .tree-node-value {
      font-weight: 600;
    }
    .tree-node-action-box {
      justify-self: flex-end;
    }
    .tree-node-editor {
      flex-grow: 1;
      margin-bottom: -2rem;
    }
  }

  div.subtree-box {
    margin-left: 2rem;
  }
}
</style>
