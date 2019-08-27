<template>
  <div id="app-game">
    <h2 id="game-title">{{ game.name }}</h2>
    <p id="game-round">Round: {{ game.round.round }}</p>
    <p id="game-player">Player: {{ game.round.turnName }}</p>
    <button @click="restart">Restart</button>
    <component :is="game.id"></component>
    <p id="game-value">Value:</p>
    <p id="game-remoteness">Remoteness:</p>
    <p id="game-message">Message:</p>
    <!-- <History></History> -->
    <Setting></Setting>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { CGame } from "@/classes/CGame";
import { CGameData } from "@/classes/CGameData";
import ftz from "@/components/games/ftz.vue";
import ttt from "@/components/games/ttt.vue";
import History from "@/components/game/History.vue";
import Setting from "@/components/game/Setting.vue";

@Component({
  components: {
    ftz,
    ttt,
    History,
    Setting
  }
})
export default class Game extends Vue {
  game: CGame = new CGame();

  created() {
    this.game = new CGame(
      this.$store.state.games[
        this.$store.state.gameIds.indexOf(this.$route.params.gameId)
      ]
    );
    this.$store.commit("currentGame", this.game);
    this.game = this.$store.state.currentGame;
  }

  beforeRouteLeave(to: Object, from: Object, next: Function) {
    this.$store.commit("updatePlayedGames", this.game);
  }

  restart() {
    this.game.name = "boooo";
    return;
  }
}
</script>

<style scoped lang="scss"></style>
