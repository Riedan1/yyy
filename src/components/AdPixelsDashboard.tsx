import React, { useState, useEffect } from "react";
import { 
  getPixelConfig, 
  savePixelConfig, 
  getPixelLogs, 
  PixelFireLog 
} from "../utils/analytics";
import { 
  Megaphone, 
  Settings, 
  Terminal, 
  RefreshCw, 
  Play, 
  Sliders, 
  TrendingUp, 
  Activity, 
  HelpCircle, 
  Percent, 
  DollarSign, 
  CheckCircle, 
  Trash2, 
  Sparkles,
  Info
} from "lucide-react";

interface AdPixelsDashboardProps {
  darkMode: boolean;
  storeName: string;
  checkPermission?: (
    action: "confirmOrders" | "prepareShipments" | "deliveryOperations" | "manageProducts" | "manageDiscounts" | "adPixels" | "manageAnalytics" | "respondReviews" | "manageFollowers",
    actionLabel: string,
    permissionLabel: string
  ) => boolean;
}

interface Campaign {
  id: string;
  name: string;
  platform: "Facebook" | "TikTok" | "Snapchat" | "Google";
  spend: number;
  impressions: number;
  clicks: number;
  carts: number;
  purchases: number;
  revenue: number;
}

export default function AdPixelsDashboard({ darkMode, storeName, checkPermission }: AdPixelsDashboardProps) {
  // Config state
  const [fbId, setFbId] = useState("");
  const [ttId, setTtId] = useState("");
  const [scId, setScId] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  // Live telemetry state
  const [logs, setLogs] = useState<PixelFireLog[]>([]);
  const [logRefreshKey, setLogRefreshKey] = useState(0);

  // ROI / ROAS simulator state
  const [adSpend, setAdSpend] = useState(50000); // 50,000 DZD
  const [cpm, setCpm] = useState(350); // 350 DZD per 1000 impressions
  const [ctr, setCtr] = useState(2.2); // 2.2% Click-Through Rate
  const [cvr, setCvr] = useState(1.8); // 1.8% Purchase Conversion Rate
  const [aov, setAov] = useState(12000); // 12,000 DZD Average Order Value
  const [activePreset, setActivePreset] = useState<string>("facebook-jewelry");

  // Mock Active Ad Campaigns for Storefront
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: "CMP-001",
      name: "Tapis Berbère Promo (Wilaya 16/31)",
      platform: "Facebook",
      spend: 42000,
      impressions: 112000,
      clicks: 2980,
      carts: 185,
      purchases: 32,
      revenue: 384000,
    },
    {
      id: "CMP-002",
      name: "Kabyle Robes Showcase Sparks",
      platform: "TikTok",
      spend: 25000,
      impressions: 185000,
      clicks: 5120,
      carts: 310,
      purchases: 19,
      revenue: 228000,
    },
    {
      id: "CMP-003",
      name: "Silver Jewelry AR Preview Lens",
      platform: "Snapchat",
      spend: 18000,
      impressions: 95000,
      clicks: 1890,
      carts: 98,
      purchases: 11,
      revenue: 154000,
    }
  ]);

  // Load config on mount
  useEffect(() => {
    const config = getPixelConfig();
    setFbId(config.facebookId);
    setTtId(config.tiktokId);
    setScId(config.snapchatId);
  }, []);

  // Update logs on an interval to show real-time stream of user events
  useEffect(() => {
    const interval = setInterval(() => {
      setLogs(getPixelLogs());
    }, 1000);
    return () => clearInterval(interval);
  }, [logRefreshKey]);

  // Handle saving Pixel IDs
  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkPermission && !checkPermission("adPixels", "Link Ad Pixels", "Ad Pixel Integration")) return;
    savePixelConfig(fbId, ttId, scId);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Preset configuration selection
  const applyPreset = (preset: string) => {
    if (checkPermission && !checkPermission("adPixels", "Apply Campaign Preset", "Ad Pixel Integration")) return;
    setActivePreset(preset);
    if (preset === "facebook-jewelry") {
      setCpm(450); // High target CPC
      setCtr(2.5); // Better creative engagement
      setCvr(2.1); // High buyer intent
      setAov(14500); // Silver jewelry average order value
    } else if (preset === "tiktok-robes") {
      setCpm(220); // Low CPC CPM on TikTok
      setCtr(3.8); // High CTR on video Spark Ads
      setCvr(1.4); // Medium impulse conversion
      setAov(8500); // Costume robe value
    } else if (preset === "snapchat-ar") {
      setCpm(280); // Moderate CPM
      setCtr(1.8); // Lens interaction CTR
      setCvr(1.1); // Funnel drop-offs
      setAov(19500); // High end rug premium product AOV
    }
  };

  // Dynamic Simulator Computations
  const computedImpressions = Math.round((adSpend / cpm) * 1000);
  const computedClicks = Math.round(computedImpressions * (ctr / 100));
  const computedCostPerClick = computedClicks > 0 ? (adSpend / computedClicks) : 0;
  const computedSales = Math.round(computedClicks * (cvr / 100));
  const computedCPA = computedSales > 0 ? (adSpend / computedSales) : adSpend;
  const computedRevenue = computedSales * aov;
  const computedROAS = adSpend > 0 ? (computedRevenue / adSpend) : 0;
  const computedNetProfit = computedRevenue - adSpend;

  // Clear tracking logs
  const handleClearLogs = () => {
    if (typeof window !== "undefined") {
      const win = window as any;
      win.YUME_PIXEL_LOGS = [];
      setLogs([]);
    }
  };

  const getLogBadgeColor = (type: string) => {
    switch (type) {
      case "Facebook": return "bg-blue-600/10 text-blue-500 border border-blue-500/20";
      case "TikTok": return "bg-teal-500/10 text-teal-400 border border-teal-500/20";
      case "Snapchat": return "bg-amber-400/10 text-amber-500 border border-amber-400/20";
      case "GA4": return "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
      default: return "bg-slate-500/10 text-slate-400 border border-slate-500/20";
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("fr-DZ", { style: "currency", currency: "DZD", maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="flex flex-col gap-6 fade-in text-left">
      {/* Header banner */}
      <div className="bg-gradient-to-r from-emerald-950/45 via-teal-950/35 to-slate-900/45 backdrop-blur-md text-white p-6 rounded-2xl border border-emerald-500/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.05),0_8px_32px_0_rgba(0,0,0,0.1)] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Megaphone className="w-40 h-40 animate-pulse text-emerald-400" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider w-fit mb-3">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            Ad Engine & Multi-Pixel Bridge
          </div>
          <h2 className="text-xl md:text-2xl font-black font-display tracking-tight text-white">
            Compatibility with Ad Pixels & Campaign Analytics
          </h2>
          <p className="text-xs text-emerald-200/90 max-w-2xl mt-1.5 leading-relaxed">
            Configure tracking codes for Facebook, TikTok, and Snapchat pixels. Track core e-commerce events (ViewContent, AddToCart, InitiateCheckout, and CompletePayment) in real time to measure marketing campaign effectiveness, traffic sources, and ROAS.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Pixel Configuration Form */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className={`p-5 rounded-2xl border ${darkMode ? "bg-slate-800/40 border-slate-700/60" : "bg-white border-slate-200"} shadow-sm`}>
            <div className="flex items-center gap-2 pb-4 mb-4 border-b border-dashed border-slate-200/40">
              <Settings className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-100">
                Configure Tracking Pixels
              </h3>
            </div>

            <form onSubmit={handleSaveConfig} className="flex flex-col gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Facebook Pixel ID (Meta)
                </label>
                <input
                  type="text"
                  placeholder="e.g., 847291048291039"
                  value={fbId}
                  onChange={(e) => setFbId(e.target.value)}
                  className={`w-full px-3 py-2 text-xs font-mono rounded-xl border focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all ${
                    darkMode ? "bg-slate-900/60 border-slate-700 text-slate-200 placeholder-slate-500" : "bg-slate-50/50 border-slate-200 text-slate-800"
                  }`}
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Fires <span className="font-mono">PageView</span>, <span className="font-mono">ViewContent</span>, <span className="font-mono">AddToCart</span>, <span className="font-mono">InitiateCheckout</span>, & <span className="font-mono">Purchase</span>.
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  TikTok Pixel ID
                </label>
                <input
                  type="text"
                  placeholder="e.g., PC89204892019A"
                  value={ttId}
                  onChange={(e) => setTtId(e.target.value)}
                  className={`w-full px-3 py-2 text-xs font-mono rounded-xl border focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all ${
                    darkMode ? "bg-slate-900/60 border-slate-700 text-slate-200 placeholder-slate-500" : "bg-slate-50/50 border-slate-200 text-slate-800"
                  }`}
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Tracks TikTok commerce engagement via <span className="font-mono">ttq.track()</span> triggers.
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Snapchat Pixel ID
                </label>
                <input
                  type="text"
                  placeholder="e.g., snap-984209420"
                  value={scId}
                  onChange={(e) => setScId(e.target.value)}
                  className={`w-full px-3 py-2 text-xs font-mono rounded-xl border focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all ${
                    darkMode ? "bg-slate-900/60 border-slate-700 text-slate-200 placeholder-slate-500" : "bg-slate-50/50 border-slate-200 text-slate-800"
                  }`}
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Triggers native Snapchat events for targeted audience matching.
                </span>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                {isSaved ? "Saved Successfully!" : "Save and Sync Pixels"}
              </button>
            </form>

            <div className={`mt-4 p-3 rounded-xl flex gap-2.5 items-start text-[10px] leading-relaxed ${
              darkMode ? "bg-slate-900/40 text-slate-400 border border-slate-700/50" : "bg-slate-50 text-slate-500 border border-slate-100"
            }`}>
              <Info className="w-4 h-4 shrink-0 text-sky-400 mt-0.5" />
              <div>
                <span className="font-bold text-slate-700 dark:text-slate-300">Automatic Sandbox Mode:</span> Demo tracking codes are supplied by default so you can watch immediate e-commerce events fire in the Real-Time Terminal even before deploying custom production keys!
              </div>
            </div>
          </div>

          {/* Ad Pixel Integration Help Card */}
          <div className={`p-5 rounded-2xl border ${darkMode ? "bg-slate-800/40 border-slate-700/60" : "bg-white border-slate-200"} shadow-sm text-xs`}>
            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-sky-400" />
              Pixel Event Mapping Reference
            </h4>
            <div className="flex flex-col gap-2 font-mono text-[10px] text-slate-500">
              <div className="flex justify-between border-b border-dashed border-slate-200/40 pb-1.5">
                <span>View Product:</span>
                <span className="text-indigo-400 font-bold">ViewContent</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-slate-200/40 pb-1.5">
                <span>Add to Cart:</span>
                <span className="text-emerald-500 font-bold">AddToCart</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-slate-200/40 pb-1.5">
                <span>Form Opened:</span>
                <span className="text-amber-500 font-bold">InitiateCheckout</span>
              </div>
              <div className="flex justify-between pb-1">
                <span>Successful Sale:</span>
                <span className="text-pink-500 font-bold">Purchase / Payment</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center column: Live Telemetry Debug Terminal */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className={`p-5 rounded-2xl border ${darkMode ? "bg-slate-800/40 border-slate-700/60" : "bg-white border-slate-200"} shadow-sm flex flex-col h-[480px]`}>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-dashed border-slate-200/40 shrink-0">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-amber-500 animate-pulse" />
                <div>
                  <h3 className="text-sm font-black text-slate-800 dark:text-slate-100">
                    Real-Time Pixel Telemetry Log
                  </h3>
                  <p className="text-[10px] text-slate-400">Stream of fired marketing pixels on your store</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLogRefreshKey(prev => prev + 1)}
                  className={`p-1.5 rounded-lg border hover:bg-slate-100 dark:hover:bg-slate-700 transition-all ${
                    darkMode ? "border-slate-700 text-slate-300" : "border-slate-200 text-slate-600"
                  }`}
                  title="Force Refresh Logs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleClearLogs}
                  className="px-2 py-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                  title="Clear Log Console"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear Console
                </button>
              </div>
            </div>

            {/* Simulated Live Console display */}
            <div className={`flex-1 overflow-y-auto rounded-xl p-3 font-mono text-xs flex flex-col gap-2.5 border ${
              darkMode ? "bg-slate-900 border-slate-800 text-slate-300" : "bg-slate-950 border-slate-900 text-slate-200"
            }`}>
              {logs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-10 text-slate-500">
                  <Activity className="w-8 h-8 mb-2 animate-pulse text-slate-600" />
                  <p className="text-[11px]">No pixel events captured in this session yet.</p>
                  <p className="text-[9px] mt-1 max-w-xs leading-relaxed text-slate-600">
                    Go browse products on your storefront, add item to cart, or trigger checkout to watch Meta and TikTok tracking logs feed here in real time!
                  </p>
                </div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="border-b border-slate-800/60 pb-2.5 last:border-b-0">
                    <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[9.5px] text-slate-500 font-bold">{log.timestamp}</span>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${getLogBadgeColor(log.pixelType)}`}>
                          {log.pixelType}
                        </span>
                        <span className="text-[11px] font-bold text-slate-200">
                          {log.eventName}
                        </span>
                      </div>
                      <span className="text-[9px] text-slate-600 font-mono">
                        {log.id}
                      </span>
                    </div>
                    <pre className="text-[10px] bg-black/45 p-2 rounded-lg text-emerald-400/95 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                      {JSON.stringify(log.data, null, 2)}
                    </pre>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Historical Ad Campaign Performance Overview Table */}
      <div className={`p-5 rounded-2xl border ${darkMode ? "bg-slate-800/40 border-slate-700/60" : "bg-white border-slate-200"} shadow-sm`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 pb-4 mb-4 border-b border-dashed border-slate-200/40">
          <div>
            <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Store Campaign Effectiveness Review
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Real-world analytics mapping specific campaigns to sales outcomes</p>
          </div>
          <span className="text-[10px] bg-indigo-500/15 text-indigo-400 px-3 py-1 rounded-full font-bold">
            All Pixels Synchronized
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className={`border-b ${darkMode ? "border-slate-700 text-slate-400" : "border-slate-200 text-slate-500"} font-bold`}>
                <th className="py-2.5 px-3">Ad Campaign Name</th>
                <th className="py-2.5 px-3">Platform</th>
                <th className="py-2.5 px-3">Ad Spent</th>
                <th className="py-2.5 px-3">Impressions</th>
                <th className="py-2.5 px-3 text-center">Clicks (CTR)</th>
                <th className="py-2.5 px-3 text-center">Add To Cart</th>
                <th className="py-2.5 px-3 text-center">Sales (CR)</th>
                <th className="py-2.5 px-3 text-right">Revenue</th>
                <th className="py-2.5 px-3 text-right">ROAS</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((cmp) => {
                const ctrPercent = cmp.impressions > 0 ? ((cmp.clicks / cmp.impressions) * 100).toFixed(1) : "0";
                const crPercent = cmp.clicks > 0 ? ((cmp.purchases / cmp.clicks) * 100).toFixed(1) : "0";
                const roas = cmp.spend > 0 ? (cmp.revenue / cmp.spend).toFixed(2) : "0";
                const isProfitable = parseFloat(roas) >= 2.0;

                return (
                  <tr key={cmp.id} className={`border-b last:border-b-0 hover:bg-slate-500/5 ${darkMode ? "border-slate-700 text-slate-300" : "border-slate-100 text-slate-700"}`}>
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-slate-100">{cmp.name}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${getLogBadgeColor(cmp.platform === "Google" ? "GA4" : cmp.platform)}`}>
                        {cmp.platform}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] font-bold text-slate-500">{formatCurrency(cmp.spend)}</td>
                    <td className="py-3 px-3 font-mono text-slate-500">{cmp.impressions.toLocaleString()}</td>
                    <td className="py-3 px-3 text-center">
                      <div className="font-mono font-bold text-slate-800 dark:text-slate-200">{cmp.clicks.toLocaleString()}</div>
                      <div className="text-[9px] text-slate-400 font-mono">({ctrPercent}%)</div>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-indigo-500 font-mono">{cmp.carts}</td>
                    <td className="py-3 px-3 text-center">
                      <div className="font-mono font-bold text-emerald-500">{cmp.purchases}</div>
                      <div className="text-[9px] text-slate-400 font-mono">({crPercent}%)</div>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-black text-slate-900 dark:text-slate-100">{formatCurrency(cmp.revenue)}</td>
                    <td className="py-3 px-3 text-right">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-black font-mono inline-block ${
                        isProfitable 
                          ? "bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/15" 
                          : "bg-amber-500/10 text-amber-500"
                      }`}>
                        {roas}x
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Ad Campaign ROI & Funnel ROAS Simulator */}
      <div className={`p-5 rounded-2xl border ${darkMode ? "bg-slate-800/40 border-slate-700/60" : "bg-white border-slate-200"} shadow-sm`}>
        <div className="pb-4 mb-4 border-b border-dashed border-slate-200/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-500" />
              E-Commerce ROAS & Funnel Simulator
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Model the conversion rate impact on Algerian Dinars (DZD) ad spend outcomes</p>
          </div>
          
          {/* Preset Buttons */}
          <div className="flex gap-1.5 flex-wrap">
            <button
              onClick={() => applyPreset("facebook-jewelry")}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                activePreset === "facebook-jewelry"
                  ? "bg-emerald-600 text-white shadow-xs scale-102"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              FB Jewelry Preset
            </button>
            <button
              onClick={() => applyPreset("tiktok-robes")}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                activePreset === "tiktok-robes"
                  ? "bg-emerald-600 text-white shadow-xs scale-102"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              TikTok Robes Preset
            </button>
            <button
              onClick={() => applyPreset("snapchat-ar")}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                activePreset === "snapchat-ar"
                  ? "bg-emerald-600 text-white shadow-xs scale-102"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              Snapchat Rugs AR
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Controls Panel */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5 text-slate-700 dark:text-slate-300">
                <span>Ad Spend Budget:</span>
                <span className="font-mono text-slate-900 dark:text-slate-100">{formatCurrency(adSpend)}</span>
              </div>
              <input
                type="range"
                min="5000"
                max="300000"
                step="5000"
                value={adSpend}
                onChange={(e) => {
                  setAdSpend(parseInt(e.target.value));
                  setActivePreset("custom");
                }}
                className="w-full accent-emerald-500 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-1">
                <span>5k DZD</span>
                <span>150k DZD</span>
                <span>300k DZD</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5 text-slate-700 dark:text-slate-300">
                <span>Target CPM (Cost Per 1,000 Views):</span>
                <span className="font-mono text-slate-900 dark:text-slate-100">{formatCurrency(cpm)}</span>
              </div>
              <input
                type="range"
                min="100"
                max="1000"
                step="20"
                value={cpm}
                onChange={(e) => {
                  setCpm(parseInt(e.target.value));
                  setActivePreset("custom");
                }}
                className="w-full accent-emerald-500 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-1">
                <span>100 DZD (Low)</span>
                <span>500 DZD</span>
                <span>1000 DZD (Premium)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5 text-slate-700 dark:text-slate-300">
                <span>Ad Click-Through Rate (CTR):</span>
                <span className="font-mono text-slate-900 dark:text-slate-100">{ctr}%</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="8"
                step="0.1"
                value={ctr}
                onChange={(e) => {
                  setCtr(parseFloat(e.target.value));
                  setActivePreset("custom");
                }}
                className="w-full accent-emerald-500 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-1">
                <span>0.2% (Poor)</span>
                <span>4.0%</span>
                <span>8.0% (Outstanding)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5 text-slate-700 dark:text-slate-300">
                <span>Purchase Conversion Rate (CR):</span>
                <span className="font-mono text-slate-900 dark:text-slate-100">{cvr}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={cvr}
                onChange={(e) => {
                  setCvr(parseFloat(e.target.value));
                  setActivePreset("custom");
                }}
                className="w-full accent-emerald-500 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-1">
                <span>0.1% (Low)</span>
                <span>2.5%</span>
                <span>5.0% (Excellent)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5 text-slate-700 dark:text-slate-300">
                <span>Average Order Value (AOV):</span>
                <span className="font-mono text-slate-900 dark:text-slate-100">{formatCurrency(aov)}</span>
              </div>
              <input
                type="range"
                min="2000"
                max="50000"
                step="1000"
                value={aov}
                onChange={(e) => {
                  setAov(parseInt(e.target.value));
                  setActivePreset("custom");
                }}
                className="w-full accent-emerald-500 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-1">
                <span>2k DZD</span>
                <span>25k DZD</span>
                <span>50k DZD</span>
              </div>
            </div>
          </div>

          {/* Results Output Metrics Board */}
          <div className="md:col-span-7 grid grid-cols-2 gap-4 h-full">
            <div className={`p-4 rounded-xl flex flex-col justify-between border ${
              darkMode ? "bg-slate-900/60 border-slate-800" : "bg-slate-50 border-slate-100"
            }`}>
              <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Estimated Impressions</div>
              <div className="text-xl font-black font-mono text-slate-800 dark:text-slate-100">{computedImpressions.toLocaleString()}</div>
              <div className="text-[9.5px] text-slate-500">Reach on target platforms</div>
            </div>

            <div className={`p-4 rounded-xl flex flex-col justify-between border ${
              darkMode ? "bg-slate-900/60 border-slate-800" : "bg-slate-50 border-slate-100"
            }`}>
              <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Estimated Clicks</div>
              <div className="text-xl font-black font-mono text-indigo-500">{computedClicks.toLocaleString()}</div>
              <div className="text-[9.5px] text-slate-500 mt-1 flex justify-between">
                <span>Cost Per Click:</span>
                <span className="font-bold">{formatCurrency(computedCostPerClick)}</span>
              </div>
            </div>

            <div className={`p-4 rounded-xl flex flex-col justify-between border ${
              darkMode ? "bg-slate-900/60 border-slate-800" : "bg-slate-50 border-slate-100"
            }`}>
              <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Estimated Sales</div>
              <div className="text-xl font-black font-mono text-emerald-500">{computedSales.toLocaleString()}</div>
              <div className="text-[9.5px] text-slate-500 mt-1 flex justify-between">
                <span>Cost Per Acquisition:</span>
                <span className="font-bold">{formatCurrency(computedCPA)}</span>
              </div>
            </div>

            <div className={`p-4 rounded-xl flex flex-col justify-between border ${
              computedROAS >= 2.0 
                ? "bg-emerald-500/5 border-emerald-500/20" 
                : computedROAS >= 1.0 
                ? "bg-amber-500/5 border-amber-500/20" 
                : "bg-red-500/5 border-red-500/20"
            }`}>
              <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Predicted ROAS</div>
              <div className={`text-2xl font-black font-mono ${
                computedROAS >= 2.0 
                  ? "text-emerald-500" 
                  : computedROAS >= 1.0 
                  ? "text-amber-500" 
                  : "text-red-500"
              }`}>{computedROAS.toFixed(2)}x</div>
              <span className={`text-[9.5px] font-black uppercase px-2 py-0.5 rounded-md w-fit ${
                computedROAS >= 2.0 
                  ? "bg-emerald-500/10 text-emerald-500" 
                  : computedROAS >= 1.0 
                  ? "bg-amber-500/10 text-amber-500" 
                  : "bg-red-500/10 text-red-500 animate-pulse"
              }`}>
                {computedROAS >= 2.0 ? "Highly Profitable" : computedROAS >= 1.0 ? "Moderate Profit" : "Losing Money"}
              </span>
            </div>

            {/* Complete Bottom Bar */}
            <div className={`col-span-2 p-4 rounded-xl flex items-center justify-between border ${
              darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
            }`}>
              <div>
                <div className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">Projected Revenue / Net Return</div>
                <div className="text-xl font-black font-mono text-slate-900 dark:text-slate-150">
                  {formatCurrency(computedRevenue)}
                  <span className={`text-xs ml-2 font-black ${computedNetProfit >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                    ({computedNetProfit >= 0 ? "+" : ""}{formatCurrency(computedNetProfit)} net)
                  </span>
                </div>
              </div>
              <TrendingUp className={`w-8 h-8 shrink-0 ${computedNetProfit >= 0 ? "text-emerald-500 animate-pulse" : "text-slate-400"}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
