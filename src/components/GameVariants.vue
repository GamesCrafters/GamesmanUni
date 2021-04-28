<template>
    <h2>{{ game.name }}</h2>
    <h3>Game Variants</h3>
    <div id="container">
        <router-link class="variant" v-for="variant in game.variants" :key="variant.id" :to="{ name: 'game', params: { type: game.type, gameId: game.id, variantId: variant.id } }">
            <img class="variant-logo" :src="getLogoSource(variant.id)" :alt="game.name + ' ' + variant.description + ' Logo'" width="150" />
            <h3 class="variant-description">{{ variant.description }}</h3>
            <h4 class="variant-data-status">Data Status: {{ variant.status }}</h4>
        </router-link>
    </div>
</template>

<script lang="ts" setup>
    import { ref } from "vue";
    import { useRoute } from "vue-router";
    import { actionTypes, useStore } from "../plugins/store";
    import { defaultApp } from "../models/datas/defaultApp";

    const route = useRoute();
    const store = useStore();
    const game = ref(defaultApp.game);

    store.dispatch(actionTypes.loadVariants, { type: route.params.type as string, gameId: route.params.gameId as string }).then(() => {
        game.value = { ...store.state.app.game };
    });

    const getLogoSource = (variantId: string) => {
        const images = import.meta.globEager("../models/images/*.png");
        const appLogoFilePath = "../models/images/logo-gamescrafters.png";
        const regularThumbnailFilePath = `../models/images/thumbnail-${game.value.id}-regular.png`;
        const VariantThumbnailFilePath = `../models/images/thumbnail-${game.value.id}-${variantId}.png`;
        try {
            return images[VariantThumbnailFilePath].default;
        } catch (errorMessage) {
            console.warn(`${game.value.name} game's ${variantId} variant logo does not exist yet.`);
            try {
                return images[regularThumbnailFilePath].default;
            } catch (errorMessage) {
                console.warn(`${game.value.name} game's regular variant logo does not exist yet.`);
            }
        }
        return images[appLogoFilePath].default;
    };
</script>

<style lang="scss" scoped>
    #container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        padding: 0 20%;
    }
    .variant {
        border: 0.04em solid var(--neutralColor);
        border-radius: 0.25em;
        margin: 0.25em;
        padding: 0.25em;
    }
    .variant-logo,
    .variant-description {
        display: block;
        margin: 0.25em auto;
        padding: 0.25em;
    }
</style>
