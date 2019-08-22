<template>
  <AppHome></AppHome>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AppHome from "./../components/AppHome.vue";

@Component({
  components: {
    AppHome
  }
})
export default class Home extends Vue {}
</script>

<style scoped lang="scss"></style>
