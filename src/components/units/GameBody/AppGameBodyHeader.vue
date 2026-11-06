<template>
    <div id="app-game-body-header">
        <!-- Variant selector: grayed out with tooltip if only one variant -->
        <div class="variant-btn-wrapper" :class="{ 'no-variants': !hasVariants }">
            <button
                class="header-btn"
                :class="{ disabled: !hasVariants }"
                :disabled="!hasVariants"
                @click="goToVariants"
                title="Choose Variant"
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="2" y="7" width="10" height="14" rx="2"/>
                    <path d="M8 7V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2"/>
                </svg>
            </button>
            <div class="no-variant-tooltip">This game has no variants!</div>
        </div>

        <AppGameBodyHeaderInstructions />
        <AppGameBodyHeaderTitle />
        <AppGameBodyHeaderOptions />
        <button
            class="analysis-toggle-btn"
            :class="{ active: options.showMenu }"
            :title="options.showMenu ? 'Hide Analysis' : 'Show Analysis'"
            @click="toggleAnalysis"
        >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="12" width="4" height="9"/>
                <rect x="10" y="7" width="4" height="14"/>
                <rect x="17" y="3" width="4" height="18"/>
            </svg>
        </button>
    </div>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { useRouter } from "vue-router";
    import { useStore } from "../../../scripts/plugins/store";
    import AppGameBodyHeaderTitle from "./AppGameBodyHeaderTitle.vue";
    import AppGameBodyHeaderInstructions from "./AppGameBodyHeaderInstructions.vue";
    import AppGameBodyHeaderOptions from "./AppGameBodyHeaderOptions.vue";

    const store = useStore();
    const router = useRouter();
    const options = computed(() => store.getters.options);

    const currentGameId = computed(() => store.getters.currentGameId);
    const currentGameType = computed(() => store.getters.currentGameType);

    const variants = computed(() => {
        const gameId = currentGameId.value;
        if (!gameId) return {};
        try { return store.getters.variants(gameId) ?? {}; }
        catch { return {}; }
    });

    const hasVariants = computed(() => Object.keys(variants.value).length > 1);

    const goToVariants = () => {
        if (!hasVariants.value) return;
        router.push({ name: "variants", params: { type: currentGameType.value, gameId: currentGameId.value } });
    };

    const toggleAnalysis = () => {
        const show = !options.value.showMenu;
        options.value.showMenu = show;
        options.value.showNextMoves = show;
        options.value.showNextMoveHints = show;
        options.value.showNextMoveDeltaRemotenesses = show;
        options.value.highlightMove = show;
    };
</script>

<style lang="scss" scoped>
    #app-game-body-header {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 1rem 0 0.75rem;
    }

    /* Shared style for all square header buttons */
    .header-btn,
    .analysis-toggle-btn {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        background: var(--gu-surface-hover);
        border: 1px solid var(--gu-border);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: opacity 0.15s;

        svg {
            width: 16px;
            height: 16px;
            stroke: var(--gu-text-secondary);
        }

        &:hover { opacity: 0.8; transform: none; }

        &.disabled {
            opacity: 0.4;
            cursor: not-allowed;
            &:hover { opacity: 0.4; }
        }
    }

    /* Analysis toggle overrides when active */
    .analysis-toggle-btn.active {
        background: var(--gu-brand);
        border: none;
        svg { stroke: #ffffff; }
    }

    /* Variant button wrapper — hosts the tooltip */
    .variant-btn-wrapper {
        position: relative;

        .no-variant-tooltip {
            display: none;
        }

        &.no-variants {
            .no-variant-tooltip {
                display: block;
                position: absolute;
                bottom: calc(100% + 10px);
                left: 50%;
                transform: translateX(-50%);
                background: #1b3a6b;
                color: #ffffff;
                font-size: 12px;
                font-weight: 500;
                padding: 6px 10px;
                border-radius: 6px;
                white-space: nowrap;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.15s;
                z-index: 100;

                /* Arrow */
                &::after {
                    content: "";
                    position: absolute;
                    top: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    border: 5px solid transparent;
                    border-top-color: #1b3a6b;
                }
            }

            &:hover .no-variant-tooltip {
                opacity: 1;
            }
        }
    }
</style>
