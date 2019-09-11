<template>
  <AppGame></AppGame>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AppGame from "@/components/AppGame.vue";

@Component({
  components: {
    AppGame
  }
})
export default class Game extends Vue {}
</script>
