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
              {{ game.getName() }}
              <br />
              ({{ game.getRound().getVariantDescription() }})
            </h2>
            <h3>Game Options</h3>
            <h4>Show/Hide...</h4>
            <div id="app-game-option-clock" class="app-game-option">
              <input type="checkbox" v-model="showClock" />
              <label for="checkbox">Clock</label>
            </div>
            <div id="app-game-option-vvh" class="app-game-option">
              <input type="checkbox" v-model="showVvh" />
              <label for="checkbox">Visual Value History</label>
            </div>
          </div>
        </PopupWindow>
      </div>
      <h2 id="app-game-title">
        {{ game.getName() }}
        <br />
        ({{ game.getRound().getVariantDescription() }})
      </h2>
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
            <b id="app-game-data">
              Move #{{ game.getRound().getRoundNumber() }}
              <br />
              Remoteness {{ game.getRound().getRemoteness() }}
            </b>
          </div>
          <div v-if="showClock" id="app-game-body-main-stats-column2">
            <div id="app-game-date">{{ date }}</div>
            <div id="app-game-time">{{ time }}</div>
            <div id="app-game-timer">{{ timer.format("HH:mm:ss") }}</div>
          </div>
          <div id="app-game-body-main-stats-column3">
            <div id="app-game-prediction">
              <b
                id="app-game-prediction-turn-id"
                :class="'c-turn-' + game.getRound().getTurnId()"
              >
                {{ game.getRound().getTurnName() }}
              </b>
              <br />should
              <span
                id="app-game-prediction-position-value"
                :class="'c-' + game.getRound().getPositionValue()"
                >{{ game.getRound().getPositionValue() }}</span
              >.
            </div>
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
          <GameBoard></GameBoard>
        </div>
      </div>
      <div v-if="showVvh" id="app-game-body-vvh">
        <GameVvh></GameVvh>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
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
  showGameInstruction = false;
  showGameOptions = false;
  showClock = false;
  showVvh = true;

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
    this.$store.commit("undoMove");
  }

  restarted(): void {
    this.initInterval();
    this.$store.dispatch("startNewGame");
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

  @Watch("showVvh")
  async onShowVvh(): Promise<void> {
    if (this.showVvh) {
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
  @include flexItem(row, wrap, space-around, flex-start, stretch);
  > * {
    @include flexContent(1, 1, 0);
  }
}

#app-game-body-main {
  @include flexItem(column, nowrap, flex-start, space-between, stretch);
}

#app-game-body-main-stats {
  @include flexItem(row, wrap, space-between, stretch, stretch);
  padding: 0 0.25em 0 0.25em;
  margin: 0.25em 0.25em 0 0.25em;
  > * {
    @include flexContent(1, 1, 0);
    @include flexItem(column, nowrap, flex-end, stretch, stretch);
    > * {
      border: 0.04em solid var(--neutralColor);
      border-radius: 0.25em;
      padding: 0.25em;
      margin: 0;
    }
  }
}

#app-game-body-main-function {
  @include flexItem(row, nowrap, space-around, stretch, stretch);
  border: 0.04em solid var(--neutralColor);
  border-radius: 0.25em;
  padding: 0.25em;
  margin: 0 0.5em;
  > * {
    border-radius: 100%;
    margin: 1em;
    padding: 1.5em 1em;
  }
}

#app-game-body-main-board {
  border: 0.04em solid var(--neutralColor);
  border-radius: 0.25em;
  padding: 0.25em;
  margin: 0 0.5em 0.5em 0.5em;
}

#app-game-prediction-position-value {
  border-radius: 100%;
  padding-left: 0.25em;
  padding-right: 0.25em;
}
</style>
