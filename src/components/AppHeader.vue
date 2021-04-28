<template>
    <router-link to="/">
        <img
            alt="GamesCrafters Logo"
            src="../models/images/logo-gamescrafters.png"
            width="100"
        />
    </router-link>
    <h1>GamesmanUni</h1>
    <AppNavigations />
    <AppSettings />
</template>

<script lang="ts" setup>
    import AppNavigations from "./AppNavigations.vue";
    import AppSettings from "./AppSettings.vue";
</script>
