import "dotenv/config";

function required(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function positiveInt(name: string, fallback: number): number {
  const value = Number(process.env[name] || fallback);

  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${name} must be a positive integer`);
  }

  return value;
}

function positiveNumber(name: string, fallback: number): number {
  const value = Number(process.env[name] || fallback);

  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${name} must be a positive number`);
  }

  return value;
}

function csvSet(name: string): Set<string> {
  return new Set(
    (process.env[name] || "")
      .split(",")
      .map((v) => v.trim().toLowerCase().replace(/^@/, ""))
      .filter(Boolean)
  );
}

export const config = {
  fomoApiKey: required("FOMOSCAN_API_KEY"),

  fomoCalloutsUrl:
    process.env.FOMOSCAN_CALLOUTS_URL?.trim() ||
    "https://api.fomoscan.sh/v2/pump/thesis",

  pollIntervalMs: positiveInt("POLL_INTERVAL_MS", 300000),

  followedWallets: csvSet("FOLLOWED_WALLETS"),
  followedUsernames: csvSet("FOLLOWED_USERNAMES"),

  buyAmountSol: positiveNumber("BUY_AMOUNT_SOL", 0.04),

  debugRaw:
    (process.env.DEBUG_RAW || "false").toLowerCase() === "true",

  baselineOnStart:
    (process.env.BASELINE_ON_START || "false").toLowerCase() === "true"
};
