import { IGameData } from "@/interfaces/IGameData";

export class GameData implements IGameData {
  id: string;
  name: string;
  dataBaseUrl: string;

  constructor(gameData?: IGameData) {
    this.id = (gameData && gameData.id) || "xxx";
    this.name = (gameData && gameData.name) || "XXX";
    this.dataBaseUrl = (gameData && gameData.dataBaseUrl) || ".";
  }

  init(gameData: IGameData) {
    this.id = gameData.id;
    this.name = gameData.name;
    this.dataBaseUrl = gameData.dataBaseUrl;
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getDataBaseUrl(): string {
    return this.dataBaseUrl;
  }
}
