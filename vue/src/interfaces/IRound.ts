import { NextMoveValuesData } from "@/classes/external/NextMoveValuesData";

export interface IRound {
  valueCodes: { [value: string]: number };
  turnNames: { [turn: number]: string };
  move: string;
  moveValue: string;
  board: string;
  value: string;
  valueCode: number;
  remoteness: number;
  turn: number;
  turnName: string;
  roundNumber: number;
  nextMoveValuesData: NextMoveValuesData;
}
