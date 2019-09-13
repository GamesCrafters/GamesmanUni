import axios, { AxiosResponse } from "axios";
import { TDataStart } from "@/types/TDataStart";
import { TDataMoveValue } from "@/types/TDataMoveValue";
import { TDataNextMoveValues } from "@/types/TDataNextMoveValues";
import { TGameData } from "@/types/TGameData";
import { TMoveData } from "@/types/TMoveData";
import { IGame } from "@/interfaces/IGame";
import { CRound } from "@/classes/CRound";
import { CHistory } from "@/classes/CHistory";

export class CGame implements IGame {
  id: string;
  name: string;
  dataBaseUrl: string;
  turnNames: { [turn: number]: string };
  round: CRound;
  history: CHistory;
  visualValueHistorySelectorId: string;
  loadingStatus: boolean;

  constructor() {
    this.id = "";
    this.name = "";
    this.dataBaseUrl = "";
    this.turnNames = { 0: "Left Player", 1: "Right Player" };
    this.round = new CRound();
    this.history = new CHistory();
    this.visualValueHistorySelectorId = "app-game-visual-value-history-canvas";
    this.loadingStatus = true;
  }

  private async getBoard(): Promise<string> {
    let response: AxiosResponse = await axios.get(
      `${this.dataBaseUrl}/getStart`
    );
    let dataStart: TDataStart = response.data;
    if (dataStart.status === "ok") {
      return dataStart.response;
    }
    return "";
  }

  private async getMoveData(board: string): Promise<TMoveData> {
    let response: AxiosResponse = await axios.get(
      `${this.dataBaseUrl}/getMoveValue?board=${board}`
    );
    let dataMoveValue: TDataMoveValue = response.data;
    if (dataMoveValue.status === "ok") {
      return {
        move: dataMoveValue.response.move,
        board: dataMoveValue.response.board,
        positionValue: dataMoveValue.response.value,
        remoteness: dataMoveValue.response.remoteness
      };
    }
    return { move: "", board: "", positionValue: "", remoteness: 6 };
  }

  private async getNextMoveDatas(board: string): Promise<Array<TMoveData>> {
    let response: AxiosResponse = await axios.get(
      `${this.dataBaseUrl}/getNextMoveValues?board=${board}`
    );
    let dataNextMoveValues: TDataNextMoveValues = response.data;
    let nextMoveDatas = new Array<TMoveData>();
    if (dataNextMoveValues.status === "ok") {
      for (let dataNextMoveValue of dataNextMoveValues.response) {
        nextMoveDatas.push({
          move: dataNextMoveValue.move,
          board: dataNextMoveValue.board,
          positionValue: dataNextMoveValue.value,
          remoteness: dataNextMoveValue.remoteness
        });
      }
    }
    return nextMoveDatas;
  }

  async initGame(gameData: TGameData): Promise<void> {
    this.id = gameData.id;
    this.name = gameData.name;
    this.dataBaseUrl = gameData.dataBaseUrl;
    const board = await this.getBoard();
    const moveData = await this.getMoveData(board);
    const nextMoveDatas = await this.getNextMoveDatas(board);
    this.round.setFirstRound(moveData, nextMoveDatas);
    this.history.push(this.round);
  }

  async runRound(move: string): Promise<void> {
    this.round.setMove(move);
    this.history.updateLastRound(this.round);
    let newRound = new CRound();
    newRound.setNextRound(this.round);
    let nextMoveDatas = await this.getNextMoveDatas(newRound.board);
    newRound.setNextMoveDatas(nextMoveDatas);
    this.round = newRound;
    this.history.push(this.round);
  }
}
