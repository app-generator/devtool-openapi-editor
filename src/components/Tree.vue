<template>
  <div class="tree-box">
    <div class="tree-node">
      <v-btn
        size="x-small"
        flat
        :icon="expanded ? 'mdi-chevron-down' : 'mdi-chevron-right'"
        v-if="hasChildren"
        @click="expanded = !expanded"
      >
      </v-btn>
      <slot></slot>
    </div>
    <div class="subtree-box" v-if="expanded">
      <slot name="children"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({})
export default class Tree extends Vue {
  expanded = false;
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
  }

  div.subtree-box {
    margin-left: 2rem;
  }
}
</style>
