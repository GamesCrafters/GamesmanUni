<template>
    <div id="app-game-body-header-options">
        <button @click="store.commit(mutationTypes.showOptions, true)" title="Options">⚙</button>
        <UniPopupWindow v-if="(options && options.showOptions) || false" @close="updateOptions()">
            <div id="popup">
                <h1 id="title">{{ gameName }} ({{ variantDescription }})</h1>

                <!-- themes -->
                <div id="gameThemes" v-if="gameThemes.length > 1">
                    <h3 id="title">Themes</h3>
                    <div class="uni-dropdown">
                        <div class="uni-dropdown-selection" style="padding:0.5rem 1.5rem 0.5rem 0.5rem;">{{ currentGameTheme }} ▼</div>
                        <div class="uni-dropdown-menu">
                            <div class="uni-dropdown-menu-option"
                                    v-for="gameTheme in gameThemes"
                                    :key="gameTheme"
                                    @click="setGameTheme(gameTheme)">
                                {{ gameTheme }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- player settings -->
                <div id="players">
                    <h3 id="title" v-if="isPuzzleGame">Player</h3>
                    <h3 id="title" v-else>Players</h3>

                    <div id="names" v-if="isPuzzleGame">
                        <div class="name">
                            <h4 class="title">Current Player</h4>
                            <input class="uni-turn-1 input"
                                aria-label="text"
                                :placeholder="`Current: ${currentLeftPlayerName}`"
                                v-model="updatedLeftPlayer.name" />
                            <p class="label">
                                New: <span class="uni-turn-1">{{ 
                                    updatedLeftPlayer.name ? updatedLeftPlayer.name : currentLeftPlayer.name
                                }}</span>
                            </p>
                            <input class="uni-toggle-button"
                                aria-label="toggle"
                                type="checkbox"
                                v-model="updatedLeftPlayer.isComputer" />
                            <label for="checkbox">Computer</label>
                        </div>
                    </div>
                    <div id="names" v-else>
                        <div class="name">
                            <h4 class="title">First Player</h4>
                            <input class="uni-turn-1 input"
                                aria-label="text"
                                :placeholder="`Current: ${currentLeftPlayerName}`"
                                v-model="updatedLeftPlayer.name" />
                            <p class="label">
                                New: <span class="uni-turn-1">{{ 
                                    updatedLeftPlayer.name ? updatedLeftPlayer.name : currentLeftPlayer.name
                                }}</span>
                            </p>
                            <input class="uni-toggle-button"
                                aria-label="toggle"
                                type="checkbox"
                                v-model="updatedLeftPlayer.isComputer" />
                            <label for="checkbox">Computer</label>
                            <div v-if="updatedLeftPlayer.isComputer">
                                <div class="strategy-dropdown">
                                    <div class="strategy-dropdown-selection">
                                        <b>{{ currentCPUsStrategies[0] }} ▼</b>
                                    </div>
                                    <div class="strategy-dropdown-options">
                                        <div class="strategy-dropdown-option" :class="{active: CPUStrategyOption === currentCPUsStrategies[0]}" v-for="CPUStrategyOption in CPUStrategies" :key="CPUStrategyOption" @click="setCPUStrategy(0, CPUStrategyOption)">
                                            <div v-if="renderDropdownOption(CPUStrategyOption, currentCPUsStrategies[0])">
                                            <b>{{ CPUStrategyOption }}</b>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <br>
                                Strategy
                                <div v-if="currentCPUsStrategies[0] === 'Skill Expression'">
                                    <VueSlider id="slider"
                                    v-model="currentCPUsRatings[0]"
                                    :min="0"
                                    :max="1"
                                    :interval="0.01"
                                    :tooltip="'active'" />
                                    Skill Rating
                                </div>
                            </div>
                        </div>
                        <div class="name">
                            <h4 class="title">Second Player</h4>
                            <input class="uni-turn-2 input"
                                aria-label="text"
                                :placeholder="`Current: ${currentRightPlayerName}`"
                                v-model="updatedRightPlayer.name" />
                            <p class="label">
                                New: <span class="uni-turn-2">{{ 
                                    updatedRightPlayer.name ? updatedRightPlayer.name : currentRightPlayer.name
                                }}</span>
                            </p>
                            <input class="uni-toggle-button"
                                aria-label="toggle"
                                type="checkbox"
                                v-model="updatedRightPlayer.isComputer" />
                            <label for="checkbox">Computer</label>
                            <div v-if="updatedRightPlayer.isComputer">
                                <div class="strategy-dropdown">
                                    <div class="strategy-dropdown-selection">
                                        <b>{{ currentCPUsStrategies[1] }} ▼</b>
                                    </div>
                                    <div class="strategy-dropdown-options">
                                        <div class="strategy-dropdown-option" :class="{active: CPUStrategyOption === currentCPUsStrategies[1]}" v-for="CPUStrategyOption in CPUStrategies" :key="CPUStrategyOption" @click="setCPUStrategy(1, CPUStrategyOption)">
                                            <div v-if="renderDropdownOption(CPUStrategyOption, currentCPUsStrategies[1])">
                                            <b>{{ CPUStrategyOption }}</b>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <br>
                                Strategy
                                <div v-if="currentCPUsStrategies[1] === 'Skill Expression'">
                                    <VueSlider id="slider"
                                    v-model="currentCPUsRatings[1]"
                                    :min="0"
                                    :max="1"
                                    :interval="0.01"
                                    :tooltip="'active'" />
                                    Skill Rating
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="visibility-options" v-if="atLeastOnePlayerIsntComputer">
                    <div id="options">
                        <div class="option">
                            <input class="uni-toggle-button"
                                aria-label="toggle"
                                type="checkbox"
                                v-model="options.automoveIfSingleMove" />
                            <label for="checkbox">Automove if Only One Legal Move Available</label>
                        </div>
                    </div>
                </div>

                <!-- computer move settings -->
                <div id="computer-move-duration" v-show="computerInLoop">
                    <h3 class="title">Computer Move Duration (milliseconds)</h3>
                    <VueSlider id="slider"
                        v-model="options.computerMoveDuration"
                        :min="0"
                        :max="10000"
                        :interval="100"
                        :tooltip="'active'" />
                    <i>
                        (Note: The actual duration will be either the ideal duration above 
                        or server data load time if there is any server data load action, 
                        whichever is greater.)
                    </i>
                </div>

                <!-- visibility options -->
                <div id="visibility-options">
                    <h3 id="title">Visibility Options</h3>
                    <div id="options">
                        <div class="option">
                            <input class="uni-toggle-button"
                                aria-label="toggle"
                                type="checkbox"
                                v-model="options.showMenu" />
                            <label for="checkbox">Game Menu</label>
                        </div>
                        <div class="option">
                            <input class="uni-toggle-button"
                                aria-label="toggle"
                                type="checkbox"
                                v-model="options.showNextMoves" @click="() => {options.showNextMoveHints = false; options.showNextMoveDeltaRemotenesses = false}"/>
                            <label for="checkbox">Available Move Buttons</label>
                        </div>
                        <div class="option" v-if="options.showNextMoves">
                            <input class="uni-toggle-button"
                                aria-label="toggle"
                                type="checkbox"
                                v-model="options.showNextMoveHints" />
                            <label for="checkbox">Available Moves' Position Value Predictions</label>
                        </div>
                        <div class="option" v-if="options.showNextMoves && options.showNextMoveHints">
                            <input class="uni-toggle-button"
                                aria-label="toggle"
                                type="checkbox"
                                v-model="options.showNextMoveDeltaRemotenesses" />
                            <label for="checkbox">Available Moves' Delta Remoteness Predictions</label>
                        </div>
                    </div>
                </div>
            </div>
        </UniPopupWindow>
    </div>
</template>

<script lang="ts" setup>
    import { computed, ref, watch } from "vue";
    import { useRoute } from "vue-router";
    import { actionTypes, mutationTypes, useStore } from "../../../scripts/plugins/store";
    import VueSlider from "vue-slider-component";
    import UniPopupWindow from "../../templates/UniPopupWindow.vue";
    import { CPUStrategies } from "../../../models/datas/defaultApp";

    const route = useRoute();
    const store = useStore();
    const isPuzzleGame = computed(() => store.getters.currentGameType === "puzzles");

    const currentPlayer = computed(() => store.getters.currentPlayer);
    const currentLeftPlayer = computed(() => store.getters.currentLeftPlayer);
    const currentRightPlayer = computed(() => store.getters.currentRightPlayer);
    const currentLeftPlayerName = computed(() => (currentLeftPlayer ? currentLeftPlayer.value.name : ""));
    const currentRightPlayerName = computed(() => (currentRightPlayer ? currentRightPlayer.value.name : ""));
    const currentGameType = computed(() => store.getters.currentGameType);
    const currentGameId = computed(() => store.getters.currentGameId); 

    const updatedLeftPlayer = ref({ name: "", isComputer: false });
    const updatedRightPlayer = ref({ name: "", isComputer: false });
    const atLeastOnePlayerIsntComputer = computed(() => !updatedLeftPlayer.value.isComputer || (!updatedRightPlayer.value.isComputer && !isPuzzleGame.value));

    const gameType = route.params.type as string;
    const gameId = route.params.gameId as string;
    const variantId = route.params.variantId as string;

    const game = computed(() => store.getters.game(gameId));
    const gameVariant = computed(() => store.getters.variant(gameId, variantId));
    const gameName = computed(() => (game.value ? game.value.name : ""));
    const variantDescription = computed(() => {
        if (!game.value || !gameVariant.value) return "";
        return gameVariant.value.name;
    });
    const gameThemes = computed(() =>
        gameVariant.value.imageAutoGUIData ?
        Object.keys(gameVariant.value.imageAutoGUIData.themes) :
        []
    );
    const currentGameTheme = computed(() => store.getters.currentGameTheme);
    const setGameTheme = (newGameTheme: string) => {
        store.commit(mutationTypes.setGameTheme, newGameTheme);
    }

    const options = computed(() => (store.getters.options));
    const computerInLoop = computed(() => (updatedLeftPlayer.value.isComputer || updatedRightPlayer.value.isComputer));

    const updateOptions = () => {
        store.commit(mutationTypes.showOptions, false);
        if (updatedLeftPlayer.value.name)
            store.commit(mutationTypes.setCurrentLeftPlayerName, updatedLeftPlayer.value.name);
        if (updatedRightPlayer.value.name)
            store.commit(mutationTypes.setCurrentRightPlayerName, updatedRightPlayer.value.name);
        store.commit(mutationTypes.setLeftPlayerIsComputer, updatedLeftPlayer.value.isComputer);
        store.commit(mutationTypes.setRightPlayerIsComputer, updatedRightPlayer.value.isComputer);
        options.value && store.commit(mutationTypes.setOptions, options.value);
        if (currentPlayer.value.isComputer || options.value.automoveIfSingleMove) store.dispatch(actionTypes.runComputerMove);
    };

    watch(
        () => options.value && options.value.showOptions,
        () => {
            if (options.value.showOptions) {
                updatedLeftPlayer.value = { ...currentLeftPlayer.value };
                updatedRightPlayer.value = { ...currentRightPlayer.value };
                store.commit(mutationTypes.setLeftPlayerIsComputer, false);
                store.commit(mutationTypes.setRightPlayerIsComputer, false);
            }
        }
    );

    // Stores true or false, whether the current game supports the Win By view or it does not.
    const supportsWinBy = computed(() =>
        store.getters.supportsWinBy(currentGameId.value)
    );

    const currentCPUsStrategies = computed(() =>
        store.getters.currentCPUsStrategies
    );

    /** 
     * Changes the strategy of play of the CPU player to a new CPU strategy.
     * @param {number} CPUID - the id of the CPU player. 0 for the first player, 1 for the second player.
     * @param {string} newCPUStrategy - new CPU player strategy.
     * @returns none.
    */
    const setCPUStrategy = (CPUID: number, newCPUStrategy: string) => {
        currentCPUsStrategies.value[CPUID] = newCPUStrategy;
        store.commit(mutationTypes.setCPUsStrategies, currentCPUsStrategies.value);
    };

    const currentCPUsRatings = computed(() =>
        store.getters.currentCPUsRatings
    );

    /**
     * Determines if the VVH View Option vvhViewOption renders depending on if the VVH View Option is legal 
     * and is not the current active VVH View.
     * @param vvhViewOption 
     * @param activeVVHViewName 
     * @returns true/false if the vvhViewOption is rendered depending on the pre-established conditions.
     */
     const renderDropdownOption = (CPUStrategyOptionName: string, activeCPUStrategyOptionName: string) => {
        if (CPUStrategyOptionName == activeCPUStrategyOptionName) {
            return false;
        }
        
        return viewIsLegal(CPUStrategyOptionName);
    }
    
    const viewIsLegal = (VVHViewName: string) => {
        switch(VVHViewName) {
            case "Win By":
                return supportsWinBy.value;
            default:
                return true;
        }
    }

</script>

<style lang="scss" scoped>
    #app-game-body-header-options {
        > button {
            border-radius: 100%;
            font-size: 2rem;
            height: max(2.5rem, min(5vh, 5vw));
            margin: 0.5rem;
            width: max(2.5rem, min(5vh, 5vw));
        }
        #popup {
            align-content: center;
            align-items: stretch;
            display: flex;
            flex-direction: column;
            flex-wrap: nowrap;
            justify-content: center;
            min-height: 100%;
            > #title {
                margin: 1rem;
            }
            > #gameThemes {
                padding: 1rem 10%;
            }
            > #players {
                padding: 1rem 10%;
                > #title {
                    margin: 1rem;
                }
                > #names {
                    align-content: center;
                    align-items: center;
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    justify-content: center;
                    > .name {
                        border: 0.1rem solid var(--neutralColor);
                        border-radius: 1rem;
                        margin: 1rem;
                        padding: 1rem;
                        align-content: center;
                        align-items: center;
                        display: flex;
                        flex-direction: column;
                        flex-wrap: nowrap;
                        justify-content: center;
                        min-width: 192px;
                        > .title {
                            margin: 1rem;
                        }
                        > .input {
                            border: 0.1rem solid var(--neutralColor);
                            border-radius: 1rem;
                            box-sizing: border-box;
                            &:focus {
                                box-shadow: 0.25rem 0.25rem 0.1rem 0.01rem var(--primaryColor);
                                outline: none;
                            }
                        }
                        > .label {
                            text-align: center;
                        }
                    }
                }
            }
            > #computer-move-duration {
                padding: 1rem 10%;
                > #title {
                    margin: 1rem;
                }
            }
            > #visibility-options {
                padding: 1rem 10%;
                > #title {
                    margin: 1rem;
                }
                > #options {
                    align-content: center;
                    align-items: center;
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    justify-content: center;
                    > .option {
                        border: 0.1rem solid var(--neutralColor);
                        border-radius: 1rem;
                        margin: 1rem;
                        padding: 1rem;
                        align-content: center;
                        align-items: center;
                        display: flex;
                        flex-direction: column;
                        flex-wrap: nowrap;
                        justify-content: center;
                    }
                }
            }
        }
    }
    .strategy-dropdown {
        min-width: 192px;
        position: relative;
        display: inline-block;
        cursor: pointer;
    }
    .strategy-dropdown-options {
        display: none;
        position: absolute;
        background-color: #f9f9f9;
        min-width: 192px;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
        padding: 6px 0px 6px 0px;
        z-index: 9999;
    }

    .strategy-dropdown:hover .strategy-dropdown-options {
        display: block;
    }
</style>
