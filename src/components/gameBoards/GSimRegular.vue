<template>
  <div id="app-game-board-sim-regular">
    <svg viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
      <line
        :class="line56"
        @click="runMove((id = 56))"
        x1="18"
        y1="7"
        x2="48"
        y2="7"
      />
      <line
        :class="line16"
        @click="runMove((id = 16))"
        x1="48"
        y1="7"
        x2="63"
        y2="33"
      />
      <line
        :class="line12"
        @click="runMove((id = 12))"
        x1="63"
        y1="33"
        x2="48"
        y2="59"
      />
      <line
        :class="line23"
        @click="runMove((id = 23))"
        x1="48"
        y1="59"
        x2="18"
        y2="59"
      />
      <line
        :class="line34"
        @click="runMove((id = 34))"
        x1="18"
        y1="59"
        x2="3"
        y2="33"
      />
      <line
        :class="line45"
        @click="runMove((id = 45))"
        x1="3"
        y1="33"
        x2="18"
        y2="7"
      />

      <line
        :class="line25"
        @click="runMove((id = 25))"
        x1="18"
        y1="7"
        x2="48"
        y2="59"
      />
      <line
        :class="line36"
        @click="runMove((id = 36))"
        x1="48"
        y1="7"
        x2="18"
        y2="59"
      />
      <line
        :class="line14"
        @click="runMove((id = 14))"
        x1="63"
        y1="33"
        x2="3"
        y2="33"
      />
      <line
        :class="line15"
        @click="runMove((id = 15))"
        x1="18"
        y1="7"
        x2="63"
        y2="33"
      />
      <line
        :class="line26"
        @click="runMove((id = 26))"
        x1="48"
        y1="7"
        x2="48"
        y2="59"
      />
      <line
        :class="line13"
        @click="runMove((id = 13))"
        x1="63"
        y1="33"
        x2="18"
        y2="59"
      />
      <line
        :class="line24"
        @click="runMove((id = 24))"
        x1="48"
        y1="59"
        x2="3"
        y2="33"
      />
      <line
        :class="line35"
        @click="runMove((id = 35))"
        x1="18"
        y1="59"
        x2="18"
        y2="7"
      />
      <line
        :class="line46"
        @click="runMove((id = 46))"
        x1="3"
        y1="33"
        x2="48"
        y2="7"
      />
    </svg>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { CRound } from "@/classes/CRound";

@Component
export default class GSimRegular extends Vue {
  get loadingStatus() {
    return this.$store.getters.loadingStatus;
  }
  get roundNumber() {
    return this.$store.getters.roundNumber;
  }
  get remoteness() {
    return this.$store.getters.game.getRound().getRemoteness();
  }

  @Watch("remoteness")
  onSyncremotenessChange(): void {
    if (this.remoteness == 0) {
      this.over();
    } else if (this.remoteness != 0) {
      this.changeColor();
    }
  }
  @Watch("roundNumber")
  onSyncRoundChange(): void {
    var roundNumber = this.$store.getters.roundNumber;
    if (roundNumber == 1) {
      this.changeColor();
    }
    if (roundNumber > this.lastRoundNumber) {
      this.lastRoundNumber = roundNumber;
      var move = this.movesStack2.pop();
      if (move != undefined) {
        this.isBlue = !this.isBlue;
        this.movesStack1.push(move);
        var idString = move.substr(0, 2);
        var id = +idString;
        var colorOfLineString = move.substr(2, 4);
        var isBlue = colorOfLineString == "true" ? true : false;
        if (id == 56) {
          this.line56 = isBlue ? "blue" : "red";
        } else if (id == 16) {
          this.line16 = isBlue ? "blue" : "red";
        } else if (id == 12) {
          this.line12 = isBlue ? "blue" : "red";
        } else if (id == 23) {
          this.line23 = isBlue ? "blue" : "red";
        } else if (id == 34) {
          this.line34 = isBlue ? "blue" : "red";
        } else if (id == 45) {
          this.line45 = isBlue ? "blue" : "red";
        } else if (id == 25) {
          this.line25 = isBlue ? "blue" : "red";
        } else if (id == 36) {
          this.line36 = isBlue ? "blue" : "red";
        } else if (id == 14) {
          this.line14 = isBlue ? "blue" : "red";
        } else if (id == 15) {
          this.line15 = isBlue ? "blue" : "red";
        } else if (id == 26) {
          this.line26 = isBlue ? "blue" : "red";
        } else if (id == 13) {
          this.line13 = isBlue ? "blue" : "red";
        } else if (id == 24) {
          this.line24 = isBlue ? "blue" : "red";
        } else if (id == 35) {
          this.line35 = isBlue ? "blue" : "red";
        } else if (id == 46) {
          this.line46 = isBlue ? "blue" : "red";
        } else if (id == 15) {
          this.line15 = isBlue ? "blue" : "red";
        }
      }
    } else if (roundNumber < this.lastRoundNumber) {
      this.lastRoundNumber = roundNumber;
      var lastMove = this.movesStack1.pop();
      this.isBlue = !this.isBlue;
      if (lastMove != undefined) this.movesStack2.push(lastMove);
    }
    this.changeColor();
  }
  over(): void {
    if (
      this.line56 == "simpleLine" ||
      this.line56 == "win" ||
      this.line56 == "lose"
    ) {
      this.line56 = "over";
    }
    if (
      this.line16 == "simpleLine" ||
      this.line16 == "win" ||
      this.line16 == "lose"
    ) {
      this.line16 = "over";
    }
    if (
      this.line12 == "simpleLine" ||
      this.line12 == "win" ||
      this.line12 == "lose"
    ) {
      this.line12 = "over";
    }
    if (
      this.line23 == "simpleLine" ||
      this.line23 == "win" ||
      this.line23 == "lose"
    ) {
      this.line23 = "over";
    }
    if (
      this.line34 == "simpleLine" ||
      this.line34 == "win" ||
      this.line34 == "lose"
    ) {
      this.line34 = "over";
    }
    if (
      this.line45 == "simpleLine" ||
      this.line45 == "win" ||
      this.line45 == "lose"
    ) {
      this.line45 = "over";
    }
    if (
      this.line25 == "simpleLine" ||
      this.line25 == "win" ||
      this.line25 == "lose"
    ) {
      this.line25 = "over";
    }
    if (
      this.line36 == "simpleLine" ||
      this.line36 == "win" ||
      this.line36 == "lose"
    ) {
      this.line36 = "over";
    }
    if (
      this.line14 == "simpleLine" ||
      this.line14 == "win" ||
      this.line14 == "lose"
    ) {
      this.line14 = "over";
    }
    if (
      this.line15 == "simpleLine" ||
      this.line15 == "win" ||
      this.line15 == "lose"
    ) {
      this.line15 = "over";
    }
    if (
      this.line26 == "simpleLine" ||
      this.line26 == "win" ||
      this.line26 == "lose"
    ) {
      this.line26 = "over";
    }
    if (
      this.line13 == "simpleLine" ||
      this.line13 == "win" ||
      this.line13 == "lose"
    ) {
      this.line13 = "over";
    }
    if (
      this.line24 == "simpleLine" ||
      this.line24 == "win" ||
      this.line24 == "lose"
    ) {
      this.line24 = "over";
    }
    if (
      this.line35 == "simpleLine" ||
      this.line35 == "win" ||
      this.line35 == "lose"
    ) {
      this.line35 = "over";
    }
    if (
      this.line46 == "simpleLine" ||
      this.line46 == "win" ||
      this.line46 == "lose"
    ) {
      this.line46 = "over";
    }
  }

  movesStack1: String[] = [];
  movesStack2: String[] = [];
  lastRoundNumber: number = -1;
  lastMoveArrayLength: number = 15;
  isBlue: boolean = true;
  line56: string = "simpleLine";
  line16: string = "simpleLine";
  line12: string = "simpleLine";
  line23: string = "simpleLine";
  line34: string = "simpleLine";
  line45: string = "simpleLine";
  line25: string = "simpleLine";
  line36: string = "simpleLine";
  line14: string = "simpleLine";
  line15: string = "simpleLine";
  line26: string = "simpleLine";
  line13: string = "simpleLine";
  line24: string = "simpleLine";
  line35: string = "simpleLine";
  line46: string = "simpleLine";

  get game() {
    return this.$store.getters.game;
  }

  changeColor(): void {
    var array = this.$store.getters.game.getRound().getNextMoveDataArray();
    var length = this.$store.getters.game.getRound().getNextMoveDataArray()
      .length;

    for (var i = 0; i < length; i++) {
      var idString = array[i].move;
      var id = +idString;
      var colorString = array[i].moveValue;
      if (id == 56) {
        this.line56 = colorString;
      } else if (id == 16) {
        this.line16 = colorString;
      } else if (id == 12) {
        this.line12 = colorString;
      } else if (id == 23) {
        this.line23 = colorString;
      } else if (id == 34) {
        this.line34 = colorString;
      } else if (id == 45) {
        this.line45 = colorString;
      } else if (id == 25) {
        this.line25 = colorString;
      } else if (id == 36) {
        this.line36 = colorString;
      } else if (id == 14) {
        this.line14 = colorString;
      } else if (id == 15) {
        this.line15 = colorString;
      } else if (id == 26) {
        this.line26 = colorString;
      } else if (id == 13) {
        this.line13 = colorString;
      } else if (id == 24) {
        this.line24 = colorString;
      } else if (id == 35) {
        this.line35 = colorString;
      } else if (id == 46) {
        this.line46 = colorString;
      } else if (id == 15) {
        this.line15 = colorString;
      }
    }
  }
  runMove(id: number) {
    if (
      this.$store.getters.game.getRound().getNextMoveDataArray().length == 0
    ) {
      this.over();
    } else {
      if (id == 56) {
        if (this.line56 == "blue" || this.line56 == "red") {
          return;
        }
        this.line56 = this.isBlue ? "blue" : "red";
      } else if (id == 16) {
        if (this.line16 == "blue" || this.line16 == "red") {
          return;
        }
        this.line16 = this.isBlue ? "blue" : "red";
      } else if (id == 12) {
        if (this.line12 == "blue" || this.line12 == "red") {
          return;
        }
        this.line12 = this.isBlue ? "blue" : "red";
      } else if (id == 23) {
        if (this.line23 == "blue" || this.line23 == "red") {
          return;
        }
        this.line23 = this.isBlue ? "blue" : "red";
      } else if (id == 34) {
        if (this.line34 == "blue" || this.line34 == "red") {
          return;
        }
        this.line34 = this.isBlue ? "blue" : "red";
      } else if (id == 45) {
        if (this.line45 == "blue" || this.line45 == "red") {
          return;
        }
        this.line45 = this.isBlue ? "blue" : "red";
      } else if (id == 25) {
        if (this.line25 == "blue" || this.line25 == "red") {
          return;
        }
        this.line25 = this.isBlue ? "blue" : "red";
      } else if (id == 36) {
        if (this.line36 == "blue" || this.line36 == "red") {
          return;
        }
        this.line36 = this.isBlue ? "blue" : "red";
      } else if (id == 14) {
        if (this.line14 == "blue" || this.line14 == "red") {
          return;
        }
        this.line14 = this.isBlue ? "blue" : "red";
      } else if (id == 15) {
        if (this.line15 == "blue" || this.line15 == "red") {
          return;
        }
        this.line15 = this.isBlue ? "blue" : "red";
      } else if (id == 26) {
        if (this.line26 == "blue" || this.line26 == "red") {
          return;
        }
        this.line26 = this.isBlue ? "blue" : "red";
      } else if (id == 13) {
        if (this.line13 == "blue" || this.line13 == "red") {
          return;
        }
        this.line13 = this.isBlue ? "blue" : "red";
      } else if (id == 24) {
        if (this.line24 == "blue" || this.line24 == "red") {
          return;
        }
        this.line24 = this.isBlue ? "blue" : "red";
      } else if (id == 35) {
        if (this.line35 == "blue" || this.line35 == "red") {
          return;
        }
        this.line35 = this.isBlue ? "blue" : "red";
      } else if (id == 46) {
        if (this.line46 == "blue" || this.line46 == "red") {
          return;
        }
        this.line46 = this.isBlue ? "blue" : "red";
      } else if (id == 15) {
        if (this.line15 == "blue" || this.line15 == "red") {
          return;
        }
        this.line15 = this.isBlue ? "blue" : "red";
      }
      this.movesStack1.push("" + id + this.isBlue);
      this.lastMoveArrayLength = this.$store.getters.game
        .getRound()
        .getNextMoveDataArray().length;
      this.isBlue = !this.isBlue;
      var array = this.$store.getters.game.getRound().getNextMoveDataArray();
      var length = this.$store.getters.game.getRound().getNextMoveDataArray()
        .length;

      for (var i = 0; i < length; i++) {
        if (id == array[i].move) {
          this.$store.dispatch("runMove", array[i].move);
        }
      }

      this.lastRoundNumber = this.$store.getters.roundNumber;
    }
    this.changeColor();
  }
}
</script>

<style lang="scss" scoped>
.simpleLine {
  stroke: rgb(179, 219, 186);
  stroke-width: 2;
}
.simpleLine:hover {
  stroke: yellow;
  stroke-width: 2;
  cursor: pointer;
}
.win {
  stroke: rgb(179, 219, 186);
  stroke-width: 2;
}
.win:hover {
  stroke: #008000;
  stroke-width: 2;
  cursor: pointer;
}
.lose {
  stroke: rgb(179, 219, 186);
  stroke-width: 2;
}
.lose:hover {
  stroke: #800000;
  stroke-width: 2;
  cursor: pointer;
}
.blue {
  stroke: blue;
  stroke-width: 2;
}
.red {
  stroke: red;
  stroke-width: 2;
}
.over {
  stroke: rgb(179, 219, 186);
  stroke-width: 2;
}
</style>
