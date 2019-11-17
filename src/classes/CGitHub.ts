import axios, { AxiosResponse } from "axios";
import { IGitHub } from "@/interfaces/IGitHub";

export class CGitHub implements IGitHub {
  private readonly gitHubDataSource: string;
  private rawLatestCommitDataArray: Array<any>;
  private latestCommitCount: number;
  private latestCommitVersionArray: Array<string>;
  private latestCommitMessageArray: Array<string>;
  private latestCommitLinkArray: Array<string>;

  constructor() {
    this.gitHubDataSource = require("@/datas/defaults.json").gitHubDataSource;
    this.rawLatestCommitDataArray = new Array<any>();
    this.latestCommitCount = 0;
    this.latestCommitVersionArray = new Array<string>();
    this.latestCommitMessageArray = new Array<string>();
    this.latestCommitLinkArray = new Array<string>();
  }

  getLatestCommitCount(): number {
    return this.latestCommitCount;
  }

  getLatestCommitVersionArray(): Array<string> {
    return this.latestCommitVersionArray;
  }

  getLatestCommitMessageArray(): Array<string> {
    return this.latestCommitMessageArray;
  }

  getLatestCommitLinkArray(): Array<string> {
    return this.latestCommitLinkArray;
  }

  private async loadRawLatestCommits(): Promise<boolean> {
    let success: boolean = true;
    const commitsSource: string = `${this.gitHubDataSource}/commits`;
    try {
      const httpResponse: AxiosResponse = await axios.get(commitsSource);
      this.rawLatestCommitDataArray = Object.values(httpResponse.data);
      this.latestCommitCount = this.rawLatestCommitDataArray.length;
      this.latestCommitVersionArray = this.rawLatestCommitDataArray.map(
        commitData => commitData.commit.message.split(":")[0]
      );
      this.latestCommitMessageArray = this.rawLatestCommitDataArray.map(
        commitData => commitData.commit.message.split(":")[1].split("\n")[0]
      );
      this.latestCommitLinkArray = this.rawLatestCommitDataArray.map(
        commitData => commitData.html_url
      );
    } catch (errorMessage) {
      console.error(errorMessage);
      console.error("Error: Failed to load update/commit data from server.");
      success = false;
    }
    return success;
  }

  async initCommits(): Promise<boolean> {
    let success: boolean = true;
    success = await this.loadRawLatestCommits();
    return success;
  }
}
