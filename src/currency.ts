export interface CountryConfig {
  name: string;
  currency: string;
  symbol: string;
  locale: string;
  flag: string;
  phoneFormat: string;
  phonePlaceholder: string;
  emailPlaceholder: string;
  taxRate: number;
  regions: { code: string; name: string; nameAr: string }[];
  gateways: { id: string; name: string; description: string }[];
  defaultMapCenter: { lat: number; lng: number; zoom: number };
}

export const countryCurrencyMapping: Record<string, CountryConfig> = {
  "United States": {
    name: "United States",
    currency: "USD",
    symbol: "$",
    locale: "en-US",
    flag: "🇺🇸",
    phoneFormat: "+1 (XXX) XXX-XXXX",
    phonePlaceholder: "+1 (555) 019-2834",
    emailPlaceholder: "client@example.com",
    taxRate: 0.08,
    regions: [
      { code: "CA", name: "California", nameAr: "كاليفورنيا" },
      { code: "NY", name: "New York", nameAr: "نيويورك" },
      { code: "TX", name: "Texas", nameAr: "تكساس" },
      { code: "FL", name: "Florida", nameAr: "فلوريدا" },
      { code: "WA", name: "Washington", nameAr: "واشنطن" },
      { code: "IL", name: "Illinois", nameAr: "إلينوي" }
    ],
    gateways: [
      { id: "cod", name: "Cash on Delivery (COD)", description: "Pay in cash upon physical delivery." },
      { id: "card", name: "Credit/Debit Card", description: "Visa, MasterCard, Amex via secure gateway." },
      { id: "wire", name: "Bank Wire Transfer (ACH)", description: "Direct domestic ACH transfer." }
    ],
    defaultMapCenter: { lat: 37.0902, lng: -95.7129, zoom: 4 }
  },
  "Algeria": {
    name: "Algeria",
    currency: "DZD",
    symbol: "د.ج",
    locale: "ar-DZ",
    flag: "🇩🇿",
    phoneFormat: "+213 X XX XX XX XX",
    phonePlaceholder: "+213 555 12 34 56",
    emailPlaceholder: "client@mail.dz",
    taxRate: 0.19,
    regions: [
      { code: "16", name: "Algiers", nameAr: "الجزائر العاصمة" },
      { code: "31", name: "Oran", nameAr: "وهران" },
      { code: "25", name: "Constantine", nameAr: "قسنطينة" },
      { code: "06", name: "Bejaia", nameAr: "بجاية" },
      { code: "47", name: "Ghardaïa", nameAr: "غرداية" },
      { code: "13", name: "Tlemcen", nameAr: "تلمسان" },
      { code: "23", name: "Annaba", nameAr: "عنابة" }
    ],
    gateways: [
      { id: "cod", name: "Cash on Delivery (COD)", description: "Pay cash upon physical package delivery." },
      { id: "eddahabia", name: "Post Card (Eddahabia)", description: "Secure Algerian Postal card checkout." },
      { id: "cib", name: "National Card (CIB)", description: "Secure Interbank card network processing." },
      { id: "wire", name: "CCP Postal Wire", description: "Manual transfer through postal CCP accounts." }
    ],
    defaultMapCenter: { lat: 36.7538, lng: 3.0588, zoom: 12 }
  },
  "France": {
    name: "France",
    currency: "EUR",
    symbol: "€",
    locale: "fr-FR",
    flag: "🇫🇷",
    phoneFormat: "+33 X XX XX XX XX",
    phonePlaceholder: "+33 6 1234 5678",
    emailPlaceholder: "client@exemple.fr",
    taxRate: 0.20,
    regions: [
      { code: "IDF", name: "Île-de-France", nameAr: "إيل دو فرانس" },
      { code: "ARA", name: "Auvergne-Rhône-Alpes", nameAr: "أوفرن-رون ألب" },
      { code: "PAC", name: "Provence-Alpes-Côte d'Azur", nameAr: "بروفنس ألب كوت دازور" },
      { code: "NOR", name: "Normandie", nameAr: "نورماندي" }
    ],
    gateways: [
      { id: "card", name: "Credit/Debit Card", description: "Secure Cartes Bancaires, Visa, or Mastercard." },
      { id: "wire", name: "SEPA Bank Transfer", description: "Direct European SEPA bank transfer." },
      { id: "cod", name: "Cash on Delivery", description: "Pay upon courier delivery." }
    ],
    defaultMapCenter: { lat: 46.2276, lng: 2.2137, zoom: 5 }
  },
  "Germany": {
    name: "Germany",
    currency: "EUR",
    symbol: "€",
    locale: "de-DE",
    flag: "🇩🇪",
    phoneFormat: "+49 XXX XXXXXXX",
    phonePlaceholder: "+49 170 1234567",
    emailPlaceholder: "kunde@beispiel.de",
    taxRate: 0.19,
    regions: [
      { code: "BY", name: "Bayern", nameAr: "بافاريا" },
      { code: "BE", name: "Berlin", nameAr: "برلين" },
      { code: "NW", name: "Nordrhein-Westfalen", nameAr: "شمال الراين-وستفاليا" }
    ],
    gateways: [
      { id: "card", name: "Credit/Debit Card", description: "Secure Visa, Mastercard, or Girocard." },
      { id: "wire", name: "SEPA Bank Transfer", description: "Direct SEPA wire transfer." }
    ],
    defaultMapCenter: { lat: 51.1657, lng: 10.4515, zoom: 5 }
  },
  "United Kingdom": {
    name: "United Kingdom",
    currency: "GBP",
    symbol: "£",
    locale: "en-GB",
    flag: "🇬🇧",
    phoneFormat: "+44 XXXX XXXXXX",
    phonePlaceholder: "+44 7911 123456",
    emailPlaceholder: "shopper@example.co.uk",
    taxRate: 0.20,
    regions: [
      { code: "ENG", name: "England", nameAr: "إنجلترا" },
      { code: "SCT", name: "Scotland", nameAr: "اسكتلندا" },
      { code: "WLS", name: "Wales", nameAr: "ويلز" }
    ],
    gateways: [
      { id: "card", name: "Credit/Debit Card", description: "Visa, Mastercard, or Amex." },
      { id: "wire", name: "BACS Bank Transfer", description: "Direct UK wire payment." }
    ],
    defaultMapCenter: { lat: 55.3781, lng: -3.4360, zoom: 5 }
  },
  "Saudi Arabia": {
    name: "Saudi Arabia",
    currency: "SAR",
    symbol: "ر.س",
    locale: "ar-SA",
    flag: "🇸🇦",
    phoneFormat: "+966 5X XXX XXXX",
    phonePlaceholder: "+966 50 123 4567",
    emailPlaceholder: "client@mail.sa",
    taxRate: 0.15,
    regions: [
      { code: "RUH", name: "Riyadh", nameAr: "الرياض" },
      { code: "MKK", name: "Makkah", nameAr: "مكة المكرمة" },
      { code: "MED", name: "Madinah", nameAr: "المدينة المنورة" },
      { code: "EAS", name: "Eastern Province", nameAr: "المنطقة الشرقية" }
    ],
    gateways: [
      { id: "cod", name: "Cash on Delivery", description: "Pay cash upon delivery." },
      { id: "card", name: "Mada Card Payment", description: "Secure mada or Credit Card payment." },
      { id: "wire", name: "Bank Transfer", description: "Direct Saudi local bank transfer." }
    ],
    defaultMapCenter: { lat: 23.8859, lng: 45.0792, zoom: 5 }
  },
  "UAE": {
    name: "UAE",
    currency: "AED",
    symbol: "د.إ",
    locale: "ar-AE",
    flag: "🇦🇪",
    phoneFormat: "+971 5X XXX XXXX",
    phonePlaceholder: "+971 50 123 4567",
    emailPlaceholder: "client@mail.ae",
    taxRate: 0.05,
    regions: [
      { code: "DXB", name: "Dubai", nameAr: "دبي" },
      { code: "AUH", name: "Abu Dhabi", nameAr: "أبوظبي" },
      { code: "SHJ", name: "Sharjah", nameAr: "الشارقة" }
    ],
    gateways: [
      { id: "cod", name: "Cash on Delivery", description: "Pay cash upon package delivery." },
      { id: "card", name: "Credit/Debit Card", description: "Visa, Mastercard, Mobile Pay." }
    ],
    defaultMapCenter: { lat: 23.4241, lng: 53.8478, zoom: 6 }
  },
  "Canada": {
    name: "Canada",
    currency: "CAD",
    symbol: "C$",
    locale: "en-CA",
    flag: "🇨🇦",
    phoneFormat: "+1 (XXX) XXX-XXXX",
    phonePlaceholder: "+1 (613) 555-0199",
    emailPlaceholder: "shopper@example.ca",
    taxRate: 0.13,
    regions: [
      { code: "ON", name: "Ontario", nameAr: "أونتاريو" },
      { code: "QC", name: "Quebec", nameAr: "كيبيك" },
      { code: "BC", name: "British Columbia", nameAr: "كولومبيا البريطانية" }
    ],
    gateways: [
      { id: "card", name: "Credit/Debit Card", description: "Visa, MasterCard, Interac Online." },
      { id: "wire", name: "Interac e-Transfer", description: "Secure email money transfer." }
    ],
    defaultMapCenter: { lat: 56.1304, lng: -106.3468, zoom: 4 }
  },
  "Turkey": {
    name: "Turkey",
    currency: "TRY",
    symbol: "₺",
    locale: "tr-TR",
    flag: "🇹🇷",
    phoneFormat: "+90 XXX XXX XX XX",
    phonePlaceholder: "+90 532 123 45 67",
    emailPlaceholder: "musteri@ornek.com",
    taxRate: 0.20,
    regions: [
      { code: "IST", name: "Istanbul", nameAr: "إسطنبول" },
      { code: "ANK", name: "Ankara", nameAr: "أنقرة" },
      { code: "IZM", name: "Izmir", nameAr: "إزمير" }
    ],
    gateways: [
      { id: "card", name: "Credit/Debit Card", description: "Troy, Visa, Mastercard secure checkouts." },
      { id: "wire", name: "Bank Transfer (EFT)", description: "Direct bank transfer." },
      { id: "cod", name: "Cash on Delivery", description: "Pay at the door." }
    ],
    defaultMapCenter: { lat: 38.9637, lng: 35.2433, zoom: 5 }
  },
  "Morocco": {
    name: "Morocco",
    currency: "MAD",
    symbol: "د.م.",
    locale: "ar-MA",
    flag: "🇲🇦",
    phoneFormat: "+212 X XX XX XX XX",
    phonePlaceholder: "+212 6 1234 5678",
    emailPlaceholder: "client@mail.ma",
    taxRate: 0.20,
    regions: [
      { code: "CAS", name: "Casablanca-Settat", nameAr: "الدار البيضاء - سطات" },
      { code: "RAB", name: "Rabat-Salé-Kénitra", nameAr: "الرباط - سلا - القنيطرة" },
      { code: "MAR", name: "Marrakesh-Safi", nameAr: "مراكش - آسفي" }
    ],
    gateways: [
      { id: "cod", name: "Cash on Delivery", description: "Pay in cash upon physical receipt." },
      { id: "card", name: "Credit/Debit Card", description: "CMI, Visa, Mastercard processing." }
    ],
    defaultMapCenter: { lat: 31.7917, lng: -7.0926, zoom: 5 }
  },
  "Tunisia": {
    name: "Tunisia",
    currency: "TND",
    symbol: "د.ت",
    locale: "ar-TN",
    flag: "🇹🇳",
    phoneFormat: "+216 XX XXX XXX",
    phonePlaceholder: "+216 20 123 456",
    emailPlaceholder: "client@mail.tn",
    taxRate: 0.19,
    regions: [
      { code: "TUN", name: "Tunis", nameAr: "تونس" },
      { code: "SFA", name: "Sfax", nameAr: "صفاقس" },
      { code: "SOO", name: "Sousse", nameAr: "سوسة" }
    ],
    gateways: [
      { id: "cod", name: "Cash on Delivery", description: "Pay cash upon delivery." },
      { id: "card", name: "Credit/Debit Card", description: "Visa, MasterCard, or CIB Tunisie." }
    ],
    defaultMapCenter: { lat: 33.8869, lng: 9.5375, zoom: 6 }
  },
  "China": {
    name: "China",
    currency: "CNY",
    symbol: "¥",
    locale: "zh-CN",
    flag: "🇨🇳",
    phoneFormat: "+86 1XX XXXX XXXX",
    phonePlaceholder: "+86 138 1234 5678",
    emailPlaceholder: "shopper@example.cn",
    taxRate: 0.13,
    regions: [
      { code: "BJ", name: "Beijing", nameAr: "بكين" },
      { code: "SH", name: "Shanghai", nameAr: "شانغهاي" },
      { code: "GD", name: "Guangdong", nameAr: "غوانغدونغ" }
    ],
    gateways: [
      { id: "card", name: "UnionPay Card", description: "UnionPay secure card checkout." },
      { id: "wire", name: "WeChat / Alipay", description: "Digital mobile payment methods." }
    ],
    defaultMapCenter: { lat: 35.8617, lng: 104.1954, zoom: 4 }
  },
  "India": {
    name: "India",
    currency: "INR",
    symbol: "₹",
    locale: "en-IN",
    flag: "🇮🇳",
    phoneFormat: "+91 XXXXX XXXXX",
    phonePlaceholder: "+91 98765 43210",
    emailPlaceholder: "shopper@example.in",
    taxRate: 0.18,
    regions: [
      { code: "MH", name: "Maharashtra", nameAr: "ماهاراشترا" },
      { code: "DL", name: "Delhi", nameAr: "دلهي" },
      { code: "KA", name: "Karnataka", nameAr: "كارناتاكا" }
    ],
    gateways: [
      { id: "cod", name: "Cash on Delivery (COD)", description: "Pay in cash or UPI QR upon delivery." },
      { id: "card", name: "Credit/Debit Card", description: "Visa, Mastercard, RuPay secure checkout." },
      { id: "wire", name: "UPI Transfer", description: "GPay, PhonePe, Paytm, or netbanking." }
    ],
    defaultMapCenter: { lat: 20.5937, lng: 78.9629, zoom: 4 }
  }
};

// Static fallback exchange rates relative to 1 USD
export const FALLBACK_EXCHANGE_RATES: Record<string, number> = {
  USD: 1.0,
  DZD: 134.5,
  EUR: 0.92,
  GBP: 0.79,
  SAR: 3.75,
  AED: 3.67,
  CAD: 1.37,
  TRY: 32.8,
  MAD: 10.0,
  TND: 3.12,
  CNY: 7.25,
  INR: 83.5
};

/**
 * Converts an amount from source currency to target currency.
 * PLUG-IN LIVE RATE API CACHED DAILY FOR PRODUCTION:
 * To use a live API (e.g., exchange-rate API), replace or extend this logic:
 *
 * async function fetchLiveRates() {
 *   const cacheKey = "dz_live_rates";
 *   const cacheTimeKey = "dz_live_rates_timestamp";
 *   const cachedTime = localStorage.getItem(cacheTimeKey);
 *   const now = Date.now();
 *
 *   if (cachedTime && now - Number(cachedTime) < 24 * 60 * 60 * 1000) {
 *     return JSON.parse(localStorage.getItem(cacheKey)!);
 *   }
 *
 *   try {
 *     const res = await fetch("https://open.er-api.com/v6/latest/USD");
 *     const data = await res.json();
 *     if (data && data.rates) {
 *       localStorage.setItem(cacheKey, JSON.stringify(data.rates));
 *       localStorage.setItem(cacheTimeKey, now.toString());
 *       return data.rates;
 *     }
 *   } catch (e) {
 *     console.error("Failed to fetch live exchange rates", e);
 *   }
 *   return FALLBACK_EXCHANGE_RATES;
 * }
 */
export function convertCurrency(amount: number, fromCurrency: string, toCurrency: string): number {
  const fromRate = FALLBACK_EXCHANGE_RATES[fromCurrency] || 1.0;
  const toRate = FALLBACK_EXCHANGE_RATES[toCurrency] || 1.0;
  // Convert source amount to USD first, then convert from USD to target currency
  const amountInUSD = amount / fromRate;
  return amountInUSD * toRate;
}

/**
 * Detects the user's country preference on first visit using local storage, timezone heuristics, 
 * or IP geolocation as a fallback.
 */
export async function detectCountry(): Promise<string> {
  // 1. Check local storage
  try {
    const saved = localStorage.getItem("dz_country");
    if (saved && countryCurrencyMapping[saved]) {
      return saved;
    }
  } catch (e) {}

  // 2. Try timezone mapping first (instant and reliable without network request)
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz) {
      if (tz.includes("Algiers")) return "Algeria";
      if (tz.includes("Paris") || tz.includes("Europe/Paris") || tz.includes("Europe/Brussels") || tz.includes("Europe/Luxembourg")) return "France";
      if (tz.includes("London") || tz.includes("Europe/London") || tz.includes("Europe/Dublin")) return "United Kingdom";
      if (tz.includes("Berlin") || tz.includes("Europe/Berlin") || tz.includes("Europe/Vienna") || tz.includes("Europe/Zurich")) return "Germany";
      if (tz.includes("Riyadh") || tz.includes("Asia/Riyadh") || tz.includes("Asia/Baghdad") || tz.includes("Asia/Kuwait")) return "Saudi Arabia";
      if (tz.includes("Dubai") || tz.includes("Asia/Dubai") || tz.includes("Asia/Muscat")) return "UAE";
      if (tz.includes("New_York") || tz.includes("Chicago") || tz.includes("Los_Angeles") || tz.includes("Denver") || tz.includes("Phoenix") || tz.includes("Anchorage") || tz.includes("Honolulu")) return "United States";
      if (tz.includes("Toronto") || tz.includes("Vancouver") || tz.includes("Montreal") || tz.includes("Calgary") || tz.includes("Edmonton")) return "Canada";
      if (tz.includes("Istanbul") || tz.includes("Europe/Istanbul")) return "Turkey";
      if (tz.includes("Casablanca") || tz.includes("Africa/Casablanca")) return "Morocco";
      if (tz.includes("Tunis") || tz.includes("Africa/Tunis")) return "Tunisia";
      if (tz.includes("Shanghai") || tz.includes("Urumqi") || tz.includes("Asia/Shanghai") || tz.includes("Asia/Hong_Kong")) return "China";
      if (tz.includes("Kolkata") || tz.includes("Calcutta") || tz.includes("Asia/Kolkata")) return "India";
    }
  } catch (e) {}

  // 3. Fallback network fetch with geolocation suggestion
  try {
    const res = await fetch("https://ipapi.co/json/").then(r => r.json());
    if (res && res.country_name) {
      const match = Object.keys(countryCurrencyMapping).find(
        key => key.toLowerCase() === res.country_name.toLowerCase()
      );
      if (match) return match;
    }
  } catch (e) {}

  return "United States"; // Default suggested country
}

export function setCountry(countryName: string) {
  try {
    localStorage.setItem("dz_country", countryName);
  } catch (e) {}
}

/**
 * Formats an amount using browser's native Intl.NumberFormat API to conform 
 * fully to target currency, locale, decimals, RTL formatting, etc.
 */
export function formatPrice(
  amountInMerchantCurrency: number,
  merchantCurrency: string = "USD",
  targetCountryName: string
): { formatted: string; isConverted: boolean; originalText?: string } {
  const targetConfig = countryCurrencyMapping[targetCountryName] || countryCurrencyMapping["United States"];
  const targetCurrency = targetConfig.currency;
  const targetLocale = targetConfig.locale;

  const isConverted = merchantCurrency !== targetCurrency;
  const convertedAmount = isConverted 
    ? convertCurrency(amountInMerchantCurrency, merchantCurrency, targetCurrency)
    : amountInMerchantCurrency;

  const formatter = new Intl.NumberFormat(targetLocale, {
    style: "currency",
    currency: targetCurrency,
  });

  const formatted = formatter.format(convertedAmount);

  let originalText = "";
  if (isConverted) {
    const merchantCountryConfig = Object.values(countryCurrencyMapping).find(c => c.currency === merchantCurrency);
    const merchantLocale = merchantCountryConfig ? merchantCountryConfig.locale : "en-US";
    const originalFormatter = new Intl.NumberFormat(merchantLocale, {
      style: "currency",
      currency: merchantCurrency,
    });
    originalText = originalFormatter.format(amountInMerchantCurrency);
  }

  return {
    formatted,
    isConverted,
    originalText
  };
}

export function getCountryRegions(countryName: string): { code: string; name: string; nameAr: string }[] {
  const config = countryCurrencyMapping[countryName] || countryCurrencyMapping["United States"];
  return config.regions;
}

export function getCommunicativeHubs(countryName: string): { code: string; name: string; nameAr: string; lat: number; lng: number; zoom: number }[] {
  const config = countryCurrencyMapping[countryName] || countryCurrencyMapping["United States"];
  const mapCenter = config.defaultMapCenter;
  
  return config.regions.map((reg, idx) => {
    // Distribute map pins evenly around the center
    const angle = (idx / config.regions.length) * 2 * Math.PI;
    const offsetRadius = mapCenter.zoom > 10 ? 0.02 : 1.2;
    const lat = mapCenter.lat + Math.sin(angle) * offsetRadius;
    const lng = mapCenter.lng + Math.cos(angle) * offsetRadius;
    
    return {
      code: reg.code,
      name: reg.name,
      nameAr: reg.nameAr,
      lat,
      lng,
      zoom: Math.min(15, mapCenter.zoom + 1)
    };
  });
}
