<template>
    <h2 id="app-welcome">{{ t("title") }}</h2>
</template>

<script lang="ts" setup>
    import { useI18n } from "vue-i18n";

    const { t } = useI18n();
</script>

<style lang="scss" scoped>
    #app-welcome {
        font-size: 3rem;
    }
</style>

<i18n lang="json">
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
