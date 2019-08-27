<template>
  <div id="history">
    <h3 id="history-title">Game History</h3>
    <canvas id="history-canvas"></canvas>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import { CHistory } from "@/classes/CHistory";
import { CHistoryCanvas } from "@/classes/CHistoryCanvas";

@Component
export default class History extends Vue {
  v: CHistoryCanvas = new CHistoryCanvas();

  mounted() {
    this.initData();
    this.setHistory();
  }

  @Watch("store.state.appSetting.theme")
  onThemeChange() {
    this.initData();
    this.setHistory();
  }
  private initData() {
    this.v.history = this.$store.state.currentGame.history;
    this.v.roundCt = this.v.history.rounds.length;
    this.v.maxRemoteness = this.v.history.remotenesses[0];

    this.v.canvas = document.getElementById(
      "history-canvas"
    ) as HTMLCanvasElement;
    this.v.ctx = this.v.canvas.getContext("2d") as CanvasRenderingContext2D;

    this.v.font = this.$store.state.appSetting.theme.font;
    this.v.color = this.$store.state.appSetting.theme.color;
    this.v.winColor = "green";
    this.v.tieColor = "yellow";
    this.v.loseColor = "red";

    this.v.tieLabel = "D";
    this.v.p1Name = this.$store.state.currentGame.turnNames[0];
    this.v.p2Name = this.$store.state.currentGame.turnNames[1];

    this.v.padding = 10;

    this.v.nameHt = 15;
    this.v.xLabelHt = 10;
    this.v.rowHt = 15;
    this.v.rowCt = this.v.roundCt;
    this.v.gridHt = this.v.rowCt * this.v.rowHt;
    this.v.canvasHt =
      (this.v.padding + this.v.xLabelHt) * 2 + this.v.nameHt + this.v.gridHt;

    this.v.canvasWd = this.v.canvas.width;
    this.v.yLabelWd = 10;
    this.v.gridWd = this.v.canvasWd - (this.v.padding + this.v.yLabelWd) * 2;
    this.v.colCt = this.v.maxRemoteness * 2 + 1;
    this.v.colWd = this.v.gridWd / this.v.colCt;

    this.v.gridTop = this.v.padding + this.v.nameHt + this.v.xLabelHt;
    this.v.gridBottom = this.v.gridTop + this.v.gridHt;
    this.v.gridLeft = this.v.padding + this.v.yLabelWd;
    this.v.gridRight = this.v.gridLeft + this.v.gridWd;

    this.v.gridMidX = this.v.gridLeft + this.v.gridWd / 2;

    this.v.pointXs = [];
    this.v.pointYs = [];
    this.v.pointRadius = 5;

    this.v.linkWd = 1;

    this.v.xBarWd = 1;
    this.v.xIntervalBarWd = 3;
    this.v.xInterval = 5;
  }

  private setHistory(): void {
    this.setCanvasHeight();
    this.setCanvas();
    this.setNames();
    this.setXLabels();
    this.setYLabels();
    this.setGrid();
    this.setPoints();
    this.setLinks();
  }

  private setCanvasHeight(): void {
    this.v.canvas.height = this.v.canvasHt;
  }

  private setCanvas(): void {
    this.v.ctx.fillRect(0, 0, this.v.canvasWd, this.v.canvasHt);
  }

  private setTextSetting(): void {
    this.v.ctx.textBaseline = "middle";
    this.v.ctx.textAlign = "center";
    this.v.ctx.font = this.v.font;
    this.v.ctx.fillStyle = this.v.color;
  }

  private setNames(): void {
    this.setTextSetting();
    this.v.ctx.fillText(
      this.v.p1Name,
      this.v.gridMidX - this.v.gridWd / 4,
      this.v.padding + this.v.nameHt / 2
    );
    this.v.ctx.fillText(
      this.v.p2Name,
      this.v.gridMidX + this.v.gridWd / 4,
      this.v.padding + this.v.nameHt / 2
    );
  }

  private setXLabels(): void {
    this.setTextSetting();
    this.v.ctx.fillText(
      this.v.tieLabel,
      this.v.gridMidX,
      this.v.gridTop - this.v.xLabelHt / 2
    );
    this.v.ctx.fillText(
      this.v.tieLabel,
      this.v.gridMidX,
      this.v.gridBottom + this.v.xLabelHt / 2
    );
    for (let i = 0; i < this.v.maxRemoteness; i += this.v.xInterval) {
      this.v.ctx.fillText(
        i.toString(),
        this.v.gridLeft + (i + 0.5) * this.v.colWd,
        this.v.gridTop - this.v.xLabelHt / 2
      );
      this.v.ctx.fillText(
        i.toString(),
        this.v.gridRight - (i + 0.5) * this.v.colWd,
        this.v.gridTop - this.v.xLabelHt / 2
      );
      this.v.ctx.fillText(
        i.toString(),
        this.v.gridLeft + (i + 0.5) * this.v.colWd,
        this.v.gridBottom + this.v.xLabelHt / 2
      );
      this.v.ctx.fillText(
        i.toString(),
        this.v.gridRight - (i + 0.5) * this.v.colWd,
        this.v.gridBottom + this.v.xLabelHt / 2
      );
    }
  }

  private setYLabels(): void {
    this.setTextSetting();
    for (let i = 0; i < this.v.rowCt; i++) {
      this.v.ctx.fillText(
        i.toString(),
        this.v.gridLeft - this.v.yLabelWd / 2,
        this.v.gridTop + (i + 0.5) * this.v.rowHt
      );
      this.v.ctx.fillText(
        i.toString(),
        this.v.gridRight + this.v.yLabelWd / 2,
        this.v.gridTop + (i + 0.5) * this.v.rowHt
      );
    }
  }

  private setGrid(): void {
    this.v.ctx.strokeStyle = this.v.color;
    for (let i = 0; i <= this.v.maxRemoteness; i++) {
      if (i % this.v.xInterval == 0 || i == this.v.maxRemoteness) {
        this.v.ctx.lineWidth = this.v.xIntervalBarWd;
      } else {
        this.v.ctx.lineWidth = this.v.xBarWd;
      }

      this.v.ctx.beginPath();
      this.v.ctx.moveTo(
        this.v.gridLeft + (i + 0.5) * this.v.colWd,
        this.v.gridTop
      );
      this.v.ctx.lineTo(
        this.v.gridLeft + (i + 0.5) * this.v.colWd,
        this.v.gridBottom
      );
      this.v.ctx.stroke();

      this.v.ctx.beginPath();
      this.v.ctx.moveTo(
        this.v.gridRight - (i + 0.5) * this.v.colWd,
        this.v.gridTop
      );
      this.v.ctx.lineTo(
        this.v.gridRight - (i + 0.5) * this.v.colWd,
        this.v.gridBottom
      );
      this.v.ctx.stroke();
    }
  }

  private setPoints(): void {
    let x = this.v.gridMidX;
    let y = this.v.gridTop + this.v.rowHt / 2;
    this.v.pointXs.push(x);
    this.v.pointYs.push(y);
    this.v.ctx.fillStyle = this.v.tieColor;
    this.v.ctx.beginPath();
    this.v.ctx.arc(x, y, this.v.pointRadius, 0, 2 * Math.PI);
    this.v.ctx.closePath();
    this.v.ctx.fill();

    for (let i = 1; i <= this.v.roundCt; i++) {
      if (this.v.history.turns[i] == 0) {
        x =
          this.v.gridLeft +
          (this.v.history.remotenesses[i] + 0.5) * this.v.colWd;
      } else {
        x =
          this.v.gridRight -
          (this.v.history.remotenesses[i] + 0.5) * this.v.colWd;
      }
      y = this.v.gridTop + (i + 0.5) * this.v.rowHt;
      this.v.pointXs.push(x);
      this.v.pointYs.push(y);
      if (this.v.history.valueCodes[i] == 1) {
        this.v.ctx.fillStyle = this.v.winColor;
      } else if (this.v.history.valueCodes[i] == 3) {
        this.v.ctx.fillStyle = this.v.loseColor;
      } else {
        this.v.ctx.fillStyle = this.v.tieColor;
      }
      this.v.ctx.beginPath();
      this.v.ctx.arc(x, y, this.v.pointRadius, 0, 2 * Math.PI);
      this.v.ctx.closePath();
      this.v.ctx.fill();
    }
  }

  private setLinks(): void {
    this.v.ctx.strokeStyle = this.v.tieColor;
    this.v.ctx.lineWidth = this.v.linkWd;
    for (let i = 0; i < this.v.roundCt; i++) {
      this.v.ctx.beginPath();
      this.v.ctx.moveTo(this.v.pointXs[i], this.v.pointYs[i]);
      this.v.ctx.lineTo(this.v.pointXs[i + 1], this.v.pointYs[i + 1]);
      this.v.ctx.stroke();
    }
  }
}
</script>

<style scoped lang="scss"></style>
