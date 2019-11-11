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

  private async loadDetailedGameData(): Promise<void> {
    const detailedGameDataSource: string = `${this.serverDataSource}/games/${this.id}`;
    const httpResponse: AxiosResponse = await axios.get(detailedGameDataSource);
    const rawData: TRawGameData | TRawErrorData = httpResponse.data;
    if (rawData.status === "ok") {
      this.name = rawData.response.name;
      this.variantDataArray = rawData.response.variants.map(rawVariantData => ({
        id: rawVariantData.variantId,
        description: rawVariantData.description,
        status: rawVariantData.status,
        startingPosition: rawVariantData.startingPosition
      }));
      this.variantDataDictionary = new Map<string, TVariantData>();
      for (let i: number = 0; i < this.variantDataArray.length; i++) {
        this.variantDataDictionary.set(
          this.variantDataArray[i].id,
          this.variantDataArray[i]
        );
      }
    }
  }

  private async loadPositionData(): Promise<void> {
    let positionDataSource: string = this.serverDataSource;
    positionDataSource += `/games/${this.id}`;
    positionDataSource += `/variants/${this.currentVariantData.id}`;
    positionDataSource += `/positions/${this.round.getPosition()}`;
    const httpResponse: AxiosResponse = await axios.get(positionDataSource);
    const rawData: TRawPositionData | TRawErrorData = httpResponse.data;
    if (rawData.status === "ok") {
      this.round.setPositionValue(rawData.response.positionValue);
      this.round.setRemoteness(rawData.response.remoteness);
      this.round.setNextMoveDataArray(rawData.response.moves);
      this.round.setNextMoveDataDictionary(rawData.response.moves);
    }
  }

  async startNewGame(): Promise<void> {
    this.currentVariantData = this.variantDataDictionary.get(
      this.round.getVariantId()
    ) as TVariantData;
    this.round = new CRound();
    this.round.setVariantId(this.currentVariantData.id);
    this.round.setVariantDescription(this.currentVariantData.description);
    this.round.setTurnId(0);
    this.round.setTurnName(this.turnNameDictionary.get(
      this.round.getTurnId()
    ) as string);
    this.round.setPosition(this.currentVariantData.startingPosition);
    await this.loadPositionData();
    this.history = new CHistory();
    this.history.updateHistory(this.round);
  }

  async initGame(): Promise<void> {
    await this.loadDetailedGameData();
    this.startNewGame();
  }

  async runMove(): Promise<void> {
    this.round.setMoveValue(this.round.getMove());
    this.history.updateHistory(this.round);
    let oldRound = this.round;
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
    await this.loadPositionData();
    this.history.updateHistory(this.round);
  }

  undoMove(): void {
    this.round = this.history
      .getRoundDictionary()
      .get(this.round.getRoundNumber() - 1) as CRound;
  }

  redoMove(): void {
    this.round = this.history
      .getRoundDictionary()
      .get(this.round.getRoundNumber() + 1) as CRound;
  }
}
