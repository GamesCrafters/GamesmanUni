import { IGameData } from "@/interfaces/IGameData";
import { CRound } from "@/classes/CRound";
import { CHistory } from "@/classes/CHistory";

export interface IGame extends IGameData {
  id: string;
  name: string;
  dataBaseUrl: string;
  valueCodes: { [value: string]: number };
  turnNames: { [value: number]: string };
  maxRemoteness: number;
  round: CRound;
  history: CHistory;
}
