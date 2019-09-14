<template>
  <AppWelcome></AppWelcome>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AppWelcome from "@/components/AppWelcome.vue";

@Component({
  components: {
    AppWelcome
  },
  metaInfo: {
    title: "Home"
  }
})
export default class Home extends Vue {}
</script>
