<template>
    <button @click="store.commit(mutationTypes.showInstruction, true)">𝓲</button>
    <PopupWindow v-if="game.options.showInstruction" @close="closeGameInstruction()">
        <ExternalMarkdown class="c-markdown" :relativePath="`gameInstructions-${game.id}.md`"></ExternalMarkdown>
    </PopupWindow>
</template>

<script lang="ts" setup>
    import { ref } from "vue";
    import { mutationTypes, useStore } from "../plugins/store";
    import ExternalMarkdown from "./ExternalMarkdown.vue";
    import PopupWindow from "./PopupWindow.vue";

    const store = useStore();
    const game = ref(store.state.app.game);
    const closeGameInstruction = (): void => {
        store.commit(mutationTypes.showInstruction, false);
        game.value = store.state.app.game;
    };
</script>
