import { TMoveData } from "@/types/TMoveData";
import { CRound } from "@/classes/CRound";

export interface IRound {
  gameVariation: number;
  turnNumber: number;
  roundNumber: number;
  move: string;
  moveValue: string;
  board: string;
  positionValue: string;
  remoteness: number;
  nextMoveDatas: Array<TMoveData>;

  setFirstRound(moveData: TMoveData, nextMoveDatas: Array<TMoveData>): void;
  setNextRound(currentRound: CRound): void;
  setNextMoveDatas(nextMoveDatas: Array<TMoveData>): void;
  getNextMoveData(nextMove: string): TMoveData;
  getNextMovePositionValue(nextMove: string): string;
  getMoveValue(move: string): string;
  setMove(move: string): void;
}
