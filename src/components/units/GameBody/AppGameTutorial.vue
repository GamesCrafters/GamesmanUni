<template>
    <div v-if="visible" id="app-game-tutorial" :class="{ berkeley: isBreakthrough }">
        <button id="close-button" @click="close" title="Close">⨉</button>
        <div id="label">🎓 Tutorial</div>
        <p>{{ texts[step] }}</p>
        <div id="footer">
            <div id="steps">
                <span v-for="n in 4" :key="n" class="dot" :class="{ filled: n - 1 <= step }"></span>
            </div>
            <button v-if="step === 0 || step === 3" id="next-button" @click="next">{{ step === 3 ? "Got it!" : "Next" }}</button>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { computed, ref, watch } from "vue";
    import { actionTypes, mutationTypes, useStore } from "../../../scripts/plugins/store";
    import { defaultCPUsStrategies, defaultCPUsRatings } from "../../../models/datas/defaultApp";
    import { tutorialState } from "../../../scripts/tutorial";

    const store = useStore();
    const gameName = computed(() => store.getters.currentGameName);
    const isBreakthrough = computed(() => store.getters.currentGameId === "breakthrough");
    const currentPosition = computed(() => store.getters.currentPosition);
    const isTutorialVariant = computed(() => {
        const game = store.getters.game(store.getters.currentGameId);
        const variant = game?.variants[store.getters.currentVariantId];
        return variant?.name === "Tutorial";
    });

    const texts = computed(() => [
        `Let's learn how to play ${gameName.value}!`,
        "Pawns move straight or diagonally forward. Make a move to see how it works.",
        "You can capture an enemy pawn by moving diagonally onto its square. Try it!",
        "You win by reaching the far row, or by capturing every enemy pawn. That covers the basics — good luck!",
    ]);

    const step = ref(0);
    const visible = ref(false);
    const isScripting = ref(false);

    // Step 1 accepts any of the 7 legal first moves, so the opponent's
    // scripted reply (and the capture it sets up for step 2) has to be
    // picked based on which column the player's pawn actually landed in —
    // verified against the real solved 3x4 board for all 3 possible
    // columns. Row 1 is board characters at indices 3 (col0), 4 (col1), 5
    // (col2).
    const pickReplyAndCapture = (positionAfterPlayerMove: string) => {
        if (positionAfterPlayerMove[4] === 'o') return { reply: "M_9_6_x", capture: "M_4_6_x" };
        if (positionAfterPlayerMove[3] === 'o') return { reply: "M_10_7_x", capture: "M_3_7_x" };
        return { reply: "M_10_7_x", capture: "M_5_7_x" }; // landed at col2
    };
    let captureMove = "";

    const applyStep = () => {
        if (step.value === 1) tutorialState.allowedMove = null; // any move
        else if (step.value === 2) tutorialState.allowedMove = captureMove;
        else if (step.value === 3) tutorialState.allowedMove = null; // free play
        else tutorialState.allowedMove = ""; // step 0: narration only
    };

    // Switches the opponent from tutorial-scripted to the real (deliberately
    // weak) computer AI, for free play once the scripted steps are done.
    const startAsHumanVsComputer = () => {
        store.commit(mutationTypes.setLeftPlayerIsComputer, false);
        store.commit(mutationTypes.setRightPlayerIsComputer, true);
        store.commit(mutationTypes.setCPUsStrategies, ["Remoteness", "Skill Expression"]);
        store.commit(mutationTypes.setCPUsRatings, [0, 0]);
        if (store.getters.currentPlayer.isComputer) store.dispatch(actionTypes.runComputerMove);
    };

    const resetPlayers = () => {
        store.commit(mutationTypes.setLeftPlayerIsComputer, false);
        store.commit(mutationTypes.setRightPlayerIsComputer, false);
        store.commit(mutationTypes.setCPUsStrategies, [...defaultCPUsStrategies]);
        store.commit(mutationTypes.setCPUsRatings, [...defaultCPUsRatings]);
    };

    const close = () => {
        visible.value = false;
        tutorialState.allowedMove = null;
    };

    const next = () => {
        if (step.value === 3) {
            close();
            return;
        }
        step.value++;
        applyStep();
        if (step.value === 3) startAsHumanVsComputer();
    };

    watch(isTutorialVariant, (isTutorial) => {
        if (isTutorial) {
            step.value = 0;
            visible.value = true;
            applyStep();
            store.commit(mutationTypes.showMenu, false);
        } else {
            visible.value = false;
            tutorialState.allowedMove = null;
            resetPlayers();
            store.commit(mutationTypes.showMenu, true);
        }
    }, { immediate: true });

    watch(currentPosition, async (newPosition) => {
        if (!visible.value || isScripting.value) return;
        if (step.value === 1) {
            // The player just made their (any legal) move — script the
            // opponent's reply that sets up a capture, then advance.
            const { reply, capture } = pickReplyAndCapture(newPosition);
            captureMove = capture;
            isScripting.value = true;
            tutorialState.allowedMove = "";
            await store.dispatch(actionTypes.runMove, { autoguiMove: reply });
            isScripting.value = false;
            next();
        } else if (step.value === 2) {
            // The player just made the capture.
            next();
        }
    });
</script>

<style lang="scss" scoped>
    #app-game-tutorial {
        background-color: var(--backgroundColor);
        border-radius: 1rem;
        border-left: 0.35rem solid var(--secondaryColor);
        border-top: 0.1rem solid var(--neutralColor);
        border-right: 0.1rem solid var(--neutralColor);
        border-bottom: 0.1rem solid var(--neutralColor);
        box-shadow: 0 0.2rem 0.6rem rgba(0, 0, 0, 0.2);
        left: calc(75% + 10rem);
        max-width: 24rem;
        padding: 1.75rem 2.25rem;
        position: fixed;
        text-align: left;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 24rem;
        z-index: 10;
        > #close-button {
            border-radius: 100%;
            font-size: 1rem;
            height: 1.75rem;
            line-height: 1.75rem;
            padding: 0;
            position: absolute;
            right: 0.6rem;
            top: 0.6rem;
            width: 1.75rem;
        }
        > #label {
            color: var(--secondaryColor);
            font-size: 1.05rem;
            font-weight: 600;
            letter-spacing: 0.05rem;
            margin-bottom: 0.75rem;
            text-transform: uppercase;
        }
        > p {
            font-size: 1.6rem;
            line-height: 2.3rem;
            margin: 0 0 1.25rem 0;
            text-align: left;
        }
        > #footer {
            align-items: center;
            display: flex;
            justify-content: space-between;
        }
        > #footer > #steps {
            display: flex;
            gap: 0.4rem;
            > .dot {
                background: var(--neutralColor);
                border-radius: 100%;
                display: block;
                height: 0.5rem;
                width: 0.5rem;
            }
        }
        > #footer > #next-button {
            font-size: 1.25rem;
            padding: 0.5rem 1.5rem;
        }

        &.berkeley {
            background: #ffffff;
            border-left: none;
            border-top: 0.35rem solid #FDB515;
            border-right: none;
            border-bottom: none;
            box-shadow: 0 0.5rem 1.6rem rgba(0, 50, 98, 0.28);
            color: #1e1e1e;
            > #close-button {
                background: rgba(0, 50, 98, 0.08);
                color: #003262;
            }
            > #label {
                color: #003262;
            }
            > #footer > #steps > .dot.filled {
                background: #003262;
            }
            > #footer > #next-button {
                background: #003262;
                border: none;
                color: #FDB515;
                font-weight: 600;
                &:hover {
                    background: #01498f;
                }
            }
        }
    }
</style>
