import Vue from "vue";
import Vuex from "vuex";
import { CAppSetting } from "@/classes/CAppSetting";
import { CGameData } from "@/classes/CGameData";
import { CGame } from "@/classes/CGame";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    appSetting: new CAppSetting(),
    games: <CGameData[]>[],
    gameIds: <string[]>[],
    playedGames: <CGame[]>[],
    playedGameIds: <string[]>[],
    currentGame: new CGame()
  },
  mutations: {
    appSetting(state, appSetting: CAppSetting) {
      state.appSetting = appSetting;
    },
    theme(state, theme: string) {
      state.appSetting.theme = theme;
    },
    layout(state, layout: string) {
      state.appSetting.layout = layout;
    },
    games(state, games: Array<CGame>) {
      state.games = games;
    },
    gameIds(state, gameIds: Array<string>) {
      state.gameIds = gameIds;
    },
    updatePlayedGames(state, lastGame: CGame) {
      let i = state.playedGameIds.indexOf(lastGame.id);
      if (i != -1) {
        state.playedGames[i] = lastGame;
      } else {
        state.playedGameIds.push(lastGame.id);
        state.playedGames.push(lastGame);
      }
    },
    currentGame(state, currentGame: CGame) {
      let i = state.playedGameIds.indexOf(currentGame.id);
      if (i != -1) {
        state.currentGame = state.playedGames[i];
      } else {
        state.currentGame = currentGame;
      }
    }
  },
  actions: {
    async newCurrentGame({ commit }) {
      commit("currentgame");
    }
  }
});
