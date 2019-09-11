<template>
  <div id="app-game">
    <h2 id="app-game-title">{{ game.name }}</h2>
    <p id="app-game-round">Round {{ game.round.roundNumber }}</p>
    <p id="app-game-player">{{ game.turnNames[game.round.turnNumber] }} Turn</p>
    <button id="app-game-restart" @click="restarted">Restart</button>
    <component :is="game.id.toUpperCase()"></component>
    <p id="app-game-positionValue">
      Position Value: {{ game.round.positionValue }}
    </p>
    <p id="app-game-remoteness">Remoteness: {{ game.round.remoteness }}</p>
    <GameVisualizer></GameVisualizer>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import FTZ from "@/components/games/FTZ.vue";
import GameVisualizer from "@/components/GameVisualizer.vue";

@Component({
  components: {
    FTZ,
    GameVisualizer
  }
})
export default class CGame extends Vue {
  get game() {
    return this.$store.getters.game;
  }

  created() {
    this.$store.dispatch("startNewGame", this.$route.params.gameId);
  }

  restarted() {
    this.$store.dispatch("startNewGame", this.$route.params.gameId);
  }
}
</script>
