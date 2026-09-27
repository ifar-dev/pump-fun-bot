import { config } from "../config.js";

export async function fetchCallouts(): Promise<unknown> {
  const response = await fetch(config.fomoCalloutsUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${config.fomoApiKey}`,
      Accept: "application/json"
    }
  });

  const body = await response.text();
  if (!response.ok) throw new Error(`FomoScan API ${response.status}: ${body.slice(0, 1000)}`);
  try { return JSON.parse(body); } catch { return body; }
}
