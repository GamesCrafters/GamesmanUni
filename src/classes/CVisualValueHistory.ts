import * as style from "@/datas/styles/SLight";
import { IVisualValueHistory } from "@/interfaces/IVisualValueHistory";
import { CGame } from "@/classes/CGame";
import { CHistory } from "./CHistory";
import { CRound } from "./CRound";

export class CVisualValueHistory implements IVisualValueHistory {
  private history: CHistory;
  private maximumRemoteness: number;
  private currentRoundNumber: number;

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private font: any;
  private mainColor: any;
  private winColor: any;
  private drawColor: any;
  private tieColor: any;
  private loseColor: any;
  private turnColor0: any;
  private turnColor1: any;

  private turnName0: string;
  private turnName1: string;

  xLabel: string;
  yLeftLabel: string;
  yRightLabel: string;

  padding: number;

  turnNameHeight: number;
  xLabelHeight: number;
  xCoordinateHeight: number;
  rowHeight: number;

  private rowCount: number;
  private gridHeight: number;
  private canvasHeight: number;

  yLabelWidth: number;
  yCoordinateWidth: number;
  columnWidth: number;

  private columnCount: number;
  private gridWidth: number;
  private canvasWidth: number;

  private gridTop: number;
  private gridBottom: number;
  private gridLeft: number;
  private gridMiddleX: number;
  private gridRight: number;

  pointRadius: number;
  linkWidth: number;
  xBarWidth: number;
  xIntervalBarWidth: number;
  xInterval: number;

  private pointCoordinates: {
    [round: number]: { x: number | [number, number]; y: number };
  };

  constructor(game: CGame, currentRoundNumber?: number) {
    this.history = game.history;
    this.maximumRemoteness = this.history.maximumRemoteness;
    this.currentRoundNumber =
      currentRoundNumber ||
      (this.history.rounds.length != 0 && this.history.rounds.length) ||
      1;

    this.canvas = document.getElementById(
      game.visualValueHistorySelectorId
    ) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

    this.font = style.font;
    this.mainColor = style.mainColor;
    this.winColor = style.winColor;
    this.drawColor = style.drawColor;
    this.tieColor = style.tieColor;
    this.loseColor = style.loseColor;
    this.turnColor0 = style.turnColor0;
    this.turnColor1 = style.turnColor1;

    this.turnName0 = game.turnNames[0];
    this.turnName1 = game.turnNames[1];

    this.xLabel = "Remoteness";
    this.yLeftLabel = "Move #";
    this.yRightLabel = "Moves";

    this.padding = 10;
    this.turnNameHeight = 20;
    this.xLabelHeight = 20;
    this.xCoordinateHeight = 20;
    this.rowHeight = 20;

    this.rowCount = this.currentRoundNumber;
    this.gridHeight = this.rowHeight * this.rowCount;
    this.canvasHeight =
      this.turnNameHeight +
      2 * (this.padding + this.xCoordinateHeight + this.xLabelHeight) +
      this.gridHeight;

    this.yLabelWidth = 20;
    this.yCoordinateWidth = 20;
    this.columnWidth = 20;

    this.columnCount = 2 * this.maximumRemoteness + 3;
    this.gridWidth = this.columnWidth * this.columnCount;
    this.canvasWidth =
      2 * (this.padding + this.yCoordinateWidth + this.yLabelWidth) +
      this.gridWidth;

    this.gridTop =
      this.padding +
      this.turnNameHeight +
      this.xLabelHeight +
      this.xCoordinateHeight;
    this.gridBottom = this.gridTop + this.gridHeight;
    this.gridLeft = this.padding + this.yLabelWidth + this.yCoordinateWidth;
    this.gridMiddleX = this.gridLeft + this.gridWidth / 2;
    this.gridRight = this.gridLeft + this.gridWidth;

    this.pointRadius = 5;
    this.linkWidth = 1;
    this.xBarWidth = 1;
    this.xIntervalBarWidth = 2;
    this.xInterval = 5;

    this.pointCoordinates = {};
  }

  drawVisualValueHistory(): void {
    this.setCanvasShape();
    this.setCanvasResolution();
    this.setVisualValueHistoryFrame();
    this.setTurnNames();
    this.setXLabel();
    this.setXCoordinates();
    this.setYLabel();
    this.setYCoordinates();
    this.setGrid();
    this.getPointCoordinates();
    this.setGraph();
  }

  private setCanvasShape(): void {
    this.canvas.height = this.canvasHeight;
    this.canvas.width = this.canvasWidth;
  }

  private setCanvasResolution(): void {
    this.canvas.style.width = this.canvas.width + "px";
    this.canvas.style.height = this.canvas.height + "px";
    let devicePixelRatio = window.devicePixelRatio || 1;
    this.canvas.width *= devicePixelRatio;
    this.canvas.height *= devicePixelRatio;
    this.ctx.scale(devicePixelRatio, devicePixelRatio);
  }

  private setVisualValueHistoryFrame(): void {
    this.ctx.strokeStyle = this.mainColor;
    this.ctx.rect(0, 0, this.canvasWidth, this.canvasHeight);
    this.ctx.stroke();
  }

  private setText(
    text: string,
    x: number,
    y: number,
    color: string,
    rotationRadian?: number
  ): void {
    this.ctx.save();
    this.ctx.textBaseline = "middle";
    this.ctx.textAlign = "center";
    this.ctx.fillStyle = color;
    this.ctx.font = this.font;
    if (rotationRadian) {
      this.ctx.translate(x, y);
      this.ctx.rotate(rotationRadian);
      this.ctx.translate(-x, -y);
    }
    this.ctx.fillText(text, x, y);
    this.ctx.restore();
  }

  private setTurnNames(): void {
    this.setText(
      this.turnName0,
      this.gridMiddleX - this.gridWidth / 3,
      this.padding + this.turnNameHeight / 2,
      this.turnColor0
    );
    this.setText(
      this.turnName1,
      this.gridMiddleX + this.gridWidth / 3,
      this.padding + this.turnNameHeight / 2,
      this.turnColor1
    );
  }

  private remotenessToX(remoteness: number, turn: number): number {
    if (turn === 0) {
      return this.gridLeft + (remoteness + 0.5) * this.columnWidth;
    }
    return this.gridRight - (remoteness + 0.5) * this.columnWidth;
  }

  private roundToY(round: number): number {
    return this.gridTop + (round - 0.5) * this.rowHeight;
  }

  private setXLabel(): void {
    this.setText(
      this.xLabel,
      this.canvasWidth / 2,
      this.gridTop - this.xCoordinateHeight - this.xLabelHeight / 2,
      this.mainColor
    );

    this.setText(
      this.xLabel,
      this.canvasWidth / 2,
      this.gridBottom + this.xCoordinateHeight + this.xLabelHeight / 2,
      this.mainColor
    );
  }

  private setXCoordinates(): void {
    this.setText(
      "D",
      this.gridMiddleX,
      this.gridTop - this.xCoordinateHeight / 2,
      this.mainColor
    );
    this.setText(
      "D",
      this.gridMiddleX,
      this.gridBottom + this.xCoordinateHeight / 2,
      this.mainColor
    );
    for (
      let remoteness: number = 0;
      remoteness <= this.maximumRemoteness;
      remoteness += this.xInterval
    ) {
      this.setText(
        remoteness.toString(),
        this.remotenessToX(remoteness, 0),
        this.gridTop - this.xCoordinateHeight / 2,
        this.mainColor
      );
      this.setText(
        remoteness.toString(),
        this.remotenessToX(remoteness, 1),
        this.gridTop - this.xCoordinateHeight / 2,
        this.mainColor
      );
      this.setText(
        remoteness.toString(),
        this.remotenessToX(remoteness, 0),
        this.gridBottom + this.xCoordinateHeight / 2,
        this.mainColor
      );
      this.setText(
        remoteness.toString(),
        this.remotenessToX(remoteness, 1),
        this.gridBottom + this.xCoordinateHeight / 2,
        this.mainColor
      );
    }
  }

  private setYLabel(): void {
    this.setText(
      this.yLeftLabel,
      this.gridLeft - this.yCoordinateWidth - this.yLabelWidth / 2,
      this.gridTop + this.gridHeight / 2,
      this.mainColor,
      -(Math.PI / 2)
    );

    this.setText(
      this.yRightLabel,
      this.gridRight + this.yCoordinateWidth + this.yLabelWidth / 2,
      this.gridTop + this.gridHeight / 2,
      this.mainColor,
      Math.PI / 2
    );
  }

  private setYCoordinates(): void {
    for (let round: number = 1; round <= this.currentRoundNumber; round++) {
      this.setText(
        round.toString(),
        this.gridLeft - this.yCoordinateWidth / 2,
        this.roundToY(round),
        this.mainColor
      );
      this.setText(
        this.history.rounds[round - 1].move,
        this.gridRight + this.yCoordinateWidth / 2,
        this.roundToY(round),
        this.mainColor
      );
    }
    if (this.history.rounds[this.currentRoundNumber - 1].remoteness === 0) {
      this.setText(
        "😢",
        this.gridRight + this.yCoordinateWidth / 2,
        this.roundToY(this.currentRoundNumber),
        this.mainColor
      );
    }
  }

  private setGrid(): void {
    this.ctx.strokeStyle = this.mainColor;
    for (
      let remoteness: number = 0;
      remoteness <= this.maximumRemoteness + 1;
      remoteness++
    ) {
      if (
        remoteness % this.xInterval === 0 ||
        remoteness === this.maximumRemoteness + 1
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

  private getPointCoordinates(): void {
    let roundData: CRound;
    let x: number | [number, number];
    let y: number;
    for (let round = 1; round <= this.currentRoundNumber; round++) {
      roundData = this.history.rounds[round - 1];
      if (roundData.positionValue === "draw") {
        x = this.gridMiddleX;
      } else if (roundData.positionValue === "tie") {
        x = [
          this.remotenessToX(roundData.remoteness, 0),
          this.remotenessToX(roundData.remoteness, 1)
        ];
      } else if (roundData.positionValue === "lose") {
        x = this.remotenessToX(
          roundData.remoteness,
          (roundData.turnNumber + 1) % 2
        );
      } else {
        x = this.remotenessToX(roundData.remoteness, roundData.turnNumber);
      }
      y = this.roundToY(round);
      this.pointCoordinates[round] = { x: x, y: y };
    }
  }

  private valueToColor(value: string): any {
    if (value === "win") {
      return this.winColor;
    } else if (value === "draw") {
      return this.drawColor;
    } else if (value === "tie") {
      return this.tieColor;
    } else {
      return this.loseColor;
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

  private setLinks(): void {
    let x1, y1, x2, y2, color;
    for (let round = 1; round < this.currentRoundNumber; round++) {
      x1 = this.pointCoordinates[round].x;
      y1 = this.pointCoordinates[round].y;
      x2 = this.pointCoordinates[round + 1].x;
      y2 = this.pointCoordinates[round + 1].y;
      color = this.valueToColor(this.history.rounds[round - 1].moveValue);
      if (typeof x1 === "number" && typeof x2 === "number") {
        this.setLink(x1, y1, x2, y2, color);
      } else if (typeof x1 === "number" && typeof x2 != "number") {
        this.setLink(x1, y1, x2[0], y2, color);
        this.setLink(x1, y1, x2[1], y2, color);
      } else if (typeof x1 != "number" && typeof x2 === "number") {
        this.setLink(x1[0], y1, x2, y2, color);
        this.setLink(x1[1], y1, x2, y2, color);
      } else if (typeof x1 != "number" && typeof x2 != "number") {
        this.setLink(x1[0], y1, x2[0], y2, color);
        this.setLink(x1[0], y1, x2[1], y2, color);
      }
    }
  }

  private setPoints(): void {
    let x, y, color;
    for (let round = 1; round <= this.currentRoundNumber; round++) {
      x = this.pointCoordinates[round].x;
      y = this.pointCoordinates[round].y;
      color = this.valueToColor(this.history.rounds[round - 1].positionValue);
      if (typeof x === "number") {
        this.setPoint(x, y, color);
      } else {
        this.setLink(x[0], y, x[1], y, color);
        this.setPoint(x[0], y, color);
        this.setPoint(x[1], y, color);
      }
    }
  }

  private setGraph(): void {
    this.setLinks();
    this.setPoints();
  }
}
