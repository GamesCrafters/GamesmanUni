<template>
    <div id="menu">
        <h1> Menu </h1>
        <div id="menuItems">
            <button id="vvh" class="items" onclick="showItem(vvh)">
                <p> Visual Value History </p>
            </button>
            <button id="analysis" class="items" onclick="showItem(analysis)">
                <p> Analysis </p>
            </button>
            <button id="customPos" class="items" onclick="showItem(customPos)">
                <p> Custom Position </p>
            </button>
        </div>
        <div id="AppGameVvh">
            <AppGameVvh/>
        </div>

    </div>

</template>

<script lang="ts" setup>
    import { computed, ref } from "vue";
    import { actionTypes, useStore } from "../../scripts/plugins/store";
    import AppGameVvh from "./AppGameVvh.vue";
    const store = useStore();

    function showItem(ID) {
        var element = document.getElementById("AppGameVvh");
        if (ID === "vvh"){
            if (element.style.display === "none") {
                element.style.display = "block"
            } else {
                element.style.display = "none"
            }
        }
    }

</script>

<style lang="scss" scoped>
    #menu {
        align-content: normal;
        align-items: stretch;
        flex: 3 1 auto;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        justify-content: flex-start;


        border-radius: 1rem;
        border: 0.1rem solid var(--neutralColor);
        padding: 4rem;


        #menuItems {
            border-radius: 1rem;
            border: 0.1rem solid var(--neutralColor);
            padding: 1rem;
            align-items: center;
            align-content: center;
            justify-content: center;
            padding-left: 20rem;
            padding-right: 10rem;
            justify-content: space-around;

            #vvh {
                border-radius: 1rem;
                border: 0.1rem solid var(--neutralColor);
                padding: 1rem;
                float: left;
                align-border: center;
                justify-content: space-around;
                border-spacing: 5rem;
            }
            #analysis {
                border-radius: 1rem;
                border: 0.1rem solid var(--neutralColor);
                padding: 1rem;
                float: left;
                align-border: center;
                justify-content: space-around;
                border-spacing: 5rem;

            }
            #customPos {
                border-radius: 1rem;
                border: 0.1rem solid var(--neutralColor);
                padding: 1rem;
                float: left;
                align-border: center;
                justify-content: space-around;
                border-spacing: 5rem;
            }
        }

    }
</style>
