import axios, { AxiosResponse } from "axios";
import { TRawErrorData } from "@/types/external/TRawErrorData";
import { TRawGamesData } from "@/types/external/TRawGamesData";
import { TGameData } from "@/types/internal/TGameData";
import { IGames } from "@/interfaces/IGames";

export class CGames implements IGames {
  private readonly serverDataSource: string;
  private gameDataArray: Array<TGameData>;

  constructor() {
    this.serverDataSource = require("@/datas/defaults.json").serverDataSource;
    this.gameDataArray = new Array<TGameData>();
  }

  getGameDataArray(): Array<TGameData> {
    return this.gameDataArray;
  }

  private async loadGameDataArray(): Promise<void> {
    const gamesDataSource: string = `${this.serverDataSource}/games`;
    const httpResponse: AxiosResponse = await axios.get(gamesDataSource);
    const rawData: TRawGamesData | TRawErrorData = httpResponse.data;
    if (rawData.status === "ok") {
      this.gameDataArray = rawData.response.map(rawGameData => ({
        id: rawGameData.gameId,
        name: rawGameData.name,
        status: rawGameData.status
      }));
    }
  }

  async initGames(): Promise<void> {
    await this.loadGameDataArray();
  }
}
