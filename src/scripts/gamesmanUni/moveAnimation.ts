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
    const currBoard = currPosition.split("_")[4];
    const nextBoard = nextPosition.split("_")[4];
    if (currBoard.length != nextBoard.length) return 0;
    
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
    var i, j;

    var svg = document.getElementById('image-autogui'); //Get svg element
    var g = document.createElementNS("http://www.w3.org/2000/svg", 'g');
    g.setAttribute("id", "animationForeground");
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
            gsap.fromTo("#entity" + appearDisappearIdx, {autoAlpha: 1}, {duration: 0.5, autoAlpha: 0.001});
        } else if (appearing === true && appearDisappearIdx != null) { // Play appearing animation
            var appearingChar = nextBoard[appearDisappearIdx];
            var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'image');
            newElement.setAttribute("class", "appearingEntity");
            newElement.setAttribute("x", (centers[appearDisappearIdx][0] - 0.5 * entities[appearingChar].scale * widthFactor).toString());
            newElement.setAttribute("y", (centers[appearDisappearIdx][1] - 0.5 * entities[appearingChar].scale * widthFactor).toString());
            newElement.setAttribute("width", (entities[appearingChar].scale * widthFactor).toString());
            newElement.setAttribute("height", (entities[appearingChar].scale * widthFactor).toString());
            newElement.setAttribute("href", getImageSource(entities[appearingChar].image));
            newElement.setAttribute("opacity", "0.001");
            g.appendChild(newElement);
            gsap.fromTo(".appearingEntity", {opacity: 0.001}, {duration: 0.5, opacity: 1});
        }

        if (fromIdx != null && toIdx != null) { // Play sliding animation
            const toCoords = centers[toIdx];
            const fromCoords = centers[fromIdx];
            gsap.fromTo("#entity" + fromIdx, {autoAlpha: 1}, {duration: 0.001, autoAlpha: 0.001});

            var movingChar = currBoard[fromIdx];
            var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'image');
            newElement.setAttribute("class", "movingEntity");
            newElement.setAttribute("x", (centers[fromIdx][0] - 0.5 * entities[movingChar].scale * widthFactor).toString());
            newElement.setAttribute("y", (centers[fromIdx][1] - 0.5 * entities[movingChar].scale * widthFactor).toString());
            newElement.setAttribute("width", (entities[movingChar].scale * widthFactor).toString());
            newElement.setAttribute("height", (entities[movingChar].scale * widthFactor).toString());
            newElement.setAttribute("href", getImageSource(entities[movingChar].image));
            g.appendChild(newElement);
            gsap.to(".movingEntity", {duration: 0.5, x: toCoords[0] - fromCoords[0], y: toCoords[1] - fromCoords[1]});
        }
        if (foregroundImagePath !== "") { // Redraw foreground image in front of any newly introduced entities
            var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'image');
            newElement.setAttribute("width", scaledWidth.toString());
            newElement.setAttribute("height", scaledHeight.toString());
            newElement.setAttribute("href", getImageSource(foregroundImagePath));
            g.appendChild(newElement);
        }
        let matches;
        if (matches = moveObj.move.match(/^([AML])_([a-zA-Z0-9-]+)_([a-zA-Z0-9-]+)_([a-zA-Z0-9-]+)*/)) {
            if (Object.keys(sounds).includes(matches[4])) {
                playAudio(sounds[matches[4]], volume);
            }
        }
        return 500;
    } else if (animationType === "entityFade") {
        var entitiesAppear = false;
        for (i = animationWindow[0]; i < animationWindow[1]; i++) {
            if (currBoard[i] != nextBoard[i]) {
                if (currBoard[i] != '-') { // Entity originally at center i shall fade out
                    gsap.fromTo("#entity" + i, {autoAlpha: 1}, {duration: 0.5, autoAlpha: 0.001});
                } 
                if (nextBoard[i] != '-') { // Entity that will be at center i shall fade in
                    entitiesAppear = true;
                    var appearingChar = nextBoard[i];
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
            if (Object.keys(sounds).includes(matches[4])) {
                playAudio(sounds[matches[4]], volume);
            }
        }
        return 500;
    } else if (animationType === "multipleSlides") {
        for (i = animationWindow[0]; i < animationWindow[1]; i++) {
            if (currBoard[i] != nextBoard[i]) {
                diffIdxs.push(i);
            }
        }

        var slides = [];
        var slideIdxs = [];
        for (const idx1 of diffIdxs) {
            if (currBoard[idx1] != '-') {
                for (const idx2 of diffIdxs) {
                    if (currBoard[idx1] == nextBoard[idx2]) {
                        slides.push([idx1, idx2]);
                        slideIdxs.push(idx1);
                        slideIdxs.push(idx2);
                        break;
                    }
                }
            }
        }

        var interpolateIdxs = [];
        for (const idx1 of diffIdxs) {
            if (!slideIdxs.includes(idx1)) {
                interpolateIdxs.push(idx1);
            }
        }

        // Interpolate animation
        for (const i of interpolateIdxs) {
            if (currBoard[i] != '-') { // Entity originally at i shall fade out
                gsap.fromTo("#entity" + i, {autoAlpha: 1}, {duration: 0.5, autoAlpha: 0.001});
            } 
            if (nextBoard[i] != '-') { // Entity that will be at i shall fade in
                var appearingChar = nextBoard[i];
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
            fromIdx = slide[0];
            toIdx = slide[1];
            const toCoords = centers[toIdx];
            const fromCoords = centers[fromIdx];
            gsap.fromTo("#entity" + fromIdx, {autoAlpha: 1}, {duration: 0.001, autoAlpha: 0.001});

            var movingChar = currBoard[fromIdx];
            var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'image');
            newElement.setAttribute("id", "movingEntity" + fromIdx);
            newElement.setAttribute("x", (centers[fromIdx][0] - 0.5 * entities[movingChar].scale * widthFactor).toString());
            newElement.setAttribute("y", (centers[fromIdx][1] - 0.5 * entities[movingChar].scale * widthFactor).toString());
            newElement.setAttribute("width", (entities[movingChar].scale * widthFactor).toString());
            newElement.setAttribute("height", (entities[movingChar].scale * widthFactor).toString());
            newElement.setAttribute("href", getImageSource(entities[movingChar].image));
            g.appendChild(newElement);
            gsap.to("#movingEntity" + fromIdx, {duration: 0.5, x: toCoords[0] - fromCoords[0], y: toCoords[1] - fromCoords[1]});
        }

        if (foregroundImagePath !== "") { // Redraw foreground image in front of any newly introduced entities
            var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'image');
            newElement.setAttribute("width", scaledWidth.toString());
            newElement.setAttribute("height", scaledHeight.toString());
            newElement.setAttribute("href", getImageSource(foregroundImagePath));
            g.appendChild(newElement);
        }
        gsap.fromTo(".appearingEntity", {opacity: 0.001}, {duration: 0.5, opacity: 1});
        let matches;
        if (matches = moveObj.move.match(/^([AML])_([a-zA-Z0-9-]+)_([a-zA-Z0-9-]+)_([a-zA-Z0-9-]+)*/)) {
            if (Object.keys(sounds).includes(matches[4])) {
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
            gsap.to(".entity", {duration: 0.001, opacity: 1});
            if (document.getElementById("animationForeground")) {
                document.getElementById("animationForeground")!.remove();
            }
        }
    }
}