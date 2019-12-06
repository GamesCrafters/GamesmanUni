<template>
  <div id="app-game-board-sim-regular">
    <svg viewBox="0 0 122 66" xmlns="http://www.w3.org/2000/svg">
      <line
        v-for="(id, idx) in corresponding"
        :key="idx"
        :class="id.color"
        @click="runMove(id.idOfLine)"
        :x1="id.index1"
        :y1="id.index2"
        :x2="id.index3"
        :y2="id.index4"
        stroke-linecap="round"
      />
    </svg>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { CRound } from "@/classes/CRound";

@Component
export default class GSimRegular extends Vue {
  corresponding: {
    [id: string]: {
      index1: string;
      index2: string;
      index3: string;
      index4: string;
      color: string;
      idOfLine: string;
    };
  } = this.correspond();
  correspond() {
    let co: {
      [id: string]: {
        index1: string;
        index2: string;
        index3: string;
        index4: string;
        color: string;
        idOfLine: string;
      };
    } = {};

    co["56"] = {
      index1: "51",
      index2: "7",
      index3: "81",
      index4: "7",
      color: "simpleLineB",
      idOfLine: "56"
    };
    co["16"] = {
      index1: "81",
      index2: "7",
      index3: "96",
      index4: "33",
      color: "simpleLineB",
      idOfLine: "16"
    };
    co["12"] = {
      index1: "96",
      index2: "33",
      index3: "81",
      index4: "59",
      color: "simpleLineB",
      idOfLine: "12"
    };
    co["23"] = {
      index1: "81",
      index2: "59",
      index3: "51",
      index4: "59",
      color: "simpleLineB",
      idOfLine: "23"
    };
    co["34"] = {
      index1: "51",
      index2: "59",
      index3: "36",
      index4: "33",
      color: "simpleLineB",
      idOfLine: "34"
    };
    co["45"] = {
      index1: "36",
      index2: "33",
      index3: "51",
      index4: "7",
      color: "simpleLineB",
      idOfLine: "45"
    };
    co["25"] = {
      index1: "51",
      index2: "7",
      index3: "81",
      index4: "59",
      color: "simpleLineB",
      idOfLine: "25"
    };
    co["36"] = {
      index1: "81",
      index2: "7",
      index3: "51",
      index4: "59",
      color: "simpleLineB",
      idOfLine: "36"
    };
    co["14"] = {
      index1: "96",
      index2: "33",
      index3: "36",
      index4: "33",
      color: "simpleLineB",
      idOfLine: "14"
    };
    co["15"] = {
      index1: "51",
      index2: "7",
      index3: "96",
      index4: "33",
      color: "simpleLineB",
      idOfLine: "15"
    };
    co["26"] = {
      index1: "81",
      index2: "7",
      index3: "81",
      index4: "59",
      color: "simpleLineB",
      idOfLine: "26"
    };
    co["13"] = {
      index1: "96",
      index2: "33",
      index3: "51",
      index4: "59",
      color: "simpleLineB",
      idOfLine: "13"
    };
    co["24"] = {
      index1: "81",
      index2: "59",
      index3: "36",
      index4: "33",
      color: "simpleLineB",
      idOfLine: "24"
    };
    co["35"] = {
      index1: "51",
      index2: "59",
      index3: "51",
      index4: "7",
      color: "simpleLineB",
      idOfLine: "35"
    };
    co["46"] = {
      index1: "36",
      index2: "33",
      index3: "81",
      index4: "7",
      color: "simpleLineB",
      idOfLine: "46"
    };

    return co;
  }
  get loadingStatus() {
    return this.$store.getters.loadingStatus;
  }
  get roundNumber() {
    return this.$store.getters.roundNumber;
  }
  get remoteness() {
    return this.$store.getters.game.getRound().getRemoteness();
  }

  get position(): string {
    return this.$store.getters.position;
  }
  get nextMoveDataArray() {
    return this.$store.getters.nextMoveDataArray;
  }

  @Watch("remoteness")
  onSyncremotenessChange(): void {}
  @Watch("roundNumber")
  onSyncRoundChange(): void {
    this.changeColor();
  }

  movesStack1: String[] = [];
  movesStack2: String[] = [];

  lastRoundNumber: number = -1;
  lastMoveArrayLength: number = 15;
  isBlue: boolean = true;

  get game() {
    return this.$store.getters.game;
  }

  get hint() {
    return this.$store.getters.hintVisibility;
  }

  changeColor(): void {
    if (!this.loadingStatus) {
      console.log(this.nextMoveDataArray);
      var array = this.nextMoveDataArray;
      var position = this.position;
      var nums = [
        "12",
        "13",
        "14",
        "15",
        "16",
        "23",
        "24",
        "25",
        "26",
        "34",
        "35",
        "36",
        "45",
        "46",
        "56"
      ];

      var numOfBlue = 0;
      var numOfRed = 0;
      for (var i = 0; i < nums.length; i++) {
        if (position[i] == "x") {
          this.corresponding[nums[i]].color = "blue";
          numOfBlue = numOfBlue + 1;
        } else if (position[i] == "o") {
          this.corresponding[nums[i]].color = "red";
          numOfRed = numOfRed + 1;
        }
      }
      var addtionalCharacter = "";
      if (numOfBlue > numOfRed) {
        addtionalCharacter = "R";
      } else if (numOfRed >= numOfBlue) {
        addtionalCharacter = "B";
      }
      for (var i = 0; i < array.length; i++) {
        array[i].move;
        if (this.hint) {
          this.corresponding[array[i].move].color =
            array[i].moveValue + addtionalCharacter;
        } else {
          this.corresponding[array[i].move].color =
            "simpleLine" + addtionalCharacter;
        }
      }
      if (array.length == 0) {
        console.log("sdfag");
        for (var i = 0; i < nums.length; i++) {
          if (position[i] == "x") {
            continue;
          } else if (position[i] == "o") {
            continue;
          }
          this.corresponding[nums[i]].color = "over";
        }
      }
    }
  }

  runMove(id: string) {
    this.$store.dispatch("runMove", id);
  }
  @Watch("loadingStatus")
  onAsyncRoundChange(): void {
    !this.loadingStatus && this.changeColor();
  }
  @Watch("hint")
  onHintChange(): void {
    !this.loadingStatus && this.changeColor();
  }
}
</script>

<style lang="scss" scoped>
.simpleLineB {
  opacity: 0.25;
  stroke: rgb(219, 219, 78);
  stroke-width: 2;
}
.simpleLineB:hover {
  opacity: 1;
  stroke: blue;
  stroke-width: 2;
  cursor: pointer;
}
.simpleLineR {
  opacity: 0.25;
  stroke: rgb(219, 219, 78);
  stroke-width: 2;
}
.simpleLineR:hover {
  opacity: 1;
  stroke: red;
  stroke-width: 2;
  cursor: pointer;
}
.winB {
  opacity: 0.25;
  stroke: #008000;
  stroke-width: 2;
}
.winB:hover {
  opacity: 1;
  stroke: blue;
  stroke-width: 2;
  cursor: pointer;
}
.loseB {
  opacity: 0.25;
  stroke: #800000;
  stroke-width: 2;
}
.loseB:hover {
  opacity: 1;
  stroke: blue;
  stroke-width: 2;
  cursor: pointer;
}
.winR {
  opacity: 0.25;
  stroke: #008000;
  stroke-width: 2;
}
.winR:hover {
  opacity: 1;
  stroke: red;
  stroke-width: 2;
  cursor: pointer;
}
.loseR {
  opacity: 0.25;
  stroke: #800000;
  stroke-width: 2;
}
.loseR:hover {
  opacity: 1;
  stroke: red;
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
  opacity: 0.25;
  stroke: rgb(179, 219, 186);
  stroke-width: 2;
}
.hint {
  font-size: 2px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  cursor: pointer;
}
.hint:hover {
  cursor: pointer;
}
</style>
