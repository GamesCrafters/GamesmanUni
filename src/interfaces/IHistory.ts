import { CRound } from "@/classes/CRound";

export interface IHistory {
  getCurrentRoundNumber(): number;
  getRoundArray(): Array<CRound>;
  getRoundDictionary(): Map<number, CRound>;
  getMaximumRemoteness(): number;

  updateHistory(round: CRound): void;
}
