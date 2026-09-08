import React, { useState } from "react";
import { 
  Link2, 
  Sparkles, 
  Share2, 
  MousePointerClick, 
  ShoppingBag, 
  Award,
  Layers,
  ArrowDown,
  Info,
  CheckCircle2,
  TrendingUp
} from "lucide-react";
import { GrowthCampaign, StrategyFocus } from "../../types/growthStudio";

interface CampaignFlowVisualizationProps {
  campaign: GrowthCampaign;
  onSelectLandingPage?: (lpId: string) => void;
  selectedLpId?: string;
  isArabic?: boolean;
}

// Brand-matched colors for ad sources
const AD_SOURCE_BADGES: Record<string, { label: string; bg: string; text: string; border: string; iconText: string }> = {
  Facebook: { label: "Facebook Ads", bg: "bg-blue-50 dark:bg-blue-950/40", text: "text-blue-700 dark:text-blue-300", border: "border-blue-200 dark:border-blue-800", iconText: "FB" },
  Instagram: { label: "Instagram Ads", bg: "bg-pink-50 dark:bg-pink-950/40", text: "text-pink-700 dark:text-pink-300", border: "border-pink-200 dark:border-pink-800", iconText: "IG" },
  TikTok: { label: "TikTok Ads", bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-900 dark:text-slate-100", border: "border-slate-300 dark:border-slate-700", iconText: "TT" },
  Snapchat: { label: "Snapchat Ads", bg: "bg-amber-50 dark:bg-amber-950/40", text: "text-amber-700 dark:text-amber-300", border: "border-amber-200 dark:border-amber-800", iconText: "SC" },
  Google: { label: "Google Ads", bg: "bg-emerald-50 dark:bg-emerald-950/40", text: "text-emerald-700 dark:text-emerald-300", border: "border-emerald-200 dark:border-emerald-800", iconText: "GA" },
  WhatsApp: { label: "WhatsApp Direct", bg: "bg-teal-50 dark:bg-teal-950/40", text: "text-teal-700 dark:text-teal-300", border: "border-teal-200 dark:border-teal-800", iconText: "WA" },
  Direct: { label: "Direct Traffic", bg: "bg-slate-50 dark:bg-slate-900", text: "text-slate-700 dark:text-slate-300", border: "border-slate-200 dark:border-slate-800", iconText: "DIR" },
  Other: { label: "Other Channels", bg: "bg-purple-50 dark:bg-purple-950/40", text: "text-purple-700 dark:text-purple-300", border: "border-purple-200 dark:border-purple-800", iconText: "ETC" }
};

export const CampaignFlowVisualization: React.FC<CampaignFlowVisualizationProps> = ({
  campaign,
  onSelectLandingPage,
  selectedLpId,
  isArabic = false
}) => {
  const [hoveredLpId, setHoveredLpId] = useState<string | null>(null);

  // Find leading page with highest conversion rate (minimum 100 visitors for confidence)
  const totalCampaignVisitors = campaign.landingPages.reduce((acc, lp) => acc + lp.metrics.visitors, 0);
  const totalCampaignConversions = campaign.landingPages.reduce((acc, lp) => acc + lp.metrics.conversions, 0);
  const averageConversionRate = totalCampaignVisitors > 0 ? (totalCampaignConversions / totalCampaignVisitors) * 100 : 0;

  const leadingPage = campaign.landingPages.reduce((best, current) => {
    const currentRate = current.metrics.visitors > 0 ? (current.metrics.conversions / current.metrics.visitors) * 100 : 0;
    const bestRate = best ? (best.metrics.visitors > 0 ? (best.metrics.conversions / best.metrics.visitors) * 100 : 0) : -1;
    return currentRate > bestRate ? current : best;
  }, campaign.landingPages[0]);

  const hasConfidence = totalCampaignVisitors >= (campaign.settings?.confidenceThreshold || 150);

  const getFocusLabel = (focus: StrategyFocus) => {
    switch (focus) {
      case "benefits":
        return isArabic ? "تركيز على الفوائد" : "Benefits-focused";
      case "social_proof":
        return isArabic ? "تركيز على التقييمات" : "Social proof & reviews";
      case "offer_urgency":
        return isArabic ? "تركيز على العرض والسرعة" : "Offer & urgency";
      case "storytelling":
        return isArabic ? "قصة المنتج وعفويته" : "Storytelling narrative";
      case "minimal_clean":
        return isArabic ? "تصميم مباشر وموجز" : "Direct & minimal";
      default:
        return isArabic ? "مخصص" : "Custom layout";
    }
  };

  return (
    <div className="w-full bg-slate-50/80 dark:bg-slate-900/60 p-5 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs relative overflow-hidden text-left">
      {/* Visual Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center">
              <Share2 className="w-3.5 h-3.5" />
            </span>
            <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
              {isArabic ? "مخطط مسار الحملة الذكي (Smart Campaign Flow)" : "Campaign Traffic & Conversion Flow"}
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            {isArabic
              ? "رابط إعلاني موحد يوزع زياراتك بدقة بين عدة صفحات هبوط متكاملة ويكتشف الصفحة الأعلى تحويلاً."
              : "One single ad link routes all your paid channels across multiple full landing pages in real-time."}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200/80 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{campaign.distributionMode === "smart" ? (isArabic ? "توزيع ذكي تلقائي" : "Smart Optimization") : (isArabic ? "توزيع يدوي محدد" : "Manual Distribution")}</span>
          </span>
        </div>
      </div>

      {/* FLOW CONTAINER */}
      <div className="relative flex flex-col items-center gap-6 max-w-5xl mx-auto">

        {/* 1. TOP LEVEL: AD SOURCES */}
        <div className="w-full flex flex-col items-center">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5 flex items-center gap-1.5">
            <span>{isArabic ? "1. مصادر الزيارات الإعلانية" : "Ad Traffic Sources"}</span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-2.5 p-3 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 shadow-xs max-w-3xl">
            {campaign.trafficSources.map((source) => {
              const meta = AD_SOURCE_BADGES[source] || AD_SOURCE_BADGES["Other"];
              return (
                <div
                  key={source}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-transform hover:scale-105 ${meta.bg} ${meta.text} ${meta.border}`}
                >
                  <span className="w-5 h-5 rounded-md bg-white/80 dark:bg-slate-900/80 font-black text-[10px] flex items-center justify-center border border-black/5 dark:border-white/10 shadow-2xs">
                    {meta.iconText}
                  </span>
                  <span>{meta.label}</span>
                </div>
              );
            })}
          </div>

          {/* Connector Down */}
          <div className="flex flex-col items-center my-1 text-slate-300 dark:text-slate-600">
            <div className="w-0.5 h-6 bg-gradient-to-b from-slate-300 to-indigo-400 dark:from-slate-700 dark:to-indigo-500" />
            <ArrowDown className="w-4 h-4 text-indigo-500 -mt-1" />
          </div>
        </div>

        {/* 2. SMART CAMPAIGN LINK NODE */}
        <div className="w-full max-w-md">
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white border border-indigo-500/30 shadow-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-15 text-indigo-300">
              <Link2 className="w-16 h-16" />
            </div>

            <div className="flex items-center justify-between gap-3 relative z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{isArabic ? "رابط الحملة الموحد" : "Single Campaign Destination"}</span>
                </div>
                <h4 className="text-sm sm:text-base font-black tracking-tight text-white flex items-center gap-2">
                  <span className="font-mono text-indigo-200">yomi.app/growth/{campaign.smartLinkSlug}</span>
                </h4>
                <p className="text-[11px] text-slate-300 font-normal">
                  {isArabic
                    ? "الرابط الوحيد الذي تضعه في جميع إعلاناتك على فيسبوك، تيك توك، وإنستغرام."
                    : "The single URL to place inside your ad creatives. No individual links needed."}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/10 border border-white/20 text-white shrink-0">
                <Link2 className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Connector Down with Traffic Distribution Engine Label */}
          <div className="flex flex-col items-center my-1.5 text-slate-300 dark:text-slate-600">
            <div className="w-0.5 h-6 bg-gradient-to-b from-indigo-500 to-slate-400 dark:to-slate-600" />
            <div className="px-3 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/80 dark:border-indigo-800 text-[10px] font-mono font-bold text-indigo-700 dark:text-indigo-300 shadow-2xs">
              {isArabic ? "محرك التوزيع الذكي للزيارات" : "Traffic Distribution Engine"}
            </div>
            <div className="w-0.5 h-4 bg-slate-400 dark:bg-slate-600" />
            <ArrowDown className="w-4 h-4 text-slate-400 -mt-1" />
          </div>
        </div>

        {/* 3. MIDDLE LEVEL: TRAFFIC DISTRIBUTION TO LANDING PAGES */}
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaign.landingPages.map((lp, idx) => {
              const isSelected = selectedLpId === lp.id;
              const isHovered = hoveredLpId === lp.id;
              const isLeading = leadingPage?.id === lp.id && hasConfidence;
              const convRate = lp.metrics.visitors > 0 
                ? ((lp.metrics.conversions / lp.metrics.visitors) * 100).toFixed(1) 
                : "0.0";

              return (
                <div
                  key={lp.id}
                  onMouseEnter={() => setHoveredLpId(lp.id)}
                  onMouseLeave={() => setHoveredLpId(null)}
                  onClick={() => onSelectLandingPage?.(lp.id)}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? "ring-2 ring-indigo-500 bg-white dark:bg-slate-800 shadow-sm border-indigo-400"
                      : isLeading
                      ? "border-emerald-300 dark:border-emerald-800/80 bg-white dark:bg-slate-800/95 shadow-xs"
                      : "border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-slate-300 dark:hover:border-slate-700"
                  } ${isHovered ? "scale-[1.01]" : ""}`}
                >
                  {/* Top: Percentage Allocation & Badge */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono font-black px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                          {lp.name}
                        </span>
                        {isLeading && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            <Award className="w-3 h-3 text-emerald-600" />
                            <span>{isArabic ? "الأعلى أداءً" : "Leading Page"}</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-xs font-black font-mono px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                        <span>{lp.trafficAllocation}%</span>
                        <span className="text-[10px] text-slate-500">{isArabic ? "زيارات" : "traffic"}</span>
                      </div>
                    </div>

                    {/* Progress Bar of Traffic Allocation */}
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mb-3">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500" 
                        style={{ width: `${lp.trafficAllocation}%` }}
                      />
                    </div>

                    {/* Strategy Focus */}
                    <div className="space-y-1 mb-4">
                      <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-slate-500" />
                        <span>{getFocusLabel(lp.strategyFocus)}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                        {lp.sections.find((s) => s.type === "hero")?.headline || lp.name}
                      </p>
                    </div>
                  </div>

                  {/* Flow Metrics Inside Landing Page Node */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                    <div className="grid grid-cols-2 gap-2 text-left">
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
                        <span className="text-[10px] text-slate-400 font-medium block">{isArabic ? "الزوار" : "Visitors"}</span>
                        <span className="text-sm font-black font-mono text-slate-900 dark:text-white">
                          {lp.metrics.visitors.toLocaleString()}
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
                        <span className="text-[10px] text-slate-400 font-medium block">{isArabic ? "الطلبات / التحويل" : "Conversions"}</span>
                        <span className="text-sm font-black font-mono text-emerald-600 dark:text-emerald-400">
                          {lp.metrics.conversions} <span className="text-[11px] font-bold">({convRate}%)</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 px-1">
                      <span>{isArabic ? "المداخيل المحققة:" : "Revenue:"}</span>
                      <span className="font-bold text-slate-900 dark:text-slate-200">
                        {lp.metrics.revenue.toLocaleString()} DA
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Connectors Down to Performance Consolidation */}
          <div className="flex flex-col items-center my-3 text-slate-300 dark:text-slate-600">
            <div className="w-0.5 h-6 bg-gradient-to-b from-slate-400 to-indigo-500 dark:from-slate-700 dark:to-indigo-500" />
            <ArrowDown className="w-4 h-4 text-indigo-500 -mt-1" />
          </div>
        </div>

        {/* 4. BOTTOM LEVEL: PERFORMANCE DATA & LEADING PAGE */}
        <div className="w-full max-w-2xl">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  <TrendingUp className="w-4 h-4" />
                  <span>{isArabic ? "بيانات الأداء الموحدة" : "Consolidated Performance Data"}</span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                    {totalCampaignConversions} {isArabic ? "طلب مؤكد" : "total orders"}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    ({averageConversionRate.toFixed(1)}% avg conversion rate)
                  </span>
                </div>
              </div>

              {/* Leading Page Highlight */}
              <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-left">
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                  {hasConfidence 
                    ? (isArabic ? "الصفحة الأفضل أداءً (Leading Page)" : "Best Performing Page")
                    : (isArabic ? "جمع البيانات قيد التقدم" : "Collecting traffic")}
                </span>
                {hasConfidence ? (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-black text-emerald-950 dark:text-emerald-200">
                      {leadingPage?.name} ({((leadingPage.metrics.conversions / leadingPage.metrics.visitors) * 100).toFixed(1)}% CVR)
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    <Info className="w-3.5 h-3.5" />
                    <span>{isArabic ? "نحتاج 150 زائر على الأقل لثقة النتائج" : "Needs 150+ visitors for statistical confidence"}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
