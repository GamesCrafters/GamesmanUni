<template>
    <div id="app-game-body-board">
        <component :is="getGameBoardComponent" />
    </div>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { useStore } from "../../../scripts/plugins/store";
    import AppGameBodyBoard from "../GameBody/AppGameBodyBoard.vue"
</script>
