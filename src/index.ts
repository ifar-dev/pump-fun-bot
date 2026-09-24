import { config } from "./config.js";
import { fetchCallouts } from "./callouts/client.js";
import { normalizeCallouts } from "./callouts/parser.js";
import type { NormalizedCallout } from "./types.js";

const seen = new Set<string>();

function keyFor(item: NormalizedCallout): string {
  return (
    item.id ||
    [item.creator, item.action, item.mint, item.timestamp]
      .map((value) => value ?? "")
      .join("|")
  );
}

function printCallout(item: NormalizedCallout): void {
  console.log("\n================ NEW CALLOUT ================");
  console.log(`Creator   : ${item.creator ?? "unknown"}`);
  console.log(`Action    : ${item.action ?? "unknown"}`);
  console.log(`Ticker    : ${item.ticker ?? "unknown"}`);
  console.log(`Token     : ${item.tokenName ?? "unknown"}`);
  console.log(`Mint      : ${item.mint ?? "unknown"}`);
  console.log(`MarketCap : ${item.marketCap ?? "unknown"}`);
  console.log(`Time      : ${item.timestamp ?? "unknown"}`);
  console.log("================================================\n");
}

async function poll(): Promise<void> {
  try {
    const payload = await fetchCallouts();

    if (config.debugRaw) {
      console.log(`[${new Date().toISOString()}] API response received`);
      console.dir(payload, { depth: 8, maxArrayLength: 50 });
    }

    const items = normalizeCallouts(payload);

    for (const item of items) {
      const key = keyFor(item);

      if (seen.has(key)) {
        continue;
      }

      seen.add(key);
      printCallout(item);
    }

    if (seen.size > 5000) {
      const keep = [...seen].slice(-2500);
      seen.clear();
      for (const key of keep) {
        seen.add(key);
      }
    }
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] Poll failed:`,
      error instanceof Error ? error.message : error
    );
  }
}

console.log("Pump Callout Reader — Phase 1");
console.log("Trading is NOT enabled in this version.");
console.log(`Polling every ${config.pollIntervalMs} ms`);

await poll();
setInterval(poll, config.pollIntervalMs);
