<template>
    <svg viewBox="0 0 122 66" xmlns="http://www.w3.org/2000/svg">
        <template v-for="(id, idx) in remaining" :key="idx">
            <line :class="id.color" @click="runMove(id.idOfLine)" :x1="id.index1" :y1="id.index2" :x2="id.index3" :y2="id.index4" v-on:mouseenter="onMouseHover(id, idx)" v-on:mouseleave="onMouseLeave()" stroke-linecap="round" />
            <line v-if="topLineId != ''" :class="topLineInfo.color" @click="runMove(topLineInfo.idOfLine)" :x1="topLineInfo.index1" :y1="topLineInfo.index2" :x2="topLineInfo.index3" :y2="topLineInfo.index4" v-on:mouseenter="onMouseHover(id, topLineId)" v-on:mouseleave="onMouseLeave()" stroke-linecap="round" />
        </template>
    </svg>
</template>

<script lang="ts" setup>
    import { computed, watch } from "vue";
    import { actionTypes, useStore } from "../plugins/store";

    const store = useStore();

    let topLineId: string | number | symbol = "";
    let topLineInfo: { index1: string; index2: string; index3: string; index4: string; color: string; idOfLine: string } = { index1: "", index2: "", index3: "", index4: "", color: "", idOfLine: "" };
    const onMouseLeave = () => {
        topLineInfo = { index1: "", index2: "", index3: "", index4: "", color: "", idOfLine: "" };
        topLineId = "";
    };
    const onMouseHover = (id: { index1: string; index2: string; index3: string; index4: string; color: string; idOfLine: string }, idx: string | number | symbol): void => {
        topLineInfo = id;
        topLineId = idx;
    };
    const correspond = () => {
        let co: { [id: string]: { index1: string; index2: string; index3: string; index4: string; color: string; idOfLine: string } } = {};
        co["56"] = { index1: "45", index2: "7", index3: "75", index4: "7", color: "simpleLineB", idOfLine: "56" };
        co["16"] = { index1: "75", index2: "7", index3: "90", index4: "33", color: "simpleLineB", idOfLine: "16" };
        co["12"] = { index1: "90", index2: "33", index3: "75", index4: "59", color: "simpleLineB", idOfLine: "12" };
        co["23"] = { index1: "75", index2: "59", index3: "45", index4: "59", color: "simpleLineB", idOfLine: "23" };
        co["34"] = { index1: "45", index2: "59", index3: "30", index4: "33", color: "simpleLineB", idOfLine: "34" };
        co["45"] = { index1: "30", index2: "33", index3: "45", index4: "7", color: "simpleLineB", idOfLine: "45" };
        co["25"] = { index1: "45", index2: "7", index3: "75", index4: "59", color: "simpleLineB", idOfLine: "25" };
        co["36"] = { index1: "75", index2: "7", index3: "45", index4: "59", color: "simpleLineB", idOfLine: "36" };
        co["14"] = { index1: "90", index2: "33", index3: "30", index4: "33", color: "simpleLineB", idOfLine: "14" };
        co["15"] = { index1: "45", index2: "7", index3: "90", index4: "33", color: "simpleLineB", idOfLine: "15" };
        co["26"] = { index1: "75", index2: "7", index3: "75", index4: "59", color: "simpleLineB", idOfLine: "26" };
        co["13"] = { index1: "90", index2: "33", index3: "45", index4: "59", color: "simpleLineB", idOfLine: "13" };
        co["24"] = { index1: "75", index2: "59", index3: "30", index4: "33", color: "simpleLineB", idOfLine: "24" };
        co["35"] = { index1: "45", index2: "59", index3: "45", index4: "7", color: "simpleLineB", idOfLine: "35" };
        co["46"] = { index1: "30", index2: "33", index3: "75", index4: "7", color: "simpleLineB", idOfLine: "46" };
        return co;
    };
    const corresponding: { [id: string]: { index1: string; index2: string; index3: string; index4: string; color: string; idOfLine: string } } = correspond();
    const remaining = computed(() => {
        let copy = JSON.parse(JSON.stringify(corresponding));
        if (topLineId !== "") delete copy[topLineId];
        return copy;
    });
    const changeColor = computed((): void => {
        var array = store.state.app.game.round.availableMoves;
        var position = store.state.app.game.round.position.substring(2);
        var nums = ["12", "13", "14", "15", "16", "23", "24", "25", "26", "34", "35", "36", "45", "46", "56"];
        var numOfBlue = 0;
        var numOfRed = 0;
        for (var i = 0; i < nums.length; i++) {
            if (position[i] == "x") {
                corresponding[nums[i]].color = "blue";
                numOfBlue = numOfBlue + 1;
            } else if (position[i] == "o") {
                corresponding[nums[i]].color = "red";
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
            if (store.state.app.game.options.showNextMoveHints) {
                corresponding[array[i].move].color = array[i].moveValue + addtionalCharacter;
            } else {
                corresponding[array[i].move].color = "simpleLine" + addtionalCharacter;
            }
        }
        if (array.length == 0) {
            for (var i = 0; i < nums.length; i++) {
                if (position[i] == "x") {
                    continue;
                } else if (position[i] == "o") {
                    continue;
                }
                corresponding[nums[i]].color = "over";
            }
        }
    });

    const runMove = (id: string) => {
        if (corresponding[id].color == "red" || corresponding[id].color == "blue" || corresponding[id].color == "over") {
            return;
        }
        store.dispatch(actionTypes.runMove, id);
    };
    watch(
        () => [store.state.app.game.options.showNextMoveHints, store.state.app.game.round.id],
        () => changeColor
    );
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
