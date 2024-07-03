<template>
    <div id="app-game-vvh-header">
        <div id="app-game-vvh-header-left">
            <!-- TODO: implement VVH instructions and change the behavior of the button below. -->
            <AppGameVvhHeaderInstructions class="buttons" title="Show Game Instructions" />
        </div>
        <AppGameVvhHeaderTitle />
        <div id="app-game-vvh-header-right">
            <AppGameVvhHeaderScrollOptions class="buttons" title="Toggle Scrolling" />
        </div>
    </div>
</template>

<script lang="ts" setup>
    import AppGameVvhHeaderScrollOptions from "./AppGameVvhHeaderScrolling.vue";
    import AppGameVvhHeaderInstructions from "./AppGameVvhHeaderInstructions.vue";
    import AppGameVvhHeaderTitle from "./AppGameVvhHeaderTitle.vue";
</script>

<style lang="scss" scoped>
    #app-game-vvh-header {
        align-content: center;
        align-items: center;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-around;
        > * {
            margin: 1rem;
        }
        .buttons {
            margin-right: 0.5rem;
            margin-left: 0.5rem;
        }
    }
</style>
