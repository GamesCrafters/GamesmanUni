import Vue from "vue";
import Vuex from "vuex";
import { TMoveData } from "@/types/internal/TMoveData";
import { CApp } from "@/classes/CApp";
import { CRound } from "@/classes/CRound";
// import { CVvh } from "@/classes/CVvh";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    app: new CApp()
  },
  getters: {
    loadingStatus: state => state.app.getLoadingStatus(),
    themeDictionary: state => state.app.getThemeDictionary(),
    theme: state => state.app.getTheme(),
    layoutDictionary: state => state.app.getLayoutDictionary(),
    layout: state => state.app.getLayout(),
    languageDictionary: state => state.app.getLanguageDictionary(),
    language: state => state.app.getLanguage(),
    serverDataSource: state => state.app.getServerDataSource(),
    games: state => state.app.getGames(),
    game: state => state.app.getGame(),

    gameDataArray: state => state.app.getGames().getGameDataArray(),

    gameId: state => state.app.getGame().getId(),
    gameName: state => state.app.getGame().getName(),
    variantDataArray: state => state.app.getGame().getVariantDataArray(),
    variantDataDictionary: state =>
      state.app.getGame().getVariantDataDictionary(),
    variantData: state => state.app.getGame().getVariantData(),
    turnNameDictionary: state => state.app.getGame().getTurnNameDictionary(),
    vvhSelectorId: state => state.app.getGame().getVvhSelectorId(),
    round: state => state.app.getGame().getRound(),
    history: state => state.app.getGame().getHistory(),

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
        .getNextMoveDataDictionary(),

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
        .getMaximumRemoteness()
  },
  mutations: {
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

    gameId(state, gameId: string): void {
      state.app.getGame().setId(gameId);
    },
    gameName(state, gameName: string): void {
      state.app.getGame().setName(gameName);
    },
    variantData(state, variantId: string): void {
      state.app.getGame().setVariantData(variantId);
    },
    turn0Name(state, turn0Name: string): void {
      state.app.getGame().setTurn0Name(turn0Name);
    },
    turn1Name(state, turn1Name: string): void {
      state.app.getGame().setTurn1Name(turn1Name);
    },

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
    moveValue(state, moveValue: string): void {
      state.app
        .getGame()
        .getRound()
        .setMoveValue(moveValue);
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
    }
  },
  actions: {
    async initGames({ state, commit }): Promise<void> {
      commit("loadingStatus", true);
      await state.app.getGames().initGames();
      commit("loadingStatus", false);
    },

    async initGame({ state, commit }): Promise<void> {
      commit("loadingStatus", true);
      await state.app.getGame().initGame();
      commit("loadingStatus", false);
    },
    async startNewGame({ state, commit }): Promise<void> {
      commit("loadingStatus", true);
      await state.app.getGame().startNewGame();
      commit("loadingStatus", false);
    },
    async runMove({ state, commit }): Promise<void> {
      commit("loadingStatus", true);
      await state.app.getGame().runMove();
      commit("loadingStatus", false);
    },
    undoMove({ state, commit }): void {
      commit("loadingStatus", true);
      state.app.getGame().undoMove();
      commit("loadingStatus", false);
    },
    redoMove({ state, commit }): void {
      commit("loadingStatus", true);
      state.app.getGame().redoMove();
      commit("loadingStatus", false);
    },

    updateHistory({ state, commit }, round: CRound): void {
      commit("loadingStatus", true);
      state.app
        .getGame()
        .getHistory()
        .updateHistory(round);
      commit("loadingStatus", false);
    },

    drawVvh({ getters, commit }): void {
      commit("loadingStatus", true);
      // const vvh: CVvh = new CVvh(getters.game);
      // vvh.drawVvh();
      commit("loadingStatus", false);
    }
  }
});
