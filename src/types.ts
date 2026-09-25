export interface PumpCalloutAuthor {
  userId: string;
  userName: string;
  profileImage?: string | null;
  walletAddress?: string | null;
  isVerified?: boolean;
  verifiedBadgeVisible?: boolean;
  xUsername?: string | null;
  kind?: string | null;
}

export interface PumpCalloutDetails {
  calloutId: string;
  calledOutAtMcap: number;
  multiple: number;
  thesis?: string | null;
  mediaUrl?: string | null;
  calloutTimestamp: string;
  likes?: number;
  hasLiked?: boolean;
  updates?: unknown[];
  updateCount?: number;
  commentCount?: number;
  replyCount?: number;
  maxMultiplier?: number;
  maxMultiplierAt?: string | null;
  calloutPrice: number;
  repostCount?: number;
  quoteCount?: number;
  hasReposted?: boolean;
  viewCount?: number;
  quotedCalloutId?: string | null;
  quotedCallout?: unknown;
  actingUserId?: string | null;
  actingUser?: unknown;
}

export interface PumpCalloutItem {
  kind: "callout";
  author: PumpCalloutAuthor;
  coinMint: string;
  chainId: number;
  walletAddress?: string | null;
  createdAt: string;
  coinName: string;
  coinImage?: string | null;
  symbol: string;
  marketCap: number;
  callout: PumpCalloutDetails;
  position?: unknown;
  reply?: unknown;
  repost?: unknown;
  trade?: unknown;
  like?: unknown;
  post?: unknown;
  totalCallouts?: number;
}

export interface PumpCalloutFeedResponse {
  items: PumpCalloutItem[];
  nextCursor?: string | null;
}

export interface NormalizedCallout {
  id: string;
  creator: string;
  creatorUserId: string;
  creatorWallet: string | null;
  action: "callout";
  mint: string;
  ticker: string;
  tokenName: string;
  timestamp: string;
  marketCap: number;
  calledOutAtMcap: number;
  multiple: number;
  calloutPrice: number;
  thesis: string | null;
  maxMultiplier?: number;
  maxMultiplierAt: string | null;
  raw: PumpCalloutItem;
}
