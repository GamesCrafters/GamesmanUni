import { IApp } from "@/interfaces/IApp";
import { GamesData } from "@/classes/external/GamesData";
import { Game } from "@/classes/Game";

export class App implements IApp {
  gamesData: GamesData;
  currentGame: Game;

  constructor(app?: IApp) {
    this.gamesData = (app && app.gamesData && app.gamesData) || new GamesData();
    this.currentGame =
      (app && app.currentGame && app.currentGame) || new Game();
  }

  getGamesData(): GamesData {
    return this.gamesData;
  }

  getCurrentGame(): Game {
    return this.currentGame;
  }
}
