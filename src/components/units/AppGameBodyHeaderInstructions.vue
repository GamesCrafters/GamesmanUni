<template>
    <div id="app-game-body-header-instructions">
        <button @click="store.commit(mutationTypes.showInstructions, true)">𝓲</button>
        <UniPopupWindow v-if="options && options.showInstructions" @close="store.commit(mutationTypes.showInstructions, false)">
            <VueMarkdownIt class="c-markdown" :break="true" :linkify="true" :plugins="plugins" :source="instructions" />
        </UniPopupWindow>
    </div>
</template>

<script lang="ts" setup>
    import { computed } from "vue";
    import VueMarkdownIt from "vue3-markdown-it";
    import MarkdownItLinkAttributes from "markdown-it-link-attributes";
    import { mutationTypes, useStore } from "../../scripts/plugins/store";
    import UniPopupWindow from "../templates/UniPopupWindow.vue";
    
    import ZeroToNCnSource from "../../models/docs/cn/gameInstructions/0ton.md?raw";
    import ThreeSpotCnSource from "../../models/docs/cn/gameInstructions/3spot.md?raw";
    import NineMensMorrisCnSource from "../../models/docs/cn/gameInstructions/369mm.md?raw";
    import AbaloneCnSource from "../../models/docs/cn/gameInstructions/abalone.md?raw";
    import AchiCnSource from "../../models/docs/cn/gameInstructions/achi.md?raw";
    import BaghchalCnSource from "../../models/docs/cn/gameInstructions/baghchal.md?raw";
    import Connect4CnSource from "../../models/docs/cn/gameInstructions/connect4.md?raw";
    import CtoiCnSource from "../../models/docs/cn/gameInstructions/ctoi.md?raw";
    import DaoCnSource from "../../models/docs/cn/gameInstructions/dao.md?raw";
    import LgameCnSource from "../../models/docs/cn/gameInstructions/Lgame.md?raw";
    import MancalaCnSource from "../../models/docs/cn/gameInstructions/mancala.md?raw";
    import NToZeroCnSource from "../../models/docs/cn/gameInstructions/nto0.md?raw";
    import OOECnSource from "../../models/docs/cn/gameInstructions/ooe.md?raw";
    import OthelloCnSource from "../../models/docs/cn/gameInstructions/othello.md?raw";
    import QuickChessCnSource from "../../models/docs/cn/gameInstructions/quickchess.md?raw";
    import SimCnSource from "../../models/docs/cn/gameInstructions/sim.md?raw";
    import SnakeCnSource from "../../models/docs/cn/gameInstructions/snake.md?raw";
    import STTCnSource from "../../models/docs/cn/gameInstructions/stt.md?raw";
    import SwansCnSource from "../../models/docs/cn/gameInstructions/swans.md?raw";
    import TTTCnSource from "../../models/docs/cn/gameInstructions/ttt.md?raw";
    import TTT3DCnSource from "../../models/docs/cn/gameInstructions/ttt3d.md?raw";

    const store = useStore();
    const options = computed(() => store.getters.options);
    const instructions = computed(() => {
        let currGameType = store.getters.currentGameType;
        let currGameId = store.getters.currentGameId;
        let game = store.getters.game(currGameType, currGameId);
        switch (store.getters.locale) {
            case "en": case "en-US":
                return game ? game.instructions : "";

            case "cn":
                switch (currGameId) {
                    case "0ton": return ZeroToNCnSource;
                    case "369mm": return NineMensMorrisCnSource;
                    case "3spot": return ThreeSpotCnSource;
                    case "abalone": return AbaloneCnSource;
                    case "achi": return AchiCnSource;
                    case "baghchal": return BaghchalCnSource;
                    case "connect4": return Connect4CnSource;
                    case "ctoi": return CtoiCnSource;
                    case "dao": return DaoCnSource;
                    case "Lgame": return LgameCnSource;
                    case "mancala": return MancalaCnSource;
                    case "nto0": return NToZeroCnSource;
                    case "ooe": return OOECnSource;
                    case "othello": return OthelloCnSource;
                    case "quickchess": return QuickChessCnSource;
                    case "sim": return SimCnSource;
                    case "snake": return SnakeCnSource;
                    case "stt": return STTCnSource;
                    case "swans": return SwansCnSource;
                    case "ttt": return TTTCnSource;
                    case "ttt3d": return TTT3DCnSource;
                    default: return game ? game.instructions : "";
                }

            default:
                break;
        }
        return "";
    })

    const plugins = [
        {
            plugin: MarkdownItLinkAttributes,
            options: {
                attrs: {
                    target: "_blank",
                    rel: "noopener noreferrer nofollow",
                },
            },
        },
    ];
</script>

<style lang="scss" scoped>
    #app-game-body-header-instructions {
        button {
            border-radius: 100%;
            font-size: 2rem;
            height: max(2.5rem, min(5vh, 5vw));
            width: max(2.5rem, min(5vh, 5vw));
        }
    }
</style>
