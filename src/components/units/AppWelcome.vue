<template>
    <div class="welcome">
        <div class="welcome-banner">{{ t("banner") }}</div>
        <div class="content-sections">
            <div class="left-section">
                <h2 id="title">{{ t("title") }}</h2>
                <p id="game-counts">
                    <strong>{{ gameCount }}+</strong> {{ t("gamesCount") }}
                    &
                    <strong>{{ puzzleCount }}+</strong> {{ t("puzzlesCount") }}
                </p>
                <button id="explore-button">Explore</button>
            </div>
            <div class="right-section">
                <img src="@/models/images/landing/hero.png" class="hero" :alt="t('heroAlt')" :title="t('heroTitle')"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { useI18n } from "vue-i18n";
    import { useRouter } from "vue-router";
    import { actionTypes, useStore } from "../../scripts/plugins/store";
    import { computed, onMounted } from "vue";
    import { Game } from "../../scripts/gamesmanUni/types";

    const { t } = useI18n();
    const router = useRouter();
    const store = useStore();

    const exploreGames = () => {
        router.push("/games");
    }

    onMounted(() => {
        if (Object.keys(store.getters.games).length !== 0) return;
        store.dispatch(actionTypes.loadGames);
    });

    const allGames = computed<Game[]>(() => Object.values(store.state.app.games));
    
    const gameCount = computed(() => {
        const games = allGames.value.filter(game => game.type === "twoPlayer")
        return games.length > 0 ? games.length : 54;
    });

    const puzzleCount = computed(() => {
        const puzzles = allGames.value.filter(game => game.type === "onePlayer")
        return puzzles.length > 0 ? puzzles.length : 9;
    });

</script>

<style lang="scss" scoped>
    @import "@/styles/themes";

    .welcome {
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .welcome-banner {
        width: 100%;
        margin-top: 0;
        text-align: center;
    }

    .content-sections {
        display: flex;
        flex-direction: row;
        width: 100%;
        padding: 3rem 5%;
    }

    .left-section {
        flex: 2;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 5rem;
    }

    .right-section {
        flex: 3;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .hero {
        max-width: 100%;
        height: auto;
    }

    #title {
        font-size: 4rem;
        line-height: 1.2;
        margin: 0;
    }

    #game-counts {
        strong {
            font-weight: 800;
            font-size: 2rem;
        }
        font-size: 2rem;
    }

    #explore-button {
        padding: 0.75rem 2rem;
        font-size: 1.2rem;
        border: none;
        border-radius: 0.1rem;
        background-color: var(--accentColor);
        cursor: pointer;
        transition: background-color 0.2s ease;
    }

    #explore-button:hover {
        background-color: #0056b3;
    }
</style>

<i18n lang="json">
    {
        "en-US": {
            "title": "Play and visualize abstract games and puzzles!",
            "banner": "Celebrating 25 years and counting! Meet the amazing team behind the games!",
            "gamesCount": "games integrated",
            "puzzlesCount": "puzzles strongly solved!",
            "heroAlt": "Fall 2025 Small Puzzles Projects.",
            "heroTitle": "Designed by GamesCrafter Maria Rufova."
        },
        "es": {
            "title": "¡Juega y visualiza juegos y rompecabezas abstractos!",
            "banner": "¡Celebrando 25 años y contando! ¡Conoce al increíble equipo que está detrás de los juegos!"
        }
    }
</i18n>
  