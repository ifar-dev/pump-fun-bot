# Pump Callout Bot — Phase 1

A standalone Pump.fun Callouts reader.

## Current goal

Reproduce the data behind the Pump.fun **Following / Callouts** feed and identify:

- creator
- callout/action
- token
- mint address
- ticker
- market cap
- timestamp

### No trading yet

This phase does **not** contain a wallet, BUY logic, SELL logic, or private-key handling.

## GitHub mobile test

1. Extract this ZIP.
2. Upload the **contents of the extracted folder** to the root of your new GitHub repository.
3. Make sure `.github/workflows/callout-reader-test.yml` is present.
4. In GitHub:
   `Settings → Secrets and variables → Actions`
5. Add the authorized API/session value as secret:
   `PUMP_API_TOKEN`
6. Add `PUMP_RSC` as a secret if your authorized request requires it.
7. Optionally create repository variable:
   `PUMP_CALLOUTS_URL`
   with:
   `https://advanced-api-v2.pump.fun/callouts`
8. Open:
   `Actions → Pump Callout Reader Test → Run workflow`
9. Select 5 minutes.

The workflow uses `npm install`, so a package-lock.json is not required for this initial test.

## Security

Do not commit `.env`.

Do not paste API/session credentials into source files.

Do not put a wallet seed phrase or private key in this project.

Use only an authentication/access method that Pump.fun permits.

## What we need from the first run

The Actions log should show the actual response from the Callouts endpoint. Remove/redact any authorization information before sharing logs.

Once the real response schema is known, the parser will be made exact instead of relying on guessed field names.

## Planned later phases

1. Exact Following-feed parser
2. New-callout detection
3. Paper trading
4. Pump.fun/PumpSwap execution
5. Position monitoring
6. Fee/slippage-aware +10% take-profit
7. Safety limits and kill switch
8. VPS deployment
