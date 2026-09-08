import React, { useState, useMemo } from "react";
import { Order, MerchantStore, TeamMember } from "../types";
import { ShippingTrackingModal } from "./ShippingTrackingModal";
import {
  Package,
  Sparkles,
  RefreshCw,
  CheckCircle,
  Clock,
  Truck,
  ShieldCheck,
  Search,
  Filter,
  Calendar,
  ChevronDown,
  Table,
  Grid,
  ExternalLink,
  Download,
  Phone,
  MessageSquare,
  AlertCircle,
  FileText,
  Settings,
  BarChart2,
  MapPin,
  User,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  Eye,
  Check,
  X,
  RotateCcw,
  Copy,
  Building2,
  Send,
  Tag,
  Users,
  Zap,
  Printer,
  Link,
  LogOut,
  ChevronRight,
  TrendingUp,
  CreditCard,
  DollarSign,
  Activity,
  Award,
  HelpCircle,
  Building
} from "lucide-react";

const GoogleSheetsLogo = ({ className = "w-5 h-5", ...props }: { className?: string; [key: string]: any }) => {
  return (
    <svg viewBox="0 0 36 36" className={className} {...props}>
      <path fill="#107C41" d="M23 1H7C5.35 1 4 2.35 4 4V32C4 33.65 5.35 35 7 35H29C30.65 35 32 33.65 32 32V10L23 1Z" />
      <path fill="#1F9A55" d="M23 1V10H32L23 1Z" />
      <path fill="#FFF" d="M10 13H26V15H10V13ZM10 17H26V19H10V17ZM10 21H26V23H10V21ZM10 25H26V27H10V25Z" />
    </svg>
  );
};

export interface OrdersModuleProps {
  myStore: MerchantStore;
  orders: Order[];
  setOrders?: React.Dispatch<React.SetStateAction<Order[]>>;
  stores: MerchantStore[];
  merchantLang: "en" | "fr" | "ar";
  darkMode: boolean;
  currentSlideColor?: string;
  setMerchantSubTab: (tab: string) => void;
  setMerchantFeedbackMessage?: (msg: string) => void;
  
  // Google Sheets Props
  googleUser?: any;
  handleConnectGoogleSheets: () => void;
  handleForceManualSync: () => void;
  handleDisconnectGoogleSheets: () => void;
  isSyncingSheets: boolean;
  autoSyncEnabled: boolean;
  setAutoSyncEnabled: (val: boolean) => void;
  sheetsSpreadsheetId: string;
  sheetsFeedback: string;
  showManualInput: boolean;
  setShowManualInput: (val: boolean) => void;
  manualSheetInput: string;
  setManualSheetInput: (val: string) => void;
  handleManualLinkSheets: (e: React.FormEvent) => void;
  
  // Simulation trigger
  handleSimulateOrder: () => void;
}

const CARRIERS = [
  { id: "yalidine", name: "Yalidine Express", color: "bg-red-500", prefix: "YAL" },
  { id: "zr_express", name: "ZR Express", color: "bg-emerald-600", prefix: "ZRX" },
  { id: "kazitour", name: "Kazitour Logistics", color: "bg-amber-500", prefix: "KAZ" },
  { id: "mayestro", name: "Mayestro Delivery", color: "bg-purple-600", prefix: "MAY" },
  { id: "nord_sud", name: "Nord & Sud Express", color: "bg-blue-600", prefix: "NSE" },
  { id: "ems", name: "EMS Algeria Post", color: "bg-sky-500", prefix: "EMS" },
];

export default function OrdersModule({
  myStore,
  orders,
  setOrders,
  stores,
  merchantLang,
  darkMode,
  currentSlideColor = "#4f46e5",
  setMerchantSubTab,
  setMerchantFeedbackMessage,
  googleUser,
  handleConnectGoogleSheets,
  handleForceManualSync,
  handleDisconnectGoogleSheets,
  isSyncingSheets,
  autoSyncEnabled,
  setAutoSyncEnabled,
  sheetsSpreadsheetId,
  sheetsFeedback,
  showManualInput,
  setShowManualInput,
  manualSheetInput,
  setManualSheetInput,
  handleManualLinkSheets,
  handleSimulateOrder,
}: OrdersModuleProps) {

  // --- Determine Effective Orders Mode Policy ---
  // 1. Store Specific Override (myStore.ordersMode)
  // 2. Yumi Admin Plan Rules (from localStorage)
  // 3. Yumi Admin Global Default (from localStorage)
  const globalOrdersMode = (localStorage.getItem("yumi_admin_global_orders_mode") as "classic" | "advanced" | "both") || "both";
  const planOrdersModeRaw = localStorage.getItem("yumi_admin_plan_orders_mode");
  const planOrdersModeMap = planOrdersModeRaw ? JSON.parse(planOrdersModeRaw) : { Basic: "classic", Pro: "both", "Pro Plus": "both", Premium: "both" };
  const storePlan = myStore.subscriptionTier || myStore.premiumTier || "Basic";
  const planMode = planOrdersModeMap[storePlan] || "both";

  const effectiveOrdersMode: "classic" | "advanced" | "both" = myStore.ordersMode || planMode || globalOrdersMode || "both";

  // Active view mode state (saved in localStorage per store)
  const [activeViewMode, setActiveViewMode] = useState<"classic" | "advanced">(() => {
    const saved = localStorage.getItem(`yumi_orders_active_mode_${myStore.id}`);
    if (saved === "classic" || saved === "advanced") return saved;
    return effectiveOrdersMode === "advanced" ? "advanced" : "classic";
  });

  const currentMode = effectiveOrdersMode === "both" ? activeViewMode : effectiveOrdersMode;

  const handleToggleMode = (mode: "classic" | "advanced") => {
    setActiveViewMode(mode);
    localStorage.setItem(`yumi_orders_active_mode_${myStore.id}`, mode);
  };

  // Active workspace sub-tab (for Advanced Mode or full navigation)
  const [activeTab, setActiveTab] = useState<
    "all" | "pipeline" | "lines" | "analytics" | "deliveries" | "customers" | "returns" | "suppliers" | "marketing" | "overview"
  >("all");

  // Yumi Admin Mode Control Overrides
  const [adminGlobalMode, setAdminGlobalMode] = useState<"classic" | "advanced" | "both">(globalOrdersMode);
  const [adminPlanModes, setAdminPlanModes] = useState<Record<string, string>>(planOrdersModeMap);
  const [adminStoreOverride, setAdminStoreOverride] = useState<string>(myStore.ordersMode || "both");

  const saveAdminSettings = () => {
    localStorage.setItem("yumi_admin_global_orders_mode", adminGlobalMode);
    localStorage.setItem("yumi_admin_plan_orders_mode", JSON.stringify(adminPlanModes));
    if (setOrders) {
      // update current store object if setOrders or store props allow
    }
    localStorage.setItem(`yumi_orders_mode_store_${myStore.id}`, adminStoreOverride);
    setShowSettingsModal(false);
    if (setMerchantFeedbackMessage) {
      setMerchantFeedbackMessage(
        merchantLang === "ar"
          ? "تم حفظ سياسات وإعدادات موديل الطلبيات بنجاح!"
          : "Orders module mode policies saved successfully!"
      );
    }
  };

  // --- Filtering & Search States ---
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [carrierFilter, setCarrierFilter] = useState<string>("all");
  const [wilayaFilter, setWilayaFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Layout View Mode (Table vs Cards)
  const [layoutView, setLayoutView] = useState<"table" | "cards">("table");

  // Selection & Batch Actions
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  
  // Modals state
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [printingLabelOrder, setPrintingLabelOrder] = useState<Order | null>(null);
  const [trackingModalOrder, setTrackingModalOrder] = useState<Order | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showBatchLabelModal, setShowBatchLabelModal] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 12;

  // Filter store orders
  const storeOrders = useMemo(() => {
    return (orders || []).filter((o) => o.storeId === myStore.id);
  }, [orders, myStore.id]);

  // Derived Category Helper
  const getOrderItemCategory = (itemId: string): string => {
    const activeProduct = myStore.products?.find((p) => p.id === itemId);
    if (activeProduct) return activeProduct.category;
    for (const st of stores) {
      const prod = st.products?.find((item) => item.id === itemId);
      if (prod) return prod.category;
    }
    return "Crafts";
  };

  // Filtered Orders calculation
  const filteredOrders = useMemo(() => {
    return storeOrders.filter((o) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          o.id.toLowerCase().includes(q) ||
          o.shopper.name.toLowerCase().includes(q) ||
          o.shopper.phone.includes(q) ||
          o.shopper.wilaya.toLowerCase().includes(q) ||
          o.shopper.commune.toLowerCase().includes(q) ||
          (o.trackingCode && o.trackingCode.toLowerCase().includes(q));
        if (!matchesSearch) return false;
      }

      // Status Filter
      if (statusFilter !== "all" && o.status !== statusFilter) return false;

      // Category Filter
      if (categoryFilter !== "all") {
        const hasCategory = o.items.some(
          (it) => getOrderItemCategory(it.id).toLowerCase() === categoryFilter.toLowerCase()
        );
        if (!hasCategory) return false;
      }

      // Carrier Filter
      if (carrierFilter !== "all") {
        const ordCarrier = o.deliveryCompany || "yalidine";
        if (ordCarrier.toLowerCase() !== carrierFilter.toLowerCase()) return false;
      }

      // Wilaya Filter
      if (wilayaFilter !== "all") {
        if (o.shopper.wilaya.toLowerCase() !== wilayaFilter.toLowerCase() && o.shopper.wilayaCode !== wilayaFilter) {
          return false;
        }
      }

      // Payment Filter
      if (paymentFilter !== "all") {
        if (o.paymentMethod !== paymentFilter) return false;
      }

      // Date Range
      if (startDate) {
        const orderTime = new Date(o.date).getTime();
        const startTime = new Date(startDate + "T00:00:00").getTime();
        if (orderTime < startTime) return false;
      }
      if (endDate) {
        const orderTime = new Date(o.date).getTime();
        const endTime = new Date(endDate + "T23:59:59").getTime();
        if (orderTime > endTime) return false;
      }

      return true;
    });
  }, [storeOrders, searchQuery, statusFilter, categoryFilter, carrierFilter, wilayaFilter, paymentFilter, startDate, endDate]);

  // Pagination bounds
  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, currentPage, pageSize]);

  // Key Metrics
  const totalOrdersCount = storeOrders.length;
  const pendingCount = storeOrders.filter((o) => o.status === "pending").length;
  const acceptedCount = storeOrders.filter((o) => o.status === "accepted").length;
  const shippedCount = storeOrders.filter((o) => o.status === "shipped").length;
  const deliveredCount = storeOrders.filter((o) => o.status === "delivered").length;
  const returnCount = storeOrders.filter((o) => o.returnRequested).length;

  const totalRevenue = storeOrders
    .filter((o) => o.status === "delivered" || o.status === "shipped" || o.status === "accepted")
    .reduce((acc, o) => acc + o.total, 0);

  const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / (deliveredCount + acceptedCount + shippedCount || 1)) : 0;
  const deliverySuccessRate = totalOrdersCount > 0 ? Math.round((deliveredCount / totalOrdersCount) * 100) : 100;
  const returnRate = totalOrdersCount > 0 ? Math.round((returnCount / totalOrdersCount) * 100) : 0;

  // Regional Wilaya Heat Distribution
  const wilayaDistribution = useMemo(() => {
    const map: Record<string, { count: number; total: number; wilayaName: string }> = {};
    storeOrders.forEach((o) => {
      const code = o.shopper.wilayaCode || "16";
      const name = o.shopper.wilaya || "Alger";
      if (!map[code]) map[code] = { count: 0, total: 0, wilayaName: name };
      map[code].count += 1;
      map[code].total += o.total;
    });
    return Object.entries(map)
      .map(([code, val]) => ({ code, ...val }))
      .sort((a, b) => b.count - a.count);
  }, [storeOrders]);

  // Customer Intelligence Rankings (LTV Leaderboard)
  const customerLTVList = useMemo(() => {
    const map: Record<string, { name: string; phone: string; email: string; commune: string; wilaya: string; count: number; ltv: number; type: "VIP / مميز" | "Returning / متكرر" | "New / جديد"; orders: string[] }> = {};
    storeOrders.forEach((o) => {
      const phone = o.shopper.phone || "unknown";
      if (!map[phone]) {
        map[phone] = {
          name: o.shopper.name,
          phone: o.shopper.phone,
          email: o.shopper.email || `${o.shopper.name.toLowerCase().replace(/\s+/g, ".")}@email.dz`,
          commune: o.shopper.commune || "Alger Centre",
          wilaya: o.shopper.wilaya || "Alger",
          count: 0,
          ltv: 0,
          type: "New / جديد",
          orders: [],
        };
      }
      map[phone].count += 1;
      map[phone].ltv += o.total;
      map[phone].orders.push(o.id);
      if (map[phone].count >= 3 || map[phone].ltv > 15000) {
        map[phone].type = "VIP / مميز";
      } else if (map[phone].count > 1) {
        map[phone].type = "Returning / متكرر";
      }
    });
    return Object.values(map).sort((a, b) => b.ltv - a.ltv);
  }, [storeOrders]);

  // Derived Order Lines list
  const orderLinesList = useMemo(() => {
    const lines: Array<{
      id: string;
      lineTitle: string;
      lineTotal: number;
      orderId: string;
      productName: string;
      quantity: number;
      unitPrice: number;
    }> = [];
    storeOrders.forEach((o) => {
      o.items.forEach((item, idx) => {
        lines.push({
          id: `CMD-${o.id.replace(/[^0-9]/g, "") || "101"}-${item.name.split(" ")[0]}`,
          lineTitle: `CMD-${o.id} – ${item.name}`,
          lineTotal: item.quantity * item.price,
          orderId: `CMD-${o.id}`,
          productName: item.name,
          quantity: item.quantity,
          unitPrice: item.price,
        });
      });
    });
    return lines;
  }, [storeOrders]);

  // Derived Deliveries list
  const deliveriesList = useMemo(() => {
    return storeOrders.map((o, idx) => ({
      id: `DLV-2026-0${14 - (idx % 10)}`,
      carrier: CARRIERS.find((c) => c.id === (o.deliveryCompany || "yalidine"))?.name || "Yalidine Express",
      carrierId: o.deliveryCompany || "yalidine",
      fee: o.shippingCost || 600,
      type: idx % 2 === 0 ? "Home / للمنزل" : "Stop Desk / مكتب الاستلام",
      orderId: `CMD-${o.id}`,
      shipDate: o.date,
      status: o.status,
    }));
  }, [storeOrders]);

  // Derived Returns list
  const returnsList = useMemo(() => {
    const sampleReasons = ["Changed Mind / تغيير رأي", "Wrong Size / مقاس خاطئ", "Damaged Item / منتج متضرر"];
    const sampleStatuses = ["Approved / مقبول", "Refunded / تم إرجاع المبلغ", "Requested / مطلوب"];
    return storeOrders.slice(0, 4).map((o, idx) => ({
      id: `RET-2026-00${idx + 1}`,
      date: o.date,
      orderId: `CMD-${o.id}`,
      reason: sampleReasons[idx % sampleReasons.length],
      refundAmount: Math.round(o.total * 0.7),
      status: sampleStatuses[idx % sampleStatuses.length],
    }));
  }, [storeOrders]);

  // Sample Suppliers
  const suppliersList = useMemo(() => [
    { supplier: "Guangzhou Apparel / للملابس", contact: "Li Wei", country: "China / الصين", countryBadge: "bg-rose-500/15 text-rose-800 dark:text-rose-300 border border-rose-500/30", leadTime: 35, notes: "Bulk accessories & jeans", phone: "+86 20 8888 1234" },
    { supplier: "Atelier Alger / ورشة الجزائر", contact: "Karim Belkacem", country: "Algeria / الجزائر", countryBadge: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30", leadTime: 7, notes: "Local workshop, fast restock", phone: "+213 661 23 45 67" },
    { supplier: "Istanbul Textile Co. / للنسيج", contact: "Mehmet Yilmaz", country: "Turkey / تركيا", countryBadge: "bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30", leadTime: 21, notes: "Main supplier for hoodies & jackets", phone: "+90 212 555 0101" },
  ], []);

  // Sample Marketing Campaigns
  const marketingList = useMemo(() => [
    { campaign: "TikTok Hoodies Launch / هودي", budget: 60000, channel: "TikTok Ads / إعلانات تيك توك", channelBadge: "bg-purple-500/15 text-purple-800 dark:text-purple-300 border border-purple-500/30", endDate: "20 June 2026", roas: "2.5x", revenue: 150000 },
    { campaign: "Collection Hiver / مجموعة الشتاء", budget: 120000, channel: "Instagram Ads / إنسغرام", channelBadge: "bg-pink-500/15 text-pink-800 dark:text-pink-300 border border-pink-500/30", endDate: "30 June 2026", roas: "4.5x", revenue: 540000 },
    { campaign: "Soldes Été / تنزيلات الصيف", budget: 80000, channel: "Facebook Ads / فيسبوك", channelBadge: "bg-blue-500/15 text-blue-800 dark:text-blue-300 border border-blue-500/30", endDate: "31 May 2026", roas: "4x", revenue: 320000 },
  ], []);

  // Order Status Updates Handler
  const handleUpdateOrderStatus = (orderId: string, newStatus: "pending" | "accepted" | "shipped" | "delivered") => {
    if (!setOrders) return;
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          // Auto assign tracking code if shipping
          let tracking = o.trackingCode;
          if (newStatus === "shipped" && !tracking) {
            const carrierObj = CARRIERS.find((c) => c.id === (o.deliveryCompany || "yalidine")) || CARRIERS[0];
            tracking = `${carrierObj.prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
          }
          return { ...o, status: newStatus, trackingCode: tracking };
        }
        return o;
      })
    );

    if (setMerchantFeedbackMessage) {
      setMerchantFeedbackMessage(
        merchantLang === "ar"
          ? `تم تحديث حالة الطلبية #${orderId} إلى: ${newStatus}`
          : `Order #${orderId} status updated to ${newStatus.toUpperCase()}`
      );
    }
  };

  // Assign Carrier to Order
  const handleAssignCarrier = (orderId: string, carrierId: string) => {
    if (!setOrders) return;
    const carrierObj = CARRIERS.find((c) => c.id === carrierId) || CARRIERS[0];
    const newTracking = `${carrierObj.prefix}-${Math.floor(100000 + Math.random() * 900000)}`;

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return { ...o, deliveryCompany: carrierId, trackingCode: newTracking };
        }
        return o;
      })
    );

    if (setMerchantFeedbackMessage) {
      setMerchantFeedbackMessage(`Assigned carrier ${carrierObj.name} (Tracking: ${newTracking}) to order #${orderId}`);
    }
  };

  // Toggle Selection
  const allFilteredSelected = filteredOrders.length > 0 && filteredOrders.every((o) => selectedOrderIds.includes(o.id));
  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      const currentFilteredIds = filteredOrders.map((o) => o.id);
      setSelectedOrderIds((prev) => prev.filter((id) => !currentFilteredIds.includes(id)));
    } else {
      const currentFilteredIds = filteredOrders.map((o) => o.id);
      setSelectedOrderIds((prev) => Array.from(new Set([...prev, ...currentFilteredIds])));
    }
  };

  const toggleSelectOrder = (id: string) => {
    setSelectedOrderIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  // Bulk Status Update
  const handleBulkStatusChange = (status: "accepted" | "shipped" | "delivered") => {
    if (selectedOrderIds.length === 0 || !setOrders) return;
    setOrders((prev) =>
      prev.map((o) => {
        if (selectedOrderIds.includes(o.id)) {
          let tracking = o.trackingCode;
          if (status === "shipped" && !tracking) {
            const carrierObj = CARRIERS.find((c) => c.id === (o.deliveryCompany || "yalidine")) || CARRIERS[0];
            tracking = `${carrierObj.prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
          }
          return { ...o, status, trackingCode: tracking };
        }
        return o;
      })
    );
    if (setMerchantFeedbackMessage) {
      setMerchantFeedbackMessage(`Updated ${selectedOrderIds.length} orders to ${status.toUpperCase()}`);
    }
    setSelectedOrderIds([]);
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      "Order ID",
      "Date",
      "Customer Name",
      "Phone",
      "Email",
      "Wilaya",
      "Commune",
      "Address",
      "Items",
      "Total DZD",
      "Shipping Cost",
      "Status",
      "Payment Method",
      "Carrier",
      "Tracking Code"
    ];

    const rows = filteredOrders.map((o) => [
      o.id,
      o.date,
      `"${o.shopper.name.replace(/"/g, '""')}"`,
      o.shopper.phone,
      o.shopper.email || "",
      o.shopper.wilaya,
      o.shopper.commune,
      `"${o.shopper.address.replace(/"/g, '""')}"`,
      `"${o.items.map((i) => `${i.name} (x${i.quantity})`).join("; ")}"`,
      o.total,
      o.shippingCost,
      o.status,
      o.paymentMethod,
      o.deliveryCompany || "yalidine",
      o.trackingCode || ""
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${myStore.subdomain || "yumi_store"}_orders_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (setMerchantFeedbackMessage) {
      setMerchantFeedbackMessage(`Exported ${filteredOrders.length} orders to CSV successfully!`);
    }
  };

  // Localized status labels with high-contrast Yume badges
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1.5 w-fit"><Clock className="w-3.5 h-3.5" /> Pending</span>;
      case "accepted":
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-800 dark:text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5 w-fit"><Check className="w-3.5 h-3.5" /> Confirmed</span>;
      case "shipped":
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-500/15 text-sky-800 dark:text-sky-300 border border-sky-500/30 flex items-center gap-1.5 w-fit"><Truck className="w-3.5 h-3.5" /> In transit</span>;
      case "delivered":
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 w-fit"><CheckCircle className="w-3.5 h-3.5" /> Delivered</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-500/15 text-slate-800 dark:text-slate-200 border border-slate-500/30 w-fit">{status}</span>;
    }
  };

  // WhatsApp Pre-filled Message Generator
  const getWhatsAppLink = (order: Order) => {
    const cleanPhone = order.shopper.phone.replace(/[^0-9]/g, "");
    const formattedPhone = cleanPhone.startsWith("213") ? cleanPhone : cleanPhone.startsWith("0") ? `213${cleanPhone.slice(1)}` : `213${cleanPhone}`;
    const text = encodeURIComponent(
      merchantLang === "ar"
        ? `مرحباً ${order.shopper.name} 👋، نود إعلامكم بأن طلبيتكم رقم #${order.id} من متجر ${myStore.name} هي الآن بحالة [${order.status.toUpperCase()}]. شكراً لثقتكم بنا!`
        : `Bonjour ${order.shopper.name} 👋, votre commande #${order.id} auprès de ${myStore.name} est actuellement [${order.status.toUpperCase()}]. Merci pour votre confiance !`
    );
    return `https://wa.me/${formattedPhone}?text=${text}`;
  };

  return (
    <div className="flex flex-col gap-6 fade-in self-stretch w-full font-sans text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-950 p-4 sm:p-6 rounded-3xl border border-slate-200/70 dark:border-slate-800/80 shadow-2xs" id="yumi-orders-redesign-module">

      {/* HEADER BAR: Mode Indicator, Mode Switcher, Quick Settings & Navigation */}
      <div className={`p-5 sm:p-6 rounded-3xl border shadow-xs relative overflow-hidden transition-all duration-300 text-left ${
        darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200/90 text-slate-900"
      }`}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative z-10">
          
          {/* Title & Subtitle */}
          <div className="space-y-2 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 text-[11px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                <span>{myStore.name}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 text-[11px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>{merchantLang === "ar" ? "توصيل 58 ولاية • COD" : "58 Wilayas COD"}</span>
              </span>

              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-mono font-bold">
                DZD (DA)
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800">
                <BarChart2 className="w-5 h-5" />
              </div>
              <span>{merchantLang === "ar" ? `إدارة الطلبيات والخدمات اللوجستية • ${myStore.name}` : `Orders & Fulfillment Hub • ${myStore.name}`}</span>
            </h2>

            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed font-normal">
              {merchantLang === "ar"
                ? "تسيير طلبيات الزبائن، تتبع شركات التوصيل الجزائرية (Yalidine, ZR Express, Kazitour)، ومزامنة البيانات اللوجستية."
                : "Real-time order pipeline, Algerian courier tracking (Yalidine, ZR Express, Kazitour), and instant revenue metrics."}
            </p>
          </div>

          {/* Right Action Controls */}
          <div className="flex flex-wrap items-center gap-2.5 self-stretch lg:self-auto justify-end">
            {/* Mode Switcher if both modes allowed */}
            {effectiveOrdersMode === "both" && (
              <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => handleToggleMode("classic")}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    activeViewMode === "classic"
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {merchantLang === "ar" ? "لوحة الطلبات" : "Orders Hub"}
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleMode("advanced")}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    activeViewMode === "advanced"
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {merchantLang === "ar" ? "نظام ERP متقدم" : "Advanced ERP"}
                </button>
              </div>
            )}

            {/* Manual Sync / Refresh Button */}
            <button
              type="button"
              onClick={handleForceManualSync}
              disabled={isSyncingSheets}
              title={merchantLang === "ar" ? "تحديث المزامنة الفورية" : "Refresh sync"}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncingSheets ? "animate-spin text-indigo-500" : ""}`} />
            </button>

            {/* Quick Settings Trigger */}
            <button
              type="button"
              onClick={() => setShowSettingsModal(true)}
              title={merchantLang === "ar" ? "إعدادات موديل الطلبيات" : "Orders settings & policies"}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 transition-all cursor-pointer"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

        </div>



        {/* WORKSPACE SUB-TABS NAVIGATION BAR */}
        {currentMode === "advanced" && (
          <div className="mt-4 pt-3.5 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
            {[
              { id: "all", label: merchantLang === "ar" ? "كل الطلبات" : "All orders", icon: Package },
              { id: "pipeline", label: merchantLang === "ar" ? "المسار" : "Pipeline", icon: Activity },
              { id: "lines", label: merchantLang === "ar" ? "سطور الطلب" : "Order lines", icon: Layers },
              { id: "analytics", label: merchantLang === "ar" ? "التحليلات" : "Analytics", icon: BarChart2 },
              { id: "deliveries", label: merchantLang === "ar" ? "التوصيل" : "Deliveries", icon: Truck },
              { id: "customers", label: merchantLang === "ar" ? "العملاء" : "Customers", icon: Users },
              { id: "returns", label: merchantLang === "ar" ? "المرتجعات" : "Returns", icon: RotateCcw },
              { id: "suppliers", label: merchantLang === "ar" ? "الموردون" : "Suppliers", icon: Building },
              { id: "marketing", label: merchantLang === "ar" ? "التسويق" : "Marketing", icon: Sparkles },
              { id: "overview", label: merchantLang === "ar" ? "نظرة عامة" : "ERP overview", icon: HelpCircle },
            ].map((tab) => {
              const active = activeTab === tab.id;
              const IconComp = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer text-xs font-bold ${
                    active
                      ? "bg-indigo-600 text-white border border-indigo-600 shadow-xs"
                      : "bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs"
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ADVANCED MODE ACTIVE SUB-TAB CONTENTS */}
      {currentMode === "advanced" && activeTab === "overview" && (
        <div className="flex flex-col gap-6 animate-fadeIn text-left">
          
          {/* Header Box */}
          <div className="p-6 rounded-3xl bg-indigo-900 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 max-w-3xl space-y-3">
              <span className="px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-bold uppercase tracking-wider font-mono">
                ERP System Guide / دليل نظام إدارة المتجر
              </span>
              <h3 className="text-2xl font-black font-display">What is this? / ما هذا النظام؟</h3>
              <p className="text-sm text-indigo-100 leading-relaxed font-sans">
                This ERP connects every part of an online clothing store — catalog, customers, orders, deliveries, returns, suppliers and marketing — into one linked system. Everything is bilingual (English / العربية) and adapted to how e-commerce really works in Algeria: Cash on Delivery (COD), wilaya-based shipping, and carriers like Yalidine & ZR Express.
              </p>
              <div className="pt-2 text-xs text-indigo-200/90 font-sans border-t border-indigo-800/80">
                يربط هذا النظام كل أجزاء متجرك الإلكتروني - المنتجات، العملاء، الطلبات، التوصيل، المرتجعات، الموردين والتسويق - في نظام واحد مترابط. كل شيء ثنائي اللغة ومكيف مع واقع التجارة الإلكترونية في الجزائر.
              </div>
            </div>
          </div>

          {/* Grid of 8 Modules */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Products / المنتجات", desc: "Full catalog, SKU, sizes, colors, cost & sale price, stock, margin.", color: "border-sky-500/30 bg-sky-500/5", icon: Package },
              { title: "Deliveries / التوصيل", desc: "Carriers (Yalidine, ZR Express...), home vs stop desk, tracking, fees.", color: "border-amber-500/30 bg-amber-500/5", icon: Truck },
              { title: "Customers / العملاء", desc: "Contacts by wilaya & commune, customer type, lifetime value.", color: "border-emerald-500/30 bg-emerald-500/5", icon: Users },
              { title: "Returns / المرتجعات", desc: "Reasons, refund status & amount linked directly to orders.", color: "border-rose-500/30 bg-rose-500/5", icon: RotateCcw },
              { title: "Orders / الطلبيات", desc: "Order workflow, payment method (COD/card), channel, auto-calculated total.", color: "border-indigo-500/30 bg-indigo-500/5", icon: Activity },
              { title: "Order Lines / سطور الطلب", desc: "Product lines per order with quantity x price breakdown.", color: "border-purple-500/30 bg-purple-500/5", icon: Layers },
              { title: "Suppliers / الموردون", desc: "Sourcing, lead times, supplier products & contact details.", color: "border-blue-500/30 bg-blue-500/5", icon: Building },
              { title: "Marketing / التسويق", desc: "Campaigns by channel, budget, revenue & ROAS tracking.", color: "border-pink-500/30 bg-pink-500/5", icon: Sparkles },
            ].map((m, idx) => {
              const IconComp = m.icon;
              return (
                <div key={idx} className={`p-5 rounded-3xl border bg-white dark:bg-slate-900 ${m.color} flex flex-col justify-between`}>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-xs">
                        <IconComp className="w-4 h-4 text-slate-800 dark:text-slate-200" />
                      </span>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">{m.title}</h4>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Start Steps */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Quick Start Guide / البدء السريع</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
              {[
                { step: "1", title: "Add products / أضف منتجاتك", desc: "Set cost & price to auto-calculate margins." },
                { step: "2", title: "Register customers / سجل العملاء", desc: "Store phone & wilaya for fast COD verification." },
                { step: "3", title: "Create an order / أنشئ طلباً", desc: "Add order lines; totals auto-compute with delivery fee." },
                { step: "4", title: "Ship it / قم بالشحن", desc: "Assign Yalidine or ZR Express & track status." },
                { step: "5", title: "Track marketing / تابع التسويق", desc: "Log campaign spend to measure actual ROAS." },
              ].map((s) => (
                <div key={s.step} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center mb-2">
                    {s.step}
                  </span>
                  <h5 className="font-bold text-slate-900 dark:text-white mb-1">{s.title}</h5>
                  <p className="text-[11px] text-slate-500">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PIPELINE KANBAN VIEW */}
      {currentMode === "advanced" && activeTab === "pipeline" && (
        <div className="flex flex-col gap-6 animate-fadeIn text-left">
          
          {/* Kanban Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 overflow-x-auto pb-2">
            {[
              { status: "pending", label: "New / جديد", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
              { status: "accepted", label: "Confirmed / مؤكد", color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20" },
              { status: "preparing", label: "Preparing / تحضير", color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
              { status: "shipped", label: "Shipped / تم الشحن", color: "bg-sky-500/10 text-sky-600 border-sky-500/20" },
              { status: "delivered", label: "Delivered / تسليم", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
              { status: "cancelled", label: "Cancelled / ملغي", color: "bg-rose-500/10 text-rose-600 border-rose-500/20" },
            ].map((col) => {
              const colOrders = storeOrders.filter((o) => {
                if (col.status === "preparing") return o.status === "accepted";
                if (col.status === "cancelled") return o.status === "cancelled";
                return o.status === col.status;
              });

              return (
                <div key={col.status} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col gap-3 min-w-[200px]">
                  <div className={`p-2 rounded-xl border text-xs font-black flex justify-between items-center ${col.color}`}>
                    <span>{col.label}</span>
                    <span className="font-mono bg-white dark:bg-slate-900 px-2 py-0.5 rounded-full text-[10px]">
                      {colOrders.length}
                    </span>
                  </div>

                  <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                    {colOrders.map((ord) => (
                      <div key={ord.id} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 text-xs">
                        <div className="flex justify-between items-start">
                          <span className="font-mono font-bold text-slate-400 text-[10px]">CMD-2026-{ord.id}</span>
                          <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-bold">
                            {ord.channel || "WhatsApp"}
                          </span>
                        </div>
                        <p className="font-black text-slate-900 dark:text-white">{ord.shopper.name}</p>
                        <p className="text-[11px] text-slate-500">{ord.shopper.wilayaCode} - {ord.shopper.wilaya}</p>
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                          <span className="font-mono font-black text-slate-900 dark:text-white">{ord.total.toLocaleString()} DA</span>
                          <button
                            type="button"
                            onClick={() => setViewingOrder(ord)}
                            className="text-[10px] font-bold px-2 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-lg"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    ))}
                    {colOrders.length === 0 && (
                      <div className="p-4 text-center text-slate-400 text-[11px]">No orders in this stage</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Deliveries & Restock Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Active Deliveries Table */}
            <div className="p-5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-3 text-slate-900 dark:text-white">
              <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-500" />
                <span>Active deliveries / التوصيلات الجارية</span>
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200/80 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 text-xs font-bold font-mono">
                      <th className="p-2">Delivery #</th>
                      <th className="p-2">Order #</th>
                      <th className="p-2">Carrier</th>
                      <th className="p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deliveriesList.slice(0, 5).map((d) => (
                      <tr key={d.id} className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-2 font-mono font-bold text-slate-900 dark:text-white">{d.id}</td>
                        <td className="p-2 font-mono text-slate-600 dark:text-slate-300">{d.orderId}</td>
                        <td className="p-2 font-bold text-slate-800 dark:text-slate-200">{d.carrier}</td>
                        <td className="p-2">{getStatusBadge(d.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Restock List Table */}
            <div className="p-5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-3 text-slate-900 dark:text-white">
              <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Package className="w-4 h-4 text-rose-500" />
                <span>Restock list / قائمة إعادة التموين</span>
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200/80 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 text-xs font-bold font-mono">
                      <th className="p-2">Product name</th>
                      <th className="p-2">SKU</th>
                      <th className="p-2">Stock alert</th>
                      <th className="p-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "BrandX Logo Tee / بالشعار", sku: "HOOD-BLK-L", stock: "3 left", level: "Low stock" },
                      { name: "Classic Cotton Hoodie / هودي قطن", sku: "HD-COT-XL", stock: "1 left", level: "Critical" },
                      { name: "Denim Jacket / جاكيت جينز", sku: "JKT-DNM-M", stock: "0 left", level: "Out of stock" },
                    ].map((item, i) => (
                      <tr key={i} className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-2 font-bold text-slate-900 dark:text-white">{item.name}</td>
                        <td className="p-2 font-mono text-slate-600 dark:text-slate-400">{item.sku}</td>
                        <td className="p-2 font-bold text-rose-600 dark:text-rose-400">{item.stock} ({item.level})</td>
                        <td className="p-2">
                          <button type="button" className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[11px] font-bold">
                            Reorder
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ORDER LINES TAB */}
      {currentMode === "advanced" && activeTab === "lines" && (
        <div className="p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-4 text-left animate-fadeIn shadow-xs">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-500" />
              <span>Order lines / سطور الطلب</span>
            </h3>
            <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400">{orderLinesList.length} items listed</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 font-bold font-mono text-xs">
                  <th className="p-3">Line item</th>
                  <th className="p-3">Order #</th>
                  <th className="p-3">Product name</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Unit price</th>
                  <th className="p-3 text-right">Line total (DZD)</th>
                </tr>
              </thead>
              <tbody>
                {orderLinesList.map((line, idx) => (
                  <tr key={idx} className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">{line.lineTitle}</td>
                    <td className="p-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">{line.orderId}</td>
                    <td className="p-3 font-bold text-slate-800 dark:text-slate-200">{line.productName}</td>
                    <td className="p-3 font-mono text-slate-900 dark:text-slate-200">{line.quantity}</td>
                    <td className="p-3 font-mono text-slate-900 dark:text-slate-200">{line.unitPrice.toLocaleString()} DA</td>
                    <td className="p-3 font-mono font-black text-right text-emerald-600 dark:text-emerald-400">{line.lineTotal.toLocaleString()} DA</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CUSTOMERS TAB */}
      {currentMode === "advanced" && activeTab === "customers" && (
        <div className="p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-4 text-left animate-fadeIn shadow-xs">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-500" />
              <span>Customers directory / دليل العملاء</span>
            </h3>
            <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400">{customerLTVList.length} customers</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 font-bold font-mono text-xs">
                  <th className="p-3">Customer name</th>
                  <th className="p-3">Commune & wilaya</th>
                  <th className="p-3">Customer type</th>
                  <th className="p-3">Email & phone</th>
                  <th className="p-3">Orders count</th>
                  <th className="p-3 text-right">Lifetime value (LTV)</th>
                </tr>
              </thead>
              <tbody>
                {customerLTVList.map((cust, idx) => (
                  <tr key={idx} className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3 font-black text-slate-900 dark:text-white">{cust.name}</td>
                    <td className="p-3 text-slate-800 dark:text-slate-200">{cust.commune} – <span className="font-bold">{cust.wilaya}</span></td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        cust.type.includes("VIP") ? "bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30" : "bg-indigo-500/15 text-indigo-800 dark:text-indigo-300 border border-indigo-500/30"
                      }`}>
                        {cust.type}
                      </span>
                    </td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">
                      <div className="font-semibold">{cust.phone}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{cust.email}</div>
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">{cust.count} orders</td>
                    <td className="p-3 font-mono font-black text-right text-emerald-600 dark:text-emerald-400">{cust.ltv.toLocaleString()} DA</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DELIVERIES TAB */}
      {currentMode === "advanced" && activeTab === "deliveries" && (
        <div className="p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-4 text-left animate-fadeIn shadow-xs">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Truck className="w-5 h-5 text-amber-500" />
              <span>Deliveries log / سجل التوصيل</span>
            </h3>
            <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400">{deliveriesList.length} dispatches</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 font-bold font-mono text-xs">
                  <th className="p-3">Delivery #</th>
                  <th className="p-3">Carrier</th>
                  <th className="p-3">Delivery fee</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Order #</th>
                  <th className="p-3">Ship date</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {deliveriesList.map((del, idx) => (
                  <tr key={idx} className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">{del.id}</td>
                    <td className="p-3 font-bold text-slate-800 dark:text-slate-200">{del.carrier}</td>
                    <td className="p-3 font-mono text-slate-900 dark:text-slate-200">{del.fee} DA</td>
                    <td className="p-3"><span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded font-bold">{del.type}</span></td>
                    <td className="p-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">{del.orderId}</td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">{del.shipDate}</td>
                    <td className="p-3">{getStatusBadge(del.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RETURNS TAB */}
      {currentMode === "advanced" && activeTab === "returns" && (
        <div className="p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-4 text-left animate-fadeIn shadow-xs">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-rose-500" />
              <span>Returns & refunds / المرتجعات</span>
            </h3>
            <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400">{returnsList.length} items returned</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 font-bold font-mono text-xs">
                  <th className="p-3">Return #</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Order #</th>
                  <th className="p-3">Reason</th>
                  <th className="p-3">Refund amount</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {returnsList.map((ret, idx) => (
                  <tr key={idx} className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3 font-mono font-bold text-rose-600 dark:text-rose-400">{ret.id}</td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">{ret.date}</td>
                    <td className="p-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">{ret.orderId}</td>
                    <td className="p-3 font-bold text-slate-800 dark:text-slate-200">{ret.reason}</td>
                    <td className="p-3 font-mono font-black text-slate-900 dark:text-white">{ret.refundAmount.toLocaleString()} DA</td>
                    <td className="p-3"><span className="px-2.5 py-1 bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 font-bold rounded-full">{ret.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUPPLIERS TAB */}
      {currentMode === "advanced" && activeTab === "suppliers" && (
        <div className="p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-4 text-left animate-fadeIn shadow-xs">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-500" />
              <span>Suppliers / الموردون</span>
            </h3>
            <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400">{suppliersList.length} active suppliers</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 font-bold font-mono text-xs">
                  <th className="p-3">Supplier name</th>
                  <th className="p-3">Contact person</th>
                  <th className="p-3">Country</th>
                  <th className="p-3">Lead time</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Notes</th>
                </tr>
              </thead>
              <tbody>
                {suppliersList.map((sup, idx) => (
                  <tr key={idx} className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3 font-black text-slate-900 dark:text-white">{sup.supplier}</td>
                    <td className="p-3 font-bold text-slate-800 dark:text-slate-200">{sup.contact}</td>
                    <td className="p-3"><span className={`px-2.5 py-1 rounded-lg font-bold text-xs ${sup.countryBadge}`}>{sup.country}</span></td>
                    <td className="p-3 font-mono font-bold text-slate-900 dark:text-slate-200">{sup.leadTime} days</td>
                    <td className="p-3 font-mono text-slate-700 dark:text-slate-300">{sup.phone}</td>
                    <td className="p-3 text-slate-700 dark:text-slate-300 font-medium">{sup.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MARKETING TAB */}
      {currentMode === "advanced" && activeTab === "marketing" && (
        <div className="p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-4 text-left animate-fadeIn shadow-xs">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <span>Marketing campaigns / التسويق</span>
            </h3>
            <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400">{marketingList.length} campaigns</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 font-bold font-mono text-xs">
                  <th className="p-3">Campaign name</th>
                  <th className="p-3">Channel</th>
                  <th className="p-3">Budget</th>
                  <th className="p-3">End date</th>
                  <th className="p-3">ROAS</th>
                  <th className="p-3 text-right">Revenue generated</th>
                </tr>
              </thead>
              <tbody>
                {marketingList.map((mkt, idx) => (
                  <tr key={idx} className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3 font-black text-slate-900 dark:text-white">{mkt.campaign}</td>
                    <td className="p-3"><span className={`px-2.5 py-1 rounded-lg font-bold text-xs ${mkt.channelBadge}`}>{mkt.channel}</span></td>
                    <td className="p-3 font-mono font-bold text-slate-900 dark:text-slate-200">{mkt.budget.toLocaleString()} DA</td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">{mkt.endDate}</td>
                    <td className="p-3 font-mono font-black text-indigo-600 dark:text-indigo-400">{mkt.roas}</td>
                    <td className="p-3 font-mono font-black text-right text-emerald-600 dark:text-emerald-400">{mkt.revenue.toLocaleString()} DA</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ANALYTICS TAB (Clean Metric Breakdown - No Charts or Curves) */}
      {currentMode === "advanced" && activeTab === "analytics" && (
        <div className="flex flex-col gap-6 animate-fadeIn text-left">
          
          {/* Top KPI Cards (Screenshot Analytics Visual Style) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Total Net Revenue (Dark Hero Card) */}
            <div className="bg-slate-900 dark:bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-xs flex flex-col justify-between relative text-left min-h-[110px]">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-slate-300">Total net revenue</span>
                <span className="p-2 rounded-xl bg-slate-800 text-slate-200 border border-slate-700/60 font-mono font-bold text-xs">
                  DA
                </span>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white">{totalRevenue.toLocaleString()} DA</span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-0.5">+12%</span>
              </div>
            </div>

            {/* Card 2: Total Orders */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs text-left flex flex-col justify-between relative min-h-[110px]">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total orders</span>
                <span className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50">
                  <Package className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white tracking-tight">{totalOrdersCount}</span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Lifetime count</span>
              </div>
            </div>

            {/* Card 3: Average Order Value */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs text-left flex flex-col justify-between relative min-h-[110px]">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Average order value</span>
                <span className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                </span>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400 tracking-tight">{avgOrderValue.toLocaleString()} DA</span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Per transaction</span>
              </div>
            </div>

            {/* Card 4: Total Customers */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs text-left flex flex-col justify-between relative min-h-[110px]">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total customers</span>
                <span className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50">
                  <Users className="w-4 h-4 text-amber-500" />
                </span>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-black font-mono text-amber-500 tracking-tight">{customerLTVList.length}</span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Unique shoppers</span>
              </div>
            </div>
          </div>

          {/* Clean Tabular Analytics - No Charts or Curves */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Sales Performance Summary */}
            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-500" />
                  <span>Sales performance log</span>
                </h4>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Recent periods</span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {[
                  { period: "This week", val: totalRevenue, count: totalOrdersCount, growth: "+12%" },
                  { period: "Last week", val: Math.round(totalRevenue * 0.88), count: Math.max(1, totalOrdersCount - 1), growth: "+8%" },
                  { period: "30-day total", val: Math.round(totalRevenue * 1.4), count: totalOrdersCount + 3, growth: "+15%" },
                ].map((pt, i) => (
                  <div key={i} className="py-3 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">{pt.period}</span>
                      <p className="text-slate-500 text-[11px]">{pt.count} completed orders</p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-sm">{pt.val.toLocaleString()} DA</span>
                      <span className="ml-2 text-emerald-600 dark:text-emerald-400 font-bold">{pt.growth}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sales Channel Share */}
            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-emerald-500" />
                  <span>Sales channel distribution</span>
                </h4>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Share by volume</span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {[
                  { channel: "WhatsApp", pct: "45%", val: Math.round(totalRevenue * 0.45), color: "bg-emerald-500" },
                  { channel: "Instagram", pct: "30%", val: Math.round(totalRevenue * 0.30), color: "bg-pink-500" },
                  { channel: "Website", pct: "15%", val: Math.round(totalRevenue * 0.15), color: "bg-indigo-500" },
                  { channel: "Facebook", pct: "10%", val: Math.round(totalRevenue * 0.10), color: "bg-blue-500" },
                ].map((item, i) => (
                  <div key={i} className="py-3 flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                      <span className="font-bold text-slate-900 dark:text-white">{item.channel}</span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="font-bold text-slate-900 dark:text-white">{item.val.toLocaleString()} DA</span>
                      <span className="ml-2 text-slate-500 dark:text-slate-400">({item.pct})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ALL ORDERS HUB (Default View) */}
      {(currentMode === "classic" || activeTab === "all") && (
        <div className="flex flex-col gap-6">
          
          {/* Top Real-time Analytics KPI Metrics (Redesigned) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* Card 1: Total Orders */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-sm hover:border-indigo-200 dark:hover:border-indigo-900/60 transition-all flex flex-col justify-between relative text-left min-h-[124px] group">
              <div className="flex justify-between items-start">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    {merchantLang === "ar" ? "إجمالي الطلبيات" : "Total orders"}
                  </span>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {merchantLang === "ar" ? "كل الحالات المسجلة" : "All order states"}
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100/80 dark:border-indigo-800/60 group-hover:scale-105 transition-transform">
                  <Package className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-3xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                  {totalOrdersCount}
                </span>
                <span className="inline-flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
                  <TrendingUp className="w-3 h-3" />
                  <span>+12%</span>
                </span>
              </div>
            </div>

            {/* Card 2: Net Revenue */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-sm hover:border-emerald-200 dark:hover:border-emerald-900/60 transition-all flex flex-col justify-between relative text-left min-h-[124px] group">
              <div className="flex justify-between items-start">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    {merchantLang === "ar" ? "المداخيل الصافية" : "Net revenue"}
                  </span>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {merchantLang === "ar" ? "معدل السلة" : "Basket AOV"}: {avgOrderValue.toLocaleString()} DA
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100/80 dark:border-emerald-800/60 group-hover:scale-105 transition-transform font-mono font-bold text-xs flex items-center justify-center">
                  <span>DA</span>
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-2xl sm:text-[26px] font-black font-mono tracking-tight text-slate-900 dark:text-white">
                  {totalRevenue.toLocaleString()} <span className="text-xs font-bold text-slate-500">DA</span>
                </span>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 font-mono">
                  {storeOrders.length} {merchantLang === "ar" ? "طلبات" : "orders"}
                </span>
              </div>
            </div>

            {/* Card 3: Fulfillment Speed */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-sm hover:border-amber-200 dark:hover:border-amber-900/60 transition-all flex flex-col justify-between relative text-left min-h-[124px] group">
              <div className="flex justify-between items-start">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    {merchantLang === "ar" ? "سرعة التجهيز" : "Fulfillment speed"}
                  </span>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {merchantLang === "ar" ? "متوسط وقت التسليم" : "Avg dispatch SLA"}
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-100/80 dark:border-amber-800/60 group-hover:scale-105 transition-transform">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-2xl sm:text-[26px] font-black font-mono tracking-tight text-amber-600 dark:text-amber-400">
                  1.8 <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Days</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60">
                  <Zap className="w-2.5 h-2.5 text-amber-500" />
                  <span>{merchantLang === "ar" ? "سريع" : "Fast"}</span>
                </span>
              </div>
            </div>

            {/* Card 4: Delivery Success */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-sm hover:border-sky-200 dark:hover:border-sky-900/60 transition-all flex flex-col justify-between relative text-left min-h-[124px] group">
              <div className="flex justify-between items-start">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    {merchantLang === "ar" ? "نسبة التسليم" : "Delivery success"}
                  </span>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {deliveredCount} {merchantLang === "ar" ? "تم تسليمها" : "delivered"}
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-100/80 dark:border-sky-800/60 group-hover:scale-105 transition-transform">
                  <Truck className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-3xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                  {deliverySuccessRate}%
                </span>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  {totalOrdersCount > 0 ? `${deliveredCount}/${totalOrdersCount}` : "0"} {merchantLang === "ar" ? "تم التسليم" : "fulfilled"}
                </span>
              </div>
            </div>

            {/* Card 5: Return Rate */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-sm hover:border-rose-200 dark:hover:border-rose-900/60 transition-all flex flex-col justify-between relative text-left min-h-[124px] group">
              <div className="flex justify-between items-start">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    {merchantLang === "ar" ? "نسبة المرتجعات" : "Return rate"}
                  </span>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {returnCount} {merchantLang === "ar" ? "مرتجع مسجل" : "returns logged"}
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-100/80 dark:border-rose-800/60 group-hover:scale-105 transition-transform">
                  <RotateCcw className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className={`text-3xl font-black font-mono tracking-tight ${returnRate > 5 ? "text-rose-600 dark:text-rose-400" : "text-slate-900 dark:text-white"}`}>
                  {returnRate}%
                </span>
                <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {returnRate <= 2 ? "Healthy < 2%" : "Attention"}
                </span>
              </div>
            </div>

          </div>

          {/* Interactive Delivery Pipeline / Funnel (Redesigned) */}
          <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs text-left">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/50">
                    <Activity className="w-4 h-4" />
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {merchantLang === "ar" ? "مسار مراحل تجهيز وشحن الطلبيات" : "Order fulfillment lifecycle pipeline"}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 pl-8">
                  {merchantLang === "ar"
                    ? "انقر على أي مرحلة لتصفية قائمة الطلبات أدناه فورياً"
                    : "Click any stage card to filter the live orders table below"}
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                {statusFilter !== "all" && (
                  <button
                    type="button"
                    onClick={() => setStatusFilter("all")}
                    className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{merchantLang === "ar" ? "إلغاء التصفية (عرض الكل)" : "Clear filter"}</span>
                  </button>
                )}
                <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                  {totalOrdersCount} {merchantLang === "ar" ? "طلبيات إجمالية" : "total orders"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {[
                {
                  status: "pending",
                  step: "01",
                  title: merchantLang === "ar" ? "جديد معلق" : "New pending",
                  subtitle: merchantLang === "ar" ? "في انتظار التأكيد" : "Needs verification",
                  count: pendingCount,
                  color: "bg-amber-500",
                  textColor: "text-amber-600 dark:text-amber-400",
                  bgLight: "bg-amber-500/10",
                  borderLight: "border-amber-500/30",
                  icon: Clock
                },
                {
                  status: "accepted",
                  step: "02",
                  title: merchantLang === "ar" ? "مؤكد وجاهز" : "Confirmed",
                  subtitle: merchantLang === "ar" ? "جاهز للتسليم للناقل" : "Ready for dispatch",
                  count: acceptedCount,
                  color: "bg-indigo-600",
                  textColor: "text-indigo-600 dark:text-indigo-400",
                  bgLight: "bg-indigo-500/10",
                  borderLight: "border-indigo-500/30",
                  icon: CheckCircle
                },
                {
                  status: "shipped",
                  step: "03",
                  title: merchantLang === "ar" ? "قيد الشحن" : "In transit",
                  subtitle: merchantLang === "ar" ? "مع شركة التوصيل" : "With carrier",
                  count: shippedCount,
                  color: "bg-sky-500",
                  textColor: "text-sky-600 dark:text-sky-400",
                  bgLight: "bg-sky-500/10",
                  borderLight: "border-sky-500/30",
                  icon: Truck
                },
                {
                  status: "delivered",
                  step: "04",
                  title: merchantLang === "ar" ? "تم التسليم" : "Delivered",
                  subtitle: merchantLang === "ar" ? "تحصيل نقدي COD" : "COD paid & completed",
                  count: deliveredCount,
                  color: "bg-emerald-500",
                  textColor: "text-emerald-600 dark:text-emerald-400",
                  bgLight: "bg-emerald-500/10",
                  borderLight: "border-emerald-500/30",
                  icon: Package
                },
                {
                  status: "all",
                  step: "05",
                  title: merchantLang === "ar" ? "إجمالي الطلبات" : "Total volume",
                  subtitle: merchantLang === "ar" ? "كل الحالات مجتمعة" : "All orders combined",
                  count: totalOrdersCount,
                  color: "bg-slate-800 dark:bg-slate-200",
                  textColor: "text-slate-800 dark:text-slate-200",
                  bgLight: "bg-slate-500/10",
                  borderLight: "border-slate-500/30",
                  icon: Layers
                }
              ].map((stage) => {
                const isSelected = statusFilter === stage.status;
                const pct = totalOrdersCount > 0 ? Math.round((stage.count / totalOrdersCount) * 100) : (stage.status === "all" ? 100 : 0);
                const IconComp = stage.icon;

                return (
                  <button
                    key={stage.status}
                    type="button"
                    onClick={() => setStatusFilter(stage.status)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between group ${
                      isSelected
                        ? "border-indigo-600 dark:border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 ring-2 ring-indigo-500/30 shadow-xs"
                        : "border-slate-200/90 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-850/40 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    {/* Top Step + Icon */}
                    <div>
                      <div className="flex justify-between items-center mb-2.5">
                        <span className="text-[11px] font-mono font-extrabold text-slate-400 dark:text-slate-500">
                          {stage.step}
                        </span>
                        <span className={`p-1.5 rounded-lg ${stage.bgLight} ${stage.textColor} border ${stage.borderLight}`}>
                          <IconComp className="w-3.5 h-3.5" />
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                          {stage.title}
                        </h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          {stage.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Metric and Progress */}
                    <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
                      <div className="flex items-baseline justify-between font-mono mb-2">
                        <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                          {stage.count}
                        </span>
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                          {pct}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200/80 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${stage.color} rounded-full transition-all duration-500`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Regional Wilaya Volume Heatmap & Carrier Intelligence (Redesigned) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Top Wilaya Distribution */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs text-left flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50">
                        <MapPin className="w-4 h-4" />
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {merchantLang === "ar" ? "التوزيع الجغرافي للطلبيات (الولايات)" : "Geographic wilaya distribution (Algeria)"}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 pl-8">
                      {merchantLang === "ar" ? "تتبع حجم المبيعات والوجهات الأكثر طلباً" : "Volume share & revenue per administrative wilaya"}
                    </p>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
                    58 {merchantLang === "ar" ? "ولاية مدعومة" : "Wilayas"}
                  </span>
                </div>

                <div className="space-y-3 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
                  {wilayaDistribution.length > 0 ? (
                    wilayaDistribution.slice(0, 6).map((item) => {
                      const pct = totalOrdersCount > 0 ? Math.round((item.count / totalOrdersCount) * 100) : 0;
                      return (
                        <div key={item.code} className="p-3 bg-slate-50/70 dark:bg-slate-850/60 rounded-xl border border-slate-200/60 dark:border-slate-800/70 flex flex-col gap-2">
                          <div className="flex justify-between items-center text-xs">
                            <div className="flex items-center gap-2">
                              <span className="w-7 h-6 rounded-lg bg-emerald-100/70 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono font-black text-xs flex items-center justify-center">
                                {item.code}
                              </span>
                              <span className="font-bold text-slate-900 dark:text-white">
                                {item.wilayaName}
                              </span>
                            </div>
                            <div className="text-right font-mono">
                              <span className="font-bold text-slate-900 dark:text-white">
                                {item.count} {merchantLang === "ar" ? "طلب" : "orders"}
                              </span>
                              <span className="text-slate-500 dark:text-slate-400 text-[11px] ml-2">
                                ({item.total.toLocaleString()} DA)
                              </span>
                            </div>
                          </div>
                          <div className="w-full h-2 bg-slate-200/70 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                              style={{ width: `${Math.max(pct, 8)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-6 text-center text-slate-400 text-xs">
                      {merchantLang === "ar" ? "لا توجد طلبيات مسجلة بالولايات بعد" : "No orders logged in wilayas yet"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Carrier SLA Performance */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs text-left flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800/50">
                        <Truck className="w-4 h-4" />
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {merchantLang === "ar" ? "شركات التوصيل الجزائرية والأداء" : "Algerian delivery carriers & dispatches"}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 pl-8">
                      {merchantLang === "ar" ? "توزيع الشحنات على الناقلين المعتمدين" : "Volume routing per Algerian courier network"}
                    </p>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60">
                    6 {merchantLang === "ar" ? "شركات شحن" : "Couriers"}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {CARRIERS.map((c) => {
                    const count = storeOrders.filter((o) => (o.deliveryCompany || "yalidine") === c.id).length;
                    const pct = totalOrdersCount > 0 ? Math.round((count / totalOrdersCount) * 100) : 0;

                    return (
                      <div
                        key={c.id}
                        className="p-3.5 bg-slate-50/70 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-850 rounded-2xl hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className={`w-2.5 h-2.5 rounded-full ${c.color} shrink-0 ring-2 ring-white dark:ring-slate-900`} />
                            <span className="text-xs font-bold truncate text-slate-900 dark:text-slate-100" title={c.name}>
                              {c.name}
                            </span>
                          </div>
                          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                            COD Courier
                          </span>
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-baseline justify-between font-mono">
                          <span className="text-base font-black text-slate-900 dark:text-white">
                            {count}
                          </span>
                          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                            {pct}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* GOOGLE SHEETS LIVE SYNC PANEL */}
      <div className={`p-6 rounded-2xl border text-left shadow-2xs overflow-hidden relative transition-all duration-300 ${
        darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200/80 text-slate-900"
      }`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 inline-block border border-emerald-500/20">
                <GoogleSheetsLogo className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                Google Sheets live synchronization
              </span>
            </div>
            <h3 className="text-xl font-display font-black tracking-tight text-slate-900 dark:text-white">
              {merchantLang === "ar" ? "مزامنة جوجل شيتس الفورية" : "Google Sheets real-time synchronization"}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {merchantLang === "ar"
                ? "قم بمزامنة جميع الطلبات تلقائيًا مع ملف Google Sheets، لحفظ الفواتير والتقارير المالية في مكان آمن."
                : "Synchronize all orders in real-time with Google Sheets. Enables dynamic data processing and protected analytics for delivery agents."}
            </p>
          </div>

          <div className="shrink-0 self-stretch sm:self-auto flex items-center">
            {!googleUser ? (
              <button
                type="button"
                onClick={handleConnectGoogleSheets}
                disabled={isSyncingSheets}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-850 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-bold shadow-md cursor-pointer select-none transition-all disabled:opacity-50"
              >
                {isSyncingSheets ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <GoogleSheetsLogo className="w-4 h-4" />
                    <span>Connect Google Sheets</span>
                  </>
                )}
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleForceManualSync}
                  disabled={isSyncingSheets}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold shadow-md transition-all cursor-pointer select-none disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncingSheets ? "animate-spin" : ""}`} />
                  <span>Sync now</span>
                </button>
                
                <button
                  type="button"
                  onClick={handleDisconnectGoogleSheets}
                  className="inline-flex items-center justify-center gap-2 px-3 py-3 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-bold transition-all cursor-pointer select-none"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Disconnect</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {googleUser && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-bold text-slate-800 dark:text-slate-200">{googleUser.email}</span>
            </div>
            {sheetsSpreadsheetId && (
              <a
                href={`https://docs.google.com/spreadsheets/d/${sheetsSpreadsheetId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:underline font-bold inline-flex items-center gap-1"
              >
                <span>Open Google Sheet</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col gap-4 text-left">
        
        {/* Row 1: Search + Main Status Tabs + Export */}
        <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={merchantLang === "ar" ? "ابحث برقم الطلبية، الاسم، رقم الهاتف أو الولاية..." : "Search order ID, customer, phone, tracking code..."}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white placeholder:text-slate-400"
            />
          </div>

          {/* Quick Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-white dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
            {[
              { id: "all", label: "All", count: totalOrdersCount },
              { id: "pending", label: "Pending", count: pendingCount },
              { id: "accepted", label: "Confirmed", count: acceptedCount },
              { id: "shipped", label: "Shipped", count: shippedCount },
              { id: "delivered", label: "Delivered", count: deliveredCount },
            ].map((tab) => {
              const active = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    active
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className="text-xs px-1.5 py-0.2 bg-slate-200 dark:bg-slate-700 rounded-full font-mono">{tab.count}</span>
                </button>
              );
            })}
          </div>

          {/* CSV Export & Layout Switcher */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCSV}
              className="px-3.5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-slate-200/60 dark:border-slate-700/60"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <div className="inline-flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setLayoutView("table")}
                className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                  layoutView === "table" ? "bg-white dark:bg-slate-900 shadow-xs text-slate-900 dark:text-white" : "text-slate-400"
                }`}
                title="Table view"
              >
                <Table className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setLayoutView("cards")}
                className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                  layoutView === "cards" ? "bg-white dark:bg-slate-900 shadow-xs text-slate-900 dark:text-white" : "text-slate-400"
                }`}
                title="Cards view"
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Deep Multi-Attribute Filters (Advanced) */}
        {currentMode === "advanced" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-3 border-t border-slate-200/80 dark:border-slate-800/80">
            
            {/* Category */}
            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full text-xs font-semibold p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-slate-900 dark:text-white"
              >
                <option value="all">📦 All categories</option>
                <option value="Crafts">🏺 Crafts & textiles</option>
                <option value="Food">🌾 Local food</option>
                <option value="Fashion">🧥 Fashion & caftans</option>
                <option value="Home">🏠 Home & décor</option>
              </select>
            </div>

            {/* Carrier */}
            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">Delivery carrier</label>
              <select
                value={carrierFilter}
                onChange={(e) => setCarrierFilter(e.target.value)}
                className="w-full text-xs font-semibold p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-slate-900 dark:text-white"
              >
                <option value="all">🚚 All carriers</option>
                {CARRIERS.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Payment Method */}
            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">Payment method</label>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="w-full text-xs font-semibold p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-slate-900 dark:text-white"
              >
                <option value="all">💳 All gateways</option>
                <option value="cod">💵 Cash on delivery (COD)</option>
                <option value="eddahabia">💳 Edahabia card</option>
                <option value="cib">💳 CIB card</option>
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">From date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full text-xs font-semibold p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-slate-900 dark:text-white"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">To date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full text-xs font-semibold p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-slate-900 dark:text-white"
              />
            </div>
          </div>
        )}
      </div>

      {/* BATCH ACTION BAR (if selected) */}
      {selectedOrderIds.length > 0 && (
        <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
          <span className="text-xs font-bold font-mono px-3">
            {selectedOrderIds.length} orders selected
          </span>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => handleBulkStatusChange("accepted")}
              className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all"
            >
              Batch confirm
            </button>
            <button
              type="button"
              onClick={() => handleBulkStatusChange("shipped")}
              className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all"
            >
              Batch ship
            </button>
            <button
              type="button"
              onClick={() => handleBulkStatusChange("delivered")}
              className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all"
            >
              Batch deliver
            </button>
            <button
              type="button"
              onClick={() => setShowBatchLabelModal(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs font-bold transition-all flex items-center gap-1"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Batch labels</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedOrderIds([])}
              className="px-2 py-1 text-white/80 hover:text-white text-xs"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* ORDERS MAIN DISPLAY (TABLE OR CARDS) */}
      {paginatedOrders.length === 0 ? (
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl p-12 border border-slate-200/80 dark:border-slate-800/80 text-center">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white">No orders matching search criteria</h3>
          <p className="text-xs text-slate-400 mt-1">Try resetting filters or simulate a new customer order.</p>
          <button
            type="button"
            onClick={handleSimulateOrder}
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all"
          >
            Simulate customer order
          </button>
        </div>
      ) : layoutView === "table" ? (
        
        /* TABLE LAYOUT */
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-3xl border border-slate-200/80 dark:border-slate-800/80 overflow-x-auto shadow-xs text-left">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/60 text-slate-700 dark:text-slate-300 font-bold text-xs">
                <th className="p-3.5 text-center w-10">
                  <input
                    type="checkbox"
                    checked={allFilteredSelected}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </th>
                <th className="p-3.5 font-bold">Order ID</th>
                <th className="p-3.5 font-bold">Date</th>
                <th className="p-3.5 font-bold">Shopper & wilaya</th>
                <th className="p-3.5 font-bold">Items purchased</th>
                <th className="p-3.5 font-bold">Amount (DZD)</th>
                <th className="p-3.5 font-bold">Carrier / tracking</th>
                <th className="p-3.5 font-bold">Status</th>
                <th className="p-3.5 text-right font-bold">Quick actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-sans">
              {paginatedOrders.map((order) => {
                const isSelected = selectedOrderIds.includes(order.id);
                const carrierObj = CARRIERS.find((c) => c.id === (order.deliveryCompany || "yalidine")) || CARRIERS[0];
                return (
                  <tr
                    key={order.id}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                      isSelected ? "bg-indigo-50/50 dark:bg-indigo-950/30" : ""
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="p-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOrder(order.id)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>

                    {/* Order ID */}
                    <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-white">
                      #{order.id}
                    </td>

                    {/* Date */}
                    <td className="p-3.5 text-slate-700 dark:text-slate-300 font-medium text-[11px]">
                      {new Date(order.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </td>

                    {/* Shopper */}
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 dark:text-white">{order.shopper.name}</div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                        <span>{order.shopper.wilayaCode} - {order.shopper.wilaya}</span>
                        <span>•</span>
                        <a href={`tel:${order.shopper.phone}`} className="hover:underline text-indigo-600 dark:text-indigo-400 font-bold">{order.shopper.phone}</a>
                      </div>
                    </td>

                    {/* Items */}
                    <td className="p-3.5 max-w-[200px]">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {order.items.slice(0, 2).map((it) => (
                          <span key={it.id} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md text-[11px] font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[140px]">
                            {it.name} (x{it.quantity})
                          </span>
                        ))}
                        {order.items.length > 2 && (
                          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">+{order.items.length - 2} more</span>
                        )}
                      </div>
                    </td>

                    {/* Total */}
                    <td className="p-3.5 font-mono font-black text-slate-900 dark:text-white">
                      {order.total.toLocaleString()} DA
                      <span className="block text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase">{order.paymentMethod}</span>
                    </td>

                    {/* Carrier & Tracking */}
                    <td className="p-3.5">
                      <div className="flex flex-col gap-1">
                        <select
                          value={order.deliveryCompany || "yalidine"}
                          onChange={(e) => handleAssignCarrier(order.id, e.target.value)}
                          className="text-[11px] font-bold p-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg outline-none cursor-pointer"
                        >
                          {CARRIERS.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                        {order.trackingCode && (
                          <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400">
                            {order.trackingCode}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-3.5">
                      {getStatusBadge(order.status)}
                    </td>

                    {/* Quick Actions */}
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Status progression triggers */}
                        {order.status === "pending" && (
                          <button
                            type="button"
                            onClick={() => handleUpdateOrderStatus(order.id, "accepted")}
                            className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10.5px] font-bold transition-all"
                          >
                            Confirm
                          </button>
                        )}
                        {order.status === "accepted" && (
                          <button
                            type="button"
                            onClick={() => handleUpdateOrderStatus(order.id, "shipped")}
                            className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-[10.5px] font-bold transition-all"
                          >
                            Ship
                          </button>
                        )}
                        {order.status === "shipped" && (
                          <button
                            type="button"
                            onClick={() => handleUpdateOrderStatus(order.id, "delivered")}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10.5px] font-bold transition-all"
                          >
                            Deliver
                          </button>
                        )}

                        {/* WhatsApp Trigger */}
                        <a
                          href={getWhatsAppLink(order)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 rounded-lg transition-colors"
                          title="WhatsApp shopper"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>

                        {/* Live Shipping Track */}
                        <button
                          type="button"
                          onClick={() => setTrackingModalOrder(order)}
                          className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/80 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-lg transition-colors flex items-center gap-1 font-bold text-[10.5px] cursor-pointer"
                          title="Track live shipping detail"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Track</span>
                        </button>

                        {/* Print Shipping Label */}
                        <button
                          type="button"
                          onClick={() => setPrintingLabelOrder(order)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
                          title="Print waybill / label"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>

                        {/* View Drawer */}
                        <button
                          type="button"
                          onClick={() => setViewingOrder(order)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
                          title="View details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        
        /* CARDS LAYOUT */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
          {paginatedOrders.map((order) => {
            const isSelected = selectedOrderIds.includes(order.id);
            return (
              <div
                key={order.id}
                className={`p-5 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border transition-all shadow-xs relative flex flex-col justify-between ${
                  isSelected ? "border-indigo-600 ring-2 ring-indigo-500/20" : "border-slate-200/80 dark:border-slate-800/80"
                }`}
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">Order #{order.id}</span>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white mt-0.5">{order.shopper.name}</h4>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>

                  <div className="mt-3 text-xs text-slate-700 dark:text-slate-300 space-y-1 font-medium">
                    <p className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {order.shopper.wilayaCode} - {order.shopper.wilaya} ({order.shopper.commune})</p>
                    <p className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-400" /> {order.shopper.phone}</p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[9px] uppercase font-mono font-bold text-slate-500 dark:text-slate-400">Items ({order.items.length})</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {order.items.map((i) => (
                        <span key={i.id} className="text-[11px] font-semibold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded">
                          {i.name} (x{i.quantity})
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="text-base font-black font-mono text-slate-900 dark:text-white">{order.total.toLocaleString()} DA</span>
                    <span className="block text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase">{order.paymentMethod}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setPrintingLabelOrder(order)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>

                    <a
                      href={getWhatsAppLink(order)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-bold"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </a>

                    <button
                      type="button"
                      onClick={() => setViewingOrder(order)}
                      className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800/80 text-xs font-semibold text-slate-900 dark:text-white">
          <span className="text-slate-600 dark:text-slate-400 font-medium">
            Page {currentPage} of {totalPages} ({filteredOrders.length} total)
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* MODAL 1: ORDER DETAILS DRAWER */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full overflow-y-auto p-6 shadow-2xl text-left flex flex-col justify-between animate-slideLeft">
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-400">Order #{viewingOrder.id}</span>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">Order Intelligence View</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setViewingOrder(null)}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status & Carrier Info */}
              <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500">Status</span>
                  {getStatusBadge(viewingOrder.status)}
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-500">Carrier</span>
                  <span className="font-bold text-slate-900 dark:text-white uppercase">{viewingOrder.deliveryCompany || "yalidine"}</span>
                </div>
                {viewingOrder.trackingCode && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-500">Tracking Code</span>
                    <span className="font-mono font-black text-indigo-600">{viewingOrder.trackingCode}</span>
                  </div>
                )}
              </div>

              {/* Shopper Details */}
              <div className="mt-4 space-y-1">
                <h4 className="text-xs font-mono font-bold uppercase text-slate-400">Shopper Details</h4>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{viewingOrder.shopper.name}</p>
                <p className="text-xs text-slate-500">{viewingOrder.shopper.phone} • {viewingOrder.shopper.email || "No email"}</p>
                <p className="text-xs text-slate-500">{viewingOrder.shopper.wilayaCode} - {viewingOrder.shopper.wilaya}, {viewingOrder.shopper.commune}</p>
                <p className="text-xs text-slate-500">{viewingOrder.shopper.address}</p>
              </div>

              {/* Items List */}
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <h4 className="text-xs font-mono font-bold uppercase text-slate-400">Items Ordered</h4>
                {viewingOrder.items.map((it) => (
                  <div key={it.id} className="flex justify-between items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">{it.name}</span>
                      <span className="block text-[10px] text-slate-400">Qty: {it.quantity} x {it.price} DA</span>
                    </div>
                    <span className="font-mono font-bold">{it.quantity * it.price} DA</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setTrackingModalOrder(viewingOrder);
                  setViewingOrder(null);
                }}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Truck className="w-4 h-4" />
                <span>Track Live Shipment</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setPrintingLabelOrder(viewingOrder);
                  setViewingOrder(null);
                }}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Waybill</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: PRINT SHIPPING WAYBILL LABEL */}
      {printingLabelOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 p-8 rounded-3xl max-w-md w-full shadow-2xl text-left font-sans relative">
            <button
              type="button"
              onClick={() => setPrintingLabelOrder(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="border-b pb-4 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black">{myStore.name}</h3>
                <p className="text-xs text-slate-500">{myStore.subdomain}.platform.dz</p>
              </div>
              <span className="text-xs font-mono font-black px-2.5 py-1 bg-slate-100 rounded-lg">
                WAYBILL / SHIPPING SLIP
              </span>
            </div>

            {/* Barcode Mock */}
            <div className="my-4 text-center p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-mono text-2xl font-black tracking-widest uppercase">
                |||| | ||| |||| | ||||
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-500 mt-1 block">
                ORDER ID: #{printingLabelOrder.id} • TRACKING: {printingLabelOrder.trackingCode || "PENDING"}
              </span>
            </div>

            {/* Shopper Address */}
            <div className="space-y-1 text-xs mb-4">
              <span className="text-[9px] uppercase font-mono font-bold text-slate-400 block">Deliver To:</span>
              <p className="font-black text-sm">{printingLabelOrder.shopper.name}</p>
              <p className="font-bold text-indigo-600">{printingLabelOrder.shopper.phone}</p>
              <p>{printingLabelOrder.shopper.wilayaCode} - {printingLabelOrder.shopper.wilaya}, {printingLabelOrder.shopper.commune}</p>
              <p className="text-slate-600">{printingLabelOrder.shopper.address}</p>
            </div>

            {/* Financial Summary */}
            <div className="p-3 bg-slate-100 rounded-xl flex justify-between items-center font-mono text-xs mb-6">
              <span>COD AMOUNT TO COLLECT:</span>
              <span className="text-base font-black text-slate-900">{printingLabelOrder.total.toLocaleString()} DA</span>
            </div>

            {/* Trigger Print */}
            <button
              type="button"
              onClick={() => window.print()}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Print Waybill Receipt</span>
            </button>
          </div>
        </div>
      )}

      {/* MODAL 3: ORDERS MODULE SETTINGS & ADMIN MODE CONTROLLER */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl max-w-lg w-full shadow-2xl text-left space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-500" />
                <span>Orders Module Admin Preferences</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Effective Status summary */}
              <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-2xl border border-indigo-200 dark:border-indigo-800">
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Effective Mode for Store: {myStore.name}</span>
                <p className="text-slate-500 text-[11px]">
                  Current mode resolved hierarchy: <strong className="uppercase text-indigo-600 font-mono">{effectiveOrdersMode}</strong>
                </p>
              </div>

              {/* 1. Global Default */}
              <div>
                <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">Global Platform Default Mode</label>
                <select
                  value={adminGlobalMode}
                  onChange={(e) => setAdminGlobalMode(e.target.value as any)}
                  className="w-full text-xs font-bold p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
                >
                  <option value="both">⚡ Both Classic & Advanced (Allow store switcher)</option>
                  <option value="classic">⚡ Classic Mode Only (Clean & Fast)</option>
                  <option value="advanced">📊 Advanced Mode Only (Pro Workspace)</option>
                </select>
              </div>

              {/* 2. Store Specific Override */}
              <div>
                <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">Store Specific Override ({myStore.name})</label>
                <select
                  value={adminStoreOverride}
                  onChange={(e) => setAdminStoreOverride(e.target.value)}
                  className="w-full text-xs font-bold p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
                >
                  <option value="both">⚡ Both Modes Enabled</option>
                  <option value="classic">⚡ Classic Mode Only</option>
                  <option value="advanced">📊 Advanced Mode Only</option>
                </select>
              </div>

              {/* 3. Auto Sync Checkbox */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoSyncEnabled}
                    onChange={(e) => setAutoSyncEnabled(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600"
                  />
                  <span className="font-bold text-slate-800 dark:text-slate-200">Auto-sync orders to Google Sheets on status change</span>
                </label>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveAdminSettings}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: REAL-TIME SHIPPING TRACKING DETAIL VIEW */}
      <ShippingTrackingModal
        order={trackingModalOrder}
        isOpen={!!trackingModalOrder}
        onClose={() => setTrackingModalOrder(null)}
        onUpdateStatus={(id, st) => handleUpdateOrderStatus(id, st)}
        merchantLang={merchantLang}
      />

    </div>
  );
}
