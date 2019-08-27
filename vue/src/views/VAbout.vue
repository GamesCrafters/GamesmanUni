<template>
  <About></About>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import About from "@/components/app/About.vue";

@Component({
  components: {
    About
  }
})
export default class VAbout extends Vue {}
</script>

<style scoped lang="scss"></style>
