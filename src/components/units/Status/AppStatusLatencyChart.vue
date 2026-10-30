<template>
    <div class="app-status-latency-chart">
        <div class="choices" role="radiogroup" :aria-label="t('chooseComponent')">
            <button v-for="choice in choices" :key="choice.id" role="radio" :aria-checked="choice.id === chosen" :class="{ chosen: choice.id === chosen }" @click="chosen = choice.id">{{ choice.name }}</button>
        </div>
        <div class="card">
            <div class="card-heading">
                <span class="card-name">{{ chosenName }}</span>
                <span v-if="!isAll" class="card-now"
                    ><strong>{{ formatLatency(chosenLatency, fmtLocale) }}</strong> {{ t("now") }}</span
                >
            </div>
            <ul v-if="isAll" class="legend">
                <li v-for="line in lines" :key="line.id">
                    <span class="swatch" :style="{ backgroundColor: line.color }" aria-hidden="true"></span>
                    <span class="legend-name">{{ line.name }}</span>
                    <span class="legend-now">{{ formatLatency(line.latencyMs, fmtLocale) }}</span>
                </li>
            </ul>
            <div ref="frame" class="frame">
                <svg v-if="width" :width="width" :height="height" :aria-label="isAll ? t('chartLabelAll', { count: dayKeys.length }) : t('chartLabel', { name: chosenName, count: dayKeys.length })" role="img" tabindex="0" @pointermove="onPointer" @pointerdown="onPointer" @mousedown.prevent @pointerleave="selected = undefined" @blur="selected = undefined" @keydown="onKeydown">
                    <g class="grid">
                        <template v-for="tick in ticks" :key="tick">
                            <line :x1="plotLeft" :x2="width - plotRight" :y1="y(tick)" :y2="y(tick)" />
                            <text :x="plotLeft - 6" :y="y(tick)" text-anchor="end" dominant-baseline="middle">{{ formatLatency(tick, fmtLocale) }}</text>
                        </template>
                    </g>
                    <line v-if="showThreshold" class="threshold" :x1="plotLeft" :x2="width - plotRight" :y1="y(degradedMs)" :y2="y(degradedMs)" />
                    <text v-if="showThreshold" class="threshold-label" :x="width - plotRight" :y="y(degradedMs) - 4" text-anchor="end">{{ t("degradedLine") }}</text>
                    <text class="axis" :x="plotLeft" :y="height - 4" text-anchor="start">{{ dayKeys[0] }}</text>
                    <text class="axis" :x="width - plotRight" :y="height - 4" text-anchor="end">{{ dayKeys[dayKeys.length - 1] }}</text>
                    <g v-for="line in lines" :key="line.id" :style="{ '--line-color': line.color }">
                        <polyline v-for="(segment, i) in line.segments" :key="'s' + i" class="line" :points="segment.map((p) => `${p.x},${p.y}`).join(' ')" />
                        <circle v-for="(p, i) in line.singles" :key="'p' + i" class="single" :cx="p.x" :cy="p.y" r="3" />
                    </g>
                    <g v-if="selectedX !== undefined">
                        <line class="crosshair" :x1="selectedX" :x2="selectedX" :y1="plotTop" :y2="height - plotBottom" />
                        <g v-for="point in selectedPoints" :key="point.id" :style="{ '--line-color': point.color }">
                            <circle class="marker" :cx="selectedX" :cy="point.y" r="4" />
                        </g>
                    </g>
                </svg>
            </div>
        </div>
        <div v-if="isAll && allReadout" class="readout all-readout" aria-live="polite">
            <strong>{{ allReadout.date }}</strong>
            <ul>
                <li v-for="row in allReadout.rows" :key="row.id">
                    <span class="swatch" :style="{ backgroundColor: row.color }" aria-hidden="true"></span>
                    <span class="legend-name">{{ row.name }}</span>
                    <span class="legend-now">{{ row.value }}</span>
                </li>
            </ul>
        </div>
        <p v-else class="readout" aria-live="polite">{{ readout }}</p>
        <details class="table-view">
            <summary>{{ t("showTable") }}</summary>
            <table>
                <thead>
                    <tr>
                        <th scope="col">{{ t("date") }}</th>
                        <template v-if="isAll">
                            <th v-for="line in lines" :key="line.id" scope="col">{{ line.name }} ({{ t("p95") }})</th>
                        </template>
                        <template v-else>
                            <th scope="col">{{ t("p95") }}</th>
                            <th scope="col">{{ t("average") }}</th>
                        </template>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="key in daysWithLatency" :key="key">
                        <td>{{ key }}</td>
                        <template v-if="isAll">
                            <td v-for="line in lines" :key="line.id">{{ formatLatency(p95Of(line.id, key) ?? null, fmtLocale) }}</td>
                        </template>
                        <template v-else>
                            <td>{{ formatLatency(chosenDays?.[key]?.p95LatencyMs ?? null, fmtLocale) }}</td>
                            <td>{{ formatLatency(chosenDays?.[key]?.avgLatencyMs ?? null, fmtLocale) }}</td>
                        </template>
                    </tr>
                    <tr v-if="!daysWithLatency.length">
                        <td :colspan="isAll ? lines.length + 1 : 3">{{ t("noData") }}</td>
                    </tr>
                </tbody>
            </table>
        </details>
    </div>
</template>

<script lang="ts" setup>
    import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
    import { useI18n } from "vue-i18n";
    import { Day, formatLatency, formatShortDay, hasData, formattingLocale } from "../../../scripts/apis/status";

    const props = defineProps<{
        options: Array<{ id: string; name: string; latencyMs: number | null }>;
        daily: Record<string, Record<string, Day>>;
        dayKeys: Array<string>;
    }>();

    const { t, locale } = useI18n();
    const fmtLocale = computed(() => formattingLocale(locale.value));
    const degradedMs = 30000;
    const tickValues = [10, 30, 100, 300, 1000, 3000, 10000, 30000, 60000];
    const height = 220;
    const plotTop = 12;
    const plotBottom = 22;
    const plotLeft = 52;
    const plotRight = 8;

    const frame = ref<HTMLElement>();
    const width = ref(0);
    // "All" overlays every component's line in one chart, each in its own colour.
    const allId = "__all__";
    const chosen = ref(props.options[0]?.id);
    const selected = ref<number>();

    let observer: ResizeObserver | undefined;
    onMounted(() => {
        observer = new ResizeObserver((entries) => (width.value = Math.floor(entries[0].contentRect.width)));
        if (frame.value) observer.observe(frame.value);
    });
    onBeforeUnmount(() => observer?.disconnect());

    const isAll = computed(() => chosen.value === allId);
    const choices = computed(() => [{ id: allId, name: t("all") }, ...props.options]);
    const chosenOption = computed(() => props.options.find((option) => option.id === chosen.value));
    const chosenName = computed(() => (isAll.value ? t("allName") : chosenOption.value?.name ?? ""));
    const chosenLatency = computed(() => chosenOption.value?.latencyMs ?? null);
    const chosenDays = computed(() => (chosen.value ? props.daily[chosen.value] : undefined));
    const p95Of = (id: string, key: string) => {
        const day = props.daily[id]?.[key];
        return hasData(day) && typeof day.p95LatencyMs === "number" && day.p95LatencyMs > 0 ? day.p95LatencyMs : undefined;
    };

    // The lines drawn: every component for "All" (colours --series-1.. in the order of the list),
    // otherwise just the chosen one in the text colour.
    const seriesCount = 8;
    const shown = computed(() => (isAll.value ? props.options.map((option, i) => ({ ...option, color: `var(--series-${(i % seriesCount) + 1})` })) : chosenOption.value ? [{ ...chosenOption.value, color: "var(--primaryColor)" }] : []));
    const daysWithLatency = computed(() => props.dayKeys.filter((key) => shown.value.some((line) => p95Of(line.id, key) !== undefined)).reverse());

    // Log scale between the nearest ticks around the data, so a normal 100-600 ms stays readable
    // next to a slow day of tens of seconds.
    const domain = computed(() => {
        const values = shown.value.flatMap((line) => props.dayKeys.map((key) => p95Of(line.id, key))).filter((value): value is number => value !== undefined);
        const low = Math.min(100, ...values);
        const high = Math.max(1000, ...values);
        const min = [...tickValues].reverse().find((tick) => tick <= low) ?? tickValues[0];
        const max = tickValues.find((tick) => tick >= high) ?? tickValues[tickValues.length - 1];
        return [min, max];
    });
    const ticks = computed(() => tickValues.filter((tick) => tick >= domain.value[0] && tick <= domain.value[1]));
    const showThreshold = computed(() => domain.value[1] >= degradedMs);

    const x = (i: number) => {
        const span = width.value - plotLeft - plotRight;
        return plotLeft + (props.dayKeys.length > 1 ? (i * span) / (props.dayKeys.length - 1) : span / 2);
    };
    const y = (value: number) => {
        const [min, max] = domain.value.map(Math.log10);
        const clamped = Math.min(Math.max(Math.log10(value), min), max);
        return plotTop + ((max - clamped) / (max - min)) * (height - plotTop - plotBottom);
    };

    // Days without data break the line instead of being drawn as zero.
    const segmentsOf = (id: string) => {
        const result: Array<Array<{ x: number; y: number }>> = [];
        let segment: Array<{ x: number; y: number }> = [];
        props.dayKeys.forEach((key, i) => {
            const value = p95Of(id, key);
            if (value === undefined) {
                if (segment.length) result.push(segment);
                segment = [];
            } else segment.push({ x: x(i), y: y(value) });
        });
        if (segment.length) result.push(segment);
        return result;
    };
    const lines = computed(() =>
        shown.value.map((line) => {
            const segments = segmentsOf(line.id);
            return { ...line, segments, singles: segments.filter((segment) => segment.length === 1).map((segment) => segment[0]) };
        })
    );

    // A resize (90 <-> 30 days) or midnight UTC changes which day each point is; drop the selection.
    watch(
        () => `${props.dayKeys[0]}/${props.dayKeys.length}`,
        () => (selected.value = undefined)
    );
    const selectedKey = computed(() => (selected.value === undefined ? undefined : props.dayKeys[selected.value]));
    const readout = computed(() => (selectedKey.value ? describeDay(selectedKey.value) : t("hint")));

    // For "All": every component's value on the chosen day, slowest first.
    const allReadout = computed(() => {
        const key = selectedKey.value;
        if (!key) return undefined;
        const rows = shown.value
            .map((line) => ({ id: line.id, name: line.name, color: line.color, ms: p95Of(line.id, key) }))
            .sort((a, b) => (b.ms ?? -1) - (a.ms ?? -1))
            .map((row) => ({ ...row, value: row.ms === undefined ? t("noValue") : formatLatency(row.ms, fmtLocale.value) }));
        return { date: formatShortDay(key, fmtLocale.value), rows };
    });

    const selectedX = computed(() => (selected.value === undefined || selected.value >= props.dayKeys.length ? undefined : x(selected.value)));
    const selectedPoints = computed(() => {
        const key = selectedKey.value;
        if (!key) return [];
        return shown.value.flatMap((line) => {
            const value = p95Of(line.id, key);
            return value === undefined ? [] : [{ id: line.id, color: line.color, y: y(value) }];
        });
    });

    const describeDay = (key: string) => {
        const day = chosenDays.value?.[key];
        const date = formatShortDay(key, fmtLocale.value);
        if (isAll.value || p95Of(chosen.value, key) === undefined || !day) return t("dayNoData", { date });
        return t("dayDetail", { date, p95: formatLatency(day.p95LatencyMs, fmtLocale.value), average: formatLatency(day.avgLatencyMs, fmtLocale.value) });
    };

    const onPointer = (event: PointerEvent) => {
        const rect = (event.currentTarget as SVGElement).getBoundingClientRect();
        const span = width.value - plotLeft - plotRight;
        const i = Math.round(((event.clientX - rect.left - plotLeft) / span) * (props.dayKeys.length - 1));
        selected.value = Math.min(props.dayKeys.length - 1, Math.max(0, i));
    };

    const onKeydown = (event: KeyboardEvent) => {
        const last = props.dayKeys.length - 1;
        const current = selected.value ?? last;
        const next = { ArrowLeft: current - 1, ArrowRight: current + 1, Home: 0, End: last }[event.key];
        if (next === undefined) return;
        event.preventDefault();
        selected.value = Math.min(last, Math.max(0, selected.value === undefined ? last : next));
    };
</script>

<style lang="scss" scoped>
    // Line colours for "All" (a colour-blind-safe set; see the dark and light steps). Light only on the light theme.
    .app-status-latency-chart {
        --series-1: #3987e5;
        --series-2: #d95926;
        --series-3: #199e70;
        --series-4: #c98500;
        --series-5: #d55181;
        --series-6: #008300;
        --series-7: #9085e9;
        --series-8: #e66767;
    }
    :global(#app.uni-theme-light) .app-status-latency-chart {
        --series-1: #2a78d6;
        --series-2: #eb6834;
        --series-3: #1baf7a;
        --series-4: #eda100;
        --series-5: #e87ba4;
        --series-6: #008300;
        --series-7: #6250d6;
        --series-8: #e34948;
    }
    .app-status-latency-chart {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        text-align: left;
        * {
            text-align: left;
        }
        .choices {
            display: flex;
            flex-wrap: wrap;
            gap: 0 0.4rem;
            > button {
                background: transparent;
                border: 0;
                border-radius: 0;
                box-shadow: none;
                cursor: pointer;
                font-size: 1.3rem;
                font-weight: 400;
                min-height: 4.4rem;
                opacity: 0.75;
                padding: 0 1rem;
                transition: none;
                &:hover {
                    opacity: 1;
                    transform: none;
                }
                &.chosen {
                    font-weight: 700;
                    opacity: 1;
                    text-decoration: underline;
                    text-decoration-thickness: 0.2rem;
                    text-underline-offset: 0.6rem;
                }
                &:focus-visible {
                    outline: 0.2rem solid var(--primaryColor);
                    outline-offset: -0.2rem;
                }
            }
        }
        .card {
            border: 0.1rem solid var(--neutralColor);
            border-radius: 0.8rem;
            padding: 1.4rem 1.6rem;
        }
        .card-heading {
            align-items: baseline;
            display: flex;
            flex-wrap: wrap;
            gap: 0.4rem 1.6rem;
            justify-content: space-between;
            margin-bottom: 1rem;
            > .card-name {
                font-size: 1.4rem;
                font-weight: 600;
            }
            > .card-now {
                font-size: 1.3rem;
                opacity: 0.85;
                > strong {
                    font-size: 1.8rem;
                    font-weight: 700;
                }
            }
        }
        .frame {
            min-height: 220px;
            width: 100%;
            svg {
                display: block;
                touch-action: pan-y;
                &:focus-visible {
                    outline: 0.2rem solid var(--primaryColor);
                    outline-offset: 0.2rem;
                }
            }
            text {
                fill: var(--primaryColor);
                font-size: 11px;
                opacity: 0.8;
            }
            .grid line {
                stroke: var(--primaryColor);
                stroke-opacity: 0.15;
                stroke-width: 1;
            }
            .threshold {
                stroke: var(--statusDegradedColor);
                stroke-dasharray: 4 4;
                stroke-width: 1;
            }
            .line {
                fill: none;
                stroke: var(--line-color);
                stroke-linejoin: round;
                stroke-width: 2;
            }
            .single,
            .marker {
                fill: var(--line-color);
                stroke: var(--backgroundColor);
                stroke-width: 2;
            }
            .crosshair {
                stroke: var(--primaryColor);
                stroke-opacity: 0.4;
                stroke-width: 1;
            }
        }
        .legend,
        .all-readout ul {
            display: flex;
            flex-wrap: wrap;
            gap: 0.6rem 1.8rem;
            list-style: none;
            margin: 0 0 1rem;
            padding: 0;
            > li {
                align-items: center;
                display: flex;
                font-size: 1.2rem;
                gap: 0.6rem;
            }
        }
        .all-readout ul {
            margin: 0.4rem 0 0;
        }
        .swatch {
            border-radius: 0.2rem;
            flex: none;
            height: 0.4rem;
            width: 1.8rem;
        }
        .legend-now {
            opacity: 0.8;
        }
        .readout {
            font-size: 1.2rem;
            min-height: 2rem;
        }
        .table-view {
            font-size: 1.2rem;
            summary {
                cursor: pointer;
                font-size: 1.2rem;
                width: fit-content;
            }
            table {
                border-collapse: collapse;
                max-height: 30rem;
                th,
                td {
                    font-size: 1.2rem;
                    padding: 0 1rem 0 0;
                }
                th {
                    font-weight: 600;
                }
            }
        }
    }
</style>

<i18n lang="json">
{
    "en-US": {
        "all": "All",
        "allName": "All components",
        "chartLabelAll": "Daily 95th percentile latency of all components for the last {count} days, one line each. Use the arrow keys to read each day.",
        "noValue": "no data",
        "now": "now",
        "chooseComponent": "Component to show",
        "chartLabel": "Daily 95th percentile latency of {name} for the last {count} days. Use the arrow keys to read each day.",
        "degradedLine": "degraded above 30 s",
        "hint": "Hover, tap or use the arrow keys to read a day.",
        "dayNoData": "{date} · no data",
        "dayDetail": "{date} · p95 {p95}, average {average}",
        "showTable": "Show as a table",
        "date": "Date (UTC)",
        "p95": "p95",
        "average": "Average",
        "noData": "No data yet"
    },
    "zh": {
        "all": "全部",
        "allName": "所有组件",
        "chartLabelAll": "所有组件最近 {count} 天每日第 95 百分位延迟，每个组件一条线。使用方向键查看每一天。",
        "noValue": "无数据",
        "now": "当前",
        "chooseComponent": "选择组件",
        "chartLabel": "{name} 最近 {count} 天每日第 95 百分位延迟。使用方向键查看每一天。",
        "degradedLine": "超过 30 秒为缓慢",
        "hint": "悬停、点按或使用方向键查看某一天。",
        "dayNoData": "{date} · 无数据",
        "dayDetail": "{date} · p95 {p95}，平均 {average}",
        "showTable": "以表格显示",
        "date": "日期（UTC）",
        "p95": "p95",
        "average": "平均",
        "noData": "暂无数据"
    },
    "es": {
        "all": "Todos",
        "allName": "Todos los componentes",
        "chartLabelAll": "Latencia diaria del percentil 95 de todos los componentes en los últimos {count} días, una línea cada uno. Use las flechas para leer cada día.",
        "noValue": "sin datos",
        "now": "ahora",
        "chooseComponent": "Componente a mostrar",
        "chartLabel": "Latencia diaria del percentil 95 de {name} en los últimos {count} días. Use las flechas para leer cada día.",
        "degradedLine": "lento por encima de 30 s",
        "hint": "Pase el cursor, toque o use las flechas para leer un día.",
        "dayNoData": "{date} · sin datos",
        "dayDetail": "{date} · p95 {p95}, promedio {average}",
        "showTable": "Mostrar como tabla",
        "date": "Fecha (UTC)",
        "p95": "p95",
        "average": "Promedio",
        "noData": "Aún sin datos"
    },
    "hi": {
        "all": "All",
        "allName": "All components",
        "chartLabelAll": "Daily 95th percentile latency of all components for the last {count} days, one line each. Use the arrow keys to read each day.",
        "noValue": "no data",
        "now": "now",
        "chooseComponent": "Component to show",
        "chartLabel": "Daily 95th percentile latency of {name} for the last {count} days. Use the arrow keys to read each day.",
        "degradedLine": "degraded above 30 s",
        "hint": "Hover, tap or use the arrow keys to read a day.",
        "dayNoData": "{date} · no data",
        "dayDetail": "{date} · p95 {p95}, average {average}",
        "showTable": "Show as a table",
        "date": "Date (UTC)",
        "p95": "p95",
        "average": "Average",
        "noData": "No data yet"
    }
}
</i18n>
