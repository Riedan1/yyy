import React, { useState, useEffect, useRef, useMemo } from "react";
import { 
  Sparkles, 
  Camera, 
  Image as ImageIcon, 
  Type, 
  FileText, 
  DollarSign, 
  MessageSquare, 
  Globe, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Upload, 
  ChevronDown, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  Star, 
  Clock, 
  ShoppingBag, 
  X, 
  RefreshCw,
  Sliders,
  Layers
} from "lucide-react";
import { Product } from "../../types";
import { GrowthLandingPage, LandingPageSection } from "../../types/growthStudio";
import { GROWTH_TEMPLATES_CATALOG, GrowthTemplateDefinition } from "../../data/growthStudioPdfData";

interface CreateLandingPageWizardModalProps {
  storeProducts: Product[];
  storeInfo?: {
    name: string;
    logo?: string;
    description?: string;
  };
  onComplete: (newPage: GrowthLandingPage, selectedProduct: Product, method: "template" | "manual" | "ai") => void;
  onClose: () => void;
}

type LocaleOption = "SA AR" | "DZ AR" | "EN GB" | "FR FR";

interface MarketOption {
  code: string;
  country: string;
  countryAr: string;
  currency: string;
  symbol: string;
  lang: "ar" | "en" | "fr";
}

const MARKET_OPTIONS: MarketOption[] = [
  { code: "DZ", country: "Algeria", countryAr: "الجزائر", currency: "DZD", symbol: "د.ج", lang: "ar" },
  { code: "QA", country: "Qatar", countryAr: "قطر", currency: "QAR", symbol: "ر.ق", lang: "ar" },
  { code: "EG", country: "Egypt", countryAr: "مصر", currency: "EGP", symbol: "ج.م", lang: "ar" },
  { code: "TN", country: "Tunisia", countryAr: "تونس", currency: "TND", symbol: "د.ت", lang: "ar" },
  { code: "LY", country: "Libya", countryAr: "ليبيا", currency: "LYD", symbol: "د.ل", lang: "ar" },
  { code: "MA", country: "Morocco", countryAr: "المغرب", currency: "MAD", symbol: "د.م", lang: "ar" },
  { code: "AE", country: "UAE", countryAr: "الإمارات", currency: "AED", symbol: "د.إ", lang: "ar" },
  { code: "SA", country: "Saudi Arabia", countryAr: "السعودية", currency: "SAR", symbol: "ر.س", lang: "ar" },
  { code: "GB", country: "English", countryAr: "المملكة المتحدة", currency: "USD", symbol: "$", lang: "en" },
];

const QUICK_CURRENCIES = [
  "MAD", "TND", "LYD", "EGP", "QAR", "DZD", "EUR", "USD", "AED", "SAR"
];

const QUICK_SUGGESTIONS_AR = [
  "التوصيل متاح",
  "عرض محدود",
  "خصم خاص",
  "توصيل مجاني",
  "الأكثر مبيعاً",
  "وصل حديثاً"
];

const QUICK_SUGGESTIONS_EN = [
  "Fast Delivery Available",
  "Limited Time Offer",
  "Special Discount",
  "Free Shipping",
  "Best Seller",
  "Newly Arrived"
];

export const CreateLandingPageWizardModal: React.FC<CreateLandingPageWizardModalProps> = ({
  storeProducts,
  storeInfo = { name: "Yume Store" },
  onComplete,
  onClose
}) => {
  // Locale state (matching the SA AR selector in screenshot 1)
  const [activeLocale, setActiveLocale] = useState<LocaleOption>("SA AR");
  const [showLocaleDropdown, setShowLocaleDropdown] = useState(false);
  const isArabic = activeLocale.includes("AR");

  // 6 Steps State (1 to 6)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Product Image
  const [productImage, setProductImage] = useState<string>(
    storeProducts[0]?.imageUrl || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80"
  );
  const [showCatalogPicker, setShowCatalogPicker] = useState<boolean>(false);

  // Step 2: Product Name
  const [productName, setProductName] = useState<string>(storeProducts[0]?.name || "");

  // Step 3: Product Description / Features
  const [productDescription, setProductDescription] = useState<string>(
    storeProducts[0]?.description_en || storeProducts[0]?.description || ""
  );

  // Step 4: Price & Currency
  const [price, setPrice] = useState<string>(storeProducts[0]?.price?.toString() || "4900");
  const [selectedCurrency, setSelectedCurrency] = useState<string>("DZD");
  const [comparePrice, setComparePrice] = useState<string>(
    storeProducts[0]?.buyPrice ? storeProducts[0].buyPrice.toString() : "6900"
  );

  // Step 5: Special Instructions
  const [instructions, setInstructions] = useState<string>("");

  // Step 6: Language & Market
  const [selectedMarketCode, setSelectedMarketCode] = useState<string>("DZ");

  // Step 6: Template Archetype Selection
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("auto");

  // Resolve template archetype based on user choice or auto-detection from product details
  const resolvedTemplate: GrowthTemplateDefinition = useMemo(() => {
    if (selectedTemplateId && selectedTemplateId !== "auto") {
      const found = GROWTH_TEMPLATES_CATALOG.find((t) => t.id === selectedTemplateId);
      if (found) return found;
    }
    const text = `${productName} ${productDescription} ${instructions}`.toLowerCase();
    if (text.includes("تداول") || text.includes("trading") || text.includes("كتاب") || text.includes("book") || text.includes("finance") || text.includes("crypto") || text.includes("استثمار")) {
      return GROWTH_TEMPLATES_CATALOG.find((t) => t.id === "template-arabic-trading-book") || GROWTH_TEMPLATES_CATALOG[0];
    }
    if (text.includes("ساعة") || text.includes("watch") || text.includes("عطر") || text.includes("perfume") || text.includes("luxury") || text.includes("فاخر")) {
      return GROWTH_TEMPLATES_CATALOG.find((t) => t.id === "template-luxury-obsidian") || GROWTH_TEMPLATES_CATALOG[0];
    }
    if (text.includes("سماعة") || text.includes("gadget") || text.includes("phone") || text.includes("tech") || text.includes("charger") || text.includes("إلكترون")) {
      return GROWTH_TEMPLATES_CATALOG.find((t) => t.id === "template-tech-gadget") || GROWTH_TEMPLATES_CATALOG[0];
    }
    if (text.includes("بشرة") || text.includes("skin") || text.includes("cream") || text.includes("cosmetic") || text.includes("organic") || text.includes("طبيعي")) {
      return GROWTH_TEMPLATES_CATALOG.find((t) => t.id === "template-emerald-wellness") || GROWTH_TEMPLATES_CATALOG[0];
    }
    if (text.includes("تخفيض") || text.includes("flash") || text.includes("تصفية") || text.includes("sale")) {
      return GROWTH_TEMPLATES_CATALOG.find((t) => t.id === "template-flash-sale-red") || GROWTH_TEMPLATES_CATALOG[0];
    }
    return GROWTH_TEMPLATES_CATALOG[0];
  }, [selectedTemplateId, productName, productDescription, instructions]);

  // Generation Progress Phase (Screenshot 7)
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationProgress, setGenerationProgress] = useState<number>(2);
  const [generationStage, setGenerationStage] = useState<number>(1);

  // File input refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Pre-load default product data on mount if available
  useEffect(() => {
    if (storeProducts && storeProducts.length > 0 && !productName) {
      const defaultProd = storeProducts[0];
      setProductName(defaultProd.name);
      if (defaultProd.imageUrl) setProductImage(defaultProd.imageUrl);
      if (defaultProd.price) {
        setPrice(defaultProd.price.toString());
        setComparePrice(Math.round(defaultProd.price * 1.35).toString());
      }
      if (defaultProd.description_en || defaultProd.description) {
        setProductDescription(defaultProd.description_en || defaultProd.description || "");
      }
    }
  }, [storeProducts]);

  // Handle image upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProductImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Add suggestion tag to instructions
  const handleAddSuggestion = (tag: string) => {
    if (!instructions.includes(tag)) {
      setInstructions((prev) => (prev ? `${prev}، ${tag}` : tag));
    }
  };

  // Trigger Generation phase (Screenshot 7)
  const startGenerationPhase = () => {
    setIsGenerating(true);
    setGenerationProgress(2);
    setGenerationStage(1);

    // Progressive animation for the 4 stages
    const timer1 = setTimeout(() => {
      setGenerationProgress(28);
      setGenerationStage(2);
    }, 900);

    const timer2 = setTimeout(() => {
      setGenerationProgress(65);
      setGenerationStage(3);
    }, 1900);

    const timer3 = setTimeout(() => {
      setGenerationProgress(92);
      setGenerationStage(4);
    }, 3000);

    const timer4 = setTimeout(() => {
      setGenerationProgress(100);
      finalizeGeneratedLandingPage();
    }, 3900);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  };

  // Finalize and construct the complete base of the landing page
  const finalizeGeneratedLandingPage = () => {
    const targetMarket = MARKET_OPTIONS.find((m) => m.code === selectedMarketCode) || MARKET_OPTIONS[0];
    const numericPrice = Number(price) || 4900;
    const numericComparePrice = Number(comparePrice) || Math.round(numericPrice * 1.35);
    const finalName = productName.trim() || (isArabic ? "المنتج المبتكر الفاخر" : "Premium Ergonomic Product");
    const finalDescription = productDescription.trim() || (
      isArabic 
        ? "تصميم متطور يجمع بين الراحة الفائقة والجودة العالية لضمان رضاك التام مع فحص المنتج عند الاستلام."
        : "Engineered with superior craftsmanship and ergonomic support for exceptional everyday performance."
    );

    // Construct the rich base sections
    const baseSections: LandingPageSection[] = [
      // 1. Hero Section
      {
        id: `sec-${Date.now()}-hero`,
        type: "hero",
        visible: true,
        headline: isArabic ? `${finalName} — الخيار الأفضل لراحتك اليومية` : `${finalName} — Ultimate Everyday Comfort`,
        subheadline: finalDescription,
        badge: isArabic ? "الأكثر طلباً • ضمان استرجاع 100%" : "Best Seller • 100% Satisfaction Guarantee",
        imageUrl: productImage,
        price: numericPrice,
        originalPrice: numericComparePrice,
        ctaText: isArabic ? "اطلب الآن - الدفع عند الاستلام" : "Order Now - Cash on Delivery",
        ctaSubtext: isArabic ? "شحن سريع لكافة الولايات مع معاينة قبل الدفع" : "Fast delivery across 58 wilayas with inspection",
        items: [
          { title: isArabic ? "توصيل سريع" : "Fast Delivery", description: isArabic ? "خلال 24-48 ساعة إلى باب منزلك" : "Within 24-48 hours directly to your door" },
          { title: isArabic ? "الدفع عند الاستلام" : "Cash on Delivery", description: isArabic ? "افحص المنتج وتأكد منه قبل السداد" : "Inspect package thoroughly before payment" },
          { title: isArabic ? "ضمان أصلي" : "Original Guarantee", description: isArabic ? "منتج أصلي 100% مع خدمة ما بعد البيع" : "100% authentic merchandise with after-sales support" }
        ]
      },
      // 2. Urgency & Stock Banner
      {
        id: `sec-${Date.now()}-urgency`,
        type: "urgency",
        visible: true,
        headline: isArabic ? "عرض خاص لفترة محدودة — ينتهي قريباً!" : "Limited Time Promotional Offer — Ending Soon!",
        subheadline: isArabic ? "خصم يصل إلى 35% مع توصيل سريع. بقي 7 قطع فقط في المخزن!" : "Save up to 35% with express courier. Only 7 units left in stock!",
        badge: isArabic ? "عرض حصري" : "Flash Sale",
        items: [
          { title: isArabic ? "الوحدات المتبقية" : "Remaining Stock", description: "7 units left" },
          { title: isArabic ? "انتهاء العرض" : "Offer Ends", description: "04:32:18" }
        ]
      },
      // 3. Product Features & Fast Checkout Card
      {
        id: `sec-${Date.now()}-product`,
        type: "product",
        visible: true,
        headline: isArabic ? "مواصفات المنتج وخيارات الطلب الفوري" : "Product Specifications & Instant Order",
        subheadline: isArabic ? "اختر اللون والمقاس المناسب، واملأ بياناتك للدفع عند الاستلام" : "Select your preferred color and size, and fill your info for cash on delivery",
        price: numericPrice,
        originalPrice: numericComparePrice,
        imageUrl: productImage,
        ctaText: isArabic ? "تأكيد الطلب الفوري" : "Confirm Instant Order",
        items: [
          { title: isArabic ? "خامة ممتازة" : "Premium Materials", description: isArabic ? "أقمشة قابلة للتنفس ومقاومة للتآكل اليومي" : "Breathable, high-density wear-resistant materials" },
          { title: isArabic ? "تصميم مريح" : "Ergonomic Contour", description: isArabic ? "دعم كامل للقدمين والظهر طوال ساعات العمل" : "Total contour support for all-day active posture" },
          { title: isArabic ? "خفة وزن استثنائية" : "Ultra Lightweight", description: isArabic ? "وزن خفيف جداً يمنحك شعوراً بحرية الحركة" : "Lightweight engineering (210g) for seamless motion" }
        ]
      },
      // 4. Value Proposition / Key Benefits
      {
        id: `sec-${Date.now()}-benefits`,
        type: "benefits",
        visible: true,
        headline: isArabic ? "لماذا يثق بنا آلاف العملاء؟" : "Why Thousands of Customers Trust Us",
        subheadline: isArabic ? "معايير صارمة للجودة وتجربة تسوق آمنة ومريحة" : "Rigorous quality benchmarks and a safe, effortless shopping experience",
        items: [
          { title: isArabic ? "فحص الطرد قبل السداد" : "Doorstep Inspection", description: isArabic ? "لك كامل الحق في فتح الطرد ومعاينته أمام عامل التوصيل قبل دفع أي دينار." : "Open and inspect your product with the courier before paying." },
          { title: isArabic ? "توصيل لكافة الولايات" : "Nationwide Coverage", description: isArabic ? "شبكة شحن تغطي كافة المناطق بسرعة فائقة واحترافية." : "Direct express logistics network delivering to your doorstep." },
          { title: isArabic ? "خدمة عملاء متواصلة" : "24/7 Dedicated Support", description: isArabic ? "فريق عمل محترف وجاهز للإجابة على جميع استفساراتك هاتفياً وعبر الواتساب." : "Our support team is always accessible via phone and WhatsApp." }
        ]
      },
      // 5. Testimonials & Social Proof
      {
        id: `sec-${Date.now()}-testimonials`,
        type: "testimonials",
        visible: true,
        headline: isArabic ? "آراء وتقييمات عملائنا الكرام" : "Verified Customer Reviews",
        subheadline: isArabic ? "أكثر من 1,420 عميل سعيد بتجربتهم معنا" : "Over 1,420 satisfied buyers across all regions",
        items: [
          {
            title: isArabic ? "منتج ممتاز وتوصيل في الموعد" : "Exceptional quality and prompt courier",
            description: isArabic ? "استلمت الطلب في الجزائر العاصمة وفتحت الطرد قبل الدفع، الجودة فاقت التوقعات والراحة ممتازة." : "Received the package on time. Inspected before paying and the build quality is outstanding.",
            author: isArabic ? "أحمد بن عيسى" : "Karim B.",
            authorLocation: isArabic ? "الجزائر العاصمة" : "Algiers",
            rating: 5
          },
          {
            title: isArabic ? "راحة خيالية وسعر معقول" : "Unbelievable comfort and fair pricing",
            description: isArabic ? "أعجبني التصميم وخفة الوزن، أستخدمه يومياً في العمل ولم أعد أشعر بالتعب. شكراً جزيلاً!" : "Loved the lightweight fit. Use it everyday for work and back fatigue is completely gone.",
            author: isArabic ? "يوسف مراد" : "Samir M.",
            authorLocation: isArabic ? "وهران" : "Oran",
            rating: 5
          },
          {
            title: isArabic ? "خدمة ما بعد البيع في القمة" : "Top tier customer service",
            description: isArabic ? "تم تأكيد طلبي هاتفياً في نفس الساعة ووصلني خلال يومين فقط. أنصح الجميع بالتعامل معهم." : "My order was confirmed immediately by phone and arrived in two days. Highly recommended.",
            author: isArabic ? "فاطمة الزهراء" : "Amira Z.",
            authorLocation: isArabic ? "قسنطينة" : "Constantine",
            rating: 5
          }
        ]
      },
      // 6. Guarantee & Safety
      {
        id: `sec-${Date.now()}-guarantee`,
        type: "guarantee",
        visible: true,
        headline: isArabic ? "ضمان الرضا الذهبي 100%" : "100% Golden Satisfaction Guarantee",
        subheadline: isArabic ? "حق الاستبدال أو الاسترجاع مضمون بالكامل في حال وجود أي عيب مصنعي." : "Hassle-free replacement or refund guarantee in case of any manufacturing issue.",
        badge: isArabic ? "أمان تام" : "100% Risk Free",
        ctaText: isArabic ? "اطلب نسختك الآن" : "Claim Your Order Today"
      },
      // 7. FAQ Section
      {
        id: `sec-${Date.now()}-faq`,
        type: "faq",
        visible: true,
        headline: isArabic ? "الأسئلة الشائعة" : "Frequently Asked Questions",
        subheadline: isArabic ? "كل ما تريد معرفته عن الطلب والاستلام" : "Everything you need to know about ordering and delivery",
        items: [
          { title: isArabic ? "كيف تتم عملية الدفع؟" : "How does payment work?", description: isArabic ? "الدفع يتم نقداً عند الاستلام (COD). لا تدفع أي شيء مسبقاً حتى تستلم طردك وتتفحصه." : "Payment is strictly Cash on Delivery. You pay nothing in advance until you inspect your item." },
          { title: isArabic ? "كم يستغرق التوصيل؟" : "How long does delivery take?", description: isArabic ? "يستغرق التوصيل بين 24 إلى 48 ساعة لمعظم الولايات الكبرى، و72 ساعة للمناطق الجنوبية." : "Delivery usually takes 24-48 hours for main provinces and up to 72 hours for southern regions." },
          { title: isArabic ? "ماذا لو لم يناسبني المقاس؟" : "What if the size doesn't fit?", description: isArabic ? "نوفر خدمة الاستبدال المجاني للمقاس خلال 3 أيام من تاريخ الاستلام بكل سهولة." : "We offer seamless free size exchange within 3 days of delivery." }
        ]
      },
      // 8. Footer
      {
        id: `sec-${Date.now()}-footer`,
        type: "footer",
        visible: true,
        headline: `${storeInfo.name} • ${isArabic ? "جميع الحقوق محفوظة" : "All Rights Reserved"}`
      }
    ];

    const newLandingPage: GrowthLandingPage = {
      id: `lp-${Date.now()}`,
      campaignId: `camp-${Date.now()}`,
      name: `${finalName} - ${isArabic ? "صفحة هبوط مخصصة" : "Growth Landing Page"}`,
      status: "active",
      strategyFocus: resolvedTemplate.strategyFocus || "benefits",
      trafficAllocation: 100,
      language: targetMarket.lang,
      currency: selectedCurrency,
      market: targetMarket.country,
      instructions: instructions,
      theme: {
        primaryColor: resolvedTemplate.suggestedTheme?.primaryColor || "#0A1F44",
        accentColor: resolvedTemplate.suggestedTheme?.accentColor || "#E2A26C",
        backgroundColor: resolvedTemplate.suggestedTheme?.backgroundColor || "#070F1E",
        backgroundGradient: resolvedTemplate.suggestedTheme?.backgroundGradient || "linear-gradient(180deg, #070F1E 0%, #0A1F44 45%, #08152B 100%)",
        cardBackgroundColor: resolvedTemplate.suggestedTheme?.cardBackgroundColor || "#0E1C36",
        textColor: resolvedTemplate.suggestedTheme?.textColor || "#F4F6F8",
        fontFamily: isArabic ? "'Cairo', sans-serif" : (resolvedTemplate.suggestedTheme?.fontFamily || "Inter, sans-serif"),
        buttonStyle: resolvedTemplate.suggestedTheme?.buttonStyle || "pill",
        badgeText: isArabic ? (resolvedTemplate.badge || "عرض حصري موثوق") : (resolvedTemplate.badge || "Verified Offer")
      },
      sections: resolvedTemplate.suggestedSections && resolvedTemplate.suggestedSections.length > 0
        ? resolvedTemplate.suggestedSections.map((sec, idx) => ({
            ...sec,
            id: `sec-${Date.now()}-${idx}`,
            price: numericPrice,
            originalPrice: numericComparePrice,
            imageUrl: sec.imageUrl || productImage
          }))
        : baseSections,
      metrics: {
        visitors: 0,
        uniqueVisitors: 0,
        sessions: 0,
        pageViews: 0,
        addToCart: 0,
        checkoutStarted: 0,
        conversions: 0,
        revenue: 0,
        averageOrderValue: numericPrice
      },
      sourceBreakdown: {},
      deviceBreakdown: {
        mobile: { visitors: 0, conversions: 0, revenue: 0 },
        desktop: { visitors: 0, conversions: 0, revenue: 0 },
        tablet: { visitors: 0, conversions: 0, revenue: 0 }
      }
    };

    const matchedProduct = storeProducts.find((p) => p.name === finalName) || storeProducts[0];
    const selectedProd: Product = {
      id: matchedProduct?.id || `prod-${Date.now()}`,
      name: finalName,
      price: numericPrice,
      buyPrice: numericComparePrice,
      imageUrl: productImage,
      description: finalDescription,
      description_en: finalDescription,
      description_ar: finalDescription,
      description_fr: finalDescription,
      category: matchedProduct?.category || "General",
      stock: matchedProduct?.stock || 25,
      shippingCost: matchedProduct?.shippingCost || 500,
      storeId: matchedProduct?.storeId || "store-1",
      status: "active",
      rating: 4.9,
      reviews: matchedProduct?.reviews || [],
      tags: matchedProduct?.tags || ["growth", "landing-page"],
      colors: matchedProduct?.colors || [
        { name: "Black", hex: "#0f172a" },
        { name: "Silver", hex: "#64748b" }
      ],
      sizes: matchedProduct?.sizes || ["Standard", "Medium", "Large"]
    };

    setIsGenerating(false);
    onComplete(newLandingPage, selectedProd, "ai");
  };

  // Safe navigation
  const handleNextStep = () => {
    if (currentStep < 6) {
      setCurrentStep((prev) => prev + 1);
    } else {
      startGenerationPhase();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // =========================================================================
  // SCREENSHOT 7: GENERATION PHASE SCREEN
  // =========================================================================
  if (isGenerating) {
    return (
      <div 
        dir={isArabic ? "rtl" : "ltr"}
        className="fixed inset-0 z-50 bg-gradient-to-br from-purple-700 via-purple-800 to-indigo-900 text-white flex items-center justify-center p-4 overflow-hidden select-none"
      >
        <div className="w-full max-w-5xl h-[560px] flex flex-col md:flex-row items-stretch gap-6 relative">
          
          {/* Left Process Stages Card */}
          <div className="w-full md:w-80 bg-white/95 text-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col justify-between backdrop-blur-md">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {isArabic ? "مراحل الإنشاء" : "Generation Stages"}
                </span>
                <span className="text-xs font-mono font-bold text-purple-600">
                  {generationStage}/4
                </span>
              </div>

              {/* Stage 1 */}
              <div className={`p-3.5 rounded-2xl border transition-all flex items-center gap-3 ${
                generationStage === 1
                  ? "border-purple-500 bg-purple-50/80 shadow-xs"
                  : generationStage > 1
                  ? "border-emerald-200 bg-emerald-50/50 text-slate-600"
                  : "border-slate-100 opacity-50"
              }`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                  generationStage > 1
                    ? "bg-emerald-500 text-white"
                    : generationStage === 1
                    ? "bg-purple-600 text-white animate-pulse"
                    : "bg-slate-100 text-slate-400"
                }`}>
                  {generationStage > 1 ? <Check className="w-4 h-4" /> : <RefreshCw className="w-4 h-4 animate-spin" />}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900">
                    {isArabic ? "تحليل المنتج" : "Analyzing Product"}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {generationStage === 1 ? (isArabic ? "جارِ التنفيذ..." : "In progress...") : (isArabic ? "مكتمل" : "Completed")}
                  </div>
                </div>
              </div>

              {/* Stage 2 */}
              <div className={`p-3.5 rounded-2xl border transition-all flex items-center gap-3 ${
                generationStage === 2
                  ? "border-purple-500 bg-purple-50/80 shadow-xs"
                  : generationStage > 2
                  ? "border-emerald-200 bg-emerald-50/50 text-slate-600"
                  : "border-slate-100 opacity-50"
              }`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                  generationStage > 2
                    ? "bg-emerald-500 text-white"
                    : generationStage === 2
                    ? "bg-purple-600 text-white animate-pulse"
                    : "bg-slate-100 text-slate-400"
                }`}>
                  {generationStage > 2 ? <Check className="w-4 h-4" /> : generationStage === 2 ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sliders className="w-4 h-4" />}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900">
                    {isArabic ? "تصميم التخطيط" : "Structuring Layout"}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {generationStage === 2 ? (isArabic ? "جارِ التوليد..." : "Generating...") : generationStage > 2 ? (isArabic ? "مكتمل" : "Done") : (isArabic ? "في الانتظار" : "Pending")}
                  </div>
                </div>
              </div>

              {/* Stage 3 */}
              <div className={`p-3.5 rounded-2xl border transition-all flex items-center gap-3 ${
                generationStage === 3
                  ? "border-purple-500 bg-purple-50/80 shadow-xs"
                  : generationStage > 3
                  ? "border-emerald-200 bg-emerald-50/50 text-slate-600"
                  : "border-slate-100 opacity-50"
              }`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                  generationStage > 3
                    ? "bg-emerald-500 text-white"
                    : generationStage === 3
                    ? "bg-purple-600 text-white animate-pulse"
                    : "bg-slate-100 text-slate-400"
                }`}>
                  {generationStage > 3 ? <Check className="w-4 h-4" /> : generationStage === 3 ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900">
                    {isArabic ? "إنشاء المرئيات" : "Generating Visuals"}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {generationStage === 3 ? (isArabic ? "تنسيق الصور..." : "Rendering...") : generationStage > 3 ? (isArabic ? "مكتمل" : "Done") : (isArabic ? "في الانتظار" : "Pending")}
                  </div>
                </div>
              </div>

              {/* Stage 4 */}
              <div className={`p-3.5 rounded-2xl border transition-all flex items-center gap-3 ${
                generationStage === 4
                  ? "border-purple-500 bg-purple-50/80 shadow-xs"
                  : "border-slate-100 opacity-50"
              }`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                  generationStage === 4 ? "bg-purple-600 text-white animate-pulse" : "bg-slate-100 text-slate-400"
                }`}>
                  {generationStage === 4 ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4" />}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900">
                    {isArabic ? "إنهاء لاندينغ بايج" : "Finalizing Landing Page"}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {generationStage === 4 ? (isArabic ? "وضع اللمسات الأخيرة..." : "Finishing touches...") : (isArabic ? "في الانتظار" : "Pending")}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-slate-400 text-xs">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>Yume High-Conversion Engine</span>
            </div>
          </div>

          {/* Center Main Glowing Progress Card (Screenshot 7) */}
          <div className="flex-1 bg-white/10 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-white/20 shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden">
            
            {/* Glowing sparkle badge */}
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-purple-400 to-pink-400 flex items-center justify-center shadow-lg shadow-purple-500/50 animate-pulse">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 border-2 border-purple-800 flex items-center justify-center text-[10px]">
                ✨
              </span>
            </div>

            {/* Title & Description */}
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
              {isArabic ? "جارٍ إنشاء لاندينغ بايج" : "Generating Your Landing Page"}
            </h2>
            <p className="text-sm text-purple-200 max-w-md leading-relaxed mb-8">
              {isArabic 
                ? "جاري إعداد لاندينغ بايج مخصصة لمنتجك بتصميم احترافي متناسق وعالي التحويل."
                : "Assembling high-converting sections and custom visual styling tailored to maximize sales conversion."}
            </p>

            {/* Progress Bar & Percentage */}
            <div className="w-full max-w-md space-y-2 mb-8">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-purple-200 px-1">
                <span>{isArabic ? "جارٍ إنشاء لاندينغ بايج..." : "Processing sections..."}</span>
                <span>{generationProgress}%</span>
              </div>
              <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden p-0.5 backdrop-blur-xs">
                <div 
                  className="h-full bg-gradient-to-r from-amber-300 via-pink-400 to-white rounded-full transition-all duration-300 shadow-sm"
                  style={{ width: `${generationProgress}%` }}
                />
              </div>
            </div>

            {/* Product Chip (as shown in Screenshot 7) */}
            <div className="px-4 py-2.5 rounded-2xl bg-white/15 border border-white/20 flex items-center gap-3 shadow-md max-w-sm">
              <img 
                src={productImage} 
                alt={productName || "Product"}
                className="w-10 h-10 rounded-xl object-cover border border-white/30 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="text-right min-w-0 flex-1">
                <div className="text-xs font-bold text-white truncate">
                  {productName || (isArabic ? "منتج تجريبي" : "Featured Product")}
                </div>
                <div className="text-[11px] font-mono text-purple-200 font-bold">
                  {price} {selectedCurrency}
                </div>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            </div>

          </div>

        </div>
      </div>
    );
  }

  // =========================================================================
  // SCREENSHOTS 1 TO 6: THE 6-STEP WIZARD
  // =========================================================================
  return (
    <div 
      dir={isArabic ? "rtl" : "ltr"}
      className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto"
    >
      <div className="bg-white dark:bg-slate-900 w-full max-w-6xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[96vh]">
        
        {/* Hidden inputs for camera capture & file uploads */}
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleFileUpload}
        />
        <input 
          ref={cameraInputRef}
          type="file" 
          accept="image/*" 
          capture="environment" 
          className="hidden" 
          onChange={handleFileUpload}
        />

        {/* ------------------------------------------------------------- */}
        {/* TOP HEADER: Brand Logo, Locale Selector, Progress Banner      */}
        {/* ------------------------------------------------------------- */}
        <header className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 shrink-0 bg-white dark:bg-slate-900">
          
          {/* Top Left: Locale Selector (as seen in Screenshot 1: SA AR ⬍) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLocaleDropdown(!showLocaleDropdown)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>{activeLocale}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showLocaleDropdown && (
              <div className="absolute top-full mt-1.5 z-30 w-36 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-1">
                {(["SA AR", "DZ AR", "EN GB", "FR FR"] as LocaleOption[]).map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => {
                      setActiveLocale(loc);
                      setShowLocaleDropdown(false);
                    }}
                    className={`w-full text-right px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      activeLocale === loc 
                        ? "bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400" 
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Center Brand / Flow Indicator */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-black text-sm tracking-tight text-slate-900 dark:text-white">
              Yume <span className="text-purple-600 font-extrabold">Growth</span>
            </span>
          </div>

          {/* Top Right: AI Landing Page Step Banner (Screenshots 1-6) */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800">
              <span className="font-mono text-xs font-black text-purple-700 dark:text-purple-300">
                {currentStep}/6
              </span>
              <span className="text-xs font-bold text-purple-900 dark:text-purple-200">
                {isArabic ? "مُنشئ صفحة الهبوط" : "Landing Page Wizard"}
              </span>
              <span className="hidden sm:inline-block text-[11px] font-bold text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/80">
                ✨ {isArabic ? "تحسين التحويل الفوري" : "Conversion Optimized"}
              </span>
            </div>

            {/* Exit Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close wizard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Purple Step Progress Bar along top of wizard body */}
        <div className="w-full h-1 bg-slate-100 dark:bg-slate-800">
          <div 
            className="h-full bg-gradient-to-r from-purple-600 to-pink-500 transition-all duration-300"
            style={{ width: `${(currentStep / 6) * 100}%` }}
          />
        </div>

        {/* ------------------------------------------------------------- */}
        {/* MAIN BODY: SPLIT VIEW (LEFT: LIVE PREVIEW | RIGHT: STEP WIZARD) */}
        {/* ------------------------------------------------------------- */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-[500px]">
          
          {/* =========================================================== */}
          {/* LEFT HALF: LIVE LANDING PAGE PREVIEW PLACEHOLDER / MOCKUP   */}
          {/* =========================================================== */}
          <div className="w-full md:w-1/2 bg-slate-50 dark:bg-slate-950/60 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
            
            {productName ? (
              /* DYNAMIC REAL-TIME PREVIEW OF THE BASE LANDING PAGE FORMING */
              <div 
                className="w-full max-w-[340px] rounded-3xl shadow-2xl border border-slate-700/60 overflow-hidden text-right flex flex-col text-xs transition-all duration-300"
                style={{ 
                  backgroundColor: resolvedTemplate.suggestedTheme?.backgroundColor || "#070F1E",
                  color: resolvedTemplate.suggestedTheme?.textColor || "#F4F6F8"
                }}
              >
                
                {/* Simulated Phone Top Header */}
                <div className="bg-black/50 text-white px-3 py-1 flex items-center justify-between text-[10px] font-mono">
                  <span>9:41</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>5G</span>
                  </div>
                </div>

                {/* Announcement Bar */}
                <div 
                  className="py-1 px-2 text-center text-[10px] font-bold text-white transition-colors"
                  style={{ backgroundColor: resolvedTemplate.suggestedTheme?.primaryColor || "#0A1F44" }}
                >
                  {isArabic ? "⚡ تخفيض حصري + الدفع عند الاستلام مع المعاينة" : "⚡ Limited Sale + Cash on Delivery"}
                </div>

                {/* Live Preview Product Image */}
                <div className="relative aspect-4/3 bg-black/20 overflow-hidden">
                  <img 
                    src={productImage} 
                    alt={productName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span 
                    className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full font-black text-[10px] shadow-sm"
                    style={{ 
                      backgroundColor: resolvedTemplate.suggestedTheme?.accentColor || "#E2A26C",
                      color: "#0A1F44"
                    }}
                  >
                    {instructions ? instructions.split("،")[0] : (resolvedTemplate.badge || (isArabic ? "الأكثر طلباً" : "Best Seller"))}
                  </span>
                </div>

                {/* Product Info & Live Price */}
                <div 
                  className="p-3.5 space-y-2 transition-colors"
                  style={{ backgroundColor: resolvedTemplate.suggestedTheme?.cardBackgroundColor || "#0E1C36" }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                      <span className="text-[10px] opacity-70 font-bold ml-1">(4.9/5)</span>
                    </div>
                    <span 
                      className="px-2 py-0.5 rounded-md text-[10px] font-bold border border-emerald-500/30"
                      style={{ 
                        backgroundColor: "rgba(16, 185, 129, 0.15)",
                        color: "#34D399"
                      }}
                    >
                      {isArabic ? "متوفر" : "In Stock"}
                    </span>
                  </div>

                  <h3 className="font-black text-sm line-clamp-1" style={{ color: resolvedTemplate.suggestedTheme?.textColor || "#FFFFFF" }}>
                    {productName}
                  </h3>

                  <p className="text-[11px] opacity-75 line-clamp-2 leading-relaxed">
                    {productDescription || (isArabic ? "وصف تسويقي احترافي يعزز قرار الشراء الفوري..." : "Compelling benefit-led product description...")}
                  </p>

                  <div className="flex items-baseline gap-2 pt-1">
                    <span 
                      className="text-base font-black font-mono"
                      style={{ color: resolvedTemplate.suggestedTheme?.accentColor || "#E2A26C" }}
                    >
                      {price} {selectedCurrency}
                    </span>
                    {comparePrice && (
                      <span className="text-xs opacity-50 line-through font-mono">
                        {comparePrice} {selectedCurrency}
                      </span>
                    )}
                  </div>

                  {/* Fast COD Checkout Form Simulation */}
                  <div className="pt-2 border-t border-white/10 space-y-1.5">
                    <div 
                      className="p-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 border border-white/10"
                      style={{ 
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        color: resolvedTemplate.suggestedTheme?.textColor || "#FFFFFF"
                      }}
                    >
                      <Truck className="w-3.5 h-3.5" style={{ color: resolvedTemplate.suggestedTheme?.accentColor || "#E2A26C" }} />
                      <span>{isArabic ? "الدفع عند الاستلام - 58 ولاية" : "Cash on Delivery - 58 Wilayas"}</span>
                    </div>

                    <button
                      type="button"
                      style={{ 
                        backgroundColor: resolvedTemplate.suggestedTheme?.primaryColor || "#0A1F44",
                        color: "#FFFFFF",
                        border: `1px solid ${resolvedTemplate.suggestedTheme?.accentColor || "transparent"}`
                      }}
                      className="w-full py-2.5 rounded-xl font-black text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{isArabic ? "اضغط هنا للطلب الفوري" : "Order Now - Pay on Delivery"}</span>
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              /* SCREENSHOT 1 DEFAULT EMPTY PLACEHOLDER STATE */
              <div className="space-y-4 max-w-sm px-4">
                <div className="relative inline-block">
                  <div className="w-16 h-16 rounded-3xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto shadow-inner">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-pink-500 animate-ping opacity-75" />
                </div>

                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {isArabic ? "معاينة لاندينغ بايج" : "Landing Page Preview"}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {isArabic 
                    ? "أدخل تفاصيل منتجك وانقر على إنشاء لرؤية لاندينغ بايج هنا."
                    : "Enter your product information to see your conversion-optimized landing page form here in real-time."}
                </p>

                {/* Sample product pill */}
                {storeProducts && storeProducts.length > 0 && (
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCatalogPicker(true)}
                      className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-purple-600 dark:text-purple-400 hover:border-purple-300 transition-all cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{isArabic ? "استيراد من منتجات المتجر" : "Import from Store Catalog"}</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Bottom watermark */}
            <div className="absolute bottom-3 text-[10px] text-slate-400 font-medium">
              Yume Growth AI Preview Engine
            </div>
          </div>

          {/* =========================================================== */}
          {/* RIGHT HALF: THE 6-STEP INTERACTIVE CARD                     */}
          {/* =========================================================== */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto bg-white dark:bg-slate-900">
            
            <div className="space-y-6">
              
              {/* ------------------------------------------------------- */}
              {/* STEP 1: PRODUCT IMAGE (SCREENSHOT 1)                    */}
              {/* ------------------------------------------------------- */}
              {currentStep === 1 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  {/* Step Header Badge */}
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 flex items-center justify-center text-amber-500">
                        <ImageIcon className="w-7 h-7" />
                      </div>
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-xs">
                        ✨
                      </span>
                    </div>

                    <h2 className="text-xl font-black text-slate-900 dark:text-white">
                      {isArabic ? "أرنا منتجك" : "Show Us Your Product"}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isArabic ? "ارفع صورة أو التقط واحدة بالكاميرا" : "Upload an image or take one directly with your camera"}
                    </p>
                  </div>

                  {/* Upload Dropzone Container */}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-purple-500 dark:hover:border-purple-400 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-4 bg-slate-50/50 dark:bg-slate-850/50 transition-all cursor-pointer group"
                  >
                    {productImage ? (
                      <div className="relative group/img">
                        <img 
                          src={productImage} 
                          alt="Product preview" 
                          className="w-32 h-32 rounded-2xl object-cover border-2 border-white dark:border-slate-800 shadow-md"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute -bottom-2 -right-2 px-2.5 py-1 rounded-full bg-purple-600 text-white text-[10px] font-bold shadow-xs">
                          {isArabic ? "تغيير الصورة" : "Change Image"}
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="w-16 h-16 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
                          <Camera className="w-8 h-8" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {isArabic ? "التقط صورة" : "Take a Photo"}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-1">
                            {isArabic ? "أو اسحب وأفلت الملف هنا" : "or drag & drop your product photo here"}
                          </p>
                        </div>
                      </>
                    )}

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          cameraInputRef.current?.click();
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                      >
                        <Camera className="w-3.5 h-3.5 text-blue-500" />
                        <span>{isArabic ? "كاميرا الموبايل" : "Camera"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowCatalogPicker(true);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-purple-600" />
                        <span>{isArabic ? "اختر من المعرض" : "Store Catalog"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------- */}
              {/* STEP 2: PRODUCT NAME (SCREENSHOT 2)                     */}
              {/* ------------------------------------------------------- */}
              {currentStep === 2 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 flex items-center justify-center text-blue-500">
                        <Type className="w-7 h-7" />
                      </div>
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-xs">
                        ✨
                      </span>
                    </div>

                    <h2 className="text-xl font-black text-slate-900 dark:text-white">
                      {isArabic ? "ما اسم منتجك؟" : "What is Your Product Name?"}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isArabic ? "أعط منتجك اسماً جذاباً" : "Give your product a clear, appealing name"}
                    </p>
                  </div>

                  {/* Clean Input with blue focus border */}
                  <div className="space-y-2 pt-2">
                    <input
                      type="text"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder={isArabic ? "مثال: سماعات لاسلكية احترافية" : "e.g. Ergonomic Breathable Athletic Shoes"}
                      className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold focus:outline-none transition-all"
                      autoFocus
                    />

                    {storeProducts.length > 0 && (
                      <div className="pt-2">
                        <label className="text-[11px] font-bold text-slate-400 block mb-1.5">
                          {isArabic ? "أو اختر من منتجاتك الحالية:" : "Or pick from your store products:"}
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {storeProducts.slice(0, 3).map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => {
                                setProductName(p.name);
                                if (p.imageUrl) setProductImage(p.imageUrl);
                                if (p.price) setPrice(p.price.toString());
                              }}
                              className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950 text-slate-700 dark:text-slate-300 font-medium transition-colors"
                            >
                              {p.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------- */}
              {/* STEP 3: PRODUCT DESCRIPTION (SCREENSHOT 3)              */}
              {/* ------------------------------------------------------- */}
              {currentStep === 3 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 flex items-center justify-center text-amber-500">
                        <FileText className="w-7 h-7" />
                      </div>
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-xs">
                        ✨
                      </span>
                    </div>

                    <h2 className="text-xl font-black text-slate-900 dark:text-white">
                      {isArabic ? "أخبرنا المزيد" : "Tell Us More"}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isArabic ? "أضف وصفاً قصيراً (اختياري)" : "Add a short description or core benefit (optional)"}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <textarea
                      rows={4}
                      value={productDescription}
                      onChange={(e) => setProductDescription(e.target.value)}
                      placeholder={isArabic ? "صف مميزات منتجك وفوائده..." : "Describe product key advantages, materials, and benefits..."}
                      className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 focus:border-purple-500 dark:focus:border-purple-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs leading-relaxed focus:outline-none transition-all"
                    />

                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="text-xs text-purple-600 dark:text-purple-400 hover:underline font-bold"
                      >
                        {isArabic ? "تخطي هذه الخطوة" : "Skip this step"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------- */}
              {/* STEP 4: SET THE PRICE (SCREENSHOT 4)                    */}
              {/* ------------------------------------------------------- */}
              {currentStep === 4 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-center text-emerald-500">
                        <DollarSign className="w-7 h-7" />
                      </div>
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-xs">
                        ✨
                      </span>
                    </div>

                    <h2 className="text-xl font-black text-slate-900 dark:text-white">
                      {isArabic ? "حدد السعر" : "Set the Price"}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isArabic ? "بكم تبيعه؟" : "How much are you selling it for?"}
                    </p>
                  </div>

                  {/* Centered Price Input Field */}
                  <div className="space-y-4 pt-2">
                    <div className="relative max-w-sm mx-auto">
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0"
                        className="w-full text-center py-3 px-4 rounded-2xl border-2 border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-2xl font-black font-mono focus:outline-none shadow-xs"
                        autoFocus
                      />
                    </div>

                    {/* Currency Selector Pills (MAD, TND, LYD, EGP, QAR, DZD, EUR, USD, AED, SAR) */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block text-center">
                        {isArabic ? "اختر العملة" : "Select Currency"}
                      </label>

                      <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
                        {QUICK_CURRENCIES.map((curr) => {
                          const isSelected = selectedCurrency === curr;
                          return (
                            <button
                              key={curr}
                              type="button"
                              onClick={() => setSelectedCurrency(curr)}
                              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-blue-600 text-white shadow-md scale-105"
                                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                              }`}
                            >
                              {curr}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------- */}
              {/* STEP 5: SPECIAL INSTRUCTIONS (SCREENSHOT 5)             */}
              {/* ------------------------------------------------------- */}
              {currentStep === 5 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800/80 flex items-center justify-center text-cyan-500">
                        <MessageSquare className="w-7 h-7" />
                      </div>
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-xs">
                        ✨
                      </span>
                    </div>

                    <h2 className="text-xl font-black text-slate-900 dark:text-white">
                      {isArabic ? "أضف تعليمات خاصة" : "Add Special Instructions"}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isArabic 
                        ? "ساعد الذكاء الاصطناعي في إنشاء لاندينغ بايج مثالية لك"
                        : "Guide AI to highlight your key marketing angle and terms"}
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <textarea
                      rows={3}
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      placeholder={isArabic ? "مثال: التوصيل متاح، عرض محدود..." : "e.g. Express delivery, limited stock, 30% discount..."}
                      className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 focus:border-cyan-500 dark:focus:border-cyan-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs leading-relaxed focus:outline-none transition-all"
                    />

                    {/* Quick suggestion tags (Screenshot 5) */}
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 block mb-2 text-center">
                        {isArabic ? "اقتراحات سريعة (اضغط للإضافة)" : "Quick suggestions (click to add)"}
                      </span>
                      <div className="flex flex-wrap justify-center gap-1.5">
                        {(isArabic ? QUICK_SUGGESTIONS_AR : QUICK_SUGGESTIONS_EN).map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => handleAddSuggestion(tag)}
                            className="px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-cyan-950 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700 transition-colors"
                          >
                            + {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------- */}
              {/* STEP 6: LANGUAGE & MARKET (SCREENSHOT 6)                */}
              {/* ------------------------------------------------------- */}
              {currentStep === 6 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/80 flex items-center justify-center text-purple-500">
                        <Globe className="w-7 h-7" />
                      </div>
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-xs">
                        ✨
                      </span>
                    </div>

                    <h2 className="text-xl font-black text-slate-900 dark:text-white">
                      {isArabic ? "اختر اللغة" : "Select Language & Market"}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isArabic ? "بأي لغة تريد لاندينغ بايج؟" : "Which target market and language should this page be generated in?"}
                    </p>
                  </div>

                  {/* 2-Column Market Cards Grid (Screenshot 6) */}
                  <div className="grid grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
                    {MARKET_OPTIONS.map((m) => {
                      const isSelected = selectedMarketCode === m.code;
                      return (
                        <div
                          key={m.code}
                          onClick={() => {
                            setSelectedMarketCode(m.code);
                            setSelectedCurrency(m.currency);
                          }}
                          className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? "border-blue-600 bg-blue-50/40 dark:bg-blue-950/40 shadow-xs"
                              : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
                          }`}
                        >
                          <div>
                            <div className="text-xs font-black text-slate-900 dark:text-white">
                              {m.code}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                              {isArabic ? m.countryAr : m.country}
                            </div>
                          </div>
                          <span className="font-mono text-xs font-bold text-slate-400">
                            {m.symbol}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Template Archetype & Visual Style Selector */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {isArabic ? "قالب وتصميم الصفحة (النمط المرئي):" : "Visual Theme & Blueprint Archetype:"}
                      </label>
                      <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-full">
                        {resolvedTemplate.name}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {/* Auto-detect option */}
                      <button
                        type="button"
                        onClick={() => setSelectedTemplateId("auto")}
                        className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer ${
                          selectedTemplateId === "auto"
                            ? "border-purple-600 bg-purple-50/70 dark:bg-purple-950/60 shadow-xs ring-1 ring-purple-600/30"
                            : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-600 shrink-0" />
                          <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {isArabic ? "تلقائي حسب المنتج" : "Auto-Detect"}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 block truncate">
                          {isArabic ? "مطابقة ذكية لطبيعة المنتج" : "Adaptive styling"}
                        </span>
                      </button>

                      {/* Flagship Templates from GROWTH_TEMPLATES_CATALOG */}
                      {GROWTH_TEMPLATES_CATALOG.slice(0, 5).map((tpl) => {
                        const isChosen = selectedTemplateId === tpl.id;
                        return (
                          <button
                            key={tpl.id}
                            type="button"
                            onClick={() => setSelectedTemplateId(tpl.id)}
                            className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer ${
                              isChosen
                                ? "border-purple-600 bg-purple-50/70 dark:bg-purple-950/60 shadow-xs ring-1 ring-purple-600/30"
                                : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
                            }`}
                          >
                            <div className="flex items-center gap-1.5 mb-1">
                              <span 
                                className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/20" 
                                style={{ backgroundColor: tpl.suggestedTheme?.primaryColor || "#4f46e5" }}
                              />
                              <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                {tpl.name}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 block truncate">
                              {tpl.targetCategory}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* --------------------------------------------------------- */}
            {/* BOTTOM CONTROLS & NAVIGATION BUTTONS                     */}
            {/* --------------------------------------------------------- */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="w-10 h-10 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                  title="Back"
                >
                  {isArabic ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                </button>
              ) : (
                <div />
              )}

              {currentStep < 6 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="flex-1 max-w-[200px] py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>{isArabic ? "متابعة" : "Continue"}</span>
                  {isArabic ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              ) : (
                /* Primary Final Action: "إنشاء لاندينغ بايج ✨" (Screenshot 6) */
                <button
                  type="button"
                  onClick={startGenerationPhase}
                  className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-sm shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isArabic ? "إنشاء لاندينغ بايج ✨" : "Generate Landing Page ✨"}</span>
                </button>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* ------------------------------------------------------------- */}
      {/* CATALOG PICKER MODAL (Choose from existing Yume Products)      */}
      {/* ------------------------------------------------------------- */}
      {showCatalogPicker && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 max-w-lg w-full rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-right">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isArabic ? "اختر منتجاً من متجرك" : "Select a Product from Store"}
              </h3>
              <button
                type="button"
                onClick={() => setShowCatalogPicker(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2">
              {storeProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    setProductName(p.name);
                    if (p.imageUrl) setProductImage(p.imageUrl);
                    if (p.price) {
                      setPrice(p.price.toString());
                      setComparePrice(Math.round(p.price * 1.35).toString());
                    }
                    if (p.description_en || p.description) {
                      setProductDescription(p.description_en || p.description || "");
                    }
                    setShowCatalogPicker(false);
                  }}
                  className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-950/40 transition-all cursor-pointer flex items-center gap-3"
                >
                  <img 
                    src={p.imageUrl} 
                    alt={p.name}
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {p.name}
                    </h4>
                    <span className="text-xs font-mono font-bold text-emerald-600">
                      {(p.price || 0).toLocaleString()} {selectedCurrency}
                    </span>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
