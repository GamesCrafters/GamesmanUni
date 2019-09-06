import { IVisualizer } from "@/interfaces/IVisualizer";
import { History } from "@/classes/History";

export class Visualizer implements IVisualizer {
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

  constructor(history: History, canvasSelector: string) {
    this.history = history;
    this.maximumRemoteness = history.getMaximumRemoteness();
    this.currentRoundNumber = history.getCurrentRoundNumber();

    this.canvas = (document.getElementById(canvasSelector) ||
      document.createElement("canvas")) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

    this.font = "Helvetica";
    this.color = "black";
    this.winColor = "green";
    this.tieColor = "yellow";
    this.drawColor = "purple";
    this.loseColor = "red";

    this.xDrawLabel = "D";
    this.turnName0 = "Player 0";
    this.turnName1 = "Player 1";

    this.padding = 10;

    this.turnNameHeight = 15;
    this.xLabelHeight = 10;
    this.rowHeight = 15;
    this.rowCount = this.currentRoundNumber + 1;
    this.gridHeight = this.rowHeight * this.rowCount;
    this.canvasHeight =
      (this.padding + this.xLabelHeight) * 2 +
      this.turnNameHeight +
      this.gridHeight;

    this.yLabelWidth = 10;
    this.columnWidth = 10;
    this.columnCount = this.maximumRemoteness * 2 + 3;
    this.gridWidth = this.columnWidth * this.columnCount;
    this.canvasWidth = (this.padding + this.yLabelWidth) * 2 + this.gridWidth;

    this.gridTop = this.padding + this.turnNameHeight + this.xLabelHeight;
    this.gridBottom = this.gridTop + this.gridHeight;
    this.gridLeft = this.padding + this.yLabelWidth;
    this.gridRight = this.gridLeft + this.gridWidth;
    this.gridMidX = this.gridLeft + this.gridWidth / 2;

    this.pointRadius = 5;
    this.pointCoordinates = {};

    this.linkWidth = 1;

    this.xBarWidth = 1;
    this.xIntervalBarWidth = 2;
    this.xInterval = 5;
  }

  setCanvas(): void {
    this.setCanvasShape();
    this.setCanvasFrame();
    this.setTurnNames();
    this.setXLabels();
    this.setYLabels();
    this.setGrid();
    // this.setGraph();
  }

  private setCanvasShape(): void {
    this.canvas.height = this.canvasHeight;
    this.canvas.width = this.canvasWidth;
  }

  private setCanvasFrame(): void {
    this.ctx.strokeStyle = this.color;
    this.ctx.rect(0, 0, this.canvasWidth, this.canvasHeight);
    this.ctx.stroke();
  }

  private setText(text: string, x: number, y: number, color: string): void {
    this.ctx.textBaseline = "middle";
    this.ctx.textAlign = "center";
    this.ctx.fillStyle = color;
    this.ctx.font = this.font;
    this.ctx.fillText(text, x, y);
  }

  private setTurnNames(): void {
    this.setText(
      this.turnName0,
      this.gridMidX - this.gridWidth / 4,
      this.padding + this.turnNameHeight / 2,
      this.color
    );
    this.setText(
      this.turnName1,
      this.gridMidX + this.gridWidth / 4,
      this.padding + this.turnNameHeight / 2,
      this.color
    );
  }

  // 0: left, 1: right
  private remotenessToX(remoteness: number, side: number): number {
    if (side == 0) {
      return this.gridLeft + (remoteness + 0.5) * this.columnWidth;
    }
    return this.gridRight - (remoteness + 0.5) * this.columnWidth;
  }

  private roundToY(round: number): number {
    return this.gridTop + (round + 0.5) * this.rowHeight;
  }

  private setXLabels(): void {
    this.setText(
      this.xDrawLabel,
      this.gridMidX,
      this.gridTop - this.xLabelHeight / 2,
      this.color
    );
    this.setText(
      this.xDrawLabel,
      this.gridMidX,
      this.gridBottom + this.xLabelHeight / 2,
      this.color
    );
    for (
      let remoteness: number = 0;
      remoteness <= this.maximumRemoteness;
      remoteness += this.xInterval
    ) {
      this.setText(
        remoteness.toString(),
        this.remotenessToX(remoteness, 0),
        this.gridTop - this.xLabelHeight / 2,
        this.color
      );
      this.setText(
        remoteness.toString(),
        this.remotenessToX(remoteness, 1),
        this.gridTop - this.xLabelHeight / 2,
        this.color
      );
      this.setText(
        remoteness.toString(),
        this.remotenessToX(remoteness, 0),
        this.gridBottom + this.xLabelHeight / 2,
        this.color
      );
      this.setText(
        remoteness.toString(),
        this.remotenessToX(remoteness, 1),
        this.gridBottom + this.xLabelHeight / 2,
        this.color
      );
    }
  }

  private setYLabels(): void {
    for (let round: number = 0; round <= this.currentRoundNumber; round++) {
      this.setText(
        round.toString(),
        this.gridLeft - this.yLabelWidth / 2,
        this.roundToY(round),
        this.color
      );
      this.setText(
        round.toString(),
        this.gridRight + this.yLabelWidth / 2,
        this.roundToY(round),
        this.color
      );
    }
  }

  private setGrid(): void {
    this.ctx.strokeStyle = this.color;
    for (
      let remoteness: number = 0;
      remoteness <= this.maximumRemoteness + 1;
      remoteness++
    ) {
      if (
        remoteness % this.xInterval == 0 ||
        remoteness == this.maximumRemoteness + 1
      ) {
        this.ctx.lineWidth = this.xIntervalBarWidth;
      } else {
        this.ctx.lineWidth = this.xBarWidth;
      }

      this.ctx.beginPath();
      this.ctx.moveTo(this.remotenessToX(remoteness, 0), this.gridTop);
      this.ctx.lineTo(this.remotenessToX(remoteness, 0), this.gridBottom);
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.moveTo(this.remotenessToX(remoteness, 1), this.gridTop);
      this.ctx.lineTo(this.remotenessToX(remoteness, 1), this.gridBottom);
      this.ctx.stroke();
    }
  }

  private setLink(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: string
  ): void {
    this.ctx.lineWidth = this.linkWidth;
    this.ctx.strokeStyle = color;
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
  }

  private setPoint(x: number, y: number, color: string): void {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, this.pointRadius, 0, 2 * Math.PI);
    this.ctx.closePath();
    this.ctx.fill();
  }

  private setTiePoints(x: number, y: number): void {
    this.setPoint(x, y, this.tieColor);
    this.setLink(x, y, this.gridRight - x, y, this.tieColor);
    this.setPoint(this.gridRight - x, y, this.tieColor);
  }

  // private setPointCoordinates(): void {
  //   // manually set for round 0...
  //   this.pointCoordinates[0] = { x: this.remotenessToX(this.history.remotenesses[0], "left"), y: this.roundToY(0) };
  //   for (let round: number = 1; round <= this.currentRoundNumber; round++) {
  //     // TBS
  //     let x: number = this.gridMidX;
  //     if (this.history.values[round] === "draw") {
  //       x = this.gridMidX;
  //     } else if (this.history.values[round] === "tie") {
  //       x = this.remotenessToX(this.history.remotenesses[round], "left");
  //     }
  //       this.pointCoordinates[round] = {
  //       x: x,
  //       y: this.roundToY(round)
  //     }
  //   }
  // }

  private setGraph(): void {
    let side: number = this.history.turns[0];
    let x: number = this.remotenessToX(this.maximumRemoteness, side);
    this.pointCoordinates[0] = { x: x, y: this.roundToY(0) };
    this.setTiePoints(this.maximumRemoteness, 0);
    for (let round: number = 1; round <= this.currentRoundNumber; round++) {
      // get coordinate
      // set link
      // set point
    }
  }

  // private setPoints(): void {
  //   for (let i = 0; i <= this.rowCount; i++) {
  //     if (this.history.values[i] === "tie") {
  //       console.log("i:", i);
  //       console.log("value:", this.history.values[i]);
  //       console.log("remoteness:", this.history.remotenesses[i]);
  //       this.setTiePoints(this.history.remotenesses[i], i);
  //     }
  //   }
  // }

  // // TBS
  // private setLinks(): void {}
}
