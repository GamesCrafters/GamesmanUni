<template>
  <div id="app-game">
    <div id="app-game-r1">
      <h2 id="app-game-title">{{ game.name }}</h2>
    </div>
    <div id="app-game-r2">
      <div id="app-game-r2-c1">
        <div id="app-game-r2-c1-r1">
          <div id="app-game-r2-c1-r1-c1">
            <p id="app-game-roundNumber">Move #{{ game.round.roundNumber }}</p>
            <p id="app-game-positionValue">
              Prediction:
              <span :class="'c-turn-' + game.round.turnNumber">{{
                game.turnNames[game.round.turnNumber]
              }}</span>
              should
              <span :class="'c-' + game.round.positionValue">{{
                game.round.positionValue
              }}</span
              >.
            </p>
          </div>
          <div id="app-game-r2-c1-r1-c2">
            <p id="app-game-date">{{ date }}</p>
            <p id="app-game-time">{{ time }}</p>
            <p id="app-game-timer">{{ timer.format("HH:mm:ss") }}</p>
          </div>
          <div id="app-game-r2-c1-r1-c3">
            <p
              id="app-game-turnName"
              :class="'c-turn-' + game.round.turnNumber"
            >
              {{ game.turnNames[game.round.turnNumber] }}
            </p>
            <p id="app-game-remoteness">
              Remoteness: {{ game.round.remoteness }}
            </p>
          </div>
        </div>
        <div id="app-game-r2-c1-r2">
          <button id="app-game-undo" @click="undid" :disabled="isInvalidUndo">
            Undo
          </button>
          <button id="app-game-restart" @click="restarted">Restart</button>
          <button id="app-game-redo" @click="redid" :disabled="isInvalidRedo">
            Redo
          </button>
        </div>
        <div id="app-game-r2-c1-r3">
          <component :is="'G' + game.id"></component>
        </div>
      </div>
      <div id="app-game-r2-c2">
        <GameVvh></GameVvh>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import G1020 from "@/components/games/G1020.vue";
import GameVvh from "@/components/GameVvh.vue";
import moment from "moment";

@Component({
  components: {
    G1020,
    GameVvh
  }
})
export default class CGame extends Vue {
  interval = setInterval(() => this.updateInterval(), 1000);
  dateTime = moment();
  timer = moment().startOf("day");

  get date() {
    return this.dateTime.format("LL");
  }

  get time() {
    return this.dateTime.format("LTS");
  }

  get game() {
    return this.$store.getters.game;
  }

  metaInfo() {
    return { title: this.game.name };
  }

  initInterval(): void {
    clearInterval(this.interval);
    this.timer = moment().startOf("day");
    this.interval = setInterval(() => this.updateInterval(), 1000);
  }

  updateInterval(): void {
    this.dateTime = moment();
    this.timer.add(1, "s");
  }

  created() {
    this.initInterval();
    this.$store.dispatch("startNewGame", this.$route.params.gameId);
  }

  get isInvalidUndo(): boolean {
    return this.game.round.roundNumber === 1;
  }

  undid(): void {
    this.$store.dispatch("runUndo", this.$route.params.gameId);
  }

  restarted(): void {
    this.initInterval();
    this.$store.dispatch("startNewGame", this.$route.params.gameId);
  }

  get isInvalidRedo(): boolean {
    return this.game.round.roundNumber === this.game.history.rounds.length;
  }

  redid(): void {
    this.$store.dispatch("runRedo", this.$route.params.gameId);
  }
}
</script>
