<template>
  <div id="app-game-board-default"></div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { CRound } from "@/classes/CRound";

@Component
export default class GDefault extends Vue {
  get game() {
    return this.$store.getters.game;
  }

  runMove(move: string): void {
    this.$store.dispatch("runMove", move);
  }
}
</script>
