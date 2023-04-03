<template>
    <button id="app-game-vvh-header-instructions"
            @click="store.commit(mutationTypes.showInstructions, true)">
        𝓲
    </button>
</template>

<script lang="ts" setup>
    import { mutationTypes, useStore } from "../../scripts/plugins/store";
    const store = useStore();
</script>

<style lang="scss" scoped>
    #app-game-vvh-header-instructions {
        border-radius: 100%;
        font-size: 2rem;
        height: max(2.5rem, min(5vh, 5vw));
        margin: 0.5rem 0;
        width: max(2.5rem, min(5vh, 5vw));
    }
</style>
