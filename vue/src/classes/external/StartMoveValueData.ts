import { IStartMoveValueData } from "@/interfaces/external/IStartMoveValueData";
import { Data } from "@/classes/external/Data";
import { MoveValueData } from "@/classes/MoveValueData";

export class StartMoveValueData extends Data<MoveValueData>
  implements IStartMoveValueData {
  constructor(startMoveValueData?: IStartMoveValueData) {
    super(startMoveValueData);
  }

  getStartMoveValueData(): MoveValueData {
    try {
      if (this.isValidStatus && this.response) {
        return this.response;
      } else {
        throw new Error(`Error! Status: ${this.status}`);
      }
    } catch (error) {
      console.log(error);
      return new MoveValueData();
    }
  }

  getMove(): string {
    try {
      if (this.isValidStatus && this.response) {
        return this.response.move;
      } else {
        throw new Error(`Error! Status: ${this.status}`);
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  getBoard(): string {
    try {
      if (this.isValidStatus && this.response) {
        return this.response.board;
      } else {
        throw new Error(`Error! Status: ${this.status}`);
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  getValue(): string {
    try {
      if (this.isValidStatus && this.response) {
        return this.response.value;
      } else {
        throw new Error(`Error! Status: ${this.status}`);
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  getRemoteness(): number {
    try {
      if (this.isValidStatus && this.response) {
        return this.response.remoteness;
      } else {
        throw new Error(`Error! Status: ${this.status}`);
      }
    } catch (error) {
      console.log(error);
      return 0;
    }
  }
}
