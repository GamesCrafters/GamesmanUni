<template>
    <div id="app-game-body-header-scorecard">
        <button @click="store.commit(mutationTypes.showOptions, true)">📖</button>
    </div>
</template>

<script lang="ts" setup>
    import { computed, ref, watch } from "vue";
    import { mutationTypes, useStore } from "../../../scripts/plugins/store";
    
    const store = useStore();

</script>

<style lang="scss" scoped>
    #app-game-body-header-scorecard {
        button {
            border-radius: 100%;
            font-size: 2rem;
            height: max(2.5rem, min(5vh, 5vw));
            width: max(2.5rem, min(5vh, 5vw));
        }
    }
</style>