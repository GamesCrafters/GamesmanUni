import { GamesData } from "@/classes/external/GamesData";
import { Game } from "@/classes/Game";

export interface IApp {
  gamesData: GamesData;
  currentGame: Game;
}
