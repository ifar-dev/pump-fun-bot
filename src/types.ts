export interface FomoCalloutItem {
  id: string; wallet: string; userName: string; xUsername?: string | null; isVerified?: boolean;
  coinMint: string; chain?: string | null; coinSymbol: string; coinName: string; thesis?: string | null;
  mediaUrl?: string | null; calledOutAtMcap?: number | null; multiple?: number | null; maxMultiplier?: number | null;
  createdAt: string | number; [key: string]: unknown;
}
export interface NormalizedCallout {
  id: string; wallet: string; userName: string; xUsername: string | null; isVerified: boolean; mint: string;
  chain: string | null; ticker: string; tokenName: string; thesis: string | null; mediaUrl: string | null;
  calledOutAtMcap: number | null; multiple: number | null; maxMultiplier: number | null; createdAt: string; raw: FomoCalloutItem;
}
