import { IData } from "@/types/TData";
import { GameData } from "@/classes/GameData";

export interface IGamesData extends IData<Array<GameData>> {
  status: string;
  response: Array<GameData> | undefined;
}
