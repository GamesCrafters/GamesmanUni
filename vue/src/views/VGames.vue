<template>
  <Games></Games>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Games from "@/components/app/Games.vue";

@Component({
  components: {
    Games
  }
})
export default class VGames extends Vue {}
</script>

<style scoped lang="scss"></style>
