export interface TDataMoveValue {
  status: string;
  response: {
    move: string;
    board: string;
    value: string;
    remoteness: number;
  };
}
