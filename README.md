# Pump Callout Bot — Phase 1 (FomoScan)

Standalone Pump.fun Callout reader using the documented FomoScan Pump API.

## Data source

`GET https://api.fomoscan.sh/v2/pump/thesis`

FomoScan documents this as the Pump.fun global Callout feed, newest first. The parser accepts the direct response shape observed in the live API docs and also a `data.items` envelope.

## Extracted fields

Callout ID, Pump.fun wallet, username, X username, token mint, symbol, token name, thesis, callout market cap, multiple, max multiple, and creation time.

Callouts are de-duplicated by `id`.

## Caller filtering

Set `FOLLOWED_WALLETS=wallet1,wallet2` or `FOLLOWED_USERNAMES=user1,user2`. If both are empty, all new Callouts are printed for the first test.

## GitHub Actions

Create the secret `FOMOSCAN_API_KEY`. Never commit the key.

The short test workflow polls every 30 seconds. The application default is 5 minutes to reduce API usage.

## No trading

Phase 1 contains no wallet, private key, seed phrase, BUY, or SELL logic.
