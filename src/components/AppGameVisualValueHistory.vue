<template>
    <div id="app-game-vvh">
        <h3 id="app-game-vvh-title">Visual Value History</h3>
        <div id="app-game-vvh-colorGuide">
            <span id="app-game-vvh-colorGuide-win" class="c-win">win</span>
            <span id="app-game-vvh-colorGuide-draw" class="c-draw">draw</span>
            <span id="app-game-vvh-colorGuide-tie" class="c-tie">tie</span>
            <span id="app-game-vvh-colorGuide-lose" class="c-lose">lose</span>
        </div>
        <div id="app-game-vvh-canvas-container">
            <canvas id="app-game-vvh-canvas"></canvas>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { computed, onMounted, watch } from "vue";
    import { useStore } from "../plugins/store";

    const store = useStore();
    const game = computed(() => {
        return store.state.app.game;
    });

    const drawVvh = () => {
        if (!game.value.round.id) return;
        type PointCoordinates = Record<number, { x: number | [number, number]; y: number }>;

        const history = game.value.history;
        const currentRoundNumber = store.state.app.game.round.id;
        const maximumRemoteness = Math.max(...store.state.app.game.history.filter((round) => round.id <= currentRoundNumber).map((round) => round.remoteness));

        const showHint = store.state.app.game.options.showNextMoveHints;

        const canvas = document.getElementById("app-game-vvh-canvas") as HTMLCanvasElement;
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

        const font = getComputedStyle(document.body).getPropertyValue("--font");
        const primaryColor = getComputedStyle(document.body).getPropertyValue("--primaryColor");
        const winColor = getComputedStyle(document.body).getPropertyValue("--winColor");
        const drawColor = getComputedStyle(document.body).getPropertyValue("--drawColor");
        const tieColor = getComputedStyle(document.body).getPropertyValue("--tieColor");
        const loseColor = getComputedStyle(document.body).getPropertyValue("--loseColor");
        const turn1Color = getComputedStyle(document.body).getPropertyValue("--turn0Color");
        const turn2Color = getComputedStyle(document.body).getPropertyValue("--turn1Color");

        const turn1Name = store.state.app.game.players[0].name;
        const turn2Name = store.state.app.game.type === "puzzles" ? "" : store.state.app.game.players[1].name;

        const xLabel = "Remoteness";
        const yLeftLabel = "Moves";
        const yRightLabel = "Moves";

        const padding = 10;
        const turnNameHeight = 20;
        const xLabelHeight = 20;
        const xCoordinateHeight = 20;
        const rowHeight = 20;

        const rowCount = currentRoundNumber;
        const gridHeight = rowHeight * rowCount;
        const canvasHeight = turnNameHeight + 2 * (padding + xCoordinateHeight + xLabelHeight) + gridHeight;

        const yLabelWidth = 20;
        const yCoordinateWidth = 40;
        const columnWidth = 10;

        const columnCount = 2 * maximumRemoteness + 3;
        const gridWidth = columnWidth * columnCount;
        const canvasWidth = 2 * (padding + yCoordinateWidth + yLabelWidth) + gridWidth;

        const gridTop = padding + turnNameHeight + xLabelHeight + xCoordinateHeight;
        const gridBottom = gridTop + gridHeight;
        const gridLeft = padding + yLabelWidth + yCoordinateWidth;
        const gridMiddleX = gridLeft + gridWidth / 2;
        const gridRight = gridLeft + gridWidth;

        const pointRadius = 5;
        const linkWidth = 1;
        const xBarWidth = 1;
        const xIntervalBarWidth = 2;
        const xInterval = 5;

        const pointCoordinates: PointCoordinates = {};

        const setCanvasShape = () => {
            canvas.height = canvasHeight;
            canvas.width = canvasWidth;
        };

        const setCanvasResolution = () => {
            canvas.style.width = canvas.width + "px";
            canvas.style.height = canvas.height + "px";
            const devicePixelRatio = window.devicePixelRatio || 1;
            canvas.width *= devicePixelRatio;
            canvas.height *= devicePixelRatio;
            ctx.scale(devicePixelRatio, devicePixelRatio);
        };

        const setVvhFrame = () => {
            ctx.strokeStyle = primaryColor;
            ctx.rect(0, 0, canvasWidth, canvasHeight);
            ctx.stroke();
        };

        const setText = (text: string, x: number, y: number, color: string, rotationRadian?: number): void => {
            ctx.save();
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";
            ctx.fillStyle = color;
            ctx.font = font;
            if (rotationRadian) {
                ctx.translate(x, y);
                ctx.rotate(rotationRadian);
                ctx.translate(-x, -y);
            }
            ctx.fillText(text, x, y);
            ctx.restore();
        };
        const setTurnNames = () => {
            if (game.value.type === "puzzles") {
                setText(turn1Name, gridMiddleX, padding + turnNameHeight / 2, turn1Color);
            } else {
                setText(turn1Name, gridMiddleX - gridWidth / 3, padding + turnNameHeight / 2, turn1Color);
                setText(turn2Name, gridMiddleX + gridWidth / 3, padding + turnNameHeight / 2, turn2Color);
            }
        };

        const remotenessToX = (remoteness: number, id: number): number => {
            if (game.value.type === "puzzles") {
                return gridRight + 4 - (remoteness + 0.5) * 2 * columnWidth;
            }
            if (id === 1) {
                return gridLeft + (remoteness + 0.5) * columnWidth;
            }
            return gridRight - (remoteness + 0.5) * columnWidth;
        };
        const roundToY = (round: number): number => {
            return gridTop + (round - 0.5) * rowHeight;
        };
        const setXLabel = () => {
            setText(xLabel, canvasWidth / 2, gridTop - xCoordinateHeight - xLabelHeight / 2, primaryColor);

            setText(xLabel, canvasWidth / 2, gridBottom + xCoordinateHeight + xLabelHeight / 2, primaryColor);
        };
        const setXCoordinates = () => {
            if (game.value.type === "puzzles") {
                setText("L", gridLeft, gridTop - xCoordinateHeight / 2, primaryColor);
                setText("L", gridLeft, gridBottom + xCoordinateHeight / 2, primaryColor);
            } else {
                setText("D", gridMiddleX, gridTop - xCoordinateHeight / 2, primaryColor);
                setText("D", gridMiddleX, gridBottom + xCoordinateHeight / 2, primaryColor);
            }
            for (let remoteness: number = 0; remoteness <= maximumRemoteness; remoteness += xInterval) {
                setText(remoteness.toString(), remotenessToX(remoteness, 1), gridTop - xCoordinateHeight / 2, primaryColor);
                setText(remoteness.toString(), remotenessToX(remoteness, 2), gridTop - xCoordinateHeight / 2, primaryColor);
                if (game.value.type !== "puzzles") {
                    setText(remoteness.toString(), remotenessToX(remoteness, 1), gridBottom + xCoordinateHeight / 2, primaryColor);
                    setText(remoteness.toString(), remotenessToX(remoteness, 2), gridBottom + xCoordinateHeight / 2, primaryColor);
                }
            }
        };
        const setYLabel = () => {
            setText(yLeftLabel, gridLeft - yCoordinateWidth - yLabelWidth / 2, gridTop + gridHeight / 2, primaryColor, -(Math.PI / 2));

            setText(yRightLabel, gridRight + yCoordinateWidth + yLabelWidth / 2, gridTop + gridHeight / 2, primaryColor, Math.PI / 2);
        };
        const setYCoordinates = () => {
            for (let round: number = 1; round <= currentRoundNumber; round++) {
                if (history.filter((roundData) => roundData.id === round)[0].player.id === 1) {
                    setText(history.filter((roundData) => roundData.id === round)[0].move, gridLeft - yCoordinateWidth / 2, roundToY(round), primaryColor);
                } else {
                    setText(history.filter((roundData) => roundData.id === round)[0].move, gridRight + yCoordinateWidth / 2, roundToY(round), primaryColor);
                }
            }
            if (history.filter((roundData) => roundData.id === currentRoundNumber)[0].remoteness === 0) {
                if (history.filter((roundData) => roundData.id === currentRoundNumber)[0].player.id === 1) {
                    setText("😢", gridLeft - yCoordinateWidth / 2, roundToY(currentRoundNumber), primaryColor);
                    setText("🥳", gridRight + yCoordinateWidth / 2, roundToY(currentRoundNumber), primaryColor);
                } else {
                    setText("🥳", gridLeft - yCoordinateWidth / 2, roundToY(currentRoundNumber), primaryColor);
                    setText("😢", gridRight + yCoordinateWidth / 2, roundToY(currentRoundNumber), primaryColor);
                }
            }
        };
        const setRoundTurnColorGuide = () => {
            ctx.lineWidth = 0;
            ctx.globalAlpha = 0.2;
            for (let round: number = 1; round <= currentRoundNumber; round++) {
                if (history.filter((roundData) => roundData.id === round)[0].player.id === 1) {
                    ctx.fillStyle = turn1Color;
                } else {
                    ctx.fillStyle = turn2Color;
                }
                ctx.fillRect(gridLeft + columnWidth / 2, gridTop + (round - 1) * rowHeight, gridWidth - columnWidth, rowHeight);
            }
            ctx.globalAlpha = 1;
        };
        const setGrid = () => {
            ctx.strokeStyle = primaryColor;
            for (let remoteness: number = 0; remoteness <= maximumRemoteness + 1; remoteness++) {
                if (remoteness % xInterval === 0 || remoteness === maximumRemoteness + 1) {
                    ctx.lineWidth = xIntervalBarWidth;
                } else {
                    ctx.lineWidth = xBarWidth;
                }

                ctx.beginPath();
                ctx.moveTo(remotenessToX(remoteness, 1), gridTop);
                ctx.lineTo(remotenessToX(remoteness, 1), gridBottom);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(remotenessToX(remoteness, 2), gridTop);
                ctx.lineTo(remotenessToX(remoteness, 2), gridBottom);
                ctx.stroke();
            }
        };
        const getPointCoordinates = () => {
            let roundData;
            let x: number | [number, number];
            let y: number;
            for (let round = 1; round <= currentRoundNumber; round++) {
                roundData = history.filter((roundData) => roundData.id == round)[0];
                if (game.value.type === "puzzles") {
                    x = roundData.positionValue === "lose" ? gridLeft : remotenessToX(roundData.remoteness, roundData.player.id);
                } else {
                    if (roundData.positionValue === "draw") {
                        x = gridMiddleX;
                    } else if (roundData.positionValue === "tie") {
                        x = [remotenessToX(roundData.remoteness, 1), remotenessToX(roundData.remoteness, 2)];
                    } else if (roundData.positionValue === "lose") {
                        x = remotenessToX(roundData.remoteness, roundData.player.id === 1 ? 2 : 1);
                    } else {
                        x = remotenessToX(roundData.remoteness, roundData.player.id);
                    }
                }
                y = roundToY(round);
                pointCoordinates[round] = { x: x, y: y };
            }
        };
        const valueToColor = (value: string): any => {
            if (value === "win") {
                return winColor;
            } else if (value === "draw") {
                return drawColor;
            } else if (value === "tie") {
                return tieColor;
            } else {
                return loseColor;
            }
        };
        const setLink = (x1: number, y1: number, x2: number, y2: number, color: string): void => {
            ctx.lineWidth = linkWidth;
            ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        };
        const setPoint = (x: number, y: number, color: string): void => {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, pointRadius, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();
        };
        const setLinks = (): void => {
            let x1, y1, x2, y2, color;
            for (let round = 1; round < currentRoundNumber; round++) {
                x1 = pointCoordinates[round].x;
                y1 = pointCoordinates[round].y;
                x2 = pointCoordinates[round + 1].x;
                y2 = pointCoordinates[round + 1].y;
                color = valueToColor(history.filter((roundData) => roundData.id == round)[0].moveValue);
                if (typeof x1 === "number" && typeof x2 === "number") {
                    setLink(x1, y1, x2, y2, color);
                } else if (typeof x1 === "number" && typeof x2 != "number") {
                    setLink(x1, y1, x2[0], y2, color);
                    setLink(x1, y1, x2[1], y2, color);
                } else if (typeof x1 != "number" && typeof x2 === "number") {
                    setLink(x1[0], y1, x2, y2, color);
                    setLink(x1[1], y1, x2, y2, color);
                } else if (typeof x1 != "number" && typeof x2 != "number") {
                    setLink(x1[0], y1, x2[0], y2, color);
                    setLink(x1[1], y1, x2[1], y2, color);
                }
            }
        };
        const setPoints = (): void => {
            let x, y, color;
            for (let round = 1; round <= currentRoundNumber; round++) {
                x = pointCoordinates[round].x;
                y = pointCoordinates[round].y;
                color = valueToColor(history.filter((roundData) => roundData.id == round)[0].positionValue);
                if (typeof x === "number") {
                    setPoint(x, y, color);
                } else {
                    setLink(x[0], y, x[1], y, color);
                    setPoint(x[0], y, color);
                    setPoint(x[1], y, color);
                }
            }
        };
        const setGraph = () => {
            setLinks();
            setPoints();
        };
        setCanvasShape();
        setCanvasResolution();
        setVvhFrame();
        setTurnNames();
        setXLabel();
        setXCoordinates();
        setYLabel();
        setYCoordinates();
        setRoundTurnColorGuide();
        setGrid();
        getPointCoordinates();
        setGraph();
    };
    onMounted(() => drawVvh());
    watch(
        () => [store.state.app.preferences.theme, store.state.app.game.round.id],
        () => drawVvh()
    );
</script>

<style scoped lang="scss">
    #app-game-vvh {
        border: 0.04em solid var(--neutralColor);
        border-radius: 0.25em;
        margin: 0;
        padding: 0.25em;
    }
    #app-game-vvh-colorGuide {
        margin: 0.25em;
        padding: 0.25em;
        > * {
            border-radius: 100%;
            margin: 0 0.5em;
            padding: 0 1.5em;
        }
    }
    #app-game-vvh-canvas {
        margin: 0.25em;
        padding: 0.25em;
    }
    @media only screen and (max-width: 53.625em) {
        #app-game-vvh {
            width: 25em;
            margin-left: auto;
            margin-right: auto;
            min-width: 0;
        }
        #app-game-vvh-canvas-container {
            margin: 0.25em;
            padding: 0.25em;
            margin-left: auto;
            margin-right: auto;
            overflow-x: scroll;
        }
    }
</style>
