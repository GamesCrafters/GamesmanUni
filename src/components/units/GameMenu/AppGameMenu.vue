<template>
    <div id="app-game-menu">
        <AppGameMenuHeader />
        <div id="app-game-menu-content">
            <div id="app-game-menu-content-buttons">
                <button class="buttons" @click="activeTab = 'vvh'">
                    Visual Value History
                </button>
                <!-- <button class="buttons" @click="activeTab = 'analysis'">
                    Analysis
                </button> -->
                <button class="buttons" @click="activeTab = 'startPos'">
                    Customize Starting Position
                </button>
                <button class="buttons" @click="activeTab = 'moveHist'">
                    Move History
                </button>
            </div>
            <div id="app-game-menu-content-active">
                <AppGameVvh v-show="activeTab === 'vvh'" />
                <!-- <AppGameMenuAnalysis/> -->
                <AppGameMenuPosition v-show="activeTab === 'startPos'" />
                <AppGameMenuMoveHistory v-show="activeTab === 'moveHist'" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ref } from "vue";
    import AppGameVvh from "../VVH/AppGameVvh.vue";
    import AppGameMenuHeader from "./AppGameMenuHeader.vue";
    import AppGameMenuPosition from "./AppGameMenuPosition.vue";
    import AppGameMenuMoveHistory from "./AppGameMenuHistory.vue";

    const activeTab = ref('vvh');
</script>

<style lang="scss" scoped>
    #app-game-menu {
        flex: 1 1 auto;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        justify-content: flex-start;
        min-height: 100%;
        #app-game-menu-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            border-radius: 8px;
            border: 1px solid var(--gu-border);
            padding: 1rem;
            #app-game-menu-content-buttons {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
                margin-bottom: 1rem;
                flex-shrink: 0;
                justify-content: center;
            }
            #app-game-menu-content-active {
                flex: 1;
                display: flex;
                flex-direction: column;
            }
            .buttons {
                padding: 5px 12px;
                border-radius: 6px;
                border: 1px solid var(--gu-border);
                font-size: 13px;
                color: var(--gu-brand);
                background: var(--gu-surface-alt);
                &:hover { background: var(--gu-surface-hover); transform: none; }
            }
        }
    }
</style>
