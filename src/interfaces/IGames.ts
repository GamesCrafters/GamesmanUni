import { TGameData } from "@/types/TGameData";

export interface IGames {
  gameDatas: Array<TGameData>;
  gameIds: Array<string>;

  getGameData(gameId: string): TGameData;
}
