import { IRound } from "@/interfaces/IRound";
import { CRoundData } from "@/classes/CRoundData";

export class CRound implements IRound {
  readonly move: number;
  readonly board: string;
  readonly value: string;
  readonly valueCode: number;
  readonly remoteness: number;
  readonly turn: number;
  readonly turnName: string;
  readonly round: number;
  readonly nextMoves: Array<CRoundData>;

  constructor(pairs?: {
    move: number;
    board: string;
    value: string;
    valueCode: number;
    remoteness: number;
    turn: number;
    turnName: string;
    round: number;
    nextMoves: Array<CRoundData>;
  }) {
    this.move = (pairs && pairs.move) || 0;
    this.board = (pairs && pairs.board) || "";
    this.value = (pairs && pairs.value) || "tie";
    this.valueCode = (pairs && pairs.valueCode) || 2;
    this.remoteness = (pairs && pairs.remoteness) || Number.POSITIVE_INFINITY;
    this.turn = (pairs && pairs.turn) || 1;
    this.turnName = (pairs && pairs.turnName) || "";
    this.round = (pairs && pairs.round) || 0;
    this.nextMoves = (pairs && pairs.nextMoves) || [];
  }
}
