import { IHistory } from "@/interfaces/IHistory";
import { CRound } from "./CRound";

export class CHistory implements IHistory {
  rounds: Array<CRound>;
  maximumRemoteness: number;

  constructor() {
    this.rounds = new Array<CRound>();
    this.maximumRemoteness = 6;
  }

  push(round: CRound) {
    this.rounds.push(round);
    this.maximumRemoteness = Math.max(
      ...this.rounds.map(round => round.remoteness)
    );
  }

  updateLastRound(round: CRound) {
    this.rounds[this.rounds.length - 1] = round;
  }
}
