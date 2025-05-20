<template>
    <div id="app-games">
        <input id="searchbar" type="text" v-model="search" @keydown.esc="search = ''" :placeholder="'Search for ' + gameType" /> <br />

        <g v-for="category in categories" :key="category.id">
            <g v-if="category.members.length > 0">
                <h2>{{ gameTypeTitle }} with{{ category.name }}</h2>
                <div class="games">
                    <g v-for="member in category.members" :key="member.id">
                        <router-link :class="category.id" v-if="member.gui === category.id" :to="{ name: 'variants', params: { type: gameType, gameId: member.id } }">
                            <img :src="getLogoSource(member)" style="width: 8rem" />
                            <p :style="member.name.length < 17 ? 'font-size: 100%' : 'font-size: 90%'" >{{ member.name }}</p>
                        </router-link>
                    </g>
                </div>
            </g>
        </g>
    </div>
</template>

<script lang="ts" setup>
    import { computed, onMounted, ref } from "vue";
    import { useRoute } from "vue-router";
    import { actionTypes, useStore } from "../../scripts/plugins/store";
    import type { Game } from "../../scripts/gamesmanUni/types";

    const route = useRoute();
    const store = useStore();
    const getLogoSource = (game: Game) => {
        const images = import.meta.globEager("../../models/images/thumbnail/*");
        try {
            const regularThumbnailSVGPath = `../../models/images/thumbnail/${game.id}-regular.svg`;
            return images[regularThumbnailSVGPath].default;
        } catch (errorMessage) {
            try {
                const regularThumbnailFilePath = `../../models/images/thumbnail/${game.id}-regular.png`;
                return images[regularThumbnailFilePath].default;
            } catch (errorMessage) {

            }
        }
        const logo = import.meta.globEager("../../models/images/logo-gamescrafters.png");
        const appLogoFilePath = "../../models/images/logo-gamescrafters.png";
        return logo[appLogoFilePath].default;
    }
    const gameType = computed(() => route.params.type as string);
    const gameTypeStr = computed(() => gameType.value === "puzzles" ? "onePlayer" : "twoPlayer");
    const gameTypeTitle = computed(() => gameType.value[0].toUpperCase() + gameType.value.slice(1));
    const search = ref("");

    interface Category {
        id: string;
        name: string;
        members: Game[];
    }

    const categories = computed(() => {
        let categories: Category[] = [];
        const asArray = Object.values(store.getters.games);
        for (const strs of [["v3", " Animated GUIs"], ["v2", " Artisan GUIs"], ["v1", " Standard GUIs"], ["v0", "out GUIs (Still in Development)"]]) {
            categories.push({
                id: strs[0],
                name: strs[1],
                members: asArray.filter((value) => value.type === gameTypeStr.value && value.name.toLowerCase().includes(search.value.toLowerCase()) && value.gui === strs[0])
            });
        }
        return categories;
    });

    onMounted(() => {
        if (Object.keys(store.getters.games).length !== 0) return;
        store.dispatch(actionTypes.loadGames);
    });
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

        g {
            h2 {
                align-content: center;
                align-items: center;
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                justify-content: center;
                margin-top: 2rem;
            }

            .games {
                align-content: center;
                align-items: center;
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                justify-content: center;
                g {
                    align-content: center;
                    align-items: center;
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    justify-content: center;
                    a {
                        border: 0.2rem solid var(--neutralColor);
                        border-radius: 1rem;
                        margin: 1rem;
                        padding: 1rem;
                        > * {
                            text-align: center;
                        }
                    }

                    a.v3 {
                        border: 0.2rem solid rgb(180, 27, 180);
                    }

                    a.v2 {
                        border: 0.2rem solid gold;
                    }

                    a.v1 {
                        border: 0.2rem solid silver;
                    }

                    a.v0 {
                        border: 0.2rem solid #cd7f32;
                    }
                }
            }
        }
    }
</style>
