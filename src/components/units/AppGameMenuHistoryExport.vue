<template>
    <div id="app-game-menu-history-export">
        <h3>Current Move History</h3>
        <textarea id="app-game-menu-history-export-currHist" readonly>{{ moveHistoryText }}</textarea>
        <!-- TODO: Export to file goes here -->
    </div>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { useStore } from "../../scripts/plugins/store";

    const store = useStore();
    const moveHistoryText = computed(() => store.getters.moveHistory);
</script>

<style lang="scss" scoped>
    #app-game-menu-history-export {
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
    }
</style>
