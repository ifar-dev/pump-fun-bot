import type { NormalizedCallout, PumpCalloutFeedResponse, PumpCalloutItem } from "../types.js";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isCalloutItem(value: unknown): value is PumpCalloutItem {
  if (!isRecord(value)) return false;
  return value.kind === "callout" &&
    isRecord(value.author) &&
    typeof value.author.userId === "string" &&
    typeof value.author.userName === "string" &&
    typeof value.coinMint === "string" &&
    isRecord(value.callout) &&
    typeof value.callout.calloutId === "string" &&
    typeof value.callout.calloutTimestamp === "string";
}

export function normalizeCallouts(payload: unknown): NormalizedCallout[] {
  if (!isRecord(payload) || !Array.isArray(payload.items)) return [];

  return payload.items.filter(isCalloutItem).map((item) => ({
    id: item.callout.calloutId,
    creator: item.author.userName,
    creatorUserId: item.author.userId,
    creatorWallet: item.author.walletAddress ?? null,
    action: "callout" as const,
    mint: item.coinMint,
    ticker: item.symbol,
    tokenName: item.coinName,
    timestamp: item.callout.calloutTimestamp,
    marketCap: item.marketCap,
    calledOutAtMcap: item.callout.calledOutAtMcap,
    multiple: item.callout.multiple,
    calloutPrice: item.callout.calloutPrice,
    thesis: item.callout.thesis ?? null,
    maxMultiplier: item.callout.maxMultiplier,
    maxMultiplierAt: item.callout.maxMultiplierAt ?? null,
    raw: item
  }));
}

export function getNextCursor(payload: unknown): string | null {
  if (!isRecord(payload)) return null;
  return typeof payload.nextCursor === "string" ? payload.nextCursor : null;
}

export function isFeedResponse(payload: unknown): payload is PumpCalloutFeedResponse {
  return isRecord(payload) && Array.isArray(payload.items) &&
    payload.items.every((item) => isCalloutItem(item));
}
