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
      <Tree
        v-for="entity of api.entities"
        :key="entity.name"
        showDelete
        @delete="deleteEntity(entity.name)"
      >
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
              <Tree
                v-for="field of entity.fields"
                :key="field.name"
                showDelete
                @delete="deleteField(entity, field.name)"
              >
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
                  <Tree
                    showEdit
                    @save="
                      field.required = editValue;
                      editValue = '';
                      onEdit();
                    "
                    @cancel="editValue = ''"
                    @edit="editValue = field.required"
                  >
                    <template v-slot:label> Required </template>
                    <template v-slot:value>{{ field.required }}</template>
                    <template v-slot:editor>
                      <v-checkbox
                        v-model="editValue"
                        density="compact"
                        variant="outlined"
                      ></v-checkbox>
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
  <Tree showAdd @add="addPath()">
    <template v-slot:label>Paths</template>
    <template v-slot:children>
      <Tree
        v-for="path of api.paths"
        :key="path.path"
        showDelete
        @delete="deletePath(path.path)"
      >
        <template v-slot:label> {{ path.path }} </template>
        <template v-slot:children>
          <Tree
            showEdit
            @save="
              path.path = editValue;
              editValue = '';
              onEdit();
            "
            @cancel="editValue = ''"
            @edit="editValue = path.path"
          >
            <template v-slot:label> Path </template>
            <template v-slot:value>{{ path.path }}</template>
            <template v-slot:editor>
              <v-text-field
                v-model="editValue"
                density="compact"
                variant="outlined"
              ></v-text-field>
            </template>
          </Tree>
          <Tree showAdd @add="addOperation(path)">
            <template v-slot:label> Operation </template>
            <template v-slot:children>
              <Tree
                v-for="op of path.operations"
                :key="op.method"
                showDelete
                @delete="deleteOperation(path, op.method)"
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
                </template>
              </Tree>
            </template>
          </Tree>
        </template>
      </Tree> </template
  ></Tree>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Tree from "./Tree.vue";
import _ from "lodash";
import {
  API,
  Entity,
  HttpCode,
  HttpMethod,
  Named,
  Operation,
  Path,
  TypeMapping,
} from "../model";

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

  deleteEntity(name: string) {
    this.api.entities = this.api.entities.filter((e) => e.name !== name);
    this.onEdit();
  }

  addField(entity: Entity) {
    entity.fields.push({
      name: `Field_${entity.fields.length + 1}`,
      type: "string",
      required: false,
    });
    this.onEdit();
  }

  deleteField(entity: Entity, name: string) {
    entity.fields = entity.fields.filter((f) => f.name !== name);
    this.onEdit();
  }

  addPath() {
    this.api.paths.push({
      path: `/path_${this.api.paths.length + 1}`,
      operations: [],
    });
    this.onEdit();
  }

  deletePath(path: string) {
    this.api.paths = this.api.paths.filter((p) => p.path !== path);
    this.onEdit();
  }

  addOperation(path: Path) {
    path.operations.push({
      method: "get",
      name: `Operation_${path.operations.length + 1}`,
      responses: [
        {
          name: "200",
          description: "Default response",
          content: [
            {
              mime: "application/json",
              type: "string",
            },
          ],
        },
      ],
      params: [],
      description: "A REST operation",
    });
    this.onEdit();
  }

  deleteOperation(path: Path, method: HttpMethod) {
    path.operations = path.operations.filter((op) => op.method !== method);
    this.onEdit();
  }

  addParam(op: Operation) {
    op.params!.push({
      in: "query",
      name: `Param_${op.params!.length + 1}`,
      type: "string",
    });
    this.onEdit();
  }

  deleteParam(op: Operation, name: string) {
    op.params = op.params?.filter((p) => p.name !== name);
    this.onEdit();
  }

  get fieldTypes(): string[] {
    return [
      ...TypeMapping.map((m) => m.internalType),
      ...this.api.entities.map((e) => e.name),
    ];
  }

  get httpMethods(): string[] {
    return ["get", "post", "put", "patch", "delete"];
  }

  get httpCodes(): Named[] {
    return HttpCode;
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
