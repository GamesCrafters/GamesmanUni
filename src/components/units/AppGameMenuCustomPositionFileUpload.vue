<template>
    <p id="or">or</p>
    <input id="input-file" type="file">
    <button id="upload" @click="getFile()">Upload</button>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import { onBeforeRouteLeave, useRoute } from "vue-router";
    import { actionTypes, useStore } from "../../scripts/plugins/store";

    const getFile = () => {
        const inputFile = document.getElementById("input-file").files[0];
        const reader = new FileReader();
        reader.readAsText(inputFile);
        reader.onload = function() {
            console.log(reader.result);
            alert(reader.result);
        };
        reader.onerror = function() {
            console.log(reader.error);
            alert(reader.error);
        };
    }


    const readFileUpload= () => {
        let elem = document.getElementById("input-file").value;
        alert(elem);
    }

</script>

<style scoped>
    #or {
        padding-top: 1rem;
        text-align: center;

    }
    #input-file {
        margin-left: 2rem;
        padding: 1rem;
        padding-top: 1rem;
        float: center;
        align-border: center;
        justify-content: space-around;
        width: 15rem;
        text: 1rem;


    }
    #upload {
        padding: 0.5rem;
        border: 0.1rem solid var(--neutralColor);


    }
</style>