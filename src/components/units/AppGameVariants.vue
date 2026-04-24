<template>
    <div id="app-game-variants">
        <h2>{{ gameName }}</h2>
        <h3>{{ t("gameVariantsTitle") }}</h3>

        <!-- Special two-step selector for Whole Year Puzzle -->
        <div v-if="isWholeYearPuzzle" id="wyp-selector">
            <div v-if="!selectedMonth" class="wyp-grid">
                <div v-for="(month, mi) in monthNames" :key="'m' + mi"
                    class="wyp-card"
                    @click="selectedMonth = mi + 1">
                    <p>{{ month }}</p>
                </div>
            </div>
            <div v-else>
                <p class="wyp-back" @click="selectedMonth = null">← Back to months</p>
                <h3>{{ monthNames[selectedMonth - 1] }}</h3>
                <div class="wyp-grid">
                    <router-link v-for="d in daysInSelectedMonth" :key="'d' + d"
                        class="wyp-card wyp-day"
                        :to="{ name: 'game', params: { type: gameType, gameId: gameId, variantId: selectedMonth + '-' + d } }">
                        <p>{{ d }}</p>
                    </router-link>
                </div>
            </div>
        </div>

        <!-- Default variant selector -->
        <div id="variants" v-else-if="game">
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
    import { computed, ref } from "vue";
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

    // Whole Year Puzzle special handling
    const isWholeYearPuzzle = computed(() => gameId.value === 'wholeyearpuzzle');
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const daysPerMonth = [31,29,31,30,31,30,31,31,30,31,30,31];
    const selectedMonth = ref<number | null>(null);
    const daysInSelectedMonth = computed(() => {
        if (!selectedMonth.value) return 0;
        return daysPerMonth[selectedMonth.value - 1];
    });
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

    .wyp-back {
        cursor: pointer;
        color: purple;
        margin-bottom: 0.5rem;
        &:hover { text-decoration: underline; }
    }

    .wyp-grid {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1rem;
        padding: 1rem;
    }

    .wyp-card {
        border: 0.2rem solid purple;
        border-radius: 1rem;
        padding: 1.2rem 1.5rem;
        min-width: 8rem;
        text-align: center;
        cursor: pointer;
        font-size: 1.1rem;
        &:hover { background: rgba(128, 0, 128, 0.15); }
    }

    .wyp-day {
        min-width: 4rem;
        padding: 1rem;
        font-size: 1.3rem;
        font-weight: bold;
    }
</style>

<i18n lang="json">
{
    "zh": {
        "gameVariantsTitle": "请选择游戏变体"
    },
    "en-US": {
        "gameVariantsTitle": "Game Variants"
    }
}
</i18n>
