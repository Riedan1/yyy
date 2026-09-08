import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { Users, TrendingUp, Sparkles, TrendingDown, ArrowUpRight, Award } from "lucide-react";

interface StoreFollowersTrendChartProps {
  currentFollowersCount: number;
}

interface DataPoint {
  date: Date;
  count: number;
  dailyIncrement: number;
}

export default function StoreFollowersTrendChart({
  currentFollowersCount = 0,
}: StoreFollowersTrendChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [timeframe, setTimeframe] = useState<"30" | "7">("30");
  const [metricType, setMetricType] = useState<"cumulative" | "daily">("cumulative");
  const [dimensions, setDimensions] = useState({ width: 600, height: 260 });
  const [hoveredData, setHoveredData] = useState<DataPoint | null>(null);
  const [analytics, setAnalytics] = useState({
    avgDailyGrowth: 0,
    totalNewFollowers: 0,
    peakGrowthDay: "",
    growthPercentage: 0
  });

  // Generate stable deterministic 30-day timeline ending exactly at currentFollowersCount
  const data: DataPoint[] = React.useMemo(() => {
    const today = new Date();
    const result: DataPoint[] = [];
    
    // Seeded random number generator for stability
    let seed = 42;
    const random = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    let count = Math.max(10, currentFollowersCount);
    
    // Generate backwards from today
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      
      // Step down randomly to build a realistic growth chart
      // The increment represents followers gained that day
      const dailyIncrement = Math.max(
        0,
        Math.floor(random() * 5) + (random() > 0.7 ? 3 : 0) + (i % 7 === 0 ? 2 : 0)
      );
      
      result.unshift({
        date,
        count: count,
        dailyIncrement: dailyIncrement
      });

      // Deduct for the previous day
      count = Math.max(3, count - dailyIncrement);
    }

    // Fix cumulative totals so that they ascend forwards
    let runningCumulative = currentFollowersCount;
    // Walk backward to rebuild cumulative history ending exactly at currentFollowersCount
    for (let i = 29; i >= 0; i--) {
      result[i].count = runningCumulative;
      runningCumulative = Math.max(3, runningCumulative - result[i].dailyIncrement);
    }

    return result;
  }, [currentFollowersCount]);

  // Filter based on timeframe selection (7 or 30 days)
  const filteredData = React.useMemo(() => {
    const daysToKeep = timeframe === "30" ? 30 : 7;
    return data.slice(30 - daysToKeep);
  }, [data, timeframe]);

  // Calculate high-fidelity stats for the metrics pane
  useEffect(() => {
    if (filteredData.length < 2) return;
    
    const increments = filteredData.map(d => d.dailyIncrement);
    const totalNew = increments.reduce((a, b) => a + b, 0);
    const avgGrowth = totalNew / filteredData.length;
    
    // Find peak growth day
    let peakVal = -1;
    let peakDateObj = filteredData[0].date;
    filteredData.forEach(d => {
      if (d.dailyIncrement > peakVal) {
        peakVal = d.dailyIncrement;
        peakDateObj = d.date;
      }
    });

    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
    const peakDayFormatted = peakDateObj.toLocaleDateString("en-US", options);
    
    const startCount = filteredData[0].count - filteredData[0].dailyIncrement;
    const growthPercent = startCount > 0 ? (totalNew / startCount) * 100 : 100;

    setAnalytics({
      avgDailyGrowth: parseFloat(avgGrowth.toFixed(1)),
      totalNewFollowers: totalNew,
      peakGrowthDay: `${peakDayFormatted} (+${peakVal})`,
      growthPercentage: parseFloat(growthPercent.toFixed(1))
    });
  }, [filteredData]);

  // Handle ResizeObserver responsive scale
  useEffect(() => {
    if (!containerRef.current) return;
    
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width } = entries[0].contentRect;
      // Maintain proper sizing bounds
      setDimensions({
        width: Math.max(280, width),
        height: 240
      });
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Primary D3.js render call
  useEffect(() => {
    if (!svgRef.current || filteredData.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous layouts gracefully

    const width = dimensions.width;
    const height = dimensions.height;
    
    const margin = { top: 20, right: 30, bottom: 35, left: 45 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Define main viewport element group
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Define scale functions
    const dates = filteredData.map(d => d.date);
    const dateExtent = d3.extent(dates) as [Date, Date];
    const xScale = d3.scaleTime()
      .domain(dateExtent)
      .range([0, innerWidth]);

    const yValue = (d: DataPoint) => metricType === "cumulative" ? d.count : d.dailyIncrement;
    const yMax = d3.max(filteredData, yValue) || 10;
    const yMin = metricType === "cumulative" ? Math.max(0, (d3.min(filteredData, yValue) || 0) - 2) : 0;

    const yScale = d3.scaleLinear()
      .domain([yMin, yMax * 1.05]) // Leave headroom for elegance
      .nice()
      .range([innerHeight, 0]);

    // Create custom linear gradient for area overlay
    const gradientId = "followers-chart-gradient-" + timeframe + "-" + metricType;
    const gradient = svg.append("defs")
      .append("linearGradient")
      .attr("id", gradientId)
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", metricType === "cumulative" ? "#6366f1" : "#10b981") // indigo vs emerald
      .attr("stop-opacity", 0.28);

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", metricType === "cumulative" ? "#6366f1" : "#10b981")
      .attr("stop-opacity", 0.0);

    // Grid lines - subtle dashboard backgrounds
    const yGrid = d3.axisLeft(yScale)
      .tickSize(-innerWidth)
      .tickFormat(() => "")
      .ticks(5);

    g.append("g")
      .attr("class", "grid-axis-indicator")
      .call(yGrid)
      .call(g => g.select(".domain").remove())
      .selectAll("line")
      .attr("stroke", "#f1f5f9") // light background grey
      .attr("stroke-dasharray", "3,3");

    // X-Axis render
    const formatTime = d3.timeFormat(timeframe === "7" ? "%a %b %d" : "%b %d");
    const xAxis = d3.axisBottom<Date>(xScale)
      .ticks(timeframe === "30" ? 6 : 7)
      .tickFormat(formatTime);

    const xAxisGroup = g.append("g")
      .attr("class", "x-axis-group")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(xAxis);

    xAxisGroup.select(".domain")
      .attr("stroke", "#e2e8f0")
      .attr("stroke-width", 1.5);

    xAxisGroup.selectAll("text")
      .attr("fill", "#64748b")
      .attr("font-size", "10px")
      .attr("font-family", "sans-serif")
      .attr("dy", "10px");

    xAxisGroup.selectAll("line")
      .attr("stroke", "#cbd5e1");

    // Y-Axis render
    const yAxis = d3.axisLeft(yScale)
      .ticks(5)
      .tickFormat(d3.format("d"));

    const yAxisGroup = g.append("g")
      .attr("class", "y-axis-group")
      .call(yAxis);

    yAxisGroup.select(".domain").remove(); // Remove solid y vertical domain border line

    yAxisGroup.selectAll("text")
      .attr("fill", "#64748b")
      .attr("font-size", "10px")
      .attr("font-family", "monospace")
      .attr("dx", "-4px");

    yAxisGroup.selectAll("line")
      .attr("stroke", "#f1f5f9");

    // Curve functions
    const areaGenerator = d3.area<DataPoint>()
      .x(d => xScale(d.date))
      .y0(innerHeight)
      .y1(d => yScale(yValue(d)))
      .curve(d3.curveMonotoneX);

    const lineGenerator = d3.line<DataPoint>()
      .x(d => xScale(d.date))
      .y(d => yScale(yValue(d)))
      .curve(d3.curveMonotoneX);

    // Draw the gradient Area
    g.append("path")
      .datum(filteredData)
      .attr("class", "followers-trend-area")
      .attr("d", areaGenerator)
      .attr("fill", `url(#${gradientId})`);

    // Draw the Line Path with smooth entry transition
    const strokeColor = metricType === "cumulative" ? "#4f46e5" : "#059669"; // indigo-600 vs emerald-600
    const pathElement = g.append("path")
      .datum(filteredData)
      .attr("class", "followers-trend-stroke")
      .attr("d", lineGenerator)
      .attr("fill", "none")
      .attr("stroke", strokeColor)
      .attr("stroke-width", 2.5)
      .attr("stroke-linecap", "round");

    // Add path animation
    const totalLength = pathElement.node()?.getTotalLength() || 0;
    pathElement
      .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(800)
      .ease(d3.easeSinOut)
      .attr("stroke-dashoffset", 0);

    // Interactive tooltip tracker overlay
    const focusGroup = g.append("g")
      .style("display", "none");

    const verticalLine = focusGroup.append("line")
      .attr("stroke", strokeColor)
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "4,4")
      .attr("y1", 0)
      .attr("y2", innerHeight);

    const hoverCircleOuter = focusGroup.append("circle")
      .attr("r", 7)
      .attr("fill", strokeColor)
      .attr("fill-opacity", 0.22);

    const hoverCircleInner = focusGroup.append("circle")
      .attr("r", 4.5)
      .attr("fill", strokeColor)
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 2);

    // Transparent mouse overlay to capture hover events responsive
    svg.append("rect")
      .attr("width", innerWidth)
      .attr("height", innerHeight)
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .on("mouseover", () => focusGroup.style("display", null))
      .on("mouseout", () => {
        focusGroup.style("display", "none");
        setHoveredData(null);
      })
      .on("mousemove", function (event) {
        const mouseX = d3.pointer(event)[0];
        const dateAtMouse = xScale.invert(mouseX);

        // Bisector to find nearest datapoint
        const bisectDate = d3.bisector((d: DataPoint) => d.date).left;
        const index = bisectDate(filteredData, dateAtMouse, 1);
        const d0 = filteredData[index - 1];
        const d1 = filteredData[index];
        
        if (!d0) return;
        const d = !d1 || (dateAtMouse.getTime() - d0.date.getTime() < d1.date.getTime() - dateAtMouse.getTime()) ? d0 : d1;

        const xPos = xScale(d.date);
        const yPos = yScale(yValue(d));

        focusGroup.style("display", null);
        verticalLine.attr("x1", xPos).attr("x2", xPos);
        hoverCircleOuter.attr("cx", xPos).attr("cy", yPos);
        hoverCircleInner.attr("cx", xPos).attr("cy", yPos);

        setHoveredData(d);
      });

  }, [filteredData, dimensions, metricType, timeframe]);

  const activeColorText = metricType === "cumulative" ? "text-indigo-600" : "text-emerald-600";
  const activeBgBadge = metricType === "cumulative" ? "bg-indigo-50 text-indigo-700 border-indigo-100" : "bg-emerald-50 text-emerald-700 border-emerald-100";

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col self-stretch" id="followers-trend-chart-container">
      {/* 1. Header controls panel */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/70 text-left">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg bg-indigo-550 flex items-center justify-center text-white p-0.5">
              <Users className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-xs font-extrabold text-slate-900 tracking-tight font-sans">
              Followers Engagement Trend
            </h4>
          </div>
          <p className="text-[10px] text-slate-450 mt-0.5 font-medium leading-none">
            Interactive D3.js engine illustrating store community loyalty
          </p>
        </div>

        {/* Dashboard control switcher buttons */}
        <div className="flex flex-wrap items-center gap-2 select-none">
          {/* Display Mode */}
          <div className="flex bg-slate-200/60 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setMetricType("cumulative")}
              className={`px-2.5 py-1 text-[9px] font-bold rounded-md transition-all cursor-pointer ${
                metricType === "cumulative"
                  ? "bg-white text-slate-900 shadow-3xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Cumulative
            </button>
            <button
              onClick={() => setMetricType("daily")}
              className={`px-2.5 py-1 text-[9px] font-bold rounded-md transition-all cursor-pointer ${
                metricType === "daily"
                  ? "bg-white text-emerald-750 shadow-3xs"
                  : "text-slate-550 hover:text-slate-900"
              }`}
            >
              Daily gained
            </button>
          </div>

          {/* Timeframe selector */}
          <div className="flex bg-slate-200/60 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setTimeframe("30")}
              className={`px-2 py-1 text-[9px] font-bold rounded-md transition-all cursor-pointer ${
                timeframe === "30"
                  ? "bg-slate-900 text-white shadow-3xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              30D
            </button>
            <button
              onClick={() => setTimeframe("7")}
              className={`px-2 py-1 text-[9px] font-bold rounded-md transition-all cursor-pointer ${
                timeframe === "7"
                  ? "bg-slate-900 text-white shadow-3xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              7D
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Analytics Header Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-b border-slate-100 divide-x divide-slate-100 text-left shrink-0 bg-slate-50/20">
        <div className="p-3">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block font-mono">Total Growth ({timeframe}D)</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-sm font-black text-slate-900 font-mono">+{analytics.totalNewFollowers}</span>
            <span className="text-[9.5px] font-bold text-emerald-600 flex items-center leading-none">
              <ArrowUpRight className="w-3 h-3 text-emerald-500 stroke-[2.5]" />
              {analytics.growthPercentage}%
            </span>
          </div>
        </div>
        <div className="p-3">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block font-mono">Daily Pace</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-sm font-black text-slate-900 font-mono">+{analytics.avgDailyGrowth}</span>
            <span className="text-[9px] text-slate-450 font-semibold font-sans">/ day</span>
          </div>
        </div>
        <div className="p-3">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block font-mono">Peak Day Shift</span>
          <span className="text-xs font-bold text-slate-700 block mt-1 leading-none font-sans truncate pr-1">
            {analytics.peakGrowthDay}
          </span>
        </div>
        <div className="p-3 bg-indigo-50/5">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block font-mono">Community Quality</span>
          <div className="flex items-center gap-1 mt-1">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[10px] text-slate-750 font-bold font-sans">98% Verified Ratio</span>
          </div>
        </div>
      </div>

      {/* 3. D3 Canvas Rendering Frame */}
      <div className="p-4 flex-1 flex flex-col relative min-h-[220px]" ref={containerRef}>
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="mx-auto block overflow-visible select-none"
        ></svg>

        {/* Dynamic Tooltip on Hover */}
        {hoveredData ? (
          <div className="absolute top-4 right-4 bg-slate-900/95 backdrop-blur-md text-white border border-slate-805 px-3 py-2 rounded-xl text-left shadow-md fade-in flex flex-col gap-0.5 pointer-events-none z-10 font-sans">
            <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wide font-mono">
              {hoveredData.date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-sm font-black font-mono">
                {metricType === "cumulative" ? hoveredData.count : hoveredData.dailyIncrement}
              </span>
              <span className="text-[9.5px] font-bold text-indigo-300">
                {metricType === "cumulative" ? "Followers" : "New Today"}
              </span>
            </div>
            {metricType === "cumulative" && hoveredData.dailyIncrement > 0 && (
              <span className="text-[8.5px] text-emerald-400 font-semibold leading-none flex items-center gap-0.5 mt-0.5 font-sans">
                 +{hoveredData.dailyIncrement} on this day
              </span>
            )}
          </div>
        ) : (
          <div className="absolute bottom-5 right-5 pointer-events-none select-none opacity-45 flex items-center gap-1.5 text-[9.5px] font-bold text-slate-450 font-sans">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
            Hover chart area for telemetry tooltips
          </div>
        )}
      </div>
    </div>
  );
}
