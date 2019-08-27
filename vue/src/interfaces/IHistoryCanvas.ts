import { CHistory } from "@/classes/CHistory";

export interface IHistoryCanvas {
  history: CHistory;
  roundCt: number;
  maxRemoteness: number;

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  font: string;
  color: string;
  winColor: string;
  tieColor: string;
  loseColor: string;

  tieLabel: string;
  p1Name: string;
  p2Name: string;

  padding: number;

  nameHt: number;
  xLabelHt: number;
  rowHt: number;
  rowCt: number;
  gridHt: number;
  canvasHt: number;

  canvasWd: number;
  yLabelWd: number;
  gridWd: number;
  colCt: number;
  colWd: number;

  gridTop: number;
  gridBottom: number;
  gridLeft: number;
  gridRight: number;

  gridMidX: number;

  pointXs: Array<number>;
  pointYs: Array<number>;
  pointRadius: number;

  linkWd: number;

  xBarWd: number;
  xIntervalBarWd: number;
  xInterval: number;
}
