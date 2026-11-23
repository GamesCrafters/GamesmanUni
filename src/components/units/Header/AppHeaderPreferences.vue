<template>
    <div id="app-header-preferences" v-click-outside="() => showPanel = false">
        <button class="settings-btn" :class="{ active: showPanel }" @click="showPanel = !showPanel">
            &#9881; {{ t("set.title") }}
        </button>

        <div class="settings-panel" v-if="showPanel">
            <!-- Sound -->
            <div class="settings-row">
                <div class="settings-row-label">{{ t("set.movesVol") }}</div>
                <VueSlider v-model="preferences.volume" :min="0" :max="1" :interval="0.1" :tooltip="'none'" class="settings-slider" />
            </div>
            <div class="settings-row">
                <div class="settings-row-label">{{ t("set.ambVol") }}</div>
                <VueSlider v-model="preferences.ambienceVolume" :min="0" :max="1" :interval="0.1" :tooltip="'none'" class="settings-slider" />
            </div>
            <div class="settings-divider"></div>
            <!-- Theme -->
            <div class="settings-row">
                <div class="settings-row-label">{{ t("set.theme") }}</div>
                <select class="settings-select" :value="appTheme" @change="setAppTheme(($event.target as HTMLSelectElement).value)">
                    <option v-for="themeOption in appThemes" :key="themeOption" :value="themeOption">
                        {{ t(`appThemes.${themeOption}`) }}
                    </option>
                </select>
            </div>
            <!-- Language -->
            <div class="settings-row">
                <div class="settings-row-label">{{ t("set.lang") }}</div>
                <select class="settings-select" :value="appLocale" @change="setAppLocale(($event.target as HTMLSelectElement).value)">
                    <option v-for="localeOption in appLocales" :key="localeOption" :value="localeOption">
                        {{ t(`appLocales.${localeOption}`) }}
                    </option>
                </select>
            </div>
            <!-- Font size -->
            <div class="settings-row">
                <div class="settings-row-label">{{ t("set.fontSize") }}</div>
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

    const LOCAL_STORAGE_USER_PREFERENCES_KEY = 'userPreferences';

    const store = useStore();
    const preferences = computed(() => store.getters.preferences);
    const { t, locale } = useI18n({ useScope: "global" });
    const appLocales = ["zh", "en-US", "es", "hi"];
    const appLocale = ref("");
    const setActiveLocaleOptionStyle = (localeOption: string) => (localeOption === appLocale.value ? { background: "var(--themeColor)" } : { background: "var(--neutralColor)" });
    const setAppLocale = (newAppLocale: string) => {
        store.commit(mutationTypes.setLocale, newAppLocale);
        locale.value = newAppLocale;
        appLocale.value = newAppLocale;
        document.documentElement.lang = newAppLocale === "zh" ? "zh-Hans" : newAppLocale;
    };
    const appThemes = ["blackboard", "cal", "classic", "dark", "greenboard", "light", "rose", "sepia", "space", "terminal"];
    const appTheme = ref("");
    const setActiveThemeOptionStyle = (themeOption: string) => (themeOption === appTheme.value ? { background: "var(--themeColor)" } : { background: "var(--neutralColor)" });
    const setAppTheme = (newAppTheme: string) => {
        const root = document.getElementById("app")!;
        // Drop any theme class already on the element, including one applied
        // before mount, so two themes can never be active at once.
        Array.from(root.classList)
            .filter((c) => c.startsWith("uni-theme-"))
            .forEach((c) => root.classList.remove(c));
        store.commit(mutationTypes.setTheme, newAppTheme);
        root.classList.add(`uni-theme-${newAppTheme}`);
        document.documentElement.style.backgroundColor = getComputedStyle(root).getPropertyValue("--backgroundColor");
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
    // Read saved preferences synchronously so the first render already uses
    // them; onMounted would run after the initial paint.
    const savedAtSetup = (() => {
        try {
            return JSON.parse(localStorage.getItem(LOCAL_STORAGE_USER_PREFERENCES_KEY) || "null") || {};
        } catch {
            return {};
        }
    })();
    setAppLocale(savedAtSetup.locale || store.getters.locale);
    setAppTheme(savedAtSetup.theme || store.getters.theme);
    setAppRootFontSize(savedAtSetup.fontSize || store.getters.rootFontSize);

    watch(
        () => [preferences.value.ambienceVolume, preferences.value.volume],
        () => {
            setMoveSFXVolume(preferences.value.volume);
            setAmbienceVolume(preferences.value.ambienceVolume);
        }
    );

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
            color: var(--gu-bg);
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

