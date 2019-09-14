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
  }

  setFirstRound(moveData: TMoveData, nextMoveDatas: Array<TMoveData>): void {
    this.gameVariation = 0;
    this.turnNumber = 0;
    this.roundNumber = 1;
    this.move = "";
    this.moveValue = "";
    this.board = moveData.board;
    this.positionValue = moveData.positionValue;
    this.remoteness = moveData.remoteness;
    this.nextMoveDatas = nextMoveDatas;
  }

  setNextRound(currentRound: CRound): void {
    this.gameVariation = currentRound.gameVariation;
    this.turnNumber = (currentRound.turnNumber + 1) % 2;
    this.roundNumber = currentRound.roundNumber + 1;
    this.move = "";
    this.moveValue = "";
    this.board = currentRound.getNextMoveData(currentRound.move).board;
    this.positionValue = currentRound.getNextMoveData(
      currentRound.move
    ).positionValue;
    this.remoteness = currentRound.getNextMoveData(
      currentRound.move
    ).remoteness;
    this.nextMoveDatas = new Array<TMoveData>();
  }

  setNextMoveDatas(nextMoveDatas: Array<TMoveData>): void {
    this.nextMoveDatas = nextMoveDatas;
  }

  private getNextMoves(): Array<string> {
    return this.nextMoveDatas.map(nextMoveData => nextMoveData.move);
  }

  private indexOfNextMoveData(nextMove: string): number {
    return this.getNextMoves().indexOf(nextMove);
  }

  getNextMoveData(nextMove: string): TMoveData {
    let i = this.indexOfNextMoveData(nextMove);
    if (i != -1) {
      return this.nextMoveDatas[i];
    }
    return { move: "", board: "", positionValue: "", remoteness: 6 };
  }

  getNextMovePositionValue(nextMove: string): string {
    let i = this.indexOfNextMoveData(nextMove);
    if (i != -1) {
      return this.nextMoveDatas[i].positionValue;
    }
    return "";
  }

  getMoveValue(move: string): string {
    const nextMovePositionValue = this.getNextMovePositionValue(move);
    if (nextMovePositionValue === "win") {
      return "lose";
    } else if (nextMovePositionValue === "lose") {
      return "win";
    } else {
      return nextMovePositionValue;
    }
  }

  setMove(move: string): void {
    this.move = move;
    this.moveValue = this.getMoveValue(move);
  }
}
