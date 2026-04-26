<template>
<div class="welcome">
    <div class="hero">
        <div class="hero-bp-area">
            <div class="hero-left">
                <div class="hero-eyebrow">UC Berkeley · GamesCrafters · Est. 2001</div>
                <h1 class="hero-title">Play and analyze<br>perfectly solved games</h1>
                <p class="hero-sub">Finite, two-player, perfect-information games — computed and made playable by Berkeley undergraduates. Every position evaluated, every optimal move known.</p>
                <div class="hero-stats">
                    <div class="hero-stat">
                        <div class="hero-stat-num">{{ gameCount }}+</div>
                        <div class="hero-stat-label">games integrated</div>
                    </div>
                    <div class="hero-stat">
                        <div class="hero-stat-num">{{ puzzleCount }}+</div>
                        <div class="hero-stat-label">puzzles solved</div>
                    </div>
                    <div class="hero-stat">
                        <div class="hero-stat-num">500+</div>
                        <div class="hero-stat-label">contributors</div>
                    </div>
                </div>
                <div class="hero-cta-row">
                    <button class="btn-primary" @click="exploreAllGames">Browse</button>
                    <button class="btn-ghost" @click="infoGames">About the project</button>
                </div>
            </div>
            <div class="hero-right">
                <svg class="bp-svg" viewBox="0 0 380 320" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(100,160,255,0.10)" stroke-width="0.5"/>
                        </pattern>
                        <marker id="arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                            <path d="M0,0 L6,3 L0,6 Z" fill="rgba(100,180,255,0.5)"/>
                        </marker>
                    </defs>
                    <rect width="380" height="320" fill="url(#grid)"/>
                    <rect x="10" y="10" width="360" height="300" fill="none" stroke="rgba(100,160,255,0.18)" stroke-width="1" stroke-dasharray="6 4"/>
                    <!-- LAYER 1: GAME MODULE -->
                    <rect x="130" y="240" width="120" height="44" rx="3" fill="none" stroke="#4a9eff" stroke-width="1.2" stroke-dasharray="4 3" opacity="0.5"/>
                    <text x="190" y="258" text-anchor="middle" fill="#7ab8ff" font-size="8" font-family="monospace" opacity="0.8">GAME MODULE</text>
                    <text x="190" y="272" text-anchor="middle" fill="#4a9eff" font-size="7" font-family="monospace" opacity="0.6">C / Python</text>
                    <!-- LAYER 2: SOLVER -->
                    <rect x="90" y="185" width="200" height="40" rx="3" fill="none" stroke="#4a9eff" stroke-width="1.2" stroke-dasharray="4 3" opacity="0.55"/>
                    <text x="190" y="201" text-anchor="middle" fill="#7ab8ff" font-size="8" font-family="monospace" opacity="0.8">SOLVER ENGINE</text>
                    <text x="190" y="215" text-anchor="middle" fill="#4a9eff" font-size="7" font-family="monospace" opacity="0.6">strong solve · hash · database</text>
                    <line x1="190" y1="240" x2="190" y2="225" stroke="#4a9eff" stroke-width="0.8" stroke-dasharray="3 2" opacity="0.4" marker-end="url(#arr)"/>
                    <!-- LAYER 3: UWAPI -->
                    <rect x="60" y="130" width="260" height="40" rx="3" fill="none" stroke="#FDB515" stroke-width="1.2" stroke-dasharray="4 3" opacity="0.45"/>
                    <text x="190" y="146" text-anchor="middle" fill="#FDB515" font-size="8" font-family="monospace" opacity="0.85">UWAPI</text>
                    <text x="190" y="160" text-anchor="middle" fill="#FDB515" font-size="7" font-family="monospace" opacity="0.55">universal web api · REST endpoints</text>
                    <line x1="190" y1="185" x2="190" y2="170" stroke="#FDB515" stroke-width="0.8" stroke-dasharray="3 2" opacity="0.35" marker-end="url(#arr)"/>
                    <!-- LAYER 4: FRONTEND -->
                    <rect x="30" y="75" width="320" height="40" rx="3" fill="none" stroke="#4a9eff" stroke-width="1.2" stroke-dasharray="4 3" opacity="0.55"/>
                    <text x="190" y="91" text-anchor="middle" fill="#7ab8ff" font-size="8" font-family="monospace" opacity="0.85">GamesmanUni  (Vue.js)</text>
                    <text x="190" y="105" text-anchor="middle" fill="#4a9eff" font-size="7" font-family="monospace" opacity="0.6">game browser · board GUI · value history</text>
                    <line x1="190" y1="130" x2="190" y2="115" stroke="#4a9eff" stroke-width="0.8" stroke-dasharray="3 2" opacity="0.4" marker-end="url(#arr)"/>
                    <!-- LAYER 5: USER -->
                    <rect x="110" y="28" width="160" height="34" rx="3" fill="none" stroke="#7ab8ff" stroke-width="1" stroke-dasharray="4 3" opacity="0.4"/>
                    <text x="190" y="43" text-anchor="middle" fill="#9dcfff" font-size="8" font-family="monospace" opacity="0.75">USER</text>
                    <text x="190" y="56" text-anchor="middle" fill="#7ab8ff" font-size="7" font-family="monospace" opacity="0.5">browser · keyboard · analysis</text>
                    <line x1="190" y1="75" x2="190" y2="62" stroke="#7ab8ff" stroke-width="0.8" stroke-dasharray="3 2" opacity="0.35" marker-end="url(#arr)"/>
                    <!-- Side labels -->
                    <text x="18" y="260" fill="rgba(100,160,255,0.3)" font-size="7" font-family="monospace" transform="rotate(-90 18 260)">STACK</text>
                    <line x1="22" y1="28" x2="22" y2="284" stroke="rgba(100,160,255,0.15)" stroke-width="0.5"/>
                    <line x1="18" y1="28" x2="26" y2="28" stroke="rgba(100,160,255,0.2)" stroke-width="0.5"/>
                    <line x1="18" y1="284" x2="26" y2="284" stroke="rgba(100,160,255,0.2)" stroke-width="0.5"/>
                    <!-- Corner marks -->
                    <path d="M10,30 L10,10 L30,10" fill="none" stroke="rgba(100,160,255,0.25)" stroke-width="1"/>
                    <path d="M370,30 L370,10 L350,10" fill="none" stroke="rgba(100,160,255,0.25)" stroke-width="1"/>
                    <path d="M10,290 L10,310 L30,310" fill="none" stroke="rgba(100,160,255,0.25)" stroke-width="1"/>
                    <path d="M370,290 L370,310 L350,310" fill="none" stroke="rgba(100,160,255,0.25)" stroke-width="1"/>
                    <!-- Callout: remoteness -->
                    <rect x="295" y="145" width="72" height="30" rx="3" fill="rgba(27,58,107,0.6)" stroke="#FDB515" stroke-width="0.8" opacity="0.75"/>
                    <text x="331" y="157" text-anchor="middle" fill="#FDB515" font-size="7" font-family="monospace">remoteness</text>
                    <text x="331" y="169" text-anchor="middle" fill="#aac8ff" font-size="6" font-family="monospace">∀ positions</text>
                    <line x1="295" y1="160" x2="280" y2="152" stroke="#FDB515" stroke-width="0.6" opacity="0.4"/>
                    <!-- Callout: mex -->
                    <rect x="10" y="148" width="52" height="28" rx="3" fill="rgba(27,58,107,0.6)" stroke="#4a9eff" stroke-width="0.8" opacity="0.7"/>
                    <text x="36" y="160" text-anchor="middle" fill="#7ab8ff" font-size="7" font-family="monospace">Mex / Nim</text>
                    <text x="36" y="171" text-anchor="middle" fill="#aac8ff" font-size="6" font-family="monospace">impartial</text>
                    <line x1="62" y1="162" x2="80" y2="155" stroke="#4a9eff" stroke-width="0.6" opacity="0.35"/>
                    <!-- Watermark -->
                    <text x="370" y="316" text-anchor="end" fill="rgba(100,160,255,0.18)" font-size="7" font-family="monospace">GAMESCRAFTERS SYSTEM ARCHITECTURE</text>
                </svg>
            </div>
        </div>
    </div>

    <div class="home-lower">
        <div class="home-cards">
            <div class="home-card">
                <div class="hc-icon hc-blue">&#9651;</div>
                <h4>Strong solutions</h4>
                <p>Every game is solved in the strict sense: optimal play is computed from every legal board position, not just common ones.</p>
            </div>
            <div class="home-card">
                <div class="hc-icon hc-gold">&#9632;</div>
                <h4>Remoteness &amp; Mex</h4>
                <p>See how many moves remain until the game ends under perfect play, and explore minimum excludant values for impartial games.</p>
            </div>
            <div class="home-card">
                <div class="hc-icon hc-teal">&#9711;</div>
                <h4>Impartial &amp; partisan</h4>
                <p>From Nim-like impartial games to asymmetric partisan ones, the full spectrum of combinatorial game theory is represented.</p>
            </div>
        </div>
    </div>
</div>
</template>

<script lang="ts" setup>
    import { useRouter } from "vue-router";
    import { actionTypes, useStore } from "../../scripts/plugins/store";
    import { computed, onMounted } from "vue";
    import { Game } from "../../scripts/gamesmanUni/types";

    const router = useRouter();
    const store = useStore();

    const exploreAllGames = () => {
        router.push("/games");
    }
    const exploreAllPuzzles = () => {
        router.push("/puzzles");
    }
    const infoGames = () => {
        router.push("/about");
    }

    onMounted(() => {
        if (Object.keys(store.getters.games).length !== 0) return;
        store.dispatch(actionTypes.loadGames);
    });

    const allGames = computed<Game[]>(() => Object.values(store.state.app.games));

    const gameCount = computed(() => {
        const games = allGames.value.filter(game => game.type === "twoPlayer")
        return games.length > 0 ? games.length : 54;
    });

    const puzzleCount = computed(() => {
        const puzzles = allGames.value.filter(game => game.type === "onePlayer")
        return puzzles.length > 0 ? puzzles.length : 9;
    });
</script>

<style lang="scss" scoped>
.welcome {
    --gu-navy: #1b3a6b;
    --gu-gold: #FDB515;
    --gu-bg: #f7f6f2;
    --gu-border: #e0ddd6;

    display: flex;
    flex-direction: column;
}

/* ── HERO ── */
.hero {
    background-color: #0f1e3a;
    overflow: hidden;
    padding: 3rem 3rem;
}

.hero-bp-area {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 300px;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
}

.hero-left {
    flex: 1;
    padding: 0 2.5rem 0 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
}

.hero-eyebrow {
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #FDB515;
    font-weight: 500;
    margin-bottom: 0.6rem;
    text-align: left;
}

.hero-title {
    font-size: 28px;
    font-weight: 500;
    color: #ffffff;
    line-height: 1.3;
    margin-bottom: 0.75rem;
    text-align: left;
}

.hero-sub {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.65);
    line-height: 1.7;
    margin-bottom: 1.5rem;
    max-width: 360px;
    text-align: left;
}

.hero-stats {
    display: flex;
    gap: 2rem;
    margin-bottom: 1.75rem;
}

.hero-stat-num {
    font-size: 22px;
    font-weight: 500;
    color: #FDB515;
    text-align: left;
}

.hero-stat-label {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.5);
    margin-top: 2px;
    text-align: left;
}

.hero-cta-row {
    display: flex;
    gap: 10px;
}

.btn-primary {
    background-color: #FDB515;
    color: #1b3a6b;
    border: none;
    padding: 9px 20px;
    border-radius: 6px;
    font-size: 13px;
    cursor: pointer;
    font-weight: 500;
    box-shadow: none;
    transition: opacity 0.2s;

    &:hover {
        opacity: 0.88;
    }
}

.btn-ghost {
    background: transparent;
    color: #ffffff;
    border: 1px solid rgba(255, 255, 255, 0.35);
    padding: 9px 20px;
    border-radius: 6px;
    font-size: 13px;
    cursor: pointer;
    box-shadow: none;
    transition: opacity 0.2s;

    &:hover {
        opacity: 0.75;
    }
}

.hero-right {
    width: 420px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
}

.bp-svg {
    width: 100%;
    max-width: 380px;
    height: auto;
}

/* ── HOME LOWER ── */
.home-lower {
    background-color: var(--gu-surface-alt);
    padding: 2rem;
}

.home-cards {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 16px;
    max-width: 900px;
    margin: 0 auto;
}

.home-card {
    background-color: var(--gu-surface);
    border: 1px solid var(--gu-border);
    border-radius: 10px;
    padding: 1.25rem;

    > .hc-icon {
        width: 30px;
        height: 30px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 15px;
        margin-bottom: 10px;
    }

    > .hc-blue { background: #dde9f7; }
    > .hc-gold { background: #fef3d0; }
    > .hc-teal { background: #d5f0e8; }

    > h4 {
        font-size: 13px;
        font-weight: 500;
        color: var(--gu-brand);
        margin-bottom: 4px;
        text-align: left;
    }

    > p {
        font-size: 12px;
        color: var(--gu-text-body);
        line-height: 1.5;
        text-align: left;
    }
}
</style>

<i18n lang="json">
    {
        "zh": {
            "title": "欢迎！"
        },
        "en-US": {
            "title": "Welcome! "
        },
        "es": {
            "title": "¡Bienvenido!"
        },
        "hi": {
            "title": "आपका स्वागत है!"
        }
    }
</i18n>
