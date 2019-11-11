<template>
  <div id="app-games">
    <h2 id="app-games-title">Games</h2>
    <p v-for="gameData in gameDataArray" :key="gameData.id">
      <router-link
        :to="{
          name: 'game',
          params: { gameId: gameData.id, gameVariation: 0 }
        }"
        >{{ gameData.name }} (Server Data: {{ gameData.status }})</router-link
      >
    </p>
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

  created(): void {
    this.$store.dispatch("initGames");
  }
}
</script>
