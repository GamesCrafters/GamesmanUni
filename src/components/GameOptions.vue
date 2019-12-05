<template>
  <div id="app-game-options">
    <button
      id="app-game-options-button"
      @click="options.setGameOptionsVisibility(true)"
    >
      ⚙️
    </button>
    <PopupWindow
      id="app-game-options-popup"
      v-if="options.getGameOptionsVisibility()"
      @close="updateOptions()"
    >
      <div slot="content">
        <h2>
          {{ game.getName() }}
          <br />
          ({{ game.getRound().getVariantDescription() }})
        </h2>
        <h3>Game Options</h3>
        <div id="app-game-option-show-hide-container">
          <h4 id="app-game-option-show-hide-title">Show/Hide...</h4>
          <div id="app-game-option-clock" class="app-game-option">
            <input type="checkbox" v-model="clockVisibility" />
            <label for="checkbox">Clock</label>
          </div>
          <div id="app-game-option-vvh" class="app-game-option">
            <input type="checkbox" v-model="vvhVisibility" />
            <label for="checkbox">Visual Value History</label>
          </div>
          <div id="app-game-option-next-moves" class="app-game-option">
            <input type="checkbox" v-model="nextMovesVisibility" />
            <label for="checkbox">Next Moves</label>
          </div>
          <div id="app-game-option-hint" class="app-game-option">
            <input type="checkbox" v-model="hintVisibility" />
            <label for="checkbox">Hint</label>
          </div>
          <div id="app-game-option-delta-remoteness" class="app-game-option">
            <input type="checkbox" v-model="deltaRemotenessVisibility" />
            <label for="checkbox">Delta Remoteness</label>
          </div>
        </div>
      </div>
    </PopupWindow>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { CGame } from "@/classes/CGame";
import { COptions } from "@/classes/COptions";
import ExternalMarkdown from "@/components/ExternalMarkdown.vue";
import PopupWindow from "@/components/PopupWindow.vue";
@Component({
  components: {
    ExternalMarkdown,
    PopupWindow
  }
})
export default class GameOptions extends Vue {
  gameInstructionVisibility: boolean = this.options.getGameInstructionVisibility();
  clockVisibility: boolean = this.options.getClockVisibility();
  vvhVisibility: boolean = this.options.getVvhVisibility();
  nextMovesVisibility: boolean = this.options.getNextMovesVisibility();
  hintVisibility: boolean = this.options.getHintVisibility();
  deltaRemotenessVisibility: boolean = this.options.getDeltaRemotenessVisibility();
  animationDuration: number = this.options.getAnimationDuration();

  get game(): CGame {
    return this.$store.getters.game;
  }

  get options(): COptions {
    return this.$store.getters.options;
  }
  updateOptions(): void {
    this.$store.commit(
      "gameInstructionVisibility",
      this.gameInstructionVisibility
    );
    this.$store.commit("clockVisibility", this.clockVisibility);
    this.$store.commit("vvhVisibility", this.vvhVisibility);
    this.$store.commit("nextMovesVisibility", this.nextMovesVisibility);
    this.$store.commit("hintVisibility", this.hintVisibility);
    this.$store.commit(
      "deltaRemotenessVisibility",
      this.deltaRemotenessVisibility
    );
    this.$store.commit("animationDuration", this.animationDuration);
    this.$store.commit("gameOptionsVisibility", false);
  }
}
</script>

<style scoped lang="scss">
#app-game-option-show-hide-container {
  align-content: center;
  align-items: flex-start;
  border: 0.04em solid var(--neutralColor);
  border-radius: 0.25em;
  display: flex;
  flex-direction: column;
  margin-left: auto;
  margin-right: auto;
  width: 15em;
}
.app-game-option {
  input {
    margin-right: 1em;
  }
}
</style>
