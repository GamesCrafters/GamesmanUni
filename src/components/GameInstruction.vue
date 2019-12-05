<template>
  <div id="app-game-instruction">
    <button
      id="app-game-instruction-button"
      @click="options.setGameInstructionVisibility(true)"
    >
      𝓲
    </button>
    <PopupWindow
      id="app-game-instruction-popup"
      v-if="options.getGameInstructionVisibility()"
      @close="hideGameInstruction()"
    >
      <div slot="content">
        <ExternalMarkdown
          class="c-markdown"
          :relativePath="`gameInstructions/${game.getId()}.md`"
        ></ExternalMarkdown>
      </div>
    </PopupWindow>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { CGame } from "@/classes/CGame";
import { COptions } from "@/classes/COptions";
import ExternalMarkdown from "@/components/ExternalMarkdown.vue";
import PopupWindow from "@/components/PopupWindow.vue";
@Component({
  components: {
    ExternalMarkdown,
    PopupWindow
  }
})
export default class gameInstruction extends Vue {
  get game(): CGame {
    return this.$store.getters.game;
  }
  get options(): COptions {
    return this.$store.getters.options;
  }
  hideGameInstruction(): void {
    this.$store.commit("gameInstructionVisibility", false);
  }
}
</script>
