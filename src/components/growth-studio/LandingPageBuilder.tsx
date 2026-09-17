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
  Palette,
  Layout,
  Type,
  Image as ImageIcon,
  Video,
  FileText,
  Truck,
  Store,
  ChevronRight,
  Maximize2
} from "lucide-react";
import { GrowthLandingPage, LandingPageSection, SectionType } from "../../types/growthStudio";
import { ProductInformationCard, ProductCardDisplayMode, ProductCardVisibleFields } from "./ProductInformationCard";

interface LandingPageBuilderProps {
  landingPage: GrowthLandingPage;
  onUpdateLandingPage: (updated: GrowthLandingPage) => void;
  onClose: () => void;
  isArabic?: boolean;
}

// 18 REUSABLE SECTIONS AS SPECIFIED IN PDF & INSTRUCTIONS
const REUSABLE_SECTION_TYPES: Array<{
  type: SectionType | string;
  label: string;
  description: string;
  defaultHeadline: string;
  icon: React.ReactNode;
}> = [
  {
    type: "hero",
    label: "Hero Header",
    description: "High-impact visual headline, key value proposition, and primary action button.",
    defaultHeadline: "Transform Your Everyday Comfort with Ergonomic Footwear",
    icon: <ShoppingBag className="w-4 h-4" />
  },
  {
    type: "product",
    label: "Product Information",
    description: "Dedicated conversion card with variant selectors, price, stock, and immediate checkout.",
    defaultHeadline: "Verified Flagship Product Specifications",
    icon: <Sliders className="w-4 h-4" />
  },
  {
    type: "benefits",
    label: "Key Benefits",
    description: "Bullet points or icon cards addressing customer pain points and value gains.",
    defaultHeadline: "Why Over 12,000 Verified Customers Choose This Model",
    icon: <Layers className="w-4 h-4" />
  },
  {
    type: "features",
    label: "Feature Cards",
    description: "Technical highlights and distinctive product components.",
    defaultHeadline: "Engineered with Unrivaled Craftsmanship",
    icon: <Sparkles className="w-4 h-4" />
  },
  {
    type: "specifications",
    label: "Specifications",
    description: "Detailed measurements, materials, weight, compatibility, and tech specs.",
    defaultHeadline: "Technical Specifications & Materials",
    icon: <FileText className="w-4 h-4" />
  },
  {
    type: "image_text",
    label: "Image and Text",
    description: "Side-by-side visual storytelling layout pairing lifestyle photography with copy.",
    defaultHeadline: "Crafted for Continuous Daily Performance",
    icon: <ImageIcon className="w-4 h-4" />
  },
  {
    type: "full_width_image",
    label: "Full-Width Image",
    description: "Edge-to-edge high-resolution banner image or product showcase.",
    defaultHeadline: "Experience Next-Level Visual Distinction",
    icon: <Maximize2 className="w-4 h-4" />
  },
  {
    type: "gallery",
    label: "Product Gallery",
    description: "Multi-image grid or carousel highlighting angles, details, and packaging.",
    defaultHeadline: "Detailed Close-Up & Angle Showcase",
    icon: <Layout className="w-4 h-4" />
  },
  {
    type: "video",
    label: "Video Presentation",
    description: "Embed product demonstration, unboxing, or customer review video.",
    defaultHeadline: "See the Product in Action (Hands-On Demo)",
    icon: <Video className="w-4 h-4" />
  },
  {
    type: "comparison",
    label: "Comparison Table",
    description: "Side-by-side matrix contrasting your brand against generic market alternatives.",
    defaultHeadline: "How Our Solution Compares to Market Alternatives",
    icon: <Sliders className="w-4 h-4" />
  },
  {
    type: "faq",
    label: "FAQ Section",
    description: "Address customer doubts regarding delivery, sizing, returns, and payment.",
    defaultHeadline: "Frequently Asked Questions & Support",
    icon: <HelpCircle className="w-4 h-4" />
  },
  {
    type: "shipping",
    label: "Shipping Information",
    description: "Express delivery timelines across all 58 Wilayas and courier details.",
    defaultHeadline: "Doorstep Express Delivery to All 58 Wilayas",
    icon: <Truck className="w-4 h-4" />
  },
  {
    type: "trust",
    label: "Trust & Guarantee",
    description: "Inspect before payment guarantee and hassle-free return policy.",
    defaultHeadline: "100% Risk-Free: Inspect Before You Pay",
    icon: <ShieldCheck className="w-4 h-4" />
  },
  {
    type: "store_info",
    label: "Store Information",
    description: "Merchant credentials, store location, verified badge, and contact links.",
    defaultHeadline: "About Our Verified Yume Store",
    icon: <Store className="w-4 h-4" />
  },
  {
    type: "custom_text",
    label: "Custom Text",
    description: "Freeform rich text or announcement block.",
    defaultHeadline: "Special Customer Announcement",
    icon: <Type className="w-4 h-4" />
  },
  {
    type: "custom_image",
    label: "Custom Image Banner",
    description: "Custom promotional graphic or certificate visual.",
    defaultHeadline: "Official Certification & Standards",
    icon: <ImageIcon className="w-4 h-4" />
  },
  {
    type: "cta",
    label: "Direct Order CTA",
    description: "High-converting Cash-on-Delivery order form with quick confirmation.",
    defaultHeadline: "Claim Your Package Today • Cash on Delivery",
    icon: <Check className="w-4 h-4" />
  },
  {
    type: "footer",
    label: "Footer & Legal",
    description: "Copyright, privacy notice, terms of delivery, and merchant credentials.",
    defaultHeadline: "All Rights Reserved • Yume Merchant Platform",
    icon: <FileText className="w-4 h-4" />
  }
];

export const LandingPageBuilder: React.FC<LandingPageBuilderProps> = ({
  landingPage,
  onUpdateLandingPage,
  onClose
}) => {
  const [deviceView, setDeviceView] = useState<"mobile" | "tablet" | "desktop">("mobile");
  const [mobileWorkspaceView, setMobileWorkspaceView] = useState<"sidebar" | "canvas">("sidebar");
  const [activeSidebarTab, setActiveSidebarTab] = useState<"sections" | "content" | "design" | "product_card">("sections");
  const [editingSectionId, setEditingSectionId] = useState<string | null>(landingPage.sections[0]?.id || null);
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);

  const defaultTheme = {
    primaryColor: "#0A1F44",
    accentColor: "#E2A26C",
    backgroundColor: "#070F1E",
    backgroundGradient: "linear-gradient(180deg, #070F1E 0%, #0A1F44 45%, #08152B 100%)",
    cardBackgroundColor: "#0E1C36",
    textColor: "#F4F6F8",
    fontFamily: "'Cairo', sans-serif",
    buttonStyle: "pill" as const,
    badgeText: "عرض حصري موثوق"
  };

  // Local state for page sections and theme
  const [sections, setSections] = useState<LandingPageSection[]>(landingPage.sections || []);
  const [theme, setTheme] = useState({
    ...defaultTheme,
    ...(landingPage.theme || {})
  });

  // Product card settings state (PDF Page 6)
  const [productCardMode, setProductCardMode] = useState<ProductCardDisplayMode>("standard");

  const isArabicPage = landingPage.language === "ar" || (landingPage.theme?.fontFamily?.includes("Tajawal") ?? false) || (landingPage.theme?.fontFamily?.includes("Cairo") ?? false);

  const activeSection = sections.find((s) => s.id === editingSectionId) || sections[0];

  const syncChanges = (newSections: LandingPageSection[], newTheme = theme) => {
    setSections(newSections);
    onUpdateLandingPage({
      ...landingPage,
      sections: newSections,
      theme: newTheme
    });
  };

  // Reorder sections
  const moveSection = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const updated = [...sections];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    syncChanges(updated);
  };

  // Toggle visibility
  const toggleVisibility = (id: string) => {
    const updated = sections.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s));
    syncChanges(updated);
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
    syncChanges(updated);
  };

  // Delete section
  const deleteSection = (id: string) => {
    const updated = sections.filter((s) => s.id !== id);
    syncChanges(updated);
    if (editingSectionId === id) {
      setEditingSectionId(updated[0]?.id || null);
    }
  };

  // Add new section
  const handleAddSection = (template: typeof REUSABLE_SECTION_TYPES[0]) => {
    const newSection: LandingPageSection = {
      id: `sec-${Date.now()}`,
      type: template.type as SectionType,
      visible: true,
      headline: template.defaultHeadline,
      subheadline: "Compelling descriptive message engineered to maximize consumer confidence and purchase conversion.",
      ctaText: "Order Now - Cash on Delivery",
      items: [
        { title: "Primary Feature / Advantage", description: "Clear factual benefit addressing the customer's top expectation." },
        { title: "Quality Guarantee", description: "Doorstep inspection and hassle-free courier delivery across 58 Wilayas." }
      ]
    };

    const updated = [...sections, newSection];
    syncChanges(updated);
    setEditingSectionId(newSection.id);
    setShowAddSectionModal(false);
  };

  // Update specific section content
  const handleUpdateSection = (id: string, updates: Partial<LandingPageSection>) => {
    const updated = sections.map((s) => (s.id === id ? { ...s, ...updates } : s));
    syncChanges(updated);
  };

  // Update theme settings
  const handleThemeChange = (key: keyof typeof theme, value: any) => {
    const updatedTheme = { ...theme, [key]: value };
    setTheme(updatedTheme);
    syncChanges(sections, updatedTheme);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-sm flex flex-col overflow-hidden text-left">
      {/* Top Navbar */}
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold">
              Visual Editor
            </span>
            <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
              {landingPage.name}
            </h2>
          </div>
          <span className="hidden sm:inline-block text-xs text-slate-400 font-mono">
            ({sections.length} active sections)
          </span>
        </div>

        {/* Device Switcher (Desktop / Tablet / Mobile) */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setDeviceView("mobile")}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
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
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
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
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              deviceView === "desktop"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
        </div>

        {/* Mobile View Switcher (Controls vs Canvas) */}
        <div className="flex md:hidden items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setMobileWorkspaceView("sidebar")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              mobileWorkspaceView === "sidebar"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Controls
          </button>
          <button
            type="button"
            onClick={() => setMobileWorkspaceView("canvas")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              mobileWorkspaceView === "canvas"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Preview
          </button>
        </div>

        {/* Right Actions: Save & Exit */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 sm:px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Save & Exit</span>
          </button>
        </div>
      </header>

      {/* Main Workspace: Left Controls Sidebar + Center Canvas */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Controls Sidebar */}
        <aside className={`${mobileWorkspaceView === "sidebar" ? "flex" : "hidden"} md:flex w-full md:w-80 lg:w-96 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-col shrink-0 overflow-y-auto`}>
          
          {/* Subtabs Bar */}
          <div className="p-2 border-b border-slate-200 dark:border-slate-800 grid grid-cols-4 gap-1">
            <button
              type="button"
              onClick={() => setActiveSidebarTab("sections")}
              className={`py-2 text-[11px] font-bold rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                activeSidebarTab === "sections"
                  ? "bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800"
                  : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Sections</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSidebarTab("content")}
              className={`py-2 text-[11px] font-bold rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                activeSidebarTab === "content"
                  ? "bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800"
                  : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Content</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSidebarTab("design")}
              className={`py-2 text-[11px] font-bold rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                activeSidebarTab === "design"
                  ? "bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800"
                  : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Design</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSidebarTab("product_card")}
              className={`py-2 text-[11px] font-bold rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                activeSidebarTab === "product_card"
                  ? "bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800"
                  : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Product Card</span>
            </button>
          </div>

          {/* TAB 1: SECTIONS LIST & REORDERING */}
          {activeSidebarTab === "sections" && (
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Page Sections ({sections.length})
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddSectionModal(true)}
                  className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Section</span>
                </button>
              </div>

              <div className="space-y-2">
                {sections.map((sec, idx) => (
                  <div
                    key={sec.id}
                    className={`p-3 rounded-2xl border transition-all ${
                      editingSectionId === sec.id
                        ? "border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/30"
                        : "border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850/60"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div 
                        className="flex items-center gap-2 min-w-0 cursor-pointer"
                        onClick={() => {
                          setEditingSectionId(sec.id);
                          setActiveSidebarTab("content");
                        }}
                      >
                        <span className="w-5 h-5 rounded-md bg-white dark:bg-slate-800 text-slate-500 font-mono text-[10px] font-bold flex items-center justify-center border border-slate-200 dark:border-slate-700 shrink-0">
                          {idx + 1}
                        </span>
                        <div className="truncate">
                          <span className="text-xs font-bold text-slate-900 dark:text-white capitalize block truncate">
                            {sec.type.replace("_", " ")}
                          </span>
                          <span className="text-[10px] text-slate-400 truncate block">
                            {sec.headline}
                          </span>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => moveSection(idx, "up")}
                          disabled={idx === 0}
                          className="p-1 rounded text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-20 cursor-pointer"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveSection(idx, "down")}
                          disabled={idx === sections.length - 1}
                          className="p-1 rounded text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-20 cursor-pointer"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleVisibility(sec.id)}
                          className={`p-1 rounded cursor-pointer ${
                            sec.visible ? "text-emerald-500" : "text-slate-300 dark:text-slate-600"
                          }`}
                          title={sec.visible ? "Hide Section" : "Show Section"}
                        >
                          {sec.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => duplicateSection(idx)}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 cursor-pointer"
                          title="Duplicate Section"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteSection(sec.id)}
                          className="p-1 rounded text-rose-400 hover:text-rose-600 cursor-pointer"
                          title="Delete Section"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: DETAILED CONTENT EDITING */}
          {activeSidebarTab === "content" && activeSection && (
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Editing: {activeSection.type.replace("_", " ")}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  ID: {activeSection.id}
                </span>
              </div>

              {/* Headline */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Section Headline
                </label>
                <input
                  type="text"
                  value={activeSection.headline}
                  onChange={(e) => handleUpdateSection(activeSection.id, { headline: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              {/* Subheadline */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Subheadline / Body Message
                </label>
                <textarea
                  rows={3}
                  value={activeSection.subheadline || ""}
                  onChange={(e) => handleUpdateSection(activeSection.id, { subheadline: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white leading-relaxed"
                />
              </div>

              {/* Badge text */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Badge / Eyebrow Text (Optional)
                </label>
                <input
                  type="text"
                  value={activeSection.badge || ""}
                  onChange={(e) => handleUpdateSection(activeSection.id, { badge: e.target.value })}
                  placeholder="e.g. Exclusive Launch Drop"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  value={activeSection.imageUrl || ""}
                  onChange={(e) => handleUpdateSection(activeSection.id, { imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                />
              </div>

              {/* CTA Button Text */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  CTA Button Label
                </label>
                <input
                  type="text"
                  value={activeSection.ctaText || ""}
                  onChange={(e) => handleUpdateSection(activeSection.id, { ctaText: e.target.value })}
                  placeholder="Order Now - Cash on Delivery"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              {/* CTA Subtext */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  CTA Subtext / Reassurance
                </label>
                <input
                  type="text"
                  value={activeSection.ctaSubtext || ""}
                  onChange={(e) => handleUpdateSection(activeSection.id, { ctaSubtext: e.target.value })}
                  placeholder="Inspect package upon courier delivery"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              {/* Price fields */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">
                    Price (DA)
                  </label>
                  <input
                    type="number"
                    value={activeSection.price || ""}
                    onChange={(e) => handleUpdateSection(activeSection.id, { price: Number(e.target.value) })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">
                    Strike Price (DA)
                  </label>
                  <input
                    type="number"
                    value={activeSection.originalPrice || ""}
                    onChange={(e) => handleUpdateSection(activeSection.id, { originalPrice: Number(e.target.value) })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DESIGN & PALETTE CONTROLS */}
          {activeSidebarTab === "design" && (
            <div className="p-4 space-y-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Visual Identity & Styles
              </span>

              {/* Primary Color */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Primary Color (Brand Accent)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.primaryColor}
                    onChange={(e) => handleThemeChange("primaryColor", e.target.value)}
                    className="w-9 h-9 rounded-xl border border-slate-300 dark:border-slate-700 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={theme.primaryColor}
                    onChange={(e) => handleThemeChange("primaryColor", e.target.value)}
                    className="text-xs font-mono font-bold px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Accent Color */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Secondary Accent Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.accentColor}
                    onChange={(e) => handleThemeChange("accentColor", e.target.value)}
                    className="w-9 h-9 rounded-xl border border-slate-300 dark:border-slate-700 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={theme.accentColor}
                    onChange={(e) => handleThemeChange("accentColor", e.target.value)}
                    className="text-xs font-mono font-bold px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Button Shape */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Button Style & Radius
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["pill", "rounded", "sharp"] as const).map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => handleThemeChange("buttonStyle", style)}
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
          )}

          {/* TAB 4: PRODUCT CARD DISPLAY MODES */}
          {activeSidebarTab === "product_card" && (
            <div className="p-4 space-y-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Product Card Display Modes (PDF Page 6)
              </span>

              <div className="space-y-2">
                {[
                  { id: "standard", label: "Standard Card", desc: "Balanced layout with media, variants, and purchase actions." },
                  { id: "compact", label: "Compact Card", desc: "Dense, low-height card ideal for high-speed impulse buying." },
                  { id: "detailed", label: "Detailed Card", desc: "Expanded specifications, logistics, and store credentials." },
                  { id: "sticky", label: "Sticky Purchase Card", desc: "Fixed floating bar pinned to the screen bottom during scroll." },
                  { id: "mobile_bottom", label: "Mobile Bottom Bar", desc: "High-yield thumb-zone checkout trigger on mobile devices." }
                ].map((mode) => (
                  <div
                    key={mode.id}
                    onClick={() => setProductCardMode(mode.id as any)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                      productCardMode === mode.id
                        ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-xs"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {mode.label}
                      </span>
                      {productCardMode === mode.id && (
                        <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      {mode.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </aside>

        {/* Center Live Canvas Preview */}
        <main className={`${mobileWorkspaceView === "canvas" ? "flex" : "hidden"} md:flex flex-1 bg-slate-100 dark:bg-slate-950 p-2 sm:p-4 md:p-8 items-center justify-center overflow-y-auto`}>
          {/* Device Frame */}
          <div
            className={`transition-all duration-300 bg-white text-slate-900 shadow-2xl overflow-y-auto relative w-full ${
              deviceView === "mobile"
                ? "max-w-[390px] h-[780px] rounded-[36px] sm:rounded-[48px] border-[6px] sm:border-[10px] border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)]"
                : deviceView === "tablet"
                ? "max-w-[720px] h-[850px] rounded-[28px] sm:rounded-[36px] border-[8px] sm:border-[12px] border-slate-800 shadow-2xl"
                : "max-w-5xl h-[850px] rounded-2xl border border-slate-300 dark:border-slate-800 shadow-2xl"
            }`}
          >
            {/* Dynamic Island on Mobile */}
            {deviceView === "mobile" && (
              <div className="sticky top-0 z-40 w-full flex justify-center pt-2 pb-1 bg-white">
                <div className="w-24 h-4 bg-black rounded-full" />
              </div>
            )}

            {/* Rendered Landing Page Sections Inside Canvas */}
            <div 
              dir={isArabicPage ? "rtl" : "ltr"}
              className="p-4 sm:p-6 space-y-8 font-sans"
            >
              {sections.filter((s) => s.visible).map((section) => (
                <div key={section.id} className="space-y-4">

                  {/* 1. HERO */}
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
                          {section.ctaText || "Order Now - Cash on Delivery"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 2. PRODUCT INFORMATION CARD (PDF Page 6 Component) */}
                  {section.type === "product" && (
                    <ProductInformationCard
                      product={{
                        id: "prod-demo",
                        name: section.headline,
                        price: section.price || 4900,
                        originalPrice: section.originalPrice || 6800,
                        imageUrl: section.imageUrl || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
                        description: section.subheadline,
                        colors: [
                          { name: "Black", hex: "#0f172a" },
                          { name: "Silver", hex: "#64748b" }
                        ],
                        sizes: ["39", "40", "41", "42", "43"]
                      }}
                      mode={productCardMode}
                      primaryColor={theme.primaryColor}
                      accentColor={theme.accentColor}
                      buttonStyle={theme.buttonStyle}
                    />
                  )}

                  {/* 3. BENEFITS */}
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

                  {/* 4. COMPARISON */}
                  {section.type === "comparison" && (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                      <h3 className="text-sm sm:text-base font-black text-slate-900 text-center">
                        {section.headline}
                      </h3>
                      <div className="overflow-x-auto text-xs">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-slate-200">
                              <th className="py-2 text-slate-400 font-bold">Feature</th>
                              <th className="py-2 font-bold text-indigo-600">Our Brand</th>
                              <th className="py-2 text-slate-400 font-bold">Generic Alternatives</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            <tr>
                              <td className="py-2 font-bold">Doorstep Inspection</td>
                              <td className="py-2 text-emerald-600 font-bold">✓ Included</td>
                              <td className="py-2 text-rose-500 font-bold">✗ No Check</td>
                            </tr>
                            <tr>
                              <td className="py-2 font-bold">58 Wilayas COD</td>
                              <td className="py-2 text-emerald-600 font-bold">✓ Fast Dispatch</td>
                              <td className="py-2 text-slate-400">Delayed</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* 5. FAQ */}
                  {section.type === "faq" && (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                      <h3 className="text-sm sm:text-base font-black text-slate-900 text-center">
                        {section.headline}
                      </h3>
                      <div className="space-y-2">
                        <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                          <span className="font-bold block">Can I inspect the parcel before paying?</span>
                          <span className="text-slate-500 block">Yes, our delivery courier allows you to verify your items before paying in cash.</span>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                          <span className="font-bold block">How long does shipping take?</span>
                          <span className="text-slate-500 block">Algiers & major urban hubs receive delivery in 24 hours. Other wilayas in 48 hours.</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 6. DIRECT COD CTA */}
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
                          placeholder="Full Name (Nom complet)"
                          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white"
                        />
                        <input
                          type="text"
                          disabled
                          placeholder="Phone Number (05 / 06 / 07)"
                          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white"
                        />
                        <select
                          disabled
                          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white"
                        >
                          <option>Select Wilaya (16 - Alger, 31 - Oran, etc.)</option>
                        </select>
                        <button
                          type="button"
                          style={{ backgroundColor: theme.primaryColor }}
                          className={`w-full py-3 text-white font-black text-xs shadow-md cursor-pointer ${
                            theme.buttonStyle === "pill" ? "rounded-full" : theme.buttonStyle === "rounded" ? "rounded-xl" : "rounded-none"
                          }`}
                        >
                          {section.ctaText || "Confirm Order - Pay upon Delivery"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 7. OTHER SECTIONS (GENERIC FALLBACK DISPLAY) */}
                  {section.type !== "hero" && section.type !== "product" && section.type !== "benefits" && section.type !== "comparison" && section.type !== "faq" && section.type !== "cta" && (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 font-bold text-xs uppercase">
                          {section.type.replace("_", " ")}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">{section.headline}</h4>
                      </div>
                      {section.subheadline && (
                        <p className="text-xs text-slate-600 leading-relaxed">{section.subheadline}</p>
                      )}
                      {section.imageUrl && (
                        <img 
                          src={section.imageUrl} 
                          alt={section.headline}
                          className="rounded-xl w-full max-h-48 object-cover border border-slate-200 mt-2"
                        />
                      )}
                    </div>
                  )}

                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Add Section Modal with 18 Reusable Sections */}
      {showAddSectionModal && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-5 text-left max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Add Landing Page Section
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Select from 18 conversion-tested section blocks.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddSectionModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto pr-1 flex-1">
              {REUSABLE_SECTION_TYPES.map((template) => (
                <div
                  key={template.type}
                  onClick={() => handleAddSection(template)}
                  className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 bg-slate-50/50 dark:bg-slate-850/50 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/20 transition-all cursor-pointer flex items-start gap-3"
                >
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700 shrink-0">
                    {template.icon}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {template.label}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                      {template.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
