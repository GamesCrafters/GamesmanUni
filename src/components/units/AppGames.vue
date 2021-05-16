<template>
    <div id="app-games">
        <h2>{{ gameTypeTitle }}</h2>
        <div id="games">
            <router-link v-for="game in games" :key="game.id" :to="{ name: 'variants', params: { type: gameType, gameId: game.id } }">
                <img :src="getLogoSource(game)" :alt="game.name + ' Logo'" style="width: 8rem" />
                <p>{{ game.name }}</p>
                <i>Data Status: {{ game.status }}</i>
            </router-link>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { computed, watch } from "vue";
    import { useRoute } from "vue-router";
    import { actionTypes, useStore } from "../../scripts/plugins/store";
    import type { Game } from "../../scripts/gamesmanUni/types";

    const route = useRoute();
    const store = useStore();
    const getLogoSource = (game: Game) => {
        const images = import.meta.globEager("../../models/images/*.png");
        const appLogoFilePath = "../../models/images/logo-gamescrafters.png";
        const gameThumbnailFilePath = `../../models/images/thumbnail-${game.id}-regular.png`;
        try {
            return images[gameThumbnailFilePath].default;
        } catch (errorMessage) {
            console.warn(`${game.name} game logo does not exist yet.`);
        }
        return images[appLogoFilePath].default;
    };
    const gameType = computed(() => route.params.type as string);
    const gameTypeTitle = computed(() => gameType.value[0].toUpperCase() + gameType.value.slice(1));
    const games = computed(() => store.getters.games(gameType.value).games);
    store.dispatch(actionTypes.loadGames, { type: gameType.value });
    watch(
        () => route.params.type as string,
        () => route.params.type && store.dispatch(actionTypes.loadGames, { type: gameType.value }) && console.log(gameType.value)
    );
</script>

<style lang="scss" scoped>
    #app-games {
        padding: 1rem 10%;
        > #games {
            align-content: center;
            align-items: center;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
            > a {
                border: 0.1rem solid var(--neutralColor);
                border-radius: 1rem;
                margin: 1rem;
                padding: 1rem;
                > * {
                    text-align: center;
                }
            }
        }
    }
</style>
