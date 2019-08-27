import { IHistory } from "@/interfaces/IHistory";

export class CHistory implements IHistory {
  readonly moves: Array<number>;
  readonly boards: Array<string>;
  readonly values: Array<string>;
  readonly valueCodes: Array<number>;
  readonly remotenesses: Array<number>;
  readonly turns: Array<number>;
  readonly turnNames: Array<string>;
  readonly rounds: Array<number>;

  constructor() {
    this.moves = [];
    this.boards = [];
    this.values = [];
    this.valueCodes = [];
    this.remotenesses = [];
    this.turns = [];
    this.turnNames = [];
    this.rounds = [];
  }
}
