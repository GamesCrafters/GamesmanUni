import { IGamesData } from "@/interfaces/external/IGamesData";
import { Data } from "@/classes/external/Data";
import { GameData } from "@/classes/GameData";

export class GamesData extends Data<Array<GameData>> implements IGamesData {
  constructor(gamesData?: IGamesData) {
    super(gamesData);
  }

  getGameDatas(): Array<GameData> {
    try {
      if (this.isValidStatus && this.response) {
        return this.response;
      } else {
        throw new Error(`Error! Status: ${this.status}`);
      }
    } catch (error) {
      console.log(error);
      return new Array<GameData>();
    }
  }

  getGameIds(): Array<string> {
    try {
      if (this.isValidStatus && this.response) {
        return this.response.map(gameData => gameData.id);
      } else {
        throw new Error(`Error! Status: ${this.status}`);
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  getGameNames(): Array<string> {
    try {
      if (this.isValidStatus && this.response) {
        return this.response.map(gameData => gameData.name);
      } else {
        throw new Error(`Error! Status: ${this.status}`);
      }
    } catch (error) {
      console.log(error);
      return new Array<string>();
    }
  }

  getGamesCount(): number {
    try {
      if (this.isValidStatus && this.response) {
        return this.response.length;
      } else {
        throw new Error(`Error! Status: ${this.status}`);
      }
    } catch (error) {
      console.log(error);
      return 0;
    }
  }

  private indexOf(gameId: string): number {
    const ids: Array<string> | undefined = this.getGameIds();
    if (ids) {
      return ids.indexOf(gameId);
    } else {
      return -1;
    }
  }

  exists(gameId: string): boolean {
    return this.indexOf(gameId) != -1;
  }

  getGameData(gameId: string): GameData {
    try {
      if (this.exists(gameId)) {
        return this.getGameDatas()[this.indexOf(gameId)];
      } else {
        throw new Error(`Game with game ID "${gameId}" does not exist!`);
      }
    } catch (error) {
      console.log(error);
      return new GameData();
    }
  }
}
