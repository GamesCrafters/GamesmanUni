<template>
  <CGame></CGame>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CGame from "@/components/CGame.vue";

@Component({
  components: {
    CGame
  }
})
export default class VGame extends Vue {}
</script>

<style scoped lang="scss"></style>
