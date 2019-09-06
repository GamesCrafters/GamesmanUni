import { NextMoveValuesData } from "@/classes/external/NextMoveValuesData";

export interface IHistory {
  moves: Array<string>;
  moveValues: Array<string>;
  boards: Array<string>;
  values: Array<string>;
  valueCodes: Array<number>;
  remotenesses: Array<number>;
  turns: Array<number>;
  turnNames: Array<string>;
  roundNumbers: Array<number>;
  nextMoveValuesDatas: Array<NextMoveValuesData>;
}
