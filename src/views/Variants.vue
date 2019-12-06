<template>
  <GameVariants></GameVariants>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import GameVariants from "@/components/GameVariants.vue";
@Component({
  components: {
    GameVariants
  },
  metaInfo: {
    title: "Variants"
  }
})
export default class Variants extends Vue {}
</script>
