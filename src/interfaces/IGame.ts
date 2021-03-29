import { TVariantData } from "@/types/internal/TVariantData";
import { CHistory } from "@/classes/CHistory";
import { COptions } from "@/classes/COptions";
import { CRound } from "@/classes/CRound";

export interface IGame {
  getId(): string;
  getType(): string;
  getName(): string;
  getVariantDataArray(): Array<TVariantData>;
  getVariantDataDictionary(): Map<string, TVariantData>;
  getCurrentVariantData(): TVariantData;
  getTurnNameDictionary(): Map<number, string>;
  getVvhSelectorId(): string;
  getOptions(): COptions;
  getRound(): CRound;
  getHistory(): CHistory;

  setId(id: string): void;
  setName(name: string): void;
  setCurrentVariantData(variantId: string): void;
  setTurn0Name(turn0Name: string): void;
  setTurn1Name(turn1Name: string): void;
  setOptions(options: COptions): void;

  initGame(payload: any): Promise<boolean>;
  startNewGame(variantId: string): Promise<boolean>;
  runMove(): Promise<boolean>;
  undoMove(): void;
  redoMove(): void;
}
