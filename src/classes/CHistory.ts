import { IHistory } from "@/interfaces/IHistory";
import { CRound } from "@/classes/CRound";

export class CHistory implements IHistory {
  private roundArray: Array<CRound>;
  private roundDictionary: Map<number, CRound>;
  private maximumRemoteness: number;

  constructor() {
    this.roundArray = new Array<CRound>();
    this.roundDictionary = new Map<number, CRound>();
    this.maximumRemoteness = require("@/datas/defaults.json").maximumRemoteness;
  }

  getRoundArray(): Array<CRound> {
    return this.roundArray;
  }

  getRoundDictionary(): Map<number, CRound> {
    return this.roundDictionary;
  }

  getMaximumRemoteness(): number {
    return this.maximumRemoteness;
  }

  updateHistory(round: CRound): void {
    const lastRoundNumber = this.roundArray.length;
    if (round.getRoundNumber() <= lastRoundNumber) {
      const startIndex = round.getRoundNumber() - 1;
      const lastIndex = this.roundArray.length - 1;
      const deleteCount = lastIndex - startIndex + 1;
      this.roundArray.splice(startIndex, deleteCount);
      for (
        let roundNumber: number = startIndex + 1;
        roundNumber <= lastIndex + 1;
        roundNumber++
      ) {
        this.roundDictionary.delete(roundNumber);
      }
    }
    this.roundArray.push(round);
    this.roundDictionary.set(round.getRoundNumber(), round);
  }
}
