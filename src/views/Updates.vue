<template>
  <AppUpdates></AppUpdates>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AppUpdates from "@/components/AppUpdates.vue";

@Component({
  components: {
    AppUpdates
  },
  metaInfo: {
    title: "Updates"
  }
})
export default class Updates extends Vue {}
</script>
