<template>
    <div id="app-game-vvh">
        <AppGameVvhHeader />
        <AppGameVvhBody ref="vvhBody"
                        :style="{
                            'max-height': vvhMaxHeight,
                            'overflow-y': vvhScrollingStyle
                        }"
        />
    </div>
</template>

<script lang="ts" setup>
    import { computed, watch, ref, nextTick } from "vue";
    import { useStore } from "../../../scripts/plugins/store";
    import AppGameVvhHeader from "./AppGameVvhHeader.vue";
    import AppGameVvhBody from "./AppGameVvhBody.vue";

    const store = useStore();
    const vvhScrolling = computed(() => store.getters.options.vvhScrolling);
    const vvhMaxHeight = computed(() => vvhScrolling.value ? "40em" : "none");
    const vvhScrollingStyle = computed(() => vvhScrolling.value ? "scroll" : "visible");

    /* VVH autoscrolling */
    const vvhBody = ref();
    const currentRoundId = computed(() => store.getters.currentRoundId);
    watch(
        () => currentRoundId.value,
        async () => {
            if (vvhBody.value) {
                await nextTick();
                vvhBody.value.$el.scrollTop = vvhBody.value.$el.scrollHeight;
            }
        }
    );
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
