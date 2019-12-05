import { TVariantData } from "@/types/internal/TVariantData";
import { COptions } from "@/classes/COptions";
import { CRound } from "@/classes/CRound";
import { CHistory } from "@/classes/CHistory";

export interface IGame {
  getId(): string;
  getName(): string;
  getVariantDataArray(): Array<TVariantData>;
  getVariantDataDictionary(): Map<string, TVariantData>;
  getVariantData(): TVariantData;
  getTurnNameDictionary(): Map<number, string>;
  getVvhSelectorId(): string;
  getOptions(): COptions;
  getRound(): CRound;
  getHistory(): CHistory;

  setId(id: string): void;
  setName(name: string): void;
  setVariantData(variantId: string): void;
  setTurn0Name(turn0Name: string): void;
  setTurn1Name(turn1Name: string): void;

  startNewGame(): Promise<boolean>;
  initGame(id: string): Promise<boolean>;
  runMove(): Promise<boolean>;
  undoMove(): void;
  redoMove(): void;
}
