import { config } from "./config.js";
import { fetchCallouts } from "./callouts/client.js";
import { normalizeCallouts } from "./callouts/parser.js";
import type { NormalizedCallout } from "./types.js";

const seen = new Set<string>();
let initialized = false;

function printCallout(item: NormalizedCallout): void {
  console.log("\n================ NEW PUMP.FUN CALLOUT ================");
  console.log(`Creator       : ${item.creator}`);
  console.log(`Ticker        : ${item.ticker}`);
  console.log(`Token         : ${item.tokenName}`);
  console.log(`Mint          : ${item.mint}`);
  console.log(`Callout MC    : $${item.calledOutAtMcap.toLocaleString()}`);
  console.log(`Current MC    : $${item.marketCap.toLocaleString()}`);
  console.log(`Multiple      : ${item.multiple.toFixed(4)}x`);
  console.log(`Callout Price : ${item.calloutPrice}`);
  console.log(`Thesis        : ${item.thesis ?? "none"}`);
  console.log(`Callout ID    : ${item.id}`);
  console.log(`Time          : ${item.timestamp}`);
  console.log("========================================================\n");
}

async function poll(): Promise<void> {
  try {
    const payload = await fetchCallouts();
    const items = normalizeCallouts(payload);

    if (config.debugRaw) console.dir(payload, { depth: 4, maxArrayLength: 20 });
    else console.log(`[${new Date().toISOString()}] Feed OK — ${items.length} callouts`);

    if (!initialized) {
      if (config.baselineOnStart) {
        for (const item of items) seen.add(item.id);
        console.log(`Baseline established: ${items.length} existing callout(s) ignored.`);
      } else {
        for (const item of items) {
          if (!seen.has(item.id)) {
            seen.add(item.id);
            printCallout(item);
          }
        }
      }
      initialized = true;
      return;
    }

    for (const item of items) {
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      printCallout(item);
    }

    if (seen.size > 5000) {
      const keep = [...seen].slice(-2500);
      seen.clear();
      for (const key of keep) seen.add(key);
    }
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Poll failed:`, error instanceof Error ? error.message : error);
  }
}

console.log("Pump Callout Reader — Phase 1");
console.log("Trading is NOT enabled in this version.");
console.log(`Endpoint: ${config.calloutsUrl}`);
console.log(`Polling every ${config.pollIntervalMs} ms`);
console.log(`Baseline on start: ${config.baselineOnStart}`);

await poll();
setInterval(poll, config.pollIntervalMs);
