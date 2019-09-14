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
    if (round.roundNumber > this.rounds.length) {
      this.rounds.push(round);
    } else {
      this.rounds.splice(
        round.roundNumber - 1,
        this.rounds.length - round.roundNumber,
        round
      );
    }
    this.maximumRemoteness = Math.max(
      ...this.rounds.map(round => round.remoteness)
    );
  }

  updateLastRound(round: CRound): void {
    this.rounds[this.rounds.length - 1] = round;
  }
}
