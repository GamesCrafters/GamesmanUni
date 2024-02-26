<template>
    <div id="app-game-variants">
        <h2>{{ gameName }}</h2>
        <h3>{{ t("gameVariantsTitle") }}</h3>
        <div id="variants" v-if="game">
            <router-link v-for="variant in gameVariants" :key="variant.id" :class="variant.gui" :to="{ name: 'game', params: { type: gameType, gameId: gameId, variantId: variant.id } }">
                <img :src="getLogoSource(variant.id)" :alt="'Logo'" style="width: 8rem" />
                <p>{{ variant.name }}</p>
            </router-link>
            <div v-if="gameCustom" v-on:click="customBoardRoute" :class="game.gui">
                <img :src="getLogoSource('custom')" :alt="'Logo'" style="width: 8rem" />
                <p>Custom</p>
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
    store.dispatch(actionTypes.loadVariants, { gameId: gameId.value });

    const game = computed(() => store.getters.game(gameId.value));
    const gameCustom = computed(() => (game.value ? game.value.allowCustomVariantCreation : false));
    const gameName = computed(() => (game.value ? game.value.name : ""));
    const gameVariants = computed(() => {
        let total = game.value.variants;
        const asArray = Object.entries(total);
        if (asArray.length == 1 && !gameCustom.value) {
            router.replace({ name: 'game', params: { type: gameType.value, gameId: gameId.value, variantId: asArray[0][0] } });
        } else {
            return total;
        }
    });
    const getLogoSource = (variantId: string) => {
        const images = import.meta.globEager("../../models/images/thumbnail/*");
        try {
            const variantThumbnailSVGPath = `../../models/images/thumbnail/${gameId.value}-${variantId}.svg`;
            return images[variantThumbnailSVGPath].default;
        } catch (errorMessage) {
            try {
                const variantThumbnailFilePath = `../../models/images/thumbnail/${gameId.value}-${variantId}.png`;
                return images[variantThumbnailFilePath].default;
            } catch (errorMessage) {
                try {
                    const regularThumbnailSVGPath = `../../models/images/thumbnail/${gameId.value}-regular.svg`;
                    return images[regularThumbnailSVGPath].default;
                } catch (errorMessage) {
                    try {
                        const regularThumbnailFilePath = `../../models/images/thumbnail/${gameId.value}-regular.png`;
                        return images[regularThumbnailFilePath].default;
                    } catch (errorMessage) {

                    }
                }
            }
        }
        const logo = import.meta.globEager("../../models/images/logo-gamescrafters.png");
        const appLogoFilePath = "../../models/images/logo-gamescrafters.png";
        return logo[appLogoFilePath].default;
    };
    const customBoardRoute = () => {
        let variantId = window.prompt('Enter a Valid Variant ID:');
        if (variantId !== null) {
            router.push({ name: 'game', params: { type: gameType.value, gameId: gameId.value, variantId: variantId } })
        }
    }
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
                width: 10rem;
                > * {
                    text-align: center;
                }
            }

            > a.v3, div.v3 {
                border: 0.2rem solid purple;
            }

            > a.v2, div.v2 {
                border: 0.2rem solid gold;
            }

            > a.v1, div.v1 {
                border: 0.2rem solid silver;
            }

            > a.v0, div.v0 {
                border: 0.2rem solid #CD7F32;
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
    "zh": {
        "gameVariantsTitle": "请选择游戏变体"
    },
    "en": {
        "gameVariantsTitle": "Game Variants"
    }
}
</i18n>
