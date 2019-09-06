<template>
  <CAbout></CAbout>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CAbout from "@/components/CAbout.vue";

@Component({
  components: {
    CAbout
  }
})
export default class VAbout extends Vue {}
</script>

<style scoped lang="scss"></style>
