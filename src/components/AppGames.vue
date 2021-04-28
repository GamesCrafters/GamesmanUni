<template>
    <h2>Games</h2>
    <div id="app-games-games-container">
        <router-link class="app-games-game" v-for="gameData in games" :key="gameData.id" :to="{ name: 'variants', params: { type: 'games', gameId: gameData.id } }">
            <img class="app-games-game-logo" :src="getLogoSource(gameData)" :alt="gameData.name + ' Logo'" width="150" />
            <h3 class="app-games-game-name">{{ gameData.name }}</h3>
            <h4>Data Status: {{ gameData.status }}</h4>
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

    const games: Ref<AppGamesData> = ref([]);
    store.dispatch(actionTypes.loadGames, "games").then(() => {
        if (store.state.app.games) {
            success.value = true;
            games.value = store.state.app.games;
        }
    });

    const getLogoSource = (game: AppGameData) => {
        const images = import.meta.globEager("../models/images/*.png");
        const appLogoFilePath = "../models/images/logo-gamescrafters.png";
        const gameThumbnailFilePath = `../models/images/thumbnail-${game.id}-regular.png`;
        try {
            return images[gameThumbnailFilePath].default;
        } catch (errorMessage) {
            console.warn(`${game.name} game logo does not exist yet.`);
        }
        return images[appLogoFilePath].default;
    };
</script>

<style lang="scss" scoped>
    #app-games-games-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        padding: 0 20%;
    }

    .app-games-game {
        border: 0.04em solid var(--neutralColor);
        border-radius: 0.25em;
        margin: 0.25em;
        padding: 0.25em;
    }

    .app-games-game-logo,
    .app-games-game-name {
        display: block;
        margin: 0.25em auto;
        padding: 0.25em;
    }
</style>
