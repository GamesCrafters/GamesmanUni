<!-- <template>
  <div id="app-game-board">
    <component :is="getGameBoardComponentName()"></component>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { CGame } from "@/classes/CGame";
import GDefault from "@/components/gameBoards/GDefault.vue";
import GDnbRegular from "@/components/gameBoards/GDnbRegular.vue";
import GFoxesRegular from "@/components/gameBoards/GFoxesRegular.vue";
import GSimRegular from "@/components/gameBoards/GSimRegular.vue";
import GSnakeRegular from "@/components/gameBoards/GSnakeRegular.vue";
import GTenRegular from "@/components/gameBoards/GTenRegular.vue";
import GTttMisere from "@/components/gameBoards/GTttMisere.vue";
import GTttRegular from "@/components/gameBoards/GTttRegular.vue";
import GMancalaRegular from "@/components/gameBoards/GMancalaRegular.vue";
import GDaoRegular from "@/components/gameBoards/GDaoRegular.vue";

@Component({
  components: {
    GDefault,
    GDnbRegular,
    GFoxesRegular,
    GSimRegular,
    GSnakeRegular,
    GTenRegular,
    GTttMisere,
    GTttRegular,
    GMancalaRegular,
    GDaoRegular,
  },
})
export default class GameBoard extends Vue {
  getGameBoardComponentName(): string {
    const gameId: string = this.$store.getters.gameId;
    const gameName: string = this.$store.getters.gameName;
    const variantId: string = this.$store.getters.variantId;
    try {
      if (
        require("@/components/gameBoards/G" +
          gameId[0].toUpperCase() +
          gameId.slice(1) +
          variantId[0].toUpperCase() +
          variantId.slice(1))
      ) {
        return (
          "G" +
          gameId[0].toUpperCase() +
          gameId.slice(1) +
          variantId[0].toUpperCase() +
          variantId.slice(1)
        );
      }
    } catch (errorMessage) {
      console.warn(
        `Game board GUI for "${gameName}" does not exist yet. Default data visualizer is loaded instead.`
      );
    }
    return "GDefault";
  }
}
</script> -->
