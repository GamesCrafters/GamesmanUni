import { CGames } from "@/classes/CGames";
import { CGame } from "@/classes/CGame";

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

  setLoadingStatus(loadingStatus: boolean): void;
  setTheme(theme: string): void;
  setLayout(layout: string): void;
  setLanguage(language: string): void;
}
