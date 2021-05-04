<template>
    <AppHeader />
    <hr class="c-divider" />
    <router-view />
    <hr class="c-divider" />
    <AppFooter />
</template>

<script lang="ts" setup>
    import AppHeader from "./components/AppHeader.vue";
    import AppFooter from "./components/AppFooter.vue";
</script>

<style lang="scss">
    @forward "themes";

    * {
        color: var(--primaryColor);
        font: var(--font);
        text-align: center;
    }

    body {
        background-color: var(--backgroundColor);
        padding: 0 5%;
    }

    h1 {
        font-size: 2em;
        font-weight: bold;
        margin: 0.25em 1em;
        padding: 0.25em 1em;
    }

    h2 {
        font-size: 1.5em;
        font-weight: bold;
        margin: 0.25em 1em;
        padding: 0.25em 1em;
    }

    h3 {
        font-size: 1.17em;
        font-weight: bold;
        margin: 0.25em 1em;
        padding: 0.25em 1em;
    }

    h4 {
        font-size: 1em;
        font-weight: bold;
        margin: 0.25em 1em;
        padding: 0.25em 1em;
    }

    h5 {
        font-size: 0.83em;
        font-weight: bold;
        margin: 0.25em 1em;
        padding: 0.25em 1em;
    }

    h6 {
        font-size: 0.75em;
        font-weight: bold;
        margin: 0.25em 1em;
        padding: 0.25em 1em;
    }

    p {
        font-size: 1em;
        line-height: 2em;
        padding: 0 20%;
        text-align: justify;
        &::first-line {
            text-indent: 4em;
        }
    }

    b {
        font-weight: bold;
    }

    a {
        padding-left: 0.25em;
        padding-right: 0.25em;
        &:link {
            font-weight: bold;
        }
    }

    nav {
        padding: 0.25em;
        margin: 0.25em;
    }

    code {
        border: 0.04em solid var(--neutralColor);
        font: var(--monoFont);
        padding-left: 0.25em;
        padding-right: 0.25em;
    }

    button {
        background-color: var(--backgroundColor);
        border: 0.1em solid var(--neutralColor);
        border-radius: 1em;
        cursor: pointer;
        text-decoration: none;
        transition: all 0.3s ease-out;
        &:disabled {
            background-color: var(--backgroundColor);
            cursor: auto;
            opacity: 0.5;
            &:hover {
                background-color: var(--backgroundColor);
            }
        }
        &:focus {
            outline: none;
        }
        &:hover {
            background-color: var(--neutralColor);
        }
    }

    .c-divider {
        border: 0.03em dotted;
        margin: 0.5em;
    }

    .c-link-router {
        color: var(--primaryColor);
        font-weight: bold;
        padding-right: 0.5em;
        &.router-link-exact-active {
            color: var(--themeColor);
        }
    }

    .c-dropdown {
        display: inline-block;
        * {
            text-align: left;
        }
        .c-dropdown-selection {
            font-weight: bold;
            padding: 0.25em 0.5em 0.25em 0.5em;
        }
        .c-dropdown-menu {
            border: 0em;
            background-color: var(--neutralColor);
            display: none;
            padding: 0em;
            position: absolute;
            z-index: 1;
        }
        .c-dropdown-menu-choice {
            cursor: pointer;
            padding: 0.25em 0.5em;
            &:hover,
            &:active {
                background-color: var(--themeColor);
            }
        }
        &:hover,
        &:active {
            .c-dropdown-selection {
                background-color: var(--themeColor);
            }
            .c-dropdown-menu {
                display: block;
            }
        }
    }

    .c-turn-1 {
        color: var(--turn0Color);
    }

    .c-turn-2 {
        color: var(--turn1Color);
    }

    .c-win {
        color: #ffffff;
        background-color: var(--winColor);
    }

    .c-draw {
        color: #000000;
        background-color: var(--drawColor);
    }

    .c-tie {
        color: #000000;
        background-color: var(--tieColor);
    }

    .c-lose {
        color: #ffffff;
        background-color: var(--loseColor);
    }
</style>
