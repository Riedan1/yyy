import React, { useState } from "react";
import { 
  X, 
  Sparkles, 
  Layers, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  ShoppingBag, 
  Share2, 
  Target,
  FileText,
  Copy
} from "lucide-react";
import { Product } from "../../types";
import { CampaignGoal, GrowthCampaign, GrowthLandingPage, TrafficSourceType } from "../../types/growthStudio";

interface CreateCampaignModalProps {
  storeProducts: Product[];
  onCreated: (newCampaign: GrowthCampaign) => void;
  onClose: () => void;
  isArabic?: boolean;
}

const GOALS: Array<{ id: CampaignGoal; label: string; labelAr: string; desc: string; descAr: string }> = [
  { id: "purchases", label: "Purchases (Orders)", labelAr: "مبيعات وطلبات مؤكدة (Purchases)", desc: "Focus on COD checkout orders", descAr: "التركيز على استمارات الشراء والدفع عند الاستلام" },
  { id: "leads", label: "Leads Generation", labelAr: "جمع بيانات العملاء المهتمين (Leads)", desc: "Focus on capturing customer contacts", descAr: "جمع أرقام الهواتف والأسماء للمعاودة والاتصال" },
  { id: "add_to_cart", label: "Add to Cart", labelAr: "إضافة إلى السلة (Add to Cart)", desc: "Optimize for catalog additions", descAr: "تشجيع الزائر على إضافة عدة منتجات للسلة" },
  { id: "revenue", label: "Maximum Revenue", labelAr: "تعظيم المداخيل وقيمة السلة (Revenue)", desc: "Focus on bundle and high-tier orders", descAr: "التركيز على الباقات والعروض المجمعة لرفع متوسط الطلب" }
];

const ALL_TRAFFIC_SOURCES: TrafficSourceType[] = [
  "Instagram",
  "TikTok",
  "Facebook",
  "Snapchat",
  "Google",
  "WhatsApp"
];

export const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({
  storeProducts,
  onCreated,
  onClose,
  isArabic = false
}) => {
  const [step, setStep] = useState<1 | 2>(1);

  // Form states
  const [name, setName] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<string>(storeProducts[0]?.id || "");
  const [offer, setOffer] = useState("");
  const [selectedSources, setSelectedSources] = useState<TrafficSourceType[]>(["Instagram", "TikTok", "Facebook"]);
  const [goal, setGoal] = useState<CampaignGoal>("purchases");
  const [pagesCount, setPagesCount] = useState<number>(3);
  const [creationMethod, setCreationMethod] = useState<"ai" | "template" | "scratch">("ai");

  const selectedProduct = storeProducts.find((p) => p.id === selectedProductId) || storeProducts[0];

  const toggleSource = (source: TrafficSourceType) => {
    if (selectedSources.includes(source)) {
      if (selectedSources.length > 1) {
        setSelectedSources(selectedSources.filter((s) => s !== source));
      }
    } else {
      setSelectedSources([...selectedSources, source]);
    }
  };

  const handleFinish = () => {
    const defaultProduct = selectedProduct || {
      id: `prod-${Date.now()}`,
      name: name || "Featured Algerian Product",
      price: 4900,
      imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80"
    };

    const campaignSlug = (name || "campaign")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || `campaign-${Date.now()}`;

    // Create pages based on count
    const initialPages: GrowthLandingPage[] = Array.from({ length: pagesCount }).map((_, idx) => {
      const isFirst = idx === 0;
      const isSecond = idx === 1;
      const strategyFocus = isFirst ? "benefits" : isSecond ? "social_proof" : "offer_urgency";
      const share = Math.floor(100 / pagesCount) + (idx === 0 ? 100 % pagesCount : 0);

      return {
        id: `lp-${Date.now()}-${idx + 1}`,
        campaignId: `camp-${Date.now()}`,
        name: `Landing Page 0${idx + 1}`,
        status: "active",
        strategyFocus,
        trafficAllocation: share,
        theme: {
          primaryColor: isFirst ? "#4f46e5" : isSecond ? "#059669" : "#dc2626",
          accentColor: isFirst ? "#06b6d4" : isSecond ? "#10b981" : "#f97316",
          backgroundColor: "#ffffff",
          fontFamily: "Tajawal, sans-serif",
          buttonStyle: "pill",
          badgeText: isFirst ? "الراحة المثالية" : isSecond ? "تقييم 4.9/5 نجوم" : "عرض ترويجي محدود"
        },
        metrics: {
          visitors: 0,
          uniqueVisitors: 0,
          sessions: 0,
          pageViews: 0,
          addToCart: 0,
          checkoutStarted: 0,
          conversions: 0,
          revenue: 0,
          averageOrderValue: defaultProduct.price
        },
        sourceBreakdown: {},
        deviceBreakdown: {
          mobile: { visitors: 0, conversions: 0, revenue: 0 },
          desktop: { visitors: 0, conversions: 0, revenue: 0 },
          tablet: { visitors: 0, conversions: 0, revenue: 0 }
        },
        sections: [
          {
            id: `sec-${idx}-1`,
            type: "hero",
            visible: true,
            headline: isFirst
              ? `اكتشف الفرق الحقيقي مع ${defaultProduct.name}`
              : isSecond
              ? `المنتج الذي وثق به آلاف الجزائريين: ${defaultProduct.name}`
              : `عرض ترويجي خاص على ${defaultProduct.name} - تخفيض فوري!`,
            subheadline: offer || "جودة أصلية مضمونة مع توصيل سريع لجميع ولايات الجزائر والدفع عند الاستلام.",
            badge: isFirst ? "خيار الجودة العالية" : isSecond ? "تقييم الزبائن 5 نجوم" : "عرض محدود",
            ctaText: "اطلب الآن والدفع عند الاستلام",
            imageUrl: defaultProduct.imageUrl
          },
          {
            id: `sec-${idx}-2`,
            type: isFirst ? "benefits" : isSecond ? "testimonials" : "urgency",
            visible: true,
            headline: isFirst ? "أبرز مميزات المنتج" : isSecond ? "شهادات الزبائن الموثقة" : "العداد التنازلي للعرض الترويجي",
            items: [
              { title: "خامات عالية الجودة", description: "تصميم متين يدوم طويلاً ويوفر أقصى درجات الراحة." },
              { title: "ضمان الاستبدال والمعاينة", description: "إمكانية فحص الطرد أمام عامل التوصيل قبل السداد." }
            ]
          },
          {
            id: `sec-${idx}-3`,
            type: "cta",
            visible: true,
            headline: "أكد طلبك الآن بنقرة واحدة",
            subheadline: "املأ البيانات أدناه وسيتم الاتصال بك لتأكيد العنوان والتجهيز فوراً.",
            ctaText: "تأكيد الطلب الترويجي"
          }
        ]
      };
    });

    const newCampaign: GrowthCampaign = {
      id: `camp-${Date.now()}`,
      storeId: "store-1",
      name: name.trim() || `Campaign ${new Date().toLocaleDateString()}`,
      product: {
        id: defaultProduct.id,
        name: defaultProduct.name,
        price: defaultProduct.price,
        imageUrl: defaultProduct.imageUrl,
        description: defaultProduct.description
      },
      offer: offer.trim() || "عرض خاص مع توصيل سريع والدفع عند الاستلام",
      trafficSources: selectedSources,
      goal,
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      distributionMode: "smart",
      distributionRationale: "Initial smart traffic split allocated equally across landing pages.",
      smartLinkSlug: campaignSlug,
      landingPages: initialPages,
      settings: {
        confidenceThreshold: 150,
        autoOptimize: true,
        pixelTracking: true
      }
    };

    onCreated(newCampaign);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-5 text-left max-h-[90vh] overflow-y-auto">
        
        {/* Header & Step Indicator */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block">
              {isArabic ? `الخطوة ${step} من 2` : `Step ${step} of 2`}
            </span>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              {step === 1
                ? (isArabic ? "تفاصيل الحملة الإعلانية (Campaign Details)" : "Campaign Details")
                : (isArabic ? "إنشاء صفحات الهبوط (Create Landing Pages)" : "Configure Landing Pages")}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: CAMPAIGN DETAILS */}
        {step === 1 ? (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {isArabic ? "اسم الحملة (Campaign Name)" : "Campaign Name"}
              </label>
              <input
                type="text"
                placeholder={isArabic ? "مثال: Summer Shoes Campaign 2026" : "e.g., Summer Shoes 2026 Promo"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {isArabic ? "المنتج المراد ترويجه (Select Product)" : "Select Store Product"}
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {storeProducts.map((prod) => (
                  <option key={prod.id} value={prod.id}>
                    {prod.name} • {prod.price.toLocaleString()} DA
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {isArabic ? "العرض التسويقي الرئيسي (Special Offer)" : "Promotional Offer"}
              </label>
              <input
                type="text"
                placeholder={isArabic ? "مثال: خصم 25% + توصيل مجاني عند طلب قطعتين" : "e.g., Buy 1 Get 1 50% Off + Free Shipping"}
                value={offer}
                onChange={(e) => setOffer(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Traffic Sources */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                {isArabic ? "المنصات الإعلانية المستهدفة (Traffic Sources)" : "Ad Traffic Sources"}
              </label>
              <div className="flex flex-wrap gap-2">
                {ALL_TRAFFIC_SOURCES.map((source) => {
                  const isChecked = selectedSources.includes(source);
                  return (
                    <button
                      key={source}
                      type="button"
                      onClick={() => toggleSource(source)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                        isChecked
                          ? "bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700"
                          : "bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                      <span>{source}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Goals */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                {isArabic ? "الهدف الأساسي للحملة (Campaign Goal)" : "Primary Campaign Goal"}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {GOALS.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setGoal(g.id)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      goal === g.id
                        ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-slate-900 dark:text-white shadow-2xs"
                        : "border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <span className="text-xs font-bold block">{isArabic ? g.labelAr : g.label}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                      {isArabic ? g.descAr : g.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* STEP 2: NUMBER OF LANDING PAGES & METHOD */
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                {isArabic ? "كم عدد صفحات الهبوط التي ترغب باختبارها؟" : "How many landing pages do you want to test?"}
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[2, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setPagesCount(num)}
                    className={`py-2.5 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                      pagesCount === num
                        ? "border-indigo-600 bg-indigo-600 text-white shadow-xs"
                        : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {num} Pages
                  </button>
                ))}
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1.5">
                {isArabic
                  ? "سيتم توزيع الزيارات تلقائياً بين هذه الصفحات عبر رابط إعلاني موحد Smart Campaign Link."
                  : "Traffic will be divided across these pages automatically via a single Smart Link."}
              </span>
            </div>

            {/* Creation Method */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                {isArabic ? "طريقة إنشاء الصفحات:" : "Creation Method:"}
              </label>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setCreationMethod("ai")}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                    creationMethod === "ai"
                      ? "border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-slate-900 dark:text-white"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">
                      {isArabic ? "توليد استراتيجيات ذكية بالذكاء الاصطناعي (Generate with AI)" : "Generate with AI (Recommended)"}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5 block">
                      {isArabic
                        ? "إنشاء صفحات بزوايا تسويقية متباينة (صفحة تركز على الفوائد، صفحة تركز على التقييمات، وصفحة تركز على العرض السريع)."
                        : "Creates distinct pages focusing on benefits, social proof, and flash offer urgency."}
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setCreationMethod("template")}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                    creationMethod === "template"
                      ? "border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-slate-900 dark:text-white"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">
                      {isArabic ? "استخدام قوالب التجارة الإلكترونية الجاهزة" : "Use High-Converting E-Commerce Templates"}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5 block">
                      {isArabic
                        ? "قوالب مصممة مسبقاً ومطابقة لنمط الدفع عند الاستلام والتوصيل للـ 58 ولاية."
                        : "Battle-tested mobile landing page layouts tailored for Algerian COD buyers."}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          {step === 2 ? (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isArabic ? "السابق" : "Back"}</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              {isArabic ? "إلغاء" : "Cancel"}
            </button>

            {step === 1 ? (
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!name.trim()}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                <span>{isArabic ? "التالي: إعداد الصفحات" : "Next: Configure Pages"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>{isArabic ? "إنشاء الحملة وإطلاقها" : "Create Campaign"}</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
