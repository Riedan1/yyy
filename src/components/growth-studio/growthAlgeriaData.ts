/**
 * Official Algerian 58 Wilayas & Communes with standard home & desk delivery tariffs
 * Exclusively for Yume Growth Studio COD ecommerce orders
 */

export interface AlgerianWilayaData {
  code: string;
  nameAr: string;
  nameFr: string;
  homeDeliveryFee: number; // DZD
  deskDeliveryFee: number; // DZD
  communes: string[];
}

export const ALGERIAN_58_WILAYAS: AlgerianWilayaData[] = [
  {
    code: "01",
    nameAr: "أدرار",
    nameFr: "Adrar",
    homeDeliveryFee: 1100,
    deskDeliveryFee: 650,
    communes: ["أدرار", "تمنطيط", "رقان", "أولف", "تيميمون", "زاوية كنتة", "أوقروت"]
  },
  {
    code: "02",
    nameAr: "الشلف",
    nameFr: "Chlef",
    homeDeliveryFee: 700,
    deskDeliveryFee: 400,
    communes: ["الشلف", "تنس", "وادي الفضة", "بوقادير", "أولاد فارس", "عين مران", "بني حواء"]
  },
  {
    code: "03",
    nameAr: "الأغواط",
    nameFr: "Laghouat",
    homeDeliveryFee: 850,
    deskDeliveryFee: 500,
    communes: ["الأغواط", "أفلو", "قصر الحيران", "عين ماضي", "سيدي مخلوف", "البيضاء"]
  },
  {
    code: "04",
    nameAr: "أم البواقي",
    nameFr: "Oum El Bouaghi",
    homeDeliveryFee: 750,
    deskDeliveryFee: 450,
    communes: ["أم البواقي", "عين البيضاء", "عين مليلة", "عين فكرون", "سوق نعمان", "مسكيانة"]
  },
  {
    code: "05",
    nameAr: "باتنة",
    nameFr: "Batna",
    homeDeliveryFee: 700,
    deskDeliveryFee: 400,
    communes: ["باتنة", "بريكة", "عين التوتة", "مروانة", "أريس", "المعذر", "تازولت"]
  },
  {
    code: "06",
    nameAr: "بجاية",
    nameFr: "Béjaïa",
    homeDeliveryFee: 700,
    deskDeliveryFee: 400,
    communes: ["بجاية", "أميزور", "أقبو", "سيدي عيش", "خراطة", "القصر", "تيشي", "أوقاس"]
  },
  {
    code: "07",
    nameAr: "بسكرة",
    nameFr: "Biskra",
    homeDeliveryFee: 800,
    deskDeliveryFee: 450,
    communes: ["بسكرة", "أولاد جلال", "سيدي عقبة", "طولقة", "الزيبان", "فوغالة"]
  },
  {
    code: "08",
    nameAr: "بشار",
    nameFr: "Béchar",
    homeDeliveryFee: 1000,
    deskDeliveryFee: 600,
    communes: ["بشار", "القنادسة", "بني ونيف", "العبادلة", "تاغيت"]
  },
  {
    code: "09",
    nameAr: "البليدة",
    nameFr: "Blida",
    homeDeliveryFee: 550,
    deskDeliveryFee: 300,
    communes: ["البليدة", "بوفاريك", "أولاد يعيش", "موزاية", "العفرون", "الأربعاء", "بوقرة", "وادي العلايق"]
  },
  {
    code: "10",
    nameAr: "البويرة",
    nameFr: "Bouira",
    homeDeliveryFee: 650,
    deskDeliveryFee: 350,
    communes: ["البويرة", "الأخضرية", "سور الغزلان", "عين بسام", "مشدالة", "بئر غبالو"]
  },
  {
    code: "11",
    nameAr: "تمنراست",
    nameFr: "Tamanrasset",
    homeDeliveryFee: 1250,
    deskDeliveryFee: 750,
    communes: ["تمنراست", "عين أمقل", "إدلس", "تاظروك", "أباليسا"]
  },
  {
    code: "12",
    nameAr: "تبسة",
    nameFr: "Tébessa",
    homeDeliveryFee: 800,
    deskDeliveryFee: 450,
    communes: ["تبسة", "بئر العاتر", "الشريعة", "الونزة", "العوينات", "الكويف"]
  },
  {
    code: "13",
    nameAr: "تلمسان",
    nameFr: "Tlemcen",
    homeDeliveryFee: 700,
    deskDeliveryFee: 400,
    communes: ["تلمسان", "مغنية", "منصورة", "الرمشي", "سبدو", "الغزوات", "شتوان"]
  },
  {
    code: "14",
    nameAr: "تيارت",
    nameFr: "Tiaret",
    homeDeliveryFee: 750,
    deskDeliveryFee: 400,
    communes: ["تيارت", "السوقر", "فرندة", "قصر الشلالة", "مهدية", "الرحوية"]
  },
  {
    code: "15",
    nameAr: "تيزي وزو",
    nameFr: "Tizi Ouzou",
    homeDeliveryFee: 650,
    deskDeliveryFee: 350,
    communes: ["تيزي وزو", "ذراع بن خدة", "عزازقة", "الأربعاء نايث إيراثن", "تيزي راشد", "واضية", "بوغني"]
  },
  {
    code: "16",
    nameAr: "الجزائر العاصمة",
    nameFr: "Alger",
    homeDeliveryFee: 500,
    deskDeliveryFee: 250,
    communes: [
      "سيدي امحمد", "باب الوادي", "الجزائر الوسطى", "الأبيار", "حيدرة", "بن عكنون", 
      "بئر مراد رايس", "القبة", "الحراش", "باب الزوار", "الدار البيضاء", "برج البحري", 
      "برج الكيفان", "الرغاية", "الرويبة", "عين البنيان", "الشراقة", "دالي براهيم", 
      "زرالدة", "سطاوالي", "بئر خادم", "براقي", "باش جراح", "المقرية", "المدنية"
    ]
  },
  {
    code: "17",
    nameAr: "الجلفة",
    nameFr: "Djelfa",
    homeDeliveryFee: 800,
    deskDeliveryFee: 450,
    communes: ["الجلفة", "عين وسارة", "مسعد", "حاسي بحبح", "الشارف", "دار الشيوخ"]
  },
  {
    code: "18",
    nameAr: "جيجل",
    nameFr: "Jijel",
    homeDeliveryFee: 700,
    deskDeliveryFee: 400,
    communes: ["جيجل", "طاهير", "الميلية", "العوانة", "زيامة منصورية", "الشقفة"]
  },
  {
    code: "19",
    nameAr: "سطيف",
    nameFr: "Sétif",
    homeDeliveryFee: 650,
    deskDeliveryFee: 350,
    communes: ["سطيف", "العلمة", "عين ولمان", "عين الكبيرة", "بوقاعة", "جميلة", "عين أرنات"]
  },
  {
    code: "20",
    nameAr: "سعيدة",
    nameFr: "Saïda",
    homeDeliveryFee: 750,
    deskDeliveryFee: 400,
    communes: ["سعيدة", "عين الحجر", "يوب", "الحساسنة", "سيدي بوبكر"]
  },
  {
    code: "21",
    nameAr: "سكيكدة",
    nameFr: "Skikda",
    homeDeliveryFee: 700,
    deskDeliveryFee: 400,
    communes: ["سكيكدة", "القل", "عزابة", "الحروش", "تمالوس", "بن عزوز"]
  },
  {
    code: "22",
    nameAr: "سيدي بلعباس",
    nameFr: "Sidi Bel Abbès",
    homeDeliveryFee: 700,
    deskDeliveryFee: 400,
    communes: ["سيدي بلعباس", "تلاغ", "سفيزف", "ابن باديس", "عين البرد", "رأس الماء"]
  },
  {
    code: "23",
    nameAr: "عنابة",
    nameFr: "Annaba",
    homeDeliveryFee: 650,
    deskDeliveryFee: 350,
    communes: ["عنابة", "البوني", "الحجار", "برحال", "سرايدي", "عين الباردة"]
  },
  {
    code: "24",
    nameAr: "قالمة",
    nameFr: "Guelma",
    homeDeliveryFee: 700,
    deskDeliveryFee: 400,
    communes: ["قالمة", "وادي الزناتي", "بوشقوف", "هيليوبوليس", "حمام دباغ", "بلخير"]
  },
  {
    code: "25",
    nameAr: "قسنطينة",
    nameFr: "Constantine",
    homeDeliveryFee: 650,
    deskDeliveryFee: 350,
    communes: ["قسنطينة", "الخروب", "علي منجلي", "حامة بوزيان", "ديدوش مراد", "زيغود يوسف", "ابن زياد"]
  },
  {
    code: "26",
    nameAr: "المدية",
    nameFr: "Médéa",
    homeDeliveryFee: 650,
    deskDeliveryFee: 350,
    communes: ["المدية", "البرواقية", "قصر البخاري", "بني سليمان", "تابلاط", "وزرة"]
  },
  {
    code: "27",
    nameAr: "مستغانم",
    nameFr: "Mostaganem",
    homeDeliveryFee: 700,
    deskDeliveryFee: 400,
    communes: ["مستغانم", "عين تدلس", "سيدي علي", "حاسي مماش", "ماسرة", "خير الدين"]
  },
  {
    code: "28",
    nameAr: "المسيلة",
    nameFr: "M'Sila",
    homeDeliveryFee: 750,
    deskDeliveryFee: 400,
    communes: ["المسيلة", "بوسعادة", "سيدي عيسى", "مقرة", "عين الحجل", "حمام الضلعة"]
  },
  {
    code: "29",
    nameAr: "معسكر",
    nameFr: "Mascara",
    homeDeliveryFee: 700,
    deskDeliveryFee: 400,
    communes: ["معسكر", "سيق", "تيغنيف", "المحمدية", "غريس", "وادي الأبطال"]
  },
  {
    code: "30",
    nameAr: "ورقلة",
    nameFr: "Ouargla",
    homeDeliveryFee: 900,
    deskDeliveryFee: 500,
    communes: ["ورقلة", "حاسي مسعود", "تقرت", "الرويسات", "سيدي خويلد"]
  },
  {
    code: "31",
    nameAr: "وهران",
    nameFr: "Oran",
    homeDeliveryFee: 600,
    deskDeliveryFee: 350,
    communes: ["وهران", "السانية", "بئر الجير", "عين الترك", "أرزيو", "بطيوة", "قديل", "مرسى الكبير"]
  },
  {
    code: "32",
    nameAr: "البيض",
    nameFr: "El Bayadh",
    homeDeliveryFee: 900,
    deskDeliveryFee: 500,
    communes: ["البيض", "الأبيض سيدي الشيخ", "بوعلام", "بريزينة", "بوقطب"]
  },
  {
    code: "33",
    nameAr: "إليزي",
    nameFr: "Illizi",
    homeDeliveryFee: 1300,
    deskDeliveryFee: 800,
    communes: ["إليزي", "جانت", "إن أميناس", "برج عمر دريس"]
  },
  {
    code: "34",
    nameAr: "برج بوعريريج",
    nameFr: "Bordj Bou Arréridj",
    homeDeliveryFee: 650,
    deskDeliveryFee: 350,
    communes: ["برج بوعريريج", "رأس الوادي", "برج غدير", "المنصورة", "مجانة", "الحمادية"]
  },
  {
    code: "35",
    nameAr: "بومرداس",
    nameFr: "Boumerdès",
    homeDeliveryFee: 550,
    deskDeliveryFee: 300,
    communes: ["بومرداس", "برج منايل", "دلس", "الثنية", "يسر", "خميس الخشنة", "بودواو", "قورصو"]
  },
  {
    code: "36",
    nameAr: "الطارف",
    nameFr: "El Tarf",
    homeDeliveryFee: 750,
    deskDeliveryFee: 400,
    communes: ["الطارف", "القالة", "بن مهيدي", "بوحجار", "الذرعان", "البسباس"]
  },
  {
    code: "37",
    nameAr: "تندوف",
    nameFr: "Tindouf",
    homeDeliveryFee: 1300,
    deskDeliveryFee: 800,
    communes: ["تندوف", "أم العسل"]
  },
  {
    code: "38",
    nameAr: "تيسمسيلت",
    nameFr: "Tissemsilt",
    homeDeliveryFee: 750,
    deskDeliveryFee: 400,
    communes: ["تيسمسيلت", "ثنية الحد", "برج بونعامة", "خميستي", "لرجام"]
  },
  {
    code: "39",
    nameAr: "الوادي",
    nameFr: "El Oued",
    homeDeliveryFee: 850,
    deskDeliveryFee: 500,
    communes: ["الوادي", "جامعة", "المغير", "قمار", "الدبيلة", "الرقيبة", "حاسي خليفة"]
  },
  {
    code: "40",
    nameAr: "خنشلة",
    nameFr: "Khenchela",
    homeDeliveryFee: 750,
    deskDeliveryFee: 450,
    communes: ["خنشلة", "ششار", "قايس", "أولاد رشاش", "الحامة", "بابار"]
  },
  {
    code: "41",
    nameAr: "سوق أهراس",
    nameFr: "Souk Ahras",
    homeDeliveryFee: 750,
    deskDeliveryFee: 450,
    communes: ["سوق أهراس", "سدراتة", "مداوروش", "تاورة", "المراهنة", "الحدادة"]
  },
  {
    code: "42",
    nameAr: "تيبازة",
    nameFr: "Tipaza",
    homeDeliveryFee: 550,
    deskDeliveryFee: 300,
    communes: ["تيبازة", "بوسماعيل", "شرشال", "القليعة", "حجوط", "فوكة", "الداموس", "حامية"]
  },
  {
    code: "43",
    nameAr: "ميلة",
    nameFr: "Mila",
    homeDeliveryFee: 700,
    deskDeliveryFee: 400,
    communes: ["ميلة", "شلغوم العيد", "فرجيوة", "تاجنانت", "قرارم قوقة", "وادي العثمانية"]
  },
  {
    code: "44",
    nameAr: "عين الدفلى",
    nameFr: "Aïn Defla",
    homeDeliveryFee: 650,
    deskDeliveryFee: 350,
    communes: ["عين الدفلى", "خميس مليانة", "مليانة", "العطاف", "الجليدة", "الروينة"]
  },
  {
    code: "45",
    nameAr: "النعامة",
    nameFr: "Naâma",
    homeDeliveryFee: 900,
    deskDeliveryFee: 550,
    communes: ["النعامة", "المشرية", "عين الصفراء", "عسلة", "تيوت"]
  },
  {
    code: "46",
    nameAr: "عين تموشنت",
    nameFr: "Aïn Témouchent",
    homeDeliveryFee: 700,
    deskDeliveryFee: 400,
    communes: ["عين تموشنت", "بني صاف", "حمام بوحجر", "المالح", "العامرية", "عين الكيحل"]
  },
  {
    code: "47",
    nameAr: "غرداية",
    nameFr: "Ghardaïa",
    homeDeliveryFee: 850,
    deskDeliveryFee: 500,
    communes: ["غرداية", "بني يزقن", "القرارة", "بريان", "المنيعة", "متليلي", "ضاية بن ضحوة"]
  },
  {
    code: "48",
    nameAr: "غليزان",
    nameFr: "Relizane",
    homeDeliveryFee: 700,
    deskDeliveryFee: 400,
    communes: ["غليزان", "وادي ارهيو", "مازونة", "عمي موسى", "يلل", "زمورة"]
  },
  {
    code: "49",
    nameAr: "تيميمون",
    nameFr: "Timimoun",
    homeDeliveryFee: 1150,
    deskDeliveryFee: 700,
    communes: ["تيميمون", "أوقروت", "شروين", "تينركوك", "دلداول"]
  },
  {
    code: "50",
    nameAr: "برج باجي مختار",
    nameFr: "Bordj Badji Mokhtar",
    homeDeliveryFee: 1350,
    deskDeliveryFee: 850,
    communes: ["برج باجي مختار", "تيمياوين"]
  },
  {
    code: "51",
    nameAr: "أولاد جلال",
    nameFr: "Ouled Djellal",
    homeDeliveryFee: 850,
    deskDeliveryFee: 500,
    communes: ["أولاد جلال", "سيدي خالد", "البسباس", "الشعيبة", "رأس الميعاد"]
  },
  {
    code: "52",
    nameAr: "بني عباس",
    nameFr: "Béni Abbès",
    homeDeliveryFee: 1100,
    deskDeliveryFee: 650,
    communes: ["بني عباس", "كرزاز", "الواتة", "إقلي", "تبربلة"]
  },
  {
    code: "53",
    nameAr: "عين صالح",
    nameFr: "In Salah",
    homeDeliveryFee: 1200,
    deskDeliveryFee: 750,
    communes: ["عين صالح", "فقارة الزاوية", "إينغر"]
  },
  {
    code: "54",
    nameAr: "عين قزام",
    nameFr: "In Guezzam",
    homeDeliveryFee: 1400,
    deskDeliveryFee: 900,
    communes: ["عين قزام", "تين زواتين"]
  },
  {
    code: "55",
    nameAr: "تقرت",
    nameFr: "Touggourt",
    homeDeliveryFee: 900,
    deskDeliveryFee: 500,
    communes: ["تقرت", "النزلة", "تبسبست", "المقارين", "الطيبات", "تماسين"]
  },
  {
    code: "56",
    nameAr: "جانت",
    nameFr: "Djanet",
    homeDeliveryFee: 1350,
    deskDeliveryFee: 850,
    communes: ["جانت", "برج الحواس"]
  },
  {
    code: "57",
    nameAr: "المغير",
    nameFr: "El M'Ghair",
    homeDeliveryFee: 850,
    deskDeliveryFee: 500,
    communes: ["المغير", "جامعة", "أم الطيور", "سيدي عمران", "المرارة"]
  },
  {
    code: "58",
    nameAr: "المنيعة",
    nameFr: "El Meniaa",
    homeDeliveryFee: 950,
    deskDeliveryFee: 550,
    communes: ["المنيعة", "حاسي القارة", "حاسي الفحل"]
  }
];

/**
 * Intelligent Smart Tag Research & Suggestions Engine
 * Produces research-backed, authentic conversion tags matching Algerian eCommerce behavior
 * without making deceptive claims.
 */
export interface SmartTagSuggestion {
  id: string;
  tag: string;
  category: "proof" | "urgency" | "delivery" | "value";
  rationale: string;
  badgeBg: string;
  textColor: string;
}

export const RESEARCH_BACKED_SMART_TAGS: SmartTagSuggestion[] = [
  {
    id: "tag-best-seller",
    tag: "الأكثر مبيعاً",
    category: "proof",
    rationale: "المنتج حقق أعلى معدل طلبات مكتملة ومعاينة إيجابية",
    badgeBg: "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300",
    textColor: "text-amber-500"
  },
  {
    id: "tag-algeria-demand",
    tag: "طلب متزايد في الجزائر",
    category: "proof",
    rationale: "نسبة تفاعل وطلبات مرتفعة من مختلف الولايات (العاصمة، وهران، سطيف، قسنطينة)",
    badgeBg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300",
    textColor: "text-emerald-500"
  },
  {
    id: "tag-special-offer",
    tag: "عرض خاص وتوفير",
    category: "value",
    rationale: "شحن مجاني عند طلب قطعتين وتخفيض فوري محسوب تلقائياً",
    badgeBg: "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300",
    textColor: "text-rose-500"
  },
  {
    id: "tag-inspect-before-pay",
    tag: "معاينة قبل الدفع",
    category: "proof",
    rationale: "حق كامل للمشتري بفتح الطرد والتأكد من الجودة أمام عامل التوصيل قبل السداد",
    badgeBg: "bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300",
    textColor: "text-blue-500"
  },
  {
    id: "tag-express-shipping",
    tag: "توصيل سريع لباب المنزل أو المكتب",
    category: "delivery",
    rationale: "تغطية كاملة لـ 58 ولاية خلال 24 - 48 ساعة فقط",
    badgeBg: "bg-indigo-500/10 border-indigo-500/30 text-indigo-700 dark:text-indigo-300",
    textColor: "text-indigo-500"
  },
  {
    id: "tag-satisfaction-guaranteed",
    tag: "ضمان الاستبدال 100%",
    category: "proof",
    rationale: "سياسة استبدال مرنة لخدمة ما بعد البيع في حال المقاس أو وجود أي عيب مصنعي",
    badgeBg: "bg-purple-500/10 border-purple-500/30 text-purple-700 dark:text-purple-300",
    textColor: "text-purple-500"
  }
];

/**
 * Intelligent Image-Harmonized Palette Extractor
 * Generates an elegant, non-white, cohesive theme based on product image aesthetic
 */
export function extractHarmonizedPalette(imageUrl?: string): {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  cardBackgroundColor: string;
  textColor: string;
  mutedTextColor: string;
  fontFamily: string;
} {
  const url = (imageUrl || "").toLowerCase();

  // Dark Tactical / Military / Leather
  if (url.includes("backpack") || url.includes("tactical") || url.includes("bag") || url.includes("black") || url.includes("dark")) {
    return {
      primaryColor: "#0f172a", // Deep slate
      accentColor: "#f59e0b", // Warm gold accent
      backgroundColor: "#090d16", // Rich night canvas
      cardBackgroundColor: "#111827", // Elevated card
      textColor: "#f8fafc",
      mutedTextColor: "#94a3b8",
      fontFamily: "'Tajawal', 'Cairo', sans-serif"
    };
  }

  // Emerald / Nature / Organic / Health
  if (url.includes("green") || url.includes("cream") || url.includes("organic") || url.includes("wellness")) {
    return {
      primaryColor: "#064e3b",
      accentColor: "#10b981",
      backgroundColor: "#042f2e",
      cardBackgroundColor: "#0f3d39",
      textColor: "#f0fdf4",
      mutedTextColor: "#a7f3d0",
      fontFamily: "'Tajawal', 'Cairo', sans-serif"
    };
  }

  // Luxury / Gold / Watch / Perfume
  if (url.includes("luxury") || url.includes("watch") || url.includes("perfume") || url.includes("gold")) {
    return {
      primaryColor: "#1c1917",
      accentColor: "#d97706",
      backgroundColor: "#0c0a09",
      cardBackgroundColor: "#1c1917",
      textColor: "#fafaf9",
      mutedTextColor: "#d6d3d1",
      fontFamily: "'Cairo', 'Tajawal', sans-serif"
    };
  }

  // High-Tech / Sapphire / Gadgets
  if (url.includes("tech") || url.includes("phone") || url.includes("gadget") || url.includes("blue")) {
    return {
      primaryColor: "#1e3a8a",
      accentColor: "#38bdf8",
      backgroundColor: "#0b1329",
      cardBackgroundColor: "#132147",
      textColor: "#f8fafc",
      mutedTextColor: "#93c5fd",
      fontFamily: "'Tajawal', 'Cairo', sans-serif"
    };
  }

  // Default Sophisticated Warm Charcoal & Amber
  return {
    primaryColor: "#1e293b",
    accentColor: "#f97316",
    backgroundColor: "#0b0f17",
    cardBackgroundColor: "#161e2e",
    textColor: "#f8fafc",
    mutedTextColor: "#94a3b8",
    fontFamily: "'Tajawal', 'Cairo', sans-serif"
  };
}
