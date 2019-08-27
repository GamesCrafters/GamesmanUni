import { IRoundData } from "@/interfaces/IRoundData";

export class CRoundData implements IRoundData {
  readonly move: number;
  readonly board: string;
  readonly value: string;
  readonly remoteness: number;

  constructor(pairs?: {
    move: number;
    board: string;
    value: string;
    remoteness: number;
  }) {
    this.move = (pairs && pairs.move) || 0;
    this.board = (pairs && pairs.board) || "";
    this.value = (pairs && pairs.value) || "tie";
    this.remoteness = (pairs && pairs.remoteness) || Number.POSITIVE_INFINITY;
  }
}
