<template>
    <div id="customPos">
        <input v-model="text" id="inputPos" placeholder="Enter positions of game">
        <button id="submit" @click="doSomething()">Submit</button>
    </div>

</template>


<script lang="ts" setup>
    import { computed } from "vue";
    import { onBeforeRouteLeave, useRoute } from "vue-router";
    import { actionTypes, useStore } from "../../scripts/plugins/store";
    import AppGameMenu from "./AppGameMenu.vue";

    const doSomething = () => {
        let elem = document.getElementById("inputPos").value;
        alert(elem);
    }

</script>

<style lang="scss" scoped>
    #customPos {
        margin: 2rem;
        align: center;
        text-align: center;

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