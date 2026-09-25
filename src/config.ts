import "dotenv/config";

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function positiveInt(name: string, fallback: number): number {
  const value = Number(process.env[name] || fallback);
  if (!Number.isInteger(value) || value <= 0) throw new Error(`${name} must be a positive integer`);
  return value;
}

export const config = {
  apiToken: required("PUMP_API_TOKEN"),
  calloutsUrl: process.env.PUMP_CALLOUTS_URL?.trim() ||
    "https://frontend-api-v3.pump.fun/following-positions/alerts",
  pollIntervalMs: positiveInt("POLL_INTERVAL_MS", 5000),
  pageSize: positiveInt("PUMP_PAGE_SIZE", 20),
  minTradeAmountUsd: Number(process.env.MIN_TRADE_AMOUNT_USD || 10),
  debugRaw: (process.env.DEBUG_RAW || "false").toLowerCase() === "true",
  baselineOnStart: (process.env.BASELINE_ON_START || "false").toLowerCase() === "true"
};
