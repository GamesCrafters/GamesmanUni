<template>
  <CPageNotFound></CPageNotFound>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CPageNotFound from "@/components/CPageNotFound.vue";

@Component({
  components: {
    CPageNotFound
  }
})
export default class VPageNotFound extends Vue {}
</script>

<style scoped lang="scss"></style>
