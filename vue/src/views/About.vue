<template>
  <AppAbout></AppAbout>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AppAbout from "@/components/AppAbout.vue";

@Component({
  components: {
    AppAbout
  }
})
export default class About extends Vue {}
</script>

<style scoped lang="scss"></style>
