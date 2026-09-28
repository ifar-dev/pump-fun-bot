name: FomoScan Callout Reader

run-name: FomoScan REST Test - ${{ inputs.duration }}m - ${{ inputs.interval }}ms

on:
  workflow_dispatch:
    inputs:
      duration:
        description: "How many minutes to run the Callout reader"
        required: true
        default: "5"
        type: string

      interval:
        description: "Polling interval in milliseconds"
        required: true
        default: "2000"
        type: string

jobs:
  callout-reader:
    runs-on: ubuntu-latest

    timeout-minutes: 10

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm install

      - name: Build TypeScript
        run: npm run build

      - name: Run FomoScan Callout reader
        env:
          FOMOSCAN_API_KEY: ${{ secrets.FOMOSCAN_API_KEY }}

          FOMOSCAN_CALLOUTS_URL: https://api.fomoscan.sh/v2/pump/thesis

          POLL_INTERVAL_MS: ${{ inputs.interval }}

          FOLLOWED_WALLETS: "9LXWa7V3AE15VfBupcx5gDts2ix3Y9NzbcKZKjkkq6hV,CE44oKS3wpUerx8afyeii56u5oQjBLZknzm4Q2CYHUz9,5FnE3q4tcDkEjRGuHgcxoBLXoZjWXDE5xEpJyneHDc9"

          FOLLOWED_USERNAMES: "@rikz_,@ely,@megz0101"

          BUY_AMOUNT_SOL: "0.04"

          DEBUG_RAW: "false"

          BASELINE_ON_START: "false"

        run: |
          DURATION_MINUTES="${{ inputs.duration }}"

          echo "=========================================="
          echo "FomoScan Pump.fun Callout Reader"
          echo "=========================================="
          echo "Duration : ${DURATION_MINUTES} minute(s)"
          echo "Interval : ${POLL_INTERVAL_MS} ms"
          echo "Endpoint : ${FOMOSCAN_CALLOUTS_URL}"
          echo "=========================================="

          timeout "${DURATION_MINUTES}m" npm start || STATUS=$?

          if [ "${STATUS:-0}" -ne 0 ] && [ "${STATUS:-0}" -ne 124 ]; then
            exit "${STATUS}"
          fi
