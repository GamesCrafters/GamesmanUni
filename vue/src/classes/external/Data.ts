import { IData } from "@/types/TData";

export class Data<T> implements IData<T> {
  status: string;
  response: T | undefined;

  constructor(data?: IData<T>) {
    this.status =
      (data && data.status) || "Data status declaration fails in constructor.";
    this.response = (data && this.isValidStatus && data.response) || undefined;
  }

  init(data: IData<T>) {
    this.status = data.status;
    if (this.isValidStatus && data.response) {
      this.response = data.response;
    } else {
      this.response = undefined;
    }
  }

  isValidStatus(): boolean {
    return this.status === "ok";
  }


}
