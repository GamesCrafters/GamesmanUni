import { IHistory } from "@/interfaces/IHistory";
import { CRound } from "@/classes/CRound";

export class CHistory implements IHistory {
  private currentRoundNumber: number;
  private roundArray: Array<CRound>;
  private roundDictionary: Map<number, CRound>;
  private maximumRemoteness: number;

  constructor() {
    this.currentRoundNumber = 0;
    this.roundArray = new Array<CRound>();
    this.roundDictionary = new Map<number, CRound>();
    this.maximumRemoteness = require("@/datas/defaults.json").maximumRemoteness;
  }

  getCurrentRoundNumber(): number {
    return this.currentRoundNumber;
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

  // type === ("last" || "curr" || "undo" || "redo")
  updateHistory(round: CRound, type: string): void {
    if (type === "last") {
      this.roundArray[this.roundArray.length - 1] = round;
    } else if (type === "curr") {
      const lastRoundNumber = this.currentRoundNumber;
      this.currentRoundNumber = round.getRoundNumber();
      if (this.currentRoundNumber <= lastRoundNumber) {
        const startIndex = this.currentRoundNumber - 1;
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
      this.roundDictionary.set(this.currentRoundNumber, round);
      this.maximumRemoteness = Math.max(
        ...this.roundArray.map(round => round.getRemoteness())
      );
    } else if (type === "undo") {
      this.currentRoundNumber -= 1;
      this.maximumRemoteness = Math.max(
        ...this.roundArray
          .slice(0, this.currentRoundNumber)
          .map(round => round.getRemoteness())
      );
    } else if (type === "redo") {
      this.currentRoundNumber += 1;
      this.maximumRemoteness = Math.max(
        ...this.roundArray
          .slice(0, this.currentRoundNumber)
          .map(round => round.getRemoteness())
      );
    }
  }
}
