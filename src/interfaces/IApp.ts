import { CApp } from "@/classes/CApp";
import { CGames } from "@/classes/CGames";
import { CGame } from "@/classes/CGame";

export interface IApp {
  styles: Array<string>;
  style: string;
  games: CGames;
  game: CGame;
}
