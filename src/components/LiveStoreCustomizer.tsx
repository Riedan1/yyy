import React, { useState } from "react";
import { 
  X, Save, RotateCcw, Palette, Type, Sliders, Layout, Sparkles, 
  Settings, Type as FontIcon, Eye, Check, ChevronRight, HelpCircle,
  FileText, Megaphone
} from "lucide-react";
import { MerchantStore } from "../types";
import { SkeuomorphicSwitch } from "./SkeuomorphicSwitch";

interface LiveStoreCustomizerProps {
  selectedStore: MerchantStore;
  onUpdateSetting: (key: string, value: any, isRoot?: boolean) => void;
  onSave: () => void;
  onCancel: () => void;
  currentLanguage: "en" | "fr" | "ar";
  darkMode: boolean;
}

export function LiveStoreCustomizer({
  selectedStore,
  onUpdateSetting,
  onSave,
  onCancel,
  currentLanguage,
  darkMode
}: LiveStoreCustomizerProps) {
  const [activeTab, setActiveTab] = useState<"design" | "products" | "fonts" | "glass" | "text">("design");

  const design: any = selectedStore.designSettings || {};

  // Presets
  const coverTemplatesList = [
    { id: "toonhub", name: "ToonHub", desc: "Playful & Vibrant Colors" },
    { id: "sahara_gold", name: "Sahara Gold", desc: "Golden Desert Sunset" },
    { id: "casbah_minimal", name: "Casbah Minimal", desc: "Modern Slate Slate" },
    { id: "berber_indigo", name: "Berber Indigo", desc: "Indigo Cultural Oasis" },
    { id: "turquoise_sea", name: "Turquoise Sea", desc: "Coastal Refreshing Teal" },
    { id: "moorish_emerald", name: "Moorish Emerald", desc: "Royal Algiers Green" },
    { id: "sunset_rose", name: "Sunset Rose", desc: "Romantic Rose Blossom" },
    { id: "cyber_kasbah", name: "Cyber Kasbah", desc: "Retro-Futuristic Neon" },
    { id: "slate_noir", name: "Slate Noir", desc: "Premium Deep Charcoal" },
    { id: "terracotta", name: "Terracotta", desc: "Warm Clay & Earthen Tones" },
    { id: "velvet_crimson", name: "Velvet Crimson", desc: "Luxury Saturated Wine" },
    { id: "classic", name: "Classic Minimal", desc: "Traditional dark format" },
    { id: "mysticflower", name: "Mystic Flower", desc: "Symmetrical Botanical Layout" },
    { id: "gaming", name: "Gaming Oasis", desc: "Pixel Arcade Retro Vibe" },
    { id: "my_brand", name: "My Brand (Customizer)", desc: "Logo Centric Layout" },
  ];

  const fontFamilies = [
    { value: "inherit", label: "Default (System Sans)" },
    { value: "'Inter', sans-serif", label: "Inter (Modern Clean)" },
    { value: "'Space Grotesk', sans-serif", label: "Space Grotesk (Tech Forward)" },
    { value: "'Outfit', sans-serif", label: "Outfit (Premium Minimalist)" },
    { value: "'Playfair Display', serif", label: "Playfair Display (Elegant Serif)" },
    { value: "'JetBrains Mono', monospace", label: "JetBrains Mono (Technical Mono)" },
    { value: "'Cinzel', serif", label: "Cinzel (Traditional Moorish Craft)" },
  ];

  const accentPresets = [
    { hex: "#4f46e5", label: "Indigo" },
    { hex: "#eab308", label: "Amber" },
    { hex: "#10b981", label: "Emerald" },
    { hex: "#ff385c", label: "Rose/Pink" },
    { hex: "#8b5cf6", label: "Purple" },
    { hex: "#06b6d4", label: "Cyan" },
    { hex: "#475569", label: "Slate" },
    { hex: "#ef4444", label: "Crimson Red" },
  ];

  const bgPatterns = [
    { id: "white", label: "Default Background" },
    { id: "linen", label: "Linen Texture" },
    { id: "grid", label: "Technical Grid" },
    { id: "dunes", label: "Sahara Dunes" },
    { id: "mosaic", label: "Andalusia Mosaic" },
    { id: "pastel", label: "Soft Pastel Gradient" },
  ];

  const borderStyles = [
    { value: "solid", label: "Solid" },
    { value: "dashed", label: "Dashed" },
    { value: "dotted", label: "Dotted" },
    { value: "double", label: "Double" },
    { value: "none", label: "None" },
  ];

  const borderWidths = [
    { value: "0px", label: "None (0px)" },
    { value: "1px", label: "Thin (1px)" },
    { value: "2px", label: "Standard (2px)" },
    { value: "4px", label: "Medium (4px)" },
    { value: "6px", label: "Thick (6px)" },
    { value: "8px", label: "Ultra (8px)" },
  ];

  const borderRadiusOptions = [
    { value: "none", label: "Sharp Rectangle" },
    { value: "md", label: "Slightly Rounded (md)" },
    { value: "xl", label: "Medium Rounded (xl)" },
    { value: "2xl", label: "Thick Rounded (2xl)" },
    { value: "3xl", label: "Extra Circular (3xl)" },
    { value: "9999px", label: "Pill Shape" },
  ];

  const fontSizes = [
    { value: "compact", label: "Compact" },
    { value: "medium", label: "Standard" },
    { value: "large", label: "Large" },
    { value: "supreme", label: "Supreme Bold" },
  ];

  const bodySizes = [
    { value: "small", label: "Small" },
    { value: "medium", label: "Standard" },
    { value: "large", label: "Large" },
  ];

  return (
    <div 
      className="fixed top-20 right-4 bottom-4 w-96 max-w-[calc(100vw-2rem)] bg-slate-900/90 dark:bg-slate-950/95 border border-slate-700/60 dark:border-slate-800 rounded-3xl shadow-2xl backdrop-blur-2xl text-left flex flex-col z-[100] overflow-hidden select-text animate-fade-in"
      id="merchant-live-customizer-drawer"
    >
      {/* Header Info */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white tracking-tight uppercase">
              {currentLanguage === "ar" ? "لوحة التعديل المباشر" : currentLanguage === "fr" ? "Design en direct" : "Live Page Editor"}
            </h4>
            <p className="text-[10px] text-slate-400 font-medium">
              {currentLanguage === "ar" ? "عدّل المظهر مباشرة على المتجر" : currentLanguage === "fr" ? "Visualisez vos modifications en temps réel" : "Tweak styles and preview instantly"}
            </p>
          </div>
        </div>
        <button 
          onClick={onCancel}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation tabs */}
      <div className="flex border-b border-slate-800 bg-slate-900/30 p-1">
        {[
          { id: "design", label: currentLanguage === "ar" ? "المظهر" : currentLanguage === "fr" ? "Modèle" : "Theme", icon: Palette },
          { id: "products", label: currentLanguage === "ar" ? "المنتجات" : currentLanguage === "fr" ? "Produits" : "Products", icon: Layout },
          { id: "fonts", label: currentLanguage === "ar" ? "الخطوط" : currentLanguage === "fr" ? "Polices" : "Fonts", icon: Type },
          { id: "glass", label: currentLanguage === "ar" ? "الزجاج" : currentLanguage === "fr" ? "Effets" : "Glass", icon: Sliders },
          { id: "text", label: currentLanguage === "ar" ? "النصوص" : currentLanguage === "fr" ? "Identité" : "Texts", icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex flex-col items-center gap-1 py-2 text-[10px] font-bold rounded-xl transition cursor-pointer ${
                isActive 
                  ? "bg-slate-800 text-emerald-400 border border-slate-700/50 shadow-inner" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Form Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">

        {activeTab === "design" && (
          <div className="space-y-4">
            {/* Cover Template Selection */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Cover Template / Layout Model</label>
              <div className="grid grid-cols-1 gap-2">
                <select
                  value={design.coverTemplate || "toonhub"}
                  onChange={(e) => onUpdateSetting("coverTemplate", e.target.value)}
                  className="w-full text-xs font-semibold p-2.5 bg-slate-950 border border-slate-800 text-slate-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                >
                  {coverTemplatesList.map((tmpl) => (
                    <option key={tmpl.id} value={tmpl.id}>
                      {tmpl.name} — {tmpl.desc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Accent Color Customizer */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Accent Boutique Color</label>
              <div className="flex flex-wrap items-center gap-2">
                {accentPresets.map((preset) => {
                  const isSelected = design.accentColor === preset.hex;
                  return (
                    <button
                      key={preset.hex}
                      onClick={() => onUpdateSetting("accentColor", preset.hex)}
                      className={`w-6 h-6 rounded-full relative border border-white/10 flex items-center justify-center cursor-pointer transition transform active:scale-90 ${
                        isSelected ? "ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-950" : ""
                      }`}
                      style={{ backgroundColor: preset.hex }}
                      title={preset.label}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />}
                    </button>
                  );
                })}
                <div className="flex items-center gap-1.5 ml-auto">
                  <input
                    type="color"
                    value={design.accentColor || "#ff385c"}
                    onChange={(e) => onUpdateSetting("accentColor", e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={design.accentColor || "#ff385c"}
                    onChange={(e) => onUpdateSetting("accentColor", e.target.value)}
                    className="bg-slate-950 text-[10px] font-mono text-slate-300 w-16 p-1 rounded border border-slate-800 uppercase focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Layout Width */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Boutique Layout Width</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "medium", label: "Medium (4xl)" },
                  { id: "large", label: "Wide (1800px)" },
                  { id: "full", label: "Ultra (96vw)" },
                ].map((item) => {
                  const isSelected = (design.width || "large") === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onUpdateSetting("width", item.id)}
                      className={`py-2 text-[10px] font-bold rounded-xl border transition cursor-pointer ${
                        isSelected 
                          ? "bg-slate-800 border-emerald-500/40 text-emerald-400" 
                          : "bg-slate-950 border-slate-800/80 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Frame Background Pattern */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Background Wallpaper Pattern</label>
              <select
                value={design.profileBgStyle || "white"}
                onChange={(e) => onUpdateSetting("profileBgStyle", e.target.value)}
                className="w-full text-xs font-semibold p-2.5 bg-slate-950 border border-slate-800 text-slate-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                {bgPatterns.map((pat) => (
                  <option key={pat.id} value={pat.id}>
                    {pat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Grid Card Sizing Option */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                {currentLanguage === "ar" ? "الحد الأدنى لعرض بطاقات المنتجات" : currentLanguage === "fr" ? "Largeur minimale des cartes" : "Grid Card Minimum Width"}
              </label>
              <select
                value={design.gridCardMinWidth || "300px"}
                onChange={(e) => onUpdateSetting("gridCardMinWidth", e.target.value)}
                className="w-full text-xs font-semibold p-2.5 bg-slate-950 border border-slate-800 text-slate-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="300px">
                  {currentLanguage === "ar" ? "300 بكسل (افتراضي - متباعد)" : currentLanguage === "fr" ? "300px (Par défaut - Espacé)" : "300px (Default - Spacious)"}
                </option>
                <option value="250px">
                  {currentLanguage === "ar" ? "250 بكسل (مريح)" : currentLanguage === "fr" ? "250px (Confortable)" : "250px (Comfortable)"}
                </option>
                <option value="200px">
                  {currentLanguage === "ar" ? "200 بكسل (مدمج)" : currentLanguage === "fr" ? "200px (Compact)" : "200px (Compact)"}
                </option>
                <option value="150px">
                  {currentLanguage === "ar" ? "150 بكسل (كثيف)" : currentLanguage === "fr" ? "150px (Dense)" : "150px (Dense)"}
                </option>
                <option value="100px">
                  {currentLanguage === "ar" ? "100 بكسل (كثيف جداً)" : currentLanguage === "fr" ? "100px (Très dense)" : "100px (Very Dense)"}
                </option>
                <option value="800px">
                  {currentLanguage === "ar" ? "800 بكسل (عريض للغاية)" : currentLanguage === "fr" ? "800px (Ultra large)" : "800px (Ultra Wide)"}
                </option>
                <option value="50px">
                  {currentLanguage === "ar" ? "50 بكسل (أعمدة دقيقة)" : currentLanguage === "fr" ? "50px (Micro colonnes)" : "50px (Micro Columns)"}
                </option>
              </select>
            </div>

            {/* Grid Spacing Gap Option */}
            <div className="space-y-1.5" id="grid-spacing-gap-config-container">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                {currentLanguage === "ar" ? "تباعد شبكة المنتجات (الفاصل)" : currentLanguage === "fr" ? "Espacement de la grille (Gap)" : "Product Grid Spacing (Gap)"}
              </label>
              <select
                value={design.gridCardGap || "20px"}
                onChange={(e) => onUpdateSetting("gridCardGap", e.target.value)}
                className="w-full text-xs font-semibold p-2.5 bg-slate-950 border border-slate-800 text-slate-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="5px">5px</option>
                <option value="10px">10px</option>
                <option value="15px">15px</option>
                <option value="20px">20px ({currentLanguage === "ar" ? "الافتراضي" : currentLanguage === "fr" ? "Par défaut" : "Default"})</option>
                <option value="30px">30px</option>
                <option value="40px">40px</option>
                <option value="50px">50px</option>
                <option value="60px">60px</option>
                <option value="80px">80px</option>
              </select>
            </div>

            {/* My Brand Special Layout Customizer Panel */}
            {design.coverTemplate === "my_brand" && (
              <div className="p-3 rounded-2xl bg-slate-950 border border-rose-500/10 space-y-3">
                <span className="text-[10px] font-black text-rose-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-rose-400 animate-pulse" />
                  My Brand Center Layout Controls
                </span>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-400 font-bold">Center Asset Sizing / Spacing</span>
                    <span className="font-mono text-rose-400">{design.myBrandSpacing || 40}px</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={design.myBrandSpacing || 40}
                    onChange={(e) => onUpdateSetting("myBrandSpacing", Number(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 block">Shadow Glow Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={design.myBrandShadowColor || "#000000"}
                      onChange={(e) => onUpdateSetting("myBrandShadowColor", e.target.value)}
                      className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={design.myBrandShadowColor || "#000000"}
                      onChange={(e) => onUpdateSetting("myBrandShadowColor", e.target.value)}
                      className="bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-mono uppercase p-1 rounded w-16"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-400 font-bold">Shadow Blur Intensity</span>
                    <span className="font-mono text-rose-400">{design.myBrandShadowIntensity !== undefined ? design.myBrandShadowIntensity : 10}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    value={design.myBrandShadowIntensity !== undefined ? design.myBrandShadowIntensity : 10}
                    onChange={(e) => onUpdateSetting("myBrandShadowIntensity", Number(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-400 font-bold">Shadow Opacity Strength</span>
                    <span className="font-mono text-rose-400">{design.myBrandShadowOpacity !== undefined ? design.myBrandShadowOpacity : 50}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={design.myBrandShadowOpacity !== undefined ? design.myBrandShadowOpacity : 50}
                    onChange={(e) => onUpdateSetting("myBrandShadowOpacity", Number(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-1 w-full">
                  <label 
                    htmlFor="mybrand-live-shadow-border-checkbox"
                    className="text-[10px] font-bold text-slate-400 cursor-pointer select-none"
                  >
                    Live Shadow Preview border outline
                  </label>
                  <SkeuomorphicSwitch
                    id="mybrand-live-shadow-border-checkbox"
                    checked={design.myBrandShadowPreviewBorder || false}
                    onChange={(val) => onUpdateSetting("myBrandShadowPreviewBorder", val)}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "products" && (
          <div className="space-y-4 fade-in">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3 text-left">
              <h5 className="text-[11px] font-extrabold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                <span>⚡</span> {currentLanguage === "ar" ? "تخصيص شبكة المنتجات" : currentLanguage === "fr" ? "Personnalisation de la grille" : "Live Product Grid Customization"}
              </h5>
              <p className="text-[10px] text-slate-300 mt-1 leading-relaxed">
                {currentLanguage === "ar" 
                  ? "يتم عرض التغييرات فوراً على شبكة المنتجات في الخلفية. تحكم في عرض البطاقة والمسافات الفاصلة بينها."
                  : currentLanguage === "fr"
                  ? "Les modifications sont appliquées instantanément sur la grille de produits en arrière-plan. Ajustez la largeur des cartes et l'espacement."
                  : "Changes are rendered instantly in the background grid below. Toggle between different card pixel widths and item spacing gaps."}
              </p>
            </div>

            {/* Grid Card Sizing Option */}
            <div className="space-y-2 p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                {currentLanguage === "ar" ? "عرض بطاقة المنتج (بالبكسل)" : currentLanguage === "fr" ? "Largeur de carte (px)" : "Product Card Width (px)"}
              </label>
              <div className="text-[10px] text-slate-400">
                {currentLanguage === "ar" 
                  ? "تحكم في عرض كل بطاقة منتج. القيم الصغيرة تنشئ أعمدة أكثر في الصف الواحد."
                  : currentLanguage === "fr"
                  ? "Ajustez la largeur minimale de chaque carte de produit pour organiser plus ou moins de colonnes par ligne."
                  : "Configure the minimum width of each product card. Smaller values yield more grid columns per row."}
              </div>
              
              <div className="flex gap-2">
                <select
                  value={design.gridCardMinWidth || "300px"}
                  onChange={(e) => onUpdateSetting("gridCardMinWidth", e.target.value)}
                  className="flex-1 text-xs font-semibold p-2.5 bg-slate-900 border border-slate-800 text-slate-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="50px">50px ({currentLanguage === "ar" ? "أعمدة دقيقة جداً" : currentLanguage === "fr" ? "Micro colonnes" : "Micro Columns"})</option>
                  <option value="100px">100px ({currentLanguage === "ar" ? "كثيف جداً" : currentLanguage === "fr" ? "Très dense" : "Very Dense"})</option>
                  <option value="150px">150px ({currentLanguage === "ar" ? "كثيف" : currentLanguage === "fr" ? "Dense" : "Dense"})</option>
                  <option value="200px">200px ({currentLanguage === "ar" ? "مدمج" : currentLanguage === "fr" ? "Compact" : "Compact"})</option>
                  <option value="250px">250px ({currentLanguage === "ar" ? "مريح" : currentLanguage === "fr" ? "Confortable" : "Comfortable"})</option>
                  <option value="300px">300px ({currentLanguage === "ar" ? "متباعد (افتراضي)" : currentLanguage === "fr" ? "Par défaut" : "Default - Spacious"})</option>
                  <option value="350px">350px ({currentLanguage === "ar" ? "عريض" : currentLanguage === "fr" ? "Large" : "Wide"})</option>
                  <option value="400px">400px ({currentLanguage === "ar" ? "عريض جداً" : currentLanguage === "fr" ? "Très large" : "Extra Wide"})</option>
                  <option value="500px">500px ({currentLanguage === "ar" ? "عملاق" : currentLanguage === "fr" ? "Géant" : "Giant"})</option>
                  <option value="800px">800px ({currentLanguage === "ar" ? "عريض للغاية" : currentLanguage === "fr" ? "Ultra large" : "Ultra Wide"})</option>
                </select>
              </div>

              {/* Slider Input for fine-tuning card width */}
              <div className="pt-2">
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mb-1">
                  <span>{currentLanguage === "ar" ? "ضبط دقيق للعرض:" : currentLanguage === "fr" ? "Ajustement précis :" : "Fine-tune Width:"}</span>
                  <span className="text-emerald-400 font-bold">{design.gridCardMinWidth || "300px"}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="800"
                  step="5"
                  value={parseInt(design.gridCardMinWidth || "300") || 300}
                  onChange={(e) => onUpdateSetting("gridCardMinWidth", `${e.target.value}px`)}
                  className="w-full accent-emerald-500 cursor-ew-resize bg-slate-900 h-1.5 rounded-lg appearance-none"
                />
              </div>
            </div>

            {/* Grid Spacing Gap Option */}
            <div className="space-y-2 p-3.5 rounded-2xl bg-slate-950 border border-slate-800" id="grid-spacing-gap-config-container">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                {currentLanguage === "ar" ? "تباعد شبكة المنتجات (الفاصل)" : currentLanguage === "fr" ? "Espacement de la grille (Gap)" : "Product Grid Spacing (Gap)"}
              </label>
              <div className="text-[10px] text-slate-400">
                {currentLanguage === "ar"
                  ? "تعديل المسافة الفاصلة (الفاصل) بين عناصر المنتجات في المعرض."
                  : currentLanguage === "fr"
                  ? "Ajustez la distance de séparation (marge/gap) entre les articles de produits sur la vitrine."
                  : "Adjust the separation distance (margin gap) between items inside the storefront."}
              </div>
              
              <div className="flex gap-2">
                <select
                  value={design.gridCardGap || "20px"}
                  onChange={(e) => onUpdateSetting("gridCardGap", e.target.value)}
                  className="flex-1 text-xs font-semibold p-2.5 bg-slate-900 border border-slate-800 text-slate-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="0px">0px ({currentLanguage === "ar" ? "بلا فاصل" : currentLanguage === "fr" ? "Aucun" : "No gap"})</option>
                  <option value="5px">5px</option>
                  <option value="10px">10px</option>
                  <option value="15px">15px</option>
                  <option value="20px">20px ({currentLanguage === "ar" ? "الافتراضي" : currentLanguage === "fr" ? "Par défaut" : "Default"})</option>
                  <option value="30px">30px</option>
                  <option value="40px">40px</option>
                  <option value="50px">50px</option>
                  <option value="65px">65px</option>
                  <option value="80px">80px</option>
                </select>
              </div>

              {/* Slider Input for fine-tuning gap */}
              <div className="pt-2">
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mb-1">
                  <span>{currentLanguage === "ar" ? "ضبط دقيق للمسافة:" : currentLanguage === "fr" ? "Ajustement précis :" : "Fine-tune Gap:"}</span>
                  <span className="text-emerald-400 font-bold">{design.gridCardGap || "20px"}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={parseInt(design.gridCardGap || "20") || 20}
                  onChange={(e) => onUpdateSetting("gridCardGap", `${e.target.value}px`)}
                  className="w-full accent-emerald-500 cursor-ew-resize bg-slate-900 h-1.5 rounded-lg appearance-none"
                />
              </div>
            </div>

            {/* Quick Layout Presets */}
            <div className="space-y-2 p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800/60">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                {currentLanguage === "ar" ? "قوالب تخطيط سريعة" : currentLanguage === "fr" ? "Configurations rapides" : "Quick Grid Layout Presets"}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: currentLanguage === "ar" ? "مدمج للغاية" : currentLanguage === "fr" ? "Ultra Compact" : "Super Compact (Micro)", minWidth: "100px", gap: "5px" },
                  { name: currentLanguage === "ar" ? "تخطيط قياسي" : currentLanguage === "fr" ? "Grille Standard" : "Grid Standard", minWidth: "200px", gap: "15px" },
                  { name: currentLanguage === "ar" ? "متباعد افتراضي" : currentLanguage === "fr" ? "Spacieux" : "Default Spacious", minWidth: "300px", gap: "20px" },
                  { name: currentLanguage === "ar" ? "بطاقات ضخمة" : currentLanguage === "fr" ? "Cartes Géantes" : "Mega Card View", minWidth: "500px", gap: "40px" }
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      onUpdateSetting("gridCardMinWidth", preset.minWidth);
                      onUpdateSetting("gridCardGap", preset.gap);
                    }}
                    className="p-2.5 bg-slate-950 border border-slate-800 hover:border-emerald-500/50 rounded-xl text-left text-[10px] transition cursor-pointer hover:bg-slate-900"
                  >
                    <span className="font-bold text-slate-200 block">{preset.name}</span>
                    <span className="text-slate-500 text-[9px] mt-0.5 block">W: {preset.minWidth} | Gap: {preset.gap}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "fonts" && (
          <div className="space-y-4">
            {/* Font Family selection */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Typography Font Family</label>
              <select
                value={design.fontFamily || "inherit"}
                onChange={(e) => onUpdateSetting("fontFamily", e.target.value)}
                className="w-full text-xs font-semibold p-2.5 bg-slate-950 border border-slate-800 text-slate-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                {fontFamilies.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Title Configuration */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3 text-left">
              <span className="text-[10px] font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                <FontIcon className="w-3.5 h-3.5 text-indigo-400" />
                Storefront Titles & Headings
              </span>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-500 block uppercase">Title Size</span>
                  <select
                    value={design.titleFontSize || "large"}
                    onChange={(e) => onUpdateSetting("titleFontSize", e.target.value)}
                    className="w-full text-[11px] font-semibold p-1.5 bg-slate-900 border border-slate-800 text-slate-200 rounded-lg"
                  >
                    {fontSizes.map((sz) => (
                      <option key={sz.value} value={sz.value}>{sz.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-500 block uppercase">Title Weight</span>
                  <select
                    value={design.titleFontWeight || "800"}
                    onChange={(e) => onUpdateSetting("titleFontWeight", e.target.value)}
                    className="w-full text-[11px] font-semibold p-1.5 bg-slate-900 border border-slate-800 text-slate-200 rounded-lg"
                  >
                    <option value="400">Regular (400)</option>
                    <option value="500">Medium (500)</option>
                    <option value="600">Semibold (600)</option>
                    <option value="700">Bold (700)</option>
                    <option value="800">Extra Bold (800)</option>
                    <option value="950">Black Heavy (950)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-500 block uppercase">Title Font Style</span>
                <select
                  value={design.titleFontStyle || "normal"}
                  onChange={(e) => onUpdateSetting("titleFontStyle", e.target.value)}
                  className="w-full text-[11px] font-semibold p-1.5 bg-slate-900 border border-slate-800 text-slate-200 rounded-lg animate-none"
                >
                  <option value="normal">Upright / Normal</option>
                  <option value="italic">Elegant Italic</option>
                  <option value="oblique">Slanted Modern</option>
                </select>
              </div>
            </div>

            {/* Body Content Typography */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3 text-left">
              <span className="text-[10px] font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                <Type className="w-3.5 h-3.5 text-teal-400" />
                Storefront Body Texts
              </span>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-500 block uppercase">Body Size</span>
                  <select
                    value={design.bodyFontSize || "medium"}
                    onChange={(e) => onUpdateSetting("bodyFontSize", e.target.value)}
                    className="w-full text-[11px] font-semibold p-1.5 bg-slate-900 border border-slate-800 text-slate-200 rounded-lg"
                  >
                    {bodySizes.map((sz) => (
                      <option key={sz.value} value={sz.value}>{sz.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-500 block uppercase">Body Style</span>
                  <select
                    value={design.bodyFontStyle || "italic"}
                    onChange={(e) => onUpdateSetting("bodyFontStyle", e.target.value)}
                    className="w-full text-[11px] font-semibold p-1.5 bg-slate-900 border border-slate-800 text-slate-200 rounded-lg"
                  >
                    <option value="normal">Normal</option>
                    <option value="italic">Italic Quotes</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "glass" && (
          <div className="space-y-4">
            {/* Storefront Profile Glass Bar Customizer (Glassmorphism Style) */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-emerald-500/20 space-y-3.5 text-left">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                Storefront Profile Glass Bar (Glassmorphism Style)
              </span>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Tweak the backdrop-filter blur and transparency of the main glass bar from 0% (Pure Transparency) to 100% (Standard Solid Color).
              </p>

              {/* Glass Blur Amount Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-300 font-bold">Glass Bar Blur Intensity</span>
                  <span className="font-mono text-emerald-400 font-extrabold">
                    {design.glassBarBlur !== undefined ? design.glassBarBlur : 28}px 
                    {(design.glassBarBlur === 24 || design.glassBarBlur === 28) && " (Standard Glass)"}
                    {design.glassBarBlur === 0 && " (0° Clear)"}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={design.glassBarBlur !== undefined ? design.glassBarBlur : 28}
                  onChange={(e) => onUpdateSetting("glassBarBlur", Number(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[9px] text-slate-500 font-medium">
                  <span>0 (Clear Flat)</span>
                  <span>28 (Glass Blur)</span>
                  <span>40 (Max Frost)</span>
                </div>
              </div>

              {/* Glass Transparency/Opacity Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-300 font-bold">Glass Transparency</span>
                  <span className="font-mono text-emerald-400 font-extrabold">
                    {design.glassBarOpacity !== undefined ? design.glassBarOpacity : 18}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={design.glassBarOpacity !== undefined ? design.glassBarOpacity : 18}
                  onChange={(e) => onUpdateSetting("glassBarOpacity", Number(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[9px] text-slate-500 font-medium">
                  <span>0% (Pure Transparent Glass)</span>
                  <span>18% (High Transparency)</span>
                  <span>100% (Standard Solid Color)</span>
                </div>
              </div>

              {/* Glass Bar Tint Colors Preset Grid */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Glass Tint Color Presets</span>
                <div className="grid grid-cols-7 gap-1.5">
                  {[
                    { hex: "#ffffff", label: "iOS Alabaster (Light)" },
                    { hex: "#0f172a", label: "iOS Obsidian (Dark)" },
                    { hex: "#047857", label: "Mint Glass" },
                    { hex: "#0284c7", label: "Sea Glass" },
                    { hex: "#7c3aed", label: "Amethyst Glass" },
                    { hex: "#f43f5e", label: "Rose Glass" },
                    { hex: "#d97706", label: "Sahara Gold" },
                  ].map((color) => {
                    const isSelected = (design.glassBarColor || (darkMode ? "#0f172a" : "#ffffff")) === color.hex;
                    return (
                      <button
                        key={color.hex}
                        type="button"
                        onClick={() => onUpdateSetting("glassBarColor", color.hex)}
                        className={`w-7 h-7 rounded-full border border-white/10 flex items-center justify-center transition-all duration-200 transform active:scale-90 relative cursor-pointer ${
                          isSelected ? "ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-950 scale-105" : "opacity-80 hover:opacity-100"
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.label}
                      >
                        {isSelected && <Check className="w-4 h-4 text-emerald-400 drop-shadow stroke-[3.5px]" />}
                      </button>
                    );
                  })}
                </div>

                {/* Direct Color Picker */}
                <div className="flex items-center gap-2 pt-1.5">
                  <input
                    type="color"
                    value={design.glassBarColor || (darkMode ? "#0f172a" : "#ffffff")}
                    onChange={(e) => onUpdateSetting("glassBarColor", e.target.value)}
                    className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={design.glassBarColor || (darkMode ? "#0f172a" : "#ffffff")}
                    onChange={(e) => onUpdateSetting("glassBarColor", e.target.value)}
                    placeholder="#ffffff"
                    className="bg-slate-900 border border-slate-800 text-[10px] text-slate-200 font-mono uppercase p-1.5 rounded-lg flex-1 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Glassmorphism settings */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-wider block">Glassmorphism Frosted Panels</span>
                <SkeuomorphicSwitch
                  checked={design.glassBlurEnabled !== false}
                  onChange={(val) => onUpdateSetting("glassBlurEnabled", val)}
                />
              </div>

              {(design.glassBlurEnabled !== false) && (
                <>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-slate-400 font-bold font-sans">Glass Frosted Blur Amount</span>
                      <span className="font-mono text-emerald-400">{design.glassBlurAmount !== undefined ? design.glassBlurAmount : 12}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="40"
                      value={design.glassBlurAmount !== undefined ? design.glassBlurAmount : 12}
                      onChange={(e) => onUpdateSetting("glassBlurAmount", Number(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-slate-400 font-bold font-sans">Glass Transparency Opacity</span>
                      <span className="font-mono text-emerald-400">{design.glassTransparency !== undefined ? design.glassTransparency : 40}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={design.glassTransparency !== undefined ? design.glassTransparency : 40}
                      onChange={(e) => onUpdateSetting("glassTransparency", Number(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>

                  <div className="space-y-3 pt-2 border-t border-slate-900">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-300">Ambient Glowing Bubbles (Multi-color background)</span>
                      <SkeuomorphicSwitch
                        checked={design.glassMultiColorEnabled !== false}
                        onChange={(val) => onUpdateSetting("glassMultiColorEnabled", val)}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Frame Borders & Layout Styling */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-left">
              <span className="text-[10px] font-extrabold text-slate-300 uppercase tracking-wider block">Borders & Containers Outline</span>

              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-500 block uppercase">Border Style</span>
                <select
                  value={design.borderStyle || "solid"}
                  onChange={(e) => onUpdateSetting("borderStyle", e.target.value)}
                  className="w-full text-[11px] font-semibold p-1.5 bg-slate-900 border border-slate-800 text-slate-200 rounded-lg cursor-pointer"
                >
                  {borderStyles.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-500 block uppercase">Border Thickness</span>
                  <select
                    value={design.borderWidth || "4px"}
                    onChange={(e) => onUpdateSetting("borderWidth", e.target.value)}
                    className="w-full text-[11px] font-semibold p-1.5 bg-slate-900 border border-slate-800 text-slate-200 rounded-lg cursor-pointer"
                  >
                    {borderWidths.map((item) => (
                      <option key={item.value} value={item.value}>{item.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-500 block uppercase">Border Roundedness</span>
                  <select
                    value={design.borderRadius || "2xl"}
                    onChange={(e) => onUpdateSetting("borderRadius", e.target.value)}
                    className="w-full text-[11px] font-semibold p-1.5 bg-slate-900 border border-slate-800 text-slate-200 rounded-lg cursor-pointer"
                  >
                    {borderRadiusOptions.map((item) => (
                      <option key={item.value} value={item.value}>{item.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-500 block uppercase">Border Accent Color</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={design.borderColor || "#ffffff20"}
                    onChange={(e) => onUpdateSetting("borderColor", e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={design.borderColor || "#ffffff20"}
                    onChange={(e) => onUpdateSetting("borderColor", e.target.value)}
                    className="bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-mono uppercase p-1 rounded flex-1 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "text" && (
          <div className="space-y-4">
            {/* Storefront Text Settings */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Boutique Store Name</label>
              <input
                type="text"
                value={selectedStore.name}
                onChange={(e) => onUpdateSetting("name", e.target.value, true)}
                className="w-full text-xs font-semibold p-2.5 bg-slate-950 border border-slate-800 text-slate-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="Store Name"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block font-sans">Boutique Short Description / Bio</label>
              <textarea
                value={selectedStore.description}
                onChange={(e) => onUpdateSetting("description", e.target.value, true)}
                rows={3}
                className="w-full text-xs font-semibold p-2.5 bg-slate-950 border border-slate-800 text-slate-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                placeholder="Write a charming store description..."
              />
            </div>

            {/* Announcement Banner */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-left">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Megaphone className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                  Announcement Banner
                </span>
                <SkeuomorphicSwitch
                  checked={selectedStore.announcement?.enabled !== false}
                  onChange={(val) => {
                    const currentAnn = selectedStore.announcement || { text: "", bgColor: "#eab308", textColor: "#020617", expiresAt: "" };
                    onUpdateSetting("announcement", { ...currentAnn, enabled: val }, true);
                  }}
                />
              </div>

              <div className="space-y-1.5">
                <span className="text-[9px] font-bold text-slate-500 block uppercase">Banner Announcement Text</span>
                <textarea
                  value={selectedStore.announcement?.text || ""}
                  onChange={(e) => {
                    const currentAnn = selectedStore.announcement || { enabled: true, bgColor: "#eab308", textColor: "#020617", expiresAt: "" };
                    onUpdateSetting("announcement", { ...currentAnn, text: e.target.value }, true);
                  }}
                  rows={2}
                  className="w-full text-[11px] font-semibold p-2 bg-slate-900 border border-slate-800 text-slate-100 rounded-lg resize-none focus:outline-none"
                  placeholder="E.g., Free delivery to Algiers this weekend! 🎉"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-500 block uppercase">Banner Background</span>
                  <input
                    type="color"
                    value={selectedStore.announcement?.bgColor || "#eab308"}
                    onChange={(e) => {
                      const currentAnn = selectedStore.announcement || { active: true, text: "", textColor: "#020617" };
                      onUpdateSetting("announcement", { ...currentAnn, bgColor: e.target.value }, true);
                    }}
                    className="w-full h-8 rounded-lg cursor-pointer bg-transparent border border-slate-800 p-1"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-500 block uppercase">Banner Text Color</span>
                  <input
                    type="color"
                    value={selectedStore.announcement?.textColor || "#020617"}
                    onChange={(e) => {
                      const currentAnn = selectedStore.announcement || { active: true, text: "", bgColor: "#eab308" };
                      onUpdateSetting("announcement", { ...currentAnn, textColor: e.target.value }, true);
                    }}
                    className="w-full h-8 rounded-lg cursor-pointer bg-transparent border border-slate-800 p-1"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Persistence Action Bar Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3 shrink-0">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700/50 text-slate-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{currentLanguage === "ar" ? "تراجع" : currentLanguage === "fr" ? "Annuler" : "Cancel"}</span>
        </button>

        <button
          onClick={onSave}
          className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 border border-emerald-500/50 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{currentLanguage === "ar" ? "حفظ التعديلات" : currentLanguage === "fr" ? "Enregistrer" : "Save Changes"}</span>
        </button>
      </div>
    </div>
  );
}
