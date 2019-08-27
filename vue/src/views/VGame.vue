<template>
  <Game></Game>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Game from "@/components/app/Game.vue";

@Component({
  components: {
    Game
  }
})
export default class VGame extends Vue {}
</script>

<style scoped lang="scss"></style>
