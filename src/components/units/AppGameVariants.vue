<template>
    <div id="app-game-variants">
        <h2>{{ gameName }}</h2>
        <h3>Game Variants</h3>
        <div id="variants" v-if="game">
            <router-link v-for="variant in gameVariants" :key="variant.id" :to="{ name: 'game', params: { type: gameType, gameId: gameId, variantId: variant.id } }">
                <img :src="getLogoSource(variant.id)" :alt="game.name + ' ' + variant.description + ' Logo'" style="width: 8rem" />
                <p>{{ variant.description }}</p>
                <i>Data Status: {{ variant.status }}</i>
            </router-link>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { useRoute } from "vue-router";
    import { actionTypes, useStore } from "../../scripts/plugins/store";

    const route = useRoute();
    const store = useStore();
    const gameType = computed(() => route.params.type as string);
    const gameId = computed(() => route.params.gameId as string);
    const game = computed(() => store.getters.game(gameType.value, gameId.value));
    const gameName = computed(() => (game.value ? game.value.name : ""));
    const gameVariants = computed(() => game.value.variants.variants);
    const getLogoSource = (variantId: string) => {
        const images = import.meta.globEager("../../models/images/*.png");
        const appLogoFilePath = "../../models/images/logo-gamescrafters.png";
        const regularThumbnailFilePath = `../../models/images/thumbnail-${gameId.value}-regular.png`;
        const VariantThumbnailFilePath = `../../models/images/thumbnail-${gameId.value}-${variantId}.png`;
        try {
            return images[VariantThumbnailFilePath].default;
        } catch (errorMessage) {
            console.warn(`${gameId.value} game's ${variantId} variant logo does not exist yet.`);
            try {
                return images[regularThumbnailFilePath].default;
            } catch (errorMessage) {
                console.warn(`${gameId.value} game's regular variant logo does not exist yet.`);
            }
        }
        return images[appLogoFilePath].default;
    };
    store.dispatch(actionTypes.loadVariants, { type: gameType.value, gameId: gameId.value });
</script>

<style lang="scss" scoped>
    #app-game-variants {
        padding: 1rem 10%;
        > #variants {
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
