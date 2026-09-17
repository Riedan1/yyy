/**
 * @license
 * Growth Studio PDF Specifications Data
 * Directly derived from the 11-page Growth Landing Page Architecture Report.
 * Covers:
 * - 10 Growth-Focused Editable Templates (PDF Section 4, Pages 4-5)
 * - 10 High-Performing Global Examples (PDF Section 2, Page 2)
 * - Google AI Studio Prompt Patterns (PDF Section 6, Pages 7-8)
 * - Implementation Checklist & Data ER Model (PDF Section 7, Pages 7-8)
 * - Landing Page Builder Rollout Phases (PDF Pages 3 & 10)
 */

import { StrategyFocus, LandingPageSection } from "../types/growthStudio";

export interface GrowthTemplateDefinition {
  id: string;
  name: string;
  targetCategory: string;
  primaryCta: string;
  heroLayout: string;
  uniqueConversionElement: string;
  mobileBehavior: string;
  recommendedAbTest: string;
  strategyFocus: StrategyFocus;
  badge: string;
  description: string;
  suggestedSections: LandingPageSection[];
  suggestedTheme?: {
    primaryColor: string;
    accentColor: string;
    backgroundColor: string;
    fontFamily: string;
    buttonStyle: "pill" | "rounded" | "sharp";
    badgeText?: string;
    secondaryColor?: string;
    cardBackgroundColor?: string;
    textColor?: string;
    backgroundStyle?: "solid" | "gradient" | "image" | "pattern";
    backgroundGradient?: string;
    backgroundImageUrl?: string;
    overlayColor?: string;
    overlayOpacity?: number;
    buttonColor?: string;
    buttonTextColor?: string;
  };
  productSample?: {
    name: string;
    price: number;
    originalPrice: number;
    imageUrl: string;
    category: string;
    description: string;
  };
}

export const GROWTH_TEMPLATES_CATALOG: GrowthTemplateDefinition[] = [
  {
    id: "tpl-trading-ebook",
    name: "0. Arabic Trading E-Book & Digital Knowledge",
    targetCategory: "Digital E-Book / Finance & Trading",
    primaryCta: "احصل على دليلي الآن",
    heroLayout: "Full-width candlestick trading chart background with high-contrast Navy & Gold overlay",
    uniqueConversionElement: "Risk reversal 30-day money back guarantee banner & live chapter syllabus breakdown",
    mobileBehavior: "Optimized Arabic RTL typography; sticky one-click COD order footer with microcopy",
    recommendedAbTest: "Hero headline ('ابدأ نجاحك في التداول' vs 'دليلك خطوة بخطوة إلى صفقات مربحة'), Gold vs Teal CTA button",
    strategyFocus: "benefits",
    badge: "Flagship PDF Reference Archetype",
    description: "Tailored for digital knowledge products, trading e-books, and financial education. Features deep navy and warm gold palettes, dark candlestick imagery, problem-solution framing, and full RTL Arabic support.",
    suggestedTheme: {
      primaryColor: "#0A1F44", // Primary navy blue from PDF
      accentColor: "#E2A26C",  // Warm gold/orange from PDF
      secondaryColor: "#4A90E2", // Accent teal/blue from PDF
      backgroundColor: "#070F1E", // Deep finance navy background (not generic white)
      cardBackgroundColor: "#0E1C36", // Sophisticated finance card container
      textColor: "#F4F6F8", // High-contrast crisp light text
      fontFamily: "'Cairo', 'Tajawal', sans-serif",
      buttonStyle: "pill",
      badgeText: "الكتاب المالي الأكثر طلباً",
      backgroundStyle: "gradient",
      backgroundGradient: "linear-gradient(180deg, #070F1E 0%, #0A1F44 40%, #0B182F 100%)",
      backgroundImageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80",
      overlayColor: "#0A1F44",
      overlayOpacity: 0.85,
      buttonColor: "#E2A26C",
      buttonTextColor: "#0A1F44"
    },
    productSample: {
      name: "كتاب خطواتك الأولى للربح في التداول",
      price: 3900,
      originalPrice: 5800,
      imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80",
      category: "Digital Books & Courses",
      description: "دليل عملي شامل واستراتيجيات مثبتة إحصائياً لقراءة الشموع اليابانية، إدارة المخاطر، وتنفيذ صفقات رابحة من الصفر حتى الاحتراف."
    },
    suggestedSections: [
      {
        id: "sec-trade-hero",
        type: "hero",
        visible: true,
        headline: "ابدأ نجاحك في التداول",
        subheadline: "دليلك خطوة بخطوة إلى صفقات مربحة وإتقان قراءة حركة الأسعار دون تعقيد",
        badge: "دليل عملي شامل • للمبتدئين والمتقدمين",
        imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80",
        ctaText: "احصل على دليلي الآن",
        ctaSubtext: "شحن سريع لكافة الولايات • الدفع عند الاستلام مع المعاينة",
        price: 3900,
        originalPrice: 5800,
        items: [
          { title: "التقييم العام", description: "4.9 / 5 من أكثر من 5,200 متداول عربي" }
        ]
      },
      {
        id: "sec-trade-problem",
        type: "problem",
        visible: true,
        headline: "لماذا يخسر 90% من المتداولين أموالهم في أول 90 يوماً؟",
        subheadline: "الدخول إلى الأسواق المالية دون استراتيجية وخطة إدارة مخاطر صارمة يحول التداول إلى مجرد مقامرة عشوائية.",
        badge: "المشكلة الحقيقية",
        items: [
          { title: "الاعتماد على العواطف والشائعات", description: "الشراء بدافع الطمع عند القمم والبيع بدافع الخوف عند القيعان دون أي تحليل منطقي." },
          { title: "غياب خطة صارمة لإدارة رأس المال", description: "المخاطرة بنسب مئوية قاتلة تؤدي إلى تصفير الحساب في صفقات متتالية معدودة." },
          { title: "تشتت المعلومات والمصادر غير الموثوقة", description: "متابعة عشرات المؤشرات المتضاربة وقنوات التوصيات العشوائية التي تسبب الحيرة." }
        ]
      },
      {
        id: "sec-trade-solution",
        type: "solution",
        visible: true,
        headline: "الحل بين يديك: كتاب خطواتك الأولى للربح في التداول",
        subheadline: "دليل منهجي تطبيقي يبسط لك أسرار صانع السوق ويمنحك خريطة طريق واضحة لكل صفقة.",
        imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80",
        items: [
          { title: "منهجية مبسطة خطوة بخطوة", description: "شرح سلس من الصفر بالرسوم التوضيحية لجميع نماذج الشموع اليابانية الكلاسيكية." },
          { title: "قاعدة الـ 1% الذهبية لحماية رأس المال", description: "كيف تضمن بقاءك في السوق لأطول فترة مع تحقيق نمو تراكمي آمن لمحفظتك." },
          { title: "قوائم تحقق وتطبيقات يومية", description: "خطة واضحة لا تقبل اللبس لتحديد نقاط الدخول، وقف الخسارة، وأخذ الأرباح بدقة." }
        ]
      },
      {
        id: "sec-trade-product",
        type: "product",
        visible: true,
        headline: "اطلب نسختك الورقية الفاخرة الآن",
        subheadline: "طباعة فاخرة بالألوان مع ملحق الرسوم البيانية وقوالب التداول اليومية الجاهزة",
        price: 3900,
        originalPrice: 5800,
        imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80",
        ctaText: "تأكيد الطلب الفوري • الدفع عند الاستلام"
      },
      {
        id: "sec-trade-benefits",
        type: "benefits",
        visible: true,
        headline: "الفوائد التي ستحصل عليها من هذا الكتاب",
        subheadline: "مهارات عملية قابلة للتطبيق الفوري في أسواق الأسهم والعملات الرقمية والفوركس والذهب",
        items: [
          { title: "تعلم استراتيجيات مجربة", description: "استراتيجيات تداول مبنية على حركة السعر الحقيقية (Price Action) أثبتت نجاحها إحصائياً." },
          { title: "الانضباط النفسي وإدارة المشاعر", description: "التخلص من فخ الخوف والطمع والتداول كالمحترفين بهدوء وثبات كاملين." },
          { title: "أمثلة حية من واقع السوق", description: "شروحات تفصيلية لصفقات حقيقية موثقة قبل وبعد تحقق الأهداف." },
          { title: "انضمام مجاني لمجتمع المتداولين", description: "فرصة مناقشة الفرص الأسبوعية وتبادل التحليلات مع نخبة من القراء والمؤلفين." }
        ]
      },
      {
        id: "sec-trade-how-it-works",
        type: "how_it_works",
        visible: true,
        headline: "كيف تبدأ رحلتك الاستثمارية في 3 خطوات؟",
        subheadline: "مسار واضح يضمن لك الاستيعاب السريع والتطبيق دون أي ارتباك",
        items: [
          { title: "1. اطلب نسختك الآن", description: "املأ بياناتك في دقيقة واحدة لتصلك النسخة لباب منزلك مع حق فتح الطرد ومعاينته قبل السداد." },
          { title: "2. اقرأ وطبق على حساب تجريبي", description: "أكمل قراءة الفصول ونفذ التمارين المرفقة في بيئة آمنة بدون أي مخاطرة بأموالك." },
          { title: "3. ابدأ التداول الحقيقي بثقة", description: "ادخل السوق الحقيقي متسلحاً بخطة متكاملة وإدارة مخاطر صارمة تمنحك الأفضلية." }
        ]
      },
      {
        id: "sec-trade-why-choose",
        type: "why_choose",
        visible: true,
        headline: "لماذا طريقتنا تحقق النجاح؟",
        subheadline: "خبرة متراكمة ومحتوى استثنائي كتبه متداولون محترفون بخبرة تفوق 8 سنوات",
        items: [
          { title: "خبرة واقعية وليست نظريات", description: "كافة الاستراتيجيات والقواعد صيغت بناءً على صفقات حقيقية في الأسواق العربية والعالمية." },
          { title: "أكثر من 5,200 متداول ناجح", description: "تقييم 4.9 من 5 وإشادة واسعة من مجتمعات التداول في الجزائر والخليج والشرق الأوسط." },
          { title: "محتوى عربي أصيل وخالٍ من الحشو", description: "كل صفحة وكل فقرة تركز مباشرة على ما تحتاجه للنجاح دون إطالة غير مفيدة." }
        ]
      },
      {
        id: "sec-trade-faq",
        type: "faq",
        visible: true,
        headline: "الأسئلة الشائعة حول الكتاب وطريقة الاستلام",
        subheadline: "إجابات واضحة ومباشرة على أكثر ما يسأل عنه المهتمون",
        items: [
          { title: "كيف أحصل على الكتاب الإلكتروني أو الورقي؟", description: "يصلك الطرد الورقي مع ملحقاته إلى عنوانك في كافة الولايات مع شركة التوصيل، وتدفع نقداً بعد المعاينة." },
          { title: "هل يناسب من ليس لديه أي خلفية عن الأسواق المالية؟", description: "نعم تماماً، يبدأ الكتاب بشرح المفاهيم من الصفر بأسلوب مبسّط وواضح دون افتراض أي خبرة مسبقة." },
          { title: "هل القواعد تنطبق على العملات الرقمية والأسهم؟", description: "بالتأكيد، مبادئ حركة السعر وإدارة المخاطر تنطبق على الكريبتو، الفوركس، الأسهم، والسلع كالذهب والنفط." },
          { title: "ماذا لو كان لدي استفسار أثناء القراءة؟", description: "ستجد داخل الكتاب رمز QR خاصاً للتواصل مع فريق الدعم الفني والمؤلفين للإجابة على تساؤلاتك." }
        ]
      },
      {
        id: "sec-trade-guarantee",
        type: "guarantee",
        visible: true,
        headline: "ضمان استرداد المال خلال 30 يومًا",
        subheadline: "نحن نتحمل المخاطرة كاملة عنك. إذا طبقت قواعد الكتاب ولم تجد فيه فائدة نوعية في تداولك، فلك كامل الحق في استرداد ثمن الكتاب دون أي تعقيدات.",
        badge: "ضمان ذهبي بلا شروط",
        ctaText: "اطلب نسختك بأمان تام"
      },
      {
        id: "sec-trade-final-cta",
        type: "cta",
        visible: true,
        headline: "انضم إلى مئات المتداولين الناجحين",
        subheadline: "لا تدع الوقت يمر وأنت تتداول بطرق عشوائية. امتلك دليلك اليوم وابدأ التداول كالمحترفين.",
        ctaText: "ابدأ الربح اليوم • احصل على نسختك الآن",
        ctaSubtext: "دفع آمن عند الاستلام • فحص الطرد أمام عامل التوصيل متاح"
      },
      {
        id: "sec-trade-footer",
        type: "footer",
        visible: true,
        headline: "جميع الحقوق محفوظة © خطواتك الأولى للربح في التداول • منصة يومي Yume"
      }
    ]
  },
  {
    id: "tpl-premium-product",
    name: "1. Premium Product",
    targetCategory: "High-end Electronics or Luxury",
    primaryCta: "Pre-order Now",
    heroLayout: "Full-bleed high-res product image with brief headline overlay",
    uniqueConversionElement: "Scarcity countdown (e.g. 'Limited initial batch: 150 units worldwide')",
    mobileBehavior: "Collapse hero into carousel; sticky CTA bar pinned to bottom",
    recommendedAbTest: "Hero image (lifestyle vs studio render), CTA copy ('Pre-order Now' vs 'Buy Now')",
    strategyFocus: "benefits",
    badge: "High AOV / Luxury",
    description: "Designed for premium consumer hardware and designer goods requiring high perceived value and scarcity triggers.",
    suggestedTheme: {
      primaryColor: "#0F172A",
      accentColor: "#38BDF8",
      secondaryColor: "#64748B",
      backgroundColor: "#0B0F17",
      cardBackgroundColor: "#131B2B",
      textColor: "#F8FAFC",
      fontFamily: "Inter, sans-serif",
      buttonStyle: "pill",
      badgeText: "High AOV / Luxury",
      backgroundStyle: "gradient",
      backgroundGradient: "linear-gradient(180deg, #0B0F17 0%, #131B2B 45%, #0F172A 100%)",
      buttonColor: "#38BDF8",
      buttonTextColor: "#0F172A"
    },
    suggestedSections: [
      {
        id: "sec-prem-1",
        type: "hero",
        visible: true,
        headline: "Mastercrafted Precision. Engineered Without Compromise.",
        subheadline: "Reserve yours from the inaugural production run with complimentary courier shipping.",
        ctaText: "Pre-order Now",
        badge: "Limited Stock: Only 150 Units Left",
        price: 18500,
        originalPrice: 24000
      },
      {
        id: "sec-prem-2",
        type: "features",
        visible: true,
        headline: "Unmatched Industrial Craftsmanship",
        items: [
          { title: "Aerospace-Grade Alloy", description: "Milled from a solid billet for structural durability and featherweight ergonomics." },
          { title: "Zero-Latency Performance", description: "Proprietary wireless protocol delivering instant responsiveness." },
          { title: "3-Year Direct Warranty", description: "Comprehensive coverage with doorstep replacement service." }
        ]
      },
      {
        id: "sec-prem-3",
        type: "guarantee",
        visible: true,
        headline: "The Yume Prestige Guarantee",
        subheadline: "Examine the hardware upon arrival before releasing payment. 30-day risk-free evaluation.",
        ctaText: "Secure Your Reservation"
      }
    ]
  },
  {
    id: "tpl-flash-sale",
    name: "2. Flash Sale",
    targetCategory: "Retail / Direct-to-Consumer",
    primaryCta: "Claim Discount",
    heroLayout: "Banner showing sale percentage and hero product shot",
    uniqueConversionElement: "Countdown timer for sale end (urgent impulse trigger)",
    mobileBehavior: "Simplified banner; sticky 'Shop Now' bar with real-time countdown",
    recommendedAbTest: "Urgency timer vs static timer badge; single-button vs two-button layout",
    strategyFocus: "offer_urgency",
    badge: "Urgency & Impulse",
    description: "Built for high-volume clearance, holiday sales, and limited-time discount drops.",
    suggestedTheme: {
      primaryColor: "#DC2626",
      accentColor: "#F59E0B",
      secondaryColor: "#EF4444",
      backgroundColor: "#0F0B0B",
      cardBackgroundColor: "#1E1212",
      textColor: "#FEF2F2",
      fontFamily: "Inter, sans-serif",
      buttonStyle: "pill",
      badgeText: "Flash Sale • Ending Soon",
      backgroundStyle: "gradient",
      backgroundGradient: "linear-gradient(180deg, #180C0C 0%, #2B1111 40%, #160808 100%)",
      buttonColor: "#DC2626",
      buttonTextColor: "#FFFFFF"
    },
    suggestedSections: [
      {
        id: "sec-flash-1",
        type: "hero",
        visible: true,
        headline: "Exclusive 48-Hour Flash Drop: Up to 35% Off",
        subheadline: "Prices reset at midnight. Includes fast cash-on-delivery service nationwide.",
        ctaText: "Claim Discount Now",
        badge: "Ending Soon • Limited Quantity",
        price: 3900,
        originalPrice: 6000
      },
      {
        id: "sec-flash-2",
        type: "urgency",
        visible: true,
        headline: "Why This Offer Ends Tonight",
        subheadline: "High warehouse demand limits inventory. Once the countdown expires, standard retail rates apply.",
        items: [
          { title: "Over 820 Orders Dispatched Today", description: "Orders are packaged and shipped every 2 hours." },
          { title: "Free Courier Delivery on 2+ Units", description: "Bundle today and enjoy 0 DA shipping fees." }
        ]
      },
      {
        id: "sec-flash-3",
        type: "cta",
        visible: true,
        headline: "Lock In Your Flash Discount",
        subheadline: "No card required. Pay cash when the delivery courier arrives at your door.",
        ctaText: "Confirm Flash Sale Order"
      }
    ]
  },
  {
    id: "tpl-viral-referral",
    name: "3. Viral / Referral",
    targetCategory: "Subscription Box / Social App",
    primaryCta: "Join Now (Friend Referred)",
    heroLayout: "Collage of user images or viral social media features",
    uniqueConversionElement: "Referral incentive message ('Give $10, Get $10' / 'Give 1,000 DA, Get 1,000 DA')",
    mobileBehavior: "Engaging scroll feed with floating share and claim buttons at the bottom",
    recommendedAbTest: "Referral incentive value (fixed discount vs percentage), social proof count ticker",
    strategyFocus: "social_proof",
    badge: "Viral Loop",
    description: "Harnesses peer recommendations and reward incentives to multiply organic inbound traffic.",
    suggestedTheme: {
      primaryColor: "#7C3AED",
      accentColor: "#10B981",
      secondaryColor: "#8B5CF6",
      backgroundColor: "#0F0B18",
      cardBackgroundColor: "#1C1430",
      textColor: "#F5F3FF",
      fontFamily: "Inter, sans-serif",
      buttonStyle: "pill",
      badgeText: "VIP Referral Pass",
      backgroundStyle: "gradient",
      backgroundGradient: "linear-gradient(180deg, #0F0B18 0%, #1E1338 40%, #120A20 100%)",
      buttonColor: "#7C3AED",
      buttonTextColor: "#FFFFFF"
    },
    suggestedSections: [
      {
        id: "sec-viral-1",
        type: "hero",
        visible: true,
        headline: "Recommended by Friends. Loved by Thousands.",
        subheadline: "Your friend invited you! Claim your 1,500 DA welcome credit on your first order.",
        ctaText: "Join Now & Claim Credit",
        badge: "VIP Referral Pass Applied",
        price: 4500,
        originalPrice: 6000
      },
      {
        id: "sec-viral-2",
        type: "testimonials",
        visible: true,
        headline: "What the Community is Saying",
        items: [
          { title: "Instant upgrade", description: "Ordered after my colleague's recommendation. Delivered in 24 hours!", rating: 5, author: "Yacine B.", authorLocation: "Algiers" },
          { title: "Worth every dinar", description: "The bundle discount plus friend credit made this an absolute steal.", rating: 5, author: "Amira K.", authorLocation: "Oran" }
        ]
      },
      {
        id: "sec-viral-3",
        type: "cta",
        visible: true,
        headline: "Share with a Friend and Earn 1,000 DA",
        subheadline: "Receive store credits each time someone uses your referral link.",
        ctaText: "Claim Your Welcome Offer"
      }
    ]
  },
  {
    id: "tpl-lead-magnet",
    name: "4. Lead Magnet",
    targetCategory: "SaaS / B2B Services",
    primaryCta: "Get Instant Access",
    heroLayout: "Problem-focused headline with short email/phone capture form",
    uniqueConversionElement: "Freebie delivery ('Download 2026 E-Commerce Playbook' / 'Get Free Water Report')",
    mobileBehavior: "Form fields stacked vertically; sticky 'Submit' button",
    recommendedAbTest: "Form length (1 vs 3 fields), headline phrasing (positive gain vs pain avoidance)",
    strategyFocus: "benefits",
    badge: "Lead Gen / B2B",
    description: "Captures qualified buyer contacts in exchange for high-value guides, audits, or reports.",
    suggestedTheme: {
      primaryColor: "#1E3A8A",
      accentColor: "#3B82F6",
      secondaryColor: "#60A5FA",
      backgroundColor: "#080E1C",
      cardBackgroundColor: "#101D36",
      textColor: "#EFF6FF",
      fontFamily: "Inter, sans-serif",
      buttonStyle: "rounded",
      badgeText: "Free Strategic Guide",
      backgroundStyle: "gradient",
      backgroundGradient: "linear-gradient(180deg, #080E1C 0%, #112242 45%, #0B162C 100%)",
      buttonColor: "#2563EB",
      buttonTextColor: "#FFFFFF"
    },
    suggestedSections: [
      {
        id: "sec-lead-1",
        type: "hero",
        visible: true,
        headline: "Stop Wasting Ad Spend on Low-Converting Traffic",
        subheadline: "Download the complete 2026 Algerian Growth Marketing Blueprint free.",
        ctaText: "Get Instant Access",
        badge: "Free Strategic Guide"
      },
      {
        id: "sec-lead-2",
        type: "benefits",
        visible: true,
        headline: "What You Will Discover Inside",
        items: [
          { title: "COD Delivery Optimization", description: "How to drop return rates from 30% down to under 9%." },
          { title: "High-Yield Ad Hooks", description: "Proven TikTok and Meta hooks tuned for North African buyers." },
          { title: "Multi-Page Traffic Routing", description: "Directing ad variants to matching landing page angles." }
        ]
      },
      {
        id: "sec-lead-3",
        type: "cta",
        visible: true,
        headline: "Enter Your Details for Instant Access",
        subheadline: "We will send the download link directly to your inbox.",
        ctaText: "Download Free Guide"
      }
    ]
  },
  {
    id: "tpl-technical-product",
    name: "5. Technical Product",
    targetCategory: "Tech Gadgets & Hardware",
    primaryCta: "Learn More / Buy",
    heroLayout: "Split hero with product visual alongside technical feature list",
    uniqueConversionElement: "Tabbed technical specification sheet or interactive 3D rotator",
    mobileBehavior: "Accordions for technical specs; fixed sticky header with quick price buy button",
    recommendedAbTest: "Feature bullet ordering, hero visual style (studio photo vs cutaway diagram)",
    strategyFocus: "benefits",
    badge: "Tech & Specs",
    description: "Detailed specification tables and engineered schematics for discerning analytical buyers.",
    suggestedTheme: {
      primaryColor: "#0284C7",
      accentColor: "#06B6D4",
      secondaryColor: "#38BDF8",
      backgroundColor: "#081018",
      cardBackgroundColor: "#0E1E2E",
      textColor: "#F0F9FF",
      fontFamily: "Inter, sans-serif",
      buttonStyle: "sharp",
      badgeText: "Certified Technical Hardware",
      backgroundStyle: "gradient",
      backgroundGradient: "linear-gradient(180deg, #081018 0%, #0F2438 45%, #091420 100%)",
      buttonColor: "#0284C7",
      buttonTextColor: "#FFFFFF"
    },
    suggestedSections: [
      {
        id: "sec-tech-1",
        type: "hero",
        visible: true,
        headline: "Engineering Meets Ergonomics. Built for Demanding Workflows.",
        subheadline: "Dual-axis adjustment, aerospace materials, and laboratory-verified posture support.",
        ctaText: "Order Cash on Delivery",
        badge: "Certified Ergonomic Standard",
        price: 8900,
        originalPrice: 11500
      },
      {
        id: "sec-tech-2",
        type: "comparison",
        visible: true,
        headline: "Technical Specifications & Lab Benchmarks",
        items: [
          { title: "Payload Rating: Up to 180 kg", description: "Class-4 heavy duty hydraulic cylinder tested for 100,000 cycles." },
          { title: "Breathable Mesh Matrix", description: "Custom polymer weaving regulates body temperature during 12+ hour sessions." },
          { title: "4D Lumbar Pivot", description: "Follows natural spine curvature without manual mechanical adjustment." }
        ]
      },
      {
        id: "sec-tech-3",
        type: "cta",
        visible: true,
        headline: "Upgrade Your Daily Workspace",
        subheadline: "Includes 2-year warranty and package inspection prior to payment.",
        ctaText: "Order Technical Hardware"
      }
    ]
  },
  {
    id: "tpl-fashion-lifestyle",
    name: "6. Fashion / Lifestyle",
    targetCategory: "Apparel & Beauty",
    primaryCta: "Shop the Look",
    heroLayout: "Model lifestyle photo background with high-impact tagline ('Be Bold Today')",
    uniqueConversionElement: "Color swatches / quick-view modal on the product card",
    mobileBehavior: "Swipeable product gallery; CTA always visible on mobile viewport",
    recommendedAbTest: "Hero model photo (dark vs light wardrobe), CTA accent color",
    strategyFocus: "storytelling",
    badge: "Lifestyle & Apparel",
    description: "Visual-first narrative layout highlighting aesthetics, color choices, and runway looks.",
    suggestedTheme: {
      primaryColor: "#BE185D",
      accentColor: "#F43F5E",
      secondaryColor: "#FB7185",
      backgroundColor: "#160A10",
      cardBackgroundColor: "#28121E",
      textColor: "#FFF1F2",
      fontFamily: "Inter, sans-serif",
      buttonStyle: "pill",
      badgeText: "New 2026 Collection",
      backgroundStyle: "gradient",
      backgroundGradient: "linear-gradient(180deg, #160A10 0%, #2E1222 45%, #180912 100%)",
      buttonColor: "#BE185D",
      buttonTextColor: "#FFFFFF"
    },
    suggestedSections: [
      {
        id: "sec-fash-1",
        type: "hero",
        visible: true,
        headline: "Understated Elegance for Everyday Confidence.",
        subheadline: "Crafted from organic combed cotton with bespoke tailored seams.",
        ctaText: "Shop the Look",
        badge: "New 2026 Collection",
        price: 5200,
        originalPrice: 7500
      },
      {
        id: "sec-fash-2",
        type: "features",
        visible: true,
        headline: "Designed for Timeless Durability",
        items: [
          { title: "100% Breathable Fabric", description: "Soft touch feel that resists fading and shrinkage through repeated washes." },
          { title: "Versatile Styling", description: "Seamlessly transitions from casual daylight meetings to evening dinners." }
        ]
      },
      {
        id: "sec-fash-3",
        type: "cta",
        visible: true,
        headline: "Choose Your Size & Color",
        subheadline: "Try it on when delivered. Exchange sizes freely at your doorstep.",
        ctaText: "Order Your Tailored Outfit"
      }
    ]
  },
  {
    id: "tpl-minimal-luxury",
    name: "7. Minimal Luxury",
    targetCategory: "Boutique / Designer",
    primaryCta: "Discover More",
    heroLayout: "Clean hero with generous white space, refined serif typography, and subtle video",
    uniqueConversionElement: "Animated hovering products and editorial curation badge",
    mobileBehavior: "Simple single-column editorial layout; large high-contrast typography",
    recommendedAbTest: "Brand logo variant, subtle ambient animation on vs off",
    strategyFocus: "minimal_clean",
    badge: "Editorial Luxury",
    description: "Understated minimalist presentation emphasizing craftsmanship, negative space, and prestige.",
    suggestedTheme: {
      primaryColor: "#18181B",
      accentColor: "#D97706",
      secondaryColor: "#71717A",
      backgroundColor: "#09090B",
      cardBackgroundColor: "#141416",
      textColor: "#FAFAFA",
      fontFamily: "Inter, sans-serif",
      buttonStyle: "sharp",
      badgeText: "Numbered Collector Edition",
      backgroundStyle: "gradient",
      backgroundGradient: "linear-gradient(180deg, #09090B 0%, #17171B 45%, #0B0B0D 100%)",
      buttonColor: "#D97706",
      buttonTextColor: "#09090B"
    },
    suggestedSections: [
      {
        id: "sec-lux-1",
        type: "hero",
        visible: true,
        headline: "The Art of Restraint. Pure Material Purity.",
        subheadline: "Individually numbered pieces handcrafted by generational master artisans.",
        ctaText: "Discover the Edition",
        badge: "Limited Edition No. 04",
        price: 14900,
        originalPrice: 19500
      },
      {
        id: "sec-lux-2",
        type: "benefits",
        visible: true,
        headline: "Purveyors of Lasting Quality",
        items: [
          { title: "Hand-Stitched Detailing", description: "Each seam is inspected and tension-calibrated manually." },
          { title: "Sustainable Sourcing", description: "Certified low-carbon supply chain with zero synthetic plastics." }
        ]
      },
      {
        id: "sec-lux-3",
        type: "cta",
        visible: true,
        headline: "Secure an Exclusive Allocation",
        subheadline: "Delivered in signature collector packaging with certificate of authenticity.",
        ctaText: "Request Private Delivery"
      }
    ]
  },
  {
    id: "tpl-social-commerce",
    name: "8. Social Commerce",
    targetCategory: "Consumer Goods via Influencers",
    primaryCta: "Add to Cart",
    heroLayout: "User-generated content carousel with tagged creator videos and photos",
    uniqueConversionElement: "Real-time social 'Liked by 1,420 customers today' ticker",
    mobileBehavior: "Vertical TikTok/Reels style image feed; pinned 'Add to Cart' button",
    recommendedAbTest: "UGC creator clips vs studio brand photography, live testimonial ticker count",
    strategyFocus: "social_proof",
    badge: "UGC & TikTok Viral",
    description: "Leverages creator reels, social proof tickers, and peer enthusiasm to maximize social media conversion.",
    suggestedTheme: {
      primaryColor: "#E11D48",
      accentColor: "#06B6D4",
      secondaryColor: "#F43F5E",
      backgroundColor: "#140A10",
      cardBackgroundColor: "#26131F",
      textColor: "#FFF1F2",
      fontFamily: "Inter, sans-serif",
      buttonStyle: "pill",
      badgeText: "Trending on TikTok & Reels",
      backgroundStyle: "gradient",
      backgroundGradient: "linear-gradient(180deg, #140A10 0%, #2A1121 45%, #160812 100%)",
      buttonColor: "#E11D48",
      buttonTextColor: "#FFFFFF"
    },
    suggestedSections: [
      {
        id: "sec-soc-1",
        type: "hero",
        visible: true,
        headline: "As Seen on TikTok & Instagram Reels",
        subheadline: "Over 3.8 million video views and 4,900 verified customer unboxings.",
        ctaText: "Grab Yours Before It Sells Out",
        badge: "Trending #1 on Social",
        price: 3800,
        originalPrice: 5500
      },
      {
        id: "sec-soc-2",
        type: "testimonials",
        visible: true,
        headline: "Real Unboxings from Algerian Creators",
        items: [
          { title: "Viral Sensation", description: "Saw this on my feed all week. Ordered yesterday and it's even better in person!", rating: 5, author: "Lina M.", authorLocation: "Setif" },
          { title: "Unmatched quality", description: "10/10 packaging. Everything works straight out of the box.", rating: 5, author: "Karim D.", authorLocation: "Constantine" }
        ]
      },
      {
        id: "sec-soc-3",
        type: "cta",
        visible: true,
        headline: "Join 10,000+ Happy Customers",
        subheadline: "Free express shipping to all 58 Wilayas for the next 2 hours.",
        ctaText: "Add to Cart & Pay on Delivery"
      }
    ]
  },
  {
    id: "tpl-comparison-benefits",
    name: "9. Comparison & Benefits",
    targetCategory: "Health Supplements / Pet Products",
    primaryCta: "Compare Now",
    heroLayout: "Hero showing product vs common market alternatives comparison chart",
    uniqueConversionElement: "Interactive ingredient comparison matrix with competitor checkmarks",
    mobileBehavior: "Filterable list of competitor columns with highlight badges",
    recommendedAbTest: "Trust certification symbol vs none, CTA label ('See Why We're Better' vs 'Order Now')",
    strategyFocus: "benefits",
    badge: "Side-by-Side Comparison",
    description: "Direct side-by-side comparison tables dismantling cheaper alternatives and justifying premium value.",
    suggestedTheme: {
      primaryColor: "#059669",
      accentColor: "#10B981",
      secondaryColor: "#34D399",
      backgroundColor: "#06130D",
      cardBackgroundColor: "#0E241A",
      textColor: "#ECFDF5",
      fontFamily: "Inter, sans-serif",
      buttonStyle: "pill",
      badgeText: "100% Lab Verified Purity",
      backgroundStyle: "gradient",
      backgroundGradient: "linear-gradient(180deg, #06130D 0%, #0F2C20 45%, #081711 100%)",
      buttonColor: "#059669",
      buttonTextColor: "#FFFFFF"
    },
    suggestedSections: [
      {
        id: "sec-comp-1",
        type: "hero",
        visible: true,
        headline: "Why Cheap Alternatives Cost You More in the Long Run.",
        subheadline: "See how our certified formula outperforms generic store brands in laboratory tests.",
        ctaText: "Order Tested Formula",
        badge: "100% Certified Purity",
        price: 4800,
        originalPrice: 6500
      },
      {
        id: "sec-comp-2",
        type: "comparison",
        visible: true,
        headline: "Our Product vs Standard Market Alternatives",
        items: [
          { title: "Active Ingredient Concentration", description: "98.4% pharmaceutical grade vs 45% in mass-market generics." },
          { title: "No Artificial Binders or Fillers", description: "Zero maltodextrin, zero artificial coloring, 100% bioavailability." },
          { title: "Independent 3rd-Party Lab Verified", description: "Every batch tested with QR code certificate on the bottle." }
        ]
      },
      {
        id: "sec-comp-3",
        type: "cta",
        visible: true,
        headline: "Experience the Proven Difference",
        subheadline: "Try it for 30 days. Full refund if you don't feel noticeable improvements.",
        ctaText: "Order Risk-Free Today"
      }
    ]
  },
  {
    id: "tpl-interactive-quiz",
    name: "10. Interactive Quiz",
    targetCategory: "Cosmetics / Personal Wellness",
    primaryCta: "Find Your Match",
    heroLayout: "Hero with relatable person visual and quiz prompt ('Which formula fits you?')",
    uniqueConversionElement: "Embedded 3-step diagnostic quiz leading directly to tailored product bundle",
    mobileBehavior: "Linear progress bar for quiz steps; fixed 'Next' button with high tap target",
    recommendedAbTest: "Quiz step count (2 questions vs 4 questions), result CTA ('Shop Your Match' vs 'Claim 15% Off')",
    strategyFocus: "custom",
    badge: "Interactive Diagnostics",
    description: "Guides uncertain buyers through a 30-second personalized quiz to recommend the exact SKU.",
    suggestedTheme: {
      primaryColor: "#2563EB",
      accentColor: "#F59E0B",
      secondaryColor: "#60A5FA",
      backgroundColor: "#080F1E",
      cardBackgroundColor: "#101D38",
      textColor: "#EFF6FF",
      fontFamily: "Inter, sans-serif",
      buttonStyle: "pill",
      badgeText: "60-Second Diagnostic",
      backgroundStyle: "gradient",
      backgroundGradient: "linear-gradient(180deg, #080F1E 0%, #122447 45%, #0A1428 100%)",
      buttonColor: "#2563EB",
      buttonTextColor: "#FFFFFF"
    },
    suggestedSections: [
      {
        id: "sec-quiz-1",
        type: "hero",
        visible: true,
        headline: "Find Your Perfect Match in Under 60 Seconds.",
        subheadline: "Take our brief diagnostic assessment to unlock your personalized recommendation.",
        ctaText: "Take the 60-Second Quiz",
        badge: "Diagnostic Tool",
        price: 5400,
        originalPrice: 7200
      },
      {
        id: "sec-quiz-2",
        type: "features",
        visible: true,
        headline: "How the Personalization Engine Works",
        items: [
          { title: "Step 1: Tell Us Your Lifestyle", description: "Select your daily schedule, environment, and personal goals." },
          { title: "Step 2: Algorithmic Matching", description: "Our formula engine selects the optimal ingredient ratio." },
          { title: "Step 3: Direct Doorstep Delivery", description: "Your custom bundle is packaged and dispatched cash-on-delivery." }
        ]
      },
      {
        id: "sec-quiz-3",
        type: "cta",
        visible: true,
        headline: "Ready for Your Personalized Results?",
        subheadline: "Receive an exclusive 20% discount voucher at the end of the quiz.",
        ctaText: "Start Diagnostic Quiz"
      }
    ]
  }
];

export interface GlobalExample {
  id: string;
  brand: string;
  url: string;
  category: string;
  headline: string;
  strategy: string;
  keyTactics: string[];
  takeaway: string;
  stats: string;
}

export const GLOBAL_HIGH_PERFORMING_EXAMPLES: GlobalExample[] = [
  {
    id: "ex-brightland",
    brand: "Brightland",
    url: "brightland.co",
    category: "Californian Olive Oils & Pantry",
    headline: "Highlights media logos and editorial reviews directly above the fold",
    strategy: "Media Press Logos as Instant Authority",
    keyTactics: [
      "Top-fold press mentions from Vogue, NYT, and Bon Appétit",
      "Vibrant product imagery celebrating natural golden tones",
      "Immediate taste note badges and origin certifications"
    ],
    takeaway: "Placing trusted press badges within 200px of the viewport anchors high credibility before visitors even read product specs.",
    stats: "3.8x baseline CVR lift from above-the-fold media bar"
  },
  {
    id: "ex-rare-beauty",
    brand: "Rare Beauty",
    url: "rarebeauty.com",
    category: "Cosmetics & Makeup",
    headline: "Features a gallery of real user unboxings titled 'This is Your Community'",
    strategy: "Peer Social Proof & Community UGC",
    keyTactics: [
      "Real customer selfie gallery with skin tone filters",
      "Direct 'Shop Her Shade' clickable product pins on customer photos",
      "Authentic, un-airbrushed photography celebrating diversity"
    ],
    takeaway: "Letting prospective buyers see their exact demographic using the product eliminates shade hesitation.",
    stats: "+24% add-to-cart rate via community tagged reels"
  },
  {
    id: "ex-olipop",
    brand: "Olipop",
    url: "drinkolipop.com",
    category: "Prebiotic Healthy Sodas",
    headline: "Punchy headline ('A New Kind of Soda') with concise benefit bullet points",
    strategy: "Radical Simplicity & Contrast Framing",
    keyTactics: [
      "Immediate contrast: '3g Sugar vs 39g in Regular Soda'",
      "Concise 3-bullet prebiotic digestive health breakdown",
      "Sticky 'Add Variety Pack' purchase button on scroll"
    ],
    takeaway: "Positioning against a familiar incumbent (traditional sugary soda) makes the value proposition instantly understandable in 3 seconds.",
    stats: "6.2% landing page purchase conversion"
  },
  {
    id: "ex-liquid-death",
    brand: "Liquid Death",
    url: "liquiddeath.com",
    category: "Canned Mountain Water",
    headline: "Embraces an edgy, unforgettable voice: 'Deadly mountains. Delicious water.'",
    strategy: "Disruptive Brand Voice & Gothic Humor",
    keyTactics: [
      "Brutalist typography and gothic heavy metal art direction",
      "Eco-message: 'Death to Plastic' turning recycling into an attitude",
      "Hyper-sharable entertainment videos embedded alongside buy buttons"
    ],
    takeaway: "Commodity products (like water) win on distinctive brand emotion rather than dry spec sheets.",
    stats: "Over 500k viral social shares leading to DTC purchases"
  },
  {
    id: "ex-thousand",
    brand: "Thousand",
    url: "explorethousand.com",
    category: "Urban Cycling & Bike Helmets",
    headline: "Narrates a heartfelt founder mission timeline conveying deep trust",
    strategy: "Founder Storytelling & Mission Timeline",
    keyTactics: [
      "Interactive timeline detailing how a friend's accident inspired the product",
      "Safety impact statistics and anti-theft guarantee",
      "Clean 360-degree color swatch selector"
    ],
    takeaway: "Connecting the purchase to human safety and founder purpose dissolves price resistance for safety gear.",
    stats: "4.8/5 rating with over 8,000 verified buyer reviews"
  },
  {
    id: "ex-jolie",
    brand: "Jolie Skin Co",
    url: "jolieskinco.com/water-report",
    category: "Filtered Showerhead & Skin Health",
    headline: "Confrontational problem-first hook: 'Stop showering in chlorine'",
    strategy: "Lead Magnet & Water Quality Diagnostic",
    keyTactics: [
      "Postal code input tool to look up local water chlorine levels",
      "High-contrast CTA: 'Get my free water report'",
      "Clinical before-and-after skin hydration results"
    ],
    takeaway: "Framing the product as the antidote to an invisible daily danger (chlorinated tap water) creates immense conversion urgency.",
    stats: "Over 45% form submission rate on diagnostic page"
  },
  {
    id: "ex-bearaby",
    brand: "Bearaby",
    url: "bearaby.com",
    category: "Knitted Weighted Blankets",
    headline: "Seasonal holiday sale promotion: 'Mother's Day Sale – Save up to 30%'",
    strategy: "Event-Driven Seasonal Urgency",
    keyTactics: [
      "Large 'Shop the Sale' high-contrast CTA above the fold",
      "Gift bundle suggestions with express delivery countdown",
      "Tactile close-up photography showcasing hand-knit chunky yarn"
    ],
    takeaway: "Anchoring promotions to cultural holidays gives shoppers a clear deadline and reason to buy now.",
    stats: "2.8x revenue multiplier during holiday promo windows"
  },
  {
    id: "ex-butcherbox",
    brand: "ButcherBox",
    url: "butcherbox.com",
    category: "Organic Meat Delivery Subscription",
    headline: "Multiple above-the-fold CTAs with sticky banners offering free bacon for life",
    strategy: "Irresistible Bonus Offer & Multiple CTAs",
    keyTactics: [
      "High-value bonus: 'Free Bacon in Every Box for 1 Year'",
      "Above-the-fold choices: 'Choose Your Plan' and 'Get Started'",
      "Unboxing video demonstrating cold insulated delivery"
    ],
    takeaway: "Stacking a high-perceived-value physical freebie overcomes subscription commitment fear.",
    stats: "Consistent top-tier 5.8% subscription activation"
  },
  {
    id: "ex-tower28",
    brand: "Tower 28",
    url: "tower28beauty.com",
    category: "Sensitive Skin Cosmetics",
    headline: "Interactive shade-finder quiz above the fold with alternate touchpoints",
    strategy: "Interactive Micro-Quiz Above the Fold",
    keyTactics: [
      "Interactive 20-second shade matcher eliminating color hesitation",
      "Alternate friction-free CTAs: Selfie upload or Instagram DM consultation",
      "National Eczema Association seal of acceptance badge"
    ],
    takeaway: "Offering fallback assistance (like DM-ing a photo) catches hesitant shoppers who might otherwise bounce.",
    stats: "38% quiz completion rate with 14% direct purchase conversion"
  },
  {
    id: "ex-maev",
    brand: "Maev",
    url: "meetmaev.com",
    category: "Raw Human-Grade Dog Food",
    headline: "Engaging ingredient comparison tool with visual side-by-side graphs",
    strategy: "Visual Ingredient Comparison & Health Graphs",
    keyTactics: [
      "Kibble vs Raw interactive slider showing real meat vs meat meal",
      "Calculators for daily energy, coat shine, and digestion improvements",
      "Transparent breakdown of vet-formulated superfoods"
    ],
    takeaway: "Visual graphs comparing standard products against premium quality give pet parents the emotional reassurance they need.",
    stats: "+31% checkout rate among users interacting with comparison slider"
  }
];

export const AI_STUDIO_PROMPT_PATTERNS = {
  basicTemplate: {
    title: "1. Basic Landing Page Prompt",
    description: "Standard creative brief prompt for Google AI Studio generating high-converting product landing pages.",
    prompt: `Create a high-converting landing page for [ProductName] targeting [AudienceDescription]. 
The customer problem is [CustomerProblem]. 
The main differentiation is [UniqueBenefit]. 

Include sections:
1. A hero with a benefit-driven headline and bold subheadline.
2. Three key value propositions with icons.
3. An objection-handling section (e.g. FAQ or Guarantee).
4. Social proof / verified customer testimonials.
5. A strong call-to-action button with concise microcopy.

Tone: [Professional / Friendly / Urgency-driven], in English. 
Avoid any claims not directly supported by the product data.`
  },
  withConstraints: {
    title: "2. Prompt with Strict Factual Constraints",
    description: "Guards against hallucination, enforces merchant pricing constraints, and maintains strict brand guidelines.",
    prompt: `Create a landing page using ONLY the provided merchant data:
Product: [ProductName]
Regular Price: [RegularPrice] DA
Offer Price: [OfferPrice] DA
Key Features: [FeaturesList]
Shipping Policy: [ShippingPolicy] (Cash on Delivery across 58 Wilayas)

CONSTRAINTS:
- Do not invent any unverified statistics, fake certifications, or fabricated customer reviews.
- Adhere strictly to the brand voice: [BrandVoice].
- Emphasize package inspection before payment to eliminate customer fear.
- Ensure all CTA buttons use active, decisive verbs ('Order Cash on Delivery', 'Claim 20% Discount').
- Language: English only.`
  },
  urgencyVariation: {
    title: "3. Urgency & Flash Offer Rewrite Prompt",
    description: "Re-engineers an existing landing page copy to maximize limited-time conversion and impulse buying.",
    prompt: `Rewrite the current landing page for [ProductName] to focus aggressively on scarcity and limited-time offer urgency:
1. Change the hero headline to emphasize a 24-hour stock clearance or seasonal discount drop.
2. Add a dynamic countdown timer badge ('Offer Expires at Midnight').
3. Inject urgency microcopy: 'Only [StockRemaining] units remaining at this price point'.
4. Add a low-inventory risk-reversal guarantee: 'Order today to lock in free courier delivery'.
5. Keep copy concise, punchy, and in English.`
  }
};

export const ROLLOUT_PHASES = [
  {
    phase: "Q3 2025",
    title: "Planning & Data-Model Design",
    description: "Schema definition for LandingPage, PageTemplate, Component, Product, Variant, and Event logging.",
    status: "Completed",
    color: "bg-indigo-500"
  },
  {
    phase: "Q4 2025",
    title: "Template & UI Design; Brand Guides",
    description: "Implementation of the 10 growth templates, responsive fluid layouts, and mobile sticky CTA architecture.",
    status: "Completed",
    color: "bg-blue-500"
  },
  {
    phase: "Q1 2026",
    title: "Development & Integration",
    description: "Smart link routing engine, dynamic traffic allocation sliders, and multi-channel attribution.",
    status: "Completed",
    color: "bg-emerald-500"
  },
  {
    phase: "Q2 2026",
    title: "A/B Testing & Analytics Setup",
    description: "Statistical confidence thresholds, CAC & LTV cohort calculators, and funnel conversion tracking.",
    status: "In Progress",
    color: "bg-amber-500"
  },
  {
    phase: "Q3 2026",
    title: "Launch & Optimization Cycle",
    description: "Continuous algorithmic re-weighting, real-time pixel event streaming, and automated budget shifting.",
    status: "Upcoming",
    color: "bg-purple-500"
  }
];

export const IMPLEMENTATION_CHECKLIST = [
  {
    category: "Data Models & Architecture",
    items: [
      { id: "chk-1", title: "LandingPage & PageTemplate schemas linked to Merchant", done: true },
      { id: "chk-2", title: "Product & Variant entity relations supporting real-time price updates", done: true },
      { id: "chk-3", title: "Event tracking logging: Page View, Hero CTA Click, Form Submit, Variant Select, Offer Click", done: true }
    ]
  },
  {
    category: "Responsive & CSS UX Standards",
    items: [
      { id: "chk-4", title: "Fluid mobile breakpoints: Multi-column stacks on viewport < 768px", done: true },
      { id: "chk-5", title: "Sticky mobile purchase footer pinned with product thumbnail & dynamic prompt", done: true },
      { id: "chk-6", title: "Touch tap targets strictly ≥ 44px height for all buttons and swatches", done: true },
      { id: "chk-7", title: "WCAG AA color contrast compliance (≥ 4.5:1 text, ≥ 3:1 large controls)", done: true }
    ]
  },
  {
    category: "Performance & SEO",
    items: [
      { id: "chk-8", title: "Sub-2 second page load target for cold paid ad traffic", done: true },
      { id: "chk-9", title: "Open Graph share preview meta tags with social card banners", done: true },
      { id: "chk-10", title: "Real-time client-side form validation with inline feedback", done: true }
    ]
  },
  {
    category: "Conversion Intelligence & CRO",
    items: [
      { id: "chk-11", title: "Dynamic traffic distribution lock with strict 100% allocation constraint", done: true },
      { id: "chk-12", title: "A/B testing statistical confidence threshold calculator (min 150 visitors)", done: true },
      { id: "chk-13", title: "Customer Acquisition Cost (CAC) and Customer Lifetime Value (LTV) cohort reporting", done: true }
    ]
  }
];
