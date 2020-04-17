<template>
  <div id="app-game-board-mancala-regular">
    <svg viewBox="0 0 90 30" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <g id="board">
          <circle id="pocket" r="4" cx="16.875" cy="7.5" />
          <path id="store" d="M 1.625 7.5 L 1.625 22.5 A 4 4 180 0 0 9.625 22.5
                L 9.625 7.5 A 4 4 0 0 0 1.625 7.5" />
          <use xlink:href="#pocket" transform="translate(11.25)" />
          <use xlink:href="#pocket" transform="translate(22.5)" />
          <use xlink:href="#pocket" transform="translate(33.75)" />
          <use xlink:href="#pocket" transform="translate(45)" />
          <use xlink:href="#pocket" transform="translate(56.25)" />
          <use xlink:href="#pocket" transform="translate(0 15)" />
          <use xlink:href="#pocket" transform="translate(11.25 15)" />
          <use xlink:href="#pocket" transform="translate(22.5 15)" />
          <use xlink:href="#pocket" transform="translate(33.75 15)" />
          <use xlink:href="#pocket" transform="translate(45 15)" />
          <use xlink:href="#pocket" transform="translate(56.25 15)" />
          <use xlink:href="#store" transform="translate(78.75)" />
        </g>
      </defs>
      <use xlink:href="#board" x="0" y="0" />
    </svg>

    <hr v-if="nextMovesVisibility" class="c-divider" />
    <div v-if="nextMovesVisibility" id="app-game-board-default-moves">
      <h3 id="app-game-board-default-moves-title">Move(s)</h3>
      <div
        id="app-game-board-default-moves-buttons"
        v-if="!loadingStatus && nextMoveDataArray"
      >
        <button
          v-for="nextMoveData in nextMoveDataArray"
          :key="nextMoveData.move"
          :class="getMoveButtonHintClass(nextMoveData.moveValue)"
          :style="{
            opacity: deltaRemotenessVisibility
              ? nextMoveData.moveValueOpacity
              : 1
          }"
          @click="runMove(nextMoveData.move)"
        >
          {{ nextMoveData.move }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { TMoveData } from "@/types/internal/TMoveData";
import { CRound } from "@/classes/CRound";

@Component
export default class GMancalaRegular extends Vue {
  richPositionData = this.generateRichPositionData();

  generateRichPositionData(): string {
    let position: string = this.$store.getters.position;

    function makeDefaultStringPosition(): string {
      let str = position;
      str = str.replace(/^;/, "");
      str = str.replace(/;$/, "");
      str = str.replace(/;/g, "\n");
      str = str.replace(/=/g, " = ");
      return str
    }
    return makeDefaultStringPosition();
  }

  updateRichPositionData(): void {
    this.richPositionData = this.generateRichPositionData();
  }

  get hintVisibility() {
    return this.$store.getters.hintVisibility;
  }

  get loadingStatus(): boolean {
    return this.$store.getters.loadingStatus;
  }

  get roundNumber() {
    return this.$store.getters.roundNumber;
  }

  get nextMoveDataArray(): Array<TMoveData> {
    return this.$store.getters.nextMoveDataArray;
  }

  get nextMovesVisibility(): boolean {
    return this.$store.getters.nextMovesVisibility;
  }

  get deltaRemotenessVisibility(): boolean {
    return this.$store.getters.deltaRemotenessVisibility;
  }

  getMoveButtonHintClass(moveValue: string): string {
    if (this.$store.getters.hintVisibility) {
      return "c-" + moveValue;
    }
    return "";
  }

  runMove(move: string): void {
    this.$store.dispatch("runMove", move);
  }

  created(): void {
    this.updateRichPositionData();
  }

  mounted(): void {
    this.updateRichPositionData();
  }

  @Watch("loadingStatus")
  async onAsyncRoundChange(): Promise<void> {
    this.updateRichPositionData();
  }

  @Watch("roundNumber")
  onSyncRoundChange(): void {
    this.updateRichPositionData();
  }

  @Watch("hint")
  onHintChange(): void {
    this.updateRichPositionData();
  }
}
</script>

<style lang="scss" scoped>
svg {
  height: 15em;
  width: 45em;
  margin: auto;
  vertical-align: middle;
  > * {
    fill: #d2b48c;
    stroke: var(--neutralColor);
    stroke-width: 0.5;
  }
}

#app-game-board-default-moves-buttons {
  padding: 0.5em 20%;
}

.app-game-board-default-cell {
  stroke: var(--neutralColor);
  stroke-width: 1;
  fill: var(--backgroundColor);

  // Highlight cells placed with a token
  &.placed {
    fill: var(--neutralColor);
  }

  // Highlight move cells on hover
  g:hover > &.move {
    fill: var(--neutralColor);
  }
}

</style>
