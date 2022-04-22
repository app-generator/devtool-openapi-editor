<template>
  <Tree>
    API Information
    <template v-slot:children>
      <Tree>
        <span
          >Title: <strong>{{ api.name }}</strong></span
        >
      </Tree>
      <Tree>
        <span
          >Version: <strong>{{ api.version }}</strong></span
        >
      </Tree>
      <Tree>
        <span
          >Description: <strong>{{ api.description }}</strong></span
        >
      </Tree>
    </template>
  </Tree>
  <Tree>
    Entities
    <template v-slot:children>
      <Tree v-for="entity of api.entities" :key="entity.name">
        {{ entity.name }}
        <template v-slot:children>
          <Tree v-for="field of entity.fields" :key="field.name">
            {{ field.name }}
            <template v-slot:children>
              <Tree>
                <span
                  >Name: <strong>{{ field.name }}</strong></span
                >
              </Tree>
              <Tree>
                <span
                  >Type: <strong>{{ field.type }}</strong></span
                >
              </Tree>
            </template>
          </Tree>
        </template>
      </Tree>
    </template>
  </Tree>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import EntityEditor from "./EntityEditor.vue";
import Tree from "./Tree.vue";
import _ from "lodash";
import { API } from "./model";

@Options({
  components: {
    Tree,
    EntityEditor,
  },
})
export default class VisualEditor extends Vue {
  get api(): API {
    return this.$store.state.api;
  }

  onEdit() {
    this.$store.commit("update", _.cloneDeep(this.api));
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.v-card {
  margin-bottom: 1rem;
}
span.title {
  margin-left: 1rem;
}
.entities {
  margin-top: 1rem;
}
.add-entity {
  margin-top: 1rem;
  margin-bottom: 1rem;
}
.v-btn {
  margin-left: 1rem;
}
</style>
