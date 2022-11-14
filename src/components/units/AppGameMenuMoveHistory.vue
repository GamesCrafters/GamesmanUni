<template>
    <div id="app-game-menu-moveHist">
        <div id="app-game-menu-moveHist-input">
            <button id="app-game-menu-moveHist-input-info" @click="showInfo = !showInfo">𝓲</button>
            <textarea
                v-model.lazy="inputHist"
                id="app-game-menu-moveHist-input-input"
                placeholder="Enter move history of game here"
            />
            <button id="app-game-menu-moveHist-input-submit" @click="doSomething">Submit</button>
        </div>
        <p v-show="showInfo" id="app-game-menu-moveHist-infoText">
            Instructions on how to format the move history...
        </p>
    </div>
</template>

<script lang="ts" setup>
    import { computed, ref } from "vue";
    // import { actionTypes, useStore } from "../../scripts/plugins/store";
    import AppGameMenuMoveHistoryFileUpload from "./AppGameMenuMoveHistoryFileUpload.vue";

    const showInfo = ref(false);
    const inputHist = ref("");
    const doSomething = () => {
        window.alert(inputHist.value);
    }
</script>

<style lang="scss" scoped>
    #app-game-menu-moveHist {
        #app-game-menu-moveHist-input {
            flex: 1 1 auto;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
            margin: 2rem;
            align-items: center;
            #app-game-menu-moveHist-input-info {
                margin-right: 2rem;
                border-radius: 100%;
                font-size: 2rem;
                height: max(2.5rem, min(5vh, 5vw));
                width: max(2.5rem, min(5vh, 5vw));
            }
            #app-game-menu-moveHist-input-input {
                border-radius: 1rem;
                border: 0.1rem solid var(--neutralColor);
                padding: 1rem;
                border-spacing: 5rem;
                width: 50vh;
                height: 6vh;
            }
            #app-game-menu-moveHist-input-submit {
                padding: 0.5rem;
                margin-left: 2rem;
                border: 0.1rem solid var(--neutralColor);
            }
        }
        #app-game-menu-moveHist-infoText {
        padding: 1rem;
        text-align: center;
        }
    }
</style>
