export type UnknownRecord = Record<string, unknown>;

export interface NormalizedCallout {
  id: string | null;
  creator: string | null;
  action: string | null;
  mint: string | null;
  ticker: string | null;
  tokenName: string | null;
  timestamp: string | null;
  marketCap: string | number | null;
  raw: unknown;
}
