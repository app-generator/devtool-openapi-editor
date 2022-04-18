<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-title>API Information</v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="api.info.title"
              label="API Title"
              variant="outlined"
              required
              @change="onEdit"
            ></v-text-field>
            <v-text-field
              v-model="api.info.version"
              label="Version"
              variant="outlined"
              required
              @change="onEdit"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-expansion-panel-text>
    </v-expansion-panel>
    <v-expansion-panel>
      <v-expansion-panel-title>Entities</v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-row class="add-entity">
          <v-btn size="small" v-if="showNew" icon @click="addEntity()">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <v-text-field
            v-if="!showNew"
            v-model="newEntityName"
            label="Entity Name"
            variant="outlined"
            required
          ></v-text-field>
          <v-btn size="small" v-if="!showNew" icon @click="saveNewEntity()">
            <v-icon>mdi-check</v-icon>
          </v-btn>
        </v-row>
        <v-expansion-panels class="entities">
          <EntityEditor
            v-for="entity of entities"
            :key="entity"
            :entity="entity"
          />
        </v-expansion-panels>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { OpenAPIObject } from "openapi3-ts";
import EntityEditor from "./EntityEditor.vue";
import _ from "lodash";

@Options({
  components: {
    EntityEditor,
  },
})
export default class VisualEditor extends Vue {
  displayed = "basic";
  showNew: boolean = true;
  newEntityName?: string;

  get api(): OpenAPIObject {
    return this.$store.state.api;
  }

  get entities(): string[] {
    return Object.keys(this.api?.components!.schemas!);
  }

  saveNewEntity() {
    this.api!.components!.schemas![this.newEntityName!] = {
      type: "object",
      properties: {},
    };
    this.onEdit();
    this.showNew = true;
  }

  addEntity() {
    this.showNew = false;
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
.add-entity{
  margin-top:1rem;
  margin-bottom:1rem;
}
</style>
