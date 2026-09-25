import { config } from "../config.js";

/**
 * pump.fun's frontend-api-v3 / advanced-api-v2 auth is via an `auth_token`
 * cookie, not an Authorization header. This strips a few things users
 * commonly paste by accident: a leading "auth_token=" label, a trailing
 * ";" (cookie separator), or surrounding whitespace.
 */
function cleanToken(raw: string): string {
  return raw
    .trim()
    .replace(/^auth_token=/, "")
    .replace(/;.*$/, "")
    .trim();
}

export async function fetchCallouts(): Promise<unknown> {
  const url = new URL(config.calloutsUrl);

  if (config.rsc) {
    url.searchParams.set("_rsc", config.rsc);
  }

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
