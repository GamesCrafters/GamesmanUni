import { INextMoveValuesData } from "@/interfaces/external/INextMoveValuesData";
import { IRound } from "@/interfaces/IRound";
import { NextMoveValuesData } from "@/classes/external/NextMoveValuesData";
import { MoveValueData } from "@/classes/MoveValueData";

export class Round implements IRound {
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

  constructor(moveValueData?: MoveValueData, currentRound?: Round) {
    this.valueCodes = { win: 1, tie: 2, lose: 3, draw: 4 };
    this.turnNames = { 0: "Player 0", 1: "Player 1" };
    this.move = (moveValueData && moveValueData.getMove()) || "none";
    this.moveValue =
      (currentRound &&
        currentRound.nextMoveValuesData.getNextMoveValue(this.move)) ||
      "tie";
    this.board = (moveValueData && moveValueData.getBoard()) || "";
    this.value = (moveValueData && moveValueData.getValue()) || "tie";
    this.valueCode = this.valueCodes[this.value];
    this.remoteness = (moveValueData && moveValueData.getRemoteness()) || 0;
    this.turn = (currentRound && (currentRound.turn + 1) % 2) || 1;
    this.turnName = this.turnNames[this.turn];
    this.roundNumber = (currentRound && currentRound.roundNumber + 1) || 0;
    this.nextMoveValuesData = new NextMoveValuesData();
  }

  setMove(move: string) {
    this.move = move;
    this.moveValue = this.nextMoveValuesData.getNextMoveValue(this.move);
  }

  setBoard(board: string) {
    this.board = board;
  }

  setValue(value: string) {
    this.value = value;
    this.valueCode = this.valueCodes[this.value];
  }

  setTurn(turn?: number) {
    this.turn = (turn && turn) || (this.turn + 1) % 2;
    this.turnName = this.turnName[this.turn];
  }

  setRoundNumber(roundNumber?: number) {
    this.roundNumber = (roundNumber && roundNumber) || this.roundNumber + 1;
  }

  setRemoteness(remoteness: number) {
    this.remoteness = remoteness;
  }

  setMoveValueData(moveValueData: MoveValueData) {
    this.move = moveValueData.move;
    this.board = moveValueData.board;
    this.value = moveValueData.value;
    this.valueCode = this.valueCodes[this.value];
    this.remoteness = moveValueData.remoteness;
  }

  setNextMoveValuesData(nextMoveValuesData: INextMoveValuesData) {
    this.nextMoveValuesData.init(nextMoveValuesData);
    this.moveValue = this.nextMoveValuesData.getNextMoveValue(this.move);
  }

  getMove(): string {
    return this.move;
  }

  getBoard(): string {
    return this.board;
  }

  getRoundNumber(): number {
    return this.roundNumber;
  }

  getTurnName(): string {
    return this.turnName;
  }
}
