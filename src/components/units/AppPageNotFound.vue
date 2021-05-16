<template>
    <div id="app-page-not-found">
        <h2>Page not found... 😔</h2>
        <p>
            Path to <code>{{ $route.fullPath }}</code> does not exist.
        </p>
    </div>
</template>

<style lang="scss" scoped>
    #app-page-not-found {
        p {
            text-align: center;
        }
    }
</style>
