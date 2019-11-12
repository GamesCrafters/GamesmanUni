import axios, { AxiosResponse } from "axios";
import { TRawErrorData } from "@/types/external/TRawErrorData";
import { TRawGameData } from "@/types/external/TRawGameData";
import { TRawPositionData } from "@/types/external/TRawPositionData";
import { TMoveData } from "@/types/internal/TMoveData";
import { TVariantData } from "@/types/internal/TVariantData";
import { IGame } from "@/interfaces/IGame";
import { CRound } from "@/classes/CRound";
import { CHistory } from "@/classes/CHistory";

export class CGame implements IGame {
  private readonly serverDataSource: string;
  private id: string;
  private name: string;
  private variantDataArray: Array<TVariantData>;
  private variantDataDictionary: Map<string, TVariantData>;
  private currentVariantData: TVariantData;
  private turnNameDictionary: Map<number, string>;
  private readonly vvhSelectorId: string;
  private round: CRound;
  private history: CHistory;
  private showHint: boolean;

  constructor() {
    this.serverDataSource = require("@/datas/defaults.json").serverDataSource;
    this.id = "";
    this.name = "";
    this.variantDataArray = new Array<TVariantData>();
    this.variantDataDictionary = new Map<string, TVariantData>();
    this.currentVariantData = {
      id: "",
      description: "",
      status: "",
      startingPosition: ""
    };
    this.turnNameDictionary = new Map([
      [0, require("@/datas/defaults.json").turn0Name],
      [1, require("@/datas/defaults.json").turn1Name]
    ]);
    this.vvhSelectorId = require("@/datas/defaults.json").vvhSelectorId;
    this.round = new CRound();
    this.history = new CHistory();
    this.showHint = require("@/datas/defaults.json").showHint;
  }

  getId(): string {
    return this.id;
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

  getVariantData(): TVariantData {
    return this.currentVariantData;
  }

  getTurnNameDictionary(): Map<number, string> {
    return this.turnNameDictionary;
  }

  getVvhSelectorId(): string {
    return this.vvhSelectorId;
  }

  getRound(): CRound {
    return this.round;
  }

  getHistory(): CHistory {
    return this.history;
  }

  getShowHint(): boolean {
    return this.showHint;
  }

  setId(id: string): void {
    this.id = id;
  }

  setName(name: string): void {
    this.name = name;
  }

  setVariantData(variantId: string): void {
    this.currentVariantData = this.variantDataDictionary.get(variantId) || {
      id: "",
      description: "",
      status: "",
      startingPosition: ""
    };
  }

  setTurn0Name(turn0Name: string): void {
    this.turnNameDictionary.set(0, turn0Name);
  }

  setTurn1Name(turn1Name: string): void {
    this.turnNameDictionary.set(1, turn1Name);
  }

  setShowHint(showHint: boolean): void {
    this.showHint = showHint;
  }

  private async loadDetailedGameData(): Promise<boolean> {
    let success: boolean = true;
    const detailedGameDataSource: string = `${this.serverDataSource}/games/${this.id}`;
    try {
      const httpResponse: AxiosResponse = await axios.get(
        detailedGameDataSource
      );
      const rawData: TRawGameData | TRawErrorData = httpResponse.data;
      if (rawData.status === "ok") {
        this.name = rawData.response.name;
        this.variantDataArray = rawData.response.variants.map(
          rawVariantData => ({
            id: rawVariantData.variantId,
            description: rawVariantData.description,
            status: rawVariantData.status,
            startingPosition: rawVariantData.startingPosition
          })
        );
        this.variantDataDictionary = new Map<string, TVariantData>();
        for (let i: number = 0; i < this.variantDataArray.length; i++) {
          this.variantDataDictionary.set(
            this.variantDataArray[i].id,
            this.variantDataArray[i]
          );
        }
      }
    } catch (errorMessage) {
      console.error(errorMessage);
      console.error("Error: Failed to load detailed game data from server.");
      success = false;
    }
    return success;
  }

  private async loadPositionData(): Promise<boolean> {
    let success: boolean = true;
    let positionDataSource: string = this.serverDataSource;
    positionDataSource += `/games/${this.id}`;
    positionDataSource += `/variants/${this.currentVariantData.id}`;
    positionDataSource += `/positions/${this.round.getPosition()}`;
    try {
      const httpResponse: AxiosResponse = await axios.get(positionDataSource);
      const rawData: TRawPositionData | TRawErrorData = httpResponse.data;
      if (rawData.status === "ok") {
        this.round.setPositionValue(rawData.response.positionValue);
        this.round.setRemoteness(rawData.response.remoteness);
        this.round.setNextMoveDataArray(rawData.response.moves);
        this.round.setNextMoveDataDictionary(rawData.response.moves);
      }
    } catch (errorMessage) {
      console.error(errorMessage);
      console.error("Error: Failed to load position data from server.");
      success = false;
    }
    return success;
  }

  async startNewGame(): Promise<boolean> {
    let success: boolean = true;
    this.currentVariantData = this.variantDataDictionary.get(
      this.round.getVariantId()
    ) as TVariantData;
    this.round = new CRound();
    this.round.setVariantId(this.currentVariantData.id);
    this.round.setVariantDescription(this.currentVariantData.description);
    this.round.setTurnId(0);
    this.round.setTurnName(this.turnNameDictionary.get(0) as string);
    this.round.setPosition(this.currentVariantData.startingPosition);
    success = await this.loadPositionData();
    this.history = new CHistory();
    this.history.updateHistory(this.round, "curr");
    return success;
  }

  async initGame(): Promise<boolean> {
    let success: boolean = true;
    success = await this.loadDetailedGameData();
    success = await this.startNewGame();
    return success;
  }

  async runMove(): Promise<boolean> {
    let success = true;
    this.round.setMoveValue(this.round.getMove());
    this.history.updateHistory(this.round, "last");
    const oldRound = this.round;
    this.round = new CRound();
    this.round.setRoundNumber(oldRound.getRoundNumber() + 1);
    this.round.setVariantId(oldRound.getVariantId());
    this.round.setVariantDescription(oldRound.getVariantDescription());
    this.round.setTurnId((oldRound.getTurnId() + 1) % 2);
    this.round.setTurnName(this.turnNameDictionary.get(
      this.round.getTurnId()
    ) as string);
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
