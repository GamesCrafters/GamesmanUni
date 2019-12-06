<template>
  <div id="app-games">
    <h2 id="app-games-title">Games</h2>
    <div id="app-games-games-container">
      <router-link
        class="app-games-game"
        v-for="gameData in gameDataArray"
        :key="gameData.id"
        :to="{ name: 'variants', params: { gameId: gameData.id } }"
      >
        <img
          class="app-games-game-logo"
          :src="getLogoSource(gameData)"
          :alt="gameData.name + ' Logo'"
          width="150em"
          height="150em"
        />
        <h3 class="app-games-game-name">{{ gameData.name }}</h3>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { TGameData } from "@/types/internal/TGameData";
import { CGames } from "@/classes/CGames";

@Component
export default class AppGames extends Vue {
  get gameDataArray(): Array<TGameData> {
    return this.$store.getters.gameDataArray;
  }

  getLogoSource(gameData: TGameData): any {
    const logos = require.context("@/assets/", false);
    try {
      if (
        logos(
          "./L" + gameData.id[0].toUpperCase() + gameData.id.slice(1) + ".svg"
        )
      ) {
        return logos(
          "./L" + gameData.id[0].toUpperCase() + gameData.id.slice(1) + ".svg"
        );
      }
    } catch (errorMessage) {
      console.warn(`${gameData.name} game logo does not exist yet.`);
    }
    return logos("./LApp.png");
  }

  created(): void {
    this.$store.dispatch("initGames");
  }
}
</script>

<style lang="scss" scoped>
#app-games-games-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 0 20%;
}

.app-games-game {
  border: 0.04em solid var(--neutralColor);
  border-radius: 0.25em;
  margin: 0.25em;
  padding: 0.25em;
}

.app-games-game-logo,
.app-games-game-name {
  display: block;
  margin: 0.25em auto;
  padding: 0.25em;
}
</style>
