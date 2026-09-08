import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  Phone,
  MessageSquare,
  Copy,
  Check,
  X,
  RefreshCw,
  Navigation,
  Building2,
  User,
  Share2,
  Star,
  Sparkles
} from "lucide-react";
import { Order } from "../types";

interface ShippingTrackingModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus?: (orderId: string, newStatus: "pending" | "shipped" | "delivered") => void;
  merchantLang?: "en" | "ar" | "fr";
}

export const ShippingTrackingModal: React.FC<ShippingTrackingModalProps> = ({
  order,
  isOpen,
  onClose,
  onUpdateStatus,
  merchantLang = "en",
}) => {
  const [copiedTracking, setCopiedTracking] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [simulatedSubStatus, setSimulatedSubStatus] = useState<"hub" | "transit" | "out_for_delivery" | "delivered">("out_for_delivery");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastScanTime, setLastScanTime] = useState<string>("");

  useEffect(() => {
    if (order) {
      if (order.status === "pending") setSimulatedSubStatus("hub");
      else if (order.status === "delivered") setSimulatedSubStatus("delivered");
      else setSimulatedSubStatus("out_for_delivery");

      const now = new Date();
      setLastScanTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    }
  }, [order]);

  const deliveryCompany = order?.deliveryCompany || "Yalidine Express";

  const trackingNumber = useMemo(() => {
    if (order?.trackingCode) return order.trackingCode;
    if (!order) return "DZ-YAL-000000";
    const cleanCompany = deliveryCompany.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 3).toUpperCase();
    const cleanId = order.id.replace(/[^a-zA-Z0-9]/g, "").slice(-6).toUpperCase();
    return `DZ-${cleanCompany}-${cleanId}`;
  }, [order, deliveryCompany]);

  const originWilaya = "16 - Algiers (Central Warehouse)";

  // Calculate step progress percentage
  const currentStep = useMemo(() => {
    if (!order) return 1;
    if (order.status === "delivered" || simulatedSubStatus === "delivered") return 4;
    if (simulatedSubStatus === "out_for_delivery") return 3;
    if (order.status === "shipped" || order.status === "accepted" || simulatedSubStatus === "transit") return 2;
    return 1;
  }, [order, simulatedSubStatus]);

  const stepProgressPercent = useMemo(() => {
    return ((currentStep - 1) / 3) * 100;
  }, [currentStep]);

  // Timeline logs calculation based on order date
  const timelineLogs = useMemo(() => {
    if (!order) return [];
    const baseDate = new Date(order.date);

    const formatTime = (hoursToAdd: number) => {
      const d = new Date(baseDate.getTime() + hoursToAdd * 3600 * 1000);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " - " + d.toLocaleDateString();
    };

    const logs = [
      {
        id: "log_1",
        step: 1,
        title: "Order processed & packaged",
        location: `Merchant store (${order.storeName || "Store hub"})`,
        time: formatTime(0),
        desc: "Package weighted, barcoded and registered for pickup.",
        completed: true,
      },
      {
        id: "log_2",
        step: 2,
        title: `Received at ${deliveryCompany} central hub`,
        location: originWilaya,
        time: formatTime(2.5),
        desc: "Manifest scanned into sorting conveyor line.",
        completed: currentStep >= 2,
      },
      {
        id: "log_3",
        step: 3,
        title: "Inter-wilaya logistics transit",
        location: `Transit expressway -> ${order.shopper.wilaya}`,
        time: formatTime(12),
        desc: "Regional freight container in transit to destination depot.",
        completed: currentStep >= 3,
      },
      {
        id: "log_4",
        step: 4,
        title: "Out for delivery (final mile dispatch)",
        location: `Local depot - ${order.shopper.wilaya}`,
        time: formatTime(20),
        desc: "Assigned to driver Redouane Bendjedid (+213 550 82 91 00).",
        completed: currentStep >= 4,
      },
      {
        id: "log_5",
        step: 5,
        title: "Handed over & COD payment collected",
        location: order.shopper.address,
        time: currentStep === 4 ? formatTime(23.5) : "Pending delivery",
        desc: `Cash on delivery total of ${order.total.toLocaleString()} DZD collected.`,
        completed: currentStep === 4,
      },
    ];

    return logs;
  }, [order, deliveryCompany, originWilaya, currentStep]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastScanTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    }, 700);
  };

  const handleCopyTracking = () => {
    navigator.clipboard.writeText(trackingNumber);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/track?id=${encodeURIComponent(order?.id || "")}&code=${encodeURIComponent(trackingNumber)}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSendWhatsApp = () => {
    if (!order) return;
    const phone = order.shopper.phone.replace(/[^0-9]/g, "");
    const msg = `Hello ${order.shopper.name}, your order ${order.id} shipped with ${deliveryCompany}! Tracking code: ${trackingNumber}. View status here: ${window.location.origin}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  if (!isOpen || !order) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-stone-50 flex flex-col w-screen h-screen overflow-hidden text-left"
        id="shipping-tracking-modal-backdrop"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="bg-white w-full h-full flex flex-col overflow-hidden text-left relative"
          onClick={(e) => e.stopPropagation()}
          id="shipping-tracking-modal-content"
        >
          {/* Header Bar */}
          <div className="bg-stone-50/90 border-b border-stone-200/80 p-3.5 sm:p-5 px-4 sm:px-8 relative shrink-0">
            <div className="max-w-7xl mx-auto flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white border border-stone-200/90 text-stone-700 text-xs font-semibold shadow-3xs">
                    <Truck className="w-3.5 h-3.5 text-stone-600 shrink-0" />
                    <span>{deliveryCompany}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Live GPS synced</span>
                  </span>
                </div>

                <div className="flex flex-wrap items-baseline gap-2">
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                    Shipment tracking
                  </h2>
                  <span className="text-stone-400 font-mono text-xs font-semibold">#{order.id}</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-stone-600">
                  <span className="text-stone-500">Tracking code:</span>
                  <button
                    type="button"
                    onClick={handleCopyTracking}
                    className="font-mono text-slate-900 font-bold bg-white hover:bg-stone-100 border border-stone-200 px-2 py-0.5 rounded-md text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-3xs"
                  >
                    <span>{trackingNumber}</span>
                    {copiedTracking ? (
                      <Check className="w-3 h-3 text-emerald-600 stroke-[2.5]" />
                    ) : (
                      <Copy className="w-3 h-3 text-stone-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Action Buttons & Timestamps */}
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleRefresh}
                    className={`p-1.5 rounded-lg text-stone-500 hover:text-slate-900 hover:bg-stone-200/60 transition-all cursor-pointer ${
                      isRefreshing ? "animate-spin" : ""
                    }`}
                    title="Refresh status"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-1.5 rounded-lg text-stone-500 hover:text-slate-900 hover:bg-stone-200/60 transition-all cursor-pointer"
                  >
                    <X className="w-4.5 h-4.5" />
                  </button>
                </div>

                <div className="text-[11px] text-stone-500 text-right space-y-0.5 hidden sm:block">
                  <div>
                    Last scan: <strong className="text-slate-800 font-medium">{lastScanTime}</strong>
                  </div>
                  <div>
                    Estimated delivery: <strong className="text-emerald-700 font-bold">24–48 hours</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stepper Visual Progress Bar */}
          <div className="bg-white border-b border-stone-200/80 px-4 sm:px-8 py-3.5 shrink-0">
            <div className="max-w-7xl mx-auto space-y-1.5">
              <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-500 flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-stone-600" />
                Live dispatch milestone
              </span>
              <span className="text-[11px] font-bold text-slate-800 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded-md">
                Step {currentStep} of 4
              </span>
            </div>

            {/* Step Track */}
            <div className="relative pt-1 pb-1">
              <div className="absolute top-[18px] left-6 right-6 h-1 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-slate-900 transition-all duration-500"
                  style={{ width: `${stepProgressPercent}%` }}
                />
              </div>

              <div className="grid grid-cols-4 gap-2 text-center relative z-10">
                {/* Step 1 */}
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      currentStep >= 1
                        ? "bg-slate-900 text-white shadow-xs"
                        : "bg-stone-100 text-stone-400 border border-stone-200"
                    }`}
                  >
                    {currentStep > 1 ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : "1"}
                  </div>
                  <span className="text-xs font-bold text-slate-900">Confirmed</span>
                  <span className="text-[10px] text-stone-400 font-medium">Store hub</span>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      currentStep >= 2
                        ? "bg-slate-900 text-white shadow-xs"
                        : "bg-stone-100 text-stone-400 border border-stone-200"
                    }`}
                  >
                    {currentStep > 2 ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : "2"}
                  </div>
                  <span className="text-xs font-bold text-slate-900">In transit</span>
                  <span className="text-[10px] text-stone-400 font-medium">{deliveryCompany}</span>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      currentStep >= 3
                        ? "bg-slate-900 text-white shadow-xs"
                        : "bg-stone-100 text-stone-400 border border-stone-200"
                    }`}
                  >
                    {currentStep > 3 ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : "3"}
                  </div>
                  <span className="text-xs font-bold text-slate-900">Out for delivery</span>
                  <span className="text-[10px] text-stone-400 font-medium">Driver en route</span>
                </div>

                {/* Step 4 */}
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      currentStep >= 4
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-stone-100 text-stone-400 border border-stone-200"
                    }`}
                  >
                    {currentStep >= 4 ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : "4"}
                  </div>
                  <span className="text-xs font-bold text-slate-900">Delivered</span>
                  <span className="text-[10px] text-stone-400 font-medium">COD complete</span>
                </div>
              </div>
            </div>
          </div>
        </div>

          {/* Main 2-Column Content Grid */}
          <div className="p-3.5 sm:p-6 bg-stone-50/40 overflow-hidden flex-1 min-h-0">
            <div className="max-w-7xl mx-auto h-full grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 overflow-hidden flex-1 min-h-0">
              {/* LEFT COLUMN */}
            <div className="flex flex-col gap-3 min-h-0 justify-between">
              {/* Delivery Route Card */}
              <div className="bg-white border border-stone-200/80 rounded-xl p-3.5 space-y-2.5 shadow-3xs">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <span className="text-xs font-bold text-stone-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-600" />
                    Delivery route visualizer
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2 py-0.5 rounded">
                    GPS active
                  </span>
                </div>

                {/* Route Graphic */}
                <div className="relative flex items-center justify-between px-2 py-1">
                  <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-stone-200" />

                  <div className="relative z-10 flex flex-col items-center gap-0.5">
                    <div className="w-8 h-8 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-700">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-stone-700">Algiers hub</span>
                  </div>

                  <div className="relative z-10 bg-slate-900 text-white p-1.5 rounded-full shadow-xs">
                    <Truck className="w-3.5 h-3.5" />
                  </div>

                  <div className="relative z-10 flex flex-col items-center gap-0.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800">
                      {order.shopper.wilaya}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 text-xs text-stone-600 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Target address:</span>
                    <span className="font-semibold text-slate-900 truncate max-w-[200px]">{order.shopper.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Commune / wilaya:</span>
                    <span className="font-medium text-slate-800">{order.shopper.commune}, DZ-{order.shopper.wilayaCode}</span>
                  </div>
                </div>
              </div>

              {/* Audit Scan History */}
              <div className="bg-white border border-stone-200/80 rounded-xl p-3.5 flex-1 flex flex-col justify-between shadow-3xs min-h-0 overflow-hidden">
                <span className="text-xs font-bold text-stone-500 flex items-center gap-1.5 pb-2 border-b border-stone-100">
                  <Clock className="w-3.5 h-3.5 text-stone-600" />
                  Audit scan history
                </span>

                <div className="space-y-2 relative pl-4 pt-2 before:absolute before:left-1.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-stone-200">
                  {timelineLogs.map((log) => (
                    <div key={log.id} className="relative flex items-start justify-between gap-2 text-xs">
                      {/* Indicator Dot */}
                      <div
                        className={`absolute -left-4 top-1 w-3 h-3 rounded-full border bg-white flex items-center justify-center ${
                          log.completed ? "border-emerald-600 bg-emerald-600 text-white" : "border-stone-300"
                        }`}
                      >
                        {log.completed && <Check className="w-2 h-2 stroke-[3]" />}
                      </div>

                      <div className="min-w-0 flex-1 leading-snug">
                        <h5 className={`font-bold text-xs ${log.completed ? "text-slate-900" : "text-stone-400"}`}>
                          {log.title}
                        </h5>
                        <p className="text-[11px] text-stone-500 truncate">{log.desc}</p>
                        <span className="text-[10px] text-stone-400 block font-medium">
                          {log.location}
                        </span>
                      </div>

                      <span className="text-[10px] font-mono text-stone-400 shrink-0 text-right">
                        {log.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="flex flex-col gap-3 min-h-0 justify-between">
              {/* Courier Card */}
              <div className="bg-white border border-stone-200/80 rounded-xl p-3.5 space-y-3 shadow-3xs">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <span className="text-xs font-bold text-stone-500 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-stone-600" />
                    Assigned delivery courier
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2 py-0.5 rounded">
                    On route
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-700 shrink-0 font-bold">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1 text-xs">
                    <h4 className="font-extrabold text-slate-900">Redouane Bendjedid</h4>
                    <p className="text-[11px] text-stone-500">{deliveryCompany} express agent</p>
                    <div className="flex items-center gap-1 text-[10.5px] text-amber-600 font-semibold mt-0.5">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>4.9 driver rating</span>
                      <span className="text-stone-300">•</span>
                      <span className="text-stone-500">Vehicle [16-49204-16]</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href="tel:+213550829100"
                    className="h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call driver</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleSendWhatsApp}
                    className="h-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>

              {/* Recipient Details Card */}
              <div className="bg-white border border-stone-200/80 rounded-xl p-3.5 space-y-2 shadow-3xs text-xs">
                <span className="text-xs font-bold text-stone-500 block pb-1.5 border-b border-stone-100">
                  Recipient details
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-stone-600">
                  <div className="flex justify-between sm:justify-start sm:gap-2">
                    <span className="text-stone-400">Customer name:</span>
                    <strong className="text-slate-900 font-bold">{order.shopper.name}</strong>
                  </div>
                  <div className="flex justify-between sm:justify-start sm:gap-2">
                    <span className="text-stone-400">Phone number:</span>
                    <span className="font-mono font-medium text-slate-800">{order.shopper.phone}</span>
                  </div>
                  <div className="flex justify-between sm:justify-start sm:gap-2 sm:col-span-2">
                    <span className="text-stone-400">Address:</span>
                    <span className="font-medium text-slate-800">{order.shopper.address}, {order.shopper.commune}</span>
                  </div>
                  <div className="flex justify-between sm:justify-start sm:gap-2 sm:col-span-2">
                    <span className="text-stone-400">Commune / wilaya:</span>
                    <span className="font-semibold text-slate-900">Wilaya {order.shopper.wilayaCode} - {order.shopper.wilaya}</span>
                  </div>
                </div>
              </div>

              {/* Package Value & Items Card */}
              <div className="bg-white border border-stone-200/80 rounded-xl p-3.5 space-y-2 shadow-3xs text-xs">
                <span className="text-xs font-bold text-stone-500 block pb-1.5 border-b border-stone-100">
                  Package value & items
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="font-mono font-black text-slate-900 text-sm">
                    {order.total.toLocaleString()} DZD
                  </span>
                  <span className="text-emerald-700 font-bold text-[10.5px] bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded">
                    COD
                  </span>
                </div>
                <div className="text-stone-500 text-[11px] flex justify-between">
                  <span>Shipping cost:</span>
                  <strong className="font-mono text-slate-800">{order.shippingCost || 0} DA</strong>
                </div>
                <div className="text-stone-500 text-[11px] truncate pt-0.5 border-t border-stone-100">
                  Items: <span className="text-slate-800 font-medium">{order.items.map(i => `${i.name} (${i.quantity}x)`).join(", ")}</span>
                </div>
              </div>

              {/* Merchant Quick Status Switch (If update handler provided) */}
              {onUpdateStatus && (
                <div className="bg-stone-100/80 border border-stone-200/80 p-2.5 rounded-xl flex items-center justify-between gap-2 text-xs">
                  <span className="font-bold text-stone-700 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-stone-600" />
                    Status:
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        onUpdateStatus(order.id, "pending");
                        setSimulatedSubStatus("hub");
                      }}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer border ${
                        order.status === "pending"
                          ? "bg-amber-600 text-white border-amber-600"
                          : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
                      }`}
                    >
                      Pending
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onUpdateStatus(order.id, "shipped");
                        setSimulatedSubStatus("out_for_delivery");
                      }}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer border ${
                        order.status === "shipped" || order.status === "accepted"
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
                      }`}
                    >
                      Shipped
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onUpdateStatus(order.id, "delivered");
                        setSimulatedSubStatus("delivered");
                      }}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer border ${
                        order.status === "delivered"
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
                      }`}
                    >
                      Delivered
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

          {/* Bottom Action Bar */}
          <div className="bg-stone-50 border-t border-stone-200/80 px-4 sm:px-8 py-3 shrink-0">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3.5 py-1.5 rounded-lg bg-white border border-stone-200 hover:bg-stone-100 text-slate-800 text-xs font-bold transition-all shadow-3xs flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-stone-600" />
                <span>{copiedLink ? "Link copied!" : "Copy tracking share link"}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer"
              >
                Done / close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

