import { CRound } from "@/classes/CRound";

export interface IHistory {
  rounds: Array<CRound>;
  maximumRemoteness: number;

  push(round: CRound): void;
  updateLastRound(round: CRound): void;
}
