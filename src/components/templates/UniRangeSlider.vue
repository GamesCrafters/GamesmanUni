<template>
    <div id="uni-range-slider">
        <input id="bar" type="range" aria-label="range-slider" :min="min" :max="max" :value="value" />
        <label id="value" for="bar">{{ value }}</label>
    </div>
</template>

<script lang="ts" setup>
    import { ref } from "vue";
    import { defineProps } from "vue";

    defineProps<{ min: number; max: number; value: number }>();
</script>

<style lang="scss" scoped>
    #uni-range-slider {
        > #bar {
            -webkit-appearance: none;
            background: var(--backgroundColor);
            border-radius: 1rem;
            border: 0.1rem solid var(--primaryColor);
            height: 0.5rem;
            margin: 1rem;
            outline: none;
            &::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                background-color: var(--backgroundColor);
                border-radius: 1rem;
                border: 0.1rem solid var(--primaryColor);
                cursor: pointer;
                height: 2rem;
                width: 1rem;
            }
            &::-moz-range-thumb {
                background-color: var(--backgroundColor);
                border-radius: 1rem;
                border: 0.1rem solid var(--primaryColor);
                cursor: pointer;
                height: 2rem;
                width: 1rem;
            }
        }
        > #value {
            border-radius: 50%;
            border: 0.1rem solid var(--primaryColor);
            font-weight: bold;
            padding: 0 0.5rem;
        }
    }
</style>
