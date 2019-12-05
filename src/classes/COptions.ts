import { IOptions } from "@/interfaces/IOptions";

export class COptions implements IOptions {
  private gameInstructionVisibility: boolean;
  private gameOptionsVisibility: boolean;
  private clockVisibility: boolean;
  private vvhVisibility: boolean;
  private nextMovesVisibility: boolean;
  private hintVisibility: boolean;
  private deltaRemotenessVisibility: boolean;
  private animationDuration: number;

  constructor() {
    this.gameInstructionVisibility = require("@/datas/defaults.json").gameInstructionVisibility;
    this.gameOptionsVisibility = require("@/datas/defaults.json").gameOptionsVisibility;
    this.clockVisibility = require("@/datas/defaults.json").clockVisibility;
    this.vvhVisibility = require("@/datas/defaults.json").vvhVisibility;
    this.nextMovesVisibility = require("@/datas/defaults.json").nextMovesVisibility;
    this.hintVisibility = require("@/datas/defaults.json").hintVisibility;
    this.deltaRemotenessVisibility = require("@/datas/defaults.json").deltaRemotenessVisibility;
    this.animationDuration = require("@/datas/defaults.json").animationDuration;
  }

  getGameInstructionVisibility(): boolean {
    return this.gameInstructionVisibility;
  }

  getGameOptionsVisibility(): boolean {
    return this.gameOptionsVisibility;
  }

  getClockVisibility(): boolean {
    return this.clockVisibility;
  }

  getVvhVisibility(): boolean {
    return this.vvhVisibility;
  }

  getNextMovesVisibility(): boolean {
    return this.nextMovesVisibility;
  }

  getHintVisibility(): boolean {
    return this.hintVisibility;
  }

  getDeltaRemotenessVisibility(): boolean {
    return this.deltaRemotenessVisibility;
  }

  getAnimationDuration(): number {
    return this.animationDuration;
  }

  setGameInstructionVisibility(gameInstructionVisibility: boolean): void {
    this.gameInstructionVisibility = gameInstructionVisibility;
  }

  setGameOptionsVisibility(gameOptionsVisibility: boolean): void {
    this.gameOptionsVisibility = gameOptionsVisibility;
  }

  setClockVisibility(clockVisibility: boolean): void {
    this.clockVisibility = clockVisibility;
  }

  setVvhVisibility(vvhVisibility: boolean): void {
    this.vvhVisibility = vvhVisibility;
  }

  setNextMovesVisibility(nextMovesVisibility: boolean): void {
    this.nextMovesVisibility = nextMovesVisibility;
  }

  setHintVisibility(hintVisibility: boolean): void {
    this.hintVisibility = hintVisibility;
  }

  setDeltaRemotenessVisibility(deltaRemotenessVisibility: boolean): void {
    this.deltaRemotenessVisibility = deltaRemotenessVisibility;
  }

  setAnimationDuration(animationDuration: number): void {
    this.animationDuration = animationDuration;
  }
}
