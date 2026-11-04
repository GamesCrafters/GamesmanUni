<template>
    <div :class="['app-status-component', { open }]">
        <h4 class="heading">
            <button class="toggle" :aria-expanded="open" :aria-controls="panelId" @click="emit('toggle')">
                <span class="chevron" aria-hidden="true">›</span>
                <span class="title">
                    <span class="name">{{ name }}</span>
                    <span v-if="component.status !== 'ok'" class="reason">{{ component.detail }}</span>
                </span>
                <span class="state"><span :class="['dot', `status-${component.status}`]" aria-hidden="true"></span>{{ t(`status.${component.status}`) }}</span>
            </button>
        </h4>
        <div v-if="open" :id="panelId" class="panel">
            <div class="bars-frame">
                <svg class="bars" :viewBox="`0 0 ${dayKeys.length * slotWidth} ${barHeight}`" preserveAspectRatio="none" tabindex="0" role="group" :aria-label="t('barsLabel', { name, count: dayKeys.length })" @keydown="onKeydown" @mousedown.prevent @mouseleave="selected = undefined" @blur="selected = undefined">
                    <rect v-if="selectedDay" class="ring" :x="selected! * slotWidth" y="0" :width="slotWidth - gapWidth" :height="barHeight" rx="2" />
                    <g v-for="(key, i) in dayKeys" :key="key" @mouseenter="selected = i" @click="selected = i">
                        <rect class="hit" :x="i * slotWidth" y="0" :width="slotWidth" :height="barHeight" />
                        <rect :class="['bar', `day-${dayStatus(days?.[key])}`, { selected: selected === i }]" :x="i * slotWidth" y="0" :width="slotWidth - gapWidth" :height="barHeight" rx="2" />
                    </g>
                </svg>
                <p class="tooltip" :style="tooltipStyle" aria-live="polite">
                    <template v-if="selectedDay">
                        <span
                            ><strong>{{ selectedDay.date }}</strong
                            ><template v-if="selectedDay.uptime"> · {{ selectedDay.uptime }}</template></span
                        >
                        <span>{{ selectedDay.detail }}</span>
                    </template>
                </p>
            </div>
            <div class="bar-legend">
                <span>{{ t("daysAgo", { count: dayKeys.length }) }}</span>
                <span class="rule" aria-hidden="true"></span>
                <span class="uptime">{{ uptimeText }}</span>
                <span class="rule" aria-hidden="true"></span>
                <span>{{ t("today") }}</span>
            </div>
            <dl class="facts">
                <div>
                    <dt>{{ t("statusLabel") }}</dt>
                    <dd>
                        {{ t(`status.${component.status}`) }} {{ t("since") }} <time :datetime="component.since" :title="formatUtc(component.since)">{{ formatRelative(component.since, now, fmtLocale) }}</time>
                    </dd>
                </div>
                <div>
                    <dt>{{ t("latencyNow") }}</dt>
                    <dd>{{ formatLatency(component.latencyMs, fmtLocale) }}</dd>
                </div>
                <div>
                    <dt>{{ t("lastChecked") }}</dt>
                    <dd>
                        <time :datetime="component.lastCheckedAt">{{ formatUtc(component.lastCheckedAt) }}</time>
                    </dd>
                </div>
                <div>
                    <dt>{{ t("lastFailure") }}</dt>
                    <dd v-if="component.lastFailure">
                        <time :datetime="component.lastFailure.at">{{ formatUtc(component.lastFailure.at) }}</time
                        >: {{ component.lastFailure.detail }}
                    </dd>
                    <dd v-else>{{ t("noFailures") }}</dd>
                </div>
            </dl>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { computed, ref, watch } from "vue";
    import { useI18n } from "vue-i18n";
    import { Component, Day, dayStatus, formatLatency, formatPercent, formatRelative, formatShortDay, formatUtc, hasData, uptimeRatio, formattingLocale } from "../../../scripts/apis/status";

    const props = defineProps<{
        id: string;
        name: string;
        component: Component;
        days?: Record<string, Day>;
        dayKeys: Array<string>;
        now: number;
        open: boolean;
    }>();
    const emit = defineEmits<{ (event: "toggle"): void }>();

    const { t, locale } = useI18n();
    const fmtLocale = computed(() => formattingLocale(locale.value));
    const slotWidth = 10;
    const gapWidth = 3;
    const barHeight = 40;
    const selected = ref<number>();
    const panelId = computed(() => `status-panel-${props.id}`);

    const uptimeText = computed(() => {
        const ratio = uptimeRatio(props.dayKeys.map((key) => props.days?.[key]));
        if (ratio === undefined) return t("noUptime");
        return t("uptime", { percent: formatPercent(ratio, fmtLocale.value) });
    });

    // Two short lines: "Oct 17 · 95.83% uptime", then "24 checks · 23 ok, 1 down". Zero counts are left out.
    const describeDay = (key: string) => {
        const day = props.days?.[key];
        const date = formatShortDay(key, fmtLocale.value);
        if (!hasData(day)) return { date, uptime: "", detail: t("dayNoData") };
        const counts = (["ok", "degraded", "down"] as const).filter((status) => day[status] > 0).map((status) => t(`count.${status}`, { n: day[status] }));
        const checks = t("checks", { n: day.checks }, day.checks);
        return { date, uptime: t("dayUptime", { percent: formatPercent((day.ok + day.degraded) / day.checks, fmtLocale.value) }), detail: t("dayCounts", { checks, counts: counts.join(t("countSeparator")) }) };
    };
    const selectedDay = computed(() => {
        const key = selected.value === undefined ? undefined : props.dayKeys[selected.value];
        return key ? describeDay(key) : undefined;
    });
    // A resize (90 <-> 30 days) or midnight UTC changes which day each bar is; drop the selection.
    watch(
        () => `${props.dayKeys[0]}/${props.dayKeys.length}`,
        () => (selected.value = undefined)
    );

    // The tooltip sits over the chosen bar, kept inside the row near either edge.
    const tooltipStyle = computed(() => {
        if (selected.value === undefined || !selectedDay.value) return { visibility: "hidden" as const };
        const center = ((selected.value + 0.5) / props.dayKeys.length) * 100;
        const shift = center < 20 ? 0 : center > 80 ? 100 : 50;
        return { left: `${center}%`, transform: `translateX(-${shift}%)` };
    });

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
    .app-status-component {
        border-top: 0.1rem solid var(--neutralColor);
        text-align: left;
        * {
            text-align: left;
        }
        time {
            font-size: inherit;
            font-weight: inherit;
        }
        .heading {
            font-size: inherit;
            margin: 0;
        }
        .toggle {
            align-items: center;
            background: transparent;
            border: 0;
            border-radius: 0;
            box-shadow: none;
            color: inherit;
            display: flex;
            gap: 1.4rem;
            min-height: 5.6rem;
            padding: 1rem 1.8rem;
            transition: none;
            width: 100%;
            &:hover {
                transform: none;
            }
            &:focus-visible {
                outline: 0.2rem solid var(--primaryColor);
                outline-offset: -0.2rem;
            }
            .title {
                display: flex;
                flex: 1;
                flex-direction: column;
                min-width: 0;
            }
            .name {
                font-size: 1.5rem;
                font-weight: 600;
                line-height: 2.2rem;
            }
            .reason {
                font-family: var(--fixedWidthFontFamily);
                font-size: 1.1rem;
                font-weight: 400;
                line-height: 1.6rem;
                opacity: 0.8;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .state {
                align-items: center;
                display: flex;
                font-size: 1.3rem;
                font-weight: 400;
                gap: 0.6rem;
                white-space: nowrap;
            }
            .chevron {
                display: inline-block;
                flex: none;
                font-size: 1.8rem;
                font-weight: 700;
                text-align: center;
                transition: transform 0.15s ease-out;
                width: 1.4rem;
            }
        }
        &.open .toggle .chevron {
            transform: rotate(90deg);
        }
        .dot {
            border-radius: 50%;
            display: inline-block;
            height: 0.9rem;
            width: 0.9rem;
            &.status-ok {
                background-color: var(--statusOkColor);
            }
            &.status-degraded {
                background-color: var(--statusDegradedColor);
            }
            &.status-down {
                background-color: var(--statusDownColor);
            }
        }
        .panel {
            display: flex;
            flex-direction: column;
            gap: 0.8rem;
            padding: 0.2rem 1.8rem 2rem 4.6rem;
            // On a phone, give the bars and details the full width instead of lining up with the name.
            @media (max-width: 600px) {
                padding-left: 1.8rem;
            }
        }
        .bars-frame {
            position: relative;
        }
        .bars {
            display: block;
            height: 3.4rem;
            // The outline around a chosen bar sticks out past the edge of the drawing.
            overflow: visible;
            width: 100%;
            &:focus-visible {
                outline: 0.2rem solid var(--primaryColor);
                outline-offset: 0.2rem;
            }
            .hit {
                fill: transparent;
            }
            .day-ok {
                fill: var(--statusOkColor);
            }
            .day-degraded {
                fill: var(--statusDegradedColor);
            }
            .day-down {
                fill: var(--statusDownColor);
            }
            // Opaque (the same look as 20% of the text color over the background), so the outline
            // below can sit under the bar without showing through it.
            .day-none {
                fill: color-mix(in srgb, var(--primaryColor) 20%, var(--backgroundColor));
            }
            // The chosen day gets an outline outside the bar: 3 px above and below, and as wide as the gap
            // to the neighbouring bars at the sides. It is drawn before (so under) all the bars as a 6 px
            // line, so no bar pixels are covered, the neighbours' included. vector-effect keeps it that
            // width however wide the bars are drawn.
            .ring {
                fill: none;
                stroke: var(--primaryColor);
                stroke-width: 0.6rem;
                vector-effect: non-scaling-stroke;
            }
        }
        .tooltip {
            background-color: var(--primaryColor);
            border-radius: 0.6rem;
            bottom: 4.2rem;
            box-shadow: 0 0.2rem 0.8rem rgba(0, 0, 0, 0.2);
            color: var(--backgroundColor);
            font-size: 1.1rem;
            line-height: 1.6rem;
            display: flex;
            flex-direction: column;
            max-width: 100%;
            white-space: nowrap;
            span,
            strong {
                color: inherit;
                font-size: inherit;
                line-height: inherit;
            }
            strong {
                font-weight: 700;
            }
            padding: 0.6rem 1rem;
            pointer-events: none;
            position: absolute;
            width: max-content;
            z-index: 1;
        }
        .bar-legend {
            align-items: center;
            display: flex;
            font-size: 1.1rem;
            gap: 1rem;
            > span {
                font-size: inherit;
                opacity: 0.8;
                white-space: nowrap;
            }
            > .rule {
                background-color: var(--neutralColor);
                flex: 1;
                height: 0.1rem;
                opacity: 1;
            }
            > .uptime {
                font-weight: 600;
                opacity: 1;
            }
        }
        .facts {
            background-color: color-mix(in srgb, var(--primaryColor) 6%, transparent);
            border-radius: 0.8rem;
            display: grid;
            gap: 0.6rem 2rem;
            grid-template-columns: max-content minmax(0, 1fr);
            margin: 0.6rem 0 0;
            padding: 1.4rem 1.8rem;
            > div {
                display: contents;
            }
            dt {
                font-size: 1.3rem;
                font-weight: 600;
                line-height: 1.9rem;
            }
            dd {
                font-size: 1.3rem;
                font-weight: 400;
                line-height: 1.9rem;
                margin: 0;
                overflow-wrap: anywhere;
            }
        }
    }
</style>

<i18n lang="json">
{
    "en-US": {
        "status": { "ok": "Operational", "degraded": "Degraded", "down": "Down" },
        "since": "since",
        "statusLabel": "Status",
        "barsLabel": "Daily status of {name} for the last {count} days. Use the arrow keys to read each day.",
        "daysAgo": "{count} days ago",
        "today": "Today",
        "uptime": "{percent} uptime",
        "noUptime": "No data yet",
        "dayNoData": "no data",
        "dayUptime": "{percent} uptime",
        "dayCounts": "{checks} · {counts}",
        "count": { "ok": "{n} ok", "degraded": "{n} degraded", "down": "{n} down" },
        "countSeparator": ", ",
        "checks": "{n} check | {n} checks",
        "latencyNow": "Latency now",
        "lastChecked": "Last checked",
        "lastFailure": "Last failure",
        "noFailures": "None recorded"
    },
    "zh": {
        "status": { "ok": "正常", "degraded": "缓慢", "down": "故障" },
        "since": "自",
        "statusLabel": "状态",
        "barsLabel": "{name} 最近 {count} 天的每日状态。使用方向键查看每一天。",
        "daysAgo": "{count} 天前",
        "today": "今天",
        "uptime": "可用率 {percent}",
        "noUptime": "暂无数据",
        "dayNoData": "无数据",
        "dayUptime": "可用率 {percent}",
        "dayCounts": "{checks} · {counts}",
        "count": { "ok": "正常 {n}", "degraded": "缓慢 {n}", "down": "故障 {n}" },
        "countSeparator": "，",
        "checks": "{n} 次检查",
        "latencyNow": "当前延迟",
        "lastChecked": "上次检查",
        "lastFailure": "上次故障",
        "noFailures": "无记录"
    },
    "es": {
        "status": { "ok": "Operativo", "degraded": "Lento", "down": "Caído" },
        "since": "desde",
        "statusLabel": "Estado",
        "barsLabel": "Estado diario de {name} en los últimos {count} días. Use las flechas para leer cada día.",
        "daysAgo": "hace {count} días",
        "today": "Hoy",
        "uptime": "{percent} de disponibilidad",
        "noUptime": "Aún sin datos",
        "dayNoData": "sin datos",
        "dayUptime": "{percent} de disponibilidad",
        "dayCounts": "{checks} · {counts}",
        "count": { "ok": "{n} ok", "degraded": "{n} lentos", "down": "{n} caídos" },
        "countSeparator": ", ",
        "checks": "{n} comprobación | {n} comprobaciones",
        "latencyNow": "Latencia actual",
        "lastChecked": "Última comprobación",
        "lastFailure": "Último fallo",
        "noFailures": "Ninguno registrado"
    },
    "hi": {
        "status": { "ok": "Operational", "degraded": "Degraded", "down": "Down" },
        "since": "since",
        "statusLabel": "Status",
        "barsLabel": "Daily status of {name} for the last {count} days. Use the arrow keys to read each day.",
        "daysAgo": "{count} days ago",
        "today": "Today",
        "uptime": "{percent} uptime",
        "noUptime": "No data yet",
        "dayNoData": "no data",
        "dayUptime": "{percent} uptime",
        "dayCounts": "{checks} · {counts}",
        "count": { "ok": "{n} ok", "degraded": "{n} degraded", "down": "{n} down" },
        "countSeparator": ", ",
        "checks": "{n} check | {n} checks",
        "latencyNow": "Latency now",
        "lastChecked": "Last checked",
        "lastFailure": "Last failure",
        "noFailures": "None recorded"
    }
}
</i18n>
