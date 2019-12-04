<template>
  <div id="app-header">
    <router-link to="/">
      <img
        id="app-header-logo"
        alt="Gamesman Logo"
        src="@/assets/LApp.png"
        width="150em"
        height="150em"
      />
    </router-link>

    <h1 id="app-header-title">GamesmanUni</h1>

    <nav id="app-header-nav">
      <router-link class="c-link-router" to="/">Home</router-link>|
      <router-link class="c-link-router" to="/games">Games</router-link>|
      <router-link class="c-link-router" to="/about">About</router-link>|
      <router-link class="c-link-router" to="/updates">Updates</router-link>
    </nav>

    <div id="app-header-setting">
      <div id="app-header-setting-theme" class="c-dropdown">
        <div class="c-dropdown-selection">
          {{ themeDictionary.get(theme) }} Theme ▼
        </div>
        <div class="c-dropdown-menu">
          <div
            class="c-dropdown-menu-choice"
            v-for="key in Array.from(themeDictionary.keys())"
            :key="key"
            @click="changeTheme(key)"
          >
            {{ themeDictionary.get(key) }}
          </div>
        </div>
      </div>

      <div id="app-header-setting-layout" class="c-dropdown">
        <div class="c-dropdown-selection">
          {{ layoutDictionary.get(layout) }} Layout ▼
        </div>
        <div class="c-dropdown-menu">
          <div
            class="c-dropdown-menu-choice"
            v-for="key in Array.from(layoutDictionary.keys())"
            :key="key"
            @click="changeLayout(key)"
          >
            {{ layoutDictionary.get(key) }}
          </div>
        </div>
      </div>

      <div id="app-header-setting-language" class="c-dropdown">
        <div class="c-dropdown-selection">
          {{ languageDictionary.get(language) }} ▼
        </div>
        <div class="c-dropdown-menu">
          <div
            class="c-dropdown-menu-choice"
            v-for="key in Array.from(languageDictionary.keys())"
            :key="key"
            @click="changeLanguage(key)"
          >
            {{ languageDictionary.get(key) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class AppHeader extends Vue {
  get themeDictionary() {
    return this.$store.getters.themeDictionary;
  }

  get theme() {
    return this.$store.getters.theme;
  }

  get layoutDictionary() {
    return this.$store.getters.layoutDictionary;
  }

  get layout() {
    return this.$store.getters.layout;
  }

  get languageDictionary() {
    return this.$store.getters.languageDictionary;
  }

  get language() {
    return this.$store.getters.language;
  }

  created() {
    document.body.classList.add(`c-theme-${this.theme}`);
    document.body.classList.add(`c-layout-${this.layout}`);
  }

  changeTheme(theme: string): void {
    document.body.classList.remove(`c-theme-${this.theme}`);
    document.body.classList.add(`c-theme-${theme}`);
    this.$store.commit("theme", theme);
  }

  changeLayout(layout: string): void {
    document.body.classList.remove(`c-layout-${this.layout}`);
    document.body.classList.add(`c-layout-${layout}`);
    this.$store.commit("layout", layout);
  }

  changeLanguage(language: string): void {
    this.$root.$i18n.locale = language;
    this.$store.commit("language", language);
  }
}
</script>
