<template>
    <div id="app-about">
        <div class="about-wrap">
            <div class="about-eyebrow">UC Berkeley · GamesCrafters · Est. 2001</div>
            <h2 class="about-heading">GamesCrafters at UC Berkeley</h2>
            <p class="about-intro">
                An undergraduate research and development group exploring the fertile area of combinatorial and computational game theory,
                advised by <a href="https://people.eecs.berkeley.edu/~ddgarcia/" target="_blank" rel="noopener noreferrer">Professor Dan Garcia</a>.
            </p>

            <div class="about-grid">
                <!-- Motivation -->
                <div class="about-card">
                    <div class="about-card-title">Motivation</div>
                    <p>Games have been played for millennia — wall paintings over 5,000 years old have been found in Egypt. People are playing the same games now as they were back then, but only now are we able to <strong>strongly solve</strong> them.</p>
                    <p>GamesCrafters was formed to explore the fertile area of combinatorial and computational game theory.</p>
                </div>

                <!-- Games We Solve -->
                <div class="about-card">
                    <div class="about-card-title">Games We Solve</div>
                    <ul class="about-list">
                        <li><strong>Two players</strong> — Left &amp; Right</li>
                        <li><strong>No chance</strong> — no dice or shuffled cards</li>
                        <li><strong>Perfect information</strong> — both players see everything</li>
                        <li><strong>Finite</strong> — the game must eventually end</li>
                    </ul>
                </div>

                <!-- Moves & Positions -->
                <div class="about-card">
                    <div class="about-card-title">Moves &amp; Positions</div>
                    <p class="about-def"><span class="about-term">Winning Move</span> Either wins the game, or leaves the opponent with only losing moves.</p>
                    <p class="about-def"><span class="about-term">Losing Move</span> Either loses the game, or leaves the opponent with winning moves.</p>
                    <p class="about-def"><span class="about-term">Tying Move</span> Either makes a tie, or leaves the opponent with tying and losing moves.</p>
                    <div class="about-values">
                        <div class="value-chip uni-win">Win</div>
                        <div class="value-chip uni-lose">Lose</div>
                        <div class="value-chip uni-tie">Tie</div>
                    </div>
                </div>

                <!-- How We Do It -->
                <div class="about-card">
                    <div class="about-card-title">How We Do It</div>
                    <p>The value of a game is determined by a <strong>brute-force exhaustive search</strong> of the game tree. The value of a particular board configuration, or <strong>position</strong>, is based on the values of its children — the positions that are one legal move away.</p>
                    <p>A position has a value of either <strong>Win</strong>, <strong>Lose</strong>, or <strong>Tie</strong>. Moves are also labeled with one of these three values.</p>
                </div>
            </div>

            <div class="stack-box">
                <div class="stack-label">Technical stack</div>
                <div class="stack-tags">
                    <span class="stack-tag">Vue.js</span>
                    <span class="stack-tag">Python (UWAPI)</span>
                    <span class="stack-tag">C (Gamesman core)</span>
                    <span class="stack-tag">PWA / SPA</span>
                    <span class="stack-tag">TypeScript</span>
                    <span class="stack-tag">Vite</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
</script>

<style lang="scss" scoped>
    #app-about {
        background-color: var(--gu-surface-alt);
        padding: 2.5rem 1rem;
        min-height: calc(100vh - 68px);
    }

    .about-wrap {
        max-width: 900px;
        margin: 0 auto;
        padding: 0 2rem;
    }

    .about-eyebrow {
        font-size: 11px;
        color: #FDB515;
        letter-spacing: 0.07em;
        text-transform: uppercase;
        font-weight: 500;
        margin-bottom: 0.5rem;
        text-align: left;
    }

    .about-heading {
        font-size: 26px;
        font-weight: 500;
        color: var(--gu-brand);
        margin-bottom: 0.75rem;
        text-align: left;
    }

    .about-intro {
        font-size: 14px;
        color: var(--gu-text-body);
        line-height: 1.7;
        margin-bottom: 2rem;
        text-align: left;

        a {
            color: var(--gu-brand);
            text-decoration: none;
            &:hover { text-decoration: underline; }
        }
    }

    .about-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        margin-bottom: 1.5rem;
    }

    .about-card {
        background: var(--gu-surface);
        border: 1px solid var(--gu-border);
        border-radius: 10px;
        padding: 1.25rem 1.5rem;
        text-align: left;

        p {
            font-size: 13px;
            color: var(--gu-text-body);
            line-height: 1.7;
            margin-bottom: 0.75rem;
            &:last-child { margin-bottom: 0; }
        }
    }

    .about-card-title {
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--gu-brand);
        margin-bottom: 0.75rem;
    }

    .about-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 8px;

        li {
            font-size: 13px;
            color: var(--gu-text-body);
            line-height: 1.5;
            padding-left: 1rem;
            position: relative;

            &::before {
                content: '•';
                position: absolute;
                left: 0;
                color: var(--gu-brand);
            }
        }
    }

    .about-def {
        font-size: 13px;
        color: var(--gu-text-body);
        line-height: 1.6;
        margin-bottom: 0.6rem;
    }

    .about-term {
        font-weight: 600;
        color: var(--gu-brand);
        margin-right: 4px;
    }

    .about-values {
        display: flex;
        gap: 8px;
        margin-top: 0.75rem;

        .value-chip {
            font-size: 11px;
            font-weight: 600;
            padding: 3px 10px;
            border-radius: 6px;
        }
    }

    .stack-box {
        background-color: var(--gu-surface);
        border: 1px solid var(--gu-border);
        border-radius: 10px;
        padding: 1.25rem;
        margin-top: 0.5rem;
    }

    .stack-label {
        font-size: 11px;
        font-weight: 600;
        color: var(--gu-text-muted);
        letter-spacing: 0.07em;
        text-transform: uppercase;
        margin-bottom: 0.75rem;
        text-align: left;
    }

    .stack-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        justify-content: flex-start;
    }

    .stack-tag {
        background-color: var(--gu-surface-hover);
        color: var(--gu-text-body);
        font-size: 12px;
        padding: 3px 10px;
        border-radius: 4px;
        font-family: monospace;
    }

    @media (max-width: 640px) {
        .about-grid { grid-template-columns: 1fr; }
    }
</style>
