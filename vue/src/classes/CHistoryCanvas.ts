import { IHistoryCanvas } from "@/interfaces/IHistoryCanvas";
import { CHistory } from "./CHistory";

export class CHistoryCanvas implements IHistoryCanvas {
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

  constructor() {
    this.history = new CHistory();
    this.roundCt = 0;
    this.maxRemoteness = Number.POSITIVE_INFINITY;

    this.canvas = document.getElementById(
      "history-canvas"
    ) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

    this.font = "";
    this.color = "";
    this.winColor = "";
    this.tieColor = "";
    this.loseColor = "";

    this.tieLabel = "";
    this.p1Name = "";
    this.p2Name = "";

    this.padding = 0;

    this.nameHt = 0;
    this.xLabelHt = 0;
    this.rowHt = 0;
    this.rowCt = 0;
    this.gridHt = 0;
    this.canvasHt = 0;

    this.canvasWd = 0;
    this.yLabelWd = 0;
    this.gridWd = 0;
    this.colCt = 0;
    this.colWd = 0;

    this.gridTop = 0;
    this.gridBottom = 0;
    this.gridLeft = 0;
    this.gridRight = 0;

    this.gridMidX = 0;

    this.pointXs = [];
    this.pointYs = [];
    this.pointRadius = 0;

    this.linkWd = 0;

    this.xBarWd = 0;
    this.xIntervalBarWd = 0;
    this.xInterval = 0;
  }
}
