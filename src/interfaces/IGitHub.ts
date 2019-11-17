export interface IGitHub {
  getLatestCommitCount(): number;
  getLatestCommitVersionArray(): Array<string>;
  getLatestCommitMessageArray(): Array<string>;
  getLatestCommitLinkArray(): Array<string>;
}
