import { TMoveData } from "@/types/internal/TMoveData";

export interface IRound {
  getRoundNumber(): number;
  getVariantId(): string;
  getVariantDescription(): string;
  getTurnId(): number;
  getTurnName(): string;
  getMove(): string;
  getMoveValue(): string;
  getPosition(): string;
  getPositionValue(): string;
  getRemoteness(): number;
  getNextMoveDataArray(): Array<TMoveData>;
  getNextMoveDataDictionary(): Map<string, TMoveData>;

  setRoundNumber(roundNumber: number): void;
  setVariantId(variantId: string): void;
  setVariantDescription(variantDescription: string): void;
  setTurnId(turnId: number): void;
  setTurnName(turnName: string): void;
  setMove(move: string): void;
  setMoveValue(move: string): void;
  setPosition(position: string): void;
  setPositionValue(positionValue: string): void;
  setRemoteness(remoteness: number): void;
  setNextMoveDataArray(
    rawNextMoveDataArray: Array<{
      deltaRemoteness: number;
      move: string;
      moveValue: string;
      position: string;
      positionValue: string;
      remoteness: number;
    }>
  ): void;
  setNextMoveDataDictionary(nextMoveDataDictionary: Array<TMoveData>): void;
}
