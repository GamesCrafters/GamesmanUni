import { History } from "@/classes/History";

export interface IVisualizer {
  history: History;
  maximumRemoteness: number;
  currentRoundNumber: number;

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  font: string;
  color: string;
  winColor: string;
  tieColor: string;
  drawColor: string;
  loseColor: string;

  xDrawLabel: string;
  turnName0: string;
  turnName1: string;

  padding: number;

  turnNameHeight: number;
  xLabelHeight: number;
  rowHeight: number;
  rowCount: number;
  gridHeight: number;
  canvasHeight: number;

  yLabelWidth: number;
  columnWidth: number;
  columnCount: number;
  gridWidth: number;
  canvasWidth: number;

  gridTop: number;
  gridBottom: number;
  gridLeft: number;
  gridRight: number;
  gridMidX: number;

  pointRadius: number;
  pointCoordinates: { [round: number]: { x: number; y: number } };

  linkWidth: number;

  xBarWidth: number;
  xIntervalBarWidth: number;
  xInterval: number;
}
