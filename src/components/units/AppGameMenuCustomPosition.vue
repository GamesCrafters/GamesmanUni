<template>
    <div id="customPos">
        <button id="info" @click="showInfo">𝓲</button>
        <input v-model="text" id="inputPos" placeholder="Enter positions of game">
        <button id="submit" @click="doSomething()">Submit</button>
        <p id="infoText">Instructions on how to format the move history...</p>
        <div id="fileUpload">
            <AppGameMenuCustomPositionFileUpload/>
        </div>

    </div>

</template>


<script lang="ts" setup>
    import { computed } from "vue";
    import { onBeforeRouteLeave, useRoute } from "vue-router";
    import { actionTypes, useStore } from "../../scripts/plugins/store";
    import AppGameMenu from "./AppGameMenu.vue";
    import AppGameMenuCustomPositionFileUpload from "./AppGameMenuCustomPositionFileUpload.vue";

    const doSomething = () => {
        let elem = document.getElementById("inputPos").value;
        alert(elem);
    }

    const showInfo = () => {
        let element = document.getElementById("infoText")
        if (element.style.display === "none") {
            element.style.display = "block";
        } else {
            element.style.display = "none";
        }
    }

</script>

<style lang="scss" scoped>
    #customPos {
        margin: 2rem;
        align: center;
        text-align: center;

        #info {
            border-radius: 1rem;
            border: 0.1rem solid var(--neutralColor);
            margin-right: 1.5rem;
            padding: 0.5rem;
        }

        #infoText {
           padding: 1rem;
           text-align: center;
           display: none;
        }

        #inputPos {
            border-radius: 1rem;
            border: 0.1rem solid var(--neutralColor);
            float: center;
            padding: 1rem;
            align-border: center;
            justify-content: space-around;
            border-spacing: 5rem;
        }
        #submit {
            padding: 0.5rem;
            margin-left: 1rem;
            border: 0.1rem solid var(--neutralColor);

        }

    }

</style>