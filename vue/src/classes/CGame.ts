import { IGame } from "@/interfaces/IGame";
import { CRound } from "@/classes/CRound";
import { CHistory } from "@/classes/CHistory";
import { CGameData } from "@/classes/CGameData";

export class CGame implements IGame {
  id: string;
  name: string;
  dataBaseUrl: string;
  valueCodes: { [value: string]: number };
  turnNames: { [value: number]: string };
  maxRemoteness: number;
  round: CRound;
  history: CHistory;

  constructor(game?: CGameData) {
    this.id = (game && game.id) || "";
    this.name = (game && game.name) || "";
    this.dataBaseUrl = (game && game.dataBaseUrl) || "";
    this.valueCodes = { win: 1, tie: 2, lose: 3 };
    this.turnNames = { 0: "Player 1", 1: "Player 2" };
    this.maxRemoteness = Number.POSITIVE_INFINITY;
    this.round = new CRound();
    this.history = new CHistory();
  }
}
