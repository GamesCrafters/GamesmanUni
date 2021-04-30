import { CVvh } from "@/classes/CVvh";
import { CGame } from "./CGame";
import { CRound } from "@/classes/CRound";

export class CPvvh extends CVvh {
  constructor(game: CGame, showHint: boolean) {
    super(game, showHint);
  }

  protected setText(
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

  protected setTurnNames(): void {
    return;
  }

  protected getPointCoordinates(): void {
    let roundData: CRound;
    let x: number | [number, number];
    let y: number;
    for (let round = 1; round <= this.currentRoundNumber; round++) {
      roundData = this.history.getRoundDictionary().get(round) as CRound;
      if (roundData.getPositionValue() === "lose") {
        x = this.gridLeft;
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

  protected remotenessToX(remoteness: number, turn: number): number {
    return this.gridRight + 4 - (remoteness + 0.5) * 2 * this.columnWidth;
  }

  protected setXCoordinates(): void {
    this.setText(
      "L",
      this.gridLeft,
      this.gridTop - this.xCoordinateHeight / 2,
      this.primaryColor
    );
    this.setText(
      "L",
      this.gridLeft,
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
        this.remotenessToX(remoteness, 1),
        this.gridTop - this.xCoordinateHeight / 2,
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
}
