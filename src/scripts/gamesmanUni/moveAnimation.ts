import type * as Types from "./types";
import gsap from "gsap";
const sfx = import.meta.globEager("../../models/sounds/*");
import { computed } from "vue";
import { useStore } from "../../scripts/plugins/store";
const gimages = import.meta.globEager("../../models/images/svg/**/*");

const playAudio = (path: string, volume: number) => {
    var audio = new Audio(sfx['../../models/sounds/' + path].default);
    audio.volume = volume;
    audio.play();
}

/* All animation functions should return the animation duration in milliseconds. */
const animateTTT = (volume: number, moveObj: Types.Move): number => {
    const diffIdx = Number(moveObj.move[4]);
    const turn = moveObj.move[2];
    const xOff = (diffIdx % 3) * 22;
    const yOff = Math.floor(diffIdx / 3) * 22;
    if (turn === 'x') {
        playAudio('X.mp3', volume);
        gsap.to("#xa" + diffIdx, {duration: 0.25, attr: {x2: 19 + xOff, y2: 19 + yOff}});
        gsap.to("#xb" + diffIdx, {delay: 0.25, duration: 0.25, attr: {x2: 3 + xOff, y2: 19 + yOff}});
    } else if (turn === 'o') {
        playAudio('O.mp3', volume);
        gsap.to("#o" + diffIdx, {duration: 0.5, attr: {"stroke-dashoffset": 0}})
    }
    return 500;
}

const animateSim = (volume: number, moveObj: Types.Move): number => {
    const vertices = [[4, 0], [2, 3.4641], [-2, 3.4641], [-4, 0], [-2, -3.4641], [2, -3.4641]];
    playAudio('O.mp3', volume);
    const d = Number(moveObj.moveName[1]) - 1;    
    gsap.to("#simline" + moveObj.moveName, {duration: 0.5, attr: {"x2": vertices[d][0], "y2": vertices[d][1]}});
    return 500;
}

const animateQuarto = (volume: number, currPosition: string, nextPosition: string, moveObj: Types.Move): number => {
    if (currPosition === "R_A_17_1_-----------------") return 0;
    var to = -1;
    for (var i = 0; i < 16; i++) {
        if (currPosition.split("_")[4][i] != nextPosition.split("_")[4][i]) {
            to = i;
            break;
        }
    }
    var toCoords = [12.5 + (to % 4) * 25, 12.5 + Math.floor(to / 4) * 25];
    gsap.fromTo("#toPlace", {x: 58, y: 113}, {duration: 0.5, x: toCoords[0], y: toCoords[1]});
    return 500;
}

const animateImageAutoGUI = (volume: number, currPosition: string, nextPosition: string, moveObj: Types.Move): number => {
    const store = useStore();
    const autoguiV2Data = computed(() => store.getters.autoguiV2Data(store.getters.currentGameType, 
        store.getters.currentGameId, store.getters.currentVariantId));
    const currentTheme = computed(() => store.getters.currentGameTheme);
    const theTheme = computed(() => autoguiV2Data.value.themes[currentTheme.value]);
    const scaledWidth = 100;
    const backgroundGeometry = computed(() => theTheme.value.backgroundGeometry);
    const widthFactor = computed(() => scaledWidth / backgroundGeometry.value[0]);
    const animationType = computed(() => theTheme.value.animationType || "");
    const pieces = computed(() => theTheme.value.pieces);
    const centers = computed(() => theTheme.value.centers.map((a: [number, number]) =>
        a.map((b: number) => b * widthFactor.value)));
    const getImageSource = (imagePath: string) => gimages["../../models/images/svg/" + imagePath].default;
    
    const currBoard = currPosition.split("_")[4];
    const nextBoard = nextPosition.split("_")[4];
    if (currBoard.length != nextBoard.length) return 0;
    var diffIdxs = [];
    var i, j;

    if (animationType.value === "simpleSlidePlaceRemove") {
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
                toIdx = i;
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
            const toCoords = centers.value[toIdx];
            const fromCoords = centers.value[fromIdx];
            gsap.to("#piece" + fromIdx, {duration: 0.5, x: toCoords[0] - fromCoords[0], y: toCoords[1] - fromCoords[1]});
        }
        
        // If `appearing` is null, don't play an appearing or disappearing animation
        if (appearing === false) { // Play disappearing animation
            // Opacity set to 0.001 and not 0 so that the element remains loaded
            gsap.fromTo("#piece" + appearDisappearIdx, {autoAlpha: 1}, {duration: 0.5, autoAlpha: 0.001});
        } else if (appearing === true && appearDisappearIdx != null) { // Play appearing animation
            var appearingChar = nextBoard[appearDisappearIdx];
            var svg = document.getElementById('image-autogui'); //Get svg element
            var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'image'); //Create a path in SVG's namespace
            newElement.setAttribute("id", "appearingPiece");
            newElement.setAttribute("x", (centers.value[appearDisappearIdx][0] - 0.5 * pieces.value[appearingChar].scale * widthFactor.value).toString());
            newElement.setAttribute("y", (centers.value[appearDisappearIdx][1] - 0.5 * pieces.value[appearingChar].scale * widthFactor.value).toString());
            newElement.setAttribute("width", (pieces.value[appearingChar].scale * widthFactor.value).toString()); //Set path's data
            newElement.setAttribute("height", (pieces.value[appearingChar].scale * widthFactor.value).toString()); //Set path's data
            newElement.setAttribute("href", getImageSource(pieces.value[appearingChar].image));
            newElement.setAttribute("opacity", (0.001).toString());
            svg!.appendChild(newElement);
            gsap.fromTo("#appearingPiece", {opacity: 0}, {duration: 0.5, opacity: 1});
        }
        return 500;
    } else if (animationType.value === "custom") {
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
    } else {
        const store = useStore();
        const autoguiV2Data = computed(() => store.getters.autoguiV2Data(store.getters.currentGameType, 
            store.getters.currentGameId, store.getters.currentVariantId));
        if (autoguiV2Data.value != null) {
            return animateImageAutoGUI(volume, currPosition, nextPosition, moveObj);
        }
        return 0;
    }
    return 0;
}

/*
    The purpose of this function is to reset any elements whose styles may have
    changed due to a gsap action. For example, suppose a chess piece with ID
    "piece0" captures another piece with ID "piece1". The default animation that
    would have played is "piece0" sliding and "piece1" fading away. 
    Then in the new position, that capturing piece's new ID would be "piece1". However,
    "piece1" would still have opacity 0 due to the fadeaway. This function would set
    "piece1" back to have opacity 1.
*/
export const animationEpilogue = (currentMatch: Types.Match) => {
    if (currentMatch.gameId === 'ttt') {
        return;
    } else if (currentMatch.gameId === 'sim') {
        return;
    } else if (currentMatch.gameId === 'quarto') {
        if (document.getElementById("toPlace")) {
            gsap.set("#toPlace", {x: 58, y: 113});
        }
    } else {
        const store = useStore();
        const autoguiV2Data = computed(() => store.getters.autoguiV2Data(store.getters.currentGameType, 
            store.getters.currentGameId, store.getters.currentVariantId));
        if (autoguiV2Data.value != null) {
            // Note: gsap.set() is unreliable (only achieves the reset as intended
            // 50% of the time for some reason) so we use fromTo instead 
            gsap.to(".entity", {duration: 0.001, opacity: 1});
            if (document.getElementById("appearingPiece")) {
                document.getElementById("appearingPiece")?.remove();
            }
        }
    }
}