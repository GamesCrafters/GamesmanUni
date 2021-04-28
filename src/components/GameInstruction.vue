<!-- <template>
    <button @click="togglePopup()">𝓲</button>
    <PopupWindow v-if="openGameInstructionPopup" @close="togglePopup()">
        <div slot="content">
            <ExternalMarkdown
                class="c-markdown"
                :relativePath="`gameInstructions/${route.params.gameId}.md`"
            ></ExternalMarkdown>
        </div>
    </PopupWindow>
</template>

<script lang="ts" setup>
    import { ref } from "vue";
    import ExternalMarkdown from "./ExternalMarkdown.vue";
    import PopupWindow from "./PopupWindow.vue";
    import { useRoute } from "vue-router";

    const route = useRoute();

    const openGameInstructionPopup = ref(false);
    const togglePopup = () =>
        (openGameInstructionPopup.value = !openGameInstructionPopup.value);
</script> -->
