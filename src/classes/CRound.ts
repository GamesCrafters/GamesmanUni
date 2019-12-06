import { TMoveData } from "@/types/internal/TMoveData";
import { IRound } from "@/interfaces/IRound";

export class CRound implements IRound {
  private roundNumber: number;
  private variantId: string;
  private variantDescription: string;
  private turnId: number;
  private turnName: string;
  private move: string;
  private moveValue: string;
  private position: string;
  private positionValue: string;
  private remoteness: number;
  private nextMoveDataArray: Array<TMoveData>;
  private nextMoveDataDictionary: Map<string, TMoveData>;

  constructor(previousRound?: CRound) {
    this.roundNumber = (previousRound && previousRound.roundNumber) || 1;
    this.variantId = (previousRound && previousRound.variantId) || "";
    this.variantDescription =
      (previousRound && previousRound.variantDescription) || "";
    this.turnId = (previousRound && previousRound.turnId) || 0;
    this.turnName = (previousRound && previousRound.turnName) || "";
    this.move = (previousRound && previousRound.move) || "";
    this.moveValue = (previousRound && previousRound.moveValue) || "";
    this.position = (previousRound && previousRound.position) || "";
    this.positionValue = (previousRound && previousRound.positionValue) || "";
    this.remoteness =
      (previousRound && previousRound.remoteness) ||
      require("@/datas/defaults.json").maximumRemoteness;
    this.nextMoveDataArray =
      (previousRound && previousRound.nextMoveDataArray) ||
      new Array<TMoveData>();
    this.nextMoveDataDictionary =
      (previousRound && previousRound.nextMoveDataDictionary) ||
      new Map<string, TMoveData>();
  }

  getRoundNumber(): number {
    return this.roundNumber;
  }

  getVariantId(): string {
    return this.variantId;
  }

  getVariantDescription(): string {
    return this.variantDescription;
  }

  getTurnId(): number {
    return this.turnId;
  }

  getTurnName(): string {
    return this.turnName;
  }

  getMove(): string {
    return this.move;
  }

  getMoveValue(): string {
    return this.moveValue;
  }

  getPosition(): string {
    return this.position;
  }

  getPositionValue(): string {
    return this.positionValue;
  }

  getRemoteness(): number {
    return this.remoteness;
  }

  getNextMoveDataArray(): Array<TMoveData> {
    return this.nextMoveDataArray;
  }

  getNextMoveDataDictionary(): Map<string, TMoveData> {
    return this.nextMoveDataDictionary;
  }

  setRoundNumber(roundNumber: number): void {
    this.roundNumber = roundNumber;
  }

  setVariantId(variantId: string): void {
    this.variantId = variantId;
  }

  setVariantDescription(variantDescription: string): void {
    this.variantDescription = variantDescription;
  }

  setTurnId(turnId: number): void {
    this.turnId = turnId;
  }

  setTurnName(turnName: string): void {
    this.turnName = turnName;
  }

  setMove(move: string): void {
    this.move = move;
  }

  setMoveValue(move: string): void {
    if (this.nextMoveDataDictionary.has(move)) {
      this.moveValue = (this.nextMoveDataDictionary.get(
        move
      ) as TMoveData).moveValue;
    } else {
      this.moveValue = "";
    }
  }

  setPosition(position: string): void {
    this.position = position;
  }

  setPositionValue(positionValue: string): void {
    this.positionValue = positionValue;
  }

  setRemoteness(remoteness: number): void {
    this.remoteness = remoteness;
  }

  setNextMoveDataArray(
    rawNextMoveDataArray: Array<{
      deltaRemoteness: number;
      move: string;
      moveValue: string;
      position: string;
      positionValue: string;
      remoteness: number;
    }>
  ): void {
    this.nextMoveDataArray = new Array<TMoveData>();
    if (rawNextMoveDataArray.length != 0) {
      this.nextMoveDataArray.push({
        deltaRemoteness: rawNextMoveDataArray[0].deltaRemoteness,
        move: rawNextMoveDataArray[0].move,
        moveValue: rawNextMoveDataArray[0].moveValue,
        position: rawNextMoveDataArray[0].position,
        positionValue: rawNextMoveDataArray[0].positionValue,
        remoteness: rawNextMoveDataArray[0].remoteness,
        moveValueOpacity: 1
      });
    }

    for (let i: number = 1; i < rawNextMoveDataArray.length; i++) {
      this.nextMoveDataArray.push({
        deltaRemoteness: rawNextMoveDataArray[i].deltaRemoteness,
        move: rawNextMoveDataArray[i].move,
        moveValue: rawNextMoveDataArray[i].moveValue,
        position: rawNextMoveDataArray[i].position,
        positionValue: rawNextMoveDataArray[i].positionValue,
        remoteness: rawNextMoveDataArray[i].remoteness,
        moveValueOpacity: 1
      });

      if (
        this.nextMoveDataArray[i].moveValue !=
        this.nextMoveDataArray[i - 1].moveValue
      ) {
        this.nextMoveDataArray[i].moveValueOpacity = 1;
        continue;
      }
      if (this.nextMoveDataArray[i - 1].moveValueOpacity === 0.5) {
        this.nextMoveDataArray[i].moveValueOpacity = 0.5;
        continue;
      }
      if (
        rawNextMoveDataArray[i].deltaRemoteness !=
        rawNextMoveDataArray[i - 1].deltaRemoteness
      ) {
        this.nextMoveDataArray[i].moveValueOpacity =
          this.nextMoveDataArray[i - 1].moveValueOpacity - 0.25;
      } else {
        this.nextMoveDataArray[i].moveValueOpacity = this.nextMoveDataArray[
          i - 1
        ].moveValueOpacity;
      }
    }
  }

  setNextMoveDataDictionary(nextMoveDataArray: Array<TMoveData>): void {
    this.nextMoveDataDictionary = new Map<string, TMoveData>();
    for (let i: number = 0; i < nextMoveDataArray.length; i++) {
      this.nextMoveDataDictionary.set(
        nextMoveDataArray[i].move,
        nextMoveDataArray[i]
      );
    }
  }
}
