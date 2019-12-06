<template>
  <div id="app-game">
    <div id="app-game-header">
      <div id="app-game-options">
        <GameOptions></GameOptions>
      </div>
      <h2 id="app-game-title">
        {{ game.getName() }}
        <br />
        <router-link
          :to="{ name: 'variants', params: { gameId: game.getId() } }"
          >({{ game.getRound().getVariantDescription() }})</router-link
        >
      </h2>
      <div id="app-game-instruction">
        <GameInstruction></GameInstruction>
      </div>
    </div>
    <div id="app-game-body">
      <div id="app-game-body-main">
        <div v-if="options.getClockVisibility()" id="app-game-body-main-clock">
          <div id="app-game-time">{{ time }}</div>
          <div id="app-game-date">{{ date }}</div>
          <div id="app-game-timer">{{ timer.format("HH:mm:ss") }}</div>
        </div>
        <div id="app-game-body-main-function">
          <button id="app-game-undo" @click="undid" :disabled="isInvalidUndo">
            Undo
          </button>
          <button id="app-game-restart" @click="restarted">Restart</button>
          <button id="app-game-redo" @click="redid" :disabled="isInvalidRedo">
            Redo
          </button>
        </div>
        <div id="app-game-body-main-stats">
          <div id="app-game-round">
            Move #{{ game.getRound().getRoundNumber() }}
          </div>
          <div v-if="options.getHintVisibility()" id="app-game-remoteness">
            Remoteness {{ game.getRound().getRemoteness() }}
          </div>
        </div>
        <div
          v-if="options.getHintVisibility()"
          id="app-game-body-main-prediction"
        >
          <b
            id="app-game-prediction-turn-id"
            :class="'c-turn-' + game.getRound().getTurnId()"
            >{{ game.getRound().getTurnName() }}</b
          >
          should
          <span
            id="app-game-prediction-position-value"
            :class="'c-' + game.getRound().getPositionValue()"
            >{{ game.getRound().getPositionValue() }}</span
          >.
        </div>
        <div id="app-game-body-main-board">
          <GameBoard></GameBoard>
        </div>
      </div>
      <div v-if="options.getVvhVisibility()" id="app-game-body-vvh">
        <GameVvh></GameVvh>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import moment from "moment";
import { CGame } from "@/classes/CGame";
import { COptions } from "@/classes/COptions";
import GameOptions from "@/components/GameOptions.vue";
import GameInstruction from "@/components/GameInstruction.vue";
import GameBoard from "@/components/GameBoard.vue";
import GameVvh from "@/components/GameVvh.vue";

@Component({
  components: {
    GameOptions,
    GameInstruction,
    GameBoard,
    GameVvh
  }
})
export default class AppGame extends Vue {
  interval = setInterval(() => this.updateInterval(), 1000);
  dateTime = moment();
  timer = moment().startOf("day");

  get date() {
    return this.dateTime.format("LL");
  }

  get time() {
    return this.dateTime.format("LTS");
  }

  get game(): CGame {
    return this.$store.getters.game;
  }

  get options(): COptions {
    return this.$store.getters.options;
  }

  get vvhVisibility(): boolean {
    return this.$store.getters.vvhVisibility;
  }

  metaInfo() {
    return { title: this.game.getName() };
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

  async created(): Promise<void> {
    this.initInterval();
    await this.$store.dispatch("initGame", this.$route.params.gameId);
    await this.$store.dispatch("startNewGame", this.$route.params.variantId);
  }

  get isInvalidUndo(): boolean {
    return this.game.getHistory().getCurrentRoundNumber() === 1;
  }

  undid(): void {
    this.$store.commit("undoMove");
  }

  restarted(): void {
    this.initInterval();
    this.$store.dispatch("startNewGame", this.$route.params.variantId);
  }

  get isInvalidRedo(): boolean {
    return (
      this.game.getHistory().getCurrentRoundNumber() >=
      this.game.getHistory().getRoundArray().length
    );
  }

  redid(): void {
    this.$store.commit("redoMove");
  }

  @Watch("vvhVisibility")
  async onShowVvh(): Promise<void> {
    if (this.vvhVisibility) {
      await new Promise((resolve, reject) => setTimeout(resolve, 500));
      this.$store.commit("drawVvh");
    }
  }
}
</script>

<style scoped lang="scss">
@mixin flexItem(
  $flexDirection: row,
  $flexWrap: nowrap,
  $justifyContent: flex-start,
  $alignItems: stretch,
  $alignContent: stretch
) {
  display: flex;
  flex-direction: $flexDirection;
  flex-wrap: $flexWrap;
  justify-content: $justifyContent;
  align-items: $alignItems;
  align-content: $alignContent;
}

@mixin flexContent($flexGrow: 0, $flexShrink: 1, $flexBasis: auto) {
  flex-grow: $flexGrow;
  flex-shrink: $flexShrink;
  flex-basis: $flexBasis;
}

#app-game {
  @include flexItem(column, nowrap, flex-start, stretch, stretch);
}

#app-game-header {
  @include flexItem(row, nowrap, center, center, stretch);
}

#app-game-title {
  border: 0.04em solid var(--neutralColor);
  border-radius: 0.25em;
}

#app-game-body {
  @include flexItem(row, wrap, space-between, flex-end, stretch);
  > * {
    @include flexContent(1, 1, 0);
  }
}

#app-game-body-main {
  @include flexItem(column, nowrap, flex-start, space-between, stretch);
  margin: 0.25em;
  padding: 0.25em;
}

#app-game-body-main-clock {
  @include flexItem(row, nowrap, space-around, stretch, stretch);
  > * {
    @include flexContent(1, 1, 0);
    border: 0.04em solid var(--neutralColor);
    border-radius: 0.25em;
    margin: 0;
    padding: 0.25em;
  }
}

#app-game-body-main-function {
  @include flexItem(row, nowrap, space-around, stretch, stretch);
  border: 0.04em solid var(--neutralColor);
  border-radius: 0.25em;
  padding: 0.25em;
  margin: 0;
  > * {
    border-radius: 100%;
    margin: 0.5em;
    padding: 1.5em 1em;
  }
}

#app-game-body-main-stats {
  @include flexItem(row, wrap, space-between, stretch, stretch);
  margin: 0;
  padding: 0;
  > * {
    @include flexContent(1, 1, 0);
    border: 0.04em solid var(--neutralColor);
    border-radius: 0.25em;
    margin: 0;
    padding: 0.25em;
  }
}

#app-game-body-main-prediction {
  border: 0.04em solid var(--neutralColor);
  border-radius: 0.25em;
  margin: 0;
  padding: 0.25em;
  #app-game-prediction-position-value {
    border-radius: 100%;
    padding-left: 0.25em;
    padding-right: 0.25em;
  }
}

#app-game-body-main-board {
  border: 0.04em solid var(--neutralColor);
  border-radius: 0.25em;
  padding: 0.25em;
  margin: 0;
}

#app-game-body-vvh {
  margin: 0.25em;
  padding: 0.25em;
}
</style>
