import React, { useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Smartphone, 
  Monitor, 
  Tablet, 
  Sparkles, 
  Award, 
  AlertCircle, 
  CheckCircle2, 
  ArrowUpRight, 
  Info,
  Layers,
  HelpCircle,
  Share2,
  Bot
} from "lucide-react";
import { GrowthCampaign, GrowthLandingPage } from "../../types/growthStudio";

interface CampaignAnalyticsDashboardProps {
  campaign: GrowthCampaign;
  isArabic?: boolean;
}

export const CampaignAnalyticsDashboard: React.FC<CampaignAnalyticsDashboardProps> = ({
  campaign,
  isArabic = false
}) => {
  const [showAiAdvisor, setShowAiAdvisor] = useState(false);
  const [selectedLpFilter, setSelectedLpFilter] = useState<string>("all");

  const totalVisitors = campaign.landingPages.reduce((acc, lp) => acc + lp.metrics.visitors, 0);
  const totalUnique = campaign.landingPages.reduce((acc, lp) => acc + lp.metrics.uniqueVisitors, 0);
  const totalConversions = campaign.landingPages.reduce((acc, lp) => acc + lp.metrics.conversions, 0);
  const totalRevenue = campaign.landingPages.reduce((acc, lp) => acc + lp.metrics.revenue, 0);
  const overallConvRate = totalUnique > 0 ? (totalConversions / totalUnique) * 100 : 0;
  const overallAov = totalConversions > 0 ? totalRevenue / totalConversions : 0;

  const minConfidenceThreshold = campaign.settings?.confidenceThreshold || 150;
  const hasSufficientData = totalVisitors >= minConfidenceThreshold;

  // Find best performing page
  const leadingPage: GrowthLandingPage | null = campaign.landingPages.reduce(
    (best: GrowthLandingPage | null, current: GrowthLandingPage) => {
      const currentRate = current.metrics.uniqueVisitors > 0 ? (current.metrics.conversions / current.metrics.uniqueVisitors) * 100 : 0;
      const bestRate = best ? (best.metrics.uniqueVisitors > 0 ? (best.metrics.conversions / best.metrics.uniqueVisitors) * 100 : 0) : -1;
      return currentRate > bestRate ? current : best;
    },
    null as GrowthLandingPage | null
  );

  // Aggregate traffic sources across landing pages
  const allTrafficSources: string[] = Array.from(
    new Set(
      campaign.landingPages.flatMap((lp) => Object.keys(lp.sourceBreakdown || {}))
    )
  );

  return (
    <div className="space-y-6 text-left">

      {/* Top Statistical Confidence Banner */}
      <div className={`p-4 sm:p-5 rounded-3xl border transition-all ${
        hasSufficientData
          ? "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800"
          : "bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800"
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            {hasSufficientData ? (
              <span className="p-2 rounded-2xl bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 shrink-0">
                <Award className="w-5 h-5" />
              </span>
            ) : (
              <span className="p-2 rounded-2xl bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 shrink-0">
                <Info className="w-5 h-5" />
              </span>
            )}

            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-mono font-bold uppercase tracking-wider ${
                  hasSufficientData ? "text-emerald-800 dark:text-emerald-300" : "text-amber-800 dark:text-amber-300"
                }`}>
                  {hasSufficientData
                    ? (isArabic ? "إشارة أداء قوية (Strong Performance Signal)" : "Strong Performance Signal")
                    : (isArabic ? "بيانات غير كافية بعد (Collecting Traffic)" : "Not enough data yet")}
                </span>
              </div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                {hasSufficientData
                  ? (isArabic
                      ? `الصفحة المتصدرة حالياً: ${leadingPage?.name} بمعدل تحويل ${((leadingPage!.metrics.conversions / leadingPage!.metrics.uniqueVisitors) * 100).toFixed(1)}%`
                      : `Leading Page: ${leadingPage?.name} with ${((leadingPage!.metrics.conversions / leadingPage!.metrics.uniqueVisitors) * 100).toFixed(1)}% CVR`)
                  : (isArabic
                      ? "استمر في توجيه الزيارات من إعلاناتك للوصول إلى 150 زائر على الأقل لإصدار استنتاجات موثوقة إحصائياً."
                      : "Keep collecting traffic to generate reliable insights. Minimum 150 total visitors required.")}
              </h4>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAiAdvisor(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isArabic ? "تحليل الحملة بالذكاء الاصطناعي (Analyze with AI)" : "Analyze with AI"}</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            {isArabic ? "إجمالي الزيارات الفريدة" : "Unique Visitors"}
          </span>
          <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
            {totalUnique.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-500 block mt-1">
            {totalVisitors.toLocaleString()} {isArabic ? "جلسة تصفح" : "sessions"}
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            {isArabic ? "إجمالي الطلبات (Conversions)" : "Total Orders"}
          </span>
          <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            {totalConversions.toLocaleString()}
          </span>
          <span className="text-[10px] text-emerald-600/80 block mt-1 font-bold">
            {overallConvRate.toFixed(1)}% {isArabic ? "معدل التحويل الكلي" : "avg conversion rate"}
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            {isArabic ? "المداخيل الإجمالية المحققة" : "Generated Revenue"}
          </span>
          <span className="text-2xl font-black font-mono text-indigo-600 dark:text-indigo-400">
            {totalRevenue.toLocaleString()} DA
          </span>
          <span className="text-[10px] text-slate-500 block mt-1">
            {isArabic ? "مبيعات الدفع عند الاستلام" : "verified COD gross"}
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            {isArabic ? "متوسط قيمة الطلب (AOV)" : "Average Order Value"}
          </span>
          <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
            {Math.round(overallAov).toLocaleString()} DA
          </span>
          <span className="text-[10px] text-slate-500 block mt-1">
            {isArabic ? "لكل طلب مكتمل" : "per verified order"}
          </span>
        </div>
      </div>

      {/* SECTION 16: COMPARISON TABLE BETWEEN LANDING PAGES */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
              {isArabic ? "مقارنة الأداء الشاملة بين صفحات الهبوط" : "Landing Pages Performance Comparison"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isArabic
                ? "مقارنة دقيقة لمعدل التحويل، الزوار، والمداخيل لتحديد الصفحة الرائدة إحصائياً."
                : "Side-by-side diagnostic comparison across all tested landing pages."}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold border-b border-slate-200/70 dark:border-slate-800">
              <tr>
                <th className="p-3.5 pl-5">{isArabic ? "صفحة الهبوط" : "Landing Page"}</th>
                <th className="p-3.5">{isArabic ? "الزاوية التسويقية" : "Strategy Focus"}</th>
                <th className="p-3.5 text-right">{isArabic ? "الزوار" : "Visitors"}</th>
                <th className="p-3.5 text-right">{isArabic ? "الطلبات" : "Conversions"}</th>
                <th className="p-3.5 text-right font-black">{isArabic ? "معدل التحويل" : "Conv. Rate"}</th>
                <th className="p-3.5 text-right">{isArabic ? "المداخيل" : "Revenue"}</th>
                <th className="p-3.5 text-right">{isArabic ? "نسبة الزيارات" : "Traffic Share"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {campaign.landingPages.map((lp) => {
                const isLeading = leadingPage?.id === lp.id && hasSufficientData;
                const cvr = lp.metrics.uniqueVisitors > 0
                  ? ((lp.metrics.conversions / lp.metrics.uniqueVisitors) * 100).toFixed(1)
                  : "0.0";

                return (
                  <tr 
                    key={lp.id}
                    className={`transition-colors ${
                      isLeading ? "bg-emerald-50/30 dark:bg-emerald-950/20 font-medium" : "hover:bg-slate-50/50 dark:hover:bg-slate-850"
                    }`}
                  >
                    <td className="p-3.5 pl-5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">{lp.name}</span>
                        {isLeading && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            {isArabic ? "الأفضل أداءً" : "Leading"}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-500 capitalize">{lp.strategyFocus.replace("_", " ")}</td>
                    <td className="p-3.5 text-right font-mono">{lp.metrics.visitors.toLocaleString()}</td>
                    <td className="p-3.5 text-right font-mono font-bold text-slate-900 dark:text-white">{lp.metrics.conversions}</td>
                    <td className="p-3.5 text-right font-mono font-black text-emerald-600 dark:text-emerald-400">
                      {cvr}%
                    </td>
                    <td className="p-3.5 text-right font-mono text-slate-700 dark:text-slate-300">
                      {lp.metrics.revenue.toLocaleString()} DA
                    </td>
                    <td className="p-3.5 text-right font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {lp.trafficAllocation}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 23: TRAFFIC SOURCE x LANDING PAGE MATRIX & DEVICE BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Source Matrix (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                {isArabic ? "تحليل مصادر الزيارات × صفحات الهبوط" : "Traffic Source → Landing Page Matrix"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isArabic
                  ? "اكتشف أي صفحة تحقق أعلى مبيعات لكل منصة إعلانية (مثلاً إنستغرام مقابل تيك توك)."
                  : "Granular breakdown of which landing page converts best per specific ad channel."}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {allTrafficSources.map((source) => (
              <div key={source} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850/70 border border-slate-200/60 dark:border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{source}</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {campaign.landingPages.map((lp) => {
                    const data = lp.sourceBreakdown?.[source] || { visitors: 0, conversions: 0, revenue: 0 };
                    const rate = data.visitors > 0 ? ((data.conversions / data.visitors) * 100).toFixed(1) : "0.0";

                    return (
                      <div key={lp.id} className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 text-left">
                        <span className="text-[10px] font-bold text-slate-400 block">{lp.name}</span>
                        <div className="flex items-baseline justify-between mt-1">
                          <span className="text-xs font-black font-mono text-slate-900 dark:text-white">
                            {data.conversions} {isArabic ? "طلب" : "orders"}
                          </span>
                          <span className="text-[11px] font-bold font-mono text-emerald-600 dark:text-emerald-400">
                            {rate}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Breakdown (1 col) */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              {isArabic ? "تحليل الأجهزة (Device Analysis)" : "Device Conversion Share"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isArabic ? "توزيع زوار الإعلانات ومعدل التحويل حسب نوع الجهاز." : "Mobile vs Desktop performance comparison."}
            </p>
          </div>

          <div className="space-y-3">
            {/* Mobile */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/70 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Mobile Devices</span>
                </div>
                <span className="text-xs font-mono font-bold text-indigo-600">84% of traffic</span>
              </div>
              <div className="flex items-baseline justify-between text-xs pt-1 border-t border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-500">{isArabic ? "معدل التحويل:" : "Conversion Rate:"}</span>
                <span className="font-mono font-black text-emerald-600 dark:text-emerald-400">8.9%</span>
              </div>
            </div>

            {/* Desktop */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/70 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Desktop</span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-500">12% of traffic</span>
              </div>
              <div className="flex items-baseline justify-between text-xs pt-1 border-t border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-500">{isArabic ? "معدل التحويل:" : "Conversion Rate:"}</span>
                <span className="font-mono font-black text-slate-700 dark:text-slate-300">5.4%</span>
              </div>
            </div>

            {/* Tablet */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/70 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tablet className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Tablet</span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-500">4% of traffic</span>
              </div>
              <div className="flex items-baseline justify-between text-xs pt-1 border-t border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-500">{isArabic ? "معدل التحويل:" : "Conversion Rate:"}</span>
                <span className="font-mono font-black text-slate-700 dark:text-slate-300">6.1%</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* SECTION 19: GROWTH INSIGHTS */}
      <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
          <TrendingUp className="w-5 h-5" />
          <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
            {isArabic ? "رؤى النمو وتحسين الأداء (Growth Insights)" : "Growth Insights & Actionable Observations"}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/70 dark:border-slate-800 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>{isArabic ? "تفوق صفحة التقييمات الاجتماعية" : "Social Proof Outperforming"}</span>
            </span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {isArabic
                ? "Landing Page 02 تحقق معدل تحويل أعلى بنسبة 24% مقارنة بـ Landing Page 01 بفضل عرض آراء الزبائن بالصور."
                : "Landing Page 02 converts 24% higher than Landing Page 01 due to verified customer reviews."}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/70 dark:border-slate-800 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-pink-500" />
              <span>{isArabic ? "كفاءة تحويل إنستغرام" : "Instagram Channel Efficiency"}</span>
            </span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {isArabic
                ? "زيارات إنستغرام تحقق معدل تحويل 9.1% مقابل 5.8% على تيك توك، مما يجعلها أكثر جاهزية للشراء الفوري."
                : "Instagram traffic yields an 9.1% conversion rate compared to 5.8% on TikTok."}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/70 dark:border-slate-800 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-indigo-500" />
              <span>{isArabic ? "أولوية مطلقة للموبايل" : "Mobile-First Traffic Dominance"}</span>
            </span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {isArabic
                ? "يمثل زوار الموبايل أكثر من 84% من إجمالي الزيارات، وتسهيل استمارة الطلب المصغرة يرفع الشراء بنسبة 18%."
                : "Mobile visitors represent 84% of your volume. Keeping the COD order form concise maximizes completion."}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/70 dark:border-slate-800 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              <span>{isArabic ? "توصية التوزيع المقترح" : "Suggested Traffic Realignment"}</span>
            </span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {isArabic
                ? "زيادة حصة Landing Page 02 إلى 50% أو 55% من خلال زر Optimize Traffic سيرفع أرباح الحملة بحوالي 18,000 دج أسبوعياً."
                : "Reallocating 50-55% traffic to Landing Page 02 is projected to increase weekly revenue by ~18,000 DA."}
            </p>
          </div>
        </div>
      </div>

      {/* AI GROWTH ADVISOR MODAL (Section 20) */}
      {showAiAdvisor && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-5 text-left max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  <Bot className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {isArabic ? "مستشار النمو الذكي (AI Growth Advisor)" : "AI Growth Advisor"}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isArabic
                      ? "تحليل دقيق لأداء الحملة الإعلانية، وتحديد نقاط التسرب وفرص مضاعفة المبيعات."
                      : "Actionable diagnostic intelligence across traffic sources, drop-offs, and pages."}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAiAdvisor(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 space-y-1.5">
                <span className="font-bold text-indigo-950 dark:text-indigo-200 block text-xs">
                  {isArabic ? "1. التوصية الأساسية: تركيز الميزانية على الصفحة المتصدرة" : "1. Primary Recommendation: Promote Leading Page"}
                </span>
                <p className="text-indigo-900/80 dark:text-indigo-300">
                  {isArabic
                    ? "Landing Page 02 تحقق معدل تحويل 9.4% مع متوسط سلة 4,900 دج. نقترح زيادة حصتها من الزيارات فوراً من 35% إلى 50% عبر لوحة Traffic Distribution."
                    : "Landing Page 02 is converting at 9.4% with healthy AOV. We recommend immediately increasing its traffic share from 35% to 50%."}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-1.5">
                <span className="font-bold text-slate-900 dark:text-white block text-xs">
                  {isArabic ? "2. تحسين حركة المرور القادمة من TikTok" : "2. Optimizing TikTok Traffic"}
                </span>
                <p className="text-slate-600 dark:text-slate-400">
                  {isArabic
                    ? "معدل التحويل على تيك توك أدنى من إنستغرام. نوصي بوضع فيديو قصير سريع في أعلى صفحة الهبوط لتثبيت انتباه جمهور تيك توك السريع."
                    : "TikTok traffic shows higher bounce rates. Adding a 10-second product demo video above the fold on Landing Page 03 can bridge the intent gap."}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-1.5">
                <span className="font-bold text-slate-900 dark:text-white block text-xs">
                  {isArabic ? "3. ضمان المعاينة قبل الدفع" : "3. Highlight Cash on Delivery Trust"}
                </span>
                <p className="text-slate-600 dark:text-slate-400">
                  {isArabic
                    ? "وضع شارة 'معاينة الطرد مع شركة التوصيل قبل دفع الدينار' في أعلى الصفحة ساهم في رفع الطلبات المؤكدة بنسبة 14%."
                    : "Emphasizing the 'inspect before paying' guarantee reduced hesitation among new social media buyers."}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowAiAdvisor(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer shadow-xs"
              >
                {isArabic ? "فهمت التوصيات" : "Got It"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
