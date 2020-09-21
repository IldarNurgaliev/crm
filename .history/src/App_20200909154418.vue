<template>
  <div id="app">
    <component :is="layout"></component>
  </div>
</template>

<script>
import EmptyLayout from "@/layouts/EmptyLayout";
import MainLayout from "@/layouts/MainLayout";

export default {
  name: "App",
  data: () => ({}),
  components: {
    EmptyLayout,
    MainLayout
  },
  computed: {
    // eslint-disable-next-line vue/return-in-computed-property
    layout() {
      return (this.$route.meta.layout || "empty") + "-layout";
    }
  }
};
</script>
<style lang="scss">
@import "~materialize-css/dist/css/materialize.min.css";
@import "assets/index.css";
</style>
