import axios, { AxiosResponse } from "axios";
import { TRawErrorData } from "@/types/external/TRawErrorData";
import { TRawGameData } from "@/types/external/TRawGameData";
import { TRawPositionData } from "@/types/external/TRawPositionData";
import { TMoveData } from "@/types/internal/TMoveData";
import { TVariantData } from "@/types/internal/TVariantData";
import { IGame } from "@/interfaces/IGame";
import { CHistory } from "@/classes/CHistory";
import { COptions } from "@/classes/COptions";
import { CRound } from "@/classes/CRound";

export class CGame implements IGame {
  private readonly serverDataSource: string;
  private id: string;
  private type: string;
  private name: string;
  private variantDataArray: Array<TVariantData>;
  private variantDataDictionary: Map<string, TVariantData>;
  private currentVariantData: TVariantData;
  private turnNameDictionary: Map<number, string>;
  private readonly vvhSelectorId: string;
  private options: COptions;
  private round: CRound;
  private history: CHistory;

  constructor() {
    this.serverDataSource = require("@/datas/defaults.json").serverDataSource;
    this.id = "";
    this.type = "";
    this.name = "";
    this.variantDataArray = new Array<TVariantData>();
    this.variantDataDictionary = new Map<string, TVariantData>();
    this.currentVariantData = {
      id: "",
      description: "",
      status: "",
      startPosition: "",
    };
    this.turnNameDictionary = new Map([
      [0, require("@/datas/defaults.json").turn0Name],
      [1, require("@/datas/defaults.json").turn1Name],
    ]);
    this.vvhSelectorId = require("@/datas/defaults.json").vvhSelectorId;
    this.options = new COptions();
    this.round = new CRound();
    this.history = new CHistory();
  }

  getId(): string {
    return this.id;
  }

  getType(): string {
    return this.type;
  }

  getName(): string {
    return this.name;
  }

  getVariantDataArray(): Array<TVariantData> {
    return this.variantDataArray;
  }

  getVariantDataDictionary(): Map<string, TVariantData> {
    return this.variantDataDictionary;
  }

  getCurrentVariantData(): TVariantData {
    return this.currentVariantData;
  }

  getTurnNameDictionary(): Map<number, string> {
    return this.turnNameDictionary;
  }

  getVvhSelectorId(): string {
    return this.vvhSelectorId;
  }

  getOptions(): COptions {
    return this.options;
  }

  getRound(): CRound {
    return this.round;
  }

  getHistory(): CHistory {
    return this.history;
  }

  setId(id: string): void {
    this.id = id;
  }

  setType(type: string): void {
    this.type = type;
  }

  setName(name: string): void {
    this.name = name;
  }

  setCurrentVariantData(variantId: string): void {
    this.currentVariantData = this.variantDataDictionary.get(variantId) || {
      id: "",
      description: "",
      status: "",
      startPosition: "",
    };
  }

  setTurn0Name(turn0Name: string): void {
    this.turnNameDictionary.set(0, turn0Name);
  }

  setTurn1Name(turn1Name: string): void {
    this.turnNameDictionary.set(1, turn1Name);
  }

  setOptions(options: COptions): void {
    this.options = options;
  }

  private async loadDetailedGameData(): Promise<boolean> {
    let success: boolean = true;
    if (!this.currentVariantData.id) {
      let url = `${this.serverDataSource}/games/${this.id}`;
      if (this.type == "puzzles") {
        url = `https://nyc.cs.berkeley.edu/puzzles/${this.id}`;
      }
      const detailedGameDataSource: string = url;
      try {
        const httpResponse: AxiosResponse = await axios.get(
          detailedGameDataSource
        );
        const rawData: TRawGameData | TRawErrorData = httpResponse.data;
        if (rawData.status === "ok") {
          this.name = rawData.response.name;
          this.variantDataArray = rawData.response.variants.map(
            (rawVariantData) => ({
              id: rawVariantData.variantId,
              description: rawVariantData.description,
              status: rawVariantData.status,
              startPosition: rawVariantData.startPosition,
            })
          );
          this.variantDataDictionary = new Map<string, TVariantData>();
          for (let i: number = 0; i < this.variantDataArray.length; i++) {
            this.variantDataDictionary.set(
              this.variantDataArray[i].id,
              this.variantDataArray[i]
            );
          }
          this.round.setVariantId(this.variantDataArray[0].id);
        }
      } catch (errorMessage) {
        success = false;
        console.error(errorMessage);
        console.error("Error: Failed to load detailed game data from server.");
        return success;
      }
      console.info(
        `Successfully loaded detailed game data from: ${detailedGameDataSource}.`
      );
    }
    return success;
  }

  private async loadPositionData(): Promise<boolean> {
    let success: boolean = true;
    let positionDataSource: string = this.serverDataSource;
    positionDataSource += `/games/${this.id}`;
    if (this.type == "puzzles") {
      positionDataSource = `https://nyc.cs.berkeley.edu/`;
      positionDataSource += `/puzzles/${this.id}`;
    }
    positionDataSource += `/variants/${this.currentVariantData.id}`;
    positionDataSource += `/positions/${encodeURIComponent(
      this.round.getPosition()
    )}`;

    try {
      const httpResponse: AxiosResponse = await axios.get(positionDataSource);
      const rawData: TRawPositionData | TRawErrorData = httpResponse.data;
      if (rawData.status === "ok") {
        this.round.setPositionValue(rawData.response.positionValue);
        this.round.setRemoteness(rawData.response.remoteness);
        this.round.setNextMoveDataArray(rawData.response.moves);
        this.round.setNextMoveDataDictionary(this.round.getNextMoveDataArray());
      }
    } catch (errorMessage) {
      success = false;
      console.error(errorMessage);
      console.error("Error: Failed to load position data from server.");
      return success;
    }
    console.info(
      `Successfully loaded position data from: ${positionDataSource}.`
    );

    return success;
  }

  async initGame(payload: any): Promise<boolean> {
    const gameId: string = payload.gameId;
    const gameType: string = payload.gameType;

    // console.warn(payload.gameType);

    let success: boolean = true;
    this.id = gameId;
    this.type = gameType;
    success = await this.loadDetailedGameData();
    return success;
  }

  async startNewGame(variantId: string): Promise<boolean> {
    let success: boolean = true;
    this.setCurrentVariantData(variantId);
    this.round = new CRound();
    this.round.setVariantId(this.currentVariantData.id);
    this.round.setVariantDescription(this.currentVariantData.description);
    this.round.setTurnName(this.turnNameDictionary.get(0) as string);
    this.round.setPosition(this.currentVariantData.startPosition);
    success = await this.loadPositionData();
    this.history = new CHistory();
    this.history.updateHistory(this.round, "curr");
    return success;
  }

  async runMove(): Promise<boolean> {
    let success = true;
    this.round.setMoveValue(this.round.getMove());
    this.history.updateHistory(this.round, "last");
    const oldRound: CRound = this.round;
    this.round = new CRound(oldRound);
    this.round.setRoundNumber(oldRound.getRoundNumber() + 1);
    this.round.setTurnId((oldRound.getTurnId() + 1) % 2);
    this.round.setTurnName(
      this.turnNameDictionary.get(this.round.getTurnId()) as string
    );
    this.round.setPosition(
      (oldRound
        .getNextMoveDataDictionary()
        .get(oldRound.getMove()) as TMoveData).position
    );
    success = await this.loadPositionData();
    this.history.updateHistory(this.round, "curr");
    return success;
  }

  undoMove(): void {
    this.round = this.history
      .getRoundDictionary()
      .get(this.round.getRoundNumber() - 1) as CRound;
    this.history.updateHistory(this.round, "undo");
  }

  redoMove(): void {
    this.round = this.history
      .getRoundDictionary()
      .get(this.round.getRoundNumber() + 1) as CRound;
    this.history.updateHistory(this.round, "redo");
  }
}
