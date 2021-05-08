<template>
    <router-link to="/">
        <img alt="GamesCrafters Logo" src="../models/images/logo-gamescrafters.png" width="100" />
    </router-link>
    <h1>GamesmanUni</h1>
    <AppNavigations />
    <AppPreferences />
</template>

<script lang="ts" setup>
    import AppNavigations from "./AppNavigations.vue";
    import AppPreferences from "./AppPreferences.vue";
</script>
