export interface IGitHub {
  getLatestCommitCount(): number;
  getLatestCommitDateArray(): Array<string>;
  getLatestCommitMessageArray(): Array<string>;
  getLatestCommitLinkArray(): Array<string>;
}
