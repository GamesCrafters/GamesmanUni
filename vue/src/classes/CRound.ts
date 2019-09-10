import { TMoveData } from "@/types/TMoveData";
import { IRound } from "@/interfaces/IRound";

export class CRound implements IRound {
  gameVariation: number;
  turnNumber: number;
  roundNumber: number;
  move: string;
  moveValue: string;
  board: string;
  positionValue: string;
  remoteness: number;
  nextMoveDatas: Array<TMoveData>;
  nextMoves: Array<string>;
  nextMovePositionValues: Array<string>;

  constructor() {
    this.gameVariation = 0;
    this.turnNumber = 0;
    this.roundNumber = 1;
    this.move = "";
    this.moveValue = "";
    this.board = "";
    this.positionValue = "";
    this.remoteness = 6;
    this.nextMoveDatas = new Array<TMoveData>();
    this.nextMoves = new Array<string>();
    this.nextMovePositionValues = new Array<string>();
  }

  setFirstRound(moveData: TMoveData, nextMoveDatas: Array<TMoveData>) {
    this.turnNumber = 0;
    this.roundNumber = 1;
    this.move = "";
    this.moveValue = "";
    this.board = moveData.board;
    this.positionValue = moveData.positionValue;
    this.remoteness = moveData.remoteness;
    this.setNextMoveDatas(nextMoveDatas);
  }

  getNextRound(nextMoveDatas: Array<TMoveData>) {
    const moveData = this.getNextMoveData(this.move);
    let nextRound: CRound = new CRound();
    nextRound.gameVariation = this.gameVariation;
    nextRound.turnNumber = (this.turnNumber + 1) % 2;
    nextRound.roundNumber = this.roundNumber + 1;
    nextRound.move = "";
    nextRound.moveValue = "";
    nextRound.board = moveData.board;
    nextRound.positionValue = moveData.positionValue;
    nextRound.remoteness = moveData.remoteness;
    nextRound.setNextMoveDatas(nextMoveDatas);
    return nextRound;
  }

  setNextMoveDatas(nextMoveDatas: Array<TMoveData>) {
    this.nextMoveDatas = nextMoveDatas;
    this.nextMoves = this.nextMoveDatas.map(nextMoveData => nextMoveData.move);
    this.nextMovePositionValues = this.nextMoveDatas.map(
      nextMoveData => nextMoveData.positionValue
    );
  }

  getMoveValue(move: string): string {
    const i = this.nextMoves.indexOf(move);
    const nextMovePositionValue = this.nextMovePositionValues[i];
    if (nextMovePositionValue === "win") {
      return "lose";
    } else if (nextMovePositionValue === "lose") {
      return "win";
    } else {
      return move;
    }
  }

  setMove(move: string) {
    this.move = move;
    this.moveValue = this.getMoveValue(move);
  }

  private indexOfNextMove(nextMove: string): number {
    return this.nextMoves.indexOf(nextMove);
  }

  getNextMoveData(nextMove: string): TMoveData {
    const i = this.indexOfNextMove(nextMove);
    return this.nextMoveDatas[i];
  }

  getNextMovePositionValue(nextMove: string): string {
    const i = this.indexOfNextMove(nextMove);
    return this.nextMovePositionValues[i];
  }
}
