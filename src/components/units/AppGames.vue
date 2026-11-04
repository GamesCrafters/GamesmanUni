<template>
    <div id="app-games">

        <!-- Glossary slide-in overlay -->
        <div class="overlay-bg" :class="{ open: showGlossary }" @click="showGlossary = false"></div>
        <div class="glossary-panel" :class="{ open: showGlossary }">
            <button class="glossary-close" @click="showGlossary = false">&#10005;</button>
            <div class="glossary-heading">Tag glossary</div>
            <div class="glossary-subheading">What each filter tag means</div>

            <div class="glossary-section">
                <div class="glossary-section-title">GUI Type</div>
                <div class="glossary-item">
                    <div class="glossary-term"><span class="gtag gt-v3">Animated GUI</span></div>
                    <div class="glossary-def">Games with fully animated boards rendered by the AutoGUI system.</div>
                </div>
                <div class="glossary-item">
                    <div class="glossary-term"><span class="gtag gt-v2">Artisan GUI</span></div>
                    <div class="glossary-def">Games with hand-crafted, custom-built interactive game boards.</div>
                </div>
                <div class="glossary-item">
                    <div class="glossary-term"><span class="gtag gt-v0">In Development</span></div>
                    <div class="glossary-def">Games that are still being developed and do not yet have a playable GUI.</div>
                </div>
            </div>

            <div class="glossary-section">
                <div class="glossary-section-title">Game Style</div>
                <div class="glossary-item">
                    <div class="glossary-term"><span class="gtag gt-style">Blocking</span></div>
                    <div class="glossary-def">Players win by preventing the opponent from making any legal move. The goal is positional control rather than capture.</div>
                </div>
                <div class="glossary-item">
                    <div class="glossary-term"><span class="gtag gt-style">Rearranger</span></div>
                    <div class="glossary-def">Players only move existing pieces already on the board. No new pieces are ever added or removed during play.</div>
                </div>
                <div class="glossary-item">
                    <div class="glossary-term"><span class="gtag gt-style">Dartboard</span></div>
                    <div class="glossary-def">Players only add new pieces to the board. Once placed, nothing moves. Think Tic-Tac-Toe or Connect 4.</div>
                </div>
                <div class="glossary-item">
                    <div class="glossary-term"><span class="gtag gt-style">Chasing</span></div>
                    <div class="glossary-def">One player pursues another across the board. The two sides have asymmetric goals.</div>
                </div>
                <div class="glossary-item">
                    <div class="glossary-term"><span class="gtag gt-style">Impartial</span></div>
                    <div class="glossary-def">Both players have identical available moves from any position.</div>
                </div>
                <div class="glossary-item">
                    <div class="glossary-term"><span class="gtag gt-style">Partisan</span></div>
                    <div class="glossary-def">Players have different moves available to them. Most games fall in this category.</div>
                </div>
                <div class="glossary-item">
                    <div class="glossary-term"><span class="gtag gt-style">Connection</span></div>
                    <div class="glossary-def">Players win by linking their pieces into a connected chain or path across the board.</div>
                </div>
                <div class="glossary-item">
                    <div class="glossary-term"><span class="gtag gt-style">Majority Control</span></div>
                    <div class="glossary-def">Players win by holding more pieces, territory, or board positions than the opponent.</div>
                </div>
            </div>

            <div class="glossary-section">
                <div class="glossary-section-title">Solve Type</div>
                <div class="glossary-item">
                    <div class="glossary-term"><span class="gtag gt-solve">Remoteness</span></div>
                    <div class="glossary-def">Stores how many moves remain until the game ends assuming perfect play from any position.</div>
                </div>
                <div class="glossary-item">
                    <div class="glossary-term"><span class="gtag gt-solve">Win By</span></div>
                    <div class="glossary-def">Expected winning margin assuming both players maximize their final score regardless of move count.</div>
                </div>
                <div class="glossary-item">
                    <div class="glossary-term"><span class="gtag gt-solve">Mex</span></div>
                    <div class="glossary-def">Solved using the Minimum EXcludant function from combinatorial game theory. Common for impartial games.</div>
                </div>
                <div class="glossary-item">
                    <div class="glossary-term"><span class="gtag gt-solve">Draw Analysis</span></div>
                    <div class="glossary-def">Stores Draw Level and Draw Remoteness values for positions where neither player can force a win.</div>
                </div>
                <div class="glossary-item">
                    <div class="glossary-term"><span class="gtag gt-solve">Unsolved</span></div>
                    <div class="glossary-def">This game has not yet been strongly solved. The perfect strategy is still unknown.</div>
                </div>
            </div>

            <div class="glossary-section">
                <div class="glossary-section-title">Miscellaneous</div>
                <div class="glossary-item">
                    <div class="glossary-term"><span class="gtag gt-misc">Educational</span></div>
                    <div class="glossary-def">Used for teaching or demonstration purposes within the GamesCrafters research group.</div>
                </div>
            </div>
        </div>

        <div v-if="tooltipText" class="chip-tooltip" :style="tooltipStyle">{{ tooltipText }}</div>

        <div class="games-layout">
            <!-- Filter Sidebar -->
            <aside class="filter-sidebar" :class="{ collapsed: sidebarCollapsed }">
                <div v-if="!sidebarCollapsed" class="filter-title-row">
                    <span class="filter-title">Filter</span>
                </div>
                <div class="filter-header-row">
                    <button v-if="!sidebarCollapsed" class="glossary-btn" @click="showGlossary = true">Tag glossary &#8599;</button>
                    <button class="sidebar-toggle" @click="sidebarCollapsed = !sidebarCollapsed" :title="sidebarCollapsed ? 'Expand filters' : 'Collapse filters'">
                        {{ sidebarCollapsed ? '›' : '‹' }}
                    </button>
                </div>

                <template v-if="!sidebarCollapsed">
                    <!-- GUI TYPE -->
                    <div class="filter-section">
                        <div class="filter-section-header">
                            <span class="filter-section-title">GUI TYPE</span>
                        </div>
                        <div class="tag-chips">
                            <span class="tag-chip chip-v3" :class="{ active: selectedGuiFilters.includes('v3') }" @click="toggleGuiFilter('v3')" @mouseenter="showChipTooltip($event, tagDescriptions['v3'])" @mouseleave="hideChipTooltip">Animated GUI</span>
                            <span class="tag-chip chip-v2" :class="{ active: selectedGuiFilters.includes('v2') }" @click="toggleGuiFilter('v2')" @mouseenter="showChipTooltip($event, tagDescriptions['v2'])" @mouseleave="hideChipTooltip">Artisan GUI</span>
                            <span class="tag-chip chip-v0" :class="{ active: selectedGuiFilters.includes('v0') }" @click="toggleGuiFilter('v0')" @mouseenter="showChipTooltip($event, tagDescriptions['v0'])" @mouseleave="hideChipTooltip">In Development</span>
                        </div>
                    </div>
                    <hr class="filter-divider">

                    <!-- GAME STYLE -->
                    <div class="filter-section">
                        <div class="filter-section-header">
                            <span class="filter-section-title">GAME STYLE</span>
                        </div>
                        <div class="tag-chips">
                            <span v-for="s in styleChips" :key="s"
                                class="tag-chip chip-style"
                                :class="{ active: selectedStyleFilters.includes(s) }"
                                @click="toggleFilter(selectedStyleFilters, s)"
                                @mouseenter="showChipTooltip($event, tagDescriptions[s])"
                                @mouseleave="hideChipTooltip">{{ s }}</span>
                        </div>
                    </div>
                    <hr class="filter-divider">

                    <!-- SOLVE TYPE -->
                    <div class="filter-section">
                        <div class="filter-section-header">
                            <span class="filter-section-title">SOLVE TYPE</span>
                        </div>
                        <div class="tag-chips">
                            <span v-for="s in solveChips" :key="s"
                                class="tag-chip chip-solve"
                                :class="{ active: selectedSolveFilters.includes(s) }"
                                @click="toggleFilter(selectedSolveFilters, s)"
                                @mouseenter="showChipTooltip($event, tagDescriptions[s])"
                                @mouseleave="hideChipTooltip">{{ s }}</span>
                        </div>
                    </div>
                    <hr class="filter-divider">

                    <!-- MISC -->
                    <div class="filter-section">
                        <div class="filter-section-header">
                            <span class="filter-section-title">MISC</span>
                        </div>
                        <div class="tag-chips">
                            <span class="tag-chip chip-misc"
                                :class="{ active: selectedMiscFilters.includes('Educational') }"
                                @click="toggleFilter(selectedMiscFilters, 'Educational')"
                                @mouseenter="showChipTooltip($event, tagDescriptions['Educational'])"
                                @mouseleave="hideChipTooltip">Educational</span>
                        </div>
                    </div>
                </template>
            </aside>

            <!-- Main content -->
            <div class="games-main">
                <div class="games-topbar">
                    <div class="search-wrap">
                        <input
                            class="search-input"
                            type="text"
                            v-model="search"
                            @keydown.esc="search = ''"
                            placeholder="Search by name..."
                        />
                    </div>
                    <select class="sort-select" v-model="sortOrder">
                        <option value="az">A to Z</option>
                        <option value="za">Z to A</option>
                    </select>
                </div>

                <!-- Type tabs -->
                <div class="type-tabs">
                    <button
                        v-for="tab in typeTabs"
                        :key="tab.value"
                        class="type-tab"
                        :class="{ active: activeTypeTab === tab.value }"
                        @click="activeTypeTab = tab.value"
                    >{{ tab.label }}</button>
                </div>

                <!-- Active filters display (all groups) -->
                <div class="active-filters" v-if="allActiveFilters.length > 0">
                    <span class="active-chip" v-for="f in allActiveFilters" :key="f.key" @click="f.remove()">
                        {{ f.label }} <span>&#10005;</span>
                    </span>
                    <span class="clear-all" @click="clearAllFilters">Clear all</span>
                </div>

                <!-- Games section -->
                <template v-if="filteredGames.length > 0">
                    <div class="section-label">Games</div>
                    <div class="games-grid">
                        <router-link
                            v-for="game in filteredGames"
                            :key="game.id"
                            :class="['game-card', game.gui]"
                            :to="{ name: 'variants', params: { type: 'games', gameId: game.id } }"
                        >
                            <div class="game-thumb">
                                <img :src="getLogoSource(game)" style="width: 8rem" />
                            </div>
                            <div class="game-card-body">
                                <div class="game-card-name">{{ game.name }}</div>
                            </div>
                        </router-link>
                    </div>
                </template>

                <!-- Puzzles section -->
                <template v-if="filteredPuzzles.length > 0 && activeTypeTab !== 'games'">
                    <div class="section-label" :class="{ 'section-label-gap': filteredGames.length > 0 }">Puzzles</div>
                    <div class="games-grid">
                        <router-link
                            v-for="puzzle in filteredPuzzles"
                            :key="puzzle.id"
                            :class="['game-card', puzzle.gui]"
                            :to="{ name: 'variants', params: { type: 'puzzles', gameId: puzzle.id } }"
                        >
                            <div class="game-thumb">
                                <img :src="getLogoSource(puzzle)" style="width: 8rem" />
                            </div>
                            <div class="game-card-body">
                                <div class="game-card-name">{{ puzzle.name }}</div>
                            </div>
                        </router-link>
                    </div>
                </template>

                <!-- Empty state -->
                <div v-if="filteredGames.length === 0 && filteredPuzzles.length === 0" class="empty-state">
                    No games or puzzles match your current filters.
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { computed, onMounted, ref } from "vue";
    import { actionTypes, useStore } from "../../scripts/plugins/store";
    import type { Game } from "../../scripts/gamesmanUni/types";
    import { gameTags } from "../../models/gameTags";

    const store = useStore();

    const getLogoSource = (game: Game) => {
        const images = import.meta.globEager("../../models/images/thumbnail/*");
        try {
            const regularThumbnailSVGPath = `../../models/images/thumbnail/${game.id}-regular.svg`;
            return images[regularThumbnailSVGPath].default;
        } catch (errorMessage) {
            try {
                const regularThumbnailFilePath = `../../models/images/thumbnail/${game.id}-regular.png`;
                return images[regularThumbnailFilePath].default;
            } catch (errorMessage) {

            }
        }
        const logo = import.meta.globEager("../../models/images/logo-gamescrafters.png");
        const appLogoFilePath = "../../models/images/logo-gamescrafters.png";
        return logo[appLogoFilePath].default;
    };

    /* ── Tag enrichment ── */
    const EMPTY_TAGS = { style: [] as string[], solveType: [] as string[], misc: [] as string[] };

    /** Returns a game enriched with its tag data from gameTags.ts (store is never mutated). */
    const enrich = (game: Game) => ({
        ...game,
        tags: gameTags[game.id] ?? EMPTY_TAGS,
    });

    /* ── Filter state ── */
    const search = ref("");
    const showGlossary = ref(false);
    const sidebarCollapsed = ref(false);
    const activeTypeTab = ref("all");
    const sortOrder = ref<"az" | "za">("az");
    const selectedGuiFilters = ref<string[]>([]);
    const selectedStyleFilters = ref<string[]>([]);
    const selectedSolveFilters = ref<string[]>([]);
    const selectedMiscFilters = ref<string[]>([]);

    const typeTabs = [
        { value: "all",        label: "All" },
        { value: "games",  label: "Games" },
        { value: "onePlayer",  label: "Puzzle" },
        { value: "v0",         label: "In development" },
    ];

    const styleChips = ["Blocking", "Rearranger", "Dartboard", "Chasing", "Impartial", "Partisan", "Connection", "Majority Control"];
    const solveChips = ["Remoteness", "Win By", "Mex", "Draw Analysis", "Unsolved"];

    const guiLabels: Record<string, string> = {
        v3: "Animated GUI",
        v2: "Artisan GUI",
        v0: "In Development",
    };

    const toggleGuiFilter = (v: string) => {
        const idx = selectedGuiFilters.value.indexOf(v);
        if (idx === -1) selectedGuiFilters.value.push(v);
        else selectedGuiFilters.value.splice(idx, 1);
    };

    const toggleFilter = (list: string[], value: string) => {
        const idx = list.indexOf(value);
        if (idx === -1) list.push(value);
        else list.splice(idx, 1);
    };

    const clearAllFilters = () => {
        selectedGuiFilters.value = [];
        selectedStyleFilters.value = [];
        selectedSolveFilters.value = [];
        selectedMiscFilters.value = [];
    };

    /** All currently-active filter chips across all groups, for the active-filters bar. */
    const allActiveFilters = computed(() => [
        ...selectedGuiFilters.value.map((v) => ({ key: `gui:${v}`, label: guiLabels[v], remove: () => toggleGuiFilter(v) })),
        ...selectedStyleFilters.value.map((v) => ({ key: `style:${v}`, label: v, remove: () => toggleFilter(selectedStyleFilters.value, v) })),
        ...selectedSolveFilters.value.map((v) => ({ key: `solve:${v}`, label: v, remove: () => toggleFilter(selectedSolveFilters.value, v) })),
        ...selectedMiscFilters.value.map((v) => ({ key: `misc:${v}`, label: v, remove: () => toggleFilter(selectedMiscFilters.value, v) })),
    ]);

    /* ── Filtering logic ──
     *   Within a group: OR  (a game matches if it has ANY of the active chips)
     *   Across groups:  AND (a game must satisfy EVERY active group)
     */
    const passesFilters = (g: ReturnType<typeof enrich>) => {
        // Tab filter (type field + gui field for "In development")
        if (activeTypeTab.value === "twoPlayer" && g.type !== "twoPlayer") return false;
        if (activeTypeTab.value === "onePlayer" && g.type !== "onePlayer") return false;
        if (activeTypeTab.value === "v0" && g.gui !== "v0") return false;
        // Search
        if (search.value && !g.name.toLowerCase().includes(search.value.toLowerCase())) return false;
        // Sidebar chip filters (OR within group, AND across groups)
        if (selectedGuiFilters.value.length > 0 && !selectedGuiFilters.value.includes(g.gui)) return false;
        if (selectedStyleFilters.value.length > 0 && !selectedStyleFilters.value.some((f) => g.tags.style.includes(f))) return false;
        if (selectedSolveFilters.value.length > 0 && !selectedSolveFilters.value.some((f) => g.tags.solveType.includes(f))) return false;
        if (selectedMiscFilters.value.length > 0 && !selectedMiscFilters.value.some((f) => g.tags.misc.includes(f))) return false;
        return true;
    };

    /* ── Data ── */
    const allGames = computed<Game[]>(() => Object.values(store.getters.games));

    const applySortOrder = (games: ReturnType<typeof enrich>[]) => {
        if (sortOrder.value === "za") {
            // Newest First = descending alphabetical as proxy (no date field exists)
            return [...games].sort((a, b) => b.name.localeCompare(a.name));
        }
        // A to Z = ascending alphabetical (A first)
        return [...games].sort((a, b) => a.name.localeCompare(b.name));
    };

    const filteredGames = computed(() =>
        applySortOrder(
            allGames.value
                .filter((g) => g.type === "twoPlayer")
                .map(enrich)
                .filter(passesFilters)
        )
    );

    const filteredPuzzles = computed(() =>
        applySortOrder(
            allGames.value
                .filter((g) => g.type === "onePlayer")
                .map(enrich)
                .filter(passesFilters)
        )
    );

    onMounted(() => {
        if (Object.keys(store.getters.games).length !== 0) return;
        store.dispatch(actionTypes.loadGames);
    });

    /* ── Chip tooltips ── */
    const tagDescriptions: Record<string, string> = {
        v3: "Games with fully animated boards rendered by the AutoGUI system.",
        v2: "Games with hand-crafted, custom-built interactive game boards.",
        v0: "Games that are still being developed and do not yet have a playable GUI.",
        Blocking: "Players win by preventing the opponent from making any legal move. The goal is positional control rather than capture.",
        Rearranger: "Players only move existing pieces already on the board. No new pieces are ever added or removed during play.",
        Dartboard: "Players only add new pieces to the board. Once placed, nothing moves. Think Tic-Tac-Toe or Connect 4.",
        Chasing: "One player pursues another across the board. The two sides have asymmetric goals.",
        Impartial: "Both players have identical available moves from any position.",
        Partisan: "Players have different moves available to them. Most games fall in this category.",
        Connection: "Players win by linking their pieces into a connected chain or path across the board.",
        "Majority Control": "Players win by holding more pieces, territory, or board positions than the opponent.",
        Remoteness: "Stores how many moves remain until the game ends assuming perfect play from any position.",
        "Win By": "Expected winning margin assuming both players maximize their final score regardless of move count.",
        Mex: "Solved using the Minimum EXcludant function from combinatorial game theory. Common for impartial games.",
        "Draw Analysis": "Stores Draw Level and Draw Remoteness values for positions where neither player can force a win.",
        Unsolved: "This game has not yet been strongly solved. The perfect strategy is still unknown.",
        Educational: "Used for teaching or demonstration purposes within the GamesCrafters research group.",
    };

    const tooltipText = ref("");
    const tooltipStyle = ref<Record<string, string>>({});

    const showChipTooltip = (event: MouseEvent, text: string) => {
        if (!text) return;
        const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
        const tooltipWidth = 200;
        const margin = 8;
        const chipCenterX = rect.left + rect.width / 2;
        const centeredLeft = chipCenterX - tooltipWidth / 2;
        const clampedLeft = Math.max(margin, Math.min(centeredLeft, window.innerWidth - tooltipWidth - margin));
        const arrowLeft = Math.max(10, Math.min(chipCenterX - clampedLeft, tooltipWidth - 10));
        tooltipText.value = text;
        tooltipStyle.value = {
            top: `${rect.bottom + 8}px`,
            left: `${clampedLeft}px`,
            '--arrow-left': `${arrowLeft}px`,
        };
    };

    const hideChipTooltip = () => { tooltipText.value = ""; };
</script>

<style lang="scss" scoped>
    #app-games {
        background-color: var(--gu-surface-alt);
    }

    /* ── GLOSSARY OVERLAY ── */
    .overlay-bg {
        display: none;
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.2);
        z-index: 299;

        &.open { display: block; }
    }

    .glossary-panel {
        display: none;
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        width: 340px;
        background: var(--gu-surface);
        border-left: 1px solid var(--gu-border);
        z-index: 300;
        overflow-y: auto;
        padding: 1.5rem;
        text-align: left;

        &.open { display: block; }
    }

    .glossary-close {
        float: right;
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        color: var(--gu-text-muted);
    }

    .glossary-heading {
        font-size: 16px;
        font-weight: 500;
        color: var(--gu-brand);
        margin-bottom: 0.25rem;
        text-align: left;
    }

    .glossary-subheading {
        font-size: 12px;
        color: var(--gu-text-muted);
        margin-bottom: 1.5rem;
        text-align: left;
    }

    .glossary-section {
        margin-bottom: 1.5rem;
    }

    .glossary-section-title {
        font-size: 11px;
        font-weight: 500;
        letter-spacing: 0.07em;
        text-transform: uppercase;
        color: var(--gu-text-muted);
        margin-bottom: 0.75rem;
        border-bottom: 1px solid var(--gu-border);
        padding-bottom: 6px;
        text-align: left;
    }

    .glossary-item {
        margin-bottom: 1rem;
    }

    .glossary-term {
        font-size: 13px;
        font-weight: 500;
        color: var(--gu-brand);
        margin-bottom: 3px;
        display: flex;
        align-items: center;
        gap: 6px;
        text-align: left;
    }

    .glossary-def {
        font-size: 12px;
        color: var(--gu-text-body);
        line-height: 1.55;
        text-align: left;
    }

    .gtag {
        font-size: 10px;
        padding: 2px 7px;
        border-radius: 20px;
        display: inline-block;
    }

    .gt-v3 { background: #f0e6ff; color: #7b1fa2; }
    .gt-v2 { background: #fef3d0; color: #9a6b00; }
    .gt-v0 { background: #fbe9e7; color: #a0522d; }
    .gt-style { background: #e8f0fb; color: #1b5aaa; }
    .gt-solve { background: #e3f5ec; color: #1a7a4a; }
    .gt-misc  { background: #fef3d0; color: #9a6b00; }

    /* ── PAGE LAYOUT ── */
    .games-layout {
        display: flex;
        min-height: calc(100vh - 112px);
        background: var(--gu-surface-alt);
    }

    /* ── SIDEBAR ── */
    .filter-sidebar {
        width: 252px;
        flex-shrink: 0;
        background-color: var(--gu-surface);
        border-right: 1px solid var(--gu-border);
        padding: 1.25rem;
        overflow-y: auto;
        overflow-x: hidden;
        transition: width 0.25s ease, padding 0.25s ease;

        &.collapsed {
            width: 44px;
            padding: 1.25rem 8px;
        }
    }

    .filter-title-row {
        margin-bottom: 0.5rem;
    }

    .filter-title {
        font-size: 15px;
        font-weight: 600;
        color: var(--gu-brand);
    }

    .filter-header-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1rem;
    }

    .sidebar-toggle {
        background: none;
        border: 1px solid var(--gu-border);
        border-radius: 6px;
        cursor: pointer;
        font-size: 16px;
        color: var(--gu-text-secondary);
        min-width: 36px;
        min-height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        margin-left: auto;

        &:hover {
            color: var(--gu-brand);
            border-color: var(--gu-brand);
        }
    }

    .glossary-btn {
        font-size: 11px;
        background: var(--gu-surface-hover);
        color: var(--gu-text-body);
        padding: 3px 10px;
        border-radius: 4px;
        cursor: pointer;
        border: 1px solid var(--gu-border);

        &:hover {
            background: var(--gu-brand);
            color: #fff;
            border-color: var(--gu-brand);
        }
    }

    .filter-section {
        margin-bottom: 1.25rem;
    }

    .filter-section-header {
        margin-bottom: 0.6rem;
    }

    .filter-section-title {
        font-size: 11px;
        font-weight: 500;
        letter-spacing: 0.07em;
        text-transform: uppercase;
        color: var(--gu-text-muted);
    }

    .tag-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
    }

    .tag-chip {
        font-size: 11px;
        padding: 4px 9px;
        border-radius: 20px;
        cursor: pointer;
        border: 1px solid transparent;
        user-select: none;
        white-space: nowrap;
        transition: background-color 0.15s, color 0.15s;
    }

    /* GUI TYPE chips — inactive: light tint bg + brand color text; active: brand color bg + white text */
    .chip-v3 { background: #f0e6ff; color: #7b1fa2; border-color: #d8b4f8; }
    .chip-v3.active { background: #7b1fa2; color: #fff; border-color: #7b1fa2; }

    .chip-v2 { background: #fef3d0; color: #9a6b00; border-color: #f5d400; }
    .chip-v2.active { background: #FDB515; color: #fff; border-color: #FDB515; }

    .chip-v0 { background: #fbe9e7; color: #a0522d; border-color: #e8a98a; }
    .chip-v0.active { background: #a0522d; color: #fff; border-color: #a0522d; }

    /* GAME STYLE chips */
    .chip-style { background: #e8f0fb; color: #1b5aaa; border-color: #c5d8f5; }
    .chip-style.active { background: #1b3a6b; color: #fff; border-color: #1b3a6b; }

    /* SOLVE TYPE chips */
    .chip-solve { background: #e3f5ec; color: #1a7a4a; border-color: #b8e5ce; }
    .chip-solve.active { background: #1b3a6b; color: #fff; border-color: #1b3a6b; }

    /* MISC chips */
    .chip-misc { background: #fef3d0; color: #9a6b00; border-color: #f5d97a; }
    .chip-misc.active { background: #1b3a6b; color: #fff; border-color: #1b3a6b; }

    .filter-divider {
        border: none;
        border-top: 1px solid var(--gu-border);
        margin: 0.25rem 0 1rem;
    }

    /* ── MAIN AREA ── */
    .games-main {
        flex: 1;
        min-width: 0;
        padding: 1.25rem 1.5rem;
    }

    .games-topbar {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 0.9rem;
    }

    .search-wrap {
        position: relative;
        flex: 1;
        max-width: 480px;
    }

    .sort-select {
        height: 36px;
        padding: 0 12px;
        border: 1px solid var(--gu-border);
        border-radius: 6px;
        font-size: 13px;
        background: var(--gu-surface);
        color: var(--gu-text-body);
        cursor: pointer;
        flex-shrink: 0;
        min-width: 140px;
        box-sizing: border-box;
    }

    .search-input {
        width: 100%;
        height: 36px;
        padding: 0 12px;
        border: 1px solid var(--gu-border);
        border-radius: 6px;
        font-size: 13px;
        background: var(--gu-surface);
        outline: none;
        color: var(--primaryColor);
        box-sizing: border-box;

        &:focus { border-color: var(--gu-brand); }
    }

    /* ── TYPE TABS ── */
    .type-tabs {
        display: flex;
        margin-bottom: 1rem;
        border: 1px solid var(--gu-border);
        border-radius: 6px;
        overflow: hidden;
        background: var(--gu-surface);
        width: fit-content;
    }

    .type-tab {
        padding: 6px 16px;
        font-size: 11px;
        cursor: pointer;
        color: var(--gu-text-secondary);
        background: transparent;
        border: none;
        border-radius: 0;
        border-right: 1px solid var(--gu-border);
        user-select: none;
        white-space: nowrap;
        transition: background-color 0.12s, color 0.12s;

        &:last-child { border-right: none; }
        &:hover:not(.active) { background: var(--gu-surface-hover); color: var(--primaryColor); }
        &.active { background: var(--gu-brand); color: #ffffff; }
    }

    /* Active filters row */
    .active-filters {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-bottom: 0.75rem;
    }

    .active-chip {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 11px;
        padding: 3px 8px;
        border-radius: 20px;
        background: #1b3a6b;
        color: #fff;
        cursor: pointer;

        > span { opacity: 0.6; }
    }

    .clear-all {
        font-size: 11px;
        color: #aaa;
        cursor: pointer;
        padding: 3px 6px;
        align-self: center;

        &:hover { color: #e24b4a; }
    }

    /* Section labels */
    .section-label {
        font-size: 11px;
        font-weight: 500;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: var(--gu-text-muted);
        margin-bottom: 0.75rem;
    }

    .section-label-gap {
        margin-top: 2rem;
    }

    /* ── GAME GRID ── */
    .games-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(178px, 1fr));
        gap: 12px;
        margin-bottom: 1rem;
    }

    /* ── GAME CARD ── */
    .game-card {
        background: var(--gu-surface);
        border-width: 2px;
        border-style: solid;
        border-color: var(--gu-border);
        border-radius: 10px;
        overflow: hidden;
        cursor: pointer;
        transition: border-color 0.15s;
        text-decoration: none;
        display: flex;
        flex-direction: column;

        &:hover {
            border-color: var(--gu-brand);
        }
    }

    /* Semantic border colors */
    .game-card.v3 { border-color: #7b1fa2; }
    .game-card.v3:hover { border-color: #7b1fa2; }

    .game-card.v2 { border-color: #FDB515; }
    .game-card.v2:hover { border-color: #FDB515; }

    .game-card.v1 { border-color: #aaaaaa; }
    .game-card.v1:hover { border-color: #1b3a6b; }

    .game-card.v0 { border-color: #a0522d; }
    .game-card.v0:hover { border-color: #a0522d; }

    .game-thumb {
        height: 108px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid var(--gu-border);
        overflow: hidden;
        background: var(--gu-surface-alt);
    }

    .game-thumb img {
        max-height: 100%;
        object-fit: contain;
    }

    .game-card-body {
        padding: 10px 12px;
        flex: 1;
    }

    .game-card-name {
        font-size: 13px;
        font-weight: 500;
        color: var(--gu-brand);
        text-align: left;
        line-height: 1.4;
    }

    /* ── CHIP TOOLTIP ── */
    .chip-tooltip {
        position: fixed;
        background: #1b3a6b;
        color: #ffffff;
        font-size: 11px;
        line-height: 1.5;
        padding: 7px 11px;
        border-radius: 6px;
        width: 200px;
        white-space: normal;
        pointer-events: none;
        z-index: 500;

        &::before {
            content: '';
            position: absolute;
            top: -5px;
            left: var(--arrow-left, 100px);
            transform: translateX(-50%);
            border: 6px solid transparent;
            border-bottom-color: #1b3a6b;
            border-top: none;
        }
    }

    /* Empty state */
    .empty-state {
        font-size: 13px;
        color: var(--gu-text-muted);
        padding: 2rem;
        text-align: center;
    }
</style>
