import type * as Types from "./types";
import gsap from "gsap";
const sfx = import.meta.globEager("../../models/images/svg/ttt/*");

/* All animation functions should return the animation duration in milliseconds. */

const animateTTT = (currPosition: string, nextPosition: string) => {
    const currBoard = currPosition.split("_")[4];
    const nextBoard = nextPosition.split("_")[4];
    var i, diffIdx = -1;
    for (i = 0; i < 9; i++) {
        if (currBoard[i] != nextBoard[i]) {
            diffIdx = i;
            break;
        }
    }
    const xOff = (diffIdx % 3) * 22;
    const yOff = Math.floor(diffIdx / 3) * 22;
    var audio;
    if (diffIdx > -1) {
        if (currBoard[diffIdx] === '-') {
            if (nextBoard[diffIdx] === 'x') {
                audio = new Audio(sfx['../../models/images/svg/ttt/X.mp3'].default);
                audio.play();
                gsap.to("#xa" + diffIdx, {duration: 0.25, attr: {x2: 19 + xOff, y2: 19 + yOff}});
                gsap.to("#xb" + diffIdx, {delay: 0.25, duration: 0.25, attr: {x2: 3 + xOff, y2: 19 + yOff}});
            } else if (nextBoard[diffIdx] === 'o') {
                audio = new Audio(sfx['../../models/images/svg/ttt/O.mp3'].default);
                audio.play();
                gsap.to("#o" + diffIdx, {duration: 0.5, attr: {"stroke-dashoffset": 0}})
            }
        }
        return 500;
    }
    return 0;
}

const animateSim = (moveObj: Types.Move) => {
    const vertices = [[4, 0], [2, 3.4641], [-2, 3.4641], [-4, 0], [-2, -3.4641], [2, -3.4641]];
    var audio = new Audio(sfx['../../models/images/svg/ttt/O.mp3'].default);
    audio.play();
    const c = Number(moveObj.moveName[0]) - 1;
    const d = Number(moveObj.moveName[1]) - 1;    
    gsap.to("#simline" + moveObj.moveName, {duration: 0.498, attr: {"x2": vertices[d][0], "y2": vertices[d][1]}});
    gsap.to("#simpermline" + moveObj.moveName, {delay: 0.498, duration: 0.001, opacity: 1});
    gsap.to("#simline" + moveObj.moveName, {delay: 0.499, duration: 0.001, attr: {"x2": vertices[c][0], "y2": vertices[c][1]}});
    return 500;
}

export const handleMoveAnimation = (currentMatch: Types.Match, moveObj: Types.Move) => {
    const currPosition = currentMatch.round.position.position;
    const nextPosition = moveObj.position;
    if (currentMatch.gameId === 'ttt') {
        return animateTTT(currPosition, nextPosition);
    } else if (currentMatch.gameId === 'sim') {
        return animateSim(moveObj);
    }
    return 0;
}