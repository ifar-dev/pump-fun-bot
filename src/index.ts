import { config } from "./config.js";
import { fetchCallouts } from "./callouts/client.js";
import { getCount, getNextBefore, isAllowedCaller, normalizeCallouts } from "./callouts/parser.js";
import type { NormalizedCallout } from "./types.js";
const seen = new Set<string>(); let initialized = false;
const money = (v: number | null) => v === null ? "n/a" : `$${v.toLocaleString()}`;
const multiple = (v: number | null) => v === null ? "n/a" : `${v.toFixed(4)}x`;
function printCallout(i: NormalizedCallout): void {
  console.log("\n================ NEW PUMP.FUN CALLOUT ================");
  console.log(`Creator       : ${i.userName}`); console.log(`Wallet        : ${i.wallet}`); console.log(`Ticker        : ${i.ticker}`);
  console.log(`Token         : ${i.tokenName}`); console.log(`Mint          : ${i.mint}`); console.log(`Callout MC    : ${money(i.calledOutAtMcap)}`);
  console.log(`Multiple      : ${multiple(i.multiple)}`); console.log(`Max Multiple  : ${multiple(i.maxMultiplier)}`); console.log(`Thesis        : ${i.thesis ?? "none"}`);
  console.log(`Callout ID    : ${i.id}`); console.log(`Time          : ${i.createdAt}`); console.log("========================================================\n");
}
async function poll(): Promise<void> {
  try {
    const payload = await fetchCallouts(); const items = normalizeCallouts(payload);
    if (config.debugRaw) console.dir(payload, { depth: 5, maxArrayLength: 25 });
    else { console.log(`[${new Date().toISOString()}] FomoScan OK — ${getCount(payload)} returned, parsed ${items.length}`); const c = getNextBefore(payload); if (c) console.log(`nextBefore: ${c}`); }
    if (!initialized) {
      if (config.baselineOnStart) { for (const i of items) seen.add(i.id); console.log(`Baseline established: ${items.length} existing Callout(s) ignored.`); }
      else for (const i of items) { if (seen.has(i.id)) continue; seen.add(i.id); if (isAllowedCaller(i, config.followedWallets, config.followedUsernames)) printCallout(i); }
      initialized = true; return;
    }
    let newCount = 0;
    for (const i of items) { if (seen.has(i.id)) continue; seen.add(i.id); newCount++; if (isAllowedCaller(i, config.followedWallets, config.followedUsernames)) printCallout(i); }
    if (newCount > 0) console.log(`New Callouts seen this poll: ${newCount}`);
    if (seen.size > 5000) { const keep = [...seen].slice(-2500); seen.clear(); for (const k of keep) seen.add(k); }
  } catch (error) { console.error(`[${new Date().toISOString()}] Poll failed:`, error instanceof Error ? error.message : error); }
}
console.log("Pump Callout Bot — Phase 1 / FomoScan"); console.log("Trading is NOT enabled in this version."); console.log(`Endpoint: ${config.fomoCalloutsUrl}`);
console.log(`Polling every ${config.pollIntervalMs} ms`); console.log(`Caller filter: ${config.followedWallets.size || config.followedUsernames.size ? "enabled" : "disabled (all Callouts)"}`);
console.log(`Baseline on start: ${config.baselineOnStart}`); await poll(); setInterval(poll, config.pollIntervalMs);
