import Vue from "vue";
import Vuex from "vuex";
import { TMoveData } from "@/types/internal/TMoveData";
import { CApp } from "@/classes/CApp";
import { CGame } from "@/classes/CGame";
import { COptions } from "@/classes/COptions";
import { CVvh } from "@/classes/CVvh";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    appVersion: process.env.VUE_APP_VERSION,
    app: new CApp()
  },
  getters: {
    appVersion: state => state.appVersion,
    app: state => state.app,

    // CApp.ts
    loadingStatus: state => state.app.getLoadingStatus(),
    themeDictionary: state => state.app.getThemeDictionary(),
    theme: state => state.app.getTheme(),
    layoutDictionary: state => state.app.getLayoutDictionary(),
    layout: state => state.app.getLayout(),
    languageDictionary: state => state.app.getLanguageDictionary(),
    language: state => state.app.getLanguage(),
    serverDataVersion: state => state.app.getServerDataVersion(),
    serverDataSource: state => state.app.getServerDataSource(),
    games: state => state.app.getGames(),
    game: state => state.app.getGame(),
    updates: state => state.app.getUpdates(),

    // CGame.ts
    gameId: state => state.app.getGame().getId(),
    gameName: state => state.app.getGame().getName(),
    variantDataArray: state => state.app.getGame().getVariantDataArray(),
    variantDataDictionary: state =>
      state.app.getGame().getVariantDataDictionary(),
    currentVariantData: state => state.app.getGame().getCurrentVariantData(),
    turnNameDictionary: state => state.app.getGame().getTurnNameDictionary(),
    vvhSelectorId: state => state.app.getGame().getVvhSelectorId(),
    options: state => state.app.getGame().getOptions(),
    round: state => state.app.getGame().getRound(),
    history: state => state.app.getGame().getHistory(),

    // CGames.ts
    gameDataArray: state => state.app.getGames().getGameDataArray(),

    // CGitHub.ts
    latestCommitCount: state => state.app.getUpdates().getLatestCommitCount(),
    latestCommitDateArray: state =>
      state.app.getUpdates().getLatestCommitDateArray(),
    latestCommitMessageArray: state =>
      state.app.getUpdates().getLatestCommitMessageArray(),
    latestCommitLinkArray: state =>
      state.app.getUpdates().getLatestCommitLinkArray(),

    // CHistory.ts
    currentRoundNumber: state =>
      state.app
        .getGame()
        .getHistory()
        .getCurrentRoundNumber(),
    roundArray: state =>
      state.app
        .getGame()
        .getHistory()
        .getRoundArray(),
    roundDictionary: state =>
      state.app
        .getGame()
        .getHistory()
        .getRoundDictionary(),
    maximumRemoteness: state =>
      state.app
        .getGame()
        .getHistory()
        .getMaximumRemoteness(),

    // COptions.ts
    gameInstructionVisibility: state =>
      state.app
        .getGame()
        .getOptions()
        .getGameInstructionVisibility(),
    gameOptionsVisibility: state =>
      state.app
        .getGame()
        .getOptions()
        .getGameOptionsVisibility(),
    clockVisibility: state =>
      state.app
        .getGame()
        .getOptions()
        .getClockVisibility(),
    vvhVisibility: state =>
      state.app
        .getGame()
        .getOptions()
        .getVvhVisibility(),
    nextMovesVisibility: state =>
      state.app
        .getGame()
        .getOptions()
        .getNextMovesVisibility(),
    hintVisibility: state =>
      state.app
        .getGame()
        .getOptions()
        .getHintVisibility(),
    deltaRemotenessVisibility: state =>
      state.app
        .getGame()
        .getOptions()
        .getDeltaRemotenessVisibility(),
    animationDuration: state =>
      state.app
        .getGame()
        .getOptions()
        .getAnimationDuration(),

    // CRound.ts
    roundNumber: state =>
      state.app
        .getGame()
        .getRound()
        .getRoundNumber(),
    variantId: state =>
      state.app
        .getGame()
        .getRound()
        .getVariantId(),
    variantDescription: state =>
      state.app
        .getGame()
        .getRound()
        .getVariantDescription(),
    turnId: state =>
      state.app
        .getGame()
        .getRound()
        .getTurnId(),
    turnName: state =>
      state.app
        .getGame()
        .getRound()
        .getTurnName(),
    move: state =>
      state.app
        .getGame()
        .getRound()
        .getMove(),
    moveValue: state =>
      state.app
        .getGame()
        .getRound()
        .getMoveValue(),
    position: state =>
      state.app
        .getGame()
        .getRound()
        .getPosition(),
    positionValue: state =>
      state.app
        .getGame()
        .getRound()
        .getPositionValue(),
    remoteness: state =>
      state.app
        .getGame()
        .getRound()
        .getRemoteness(),
    nextMoveDataArray: state =>
      state.app
        .getGame()
        .getRound()
        .getNextMoveDataArray(),
    nextMoveDataDictionary: state =>
      state.app
        .getGame()
        .getRound()
        .getNextMoveDataDictionary()
  },
  mutations: {
    // CApp.ts
    loadingStatus(state, loadingStatus: boolean): void {
      state.app.setLoadingStatus(loadingStatus);
    },
    theme(state, theme: string): void {
      state.app.setTheme(theme);
    },
    layout(state, layout: string): void {
      state.app.setLayout(layout);
    },
    language(state, language: string): void {
      state.app.setLanguage(language);
    },
    game(state, game: CGame): void {
      state.app.setGame(game);
    },

    // CGame.ts
    gameId(state, gameId: string): void {
      state.app.getGame().setId(gameId);
    },
    gameName(state, gameName: string): void {
      state.app.getGame().setName(gameName);
    },
    currentVariantData(state, variantId: string): void {
      state.app.getGame().setCurrentVariantData(variantId);
    },
    turn0Name(state, turn0Name: string): void {
      state.app.getGame().setTurn0Name(turn0Name);
    },
    turn1Name(state, turn1Name: string): void {
      state.app.getGame().setTurn1Name(turn1Name);
    },
    options(state, options: COptions): void {
      state.app.getGame().setOptions(options);
    },
    undoMove(state): void {
      state.app.getGame().undoMove();
    },
    redoMove(state): void {
      state.app.getGame().redoMove();
    },

    // CHistory.ts
    updateHistory(state, { round, type }): void {
      state.app
        .getGame()
        .getHistory()
        .updateHistory(round, type);
    },

    // COptions.ts
    gameInstructionVisibility(state, gameInstructionVisibility: boolean): void {
      state.app
        .getGame()
        .getOptions()
        .setGameInstructionVisibility(gameInstructionVisibility);
    },
    gameOptionsVisibility(state, gameOptionsVisibility: boolean): void {
      state.app
        .getGame()
        .getOptions()
        .setGameOptionsVisibility(gameOptionsVisibility);
    },
    clockVisibility(state, clockVisibility: boolean): void {
      state.app
        .getGame()
        .getOptions()
        .setClockVisibility(clockVisibility);
    },
    vvhVisibility(state, vvhVisibility: boolean): void {
      state.app
        .getGame()
        .getOptions()
        .setVvhVisibility(vvhVisibility);
    },
    nextMovesVisibility(state, nextMovesVisibility: boolean): void {
      state.app
        .getGame()
        .getOptions()
        .setNextMovesVisibility(nextMovesVisibility);
    },
    hintVisibility(state, hintVisibility: boolean): void {
      state.app
        .getGame()
        .getOptions()
        .setHintVisibility(hintVisibility);
    },
    deltaRemotenessVisibility(state, deltaRemotenessVisibility: boolean): void {
      state.app
        .getGame()
        .getOptions()
        .setDeltaRemotenessVisibility(deltaRemotenessVisibility);
    },
    animationDuration(state, animationDuration: number): void {
      state.app
        .getGame()
        .getOptions()
        .setAnimationDuration(animationDuration);
    },

    // CRound.ts
    roundNumber(state, roundNumber: number): void {
      state.app
        .getGame()
        .getRound()
        .setRoundNumber(roundNumber);
    },
    variantId(state, variantId: string): void {
      state.app
        .getGame()
        .getRound()
        .setVariantId(variantId);
    },
    variantDescription(state, variantDescription: string): void {
      state.app
        .getGame()
        .getRound()
        .setVariantDescription(variantDescription);
    },
    turnId(state, turnId: number): void {
      state.app
        .getGame()
        .getRound()
        .setTurnId(turnId);
    },
    turnName(state, turnName: string): void {
      state.app
        .getGame()
        .getRound()
        .setTurnName(turnName);
    },
    move(state, move: string): void {
      state.app
        .getGame()
        .getRound()
        .setMove(move);
    },
    moveValue(state, move: string): void {
      state.app
        .getGame()
        .getRound()
        .setMoveValue(move);
    },
    position(state, position: string): void {
      state.app
        .getGame()
        .getRound()
        .setPosition(position);
    },
    positionValue(state, positionValue: string): void {
      state.app
        .getGame()
        .getRound()
        .setPositionValue(positionValue);
    },
    remoteness(state, remoteness: number): void {
      state.app
        .getGame()
        .getRound()
        .setRemoteness(remoteness);
    },
    nextMoveDataArray(state, nextMoveDataArray: Array<TMoveData>): void {
      state.app
        .getGame()
        .getRound()
        .setNextMoveDataArray(nextMoveDataArray);
    },
    nextMoveDataDictionary(state, nextMoveDataArray: Array<TMoveData>): void {
      state.app
        .getGame()
        .getRound()
        .setNextMoveDataDictionary(nextMoveDataArray);
    },

    // CVvh.ts
    drawVvh(state): void {
      const vvh: CVvh = new CVvh(
        state.app.getGame(),
        state.app
          .getGame()
          .getOptions()
          .getHintVisibility()
      );
      vvh.drawVvh();
    }
  },
  actions: {
    // CGames.ts
    async initGames({ state, commit }): Promise<boolean> {
      let success: boolean = true;
      commit("loadingStatus", true);
      success = await state.app.getGames().initGames();
      commit("loadingStatus", false);
      return success;
    },

    // CGame.ts
    async initGame({ state, commit }, gameId: string): Promise<boolean> {
      let success: boolean = true;
      commit("loadingStatus", true);
      success = await state.app.getGame().initGame(gameId);
      commit("loadingStatus", false);
      return success;
    },
    async startNewGame({ state, commit }, variantId: string): Promise<boolean> {
      let success: boolean = true;
      commit("loadingStatus", true);
      success = await state.app.getGame().startNewGame(variantId);
      commit("loadingStatus", false);
      return success;
    },
    async runMove({ state, commit }, move: string): Promise<boolean> {
      let success: boolean = true;
      commit("loadingStatus", true);
      commit("move", move);
      success = await state.app.getGame().runMove();
      commit("loadingStatus", false);
      return success;
    },

    // CGitHub.ts
    async initCommits({ state, commit }): Promise<boolean> {
      let success: boolean = true;
      commit("loadingStatus", true);
      success = await state.app.getUpdates().initCommits();
      commit("loadingStatus", false);
      return success;
    }
  }
});
