<template>
    <div id="app-game">
        <div id="app-game-header">
            <div id="app-game-options"><GameOptions /></div>
            <h2 id="app-game-title">
                {{ game.name }}<br />
                <router-link :to="{ name: 'variants', params: { gameType: route.params.type, gameId: route.params.gameId } }">({{ game.variant.description }})</router-link>
            </h2>
            <div id="app-game-instruction"><GameInstructions /></div>
        </div>
        <div id="app-game-body">
            <div id="app-game-body-main">
                <div id="app-game-body-main-clock">
                    <div v-if="game.options.showDateTime" id="app-game-time">{{ dateTime.format("LTS") }}</div>
                    <div v-if="game.options.showDateTime" id="app-game-date">{{ dateTime.format("LL") }}</div>
                    <div v-if="game.options.showStopWatch" id="app-game-timer">{{ timer.format("HH:mm:ss") }}</div>
                </div>
                <div id="app-game-body-main-function">
                    <button id="app-game-undo" @click="store.dispatch(actionTypes.undoMove)" :disabled="game.round.id <= 1">Undo</button>
                    <button id="app-game-restart" @click="restartGame()">Restart</button>
                    <button id="app-game-redo" @click="store.dispatch(actionTypes.redoMove)" :disabled="game.history.length ? game.round.id == game.history[game.history.length - 1].id : true">Redo</button>
                </div>
                <div id="app-game-body-main-stats">
                    <div id="app-game-round">Move #{{ game.round.id }}</div>
                    <div v-if="game.options.showNextMoveHints" id="app-game-remoteness">Remoteness {{ game.round.remoteness }}</div>
                </div>
                <div v-if="game.options.showNextMoveHints" id="app-game-body-main-prediction">
                    <b id="app-game-prediction-turn-id" :class="'c-turn-' + game.turn">{{ game.round.player.name }}</b>
                    should
                    <span id="app-game-prediction-position-value" :class="'c-' + game.round.positionValue">{{ game.round.positionValue }}</span
                    >.
                </div>
                <div id="app-game-body-main-board"><GameBoard /></div>
            </div>
            <div v-if="game.options.showVisualValueHistory" id="app-game-body-vvh">
                <!-- <GameVisualValueHistory /> -->
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ref, watch } from "vue";
    import moment from "moment";
    import { useRoute } from "vue-router";
    import { actionTypes, useStore } from "../plugins/store";
    import GameOptions from "./GameOptions.vue";
    import GameInstructions from "./GameInstructions.vue";
    import GameBoard from "./GameBoard.vue";
    import GameVisualValueHistory from "./GameVisualValueHistory.vue";

    const route = useRoute();
    const store = useStore();
    const game = ref(store.state.app.game);
    store.dispatch(actionTypes.initiateGame, { type: route.params.type as string, gameId: route.params.gameId as string, variantId: route.params.variantId as string }).then(() => {
        game.value = { ...store.state.app.game };
    });

    let dateTime = ref(moment());
    let timer = ref(moment().startOf("day"));
    const updateInterval = (): void => {
        dateTime.value = moment();
        timer.value.add(1, "s");
    };
    const interval = ref(setInterval((): void => updateInterval(), 1000));
    const initiateInterval = (): void => {
        clearInterval(interval.value);
        timer.value = moment().startOf("day");
        interval.value = setInterval((): void => updateInterval(), 1000);
    };
    initiateInterval();
    const restartGame = async (): Promise<void> => {
        initiateInterval();
        store.dispatch(actionTypes.restartGame);
    };
    watch(
        () => game.value.options.showVisualValueHistory,
        async (): Promise<void> => {
            if (game.value.options.showVisualValueHistory) {
                await new Promise((resolve) => setTimeout(resolve, 500));
                store.dispatch(actionTypes.drawVisualValueHistory);
            }
        }
    );
</script>

<style scoped lang="scss">
    @mixin flexItem($flexDirection: row, $flexWrap: nowrap, $justifyContent: flex-start, $alignItems: stretch, $alignContent: stretch) {
        display: flex;
        flex-direction: $flexDirection;
        flex-wrap: $flexWrap;
        justify-content: $justifyContent;
        align-items: $alignItems;
        align-content: $alignContent;
    }
    @mixin flexContent($flexGrow: 0, $flexShrink: 1, $flexBasis: auto) {
        flex-grow: $flexGrow;
        flex-shrink: $flexShrink;
        flex-basis: $flexBasis;
    }
    #app-game {
        @include flexItem(column, nowrap, flex-start, stretch, stretch);
    }
    #app-game-header {
        @include flexItem(row, nowrap, center, center, stretch);
    }
    #app-game-title {
        border: 0.04em solid var(--neutralColor);
        border-radius: 0.25em;
    }
    #app-game-body {
        @include flexItem(row, wrap, space-between, flex-end, stretch);
        > * {
            @include flexContent(1, 1, 0);
        }
    }
    #app-game-body-main {
        @include flexItem(column, nowrap, flex-start, space-between, stretch);
        margin: 0.25em;
        padding: 0.25em;
    }
    #app-game-body-main-clock {
        @include flexItem(row, nowrap, space-around, stretch, stretch);
        > * {
            @include flexContent(1, 1, 0);
            border: 0.04em solid var(--neutralColor);
            border-radius: 0.25em;
            margin: 0;
            padding: 0.25em;
        }
    }
    #app-game-body-main-function {
        @include flexItem(row, nowrap, space-around, stretch, stretch);
        border: 0.04em solid var(--neutralColor);
        border-radius: 0.25em;
        padding: 0.25em;
        margin: 0;
        > * {
            border-radius: 100%;
            margin: 0.5em;
            padding: 1.5em 1em;
        }
    }
    #app-game-body-main-stats {
        @include flexItem(row, wrap, space-between, stretch, stretch);
        margin: 0;
        padding: 0;
        > * {
            @include flexContent(1, 1, 0);
            border: 0.04em solid var(--neutralColor);
            border-radius: 0.25em;
            margin: 0;
            padding: 0.25em;
        }
    }
    #app-game-body-main-prediction {
        border: 0.04em solid var(--neutralColor);
        border-radius: 0.25em;
        margin: 0;
        padding: 0.25em;
        #app-game-prediction-position-value {
            border-radius: 100%;
            padding-left: 0.25em;
            padding-right: 0.25em;
        }
    }
    #app-game-body-main-board {
        border: 0.04em solid var(--neutralColor);
        border-radius: 0.25em;
        padding: 0.25em;
        margin: 0;
    }
    #app-game-body-vvh {
        margin: 0.25em;
        padding: 0.25em;
    }
</style>
