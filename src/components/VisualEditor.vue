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
      <Tree v-for="entity of api.entities" :key="entity.name">
        <template v-slot:label> {{ entity.name }} </template>
        <template v-slot:children>
          <Tree
            showEdit
            @save="
              entity.name = editValue;
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
          <Tree showAdd @add="addField(entity)">
            <template v-slot:label> Fields </template>
            <template v-slot:children>
              <Tree v-for="field of entity.fields" :key="field.name">
                <template v-slot:label>{{ field.name }}</template>
                <template v-slot:children>
                  <Tree
                    showEdit
                    @save="
                      field.name = editValue;
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
                      field.type = editValue;
                      editValue = '';
                      onEdit();
                    "
                    @cancel="editValue = ''"
                    @edit="editValue = field.name"
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
import { Options, Vue } from "vue-class-component";
import Tree from "./Tree.vue";
import _ from "lodash";
import { API, Entity, TypeMapping } from "../model";

@Options({
  components: {
    Tree,
  },
})
export default class VisualEditor extends Vue {
  editValue: any = "";

  get api(): API {
    return this.$store.state.api;
  }

  onEdit() {
    this.$store.commit("update", _.cloneDeep(this.api));
  }

  addEntity() {
    this.api.entities.push({
      fields: [],
      name: `Entity_${this.api.entities.length + 1}`,
    });
    this.onEdit();
  }

  addField(entity: Entity) {
    entity.fields.push({
      name: `Field_${entity.fields.length + 1}`,
      type: "string",
    });
    this.onEdit();
  }

  get fieldTypes(): string[] {
    return [
      ...TypeMapping.map((m) => m.internalType),
      ...this.api.entities.map((e) => e.name),
    ];
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
