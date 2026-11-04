<template>
    <div id="app-header-preferences" v-click-outside="() => showPanel = false">
        <button class="settings-btn" :class="{ active: showPanel }" @click="showPanel = !showPanel">
            &#9881; Settings
        </button>

        <div class="settings-panel" v-if="showPanel">
            <!-- Sound -->
            <div class="settings-row">
                <div class="settings-row-label">Moves volume</div>
                <VueSlider v-model="preferences.volume" :min="0" :max="1" :interval="0.1" :tooltip="'none'" class="settings-slider" />
            </div>
            <div class="settings-row">
                <div class="settings-row-label">Ambience volume</div>
                <VueSlider v-model="preferences.ambienceVolume" :min="0" :max="1" :interval="0.1" :tooltip="'none'" class="settings-slider" />
            </div>
            <div class="settings-divider"></div>
            <!-- Theme -->
            <div class="settings-row">
                <div class="settings-row-label">Theme</div>
                <select class="settings-select" :value="appTheme" @change="setAppTheme(($event.target as HTMLSelectElement).value)">
                    <option v-for="themeOption in appThemes" :key="themeOption" :value="themeOption">
                        {{ themeOption[0].toUpperCase() + themeOption.slice(1) }}
                    </option>
                </select>
            </div>
            <!-- Language -->
            <div class="settings-row">
                <div class="settings-row-label">Language</div>
                <select class="settings-select" :value="appLocale" @change="setAppLocale(($event.target as HTMLSelectElement).value)">
                    <option v-for="localeOption in appLocales" :key="localeOption" :value="localeOption">
                        {{ t(`appLocales.${localeOption}`) }}
                    </option>
                </select>
            </div>
            <!-- Font size -->
            <div class="settings-row">
                <div class="settings-row-label">Font size</div>
                <select class="settings-select" :value="appRootFontSize" @change="setAppRootFontSize(($event.target as HTMLSelectElement).value)">
                    <option v-for="fontSizeOption in appRootFontSizes" :key="fontSizeOption" :value="fontSizeOption">
                        {{ fontSizeOption }}px
                    </option>
                </select>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { computed, ref, watch, onMounted } from "vue";
    import { mutationTypes, useStore } from "../../../scripts/plugins/store";
    import { useI18n } from "vue-i18n";
    import VueSlider from "vue-slider-component";
    import { setMoveSFXVolume, setAmbienceVolume } from "../../../scripts/gamesmanUni/audio";

    const showPanel = ref(false);

    const vClickOutside = {
        mounted(el: HTMLElement, binding: { value: () => void }) {
            (el as any)._clickOutside = (event: MouseEvent) => {
                if (!el.contains(event.target as Node)) binding.value();
            };
            document.addEventListener("click", (el as any)._clickOutside);
        },
        unmounted(el: HTMLElement) {
            document.removeEventListener("click", (el as any)._clickOutside);
        },
    };

    const store = useStore();
    const preferences = computed(() => store.getters.preferences);
    const { t } = useI18n();
    const { locale } = useI18n({ useScope: "global" });
    const appLocales = ["zh", "en-US", "es", "hi"];
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
    const appRootFontSizes = ["05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25"];
    const appRootFontSize = ref("");
    const setActiveFontSizeOptionStyle = (fontSizeOption: string) => (fontSizeOption === appRootFontSize.value ? { background: "var(--themeColor)" } : { background: "var(--neutralColor)" });
    const setAppRootFontSize = (newAppFontSize: string) => {
        store.commit(mutationTypes.setRootFontSize, newAppFontSize);
        document.documentElement.style.fontSize = newAppFontSize + "px";
        appRootFontSize.value = newAppFontSize;
    };
    setAppLocale(store.getters.locale);
    setAppTheme(store.getters.theme);
    setAppRootFontSize(store.getters.rootFontSize);

    watch(
        () => [preferences.value.ambienceVolume, preferences.value.volume],
        () => {
            setMoveSFXVolume(preferences.value.volume);
            setAmbienceVolume(preferences.value.ambienceVolume);
        }
    );

    const LOCAL_STORAGE_USER_PREFERENCES_KEY = 'userPreferences';

    watch(
        [() => preferences.value.volume, () => preferences.value.ambienceVolume, appTheme, appLocale, appRootFontSize],
        () => {
            const dataToSave = {
                volume: preferences.value.volume,
                ambienceVolume: preferences.value.ambienceVolume,
                theme: appTheme.value,
                locale: appLocale.value,
                fontSize: appRootFontSize.value
            };
            localStorage.setItem(LOCAL_STORAGE_USER_PREFERENCES_KEY, JSON.stringify(dataToSave));
        },
        { deep: true }
    );

    onMounted(() => {
        const savedPreferences = localStorage.getItem(LOCAL_STORAGE_USER_PREFERENCES_KEY);
        if (savedPreferences) {
            try {
                const parsed = JSON.parse(savedPreferences);
                if (parsed.volume !== undefined) setMoveSFXVolume(parsed.volume);
                if (parsed.ambienceVolume !== undefined) setAmbienceVolume(parsed.ambienceVolume);
                if (parsed.theme) setAppTheme(parsed.theme);
                if (parsed.locale) setAppLocale(parsed.locale);
                if (parsed.fontSize) setAppRootFontSize(parsed.fontSize);
            } catch (e) {
                console.warn('[localStorage] Invalid preferences data', e);
            }
        }
    });

</script>

<style lang="scss" scoped>
    #app-header-preferences {
        display: flex;
        align-items: center;
        position: relative;
    }

    .settings-btn {
        font-size: 12px;
        background: var(--gu-surface-hover);
        color: var(--gu-text-body);
        padding: 4px 10px;
        border-radius: 4px;
        cursor: pointer;
        border: 1px solid var(--gu-border);
        white-space: nowrap;
        user-select: none;

        &:hover, &.active {
            background: var(--gu-brand);
            color: #fff;
            border-color: var(--gu-brand);
        }
    }

    .settings-panel {
        position: absolute;
        top: calc(100% + 8px);
        right: 0;
        background: var(--gu-surface);
        border: 1px solid var(--gu-border);
        border-radius: 8px;
        padding: 1rem;
        width: 240px;
        z-index: 200;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .settings-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
    }

    .settings-row-label {
        font-size: 12px;
        color: var(--gu-text-body);
        white-space: nowrap;
        flex-shrink: 0;
    }

    .settings-slider {
        flex: 1;
    }

    .settings-select {
        font-size: 12px;
        padding: 3px 6px;
        border: 1px solid var(--gu-border);
        border-radius: 4px;
        background: var(--gu-surface);
        color: var(--gu-text-body);
        cursor: pointer;
        flex: 1;
    }

    .settings-divider {
        border-top: 1px solid var(--gu-border);
        margin: 2px 0;
    }
</style>

<i18n lang="json">
{
    "zh": {
        "appLocales": {
            "zh": "🇨🇳 简体中文",
            "en-US": "🇺🇸 英文",
            "es": "🇲🇽 西班牙语",
            "hi": "🇮🇳 印地语"
        },
        "themeTitle": "主题",
        "fontSizeUnit": "号字"
    },
    "en-US": {
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
            "zh": "🇨🇳 Simplified Chinese",
            "en-US": "🇺🇸 English",
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
        "themeTitle": "",
        "fontSizeUnit": "px"
    },
    "es": {
        "appLocales": {
            "zh": "🇨🇳 chino",
            "en-US": "🇺🇸 inglés",
            "es": "🇲🇽 español",
            "hi": "🇮🇳 hindi"
        }
    },
    "hi": {
        "appLocales": {
            "zh": "🇨🇳 चीनी",
            "en-US": "🇺🇸 अंग्रेज़ी",
            "es": "🇲🇽 स्पेनिश",
            "hi": "🇮🇳 हिन्दी"
        }
    }
}
</i18n>
