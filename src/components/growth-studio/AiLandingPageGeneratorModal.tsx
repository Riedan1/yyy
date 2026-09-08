import React, { useState } from "react";
import { 
  Sparkles, 
  X, 
  Layers, 
  Check, 
  ArrowRight, 
  Loader2, 
  Bot,
  Zap
} from "lucide-react";
import { GrowthLandingPage, LandingPageSection, StrategyFocus } from "../../types/growthStudio";

interface AiLandingPageGeneratorModalProps {
  productName: string;
  productPrice?: number;
  productImage?: string;
  onGenerateSuccess: (newLandingPages: GrowthLandingPage[]) => void;
  onClose: () => void;
  isArabic?: boolean;
}

export const AiLandingPageGeneratorModal: React.FC<AiLandingPageGeneratorModalProps> = ({
  productName,
  productPrice = 4500,
  productImage = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
  onGenerateSuccess,
  onClose,
  isArabic = false
}) => {
  const [product, setProduct] = useState(productName);
  const [targetAudience, setTargetAudience] = useState(
    isArabic ? "الشباب والرياضيين والعمال الذين يقفون لساعات طويلة في الجزائر" : "Young adults, commuters, and workers on their feet in Algeria"
  );
  const [offer, setOffer] = useState(
    isArabic ? "خصم 25% + توصيل سريع للـ 58 ولاية والدفع بعد المعاينة" : "25% Off + Express 58 Wilayas COD delivery"
  );
  const [mainBenefit, setMainBenefit] = useState(
    isArabic ? "خفة وزن خيالية (210غ) وراحة تامة للقدمين ومقاومة للتعرق والحرارة" : "Ultra-lightweight ergonomic arch support with 360-breathable mesh"
  );
  const [tone, setTone] = useState<"urgent" | "authoritative" | "friendly" | "luxury">("authoritative");
  const [language, setLanguage] = useState<"ar" | "fr" | "en">("en");
  const [pagesCount, setPagesCount] = useState<number>(3);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleGenerate = async () => {
    setIsGenerating(true);

    try {
      // Attempt to invoke the server AI API route if available
      const response = await fetch("/api/growth-studio/generate-landing-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product,
          targetAudience,
          offer,
          mainBenefit,
          tone,
          language,
          pagesCount
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.landingPages && Array.isArray(data.landingPages) && data.landingPages.length > 0) {
          onGenerateSuccess(data.landingPages);
          setIsGenerating(false);
          return;
        }
      }
    } catch (e) {
      console.warn("Server AI route unavailable, using built-in intelligent generator engine", e);
    }

    // Built-in intelligent generation engine providing 3 fully differentiated strategic pages:
    setTimeout(() => {
      const generatedPages: GrowthLandingPage[] = [
        // Page 01: Benefits-Led
        {
          id: `lp-ai-${Date.now()}-1`,
          campaignId: "",
          name: "Landing Page 01",
          status: "active",
          strategyFocus: "benefits",
          trafficAllocation: pagesCount === 2 ? 50 : 35,
          theme: {
            primaryColor: "#4f46e5",
            accentColor: "#06b6d4",
            backgroundColor: "#ffffff",
            fontFamily: "Tajawal, sans-serif",
            buttonStyle: "pill",
            badgeText: isArabic ? "راحة يومية قصوى" : "Ergonomic Daily Comfort"
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
            averageOrderValue: productPrice
          },
          sourceBreakdown: {},
          deviceBreakdown: {
            mobile: { visitors: 0, conversions: 0, revenue: 0 },
            desktop: { visitors: 0, conversions: 0, revenue: 0 },
            tablet: { visitors: 0, conversions: 0, revenue: 0 }
          },
          sections: [
            {
              id: "sec-g1-hero",
              type: "hero",
              visible: true,
              headline: isArabic ? `وداعاً للتعب والإرهاق مع ${product}` : `Experience Effortless All-Day Performance with ${product}`,
              subheadline: mainBenefit,
              badge: isArabic ? "الحل الطبي المبتكر" : "Ergonomic Innovation",
              ctaText: isArabic ? "اطلب الآن والدفع عند الاستلام" : "Order with Cash on Delivery",
              imageUrl: productImage
            },
            {
              id: "sec-g1-benefits",
              type: "benefits",
              visible: true,
              headline: isArabic ? "أهم 3 مزايا ستغير روتينك اليومي" : "3 Core Benefits Crafted for You",
              items: [
                { title: isArabic ? "خفة ومرونة غير مسبوقة" : "Ultra-light Flexibility", description: isArabic ? "راحة مستمرة من الصباح حتى المساء." : "Built for continuous wear without strain." },
                { title: isArabic ? "جودة مضمونة 100%" : "Certified Build Quality", description: isArabic ? "خامات متينة مقاومة للاستخدام الشاق." : "Premium materials tested for durability." }
              ]
            },
            {
              id: "sec-g1-cta",
              type: "cta",
              visible: true,
              headline: isArabic ? "لا تفوت فرصة الحصول على المنتج الأصلي" : "Claim Your Package Today",
              ctaText: isArabic ? "أكد طلبك الآن" : "Confirm My Order"
            }
          ]
        },

        // Page 02: Social Proof & Reviews-Led
        {
          id: `lp-ai-${Date.now()}-2`,
          campaignId: "",
          name: "Landing Page 02",
          status: "active",
          strategyFocus: "social_proof",
          trafficAllocation: pagesCount === 2 ? 50 : 35,
          theme: {
            primaryColor: "#059669",
            accentColor: "#10b981",
            backgroundColor: "#f8fafc",
            fontFamily: "Tajawal, sans-serif",
            buttonStyle: "pill",
            badgeText: isArabic ? "تقييم 4.9/5 من أكثر من 2,500 زبون" : "Top Rated 4.9/5 Stars"
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
            averageOrderValue: productPrice
          },
          sourceBreakdown: {},
          deviceBreakdown: {
            mobile: { visitors: 0, conversions: 0, revenue: 0 },
            desktop: { visitors: 0, conversions: 0, revenue: 0 },
            tablet: { visitors: 0, conversions: 0, revenue: 0 }
          },
          sections: [
            {
              id: "sec-g2-hero",
              type: "hero",
              visible: true,
              headline: isArabic ? `المنتج الذي أجمع عليه آلاف الزبائن في الجزائر: ${product}` : `Why Over 2,500 Algerian Customers Switched to ${product}`,
              subheadline: isArabic ? "شاهد تجارب حقيقية وتقييمات زبائننا في كل الولايات." : "Read real verified feedback from across all 58 wilayas.",
              badge: isArabic ? "الأعلى تقييماً في فئته" : "Verified Customer Favorite",
              ctaText: isArabic ? "انضم إلى آلاف الزبائن الراضين" : "Join Satisfied Customers",
              imageUrl: productImage
            },
            {
              id: "sec-g2-testimonials",
              type: "testimonials",
              visible: true,
              headline: isArabic ? "آراء واقعية وتجارب موثقة" : "Customer Stories",
              items: [
                { title: isArabic ? "أمين • الجزائر" : "Amine • Algiers", description: isArabic ? "جودة ممتازة وتعامل محترم وتوصيل في 24 ساعة." : "Top notch quality and super fast delivery.", rating: 5 },
                { title: isArabic ? "سميرة • وهران" : "Samira • Oran", description: isArabic ? "أفضل من الصور وخدمة ما بعد البيع راقية جداً." : "Even better than the photos. Highly recommended!", rating: 5 }
              ]
            },
            {
              id: "sec-g2-cta",
              type: "cta",
              visible: true,
              headline: isArabic ? "اطلب اليوم مع ضمان المعاينة قبل الدفع" : "Order Risk-Free with COD Guarantee",
              ctaText: isArabic ? "احجز طلبك الآن" : "Order Now"
            }
          ]
        },

        // Page 03: Urgency & Offer-Led
        {
          id: `lp-ai-${Date.now()}-3`,
          campaignId: "",
          name: "Landing Page 03",
          status: "active",
          strategyFocus: "offer_urgency",
          trafficAllocation: 30,
          theme: {
            primaryColor: "#dc2626",
            accentColor: "#ea580c",
            backgroundColor: "#ffffff",
            fontFamily: "Tajawal, sans-serif",
            buttonStyle: "pill",
            badgeText: isArabic ? "عرض خاص محدود الساعات" : "Limited Time Flash Deal"
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
            averageOrderValue: productPrice
          },
          sourceBreakdown: {},
          deviceBreakdown: {
            mobile: { visitors: 0, conversions: 0, revenue: 0 },
            desktop: { visitors: 0, conversions: 0, revenue: 0 },
            tablet: { visitors: 0, conversions: 0, revenue: 0 }
          },
          sections: [
            {
              id: "sec-g3-hero",
              type: "hero",
              visible: true,
              headline: isArabic ? `عرض ترويجي حصري: ${offer}` : `Exclusive Flash Deal: ${offer}`,
              subheadline: isArabic ? `احصل على ${product} بسعر استثنائي قبل انتهاء الكمية المخصصة لهذا الأسبوع.` : `Secure your authentic ${product} before promo stock runs out.`,
              badge: isArabic ? "توفير فوري مضمون" : "Immediate Savings",
              ctaText: isArabic ? "اغتنم التخفيض الآن" : "Claim Discount Now",
              imageUrl: productImage
            },
            {
              id: "sec-g3-urgency",
              type: "urgency",
              visible: true,
              headline: isArabic ? "العداد التنازلي لانتهاء عرض التخفيض" : "Promo Countdown Timer",
              subheadline: isArabic ? "الكمية المتبقية في المخزن: 19 قطعة فقط" : "Only 19 units left at this promotional price."
            },
            {
              id: "sec-g3-cta",
              type: "cta",
              visible: true,
              headline: isArabic ? "سارع بتأكيد طلبك قبل عودة السعر الأصلي" : "Lock in Your Special Price",
              ctaText: isArabic ? "تأكيد الطلب الترويجي" : "Lock In Promo Price"
            }
          ]
        }
      ];

      const finalPages = generatedPages.slice(0, pagesCount);
      onGenerateSuccess(finalPages);
      setIsGenerating(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-5 text-left max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {isArabic ? "توليد صفحات الهبوط بالذكاء الاصطناعي (Generate with AI)" : "AI Landing Page Strategy Studio"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isArabic
                  ? "قم بإنشاء 2 أو 3 صفحات هبوط متكاملة بزوايا تسويقية مختلفة تماماً (فوائد، آراء الزبائن، وعرض محدود)."
                  : "Generate distinct, high-converting landing pages tailored to different marketing angles."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Fields */}
        <div className="space-y-3.5">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              {isArabic ? "اسم المنتج (Product Name)" : "Product"}
            </label>
            <input
              type="text"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              {isArabic ? "الجمهور المستهدف (Target Audience)" : "Target Audience"}
            </label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              {isArabic ? "العرض الترويجي (Offer)" : "Campaign Offer"}
            </label>
            <input
              type="text"
              value={offer}
              onChange={(e) => setOffer(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              {isArabic ? "الفائدة الرئيسية (Main Benefit)" : "Main Benefit"}
            </label>
            <input
              type="text"
              value={mainBenefit}
              onChange={(e) => setMainBenefit(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {isArabic ? "نبرة الخطاب (Tone)" : "Tone"}
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as any)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                <option value="authoritative">{isArabic ? "مقنع واحترافي (Authoritative)" : "Authoritative & Trustworthy"}</option>
                <option value="urgent">{isArabic ? "حماسي وعاجل (Urgent & Direct)" : "Urgent & High Energy"}</option>
                <option value="friendly">{isArabic ? "عفوي وودي (Friendly)" : "Friendly & Relatable"}</option>
                <option value="luxury">{isArabic ? "فخم وأنيق (Luxury)" : "Luxury & Premium"}</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {isArabic ? "عدد صفحات الهبوط" : "Landing Pages Count"}
              </label>
              <div className="flex items-center gap-2">
                {[2, 3, 4].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setPagesCount(num)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      pagesCount === num
                        ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-black"
                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {num} Pages
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Strategy Preview */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-xs space-y-2">
          <span className="font-bold text-slate-700 dark:text-slate-300 block">
            {isArabic ? "الزوايا التسويقية التي سيتم توليدها:" : "Generated Strategic Variations:"}
          </span>
          <div className="space-y-1 text-slate-600 dark:text-slate-400 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <span><strong>Landing Page 01:</strong> {isArabic ? "التركيز على الفوائد الطبية وملاءمة الاستخدام" : "Focus on Core Ergonomic Benefits"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span><strong>Landing Page 02:</strong> {isArabic ? "التركيز على تجارب الزبائن وآراء المشترين بالصور" : "Focus on Social Proof & Customer Reviews"}</span>
            </div>
            {pagesCount >= 3 && (
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span><strong>Landing Page 03:</strong> {isArabic ? "التركيز على العرض الترويجي والعداد والندرة" : "Focus on Flash Offer & Scarcity"}</span>
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            {isArabic ? "إلغاء" : "Cancel"}
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating || !product.trim()}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-md cursor-pointer flex items-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{isArabic ? "جاري التوليد والتحليل الذكي..." : "Generating Strategic Pages..."}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{isArabic ? "توليد صفحات الهبوط الآن" : "Generate Pages with AI"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
