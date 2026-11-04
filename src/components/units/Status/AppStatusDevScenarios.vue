<template>
    <div id="app-status-dev-scenarios">
        <label for="status-dev-scenario">Dev data</label>
        <select id="status-dev-scenario" :value="current" @change="onChange">
            <option value="">Live (GitHub)</option>
            <option v-for="scenario in scenarios" :key="scenario" :value="scenario">{{ scenario }}</option>
        </select>
    </div>
</template>

<script lang="ts" setup>
    // Development only: AppStatus loads this component under import.meta.env.DEV, so production
    // builds never include it. Scenarios come from GamesCraftersStatus/fixtures (serve.py, port 8099).
    const fixturesUrl = String(import.meta.env.VITE_STATUS_FIXTURES_URL || "http://localhost:8099");
    const scenarios = ["all-green", "outage", "degraded-day", "long-outage", "all-down", "gray-days", "stale", "future-schema", "flaky", "missing"];

    const params = new URLSearchParams(window.location.search);
    const data = params.get("data") ?? "";
    const current = data.startsWith(fixturesUrl + "/") ? data.slice(fixturesUrl.length + 1).replace(/\/$/, "") : "";

    const choose = async (scenario: string) => {
        if (scenario === "flaky") await fetch(`${fixturesUrl}/flaky/reset`).catch(() => undefined);
        if (scenario) params.set("data", `${fixturesUrl}/${scenario}`);
        else params.delete("data");
        const query = params.toString();
        window.location.search = query ? `?${query}` : "";
    };
    const onChange = (event: Event) => choose((event.target as HTMLSelectElement).value);
</script>

<style lang="scss" scoped>
    #app-status-dev-scenarios {
        align-items: center;
        background-color: var(--backgroundColor);
        border: 0.1rem dashed var(--primaryColor);
        border-radius: 0.8rem;
        bottom: 1.2rem;
        box-shadow: 0 0.2rem 0.8rem rgba(0, 0, 0, 0.2);
        display: flex;
        gap: 0.8rem;
        padding: 0.6rem 1rem;
        position: fixed;
        right: 1.2rem;
        z-index: 10;
        label {
            font-size: 1.2rem;
            font-weight: 600;
        }
        select {
            background-color: var(--backgroundColor);
            border: 0.1rem solid var(--neutralColor);
            border-radius: 0.4rem;
            color: var(--primaryColor);
            font-size: 1.3rem;
            min-height: 3.2rem;
            padding: 0 0.6rem;
        }
    }
</style>
