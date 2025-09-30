export interface RecentCheck {
  medA: string;
  medB: string;
  isPotentiallyRisky: boolean;
  timestamp: string;
}

export interface InteractionResult {
  medications: [string, string];
  isPotentiallyRisky: boolean;
  reason: string;
  advice: string;
}
