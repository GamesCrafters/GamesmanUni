<template>
    <button id="app-game-vvh-header-legend"
            @click="store.commit(mutationTypes.showVvhGuides, !showVvhGuides)">
        {{ buttonChar }}
    </button>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { mutationTypes, useStore } from "../../../scripts/plugins/store";

    const store = useStore();
    const options = computed(() => store.getters.options);
    const showVvhGuides = computed(() => (options.value ? options.value.showVvhGuides : true));
    const buttonChar = computed(() => (showVvhGuides.value ? "∧" : "∨"));
</script>

<style lang="scss" scoped>
    #app-game-vvh-header-legend {
        border-radius: 100%;
        font-size: 2rem;
        height: max(2.5rem, min(5vh, 5vw));
        margin: 0.5rem 0;
        width: max(2.5rem, min(5vh, 5vw));
    }
</style>
