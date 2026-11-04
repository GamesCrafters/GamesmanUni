// Shapes of the files the GamesCraftersStatus prober writes to its `data` branch.
// The contract is docs/DATA_FORMATS.md in GamesCrafters/GamesCraftersStatus.

export type Status = "ok" | "degraded" | "down";

export type Group = {
    id: string;
    name: string;
    components: Array<string>;
};

export type Failure = {
    at: string;
    detail: string;
};

export type StateChange = {
    at: string;
    from: Status;
    to: Status;
};

export type Component = {
    name: string;
    group: string;
    status: Status;
    since: string;
    lastCheckedAt: string;
    latencyMs: number | null;
    detail: string;
    lastFailure: Failure | null;
    lastStateChange: StateChange | null;
};

export type Current = {
    schemaVersion: number;
    updatedAt: string;
    overall: Status;
    groups: Array<Group>;
    components: Record<string, Component>;
};

export type Day = {
    checks: number;
    ok: number;
    degraded: number;
    down: number;
    avgLatencyMs: number | null;
    p95LatencyMs: number | null;
    worst: Status;
};

export type Daily = {
    schemaVersion: number;
    updatedAt: string;
    components: Record<string, Record<string, Day>>;
};

export type StatusData = {
    current: Current;
    daily: Daily;
};
