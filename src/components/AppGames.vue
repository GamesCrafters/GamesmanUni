<template>
  <div id="app-games">
    <h2 id="app-games-title">Games</h2>
    <p class="c-text" v-for="gameData in gameDatas" :key="gameData.id">
      <router-link
        class="c-link-router"
        :to="{
          name: 'game',
          params: { gameId: gameData.id, gameVariation: 0 }
        }"
      >
        {{ gameData.name }}
      </router-link>
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { CGames } from "@/classes/CGames";

@Component
export default class AppGames extends Vue {
  get gameDatas() {
    return this.$store.getters.gameDatas;
  }
}
</script>
