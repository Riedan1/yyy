import React, { useState, useMemo } from "react";
import { MerchantStore, Product, Coupon } from "../types";
import { 
  Percent, 
  Tag, 
  Calendar, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  ShoppingBag, 
  Zap, 
  CalendarDays,
  Sparkles,
  RefreshCw,
  Gift,
  HelpCircle
} from "lucide-react";

const GoogleSheetsLogo = ({ className = "w-5 h-5", ...props }) => {
  return (
    <svg viewBox="0 0 36 36" className={className} {...props}>
      <path fill="#107C41" d="M23 1H7C5.35 1 4 2.35 4 4V32C4 33.65 5.35 35 7 35H29C30.65 35 32 33.65 32 32V10L23 1Z" />
      <path fill="#1F9A55" d="M23 1V10H32L23 1Z" />
      <path fill="#FFF" d="M10 13H26V15H10V13ZM10 17H26V19H10V17ZM10 21H26V23H10V21ZM10 25H26V27H10V25Z" />
    </svg>
  );
};

interface DiscountAndCouponDashboardProps {
  darkMode: boolean;
  myStore: MerchantStore;
  setStores: React.Dispatch<React.SetStateAction<MerchantStore[]>>;
  checkPermission?: (
    action: any, 
    actionLabel: string, 
    permissionLabel: string
  ) => boolean;
}

export default function DiscountAndCouponDashboard({ 
  darkMode, 
  myStore, 
  setStores,
  checkPermission
}: DiscountAndCouponDashboardProps) {
  // Form state
  const [code, setCode] = useState("");
  const [type, setType] = useState<"percentage" | "fixed">("percentage");
  const [value, setValue] = useState<number>(10);
  const [targetType, setTargetType] = useState<"all" | "category" | "product">("all");
  const [targetValue, setTargetValue] = useState("");
  const [minPurchase, setMinPurchase] = useState<number>(0);
  const [maxUses, setMaxUses] = useState<number>(100);
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek.toISOString().split("T")[0];
  });

  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  // Get unique categories from store products
  const uniqueCategories = useMemo(() => {
    if (!myStore.products) return [];
    return Array.from(new Set(myStore.products.map((p) => p.category)));
  }, [myStore.products]);

  // Set default target category or product when targetType changes
  React.useEffect(() => {
    if (targetType === "category") {
      setTargetValue(uniqueCategories[0] || "");
    } else if (targetType === "product") {
      setTargetValue(myStore.products?.[0]?.id || "");
    } else {
      setTargetValue("");
    }
  }, [targetType, uniqueCategories, myStore.products]);

  // Active coupons list
  const coupons = useMemo(() => {
    return myStore.coupons || [];
  }, [myStore.coupons]);

  // Determine coupon status dynamically based on current date
  const getCouponStatus = (coupon: Coupon): "active" | "scheduled" | "expired" => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(coupon.startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(coupon.endDate);
    end.setHours(23, 59, 59, 999);

    if (today < start) return "scheduled";
    if (today > end) return "expired";
    return "active";
  };

  // Generate random coupon code
  const generateRandomCode = () => {
    const prefixes = ["DZ", "PROMO", "ELBAHIA", "ALGERIA", "CRAFT", "YUME"];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomNum = Math.floor(100 + Math.random() * 900);
    const suffix = type === "percentage" ? `${value}` : `${Math.floor(value / 100)}K`;
    setCode(`${randomPrefix}${suffix}_${randomNum}`);
  };

  // Create Coupon submit handler
  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess(false);

    if (checkPermission && !checkPermission("manageDiscounts", "Create Coupon", "Manage Discounts")) return;

    if (!code.trim()) {
      setFormError("Please provide a coupon code.");
      return;
    }

    // Clean code uppercase
    const cleanCode = code.trim().toUpperCase();

    // Check for duplicates
    if (coupons.some((c) => c.code === cleanCode)) {
      setFormError("A coupon with this code already exists.");
      return;
    }

    if (value <= 0) {
      setFormError("Discount value must be greater than zero.");
      return;
    }

    if (type === "percentage" && value > 100) {
      setFormError("Percentage discount cannot exceed 100%.");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setFormError("Start date cannot be after end date.");
      return;
    }

    const newCoupon: Coupon = {
      id: `CPN-${Date.now()}`,
      code: cleanCode,
      type,
      value,
      targetType,
      targetValue: targetType !== "all" ? targetValue : undefined,
      minPurchase: minPurchase > 0 ? minPurchase : undefined,
      startDate,
      endDate,
      status: "active", // overridden dynamically
      usageCount: 0,
      maxUses: maxUses > 0 ? maxUses : undefined
    };

    // Save to the store
    setStores((prevStores) => {
      return prevStores.map((store) => {
        if (store.id === myStore.id) {
          const currentCoupons = store.coupons || [];
          return {
            ...store,
            coupons: [newCoupon, ...currentCoupons]
          };
        }
        return store;
      });
    });

    setFormSuccess(true);
    // Reset code & value
    setCode("");
    setValue(type === "percentage" ? 10 : 500);
    setTimeout(() => setFormSuccess(false), 3000);
  };

  // Delete Coupon
  const handleDeleteCoupon = (couponId: string) => {
    if (checkPermission && !checkPermission("manageDiscounts", "Delete Coupon", "Manage Discounts")) return;

    setStores((prevStores) => {
      return prevStores.map((store) => {
        if (store.id === myStore.id) {
          const currentCoupons = store.coupons || [];
          return {
            ...store,
            coupons: currentCoupons.filter((c) => c.id !== couponId)
          };
        }
        return store;
      });
    });
  };

  // Simulate coupon usage (Order Trigger)
  const simulateCouponUse = (couponId: string) => {
    setStores((prevStores) => {
      return prevStores.map((store) => {
        if (store.id === myStore.id) {
          const currentCoupons = store.coupons || [];
          return {
            ...store,
            coupons: currentCoupons.map((c) => {
              if (c.id === couponId) {
                return {
                  ...c,
                  usageCount: c.usageCount + 1
                };
              }
              return c;
            })
          };
        }
        return store;
      });
    });
  };

  // Calculations for Summary Cards
  const stats = useMemo(() => {
    let activeCount = 0;
    let scheduledCount = 0;
    let expiredCount = 0;
    let totalUses = 0;
    let totalValueSavedDzd = 0;

    coupons.forEach((c) => {
      const status = getCouponStatus(c);
      if (status === "active") activeCount++;
      else if (status === "scheduled") scheduledCount++;
      else if (status === "expired") expiredCount++;

      totalUses += c.usageCount;
      // Estimate discount amount saved
      if (c.type === "fixed") {
        totalValueSavedDzd += c.value * c.usageCount;
      } else {
        // Average product price in store
        const avgPrice = myStore.products && myStore.products.length > 0
          ? myStore.products.reduce((acc, p) => acc + p.price, 0) / myStore.products.length
          : 5000;
        totalValueSavedDzd += Math.round((avgPrice * (c.value / 100)) * c.usageCount);
      }
    });

    return {
      activeCount,
      scheduledCount,
      expiredCount,
      totalUses,
      totalValueSavedDzd
    };
  }, [coupons, myStore.products]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("fr-DZ", { style: "currency", currency: "DZD", maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="flex flex-col gap-6 fade-in text-left">
      {/* Header banner */}
      <div className="bg-gradient-to-r from-amber-950/45 via-yellow-950/35 to-slate-900/45 backdrop-blur-md text-white p-6 rounded-2xl border border-amber-500/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.05),0_8px_32px_0_rgba(0,0,0,0.1)] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Gift className="w-40 h-40 animate-pulse text-amber-400" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider w-fit mb-3">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Promo Engine & Discount Manager
          </div>
          <h2 className="text-xl md:text-2xl font-black font-display tracking-tight text-white">
            Discount and Coupon Management
          </h2>
          <p className="text-xs text-amber-200/90 max-w-2xl mt-1.5 leading-relaxed">
            Boost conversions by engineering flexible promotional codes. Define rules based on cart value, target certain product categories, limit usage limits, and schedule start and end dates with real-time checkout updates.
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl border flex flex-col justify-between ${
          darkMode ? "bg-slate-800/40 border-slate-700/60 text-white" : "bg-white border-slate-200 text-slate-900"
        } shadow-xs`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Campaigns</span>
            <Tag className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black font-mono">{stats.activeCount}</div>
            <p className="text-[9.5px] text-slate-500 mt-1">Live checkout promotions</p>
          </div>
        </div>

        <div className={`p-4 rounded-xl border flex flex-col justify-between ${
          darkMode ? "bg-slate-800/40 border-slate-700/60 text-white" : "bg-white border-slate-200 text-slate-900"
        } shadow-xs`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Scheduled Offers</span>
            <CalendarDays className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black font-mono">{stats.scheduledCount}</div>
            <p className="text-[9.5px] text-slate-500 mt-1">Ready to go live next</p>
          </div>
        </div>

        <div className={`p-4 rounded-xl border flex flex-col justify-between ${
          darkMode ? "bg-slate-800/40 border-slate-700/60 text-white" : "bg-white border-slate-200 text-slate-900"
        } shadow-xs`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Coupons Used</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black font-mono">{stats.totalUses}</div>
            <p className="text-[9.5px] text-slate-500 mt-1">Coupons applied in orders</p>
          </div>
        </div>

        <div className={`p-4 rounded-xl border flex flex-col justify-between ${
          darkMode ? "bg-slate-800/40 border-slate-700/60 text-white" : "bg-white border-slate-200 text-slate-900"
        } shadow-xs`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estimated Saved Value</span>
            <TrendingUp className="w-4 h-4 text-pink-500" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black font-mono text-emerald-500">{formatCurrency(stats.totalValueSavedDzd)}</div>
            <p className="text-[9.5px] text-slate-500 mt-1">Estimated buyer discount value</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Coupon Creation Wizard (5 Cols) */}
        <div className="lg:col-span-5">
          <div className={`p-5 rounded-2xl border ${darkMode ? "bg-slate-800/40 border-slate-700/60" : "bg-white border-slate-200"} shadow-sm`}>
            <div className="flex items-center gap-2 pb-4 mb-4 border-b border-dashed border-slate-200/40">
              <Plus className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-100">
                Create Coupon Offer
              </h3>
            </div>

            <form onSubmit={handleCreateCoupon} className="flex flex-col gap-4 text-xs">
              {formError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-[10.5px]">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {formSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 text-emerald-400 text-[10.5px]">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>Coupon successfully generated and synced!</span>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Coupon Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g., AID_MOUBARAK"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className={`flex-1 px-3 py-2 text-xs font-mono rounded-xl border uppercase tracking-wider focus:ring-1 focus:ring-amber-500 focus:outline-none transition-all ${
                      darkMode ? "bg-slate-900/60 border-slate-700 text-slate-200 placeholder-slate-500" : "bg-slate-50/50 border-slate-200 text-slate-800"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={generateRandomCode}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 rounded-xl font-bold font-mono transition-all flex items-center gap-1 cursor-pointer"
                    title="Generate Random Code"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Auto
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Discount Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => {
                      const newType = e.target.value as "percentage" | "fixed";
                      setType(newType);
                      setValue(newType === "percentage" ? 10 : 500);
                    }}
                    className={`w-full px-3 py-2 text-xs rounded-xl border focus:ring-1 focus:ring-amber-500 focus:outline-none transition-all ${
                      darkMode ? "bg-slate-900/60 border-slate-700 text-slate-200" : "bg-slate-50/50 border-slate-200 text-slate-800"
                    }`}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (DZD)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Discount Value {type === "percentage" ? "(%)" : "(DZD)"}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={type === "percentage" ? "100" : "100000"}
                    value={value}
                    onChange={(e) => setValue(parseInt(e.target.value) || 0)}
                    className={`w-full px-3 py-2 text-xs font-mono rounded-xl border focus:ring-1 focus:ring-amber-500 focus:outline-none transition-all ${
                      darkMode ? "bg-slate-900/60 border-slate-700 text-slate-200" : "bg-slate-50/50 border-slate-200 text-slate-800"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Applies To
                </label>
                <select
                  value={targetType}
                  onChange={(e) => setTargetType(e.target.value as any)}
                  className={`w-full px-3 py-2 text-xs rounded-xl border focus:ring-1 focus:ring-amber-500 focus:outline-none transition-all mb-2.5 ${
                    darkMode ? "bg-slate-900/60 border-slate-700 text-slate-200" : "bg-slate-50/50 border-slate-200 text-slate-800"
                  }`}
                >
                  <option value="all">Entire Storefront</option>
                  {uniqueCategories.length > 0 && <option value="category">Specific Category</option>}
                  {myStore.products?.length > 0 && <option value="product">Specific Product</option>}
                </select>

                {targetType === "category" && uniqueCategories.length > 0 && (
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 mb-1">Select Target Category</label>
                    <select
                      value={targetValue}
                      onChange={(e) => setTargetValue(e.target.value)}
                      className={`w-full px-3 py-2 text-xs rounded-xl border focus:ring-1 focus:ring-amber-500 focus:outline-none transition-all ${
                        darkMode ? "bg-slate-900/60 border-slate-700 text-slate-200" : "bg-slate-50/50 border-slate-200 text-slate-800"
                      }`}
                    >
                      {uniqueCategories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                )}

                {targetType === "product" && myStore.products?.length > 0 && (
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 mb-1">Select Target Product</label>
                    <select
                      value={targetValue}
                      onChange={(e) => setTargetValue(e.target.value)}
                      className={`w-full px-3 py-2 text-xs rounded-xl border focus:ring-1 focus:ring-amber-500 focus:outline-none transition-all ${
                        darkMode ? "bg-slate-900/60 border-slate-700 text-slate-200" : "bg-slate-50/50 border-slate-200 text-slate-800"
                      }`}
                    >
                      {myStore.products.map((prod) => (
                        <option key={prod.id} value={prod.id}>{prod.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Min. Order Value (DZD)
                  </label>
                  <input
                    type="number"
                    placeholder="None"
                    value={minPurchase || ""}
                    onChange={(e) => setMinPurchase(parseInt(e.target.value) || 0)}
                    className={`w-full px-3 py-2 text-xs font-mono rounded-xl border focus:ring-1 focus:ring-amber-500 focus:outline-none transition-all ${
                      darkMode ? "bg-slate-900/60 border-slate-700 text-slate-200 placeholder-slate-500" : "bg-slate-50/50 border-slate-200 text-slate-800"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Usage Limits (Max count)
                  </label>
                  <input
                    type="number"
                    value={maxUses || ""}
                    placeholder="No limit"
                    onChange={(e) => setMaxUses(parseInt(e.target.value) || 0)}
                    className={`w-full px-3 py-2 text-xs font-mono rounded-xl border focus:ring-1 focus:ring-amber-500 focus:outline-none transition-all ${
                      darkMode ? "bg-slate-900/60 border-slate-700 text-slate-200 placeholder-slate-500" : "bg-slate-50/50 border-slate-200 text-slate-800"
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-dashed border-slate-200/40 pt-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-xl border focus:ring-1 focus:ring-amber-500 focus:outline-none transition-all ${
                      darkMode ? "bg-slate-900/60 border-slate-700 text-slate-200" : "bg-slate-50/50 border-slate-200 text-slate-800"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-xl border focus:ring-1 focus:ring-amber-500 focus:outline-none transition-all ${
                      darkMode ? "bg-slate-900/60 border-slate-700 text-slate-200" : "bg-slate-50/50 border-slate-200 text-slate-800"
                    }`}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-3 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Generate Coupon Rule
              </button>
            </form>
          </div>
        </div>

        {/* Coupons List & Simulation (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className={`p-5 rounded-2xl border ${darkMode ? "bg-slate-800/40 border-slate-700/60" : "bg-white border-slate-200"} shadow-sm`}>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-dashed border-slate-200/40">
              <div className="flex items-center gap-2">
                <GoogleSheetsLogo className="w-4 h-4" />
                <div>
                  <h3 className="text-sm font-black text-slate-800 dark:text-slate-100">
                    Active Offers & Schedule
                  </h3>
                  <p className="text-[10px] text-slate-400">Manage rules and simulate user checkouts</p>
                </div>
              </div>
            </div>

            {coupons.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center text-slate-500">
                <Gift className="w-10 h-10 text-slate-400 mb-2.5 animate-pulse" />
                <p className="text-[11px] font-bold">No coupons generated yet.</p>
                <p className="text-[9.5px] text-slate-400 mt-1 max-w-sm leading-relaxed">
                  Fill out the creator wizard to establish customized promotional campaigns with live simulation.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3.5">
                {coupons.map((c) => {
                  const status = getCouponStatus(c);
                  const remainingUses = c.maxUses ? c.maxUses - c.usageCount : "Unlimited";

                  return (
                    <div 
                      key={c.id} 
                      className={`p-3.5 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-all ${
                        darkMode ? "bg-slate-900/60 border-slate-850 hover:bg-slate-850" : "bg-slate-50 border-slate-100 hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-black text-xs text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg uppercase tracking-wider">
                            {c.code}
                          </span>
                          
                          <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded-full ${
                            status === "active" 
                              ? "bg-emerald-500/10 text-emerald-500" 
                              : status === "scheduled" 
                              ? "bg-indigo-500/10 text-indigo-400" 
                              : "bg-red-500/10 text-red-500"
                          }`}>
                            {status === "active" ? "● Active" : status === "scheduled" ? "● Scheduled" : "● Expired"}
                          </span>
                        </div>

                        <div className="mt-2 text-[10.5px] text-slate-500 dark:text-slate-400 flex flex-wrap gap-x-3 gap-y-1">
                          <span className="font-bold text-slate-700 dark:text-slate-300">
                            Discount: {c.type === "percentage" ? `${c.value}% Off` : `${formatCurrency(c.value)} Off`}
                          </span>
                          <span>•</span>
                          <span>
                            Applies to: <span className="font-bold uppercase text-slate-600 dark:text-slate-400">{c.targetType === "all" ? "Whole Store" : c.targetType === "category" ? `Cat: ${c.targetValue}` : `Product ID: ${c.targetValue}`}</span>
                          </span>
                          {c.minPurchase && c.minPurchase > 0 ? (
                            <>
                              <span>•</span>
                              <span>Min Purchase: {formatCurrency(c.minPurchase)}</span>
                            </>
                          ) : null}
                        </div>

                        {/* Schedule Dates */}
                        <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>Timeline: {c.startDate} to {c.endDate}</span>
                          <span className="text-slate-300 dark:text-slate-600">|</span>
                          <span>Uses: <span className="font-mono font-bold text-amber-500">{c.usageCount}</span> / {c.maxUses || "∞"}</span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 shrink-0 w-full sm:w-auto justify-end border-t sm:border-t-0 border-dashed border-slate-200/40 pt-2.5 sm:pt-0">
                        {status === "active" && (
                          <button
                            onClick={() => simulateCouponUse(c.id)}
                            className="px-2.5 py-1.5 rounded-lg border border-indigo-500/20 hover:bg-indigo-500/15 text-[10px] text-indigo-400 font-bold flex items-center gap-1 transition-all cursor-pointer"
                            title="Simulate Customer order applying this Coupon"
                          >
                            <Zap className="w-3 h-3 text-indigo-400 animate-pulse" />
                            Simulate Use
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteCoupon(c.id)}
                          className="p-1.5 text-red-400 hover:text-red-500 hover:bg-red-500/15 rounded-lg transition-all cursor-pointer border border-red-500/20"
                          title="Delete Coupon"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Tips / Info */}
          <div className={`p-4 rounded-xl border flex gap-3 text-xs leading-relaxed ${
            darkMode ? "bg-slate-900/40 text-slate-400 border-slate-700/50" : "bg-slate-50 text-slate-500 border-slate-200"
          }`}>
            <HelpCircle className="w-4.5 h-4.5 text-indigo-500 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-300">How Coupons update checkout:</p>
              <p className="mt-1 text-[11px] text-slate-400">
                Coupons created here are instantly integrated with your store's database. When users browse your store, they can type the active coupon codes in their cart to instantly receive the computed percentage or flat discounts on their final order!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
