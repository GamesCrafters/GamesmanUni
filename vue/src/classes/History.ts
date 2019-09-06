import { IHistory } from "@/interfaces/IHistory";
import { NextMoveValuesData } from "@/classes/external/NextMoveValuesData";
import { Round } from "@/classes/Round";

export class History implements IHistory {
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

  constructor() {
    this.moves = new Array<string>();
    this.moveValues = new Array<string>();
    this.boards = new Array<string>();
    this.values = new Array<string>();
    this.valueCodes = new Array<number>();
    this.remotenesses = new Array<number>();
    this.turns = new Array<number>();
    this.turnNames = new Array<string>();
    this.roundNumbers = new Array<number>();
    this.nextMoveValuesDatas = new Array<NextMoveValuesData>();
  }

  push(round: Round): void {
    this.moves.push(round.move);
    this.moveValues.push(round.moveValue);
    this.boards.push(round.board);
    this.values.push(round.value);
    this.valueCodes.push(round.valueCode);
    this.remotenesses.push(round.remoteness);
    this.turns.push(round.turn);
    this.turnNames.push(round.turnName);
    this.roundNumbers.push(round.roundNumber);
    this.nextMoveValuesDatas.push(round.nextMoveValuesData);
  }

  updateLastRound(move: string, moveValue: string): void {
    this.moves[this.moves.length - 1] = move;
    this.moveValues[this.moves.length - 1] = moveValue;
  }

  getCurrentRoundNumber(): number {
    return this.roundNumbers[this.roundNumbers.length - 1];
  }

  getMaximumRemoteness(): number {
    return this.remotenesses[0];
  }
}
