<template>
    <div class="c-dropdown">
        <div class="c-dropdown-selection">{{ t(`appThemes.${appTheme}`) }} Theme ▼</div>
        <div class="c-dropdown-menu">
            <div class="c-dropdown-menu-choice" v-for="themeOption in appThemes" :key="themeOption" :style="setActiveThemeOptionStyle(themeOption)" @click="setAppTheme(themeOption)">
                {{ t(`appThemes.${themeOption}`) }}
            </div>
        </div>
    </div>
    <div class="c-dropdown">
        <div class="c-dropdown-selection">{{ t(`appLocales.${appLocale}`) }} ▼</div>
        <div class="c-dropdown-menu">
            <div class="c-dropdown-menu-choice" v-for="localeOption in appLocales" :key="localeOption" :style="setActiveLocaleOptionStyle(localeOption)" @click="setAppLocale(localeOption)">
                {{ t(`appLocales.${localeOption}`) }}
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ref } from "vue";
    import { mutationTypes, useStore } from "../plugins/store";
    import { useI18n } from "vue-i18n";

    const store = useStore();
    const { t } = useI18n();
    const { locale } = useI18n({ useScope: "global" });

    const appLocales = ["cn", "en", "es", "hi"];
    const appLocale = ref("");
    const setActiveLocaleOptionStyle = (localeOption: string) => (localeOption === appLocale.value ? { background: "var(--themeColor)" } : { background: "var(--neutralColor)" });
    const setAppLocale = (newAppLocale: string) => {
        store.commit(mutationTypes.setLocale, newAppLocale);
        locale.value = newAppLocale;
        appLocale.value = newAppLocale;
    };

    const appThemes = ["blackboard", "cal", "classic", "dark", "greenboard", "light", "rose", "sepia", "space", "terminal"];
    const appTheme = ref("");
    const setActiveThemeOptionStyle = (themeOption: string) => (themeOption === appTheme.value ? { background: "var(--themeColor)" } : { background: "var(--neutralColor)" });
    const setAppTheme = (newAppTheme: string) => {
        if (document.body.classList.contains(`c-theme-${appTheme.value}`)) {
            document.body.classList.remove(`c-theme-${appTheme.value}`);
        }
        store.commit(mutationTypes.setTheme, newAppTheme);
        document.body.classList.add(`c-theme-${newAppTheme}`);
        appTheme.value = newAppTheme;
    };

    setAppLocale(store.state.app.preferences.locale);
    setAppTheme(store.state.app.preferences.theme);
</script>

<i18n lang="json">
{
    "cn": {
        "appLocales": {
            "cn": "🇨🇳 简体中文",
            "en": "🇺🇸 英文"
        }
    },
    "en": {
        "appThemes": {
            "blackboard": "Blackboard",
            "cal": "Cal",
            "classic": "Classic",
            "dark": "Dark",
            "greenboard": "Greenboard",
            "light": "Light",
            "rose": "Rose",
            "sepia": "Sepia",
            "space": "Space",
            "terminal": "Terminal"
        },
        "appLocales": {
            "cn": "🇨🇳 Simplified Chinese",
            "en": "🇺🇸 English",
            "es": "🇲🇽 Spanish",
            "hi": "🇮🇳 Hindi"
        }
    },
    "es": {
        "appLocales": {
            "es": "🇲🇽 Español"
        }
    },
    "hi": {
        "appLocales": {
            "hi": "🇮🇳 हिन्दी"
        }
    }
}
</i18n>
