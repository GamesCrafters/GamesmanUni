<template>
    <div id="app-game-menu-history-export">
        <h3>Current Move History</h3>
        <textarea id="app-game-menu-history-export-currHist" readonly>{{ moveHistoryText }}</textarea>
        <button class="button unclicked" v-show="!copied" @click="copyToClipboard" title="copy to clipboard">copy to clipboard</button>
        <button class="button clicked" v-show="copied" @click="copyToClipboard" title="copied!">copy to clipboard</button>
        <!-- TODO: Export to file goes here -->
    </div>
</template>

<script lang="ts" setup>
    import { computed, ref } from "vue";
    import { useStore } from "../../../scripts/plugins/store";

    const copied = ref(false);
    const store = useStore();
    const moveHistoryText = computed(() => {
        copied.value = false;
        return store.getters.moveHistory;
    });
    const copyToClipboard = () => {
        navigator.clipboard.writeText(moveHistoryText.value);
        copied.value = true;
    }
</script>

<style lang="scss" scoped>
    #app-game-menu-history-export {
        flex: 1 1 auto;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        justify-content: center;
        align-items: center; 
        #app-game-menu-history-export-currHist {
            width: 15vw;
            height: 15vh;
            text-align: left;
            resize: none;
            border-radius: 1rem;
            border: 0.1rem solid var(--neutralColor);
            padding: 1rem;
            margin-top: 1rem;
        }
        .button {
            margin: 1rem;
            padding: 0 0.5rem;
            border-radius: 10rem;
            border: 0.1rem solid var(--neutralColor);
        }
        .clicked {
            background-color: rgba(76, 220, 37, 0.645);
        }
        // #app-game-menu-history-export-copy {
        //     width: 10rem;
        //     height: 10rem;
        //     margin-top: 2rem;
        //     margin-right: 1rem;
        //     margin-left: 1rem;
        //     margin-bottom: 2rem;
        //     padding: 0 0.5rem;
        //     border-radius: 10rem;
        //     border: 0.1rem solid var(--neutralColor);
        // }
    }
</style>
