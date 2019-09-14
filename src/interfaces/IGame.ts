import { TGameData } from "@/types/TGameData";
import { CRound } from "@/classes/CRound";
import { CHistory } from "@/classes/CHistory";

export interface IGame {
  id: string;
  name: string;
  dataBaseUrl: string;
  turnNames: { [turn: number]: string };
  round: CRound;
  history: CHistory;
  vvhSelectorId: string;
  loadingStatus: boolean;

  initGame(gameData: TGameData): Promise<void>;
  runRound(move: string): Promise<void>;
}
