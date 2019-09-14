<template>
  <AppAbout></AppAbout>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AppAbout from "@/components/AppAbout.vue";

@Component({
  components: {
    AppAbout
  },
  metaInfo: {
    title: "About"
  }
})
export default class About extends Vue {}
</script>
