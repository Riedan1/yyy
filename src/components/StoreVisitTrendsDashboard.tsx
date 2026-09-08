import React, { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
  Cell,
  Legend,
} from "recharts";
import {
  TrendingUp,
  Clock,
  Users,
  Eye,
  Zap,
  Calendar,
  Sparkles,
  Flame,
  Activity,
  ArrowUpRight,
  Filter,
  Info,
  Smartphone,
  Monitor,
  Tablet,
  ChevronRight,
} from "lucide-react";
import { motion } from "motion/react";

export interface StoreVisitTrendsDashboardProps {
  storeName?: string;
  accentColor?: string;
  darkMode?: boolean;
}

export type TimeframeOption = "24h" | "7d" | "30d";
export type MetricOption = "visits" | "unique" | "both";

interface TelemetryPoint {
  timeLabel: string;
  shortLabel: string;
  visits: number;
  uniqueVisitors: number;
  bounceRate: number; // percentage
  avgDurationSec: number;
  isPeak: boolean;
  activityLevel: "peak" | "high" | "moderate" | "low";
  category?: string;
}

export default function StoreVisitTrendsDashboard({
  storeName = "Storefront",
  accentColor = "#6366f1",
  darkMode = false,
}: StoreVisitTrendsDashboardProps) {
  const [timeframe, setTimeframe] = useState<TimeframeOption>("24h");
  const [metric, setMetric] = useState<MetricOption>("both");
  const [activeTab, setActiveTab] = useState<"timeline" | "hourly_heatmap" | "device_split">("timeline");
  const [selectedPeakFilter, setSelectedPeakFilter] = useState<"all" | "peaks_only">("all");

  // ---------------------------------------------------------------------------
  // Generate Data based on timeframe
  // ---------------------------------------------------------------------------
  const chartData = useMemo<TelemetryPoint[]>(() => {
    if (timeframe === "24h") {
      // 24 Hourly data points (00:00 to 23:00)
      const baseVisits = [
        18, 12, 8, 5, 4, 10, 32, 65, 120, 185, 210, 245, 
        310, 280, 260, 290, 340, 420, 560, 680, 610, 430, 220, 85
      ];
      
      return baseVisits.map((v, i) => {
        const hourStr = i < 10 ? `0${i}:00` : `${i}:00`;
        const hourLabel = i === 0 ? "12 AM" : i < 12 ? `${i} AM` : i === 12 ? "12 PM" : `${i - 12} PM`;
        const unique = Math.floor(v * 0.72 + (i % 3) * 4);
        
        let activityLevel: "peak" | "high" | "moderate" | "low" = "low";
        let isPeak = false;
        if (v >= 500) {
          activityLevel = "peak";
          isPeak = true;
        } else if (v >= 300) {
          activityLevel = "high";
        } else if (v >= 100) {
          activityLevel = "moderate";
        }

        return {
          timeLabel: `${hourStr} (${hourLabel})`,
          shortLabel: hourLabel,
          visits: v,
          uniqueVisitors: unique,
          bounceRate: Math.max(22, Math.floor(48 - (v / 25))),
          avgDurationSec: Math.floor(110 + (v / 3)),
          isPeak,
          activityLevel,
          category: i >= 18 && i <= 21 ? "Evening Peak" : i >= 11 && i <= 14 ? "Lunch Peak" : "Regular",
        };
      });
    }

    if (timeframe === "7d") {
      // 7 Days data points (Mon to Sun)
      const days = [
        { name: "Monday", short: "Mon", visits: 1840, peakHour: "20:00" },
        { name: "Tuesday", short: "Tue", visits: 2150, peakHour: "19:00" },
        { name: "Wednesday", short: "Wed", visits: 2420, peakHour: "21:00" },
        { name: "Thursday", short: "Thu", visits: 3890, peakHour: "20:30" },
        { name: "Friday", short: "Fri", visits: 4520, peakHour: "21:00" },
        { name: "Saturday", short: "Sat", visits: 4180, peakHour: "18:00" },
        { name: "Sunday", short: "Sun", visits: 2950, peakHour: "17:00" },
      ];

      return days.map((d) => {
        const unique = Math.floor(d.visits * 0.74);
        const isPeak = d.visits >= 3800;
        const activityLevel = isPeak ? "peak" : d.visits >= 2500 ? "high" : "moderate";

        return {
          timeLabel: d.name,
          shortLabel: d.short,
          visits: d.visits,
          uniqueVisitors: unique,
          bounceRate: Math.floor(32 + Math.random() * 8),
          avgDurationSec: Math.floor(180 + Math.random() * 60),
          isPeak,
          activityLevel,
          category: isPeak ? "Weekend/Rush Peak" : "Standard Traffic",
        };
      });
    }

    // 30 Days view
    const points: TelemetryPoint[] = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const isWeekend = date.getDay() === 5 || date.getDay() === 6; // Fri / Sat
      
      const dayNum = date.getDate();
      const monthStr = date.toLocaleDateString("en-US", { month: "short" });
      const label = `${monthStr} ${dayNum}`;
      
      const baseV = isWeekend ? 3800 + (i % 7) * 120 : 1900 + (i % 5) * 150;
      const visits = baseV + Math.floor((Math.sin(i) + 1) * 400);
      const unique = Math.floor(visits * 0.73);
      const isPeak = visits >= 3600;

      points.push({
        timeLabel: label,
        shortLabel: `${dayNum}`,
        visits,
        uniqueVisitors: unique,
        bounceRate: Math.floor(28 + (i % 9)),
        avgDurationSec: Math.floor(190 + (i % 12) * 5),
        isPeak,
        activityLevel: isPeak ? "peak" : visits >= 2600 ? "high" : "moderate",
      });
    }
    return points;
  }, [timeframe]);

  // Filtered dataset if peaks_only is selected
  const filteredData = useMemo(() => {
    if (selectedPeakFilter === "peaks_only") {
      return chartData.filter((d) => d.isPeak || d.activityLevel === "high");
    }
    return chartData;
  }, [chartData, selectedPeakFilter]);

  // ---------------------------------------------------------------------------
  // Calculations & Analytics Summary
  // ---------------------------------------------------------------------------
  const totalVisits = useMemo(() => chartData.reduce((acc, d) => acc + d.visits, 0), [chartData]);
  const totalUnique = useMemo(() => chartData.reduce((acc, d) => acc + d.uniqueVisitors, 0), [chartData]);
  const maxVisitPoint = useMemo(() => {
    if (chartData.length === 0) return null;
    return [...chartData].sort((a, b) => b.visits - a.visits)[0];
  }, [chartData]);

  const peakTrafficThreshold = useMemo(() => {
    if (chartData.length === 0) return 0;
    const avg = totalVisits / chartData.length;
    return Math.floor(avg * 1.35); // 35% above average is peak threshold
  }, [chartData, totalVisits]);

  const peakPeriodsCount = useMemo(() => chartData.filter((d) => d.visits >= peakTrafficThreshold).length, [chartData, peakTrafficThreshold]);

  // Top 3 peak periods
  const topPeakPeriods = useMemo(() => {
    return [...chartData].sort((a, b) => b.visits - a.visits).slice(0, 3);
  }, [chartData]);

  // Device split data for peak hours
  const deviceData = [
    { name: "Mobile App & Web", percentage: 74, visits: Math.floor(totalVisits * 0.74), icon: Smartphone, color: "#6366f1" },
    { name: "Desktop Browser", percentage: 21, visits: Math.floor(totalVisits * 0.21), icon: Monitor, color: "#10b981" },
    { name: "Tablet & Others", percentage: 5, visits: Math.floor(totalVisits * 0.05), icon: Tablet, color: "#f59e0b" },
  ];

  return (
    <div
      id="store-visit-trends-dashboard"
      className="bg-white dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col gap-6 text-left"
    >
      {/* ----------------------------------------------------------------------- */}
      {/* 1. Header Banner & Timeframe Switchers                                  */}
      {/* ----------------------------------------------------------------------- */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm"
            style={{ backgroundColor: accentColor }}
          >
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100 tracking-tight font-sans uppercase">
                Store Visit Trends & Peak Activity
              </h3>
              <span className="text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-200/60 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Live Telemetry
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium leading-relaxed">
              Track customer traffic volume, detect peak traffic rush hours, and optimize storefront conversion schedules for <strong className="text-slate-800 dark:text-slate-200">{storeName}</strong>.
            </p>
          </div>
        </div>

        {/* Timeframe & Mode Controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* Timeframe Selector */}
          <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 select-none flex-1 lg:flex-initial">
            {(["24h", "7d", "30d"] as TimeframeOption[]).map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeframe(tf)}
                className={`flex-1 lg:flex-initial px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  timeframe === tf
                    ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                {tf === "24h" ? "24 Hours" : tf === "7d" ? "7 Days" : "30 Days"}
              </button>
            ))}
          </div>

          {/* Metric Selector */}
          <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 select-none">
            <button
              type="button"
              onClick={() => setMetric("both")}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                metric === "both"
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              All Metrics
            </button>
            <button
              type="button"
              onClick={() => setMetric("visits")}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                metric === "visits"
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Visits Only
            </button>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------------------- */}
      {/* 2. Key Telemetry Metric Cards & Peak Highlights                         */}
      {/* ----------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Total Traffic Volume */}
        <div className="bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800/80 p-4 rounded-xl text-left relative overflow-hidden">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono flex items-center justify-between">
            Total Visits
            <Eye className="w-3.5 h-3.5 text-indigo-500" />
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">
              {totalVisits.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +18.4%
            </span>
          </div>
          <span className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-1 block font-medium">
            {totalUnique.toLocaleString()} unique storefront visitors
          </span>
        </div>

        {/* Card 2: Peak Activity Period Highlight */}
        <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/25 p-4 rounded-xl text-left relative overflow-hidden">
          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider font-mono flex items-center justify-between">
            Peak Activity Period
            <Flame className="w-4 h-4 text-amber-500 animate-bounce" />
          </span>
          <div className="mt-1">
            <span className="text-base font-black text-slate-900 dark:text-slate-100 font-mono block truncate">
              {maxVisitPoint ? maxVisitPoint.timeLabel : "N/A"}
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs font-black text-amber-600 dark:text-amber-400 font-mono">
                {maxVisitPoint ? maxVisitPoint.visits.toLocaleString() : 0} visits
              </span>
              <span className="text-[10px] bg-amber-500 text-white font-mono font-bold px-1.5 py-0.2 rounded">
                ⚡ MAX RUSH
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Peak Threshold Indicator */}
        <div className="bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800/80 p-4 rounded-xl text-left">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono flex items-center justify-between">
            High-Traffic Periods
            <Zap className="w-3.5 h-3.5 text-amber-500" />
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">
              {peakPeriodsCount} {timeframe === "24h" ? "Hours" : "Days"}
            </span>
          </div>
          <span className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-1 block font-medium">
            Threshold: &gt; {peakTrafficThreshold.toLocaleString()} visits/period
          </span>
        </div>

        {/* Card 4: Average Session Engagement */}
        <div className="bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800/80 p-4 rounded-xl text-left">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono flex items-center justify-between">
            Peak Session Duration
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">
              3m 42s
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              +14%
            </span>
          </div>
          <span className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-1 block font-medium">
            Avg bounce rate: 31.2% during peak
          </span>
        </div>
      </div>

      {/* ----------------------------------------------------------------------- */}
      {/* 3. View Switcher Tabs (Timeline Recharts vs Hourly Heatmap vs Devices)  */}
      {/* ----------------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab("timeline")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "timeline"
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
            Visit Trend Area Chart
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("hourly_heatmap")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "hourly_heatmap"
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800"
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            Peak Intensity Distribution
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("device_split")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "device_split"
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
            Device Split
          </button>
        </div>

        {/* Filter Peak Periods Only Button */}
        <button
          type="button"
          onClick={() => setSelectedPeakFilter(selectedPeakFilter === "all" ? "peaks_only" : "all")}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
            selectedPeakFilter === "peaks_only"
              ? "bg-amber-500 text-white border-amber-600 shadow-xs"
              : "bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100"
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          {selectedPeakFilter === "peaks_only" ? "Filter: Peak Rush Only" : "Show All Activity"}
        </button>
      </div>

      {/* ----------------------------------------------------------------------- */}
      {/* 4. Main Recharts Graphical Engine Display                              */}
      {/* ----------------------------------------------------------------------- */}
      <div className="w-full min-h-[290px] relative px-1">
        {activeTab === "timeline" && (
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={filteredData}
                margin={{ top: 20, right: 20, left: -20, bottom: 5 }}
              >
                <defs>
                  {/* Total Visits Gradient */}
                  <linearGradient id="visitGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={accentColor} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={accentColor} stopOpacity={0.0} />
                  </linearGradient>

                  {/* Unique Visitors Gradient */}
                  <linearGradient id="uniqueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>

                  {/* Peak Highlight Gradient */}
                  <linearGradient id="peakHighlight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0.05} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? "#1e293b" : "#f1f5f9"} />

                <XAxis
                  dataKey="shortLabel"
                  tick={{ fill: darkMode ? "#94a3b8" : "#64748b", fontSize: 10, fontWeight: 600, fontFamily: "sans-serif" }}
                  axisLine={{ stroke: darkMode ? "#334155" : "#e2e8f0" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: darkMode ? "#94a3b8" : "#64748b", fontSize: 9.5, fontFamily: "monospace" }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  cursor={{ stroke: accentColor, strokeWidth: 1.5, strokeDasharray: "4 4" }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data: TelemetryPoint = payload[0].payload;
                      return (
                        <div className="bg-slate-900/95 backdrop-blur-md border border-slate-800 text-slate-100 p-3 rounded-2xl shadow-xl text-left flex flex-col gap-2 min-w-[200px]">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                            <span className="font-extrabold text-xs text-white font-mono flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-indigo-400" />
                              {data.timeLabel}
                            </span>
                            {data.isPeak ? (
                              <span className="bg-gradient-to-r from-amber-500 to-rose-500 text-white font-mono text-[9px] font-black px-2 py-0.5 rounded-md flex items-center gap-0.5">
                                <Flame className="w-3 h-3" /> PEAK RUSH
                              </span>
                            ) : (
                              <span className="text-[9px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                                {data.activityLevel.toUpperCase()}
                              </span>
                            )}
                          </div>

                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400 flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
                                Total Visits:
                              </span>
                              <span className="font-black text-white font-mono">{data.visits.toLocaleString()}</span>
                            </div>

                            <div className="flex justify-between items-center">
                              <span className="text-slate-400 flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                Unique Visitors:
                              </span>
                              <span className="font-bold text-emerald-400 font-mono">{data.uniqueVisitors.toLocaleString()}</span>
                            </div>

                            <div className="flex justify-between items-center pt-1 border-t border-slate-800/80 text-[10.5px]">
                              <span className="text-slate-400">Bounce Rate:</span>
                              <span className="font-mono text-amber-300 font-bold">{data.bounceRate}%</span>
                            </div>
                            <div className="flex justify-between items-center text-[10.5px]">
                              <span className="text-slate-400">Avg Duration:</span>
                              <span className="font-mono text-slate-200 font-bold">{data.avgDurationSec}s</span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ paddingBottom: 10, fontSize: 11 }}
                  formatter={(value) => (
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-sans">
                      {value === "visits" ? "Total Store Visits" : "Unique Visitors"}
                    </span>
                  )}
                />

                {/* Reference Line for Peak Activity Threshold */}
                <ReferenceLine
                  y={peakTrafficThreshold}
                  stroke="#f59e0b"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{
                    value: `⚡ Peak Rush Line (${peakTrafficThreshold} visits)`,
                    fill: "#f59e0b",
                    fontSize: 10,
                    fontWeight: 800,
                    position: "top",
                  }}
                />

                {/* Primary Visits Area */}
                {(metric === "both" || metric === "visits") && (
                  <Area
                    type="monotone"
                    dataKey="visits"
                    name="visits"
                    stroke={accentColor}
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#visitGradient)"
                    activeDot={{ r: 7, strokeWidth: 2, stroke: "#ffffff" }}
                  />
                )}

                {/* Unique Visitors Area */}
                {(metric === "both" || metric === "unique") && (
                  <Area
                    type="monotone"
                    dataKey="uniqueVisitors"
                    name="uniqueVisitors"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#uniqueGradient)"
                    activeDot={{ r: 6, strokeWidth: 2, stroke: "#ffffff" }}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Hourly Peak Intensity Distribution (Bar Chart View) */}
        {activeTab === "hourly_heatmap" && (
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 15, right: 15, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? "#1e293b" : "#f1f5f9"} />
                <XAxis
                  dataKey="shortLabel"
                  tick={{ fill: darkMode ? "#94a3b8" : "#64748b", fontSize: 9.5, fontWeight: 600 }}
                  axisLine={{ stroke: darkMode ? "#334155" : "#e2e8f0" }}
                  tickLine={false}
                />
                <YAxis tick={{ fill: darkMode ? "#94a3b8" : "#64748b", fontSize: 9, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "#f8fafc", opacity: 0.15 }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data: TelemetryPoint = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-md text-xs font-sans text-left space-y-1">
                          <span className="font-mono font-bold text-amber-400 block">{data.timeLabel}</span>
                          <div>
                            Visits: <strong className="font-mono text-white">{data.visits}</strong>
                          </div>
                          <div>
                            Level: <span className="font-mono font-bold uppercase text-emerald-400">{data.activityLevel}</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="visits" radius={[6, 6, 0, 0]} maxBarSize={38}>
                  {chartData.map((entry, index) => {
                    let fillColor = accentColor;
                    if (entry.activityLevel === "peak") fillColor = "#f59e0b"; // vibrant amber
                    else if (entry.activityLevel === "high") fillColor = "#6366f1"; // indigo
                    else if (entry.activityLevel === "moderate") fillColor = "#10b981"; // emerald
                    else fillColor = "#94a3b8"; // slate

                    return <Cell key={`cell-${index}`} fill={fillColor} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Device Split Breakdown */}
        {activeTab === "device_split" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 pb-4">
            {deviceData.map((dev, idx) => {
              const DevIcon = dev.icon;
              return (
                <div
                  key={`dev-${idx}`}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col justify-between text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: dev.color }}>
                      <DevIcon className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-black font-mono text-slate-900 dark:text-slate-100">{dev.percentage}%</span>
                  </div>

                  <div className="mt-4">
                    <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 font-sans">{dev.name}</h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                      {dev.visits.toLocaleString()} visits during period
                    </p>
                  </div>

                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${dev.percentage}%`, backgroundColor: dev.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ----------------------------------------------------------------------- */}
      {/* 5. Top Peak Activity Periods Breakdown Panel & AI Insights              */}
      {/* ----------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 border-t border-slate-100 dark:border-slate-800 pt-5">
        {/* Peak Periods List */}
        <div className="lg:col-span-2 bg-slate-50/70 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800 text-left space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 font-sans flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-500" /> Top 3 Peak Activity Periods
            </h4>
            <span className="text-[10px] font-mono font-bold text-slate-400">Ranked by traffic density</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {topPeakPeriods.map((period, rank) => (
              <div
                key={`peak-rank-${rank}`}
                className="bg-white dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs text-left relative overflow-hidden flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-black font-mono flex items-center justify-center">
                    #{rank + 1}
                  </span>
                  <span className="text-[9.5px] font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded">
                    ⚡ {period.visits} visits
                  </span>
                </div>

                <div className="mt-2">
                  <span className="text-xs font-black text-slate-900 dark:text-slate-100 font-mono block truncate">
                    {period.timeLabel}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-sans block mt-0.5">
                    {period.uniqueVisitors} unique visitors
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Operations Recommendation Card */}
        <div className="bg-gradient-to-br from-indigo-950 to-slate-900 text-white p-4 rounded-2xl border border-indigo-500/20 shadow-sm text-left flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-indigo-300 tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Smart Traffic Insight
            </span>
            <p className="text-xs text-indigo-100/90 leading-relaxed mt-2 font-medium">
              Peak activity surges between <strong className="text-white font-mono">19:00 - 22:00</strong>. Scheduling promotional notifications or live chat support during these hours increases conversion by up to <strong className="text-emerald-400 font-mono">34%</strong>.
            </p>
          </div>

          <div className="mt-3 pt-2 border-t border-indigo-800/60 flex items-center justify-between text-[10px] font-mono text-indigo-300">
            <span>Powered by Recharts Engine</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Optimal
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
