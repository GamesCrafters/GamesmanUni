<template>
    <div id="app-header-title">
        <router-link to="/" class="nav-logo">
            <img class="logo-img" alt="GamesCrafters Logo" src="../../../models/images/logo-gamescrafters.png" />
            <span class="logo-text">GamesmanUni</span>
        </router-link>
    </div>
</template>

<style lang="scss" scoped>
    #app-header-title {
        display: flex;
        align-items: center;
    }

    .nav-logo {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        text-decoration: none;
    }

    .logo-img {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        object-fit: cover;
    }

    .logo-text {
        font-size: 17px;
        font-weight: 500;
        color: #1b3a6b;
    }
</style>
