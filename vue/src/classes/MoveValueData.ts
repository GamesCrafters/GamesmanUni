import { IMoveValueData } from "@/interfaces/IMoveValueData";

export class MoveValueData implements IMoveValueData {
  move: string;
  board: string;
  value: string;
  remoteness: number;

  constructor(moveValueData?: IMoveValueData) {
    this.move = (moveValueData && moveValueData.move) || "none";
    this.board = (moveValueData && moveValueData.board) || "";
    this.value = (moveValueData && moveValueData.value) || "tie";
    this.remoteness = (moveValueData && moveValueData.remoteness) || 0;
  }

  init(moveValueData: IMoveValueData) {
    this.move = moveValueData.move;
    this.board = moveValueData.board;
    this.value = moveValueData.value;
    this.remoteness = moveValueData.remoteness;
  }

  getMove(): string {
    return this.move;
  }

  getBoard(): string {
    return this.board;
  }

  getValue(): string {
    return this.value;
  }

  getRemoteness(): number {
    return this.remoteness;
  }
}
