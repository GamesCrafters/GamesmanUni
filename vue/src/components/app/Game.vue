<template>
  <div id="app-game">
    <h2 id="game-title">{{ $store.state.currentGame.name }}</h2>
    <p id="game-round">Round: {{ $store.state.currentGame.round.round }}</p>
    <p id="game-player">{{ $store.state.currentGame.round.turnName }} Turn</p>
    <button @click="restart">Restart</button>
    <component :is="$store.state.currentGame.id"></component>
    <p id="game-value">Value: {{ $store.state.currentGame.round.value }}</p>
    <p id="game-remoteness">
      Remoteness: {{ $store.state.currentGame.round.remoteness }}
    </p>
    <p id="game-message"></p>
    <!-- <History v-if="!game.start"></History> -->
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
  mounted() {
    this.$store.commit("loadCurrentGame", this.$route.params.gameId);
  }

  restart() {
    this.$store.commit(
      "currentGame",
      new CGame(this.$store.getters("game", this.$route.params.gameId))
    );
  }

  beforeRouteLeave(to: Object, from: Object, next: Function) {
    this.$store.commit("updatePlayedGames");
  }
}
</script>

<style scoped lang="scss"></style>
