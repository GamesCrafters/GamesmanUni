<template>
    <div id="app-header-preferences">
        <div class="uni-dropdown">
            <div class="uni-dropdown-selection">{{ t(`appThemes.${appTheme}`) }} {{ t("themeTitle") }} ▼</div>
            <div class="uni-dropdown-menu">
                <div class="uni-dropdown-menu-option" v-for="themeOption in appThemes" :key="themeOption" :style="setActiveThemeOptionStyle(themeOption)" @click="setAppTheme(themeOption)">
                    {{ t(`appThemes.${themeOption}`) }}
                </div>
            </div>
        </div>
        <div class="uni-dropdown">
            <div class="uni-dropdown-selection">{{ t(`appLocales.${appLocale}`) }} ▼</div>
            <div class="uni-dropdown-menu">
                <div class="uni-dropdown-menu-option" v-for="localeOption in appLocales" :key="localeOption" :style="setActiveLocaleOptionStyle(localeOption)" @click="setAppLocale(localeOption)">
                    {{ t(`appLocales.${localeOption}`) }}
                </div>
            </div>
        </div>
        <div class="uni-dropdown">
            <div class="uni-dropdown-selection">{{ t(`appRootFontSizes.${appRootFontSize}`) }} {{ t("fontSizeUnit") }} ▼</div>
            <div class="uni-dropdown-menu">
                <div class="uni-dropdown-menu-option" v-for="fontSizeOption in appRootFontSizes" :key="fontSizeOption" :style="setActiveFontSizeOptionStyle(fontSizeOption)" @click="setAppRootFontSize(fontSizeOption)">
                    {{ t(`appRootFontSizes.${fontSizeOption}`) }}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ref } from "vue";
    import { mutationTypes, useStore } from "../../scripts/plugins/store";
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
        if (document.getElementById("app")!.classList.contains(`uni-theme-${appTheme.value}`)) {
            document.getElementById("app")!.classList.remove(`uni-theme-${appTheme.value}`);
        }
        store.commit(mutationTypes.setTheme, newAppTheme);
        document.getElementById("app")!.classList.add(`uni-theme-${newAppTheme}`);
        document.documentElement.style.backgroundColor = getComputedStyle(document.getElementById("app")!).getPropertyValue("--backgroundColor");
        appTheme.value = newAppTheme;
    };
    const appRootFontSizes = ["05px", "06px", "07px", "08px", "09px", "10px", "11px", "12px", "13px", "14px", "15px", "16px", "17px", "18px", "19px", "20px", "21px", "22px", "23px", "24px", "25px"];
    const appRootFontSize = ref("");
    const setActiveFontSizeOptionStyle = (fontSizeOption: string) => (fontSizeOption === appRootFontSize.value ? { background: "var(--themeColor)" } : { background: "var(--neutralColor)" });
    const setAppRootFontSize = (newAppFontSize: string) => {
        store.commit(mutationTypes.setRootFontSize, newAppFontSize);
        document.documentElement.style.fontSize = newAppFontSize;
        appRootFontSize.value = newAppFontSize;
    };
    setAppLocale(store.getters.locale);
    setAppTheme(store.getters.theme);
    setAppRootFontSize(store.getters.rootFontSize);
</script>

<style lang="scss" scoped>
    #app-header-preferences {
        align-content: center;
        align-items: center;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        * {
            font-size: 1.17rem;
        }
        > .uni-dropdown {
            margin: 0 0.5rem;
        }
    }
</style>

<i18n lang="json">
{
    "cn": {
        "appLocales": {
            "cn": "🇨🇳 简体中文",
            "en": "🇺🇸 英文",
            "es": "🇲🇽 西班牙语",
            "hi": "🇮🇳 印地语"
        },
        "themeTitle": "主题",
        "fontSizeUnit": "号字"
    },
    "en": {
        "appRootFontSizes": {
            "05px": "05",
            "06px": "06",
            "07px": "07",
            "08px": "08",
            "09px": "09",
            "10px": "10",
            "11px": "11",
            "12px": "12",
            "13px": "13",
            "14px": "14",
            "15px": "15",
            "16px": "16",
            "17px": "17",
            "18px": "18",
            "19px": "19",
            "20px": "20",
            "21px": "21",
            "22px": "22",
            "23px": "23",
            "24px": "24",
            "25px": "25"
        },
        "appLocales": {
            "cn": "🇨🇳 Simplified Chinese",
            "en": "🇺🇸 English",
            "es": "🇲🇽 Spanish",
            "hi": "🇮🇳 Hindi"
        },
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
        "themeTitle": "Theme",
        "fontSizeUnit": "px"
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
