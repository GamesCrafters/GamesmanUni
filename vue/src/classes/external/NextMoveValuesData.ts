import { INextMoveValuesData } from "@/interfaces/external/INextMoveValuesData";
import { Data } from "@/classes/external/Data";
import { MoveValueData } from "@/classes/MoveValueData";

export class NextMoveValuesData extends Data<Array<MoveValueData>>
  implements INextMoveValuesData {
  constructor(nextMoveValuesData?: INextMoveValuesData) {
    super(nextMoveValuesData);
  }

  getNextMoveValueDatas(): Array<MoveValueData> {
    try {
      if (this.isValidStatus && this.response) {
        return this.response;
      } else {
        throw new Error(`Error! Status: ${this.status}`);
      }
    } catch (error) {
      console.log(error);
      return new Array<MoveValueData>();
    }
  }

  getNextMoves(): Array<string> {
    try {
      if (this.isValidStatus && this.response) {
        return this.response.map(nextMoveValueData => nextMoveValueData.move);
      } else {
        throw new Error(`Error! Status: ${this.status}`);
      }
    } catch (error) {
      console.log(error);
      return new Array<string>();
    }
  }

  getNextMovesCount(): number {
    try {
      if (this.isValidStatus && this.response) {
        return this.response.length;
      } else {
        throw new Error(`Error! Status: ${this.status}`);
      }
    } catch (error) {
      console.log(error);
      return 0;
    }
  }

  private indexOf(nextMove: string): number {
    const ids: Array<string> | undefined = this.getNextMoves();
    if (ids) {
      return ids.indexOf(nextMove);
    } else {
      return -1;
    }
  }

  exists(nextMove: string): boolean {
    return this.indexOf(nextMove) != -1;
  }

  getNextMoveValueData(nextMove: string): MoveValueData {
    try {
      if (this.exists(nextMove)) {
        return this.getNextMoveValueDatas()[this.indexOf(nextMove)];
      } else {
        throw new Error(`Move "${nextMove}" does not exist!`);
      }
    } catch (error) {
      console.log(error);
      return new MoveValueData();
    }
  }

  getNextMoveValue(nextMove: string): string {
    return this.getNextMoveValueData(nextMove).getValue();
  }
}
