<template>
  <AppPageNotFound></AppPageNotFound>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AppPageNotFound from "@/components/AppPageNotFound.vue";

@Component({
  components: {
    AppPageNotFound
  },
  metaInfo: {
    title: "Page Not Found"
  }
})
export default class PageNotFound extends Vue {}
</script>
