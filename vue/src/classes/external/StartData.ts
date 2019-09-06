import { IStartData } from "@/interfaces/external/IStartData";
import { Data } from "@/classes/external/Data";

export class StartData extends Data<string> implements IStartData {
  constructor(startData?: IStartData) {
    super(startData);
  }

  getBoard(): string {
    try {
      if (this.isValidStatus && this.response) {
        return this.response;
      } else {
        throw Error(`Error! Status: ${this.status}`);
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
