<template>
    <div id="app-games">
        <input id="searchbar" type="text" v-model="search" @keydown.esc="search = ''" :placeholder="'Search for ' + gameType" /> <br />
        <div id="category-header" v-if="Object.keys(gamesV3).length">
            <h2>{{ gameTypeTitle }} with Artisan Animated GUIs</h2>
        </div>
        <div id="games">
            <router-link class="v3" v-for="game in gamesV3" :key="game.id" :to="{ name: 'variants', params: { type: gameType, gameId: game.id } }">
                <img :src="getLogoSource(game)" :alt="game.name + ' Logo'" style="width: 8rem" />
                <p>{{ game.name }}</p>
            </router-link>
        </div>
        <div id="category-header" v-if="Object.keys(gamesV2).length">
            <h2>{{ gameTypeTitle }} with Artisan GUIs</h2>
        </div>
        <div id="games">
            <router-link class="v2" v-for="game in gamesV2" :key="game.id" :to="{ name: 'variants', params: { type: gameType, gameId: game.id } }">
                <img :src="getLogoSource(game)" :alt="game.name + ' Logo'" style="width: 8rem" />
                <p>{{ game.name }}</p>
            </router-link>
        </div>
        <div id="category-header" v-if="Object.keys(gamesV1).length">
            <h2>{{ gameTypeTitle }} with Standard GUIs</h2>
        </div>
        <div id="games">
            <router-link class="v1" v-for="game in gamesV1" :key="game.id" :to="{ name: 'variants', params: { type: gameType, gameId: game.id } }">
                <img :src="getLogoSource(game)" :alt="game.name + ' Logo'" style="width: 8rem" />
                <p>{{ game.name }}</p>
            </router-link>
        </div>
        <div id="category-header" v-if="Object.keys(gamesV0).length">
            <h2>{{ gameTypeTitle }} without GUIs (Still in Development)</h2>
        </div>
        <div id="games">
            <router-link class="v0" v-for="game in gamesV0" :key="game.id" :to="{ name: 'variants', params: { type: gameType, gameId: game.id } }">
                <img :src="getLogoSource(game)" :alt="game.name + ' Logo'" style="width: 8rem" />
                <p>{{ game.name }}</p>
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
    const images = import.meta.globEager("../../models/images/thumbnail/*.png");
    const logo = import.meta.globEager("../../models/images/logo-gamescrafters.png");
    const appLogoFilePath = "../../models/images/logo-gamescrafters.png";
    const gameThumbnailFilePath = `../../models/images/thumbnail/${game.id}-regular.png`;
    try {
        return images[gameThumbnailFilePath].default;
    } catch (errorMessage) {
        //console.warn(`${game.name} game logo does not exist yet.`);
    }
    return logo[appLogoFilePath].default;
};
const gameType = computed(() => route.params.type as string);
const gameTypeTitle = computed(() => gameType.value[0].toUpperCase() + gameType.value.slice(1));
const search = ref("");

const gamesV0 = computed(() => {
    let unfiltered = store.getters.games(gameType.value).games;
    const asArray = Object.entries(unfiltered);
    const filtered = asArray.filter(([_, value]) => value.name.toLowerCase().includes(search.value.toLowerCase()) && value.gui_status === "v0");
    return Object.fromEntries(filtered);
});
const gamesV1 = computed(() => {
    let unfiltered = store.getters.games(gameType.value).games;
    const asArray = Object.entries(unfiltered);
    const filtered = asArray.filter(([_, value]) => value.name.toLowerCase().includes(search.value.toLowerCase()) && value.gui_status === "v1");
    return Object.fromEntries(filtered);
});
const gamesV2 = computed(() => {
    let unfiltered = store.getters.games(gameType.value).games;
    const asArray = Object.entries(unfiltered);
    const filtered = asArray.filter(([_, value]) => value.name.toLowerCase().includes(search.value.toLowerCase()) && value.gui_status === "v2");
    return Object.fromEntries(filtered);
});
const gamesV3 = computed(() => {
    let unfiltered = store.getters.games(gameType.value).games;
    const asArray = Object.entries(unfiltered);
    const filtered = asArray.filter(([_, value]) => value.name.toLowerCase().includes(search.value.toLowerCase()) && value.gui_status === "v3");
    return Object.fromEntries(filtered);
});
store.dispatch(actionTypes.loadGames, { type: gameType.value });
watch(
    () => route.params.type as string,
    () => route.params.type && store.dispatch(actionTypes.loadGames, { type: gameType.value }),
    { immediate: true }
);
</script>

<style lang="scss" scoped>
#app-games {
    float: top;
    padding: 1rem 10%;
    > #searchbar {
        border: 0.4rem solid var(--neutralColor);
        border-radius: 1rem;
        width: 37%;
        height: 2rem;
        font-size: 150%;
        margin: 1rem;
    }
    > #category-header {
        align-content: center;
        align-items: center;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        > h2 {
            margin-top: 2rem;
        }
    }
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

        > a.v3 {
            border: 0.2rem solid purple;
        }

        > a.v2 {
            border: 0.2rem solid gold;
        }

        > a.v1 {
            border: 0.2rem solid silver;
        }

        > a.v0 {
            border: 0.2rem solid #cd7f32;
        }
    }
}
</style>
