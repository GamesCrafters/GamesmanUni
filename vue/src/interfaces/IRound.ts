import { IRoundData } from "@/interfaces/IRoundData";
import { CRoundData } from "@/classes/CRoundData";

export interface IRound extends IRoundData {
  move: number;
  board: string;
  value: string;
  valueCode: number;
  remoteness: number;
  turn: number;
  turnName: string;
  round: number;
  nextMoves: Array<CRoundData>;
}
