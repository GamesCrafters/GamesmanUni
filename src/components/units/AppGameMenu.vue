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
                <button v-show="enabled" class="buttons" @click="activeTab = 'startPos'">
                    Customize Starting Position
                </button>
                <button v-show="enabled" class="buttons" @click="activeTab = 'moveHist'">
                    Move History
                </button>
            </div>
            <div id="app-game-menu-content-active">
                <AppGameVvh v-show="activeTab === 'vvh'"/>
                <!-- <AppGameMenuAnalysis/> -->
                <AppGameMenuPosition v-show="activeTab === 'startPos'"/>
                <AppGameMenuMoveHistory v-show="activeTab === 'moveHist'"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { computed, ref } from "vue";
    import { useStore } from "../../scripts/plugins/store";
    import AppGameVvh from "./AppGameVvh.vue";
    import AppGameMenuHeader from "./AppGameMenuHeader.vue";
    import AppGameMenuPosition from "./AppGameMenuPosition.vue";
    import AppGameMenuMoveHistory from "./AppGameMenuHistory.vue";

    const activeTab = ref('vvh');

    // Temporary fix for games that will break the Classic server
    const store = useStore();
    const game = store.getters.currentGameName;
    const enabled = computed(() => {
        return game != "Tic-Tac-Two" &&
                game != "3-Spot" && 
                game != "L-game" && 
                game != "Nine Men's Morris" && 
                game != "Bagh-Chal";
    });
</script>

<style lang="scss" scoped>
    #app-game-menu {
        flex: 1 1 auto;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        justify-content: flex-start;
        #app-game-menu-content {
            border-radius: 1rem;
            border: 0.1rem solid var(--neutralColor);
            padding: 4rem;
            .buttons {
                margin-top: 2rem;
                margin-right: 1rem;
                margin-left: 1rem;
                margin-bottom: 2rem;
                padding: 0 0.5rem;
                border-radius: 10rem;
                border: 0.1rem solid var(--neutralColor);
            }
        }
    }
</style>
