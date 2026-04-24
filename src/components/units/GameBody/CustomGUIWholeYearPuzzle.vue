<template>
  <svg id="image-autogui" viewBox="0 0 750 1050" xmlns="http://www.w3.org/2000/svg">
    <!-- Board background -->
    <rect width="750" height="1050" fill="#2c1810" rx="12"/>

    <!-- Board cells (43 valid cells) -->
    <g v-for="(cell, i) in boardCells" :key="'cell' + i">
      <rect
        :x="cell.x" :y="cell.y" width="88" height="88" rx="8"
        :fill="cellFill(i)" :fill-opacity="cellFillOpacity(i)"
        stroke="#5a4a3a" stroke-width="1.5"/>
      <text
        :x="cell.x + 44" :y="cell.y + 48"
        text-anchor="middle" dominant-baseline="central"
        :font-size="cell.label.length > 2 ? 18 : 22"
        :fill="cellTextFill(i)"
        font-family="Arial, sans-serif" font-weight="bold"
        pointer-events="none">
        {{ cell.label }}
      </text>
    </g>

    <!-- Piece selector area background -->
    <rect x="10" y="710" width="730" height="330" rx="10" fill="#1a0e08" opacity="0.6"
      pointer-events="none"/>
    <text x="375" y="740" text-anchor="middle" fill="#d4a574" font-size="20" font-family="Arial" font-weight="bold"
      pointer-events="none">
      {{ statusText }}
    </text>

    <!-- Piece inventory row -->
    <g v-for="pi in 9" :key="'inv' + pi"
      :class="{ 'wyp-clickable': !usedPieces.has(pi-1) && step === 'selectPiece' }"
      @click="onPieceClick(pi-1)">
      <rect
        :x="15 + (pi-1) * 82" y="755" width="75" height="55" rx="6"
        :fill="usedPieces.has(pi-1) ? '#1a1a1a' : (selectedPiece === pi-1 ? '#5a4520' : '#2a1a0a')"
        :stroke="selectedPiece === pi-1 ? '#f1c40f' : (!usedPieces.has(pi-1) ? '#f39c12' : '#555')"
        :stroke-width="selectedPiece === pi-1 ? 3 : (!usedPieces.has(pi-1) ? 2 : 1)"
        :opacity="usedPieces.has(pi-1) ? 0.4 : 1"/>
      <g v-for="(cell, ci) in PIECES[pi-1]" :key="'inv' + pi + '_' + ci">
        <rect
          :x="20 + (pi-1) * 82 + cell[1] * 12"
          :y="762 + cell[0] * 12"
          width="10" height="10" rx="1"
          :fill="usedPieces.has(pi-1) ? '#444' : pieceColors[pi-1]"
          :opacity="usedPieces.has(pi-1) ? 0.3 : 1"
          pointer-events="none"/>
      </g>
      <text
        :x="15 + (pi-1) * 82 + 37" y="802"
        text-anchor="middle" :fill="usedPieces.has(pi-1) ? '#555' : '#d4a574'" font-size="11" font-family="Arial"
        pointer-events="none">
        {{ String.fromCharCode(64 + pi) }}
      </text>
      <line v-if="usedPieces.has(pi-1)"
        :x1="15 + (pi-1)*82" :y1="782"
        :x2="90 + (pi-1)*82" :y2="782"
        stroke="#888" stroke-width="2" pointer-events="none"/>
      <rect v-if="!usedPieces.has(pi-1) && step === 'selectPiece'"
        :x="15 + (pi-1) * 82" y="755" width="75" height="55" rx="6"
        fill="transparent" style="cursor:pointer"/>
      <!-- Value hint dot for piece selection -->
      <circle v-if="step === 'selectPiece' && !usedPieces.has(pi-1) && pieceValueHint(pi-1)"
        :cx="15 + (pi-1) * 82 + 67" :cy="762" r="5"
        :fill="pieceValueHint(pi-1) === 'win' ? '#2ecc71' : '#e74c3c'"
        pointer-events="none"/>
    </g>

    <!-- Step 2: Show orientations for selected piece -->
    <g v-if="step === 'selectOrientation' && selectedPiece !== null">
      <g v-for="(oriMove, oi) in orientationMoves" :key="'ori' + oi"
        class="wyp-clickable"
        @click.stop="dispatchMove(oriMove.autoguiMove)">
        <rect
          :x="oriSlotX(oi)" y="820"
          :width="orientLayout.slotRectW" :height="orientLayout.slotRectH" rx="10"
          :fill="'#3a2a1a'" :stroke="oriMove.moveValue === 'win' ? '#2ecc71' : '#8b7355'" stroke-width="2"/>
        <g v-for="(cell, ci) in oriShape(oriMove)" :key="'os' + oi + '_' + ci">
          <rect
            :x="oriSlotX(oi) + orientLayout.padH + cell[1] * orientLayout.cellSize"
            :y="820 + orientLayout.padV + cell[0] * orientLayout.cellSize"
            :width="orientLayout.rectSize" :height="orientLayout.rectSize" rx="3"
            :fill="pieceColors[selectedPiece!]"
            pointer-events="none"/>
        </g>
        <circle
          :cx="oriSlotX(oi) + orientLayout.padH + oriAnchor(oriShape(oriMove)).cx * orientLayout.cellSize"
          :cy="820 + orientLayout.padV + oriAnchor(oriShape(oriMove)).cy * orientLayout.cellSize"
          :r="orientLayout.dotR" fill="#fff" opacity="0.9" pointer-events="none"/>
        <rect
          :x="oriSlotX(oi)" y="820"
          :width="orientLayout.slotRectW" :height="orientLayout.slotRectH" rx="10"
          fill="transparent" style="cursor:pointer"/>
      </g>
      <text x="720" y="940" text-anchor="end" fill="#aaa" font-size="16"
        class="wyp-clickable" @click="doUndo()">← Back</text>
    </g>

    <!-- Step 3: Anchor dots for placement -->
    <g v-if="step === 'selectPosition' && selectedPiece !== null && selectedOrientation !== null">
      <g v-for="(placement, pi) in anchorPlacements" :key="'place' + pi">
        <circle
          :cx="placementAnchorXY(placement).cx"
          :cy="placementAnchorXY(placement).cy"
          r="9" :fill="pieceColors[selectedPiece!]"
          :stroke="placement.moveValue === 'win' ? '#2ecc71' : '#fff'" stroke-width="2"
          class="wyp-clickable" style="cursor:pointer"
          @mouseenter="hoveredPlacementIdx = pi"
          @mouseleave="hoveredPlacementIdx = null"
          @click.stop="dispatchMove(placement.autoguiMove)"/>
      </g>
      <text x="720" y="1020" text-anchor="end" fill="#aaa" font-size="18"
        class="wyp-clickable" @click="doUndo()">← Back</text>
      <!-- Show selected orientation preview -->
      <g v-if="selectedOrientation !== null && ALL_ORI[selectedPiece!] && ALL_ORI[selectedPiece!][selectedOrientation]">
        <g v-for="(cell, ci) in ALL_ORI[selectedPiece!][selectedOrientation]" :key="'sel' + ci">
          <rect
            :x="320 + cell[1] * 28"
            :y="840 + cell[0] * 28"
            width="26" height="26" rx="3"
            :fill="pieceColors[selectedPiece!]"
            pointer-events="none"/>
        </g>
        <circle
          :cx="320 + oriAnchor(ALL_ORI[selectedPiece!][selectedOrientation]).cx * 28"
          :cy="840 + oriAnchor(ALL_ORI[selectedPiece!][selectedOrientation]).cy * 28"
          r="4" fill="#fff" opacity="0.9" pointer-events="none"/>
      </g>
    </g>
  </svg>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { actionTypes, useStore } from "../../../scripts/plugins/store";

const store = useStore();
const currentPosition = computed(() => store.getters.currentAutoguiPosition);
const readablePosition = computed(() => store.getters.currentPosition);
const availableMoves = computed(() => store.getters.currentAvailableMoves);

const PIECES: number[][][] = [
  [[0,0],[0,1],[1,1],[2,0],[2,1]],
  [[0,0],[0,1],[1,0],[1,1]],
  [[0,1],[1,0],[1,1],[1,2],[2,1]],
  [[0,0],[1,0],[1,1],[2,1]],
  [[0,0],[1,0],[1,1],[2,0]],
  [[0,0],[0,1],[1,0],[2,0]],
  [[0,0],[0,1],[0,2],[1,1],[1,2]],
  [[0,0],[0,1],[0,2],[0,3],[1,3]],
  [[0,0],[0,1],[1,1],[2,1],[2,2]],
];
const PIECE_SYMS = 'ABCDEFGHI';

const pieceColors = [
  '#e74c3c','#3498db','#2ecc71','#f39c12','#9b59b6',
  '#1abc9c','#e67e22','#2980b9','#c0392b'
];

function rotateCW(cells: number[][]): number[][] {
  const rot = cells.map(([r,c]) => [c, -r]);
  const mr = Math.min(...rot.map(([r]) => r));
  const mc = Math.min(...rot.map(([,c]) => c));
  return rot.map(([r,c]) => [r-mr, c-mc]).sort((a,b) => a[0]-b[0] || a[1]-b[1]);
}

function flipH(cells: number[][]): number[][] {
  const mx = Math.max(...cells.map(([,c]) => c));
  const f = cells.map(([r,c]) => [r, mx-c]);
  const mc = Math.min(...f.map(([,c]) => c));
  return f.map(([r,c]) => [r, c-mc]).sort((a,b) => a[0]-b[0] || a[1]-b[1]);
}

function allOrientations(cells: number[][]): number[][][] {
  const seen = new Set<string>();
  const results: number[][][] = [];
  let cur = [...cells].sort((a,b) => a[0]-b[0] || a[1]-b[1]);
  for (let i = 0; i < 4; i++) {
    for (const variant of [cur, flipH(cur)]) {
      const key = JSON.stringify(variant);
      if (!seen.has(key)) {
        seen.add(key);
        results.push(variant);
      }
    }
    cur = rotateCW(cur);
  }
  return results;
}

const ALL_ORI = PIECES.map(p => allOrientations(p));

// ── Board geometry ──
interface BoardCell { row: number; col: number; x: number; y: number; label: string; vidx: number; }

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const boardCells = computed<BoardCell[]>(() => {
  const cells: BoardCell[] = [];
  for (let c = 0; c < 6; c++)
    cells.push({ row:0, col:c, x: 10 + c*100, y: 10, label: MONTHS[c], vidx: cells.length });
  for (let c = 0; c < 6; c++)
    cells.push({ row:1, col:c, x: 10 + c*100, y: 110, label: MONTHS[6+c], vidx: cells.length });
  for (let r = 2; r < 6; r++)
    for (let c = 0; c < 7; c++)
      cells.push({ row:r, col:c, x: 10 + c*100, y: 10 + r*100, label: String((r-2)*7+c+1), vidx: cells.length });
  for (let c = 2; c < 5; c++)
    cells.push({ row:6, col:c, x: 10 + c*100, y: 610, label: String(29+c-2), vidx: cells.length });
  return cells;
});

const rcToVidx = computed(() => {
  const m: Record<string, number> = {};
  boardCells.value.forEach((c, i) => { m[`${c.row},${c.col}`] = i; });
  return m;
});

function cellXY(rc: number[]): { x: number; y: number } {
  const key = `${rc[0]},${rc[1]}`;
  const vidx = rcToVidx.value[key];
  if (vidx !== undefined) {
    const cell = boardCells.value[vidx];
    return { x: cell.x, y: cell.y };
  }
  return { x: 0, y: 0 };
}

// ── Parse position string to extract half-state ──
// Autogui format: "1_<43 board chars>" or "1_<43 board chars>_B" or "1_<43 board chars>_B3"
const positionParts = computed(() => {
  const pos = currentPosition.value;
  const parts = pos.split('_');
  const boardStr = parts[1] || '';
  let halfStr: string | null = null;
  if (parts.length >= 3) {
    const p2 = parts[2];
    // If it's a piece bits string (9 chars of 0/1), check for part 4
    if (p2.length === 9 && /^[01]+$/.test(p2)) {
      halfStr = parts[3] || null;
    } else {
      halfStr = p2;
    }
  }
  return { boardStr, halfStr };
});

const boardString = computed(() => positionParts.value.boardStr);

// Derive step, selectedPiece, selectedOrientation from position suffix
const selectedPiece = computed<number | null>(() => {
  const hs = positionParts.value.halfStr;
  if (!hs) return null;
  return PIECE_SYMS.indexOf(hs[0]);
});

const selectedOrientation = computed<number | null>(() => {
  const hs = positionParts.value.halfStr;
  if (!hs || hs.length < 2) return null;
  return parseInt(hs[1]);
});

type Step = 'selectPiece' | 'selectOrientation' | 'selectPosition' | 'done';
const step = computed<Step>(() => {
  if (Object.keys(availableMoves.value).length === 0) return 'done';
  if (selectedPiece.value === null) return 'selectPiece';
  if (selectedOrientation.value === null) return 'selectOrientation';
  return 'selectPosition';
});

const hoveredPlacementIdx = ref<number | null>(null);

// Track which piece covers which cell (vidx → pieceIdx)
const cellPieceMap = ref<Record<number, number>>({});

// Which pieces are used — from readable position
const usedPieces = computed(() => {
  const used = new Set<number>();
  const parts = readablePosition.value.split('_');
  if (parts.length >= 3) {
    const pieceBits = parts[2];
    for (let i = 0; i < 9 && i < pieceBits.length; i++) {
      if (pieceBits[i] === '1') used.add(i);
    }
  }
  return used;
});

// Sync cellPieceMap from position changes
let prevBoardString = boardString.value;
let prevUsedPieces = new Set(usedPieces.value);
watch([boardString, usedPieces], ([newBoard, newUsed]) => {
  const added = [...newUsed].filter(pi => !prevUsedPieces.has(pi));
  const removed = [...prevUsedPieces].filter(pi => !newUsed.has(pi));
  const newlyCovered: number[] = [];
  const newlyUncovered: number[] = [];
  const len = Math.max(newBoard.length, prevBoardString.length);
  for (let i = 0; i < len; i++) {
    const o = prevBoardString[i], n = newBoard[i];
    if (n === 'X' && o !== 'X') newlyCovered.push(i);
    if (o === 'X' && n !== 'X') newlyUncovered.push(i);
  }
  if (added.length || removed.length) {
    const m = { ...cellPieceMap.value };
    if (added.length === 1) for (const v of newlyCovered) m[v] = added[0];
    if (removed.length) for (const v of newlyUncovered) delete m[v];
    cellPieceMap.value = m;
  }
  prevBoardString = newBoard;
  prevUsedPieces = new Set(newUsed);
});

function cellFill(vidx: number): string {
  const ch = boardString.value[vidx];
  if (ch === 'T') return '#c0392b';
  if (ch === 'X' && vidx in cellPieceMap.value) return pieceColors[cellPieceMap.value[vidx]];
  if (ch === 'X') return '#4a90d9';
  if (isHoveredPlacementCell(vidx)) return pieceColors[selectedPiece.value!];
  return '#f0e6d3';
}

function cellFillOpacity(vidx: number): number {
  const ch = boardString.value[vidx];
  if (ch === 'T' || ch === 'X') return 1;
  if (isHoveredPlacementCell(vidx)) return 0.85;
  return 1;
}

function isHoveredPlacementCell(vidx: number): boolean {
  if (step.value !== 'selectPosition') return false;
  if (hoveredPlacementIdx.value === null || selectedPiece.value === null) return false;
  const placement = anchorPlacements.value[hoveredPlacementIdx.value];
  if (!placement) return false;
  return placement.cells.some(([r, c]: number[]) => rcToVidx.value[`${r},${c}`] === vidx);
}

function cellTextFill(vidx: number): string {
  const ch = boardString.value[vidx];
  if (ch === 'T' || ch === 'X') return '#fff';
  return '#5a4a3a';
}

// ── Move parsing from availableMoves ──
const MOVE_CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-.~!+:;=<>";

interface ParsedAnchorMove {
  pieceIdx: number;
  oriIdx: number;
  cells: number[][];
  autoguiMove: string;
  moveValue: string;
}

function pieceValueHint(pi: number): string | null {
  if (step.value !== 'selectPiece') return null;
  const letter = PIECE_SYMS[pi];
  for (const moveObj of Object.values(availableMoves.value) as any[]) {
    if (moveObj.autoguiMove === `A_${letter}_s`) {
      return moveObj.moveValue || null;
    }
  }
  return null;
}

const orientationMoves = computed(() => {
  if (step.value !== 'selectOrientation' || selectedPiece.value === null) return [];
  const letter = PIECE_SYMS[selectedPiece.value];
  const results: { oriIdx: number; autoguiMove: string; moveValue: string }[] = [];
  for (const moveObj of Object.values(availableMoves.value) as any[]) {
    const m = moveObj.autoguiMove.match(/^A_([A-I])(\d)_o$/);
    if (m && m[1] === letter) {
      results.push({
        oriIdx: parseInt(m[2]),
        autoguiMove: moveObj.autoguiMove,
        moveValue: moveObj.moveValue || '',
      });
    }
  }
  return results;
});

function oriShape(oriMove: { oriIdx: number }): number[][] {
  if (selectedPiece.value === null) return [];
  return ALL_ORI[selectedPiece.value][oriMove.oriIdx] || [];
}

const anchorPlacements = computed<ParsedAnchorMove[]>(() => {
  if (step.value !== 'selectPosition' || selectedPiece.value === null || selectedOrientation.value === null) return [];
  const results: ParsedAnchorMove[] = [];
  for (const moveObj of Object.values(availableMoves.value) as any[]) {
    const m = moveObj.autoguiMove.match(/^A_(.)_(\d+)$/);
    if (!m) continue;
    const charIdx = MOVE_CHARS.indexOf(m[1]);
    const pi = Math.floor(charIdx / 8);
    const oi = charIdx % 8;
    if (pi !== selectedPiece.value || oi !== selectedOrientation.value) continue;
    const shape = ALL_ORI[pi][oi];
    if (!shape) continue;
    const targetVidx = parseInt(m[2]);
    for (let r = 0; r < 7; r++) {
      let found = false;
      for (let c = 0; c < 7; c++) {
        const cells = shape.map(([dr,dc]: number[]) => [r+dr, c+dc]);
        const allValid = cells.every(([cr,cc]: number[]) => rcToVidx.value[`${cr},${cc}`] !== undefined);
        if (!allValid) continue;
        const minVidx = Math.min(...cells.map(([cr,cc]: number[]) => rcToVidx.value[`${cr},${cc}`]));
        if (minVidx === targetVidx) {
          results.push({ pieceIdx: pi, oriIdx: oi, cells, autoguiMove: moveObj.autoguiMove, moveValue: moveObj.moveValue || '' });
          found = true;
          break;
        }
      }
      if (found) break;
    }
  }
  return results;
});

const statusText = computed(() => {
  if (step.value === 'done') return 'Puzzle Complete!';
  if (step.value === 'selectPiece')
    return 'Select a piece to place (A-I)';
  if (step.value === 'selectOrientation' && selectedPiece.value !== null)
    return `Piece ${String.fromCharCode(65 + selectedPiece.value)} — choose orientation`;
  if (step.value === 'selectPosition' && selectedPiece.value !== null)
    return `Place piece ${String.fromCharCode(65 + selectedPiece.value)} on the board`;
  return '';
});

function oriAnchor(ori: number[][]): { cx: number; cy: number } {
  let best = ori[0];
  for (const cell of ori) {
    if (cell[0] < best[0] || (cell[0] === best[0] && cell[1] < best[1]))
      best = cell;
  }
  return { cx: best[1] + 0.5, cy: best[0] + 0.5 };
}

function placementAnchorXY(placement: ParsedAnchorMove): { cx: number; cy: number } {
  let best = placement.cells[0];
  let bestVidx = rcToVidx.value[`${best[0]},${best[1]}`];
  for (const c of placement.cells) {
    const v = rcToVidx.value[`${c[0]},${c[1]}`];
    if (v < bestVidx) { bestVidx = v; best = c; }
  }
  const { x, y } = cellXY(best);
  return { cx: x + 44, cy: y + 44 };
}

const orientLayout = computed(() => {
  const count = Math.max(1, orientationMoves.value.length);
  const maxSlotW = 140;
  const availW = 720;
  const slotW = Math.min(maxSlotW, availW / count);
  const scale = slotW / maxSlotW;
  return {
    slotW, scale,
    slotRectW: 130 * scale,
    slotRectH: 120 * scale,
    padH: 12 * scale,
    padV: 15 * scale,
    cellSize: 24 * scale,
    rectSize: 22 * scale,
    dotR: Math.max(2.5, 4 * scale),
  };
});

function oriSlotX(idx: number): number {
  const oL = orientLayout.value;
  const count = orientationMoves.value.length;
  const totalW = count * oL.slotW;
  const startX = (750 - totalW) / 2;
  return startX + idx * oL.slotW;
}

// ── Actions — dispatch halfmoves to the store ──
function onPieceClick(pi: number) {
  if (usedPieces.value.has(pi) || step.value !== 'selectPiece') return;
  const letter = PIECE_SYMS[pi];
  const moveStr = `A_${letter}_s`;
  dispatchMove(moveStr);
}

async function dispatchMove(autoguiMove: string) {
  await store.dispatch(actionTypes.runMove, { autoguiMove });
  setTimeout(() => {
    const svg = document.getElementById('image-autogui');
    if (svg) {
      const anim = svg.querySelector('#animationForeground');
      if (anim) anim.remove();
      svg.querySelectorAll('.appearingEntity, .appearingPiece').forEach(el => el.remove());
    }
  }, 600);
  hoveredPlacementIdx.value = null;
}

function doUndo() {
  store.dispatch(actionTypes.undoMove);
  hoveredPlacementIdx.value = null;
}
</script>

<style lang="scss" scoped>
#image-autogui {
  height: 100%;
  width: 100%;
}

.wyp-clickable {
  cursor: pointer;
  &:hover {
    filter: brightness(1.2);
  }
}
</style>
