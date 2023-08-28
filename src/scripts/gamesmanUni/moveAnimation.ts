import type * as Types from "./types";
import gsap from "gsap";
const sfx = import.meta.globEager("../../models/sounds/**/*");
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
        playAudio('ttt/X.mp3', volume);
        gsap.to("#xa" + diffIdx, {duration: 0.25, attr: {x2: 19 + xOff, y2: 19 + yOff}});
        gsap.to("#xb" + diffIdx, {delay: 0.25, duration: 0.25, attr: {x2: 3 + xOff, y2: 19 + yOff}});
    } else if (turn === 'o') {
        playAudio('ttt/O.mp3', volume);
        gsap.to("#o" + diffIdx, {duration: 0.5, attr: {"stroke-dashoffset": 0}})
    }
    return 500;
}

const animateSim = (volume: number, moveObj: Types.Move): number => {
    const vertices = [[4, 0], [2, 3.4641], [-2, 3.4641], [-4, 0], [-2, -3.4641], [2, -3.4641]];
    playAudio('ttt/O.mp3', volume);
    const d = Number(moveObj.moveName[1]) - 1;    
    gsap.to("#simline" + moveObj.moveName, {duration: 0.5, attr: {"x2": vertices[d][0], "y2": vertices[d][1]}});
    return 500;
}

const animateQuarto = (volume: number, currPosition: string, nextPosition: string, moveObj: Types.Move): number => {
    var duration = 0;
    var delay = 0;
    if (currPosition !== "R_A_17_1_-----------------") { // If currPosition is not the initial position
        var to = -1;
        for (var i = 0; i < 16; i++) {
            if (currPosition.split("_")[4][i] != nextPosition.split("_")[4][i]) {
                to = i;
                break;
            }
        }
        var toCoords = [12.5 + (to % 4) * 25, 12.5 + Math.floor(to / 4) * 25];
        gsap.fromTo("#toPlace", {x: 58, y: 113}, {duration: 0.5, x: toCoords[0], y: toCoords[1]});
        duration += 500;
        delay = 0.5
        if (nextPosition[25] != '-') {
            playAudio('general/slideThenRemove.mp3', volume);
        } else {
            playAudio('general/slide.mp3', volume);
        }
    } else {
        playAudio('general/remove.mp3', volume);
    }
    if (nextPosition[25] != '-') { // i.e. if there is a piece-to-place
        const store = useStore();
        var svg = document.getElementById('custom-gui-quarto'); //Get svg element
        var g = document.createElementNS("http://www.w3.org/2000/svg", 'g');
        g.setAttribute("id", "appearingPieces");
        svg!.appendChild(g);
        var gameTheme = store.getters.currentGameTheme || "r";

        var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'use'); //Create a path in SVG's namespace
        newElement.setAttribute("class", "appearingPiece");
        newElement.setAttribute("href", "#" + gameTheme + nextPosition[25]);
        newElement.setAttribute("transform", "translate(58 113)");
        newElement.setAttribute("opacity", "0.001");
        g.appendChild(newElement);

        var newText = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        newText.setAttribute("id", "textIntermediate");
        newText.setAttribute("x", "0");
        newText.setAttribute("y", "116.5");
        newText.setAttribute("style", "font: 12px sans-serif;stroke:black;stroke-width:0.5;fill:black");
        newText.setAttribute("opacity", "0.001");
        newText.appendChild(document.createTextNode("Placing:"));
        g.appendChild(newText);
        
        duration += 500;
        gsap.fromTo(".appearingPiece", {opacity: 0}, {duration: 0.5, delay: delay, opacity: 1});
        gsap.fromTo("#textIntermediate", {opacity: 0}, {duration: 0.5, delay: delay, opacity: 1});
    }
    return duration;
}

/* 
    TODO: FIX FOREGROUND IMAGE STACKING ISSUE WITH
    INTRODUCED PIECES
*/
const animateImageAutoGUI = (volume: number, currPosition: string, nextPosition: string, moveObj: Types.Move): number => {
    const store = useStore();
    const autoguiV2Data = store.getters.autoguiV2Data(store.getters.currentGameType, store.getters.currentGameId, store.getters.currentVariantId);
    const currentTheme = store.getters.currentGameTheme;
    const theTheme = autoguiV2Data.themes[currentTheme];
    const scaledWidth = 100;
    const backgroundGeometry = theTheme.backgroundGeometry;
    const widthFactor = scaledWidth / backgroundGeometry[0];
    const animationType = theTheme.animationType || "";
    const pieces = theTheme.pieces;
    const centers = theTheme.centers.map((a: [number, number]) => a.map((b: number) => b * widthFactor));
    const getImageSource = (imagePath: string) => gimages["../../models/images/svg/" + imagePath].default;
    
    const currBoard = currPosition.split("_")[4];
    const nextBoard = nextPosition.split("_")[4];
    if (currBoard.length != nextBoard.length) return 0;
    const animationWindow = theTheme.animationWindow || [0, currBoard.length];
    var diffIdxs = [];
    var i, j;

    var svg = document.getElementById('image-autogui'); //Get svg element
    var g = document.createElementNS("http://www.w3.org/2000/svg", 'g');
    g.setAttribute("id", "appearingPieces");
    svg!.appendChild(g);

    if (animationType === "simpleSlidePlaceRemove") {
        var fromIdx = null;
        var toIdx = null;
        var appearDisappearIdx = null;
        var appearing = null;
        for (i = animationWindow[0]; i < animationWindow[1]; i++) {
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
        
        // If `appearing` is null, don't play an appearing or disappearing animation
        if (appearing === false) { // Play disappearing animation
            // Opacity set to 0.001 and not 0 so that the element remains loaded
            gsap.fromTo("#piece" + appearDisappearIdx, {autoAlpha: 1}, {duration: 0.5, autoAlpha: 0.001});
        } else if (appearing === true && appearDisappearIdx != null) { // Play appearing animation
            var appearingChar = nextBoard[appearDisappearIdx];
            var svg = document.getElementById('image-autogui'); //Get svg element
            var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'image'); //Create a path in SVG's namespace
            newElement.setAttribute("class", "appearingPiece");
            newElement.setAttribute("x", (centers[appearDisappearIdx][0] - 0.5 * pieces[appearingChar].scale * widthFactor).toString());
            newElement.setAttribute("y", (centers[appearDisappearIdx][1] - 0.5 * pieces[appearingChar].scale * widthFactor).toString());
            newElement.setAttribute("width", (pieces[appearingChar].scale * widthFactor).toString()); //Set path's data
            newElement.setAttribute("height", (pieces[appearingChar].scale * widthFactor).toString()); //Set path's data
            newElement.setAttribute("href", getImageSource(pieces[appearingChar].image));
            newElement.setAttribute("opacity", "0.001");
            g.appendChild(newElement);
            gsap.fromTo(".appearingPiece", {opacity: 0}, {duration: 0.5, opacity: 1});
        }

        if (fromIdx != null && toIdx != null) { // Play sliding animation
            const toCoords = centers[toIdx];
            const fromCoords = centers[fromIdx];
            gsap.fromTo("#piece" + fromIdx, {autoAlpha: 1}, {duration: 0.001, autoAlpha: 0.001});

            var movingChar = currBoard[fromIdx];
            var svg = document.getElementById('image-autogui'); //Get svg element
            var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'image'); //Create a path in SVG's namespace
            newElement.setAttribute("class", "movingPiece");
            newElement.setAttribute("x", (centers[fromIdx][0] - 0.5 * pieces[movingChar].scale * widthFactor).toString());
            newElement.setAttribute("y", (centers[fromIdx][1] - 0.5 * pieces[movingChar].scale * widthFactor).toString());
            newElement.setAttribute("width", (pieces[movingChar].scale * widthFactor).toString()); //Set path's data
            newElement.setAttribute("height", (pieces[movingChar].scale * widthFactor).toString()); //Set path's data
            newElement.setAttribute("href", getImageSource(pieces[movingChar].image));
            g.appendChild(newElement);
            gsap.to(".movingPiece", {duration: 0.5, x: toCoords[0] - fromCoords[0], y: toCoords[1] - fromCoords[1]});
        }
        return 500;
    } else if (animationType === "naiveInterpolate") {
        for (i = animationWindow[0]; i < animationWindow[1]; i++) {
            if (currBoard[i] != nextBoard[i]) {
                if (currBoard[i] != '-') { // Piece originally at i shall fade out
                    gsap.fromTo("#piece" + i, {autoAlpha: 1}, {duration: 0.5, autoAlpha: 0.001});
                } 
                if (nextBoard[i] != '-') { // Piece that will be at i shall fade in
                    var appearingChar = nextBoard[i];
                    var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'image'); //Create a path in SVG's namespace
                    newElement.setAttribute("class", "appearingPiece");
                    newElement.setAttribute("x", (centers[i][0] - 0.5 * pieces[appearingChar].scale * widthFactor).toString());
                    newElement.setAttribute("y", (centers[i][1] - 0.5 * pieces[appearingChar].scale * widthFactor).toString());
                    newElement.setAttribute("width", (pieces[appearingChar].scale * widthFactor).toString()); //Set path's data
                    newElement.setAttribute("height", (pieces[appearingChar].scale * widthFactor).toString()); //Set path's data
                    newElement.setAttribute("href", getImageSource(pieces[appearingChar].image));
                    newElement.setAttribute("opacity", "0.001");
                    g.appendChild(newElement);
                }
            }
        }
        gsap.fromTo(".appearingPiece", {opacity: 0}, {duration: 0.5, opacity: 1});
        return 500;
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
    } else {
        const store = useStore();
        const autoguiV2Data = store.getters.autoguiV2Data(store.getters.currentGameType, 
            store.getters.currentGameId, store.getters.currentVariantId);
        if (autoguiV2Data != null) {
            return animateImageAutoGUI(volume, currPosition, nextPosition, moveObj);
        }
        return 0;
    }
}

/*
    Make sure to INSTANTANEOUSLY UNDO all gsap actions and REMOVE any added elements here.
    This function is important for resetting to the previous position if the next position
    fails to load.
*/
export const animationEpilogue = (currentMatch: Types.Match) => {
    if (currentMatch.gameId === 'ttt') {
        return; // todo
    } else if (currentMatch.gameId === 'sim') {
        return; // todo
    } else if (currentMatch.gameId === 'quarto') {
        if (document.getElementById("toPlace")) {
            gsap.to("#toPlace", {duration: 0.001, x: 58, y: 113});
        }
        if (document.getElementById("appearingPieces")) {
            document.getElementById("appearingPieces")!.remove();
        }
    } else {
        const store = useStore();
        const autoguiV2Data = store.getters.autoguiV2Data(store.getters.currentGameType, 
            store.getters.currentGameId, store.getters.currentVariantId);
        if (autoguiV2Data != null) {
            // Note: gsap.set() is unreliable (only achieves the reset as intended
            // 50% of the time for some reason) so we use fromTo instead 
            gsap.to(".entity", {duration: 0.001, opacity: 1});
            if (document.getElementById("appearingPieces")) {
                document.getElementById("appearingPieces")!.remove();
            }
        }
    }
}