import axios from "axios";
import * as Types from "./types";

export * from "./types";

export const defaultDataSource = "https://raw.githubusercontent.com/GamesCrafters/GamesCraftersStatus/data";
export const knownSchemaVersion = 1;
export const staleAfterMs = 5 * 60 * 60 * 1000;
export const refreshEveryMs = 60 * 1000;

// Where to read current.json and daily.json from. During development only, `?data=<url>` on the
// page (or VITE_STATUS_DATA_URL) points it at local fixtures; production builds always use GitHub.
export const getDataSource = () => {
    if (import.meta.env.DEV) {
        const fromQuery = new URLSearchParams(window.location.search).get("data");
        if (fromQuery) return fromQuery.replace(/\/$/, "");
        if (import.meta.env.VITE_STATUS_DATA_URL) return String(import.meta.env.VITE_STATUS_DATA_URL).replace(/\/$/, "");
    }
    return defaultDataSource;
};

// A status this page doesn't know (say, from a newer data format) is shown as down, like the fallback page.
const knownStatus = (status: unknown): Types.Status => (status === "ok" || status === "degraded" || status === "down" ? status : "down");

const isObject = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);

// Both files are needed to draw the page, so a failure of either one counts as a failed refresh
// and the page keeps what it had.
export const loadStatus = async (dataSource: string) => {
    try {
        const [current, daily] = await Promise.all([axios.get(`${dataSource}/current.json`, { timeout: 15000 }), axios.get(`${dataSource}/daily.json`, { timeout: 15000 })]);
        if (!isObject(current.data) || !Array.isArray(current.data.groups) || !isObject(current.data.components) || typeof current.data.updatedAt !== "string") throw new Error("current.json has an unexpected shape");
        if (!isObject(daily.data) || !isObject(daily.data.components)) throw new Error("daily.json has an unexpected shape");
        const data = { current: current.data, daily: daily.data } as Types.StatusData;
        data.current.overall = knownStatus(data.current.overall);
        for (const component of Object.values(data.current.components)) component.status = knownStatus(component.status);
        return data;
    } catch (errorMessage) {
        console.error(errorMessage);
        console.error(`Error: Failed to load status data from ${dataSource}.`);
        return undefined;
    }
};

// The locale used for dates, times and numbers. Uni's "hi" strings are English placeholders (as in
// the header), so format in English too until they are translated; otherwise "Last checked" would
// be followed by Hindi script.
export const formattingLocale = (locale: string) => (locale === "hi" ? "en-US" : locale);

// Days are UTC calendar days, written YYYY-MM-DD, like the keys in daily.json.
export const utcDayKey = (time: number) => new Date(time).toISOString().slice(0, 10);

// The last `count` UTC days ending with today, oldest first.
export const lastDayKeys = (now: number, count: number) => {
    const today = new Date(utcDayKey(now) + "T00:00:00Z").getTime();
    return Array.from({ length: count }, (_, i) => utcDayKey(today - (count - 1 - i) * 24 * 60 * 60 * 1000));
};

// A missing day or a day with no checks is "no data": drawn gray and left out of uptime.
export const hasData = (day?: Types.Day): day is Types.Day => !!day && day.checks > 0;

export const dayStatus = (day?: Types.Day): Types.Status | "none" => (hasData(day) ? (day.down ? "down" : day.degraded ? "degraded" : "ok") : "none");

// Uptime = (ok + degraded) / checks over the days that have data. Undefined when there are none.
export const uptimeRatio = (days: Array<Types.Day | undefined>) => {
    let up = 0;
    let checks = 0;
    for (const day of days) {
        if (!hasData(day)) continue;
        up += day.ok + day.degraded;
        checks += day.checks;
    }
    return checks ? up / checks : undefined;
};

// Rounds down, so any failure keeps the number below 100%.
export const formatPercent = (ratio: number, locale: string) => {
    const percent = Math.floor(ratio * 10000) / 100;
    return new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(percent) + "%";
};

// A missing or malformed time shows as "–" instead of breaking the page.
const validTime = (time: unknown) => typeof time === "string" && !Number.isNaN(new Date(time).getTime());

export const formatRelative = (time: string, now: number, locale: string) => {
    if (!validTime(time)) return "–";
    const seconds = Math.round((new Date(time).getTime() - now) / 1000);
    const format = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
    const abs = Math.abs(seconds);
    if (abs < 60) return format.format(0, "second");
    if (abs < 60 * 60) return format.format(Math.round(seconds / 60), "minute");
    if (abs < 48 * 60 * 60) return format.format(Math.round(seconds / 3600), "hour");
    return format.format(Math.round(seconds / 86400), "day");
};

// A UTC day key (YYYY-MM-DD) as a short date in the reader's language, e.g. "Oct 17".
export const formatShortDay = (key: string, locale: string) => new Intl.DateTimeFormat(locale, { month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(key + "T00:00:00Z"));

export const formatUtc = (time: string) => (validTime(time) ? new Date(time).toISOString().slice(0, 16).replace("T", " ") + " UTC" : "–");

export const formatLatency = (ms: number | null, locale: string) => {
    if (ms === null || ms === undefined) return "–";
    if (ms < 1000) return `${Math.round(ms)} ms`;
    return new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(ms / 1000) + " s";
};
