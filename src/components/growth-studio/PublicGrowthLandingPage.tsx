import React, { useState, useEffect } from "react";
import { 
  ShoppingBag, 
  Check, 
  ShieldCheck, 
  Clock, 
  Star, 
  Truck, 
  ArrowLeft, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  Lock,
  Flame,
  Maximize2,
  Minimize2,
  AlertCircle,
  AlertTriangle,
  HelpCircle,
  BookOpen,
  TrendingUp,
  Award,
  FileText
} from "lucide-react";
import { GrowthCampaign, GrowthLandingPage } from "../../types/growthStudio";

interface PublicGrowthLandingPageProps {
  campaign: GrowthCampaign;
  landingPage: GrowthLandingPage;
  onOrderSuccess: (orderData: any) => void;
  onBackToStore?: () => void;
  isArabic?: boolean; // Kept for prop compatibility, but rendered strictly in English per user instruction
}

const ALGERIAN_WILAYAS = [
  "16 - Algiers (Alger)",
  "31 - Oran",
  "25 - Constantine",
  "19 - Setif",
  "06 - Bejaia",
  "15 - Tizi Ouzou",
  "09 - Blida",
  "35 - Boumerdes",
  "42 - Tipaza",
  "13 - Tlemcen",
  "23 - Annaba",
  "05 - Batna",
  "28 - M'Sila",
  "17 - Djelfa",
  "30 - Ouargla",
  "47 - Ghardaia",
  "07 - Biskra",
  "39 - El Oued",
  "22 - Sidi Bel Abbes",
  "27 - Mostaganem",
  "44 - Ain Defla",
  "26 - Medea",
  "10 - Bouira",
  "34 - Bordj Bou Arreridj",
  "18 - Jijel",
  "21 - Skikda",
  "40 - Khenchela",
  "04 - Oum El Bouaghi",
  "41 - Souk Ahras",
  "12 - Tebessa",
  "29 - Mascara",
  "48 - Relizane",
  "20 - Saida",
  "14 - Tiaret",
  "38 - Tissemsilt",
  "02 - Chlef",
  "46 - Ain Temouchent",
  "08 - Bechar",
  "01 - Adrar",
  "03 - Laghouat",
  "32 - El Bayadh",
  "45 - Naama",
  "33 - Illizi",
  "11 - Tamanrasset",
  "36 - El Tarf",
  "37 - Tindouf",
  "43 - Mila"
];

const AVAILABLE_SIZES = ["Standard / S", "Medium (M)", "Large (L)", "XL (Deluxe)"];
const AVAILABLE_COLORS = [
  { name: "Midnight Black", hex: "#0f172a" },
  { name: "Slate Silver", hex: "#64748b" },
  { name: "Deep Navy", hex: "#1e3a8a" },
  { name: "Forest Emerald", hex: "#065f46" }
];

export const PublicGrowthLandingPage: React.FC<PublicGrowthLandingPageProps> = ({
  campaign,
  landingPage,
  onOrderSuccess,
  onBackToStore
}) => {
  // Product Card Mode (PDF Page 6: Compact vs Expanded Mode)
  const [productCardMode, setProductCardMode] = useState<"compact" | "expanded">("expanded");

  // Variant selections
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>(AVAILABLE_COLORS[0].name);
  const [sizeErrorPrompt, setSizeErrorPrompt] = useState(false);

  // Order form state
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerWilaya, setCustomerWilaya] = useState(ALGERIAN_WILAYAS[0]);
  const [customerAddress, setCustomerAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);

  // Scarcity countdown timer (PDF Page 4 & 5)
  const [timeLeft, setTimeLeft] = useState({ hours: 6, minutes: 48, seconds: 35 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currency = landingPage.currency || "DA";
  const isArabicPage = landingPage.language === "ar" || (landingPage.theme?.fontFamily?.includes("Tajawal") ?? false);
  const basePrice = campaign.product.price || 4900;
  const originalPrice = campaign.product.originalPrice || Math.round(basePrice * 1.35);
  const shippingCost = currency === "USD" ? 5 : currency === "EUR" ? 5 : currency === "SAR" ? 25 : currency === "AED" ? 25 : 600; // localized courier COD shipping
  const isFreeShipping = quantity >= 2;
  const totalPrice = basePrice * quantity + (isFreeShipping ? 0 : shippingCost);

  // Handle order submission
  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) return;

    if (!selectedSize) {
      setSizeErrorPrompt(true);
      const variantAnchor = document.getElementById("product-info-card");
      if (variantAnchor) {
        variantAnchor.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setOrderCompleted(true);

      onOrderSuccess({
        id: `ord-growth-${Date.now()}`,
        campaignId: campaign.id,
        landingPageId: landingPage.id,
        landingPageName: landingPage.name,
        productName: campaign.product.name,
        variant: `${selectedColor} • ${selectedSize}`,
        quantity,
        totalPrice,
        customer: {
          name: customerName,
          phone: customerPhone,
          wilaya: customerWilaya,
          address: customerAddress
        },
        date: new Date().toISOString(),
        paymentMethod: "COD"
      });
    }, 900);
  };

  // Sticky mobile CTA click handler
  const handleStickyCtaClick = () => {
    if (!selectedSize) {
      setSizeErrorPrompt(true);
      const card = document.getElementById("product-info-card");
      if (card) {
        card.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    const form = document.getElementById("order-form");
    if (form) {
      form.scrollIntoView({ behavior: "smooth" });
    }
  };

  const defaultTheme = {
    primaryColor: "#0A1F44",
    accentColor: "#E2A26C",
    backgroundColor: "#070F1E",
    backgroundGradient: "linear-gradient(180deg, #070F1E 0%, #0A1F44 45%, #08152B 100%)",
    cardBackgroundColor: "#0E1C36",
    textColor: "#F4F6F8",
    fontFamily: isArabicPage ? "'Cairo', sans-serif" : "Inter, sans-serif",
    buttonStyle: "pill" as const,
    badgeText: isArabicPage ? "عرض حصري موثوق" : "Verified Offer"
  };

  const theme = {
    ...defaultTheme,
    ...(landingPage?.theme || {})
  };
  const isDarkTheme = Boolean(
    theme.backgroundColor?.startsWith("#0") || 
    theme.backgroundColor?.startsWith("#1") || 
    theme.backgroundColor?.toLowerCase().includes("black") ||
    (theme.textColor && !theme.textColor.startsWith("#3") && !theme.textColor.startsWith("#0") && !theme.textColor.startsWith("#1"))
  );

  const containerBg = theme.backgroundGradient || theme.backgroundColor || "#f8fafc";
  const cardBg = theme.cardBackgroundColor || (isDarkTheme ? "#0E1C36" : "#ffffff");
  const cardBorder = isDarkTheme ? "border-white/10" : "border-slate-200/80";
  const textColor = theme.textColor || (isDarkTheme ? "#F4F6F8" : "#0f172a");
  const mutedTextColor = isDarkTheme ? "#94a3b8" : "#64748b";
  const itemBg = isDarkTheme ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-100";
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <div 
      dir={isArabicPage ? "rtl" : "ltr"}
      style={{ 
        background: containerBg, 
        color: textColor,
        fontFamily: theme.fontFamily || undefined 
      }}
      className="min-h-screen selection:bg-indigo-600 selection:text-white pb-24 text-left transition-colors"
    >
      
      {/* Top Scarcity & Offer Banner (PDF Page 3 & 4) */}
      <div 
        className="py-2.5 px-4 text-white text-xs font-bold text-center flex items-center justify-center gap-3 shadow-xs sticky top-0 z-40"
        style={{ backgroundColor: theme.primaryColor }}
      >
        <span className="flex items-center gap-1.5 font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>{campaign.offer || (isArabicPage ? "عرض إطلاق محدود: توصيل مجاني عند طلب قطعتين أو أكثر" : "Limited Launch Offer: Free Courier Shipping on Orders of 2+ Units")}</span>
        </span>
        <div className="hidden sm:flex items-center gap-1 font-mono text-[11px] bg-black/25 px-2.5 py-0.5 rounded-full">
          <Clock className="w-3 h-3 text-amber-300" />
          <span>
            {isArabicPage ? "ينتهي خلال " : "Expires in "}{String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Floating Header */}
      <nav 
        style={{ backgroundColor: isDarkTheme ? `${cardBg}E6` : "rgba(255, 255, 255, 0.95)" }}
        className={`backdrop-blur-md border-b ${cardBorder} px-4 sm:px-8 py-3 flex items-center justify-between sticky top-[37px] z-30`}
      >
        <div className="flex items-center gap-2.5">
          {onBackToStore && (
            <button
              type="button"
              onClick={onBackToStore}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Return to store"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <span className="text-sm sm:text-base font-black tracking-tight block leading-tight" style={{ color: textColor }}>
              {campaign.product.name}
            </span>
            <span className="text-[10px] font-medium" style={{ color: mutedTextColor }}>
              {isArabicPage ? "حملة رسمية موثقة • الدفع عند الاستلام مشمول" : "Official Verified Campaign • Cash on Delivery"}
            </span>
          </div>
        </div>

        <a
          href="#order-form"
          style={{ backgroundColor: theme.primaryColor }}
          className={`px-4 py-2 text-white text-xs font-bold shadow-xs transition-transform hover:scale-105 cursor-pointer ${
            theme.buttonStyle === "pill" ? "rounded-full" : theme.buttonStyle === "rounded" ? "rounded-xl" : "rounded-none"
          }`}
        >
          {isArabicPage ? "اطلب الآن" : "Order Now"}
        </a>
      </nav>

      {/* Content Container */}
      <main className="max-w-xl mx-auto px-4 py-6 space-y-8">

        {/* Dynamic Sections Loop */}
        {landingPage.sections.filter((s) => s.visible).map((section) => (
          <div key={section.id} className="space-y-4">

            {/* 1. HERO SECTION (PDF Page 2 & 4) */}
            {section.type === "hero" && (
              <div className="text-center space-y-4 pt-1">
                {section.badge && (
                  <span 
                    className="inline-block px-3.5 py-1 rounded-full text-xs font-black tracking-wide border shadow-2xs"
                    style={{ 
                      backgroundColor: `${theme.accentColor}25`, 
                      color: theme.accentColor,
                      borderColor: `${theme.accentColor}40`
                    }}
                  >
                    {section.badge}
                  </span>
                )}
                
                <h1 className="text-2xl sm:text-3xl font-black leading-tight" style={{ color: textColor }}>
                  {section.headline}
                </h1>
                
                {section.subheadline && (
                  <p className="text-sm leading-relaxed max-w-md mx-auto" style={{ color: mutedTextColor }}>
                    {section.subheadline}
                  </p>
                )}

                {/* Hero Media */}
                {section.imageUrl && (
                  <div className={`rounded-3xl overflow-hidden shadow-2xl aspect-4/3 max-w-md mx-auto border ${cardBorder} relative group`}>
                    <img 
                      src={section.imageUrl} 
                      alt={section.headline}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  </div>
                )}

                {/* Headline Trust Social Proof Pill */}
                <div 
                  style={{ backgroundColor: cardBg }}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border ${cardBorder} text-xs shadow-xs`}
                >
                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="font-bold">4.9 / 5</span>
                  <span style={{ color: mutedTextColor }}>•</span>
                  <span style={{ color: mutedTextColor }}>
                    {isArabicPage ? "+2,410 مشتري موثق في الجزائر" : "2,410+ Verified Buyers"}
                  </span>
                </div>

                {/* Pricing Display */}
                <div 
                  style={{ backgroundColor: cardBg }}
                  className={`p-4 rounded-2xl border ${cardBorder} shadow-sm flex items-center justify-center gap-4 max-w-xs mx-auto`}
                >
                  <div>
                    <span className="text-2xl font-black font-mono block" style={{ color: textColor }}>
                      {basePrice.toLocaleString()} {currency}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-500">
                      {isArabicPage ? "الدفع عند الاستلام مشمول" : "Cash on Delivery Included"}
                    </span>
                  </div>
                  {originalPrice > basePrice && (
                    <div className={`text-left border-l ${cardBorder} pl-3`}>
                      <span className="text-xs font-mono text-slate-400 line-through block">
                        {originalPrice.toLocaleString()} {currency}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 font-mono">
                        {isArabicPage ? "وفر" : "Save"} {Math.round(((originalPrice - basePrice) / originalPrice) * 100)}%
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-1">
                  <a
                    href="#order-form"
                    style={{ backgroundColor: theme.primaryColor }}
                    className={`w-full max-w-xs block mx-auto py-4 px-6 text-white font-black text-sm shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer text-center ${
                      theme.buttonStyle === "pill" ? "rounded-full" : theme.buttonStyle === "rounded" ? "rounded-xl" : "rounded-none"
                    }`}
                  >
                    {section.ctaText || (isArabicPage ? "اطلب نسختك الآن - الدفع عند الاستلام" : "Order Cash on Delivery")}
                  </a>
                </div>

                {/* Trust Badges */}
                <div className="flex items-center justify-center gap-6 text-xs pt-1" style={{ color: mutedTextColor }}>
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-emerald-500" />
                    <span>{isArabicPage ? "توصيل سريع لكافة 58 ولاية" : "Fast 58 Wilayas Delivery"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" style={{ color: theme.accentColor }} />
                    <span>{isArabicPage ? "معاينة الطرد قبل السداد" : "Inspect Before Paying"}</span>
                  </div>
                </div>
              </div>
            )}

            {/* PROBLEM SECTION (The Real Problem Traders Face / المشكلة الشائعة) */}
            {section.type === "problem" && (
              <div 
                style={{ backgroundColor: cardBg }}
                className={`p-5 sm:p-6 rounded-3xl border ${cardBorder} shadow-md space-y-4 text-center`}
              >
                <div className="inline-flex p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 mx-auto">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                {section.badge && (
                  <span className="block text-xs font-bold uppercase tracking-wider text-rose-400">
                    {section.badge}
                  </span>
                )}
                <h2 className="text-base sm:text-lg font-black" style={{ color: textColor }}>
                  {section.headline}
                </h2>
                {section.subheadline && (
                  <p className="text-xs leading-relaxed max-w-md mx-auto" style={{ color: mutedTextColor }}>
                    {section.subheadline}
                  </p>
                )}
                <div className="grid grid-cols-1 gap-3 pt-2 text-left">
                  {section.items?.map((item, i) => (
                    <div 
                      key={i} 
                      className={`p-3.5 rounded-2xl border ${cardBorder} flex items-start gap-3`}
                      style={{ backgroundColor: isDarkTheme ? "rgba(255,255,255,0.03)" : "#fff5f5" }}
                    >
                      <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                        ✕
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <h4 className="text-xs font-bold" style={{ color: textColor }}>{item.title}</h4>
                        <p className="text-[11px] leading-relaxed" style={{ color: mutedTextColor }}>{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SOLUTION SECTION (The Solution / الحل الشامل) */}
            {section.type === "solution" && (
              <div 
                style={{ backgroundColor: cardBg }}
                className={`p-5 sm:p-6 rounded-3xl border ${cardBorder} shadow-md space-y-5 text-center`}
              >
                {section.badge && (
                  <span 
                    className="inline-block px-3 py-1 rounded-full text-[11px] font-black tracking-wide border"
                    style={{ 
                      backgroundColor: `${theme.accentColor}20`, 
                      color: theme.accentColor,
                      borderColor: `${theme.accentColor}30` 
                    }}
                  >
                    {section.badge}
                  </span>
                )}
                <h2 className="text-base sm:text-xl font-black" style={{ color: textColor }}>
                  {section.headline}
                </h2>
                {section.subheadline && (
                  <p className="text-xs leading-relaxed max-w-md mx-auto" style={{ color: mutedTextColor }}>
                    {section.subheadline}
                  </p>
                )}

                {section.imageUrl && (
                  <div className={`rounded-2xl overflow-hidden shadow-xl max-w-sm mx-auto aspect-4/3 border ${cardBorder}`}>
                    <img 
                      src={section.imageUrl} 
                      alt={section.headline}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 gap-3 pt-2 text-left">
                  {section.items?.map((item, i) => (
                    <div 
                      key={i} 
                      className={`p-3.5 rounded-2xl border ${cardBorder} flex items-start gap-3`}
                      style={{ backgroundColor: isDarkTheme ? "rgba(255,255,255,0.04)" : "#f8fafc" }}
                    >
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-white text-xs font-bold shadow-2xs"
                        style={{ backgroundColor: theme.primaryColor }}
                      >
                        ✓
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <h4 className="text-xs font-bold" style={{ color: textColor }}>{item.title}</h4>
                        <p className="text-[11px] leading-relaxed" style={{ color: mutedTextColor }}>{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* HOW IT WORKS / STEP ROADMAP */}
            {section.type === "how_it_works" && (
              <div 
                style={{ backgroundColor: cardBg }}
                className={`p-5 sm:p-6 rounded-3xl border ${cardBorder} shadow-md space-y-4 text-center`}
              >
                {section.badge && (
                  <span 
                    className="inline-block px-3 py-1 rounded-full text-[11px] font-black border"
                    style={{ backgroundColor: `${theme.accentColor}20`, color: theme.accentColor, borderColor: `${theme.accentColor}30` }}
                  >
                    {section.badge}
                  </span>
                )}
                <h2 className="text-base sm:text-lg font-black" style={{ color: textColor }}>
                  {section.headline}
                </h2>
                {section.subheadline && (
                  <p className="text-xs leading-relaxed max-w-md mx-auto" style={{ color: mutedTextColor }}>
                    {section.subheadline}
                  </p>
                )}
                <div className="grid grid-cols-1 gap-3.5 pt-2 text-left">
                  {section.items?.map((step, i) => (
                    <div 
                      key={i} 
                      className={`p-4 rounded-2xl border ${cardBorder} flex items-start gap-3.5`}
                      style={{ backgroundColor: isDarkTheme ? "rgba(255,255,255,0.03)" : "#f8fafc" }}
                    >
                      <div 
                        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-mono font-black text-sm text-white shadow-xs"
                        style={{ backgroundColor: theme.accentColor }}
                      >
                        {i + 1}
                      </div>
                      <div className="space-y-1 min-w-0">
                        <h4 className="text-xs font-bold" style={{ color: textColor }}>{step.title}</h4>
                        <p className="text-[11px] leading-relaxed" style={{ color: mutedTextColor }}>{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* WHY CHOOSE / AUTHORITY & CREDENTIALS */}
            {section.type === "why_choose" && (
              <div 
                style={{ backgroundColor: cardBg }}
                className={`p-5 sm:p-6 rounded-3xl border ${cardBorder} shadow-md space-y-4 text-center`}
              >
                <div 
                  className="w-10 h-10 rounded-2xl flex items-center justify-center mx-auto text-white shadow-md"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  <Award className="w-5 h-5" />
                </div>
                <h2 className="text-base sm:text-lg font-black" style={{ color: textColor }}>
                  {section.headline}
                </h2>
                {section.subheadline && (
                  <p className="text-xs leading-relaxed max-w-md mx-auto" style={{ color: mutedTextColor }}>
                    {section.subheadline}
                  </p>
                )}
                <div className="grid grid-cols-1 gap-3 pt-2 text-left">
                  {section.items?.map((item, i) => (
                    <div 
                      key={i} 
                      className={`p-3.5 rounded-2xl border ${cardBorder} flex items-start gap-3`}
                      style={{ backgroundColor: isDarkTheme ? "rgba(255,255,255,0.03)" : "#f8fafc" }}
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <div className="space-y-0.5 min-w-0">
                        <h4 className="text-xs font-bold" style={{ color: textColor }}>{item.title}</h4>
                        <p className="text-[11px] leading-relaxed" style={{ color: mutedTextColor }}>{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. VALUE PROPOSITIONS & FEATURES (PDF Page 2 & 4) */}
            {(section.type === "features" || section.type === "benefits") && (
              <div 
                style={{ backgroundColor: cardBg }}
                className={`p-5 sm:p-6 rounded-3xl border ${cardBorder} shadow-md space-y-4`}
              >
                <h2 className="text-base sm:text-lg font-black text-center" style={{ color: textColor }}>
                  {section.headline}
                </h2>
                <div className="grid grid-cols-1 gap-3">
                  {section.items?.map((item, i) => (
                    <div 
                      key={i} 
                      className={`flex items-start gap-3 p-3.5 rounded-2xl border ${cardBorder}`}
                      style={{ backgroundColor: isDarkTheme ? "rgba(255,255,255,0.03)" : "#f8fafc" }}
                    >
                      <div 
                        className="p-1.5 rounded-lg text-white mt-0.5 shrink-0"
                        style={{ backgroundColor: theme.primaryColor }}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <div className="space-y-0.5 text-left min-w-0">
                        <h4 className="text-xs font-bold" style={{ color: textColor }}>{item.title}</h4>
                        <p className="text-[11px] leading-relaxed" style={{ color: mutedTextColor }}>{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. TESTIMONIALS & REVIEWS SECTION (PDF Page 2 & 4) */}
            {section.type === "testimonials" && (
              <div 
                style={{ backgroundColor: cardBg }}
                className={`p-5 sm:p-6 rounded-3xl border ${cardBorder} shadow-md space-y-4`}
              >
                <div className="text-center space-y-1">
                  <div className="flex items-center justify-center gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <h2 className="text-base sm:text-lg font-black" style={{ color: textColor }}>
                    {section.headline}
                  </h2>
                </div>
                <div className="space-y-3">
                  {section.items?.map((t, i) => (
                    <div 
                      key={i} 
                      className={`p-4 rounded-2xl border ${cardBorder} text-left space-y-1.5`}
                      style={{ backgroundColor: isDarkTheme ? "rgba(255,255,255,0.03)" : "#f8fafc" }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold" style={{ color: textColor }}>{t.title || t.author}</span>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md font-bold border border-emerald-500/20">
                          {isArabicPage ? "مشتري موثق" : "Verified Buyer"}
                        </span>
                      </div>
                      <p className="text-xs italic leading-relaxed" style={{ color: mutedTextColor }}>
                        "{t.description}"
                      </p>
                      {t.authorLocation && (
                        <div className="text-[10px] font-medium" style={{ color: mutedTextColor }}>
                          {t.author} • {t.authorLocation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. COMPARISON MATRIX (PDF Page 4 & 5) */}
            {section.type === "comparison" && (
              <div 
                style={{ backgroundColor: cardBg }}
                className={`p-5 sm:p-6 rounded-3xl border ${cardBorder} shadow-md space-y-4`}
              >
                <h2 className="text-base sm:text-lg font-black text-center" style={{ color: textColor }}>
                  {section.headline}
                </h2>
                <div className="space-y-2.5">
                  {section.items?.map((c, i) => (
                    <div 
                      key={i} 
                      className={`p-3.5 rounded-2xl border ${cardBorder} flex items-start gap-3`}
                      style={{ backgroundColor: isDarkTheme ? "rgba(255,255,255,0.03)" : "#f8fafc" }}
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold" style={{ color: textColor }}>{c.title}</div>
                        <div className="text-[11px] mt-0.5" style={{ color: mutedTextColor }}>{c.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ SECTION (Accordion) */}
            {section.type === "faq" && (
              <div 
                style={{ backgroundColor: cardBg }}
                className={`p-5 sm:p-6 rounded-3xl border ${cardBorder} shadow-md space-y-4`}
              >
                <div className="text-center space-y-1">
                  <div className="inline-flex p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 mx-auto">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <h2 className="text-base sm:text-lg font-black" style={{ color: textColor }}>
                    {section.headline}
                  </h2>
                  {section.subheadline && (
                    <p className="text-xs" style={{ color: mutedTextColor }}>{section.subheadline}</p>
                  )}
                </div>

                <div className="space-y-2 pt-1 text-left">
                  {section.items?.map((faq, i) => {
                    const isOpen = openFaqIndex === i;
                    return (
                      <div 
                        key={i}
                        className={`rounded-2xl border ${cardBorder} overflow-hidden transition-colors`}
                        style={{ backgroundColor: isDarkTheme ? "rgba(255,255,255,0.03)" : "#f8fafc" }}
                      >
                        <button
                          type="button"
                          onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                          className="w-full p-3.5 flex items-center justify-between gap-3 text-left font-bold text-xs cursor-pointer"
                          style={{ color: textColor }}
                        >
                          <span>{faq.title}</span>
                          {isOpen ? (
                            <ChevronUp className="w-4 h-4 shrink-0 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 shrink-0 text-slate-400" />
                          )}
                        </button>
                        {isOpen && (
                          <div 
                            className={`p-3.5 pt-0 text-[11px] leading-relaxed border-t ${cardBorder}`}
                            style={{ color: mutedTextColor }}
                          >
                            {faq.description}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 5. RISK REVERSAL GUARANTEE (PDF Page 3 & 4) */}
            {section.type === "guarantee" && (
              <div 
                style={{ 
                  backgroundColor: isDarkTheme ? "rgba(16, 185, 129, 0.08)" : "rgba(209, 250, 229, 0.7)",
                  borderColor: isDarkTheme ? "rgba(16, 185, 129, 0.25)" : "#a7f3d0"
                }}
                className="p-5 sm:p-6 rounded-3xl border text-center space-y-2 shadow-xs"
              >
                <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto" />
                <h3 className="text-base font-black text-emerald-400">{section.headline}</h3>
                <p className="text-xs leading-relaxed max-w-sm mx-auto" style={{ color: isDarkTheme ? "#a7f3d0" : "#065f46" }}>
                  {section.subheadline || (isArabicPage ? "لك الحق الكامل في فتح ومعاينة الطرد مع عامل التوصيل قبل دفع أي دينار." : "You have full right to open and inspect the package with the courier before paying.")}
                </p>
              </div>
            )}

            {/* CLOSING CTA BANNER */}
            {section.type === "cta" && (
              <div 
                style={{ backgroundColor: cardBg }}
                className={`p-6 rounded-3xl border ${cardBorder} shadow-lg text-center space-y-3`}
              >
                <h3 className="text-base sm:text-lg font-black" style={{ color: textColor }}>
                  {section.headline}
                </h3>
                {section.subheadline && (
                  <p className="text-xs max-w-md mx-auto" style={{ color: mutedTextColor }}>
                    {section.subheadline}
                  </p>
                )}
                <div className="pt-2">
                  <a
                    href="#order-form"
                    style={{ backgroundColor: theme.primaryColor }}
                    className={`inline-block py-3.5 px-8 text-white font-black text-xs shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer ${
                      theme.buttonStyle === "pill" ? "rounded-full" : theme.buttonStyle === "rounded" ? "rounded-xl" : "rounded-none"
                    }`}
                  >
                    {section.ctaText || (isArabicPage ? "سجل طلبك الآن" : "Claim Your Order Now")}
                  </a>
                </div>
              </div>
            )}

            {/* FOOTER SECTION */}
            {section.type === "footer" && (
              <div className="text-center py-4 text-xs" style={{ color: mutedTextColor }}>
                <p className="font-bold">{section.headline}</p>
                {section.subheadline && <p className="text-[10px] mt-1">{section.subheadline}</p>}
              </div>
            )}

          </div>
        ))}

        {/* ========================================================================= */}
        {/* SECTION 5: PRODUCT INFORMATION CARD DESIGN (COMPACT & EXPANDED MODES)     */}
        {/* Directly implementing PDF Section 5 (Pages 5-6)                           */}
        {/* ========================================================================= */}
        <div 
          id="product-info-card"
          style={{ backgroundColor: cardBg }}
          className={`p-5 sm:p-6 rounded-3xl border ${cardBorder} shadow-xl space-y-5 transition-all`}
        >
          {/* Top Mode Toggle (Compact vs Expanded Mode as specified in PDF Page 6) */}
          <div className={`flex items-center justify-between pb-3 border-b ${cardBorder}`}>
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" style={{ color: theme.accentColor }} />
              <span className="text-xs font-black uppercase tracking-wider" style={{ color: textColor }}>
                {isArabicPage ? "لوحة الطلب والشراء المباشر" : "Product Purchase Panel"}
              </span>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-bold">
              <span className="mr-1 hidden sm:inline" style={{ color: mutedTextColor }}>Display Mode:</span>
              <button
                type="button"
                onClick={() => setProductCardMode("compact")}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  productCardMode === "compact"
                    ? "bg-indigo-500/20 text-indigo-400 font-black"
                    : "hover:opacity-80"
                }`}
                style={{ color: productCardMode === "compact" ? theme.accentColor : mutedTextColor }}
              >
                {isArabicPage ? "مختصر" : "Compact"}
              </button>
              <button
                type="button"
                onClick={() => setProductCardMode("expanded")}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  productCardMode === "expanded"
                    ? "bg-indigo-500/20 text-indigo-400 font-black"
                    : "hover:opacity-80"
                }`}
                style={{ color: productCardMode === "expanded" ? theme.accentColor : mutedTextColor }}
              >
                {isArabicPage ? "موسع" : "Expanded"}
              </button>
            </div>
          </div>

          {/* Product Header & Scarcity Badge */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500/20 text-rose-400 flex items-center gap-1 font-mono border border-rose-500/30">
                  <Flame className="w-3 h-3 fill-rose-500 text-rose-500" />
                  <span>{isArabicPage ? "متبقي 3 نسخ فقط!" : "Only 3 units left in stock!"}</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border" style={{ backgroundColor: itemBg, color: mutedTextColor }}>
                  {isArabicPage ? "الأكثر طلباً" : "No. 1 Best Seller"}
                </span>
              </div>
              <h3 className="text-lg font-black mt-1.5" style={{ color: textColor }}>
                {campaign.product.name}
              </h3>
              <p className="text-xs mt-0.5" style={{ color: mutedTextColor }}>
                {selectedColor} • {selectedSize || (isArabicPage ? "اختر المقاس / الحزمة المطلوبة" : "Select required size")}
              </p>
            </div>

            <div className="text-right shrink-0">
              <div className="text-xl font-black font-mono" style={{ color: textColor }}>
                {basePrice.toLocaleString()} {currency}
              </div>
              {originalPrice > basePrice && (
                <div className="text-xs font-mono line-through" style={{ color: mutedTextColor }}>
                  {originalPrice.toLocaleString()} {currency}
                </div>
              )}
            </div>
          </div>

          {/* EXPANDED MODE: Variant Selectors (PDF Page 6: easily tappable >=44px) */}
          {productCardMode === "expanded" && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              
              {/* Color Swatches */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Select Color: <span className="text-indigo-600">{selectedColor}</span>
                </label>
                <div className="flex items-center gap-2.5">
                  {AVAILABLE_COLORS.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedColor(c.name)}
                      className={`h-11 px-3.5 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                        selectedColor === c.name
                          ? "border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20 text-indigo-900"
                          : "border-slate-200 hover:border-slate-300 text-slate-700"
                      }`}
                    >
                      <span 
                        className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selectors (≥ 44px tap targets for mobile per PDF Page 6 & 9) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    Select Size: <span className={selectedSize ? "text-indigo-600" : "text-rose-500 font-bold"}>
                      {selectedSize || "Required *"}
                    </span>
                  </label>
                  {sizeErrorPrompt && !selectedSize && (
                    <span className="text-[11px] font-bold text-rose-600 flex items-center gap-1 animate-bounce">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Please choose a size</span>
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {AVAILABLE_SIZES.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => {
                        setSelectedSize(sz);
                        setSizeErrorPrompt(false);
                      }}
                      className={`h-11 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center border ${
                        selectedSize === sz
                          ? "border-indigo-600 bg-indigo-600 text-white shadow-xs font-black"
                          : sizeErrorPrompt && !selectedSize
                          ? "border-rose-400 bg-rose-50/50 text-slate-800 hover:border-rose-500"
                          : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Microcopy & Guidance badges (PDF Page 6) */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1">
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Dispatches in 24 Hours</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>SSL Secure Checkout</span>
                </div>
              </div>

            </div>
          )}

          {/* Quick Add Anchor */}
          <div className="pt-2">
            <a
              href="#order-form"
              style={{ backgroundColor: theme.primaryColor }}
              className={`w-full block py-3.5 px-4 text-white text-center font-bold text-xs shadow-xs transition-all hover:opacity-95 cursor-pointer ${
                theme.buttonStyle === "pill" ? "rounded-full" : theme.buttonStyle === "rounded" ? "rounded-xl" : "rounded-none"
              }`}
            >
              {selectedSize ? `Proceed to Checkout with ${selectedSize}` : "Select Size & Complete Order"}
            </a>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* ONE-CLICK CASH ON DELIVERY CHECKOUT FORM (ENGLISH ONLY)                    */}
        {/* ========================================================================= */}
        <div 
          id="order-form" 
          className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6 scroll-mt-20"
        >
          <div className="text-center space-y-2 pb-2 border-b border-slate-100">
            <span className="text-[11px] font-mono font-black uppercase text-indigo-600 tracking-wider">
              Cash on Delivery (COD) Checkout
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Confirm Your Delivery Details
            </h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Pay in cash only after inspecting your parcel at your doorstep. Zero risk guaranteed.
            </p>
          </div>

          {orderCompleted ? (
            <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-in fade-in">
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <h3 className="text-lg font-black text-emerald-950">
                Order Registered Successfully!
              </h3>
              <p className="text-xs text-emerald-800 leading-relaxed max-w-xs mx-auto">
                Thank you, <strong>{customerName}</strong>. Our customer care team will call you at <strong>{customerPhone}</strong> within 30 minutes to confirm dispatch to {customerWilaya}.
              </p>
              <div className="p-3 rounded-xl bg-white border border-emerald-200 text-xs font-mono text-emerald-900 font-bold">
                Order Total: {totalPrice.toLocaleString()} {currency} (Pay on Delivery)
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitOrder} className="space-y-4">
              
              {/* Selected Variant Summary Pill */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">Selected Item:</span>
                  <span className="font-bold text-slate-900">
                    {campaign.product.name} ({selectedColor} • {selectedSize || "Standard"})
                  </span>
                </div>
                <span className="font-mono font-bold text-indigo-600">
                  {basePrice.toLocaleString()} {currency}
                </span>
              </div>

              {/* Quantity Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Quantity:
                </label>
                <div className="flex items-center gap-3">
                  {[1, 2, 3, 4].map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setQuantity(q)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        quantity === q
                          ? "border-indigo-600 bg-indigo-50 text-indigo-700 font-black ring-1 ring-indigo-500"
                          : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {q} {q > 1 ? "Units" : "Unit"}
                      {q >= 2 && (
                        <span className="block text-[9px] font-bold text-emerald-600 mt-0.5">
                          Free Shipping
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Full Name */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Mohamed Amine"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full text-xs px-3.5 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Customer Phone Number */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Phone Number (For Delivery Confirmation) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    required
                    placeholder="05 / 06 / 07 XX XX XX XX"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full text-xs pl-10 pr-3.5 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Customer Wilaya Dropdown */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Province (Wilaya) *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <select
                    value={customerWilaya}
                    onChange={(e) => setCustomerWilaya(e.target.value)}
                    className="w-full text-xs pl-10 pr-8 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none appearance-none cursor-pointer"
                  >
                    {ALGERIAN_WILAYAS.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                </div>
              </div>

              {/* Customer Delivery Address */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Delivery Address / Municipality
                </label>
                <input
                  type="text"
                  placeholder="e.g., District name, street, or landmark"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full text-xs px-3.5 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Order Summary & Pricing Calculation */}
              <div className="p-3.5 rounded-2xl bg-slate-100 text-xs space-y-1.5 border border-slate-200">
                <div className="flex justify-between text-slate-600">
                  <span>Item Subtotal ({quantity} unit{quantity > 1 ? "s" : ""}):</span>
                  <span className="font-mono font-bold">{(basePrice * quantity).toLocaleString()} {currency}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Courier Delivery:</span>
                  <span className="font-mono font-bold">
                    {isFreeShipping ? (
                      <span className="text-emerald-600 font-black">FREE (Special Offer)</span>
                    ) : (
                      `${shippingCost} ${currency}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-950 pt-1.5 border-t border-slate-200">
                  <span>Total Payable Upon Delivery:</span>
                  <span className="font-mono text-indigo-700">{totalPrice.toLocaleString()} {currency}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                style={{ backgroundColor: theme.primaryColor }}
                className={`w-full py-4 px-6 text-white font-black text-sm shadow-md transition-all hover:opacity-90 active:scale-98 cursor-pointer disabled:opacity-50 ${
                  theme.buttonStyle === "pill" ? "rounded-full" : theme.buttonStyle === "rounded" ? "rounded-xl" : "rounded-none"
                }`}
              >
                {isSubmitting ? "Registering Your Order..." : "Confirm Cash on Delivery Order"}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 text-center pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  Inspect your parcel before handing payment to the courier.
                </span>
              </div>
            </form>
          )}

        </div>

      </main>

      {/* ========================================================================= */}
      {/* SECTION 5 (Page 6): STICKY PURCHASE FOOTER (MOBILE SCROLL BAR)            */}
      {/* Sticky bar collapsing with product thumb, price, Add to Cart, prompt     */}
      {/* ========================================================================= */}
      <div 
        style={{ backgroundColor: isDarkTheme ? `${cardBg}F2` : "rgba(255, 255, 255, 0.95)" }}
        className={`fixed bottom-0 left-0 right-0 z-40 backdrop-blur-md border-t ${cardBorder} px-4 py-2.5 shadow-xl sm:hidden`}
      >
        <div className="flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-2.5 min-w-0">
            {campaign.product.imageUrl && (
              <img
                src={campaign.product.imageUrl}
                alt={campaign.product.name}
                className={`w-10 h-10 rounded-lg object-cover border ${cardBorder} shrink-0`}
              />
            )}
            <div className="min-w-0">
              <div className="text-xs font-black truncate" style={{ color: textColor }}>
                {campaign.product.name}
              </div>
              <div className="text-xs font-mono font-bold" style={{ color: theme.accentColor }}>
                {basePrice.toLocaleString()} {currency}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleStickyCtaClick}
            style={{ backgroundColor: theme.primaryColor }}
            className={`px-4 py-2.5 text-white font-black text-xs shadow-md shrink-0 cursor-pointer active:scale-95 transition-transform flex items-center gap-1.5 ${
              theme.buttonStyle === "pill" ? "rounded-full" : theme.buttonStyle === "rounded" ? "rounded-xl" : "rounded-none"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{selectedSize ? (isArabicPage ? "اطلب الآن" : "Order Now") : (isArabicPage ? "اختر الحزمة" : "Select Size")}</span>
          </button>

        </div>
      </div>

      {/* Footer */}
      <footer className={`py-8 text-center text-xs border-t ${cardBorder} mt-12`} style={{ color: mutedTextColor }}>
        <p>© {new Date().getFullYear()} {campaign.product.name}. {isArabicPage ? "جميع الحقوق محفوظة." : "All rights reserved."}</p>
        <p className="text-[10px] mt-1" style={{ color: mutedTextColor }}>
          {isArabicPage ? "خدمة الدفع عند الاستلام والمعاينة قبل السداد متوفرة عبر كامل التراب الوطني." : "Cash on delivery service across all 58 Algerian Wilayas."}
        </p>
      </footer>

    </div>
  );
};
