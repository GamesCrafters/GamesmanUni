<template>
    <component v-if="customGameBoardExists" :is="regular2DGameBoards[gameBoard]" />
    <component v-else-if="autoguiV2DataExists" :is="AppGameBodyBoardRegular2DImages" />
    <component v-else :is="AppGameBodyBoardFallback" />
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { actionTypes, useStore } from "../../scripts/plugins/store";
    import AppGameBodyBoardFallback from "./AppGameBodyBoardFallback.vue"
    import AppGameBodyBoardRegular2DImages from "./AppGameBodyBoardRegular2DImages.vue";
    import AppGameBoardRegular2DTtt from "./AppGameBodyBoardRegular2DTtt.vue";

    const store = useStore();
    const currentMatch = computed(() => (store.state.app.currentMatch ? store.state.app.currentMatch : undefined));
    const gameId = computed(() => (currentMatch.value ? currentMatch.value.gameId : ""));
    const variantId = computed(() => (currentMatch.value ? currentMatch.value.variantId : ""));
    const gameType = computed(() => (currentMatch.value ? currentMatch.value.gameType : ""));
    const autoguiV2Data = computed(() => store.getters.variant(gameType.value, gameId.value, variantId.value).autogui_v2_data).value;
    const regular2DGameBoards: Record<string, any> = {
        "ttt-misere": AppGameBoardRegular2DTtt,
        "ttt-regular": AppGameBoardRegular2DTtt,
    };
    const gameBoard = computed(() => `${gameId.value}-${variantId.value}`);
    const customGameBoardExists = computed(() => gameBoard.value in regular2DGameBoards);
    const autoguiV2DataExists = (autoguiV2Data != null)
</script>

<style lang="scss" scoped>
    #app-game-board-default-position-value {
        border: 0.04em solid var(--neutralColor);
        border-radius: 0.25em;
        display: inline-block;
        padding: 0.5em;
    }
    #app-game-board-default-moves-buttons {
        padding: 0.5em 20%;
    }
    .app-game-board-default-cell {
        stroke: var(--neutralColor);
        stroke-width: 1;
        fill: var(--backgroundColor);
        // Highlight cells placed with a token
        &.placed {
            fill: var(--neutralColor);
        }
        // Highlight move cells on hover
        g:hover > &.move {
            fill: var(--neutralColor);
        }
    }
    .app-game-board-default-token {
        alignment-baseline: middle;
        text-anchor: middle;
        cursor: default;
        [data-turn="A"] &.move {
            fill: var(--turn1Color);
        }
        [data-turn="B"] &.move {
            fill: var(--turn2Color);
        }
        &.move.hint- {
            &win {
                fill: var(--winColor);
            }
            &draw {
                fill: var(--drawColor);
            }
            &tie {
                fill: var(--tieColor);
            }
            &lose {
                fill: var(--loseColor);
            }
        }
    }
    #app-game-board-default-arrow-marker {
        fill: var(--primaryColor);
        [data-turn="A"] & {
            fill: var(--turn1Color);
        }
        [data-turn="B"] & {
            fill: var(--turn2Color);
        }
        &-win {
            fill: var(--winColor);
        }
        &-draw {
            fill: var(--drawColor);
        }
        &-tie {
            fill: var(--tieColor);
        }
        &-lose {
            fill: var(--loseColor);
        }
    }
    @keyframes pulsing-arrow {
        0% {
            stroke-width: 1;
        }
        100% {
            stroke-width: 1.5;
        }
    }
    .app-game-board-default-arrow {
        stroke: var(--primaryColor);
        [data-turn="A"] & {
            stroke: var(--turn1Color);
        }
        [data-turn="B"] & {
            stroke: var(--turn2Color);
        }
        &.hint- {
            &win {
                stroke: var(--winColor);
            }
            &draw {
                stroke: var(--drawColor);
            }
            &tie {
                stroke: var(--tieColor);
            }
            &lose {
                stroke: var(--loseColor);
            }
        }
        &:hover {
            animation-name: pulsing-arrow;
            animation-duration: 0.3s;
            animation-iteration-count: infinite;
            animation-timing-function: ease-in-out;
            animation-direction: alternate;
        }
    }
    svg {
        height: 20em;
        width: 20em;
        margin: auto;
        vertical-align: middle;
    }
</style>
