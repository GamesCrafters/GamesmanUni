import { TGameData } from "@/types/internal/TGameData";

export interface IGames {
  getGameDataArray(): Array<TGameData>;

  initGames(): Promise<boolean>;
}
