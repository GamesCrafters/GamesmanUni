<template>
    <div id="app-game-vvh">
        <AppGameVvhHeader />
        <AppGameVvhBody :style="{
                            'max-height': vvhMaxHeight,
                            'overflow-y': vvhScrollingStyle
                        }"
        />
    </div>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { useStore } from "../../scripts/plugins/store";
    import AppGameVvhHeader from "./AppGameVvhHeader.vue";
    import AppGameVvhBody from "./AppGameVvhBody.vue";

    const store = useStore();
    const vvhScrolling = computed(() => store.getters.options.vvhScrolling);
    const vvhMaxHeight = computed(() => vvhScrolling.value ? "40em" : "none");
    const vvhScrollingStyle = computed(() => vvhScrolling.value ? "scroll" : "visible");
</script>

<style lang="scss" scoped>
    #app-game-vvh {
        align-content: normal;
        align-items: stretch;
        flex: 3 1 auto;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        justify-content: flex-start;
    }
</style>
