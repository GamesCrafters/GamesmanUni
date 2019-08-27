<template>
  <div id="ftz">
    <div id="ftz-moves">
      <button id="ftz-move1" @click="runMove1">
        take one
      </button>
      <button id="ftz-move2" @click="runMove2">
        take two
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { CGame } from "@/classes/CGame";
import { CRound } from "@/classes/CRound";
import axios from "axios";

@Component
export default class ftz extends Vue {
  game: CGame = new CGame();
  mounted() {
    this.game = this.$store.state.currentGame;
    if (this.game.round.round == 0) {
      this.getNewGame();
    }
  }

  getNewGame() {
    let board: string;
    // get board...
    axios.get(`${this.game.dataBaseUrl}/getStart`).then(newGameData => {
      board = newGameData.data.response;
      axios
        .get(
          `${this.$store.state.currentGame.baseUrlId}/getMoveValue?board=${board}`
        )
        .then(round0Data => {
          this.game.round = new CRound({
            move: round0Data.data.response.move,
            board: round0Data.data.response.board,
            value: round0Data.data.response.value,
            valueCode: this.game.valueCodes[round0Data.data.response.value],
            remoteness: round0Data.data.response,
            turn: 0,
            turnName: this.game.turnNames[0],
            round: 1,
            nextMoves: []
          });
        });
    });
    this.$store.commit("currentGame", this.game);
  }
}
</script>

<style scoped lang="scss"></style>
