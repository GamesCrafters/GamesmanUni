<template>
  <div id="ttt">inside {{ game.name }}</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { CGame } from "@/classes/CGame";

@Component
export default class ttt extends Vue {
  game: CGame = this.$store.state.currentGame;
}
</script>

<style scoped lang="scss"></style>
