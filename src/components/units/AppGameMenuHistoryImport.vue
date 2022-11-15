<template>
    <div id="app-game-menu-history-import">
        <h3>Import Move History</h3>
        <div id="app-game-menu-history-import-text">
            <button id="app-game-menu-history-import-text-info" @click="showInfo = !showInfo">𝓲</button>
            <textarea
                v-model.lazy="inputHist"
                id="app-game-menu-history-import-text-input"
                placeholder="Enter move history of game here"
            />
            <button id="app-game-menu-history-import-text-submit" @click="onTextSubmit">Submit</button>
        </div>
        <!-- TODO: File upload goes here -->
        <p v-show="showInfo" id="app-game-menu-history-import-infoMsg">
            Instructions on how to format the move history...
        </p>
    </div>
</template>

<script lang="ts" setup>
    import { ref } from "vue";
    import { actionTypes, useStore } from "../../scripts/plugins/store";

    const store = useStore();
    const showInfo = ref(false);
    const inputHist = ref("");
    const onTextSubmit = async () => {
        await store.dispatch(actionTypes.loadMoveHistory, { history: inputHist.value });
        inputHist.value = "";
    };
</script>

<style lang="scss" scoped>
    #app-game-menu-history-import {
        #app-game-menu-history-import-text {
            flex: 1 1 auto;
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            justify-content: center;
            margin: 1rem;
            align-items: center;    
            #app-game-menu-history-import-text-info {
                margin-right: 2rem;
                border-radius: 100%;
                font-size: 2rem;
                height: max(2.5rem, min(5vh, 5vw));
                width: max(2.5rem, min(5vh, 5vw));
            }
            #app-game-menu-history-import-text-input {
                border-radius: 1rem;
                border: 0.1rem solid var(--neutralColor);
                padding: 1rem;
                border-spacing: 5rem;
                width: 15vw;
                height: 15vh;
                text-align: left;
                resize: none;
            }
            #app-game-menu-history-import-text-submit {
                padding: 0.3rem;
                margin-left: 2rem;
                border: 0.1rem solid var(--neutralColor);
            }
        }
        #app-game-menu-history-import-infoMsg {
            padding: 1rem;
            text-align: center;
        }
    }
</style>
