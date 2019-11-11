<template>
  <div id="app-game">
    <div id="app-game-header">
      <div id="app-game-options">
        <button id="app-game-options-button" @click="showGameOptions = true">
          ⚙️
        </button>
        <PopupWindow
          id="app-game-options-popup"
          v-if="showGameOptions"
          @close="showGameOptions = false"
        >
          <div slot="content">
            <h2>
              {{ game.getName() }} ({{
                game.getRound().getVariantDescription()
              }})
            </h2>
            <h3>Game Options</h3>
          </div>
        </PopupWindow>
      </div>
      <h2>{{ game.getName() }}</h2>
      <div id="app-game-instruction">
        <button
          id="app-game-instruction-button"
          @click="showGameInstruction = true"
        >
          𝓲
        </button>
        <PopupWindow
          id="app-game-instruction-popup"
          v-if="showGameInstruction"
          @close="showGameInstruction = false"
        >
          <div slot="content">
            <ExternalMarkdown
              class="c-markdown"
              :relativePath="`gameInstructions/${game.getId()}.md`"
            ></ExternalMarkdown>
          </div>
        </PopupWindow>
      </div>
    </div>
    <div id="app-game-body">
      <div id="app-game-body-main">
        <div id="app-game-body-main-stats">
          <div id="app-game-body-main-stats-column1">
            <code>
              <b id="app-game-roundNumber"
                >Move #{{ game.getRound().getRoundNumber() }}</b
              >
            </code>
            <code id="app-game-positionValue">
              <span :class="'c-turn-' + game.getRound().getTurnId()">{{
                game.getRound().getTurnName()
              }}</span>
              <br />should
              <span :class="'c-' + game.getRound().getPositionValue()">{{
                game.getRound().getPositionValue()
              }}</span
              >.
            </code>
          </div>
          <div id="app-game-body-main-stats-column2">
            <code id="app-game-date">{{ date }}</code>
            <code id="app-game-time">{{ time }}</code>
            <code id="app-game-timer">{{ timer.format("HH:mm:ss") }}</code>
          </div>
          <div id="app-game-body-main-stats-column3">
            <code>
              <b
                id="app-game-turnName"
                :class="'c-turn-' + game.getRound().getTurnId()"
                >{{ game.getRound().getTurnName() }} Turn</b
              >
            </code>
            <code id="app-game-remoteness"
              >Remoteness: {{ game.getRound().getRemoteness() }}</code
            >
          </div>
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
        <div id="app-game-body-main-board">
          <!-- <GameBoard></GameBoard> -->
        </div>
      </div>
      <div id="app-game-body-vvh">
        <!-- <GameVvh></GameVvh> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import moment from "moment";
import { CGame } from "@/classes/CGame";
import ExternalMarkdown from "@/components/ExternalMarkdown.vue";
import GameBoard from "@/components/GameBoard.vue";
import GameVvh from "@/components/GameVvh.vue";
import PopupWindow from "@/components/PopupWindow.vue";

@Component({
  components: {
    ExternalMarkdown,
    GameBoard,
    GameVvh,
    PopupWindow
  }
})
export default class AppGame extends Vue {
  showGameOptions = false;
  showGameInstruction = false;
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

  created() {
    this.initInterval();
    this.$store.commit("gameId", this.$route.params.gameId);
    this.$store.commit("variantId", this.$route.params.variantId);
    this.$store.dispatch("initGame");
  }

  get isInvalidUndo(): boolean {
    return this.game.getHistory().getCurrentRoundNumber() === 1;
  }

  undid(): void {
    this.$store.dispatch("undoMove");
  }

  restarted(): void {
    this.initInterval();
    this.$store.dispatch("startNewGame");
  }

  get isInvalidRedo(): boolean {
    return (
      this.game.getHistory().getCurrentRoundNumber() ===
      this.game.getHistory().getRoundArray().length - 1
    );
  }

  redid(): void {
    this.$store.dispatch("redoMove");
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
  > * {
    padding: 0.5em 1em;
  }
}

#app-game-body {
  @include flexItem(row, wrap, space-around, flex-start, stretch);
  > * {
    @include flexContent(1, 1, 0);
  }
}

#app-game-body-main {
  @include flexItem(column, nowrap, flex-start, space-between, stretch);
}

#app-game-body-main-stats {
  @include flexItem(row, wrap, space-around, flex-start);
  > * {
    @include flexContent(1, 1, 0);
  }
}

#app-game-body-main-stats-column1 {
  @include flexItem(column, nowrap, flex-start, stretch, stretch);
}

#app-game-body-main-stats-column2 {
  @include flexItem(column, nowrap, flex-start, stretch, stretch);
}

#app-game-body-main-stats-column3 {
  @include flexItem(column, nowrap, flex-start, stretch, stretch);
}

#app-game-body-main-function {
  @include flexItem(row, nowrap, space-around, stretch, stretch);
  > * {
    border-radius: 100%;
    margin: 1em;
    padding: 1.5em 1em;
  }
}

// #app-game-body-main-board {
//   @include flexItem(column, nowrap, flex-start, center, stretch);
// }
</style>
