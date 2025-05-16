<template>
<div class="welcome">
    <h2 id="app-welcome">Play and visualize abstract strategy games!</h2>
    <p id="game-info"><strong>{{gameCount}}+</strong> games integrated &emsp;&emsp;&emsp; <strong>{{puzzleCount}}+</strong> puzzles strongly solved</p>
    <div class="explore-buttons-container">
        <button @click="exploreAllGames">Explore All Games</button>
        <button @click="exploreAllPuzzles">Explore All Puzzles</button>
    </div>
    <div class="bottom-right-buttons-container">
      <button class="home-button" onclick="window.location.href='//github.com/GamesCrafters/GamesmanUni'">
        <img src="../../models/images/homebutton-github.png" alt="GitHub">
      </button>
      <button class="home-button" @click="infoGames">
        <img src="../../models/images/homebutton-info.png" alt="Info">
      </button>
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

    const exploreAllGames = () => {
        router.push("/games");
    }
    const exploreAllPuzzles = () => {
        router.push("/puzzles");
    }
    const infoGames = () => {
        router.push("/about");
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
.welcome {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
}

#app-welcome {
    font-size: 3rem;
    margin-bottom: 4.5rem;
}

#game-info {
    font-size: 1.5rem;
    margin-bottom: 4rem;
}

#game-info strong {
    font-size: 1.5rem;
    font-weight: bold;
}

button {
    display: inline-block;
    background-color: #001378;
    color: #fff;
    padding: 12px 24px;
    text-decoration: none;
    font-size: 18px;
    border-radius: 10px;
    transition: background-color 0.4s ease;
}

.bottom-right-buttons-container {
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
  padding-right: 20px;
  padding-bottom: 65px;
}

.explore-buttons-container {
    display: flex;
    gap: 20px;
}

.home-button {
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  outline: none;
  box-shadow: none;
}

.home-button img {
  width: 50px;
  height: 50px;
}

</style>

<i18n lang="json">
    {
        "zh": {
            "title": "欢迎！"
        },
        "en-US": {
            "title": "Welcome! "
        },
        "es": {
            "title": "¡Bienvenido!"
        },
        "hi": {
            "title": "आपका स्वागत है!"
        }
    }
</i18n>
  