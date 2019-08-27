import { IRoundData } from "@/interfaces/IRoundData";
import { CRoundData } from "@/classes/CRoundData";

export interface IRound extends IRoundData {
  readonly move: number;
  readonly board: string;
  readonly value: string;
  readonly valueCode: number;
  readonly remoteness: number;
  readonly turn: number;
  readonly turnName: string;
  readonly round: number;
  readonly nextMoves: Array<CRoundData>;
}
