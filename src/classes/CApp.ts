import { IApp } from "@/interfaces/IApp";
import { CGames } from "@/classes/CGames";
import { CGame } from "@/classes/CGame";

export class CApp implements IApp {
  styleSourceNames: { [style: string]: string };
  style: string;
  games: CGames;
  game: CGame;

  constructor() {
    this.styleSourceNames = { light: "@/datas/styles/SLight" };
    this.style = "light";
    this.games = new CGames();
    this.game = new CGame();
  }
}
