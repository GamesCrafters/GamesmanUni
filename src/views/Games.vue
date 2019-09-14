<template>
  <AppGames></AppGames>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AppGames from "@/components/AppGames.vue";

@Component({
  components: {
    AppGames
  },
  metaInfo: {
    title: "Games"
  }
})
export default class Games extends Vue {}
</script>
