<template>
  <div id="app-games">
    <h2 id="app-games-title">Games</h2>
    <p class="c-text" v-for="game in games" :key="game.id">
      <router-link
        class="c-router-link"
        :to="{ name: 'vGame', params: { solverId: 'c', gameId: game.id } }"
      >
        {{ game.name }}
      </router-link>
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { CGameData } from "@/classes/CGameData";
import * as gamesData from "@/datas/temps/GAMES.json";

@Component
export default class Games extends Vue {
  games: Array<CGameData> = [];

  created() {
    // load games...
    for (let gameData of gamesData.response) {
      let game = new CGameData({
        id: gameData.id,
        name: gameData.name,
        dataBaseUrl: gameData.dataBaseUrl
      });
      this.games.push(game);
    }
    // save games...
    this.$store.commit("games", this.games);
  }
}
</script>

<style scoped lang="scss"></style>
