import React, { useState } from "react";
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  Plus, 
  Trash2, 
  Copy, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  EyeOff, 
  Edit3, 
  Check, 
  X, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  ShoppingBag, 
  Star, 
  HelpCircle, 
  Clock, 
  Sliders,
  Palette
} from "lucide-react";
import { GrowthLandingPage, LandingPageSection, SectionType } from "../../types/growthStudio";

interface LandingPageBuilderProps {
  landingPage: GrowthLandingPage;
  onUpdateLandingPage: (updated: GrowthLandingPage) => void;
  onClose: () => void;
  isArabic?: boolean;
}

const AVAILABLE_SECTION_TEMPLATES: Array<{
  type: SectionType;
  label: string;
  labelAr: string;
  defaultHeadline: string;
  defaultHeadlineAr: string;
  icon: React.ReactNode;
}> = [
  {
    type: "hero",
    label: "Hero Header",
    labelAr: "قسم الواجهة الرئيسية (Hero)",
    defaultHeadline: "Transform Your Everyday Comfort with Ergonomic Footwear",
    defaultHeadlineAr: "اكتشف الراحة الاستثنائية مع حذاء الصيف المبتكر",
    icon: <ShoppingBag className="w-4 h-4" />
  },
  {
    type: "benefits",
    label: "Key Benefits",
    labelAr: "الفوائد والمميزات الرئيسية",
    defaultHeadline: "Why Customers Switched to Our Brand",
    defaultHeadlineAr: "أهم الفوائد التي تجعل هذا المنتج خيارك الأول",
    icon: <Layers className="w-4 h-4" />
  },
  {
    type: "testimonials",
    label: "Social Proof / Testimonials",
    labelAr: "شهادات الزبائن الموثقة",
    defaultHeadline: "Loved by Over 10,000 Satisfied Algerian Buyers",
    defaultHeadlineAr: "تجارب موثوقة من زبائن حقيقيين في الجزائر",
    icon: <Star className="w-4 h-4" />
  },
  {
    type: "urgency",
    label: "Urgency & Countdown",
    labelAr: "العرض المؤقت والعداد التنازلي",
    defaultHeadline: "Special Seasonal Promotion • Limited Daily Quantity",
    defaultHeadlineAr: "عرض ترويجي محدود • ينتهي قريباً مع نفاد المخزون",
    icon: <Clock className="w-4 h-4" />
  },
  {
    type: "comparison",
    label: "Comparison Table",
    labelAr: "جدول مقارنة صريح",
    defaultHeadline: "How We Compare to Ordinary Alternatives",
    defaultHeadlineAr: "مقارنة المنتج بالبدائل العادية في السوق",
    icon: <Sliders className="w-4 h-4" />
  },
  {
    type: "faq",
    label: "FAQ & Clarifications",
    labelAr: "الأسئلة الشائعة وتفاصيل التوصيل",
    defaultHeadline: "Frequently Asked Questions",
    defaultHeadlineAr: "الأسئلة الشائعة حول الشحن والضمان وطريقة الدفع",
    icon: <HelpCircle className="w-4 h-4" />
  },
  {
    type: "guarantee",
    label: "Trust & COD Guarantee",
    labelAr: "ضمان الفحص والمعاينة قبل الدفع",
    defaultHeadline: "100% Risk-Free: Inspect Before You Pay",
    defaultHeadlineAr: "ضمان ذهبي: عاين طلبك مع عامل التوصيل قبل الدفع",
    icon: <ShieldCheck className="w-4 h-4" />
  },
  {
    type: "cta",
    label: "Direct Order Form (CTA)",
    labelAr: "استمارة الطلب المباشر (CTA)",
    defaultHeadline: "Claim Your Exclusive Package Today",
    defaultHeadlineAr: "أكد طلبك الآن والدفع عند الاستلام لباب بيتك",
    icon: <Check className="w-4 h-4" />
  }
];

export const LandingPageBuilder: React.FC<LandingPageBuilderProps> = ({
  landingPage,
  onUpdateLandingPage,
  onClose,
  isArabic = false
}) => {
  const [deviceView, setDeviceView] = useState<"mobile" | "tablet" | "desktop">("mobile");
  const [activeTab, setActiveTab] = useState<"sections" | "design">("sections");
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);

  // Local state for page sections
  const [sections, setSections] = useState<LandingPageSection[]>(landingPage.sections);
  const [theme, setTheme] = useState(landingPage.theme);

  // Reorder sections
  const moveSection = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const updated = [...sections];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    setSections(updated);
    onUpdateLandingPage({
      ...landingPage,
      sections: updated,
      theme
    });
  };

  // Toggle visibility
  const toggleVisibility = (id: string) => {
    const updated = sections.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s));
    setSections(updated);
    onUpdateLandingPage({
      ...landingPage,
      sections: updated,
      theme
    });
  };

  // Duplicate section
  const duplicateSection = (index: number) => {
    const original = sections[index];
    const duplicated: LandingPageSection = {
      ...original,
      id: `sec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      headline: `${original.headline} (Copy)`
    };

    const updated = [...sections.slice(0, index + 1), duplicated, ...sections.slice(index + 1)];
    setSections(updated);
    onUpdateLandingPage({
      ...landingPage,
      sections: updated,
      theme
    });
  };

  // Delete section
  const deleteSection = (id: string) => {
    const updated = sections.filter((s) => s.id !== id);
    setSections(updated);
    onUpdateLandingPage({
      ...landingPage,
      sections: updated,
      theme
    });
  };

  // Add new section
  const handleAddSection = (template: typeof AVAILABLE_SECTION_TEMPLATES[0]) => {
    const newSection: LandingPageSection = {
      id: `sec-${Date.now()}`,
      type: template.type,
      visible: true,
      headline: isArabic ? template.defaultHeadlineAr : template.defaultHeadline,
      subheadline: isArabic ? "وصف توضيحي إضافي لتعزيز ثقة الزائر ومعدل التحويل." : "Detailed compelling message designed to build visitor trust.",
      ctaText: isArabic ? "اطلب الآن والدفع عند الاستلام" : "Order Now - Pay on Delivery",
      items: [
        { title: isArabic ? "ميزة فائقة 01" : "Feature One", description: isArabic ? "شرح مبسط ومقنع للقيمة المضافة." : "Clear benefit addressing a core customer pain point." },
        { title: isArabic ? "ميزة فائقة 02" : "Feature Two", description: isArabic ? "تفاصيل إضافية تضمن راحة العميل." : "High quality guarantee with frictionless support." }
      ]
    };

    const updated = [...sections, newSection];
    setSections(updated);
    onUpdateLandingPage({
      ...landingPage,
      sections: updated,
      theme
    });
    setShowAddSectionModal(false);
  };

  // Update specific section content
  const handleUpdateSectionContent = (id: string, updates: Partial<LandingPageSection>) => {
    const updated = sections.map((s) => (s.id === id ? { ...s, ...updates } : s));
    setSections(updated);
    onUpdateLandingPage({
      ...landingPage,
      sections: updated,
      theme
    });
  };

  // Update theme
  const handleThemeColorChange = (key: keyof typeof theme, val: string) => {
    const updatedTheme = { ...theme, [key]: val };
    setTheme(updatedTheme);
    onUpdateLandingPage({
      ...landingPage,
      sections,
      theme: updatedTheme
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-sm flex flex-col overflow-hidden text-left">
      {/* Top Navbar */}
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold">
              Builder
            </span>
            <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
              {landingPage.name}
            </h2>
          </div>
          <span className="hidden sm:inline-block text-xs text-slate-400 font-mono">
            ({sections.length} {isArabic ? "أقسام نشطة" : "sections"})
          </span>
        </div>

        {/* Device Switcher (Desktop / Tablet / Mobile) */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setDeviceView("mobile")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              deviceView === "mobile"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
            title="Mobile First View"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile (82%)</span>
          </button>
          <button
            type="button"
            onClick={() => setDeviceView("tablet")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              deviceView === "tablet"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tablet</span>
          </button>
          <button
            type="button"
            onClick={() => setDeviceView("desktop")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              deviceView === "desktop"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-4 h-4 text-emerald-500" />
            <span>{isArabic ? "حفظ وإغلاق" : "Save & Exit"}</span>
          </button>
        </div>
      </header>

      {/* Main Workspace: Left Controls Sidebar + Center Canvas */}
      <div className="flex-1 flex overflow-hidden">

        {/* Left Drawer / Panel: Sections list & reordering */}
        <aside className="w-80 sm:w-96 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 overflow-y-auto">
          {/* Tabs: Sections vs Design */}
          <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("sections")}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === "sections"
                  ? "bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800"
                  : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isArabic ? "الأقسام والترتيب" : "Sections Order"}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("design")}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === "design"
                  ? "bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800"
                  : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>{isArabic ? "الهوية والألوان" : "Theme & Styles"}</span>
            </button>
          </div>

          {activeTab === "sections" ? (
            <div className="p-4 space-y-3 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {isArabic ? "أقسام الصفحة الحالية" : "Page Sections"}
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddSectionModal(true)}
                  className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isArabic ? "إضافة قسم" : "Add Section"}</span>
                </button>
              </div>

              {/* Sections list */}
              <div className="space-y-2">
                {sections.map((section, idx) => (
                  <div
                    key={section.id}
                    className={`p-3 rounded-2xl border transition-all ${
                      editingSectionId === section.id
                        ? "border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/30"
                        : "border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850/60"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-5 h-5 rounded-md bg-white dark:bg-slate-800 text-slate-500 font-mono text-[10px] font-bold flex items-center justify-center border border-slate-200 dark:border-slate-700 shrink-0">
                          {idx + 1}
                        </span>
                        <div className="truncate">
                          <span className="text-xs font-bold text-slate-900 dark:text-white capitalize block truncate">
                            {section.type} • {section.headline}
                          </span>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => moveSection(idx, "up")}
                          disabled={idx === 0}
                          className="p-1 rounded text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                          title="Move up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveSection(idx, "down")}
                          disabled={idx === sections.length - 1}
                          className="p-1 rounded text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                          title="Move down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingSectionId(editingSectionId === section.id ? null : section.id)}
                          className="p-1 rounded text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 cursor-pointer"
                          title="Edit section"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => duplicateSection(idx)}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                          title="Duplicate"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteSection(section.id)}
                          className="p-1 rounded text-rose-500 hover:text-rose-700 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Inline Editor if expanded */}
                    {editingSectionId === section.id && (
                      <div className="mt-3 pt-3 border-t border-slate-200/80 dark:border-slate-800 space-y-2.5">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            {isArabic ? "العنوان الرئيسي (Headline)" : "Headline"}
                          </label>
                          <input
                            type="text"
                            value={section.headline}
                            onChange={(e) => handleUpdateSectionContent(section.id, { headline: e.target.value })}
                            className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            {isArabic ? "العنوان الفرعي (Subheadline)" : "Subheadline"}
                          </label>
                          <textarea
                            rows={2}
                            value={section.subheadline || ""}
                            onChange={(e) => handleUpdateSectionContent(section.id, { subheadline: e.target.value })}
                            className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                          />
                        </div>

                        {section.type === "hero" || section.type === "cta" ? (
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                              {isArabic ? "نص زر الطلب (CTA Button)" : "CTA Button Label"}
                            </label>
                            <input
                              type="text"
                              value={section.ctaText || ""}
                              onChange={(e) => handleUpdateSectionContent(section.id, { ctaText: e.target.value })}
                              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                            />
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                {isArabic ? "تخصيص الهوية البصرية" : "Visual Identity & Palette"}
              </span>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    {isArabic ? "اللون الرئيسي (Primary Brand Color)" : "Primary Brand Color"}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={theme.primaryColor}
                      onChange={(e) => handleThemeColorChange("primaryColor", e.target.value)}
                      className="w-9 h-9 rounded-lg cursor-pointer border border-slate-300 dark:border-slate-700 p-0.5"
                    />
                    <input
                      type="text"
                      value={theme.primaryColor}
                      onChange={(e) => handleThemeColorChange("primaryColor", e.target.value)}
                      className="text-xs font-mono font-bold px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    {isArabic ? "اللون الثانوي المميز (Accent Color)" : "Accent Color"}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={theme.accentColor}
                      onChange={(e) => handleThemeColorChange("accentColor", e.target.value)}
                      className="w-9 h-9 rounded-lg cursor-pointer border border-slate-300 dark:border-slate-700 p-0.5"
                    />
                    <input
                      type="text"
                      value={theme.accentColor}
                      onChange={(e) => handleThemeColorChange("accentColor", e.target.value)}
                      className="text-xs font-mono font-bold px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    {isArabic ? "شكل الأزرار (Button Shape)" : "Button Style"}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["pill", "rounded", "sharp"] as const).map((style) => (
                      <button
                        key={style}
                        type="button"
                        onClick={() => handleThemeColorChange("buttonStyle", style)}
                        className={`py-2 text-xs font-bold border transition-all cursor-pointer capitalize ${
                          theme.buttonStyle === style
                            ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300"
                            : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                        } ${style === "pill" ? "rounded-full" : style === "rounded" ? "rounded-xl" : "rounded-none"}`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* Center Live Canvas Preview */}
        <main className="flex-1 bg-slate-200/60 dark:bg-slate-950 p-4 sm:p-8 flex items-center justify-center overflow-y-auto">
          {/* Device Frame */}
          <div
            className={`transition-all duration-300 bg-white text-slate-900 shadow-2xl overflow-y-auto relative ${
              deviceView === "mobile"
                ? "w-[390px] h-[780px] rounded-[48px] border-[10px] border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)]"
                : deviceView === "tablet"
                ? "w-[720px] h-[850px] rounded-[36px] border-[12px] border-slate-800 shadow-2xl"
                : "w-full max-w-5xl h-[850px] rounded-2xl border border-slate-300 dark:border-slate-800 shadow-2xl"
            }`}
          >
            {/* Mobile Dynamic Island / Notch */}
            {deviceView === "mobile" && (
              <div className="sticky top-0 z-40 w-full flex justify-center pt-2 pb-1 bg-white">
                <div className="w-24 h-4 bg-black rounded-full" />
              </div>
            )}

            {/* Rendered Landing Page Sections Inside the Frame */}
            <div className="p-4 sm:p-6 space-y-8 font-sans">
              {sections.filter((s) => s.visible).map((section) => (
                <div key={section.id} className="space-y-4">

                  {/* HERO SECTION */}
                  {section.type === "hero" && (
                    <div className="text-center space-y-4 pt-2">
                      {section.badge && (
                        <span 
                          className="inline-block px-3 py-1 rounded-full text-xs font-black tracking-wide"
                          style={{ backgroundColor: `${theme.accentColor}20`, color: theme.primaryColor }}
                        >
                          {section.badge}
                        </span>
                      )}
                      <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                        {section.headline}
                      </h1>
                      {section.subheadline && (
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
                          {section.subheadline}
                        </p>
                      )}

                      {/* Hero Image */}
                      {section.imageUrl && (
                        <div className="rounded-2xl overflow-hidden shadow-md max-w-sm mx-auto aspect-4/3 bg-slate-100">
                          <img 
                            src={section.imageUrl} 
                            alt={section.headline}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}

                      <div className="pt-2">
                        <button
                          type="button"
                          style={{ backgroundColor: theme.primaryColor }}
                          className={`w-full max-w-xs mx-auto py-3.5 px-6 text-white font-black text-sm shadow-md transition-transform hover:scale-105 cursor-pointer ${
                            theme.buttonStyle === "pill" ? "rounded-full" : theme.buttonStyle === "rounded" ? "rounded-xl" : "rounded-none"
                          }`}
                        >
                          {section.ctaText || "اطلب الآن والدفع عند الاستلام"}
                        </button>
                        {section.ctaSubtext && (
                          <span className="text-[11px] text-slate-500 block mt-1.5 font-medium">
                            {section.ctaSubtext}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* BENEFITS SECTION */}
                  {section.type === "benefits" && (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                      <div className="text-center space-y-1">
                        <h3 className="text-sm sm:text-base font-black text-slate-900">
                          {section.headline}
                        </h3>
                        {section.subheadline && (
                          <p className="text-xs text-slate-500">{section.subheadline}</p>
                        )}
                      </div>

                      <div className="space-y-2.5 pt-2">
                        {(section.items || []).map((item, i) => (
                          <div key={i} className="p-3 rounded-xl bg-white border border-slate-200/70 flex items-start gap-2.5">
                            <span 
                              className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold mt-0.5"
                              style={{ backgroundColor: theme.primaryColor }}
                            >
                              ✓
                            </span>
                            <div>
                              <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                              <p className="text-[11px] text-slate-600 mt-0.5">{item.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TESTIMONIALS / REVIEWS */}
                  {(section.type === "testimonials" || section.type === "reviews") && (
                    <div className="space-y-3">
                      <div className="text-center">
                        <h3 className="text-sm sm:text-base font-black text-slate-900">
                          {section.headline}
                        </h3>
                        {section.subheadline && (
                          <p className="text-xs text-slate-500">{section.subheadline}</p>
                        )}
                      </div>

                      <div className="space-y-2.5">
                        {(section.items || []).map((item, i) => (
                          <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-900">{item.title}</span>
                              <div className="flex items-center text-amber-500 text-xs">
                                {"★".repeat(item.rating || 5)}
                              </div>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed font-normal">
                              "{item.description}"
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* URGENCY / FLASH OFFER */}
                  {section.type === "urgency" && (
                    <div 
                      className="p-4 rounded-2xl text-center space-y-2 text-white"
                      style={{ backgroundColor: theme.primaryColor }}
                    >
                      <span className="text-[10px] font-mono font-bold tracking-widest uppercase bg-white/20 px-2 py-0.5 rounded-full">
                        {section.badge || "عرض محدود"}
                      </span>
                      <h3 className="text-sm sm:text-base font-black">
                        {section.headline}
                      </h3>
                      <p className="text-xs text-white/80">{section.subheadline}</p>
                    </div>
                  )}

                  {/* DIRECT COD CTA FORM */}
                  {section.type === "cta" && (
                    <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-200/70 space-y-3 text-center">
                      <h3 className="text-sm sm:text-base font-black text-slate-900">
                        {section.headline}
                      </h3>
                      <p className="text-xs text-slate-600">{section.subheadline}</p>

                      <div className="space-y-2 max-w-sm mx-auto text-left pt-2">
                        <input
                          type="text"
                          disabled
                          placeholder="الاسم الكامل"
                          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white"
                        />
                        <input
                          type="text"
                          disabled
                          placeholder="رقم الهاتف (05 / 06 / 07)"
                          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white"
                        />
                        <select
                          disabled
                          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white"
                        >
                          <option>اختر الولاية (16 - الجزائر، 31 - وهران...)</option>
                        </select>
                        <button
                          type="button"
                          style={{ backgroundColor: theme.primaryColor }}
                          className={`w-full py-3 text-white font-black text-xs shadow-md cursor-pointer ${
                            theme.buttonStyle === "pill" ? "rounded-full" : theme.buttonStyle === "rounded" ? "rounded-xl" : "rounded-none"
                          }`}
                        >
                          {section.ctaText || "تأكيد الطلب والدفع عند الاستلام"}
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Add Section Modal */}
      {showAddSectionModal && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-5 text-left">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {isArabic ? "إضافة قسم جديد إلى صفحة الهبوط" : "Add Landing Page Section"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {isArabic ? "اختر نوع القسم الجاهز لتخصيص محتواه فوراً." : "Select a pre-designed conversion section to insert."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddSectionModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-96 overflow-y-auto">
              {AVAILABLE_SECTION_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.type}
                  type="button"
                  onClick={() => handleAddSection(tmpl)}
                  className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 bg-slate-50/70 dark:bg-slate-850/60 hover:bg-white dark:hover:bg-slate-800 text-left transition-all cursor-pointer flex items-start gap-3 group"
                >
                  <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                    {tmpl.icon}
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                      {isArabic ? tmpl.labelAr : tmpl.label}
                    </span>
                    <span className="text-[10px] text-slate-400 line-clamp-2">
                      {isArabic ? tmpl.defaultHeadlineAr : tmpl.defaultHeadline}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
