<template>
  <v-app>
    <Dashboard />
  </v-app>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Dashboard from "./components/Dashboard.vue";

@Options({
  components: {
    Dashboard,
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@0,200;0,300;0,400;0,700;0,900;1,300&display=swap");
@import url("https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css");
html {
  overflow-y: auto;
}
#app {
  font-family: "Exo 2", sans-serif;
}
</style>
