<template>
    <h2>puzzles</h2>
    <div id="app-puzzles-puzzles-container">
        <router-link class="app-puzzles-puzzle" v-for="puzzle in puzzles" :key="puzzle.id" :to="{ name: 'variants', params: { type: 'puzzles', gameId: puzzle.id } }">
            <img class="app-puzzles-puzzle-logo" :src="getLogoSource(puzzle)" :alt="puzzle.name + ' Logo'" width="100" />
            <h3 class="app-puzzles-puzzle-name">{{ puzzle.name }}</h3>
            <h4>Data Status: {{ puzzle.status }}</h4>
        </router-link>
    </div>
</template>

<script lang="ts" setup>
    import { ref } from "vue";
    import type { Ref } from "vue";
    import { actionTypes, useStore } from "../plugins/store";
    import type { AppGameData, AppGamesData } from "../scripts/gamesmanUniTypes";

    const store = useStore();

    const success = ref(false);

    const puzzles: Ref<AppGamesData> = ref([]);
    store.dispatch(actionTypes.loadGames, "puzzles").then(() => {
        if (store.state.app.puzzles) {
            success.value = true;
            puzzles.value = store.state.app.puzzles;
        }
    });

    const getLogoSource = (puzzle: AppGameData) => {
        const images = import.meta.globEager("../models/images/*.png");
        const appLogoFilePath = "../models/images/logo-gamescrafters.png";
        const puzzleThumbnailFilePath = `../models/images/thumbnail-${puzzle.id}-regular.png`;
        try {
            return images[puzzleThumbnailFilePath].default;
        } catch (errorMessage) {
            console.warn(`${puzzle.name} puzzle logo does not exist yet.`);
        }
        return images[appLogoFilePath].default;
    };
</script>

<style lang="scss" scoped>
    #app-puzzles-puzzles-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        padding: 0 10%;
    }

    .app-puzzles-puzzle {
        border: 0.04em solid var(--neutralColor);
        border-radius: 0.25em;
        margin: 0.25em;
        padding: 0.25em;
    }

    .app-puzzles-puzzle-logo,
    .app-puzzles-puzzle-name {
        display: block;
        margin: 0.25em auto;
        padding: 0.25em;
    }
</style>
