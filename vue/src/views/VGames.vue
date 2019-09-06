<template>
  <CGames></CGames>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CGames from "@/components/CGames.vue";

@Component({
  components: {
    CGames
  }
})
export default class VGames extends Vue {}
</script>

<style scoped lang="scss"></style>
