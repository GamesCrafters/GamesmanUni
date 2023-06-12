<template>
    <button id="app-game-vvh-header-scrolling"
            @click="store.commit(mutationTypes.toggleVvhScrolling, !vvhScrolling)">
        ↕
    </button>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { mutationTypes, useStore } from "../../../scripts/plugins/store";

    const store = useStore();
    const options = computed(() => store.getters.options);
    const vvhScrolling = computed(() => (options.value ? options.value.vvhScrolling : false));
</script>

<style lang="scss" scoped>
    #app-game-vvh-header-scrolling {
        border-radius: 100%;
        font-size: 2rem;
        height: max(2.5rem, min(5vh, 5vw));
        margin: 0.5rem 0;
        width: max(2.5rem, min(5vh, 5vw));
    }
</style>
