export interface TDataNextMoveValues {
  status: string;
  response: Array<{
    move: string;
    board: string;
    value: string;
    remoteness: number;
  }>;
}
