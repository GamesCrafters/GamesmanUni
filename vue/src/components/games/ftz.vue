<template>
  <div id="ftz">
    <div id="ftz-moves">
      <button id="ftz-move1">take one</button>
      <button id="ftz-move2">take two</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { CGame } from "@/classes/CGame";

@Component
export default class ftz extends Vue {
  game: CGame = this.$store.state.currentGame;
}
</script>

<style scoped lang="scss"></style>
