<template>
  <div id="app-game">
    <h2 id="app-game-title">{{ currentGame.name }}</h2>
    <p id="app-game-round">Round: {{ currentGame.round.roundNumber }}</p>
    <p id="app-game-player">{{ currentGame.round.turnName }} Turn</p>
    <button id="app-game-restart" @click="restarted">Restart</button>
    <component :is="'C' + currentGame.id.toUpperCase()"></component>
    <p id="app-game-value">Value: {{ currentGame.round.value }}</p>
    <p id="app-game-remoteness">
      Remoteness: {{ currentGame.round.remoteness }}
    </p>
    <p id="app-game-message"></p>
    <CVisualizer></CVisualizer>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { AxiosResponse } from "axios";
import { INextMoveValuesData } from "../interfaces/external/INextMoveValuesData";
import { StartData } from "@/classes/external/StartData";
import { StartMoveValueData } from "../classes/external/StartMoveValueData";
import { NextMoveValuesData } from "../classes/external/NextMoveValuesData";
import { Round } from "../classes/Round";
import { Game } from "@/classes/Game";
import CFTZ from "@/components/games/CFTZ.vue";
import CVisualizer from "@/components/CVisualizer.vue";
import { GameData } from "../classes/GameData";

@Component({
  components: {
    CFTZ,
    CVisualizer
  }
})
export default class CGame extends Vue {
  currentGame: Game = new Game();

  // when the component is created...
  created() {
    this.initGame();
  }

  // when the game is restarted...
  restarted() {
    this.initGame();
  }

  // when a move is made..
  @Watch("$store.getters.currentMoveTracker")
  onMoveTrackerChange() {
    this.runRound();
  }
}
</script>

<style scoped lang="scss"></style>
