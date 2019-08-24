<template>
  <AppPageNotFound></AppPageNotFound>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AppPageNotFound from "@/components/AppPageNotFound.vue";

@Component({
  components: {
    AppPageNotFound
  }
})
export default class PageNotFound extends Vue {}
</script>

<style scoped lang="scss"></style>
