<template>
    <div id="app-game-menu-customPos">
        <div id="app-game-menu-customPos-input">
            <button id="app-game-menu-customPos-input-info" @click="showInfo = !showInfo">𝓲</button>
            <textarea
                v-model.lazy="inputPos"
                id="app-game-menu-customPos-input-input"
                placeholder="Enter starting position of game here"
            />
            <button id="app-game-menu-customPos-input-submit" @click="doSomething">Submit</button>
        </div>
        <p v-show="showInfo" id="app-game-menu-customPos-infoText">
            Instructions on how to format the start position...
        </p>
    </div>
</template>

<script lang="ts" setup>
    import { computed, ref } from "vue";
    // import { actionTypes, useStore } from "../../scripts/plugins/store";

    const showInfo = ref(false);
    const inputPos = ref("");
    const doSomething = () => {
        window.alert(inputPos.value);
    }
</script>

<style lang="scss" scoped>
    #app-game-menu-customPos {
        #app-game-menu-customPos-input {
            flex: 1 1 auto;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
            margin: 2rem;
            align-items: center;
            #app-game-menu-customPos-input-info {
                margin-right: 2rem;
                border-radius: 100%;
                font-size: 2rem;
                height: max(2.5rem, min(5vh, 5vw));
                width: max(2.5rem, min(5vh, 5vw));
            }
            #app-game-menu-customPos-input-input {
                border-radius: 1rem;
                border: 0.1rem solid var(--neutralColor);
                padding: 1rem;
                border-spacing: 5rem;
                width: 50vh;
                height: 3vh;
            }
            #app-game-menu-customPos-input-submit {
                padding: 0.5rem;
                margin-left: 2rem;
                border: 0.1rem solid var(--neutralColor);
            }
        }
        #app-game-menu-customPos-infoText {
           padding: 1rem;
           text-align: center;
        }
    }
</style>
