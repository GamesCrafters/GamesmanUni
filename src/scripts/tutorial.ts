import { reactive } from "vue";

// Shared between AppGameTutorial.vue (which sets it) and ImageAutoGUI.vue
// (which reads it to restrict/highlight moves). Kept as a plain reactive
// object rather than adding to the Vuex store, since it's ephemeral UI
// state, not match data.
export const tutorialState = reactive({
    // null = no restriction (normal play).
    // "" = no moves allowed (narration-only step).
    // any other string = only that exact AUTOGUI move is clickable.
    allowedMove: null as string | null,
    // Whether the tutorial hid the analysis panel, so leaving the tutorial
    // reopens only a panel it closed, not one the player chose to hide.
    hidMenu: false,
});
