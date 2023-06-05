import type * as Types from "./types";
import gsap from "gsap";
const sfx = import.meta.globEager("../../models/images/svg/ttt/*");

/* All animation functions should return the animation duration in milliseconds. */

const animateTicTacToe = (currPosition: string, nextPosition: string) => {
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

export const handleMoveAnimation = (currPosition: string, nextPosition: string, moveObj: Types.Move) => {
    return animateTicTacToe(currPosition, nextPosition);
}