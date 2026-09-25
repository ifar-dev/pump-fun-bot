# Pump Callout Bot — Phase 1

Standalone Pump.fun Following / Callouts reader.

Current endpoint:
`https://frontend-api-v3.pump.fun/following-positions/alerts`

The client requests `pageSize=20`, `kinds=callout`, and `minTradeAmountUsd=10`.

The parser matches the live response shape observed from Pump.fun:
`items[] -> kind === "callout" -> author + coin + callout`.

A Callout is de-duplicated by `callout.calloutId`.

## GitHub Actions

Add `PUMP_API_TOKEN` as a GitHub Actions secret. Do not commit or paste the value into source code.

The workflow uses a baseline on startup so existing Callouts are ignored; a newly appearing Callout during the test window is printed.

No trading, wallet, private-key, or seed-phrase logic is included in Phase 1.
