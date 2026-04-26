<template>
    <div id="app-game">
        <div class="game-left">
            <AppGameBody />
        </div>

        <div class="game-right" :class="{ collapsed: !panelOpen, resizing: isResizing }" :style="panelOpen ? { width: panelWidth + 'px' } : {}">
            <!-- Toggle lives inside the panel so it moves with it — no position:fixed lag -->
            <button
                class="analysis-toggle-btn"
                :class="{ open: panelOpen }"
                @click="togglePanel"
                :title="panelOpen ? 'Hide analysis' : 'Show analysis'"
            >
                <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
            </button>

            <div class="resize-handle" @mousedown.prevent="startDrag" v-show="panelOpen"></div>

            <div class="game-right-inner" :class="{ hidden: !panelOpen }">
                <AppGameMenu v-show="showMenu"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { computed, ref, onUnmounted } from "vue";
    import { onBeforeRouteLeave, useRoute } from "vue-router";
    import { actionTypes, useStore } from "../../scripts/plugins/store";
    import AppGameBody from "./GameBody/AppGameBody.vue";
    import AppGameMenu from "./GameMenu/AppGameMenu.vue";

    const route = useRoute();
    const store = useStore();
    const gameId = route.params.gameId as string;
    const variantId = route.params.variantId as string;
    const initialPosition = route.params.initialPosition as string;
    store.dispatch(actionTypes.initiateMatch, { gameId: gameId, variantId: variantId, startPosition: initialPosition });
    const options = computed(() => store.getters.options);
    const showMenu = computed(() => (options.value ? options.value.showMenu : true));
    onBeforeRouteLeave(() => store.dispatch(actionTypes.exitMatch));

    const panelOpen = computed(() => options.value ? options.value.showMenu : true);

    const togglePanel = () => {
        const show = !panelOpen.value;
        options.value.showMenu = show;
        options.value.showNextMoves = show;
        options.value.showNextMoveHints = show;
        options.value.showNextMoveDeltaRemotenesses = show;
        options.value.highlightMove = show;
    };

    /* Draggable panel resize */
    const panelWidth = ref(500);
    const isResizing = ref(false);
    let dragStartX = 0;
    let dragStartWidth = 0;

    const startDrag = (e: MouseEvent) => {
        isResizing.value = true;
        dragStartX = e.clientX;
        dragStartWidth = panelWidth.value;
        document.addEventListener("mousemove", onDrag);
        document.addEventListener("mouseup", stopDrag);
    };

    const onDrag = (e: MouseEvent) => {
        if (!isResizing.value) return;
        const dx = dragStartX - e.clientX;
        panelWidth.value = Math.max(300, Math.min(dragStartWidth + dx, window.innerWidth - 380));
    };

    const stopDrag = () => {
        isResizing.value = false;
        document.removeEventListener("mousemove", onDrag);
        document.removeEventListener("mouseup", stopDrag);
    };

    onUnmounted(() => {
        document.removeEventListener("mousemove", onDrag);
        document.removeEventListener("mouseup", stopDrag);
    });
</script>

<style lang="scss" scoped>
    #app-game {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: stretch;
        justify-content: flex-start;
        gap: 0;
        min-height: calc(100vh - 68px);
        background: var(--gu-surface-alt);
    }

    .game-left {
        flex: 1;
        padding: 1.5rem 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
    }

    .game-right {
        width: 500px;
        flex-shrink: 0;
        background: var(--gu-surface);
        border-left: 1px solid var(--gu-border);
        /* Sticky so it stays in view while the page scrolls — no position:fixed */
        position: sticky;
        top: 0;
        height: calc(100vh - 68px);
        /* overflow:visible lets the toggle button protrude to the left */
        overflow: visible;
        transition: width 0.35s ease, border-left-color 0.35s ease;

        &.collapsed {
            width: 0;
            border-left-color: transparent;
        }

        &.resizing {
            transition: none;
            user-select: none;
        }
    }

    .game-right-inner {
        position: absolute;
        inset: 0;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 1.5rem;
        transition: opacity 0.3s ease;

        &.hidden {
            opacity: 0;
            pointer-events: none;
        }
    }

    .resize-handle {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 6px;
        cursor: col-resize;
        z-index: 60;

        &:hover {
            background: rgba(27, 58, 107, 0.12);
        }
    }

    /* Toggle is absolute inside .game-right so it rides with the panel */
    .analysis-toggle-btn {
        position: absolute;
        left: -28px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 50;
        width: 28px;
        height: 64px;
        border-radius: 8px 0 0 8px;
        background: var(--gu-surface);
        border: 1px solid var(--gu-border);
        border-right: none;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        transition: background 0.15s;

        &:hover { background: var(--gu-surface-hover); }

        svg {
            width: 14px;
            height: 14px;
            stroke: #888;
            fill: none;
            stroke-width: 2;
            transition: transform 0.3s;
            transform: rotate(180deg);
        }

        &.open svg {
            transform: rotate(0deg);
        }
    }
</style>
