import React, { useState } from "react";
import { X, Sparkles, SlidersHorizontal, Check, Palette, Type, RefreshCw, Eye, Pipette } from "lucide-react";
import { MerchantStore } from "../types";

interface AddStoryModalProps {
  addStoryModalStore: MerchantStore;
  currentLanguage: string;
  currentSlideColor: string;
  onClose: () => void;
  onSave: (newSlide: {
    id: string;
    type: "image" | "video" | "text";
    url: string;
    text: string;
    bgColor?: string;
    textColor?: string;
    productId?: string;
    productName?: string;
    hashtags?: string;
    discountPercent?: number;
  }) => void;
  modalError: string;
  setModalError: (err: string) => void;
}

export default function AddStoryModal({
  addStoryModalStore,
  currentLanguage,
  currentSlideColor,
  onClose,
  onSave,
  modalError,
  setModalError,
}: AddStoryModalProps) {
  const [newStoryType, setNewStoryType] = useState<"image" | "video" | "text">("image");
  const [newStoryText, setNewStoryText] = useState("");
  const [newStoryUrl, setNewStoryUrl] = useState("");
  const [selectedProdLink, setSelectedProdLink] = useState("");
  const [newStoryHashtags, setNewStoryHashtags] = useState("");
  const [newStoryDiscount, setNewStoryDiscount] = useState(0);

  // Preset social background color gradients
  const GRADIENT_PRESETS = [
    { name: "Neon Twilight", bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", text: "#ffffff" },
    { name: "Sunset Spark", bg: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", text: "#ffffff" },
    { name: "Ocean Deep", bg: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", text: "#ffffff" },
    { name: "Forest Moss", bg: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)", text: "#ffffff" },
    { name: "Midnight Charcoal", bg: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", text: "#f9fafb" }
  ];

  // Preset solid background colors
  const SOLID_BG_PRESETS = [
    { name: "Indigo", color: "#4f46e5" },
    { name: "Rose", color: "#e11d48" },
    { name: "Sky", color: "#0284c7" },
    { name: "Emerald", color: "#059669" },
    { name: "Amber", color: "#d97706" },
    { name: "Purple", color: "#7c3aed" },
    { name: "Midnight", color: "#0f172a" },
    { name: "Cloud White", color: "#f8fafc" },
  ];

  // Preset text colors
  const TEXT_COLOR_PRESETS = [
    { name: "White", color: "#ffffff" },
    { name: "Dark", color: "#0f172a" },
    { name: "Gold", color: "#facc15" },
    { name: "Sky", color: "#38bdf8" },
    { name: "Mint", color: "#4ade80" },
    { name: "Coral", color: "#fb7185" },
  ];

  // Color picker states for 'Text' type slides
  const [activeBgType, setActiveBgType] = useState<"preset" | "custom">("preset");
  const [selectedBgIndex, setSelectedBgIndex] = useState(0);
  const [customBgColor, setCustomBgColor] = useState("#6366f1");
  const [customTextColor, setCustomTextColor] = useState("#ffffff");

  const effectiveBgColor = activeBgType === "preset" ? GRADIENT_PRESETS[selectedBgIndex].bg : customBgColor;
  const effectiveTextColor = customTextColor;

  const handleAutoGenerateCaption = () => {
    const linkedProduct = addStoryModalStore.products.find(p => p.id === selectedProdLink);
    if (linkedProduct) {
      const templates = [
        `🔥 OFFRE EXCLUSIVE 🔥 Retrouvez notre incontournable "${linkedProduct.name}" au meilleur prix ! Ne ratez pas cette occasion unique. Shop now ! 👇✨`,
        `✨ Coup de cœur de la semaine ✨ Craquez pour le superbe "${linkedProduct.name}" ! Stock très limité, faites-vous plaisir avant la rupture de stock. 🛍️💖`,
        `Sélection Gold Star ⭐ Sublimez votre collection avec "${linkedProduct.name}" ! Matériaux de qualité supérieure et finition irréprochable. 🇩🇿👑`
      ];
      const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
      setNewStoryText(randomTemplate);
      if (!newStoryHashtags) {
        setNewStoryHashtags("#chic #boutique #algerie #selection #promo");
      }
    } else {
      setNewStoryText("✨ Découvrez les nouveautés de notre boutique d'exception ! Les dernières tendances exclusives sont enfin disponibles. 🛍️🔥");
      if (!newStoryHashtags) {
        setNewStoryHashtags("#algerie #mode #nouveautes #soldes");
      }
    }
  };

  const handleSaveNewStory = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newStoryText.trim() && newStoryType === "text") return;
    
    let imageUrl = newStoryUrl.trim();
    const linkedProduct = addStoryModalStore.products.find(p => p.id === selectedProdLink);
    
    if (newStoryType === "image") {
      if (!imageUrl && linkedProduct) {
        imageUrl = linkedProduct.imageUrl;
      }
      if (!imageUrl) {
        imageUrl = "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80";
      }
    } else if (newStoryType === "video") {
      if (!imageUrl) {
        imageUrl = "https://assets.mixkit.co/videos/preview/mixkit-fashion-woman-with-silver-glitter-makeup-40156-large.mp4";
      }
    }

    onSave({
      id: `story_${Date.now()}`,
      type: newStoryType,
      url: imageUrl,
      text: newStoryText.trim() || (linkedProduct ? `Découvrez l'article élégant : ${linkedProduct.name}` : ""),
      bgColor: newStoryType === "text" ? effectiveBgColor : undefined,
      textColor: newStoryType === "text" ? effectiveTextColor : undefined,
      productId: selectedProdLink || undefined,
      productName: linkedProduct ? linkedProduct.name : undefined,
      hashtags: newStoryHashtags.trim() || undefined,
      discountPercent: selectedProdLink && newStoryDiscount > 0 ? newStoryDiscount : undefined
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in font-sans">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative animate-scale-up text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 p-1.5 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-indigo-600 animate-spin [animation-duration:12s]" />
          <h3 className="text-base font-black text-slate-900 font-sans uppercase tracking-tight">
            {currentLanguage === "ar" ? "إضافة قصة جديدة للجمهور" : "Add Live Slide to Your Story"}
          </h3>
        </div>

        <form onSubmit={handleSaveNewStory} className="space-y-4 text-xs font-sans">
          {/* Story Slide Format Select */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-black text-slate-450 tracking-wider font-mono">Format Slide :</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setNewStoryType("image")}
                className={`py-2 p-1.5 rounded-xl border text-[11px] font-bold flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer ${
                  newStoryType === "image"
                    ? "bg-indigo-50 border-indigo-200 text-indigo-700 font-black"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                📸 Image
              </button>
              <button
                type="button"
                onClick={() => setNewStoryType("video")}
                className={`py-2 p-1.5 rounded-xl border text-[11px] font-bold flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer ${
                  newStoryType === "video"
                    ? "bg-indigo-50 border-indigo-200 text-indigo-700 font-black"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                🎥 Vidéo Sound
              </button>
              <button
                type="button"
                onClick={() => setNewStoryType("text")}
                className={`py-2 p-1.5 rounded-xl border text-[11px] font-bold flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer ${
                  newStoryType === "text"
                    ? "bg-indigo-50 border-indigo-200 text-indigo-700 font-black"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                ✍️ Gradient
              </button>
            </div>
          </div>

          {/* URL input if Image format */}
          {newStoryType === "image" && (
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-black text-slate-450 tracking-wider font-mono">Image URL (Facultatif si lié à un produit) :</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/... ou laissez vide pour utiliser l'image d'un produit"
                value={newStoryUrl}
                onChange={(e) => setNewStoryUrl(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans font-medium text-slate-800"
              />
            </div>
          )}

          {/* URL input if Video format */}
          {newStoryType === "video" && (
            <div className="space-y-1.5 bg-indigo-50/20 p-3 rounded-2xl border border-indigo-100/50">
              <label className="text-[10px] uppercase font-black text-slate-450 tracking-wider font-mono flex items-center gap-1">
                <span>🎥</span> Vidéo MP4 URL (avec audio/sound) :
              </label>
              <input
                type="url"
                required
                placeholder="https://example.com/video.mp4"
                value={newStoryUrl}
                onChange={(e) => setNewStoryUrl(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans font-medium text-slate-800"
              />
              <p className="text-[10px] text-neutral-500 mt-1">
                Saisissez l'adresse URL d'un fichier vidéo MP4 public, ou cliquez sur l'un des exemples fantastiques ci-dessous :
              </p>
              <div className="grid grid-cols-1 gap-1.5 mt-2 font-mono text-[10px] text-indigo-600 bg-white/75 p-2 rounded-xl border border-indigo-100">
                <button
                  type="button"
                  className="text-left hover:underline text-indigo-600 cursor-pointer block truncate"
                  onClick={() => setNewStoryUrl("https://assets.mixkit.co/videos/preview/mixkit-fashion-woman-with-silver-glitter-makeup-40156-large.mp4")}
                >
                  👉 Sparkly Chic makeup clip
                </button>
                <button
                  type="button"
                  className="text-left hover:underline text-indigo-600 cursor-pointer block truncate"
                  onClick={() => setNewStoryUrl("https://assets.mixkit.co/videos/preview/mixkit-open-box-of-a-new-designer-watch-41133-large.mp4")}
                >
                  👉 Unboxing fancy luxury golden watch
                </button>
                <button
                  type="button"
                  className="text-left hover:underline text-indigo-600 cursor-pointer block truncate"
                  onClick={() => setNewStoryUrl("https://assets.mixkit.co/videos/preview/mixkit-holding-a-cup-of-hot-coffee-mugs-on-a-wooden-table-42352-large.mp4")}
                >
                  👉 Cosy café artisan display clip
                </button>
              </div>
            </div>
          )}

          {/* Color Picker & Styling Studio for Text Format */}
          {newStoryType === "text" && (
            <div className="space-y-3.5 p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80">
              
              {/* 1. Background Color & Gradient Controls */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] uppercase font-black text-slate-500 tracking-wider font-mono flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{currentLanguage === "ar" ? "لون وخلفية القصة :" : "Story Background Color :"}</span>
                  </label>
                  <span className="text-[9px] font-mono text-slate-450 font-bold">
                    {activeBgType === "preset" ? GRADIENT_PRESETS[selectedBgIndex].name : customBgColor.toUpperCase()}
                  </span>
                </div>

                {/* Preset Gradients */}
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 font-mono block">
                    {currentLanguage === "ar" ? "تدرجات لونية جاهزة (Instagram) :" : "Gradient Palettes :"}
                  </span>
                  <div className="grid grid-cols-5 gap-1.5">
                    {GRADIENT_PRESETS.map((preset, idx) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => {
                          setActiveBgType("preset");
                          setSelectedBgIndex(idx);
                          setCustomTextColor(preset.text);
                        }}
                        title={preset.name}
                        className={`h-7 rounded-lg border-2 transition-all cursor-pointer relative flex items-center justify-center ${
                          activeBgType === "preset" && selectedBgIndex === idx
                            ? "border-indigo-600 scale-105 shadow-xs ring-2 ring-indigo-500/20"
                            : "border-transparent hover:scale-102 hover:border-slate-300"
                        }`}
                        style={{ background: preset.bg }}
                      >
                        {activeBgType === "preset" && selectedBgIndex === idx && (
                          <Check className="w-3 h-3 text-white drop-shadow-md stroke-[3]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Solid Colors & Custom Color Picker */}
                <div className="space-y-1 pt-1">
                  <span className="text-[9px] font-bold text-slate-400 font-mono block">
                    {currentLanguage === "ar" ? "ألوان أحادية ومنتقي الألوان :" : "Solid Swatches & Custom Color Picker :"}
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {SOLID_BG_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => {
                          setActiveBgType("custom");
                          setCustomBgColor(preset.color);
                          if (preset.color === "#f8fafc") {
                            setCustomTextColor("#0f172a");
                          }
                        }}
                        title={preset.name}
                        className={`w-6 h-6 rounded-md border transition-all cursor-pointer flex items-center justify-center ${
                          activeBgType === "custom" && customBgColor.toLowerCase() === preset.color.toLowerCase()
                            ? "border-indigo-600 ring-2 ring-indigo-500/30 scale-110 shadow-xs"
                            : "border-slate-200 hover:scale-105 hover:border-slate-400"
                        }`}
                        style={{ backgroundColor: preset.color }}
                      >
                        {activeBgType === "custom" && customBgColor.toLowerCase() === preset.color.toLowerCase() && (
                          <Check className={`w-2.5 h-2.5 ${preset.color === "#f8fafc" ? "text-slate-900" : "text-white"} stroke-[3]`} />
                        )}
                      </button>
                    ))}

                    {/* Native Background Color Picker & Hex Input */}
                    <div className="flex items-center gap-1.5 ml-auto bg-white p-1 rounded-lg border border-slate-200 shadow-3xs">
                      <div className="relative flex items-center group cursor-pointer" title="Open Custom Color Picker">
                        <input
                          type="color"
                          id="story-bg-color-picker"
                          value={customBgColor.startsWith("#") ? customBgColor : "#6366f1"}
                          onChange={(e) => {
                            setActiveBgType("custom");
                            setCustomBgColor(e.target.value);
                          }}
                          className="w-6 h-6 rounded border-0 p-0 cursor-pointer overflow-hidden bg-transparent"
                        />
                      </div>
                      <input
                        type="text"
                        value={activeBgType === "custom" ? customBgColor : "GRADIENT"}
                        onChange={(e) => {
                          const val = e.target.value;
                          setActiveBgType("custom");
                          setCustomBgColor(val.startsWith("#") ? val : `#${val}`);
                        }}
                        placeholder="#4F46E5"
                        maxLength={9}
                        className="w-20 text-[10px] font-mono font-bold uppercase p-0.5 bg-transparent border-0 focus:outline-none text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Text Color Controls */}
              <div className="space-y-1.5 pt-2 border-t border-slate-200/80">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] uppercase font-black text-slate-500 tracking-wider font-mono flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{currentLanguage === "ar" ? "لون النص والكتابة :" : "Story Text Color :"}</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setCustomTextColor(prev => prev.toLowerCase() === "#ffffff" ? "#0f172a" : "#ffffff")}
                    className="text-[9px] font-bold text-slate-500 hover:text-indigo-600 bg-white hover:bg-indigo-50 px-2 py-0.5 rounded-md border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                    title="Toggle high contrast text color"
                  >
                    <RefreshCw className="w-2.5 h-2.5" />
                    <span>{customTextColor.toLowerCase() === "#ffffff" ? "Dark Text" : "White Text"}</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {TEXT_COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setCustomTextColor(preset.color)}
                      title={preset.name}
                      className={`w-6 h-6 rounded-md border transition-all cursor-pointer flex items-center justify-center ${
                        customTextColor.toLowerCase() === preset.color.toLowerCase()
                          ? "border-indigo-600 ring-2 ring-indigo-500/30 scale-110 shadow-xs"
                          : "border-slate-200 hover:scale-105 hover:border-slate-400"
                      }`}
                      style={{ backgroundColor: preset.color }}
                    >
                      {customTextColor.toLowerCase() === preset.color.toLowerCase() && (
                        <Check className={`w-2.5 h-2.5 ${preset.color === "#ffffff" || preset.color === "#facc15" || preset.color === "#38bdf8" || preset.color === "#4ade80" || preset.color === "#fb7185" ? "text-slate-900" : "text-white"} stroke-[3]`} />
                      )}
                    </button>
                  ))}

                  {/* Native Text Color Picker & Hex Input */}
                  <div className="flex items-center gap-1.5 ml-auto bg-white p-1 rounded-lg border border-slate-200 shadow-3xs">
                    <div className="relative flex items-center group cursor-pointer" title="Open Custom Text Color Picker">
                      <input
                        type="color"
                        id="story-text-color-picker"
                        value={customTextColor.startsWith("#") ? customTextColor : "#ffffff"}
                        onChange={(e) => setCustomTextColor(e.target.value)}
                        className="w-6 h-6 rounded border-0 p-0 cursor-pointer overflow-hidden bg-transparent"
                      />
                    </div>
                    <input
                      type="text"
                      value={customTextColor}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCustomTextColor(val.startsWith("#") ? val : `#${val}`);
                      }}
                      placeholder="#FFFFFF"
                      maxLength={9}
                      className="w-20 text-[10px] font-mono font-bold uppercase p-0.5 bg-transparent border-0 focus:outline-none text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Real-Time Story Slide Live Preview Card */}
              <div className="pt-2 border-t border-slate-200/80">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] uppercase font-black text-slate-500 tracking-wider font-mono flex items-center gap-1">
                    <Eye className="w-3 h-3 text-indigo-500" />
                    <span>{currentLanguage === "ar" ? "معاينة حية لشريحة القصة :" : "Live Story Slide Preview :"}</span>
                  </span>
                  <span className="text-[9px] font-mono font-bold text-slate-400">9:16 Preview</span>
                </div>
                <div 
                  className="w-full h-36 rounded-xl flex flex-col items-center justify-center p-4 text-center shadow-inner relative overflow-hidden transition-all duration-300 border border-slate-200/50"
                  style={{ background: effectiveBgColor }}
                >
                  {/* Store mini header */}
                  <div className="absolute top-2 left-2.5 flex items-center gap-1.5 opacity-90 select-none">
                    <div className="w-4 h-4 rounded-full overflow-hidden bg-white/20 border border-white/30 shrink-0">
                      <img 
                        src={addStoryModalStore.logo || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150"} 
                        alt="store" 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <span className="text-[9px] font-bold text-white drop-shadow-xs truncate max-w-[140px]">
                      {addStoryModalStore.name}
                    </span>
                  </div>

                  {/* Centered text in selected colors */}
                  <p 
                    className="text-[13px] sm:text-[14px] font-black leading-snug tracking-tight font-sans drop-shadow-sm px-3 max-w-sm whitespace-pre-wrap break-words transition-colors duration-200"
                    style={{ color: effectiveTextColor }}
                  >
                    {newStoryText.trim() || (currentLanguage === "ar" ? "أدخل نص إعلانك هنا ليظهر مباشرة..." : "Type your message below to preview live...")}
                  </p>

                  {/* Swipe-up link badge */}
                  {selectedProdLink && (
                    <div className="absolute bottom-2 px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-xs text-[8.5px] font-black text-slate-900 shadow-xs flex items-center gap-1">
                      <span>🛍️</span>
                      <span className="truncate max-w-[130px]">
                        {addStoryModalStore.products.find(p => p.id === selectedProdLink)?.name || "Produit"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* Error Banner if validation fails */}
          {modalError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs px-3.5 py-3 rounded-2xl font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping shrink-0" />
              <p>{modalError}</p>
            </div>
          )}

          {/* Main Message / Caption text input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] uppercase font-black text-slate-450 tracking-wider font-mono">
                {newStoryType === "text" ? "Contenu de la Story (Texte Centré) :" : "Légende / Message d'ambiance :"}
              </label>
              <button
                type="button"
                onClick={handleAutoGenerateCaption}
                className="text-[9.5px] font-black text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded-lg border border-indigo-150 transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>✨</span> {currentLanguage === "ar" ? "توليد نص تلقائي" : "Auto-Generate Caption"}
              </button>
            </div>
            <textarea
              rows={newStoryType === "text" ? 3 : 2}
              required={newStoryType === "text"}
              placeholder={newStoryType === "text" ? "Saisissez votre message d'annonce dynamique..." : "Ex: Stock très limité! Profitez de nos promotions de la semaine."}
              value={newStoryText}
              onChange={(e) => setNewStoryText(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans resize-none font-semibold text-slate-800"
              maxLength={150}
            />
            <div className="text-[9px] text-right font-mono text-slate-400 font-semibold">
              {newStoryText.length} / 150 caractères
            </div>
          </div>

          {/* Link to a Product (Interactivity Hook) */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3 text-emerald-600" />
              <label className="text-[10px] uppercase font-black text-slate-450 tracking-wider font-mono">
                Associer à un Produit de la boutique (Swipe Up/Shop) :
              </label>
            </div>
            <select
              value={selectedProdLink}
              onChange={(e) => {
                const pid = e.target.value;
                setSelectedProdLink(pid);
                // Autofill description slightly
                const found = addStoryModalStore.products.find(p => p.id === pid);
                if (found) {
                  setNewStoryText(`Découvrez l'article élégant : ${found.name} ! 🔥🛒`);
                  setNewStoryHashtags("#algerie #soldes #selection");
                }
              }}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500 font-sans font-semibold text-slate-800"
            >
              <option value="">-- Aucun lien (Story ordinaire) --</option>
              {addStoryModalStore.products.map(p => (
                <option key={p.id} value={p.id}>
                  🛒 {p.name} ({p.price.toLocaleString()} DZD)
                </option>
              ))}
            </select>
            <p className="text-[9.5px] text-slate-400 font-medium">
              Les clients pourront glisser ou cliquer sur "Swipe Up" pour acheter instantanément cet article !
            </p>
          </div>

          {/* Specific Discount Percentage Input */}
          {selectedProdLink && (
            <div className="space-y-1.5 bg-rose-50/70 p-3.5 rounded-2xl border border-rose-100">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-black tracking-wide text-rose-800 font-mono">
                  🏷️ Remise promotionnelle exclusive :
                </span>
                <span className="text-xs font-black text-rose-700 bg-rose-100 px-2 py-0.5 rounded-lg border border-rose-200 font-mono">
                  {newStoryDiscount}% OFF
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="90"
                  step="5"
                  value={newStoryDiscount}
                  onChange={(e) => setNewStoryDiscount(parseInt(e.target.value, 10))}
                  className="w-full accent-rose-600 h-1.5 bg-rose-100 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          )}

          {/*/ Hashtags Input for Instagram mimic */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-black text-slate-450 tracking-wider font-mono">
              Hashtags Instagram (séparés par un espace) :
            </label>
            <input
              type="text"
              placeholder="Ex: #algerie #mode #promotion #shopping"
              value={newStoryHashtags}
              onChange={(e) => setNewStoryHashtags(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans font-semibold text-slate-800"
            />
          </div>

          {/* Form Actions */}
          <div className="flex gap-2.5 pt-2 border-t border-slate-100">
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl text-white font-black hover:opacity-90 transition-all cursor-pointer shadow-sm font-sans text-xs flex items-center justify-center gap-1.5"
              style={{ backgroundColor: currentSlideColor }}
            >
              <Check className="w-3.5 h-3.5" />
              <span>Mettre en ligne sur ma Story</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold transition-all cursor-pointer text-xs"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
