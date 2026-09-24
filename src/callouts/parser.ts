import type { NormalizedCallout, UnknownRecord } from "../types.js";

const ID_KEYS = ["id", "calloutId", "callout_id"];
const CREATOR_KEYS = [
  "username",
  "userName",
  "creatorUsername",
  "handle",
  "displayName"
];
const MINT_KEYS = [
  "mint",
  "mintAddress",
  "tokenMint",
  "tokenAddress",
  "ca",
  "contractAddress"
];
const TICKER_KEYS = ["symbol", "ticker"];
const NAME_KEYS = ["name", "tokenName"];
const ACTION_KEYS = ["action", "type", "eventType"];
const TIME_KEYS = ["createdAt", "created_at", "timestamp", "time"];
const MC_KEYS = ["marketCap", "market_cap", "mc"];

function firstString(obj: UnknownRecord, keys: string[]): string | null {
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return null;
}

function firstValue(
  obj: UnknownRecord,
  keys: string[]
): string | number | null {
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === "string" || typeof value === "number") {
      return value;
    }
  }
  return null;
}

function looksLikeCallout(obj: UnknownRecord): boolean {
  return (
    ID_KEYS.some((key) => key in obj) ||
    MINT_KEYS.some((key) => key in obj) ||
    ACTION_KEYS.some((key) => key in obj)
  );
}

function collectObjects(
  value: unknown,
  out: UnknownRecord[] = []
): UnknownRecord[] {
  if (Array.isArray(value)) {
    for (const item of value) {
      collectObjects(item, out);
    }
    return out;
  }

  if (value && typeof value === "object") {
    const obj = value as UnknownRecord;

    if (looksLikeCallout(obj)) {
      out.push(obj);
    }

    for (const child of Object.values(obj)) {
      collectObjects(child, out);
    }
  }

  return out;
}

export function normalizeCallouts(payload: unknown): NormalizedCallout[] {
  return collectObjects(payload).map((obj) => ({
    id: firstString(obj, ID_KEYS),
    creator: firstString(obj, CREATOR_KEYS),
    action: firstString(obj, ACTION_KEYS),
    mint: firstString(obj, MINT_KEYS),
    ticker: firstString(obj, TICKER_KEYS),
    tokenName: firstString(obj, NAME_KEYS),
    timestamp: firstString(obj, TIME_KEYS),
    marketCap: firstValue(obj, MC_KEYS),
    raw: obj
  }));
}
