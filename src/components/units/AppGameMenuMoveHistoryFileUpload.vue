<template>
    <!-- <p id="app-game-menu-moveHistory-fileUpload">or</p> -->
    <input type="file" accept=".txt" v-on:change="onFileChange">
</template>

<script lang="ts" setup>
    interface HTMLInputEvent extends Event {
        target: HTMLInputElement & EventTarget
    }
    const readHistoryFromFile = (file: File) => {
        if (!file) return;
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function() {
            console.log(reader.result);
            alert(reader.result);
        };
        reader.onerror = function() {
            console.log(reader.error);
            alert(reader.error);
        };
    }
    const onFileChange = (e: HTMLInputEvent) => {
        if (!e.target || !e.target.files) return;
        readHistoryFromFile(e.target.files[0]);
    }
</script>

<style lang="scss" scoped>
// #or {
//     padding-top: 1rem;
//     text-align: center;

// }
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
</style>