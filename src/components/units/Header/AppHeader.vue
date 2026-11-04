<template>
    <header id="app-header">
        <div class="nav-accent"></div>
        <AppHeaderTitle />
        <AppHeaderNavigations />
        <AppHeaderPreferences />
    </header>
</template>

<script lang="ts" setup>
    import AppHeaderTitle from "./AppHeaderTitle.vue";
    import AppHeaderNavigations from "./AppHeaderNavigations.vue";
    import AppHeaderPreferences from "./AppHeaderPreferences.vue";
</script>

<style lang="scss" scoped>
    #app-header {
        background: var(--gu-surface);
        padding: 0 2rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 68px;
        position: sticky;
        top: 0;
        z-index: 100;
    }

    .nav-accent {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(
            90deg,
            #1b3a6b 0%,
            #1b3a6b 25%,
            #2a5298 30%,
            #FDB515 38%,
            #ffe066 48%,
            #fff5cc 50%,
            #ffe066 52%,
            #FDB515 62%,
            #2a5298 70%,
            #1b3a6b 75%,
            #1b3a6b 100%
        );
        overflow: hidden;
    }

    .nav-accent::before,
    .nav-accent::after {
        content: '';
        position: absolute;
        top: -1px;
        bottom: -1px;
        width: 80px;
        background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.15) 15%,
            rgba(255, 255, 255, 0.9) 50%,
            rgba(255, 255, 255, 0.15) 85%,
            transparent 100%
        );
        opacity: 0;
    }

    .nav-accent::before {
        left: 50%;
        animation: glintLeft 55s linear infinite;
        animation-delay: 3s;
    }

    .nav-accent::after {
        left: 50%;
        animation: glintRight 55s linear infinite;
        animation-delay: 3s;
    }

    @keyframes glintLeft {
        0%, 95%  { left: 50%; opacity: 0; }
        95.3%    { left: 50%; opacity: 1; }
        97.5%    { left: -80px; opacity: 0.6; }
        98%      { left: -80px; opacity: 0; }
        100%     { opacity: 0; }
    }

    @keyframes glintRight {
        0%, 95%  { left: 50%; opacity: 0; }
        95.3%    { left: 50%; opacity: 1; }
        97.5%    { left: calc(100% + 20px); opacity: 0.6; }
        98%      { left: calc(100% + 20px); opacity: 0; }
        100%     { opacity: 0; }
    }
</style>
