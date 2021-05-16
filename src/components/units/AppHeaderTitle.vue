<template>
    <div id="app-header-title">
        <router-link to="/">
            <img alt="GamesCrafters Logo" src="../../models/images/logo-gamescrafters.png" style="width: 4rem" />
        </router-link>
        <router-link to="/">
            <h1>GamesmanUni</h1>
        </router-link>
    </div>
</template>

<style lang="scss" scoped>
    #app-header-title {
        align-content: center;
        align-items: center;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        > a {
            margin: 0 0.5rem;
            text-decoration: none;
            > img {
                display: inline-block;
                height: 100%;
                vertical-align: middle;
            }
        }
    }
</style>
