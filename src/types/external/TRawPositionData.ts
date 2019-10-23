export interface TRawPositionData {
  status: "ok";
  response: {
    position: string;
    positionValue: string;
    remoteness: number;
    moves: Array<{
      move: string;
      moveValue: string;
      position: string;
      positionValue: string;
      remoteness: number;
    }>;
  };
}
