import { GrowthCampaign } from "../../types/growthStudio";

export const INITIAL_GROWTH_CAMPAIGNS: GrowthCampaign[] = [
  {
    id: "camp-trading-ebook",
    storeId: "store-1",
    name: "Arabic Trading E-Book Campaign — خطواتك الأولى للربح في التداول",
    product: {
      id: "prod-trading-ebook-1",
      name: "كتاب خطواتك الأولى للربح في التداول",
      price: 3900,
      originalPrice: 5800,
      imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80",
      category: "Digital Books & Courses",
      description: "دليل عملي شامل واستراتيجيات مثبتة إحصائياً لقراءة الشموع اليابانية، إدارة المخاطر، وتنفيذ صفقات رابحة من الصفر حتى الاحتراف."
    },
    offer: "خصم 35% لفترة محدودة + شحن مجاني لكافة الولايات مع الدفع عند الاستلام",
    trafficSources: ["Facebook", "Instagram", "TikTok", "Snapchat", "WhatsApp"],
    goal: "purchases",
    status: "active",
    createdAt: "2026-09-01T10:00:00Z",
    updatedAt: "2026-09-17T08:30:00Z",
    distributionMode: "smart",
    distributionRationale: "Landing Page 01 (Arabic Trading Masterclass) achieves 11.8% conversion rate with high engagement from algorithmic and retail finance traffic.",
    smartLinkSlug: "trading-ebook-arabic",
    settings: {
      confidenceThreshold: 150,
      autoOptimize: true,
      pixelTracking: true
    },
    landingPages: [
      {
        id: "lp-trade-01",
        campaignId: "camp-trading-ebook",
        name: "صفحة الهبوط الرئيسية — التداول المالي",
        status: "active",
        strategyFocus: "benefits",
        trafficAllocation: 60,
        suggestedAllocation: 65,
        language: "ar",
        currency: "DA",
        market: "Algeria & MENA",
        theme: {
          primaryColor: "#0A1F44",
          accentColor: "#E2A26C",
          secondaryColor: "#4A90E2",
          backgroundColor: "#070F1E",
          cardBackgroundColor: "#0E1C36",
          textColor: "#F4F6F8",
          fontFamily: "'Cairo', 'Tajawal', sans-serif",
          buttonStyle: "pill",
          badgeText: "الكتاب المالي الأكثر مبيعاً",
          backgroundStyle: "gradient",
          backgroundGradient: "linear-gradient(180deg, #070F1E 0%, #0A1F44 45%, #08152B 100%)",
          backgroundImageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80",
          overlayColor: "#0A1F44",
          overlayOpacity: 0.85,
          buttonColor: "#E2A26C",
          buttonTextColor: "#0A1F44"
        },
        metrics: {
          visitors: 2450,
          uniqueVisitors: 2180,
          sessions: 2600,
          pageViews: 4120,
          addToCart: 480,
          checkoutStarted: 390,
          conversions: 289,
          revenue: 1127100,
          averageOrderValue: 3900
        },
        sourceBreakdown: {
          Instagram: { visitors: 1120, conversions: 138, revenue: 538200 },
          Facebook: { visitors: 820, conversions: 96, revenue: 374400 },
          TikTok: { visitors: 390, conversions: 42, revenue: 163800 },
          WhatsApp: { visitors: 120, conversions: 13, revenue: 50700 }
        },
        deviceBreakdown: {
          mobile: { visitors: 2156, conversions: 254, revenue: 990600 },
          desktop: { visitors: 245, conversions: 31, revenue: 120900 },
          tablet: { visitors: 49, conversions: 4, revenue: 15600 }
        },
        sections: [
          {
            id: "sec-tr-hero",
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
            id: "sec-tr-problem",
            type: "problem",
            visible: true,
            headline: "لماذا يخسر 90% من المتداولين أموالهم في أول 90 يوماً؟",
            subheadline: "الدخول إلى الأسواق المالية دون استراتيجية واضحة وخطة إدارة مخاطر صارمة يحول التداول إلى مجرد مقامرة عشوائية.",
            badge: "المشكلة الشائعة",
            items: [
              { title: "الاعتماد على العواطف والشائعات", description: "الشراء بدافع الطمع عند القمم والبيع بدافع الخوف عند القيعان دون أي تحليل منطقي." },
              { title: "غياب خطة صارمة لإدارة رأس المال", description: "المخاطرة بنسب مئوية مبالغ فيها تؤدي إلى تصفير الحساب في صفقات معدودة." },
              { title: "تشتت المعلومات والمصادر غير الموثوقة", description: "متابعة عشرات المؤشرات المتضاربة وقنوات التوصيات العشوائية التي تزيد من الارتباك." }
            ]
          },
          {
            id: "sec-tr-solution",
            type: "solution",
            visible: true,
            headline: "الحل بين يديك: كتاب خطواتك الأولى للربح في التداول",
            subheadline: "دليل منهجي تطبيقي يبسط لك أسرار صانع السوق ويمنحك خريطة طريق واضحة ومحددة لكل صفقة.",
            imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80",
            items: [
              { title: "منهجية مبسطة خطوة بخطوة", description: "شرح سلس من الصفر بالرسوم التوضيحية لجميع نماذج الشموع اليابانية الكلاسيكية." },
              { title: "قاعدة الـ 1% الذهبية لحماية رأس المال", description: "كيف تضمن بقاءك في السوق لأطول فترة مع تحقيق نمو تراكمي آمن لمحفظتك." },
              { title: "قوائم تحقق وتطبيقات يومية", description: "خطة واضحة لا تقبل اللبس لتحديد نقاط الدخول، وقف الخسارة، وأخذ الأرباح بدقة." }
            ]
          },
          {
            id: "sec-tr-product",
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
            id: "sec-tr-benefits",
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
            id: "sec-tr-how",
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
            id: "sec-tr-why",
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
            id: "sec-tr-faq",
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
            id: "sec-tr-guarantee",
            type: "guarantee",
            visible: true,
            headline: "ضمان استرداد المال خلال 30 يومًا",
            subheadline: "نحن نتحمل المخاطرة كاملة عنك. إذا طبقت قواعد الكتاب ولم تجد فيه فائدة نوعية في تداولك، فلك كامل الحق في استرداد ثمن الكتاب دون أي تعقيدات.",
            badge: "ضمان ذهبي بلا شروط",
            ctaText: "اطلب نسختك بأمان تام"
          },
          {
            id: "sec-tr-cta",
            type: "cta",
            visible: true,
            headline: "انضم إلى مئات المتداولين الناجحين",
            subheadline: "لا تدع الوقت يمر وأنت تتداول بطرق عشوائية. امتلك دليلك اليوم وابدأ التداول كالمحترفين.",
            ctaText: "ابدأ الربح اليوم • احصل على نسختك الآن",
            ctaSubtext: "دفع آمن عند الاستلام • فحص الطرد أمام عامل التوصيل متاح"
          },
          {
            id: "sec-tr-footer",
            type: "footer",
            visible: true,
            headline: "جميع الحقوق محفوظة © خطواتك الأولى للربح في التداول • منصة يومي Yume"
          }
        ]
      },
      {
        id: "lp-trade-02",
        campaignId: "camp-trading-ebook",
        name: "صفحة الهبوط البديلة — عرض محدود",
        status: "active",
        strategyFocus: "offer_urgency",
        trafficAllocation: 40,
        suggestedAllocation: 35,
        language: "ar",
        currency: "DA",
        market: "Algeria & MENA",
        theme: {
          primaryColor: "#0A1F44",
          accentColor: "#E2A26C",
          secondaryColor: "#4A90E2",
          backgroundColor: "#0F172A",
          cardBackgroundColor: "#1E293B",
          textColor: "#F8FAFC",
          fontFamily: "'Cairo', 'Tajawal', sans-serif",
          buttonStyle: "rounded",
          badgeText: "خصم 35% لليوم فقط",
          backgroundStyle: "gradient",
          backgroundGradient: "linear-gradient(180deg, #0F172A 0%, #1E293B 100%)",
          backgroundImageUrl: "https://images.unsplash.com/photo-1508962914676-134849a727f0?w=1200&q=80",
          overlayColor: "#0A1F44",
          overlayOpacity: 0.85,
          buttonColor: "#E2A26C",
          buttonTextColor: "#0A1F44"
        },
        metrics: {
          visitors: 1420,
          uniqueVisitors: 1250,
          sessions: 1530,
          pageViews: 2410,
          addToCart: 280,
          checkoutStarted: 215,
          conversions: 158,
          revenue: 616200,
          averageOrderValue: 3900
        },
        sourceBreakdown: {
          Instagram: { visitors: 650, conversions: 78, revenue: 304200 },
          TikTok: { visitors: 480, conversions: 51, revenue: 198900 },
          Facebook: { visitors: 290, conversions: 29, revenue: 113100 }
        },
        deviceBreakdown: {
          mobile: { visitors: 1250, conversions: 141, revenue: 549900 },
          desktop: { visitors: 142, conversions: 15, revenue: 58500 },
          tablet: { visitors: 28, conversions: 2, revenue: 7800 }
        },
        sections: [
          {
            id: "sec-tr2-hero",
            type: "hero",
            visible: true,
            headline: "دليلك خطوة بخطوة إلى صفقات مربحة",
            subheadline: "تعلم قراءة الشموع اليابانية ونماذج حركة الأسعار واستراتيجيات حماية رأس المال",
            badge: "عرض حصري ينتهي الليلة",
            imageUrl: "https://images.unsplash.com/photo-1508962914676-134849a727f0?w=1200&q=80",
            ctaText: "اطلب نسختك الآن بخصم 35%",
            ctaSubtext: "توصيل سريع لباب منزلك • الدفع بعد المعاينة",
            price: 3900,
            originalPrice: 5800
          },
          {
            id: "sec-tr2-benefits",
            type: "benefits",
            visible: true,
            headline: "ماذا ستتعلم بالتحديد؟",
            subheadline: "استراتيجيات تداول مثبتة وخالية من التعقيد",
            items: [
              { title: "قراءة احترافية لحركة السعر", description: "تحديد القمم والقيعان الحقيقية وفهم سلوك السيولة الذكية." },
              { title: "حماية الأرباح ووقف الخسارة", description: "معادلات رياضية بسيطة لحساب حجم الصفقة بدقة." },
              { title: "أمثلة حية وتطبيقات", description: "شروحات من الشارت الحقيقي لمختلف الأسواق المالية." }
            ]
          },
          {
            id: "sec-tr2-cta",
            type: "cta",
            visible: true,
            headline: "ابدأ مسيرتك في التداول اليوم",
            subheadline: "انضم إلى المتداولين الناجحين الذين غيروا طريقة تعاملهم مع الأسواق.",
            ctaText: "تأكيد الطلب الفوري",
            ctaSubtext: "الدفع عند الاستلام مع المعاينة"
          }
        ]
      }
    ]
  },
  {
    id: "camp-summer-shoes",
    storeId: "store-1",
    name: "Summer Ergonomic Footwear Campaign",
    product: {
      id: "prod-summer-shoes-1",
      name: "Ultra-Light Ergonomic Summer Sneakers",
      price: 4900,
      originalPrice: 6800,
      imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
      category: "Footwear",
      description: "Orthopedic, ultra-breathable summer sneakers engineered for maximum comfort, all-day walking, and temperature control."
    },
    offer: "Buy 1 Get 2nd at 50% Off + Free Nationwide Express Delivery",
    trafficSources: ["Instagram", "TikTok", "Facebook", "Snapchat", "WhatsApp"],
    goal: "purchases",
    status: "active",
    createdAt: "2026-08-20T10:00:00Z",
    updatedAt: "2026-09-03T09:30:00Z",
    distributionMode: "smart",
    distributionRationale: "Landing Page 02 is receiving 45% traffic allocation because its purchase conversion rate (9.4%) significantly outperforms other pages.",
    smartLinkSlug: "summer-sneakers",
    settings: {
      confidenceThreshold: 150,
      autoOptimize: true,
      pixelTracking: true
    },
    landingPages: [
      {
        id: "lp-summer-01",
        campaignId: "camp-summer-shoes",
        name: "Landing Page 01",
        status: "active",
        strategyFocus: "benefits",
        trafficAllocation: 30,
        suggestedAllocation: 25,
        theme: {
          primaryColor: "#4f46e5",
          accentColor: "#06b6d4",
          backgroundColor: "#ffffff",
          fontFamily: "Inter, sans-serif",
          buttonStyle: "pill",
          badgeText: "Ultimate Daily Comfort"
        },
        metrics: {
          visitors: 1250,
          uniqueVisitors: 1120,
          sessions: 1340,
          pageViews: 1890,
          addToCart: 210,
          checkoutStarted: 145,
          conversions: 95,
          revenue: 465500,
          averageOrderValue: 4900
        },
        sourceBreakdown: {
          Instagram: { visitors: 480, conversions: 42, revenue: 205800 },
          TikTok: { visitors: 420, conversions: 24, revenue: 117600 },
          Facebook: { visitors: 210, conversions: 18, revenue: 88200 },
          Snapchat: { visitors: 90, conversions: 7, revenue: 34300 },
          WhatsApp: { visitors: 50, conversions: 4, revenue: 19600 }
        },
        deviceBreakdown: {
          mobile: { visitors: 1040, conversions: 81, revenue: 396900 },
          desktop: { visitors: 160, conversions: 11, revenue: 53900 },
          tablet: { visitors: 50, conversions: 3, revenue: 14700 }
        },
        sections: [
          {
            id: "sec-1",
            type: "hero",
            visible: true,
            headline: "Relieve Foot Fatigue & Stay Cool with Ultra-Light Comfort Sneakers",
            subheadline: "Innovative orthopedic air-sole cushioning with 360-degree breathable mesh engineered for all-day continuous support.",
            badge: "Top Rated Comfort Collection",
            ctaText: "Order Now - Cash on Delivery",
            ctaSubtext: "Express delivery available across all provinces",
            imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80"
          },
          {
            id: "sec-2",
            type: "benefits",
            visible: true,
            headline: "Why Over 12,000 Verified Customers Choose This Model",
            subheadline: "Purpose-built features designed for demanding everyday routines",
            items: [
              { title: "Ultra-Lightweight (210g)", description: "Zero heavy drag on your feet even after 10 hours of non-stop walking." },
              { title: "Orthopedic Shock Absorption", description: "Absorbs ground impact and relieves stress on knees and lower back joints." },
              { title: "Adaptive Aeration Matrix", description: "High-permeability fabric prevents heat buildup and moisture accumulation." }
            ]
          },
          {
            id: "sec-3",
            type: "urgency",
            visible: true,
            headline: "Limited Seasonal Promotion: Buy 1, Get 2nd at 50% Off",
            subheadline: "Remaining warehouse allocation for today: 24 pairs only",
            badge: "Seasonal Flash Offer"
          },
          {
            id: "sec-4",
            type: "reviews",
            visible: true,
            headline: "Verified Customer Feedback",
            subheadline: "Real reviews from customers across major metropolitan hubs",
            items: [
              { title: "David M. - Verified Buyer", description: "Excellent cushioning and very lightweight. Delivered quickly and sizing was 100% true.", rating: 5 },
              { title: "Sarah T. - Verified Buyer", description: "Bought a pair for my husband and he wears them daily. Ordering a second pair right now.", rating: 5 }
            ]
          },
          {
            id: "sec-5",
            type: "guarantee",
            visible: true,
            headline: "Inspection Guarantee & Free Size Exchange",
            subheadline: "Inspect your package upon delivery before completing payment."
          },
          {
            id: "sec-6",
            type: "cta",
            visible: true,
            headline: "Claim Your Special Seasonal Offer Today",
            subheadline: "Quick checkout form with instant dispatch confirmation.",
            ctaText: "Confirm Order Now"
          }
        ]
      },
      {
        id: "lp-summer-02",
        campaignId: "camp-summer-shoes",
        name: "Landing Page 02",
        status: "active",
        strategyFocus: "social_proof",
        trafficAllocation: 45,
        suggestedAllocation: 55,
        theme: {
          primaryColor: "#059669",
          accentColor: "#10b981",
          backgroundColor: "#f8fafc",
          fontFamily: "Inter, sans-serif",
          buttonStyle: "pill",
          badgeText: "Rated 4.9/5 by 3,400+ Verified Buyers"
        },
        metrics: {
          visitors: 1180,
          uniqueVisitors: 1060,
          sessions: 1290,
          pageViews: 1980,
          addToCart: 240,
          checkoutStarted: 168,
          conversions: 111,
          revenue: 543900,
          averageOrderValue: 4900
        },
        sourceBreakdown: {
          Instagram: { visitors: 510, conversions: 58, revenue: 284200 },
          TikTok: { visitors: 390, conversions: 31, revenue: 151900 },
          Facebook: { visitors: 160, conversions: 14, revenue: 68600 },
          Snapchat: { visitors: 80, conversions: 6, revenue: 29400 },
          WhatsApp: { visitors: 40, conversions: 2, revenue: 9800 }
        },
        deviceBreakdown: {
          mobile: { visitors: 1010, conversions: 98, revenue: 480200 },
          desktop: { visitors: 120, conversions: 9, revenue: 44100 },
          tablet: { visitors: 50, conversions: 4, revenue: 19600 }
        },
        sections: [
          {
            id: "sec-201",
            type: "hero",
            visible: true,
            headline: "The Trending Footwear Sensation: See Why Podiatrists & Active Professionals Agree",
            subheadline: "Over 3,400 verified 5-star ratings nationwide. Immediate cloud-like comfort that lasts from morning till night.",
            badge: "Leading Customer Choice",
            ctaText: "Join Thousands of Happy Customers",
            ctaSubtext: "Cash on delivery with full doorstep inspection",
            imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80"
          },
          {
            id: "sec-202",
            type: "testimonials",
            visible: true,
            headline: "Real Results & Long-Term Feedback",
            subheadline: "Customer stories documented after weeks of rigorous daily wear",
            items: [
              { title: "Dr. K. Vance - General Practitioner", description: "I recommend these to anyone on their feet during extended clinic shifts. Noticeable joint relief.", rating: 5 },
              { title: "Michael S. - Educator", description: "Best footwear upgrade of the year. Breathable, feather-light, and pairs nicely with casual wear.", rating: 5 },
              { title: "Elena R. - Architect", description: "Ordered two pairs for site inspections. Super fast delivery and high quality finish.", rating: 5 }
            ]
          },
          {
            id: "sec-203",
            type: "comparison",
            visible: true,
            headline: "Head-to-Head: Ultra-Light Comfort vs. Standard Sneakers",
            subheadline: "Examine the technical distinction before making your decision",
            items: [
              { title: "Weight & Agility", description: "Ultra-Light: 210g vs 480g for traditional athletic shoes." },
              { title: "Air Circulation", description: "360-degree micro-perforated mesh prevents sweating completely." },
              { title: "Warranty & Support", description: "100% free size exchange and doorstep replacement guarantee." }
            ]
          },
          {
            id: "sec-204",
            type: "cta",
            visible: true,
            headline: "Order Now & Save 25% with Express Courier Shipping",
            subheadline: "Secure your size while popular inventory remains in stock (Sizes 40 - 45)",
            ctaText: "Reserve Your Pair Now"
          }
        ]
      },
      {
        id: "lp-summer-03",
        campaignId: "camp-summer-shoes",
        name: "Landing Page 03",
        status: "active",
        strategyFocus: "offer_urgency",
        trafficAllocation: 25,
        suggestedAllocation: 20,
        theme: {
          primaryColor: "#dc2626",
          accentColor: "#f97316",
          backgroundColor: "#ffffff",
          fontFamily: "Inter, sans-serif",
          buttonStyle: "pill",
          badgeText: "Flash Clearance Ends Tonight"
        },
        metrics: {
          visitors: 1210,
          uniqueVisitors: 1090,
          sessions: 1320,
          pageViews: 1740,
          addToCart: 175,
          checkoutStarted: 110,
          conversions: 76,
          revenue: 372400,
          averageOrderValue: 4900
        },
        sourceBreakdown: {
          Instagram: { visitors: 410, conversions: 28, revenue: 137200 },
          TikTok: { visitors: 470, conversions: 32, revenue: 156800 },
          Facebook: { visitors: 190, conversions: 10, revenue: 49000 },
          Snapchat: { visitors: 90, conversions: 4, revenue: 19600 },
          WhatsApp: { visitors: 50, conversions: 2, revenue: 9800 }
        },
        deviceBreakdown: {
          mobile: { visitors: 1060, conversions: 65, revenue: 318500 },
          desktop: { visitors: 100, conversions: 8, revenue: 39200 },
          tablet: { visitors: 50, conversions: 3, revenue: 14700 }
        },
        sections: [
          {
            id: "sec-301",
            type: "hero",
            visible: true,
            headline: "Warehouse Clearance Event: Premium Ergonomic Summer Sneakers at 40% Off",
            subheadline: "Exclusive batch pricing available for direct factory distribution. Final inventory clearance.",
            badge: "Countdown Offer: 40% Off",
            ctaText: "Claim 40% Discount Now",
            ctaSubtext: "Express delivery with cash on delivery payment",
            imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80"
          },
          {
            id: "sec-302",
            type: "urgency",
            visible: true,
            headline: "Limited Availability: Only 28 Pairs Left at Promotional Price",
            subheadline: "Once this batch is depleted, regular retail pricing of 6,800 DA will resume automatically.",
            badge: "Low Stock Alert"
          },
          {
            id: "sec-303",
            type: "faq",
            visible: true,
            headline: "Frequently Asked Questions",
            subheadline: "Clear answers to help you order with confidence",
            items: [
              { title: "Can I inspect the shoes before paying?", description: "Yes, you can inspect your package directly with the delivery agent prior to payment." },
              { title: "What if the size does not fit perfectly?", description: "We provide an immediate, free size exchange service within 48 hours." },
              { title: "How fast is delivery?", description: "Orders are dispatched within 24 hours with typical delivery in 24 to 48 hours." }
            ]
          },
          {
            id: "sec-304",
            type: "cta",
            visible: true,
            headline: "Lock In Your Promotional Price Before Midnight",
            subheadline: "Take advantage of factory clearance pricing while supplies last.",
            ctaText: "Order Now - Pay on Delivery"
          }
        ]
      }
    ]
  },
  {
    id: "camp-marine-gear",
    storeId: "store-1",
    name: "Marine & Nautical Gear Campaign",
    product: {
      id: "prod-marine-gear-1",
      name: "Pro Waterproof Offshore Utility Pack",
      price: 8500,
      originalPrice: 11500,
      imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
      category: "Outdoor & Marine",
      description: "Submersible IPX8 waterproof dry bag system designed for sailing, coastal excursions, and demanding marine environments."
    },
    offer: "Includes Free High-Visibility Dry Case + Free Courier Shipping",
    trafficSources: ["Facebook", "Instagram", "Google", "TikTok", "WhatsApp"],
    goal: "purchases",
    status: "active",
    createdAt: "2026-08-25T14:00:00Z",
    updatedAt: "2026-09-05T16:00:00Z",
    distributionMode: "manual",
    distributionRationale: "Traffic distributed 35% to Landing Page A, 40% to Landing Page B, and 25% to Landing Page C.",
    smartLinkSlug: "marine-utility",
    settings: {
      confidenceThreshold: 150,
      autoOptimize: false,
      pixelTracking: true
    },
    landingPages: [
      {
        id: "lp-marine-01",
        campaignId: "camp-marine-gear",
        name: "Landing Page A",
        status: "active",
        strategyFocus: "benefits",
        trafficAllocation: 35,
        suggestedAllocation: 30,
        theme: {
          primaryColor: "#0284c7",
          accentColor: "#0ea5e9",
          backgroundColor: "#ffffff",
          fontFamily: "Inter, sans-serif",
          buttonStyle: "pill",
          badgeText: "High AOV Bundle"
        },
        metrics: {
          visitors: 800,
          uniqueVisitors: 720,
          sessions: 860,
          pageViews: 1240,
          addToCart: 110,
          checkoutStarted: 78,
          conversions: 50,
          revenue: 450000,
          averageOrderValue: 9000
        },
        sourceBreakdown: {
          Facebook: { visitors: 320, conversions: 22, revenue: 198000 },
          Instagram: { visitors: 260, conversions: 18, revenue: 162000 },
          Google: { visitors: 140, conversions: 7, revenue: 63000 },
          TikTok: { visitors: 80, conversions: 3, revenue: 27000 }
        },
        deviceBreakdown: {
          mobile: { visitors: 580, conversions: 35, revenue: 315000 },
          desktop: { visitors: 180, conversions: 12, revenue: 108000 },
          tablet: { visitors: 40, conversions: 3, revenue: 27000 }
        },
        sections: [
          {
            id: "sec-m1",
            type: "hero",
            visible: true,
            headline: "Heavy-Duty IPX8 Submersible Offshore Utility Pack",
            subheadline: "Engineered for harsh coastal climates with military-grade tarpaulin and zero-leak welded seams.",
            badge: "Professional Marine Grade",
            ctaText: "Order Offshore Pack - Cash on Delivery",
            ctaSubtext: "Includes complimentary phone dry-case",
            imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80"
          },
          {
            id: "sec-m2",
            type: "benefits",
            visible: true,
            headline: "Built to Withstand Saltwater, Wind, and Heavy Surges",
            subheadline: "Tested under extreme offshore sea conditions",
            items: [
              { title: "100% Submersible Seal", description: "Keeps electronics and documents fully bone dry even if dropped in water." },
              { title: "Reinforced 500D Tarpaulin", description: "Resistant to abrasive rock surfaces, hooks, and UV degradation." },
              { title: "Ergonomic Sternum Harness", description: "Padded load-dispersing straps provide comfort during all-day transit." }
            ]
          },
          {
            id: "sec-m3",
            type: "cta",
            visible: true,
            headline: "Equip Your Next Coastal Expedition",
            subheadline: "Dispatched with guaranteed inspection before payment.",
            ctaText: "Claim Your Pack with Free Bonus"
          }
        ]
      },
      {
        id: "lp-marine-02",
        campaignId: "camp-marine-gear",
        name: "Landing Page B",
        status: "active",
        strategyFocus: "social_proof",
        trafficAllocation: 40,
        suggestedAllocation: 50,
        theme: {
          primaryColor: "#0f766e",
          accentColor: "#14b8a6",
          backgroundColor: "#ffffff",
          fontFamily: "Inter, sans-serif",
          buttonStyle: "pill",
          badgeText: "Leading Conversion Signal"
        },
        metrics: {
          visitors: 830,
          uniqueVisitors: 750,
          sessions: 890,
          pageViews: 1390,
          addToCart: 145,
          checkoutStarted: 98,
          conversions: 70,
          revenue: 385000,
          averageOrderValue: 5500
        },
        sourceBreakdown: {
          Facebook: { visitors: 340, conversions: 31, revenue: 170500 },
          Instagram: { visitors: 280, conversions: 24, revenue: 132000 },
          Google: { visitors: 130, conversions: 11, revenue: 60500 },
          TikTok: { visitors: 80, conversions: 4, revenue: 22000 }
        },
        deviceBreakdown: {
          mobile: { visitors: 620, conversions: 52, revenue: 286000 },
          desktop: { visitors: 160, conversions: 14, revenue: 77000 },
          tablet: { visitors: 50, conversions: 4, revenue: 22000 }
        },
        sections: [
          {
            id: "sec-mb1",
            type: "hero",
            visible: true,
            headline: "Trusted by Captains & Marine Enthusiasts Across the Coastline",
            subheadline: "See why experienced navigators choose the Pro Utility Pack for reliable gear protection.",
            badge: "Leading Page - High Conversion",
            ctaText: "Order Now - Doorstep Inspection",
            ctaSubtext: "Free delivery across all coastal regions",
            imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80"
          },
          {
            id: "sec-mb2",
            type: "testimonials",
            visible: true,
            headline: "Field Reports from Offshore Skippers",
            subheadline: "Unfiltered testimonials from active maritime professionals",
            items: [
              { title: "Capt. Julian B.", description: "Used this through two seasons of coastal charters. Zero moisture penetration. Superb gear.", rating: 5 },
              { title: "Samir K. - Scuba Instructor", description: "Indispensable on our dive boats. Sturdy zippers, airtight seal, and quick shipping.", rating: 5 }
            ]
          },
          {
            id: "sec-mb3",
            type: "cta",
            visible: true,
            headline: "Upgrade to Professional Grade Marine Storage",
            subheadline: "Cash on delivery payment with immediate shipping dispatch.",
            ctaText: "Confirm Your Order Now"
          }
        ]
      },
      {
        id: "lp-marine-03",
        campaignId: "camp-marine-gear",
        name: "Landing Page C",
        status: "active",
        strategyFocus: "offer_urgency",
        trafficAllocation: 25,
        suggestedAllocation: 20,
        theme: {
          primaryColor: "#b91c1c",
          accentColor: "#ea580c",
          backgroundColor: "#ffffff",
          fontFamily: "Inter, sans-serif",
          buttonStyle: "pill",
          badgeText: "Limited Harbor Special"
        },
        metrics: {
          visitors: 790,
          uniqueVisitors: 710,
          sessions: 840,
          pageViews: 1110,
          addToCart: 98,
          checkoutStarted: 66,
          conversions: 55,
          revenue: 330000,
          averageOrderValue: 6000
        },
        sourceBreakdown: {
          Facebook: { visitors: 310, conversions: 23, revenue: 138000 },
          Instagram: { visitors: 270, conversions: 19, revenue: 114000 },
          Google: { visitors: 130, conversions: 8, revenue: 48000 },
          TikTok: { visitors: 80, conversions: 5, revenue: 30000 }
        },
        deviceBreakdown: {
          mobile: { visitors: 570, conversions: 38, revenue: 228000 },
          desktop: { visitors: 170, conversions: 13, revenue: 78000 },
          tablet: { visitors: 50, conversions: 4, revenue: 24000 }
        },
        sections: [
          {
            id: "sec-mc1",
            type: "hero",
            visible: true,
            headline: "End of Season Marine Gear Clearance: Save 30% Today",
            subheadline: "Direct factory pricing on verified waterproof gear. Fast delivery with doorstep inspection.",
            badge: "Limited Seasonal Clearance",
            ctaText: "Claim Clearance Discount",
            ctaSubtext: "Doorstep inspection before payment",
            imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80"
          },
          {
            id: "sec-mc2",
            type: "urgency",
            visible: true,
            headline: "Limited Stock: Only 19 Packs Remaining in Port Stock",
            subheadline: "Orders placed today qualify for express priority shipping.",
            badge: "Final Harbor Allocation"
          },
          {
            id: "sec-mc3",
            type: "cta",
            visible: true,
            headline: "Lock In Clearance Savings Before Stock Depletes",
            subheadline: "Quick checkout with cash on delivery.",
            ctaText: "Order at 30% Off"
          }
        ]
      }
    ]
  }
];

export const DEFAULT_ADMIN_GROWTH_CONFIG = {
  maxCampaigns: 5,
  maxLandingPagesPerCampaign: 6,
  allowAiGeneration: true,
  allowSmartOptimization: true,
  analyticsRetentionDays: 90,
  trafficLimitPerMonth: 50000
};

export const MOCK_GROWTH_CAMPAIGNS = INITIAL_GROWTH_CAMPAIGNS;
