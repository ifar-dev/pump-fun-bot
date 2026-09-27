import type { FomoCalloutItem, NormalizedCallout } from "../types.js";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asString(value: unknown): string | null {
  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }

  return null;
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

function normalizeTimestamp(value: unknown): string {
  if (typeof value === "string" && value.length > 0) {
    return value;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return new Date(
      value < 10_000_000_000 ? value * 1000 : value
    ).toISOString();
  }

  return new Date(0).toISOString();
}

function getString(
  value: Record<string, unknown>,
  ...keys: string[]
): string | null {
  for (const key of keys) {
    const result = asString(value[key]);

    if (result !== null) {
      return result;
    }
  }

  return null;
}

function getNumber(
  value: Record<string, unknown>,
  ...keys: string[]
): number | null {
  for (const key of keys) {
    const result = asNumber(value[key]);

    if (result !== null) {
      return result;
    }
  }

  return null;
}

function isCalloutItem(value: unknown): value is FomoCalloutItem {
  if (!isRecord(value)) {
    return false;
  }

  /*
   * FomoScan Callout records must have a stable ID and
   * token mint/wallet information. Other display fields
   * are allowed to be missing so one unusual Callout does
   * not cause the entire feed to be discarded.
   */
  const id = getString(value, "id");
  const wallet = getString(value, "wallet", "walletAddress");
  const coinMint = getString(value, "coinMint", "mint");

  return (
    id !== null &&
    wallet !== null &&
    coinMint !== null
  );
}

function getItems(payload: unknown): unknown[] {
  if (!isRecord(payload)) {
    return [];
  }

  // Direct response: { items: [...] }
  if (Array.isArray(payload.items)) {
    return payload.items;
  }

  // FomoScan response: { data: [...] }
  if (Array.isArray(payload.data)) {
    return payload.data;
  }

  // FomoScan response: { data: { items: [...] } }
  if (isRecord(payload.data)) {
    const data = payload.data;

    if (Array.isArray(data.items)) {
      return data.items;
    }

    // Some API envelopes may use results instead of items.
    if (Array.isArray(data.results)) {
      return data.results;
    }
  }

  // Additional fallback.
  if (Array.isArray(payload.results)) {
    return payload.results;
  }

  return [];
}

export function normalizeCallouts(
  payload: unknown
): NormalizedCallout[] {
  return getItems(payload)
    .filter(isCalloutItem)
    .map((value) => {
      const item = value as Record<string, unknown>;

      const wallet =
        getString(item, "wallet", "walletAddress") ?? "";

      const userName =
        getString(item, "userName", "username", "user", "handle") ??
        "unknown";

      const coinMint =
        getString(item, "coinMint", "mint") ?? "";

      const coinSymbol =
        getString(item, "coinSymbol", "symbol", "ticker") ??
        "UNKNOWN";

      const coinName =
        getString(item, "coinName", "tokenName", "name") ??
        "Unknown Token";

      return {
        id: getString(item, "id") ?? "",
        wallet,
        userName,
        xUsername: getString(item, "xUsername", "twitterUsername"),
        isVerified: item.isVerified === true,
        mint: coinMint,
        chain: getString(item, "chain", "chainId"),
        ticker: coinSymbol,
        tokenName: coinName,
        thesis: getString(item, "thesis"),
        mediaUrl: getString(item, "mediaUrl"),
        calledOutAtMcap: getNumber(
          item,
          "calledOutAtMcap",
          "calloutMcap"
        ),
        multiple: getNumber(item, "multiple"),
        maxMultiplier: getNumber(item, "maxMultiplier"),
        createdAt: normalizeTimestamp(
          item.createdAt ?? item.calloutTimestamp ?? item.timestamp
        ),
        raw: item as FomoCalloutItem
      };
    });
}

export function getNextBefore(payload: unknown): string | null {
  if (!isRecord(payload)) {
    return null;
  }

  if (typeof payload.nextBefore === "string") {
    return payload.nextBefore;
  }

  const data = payload.data;

  if (isRecord(data) && typeof data.nextBefore === "string") {
    return data.nextBefore;
  }

  return null;
}

export function getCount(payload: unknown): number {
  if (!isRecord(payload)) {
    return 0;
  }

  if (typeof payload.count === "number") {
    return payload.count;
  }

  if (Array.isArray(payload.items)) {
    return payload.items.length;
  }

  if (Array.isArray(payload.data)) {
    return payload.data.length;
  }

  const data = payload.data;

  if (isRecord(data)) {
    if (typeof data.count === "number") {
      return data.count;
    }

    if (Array.isArray(data.items)) {
      return data.items.length;
    }

    if (Array.isArray(data.results)) {
      return data.results.length;
    }
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
