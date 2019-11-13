import { CRound } from "@/classes/CRound";

export interface IHistory {
  getCurrentRoundNumber(): number;
  getRoundArray(): Array<CRound>;
  getRoundDictionary(): Map<number, CRound>;
  getMaximumRemoteness(): number;

  // type === ("last" || "curr" || "undo" || "redo")
  updateHistory(round: CRound, type: string): void;
}
