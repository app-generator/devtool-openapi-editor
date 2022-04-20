<template>
  <v-card>
    <v-card-title v-if="!showNameEditor">
      <v-text>{{ editedName }}</v-text>
      <v-btn size="small" icon @click="showNameEditor = true">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-title v-else>
      <v-text-field
        v-if="showNameEditor"
        v-model="editedName"
        label="Entity Name"
        variant="outlined"
        required
      ></v-text-field>
      <v-btn v-if="showNameEditor" size="small" icon @click="changeName">
        <v-icon>mdi-check</v-icon>
      </v-btn>
    </v-card-title>

    <v-card-text>
      <v-table>
        <thead>
          <tr>
            <th class="text-left">Field Name</th>
            <th class="text-left">Type</th>
            <th>
              <v-btn size="small" icon @click="addField()">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="field in fields" :key="field.name">
            <td>
              <span v-if="field.name !== editedField">{{ field.name }}</span>
              <v-text-field
                v-else
                v-model="field.name"
                label="Field Name"
                variant="outlined"
                required
              ></v-text-field>
            </td>
            <td>
              <span v-if="field.name !== editedField">{{ field.type }}</span>
              <v-combobox
                v-else
                v-model="field.type"
                :items="['string', 'number']"
                label="Type"
                variant="outlined"
                dense
              ></v-combobox>
            </td>
            <td>
              <v-btn
                v-if="editedField !== field.name"
                size="small"
                icon
                @click="editedField = field.name"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn v-else size="small" icon @click="saveField">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { OpenAPIObject, SchemaObject } from "openapi3-ts";

@Options({
  props: {
    entity: {
      type: String,
      required: true,
    },
  },
  components: {},
})
export default class EntityEditor extends Vue {
  entity!: string;
  showNameEditor = false;

  editedName: string = "";
  editedField?: string;

  async mounted() {
    if (this.entity !== "__new") {
      this.editedName = this.entity;
    }
  }

  get api(): OpenAPIObject {
    return this.$store.state.api;
  }

  get entities(): string[] {
    return Object.keys(this.api?.components!.schemas!);
  }

  get fields(): string[] {
    const entity = this.api!.components!.schemas![this.entity] as SchemaObject;
    return Object.keys(entity.properties!);
  }

  get editedEntity(): SchemaObject {
    return this.api!.components!.schemas![this.entity];
  }

  changeName() {
    if (this.editedName && this.editedName !== this.entity) {
      const movedEntity = { ...this.editedEntity };
      delete this.api!.components!.schemas![this.entity];
      this.api!.components!.schemas![this.editedName!] = movedEntity;
      this.save();
    }
    this.showNameEditor = false;
  }

  addField() {
    this.editedEntity.properties!.__new = {};
    this.editedField = "__new";
    this.save();
  }

  save() {
    this.$store.commit("update", this.api);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.v-card {
  margin-top: 1rem;
}
span.title {
  margin-left: 1rem;
}
.v-btn {
  margin: 1rem;
  align-self: flex-start;
}
th:last-child {
  width: 2rem;
}
</style>
