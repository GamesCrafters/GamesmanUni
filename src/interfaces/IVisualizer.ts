import { CGame } from "@/classes/CGame";

export interface IVisualizer {
  font: any;
  mainColor: any;
  winColor: any;
  drawColor: any;
  tieColor: any;
  loseColor: any;

  turnName0: string;
  turnName1: string;

  xLabel: string;
  yLeftLabel: string;
  yRightLabel: string;

  padding: number;

  turnNameHeight: number;
  xLabelHeight: number;
  xCoordinateHeight: number;
  rowHeight: number;

  yLabelWidth: number;
  yCoordinateWidth: number;
  columnWidth: number;

  pointRadius: number;
  linkWidth: number;
  xBarWidth: number;
  xIntervalBarWidth: number;
  xInterval: number;

  drawVisualizer(): void;
}
