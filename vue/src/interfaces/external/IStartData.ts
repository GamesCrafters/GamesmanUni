import { IData } from "@/types/TData";

export interface IStartData extends IData<string> {
  status: string;
  response: string | undefined;
}
