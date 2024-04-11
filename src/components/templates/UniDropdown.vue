<template>
    <div id="uni-drodown">
        <div class="dropdown-selection">
            <b>{{ activeOption }} ▼</b>
        </div>
        <div class="dropdown-options">
            <div class="dropdown-option" :class="{active: dropdownOption === activeOption}" v-for="dropdownOption in options" :key="dropdownOption" @click="setVVHView(viewId, vvhViewOption)">
                <div v-if="evaluateOptionRenderCondition(optionRenderCondition) && vvhViewOption != activeVVHView">
                    <b>{{ vvhViewOption }}</b>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    defineProps<{
        activeOption: string,
        optionRenderCondition?: string,
        options: string[]
    }>();

    const evaluateOptionRenderCondition = (optionRenderCondition?: string) => {
        if (optionRenderCondition) {
            return eval(optionRenderCondition)
        }
        return true
    }
</script>

<style lang="scss" scoped>
    
</style>

