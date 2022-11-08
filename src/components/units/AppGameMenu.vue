<template>
    <div id="menu">
        <h1> Menu </h1>
        <div id="menuItems">
            <button id="vvh" class="items" @click="showItem('vvh')">
                <p> Visual Value History </p>
            </button>

            <button id="analysis" class="items" @click="showItem('analysis')">
                <p> Analysis </p>
            </button>
            <button id="customPos" class="items" @click="showItem('customPos')">
                <p> Custom Position </p>
            </button>
        </div>
        <div id="AppGameVvh" class="visuals">
            <AppGameVvh/>
        </div>
        <div id="analyLogic" class="visuals">
             <p> Coming soon! </p>
        </div>
        <div id="customPosLogic" class="visuals">
            <AppGameMenuCustomPosition/>
        </div>


    </div>

</template>

<script lang="ts" setup>
    import { computed, ref } from "vue";
    import { actionTypes, useStore } from "../../scripts/plugins/store";
    import AppGameVvh from "./AppGameVvh.vue";
    import AppGameMenuCustomPosition from "./AppGameMenuCustomPosition.vue";
    const store = useStore();

    const showItem = (ID) => {
        let vvh = document.getElementById("AppGameVvh");
        let analy = document.getElementById("analyLogic");
        let cusPos = document.getElementById("customPosLogic");

        if (ID === "vvh") {
            let element = vvh;
            if (element.style.display === "none") {
                element.style.display = "block";
            } else {
                element.style.display = "none";
            }
            analy.style.display = "none";
            cusPos.style.display = "none";
        } else if (ID === "analysis") {
            let element = analy;
            if (element.style.display === "none") {
                element.style.display = "block";
            } else {
                element.style.display = "none";
            }
            vvh.style.display = "none";
            cusPos.style.display = "none";
        } else if (ID === "customPos") {
            let element = cusPos;
            if (element.style.display === "none") {
                element.style.display = "block";
            } else {
                element.style.display = "none";
            }
            vvh.style.display = "none";
            analy.style.display = "none";
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
            margin-top: 2rem;
            border-radius: 1rem;
            border: 0.1rem solid var(--neutralColor);
            padding: 1rem;
            align-items: center;
            align-content: center;
            justify-content: center;
            padding-left: 18rem;
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
                margin-right: 1rem;
            }
            #analysis {
                border-radius: 1rem;
                border: 0.1rem solid var(--neutralColor);
                padding: 1rem;
                float: left;
                align-border: center;
                justify-content: space-around;
                border-spacing: 5rem;
                margin-right: 1rem;

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
        div.visuals {
            display: none;
        }

    }
</style>
