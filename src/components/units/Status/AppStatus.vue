<template>
    <div id="app-status">
        <header id="header">
            <div id="eyebrow">
                <h2 id="title">{{ t("title") }}</h2>
                <p v-if="data" class="checked">
                    {{ t("lastChecked") }} <time :datetime="data.current.updatedAt" :title="formatUtc(data.current.updatedAt)">{{ formatRelative(data.current.updatedAt, now, fmtLocale) }}</time>
                </p>
            </div>
            <div v-if="data" id="banner" role="status">
                <span :class="['dot', stale ? 'status-stale' : `status-${data.current.overall}`]" aria-hidden="true"></span>
                <h3>{{ t(`overall.${overallKey}`) }}</h3>
            </div>
            <p v-else class="notice" role="status">{{ failed ? t("loadFailed") : t("loading") }}</p>
            <p v-if="stale" class="stale-warning">
                <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="8" />
                    <path d="M12 8v4.5l3 2" />
                </svg>
                {{ t("stale") }}
            </p>
            <p id="subtitle">{{ t("note") }}</p>
            <p v-if="data && failed" class="notice" role="alert">
                <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7.5v5.5M12 16.5v.01" />
                </svg>
                {{ t("refreshFailed") }}
            </p>
            <p v-if="newerSchema" class="notice">
                <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7.5v5.5M12 16.5v.01" />
                </svg>
                {{ t("newerSchema") }}
            </p>
        </header>
        <template v-if="data">
            <div id="components">
                <div class="list">
                    <section v-for="group in groups" :key="group.id" class="group">
                        <h3>{{ te(`groups.${group.id}`) ? t(`groups.${group.id}`) : group.name }}</h3>
                        <AppStatusComponent v-for="id in group.ids" :key="id" :id="id" :name="displayName(id)" :component="data.current.components[id]" :days="data.daily.components[id]" :day-keys="dayKeys" :now="now" :open="isOpen(id)" @toggle="toggle(id)" />
                    </section>
                </div>
            </div>
            <section id="latency" :class="{ open: latencyOpen }">
                <h3>
                    <button class="toggle" :aria-expanded="latencyOpen" aria-controls="latency-panel" @click="latencyOpen = !latencyOpen">
                        <span class="chevron" aria-hidden="true">›</span>
                        <span class="label">
                            {{ t("latency") }} <span class="muted">{{ t("latencyKind") }}</span>
                        </span>
                    </button>
                </h3>
                <div v-if="latencyOpen" id="latency-panel">
                    <AppStatusLatencyChart :options="chartOptions" :daily="data.daily.components" :day-keys="dayKeys" />
                </div>
            </section>
        </template>
        <footer id="links">
            <a :href="fallbackUrl" target="_blank" rel="noopener noreferrer">{{ t("fallback") }}</a>
            <a :href="repoUrl" target="_blank" rel="noopener noreferrer">{{ t("repo") }}</a>
        </footer>
        <component :is="AppStatusDevScenarios" v-if="AppStatusDevScenarios" />
    </div>
</template>

<script lang="ts" setup>
    import { computed, defineAsyncComponent, onBeforeUnmount, onMounted, ref } from "vue";
    import { useI18n } from "vue-i18n";
    import { formatRelative, formatUtc, getDataSource, knownSchemaVersion, lastDayKeys, loadStatus, refreshEveryMs, staleAfterMs, StatusData, formattingLocale } from "../../../scripts/apis/status";
    import AppStatusComponent from "./AppStatusComponent.vue";
    import AppStatusLatencyChart from "./AppStatusLatencyChart.vue";

    // Scenario switcher for local testing. The production build replaces import.meta.env.DEV with
    // false and drops this import, so the real site never contains it.
    const AppStatusDevScenarios = import.meta.env.DEV ? defineAsyncComponent(() => import("./AppStatusDevScenarios.vue")) : undefined;

    const { t, te, locale } = useI18n();
    const fmtLocale = computed(() => formattingLocale(locale.value));
    const repoUrl = "https://github.com/GamesCrafters/GamesCraftersStatus";
    const fallbackUrl = "https://naheejeong.github.io/gamescrafters-status-backup/";
    const dataSource = getDataSource();

    const data = ref<StatusData>();
    const failed = ref(false);
    const now = ref(Date.now());
    const narrow = ref(false);
    const latencyOpen = ref(false);

    // Rows start open when their component is not ok, closed otherwise. Once a row is clicked,
    // the person's choice wins, also across refreshes.
    const chosenOpen = ref<Record<string, boolean>>({});
    const isOpen = (id: string) => chosenOpen.value[id] ?? (!!data.value && data.value.current.components[id]?.status !== "ok");
    const toggle = (id: string) => (chosenOpen.value = { ...chosenOpen.value, [id]: !isOpen(id) });

    // Keep the last good data when a refresh fails; only say that it failed.
    let loading = false;
    const refresh = async () => {
        if (loading) return;
        loading = true;
        const result = await loadStatus(dataSource);
        loading = false;
        now.value = Date.now();
        if (result) data.value = result;
        failed.value = !result;
    };

    // Refresh every minute while the page is visible; pause while it is hidden and catch up when it
    // comes back. The clock ticks separately so "3 min ago" and the stale check stay current.
    let refreshTimer: number | undefined;
    let clockTimer: number | undefined;
    const startRefreshing = () => {
        window.clearInterval(refreshTimer);
        refreshTimer = window.setInterval(refresh, refreshEveryMs);
    };
    const onVisibilityChange = () => {
        if (document.hidden) {
            window.clearInterval(refreshTimer);
            refreshTimer = undefined;
        } else {
            refresh();
            startRefreshing();
        }
    };
    const narrowQuery = window.matchMedia("(max-width: 600px)");
    const onNarrowChange = () => (narrow.value = narrowQuery.matches);

    onMounted(() => {
        onNarrowChange();
        narrowQuery.addEventListener("change", onNarrowChange);
        document.addEventListener("visibilitychange", onVisibilityChange);
        clockTimer = window.setInterval(() => (now.value = Date.now()), 15000);
        refresh();
        if (!document.hidden) startRefreshing();
    });
    onBeforeUnmount(() => {
        narrowQuery.removeEventListener("change", onNarrowChange);
        document.removeEventListener("visibilitychange", onVisibilityChange);
        window.clearInterval(refreshTimer);
        window.clearInterval(clockTimer);
    });

    // Phones get the last 30 days instead of 90.
    const dayKeys = computed(() => lastDayKeys(now.value, narrow.value ? 30 : 90));
    const stale = computed(() => !!data.value && now.value - new Date(data.value.current.updatedAt).getTime() > staleAfterMs);
    // "Major outage" when people can't use the site at all: the website or the API is down (every
    // game needs it), or every solver is down. Anything less that is down is a partial outage.
    const overallKey = computed(() => {
        if (!data.value) return "ok";
        const { overall, components, groups } = data.value.current;
        if (overall !== "down") return overall;
        const isDown = (id: string) => components[id]?.status === "down";
        const solvers = groups.find((group) => group.id === "solvers")?.components.filter((id) => components[id]) ?? [];
        const major = isDown("frontend") || isDown("api") || (solvers.length > 0 && solvers.every(isDown));
        return major ? "major" : "down";
    });
    const newerSchema = computed(() => !!data.value && (data.value.current.schemaVersion > knownSchemaVersion || data.value.daily.schemaVersion > knownSchemaVersion));

    // Groups and order come from current.json; skip any id it lists without an entry.
    const groups = computed(() => (data.value ? data.value.current.groups.map((group) => ({ id: group.id, name: group.name, ids: group.components.filter((id) => data.value?.current.components[id]) })) : []));
    const displayName = (id: string) => (te(`components.${id}`) ? t(`components.${id}`) : data.value?.current.components[id]?.name ?? id);
    const chartOptions = computed(() => groups.value.flatMap((group) => group.ids.map((id) => ({ id, name: displayName(id), latencyMs: data.value?.current.components[id]?.latencyMs ?? null }))));
</script>

<style lang="scss" scoped>
    #app-status {
        --statusOkColor: #0ca30c;
        --statusDegradedColor: #fab219;
        --statusDownColor: #ef5350;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: 1.6rem;
        margin: 0 auto;
        max-width: 76rem;
        padding: 3rem 1.6rem 5rem;
        text-align: left;
        width: 100%;
        * {
            text-align: left;
        }
        time {
            font-size: inherit;
        }
        #header {
            display: flex;
            flex-direction: column;
            gap: 1.2rem;
            padding-bottom: 0.8rem;
        }
        #eyebrow {
            align-items: baseline;
            display: flex;
            flex-wrap: wrap;
            gap: 0.4rem 1.6rem;
            justify-content: space-between;
            > #title {
                font-size: 1.3rem;
                font-weight: 700;
                letter-spacing: 0.1em;
                opacity: 0.75;
                text-transform: uppercase;
            }
            > .checked {
                font-size: 1.3rem;
                opacity: 0.75;
            }
        }
        #banner {
            align-items: center;
            display: flex;
            gap: 1.6rem;
            > .dot {
                margin-left: 0.6rem;
            }
            h3 {
                font-size: 3.6rem;
                font-weight: 800;
                line-height: 4.2rem;
            }
        }
        .dot {
            border-radius: 50%;
            display: inline-block;
            flex: none;
            height: 1.4rem;
            width: 1.4rem;
            &.status-ok {
                background-color: var(--statusOkColor);
                box-shadow: 0 0 0 0.6rem rgba(12, 163, 12, 0.25);
            }
            &.status-degraded {
                background-color: var(--statusDegradedColor);
                box-shadow: 0 0 0 0.6rem rgba(250, 178, 25, 0.25);
            }
            &.status-down {
                background-color: var(--statusDownColor);
                box-shadow: 0 0 0 0.6rem rgba(239, 83, 80, 0.25);
            }
            &.status-stale {
                border: 0.2rem dashed var(--primaryColor);
                box-sizing: border-box;
            }
        }
        .icon {
            fill: none;
            flex: none;
            height: 1.8rem;
            stroke: var(--primaryColor);
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-width: 2.2;
            width: 1.8rem;
        }
        .stale-warning,
        .notice {
            align-items: center;
            display: flex;
            font-size: 1.4rem;
            gap: 0.8rem;
        }
        .stale-warning {
            font-weight: 600;
        }
        #subtitle {
            font-size: 1.5rem;
            opacity: 0.8;
        }
        #components {
            display: flex;
            flex-direction: column;
            gap: 0.6rem;
            margin-top: 0.8rem;
        }
        .list,
        #latency {
            border: 0.1rem solid var(--neutralColor);
            border-radius: 1.4rem;
            overflow: hidden;
        }
        .group {
            > h3 {
                border-top: 0.1rem solid var(--neutralColor);
                font-size: 1.2rem;
                font-weight: 700;
                letter-spacing: 0.1em;
                margin-top: -0.1rem;
                opacity: 0.75;
                padding: 1.4rem 1.8rem 1rem;
                text-transform: uppercase;
            }
        }
        #latency {
            margin-top: 0.8rem;
            > h3 {
                font-size: inherit;
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
                .label {
                    flex: 1;
                    font-size: 1.5rem;
                    font-weight: 600;
                    > .muted {
                        font-size: inherit;
                        font-weight: 400;
                        opacity: 0.8;
                    }
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
            &.open .chevron {
                transform: rotate(90deg);
            }
            #latency-panel {
                padding: 0 1.8rem 2rem 4.6rem;
            }
        }
        #links {
            display: flex;
            flex-wrap: wrap;
            gap: 0.4rem 1.6rem;
            justify-content: center;
            padding-top: 0.6rem;
            a {
                font-size: 1.2rem;
            }
        }
    }
</style>

<i18n lang="json">
{
    "en-US": {
        "title": "System status",
        "note": "Live status of GamesCrafters services, checked every hour. Times are in UTC.",
        "loading": "Loading status…",
        "loadFailed": "Couldn't load status. Trying again every minute.",
        "overall": { "ok": "All systems operational", "degraded": "Some systems degraded", "down": "Partial outage", "major": "Major outage" },
        "lastChecked": "Last checked",
        "stale": "Status data may be stale: no check has completed in over 5 hours.",
        "refreshFailed": "Couldn't refresh status. Showing the last data received.",
        "newerSchema": "The status data is newer than this page. Some details may be missing.",
        "groups": { "website": "Website", "api": "API", "solvers": "Solvers" },
        "components": { "api": "Universal Web API", "instructions": "Game instructions" },
        "latency": "Latency",
        "latencyKind": "(daily p95)",
        "fallback": "Backup status page",
        "repo": "How this works"
    },
    "zh": {
        "title": "系统状态",
        "note": "GamesCrafters 各项服务的实时状态，每小时检查一次。时间为 UTC。",
        "loading": "正在加载状态…",
        "loadFailed": "无法加载状态。每分钟重试一次。",
        "overall": { "ok": "所有系统运行正常", "degraded": "部分系统运行缓慢", "down": "部分系统故障", "major": "重大故障" },
        "lastChecked": "上次检查",
        "stale": "状态数据可能已过时：超过 5 小时没有完成检查。",
        "refreshFailed": "无法刷新状态。显示的是最后收到的数据。",
        "newerSchema": "状态数据比此页面更新，部分详情可能缺失。",
        "groups": { "website": "网站", "api": "API", "solvers": "求解器" },
        "components": { "api": "通用 Web API", "instructions": "游戏说明" },
        "latency": "延迟",
        "latencyKind": "（每日 p95）",
        "fallback": "备用状态页",
        "repo": "工作原理"
    },
    "es": {
        "title": "Estado del sistema",
        "note": "Estado en vivo de los servicios de GamesCrafters, comprobado cada hora. Las horas están en UTC.",
        "loading": "Cargando estado…",
        "loadFailed": "No se pudo cargar el estado. Se reintenta cada minuto.",
        "overall": { "ok": "Todos los sistemas operativos", "degraded": "Algunos sistemas lentos", "down": "Interrupción parcial", "major": "Interrupción grave" },
        "lastChecked": "Última comprobación",
        "stale": "Los datos de estado pueden estar desactualizados: no se ha completado ninguna comprobación en más de 5 horas.",
        "refreshFailed": "No se pudo actualizar el estado. Se muestran los últimos datos recibidos.",
        "newerSchema": "Los datos de estado son más nuevos que esta página. Pueden faltar algunos detalles.",
        "groups": { "website": "Sitio web", "api": "API", "solvers": "Solucionadores" },
        "components": { "api": "API web universal", "instructions": "Instrucciones de juegos" },
        "latency": "Latencia",
        "latencyKind": "(p95 diario)",
        "fallback": "Página de estado de respaldo",
        "repo": "Cómo funciona"
    },
    "hi": {
        "title": "System status",
        "note": "Live status of GamesCrafters services, checked every hour. Times are in UTC.",
        "loading": "Loading status…",
        "loadFailed": "Couldn't load status. Trying again every minute.",
        "overall": { "ok": "All systems operational", "degraded": "Some systems degraded", "down": "Partial outage", "major": "Major outage" },
        "lastChecked": "Last checked",
        "stale": "Status data may be stale: no check has completed in over 5 hours.",
        "refreshFailed": "Couldn't refresh status. Showing the last data received.",
        "newerSchema": "The status data is newer than this page. Some details may be missing.",
        "groups": { "website": "Website", "api": "API", "solvers": "Solvers" },
        "components": { "api": "Universal Web API", "instructions": "Game instructions" },
        "latency": "Latency",
        "latencyKind": "(daily p95)",
        "fallback": "Backup status page",
        "repo": "How this works"
    }
}
</i18n>
