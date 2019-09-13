<template>
  <div id="app-game">
    <h2 id="app-game-title">{{ game.name }}</h2>
    <div id="app-game-main">
      <div id="app-game-main-left">
        <div id="app-game-main-left-row1">
          <div id="app-game-main-left-row1-col1">
            <p id="app-game-roundNumber">Move #{{ game.round.roundNumber }}</p>
            <p id="app-game-positionValue">
              Prediction: {{ game.turnNames[game.round.turnNumber] }} should
              {{ game.round.positionValue }}.
            </p>
          </div>
          <div id="app-game-main-left-row1-col2">
            <button id="app-game-restart" @click="restarted">Restart</button>
          </div>
          <div id="app-game-main-left-row1-col3">
            <p id="app-game-turnName">
              {{ game.turnNames[game.round.turnNumber] }}
            </p>
            <p id="app-game-remoteness">
              Remoteness: {{ game.round.remoteness }}
            </p>
          </div>
        </div>
        <div id="app-game-main-left-row2">
          <component :is="'G' + game.id"></component>
        </div>
      </div>
      <div id="app-game-main-right">
        <GameVisualValueHistory></GameVisualValueHistory>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import G1020 from "@/components/games/G1020.vue";
import GameVisualValueHistory from "@/components/GameVisualValueHistory.vue";

@Component({
  components: {
    G1020,
    GameVisualValueHistory
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
