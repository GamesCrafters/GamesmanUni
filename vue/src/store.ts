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
      state.gameIds = state.games.map((game: CGameData): string => {
        return game.id;
      });
    },
    loadCurrentGame(state, currentGameId: string) {
      let i = state.playedGameIds.indexOf(currentGameId);
      // if an already started game exists...
      if (i != -1) {
        state.currentGame = state.playedGames[i];
      } else {
        let j = state.gameIds.indexOf(currentGameId);
        state.currentGame = new CGame(state.games[j]);
      }
    },
    currentGame(state, currentGame: CGame) {
      state.currentGame = currentGame;
    },
    updatePlayedGames(state) {
      let i = state.playedGameIds.indexOf(state.currentGame.id);
      if (i != -1) {
        state.playedGames[i] = state.currentGame;
      } else {
        state.playedGames.push(state.currentGame);
        state.playedGameIds.push(state.currentGame.id);
      }
    }
  },
  getters: {
    game(state, gameId: string) {
      let i = state.gameIds.indexOf(gameId);
      return state.games[i];
    }
  }
});
