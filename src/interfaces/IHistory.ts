import { CRound } from "@/classes/CRound";

export interface IHistory {
  getRoundArray(): Array<CRound>;
  getRoundDictionary(): Map<number, CRound>;
  getMaximumRemoteness(): number;

  updateHistory(round: CRound): void;
}
