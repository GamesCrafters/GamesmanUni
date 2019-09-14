import Vue from "vue";
import Vuex from "vuex";
import { CApp } from "@/classes/CApp";
import { CGame } from "@/classes/CGame";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    app: new CApp()
  },
  getters: {
    style: state => state.app.style,
    gameDatas: state => state.app.games.gameDatas,
    gameData: state => (gameId: string) => state.app.games.getGameData(gameId),
    game: state => state.app.game,
    vvhSelectorId: state => state.app.game.vvhSelectorId,
    loadingStatus: state => state.app.game.loadingStatus,
    round: state => state.app.game.round,
    roundNumber: state => state.app.game.round.roundNumber,
    moveValue: state => (move: string) =>
      state.app.game.round.getMoveValue(move),
    rounds: state => state.app.game.history.rounds
  },
  mutations: {
    game(state, game: CGame) {
      state.app.game = game;
    },
    loadingStatus(state, loadingStatus: boolean) {
      state.app.game.loadingStatus = loadingStatus;
    }
  },
  actions: {
    async startNewGame({ getters, commit }, gameId) {
      commit("loadingStatus", true);
      let game = new CGame();
      await game.initGame(getters.gameData(gameId));
      commit("game", game);
      commit("loadingStatus", false);
    },

    async runRound({ getters, commit }, move: string) {
      commit("loadingStatus", true);
      let game = getters.game;
      await game.runRound(move);
      commit("game", game);
      commit("loadingStatus", false);
    },

    async runUndo({ getters, commit }) {
      commit("loadingStatus", true);
      let game = getters.game;
      await game.runUndo();
      commit("game", game);
      commit("loadingStatus", false);
    },

    async runRedo({ getters, commit }) {
      commit("loadingStatus", true);
      let game = getters.game;
      await game.runRedo();
      commit("game", game);
      commit("loadingStatus", false);
    }
  }
});
