import type * as Types from "./types";
import type { ImageAutoGUIEntity } from "../apis/gamesCrafters/types"
import gsap from "gsap";
import { playMoveSFX } from "./audio"
import { useStore } from "../../scripts/plugins/store";
const gimages = import.meta.globEager("../../models/images/svg/**/*");

/* Begin Helper Functions */
const getImageSource = (imagePath: string) => gimages["../../models/images/svg/" + imagePath].default;

const spawnImageEntity = (char: string, i: number, centers: number[][], entities: Record<string, ImageAutoGUIEntity>, widthFactor: number): SVGImageElement => {
    var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'image');
    var ews = entities[char].scale * widthFactor;
    newElement.setAttribute("x", (centers[i][0] - 0.5 * ews).toString());
    newElement.setAttribute("y", (centers[i][1] - 0.5 * ews).toString());
    newElement.setAttribute("width", ews.toString());
    newElement.setAttribute("height", ews.toString());
    newElement.setAttribute("href", getImageSource(entities[char].image));
    return newElement;
}

/* End Helper Functions */

/* All animation functions should return the animation duration in milliseconds. */
const animateTTT = (volume: number, moveObj: Types.Move): number => {
    const diffIdx = Number(moveObj.move[4]);
    const turn = moveObj.move[2];
    const xOff = (diffIdx % 3) * 22;
    const yOff = Math.floor(diffIdx / 3) * 22;
    if (turn === 'x') {
        playMoveSFX('ttt/X.mp3');
        gsap.to("#xa" + diffIdx, {duration: 0.25, attr: {x2: 19 + xOff, y2: 19 + yOff}});
        gsap.to("#xb" + diffIdx, {delay: 0.25, duration: 0.25, attr: {x2: 3 + xOff, y2: 19 + yOff}});
    } else if (turn === 'o') {
        playMoveSFX('ttt/O.mp3');
        gsap.to("#o" + diffIdx, {duration: 0.5, attr: {"stroke-dashoffset": 0}})
    }
    return 500;
}

const animateSim = (volume: number, moveObj: Types.Move): number => {
    const vertices = [[4, 0], [2, 3.4641], [-2, 3.4641], [-4, 0], [-2, -3.4641], [2, -3.4641]];
    playMoveSFX('ttt/O.mp3');
    const d = Number(moveObj.move[1]) - 1;    
    gsap.to("#simline" + moveObj.move, {duration: 0.5, attr: {"x2": vertices[d][0], "y2": vertices[d][1]}});
    return 500;
}

const animateQuarto = (volume: number, currPosition: string, nextPosition: string): number => {
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
            playMoveSFX('general/slideThenRemove.mp3');
        } else {
            playMoveSFX('general/slide.mp3');
        }
    } else {
        playMoveSFX('general/remove.mp3');
    }
    if (nextPosition[25] != '-') { // i.e. if there is a piece-to-place
        const store = useStore();
        var svg = document.getElementById('custom-gui-quarto'); //Get svg element
        var g = document.createElementNS("http://www.w3.org/2000/svg", 'g');
        g.setAttribute("id", "animationForeground");
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

const animateImageAutoGUI = (currPosition: string, nextPosition: string): number => {
    const currEntityStringParts = currPosition.split("_")[1].split("~");
    var currBoard = currEntityStringParts[0];
    const nextEntityStringParts = nextPosition.split("_")[1].split("~");
    var nextBoard = nextEntityStringParts[0];

    // Append dashes to make currBoard and nextBoard have same length, if one of them is shorter
    var lengthDiff = currBoard.length - nextBoard.length;
    if (lengthDiff >= 0) {
        nextBoard = nextBoard.concat('-'.repeat(lengthDiff))
    } else {
        currBoard = currBoard.concat('-'.repeat(-lengthDiff));
    }

    const store = useStore();
    const imageAutoGUIData = store.getters.imageAutoGUIData(store.getters.currentGameId, store.getters.currentVariantId);
    const theTheme = imageAutoGUIData.themes[store.getters.currentGameTheme];
    const scaledWidth = 100;
    const backgroundGeometry = theTheme.space;
    const widthFactor = scaledWidth / backgroundGeometry[0];
    const scaledHeight = backgroundGeometry[1] * widthFactor;
    const animationType = theTheme.animationType || "";
    const entities = theTheme.entities;
    const centers = theTheme.centers.map((a: Array<number>) => a.map((b: number) => b * widthFactor));
    const foregroundImagePath = theTheme.foreground || "";
    const animationWindow = theTheme.defaultAnimationWindow || [0, currBoard.length];
    const textEntityFontSize = theTheme.textEntityFontSize * widthFactor || 10;

    var svg = document.getElementById('image-autogui'); // Get svg element
    var g = document.createElementNS("http://www.w3.org/2000/svg", 'g');
    g.setAttribute("id", "animationForeground");
    svg!.appendChild(g);

    if (animationType === "entityFade" || animationType === "simpleSlides") {
        var i, diffIdxs = [];
        for (i = animationWindow[0]; i < animationWindow[1]; i++) {
            if (currBoard[i] != nextBoard[i]) {
                diffIdxs.push(i);
            }
        }

        var fadeOutIdxs = diffIdxs.filter((idx) => currBoard[idx] != '-' && currBoard[idx] in entities);
        var fadeInIdxs = diffIdxs.filter((idx) => nextBoard[idx] != '-' && nextBoard[idx] in entities);
        var slides = [];
        if (animationType === 'simpleSlides') {
            for (const idxFrom of diffIdxs) {
                if (currBoard[idxFrom] != '-') {
                    for (const idxTo of diffIdxs) {
                        if (currBoard[idxFrom] == nextBoard[idxTo]) {
                            slides.push([idxFrom, idxTo]);
                            i = fadeOutIdxs.indexOf(idxFrom);
                            if (i !== -1) fadeOutIdxs.splice(i, 1);
                            i = fadeInIdxs.indexOf(idxTo);
                            if (i !== -1) fadeInIdxs.splice(i, 1);
                            break;
                        }
                    }
                }
            }
        }

        /* BEGIN Text entity fadein and fadeout index handling */
        let currTextIndices = []
        for (i = 0; i < currBoard.length; i++) {
            if (currBoard[i] === ".") currTextIndices.push(i);
        }
        let currTextEntities: Record<number, string> = {};
        for (i = 1; i < currEntityStringParts.length && i <= currTextIndices.length; i++) {
            currTextEntities[currTextIndices[i - 1]] = currEntityStringParts[i];
        }

        let nextTextIndices = []
        for (i = 0; i < nextBoard.length; i++) {
            if (nextBoard[i] === ".") nextTextIndices.push(i);
        }
        let nextTextEntities: Record<number, string> = {};
        for (i = 1; i < nextEntityStringParts.length && i <= nextTextIndices.length; i++) {
            nextTextEntities[nextTextIndices[i - 1]] = nextEntityStringParts[i];
        }

        for (let k of currTextIndices) {
            if (!(k in nextTextEntities) || currTextEntities[k] !== nextTextEntities[k]) {
                fadeOutIdxs.push(k);
            }
        }
        var textFadeInIdxs = [];
        for (let k of nextTextIndices) {
            if (!(k in currTextEntities) || currTextEntities[k] !== nextTextEntities[k]) {
                textFadeInIdxs.push(k);
            }
        }
        /* END Text entity fadein and fadeout index handling */

        if (store.getters.currentGameId === "kayles") {
            // TEMPORARY; WILL REMOVE THIS SPECIAL HANDLING FOR KAYLES WHEN CUSTOM ANIMATIONS ARE IMPLEMENTED
            for (i of fadeOutIdxs) {
                gsap.fromTo("#entity" + i, {scale: 1, rotation: 0, transformOrigin: "center center"},
                {duration: 0.5, scale: 0, rotation: 540, transformOrigin: "center center"});
            }
            return 500;
        }

        for (i of fadeOutIdxs) { // Play fade-out animations
            gsap.fromTo("#entity" + i, {autoAlpha: 1}, {duration: 0.5, autoAlpha: 0});
        }

        var newElement;
        for (i of fadeInIdxs) { // Spawn image entities that'll fade in, but don't play fade-in animation yet
            newElement = spawnImageEntity(nextBoard[i], i, centers, entities, widthFactor);
            newElement.setAttribute("class", "appearingEntity");
            newElement.setAttribute("opacity", "0");
            g.appendChild(newElement);
        }
        for (i of textFadeInIdxs) { // Spawn text entities that'll fade in, but don't play fade-in animation yet
            newElement = document.createElementNS("http://www.w3.org/2000/svg", 'text');
            newElement.setAttribute("x", centers[i][0].toString());
            newElement.setAttribute("y", centers[i][1].toString());
            newElement.setAttribute("alignment-baseline", "middle");
            newElement.setAttribute("text-anchor", "middle");
            newElement.setAttribute("style", "font-size: " + textEntityFontSize + "px;font-family: Arial, Helvetica, sans-serif;");
            newElement.appendChild(document.createTextNode(nextTextEntities[i]));
            newElement.setAttribute("class", "appearingEntity");
            newElement.setAttribute("opacity", "0");
            g.appendChild(newElement);
        }

        for (const slide of slides) { // Play sliding animations
            const idxFrom = slide[0];
            const toCoords = centers[slide[1]];
            const fromCoords = centers[idxFrom];
            gsap.fromTo("#entity" + idxFrom, {autoAlpha: 1}, {duration: 0.001, autoAlpha: 0});
            newElement = spawnImageEntity(currBoard[idxFrom], idxFrom, centers, entities, widthFactor);
            newElement.setAttribute("id", "movingEntity" + idxFrom);
            g.appendChild(newElement);
            gsap.to("#movingEntity" + idxFrom, {duration: 0.5, x: toCoords[0] - fromCoords[0], y: toCoords[1] - fromCoords[1]});
        }

        if (foregroundImagePath !== "") { // Redraw foreground image in front of any newly introduced entities
            var newForegroundElement = document.createElementNS("http://www.w3.org/2000/svg", 'image');
            newForegroundElement.setAttribute("width", scaledWidth.toString());
            newForegroundElement.setAttribute("height", scaledHeight.toString());
            newForegroundElement.setAttribute("href", getImageSource(foregroundImagePath));
            g.appendChild(newForegroundElement);
        }
        if (fadeInIdxs.length > 0 || textFadeInIdxs.length > 0) { // Play fade-in animations
            gsap.fromTo(".appearingEntity", {opacity: 0.001}, {duration: 0.5, opacity: 1});
        }
        return 500;
    } else if (animationType === "custom") {
        console.log("Custom");
    }
    return 0;
}

export const handleMoveAnimation = (volume: number, currentMatch: Types.Match, moveObj: Types.Move) => {
    const currPosition = currentMatch.round.position.autoguiPosition;
    const nextPosition = moveObj.autoguiPosition;
    if (currentMatch.gameId === 'tictactoe') {
        return animateTTT(volume, moveObj);
    } else if (currentMatch.gameId === 'sim') {
        return animateSim(volume, moveObj);
    } else if (currentMatch.gameId === 'quarto') {
        return animateQuarto(volume, currPosition, nextPosition);
    } else {
        const store = useStore();
        const imageAutoGUIData = store.getters.imageAutoGUIData(store.getters.currentGameId, store.getters.currentVariantId);
        if (imageAutoGUIData != null) {
            var theTheme = imageAutoGUIData.themes[store.getters.currentGameTheme];
            const sounds = theTheme.sounds || {} as Record<string, string>;
            var duration = animateImageAutoGUI(currPosition, nextPosition);
            let matches;
            if (matches = moveObj.autoguiMove.match(/^([AMLT])_([a-zA-Z0-9-]+)_([a-zA-Z0-9-]+)_([a-zA-Z0-9-]+)*/)) {
                if (matches[4] in sounds) {
                    playMoveSFX(sounds[matches[4]]);
                }
            }
            return duration;
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
    if (currentMatch.gameId === 'tictactoe') {
        return; // todo
    } else if (currentMatch.gameId === 'sim') {
        return; // todo
    } else if (currentMatch.gameId === 'quarto') {
        if (document.getElementById("toPlace")) {
            gsap.to("#toPlace", {duration: 0.001, x: 58, y: 113});
        }
        if (document.getElementById("animationForeground")) {
            document.getElementById("animationForeground")!.remove();
        }
    } else {
        const store = useStore();
        const imageAutoGUIData = store.getters.imageAutoGUIData(store.getters.currentGameId, store.getters.currentVariantId);
        if (imageAutoGUIData != null) {
            // Note: gsap.set() is unreliable (only achieves the reset as intended
            // 50% of the time for some reason) so we use fromTo instead 
            var entities = document.getElementsByClassName('entity');
            if (entities.length > 0) {
                gsap.fromTo(".entity", {autoAlpha: 0}, {duration: 0.001, autoAlpha: 1});
            }
            if (document.getElementById("animationForeground")) {
                document.getElementById("animationForeground")!.remove();
            }
        }
    }
}