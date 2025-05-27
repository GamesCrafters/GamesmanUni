
import { useStore } from "../../scripts/plugins/store";
const sfx = import.meta.globEager("../../models/sounds/**/*");
let moveSFX: HTMLAudioElement;
let ambience: HTMLAudioElement;

var moveSFXVolume = 1;
var ambienceVolume = 1;

export const setMoveSFXVolume = (volume: number) => {
    if (moveSFX) {
        moveSFX.volume = volume;
    }
    moveSFXVolume = volume;
}

export const setAmbienceVolume = (volume: number) => {
    if (ambience) {
        ambience.volume = volume;
    }
    ambienceVolume = volume;
}

export const playMoveSFX = (path: string) => {
    moveSFX = new Audio(sfx['../../models/sounds/' + path].default);
    moveSFX.volume = moveSFXVolume;
    moveSFX.play();
}

export const playGameAmbience = () => {
    const store = useStore();
    const imageAutoGUIData = store.getters.imageAutoGUIData(store.getters.currentGameId, store.getters.currentVariantId);

    if (imageAutoGUIData && "ambience" in imageAutoGUIData) {
        ambience = new Audio(sfx['../../models/sounds/' + imageAutoGUIData.ambience].default);
        ambience.volume = ambienceVolume;
        ambience.loop = true;
        ambience.play();
    }
}

export const pauseAllGameSounds = () => {
    if (moveSFX) {
        moveSFX.pause();
    }
    if (ambience) {
        ambience.pause();
    }
}