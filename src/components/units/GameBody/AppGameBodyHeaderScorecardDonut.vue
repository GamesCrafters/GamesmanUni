<template>
    <div id="app-game-body-header-scorecard-donut">        
        <div>
            {{ playerSide == "left" ? "Left" : "Right" }} Player Rating
        </div>
        <div id="donut">
        <div>
            <canvas ref="chartCanvas" width="200" height="200"></canvas>
        </div>
            <div>
                Accuracy: {{ Math.round(((playerRatings.brilliant + playerRatings.good) / (Object.values(playerRatings).reduce((a, b) => a + b, 0))) * 100)}}%
            </div>
            <div>
                Brilliant: {{ playerRatings.brilliant }} | Good: {{ playerRatings.good }} | Blunder: {{ playerRatings.blunder }}
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { computed, watch, ref, onMounted } from "vue";
    import { mutationTypes, useStore } from "../../../scripts/plugins/store";
    import { Rating } from "../../../scripts/gamesmanUni/types";

    //Define props
    const props = defineProps({
        playerSide: {
            type: String,
            required: true,
            validator: (value: string) => ['left', 'right'].includes(value)
        },
        selectedId: {
            type: Number,
            required: true
        }
    });

    const store = useStore();
    const currentScorecard = computed(() => store.getters.currentScorecard);
    const currentScorecardRecord = computed(() => {
        const records = currentScorecard.value.records;
        return records.length > 0 ? records.at(props.selectedId) : null;
    });

    const playerRatings = computed(() => {
        const record = currentScorecardRecord.value;
        const defaultRating : Rating = {brilliant: 0, good: 0, blunder: 0};
        if (!record) return defaultRating;
        if (props.playerSide === "left") return record.leftPlayerRatings
        else if (props.playerSide === "right") return record.rightPlayerRatings;
        else return defaultRating;
    })

    const chartCanvas = ref<HTMLCanvasElement | null>(null);
    const drawDonutGraph = () => {
        const canvas = chartCanvas.value;
        if (!canvas) {
            console.log("Canvas unavailable");
            return;
        }
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            console.log("2D context unavailable");
            return;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const data = Object.values(playerRatings.value); // Convert ratings object to array
        const colors = ['#40E0D0', '#8FBC8F', '#CD5C5C']; // Example colors
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 10;
        const total = data.reduce((acc, val) => acc + val, 0);
        let startAngle = 0;

        for (let i = 0; i < data.length; i++) {
            const endAngle = startAngle + (data[i] / total) * 2 * Math.PI;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.fillStyle = colors[i % colors.length];
            ctx.fill();
            startAngle = endAngle;
        }

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius / 2, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
    };

    onMounted(drawDonutGraph);
    watch([playerRatings, () => props.selectedId], drawDonutGraph, {deep:true});
</script>

<style lang="scss" scoped>
    
</style>
