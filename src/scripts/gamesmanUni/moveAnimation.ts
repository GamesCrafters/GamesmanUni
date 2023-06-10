import type * as Types from "./types";
import gsap from "gsap";
const sfx = import.meta.globEager("../../models/sounds/*");

/* All animation functions should return the animation duration in milliseconds. */
const animateTTT = (volume: number, moveObj: Types.Move): number => {
    const diffIdx = Number(moveObj.move[4]);
    const turn = moveObj.move[2];
    const xOff = (diffIdx % 3) * 22;
    const yOff = Math.floor(diffIdx / 3) * 22;
    var audio;
    if (turn === 'x') {
        audio = new Audio(sfx['../../models/sounds/X.mp3'].default);
        audio.volume = volume;
        audio.play();
        gsap.to("#xa" + diffIdx, {duration: 0.25, attr: {x2: 19 + xOff, y2: 19 + yOff}});
        gsap.to("#xb" + diffIdx, {delay: 0.25, duration: 0.25, attr: {x2: 3 + xOff, y2: 19 + yOff}});
    } else if (turn === 'o') {
        audio = new Audio(sfx['../../models/sounds/O.mp3'].default);
        audio.volume = volume;
        audio.play();
        gsap.to("#o" + diffIdx, {duration: 0.5, attr: {"stroke-dashoffset": 0}})
    }
    return 500;
}

const animateSim = (volume: number, moveObj: Types.Move): number => {
    const vertices = [[4, 0], [2, 3.4641], [-2, 3.4641], [-4, 0], [-2, -3.4641], [2, -3.4641]];
    var audio = new Audio(sfx['../../models/sounds/O.mp3'].default);
    audio.volume = volume;
    audio.play();
    const d = Number(moveObj.moveName[1]) - 1;    
    gsap.to("#simline" + moveObj.moveName, {duration: 0.5, attr: {"x2": vertices[d][0], "y2": vertices[d][1]}});
    return 500;
}

const animateQuarto = (volume: number, currPosition: string, nextPosition: string, moveObj: Types.Move): number => {
    if (currPosition === "R_A_17_1_-----------------") {
        return 0;
    }
    var to = -1;
    for (var i = 0; i < 16; i++) {
        if (currPosition.split("_")[4][i] != nextPosition.split("_")[4][i]) {
            to = i;
            break;
        }
    }
    var toCoords = [12.5 + (to % 4) * 25, 12.5 + Math.floor(to / 4) * 25];
    gsap.to("#toPlace", {duration: 0.5, x: toCoords[0], y: toCoords[1]});

    return 500;
}

const animateImageAutoGUI = (volume: number, animationType: string, currPosition: string, nextPosition: string): number => {
    const currBoard = currPosition.split("_")[4];
    const nextBoard = nextPosition.split("_")[4];
    if (currBoard.length != nextBoard.length) return 0;
    var diffIdxs = [];
    var i, j;

    if (animationType === "simpleSlidePlaceRemove") {
        var fromIdx = null;
        var toIdx = null;
        var appearDisappearIdx = null;
        var appearing = null;
        for (i = 0; i < currBoard.length; i++) {
            if (currBoard[i] != nextBoard[i]) {
                diffIdxs.push(i);
            }
        }
        if (diffIdxs.length == 1) {
            i = diffIdxs[0];
            if (nextBoard[i] == '-') { // Removal (fade-out)
                appearing = false;
            } else if (currBoard[i] == '-') { // Placement (fade-in)
                appearing = true;
            } else {
                return 0;
            }
            appearDisappearIdx = i;
        } else if (diffIdxs.length == 2) {
            i = diffIdxs[0];
            j = diffIdxs[1];
            if (currBoard[j] == nextBoard[i] && currBoard[j] != '-') {
                i = j;
                j = diffIdxs[0];
            }
            if (currBoard[i] == nextBoard[j]) {
                if (currBoard[j] != '-' && nextBoard[i] != '-') {
                    return 0;
                } else if (currBoard[j] != '-') { // Capture
                    appearDisappearIdx = j;
                    appearing = false;
                } else if (nextBoard[i] != '-') { // Uncapture
                    appearDisappearIdx = i;
                    appearing = true;
                }
                fromIdx = i;
                toIdx = j;
            } else {
                return 0;
            }
        } else if (diffIdxs.length == 3) {
            for (const idx1 of diffIdxs) {
                for (const idx2 of diffIdxs) {
                    if (currBoard[idx1] == nextBoard[idx2] && currBoard[idx1] != '-') {
                        fromIdx = idx1;
                        toIdx = idx2;
                    }
                }
            }
            if (fromIdx == null) {
                return 0;
            }
            for (const idx of diffIdxs) {
                if (fromIdx != idx && toIdx != idx) {
                    appearDisappearIdx = idx;
                }
            }
            if (currBoard[appearDisappearIdx!] == '-') {
                appearing = true;
            } else if (nextBoard[appearDisappearIdx!] == '-') {
                appearing = false;
            } else {
                return 0;
            }
        } else {
            return 0;
        }
        
        if (fromIdx != null && toIdx != null) { // Play sliding animation
            //const toCoords = centers.value[toIdx];
            //const fromCoords = centers.value[fromIdx];
            //gsap.to("#piece" + fromIdx, {duration: 0.5, x: toCoords[0] - fromCoords[0], y: toCoords[1] - fromCoords[1]});
        }
        
        // If `appearing` is null, don't play an appearing or disappearing animation
        if (appearing === false) { // Play disappearing animation
            gsap.to("#piece" + appearDisappearIdx, {duration: 0.5, autoAlpha: 0.01});
        } else if (appearing === true) { // Play appearing animation
            console.log("appear");
        }
    } else if (animationType === "custom") {
        console.log("Custom");
    }
    return 0;
}

export const handleMoveAnimation = (volume: number, currentMatch: Types.Match, moveObj: Types.Move) => {
    const currPosition = currentMatch.round.position.position;
    const nextPosition = moveObj.position;
    if (currentMatch.gameId === 'ttt') {
        return animateTTT(volume, moveObj);
    } else if (currentMatch.gameId === 'sim') {
        return animateSim(volume, moveObj);
    } else if (currentMatch.gameId === 'quarto') {
        return animateQuarto(volume, currPosition, nextPosition, moveObj);
    }
    return 0;
}