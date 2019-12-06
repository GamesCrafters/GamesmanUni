import { IApp } from "@/interfaces/IApp";
import { CGames } from "@/classes/CGames";
import { CGame } from "@/classes/CGame";
import { CGitHub } from "./CGitHub";

export class CApp implements IApp {
  private loadingStatus: boolean;
  private readonly themeDictionary: Map<string, string>;
  private theme: string;
  private readonly layoutDictionary: Map<string, string>;
  private layout: string;
  private readonly languageDictionary: Map<string, string>;
  private language: string;
  private readonly serverDataVersion: string;
  private readonly serverDataSource: string;
  private readonly games: CGames;
  private game: CGame;
  private readonly updates: CGitHub;

  constructor() {
    this.loadingStatus = true;
    this.themeDictionary = new Map(
      Object.entries(require("@/datas/defaults.json").themeDictionary)
    );
    this.theme = require("@/datas/defaults.json").theme;
    this.layoutDictionary = new Map(
      Object.entries(require("@/datas/defaults.json").layoutDictionary)
    );
    this.layout = require("@/datas/defaults.json").layout;
    this.languageDictionary = new Map(
      Object.entries(require("@/datas/defaults.json").languageDictionary)
    );
    this.language = require("@/datas/defaults.json").language;
    this.serverDataVersion = require("@/datas/defaults.json").serverDataVersion;
    this.serverDataSource = require("@/datas/defaults.json").serverDataSource;
    this.games = new CGames();
    this.game = new CGame();
    this.updates = new CGitHub();
  }

  getLoadingStatus(): boolean {
    return this.loadingStatus;
  }

  getThemeDictionary(): Map<string, string> {
    return this.themeDictionary;
  }

  getTheme(): string {
    return this.theme;
  }

  getLayoutDictionary(): Map<string, string> {
    return this.layoutDictionary;
  }

  getLayout(): string {
    return this.layout;
  }

  getLanguageDictionary(): Map<string, string> {
    return this.languageDictionary;
  }

  getLanguage(): string {
    return this.language;
  }

  getServerDataVersion(): string {
    return this.serverDataVersion;
  }

  getServerDataSource(): string {
    return this.serverDataSource;
  }

  getGames(): CGames {
    return this.games;
  }

  getGame(): CGame {
    return this.game;
  }

  getUpdates(): CGitHub {
    return this.updates;
  }

  setLoadingStatus(loadingStatus: boolean): void {
    this.loadingStatus = loadingStatus;
  }

  setTheme(theme: string): void {
    this.theme = theme;
  }

  setLayout(layout: string): void {
    this.layout = layout;
  }

  setLanguage(language: string): void {
    this.language = language;
  }

  setGame(game: CGame): void {
    this.game = game;
  }
}
