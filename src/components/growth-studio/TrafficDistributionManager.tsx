import React, { useState } from "react";
import { 
  Sliders, 
  Sparkles, 
  AlertCircle, 
  Check, 
  TrendingUp, 
  RefreshCw,
  Info
} from "lucide-react";
import { GrowthCampaign } from "../../types/growthStudio";

interface TrafficDistributionManagerProps {
  campaign: GrowthCampaign;
  onUpdateDistribution: (
    mode: "manual" | "smart",
    allocations: Record<string, number>,
    rationale?: string
  ) => void;
  isArabic?: boolean;
}

export const TrafficDistributionManager: React.FC<TrafficDistributionManagerProps> = ({
  campaign,
  onUpdateDistribution,
  isArabic = false
}) => {
  const [mode, setMode] = useState<"manual" | "smart">(campaign.distributionMode);
  
  // Local allocations map: { [lpId]: percentage }
  const [allocations, setAllocations] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    campaign.landingPages.forEach((lp) => {
      initial[lp.id] = lp.trafficAllocation;
    });
    return initial;
  });

  const [showOptimizationModal, setShowOptimizationModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Calculate sum
  const currentSum = (Object.values(allocations) as number[]).reduce((a: number, b: number) => a + b, 0);
  const isValid100 = currentSum === 100;

  // Handle slider change
  const handleSliderChange = (lpId: string, value: number) => {
    setAllocations((prev) => ({
      ...prev,
      [lpId]: value
    }));
    setSaveSuccess(false);
  };

  // Auto-balance remainder evenly
  const handleAutoBalance = () => {
    const count = campaign.landingPages.length;
    if (count === 0) return;
    const base = Math.floor(100 / count);
    const remainder = 100 - base * count;

    const balanced: Record<string, number> = {};
    campaign.landingPages.forEach((lp, idx) => {
      balanced[lp.id] = idx === 0 ? base + remainder : base;
    });
    setAllocations(balanced);
    setSaveSuccess(false);
  };

  // Smart suggested allocation based on conversion rate
  const calculateSuggestedAllocations = () => {
    const rates: { id: string; name: string; rate: number }[] = campaign.landingPages.map((lp) => ({
      id: lp.id,
      name: lp.name,
      rate: lp.metrics.visitors > 0 ? (lp.metrics.conversions / lp.metrics.visitors) * 100 : 1.0
    }));

    const totalRate = rates.reduce((sum, r) => sum + Math.max(r.rate, 0.5), 0);
    const suggested: Record<string, number> = {};
    let runningSum = 0;

    rates.forEach((r, idx) => {
      if (idx === rates.length - 1) {
        suggested[r.id] = Math.max(5, 100 - runningSum);
      } else {
        const share = Math.round((Math.max(r.rate, 0.5) / totalRate) * 100);
        const bounded = Math.max(10, Math.min(75, share));
        suggested[r.id] = bounded;
        runningSum += bounded;
      }
    });

    return suggested;
  };

  const handleApplySuggested = (suggested: Record<string, number>) => {
    setAllocations(suggested);
    setShowOptimizationModal(false);
    onUpdateDistribution(
      mode,
      suggested,
      isArabic
        ? "تم تحسين نسب الزيارات تلقائياً لصالح الصفحات الأعلى تحويلاً وفقاً لتحليلات Growth Studio."
        : "Smart traffic allocation updated in favor of higher converting landing pages."
    );
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSave = () => {
    if (!isValid100) return;
    onUpdateDistribution(
      mode,
      allocations,
      mode === "smart"
        ? (campaign.distributionRationale || "Smart optimization active based on real-time conversions.")
        : "Manual traffic allocation configured by merchant."
    );
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const suggestedAllocations = calculateSuggestedAllocations();

  return (
    <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs text-left">
      {/* Header & Mode Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/60">
              <Sliders className="w-4 h-4" />
            </span>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {isArabic ? "توزيع الزيارات (Traffic Distribution)" : "Traffic Distribution & Optimization"}
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isArabic
              ? "تحكم في نسبة الزوار الموجهين لكل صفحة هبوط من خلال رابط الحملة الموحد Smart Campaign Link."
              : "Specify how traffic is split across your landing pages via the single Smart Campaign Link."}
          </p>
        </div>

        {/* Mode Selector Toggle */}
        <div className="flex items-center gap-2">
          <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setMode("manual");
                setSaveSuccess(false);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                mode === "manual"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {isArabic ? "توزيع يدوي (Manual)" : "Manual Distribution"}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("smart");
                setSaveSuccess(false);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                mode === "smart"
                  ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isArabic ? "تحسين ذكي (Smart)" : "Smart Optimization"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Smart Optimization Explanation Banner if active */}
      {mode === "smart" && (
        <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 mb-6 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
          <div className="space-y-1 text-xs">
            <span className="font-bold text-indigo-950 dark:text-indigo-200 block">
              {isArabic ? "نظام التحسين الذكي مفعل (Smart Optimization)" : "Smart Optimization Active"}
            </span>
            <p className="text-indigo-900/80 dark:text-indigo-300 leading-relaxed font-normal">
              {campaign.distributionRationale ||
                (isArabic
                  ? "يقوم النظام بتحليل معدلات التحويل الحقيقية بانتظام، ويوجه نسبة أكبر من الزيارات تلقائياً للصفحات التي تحقق أعلى نسبة مبيعات."
                  : "The system automatically adjusts traffic shares towards pages showing strong conversion signals without sudden erratic shifts.")}
            </p>
          </div>
        </div>
      )}

      {/* Visual Multi-Segment Bar */}
      <div className="mb-6 space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-300">
            {isArabic ? "المعاينة البصرية لتوزيع الزيارات:" : "Live Traffic Distribution Overview:"}
          </span>
          <span className={`font-mono font-bold ${isValid100 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
            {currentSum}% / 100%
          </span>
        </div>

        <div className="w-full h-5 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden flex shadow-inner">
          {campaign.landingPages.map((lp, idx) => {
            const alloc = allocations[lp.id] || 0;
            const colors = [
              "bg-indigo-600",
              "bg-emerald-500",
              "bg-amber-500",
              "bg-sky-500",
              "bg-purple-500",
              "bg-rose-500"
            ];
            const color = colors[idx % colors.length];

            return (
              <div
                key={lp.id}
                style={{ width: `${alloc}%` }}
                className={`h-full ${color} transition-all duration-300 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden px-1`}
                title={`${lp.name}: ${alloc}%`}
              >
                {alloc >= 12 && `${lp.name.replace("Landing Page ", "LP")}: ${alloc}%`}
              </div>
            );
          })}
        </div>
      </div>

      {/* Per-Page Sliders & Percentage Inputs */}
      <div className="space-y-4 mb-6">
        {campaign.landingPages.map((lp, idx) => {
          const alloc = allocations[lp.id] ?? 0;
          const convRate = lp.metrics.visitors > 0 
            ? ((lp.metrics.conversions / lp.metrics.visitors) * 100).toFixed(1) 
            : "0.0";

          return (
            <div
              key={lp.id}
              className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-850/60 border border-slate-200/70 dark:border-slate-800/80 space-y-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono font-bold text-xs flex items-center justify-center">
                    0{idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {lp.name}
                    </h4>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      {lp.metrics.visitors} {isArabic ? "زائر" : "visitors"} • {convRate}% CVR • {lp.metrics.revenue.toLocaleString()} DA
                    </span>
                  </div>
                </div>

                {/* Percentage Input */}
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={alloc}
                    onChange={(e) => handleSliderChange(lp.id, Math.max(0, Math.min(100, Number(e.target.value) || 0)))}
                    className="w-16 px-2.5 py-1 text-right font-mono font-bold text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <span className="font-mono font-bold text-xs text-slate-500">%</span>
                </div>
              </div>

              {/* Slider */}
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={alloc}
                  onChange={(e) => handleSliderChange(lp.id, Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Validation Alert if != 100% */}
      {!isValid100 && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>
              {isArabic
                ? `مجموع النسب الحالي هو ${currentSum}%. يجب أن يكون المجموع 100% تماماً لحفظ التوزيع.`
                : `Total allocation is currently ${currentSum}%. The sum must equal exactly 100%.`}
            </span>
          </div>
          <button
            type="button"
            onClick={handleAutoBalance}
            className="text-[11px] font-bold underline cursor-pointer shrink-0"
          >
            {isArabic ? "موازنة تلقائية" : "Auto-balance"}
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAutoBalance}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{isArabic ? "توزيع متساوي" : "Even Split"}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowOptimizationModal(true)}
            className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/80 dark:hover:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{isArabic ? "اقتراح توزيع ذكي (Optimize Traffic)" : "Optimize Traffic"}</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={!isValid100}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            isValid100
              ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
              : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
          }`}
        >
          {saveSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>{isArabic ? "تم الحفظ بنجاح" : "Allocations Saved"}</span>
            </>
          ) : (
            <span>{isArabic ? "حفظ وتطبيق التوزيع" : "Apply Traffic Distribution"}</span>
          )}
        </button>
      </div>

      {/* Suggested Allocation Confirmation Modal (Section 21) */}
      {showOptimizationModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-5 text-left">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <Sparkles className="w-5 h-5" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {isArabic ? "اقتراح إعادة توزيع الزيارات الذكي" : "Recommended Traffic Reallocation"}
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isArabic
                  ? "يقترح النظام تحويل المزيد من الزيارات للصفحة الأفضل أداءً لزيادة إجمالي الطلبات دون إيقاف باقي الصفحات."
                  : "The optimization engine proposes allocating more traffic to high-converting pages to maximize overall campaign yield."}
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
              <div className="grid grid-cols-3 text-[11px] font-bold text-slate-400 pb-2 border-b border-slate-200 dark:border-slate-700">
                <span>{isArabic ? "الصفحة" : "Landing Page"}</span>
                <span className="text-center">{isArabic ? "التوزيع الحالي" : "Current Share"}</span>
                <span className="text-right text-indigo-600 dark:text-indigo-400">{isArabic ? "التوزيع المقترح" : "Suggested Share"}</span>
              </div>

              {campaign.landingPages.map((lp) => (
                <div key={lp.id} className="grid grid-cols-3 text-xs items-center py-1">
                  <span className="font-bold text-slate-900 dark:text-white">{lp.name}</span>
                  <span className="text-center font-mono text-slate-500">{allocations[lp.id]}%</span>
                  <span className="text-right font-mono font-black text-indigo-600 dark:text-indigo-400">
                    {suggestedAllocations[lp.id]}%
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowOptimizationModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                {isArabic ? "إلغاء" : "Cancel"}
              </button>
              <button
                type="button"
                onClick={() => handleApplySuggested(suggestedAllocations)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>{isArabic ? "تأكيد وتطبيق التوزيع المقترح" : "Apply Recommendation"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
