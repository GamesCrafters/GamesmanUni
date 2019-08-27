<template>
  <Home></Home>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Home from "@/components/app/Home.vue";

@Component({
  components: {
    Home
  }
})
export default class VHome extends Vue {}
</script>

<style scoped lang="scss"></style>
