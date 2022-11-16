<template>
    <div id="app-games">
        <h2>{{ gameTypeTitle }}</h2>
        <div id="search">
            <input type="text" v-model="search" placeholder="Search for..." @keydown.esc="clearSearch"/> <br>
        </div>
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
    import { computed, ref, watch } from "vue";
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
    const search = ref("");
    const games = computed(() => {
        let unfiltered = store.getters.games(gameType.value).games;
        const asArray = Object.entries(unfiltered);
        const filtered = asArray.filter(([_, value]) => value.name.toLowerCase().includes(search.value.toLowerCase()));
        return Object.fromEntries(filtered);
    });
    store.dispatch(actionTypes.loadGames, { type: gameType.value });
    const clearSearch = () => {
        search.value = "";
    }
    watch(
        () => route.params.type as string,
        () => route.params.type && store.dispatch(actionTypes.loadGames, { type: gameType.value }),
        { immediate: true }
    );
</script>
<style lang="scss" scoped>
    #search {
        align: center;
        margin-top: 1%;
        margin-bottom: 1%;
        height: 2rem;
        float: center;
        border-padding: 5rem;
        padding: 0.5rem;

        justify-content: center;
        border: 0.1rem solid var(--neutralColor);
        border-radius: 1rem;
        border-width: 0.5rem;
        align-border: center;
        margin-left: 40%;
        margin-right: 40%;



    }
    #app-games {
        float: top;
        align: top;
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
