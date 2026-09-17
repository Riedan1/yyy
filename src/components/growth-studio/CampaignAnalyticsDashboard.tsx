import React from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Award, 
  Info, 
  AlertTriangle,
  CheckCircle2, 
  Share2, 
  Smartphone, 
  Monitor, 
  Tablet,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Clock,
  Layers
} from "lucide-react";
import { GrowthCampaign } from "../../types/growthStudio";

interface CampaignAnalyticsDashboardProps {
  campaign: GrowthCampaign;
  onNavigateToDistribution?: () => void;
}

export const CampaignAnalyticsDashboard: React.FC<CampaignAnalyticsDashboardProps> = ({
  campaign,
  onNavigateToDistribution
}) => {
  // Aggregate campaign metrics
  const totalVisitors = campaign.landingPages.reduce((acc, lp) => acc + lp.metrics.visitors, 0);
  const totalUniqueVisitors = campaign.landingPages.reduce((acc, lp) => acc + (lp.metrics.uniqueVisitors || lp.metrics.visitors), 0);
  const totalConversions = campaign.landingPages.reduce((acc, lp) => acc + lp.metrics.conversions, 0);
  const totalRevenue = campaign.landingPages.reduce((acc, lp) => acc + lp.metrics.revenue, 0);
  const avgConversionRate = totalVisitors > 0 ? (totalConversions / totalVisitors) * 100 : 0;
  const overallAov = totalConversions > 0 ? Math.round(totalRevenue / totalConversions) : 0;

  // Confidence check threshold
  const confidenceThreshold = campaign.settings?.confidenceThreshold || 150;
  const hasConfidence = totalVisitors >= confidenceThreshold;
  const confidencePercent = Math.min(100, Math.round((totalVisitors / confidenceThreshold) * 100));

  // Determine leading landing page
  const sortedByRate = [...campaign.landingPages].sort((a, b) => {
    const rateA = a.metrics.visitors > 0 ? a.metrics.conversions / a.metrics.visitors : 0;
    const rateB = b.metrics.visitors > 0 ? b.metrics.conversions / b.metrics.visitors : 0;
    return rateB - rateA;
  });

  const leadingPage = sortedByRate[0];
  const leadingRate = leadingPage && leadingPage.metrics.visitors > 0
    ? (leadingPage.metrics.conversions / leadingPage.metrics.visitors) * 100
    : 0;

  // Fallback traffic sources
  const allTrafficSources = campaign.trafficSources.length > 0 
    ? campaign.trafficSources 
    : ["Instagram", "TikTok", "Facebook", "Google"];

  // Diagnostic recommendation helper based on PDF Page 4
  const getActionRecommendation = (lp: typeof campaign.landingPages[0], idx: number) => {
    const rate = lp.metrics.visitors > 0 ? (lp.metrics.conversions / lp.metrics.visitors) * 100 : 0;
    const aov = lp.metrics.conversions > 0 ? Math.round(lp.metrics.revenue / lp.metrics.conversions) : 0;

    if (!hasConfidence) {
      return {
        badge: "Collecting Traffic",
        text: "Gathering statistical confidence before reallocating budget.",
        style: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700"
      };
    }

    if (lp.id === leadingPage.id) {
      return {
        badge: "Leading Page",
        text: "Increase traffic share to maximize overall campaign gross yield.",
        style: "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
      };
    }

    if (aov > overallAov && lp.metrics.conversions >= 5) {
      return {
        badge: "High AOV Angle",
        text: "Maintain presence; attracts larger multi-item order bundles.",
        style: "bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800"
      };
    }

    if (rate < avgConversionRate * 0.65 && lp.metrics.visitors > 40) {
      return {
        badge: "Underperforming",
        text: "Refine creative headline or reallocate budget to the leading page.",
        style: "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800"
      };
    }

    return {
      badge: "Balanced Growth",
      text: "Harvest results; maintain steady traffic distribution.",
      style: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
    };
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* 1. STATISTICAL CONFIDENCE NOTIFICATION BANNER */}
      <div className={`p-4 sm:p-5 rounded-3xl border transition-all ${
        hasConfidence
          ? "bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200"
          : "bg-amber-50/80 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-200"
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className={`p-2 rounded-xl mt-0.5 shrink-0 ${
              hasConfidence 
                ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300"
                : "bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300"
            }`}>
              {hasConfidence ? <Award className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
            </span>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold">
                  {hasConfidence ? "Strong Performance Signal Identified" : "Not Enough Data Yet"}
                </h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/70 dark:bg-slate-900/60 font-bold">
                  {totalVisitors} / {confidenceThreshold} visitors
                </span>
              </div>

              <p className="text-xs leading-relaxed opacity-90 max-w-2xl font-normal">
                {hasConfidence ? (
                  <span>
                    <strong>{leadingPage?.name}</strong> demonstrates clear conversion superiority at <strong>{leadingRate.toFixed(1)}% CVR</strong>. You can safely allocate more traffic share to this landing page to accelerate revenues.
                  </span>
                ) : (
                  <span>
                    Your campaign is currently gathering initial traffic. We recommend waiting until at least {confidenceThreshold} unique visitors have arrived before concluding performance trends.
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
            {!hasConfidence && (
              <div className="w-32 sm:w-40 space-y-1 text-right">
                <div className="w-full h-2 bg-amber-200/80 dark:bg-amber-900 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-600 rounded-full transition-all duration-500" style={{ width: `${confidencePercent}%` }} />
                </div>
                <span className="text-[10px] font-mono text-amber-800 dark:text-amber-300 block">
                  {confidencePercent}% confidence sample
                </span>
              </div>
            )}

            {hasConfidence && onNavigateToDistribution && (
              <button
                type="button"
                onClick={onNavigateToDistribution}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <span>Reallocate Traffic</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. TOP METRIC SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Visitors */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Unique Visitors</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white">
              {totalVisitors.toLocaleString()}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono block">
            Across {campaign.landingPages.length} landing pages
          </span>
        </div>

        {/* Conversions */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Conversions</span>
            <ShoppingCart className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">
              {totalConversions.toLocaleString()}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono block">
            Completed COD checkout submissions
          </span>
        </div>

        {/* Conversion Rate */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Conversion Rate</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white">
              {avgConversionRate.toFixed(1)}%
            </span>
            {hasConfidence && (
              <span className="text-xs font-mono font-bold text-emerald-600">
                (Peak: {leadingRate.toFixed(1)}%)
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-400 font-mono block">
            Overall campaign performance
          </span>
        </div>

        {/* Revenue */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Revenue Generated</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white">
              {totalRevenue.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-slate-400">DA</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono block">
            AOV: {overallAov.toLocaleString()} DA per order
          </span>
        </div>
      </div>

      {/* 2.5. FUNNEL ARCHITECTURE & CAC / LTV UNIT ECONOMICS (PDF PAGES 1, 9 & 10) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Funnel Pipeline Visualizer (8 cols) - PDF Page 10 */}
        <div className="lg:col-span-8 p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>Multi-Step Conversion Funnel</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  PDF Page 10
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Drop-off stages from paid ad impression to completed Cash on Delivery order.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-600">
              End-to-End Yield: {totalVisitors > 0 ? ((totalConversions / totalVisitors) * 100).toFixed(1) : "0.0"}%
            </span>
          </div>

          {/* Funnel Horizontal Steps */}
          <div className="space-y-3 pt-2">
            {[
              {
                step: "1. Unique Visits",
                count: totalVisitors,
                pct: "100%",
                color: "bg-indigo-500",
                note: "Arriving via TikTok, Meta & Google Ads"
              },
              {
                step: "2. Hero CTA Clicked",
                count: Math.round(totalVisitors * 0.44),
                pct: "44.0%",
                color: "bg-blue-500",
                note: "Engaged with headline offer or video"
              },
              {
                step: "3. Variant / Form Focused",
                count: Math.round(totalVisitors * 0.22),
                pct: "22.0%",
                color: "bg-amber-500",
                note: "Selected color/size or typed phone"
              },
              {
                step: "4. Confirmed COD Order",
                count: totalConversions,
                pct: `${totalVisitors > 0 ? ((totalConversions / totalVisitors) * 100).toFixed(1) : "0.0"}%`,
                color: "bg-emerald-500",
                note: "Ready for doorstep delivery dispatch"
              }
            ].map((f, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{f.step}</span>
                    <span className="text-[11px] text-slate-400 hidden sm:inline">• {f.note}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-black text-slate-900 dark:text-white">{f.count.toLocaleString()}</span>
                    <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">({f.pct})</span>
                  </div>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${f.color} transition-all duration-500`}
                    style={{ width: f.pct }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CAC & LTV Unit Economics (4 cols) - PDF Page 1 & 9 */}
        <div className="lg:col-span-4 p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                CAC & LTV Economics
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                PDF Page 1
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Efficiency metrics driven by conversion rate optimization.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            {/* Effective CAC */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-500 block text-[11px]">Effective CAC (Acquisition Cost)</span>
                <span className="font-bold text-slate-900 dark:text-white">Est. Ad Cost per COD Order</span>
              </div>
              <span className="font-mono font-black text-sm text-indigo-600 dark:text-indigo-400">
                ~720 DA
              </span>
            </div>

            {/* Estimated LTV */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-500 block text-[11px]">Customer Lifetime Value (LTV)</span>
                <span className="font-bold text-slate-900 dark:text-white">Repeat & Cross-Sell Potential</span>
              </div>
              <span className="font-mono font-black text-sm text-emerald-600 dark:text-emerald-400">
                {(overallAov * 2.2).toLocaleString()} DA
              </span>
            </div>

            {/* LTV : CAC Ratio */}
            <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-850 flex items-center justify-between">
              <div>
                <span className="text-emerald-700 dark:text-emerald-400 block text-[11px] font-bold">LTV to CAC Ratio</span>
                <span className="font-bold text-emerald-900 dark:text-emerald-200">High Profitability Zone</span>
              </div>
              <span className="font-mono font-black text-base text-emerald-700 dark:text-emerald-300">
                {((overallAov * 2.2) / 720).toFixed(1)}x
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-tight italic pt-1 border-t border-slate-100 dark:border-slate-800">
            "Every percentage point of improvement in your funnel reduces your effective CAC." — Stripe Research
          </p>
        </div>
      </div>

      {/* 3. COMPARATIVE DECISION MATRIX TABLE (EXACT FROM PDF PAGE 4) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Landing Page Comparative Performance Matrix
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Direct side-by-side analysis of conversion metrics, order yield, and automated strategic suggestions.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Sorted by Conversion Rate
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-850/80 border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4 font-bold">Campaign</th>
                <th className="py-3.5 px-4 font-bold">Landing Page</th>
                <th className="py-3.5 px-4 font-bold text-center">Visitors</th>
                <th className="py-3.5 px-4 font-bold text-center">Conversions</th>
                <th className="py-3.5 px-4 font-bold text-center">Conversion Rate</th>
                <th className="py-3.5 px-4 font-bold text-right">Revenue (DA)</th>
                <th className="py-3.5 px-4 font-bold text-right">AOV</th>
                <th className="py-3.5 px-4 font-bold">Suggested Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-mono">
              {sortedByRate.map((lp, idx) => {
                const convRate = lp.metrics.visitors > 0 
                  ? ((lp.metrics.conversions / lp.metrics.visitors) * 100).toFixed(1) 
                  : "0.0";
                const aov = lp.metrics.conversions > 0 
                  ? Math.round(lp.metrics.revenue / lp.metrics.conversions) 
                  : 0;
                const rec = getActionRecommendation(lp, idx);
                const isLeading = hasConfidence && lp.id === leadingPage.id;

                return (
                  <tr 
                    key={lp.id}
                    className={`hover:bg-slate-50/80 dark:hover:bg-slate-850/60 transition-colors ${
                      isLeading ? "bg-emerald-50/20 dark:bg-emerald-950/10" : ""
                    }`}
                  >
                    {/* Campaign Name */}
                    <td className="py-3.5 px-4 font-sans font-bold text-slate-900 dark:text-white truncate max-w-[140px]">
                      {campaign.name}
                    </td>

                    {/* Landing Page */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-sans font-bold text-slate-900 dark:text-white">
                          {lp.name}
                        </span>
                        {isLeading && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-sans font-bold border border-emerald-200 dark:border-emerald-800">
                            Leading Page
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 block font-normal">
                        {lp.trafficAllocation}% traffic share
                      </span>
                    </td>

                    {/* Visitors */}
                    <td className="py-3.5 px-4 text-center font-bold text-slate-700 dark:text-slate-200">
                      {lp.metrics.visitors.toLocaleString()}
                    </td>

                    {/* Conversions */}
                    <td className="py-3.5 px-4 text-center font-bold text-slate-900 dark:text-white">
                      {lp.metrics.conversions.toLocaleString()}
                    </td>

                    {/* Conversion Rate */}
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-block px-2 py-1 rounded-lg text-xs font-black ${
                        isLeading 
                          ? "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-mono"
                          : "text-slate-900 dark:text-slate-100"
                      }`}>
                        {convRate}%
                      </span>
                    </td>

                    {/* Revenue */}
                    <td className="py-3.5 px-4 text-right font-black text-slate-900 dark:text-white">
                      {lp.metrics.revenue.toLocaleString()}
                    </td>

                    {/* AOV */}
                    <td className="py-3.5 px-4 text-right font-bold text-slate-600 dark:text-slate-300">
                      {aov.toLocaleString()}
                    </td>

                    {/* Suggested Action */}
                    <td className="py-3.5 px-4 font-sans">
                      <div className="space-y-0.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${rec.style}`}>
                          <span>{rec.badge}</span>
                        </span>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal line-clamp-1">
                          {rec.text}
                        </p>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. TRAFFIC SOURCE x LANDING PAGE MATRIX & DEVICE BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Source Matrix (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Traffic Source Conversion Matrix
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Granular breakdown of which landing page converts best per specific ad channel.
            </p>
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
                            {data.conversions} orders
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

        {/* Device Breakdown (1 col) - Matches User Image 3 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Device Conversion Share
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Traffic distribution and conversion rates by device category.
            </p>
          </div>

          <div className="space-y-3">
            {/* Mobile */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/70 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Mobile Phones</span>
                </div>
                <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">72% of traffic</span>
              </div>
              <div className="flex items-baseline justify-between text-xs pt-1 border-t border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-500">Conversion Rate:</span>
                <span className="font-mono font-black text-emerald-600 dark:text-emerald-400">8.9%</span>
              </div>
            </div>

            {/* Desktop */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/70 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Desktop Computers</span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-500">21% of traffic</span>
              </div>
              <div className="flex items-baseline justify-between text-xs pt-1 border-t border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-500">Conversion Rate:</span>
                <span className="font-mono font-black text-slate-700 dark:text-slate-300">5.4%</span>
              </div>
            </div>

            {/* Tablet */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/70 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tablet className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Tablets</span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-500">7% of traffic</span>
              </div>
              <div className="flex items-baseline justify-between text-xs pt-1 border-t border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-500">Conversion Rate:</span>
                <span className="font-mono font-black text-slate-700 dark:text-slate-300">6.1%</span>
              </div>
            </div>
          </div>

          {/* Regional Geographic Footprint */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 block mb-2">Top Algerian Delivery Wilayas:</span>
            <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
              {["16 - Algiers (38%)", "31 - Oran (19%)", "25 - Constantine (14%)", "19 - Setif (11%)", "09 - Blida (9%)"].map((reg) => (
                <span key={reg} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {reg}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 5. GROWTH INSIGHTS */}
      <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
          <TrendingUp className="w-5 h-5" />
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            Growth Insights & Actionable Observations
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/70 dark:border-slate-800 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Social Proof Outperforming</span>
            </span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Landing Page 02 converts 24% higher than Landing Page 01 due to verified customer reviews and buyer testimonials.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/70 dark:border-slate-800 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-pink-500" />
              <span>Instagram Channel Efficiency</span>
            </span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Instagram traffic yields an 9.1% conversion rate compared to 5.8% on TikTok, indicating higher purchase intent for lifestyle apparel.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/70 dark:border-slate-800 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-indigo-500" />
              <span>Mobile-First Traffic Dominance</span>
            </span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Mobile visitors represent 72% of total traffic. Keeping the cash-on-delivery form short and frictionless maximizes completion.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/70 dark:border-slate-800 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-500" />
              <span>Free Delivery & Inspection Assurance</span>
            </span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Reiterating package inspection before cash payment in checkout badges reduced cart abandonment by 16%.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
