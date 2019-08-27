import { IGameData } from "@/interfaces/IGameData";

export class CGameData implements IGameData {
  readonly id: string;
  readonly name: string;
  readonly dataBaseUrl: string;

  constructor(pairs?: { id: string; name: string; dataBaseUrl: string }) {
    this.id = (pairs && pairs.id) || "";
    this.name = (pairs && pairs.name) || "";
    this.dataBaseUrl = (pairs && pairs.dataBaseUrl) || "";
  }
}
