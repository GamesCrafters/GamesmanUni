import { IVvh } from "@/interfaces/IVvh";
import { CGame } from "@/classes/CGame";
import { CHistory } from "@/classes/CHistory";
import { CRound } from "@/classes/CRound";

export class CVvh implements IVvh {
  private history: CHistory;
  private maximumRemoteness: number;
  private currentRoundNumber: number;

  private showHint: boolean;

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private font: any;
  private primaryColor: any;
  private winColor: any;
  private drawColor: any;
  private tieColor: any;
  private loseColor: any;
  private turn0Color: any;
  private turn1Color: any;

  private turn0Name: string;
  private turn1Name: string;

  private xLabel: string;
  private yLeftLabel: string;
  private yRightLabel: string;

  private padding: number;

  private turnNameHeight: number;
  private xLabelHeight: number;
  private xCoordinateHeight: number;
  private rowHeight: number;

  private rowCount: number;
  private gridHeight: number;
  private canvasHeight: number;

  private yLabelWidth: number;
  private yCoordinateWidth: number;
  private columnWidth: number;

  private columnCount: number;
  private gridWidth: number;
  private canvasWidth: number;

  private gridTop: number;
  private gridBottom: number;
  private gridLeft: number;
  private gridMiddleX: number;
  private gridRight: number;

  private pointRadius: number;
  private linkWidth: number;
  private xBarWidth: number;
  private xIntervalBarWidth: number;
  private xInterval: number;

  private pointCoordinates: {
    [round: number]: { x: number | [number, number]; y: number };
  };

  constructor(game: CGame, showHint: boolean) {
    this.history = game.getHistory();
    this.maximumRemoteness = this.history.getMaximumRemoteness();
    this.currentRoundNumber = this.history.getCurrentRoundNumber();

    this.showHint = showHint;

    this.canvas = document.getElementById(
      game.getVvhSelectorId()
    ) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

    this.font = getComputedStyle(document.body).getPropertyValue("--font");
    this.primaryColor = getComputedStyle(document.body).getPropertyValue(
      "--primaryColor"
    );
    this.winColor = getComputedStyle(document.body).getPropertyValue(
      "--winColor"
    );
    this.drawColor = getComputedStyle(document.body).getPropertyValue(
      "--drawColor"
    );
    this.tieColor = getComputedStyle(document.body).getPropertyValue(
      "--tieColor"
    );
    this.loseColor = getComputedStyle(document.body).getPropertyValue(
      "--loseColor"
    );
    this.turn0Color = getComputedStyle(document.body).getPropertyValue(
      "--turn0Color"
    );
    this.turn1Color = getComputedStyle(document.body).getPropertyValue(
      "--turn1Color"
    );

    this.turn0Name = game.getTurnNameDictionary().get(0) as string;
    this.turn1Name = game.getTurnNameDictionary().get(1) as string;

    this.xLabel = require("@/datas/defaults.json").vvhXLabel;
    this.yLeftLabel = require("@/datas/defaults.json").vvhYLeftLabel;
    this.yRightLabel = require("@/datas/defaults.json").vvhYRightLabel;

    this.padding = require("@/datas/defaults.json").vvhPadding;
    this.turnNameHeight = require("@/datas/defaults.json").vvhTurnNameHeight;
    this.xLabelHeight = require("@/datas/defaults.json").vvhXLabelHeight;
    this.xCoordinateHeight = require("@/datas/defaults.json").vvhXCoordinateHeight;
    this.rowHeight = require("@/datas/defaults.json").vvhRowHeight;

    this.rowCount = this.currentRoundNumber;
    this.gridHeight = this.rowHeight * this.rowCount;
    this.canvasHeight =
      this.turnNameHeight +
      2 * (this.padding + this.xCoordinateHeight + this.xLabelHeight) +
      this.gridHeight;

    this.yLabelWidth = require("@/datas/defaults.json").vvhYLabelWidth;
    this.yCoordinateWidth = require("@/datas/defaults.json").vvhYCoordinateWidth;
    this.columnWidth = require("@/datas/defaults.json").vvhColumnWidth;

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

    this.pointRadius = require("@/datas/defaults.json").vvhPointRadius;
    this.linkWidth = require("@/datas/defaults.json").vvhLinkWidth;
    this.xBarWidth = require("@/datas/defaults.json").vvhXBarWidth;
    this.xIntervalBarWidth = require("@/datas/defaults.json").vvhXIntervalBarWidth;
    this.xInterval = require("@/datas/defaults.json").vvhXInterval;

    this.pointCoordinates = {};
  }

  drawVvh(): void {
    this.setCanvasShape();
    this.setCanvasResolution();
    this.setVvhFrame();
    this.setTurnNames();
    this.setXLabel();
    this.setXCoordinates();
    this.setYLabel();
    this.setYCoordinates();
    this.setRoundTurnColorGuide();
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
    const devicePixelRatio = window.devicePixelRatio || 1;
    this.canvas.width *= devicePixelRatio;
    this.canvas.height *= devicePixelRatio;
    this.ctx.scale(devicePixelRatio, devicePixelRatio);
  }

  private setVvhFrame(): void {
    this.ctx.strokeStyle = this.primaryColor;
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
      this.turn0Name,
      this.gridMiddleX - this.gridWidth / 3,
      this.padding + this.turnNameHeight / 2,
      this.turn0Color
    );
    this.setText(
      this.turn1Name,
      this.gridMiddleX + this.gridWidth / 3,
      this.padding + this.turnNameHeight / 2,
      this.turn1Color
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
      this.primaryColor
    );

    this.setText(
      this.xLabel,
      this.canvasWidth / 2,
      this.gridBottom + this.xCoordinateHeight + this.xLabelHeight / 2,
      this.primaryColor
    );
  }

  private setXCoordinates(): void {
    this.setText(
      "D",
      this.gridMiddleX,
      this.gridTop - this.xCoordinateHeight / 2,
      this.primaryColor
    );
    this.setText(
      "D",
      this.gridMiddleX,
      this.gridBottom + this.xCoordinateHeight / 2,
      this.primaryColor
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
        this.primaryColor
      );
      this.setText(
        remoteness.toString(),
        this.remotenessToX(remoteness, 1),
        this.gridTop - this.xCoordinateHeight / 2,
        this.primaryColor
      );
      this.setText(
        remoteness.toString(),
        this.remotenessToX(remoteness, 0),
        this.gridBottom + this.xCoordinateHeight / 2,
        this.primaryColor
      );
      this.setText(
        remoteness.toString(),
        this.remotenessToX(remoteness, 1),
        this.gridBottom + this.xCoordinateHeight / 2,
        this.primaryColor
      );
    }
  }

  private setYLabel(): void {
    this.setText(
      this.yLeftLabel,
      this.gridLeft - this.yCoordinateWidth - this.yLabelWidth / 2,
      this.gridTop + this.gridHeight / 2,
      this.primaryColor,
      -(Math.PI / 2)
    );

    this.setText(
      this.yRightLabel,
      this.gridRight + this.yCoordinateWidth + this.yLabelWidth / 2,
      this.gridTop + this.gridHeight / 2,
      this.primaryColor,
      Math.PI / 2
    );
  }

  private setYCoordinates(): void {
    for (let round: number = 1; round <= this.currentRoundNumber; round++) {
      if (
        (this.history.getRoundDictionary().get(round) as CRound).getTurnId() ===
        0
      ) {
        this.setText(
          (this.history.getRoundDictionary().get(round) as CRound).getMove(),
          this.gridLeft - this.yCoordinateWidth / 2,
          this.roundToY(round),
          this.primaryColor
        );
      } else {
        this.setText(
          (this.history.getRoundDictionary().get(round) as CRound).getMove(),
          this.gridRight + this.yCoordinateWidth / 2,
          this.roundToY(round),
          this.primaryColor
        );
      }
    }
    if (
      this.history.getRoundDictionary().get(this.currentRoundNumber) &&
      (this.history
        .getRoundDictionary()
        .get(this.currentRoundNumber) as CRound).getRemoteness() === 0
    ) {
      if (
        (this.history
          .getRoundDictionary()
          .get(this.currentRoundNumber) as CRound).getTurnId() === 0
      ) {
        this.setText(
          "😢",
          this.gridLeft - this.yCoordinateWidth / 2,
          this.roundToY(this.currentRoundNumber),
          this.primaryColor
        );
        this.setText(
          "🥳",
          this.gridRight + this.yCoordinateWidth / 2,
          this.roundToY(this.currentRoundNumber),
          this.primaryColor
        );
      } else {
        this.setText(
          "🥳",
          this.gridLeft - this.yCoordinateWidth / 2,
          this.roundToY(this.currentRoundNumber),
          this.primaryColor
        );
        this.setText(
          "😢",
          this.gridRight + this.yCoordinateWidth / 2,
          this.roundToY(this.currentRoundNumber),
          this.primaryColor
        );
      }
    }
  }

  private setRoundTurnColorGuide(): void {
    this.ctx.lineWidth = 0;
    this.ctx.globalAlpha = 0.2;
    for (let round: number = 1; round <= this.currentRoundNumber; round++) {
      if (
        (this.history.getRoundDictionary().get(round) as CRound).getTurnId() ===
        0
      ) {
        this.ctx.fillStyle = this.turn0Color;
      } else {
        this.ctx.fillStyle = this.turn1Color;
      }
      this.ctx.fillRect(
        this.gridLeft + this.columnWidth / 2,
        this.gridTop + (round - 1) * this.rowHeight,
        this.gridWidth - this.columnWidth,
        this.rowHeight
      );
    }
    this.ctx.globalAlpha = 1;
  }

  private setGrid(): void {
    this.ctx.strokeStyle = this.primaryColor;
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
      roundData = this.history.getRoundDictionary().get(round) as CRound;
      if (roundData.getPositionValue() === "draw") {
        x = this.gridMiddleX;
      } else if (roundData.getPositionValue() === "tie") {
        x = [
          this.remotenessToX(roundData.getRemoteness(), 0),
          this.remotenessToX(roundData.getRemoteness(), 1),
        ];
      } else if (roundData.getPositionValue() === "lose") {
        x = this.remotenessToX(
          roundData.getRemoteness(),
          (roundData.getTurnId() + 1) % 2
        );
      } else {
        x = this.remotenessToX(
          roundData.getRemoteness(),
          roundData.getTurnId()
        );
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
      color = this.valueToColor(
        (this.history.getRoundDictionary().get(round) as CRound).getMoveValue()
      );
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
        this.setLink(x1[1], y1, x2[1], y2, color);
      }
    }
  }

  private setPoints(): void {
    let x, y, color;
    for (let round = 1; round <= this.currentRoundNumber; round++) {
      x = this.pointCoordinates[round].x;
      y = this.pointCoordinates[round].y;
      color = this.valueToColor(
        (this.history
          .getRoundDictionary()
          .get(round) as CRound).getPositionValue()
      );
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
