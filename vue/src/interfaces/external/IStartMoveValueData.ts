import { IData } from "@/interfaces/external/IData";
import { MoveValueData } from "@/classes/MoveValueData";

export interface IStartMoveValueData extends IData<MoveValueData> {
  status: string;
  response: MoveValueData | undefined;
}
