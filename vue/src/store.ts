import Vue from "vue";
import Vuex from "vuex";
import { GamesData } from "@/classes/external/GamesData";
import { Game } from "@/classes/Game";
import { App } from "@/classes/App";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    app: new App(),
    currentMoveTracker: { round: 0, move: "none" }
  },
  mutations: {
    app(state, app: App) {
      state.app = app;
    },
    gamesData(state, gamesData: GamesData) {
      state.app.gamesData = gamesData;
    },
    status(state, status: number) {
      state.app.currentGame.setStatus(status);
    },
    currentGame(state, currentGame: Game) {
      state.app.currentGame = currentGame;
    },
    currentMoveTracker(state, currentMove: string) {
      state.currentMoveTracker = {
        round: state.app.currentGame.round.getRoundNumber(),
        move: currentMove
      };
    }
  },
  actions: {
    initApp({ commit }) {
      commit("app", new App());
    },
    saveGamesData({ commit }, gamesData: GamesData) {
      commit("gamesData", gamesData);
    },
    saveCurrentGame({ commit }, currentGame: Game) {
      commit("currentGame", currentGame);
    },
    makeMove({ commit }, move: string) {
      commit("currentMoveTracker", move);
    },
    setStatus({ commit }, status: number) {
      commit("status", status);
    }
  },
  getters: {
    gameData: state => (gameId: string) =>
      state.app.gamesData.getGameData(gameId),
    currentGame: state => state.app.currentGame,
    currentMoveTracker: state => state.currentMoveTracker,
    round: state => state.app.currentGame.round,
    history: state => state.app.currentGame.history,
    nextMoveValuesData: state => state.app.currentGame.round.nextMoveValuesData,
    status: state => state.app.currentGame.status
  }
});
