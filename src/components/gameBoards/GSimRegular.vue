<template>
  <div id="app-game-board-sim-regular">
    <svg viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg" > 
      <text x="0" y="3" font-size:30px fill="red" class='hint' @click ="hint()">{{hintText}}</text>
      <line v-for="(id, idx) in corresponding" :key='idx'
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
 
  hintText = 'Hide hint';
  lastSizeOfStack1 = 0;
  lastSizeOfStack2 = 0;

  hint():void{
    if(this.hintText == 'Show hint'){
      this.hintText = 'Hide hint'
    }
    else{
      this.hintText = 'Show hint';
    }
    this.changeColor();
  }
  corresponding : {
    [id: string]:{
      index1: string;
      index2: string;
      index3: string;
      index4: string;
      color : string;
      idOfLine: string;
    }
  } = this.correspond();
  correspond(){
    let co : {
    [id: string]:{
      index1: string;
      index2: string;
      index3: string;
      index4: string;
      color: string;
      idOfLine: string;
    } ;
  }={};

  co['56'] = {index1: '18', index2:'7', index3:'48', index4:'7', color:'simpleLineB', idOfLine: '56'};
  co['16'] = {index1: '48', index2:'7', index3:'63', index4:'33', color:'simpleLineB', idOfLine: '16'};
  co['12'] = {index1: '63', index2:'33', index3:'48', index4:'59', color:'simpleLineB', idOfLine: '12'};
  co['23'] = {index1: '48', index2:'59', index3:'18', index4:'59', color:'simpleLineB', idOfLine: '23'};
  co['34'] = {index1: '18', index2:'59', index3:'3', index4:'33', color:'simpleLineB', idOfLine: '34'};
  co['45'] = {index1: '3', index2:'33', index3:'18', index4:'7', color:'simpleLineB', idOfLine: '45'};
  co['25'] = {index1: '18', index2:'7', index3:'48', index4:'59', color:'simpleLineB', idOfLine: '25'};
  co['36'] = {index1: '48', index2:'7', index3:'18', index4:'59', color:'simpleLineB', idOfLine: '36'};
  co['14'] = {index1: '63', index2:'33', index3:'3', index4:'33', color:'simpleLineB', idOfLine: '14'};
  co['15'] = {index1: '18', index2:'7', index3:'63', index4:'33', color:'simpleLineB', idOfLine: '15'};
  co['26'] = {index1: '48', index2:'7', index3:'48', index4:'59', color:'simpleLineB', idOfLine: '26'};
  co['13'] = {index1: '63', index2:'33', index3:'18', index4:'59', color:'simpleLineB', idOfLine: '13'};
  co['24'] = {index1: '48', index2:'59', index3:'3', index4:'33', color:'simpleLineB', idOfLine: '24'};
  co['35'] = {index1: '18', index2:'59', index3:'18', index4:'7', color:'simpleLineB', idOfLine: '35'};
  co['46'] = {index1: '3', index2:'33', index3:'48', index4:'7', color:'simpleLineB', idOfLine: '46'};
  

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

  @Watch("remoteness")
  onSyncremotenessChange(): void {
    var remoteness = this.remoteness ;
    if (remoteness == 0) {
      this.over();
    } else if (remoteness == 15) {
      this.isBlue = true;
      this.changeColor();
      return;
    }
    this.changeColor();
  }
  @Watch("roundNumber")
  onSyncRoundChange(): void {
    var roundNumber = this.$store.getters.roundNumber;
    if (roundNumber > this.lastRoundNumber) {
      this.lastRoundNumber = roundNumber;
      
        if(this.movesStack1.length == this.lastSizeOfStack1 + 1 && this.movesStack2.length == this.lastSizeOfStack2){
        }
        else{
          var move = this.movesStack2.pop();
        if(move!=undefined){
          this.isBlue = !this.isBlue;
          this.movesStack1.push(move);
        var idString = move.substr(0, 2);
        var id = +idString;
        var colorOfLineString = move.substr(2, 4);
        var isBlue = colorOfLineString == "true" ? true : false;
        this.corresponding[idString].color = isBlue ? "blue": "red";
        }
        }
    } else if (roundNumber < this.lastRoundNumber) {
      this.lastRoundNumber = roundNumber;
      var lastMove = this.movesStack1.pop();
      this.isBlue = !this.isBlue;
      if (lastMove != undefined) this.movesStack2.push(lastMove);
    }
     this.changeColor();
     this.lastSizeOfStack1 = this.movesStack1.length;
     this.lastSizeOfStack2 = this.movesStack2.length;

  }
  over(): void {
    for (let key in this.corresponding) {
          let value = this.corresponding[key];
          if (
            value.color == "simpleLineB" ||
            value.color == "simpleLineR" ||
            value.color == "winR" ||
            value.color == "loseR" ||
            value.color == "winB" ||
            value.color == "loseB" 
          ){
            value.color = "over";
          } 
    }
  }

  movesStack1: String[] = [];
  movesStack2: String[] = [];
  
  lastRoundNumber: number = -1;
  lastMoveArrayLength: number = 15;
  isBlue: boolean = true;

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
      if(this.hintText == "Hide hint"){
         this.corresponding[idString].color = colorString + (this.isBlue?"B":"R");
      }
      else{
        this.corresponding[idString].color = "simpleLine" + (this.isBlue?"B":"R");
      }
    }
  }
  
 
  runMove(id: string) {
    if (this.$store.getters.game.getRound().getNextMoveDataArray().length == 0) {
      this.over();
    } else {
      if (this.corresponding[id].color == "blue" || this.corresponding[''+id].color == "red"){
        return;
      }
      this.corresponding[id].color = this.isBlue ? "blue" : "red";
      this.movesStack1.push("" + id + this.isBlue);

      this.lastMoveArrayLength = this.$store.getters.game
        .getRound()
        .getNextMoveDataArray().length;
      this.isBlue = !this.isBlue;
      var array = this.$store.getters.game.getRound().getNextMoveDataArray();
      var length = this.$store.getters.game.getRound().getNextMoveDataArray()
        .length;
      for (var i = 0; i < length; i++) {
        if (+id == array[i].move) {
          this.$store.dispatch("runMove", array[i].move);
        }
      }
    
    }
  }
@Watch("loadingStatus")
  onAsyncRoundChange(): void {
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
.hint{
  font-size:2px;
  -webkit-user-select: none;
   -moz-user-select: none;
   -ms-user-select: none;
   user-select: none;
  cursor: pointer;
}
.hint:hover{
  cursor: pointer;
}
</style>