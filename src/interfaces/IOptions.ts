export interface IOptions {
  getGameInstructionVisibility(): boolean;
  getGameOptionsVisibility(): boolean;
  getClockVisibility(): boolean;
  getVvhVisibility(): boolean;
  getNextMovesVisibility(): boolean;
  getHintVisibility(): boolean;
  getDeltaRemotenessVisibility(): boolean;
  getAnimationDuration(): number;

  setGameInstructionVisibility(gameInstructionVisiblity: boolean): void;
  setGameOptionsVisibility(gameOptionsVisiblity: boolean): void;
  setClockVisibility(clockVisiblity: boolean): void;
  setVvhVisibility(vvhVisiblity: boolean): void;
  setNextMovesVisibility(nextMovesVisiblity: boolean): void;
  setHintVisibility(hintVisiblity: boolean): void;
  setDeltaRemotenessVisibility(deltaRemotenessVisiblity: boolean): void;
  setAnimationDuration(animationDuration: number): void;
}
