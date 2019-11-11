<template>
  <div id="app-popup-window">
    <div class="popup-window-mask">
      <div class="popup-window-wrapper">
        <div class="popup-window-container">
          <div class="popup-window-content">
            <slot name="content">default content</slot>
            <button class="popup-window-close-button" @click="$emit('close')">
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class PopupWindow extends Vue {}
</script>

<style scoped lang="scss">
.popup-window-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  display: table;
}

.popup-window-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.popup-window-container {
  width: 80%;
  height: 90%;
  overflow: auto;
  margin: auto;
  padding: 5%;
  background-color: var(--backgroundColor);
  border-radius: 2em;
}

.popup-window-close-button {
  float: right;
}
</style>
