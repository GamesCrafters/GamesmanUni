<template>
  <div id="app-games">
    <h2 id="app-games-title">Games</h2>
    <p class="c-text" v-for="gameData in gamesData.response" :key="gameData.id">
      <router-link
        class="c-link-router"
        :to="{ name: 'game', params: { gameId: gameData.id } }"
      >
        {{ gameData.name }}
      </router-link>
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { IGamesData } from "@/interfaces/external/IGamesData";
import { GamesData } from "@/classes/external/GamesData";

@Component
export default class CGames extends Vue {
  gamesData: GamesData = new GamesData();

  created() {
    // load games from json (from server later)...
    const GAMESDATA: IGamesData = require("@/datas/temps/GAMESDATA.json");
    this.gamesData = new GamesData(GAMESDATA);
    // save games to store...
    this.$store.dispatch("saveGamesData", this.gamesData);
  }
}
</script>

<style scoped lang="scss"></style>
