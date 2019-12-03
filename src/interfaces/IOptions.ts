export interface IOptions {
  getGameInstructionVisibility(): boolean;
  getGameOptionsVisibility(): boolean;
  getClockVisibility(): boolean;
  getVvhVisibility(): boolean;
  getNextMovesVisibility(): boolean;
  getHintVisibility(): boolean;
  getDeltaRemotenessVisibility(): boolean;
  getAnimationDuration(): number;

  setGameInstructionVisibility(visibleGameInstruction: boolean): void;
  setGameOptionsVisibility(visibleGameOptions: boolean): void;
  setClockVisibility(visibleClock: boolean): void;
  setVvhVisibility(visibleVvh: boolean): void;
  setNextMovesVisibility(visibleNextMoves: boolean): void;
  setHintVisibility(visibleHint: boolean): void;
  setDeltaRemotenessVisibility(visibleDeltaRemoteness: boolean): void;
  setAnimationDuration(animationDuration: number): void;
}
