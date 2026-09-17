import React, { useState } from "react";
import { 
  X, 
  Sparkles, 
  Layers, 
  Check, 
  ArrowRight, 
  ArrowLeft,
  DollarSign,
  Share2,
  Target
} from "lucide-react";
import { GrowthCampaign, GrowthLandingPage, StrategyFocus } from "../../types/growthStudio";
import { Product } from "../../types";

interface CreateCampaignModalProps {
  storeProducts: Product[];
  onCreated: (campaign: GrowthCampaign) => void;
  onClose: () => void;
}

const ALL_TRAFFIC_SOURCES = [
  "Instagram",
  "TikTok",
  "Facebook",
  "Google",
  "Snapchat",
  "WhatsApp"
];

const GOALS: { id: "sales" | "leads" | "testing" | "awareness"; label: string; desc: string }[] = [
  {
    id: "sales",
    label: "Direct Sales (COD)",
    desc: "Maximize immediate cash-on-delivery orders through fast single-click checkouts."
  },
  {
    id: "testing",
    label: "Offer & Angle Discovery",
    desc: "Discover which marketing value proposition yields the highest conversion rate."
  },
  {
    id: "leads",
    label: "Qualified Customer Leads",
    desc: "Collect verified phone numbers and Wilaya addresses for phone confirmation."
  },
  {
    id: "awareness",
    label: "Product Launch & Reach",
    desc: "Introduce a new flagship product to the Algerian market across multiple ad networks."
  }
];

export const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({
  storeProducts,
  onCreated,
  onClose
}) => {
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1 states
  const [name, setName] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<string>(
    storeProducts[0]?.id || "prod-default"
  );
  const [offer, setOffer] = useState("Special Launch Offer: 25% Off + Express 58 Wilayas COD Delivery");
  const [selectedSources, setSelectedSources] = useState<string[]>([
    "Instagram",
    "TikTok",
    "Facebook"
  ]);
  const [goal, setGoal] = useState<"sales" | "leads" | "testing" | "awareness">("sales");

  // Step 2 states
  const [pagesCount, setPagesCount] = useState<number>(3);
  const [creationMethod, setCreationMethod] = useState<"ai" | "template">("ai");

  const defaultProduct = storeProducts.find((p) => p.id === selectedProductId) || {
    id: "prod-1",
    name: "Ergonomic Performance Footwear",
    price: 4900,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    description: "Designed for all-day comfort with ultra-light breathability and shock absorption."
  };

  const toggleSource = (source: string) => {
    if (selectedSources.includes(source)) {
      if (selectedSources.length > 1) {
        setSelectedSources(selectedSources.filter((s) => s !== source));
      }
    } else {
      setSelectedSources([...selectedSources, source]);
    }
  };

  const handleFinish = () => {
    const campaignSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || `campaign-${Date.now().toString().slice(-4)}`;

    const share = Math.floor(100 / pagesCount);
    const remainder = 100 - share * pagesCount;

    const initialPages: GrowthLandingPage[] = Array.from({ length: pagesCount }).map((_, idx) => {
      const isFirst = idx === 0;
      const isSecond = idx === 1;
      const strategy: StrategyFocus = isFirst
        ? "benefits"
        : isSecond
        ? "social_proof"
        : "offer_urgency";

      const lpName = `Landing Page 0${idx + 1}`;
      const alloc = isFirst ? share + remainder : share;

      return {
        id: `lp-${Date.now()}-${idx + 1}`,
        campaignId: "",
        name: lpName,
        status: "active",
        strategyFocus: strategy,
        trafficAllocation: alloc,
        theme: {
          primaryColor: isFirst ? "#4f46e5" : isSecond ? "#059669" : "#dc2626",
          accentColor: isFirst ? "#06b6d4" : isSecond ? "#10b981" : "#f59e0b",
          backgroundColor: "#ffffff",
          fontFamily: "sans-serif",
          buttonStyle: "pill",
          badgeText: isFirst ? "Best Seller" : isSecond ? "Verified Quality" : "Limited Time Offer"
        },
        metrics: {
          visitors: 0,
          uniqueVisitors: 0,
          sessions: 0,
          pageViews: 0,
          addToCart: 0,
          checkoutStarted: 0,
          conversions: 0,
          revenue: 0,
          averageOrderValue: defaultProduct.price
        },
        sourceBreakdown: {},
        deviceBreakdown: {
          mobile: { visitors: 0, conversions: 0, revenue: 0 },
          desktop: { visitors: 0, conversions: 0, revenue: 0 },
          tablet: { visitors: 0, conversions: 0, revenue: 0 }
        },
        sections: [
          {
            id: `sec-${idx}-1`,
            type: "hero",
            visible: true,
            headline: isFirst
              ? `Experience Peak Ergonomic Comfort with ${defaultProduct.name}`
              : isSecond
              ? `Why Over 4,200 Algerian Customers Switched to ${defaultProduct.name}`
              : `Flash Promo: Order ${defaultProduct.name} Today & Save 25%`,
            subheadline: offer,
            ctaText: "Order Cash on Delivery",
            imageUrl: defaultProduct.imageUrl,
            badge: isFirst ? "Ergonomic Innovation" : isSecond ? "4.9/5 Star Rated" : "Limited Stock",
            price: defaultProduct.price,
            originalPrice: Math.round(defaultProduct.price * 1.3)
          },
          {
            id: `sec-${idx}-2`,
            type: "features",
            visible: true,
            headline: isFirst
              ? "Designed for Daily Durability"
              : isSecond
              ? "Real Customer Feedback"
              : "Package Inspection Guaranteed",
            items: [
              { title: "Premium High-Grade Materials", description: "Long-lasting construction that ensures all-day comfort." },
              { title: "Inspection Before Payment", description: "Examine your package in front of the courier before paying." }
            ]
          },
          {
            id: `sec-${idx}-3`,
            type: "cta",
            visible: true,
            headline: "Complete Your Order with One Click",
            subheadline: "Enter your phone number and Wilaya. Our delivery team will call to confirm immediately.",
            ctaText: "Confirm Cash on Delivery Order"
          }
        ]
      };
    });

    const newCampaign: GrowthCampaign = {
      id: `camp-${Date.now()}`,
      storeId: "store-1",
      name: name.trim() || `Campaign ${new Date().toLocaleDateString()}`,
      product: {
        id: defaultProduct.id,
        name: defaultProduct.name,
        price: defaultProduct.price,
        imageUrl: defaultProduct.imageUrl,
        description: defaultProduct.description
      },
      offer: offer.trim() || "Special promotional offer with cash-on-delivery and fast 58-Wilaya delivery.",
      trafficSources: selectedSources,
      goal,
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      distributionMode: "smart",
      distributionRationale: "Initial smart traffic split allocated equally across all landing pages.",
      smartLinkSlug: campaignSlug,
      landingPages: initialPages,
      settings: {
        confidenceThreshold: 150,
        autoOptimize: true,
        pixelTracking: true
      }
    };

    onCreated(newCampaign);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-5 text-left max-h-[90vh] overflow-y-auto">
        
        {/* Header & Step Indicator */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block">
              Step {step} of 2
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {step === 1 ? "Campaign Details" : "Configure Landing Pages"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: CAMPAIGN DETAILS */}
        {step === 1 ? (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Campaign Name
              </label>
              <input
                type="text"
                placeholder="e.g., Summer Footwear 2026 Promo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Select Store Product
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {storeProducts.map((prod) => (
                  <option key={prod.id} value={prod.id}>
                    {prod.name} • {prod.price.toLocaleString()} DA
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Promotional Offer
              </label>
              <input
                type="text"
                placeholder="e.g., Buy 1 Get 1 50% Off + Free 58 Wilaya Delivery"
                value={offer}
                onChange={(e) => setOffer(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Traffic Sources */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Target Ad Traffic Sources
              </label>
              <div className="flex flex-wrap gap-2">
                {ALL_TRAFFIC_SOURCES.map((source) => {
                  const isChecked = selectedSources.includes(source);
                  return (
                    <button
                      key={source}
                      type="button"
                      onClick={() => toggleSource(source)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                        isChecked
                          ? "bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700"
                          : "bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                      <span>{source}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Goals */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Primary Campaign Goal
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {GOALS.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setGoal(g.id)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      goal === g.id
                        ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-slate-900 dark:text-white shadow-2xs"
                        : "border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <span className="text-xs font-bold block">{g.label}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                      {g.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* STEP 2: NUMBER OF LANDING PAGES & METHOD */
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                How many landing pages do you want to create for this campaign?
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[2, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setPagesCount(num)}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      pagesCount === num
                        ? "border-indigo-600 bg-indigo-600 text-white shadow-xs"
                        : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {num} Pages
                  </button>
                ))}
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1.5">
                Traffic will be distributed automatically across these landing pages through your single Smart Campaign Link.
              </span>
            </div>

            {/* Creation Method */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Creation Method:
              </label>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setCreationMethod("ai")}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                    creationMethod === "ai"
                      ? "border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-slate-900 dark:text-white"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">
                      Generate with AI (Recommended)
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5 block">
                      Creates distinct landing pages focusing on ergonomics, social proof, and limited-time offer urgency.
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setCreationMethod("template")}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                    creationMethod === "template"
                      ? "border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-slate-900 dark:text-white"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">
                      Use High-Converting E-Commerce Templates
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5 block">
                      Pre-built layouts optimized for fast mobile loading and Algerian cash-on-delivery buyers.
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          {step === 2 ? (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Cancel
            </button>

            {step === 1 ? (
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!name.trim()}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                <span>Next: Configure Pages</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Create Campaign</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
