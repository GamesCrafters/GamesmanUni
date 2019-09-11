import { IHistory } from "@/interfaces/IHistory";
import { CRound } from "@/classes/CRound";

export class CHistory implements IHistory {
  rounds: Array<CRound>;
  maximumRemoteness: number;

  constructor() {
    this.rounds = new Array<CRound>();
    this.maximumRemoteness = 6;
  }

  push(round: CRound): void {
    this.rounds.push(round);
    this.maximumRemoteness = Math.max(
      ...this.rounds.map(round => round.remoteness)
    );
  }

  updateLastRound(round: CRound): void {
    this.rounds[this.rounds.length - 1] = round;
  }
}
