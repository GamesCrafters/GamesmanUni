import { TVariantData } from "@/types/internal/TVariantData";
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
  getRound(): CRound;
  getHistory(): CHistory;

  setId(id: string): void;
  setName(name: string): void;
  setVariantData(variantId: string): void;
  setTurn0Name(turn0Name: string): void;
  setTurn1Name(turn1Name: string): void;

  initGame(id: string): Promise<void>;
  startNewGame(): Promise<void>;
  runMove(): Promise<void>;
  undoMove(): void;
  redoMove(): void;
}
