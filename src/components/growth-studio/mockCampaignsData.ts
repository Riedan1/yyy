import { GrowthCampaign } from "../../types/growthStudio";

export const INITIAL_GROWTH_CAMPAIGNS: GrowthCampaign[] = [
  {
    id: "camp-summer-shoes",
    storeId: "store-1",
    name: "Summer Breathable Shoes • حذاء الصيف المريح",
    product: {
      id: "prod-summer-shoes-1",
      name: "Ultra-Light Ergonomic Summer Sneakers",
      price: 4900,
      originalPrice: 6800,
      imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
      category: "Footwear",
      description: "حذاء طبي صيفي مريح ومضاد للتعرق، مثالي للمشي اليومي ودرجات الحرارة المرتفعة."
    },
    offer: "اشتري 1 واحصل على الثاني بنصف السعر + توصيل مجاني",
    trafficSources: ["Instagram", "TikTok", "Facebook", "Snapchat", "WhatsApp"],
    goal: "purchases",
    status: "active",
    createdAt: "2026-08-20T10:00:00Z",
    updatedAt: "2026-09-03T09:30:00Z",
    distributionMode: "smart",
    distributionRationale: "Landing Page 02 is receiving 45% traffic because its purchase conversion rate (9.4%) is outperforming others.",
    smartLinkSlug: "summer-shoes-dz",
    settings: {
      confidenceThreshold: 200,
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
          fontFamily: "Tajawal, sans-serif",
          buttonStyle: "pill",
          badgeText: "الراحة اليومية القصوى"
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
            headline: "وداعاً لآلام القدمين وحرارة الصيف مع حذاء ألترا لايت المريح",
            subheadline: "تصميم طبي مبتكر بنعل هوائي مضاد للصدمات وقماش شبكي يسمح بالتنفس الفوري طوال اليوم.",
            badge: "الأكثر طلباً لصيف 2026",
            ctaText: "اطلب الآن والدفع عند الاستلام",
            ctaSubtext: "توصيل سريع متوفر لكافة الـ 58 ولاية",
            imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80"
          },
          {
            id: "sec-2",
            type: "benefits",
            visible: true,
            headline: "لماذا يفضل أكثر من 12,000 جزائري هذا الحذاء؟",
            subheadline: "مميزات صممت خصيصاً لتناسب نمط حياتك اليومي",
            items: [
              { title: "خفة وزن استثنائية (210 غ)", description: "لن تشعر بوزن الحذاء على قدمك حتى بعد 10 ساعات مشي متواصل." },
              { title: "نعل طبي لتقويم المشي", description: "يمتص الصدمات ويقلل الضغط على الركبة وفقرات أسفل الظهر." },
              { title: "تهوية ذكية 360 درجة", description: "أنسجة مسامية تمنع الرطوبة والروائح الكريهة تماماً في الأيام الحارة." }
            ]
          },
          {
            id: "sec-3",
            type: "urgency",
            visible: true,
            headline: "عرض خاص محدود: اشتري 1 واحصل على الثاني بـ 50% خصم!",
            subheadline: "الكمية المتبقية في المخزن: 24 زوج فقط اليوم",
            badge: "عرض الصيف الخاص"
          },
          {
            id: "sec-4",
            type: "reviews",
            visible: true,
            headline: "آراء زبائننا الموثقة في الجزائر",
            subheadline: "تجارب حقيقية من ولايات الجزائر، وهران، قسنطينة، وسطيف",
            items: [
              { title: "ياسين • الجزائر العاصمة", description: "جودة ممتازة وخفيف جداً، وصلني في 24 ساعة عبر ياليدين والمقاس مضبوط 100%.", rating: 5 },
              { title: "فاطمة • سطيف", description: "شريتو لزوجي وعجبو بزااف، راح نزيد نطلب زوج آخر لوالدي، يعطيكم الصحة.", rating: 5 }
            ]
          },
          {
            id: "sec-5",
            type: "guarantee",
            visible: true,
            headline: "ضمان الاستبدال المجاني ومعاينة المنتج قبل الدفع",
            subheadline: "افتح طردك أمام عامل التوصيل وتأكد من الجودة والمقاس قبل تسليم أي مبلغ."
          },
          {
            id: "sec-6",
            type: "cta",
            visible: true,
            headline: "لا تفوت فرصة العرض الصيفي الحصري",
            subheadline: "املأ بياناتك في دقيقة واحدة وسيتم الاتصال بك لتأكيد طلبك وتجهيز الشحن فوراً.",
            ctaText: "تأكيد الطلب الآن بنقرة واحدة"
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
          fontFamily: "Tajawal, sans-serif",
          buttonStyle: "pill",
          badgeText: "تقييم 4.9/5 من أكثر من 3,400 زبون"
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
            headline: "الحذاء الذي تصدّر تريند الصيف: شاهد لماذا أجمع عليه المؤثرون وأطباء الأقدام",
            subheadline: "أكثر من 3,400 تقييم 5 نجوم في جميع ولايات الوطن. راحة فورية تدوم طوال اليوم.",
            badge: "الخيار الأول للزبائن في الجزائر",
            ctaText: "انضم إلى آلاف الزبائن السعداء",
            ctaSubtext: "الدفع بعد المعاينة عند باب بيتك",
            imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80"
          },
          {
            id: "sec-202",
            type: "testimonials",
            visible: true,
            headline: "قصص وتجارب واقعية بالصور والفيديو",
            subheadline: "زبائن حقيقيون وثقوا تجربتهم بعد أسابيع من الاستخدام اليومي",
            items: [
              { title: "د. كمال مسعودي • طبيب عام", description: "أنصح به لكل من يقف لساعات طويلة في العمل. النعل يخفف الضغط العظمي بنسبة واضحة.", rating: 5 },
              { title: "أمين طهراوي • أستاذ", description: "أفضل استثمار لصيفي، خفيف ومهوّي وشكله أنيق في اللبس مع الجينز واللباس الرياضي.", rating: 5 },
              { title: "سارة بن علي • مهندسة", description: "أخذت زوجين لي ولأختي. المعاملة احترافية والتوصيل سريع جداً إلى وهران.", rating: 5 }
            ]
          },
          {
            id: "sec-203",
            type: "comparison",
            visible: true,
            headline: "مقارنة صريحة: حذاء ألترا لايت مقابل الأحذية الرياضية التقليدية",
            subheadline: "اكتشف الفارق بنفسك قبل أن تقرر",
            items: [
              { title: "الوزن والراحة", description: "ألترا لايت: 210غ مقابل 480غ للأحذية العادية." },
              { title: "التهوية ومقاومة الحرارة", description: "شبكة هوائية سريعة الجفاف تمنع التعرق تماماً." },
              { title: "خدمة ما بعد البيع", description: "استبدال واسترجاع مضمون 100% بدون أي تعقيد." }
            ]
          },
          {
            id: "sec-204",
            type: "cta",
            visible: true,
            headline: "اطلب الآن واستفد من خصم 25% مع التوصيل السريع",
            subheadline: "سارع قبل نفاد المقاسات الأكثر طلباً (40 - 44)",
            ctaText: "احجز مقاسك الآن قبل نفاد المخزون"
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
          fontFamily: "Tajawal, sans-serif",
          buttonStyle: "pill",
          badgeText: "تخفيض فلاش ينتهي قريباً"
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
          mobile: { visitors: 1020, conversions: 65, revenue: 318500 },
          desktop: { visitors: 140, conversions: 8, revenue: 39200 },
          tablet: { visitors: 50, conversions: 3, revenue: 14700 }
        },
        sections: [
          {
            id: "sec-301",
            type: "hero",
            visible: true,
            headline: "تخفيض حصري لـ 48 ساعة فقط: 4,900 دج بدل 6,800 دج مع توصيل مجاني!",
            subheadline: "عرض خاص لرواد وسائل التواصل الاجتماعي: احصل على حذاء الصيف الأكثر راحة بأفضل سعر في السوق.",
            badge: "توفير فوري 1,900 دج",
            ctaText: "اغتنم العرض الترويجي الآن",
            ctaSubtext: "العرض متاح حتى نفاد الكمية المخصصة",
            imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80"
          },
          {
            id: "sec-302",
            type: "urgency",
            visible: true,
            headline: "العداد التنازلي لانتهاء عرض التخفيض الفوري",
            subheadline: "سينتهي العرض تلقائياً مع انتهاء العداد أو نفاد آخر 18 زوج متبقية",
            badge: "Flash Sale"
          },
          {
            id: "sec-303",
            type: "features",
            visible: true,
            headline: "ماذا ستحصل في باقتك اليوم؟",
            subheadline: "محتويات الطرد الأصلي من متجر YOMI المعتمد",
            items: [
              { title: "حذاء ألترا لايت الأصلي", description: "بالمقاس واللون الذي تختاره في استمارة الطلب." },
              { title: "جوارب قطنية رياضية مجاناً", description: "هدية ترحيبية مرفقة مع كل طرد هذا الأسبوع." },
              { title: "توصيل سريع حتى باب المنزل", description: "مع شركات التوصيل المعتمدة (Yalidine, ZR Express)." }
            ]
          },
          {
            id: "sec-304",
            type: "faq",
            visible: true,
            headline: "الأسئلة الأكثر شيوعاً قبل إتمام طلبك",
            subheadline: "كل ما تحتاج معرفته عن الشحن وطرق الدفع والاستبدال",
            items: [
              { title: "كيف يتم الدفع؟", description: "الدفع نقداً عند استلام الطرد بيدك وبعد معاينته." },
              { title: "ماذا لو لم يناسبني المقاس؟", description: "نوفر استبدال مجاني فوري للمقاس خلال 48 ساعة." }
            ]
          },
          {
            id: "sec-305",
            type: "cta",
            visible: true,
            headline: "أكد طلبك الآن قبل إعادة السعر إلى 6,800 دج",
            subheadline: "املأ البيانات أدناه وسيصلك اتصال لتأكيد العنوان ومقاس الحذاء.",
            ctaText: "اطلب الآن مع الهدية المجانية"
          }
        ]
      }
    ]
  },
  {
    id: "camp-argan-ritual",
    storeId: "store-1",
    name: "Pure Argan Hair & Skin Ritual • باقة زيت الأركان الملكي",
    product: {
      id: "prod-argan-ritual",
      name: "100% Organic Pure Argan Oil Essence Set",
      price: 3400,
      originalPrice: 4800,
      imageUrl: "https://images.unsplash.com/photo-1608248597359-545229598285?w=800&q=80",
      category: "Beauty & Personal Care",
      description: "زيت أركان بيولوجي نقي معصور على البارد لتغذية الشعر وتقوية البشرة وإعادة الحيوية الطبيعية."
    },
    offer: "باقة كاملة + سيروم مجاني عند شراء عبوتين",
    trafficSources: ["Instagram", "TikTok", "Facebook", "Snapchat"],
    goal: "purchases",
    status: "active",
    createdAt: "2026-08-25T14:00:00Z",
    updatedAt: "2026-09-02T16:00:00Z",
    distributionMode: "manual",
    distributionRationale: "Manual distribution set by merchant: 50% for Landing Page 01 (Storytelling & Organic Purity) and 50% for Landing Page 02 (Dermatologist Proof).",
    smartLinkSlug: "argan-ritual-dz",
    settings: {
      confidenceThreshold: 150,
      autoOptimize: false,
      pixelTracking: true
    },
    landingPages: [
      {
        id: "lp-argan-01",
        campaignId: "camp-argan-ritual",
        name: "Landing Page 01",
        status: "active",
        strategyFocus: "storytelling",
        trafficAllocation: 50,
        theme: {
          primaryColor: "#b45309",
          accentColor: "#d97706",
          backgroundColor: "#fffbeb",
          fontFamily: "Tajawal, sans-serif",
          buttonStyle: "rounded",
          badgeText: "عضوي معصور على البارد 100%"
        },
        metrics: {
          visitors: 820,
          uniqueVisitors: 750,
          sessions: 890,
          pageViews: 1240,
          addToCart: 130,
          checkoutStarted: 95,
          conversions: 68,
          revenue: 231200,
          averageOrderValue: 3400
        },
        sourceBreakdown: {
          Instagram: { visitors: 450, conversions: 44, revenue: 149600 },
          TikTok: { visitors: 220, conversions: 14, revenue: 47600 },
          Facebook: { visitors: 110, conversions: 8, revenue: 27200 },
          Snapchat: { visitors: 40, conversions: 2, revenue: 6800 }
        },
        deviceBreakdown: {
          mobile: { visitors: 720, conversions: 61, revenue: 207400 },
          desktop: { visitors: 70, conversions: 5, revenue: 17000 },
          tablet: { visitors: 30, conversions: 2, revenue: 6800 }
        },
        sections: [
          {
            id: "sec-a1",
            type: "hero",
            visible: true,
            headline: "سر الجمال الطبيعي: زيت الأركان النقي 100% لإشراقة بشرتك وقوة شعرك",
            subheadline: "تركيبة غنية بفيتامين E والأحماض الدهنية الأساسية تعالج تقصف الشعر وتعيد نضارة البشرة من أول أسبوع.",
            badge: "طبيعي ونقي 100%",
            ctaText: "احصلي على باقتك الطبيعية الآن",
            ctaSubtext: "دفع آمن عند الاستلام وتوصيل لكل الولايات",
            imageUrl: "https://images.unsplash.com/photo-1608248597359-545229598285?w=800&q=80"
          },
          {
            id: "sec-a2",
            type: "benefits",
            visible: true,
            headline: "فوائد مثبتة علمياً لشعرك وبشرتك",
            subheadline: "عناية متكاملة بدون أي مواد كيميائية أو عطور صناعية",
            items: [
              { title: "ترميم الشعر التالف والجاف", description: "يغذي بصيلات الشعر ويقضي على الهيشان والتساقط." },
              { title: "ترطيب عميق ومكافحة التجاعيد", description: "يمتص بسرعة فائقة دون أن يترك ملمساً دهنياً مزعجاً." },
              { title: "تقوية الأظافر ونضارة الرقبة", description: "عناية شاملة تستحقها إطلالتك اليومية." }
            ]
          },
          {
            id: "sec-a3",
            type: "cta",
            visible: true,
            headline: "اطلبي الآن واستفيدي من عرض العبوتين + سيروم مجاني",
            subheadline: "كمية العرض الشهري محدودة جداً",
            ctaText: "تأكيد الطلب الترويجي"
          }
        ]
      },
      {
        id: "lp-argan-02",
        campaignId: "camp-argan-ritual",
        name: "Landing Page 02",
        status: "active",
        strategyFocus: "social_proof",
        trafficAllocation: 50,
        theme: {
          primaryColor: "#047857",
          accentColor: "#10b981",
          backgroundColor: "#ffffff",
          fontFamily: "Tajawal, sans-serif",
          buttonStyle: "pill",
          badgeText: "توصية خبراء العناية الطبيعية"
        },
        metrics: {
          visitors: 850,
          uniqueVisitors: 780,
          sessions: 910,
          pageViews: 1380,
          addToCart: 165,
          checkoutStarted: 118,
          conversions: 84,
          revenue: 285600,
          averageOrderValue: 3400
        },
        sourceBreakdown: {
          Instagram: { visitors: 490, conversions: 56, revenue: 190400 },
          TikTok: { visitors: 240, conversions: 20, revenue: 68000 },
          Facebook: { visitors: 90, conversions: 6, revenue: 20400 },
          Snapchat: { visitors: 30, conversions: 2, revenue: 6800 }
        },
        deviceBreakdown: {
          mobile: { visitors: 760, conversions: 77, revenue: 261800 },
          desktop: { visitors: 60, conversions: 5, revenue: 17000 },
          tablet: { visitors: 30, conversions: 2, revenue: 6800 }
        },
        sections: [
          {
            id: "sec-b1",
            type: "hero",
            visible: true,
            headline: "الزيت العضوي الذي وثقت به أكثر من 8,000 سيدة جزائرية لنتائج حقيقية",
            subheadline: "شاهد النتائج بالصور والفيديوهات قبل وبعد 14 يوماً من الاستخدام المنتظم.",
            badge: "تقييم 4.95 من 5",
            ctaText: "اكتشفي سر الشعر الصحي والحريري",
            ctaSubtext: "توصيل سريع لباب الدار والدفع بعد الفحص",
            imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80"
          },
          {
            id: "sec-b2",
            type: "testimonials",
            visible: true,
            headline: "شهادات حية من زبوناتنا في الجزائر",
            subheadline: "تجارب موثوقة من سيدات جربن الزيت وشاركن نتائجهن",
            items: [
              { title: "مريم • قسنطينة", description: "شعري كان محروق بالصبغة، بعد أسبوعين حسيت بفرق هائل في الملمس واللمعان. برافو!", rating: 5 },
              { title: "نادية • الجزائر العاصمة", description: "أحسن زيت استعملتو في حياتي، أصلي 100% والريحة نتاعو خفيفة وطبيعية.", rating: 5 }
            ]
          },
          {
            id: "sec-b3",
            type: "cta",
            visible: true,
            headline: "سارعي بالحصول على عبوتك قبل نفاد الدفعة المعصورة حديثاً",
            subheadline: "الدفع عند الاستلام مع إمكانية المعاينة",
            ctaText: "اطلبي الآن بسعر 3,400 دج"
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
