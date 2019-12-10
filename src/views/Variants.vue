<template>
  <GameVariants></GameVariants>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import GameVariants from "@/components/GameVariants.vue";

@Component({
  components: {
    GameVariants
  }
})
export default class Variants extends Vue {}
</script>
