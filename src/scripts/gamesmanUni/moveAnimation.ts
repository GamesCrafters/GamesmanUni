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

const animateImageAutoGUI = (volume: number, currPosition: string, nextPosition: string, moveObj: Types.Move): number => {
    var currBoard = currPosition.split("_")[4];
    var nextBoard = nextPosition.split("_")[4];

    // Append dashes to make currBoard and nextBoard have same length, if one of them is shorter
    var lengthDiff = currBoard.length - nextBoard.length;
    if (lengthDiff > 0) {
        nextBoard = nextBoard.concat('-'.repeat(lengthDiff))
    } else if (lengthDiff < 0) {
        currBoard = currBoard.concat('-'.repeat(-lengthDiff));
    }

    const store = useStore();
    const imageAutoGUIData = store.getters.imageAutoGUIData(store.getters.currentGameType, store.getters.currentGameId, store.getters.currentVariantId);
    const currentTheme = store.getters.currentGameTheme;
    const theTheme = imageAutoGUIData.themes[currentTheme];
    const scaledWidth = 100;
    const backgroundGeometry = theTheme.space;
    const widthFactor = scaledWidth / backgroundGeometry[0];
    const scaledHeight = backgroundGeometry[1] * widthFactor;
    const animationType = theTheme.animationType || "";
    const entities = theTheme.entities;
    const sounds = theTheme.sounds || {} as Record<string, string>;
    const centers = theTheme.centers.map((a: [number, number]) => a.map((b: number) => b * widthFactor));
    const getImageSource = (imagePath: string) => gimages["../../models/images/svg/" + imagePath].default;
    const foregroundImagePath = theTheme.foreground || "";
    const animationWindow = theTheme.defaultAnimationWindow || [0, currBoard.length];

    var diffIdxs = [];
    var i;
    var entitiesAppear = false;

    var svg = document.getElementById('image-autogui'); //Get svg element
    var g = document.createElementNS("http://www.w3.org/2000/svg", 'g');
    g.setAttribute("id", "animationForeground");
    svg!.appendChild(g);

    if (animationType === "entityFade") {
        for (i = animationWindow[0]; i < animationWindow[1]; i++) {
            if (currBoard[i] != nextBoard[i]) {
                if (currBoard[i] != '-' && currBoard[i] in entities) { // Entity originally at center i shall fade out
                    gsap.fromTo("#entity" + i, {autoAlpha: 1}, {duration: 0.5, autoAlpha: 0.001});
                } 
                if (nextBoard[i] != '-') { // Entity that will be at center i shall fade in
                    var appearingChar = nextBoard[i];
                    if (appearingChar in entities) {
                        entitiesAppear = true;
                        var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'image');
                        newElement.setAttribute("class", "appearingEntity");
                        newElement.setAttribute("x", (centers[i][0] - 0.5 * entities[appearingChar].scale * widthFactor).toString());
                        newElement.setAttribute("y", (centers[i][1] - 0.5 * entities[appearingChar].scale * widthFactor).toString());
                        newElement.setAttribute("width", (entities[appearingChar].scale * widthFactor).toString());
                        newElement.setAttribute("height", (entities[appearingChar].scale * widthFactor).toString());
                        newElement.setAttribute("href", getImageSource(entities[appearingChar].image));
                        newElement.setAttribute("opacity", "0.001");
                        g.appendChild(newElement);
                    }
                }
            }
        }
        if (foregroundImagePath !== "") { // Redraw foreground image in front of any newly introduced entities
            var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'image');
            newElement.setAttribute("width", scaledWidth.toString());
            newElement.setAttribute("height", scaledHeight.toString());
            newElement.setAttribute("href", getImageSource(foregroundImagePath));
            g.appendChild(newElement);
        }
        if (entitiesAppear) {
            gsap.fromTo(".appearingEntity", {opacity: 0.001}, {duration: 0.5, opacity: 1});
        }
        let matches;
        if (matches = moveObj.move.match(/^([AML])_([a-zA-Z0-9-]+)_([a-zA-Z0-9-]+)_([a-zA-Z0-9-]+)*/)) {
            if (matches[4] in sounds) {
                playAudio(sounds[matches[4]], volume);
            }
        }
        return 500;
    } else if (animationType === "simpleSlides") {
        for (i = animationWindow[0]; i < animationWindow[1]; i++) {
            if (currBoard[i] != nextBoard[i]) {
                diffIdxs.push(i);
            }
        }

        var slides = [];
        var fadeOutIdxs = diffIdxs.filter((idx) => currBoard[idx] != '-');
        var fadeInIdxs = diffIdxs.filter((idx) => nextBoard[idx] != '-');
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

        for (i of fadeOutIdxs) {
            if (currBoard[i] in entities) {
                gsap.fromTo("#entity" + i, {autoAlpha: 1}, {duration: 0.5, autoAlpha: 0.001});
            }
        }
        for (i of fadeInIdxs) {
            var appearingChar = nextBoard[i];
            if (appearingChar in entities) {
                entitiesAppear = true;
                var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'image');
                newElement.setAttribute("class", "appearingEntity");
                newElement.setAttribute("x", (centers[i][0] - 0.5 * entities[appearingChar].scale * widthFactor).toString());
                newElement.setAttribute("y", (centers[i][1] - 0.5 * entities[appearingChar].scale * widthFactor).toString());
                newElement.setAttribute("width", (entities[appearingChar].scale * widthFactor).toString());
                newElement.setAttribute("height", (entities[appearingChar].scale * widthFactor).toString());
                newElement.setAttribute("href", getImageSource(entities[appearingChar].image));
                newElement.setAttribute("opacity", "0.001");
                g.appendChild(newElement);
            }
        }

        for (const slide of slides) { // Play sliding animations
            const idxFrom = slide[0];
            const idxTo = slide[1];
            const toCoords = centers[idxTo];
            const fromCoords = centers[idxFrom];

            var movingChar = currBoard[idxFrom];
            if (movingChar in entities) {
                gsap.fromTo("#entity" + idxFrom, {autoAlpha: 1}, {duration: 0.001, autoAlpha: 0.001});
                var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'image');
                newElement.setAttribute("id", "movingEntity" + idxFrom);
                newElement.setAttribute("x", (fromCoords[0] - 0.5 * entities[movingChar].scale * widthFactor).toString());
                newElement.setAttribute("y", (fromCoords[1] - 0.5 * entities[movingChar].scale * widthFactor).toString());
                newElement.setAttribute("width", (entities[movingChar].scale * widthFactor).toString());
                newElement.setAttribute("height", (entities[movingChar].scale * widthFactor).toString());
                newElement.setAttribute("href", getImageSource(entities[movingChar].image));
                g.appendChild(newElement);
                gsap.to("#movingEntity" + idxFrom, {duration: 0.5, x: toCoords[0] - fromCoords[0], y: toCoords[1] - fromCoords[1]});
            }
        }

        if (foregroundImagePath !== "") { // Redraw foreground image in front of any newly introduced entities
            var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'image');
            newElement.setAttribute("width", scaledWidth.toString());
            newElement.setAttribute("height", scaledHeight.toString());
            newElement.setAttribute("href", getImageSource(foregroundImagePath));
            g.appendChild(newElement);
        }
        if (fadeInIdxs.length > 0) {
            gsap.fromTo(".appearingEntity", {opacity: 0.001}, {duration: 0.5, opacity: 1});
        }
        let matches;
        if (matches = moveObj.move.match(/^([AML])_([a-zA-Z0-9-]+)_([a-zA-Z0-9-]+)_([a-zA-Z0-9-]+)*/)) {
            if (matches[4] in sounds) {
                playAudio(sounds[matches[4]], volume);
            }
        }
        return 500
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
        const imageAutoGUIData = store.getters.imageAutoGUIData(store.getters.currentGameType, 
            store.getters.currentGameId, store.getters.currentVariantId);
        if (imageAutoGUIData != null) {
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
        if (document.getElementById("animationForeground")) {
            document.getElementById("animationForeground")!.remove();
        }
    } else {
        const store = useStore();
        const imageAutoGUIData = store.getters.imageAutoGUIData(store.getters.currentGameType, 
            store.getters.currentGameId, store.getters.currentVariantId);
        if (imageAutoGUIData != null) {
            // Note: gsap.set() is unreliable (only achieves the reset as intended
            // 50% of the time for some reason) so we use fromTo instead 
            var entities = document.getElementsByClassName('entity');
            if (entities.length > 0) {
                gsap.to(".entity", {duration: 0.001, opacity: 1});
            }
            if (document.getElementById("animationForeground")) {
                document.getElementById("animationForeground")!.remove();
            }
        }
    }
}