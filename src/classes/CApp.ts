import { IApp } from "@/interfaces/IApp";
import { CGames } from "@/classes/CGames";
import { CGame } from "@/classes/CGame";

export class CApp implements IApp {
  styles: Array<string>;
  style: string;
  games: CGames;
  game: CGame;

  constructor() {
    this.styles = ["light", "dark"];
    this.style = "light";
    this.games = new CGames();
    this.game = new CGame();
  }
}
