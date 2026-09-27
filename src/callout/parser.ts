import type { FomoCalloutItem, NormalizedCallout } from "../types.js";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function asNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : null;
}

function normalizeTimestamp(value: unknown): string {
  if (typeof value === "string") return value;

  if (typeof value === "number" && Number.isFinite(value)) {
    return new Date(
      value < 10_000_000_000 ? value * 1000 : value
    ).toISOString();
  }

  return new Date(0).toISOString();
}

function isCalloutItem(value: unknown): value is FomoCalloutItem {
  if (!isRecord(value)) return false;

  return (
    typeof value.id === "string" &&
    typeof value.wallet === "string" &&
    typeof value.userName === "string" &&
    typeof value.coinMint === "string" &&
    typeof value.coinSymbol === "string" &&
    typeof value.coinName === "string"
  );
}

function getItems(payload: unknown): unknown[] {
  if (!isRecord(payload)) return [];

  if (Array.isArray(payload.items)) {
    return payload.items;
  }

  const data = payload.data;

  if (isRecord(data) && Array.isArray(data.items)) {
    return data.items;
  }

  return [];
}

export function normalizeCallouts(
  payload: unknown
): NormalizedCallout[] {
  return getItems(payload)
    .filter(isCalloutItem)
    .map((item) => ({
      id: item.id,
      wallet: item.wallet,
      userName: item.userName,
      xUsername: asString(item.xUsername),
      isVerified: item.isVerified === true,
      mint: item.coinMint,
      chain: asString(item.chain),
      ticker: item.coinSymbol,
      tokenName: item.coinName,
      thesis: asString(item.thesis),
      mediaUrl: asString(item.mediaUrl),
      calledOutAtMcap: asNumber(item.calledOutAtMcap),
      multiple: asNumber(item.multiple),
      maxMultiplier: asNumber(item.maxMultiplier),
      createdAt: normalizeTimestamp(item.createdAt),
      raw: item
    }));
}

export function getNextBefore(payload: unknown): string | null {
  if (!isRecord(payload)) return null;

  if (typeof payload.nextBefore === "string") {
    return payload.nextBefore;
  }

  const data = payload.data;

  if (
    isRecord(data) &&
    typeof data.nextBefore === "string"
  ) {
    return data.nextBefore;
  }

  return null;
}

export function getCount(payload: unknown): number {
  if (!isRecord(payload)) return 0;

  if (typeof payload.count === "number") {
    return payload.count;
  }

  const data = payload.data;

  if (isRecord(data) && typeof data.count === "number") {
    return data.count;
  }

  return 0;
}

export function isAllowedCaller(
  item: NormalizedCallout,
  wallets: Set<string>,
  usernames: Set<string>
): boolean {
  if (wallets.size === 0 && usernames.size === 0) {
    return true;
  }

  return (
    wallets.has(item.wallet.toLowerCase()) ||
    usernames.has(item.userName.toLowerCase())
  );
}
