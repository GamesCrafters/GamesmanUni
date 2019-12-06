import { CGames } from "@/classes/CGames";
import { CGame } from "@/classes/CGame";
import { CGitHub } from "@/classes/CGitHub";

export interface IApp {
  getLoadingStatus(): boolean;
  getThemeDictionary(): Map<string, string>;
  getTheme(): string;
  getLayoutDictionary(): Map<string, string>;
  getLayout(): string;
  getLanguageDictionary(): Map<string, string>;
  getLanguage(): string;
  getServerDataVersion(): string;
  getServerDataSource(): string;
  getGames(): CGames;
  getGame(): CGame;
  getUpdates(): CGitHub;

  setLoadingStatus(loadingStatus: boolean): void;
  setTheme(theme: string): void;
  setLayout(layout: string): void;
  setLanguage(language: string): void;
  setGame(game: CGame): void;
}
