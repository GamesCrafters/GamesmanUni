import { IData } from "@/types/TData";
import { MoveValueData } from "@/classes/MoveValueData";

export interface INextMoveValuesData extends IData<Array<MoveValueData>> {
  status: string;
  response: Array<MoveValueData> | undefined;
}
