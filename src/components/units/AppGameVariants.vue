<template>
    <div id="app-game-variants">
        <h2>{{ gameName }}</h2>
        <h3>{{ t("gameVariantsTitle") }}</h3>
        <div id="variants" v-if="game">
            <router-link v-for="variant in gameVariants" :key="variant.id" :to="{ name: 'game', params: { type: gameType, gameId: gameId, variantId: variant.id } }">
                <img :src="getLogoSource(variant.id)" :alt="game.name + ' ' + variant.description + ' Logo'" style="width: 8rem" />
                <p>{{ variant.description }}</p>
                <i>Data Status: {{ variant.status }}</i>
            </router-link>
            <div v-if="gameCustom" v-on:click="customBoardRoute">
                <img :src="getLogoSource('custom')" :alt="game.name + ' ' + 'Custom Logo'" style="width: 8rem" />
                <p>Custom</p>
                <i>Data Status: N/A</i>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { useRoute } from "vue-router";
    import { router } from "../../scripts/plugins/router";
    import { actionTypes, useStore } from "../../scripts/plugins/store";
    import { useI18n } from "vue-i18n";

    const route = useRoute();
    const store = useStore();
    const { t } = useI18n();
    const gameType = computed(() => route.params.type as string);
    const gameId = computed(() => route.params.gameId as string);
    const game = computed(() => store.getters.game(gameType.value, gameId.value));
    const gameCustom = computed(() => (game.value ? game.value.custom : false));
    const gameName = computed(() => (game.value ? game.value.name : ""));
    const gameVariants = computed(() => {
        let total = game.value.variants.variants;
        const asArray = Object.entries(total);
        if (asArray.length == 1 && !gameCustom.value) {
            router.replace({ name: 'game', params: { type: gameType.value, gameId: gameId.value, variantId: asArray[0][0] } });
        } else {
            return total;
        }
    });
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
    const customBoardRoute = () => {
        let boardStr = window.prompt('Enter a valid board string:');
        if (boardStr !== null) {
            router.push({ name: 'game', params: { type: gameType.value, gameId: gameId.value, variantId: boardStr } })
        }
    }
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
            > a, div {
                border: 0.1rem solid var(--neutralColor);
                border-radius: 1rem;
                margin: 1rem;
                padding: 1rem;
                > * {
                    text-align: center;
                }
            }

            > div {
                cursor: pointer;
                text-decoration: underline;
            }
        }
    }
</style>

<i18n lang="json">
{
    "cn": {
        "gameVariantsTitle": "请选择游戏变体"
    },
    "en": {
        "gameVariantsTitle": "Game Variants"
    }
}
</i18n>
