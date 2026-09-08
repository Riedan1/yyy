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
  ChevronDown
} from "lucide-react";
import { GrowthCampaign, GrowthLandingPage } from "../../types/growthStudio";

interface PublicGrowthLandingPageProps {
  campaign: GrowthCampaign;
  landingPage: GrowthLandingPage;
  onOrderSuccess: (orderData: any) => void;
  onBackToStore?: () => void;
  isArabic?: boolean;
}

const ALGERIAN_WILAYAS = [
  "16 - الجزائر (Alger)",
  "31 - وهران (Oran)",
  "25 - قسنطينة (Constantine)",
  "19 - سطيف (Sétif)",
  "06 - بجاية (Béjaïa)",
  "15 - تيزي وزو (Tizi Ouzou)",
  "09 - البليدة (Blida)",
  "35 - بومرداس (Boumerdès)",
  "42 - تيبازة (Tipaza)",
  "13 - تلمسان (Tlemcen)",
  "23 - عنابة (Annaba)",
  "05 - باتنة (Batna)",
  "28 - المسيلة (M'Sila)",
  "17 - الجلفة (Djelfa)",
  "30 - ورقلة (Ouargla)",
  "47 - غرداية (Ghardaïa)",
  "07 - بسكرة (Biskra)",
  "39 - الوادي (El Oued)",
  "22 - سيدي بلعباس (Sidi Bel Abbès)",
  "27 - مستغانم (Mostaganem)",
  "44 - عين الدفلى (Aïn Defla)",
  "26 - المدية (Médéa)",
  "10 - البويرة (Bouira)",
  "34 - برج بوعريريج (Bordj Bou Arréridj)",
  "18 - جيجل (Jijel)",
  "21 - سكيكدة (Skikda)",
  "40 - خنشلة (Khenchela)",
  "04 - أم البواقي (Oum El Bouaghi)",
  "41 - سوق أهراس (Souk Ahras)",
  "12 - تبسة (Tébessa)",
  "29 - معسكر (Mascara)",
  "48 - غليزان (Relizane)",
  "20 - سعيدة (Saïda)",
  "14 - تيارت (Tiaret)",
  "38 - تسمسيلت (Tissemsilt)",
  "02 - الشلف (Chlef)",
  "46 - عين تموشنت (Aïn Témouchent)",
  "08 - بشار (Béchar)",
  "01 - أدرار (Adrar)",
  "03 - الأغواط (Laghouat)",
  "32 - البيض (El Bayadh)",
  "45 - النعامة (Naâma)",
  "33 - إليزي (Illizi)",
  "11 - تمنراست (Tamanrasset)",
  "36 - الطارف (El Tarf)",
  "37 - تندوف (Tindouf)",
  "43 - ميلة (Mila)"
];

export const PublicGrowthLandingPage: React.FC<PublicGrowthLandingPageProps> = ({
  campaign,
  landingPage,
  onOrderSuccess,
  onBackToStore,
  isArabic = true
}) => {
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerWilaya, setCustomerWilaya] = useState(ALGERIAN_WILAYAS[0]);
  const [customerAddress, setCustomerAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);

  // Countdown timer for urgency
  const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 42, seconds: 19 });

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

  const basePrice = campaign.product.price || 4900;
  const shippingCost = 600; // Algerian COD shipping
  const totalPrice = basePrice * quantity + (quantity > 1 ? 0 : shippingCost); // free shipping on 2+

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) return;

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

  const theme = landingPage.theme;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white" dir={isArabic ? "rtl" : "ltr"}>
      
      {/* Top Banner with Urgency Timer */}
      <div 
        className="py-2 px-4 text-white text-xs font-bold text-center flex items-center justify-center gap-3 shadow-xs"
        style={{ backgroundColor: theme.primaryColor }}
      >
        <span className="flex items-center gap-1.5 font-black">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{campaign.offer || "عرض خاص ومحدود • توصيل متوفر لجميع الولايات"}</span>
        </span>
        <div className="hidden sm:flex items-center gap-1 font-mono text-[11px] bg-black/20 px-2 py-0.5 rounded-md">
          <Clock className="w-3 h-3" />
          <span>
            {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Floating Header */}
      <nav className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onBackToStore && (
            <button
              type="button"
              onClick={onBackToStore}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Return to store"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            </button>
          )}
          <span className="text-sm sm:text-base font-black tracking-tight text-slate-900">
            {campaign.product.name}
          </span>
        </div>

        <a
          href="#order-form"
          style={{ backgroundColor: theme.primaryColor }}
          className={`px-4 py-2 text-white text-xs font-black shadow-xs transition-transform hover:scale-105 cursor-pointer ${
            theme.buttonStyle === "pill" ? "rounded-full" : theme.buttonStyle === "rounded" ? "rounded-xl" : "rounded-none"
          }`}
        >
          {isArabic ? "طلب الآن" : "Order Now"}
        </a>
      </nav>

      {/* Content Container */}
      <main className="max-w-xl mx-auto px-4 py-6 space-y-8">

        {/* Dynamic Sections */}
        {landingPage.sections.filter((s) => s.visible).map((section) => (
          <div key={section.id} className="space-y-4">

            {/* HERO SECTION */}
            {section.type === "hero" && (
              <div className="text-center space-y-4 pt-1">
                {section.badge && (
                  <span 
                    className="inline-block px-3 py-1 rounded-full text-xs font-black tracking-wide"
                    style={{ backgroundColor: `${theme.accentColor}20`, color: theme.primaryColor }}
                  >
                    {section.badge}
                  </span>
                )}
                <h1 className="text-2xl sm:text-3xl font-black text-slate-950 leading-tight">
                  {section.headline}
                </h1>
                {section.subheadline && (
                  <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
                    {section.subheadline}
                  </p>
                )}

                {/* Hero Media */}
                {section.imageUrl && (
                  <div className="rounded-3xl overflow-hidden shadow-xl aspect-4/3 bg-slate-100 max-w-md mx-auto">
                    <img 
                      src={section.imageUrl} 
                      alt={section.headline}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                {/* Pricing Display */}
                <div className="p-3.5 rounded-2xl bg-slate-100/90 border border-slate-200 flex items-center justify-center gap-4 max-w-xs mx-auto">
                  <span className="text-2xl font-black font-mono text-slate-950">
                    {basePrice.toLocaleString()} DA
                  </span>
                  {campaign.product.originalPrice && (
                    <span className="text-sm font-mono text-slate-400 line-through">
                      {campaign.product.originalPrice.toLocaleString()} DA
                    </span>
                  )}
                </div>

                <div className="pt-1">
                  <a
                    href="#order-form"
                    style={{ backgroundColor: theme.primaryColor }}
                    className={`w-full max-w-xs block mx-auto py-4 px-6 text-white font-black text-sm shadow-md transition-transform hover:scale-105 cursor-pointer text-center ${
                      theme.buttonStyle === "pill" ? "rounded-full" : theme.buttonStyle === "rounded" ? "rounded-xl" : "rounded-none"
                    }`}
                  >
                    {section.ctaText || "اطلب الآن والدفع بعد المعاينة"}
                  </a>
                  <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 mt-2 font-medium">
                    <span className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>توصيل لكافة الـ 58 ولاية</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                      <span>الدفع عند الاستلام (COD)</span>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* BENEFITS SECTION */}
            {section.type === "benefits" && (
              <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
                <div className="text-center space-y-1">
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    {section.headline}
                  </h3>
                  {section.subheadline && (
                    <p className="text-xs text-slate-500">{section.subheadline}</p>
                  )}
                </div>

                <div className="space-y-3 pt-1">
                  {(section.items || []).map((item, i) => (
                    <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-start gap-3">
                      <span 
                        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold mt-0.5 shadow-2xs"
                        style={{ backgroundColor: theme.primaryColor }}
                      >
                        ✓
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TESTIMONIALS SECTION */}
            {(section.type === "testimonials" || section.type === "reviews") && (
              <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
                <div className="text-center space-y-1">
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    {section.headline}
                  </h3>
                  {section.subheadline && (
                    <p className="text-xs text-slate-500">{section.subheadline}</p>
                  )}
                </div>

                <div className="space-y-3">
                  {(section.items || []).map((item, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{item.title}</span>
                        <div className="flex items-center text-amber-500 text-xs">
                          {"★".repeat(item.rating || 5)}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        "{item.description}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* URGENCY SECTION */}
            {section.type === "urgency" && (
              <div 
                className="p-5 rounded-3xl text-center space-y-2 text-white shadow-md"
                style={{ backgroundColor: theme.primaryColor }}
              >
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase bg-white/20 px-2.5 py-0.5 rounded-full inline-block">
                  {section.badge || "عرض محدود"}
                </span>
                <h3 className="text-base sm:text-lg font-black">
                  {section.headline}
                </h3>
                <p className="text-xs text-white/90 max-w-sm mx-auto">{section.subheadline}</p>
              </div>
            )}

          </div>
        ))}

        {/* SECTION: INTEGRATED CASH ON DELIVERY ORDER FORM */}
        <section id="order-form" className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md space-y-5">
          <div className="text-center space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full inline-block">
              {isArabic ? "الدفع بعد المعاينة عند الاستلام" : "Cash on Delivery"}
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              {isArabic ? "استمارة الطلب المباشر" : "Complete Your Order"}
            </h2>
            <p className="text-xs text-slate-500">
              {isArabic
                ? "املأ بياناتك أدناه، وسنتصل بك هاتفياً لتأكيد المقاس وموعد التوصيل."
                : "Fill in your delivery details. We will call you to confirm dispatch."}
            </p>
          </div>

          {orderCompleted ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-emerald-950">
                {isArabic ? "تم تسجيل طلبك بنجاح!" : "Order Placed Successfully!"}
              </h3>
              <p className="text-xs text-emerald-800 leading-relaxed">
                {isArabic
                  ? `شكراً لك يا ${customerName}. سنتصل بك قريباً على الرقم ${customerPhone} لتأكيد تجهيز طردك وشحنه إلى ${customerWilaya}.`
                  : `Thank you ${customerName}. We will contact you soon on ${customerPhone} to arrange dispatch.`}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitOrder} className="space-y-4">
              {/* Quantity Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  {isArabic ? "اختر الكمية:" : "Quantity:"}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((qty) => (
                    <button
                      key={qty}
                      type="button"
                      onClick={() => setQuantity(qty)}
                      className={`py-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                        quantity === qty
                          ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-2xs"
                          : "border-slate-200 bg-slate-50 text-slate-700"
                      }`}
                    >
                      {qty} {isArabic ? (qty === 1 ? "قطعة" : qty === 2 ? "قطعتين (شحن مجاني)" : "قطع") : "Unit"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isArabic ? "الاسم واللقب:" : "Full Name:"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isArabic ? "مثال: ياسين براهيمي" : "e.g., Yacine Brahimi"}
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isArabic ? "رقم الهاتف (للاتصال والتأكيد):" : "Phone Number:"}
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="05 / 06 / 07 XX XX XX"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-mono focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 rtl:left-auto rtl:right-3 pointer-events-none" />
                </div>
              </div>

              {/* Wilaya */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isArabic ? "الولاية (58 ولاية):" : "Wilaya (Province):"}
                </label>
                <select
                  value={customerWilaya}
                  onChange={(e) => setCustomerWilaya(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {ALGERIAN_WILAYAS.map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>

              {/* Address / Baladiya */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isArabic ? "البلدية والعنوان بالتفصيل:" : "Address & Municipality:"}
                </label>
                <input
                  type="text"
                  placeholder={isArabic ? "مثال: بلدية درارية، حي السلام عمارة 4" : "e.g., Municipality, Street, Building"}
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Pricing Breakdown */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>{isArabic ? "سعر المنتج:" : "Product Subtotal:"}</span>
                  <span className="font-mono font-bold">{(basePrice * quantity).toLocaleString()} DA</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>{isArabic ? "تكلفة الشحن (التوصيل السريع):" : "Shipping Cost:"}</span>
                  <span className="font-mono font-bold">
                    {quantity > 1 ? (isArabic ? "مجاناً (عرض الباقة)" : "Free (Offer)") : `${shippingCost} DA`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-950 pt-2 border-t border-slate-200">
                  <span>{isArabic ? "المجموع الكلي عند الاستلام:" : "Total on Delivery:"}</span>
                  <span className="font-mono font-black text-indigo-600">{totalPrice.toLocaleString()} DA</span>
                </div>
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                style={{ backgroundColor: theme.primaryColor }}
                className={`w-full py-4 text-white font-black text-sm shadow-lg transition-transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer ${
                  theme.buttonStyle === "pill" ? "rounded-full" : theme.buttonStyle === "rounded" ? "rounded-xl" : "rounded-none"
                }`}
              >
                {isSubmitting ? (isArabic ? "جاري تسجيل طلبك..." : "Processing Order...") : (isArabic ? "تأكيد الطلب والدفع عند الاستلام" : "Confirm Cash on Delivery Order")}
              </button>
            </form>
          )}
        </section>

      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-xs text-slate-400 border-t border-slate-200 space-y-1">
        <p>© 2026 {campaign.product.name} • {isArabic ? "مدعوم عبر منصة YOMI للتجارة الإلكترونية" : "Powered by YOMI E-Commerce"}</p>
        <p>{isArabic ? "خدمة الزبائن متوفرة 7/7 أيام للتوصيل والاستبدال." : "Customer support available 7 days a week."}</p>
      </footer>

    </div>
  );
};
