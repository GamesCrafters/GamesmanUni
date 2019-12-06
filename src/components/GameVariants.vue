<template>
  <div id="app-game-variants">
    <h2 id="app-game-variants-title">{{ gameName }}</h2>
    <h3 id="app-game-variants-subtitle">Game Variants</h3>
    <div id="app-game-variants-variants-container">
      <router-link
        class="app-game-variants-variant"
        v-for="variantData in variantDataArray"
        :key="variantData.id"
        :to="{
          name: 'game',
          params: { gameId: gameId, variantId: variantData.id }
        }"
      >
        <img
          class="app-game-variants-variant-logo"
          :src="getLogoSource(variantData)"
          :alt="gameName + ' ' + variantData.description + ' Logo'"
          width="150em"
          height="150em"
        />
        <h3 class="app-game-variants-variant-description">
          {{ variantData.description }}
        </h3>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { TVariantData } from "@/types/internal/TVariantData";
import { CGame } from "../classes/CGame";

@Component
export default class GameVariants extends Vue {
  get gameId(): string {
    return this.$store.getters.gameId;
  }

  get gameName(): string {
    return this.$store.getters.gameName;
  }

  get variantDataArray(): Array<TVariantData> {
    return this.$store.getters.variantDataArray;
  }

  getLogoSource(variantData: TVariantData): any {
    const logos = require.context("@/assets/", false);
    try {
      if (
        logos(
          "./L" +
            this.gameId[0].toUpperCase() +
            this.gameId.slice(1) +
            variantData.id[0].toUpperCase() +
            variantData.id.slice(1) +
            ".svg"
        )
      ) {
        return logos(
          "./L" +
            this.gameId[0].toUpperCase() +
            this.gameId.slice(1) +
            variantData.id[0].toUpperCase() +
            variantData.id.slice(1) +
            ".svg"
        );
      }
    } catch (errorMessage) {
      console.warn(`${this.gameName} game logo does not exist yet.`);
    }
    return logos("./LApp.png");
  }

  async created(): Promise<void> {
    if (this.$store.getters.gameId != this.$route.params.gameId) {
      const oldGame: CGame = this.$store.getters.game;
      this.$store.commit("game", new CGame());
      this.$store.commit("options", oldGame.getOptions());
    }
    await this.$store.dispatch("initGame", this.$route.params.gameId);
  }
}
</script>

<style lang="scss" scoped>
#app-game-variants-variants-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 0 20%;
}
.app-game-variants-variant {
  border: 0.04em solid var(--neutralColor);
  border-radius: 0.25em;
  margin: 0.25em;
  padding: 0.25em;
}
.app-game-variants-variant-logo,
.app-game-variants-variant-description {
  display: block;
  margin: 0.25em auto;
  padding: 0.25em;
}
</style>
