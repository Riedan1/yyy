/**
 * @license
 * Growth Studio Types - YOMI Platform
 * Complete architecture for multi-page landing campaigns, smart link routing,
 * traffic distribution, and conversion intelligence.
 */

export type TrafficSourceType =
  | "Facebook"
  | "Instagram"
  | "TikTok"
  | "Snapchat"
  | "Google"
  | "WhatsApp"
  | "Direct"
  | "Other";

export type CampaignGoal =
  | "purchases"
  | "leads"
  | "add_to_cart"
  | "checkout"
  | "revenue";

export type StrategyFocus =
  | "benefits"
  | "social_proof"
  | "offer_urgency"
  | "minimal_clean"
  | "storytelling"
  | "custom";

export type SectionType =
  | "hero"
  | "product"
  | "benefits"
  | "features"
  | "testimonials"
  | "reviews"
  | "comparison"
  | "faq"
  | "guarantee"
  | "cta"
  | "urgency"
  | "footer";

export interface LandingPageSection {
  id: string;
  type: SectionType;
  visible: boolean;
  headline: string;
  subheadline?: string;
  badge?: string;
  imageUrl?: string;
  videoUrl?: string;
  ctaText?: string;
  ctaSubtext?: string;
  items?: Array<{
    title: string;
    description: string;
    icon?: string;
    rating?: number;
    author?: string;
    authorLocation?: string;
    avatar?: string;
    highlight?: boolean;
  }>;
  customData?: Record<string, any>;
}

export interface GrowthLandingPage {
  id: string;
  campaignId: string;
  name: string; // e.g., "Landing Page 01", "Landing Page 02", "Landing Page 03"
  status: "active" | "paused";
  strategyFocus: StrategyFocus;
  trafficAllocation: number; // e.g. 40 (meaning 40%)
  suggestedAllocation?: number;
  theme: {
    primaryColor: string;
    accentColor: string;
    backgroundColor: string;
    fontFamily: string;
    buttonStyle: "pill" | "rounded" | "sharp";
    badgeText?: string;
  };
  sections: LandingPageSection[];
  metrics: {
    visitors: number;
    uniqueVisitors: number;
    sessions: number;
    pageViews: number;
    addToCart: number;
    checkoutStarted: number;
    conversions: number; // purchases or leads
    revenue: number;
    averageOrderValue: number;
  };
  sourceBreakdown: Record<string, {
    visitors: number;
    conversions: number;
    revenue: number;
  }>;
  deviceBreakdown: {
    mobile: { visitors: number; conversions: number; revenue: number };
    desktop: { visitors: number; conversions: number; revenue: number };
    tablet: { visitors: number; conversions: number; revenue: number };
  };
}

export interface GrowthCampaign {
  id: string;
  storeId: string;
  name: string;
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    imageUrl: string;
    category?: string;
    description?: string;
    sku?: string;
  };
  offer: string;
  trafficSources: TrafficSourceType[];
  goal: CampaignGoal;
  status: "active" | "paused" | "archived";
  createdAt: string;
  updatedAt: string;
  distributionMode: "manual" | "smart";
  distributionRationale?: string;
  smartLinkSlug: string;
  landingPages: GrowthLandingPage[];
  settings: {
    confidenceThreshold: number; // min visitors before declaring leading page (e.g. 150)
    autoOptimize: boolean;
    pixelTracking: boolean;
  };
}

export interface GrowthStudioAdminPlanConfig {
  maxCampaigns: number;
  maxLandingPagesPerCampaign: number;
  allowAiGeneration: boolean;
  allowSmartOptimization: boolean;
  analyticsRetentionDays: number;
  trafficLimitPerMonth: number;
}
