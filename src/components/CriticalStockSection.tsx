import React, { useState, useMemo } from "react";
import {
  AlertOctagon,
  AlertTriangle,
  PackageX,
  PackageCheck,
  Plus,
  ArrowRight,
  Sparkles,
  RefreshCw,
  SlidersHorizontal,
  Copy,
  Check,
  Zap,
  TrendingDown,
  ShieldAlert,
  ChevronRight
} from "lucide-react";
import { Product } from "../types";

interface CriticalStockSectionProps {
  products: Product[];
  onQuickRestock: (productId: string, addAmount: number) => void;
  onBulkRestock?: (productIds: string[], addAmount: number) => void;
  onNavigateToProducts: (filter?: string) => void;
  onOpenProductEdit?: (product: Product) => void;
  darkMode?: boolean;
}

export const CriticalStockSection: React.FC<CriticalStockSectionProps> = ({
  products = [],
  onQuickRestock,
  onBulkRestock,
  onNavigateToProducts,
  onOpenProductEdit,
  darkMode = false
}) => {
  const [filterType, setFilterType] = useState<"all" | "out_of_stock" | "urgent" | "warning">("all");
  const [customRestockInputs, setCustomRestockInputs] = useState<Record<string, string>>({});
  const [copiedReport, setCopiedReport] = useState(false);
  const [isBulkRestocking, setIsBulkRestocking] = useState(false);
  const [soundAlertEnabled, setSoundAlertEnabled] = useState(false);

  // Automated inventory filter: products with less than 5 units in stock
  const criticalProducts = useMemo(() => {
    return products.filter((p) => typeof p.stock === "number" && p.stock < 5);
  }, [products]);

  const outOfStockItems = useMemo(() => {
    return criticalProducts.filter((p) => p.stock === 0);
  }, [criticalProducts]);

  const urgentItems = useMemo(() => {
    return criticalProducts.filter((p) => p.stock >= 1 && p.stock <= 2);
  }, [criticalProducts]);

  const warningItems = useMemo(() => {
    return criticalProducts.filter((p) => p.stock >= 3 && p.stock < 5);
  }, [criticalProducts]);

  // Filtered list based on selected filter
  const displayedProducts = useMemo(() => {
    if (filterType === "out_of_stock") return outOfStockItems;
    if (filterType === "urgent") return urgentItems;
    if (filterType === "warning") return warningItems;
    return criticalProducts;
  }, [filterType, criticalProducts, outOfStockItems, urgentItems, warningItems]);

  // Estimated potential revenue at risk (price * units needed to reach 5 units safety level)
  const revenueAtRisk = useMemo(() => {
    return criticalProducts.reduce((acc, p) => {
      const needed = Math.max(0, 5 - p.stock);
      return acc + (p.price || 0) * needed;
    }, 0);
  }, [criticalProducts]);

  // Play gentle alert chime using Web Audio API if requested
  const playAlertChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch {
      // Audio not supported or blocked by browser gesture policy
    }
  };

  const handleCustomRestockSubmit = (productId: string) => {
    const rawVal = customRestockInputs[productId];
    const amount = parseInt(rawVal, 10);
    if (!isNaN(amount) && amount > 0) {
      onQuickRestock(productId, amount);
      setCustomRestockInputs((prev) => ({ ...prev, [productId]: "" }));
    }
  };

  const handleBulkRestockAll = () => {
    if (criticalProducts.length === 0) return;
    setIsBulkRestocking(true);
    const ids = criticalProducts.map((p) => p.id);
    if (onBulkRestock) {
      onBulkRestock(ids, 10);
    } else {
      ids.forEach((id) => onQuickRestock(id, 10));
    }
    setTimeout(() => {
      setIsBulkRestocking(false);
    }, 600);
  };

  const copyCriticalReport = () => {
    if (criticalProducts.length === 0) return;
    const lines = [
      `=== CRITICAL STOCK REPORT (${new Date().toLocaleDateString()}) ===`,
      `Automated alert: ${criticalProducts.length} product(s) with < 5 units in stock:`,
      ...criticalProducts.map(
        (p) => `- ${p.name} (SKU: ${p.id}): ${p.stock} in stock (Price: ${p.price.toLocaleString()} DA) -> Recommended reorder: +${Math.max(10, 15 - p.stock)} units`
      ),
      `Total Estimated Revenue at Risk: ${revenueAtRisk.toLocaleString()} DA`
    ];
    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      setCopiedReport(true);
      setTimeout(() => setCopiedReport(false), 2500);
    });
  };

  return (
    <section
      id="merchant-critical-stock-section"
      className="bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-950/80 rounded-3xl p-5 sm:p-6 shadow-[0_4px_24px_rgba(225,29,72,0.06)] relative overflow-hidden transition-all duration-300"
    >
      {/* Decorative background aura */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-rose-500/5 dark:bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-500/25">
            <AlertOctagon className="w-6 h-6 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                Critical Stock
              </h3>
              
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                Automated Alert • &lt; 5 Units
              </span>

              {criticalProducts.length > 0 && (
                <span className="bg-rose-600 text-white font-mono font-black text-[10px] px-2 py-0.5 rounded-md shadow-2xs">
                  {criticalProducts.length} flagged
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl font-medium">
              Continuous automated monitoring highlights products with less than 5 units remaining to prevent inventory depletion, delivery rejections, and lost COD conversions.
            </p>
          </div>
        </div>

        {/* Global Alert Controls */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto flex-wrap">
          {criticalProducts.length > 0 && (
            <>
              <button
                type="button"
                onClick={handleBulkRestockAll}
                disabled={isBulkRestocking}
                className="px-3.5 py-2 text-xs font-black text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                title="Add 10 units of stock to all critical products"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Restock All (+10)</span>
              </button>

              <button
                type="button"
                onClick={copyCriticalReport}
                className="px-3 py-2 text-xs font-extrabold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                title="Copy Critical Stock summary to clipboard"
              >
                {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span className="hidden sm:inline">{copiedReport ? "Copied!" : "Export List"}</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => {
              const next = !soundAlertEnabled;
              setSoundAlertEnabled(next);
              if (next) playAlertChime();
            }}
            className={`p-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer flex items-center justify-center ${
              soundAlertEnabled
                ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950 dark:border-rose-800 dark:text-rose-400"
                : "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600 dark:bg-slate-800 dark:border-slate-700"
            }`}
            title={soundAlertEnabled ? "Sound alert enabled" : "Enable sound chime for critical alerts"}
          >
            <Zap className={`w-3.5 h-3.5 ${soundAlertEnabled ? "fill-rose-500" : ""}`} />
          </button>
        </div>
      </div>

      {/* Metric Highlights Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 relative z-10">
        <div className="p-3.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 block">
            Critical Items (&lt; 5)
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl font-black font-mono text-rose-700 dark:text-rose-300">
              {criticalProducts.length}
            </span>
            <span className="text-[10px] text-rose-500 font-bold">products</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-red-50/70 dark:bg-red-950/40 border border-red-200/80 dark:border-red-900/60">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-600 dark:text-red-400 block">
            Depleted (0 Units)
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl font-black font-mono text-red-700 dark:text-red-300">
              {outOfStockItems.length}
            </span>
            <span className="text-[10px] text-red-500 font-bold">stockout</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
            Ultra-Low (1–2 Units)
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl font-black font-mono text-amber-700 dark:text-amber-300">
              {urgentItems.length}
            </span>
            <span className="text-[10px] text-amber-600 font-bold">immediate risk</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            Revenue at Risk
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl font-black font-mono text-slate-900 dark:text-white">
              {revenueAtRisk.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500 font-bold">DA</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs if multiple critical products exist */}
      {criticalProducts.length > 0 && (
        <div className="flex items-center gap-1.5 mt-5 overflow-x-auto pb-1 relative z-10">
          {[
            { id: "all", label: "All Critical (< 5)", count: criticalProducts.length },
            { id: "out_of_stock", label: "Out of Stock (0)", count: outOfStockItems.length },
            { id: "urgent", label: "1–2 Units Left", count: urgentItems.length },
            { id: "warning", label: "3–4 Units Left", count: warningItems.length }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterType(tab.id as typeof filterType)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                filterType === tab.id
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xs"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  filterType === tab.id
                    ? "bg-white/20 dark:bg-slate-900/20 text-white dark:text-slate-900"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Critical Stock Products Grid */}
      <div className="mt-5 relative z-10">
        {criticalProducts.length === 0 ? (
          /* Empty / Healthy State */
          <div className="p-8 rounded-2xl bg-gradient-to-br from-emerald-50/60 via-white to-teal-50/40 dark:from-emerald-950/20 dark:via-slate-900 dark:to-teal-950/10 border border-emerald-200/80 dark:border-emerald-900/40 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800 shadow-xs">
              <PackageCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                All Stock Levels Healthy!
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1 font-medium">
                No products currently have less than 5 units in stock. The automated inventory alert watcher is actively tracking all incoming COD orders in real-time.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateToProducts("all")}
              className="mt-1 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-750 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>View Full Inventory Catalog</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : displayedProducts.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400">
            No products matching the selected filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedProducts.map((prod) => {
              const isOut = prod.stock === 0;
              const isUrgent = prod.stock >= 1 && prod.stock <= 2;
              const stockPercentage = Math.min(100, Math.round((prod.stock / 5) * 100));

              return (
                <div
                  key={prod.id}
                  className={`p-4.5 rounded-2xl border transition-all duration-200 flex flex-col justify-between gap-3 relative overflow-hidden group ${
                    isOut
                      ? "bg-rose-50/40 dark:bg-rose-950/20 border-rose-300/80 dark:border-rose-900/60 shadow-xs hover:border-rose-400"
                      : isUrgent
                      ? "bg-red-50/30 dark:bg-red-950/15 border-red-200 dark:border-red-900/50 hover:border-red-300"
                      : "bg-amber-50/30 dark:bg-amber-950/15 border-amber-200 dark:border-amber-900/50 hover:border-amber-300"
                  }`}
                >
                  {/* Top Item Row */}
                  <div className="flex items-start gap-3">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      <img
                        src={prod.imageUrl || "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200"}
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      {isOut && (
                        <div className="absolute inset-0 bg-red-900/40 backdrop-blur-3xs flex items-center justify-center text-white font-mono font-black text-[9px] uppercase">
                          0 Left
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={`text-[9.5px] font-mono font-black uppercase px-2 py-0.5 rounded-full ${
                            isOut
                              ? "bg-rose-600 text-white animate-pulse"
                              : isUrgent
                              ? "bg-red-500 text-white"
                              : "bg-amber-500 text-white"
                          }`}
                        >
                          {isOut ? "🚨 Depleted (0 Units)" : isUrgent ? `⚠️ Critical: ${prod.stock} Left` : `Low Stock: ${prod.stock} Left`}
                        </span>

                        <span className="text-[10px] font-mono text-slate-400">
                          #{prod.id.slice(-6)}
                        </span>
                      </div>

                      <h4 className="text-xs font-black text-slate-900 dark:text-white mt-1.5 truncate" title={prod.name}>
                        {prod.name}
                      </h4>

                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        <span>{prod.category}</span>
                        <span>•</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {prod.price.toLocaleString()} DA
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stock Level Visual Gauge */}
                  <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800 flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-[10.5px] font-mono">
                      <span className="font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                        <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
                        Remaining Units:
                      </span>
                      <span
                        className={`font-black ${
                          isOut ? "text-rose-600" : isUrgent ? "text-red-600" : "text-amber-600"
                        }`}
                      >
                        {prod.stock} / 5 safety threshold
                      </span>
                    </div>

                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          isOut
                            ? "bg-rose-600"
                            : isUrgent
                            ? "bg-red-500"
                            : "bg-amber-500"
                        }`}
                        style={{ width: `${Math.max(8, stockPercentage)}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-[9.5px] text-slate-400 font-medium pt-0.5">
                      <span>{5 - prod.stock} units below safety</span>
                      <span>Stockout Risk: High</span>
                    </div>
                  </div>

                  {/* Restock Actions Bar */}
                  <div className="pt-1 flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="text-[10px] font-bold text-slate-500 font-mono uppercase tracking-wider">
                        Quick Restock:
                      </span>
                      
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onQuickRestock(prod.id, 5)}
                          className="px-2.5 py-1 text-xs font-black bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-lg shadow-3xs cursor-pointer transition-all active:scale-95"
                          title="Add 5 units"
                        >
                          +5
                        </button>
                        <button
                          type="button"
                          onClick={() => onQuickRestock(prod.id, 10)}
                          className="px-2.5 py-1 text-xs font-black bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-lg shadow-3xs cursor-pointer transition-all active:scale-95"
                          title="Add 10 units"
                        >
                          +10
                        </button>
                        <button
                          type="button"
                          onClick={() => onQuickRestock(prod.id, 20)}
                          className="px-2.5 py-1 text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-3xs cursor-pointer transition-all active:scale-95"
                          title="Add 20 units"
                        >
                          +20
                        </button>
                      </div>
                    </div>

                    {/* Custom Restock Input & Catalog Link */}
                    <div className="flex items-center gap-2 pt-1 border-t border-slate-200/50 dark:border-slate-800">
                      <div className="flex items-center gap-1 flex-1">
                        <input
                          type="number"
                          min="1"
                          max="9999"
                          placeholder="Custom qty"
                          value={customRestockInputs[prod.id] || ""}
                          onChange={(e) =>
                            setCustomRestockInputs((prev) => ({
                              ...prev,
                              [prod.id]: e.target.value
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleCustomRestockSubmit(prod.id);
                            }
                          }}
                          className="w-full text-xs font-mono font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleCustomRestockSubmit(prod.id)}
                          className="px-2.5 py-1 text-xs font-black bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer transition-all"
                        >
                          Add
                        </button>
                      </div>

                      {onOpenProductEdit && (
                        <button
                          type="button"
                          onClick={() => onOpenProductEdit(prod)}
                          className="px-2.5 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 rounded-lg transition-colors cursor-pointer shrink-0"
                          title="Edit product details in Catalog"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Automated Watchdog Footer Note */}
      <div className="mt-5 pt-3.5 border-t border-slate-150 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500 dark:text-slate-400 relative z-10">
        <div className="flex items-center gap-1.5 font-medium">
          <ShieldAlert className="w-4 h-4 text-rose-500" />
          <span>Automated Watchdog: Alerts update instantly when items are purchased or restocked.</span>
        </div>

        <button
          type="button"
          onClick={() => onNavigateToProducts("low_stock")}
          className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>Manage in Products Catalog</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
};
