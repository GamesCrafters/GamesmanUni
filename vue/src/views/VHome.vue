<template>
  <CHome></CHome>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CHome from "@/components/CHome.vue";

@Component({
  components: {
    CHome
  }
})
export default class VHome extends Vue {}
</script>

<style scoped lang="scss"></style>
