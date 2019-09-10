import { IGames } from "@/interfaces/IGames";
import { TGameData } from "@/types/TGameData";
import { TDataGames } from "@/types/TDataGames";

export class CGames implements IGames {
  gameDatas: Array<TGameData>;
  gameIds: Array<string>;

  constructor() {
    this.gameDatas = this.loadGames();
    this.gameIds = this.gameDatas.map(gameData => gameData.id);
  }

  loadGames(): Array<TGameData> {
    const DATAGAMES: TDataGames = require("@/datas/temps/DATAGAMES.json");
    if (DATAGAMES.status === "ok") {
      return DATAGAMES.response;
    }
    return Array<TGameData>();
  }

  getGameIds(): Array<string> {
    return this.gameDatas.map(gameData => gameData.id);
  }

  private indexOfGameData(gameId: string): number {
    return this.getGameIds().indexOf(gameId);
  }

  getGameData(gameId: string) {
    return this.gameDatas[this.indexOfGameData(gameId)];
  }
}
