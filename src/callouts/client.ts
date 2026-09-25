import { config } from "../config.js";

function cleanToken(raw: string): string {
  return raw.trim().replace(/^auth_token=/, "").replace(/;.*$/, "").trim();
}

export async function fetchCallouts(): Promise<unknown> {
  const url = new URL(config.calloutsUrl);
  url.searchParams.set("pageSize", String(config.pageSize));
  url.searchParams.set("kinds", "callout");
  url.searchParams.set("minTradeAmountUsd", String(config.minTradeAmountUsd));

  const token = cleanToken(config.apiToken);
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Cookie: `auth_token=${token}`,
      Accept: "application/json"
    }
  });

  const body = await response.text();
  if (!response.ok) {
    throw new Error(`Pump.fun API ${response.status}: ${body.slice(0, 1000)}`);
  }

  try {
    return JSON.parse(body);
  } catch {
    return body;
  }
}
