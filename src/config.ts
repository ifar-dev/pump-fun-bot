import "dotenv/config";

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const config = {
  apiToken: required("PUMP_API_TOKEN"),
  calloutsUrl:
    process.env.PUMP_CALLOUTS_URL?.trim() ||
    "https://advanced-api-v2.pump.fun/callouts",
  rsc: process.env.PUMP_RSC?.trim() || "",
  pollIntervalMs: Number(process.env.POLL_INTERVAL_MS || 5000),
  debugRaw: (process.env.DEBUG_RAW || "true").toLowerCase() === "true"
};
