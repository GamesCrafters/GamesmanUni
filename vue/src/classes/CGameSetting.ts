import { IGameSetting } from "@/interfaces/IGameSetting";

export class CGameSetting implements IGameSetting {
  showHistory: boolean;

  constructor() {
    this.showHistory = true;
  }
}
