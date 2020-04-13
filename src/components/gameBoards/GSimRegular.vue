<template>
  <div id="app-game-board-sim-regular">
    <svg
      viewBox="0 0 122 66"
      id="viewbox-sim-regular"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        v-for="(id, idx) in remaining"
        :key="idx"
        :class="id.color"
        @click="runMove(id.idOfLine)"
        :x1="id.index1"
        :y1="id.index2"
        :x2="id.index3"
        :y2="id.index4"
        v-on:mouseenter="onMouseHover(id, idx)"
        v-on:mouseleave="onMouseLeave()"
        stroke-linecap="round"
      />
      <line
        v-if="topLineId != ''"
        :key="topLineId"
        :class="topLineInfo.color"
        @click="runMove(topLineInfo.idOfLine)"
        :x1="topLineInfo.index1"
        :y1="topLineInfo.index2"
        :x2="topLineInfo.index3"
        :y2="topLineInfo.index4"
        v-on:mouseenter="onMouseHover(id, topLineId)"
        v-on:mouseleave="onMouseLeave()"
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
  topLineId: string = "";
  topLineInfo: {
    index1: string;
    index2: string;
    index3: string;
    index4: string;
    color: string;
    idOfLine: string;
  } = {
    index1: "",
    index2: "",
    index3: "",
    index4: "",
    color: "",
    idOfLine: "",
  };
  onMouseLeave() {
    this.topLineInfo = {
      index1: "",
      index2: "",
      index3: "",
      index4: "",
      color: "",
      idOfLine: "",
    };
    this.topLineId = "";
  }
  onMouseHover(
    id: {
      index1: string;
      index2: string;
      index3: string;
      index4: string;
      color: string;
      idOfLine: string;
    },
    idx: string
  ): void {
    this.topLineInfo = id;
    this.topLineId = idx;
  }
  get remaining() {
    let copy = JSON.parse(JSON.stringify(this.corresponding));
    if (this.topLineId !== "") {
      delete copy[this.topLineId];
    }
    return copy;
  }
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
      index1: "45",
      index2: "7",
      index3: "75",
      index4: "7",
      color: "simpleLineB",
      idOfLine: "56",
    };
    co["16"] = {
      index1: "75",
      index2: "7",
      index3: "90",
      index4: "33",
      color: "simpleLineB",
      idOfLine: "16",
    };
    co["12"] = {
      index1: "90",
      index2: "33",
      index3: "75",
      index4: "59",
      color: "simpleLineB",
      idOfLine: "12",
    };
    co["23"] = {
      index1: "75",
      index2: "59",
      index3: "45",
      index4: "59",
      color: "simpleLineB",
      idOfLine: "23",
    };
    co["34"] = {
      index1: "45",
      index2: "59",
      index3: "30",
      index4: "33",
      color: "simpleLineB",
      idOfLine: "34",
    };
    co["45"] = {
      index1: "30",
      index2: "33",
      index3: "45",
      index4: "7",
      color: "simpleLineB",
      idOfLine: "45",
    };
    co["25"] = {
      index1: "45",
      index2: "7",
      index3: "75",
      index4: "59",
      color: "simpleLineB",
      idOfLine: "25",
    };
    co["36"] = {
      index1: "75",
      index2: "7",
      index3: "45",
      index4: "59",
      color: "simpleLineB",
      idOfLine: "36",
    };
    co["14"] = {
      index1: "90",
      index2: "33",
      index3: "30",
      index4: "33",
      color: "simpleLineB",
      idOfLine: "14",
    };
    co["15"] = {
      index1: "45",
      index2: "7",
      index3: "90",
      index4: "33",
      color: "simpleLineB",
      idOfLine: "15",
    };
    co["26"] = {
      index1: "75",
      index2: "7",
      index3: "75",
      index4: "59",
      color: "simpleLineB",
      idOfLine: "26",
    };
    co["13"] = {
      index1: "90",
      index2: "33",
      index3: "45",
      index4: "59",
      color: "simpleLineB",
      idOfLine: "13",
    };
    co["24"] = {
      index1: "75",
      index2: "59",
      index3: "30",
      index4: "33",
      color: "simpleLineB",
      idOfLine: "24",
    };
    co["35"] = {
      index1: "45",
      index2: "59",
      index3: "45",
      index4: "7",
      color: "simpleLineB",
      idOfLine: "35",
    };
    co["46"] = {
      index1: "30",
      index2: "33",
      index3: "75",
      index4: "7",
      color: "simpleLineB",
      idOfLine: "46",
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
      var array = this.nextMoveDataArray;
      var position = this.position.substring(2);
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
        "56",
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
    if (
      this.corresponding[id].color == "red" ||
      this.corresponding[id].color == "blue"
    ) {
      return;
    }
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
  stroke: rgb(219, 219, 78);
  stroke-width: 2;
}
.simpleLineB:hover {
  stroke: blue;
  stroke-width: 2;
  cursor: pointer;
}
.simpleLineR {
  stroke: rgb(219, 219, 78);
  stroke-width: 2;
}
.simpleLineR:hover {
  stroke: red;
  stroke-width: 2;
  cursor: pointer;
}
.winB {
  stroke: #008000;
  stroke-width: 2;
}
.winB:hover {
  stroke: blue;
  stroke-width: 2;
  cursor: pointer;
}
.loseB {
  stroke: #800000;
  stroke-width: 2;
}
.loseB:hover {
  stroke: blue;
  stroke-width: 2;
  cursor: pointer;
}
.winR {
  stroke: #008000;
  stroke-width: 2;
}
.winR:hover {
  stroke: red;
  stroke-width: 2;
  cursor: pointer;
}
.loseR {
  stroke: #800000;
  stroke-width: 2;
}
.loseR:hover {
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
