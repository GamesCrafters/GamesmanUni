<template>
    <component v-if="customGameBoardExists" :is="regular2DGameBoards[gameBoard]" />
    <svg v-else="customGameBoardExists" xmlns="http://www.w3.org/2000/svg" :viewBox="'-2 -2 ' + (richPositionData.columns * 20 + 4) + ' ' + (richPositionData.rows * 20 + 4)" :data-turn="richPositionData.turn">
        <defs>
            <template v-for="(value, i) in ['', 'win', 'draw', 'tie', 'lose']" :key="i">
                <marker :id="'app-game-board-default-arrow-marker' + (value ? '-' + value : '')" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                    <path d="M 0 1 L 10 5 L 0 9 z" />
                </marker>
            </template>
        </defs>
        <g v-for="(cell, i) in richPositionData.board" :key="'cell' + i" :set="(coords = calcRegular2DBoardTopLeftCoords(i))" @click="cell.move && store.dispatch(actionTypes.runMove, cell.move.str)">
            <rect :class="'app-game-board-default-cell ' + (cell.move ? 'move ' : '') + (cell.token != '-' && !cell.move ? 'placed ' : '')" :x="coords[0] * 20" :y="coords[1] * 20" width="20" height="20" />
            <text v-if="cell.token != '-' && cell.token != '*'" :x="coords[0] * 20 + 10" :y="coords[1] * 20 + 10" :class="'app-game-board-default-token ' + (cell.move ? 'move ' : '') + getBoardMoveElementHintClass(cell.move)" :style="{ opacity: store.state.app.game.options.showNextMoveHints && store.state.app.game.options.showNextMoveDeltaRemotenesses && cell.move ? cell.move.hintOpacity : 1 }">
                {{ cell.token }}
            </text>
        </g>
        <g v-for="(arrow, i) in richPositionData.arrows" :key="'arrow' + i">
            <polyline
                :points="formatArrowPolylinePoints(arrow, 20)"
                :class="'app-game-board-default-arrow ' + getBoardMoveElementHintClass(arrow.move)"
                @click="store.dispatch(actionTypes.runMove, arrow.move.str)"
                :style="{
                    opacity: store.state.app.game.options.showNextMoveHints && store.state.app.game.options.showNextMoveDeltaRemotenesses ? arrow.move.hintOpacity : 1,
                }"
                :marker-end="getHintArrowMarker(arrow.move)"
            />
        </g>
    </svg>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { actionTypes, useStore } from "../plugins/store";
    import AppGameBoardRegular2DTttRegular from "./AppGameBoardRegular2DTttRegular.vue";

    enum UWAPITurn {
        A = "A",
        B = "B",
    }
    interface GDefaultRegular2DMove {
        str: string; // UWAPI move string
        hint: string;
        hintOpacity: number;
    }
    interface GDefaultRegular2DBoardCell {
        token: string;
        move?: GDefaultRegular2DMove;
    }
    interface GDefaultRegular2DBoardArrow {
        from: number;
        to: number;
        move: GDefaultRegular2DMove;
    }
    type GDefaultPosition = {
        turn: UWAPITurn;
        rows: number;
        columns: number;
        board: GDefaultRegular2DBoardCell[];
        arrows: GDefaultRegular2DBoardArrow[];
    };

    const store = useStore();

    console.log("Checking if custom game board exists for this regular 2D board game...");
    const regular2DGameBoards: Record<string, any> = {
        // "ttt-regular": AppGameBoardRegular2DTttRegular,
    };
    const gameBoard: string = `${store.state.app.game.id}-${store.state.app.game.variant.id}`;
    const customGameBoardExists: boolean = gameBoard in regular2DGameBoards;
    const richPositionData = computed(() => {
        const position: string = store.state.app.game.round.position;
        const matches = position.match(/^R_(A|B)_([0-9]+)_([0-9]+)_([a-zA-Z0-9-\*]+)(?:_(.*))?$/)!;
        const turn = matches[1] == "A" ? UWAPITurn.A : UWAPITurn.B;
        const numRows = parseInt(matches[2]);
        const numColumns = parseInt(matches[3]);
        const board: GDefaultRegular2DBoardCell[] = matches[4]
            .replaceAll("x", "\u00D7")
            .replaceAll("o", "\u25CB")
            .replaceAll("B", "\u25cf")
            .replaceAll("W", "\u25CB")
            .split("")
            .map((token) => ({ token }));
        let arrows: GDefaultRegular2DBoardArrow[] = [];
        store.state.app.game.round.availableMoves.forEach((nextMoveData) => {
            const move = {
                str: nextMoveData.move,
                hint: nextMoveData.moveValue,
                hintOpacity: nextMoveData.moveValueOpacity,
            };
            let matches;
            if ((matches = nextMoveData.move.match(/^A_([a-zA-Z0-9-\*])_([0-9]+)$/))) {
                // Add a piece to the board
                const to = parseInt(matches[2]);
                board[to].token = matches[1].replaceAll("x", "\u00D7").replaceAll("o", "\u25CB").replaceAll("B", "\u25cf").replaceAll("W", "\u25CB");
                board[to].move = move;
            } else if ((matches = nextMoveData.move.match(/^M_([0-9]+)_([0-9]+)$/))) {
                // Move a piece
                arrows.push({
                    from: parseInt(matches[1]),
                    to: parseInt(matches[2]),
                    move,
                });
            } else if ((matches = nextMoveData.move.match(/^S_([LR])_([0-9]+)_([0-9]+)$/))) {
                // Shift the board
                const dir = matches[1];
                const row = parseInt(matches[2]);
                const amt = parseInt(matches[3]); // Not visualizing this at the moment
                arrows.push({
                    from: dir == "R" ? numColumns * row : numColumns * (row + 1) - 1,
                    to: dir == "R" ? numColumns * row + 1 : numColumns * (row + 1) - 2,
                    move,
                });
            } else {
                console.error("NOTREACHED");
            }
        });
        const calcRegular2DBoardTopLeftCoords = (i: number): [number, number] => {
            return [i % numColumns, Math.floor(i / numColumns)];
        };
        const computeSquaredLength = (ax: number, ay: number, bx: number, by: number): number => {
            return Math.pow(ax - bx, 2) + Math.pow(ay - by, 2);
        };
        const compareArrowSquaredLength = (a: GDefaultRegular2DBoardArrow, b: GDefaultRegular2DBoardArrow): number => {
            const aFromCoords = calcRegular2DBoardTopLeftCoords(a.from);
            const aToCoords = calcRegular2DBoardTopLeftCoords(a.to);
            const bFromCoords = calcRegular2DBoardTopLeftCoords(b.from);
            const bToCoords = calcRegular2DBoardTopLeftCoords(b.to);
            return computeSquaredLength(bFromCoords[0], bFromCoords[1], bToCoords[0], bToCoords[1]) - computeSquaredLength(aFromCoords[0], aFromCoords[1], aToCoords[0], aToCoords[1]);
        };
        arrows = arrows.sort(compareArrowSquaredLength);
        return {
            turn: turn,
            rows: numRows,
            columns: numColumns,
            board,
            arrows,
        };
    });
    const calcRegular2DBoardTopLeftCoords = (i: number): [number, number] => {
        return [i % richPositionData.value.columns, Math.floor(i / richPositionData.value.columns)];
    };
    const formatArrowPolylinePoints = (arrow: GDefaultRegular2DBoardArrow, multiplier: number, startOffset: number = 7, endOffset: number = 3): string => {
        let fromCoords = calcRegular2DBoardTopLeftCoords(arrow.from).map((a: number) => (a + 0.5) * multiplier);
        let toCoords = calcRegular2DBoardTopLeftCoords(arrow.to).map((a: number) => (a + 0.5) * multiplier);
        const dir = [toCoords[0] - fromCoords[0], toCoords[1] - fromCoords[1]];
        const length = Math.sqrt(Math.pow(dir[0], 2) + Math.pow(dir[1], 2));
        const startOffsetPct = startOffset / length;
        const endOffsetPct = endOffset / length;
        fromCoords[0] += dir[0] * startOffsetPct;
        fromCoords[1] += dir[1] * startOffsetPct;
        toCoords[0] -= dir[0] * endOffsetPct;
        toCoords[1] -= dir[1] * endOffsetPct;
        return `${fromCoords[0]},${fromCoords[1]} ` + `${toCoords[0]},${toCoords[1]}`;
    };
    const getBoardMoveElementHintClass = (move?: GDefaultRegular2DMove): string => (move && store.state.app.game.options.showNextMoveHints ? "hint-" + move.hint : "");

    const getHintArrowMarker = (move?: GDefaultRegular2DMove): string => {
        if (!move) return "";
        if (store.state.app.game.options.showNextMoveHints) {
            return `url(#app-game-board-default-arrow-marker-${move.hint})`;
        }
        return "url(#app-game-board-default-arrow-marker)";
    };
    const getMoveButtonHintClass = (moveValue: string): string => (store.state.app.game.options.showNextMoveHints ? "c-" + moveValue : "");
</script>

<style lang="scss" scoped>
    #app-game-board-default-position-value {
        border: 0.04em solid var(--neutralColor);
        border-radius: 0.25em;
        display: inline-block;
        padding: 0.5em;
    }
    #app-game-board-default-moves-buttons {
        padding: 0.5em 20%;
    }
    .app-game-board-default-cell {
        stroke: var(--neutralColor);
        stroke-width: 1;
        fill: var(--backgroundColor);
        // Highlight cells placed with a token
        &.placed {
            fill: var(--neutralColor);
        }
        // Highlight move cells on hover
        g:hover > &.move {
            fill: var(--neutralColor);
        }
    }
    .app-game-board-default-token {
        alignment-baseline: middle;
        text-anchor: middle;
        cursor: default;
        [data-turn="A"] &.move {
            fill: var(--turn0Color);
        }
        [data-turn="B"] &.move {
            fill: var(--turn1Color);
        }
        &.move.hint- {
            &win {
                fill: var(--winColor);
            }
            &draw {
                fill: var(--drawColor);
            }
            &tie {
                fill: var(--tieColor);
            }
            &lose {
                fill: var(--loseColor);
            }
        }
    }
    #app-game-board-default-arrow-marker {
        fill: var(--primaryColor);
        [data-turn="A"] & {
            fill: var(--turn0Color);
        }
        [data-turn="B"] & {
            fill: var(--turn1Color);
        }
        &-win {
            fill: var(--winColor);
        }
        &-draw {
            fill: var(--drawColor);
        }
        &-tie {
            fill: var(--tieColor);
        }
        &-lose {
            fill: var(--loseColor);
        }
    }
    @keyframes pulsing-arrow {
        0% {
            stroke-width: 1;
        }
        100% {
            stroke-width: 1.5;
        }
    }
    .app-game-board-default-arrow {
        stroke: var(--primaryColor);
        [data-turn="A"] & {
            stroke: var(--turn0Color);
        }
        [data-turn="B"] & {
            stroke: var(--turn1Color);
        }
        &.hint- {
            &win {
                stroke: var(--winColor);
            }
            &draw {
                stroke: var(--drawColor);
            }
            &tie {
                stroke: var(--tieColor);
            }
            &lose {
                stroke: var(--loseColor);
            }
        }
        &:hover {
            animation-name: pulsing-arrow;
            animation-duration: 0.3s;
            animation-iteration-count: infinite;
            animation-timing-function: ease-in-out;
            animation-direction: alternate;
        }
    }
    svg {
        height: 15em;
        width: 15em;
        margin: auto;
        vertical-align: middle;
    }
</style>
