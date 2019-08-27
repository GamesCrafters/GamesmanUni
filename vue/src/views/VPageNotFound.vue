<template>
  <PageNotFound></PageNotFound>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import PageNotFound from "@/components/app/PageNotFound.vue";

@Component({
  components: {
    PageNotFound
  }
})
export default class VPageNotFound extends Vue {}
</script>

<style scoped lang="scss"></style>
