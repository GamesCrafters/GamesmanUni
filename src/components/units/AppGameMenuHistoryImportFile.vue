<template>
    <div id="app-game-menu-history-import-file">
        <input type="file" accept=".txt" v-on:change="onFileChange" />
    </div>
</template>

<script lang="ts" setup>
    import { actionTypes, useStore } from "../../scripts/plugins/store";
    interface HTMLInputEvent extends Event {
        target: HTMLInputElement & EventTarget
    };
    const store = useStore();
    const readHistoryFromFile = (file: File) => {
        if (!file) return;
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
            if (typeof reader.result === "string") {
                store.dispatch(actionTypes.loadMoveHistory, { history: reader.result });
            }
        };
        reader.onerror = () => {
            console.log(reader.error);
            alert(reader.error);
        };
    };
    const onFileChange = (e: HTMLInputEvent) => {
        if (!e.target || !e.target.files) return;
        readHistoryFromFile(e.target.files[0]);
    };
</script>

<style lang="scss" scoped>
    // #app-game-menu-history-import-file {
        // #input-file {
        //     margin-left: 2rem;
        //     padding: 1rem;
        //     padding-top: 1rem;
        //     float: center;
        //     justify-content: space-around;
        //     width: 15rem;
        // }
        // #upload {
        //     padding: 0.5rem;
        //     border: 0.1rem solid var(--neutralColor);
        // }
    // }
</style>
