import { IAppSetting } from "@/interfaces/IAppSetting";

export class CAppSetting implements IAppSetting {
  themes: Array<string>;
  theme: string;
  layouts: Array<string>;
  layout: string;

  constructor(pairs?: {
    themes: Array<string>;
    theme: string;
    layouts: Array<string>;
    layout: string;
  }) {
    this.themes = (pairs && pairs.themes) || [];
    this.theme = (pairs && pairs.theme) || "default";
    this.layouts = (pairs && pairs.layouts) || [];
    this.layout = (pairs && pairs.layout) || "default";
  }
}
