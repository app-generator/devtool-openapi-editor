<template>
  <v-app-bar collapse>
    <v-app-bar-nav-icon />
  </v-app-bar>
  <v-container>
    <v-row>
      <v-col cols="6">
        <VisualEditor/>
      </v-col>
      <v-col cols="6">
        <CodeEditor/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import CodeEditor from "./CodeEditor.vue";
import VisualEditor from "./VisualEditor.vue";

@Options({
  props: {},
  components: {
    CodeEditor,
    VisualEditor,
  },
})
export default class Dashboard extends Vue {}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.v-container {
  margin-top: 5vh;
  width:100%;
}
</style>
