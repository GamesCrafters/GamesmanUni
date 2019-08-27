import { IGameData } from "@/interfaces/IGameData";

export class CGameData implements IGameData {
  id: string;
  name: string;
  dataBaseUrl: string;

  constructor(pairs?: { id: string; name: string; dataBaseUrl: string }) {
    this.id = (pairs && pairs.id) || "???";
    this.name = (pairs && pairs.name) || "???";
    this.dataBaseUrl = (pairs && pairs.dataBaseUrl) || "???";
  }
}
