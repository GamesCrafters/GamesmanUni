<template>
  <div id="app-home">
    <h2 id="app-home-title">{{ $t("title") }}</h2>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";

export default class AppWelcome extends Vue {}
</script>

<i18n>
{
  "cn": {
    "title": "欢迎！"
  },
  "en": {
    "title": "Welcome!"
  },
  "es": {
    "title": "¡Bienvenido!"
  },
  "hi": {
    "title": "आपका स्वागत है!"
  }
}
</i18n>
