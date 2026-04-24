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



    <!-- Piece inventory row — any unused piece is clickable -->
    <g v-for="pi in 9" :key="'inv' + pi"
      :class="{ 'wyp-clickable': !usedPieces.has(pi-1) && step === 'selectPiece' }"
      @click="selectPiece(pi-1)">
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
      <!-- Strikethrough for used pieces -->
      <line v-if="usedPieces.has(pi-1)"
        :x1="15 + (pi-1)*82" :y1="782"
        :x2="90 + (pi-1)*82" :y2="782"
        stroke="#888" stroke-width="2" pointer-events="none"/>
      <!-- Click overlay for any unused piece -->
      <rect v-if="!usedPieces.has(pi-1) && step === 'selectPiece'"
        :x="15 + (pi-1) * 82" y="755" width="75" height="55" rx="6"
        fill="transparent" style="cursor:pointer"/>
    </g>

    <!-- Step 2: Show orientations for selected piece -->
    <g v-if="step === 'selectOrientation' && selectedPiece !== null">
      <g v-for="(ori, oi) in selectedOrientations" :key="'ori' + oi"
        class="wyp-clickable"
        @click.stop="selectOrientation(oi)">
        <rect
          :x="oriSlotX(oi)" y="820"
          :width="orientLayout.slotRectW" :height="orientLayout.slotRectH" rx="10"
          fill="#3a2a1a" stroke="#8b7355" stroke-width="2"/>
        <g v-for="(cell, ci) in ori" :key="'os' + oi + '_' + ci">
          <rect
            :x="oriSlotX(oi) + orientLayout.padH + cell[1] * orientLayout.cellSize"
            :y="820 + orientLayout.padV + cell[0] * orientLayout.cellSize"
            :width="orientLayout.rectSize" :height="orientLayout.rectSize" rx="3"
            :fill="pieceColors[selectedPiece]"
            pointer-events="none"/>
        </g>
        <!-- Anchor dot (top-left cell of piece) -->
        <circle
          :cx="oriSlotX(oi) + orientLayout.padH + oriAnchor(ori).cx * orientLayout.cellSize"
          :cy="820 + orientLayout.padV + oriAnchor(ori).cy * orientLayout.cellSize"
          :r="orientLayout.dotR" fill="#fff" opacity="0.9" pointer-events="none"/>
        <!-- Transparent click overlay -->
        <rect
          :x="oriSlotX(oi)" y="820"
          :width="orientLayout.slotRectW" :height="orientLayout.slotRectH" rx="10"
          fill="transparent" style="cursor:pointer"/>
      </g>
      <text x="720" y="940" text-anchor="end" fill="#aaa" font-size="16"
        class="wyp-clickable" @click="goBackToPiece()">← Back</text>
    </g>

    <!-- Step 3: One anchor dot per valid placement; hover previews the placement -->
    <g v-if="step === 'selectPosition' && selectedPiece !== null">
      <g v-for="(placement, pi) in validPlacements" :key="'place' + pi">
        <circle
          :cx="placementAnchorXY(placement).cx"
          :cy="placementAnchorXY(placement).cy"
          r="9" :fill="pieceColors[selectedPiece]"
          stroke="#fff" stroke-width="2"
          class="wyp-clickable" style="cursor:pointer"
          @mouseenter="hoveredPlacementIdx = pi"
          @mouseleave="hoveredPlacementIdx = null"
          @click.stop="doPlacement(placement.moveStr)"/>
      </g>
      <text x="720" y="1020" text-anchor="end" fill="#aaa" font-size="18"
        class="wyp-clickable" @click="goBack()">← Back</text>
      <!-- Show selected orientation -->
      <g v-if="selectedOrientations[selectedOrientation!]">
        <g v-for="(cell, ci) in selectedOrientations[selectedOrientation!]" :key="'sel' + ci">
          <rect
            :x="320 + cell[1] * 28"
            :y="840 + cell[0] * 28"
            width="26" height="26" rx="3"
            :fill="pieceColors[selectedPiece]"
            pointer-events="none"/>
        </g>
        <!-- Anchor dot (top-left cell of piece) -->
        <circle
          :cx="320 + oriAnchor(selectedOrientations[selectedOrientation!]).cx * 28"
          :cy="840 + oriAnchor(selectedOrientations[selectedOrientation!]).cy * 28"
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

// ── Piece definitions (must match backend) ──
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
// 43 valid cells in row-major order
interface BoardCell { row: number; col: number; x: number; y: number; label: string; vidx: number; }

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const boardCells = computed<BoardCell[]>(() => {
  const cells: BoardCell[] = [];
  // Row 0: Jan-Jun (cols 0-5)
  for (let c = 0; c < 6; c++)
    cells.push({ row:0, col:c, x: 10 + c*100, y: 10, label: MONTHS[c], vidx: cells.length });
  // Row 1: Jul-Dec (cols 0-5)
  for (let c = 0; c < 6; c++)
    cells.push({ row:1, col:c, x: 10 + c*100, y: 110, label: MONTHS[6+c], vidx: cells.length });
  // Rows 2-5: days 1-28 (cols 0-6)
  for (let r = 2; r < 6; r++)
    for (let c = 0; c < 7; c++)
      cells.push({ row:r, col:c, x: 10 + c*100, y: 10 + r*100, label: String((r-2)*7+c+1), vidx: cells.length });
  // Row 6: days 29-31 (cols 2-4)
  for (let c = 2; c < 5; c++)
    cells.push({ row:6, col:c, x: 10 + c*100, y: 610, label: String(29+c-2), vidx: cells.length });
  return cells;
});

// Map (row,col) -> vidx
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

// Parse position string: "1_<43 chars>"
const boardString = computed(() => {
  const m = currentPosition.value.match(/^1_(.+)$/);
  return m ? m[1] : '';
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
  const placement = validPlacements.value[hoveredPlacementIdx.value];
  if (!placement) return false;
  return placement.cells.some(([r, c]) => rcToVidx.value[`${r},${c}`] === vidx);
}

function cellTextFill(vidx: number): string {
  const ch = boardString.value[vidx];
  if (ch === 'T' || ch === 'X') return '#fff';
  return '#5a4a3a';
}

// ── Multi-step interaction state ──
// Step 1: click piece in inventory → Step 2: choose orientation → Step 3: place on board
type Step = 'selectPiece' | 'selectOrientation' | 'selectPosition';
const step = ref<Step>('selectPiece');
const selectedOrientation = ref<number | null>(null);
const selectedPiece = ref<number | null>(null);
const hoveredPlacementIdx = ref<number | null>(null);

// Track which piece covers which cell (vidx → pieceIdx)
const cellPieceMap = ref<Record<number, number>>({});

// Current canonical piece (first unused) — detected from available moves
const currentCanonicalPiece = computed(() => {
  const MOVE_CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-.~!+:;=<>";
  for (const moveObj of Object.values(availableMoves.value) as any[]) {
    const m = moveObj.autoguiMove.match(/^A_(.)_(\d+)$/);
    if (m) {
      const charIdx = MOVE_CHARS.indexOf(m[1]);
      return Math.floor(charIdx / 8);
    }
  }
  return -1;
});

const currentOrientations = computed(() => {
  if (currentCanonicalPiece.value < 0) return [];
  return ALL_ORI[currentCanonicalPiece.value];
});

// Orientations for the user-selected piece
const selectedOrientations = computed(() => {
  if (selectedPiece.value === null || selectedPiece.value < 0) return [];
  return ALL_ORI[selectedPiece.value];
});

// Which pieces are still available (not yet placed)?
// Readable position format: "1_<43 board chars>_<9 piece bits>"
const usedPieces = computed(() => {
  const used = new Set<number>();
  const parts = readablePosition.value.split('_');
  if (parts.length >= 3) {
    const pieceBits = parts[2]; // e.g. "000000000"
    for (let i = 0; i < 9 && i < pieceBits.length; i++) {
      if (pieceBits[i] === '1') used.add(i);
    }
  }
  return used;
});

// Keep cellPieceMap in sync with the solver. doPlacement only runs for
// manual user moves; in auto/solver mode, moves are dispatched directly,
// so we infer the placed piece from position deltas: a used-piece bit
// flipped 0→1 identifies the new piece, and the newly-covered X cells
// all belong to it. Undo (1→0) clears those cells.
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

const availablePieces = computed(() => {
  return PIECES.map((shape, i) => ({ shape, index: i }))
    .filter((_, i) => !usedPieces.value.has(i));
});

// Parse all moves into structured data
interface ParsedMove {
  pieceIdx: number;
  oriIdx: number;
  anchorRow: number;
  anchorCol: number;
  moveStr: string;
  cells: number[][]; // absolute (row,col) pairs
}

const MOVE_CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-.~!+:;=<>";

const parsedMoves = computed<ParsedMove[]>(() => {
  const result: ParsedMove[] = [];
  for (const moveObj of Object.values(availableMoves.value) as any[]) {
    const m = moveObj.autoguiMove.match(/^A_(.)_(\d+)$/);
    if (!m) continue;
    const charIdx = MOVE_CHARS.indexOf(m[1]);
    const pi = Math.floor(charIdx / 8);
    const oi = charIdx % 8;
    const shape = ALL_ORI[pi][oi];
    if (!shape) continue;
    // Need to figure out anchor (row,col) from the center index
    // center index = min vidx of covered cells
    // We need to reverse-engineer: try all valid anchors for this piece+ori
    // and find which one produces min_vidx = m[2]
    const targetVidx = parseInt(m[2]);
    const targetCell = boardCells.value[targetVidx];
    if (!targetCell) continue;
    // Try all possible anchors
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const cells = shape.map(([dr,dc]: number[]) => [r+dr, c+dc]);
        // Check all cells are valid
        const allValid = cells.every(([cr,cc]: number[]) => {
          const key = `${cr},${cc}`;
          return rcToVidx.value[key] !== undefined;
        });
        if (!allValid) continue;
        const minVidx = Math.min(...cells.map(([cr,cc]: number[]) => rcToVidx.value[`${cr},${cc}`]));
        if (minVidx === targetVidx) {
          result.push({
            pieceIdx: pi, oriIdx: oi,
            anchorRow: r, anchorCol: c,
            moveStr: moveObj.autoguiMove,
            cells
          });
          break;
        }
      }
      if (result.length > 0 && result[result.length-1].moveStr === moveObj.autoguiMove) break;
    }
  }
  return result;
});

const validPlacements = computed<ParsedMove[]>(() => {
  if (selectedPiece.value === null || selectedOrientation.value === null) return [];
  return parsedMoves.value.filter(
    m => m.pieceIdx === selectedPiece.value && m.oriIdx === selectedOrientation.value
  );
});

const statusText = computed(() => {
  if (Object.keys(availableMoves.value).length === 0) return '🎉 Puzzle Complete!';
  if (step.value === 'selectPiece')
    return `Select a piece to place (A-I)`;
  if (step.value === 'selectOrientation' && selectedPiece.value !== null) {
    const pieceName = String.fromCharCode(65 + selectedPiece.value);
    return `Piece ${pieceName} — choose orientation`;
  }
  if (step.value === 'selectPosition' && selectedPiece.value !== null) {
    const pieceName = String.fromCharCode(65 + selectedPiece.value);
    return `Place piece ${pieceName} on the board`;
  }
  return '';
});

// ── Piece slot positioning ──

// Top-left cell of a piece orientation (lex-smallest row, then col)
function oriAnchor(ori: number[][]): { cx: number; cy: number } {
  let best = ori[0];
  for (const cell of ori) {
    if (cell[0] < best[0] || (cell[0] === best[0] && cell[1] < best[1])) {
      best = cell;
    }
  }
  return { cx: best[1] + 0.5, cy: best[0] + 0.5 };
}

// Geometric center of a placement on the board → snap to nearest cell's center (in pixels)
function placementCenter(placement: ParsedMove): { cx: number; cy: number } {
  let avgX = 0, avgY = 0;
  for (const cell of placement.cells) {
    const { x, y } = cellXY(cell);
    avgX += x + 44;
    avgY += y + 44;
  }
  avgX /= placement.cells.length;
  avgY /= placement.cells.length;
  // Snap to nearest cell center
  let bestCX = avgX, bestCY = avgY, bestDist = Infinity;
  for (const cell of placement.cells) {
    const { x, y } = cellXY(cell);
    const cx = x + 44, cy = y + 44;
    const d = (cx - avgX) ** 2 + (cy - avgY) ** 2;
    if (d < bestDist) { bestDist = d; bestCX = cx; bestCY = cy; }
  }
  return { cx: bestCX, cy: bestCY };
}

function placementAnchorXY(placement: ParsedMove): { cx: number; cy: number } {
  let best = placement.cells[0];
  let bestVidx = rcToVidx.value[`${best[0]},${best[1]}`];
  for (const c of placement.cells) {
    const v = rcToVidx.value[`${c[0]},${c[1]}`];
    if (v < bestVidx) { bestVidx = v; best = c; }
  }
  const { x, y } = cellXY(best);
  return { cx: x + 44, cy: y + 44 };
}

function placementBBox(placement: ParsedMove): { x: number; y: number; w: number; h: number } {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const cell of placement.cells) {
    const { x, y } = cellXY(cell);
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x + 88 > maxX) maxX = x + 88;
    if (y + 88 > maxY) maxY = y + 88;
  }
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}

function pieceSlotX(idx: number): number {
  const count = availablePieces.value.length;
  const slotW = 140;
  const totalW = count * slotW;
  const startX = (750 - totalW) / 2;
  return startX + idx * slotW;
}

// Fit orientations inside viewBox (750) — scale down when a piece has many.
const orientLayout = computed(() => {
  const count = Math.max(1, selectedOrientations.value.length);
  const maxSlotW = 140;
  const availW = 720; // viewBox width minus ~15px margin each side
  const slotW = Math.min(maxSlotW, availW / count);
  const scale = slotW / maxSlotW;
  return {
    slotW,
    scale,
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
  const count = selectedOrientations.value.length;
  const totalW = count * oL.slotW;
  const startX = (750 - totalW) / 2;
  return startX + idx * oL.slotW;
}

// ── Actions ──
function selectPiece(pi: number) {
  if (!usedPieces.value.has(pi) && step.value === 'selectPiece') {
    selectedPiece.value = pi;
    step.value = 'selectOrientation';
  }
}

function selectOrientation(oi: number) {
  selectedOrientation.value = oi;
  step.value = 'selectPosition';
}

function goBackToPiece() {
  selectedPiece.value = null;
  selectedOrientation.value = null;
  step.value = 'selectPiece';
}

async function doPlacement(moveStr: string) {
  const am = availableMoves.value;
  if (!(moveStr in am)) return;

  // Record which cells this piece covers
  if (selectedPiece.value !== null && selectedOrientation.value !== null) {
    const placement = validPlacements.value.find(p => p.moveStr === moveStr);
    if (placement) {
      const newMap = { ...cellPieceMap.value };
      for (const cell of placement.cells) {
        const key = `${cell[0]},${cell[1]}`;
        const vidx = rcToVidx.value[key];
        if (vidx !== undefined) {
          newMap[vidx] = selectedPiece.value;
        }
      }
      cellPieceMap.value = newMap;
    }
  }

  await store.dispatch(actionTypes.runMove, { autoguiMove: moveStr });

  // Clean up animation overlay elements that the animation system adds
  // (they use AutoGUI images which don't match our custom piece colors)
  setTimeout(() => {
    const svg = document.getElementById('image-autogui');
    if (svg) {
      const anim = svg.querySelector('#animationForeground');
      if (anim) anim.remove();
      // Also remove any stray appearing entities
      svg.querySelectorAll('.appearingEntity, .appearingPiece').forEach(el => el.remove());
    }
  }, 600); // after animation duration (500ms + buffer)

  selectedOrientation.value = null;
  selectedPiece.value = null;
  step.value = 'selectPiece';
  hoveredPlacementIdx.value = null;
}

function goBack() {
  if (step.value === 'selectPosition') {
    selectedOrientation.value = null;
    step.value = 'selectOrientation';
    hoveredPlacementIdx.value = null;
  }
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
