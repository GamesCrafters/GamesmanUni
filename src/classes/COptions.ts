import { IOptions } from "@/interfaces/IOptions";

export class COptions implements IOptions {
  private visibleGameInstruction: boolean;
  private visibleGameOptions: boolean;
  private visibleClock: boolean;
  private visibleVvh: boolean;
  private visibleNextMoves: boolean;
  private visibleHint: boolean;
  private visibleDeltaRemoteness: boolean;
  private animationDuration: number;

  constructor() {
    this.visibleGameInstruction = require("@/datas/defaults.json").visibleGameInstruction;
    this.visibleGameOptions = require("@/datas/defaults.json").visibleGameOptions;
    this.visibleClock = require("@/datas/defaults.json").visibleClock;
    this.visibleVvh = require("@/datas/defaults.json").visibleVvh;
    this.visibleNextMoves = require("@/datas/defaults.json").visibleNextMoves;
    this.visibleHint = require("@/datas/defaults.json").visibleHint;
    this.visibleDeltaRemoteness = require("@/datas/defaults.json").visibleDeltaRemoteness;
    this.animationDuration = require("@/datas/defaults.json").animationDuration;
  }

  getGameInstructionVisibility(): boolean {
    return this.visibleGameInstruction;
  }

  getGameOptionsVisibility(): boolean {
    return this.visibleGameOptions;
  }

  getClockVisibility(): boolean {
    return this.visibleClock;
  }

  getVvhVisibility(): boolean {
    return this.visibleVvh;
  }

  getNextMovesVisibility(): boolean {
    return this.visibleNextMoves;
  }

  getHintVisibility(): boolean {
    return this.visibleHint;
  }

  getDeltaRemotenessVisibility(): boolean {
    return this.visibleDeltaRemoteness;
  }

  getAnimationDuration(): number {
    return this.animationDuration;
  }

  setGameInstructionVisibility(visibleGameInstruction: boolean): void {
    this.visibleGameInstruction = visibleGameInstruction;
  }

  setGameOptionsVisibility(visibleGameOptions: boolean): void {
    this.visibleGameOptions = visibleGameOptions;
  }

  setClockVisibility(visibleClock: boolean): void {
    this.visibleClock = visibleClock;
  }

  setVvhVisibility(visibleVvh: boolean): void {
    this.visibleVvh = visibleVvh;
  }

  setNextMovesVisibility(visibleNextMoves: boolean): void {
    this.visibleNextMoves = visibleNextMoves;
  }

  setHintVisibility(visibleHint: boolean): void {
    this.visibleHint = visibleHint;
  }

  setDeltaRemotenessVisibility(visibleDeltaRemoteness: boolean): void {
    this.visibleDeltaRemoteness = visibleDeltaRemoteness;
  }

  setAnimationDuration(animationDuration: number): void {
    this.animationDuration = animationDuration;
  }
}
