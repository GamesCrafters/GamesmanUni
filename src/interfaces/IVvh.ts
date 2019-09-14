import { CGame } from "@/classes/CGame";

export interface IVvh {
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

  drawVvh(): void;
}
