import { config } from "../config.js";

export async function fetchCallouts(): Promise<unknown> {
  const url = new URL(config.calloutsUrl);

  if (config.rsc) {
    url.searchParams.set("_rsc", config.rsc);
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${config.apiToken}`,
      Accept: "application/json"
    }
  });

  const body = await response.text();

  if (!response.ok) {
    throw new Error(
      `Pump.fun API ${response.status}: ${body.slice(0, 1000)}`
    );
  }

  try {
    return JSON.parse(body);
  } catch {
    return body;
  }
}
