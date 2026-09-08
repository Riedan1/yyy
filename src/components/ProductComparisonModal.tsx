import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Product, MerchantStore } from "../types";
import { X, ShoppingCart, Trash2, Star, Check, AlertCircle, Bookmark, Layers, Sliders, ChevronDown, ChevronUp, Pencil } from "lucide-react";
import { getOptimizedImageUrl } from "../utils/imageOptimizer";

interface ProductComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  comparedProducts: Product[];
  stores: MerchantStore[];
  wishlist: string[];
  onToggleCompare: (product: Product) => void;
  onRemove: (product: Product) => void;
  onAddToCart: (product: Product, store: MerchantStore, quantity: number) => void;
  currentLanguage: "ar" | "en" | "fr";
  comparisonListName?: string;
  onRenameComparisonList?: (newName: string) => void;
}

export default function ProductComparisonModal({
  isOpen,
  onClose,
  comparedProducts,
  stores,
  wishlist = [],
  onToggleCompare,
  onRemove,
  onAddToCart,
  currentLanguage,
  comparisonListName = "",
  onRenameComparisonList
}: ProductComparisonModalProps) {
  
  const [isPickerExpandedMobile, setIsPickerExpandedMobile] = useState(comparedProducts.length === 0);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(comparisonListName);

  // Sync internal tempName state when prop updates
  useEffect(() => {
    setTempName(comparisonListName);
  }, [comparisonListName, isOpen]);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (onRenameComparisonList) {
      onRenameComparisonList(tempName.trim());
    }
    setIsEditingName(false);
  };

  if (!isOpen) return null;

  const t = {
    title: {
      ar: "مقارنة المنتجات",
      en: "Product Comparison",
      fr: "Comparaison de Produits"
    },
    subtitle: {
      ar: "قارن الميزات والأسعار والمواصفات جنبًا إلى جنب",
      en: "Compare features, prices, and specifications side-by-side",
      fr: "Comparez les fonctionnalités, les prix et les spécifications côte à côte"
    },
    remove: {
      ar: "إزالة",
      en: "Remove",
      fr: "Retirer"
    },
    price: {
      ar: "السعر",
      en: "Price",
      fr: "Prix"
    },
    store: {
      ar: "المتجر",
      en: "Store",
      fr: "Boutique"
    },
    rating: {
      ar: "التقييم",
      en: "Rating",
      fr: "Évaluation"
    },
    category: {
      ar: "الفئة",
      en: "Category",
      fr: "Catégorie"
    },
    availability: {
      ar: "التوفر في المخزن",
      en: "Availability",
      fr: "Disponibilité"
    },
    inStock: {
      ar: "متوفر ({count} قطع)",
      en: "In Stock ({count} left)",
      fr: "En Stock ({count} restants)"
    },
    outOfStock: {
      ar: "نفذت الكمية",
      en: "Out of Stock",
      fr: "Rupture de stock"
    },
    weight: {
      ar: "الوزن",
      en: "Weight",
      fr: "Poids"
    },
    dimensions: {
      ar: "الأبعاد",
      en: "Dimensions",
      fr: "Dimensions"
    },
    colors: {
      ar: "الألوان المتاحة",
      en: "Available Colors",
      fr: "Couleurs disponibles"
    },
    sizes: {
      ar: "المقاسات المتاحة",
      en: "Available Sizes",
      fr: "Tailles disponibles"
    },
    addToCart: {
      ar: "إضافة إلى السلة",
      en: "Add to Cart",
      fr: "Ajouter au panier"
    },
    specifications: {
      ar: "المواصفات",
      en: "Specifications",
      fr: "Spécifications"
    },
    noSpecs: {
      ar: "لا توجد مواصفات محددة",
      en: "No specifications specified",
      fr: "Aucune spécification spécifiée"
    },
    emptyTitle: {
      ar: "لا توجد منتجات للمقارنة",
      en: "No products selected",
      fr: "Aucun produit sélectionné"
    },
    emptyDesc: {
      ar: "اختر ما يصل إلى 3 منتجات من قائمة رغباتك لمقارنتها جنبًا إلى جنب.",
      en: "Select up to 3 products from your wishlist to compare them side-by-side.",
      fr: "Sélectionnez jusqu'à 3 produits de votre liste de favoris pour les comparer."
    },
    close: {
      ar: "إغلاق",
      en: "Close",
      fr: "Fermer"
    },
    manageFavs: {
      ar: "إدارة قائمة المقارنة",
      en: "Manage Comparison List",
      fr: "Gérer la liste de comparaison"
    },
    favsCount: {
      ar: "المفضلة لديك ({count})",
      en: "Your Favorites ({count})",
      fr: "Vos Favoris ({count})"
    },
    emptyFavsTitle: {
      ar: "لا توجد منتجات مفضلة",
      en: "No favorites saved yet",
      fr: "Aucun favori enregistré"
    },
    emptyFavsDesc: {
      ar: "تصفح المتاجر واضغط على أيقونة النجمة لحفظ المنتجات هنا.",
      en: "Browse stores and tap the star bookmark ribbon to save products here.",
      fr: "Parcourez les boutiques et cliquez sur le ruban d'étoiles pour enregistrer des produits ici."
    },
    maxNote: {
      ar: "الحد الأقصى 3 منتجات للمقارنة",
      en: "Max 3 products selected",
      fr: "Max 3 produits sélectionnés"
    }
  };

  const isRTL = currentLanguage === "ar";

  const getStoreForProduct = (product: Product) => {
    return stores.find((s) => s.id === product.storeId);
  };

  const getEffectivePrice = (product: Product) => {
    if (product.discountEnabled && product.discountPercent) {
      return product.price * (1 - product.discountPercent / 100);
    }
    return product.price;
  };

  // Find all unique specification keys across all selected products
  const allSpecKeys = Array.from(
    new Set(
      comparedProducts.flatMap((p) => p.specifications?.map((s) => s.key) || [])
    )
  );

  // Gather all unique products from all stores
  const allProducts = Array.from(
    new Map(
      stores.flatMap((s) => s.products || []).map((p) => [p.id || p.name, p])
    ).values()
  );

  // Filter only those in the wishlist
  const wishlistProducts = allProducts.filter((product) =>
    wishlist.includes(product.id || "") || wishlist.includes(product.name || "")
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-110 flex items-center justify-center p-3 sm:p-4 overflow-hidden font-sans">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className="relative bg-white rounded-3xl w-full max-w-6xl h-[88vh] max-h-[88vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden z-10"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-slate-150 bg-white flex items-center justify-between shrink-0">
            <div className={isRTL ? "text-right" : "text-left"}>
              <div className="flex items-center gap-2 flex-wrap">
                <span>⚖️</span>
                {isEditingName ? (
                  <form onSubmit={handleSaveName} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      placeholder={t.title[currentLanguage] || t.title.en}
                      maxLength={30}
                      autoFocus
                      className="text-sm sm:text-base font-black text-slate-900 border-b-2 border-amber-500 outline-none px-1 py-0.5"
                    />
                    <button
                      type="submit"
                      className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all cursor-pointer"
                      title={currentLanguage === "ar" ? "حفظ" : "Save"}
                    >
                      <Check className="w-4 h-4 stroke-[3px]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingName(false);
                        setTempName(comparisonListName);
                      }}
                      className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                      title={currentLanguage === "ar" ? "إلغاء" : "Cancel"}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center gap-2 group/title">
                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      {comparisonListName || (t.title[currentLanguage] || t.title.en)}
                    </h3>
                    <button
                      onClick={() => {
                        setTempName(comparisonListName || t.title[currentLanguage] || t.title.en);
                        setIsEditingName(true);
                      }}
                      className="p-1 text-slate-400 hover:text-amber-500 rounded-lg hover:bg-slate-50 transition-all cursor-pointer"
                      title={currentLanguage === "ar" ? "تعديل الاسم" : "Rename comparison list"}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-bold ml-2">
                  {comparedProducts.length}/3
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
                {t.subtitle[currentLanguage] || t.subtitle.en}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-all cursor-pointer border border-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Dual-column body: Sidebar on desktop, collapsible header on mobile */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-white">
            
            {/* Sidebar List Selector (Manage Comparison Items) */}
            <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-150 flex flex-col bg-slate-50/80 shrink-0">
              
              {/* Mobile Toggle Trigger */}
              <button 
                onClick={() => setIsPickerExpandedMobile(!isPickerExpandedMobile)}
                className="md:hidden w-full px-5 py-3.5 flex items-center justify-between border-b border-slate-150 bg-white text-slate-800"
              >
                <div className="flex items-center gap-2.5 text-xs font-black uppercase tracking-wider">
                  <Bookmark className="w-4 h-4 text-amber-500 fill-amber-400" />
                  <span>{t.manageFavs[currentLanguage] || t.manageFavs.en}</span>
                  <span className="text-[10px] bg-slate-150 text-slate-600 px-2 py-0.5 rounded-full font-bold ml-1">
                    {comparedProducts.length}/3
                  </span>
                </div>
                {isPickerExpandedMobile ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {/* List Content */}
              <div className={`flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/50 ${isPickerExpandedMobile ? "block" : "hidden md:block"}`}>
                <div className="hidden md:flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-750 uppercase tracking-wider flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0" />
                    <span>{t.favsCount[currentLanguage].replace("{count}", String(wishlistProducts.length)) || t.favsCount.en.replace("{count}", String(wishlistProducts.length))}</span>
                  </h4>
                  {comparedProducts.length === 3 && (
                    <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/50">
                      {t.maxNote[currentLanguage] || t.maxNote.en}
                    </span>
                  )}
                </div>

                {wishlistProducts.length === 0 ? (
                  <div className="text-center py-8 px-4 border border-dashed border-slate-200 rounded-2xl bg-white">
                    <span className="text-2xl block mb-2">⭐</span>
                    <h5 className="text-[11px] font-bold text-slate-700">
                      {t.emptyFavsTitle[currentLanguage] || t.emptyFavsTitle.en}
                    </h5>
                    <p className="text-[10px] text-slate-450 mt-1.5 leading-relaxed">
                      {t.emptyFavsDesc[currentLanguage] || t.emptyFavsDesc.en}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[220px] md:max-h-none overflow-y-auto">
                    {wishlistProducts.map((product) => {
                      const isCompared = comparedProducts.some((p) => p.id === product.id);
                      const store = getStoreForProduct(product);
                      const displayPrice = getEffectivePrice(product);

                      return (
                        <div
                          key={product.id || product.name}
                          onClick={() => onToggleCompare(product)}
                          className={`group flex items-center gap-3 p-2.5 rounded-2xl border transition-all cursor-pointer relative ${
                            isCompared
                              ? "bg-amber-50/60 border-amber-400/80 shadow-2xs"
                              : "bg-white border-slate-100 hover:border-slate-200 hover:shadow-3xs"
                          }`}
                        >
                          {/* Image Thumbnail */}
                          <div className="w-11 h-11 rounded-lg bg-slate-50 flex items-center justify-center p-1 border border-slate-100 shrink-0">
                            <img
                              src={getOptimizedImageUrl(product.imageUrl, true)}
                              alt=""
                              className="max-h-full max-w-full object-contain"
                              referrerPolicy="no-referrer"
                            />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0 text-left">
                            <h5 className="text-[11.5px] font-extrabold text-slate-800 leading-tight truncate">
                              {product.name}
                            </h5>
                            <p className="text-[10px] text-slate-400 mt-0.5 truncate flex items-center gap-1">
                              {store && <span className="underline">{store.name}</span>}
                              <span>•</span>
                              <span className="font-bold text-emerald-600 font-mono">
                                {displayPrice.toLocaleString()} DA
                              </span>
                            </p>
                          </div>

                          {/* Checkbox Trigger */}
                          <div className="shrink-0 flex items-center justify-center mr-1">
                            <div className={`w-4.5 h-4.5 rounded-md border flex items-center justify-center transition-all ${
                              isCompared
                                ? "bg-amber-500 border-amber-500 text-white scale-110 shadow-3xs"
                                : "border-slate-200 bg-white group-hover:border-slate-300"
                            }`}>
                              {isCompared && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel: Side-by-Side Comparison Tables */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-slate-50/20 scrollbar-thin">
              {comparedProducts.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <span className="text-3xl">⚖️</span>
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-850">
                    {t.emptyTitle[currentLanguage] || t.emptyTitle.en}
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mt-2 leading-relaxed">
                    {t.emptyDesc[currentLanguage] || t.emptyDesc.en}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  
                  {/* Grid Layout of compared products */}
                  <div className={`grid gap-4 ${
                    comparedProducts.length === 1 ? "grid-cols-1" :
                    comparedProducts.length === 2 ? "grid-cols-2" : "grid-cols-3"
                  }`}>
                    {comparedProducts.map((product) => {
                      const store = getStoreForProduct(product);
                      const effPrice = getEffectivePrice(product);
                      const hasDiscount = product.discountEnabled && product.discountPercent;

                      return (
                        <div
                          key={product.id || product.name}
                          className="bg-white border border-slate-150 rounded-2xl p-4 flex flex-col justify-between text-left relative overflow-hidden group hover:border-slate-300 hover:shadow-2xs transition-all animate-fade-in"
                        >
                          {/* Remove Button */}
                          <button
                            onClick={() => onRemove(product)}
                            className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-slate-50 border border-slate-100 text-rose-500 hover:bg-rose-50 hover:border-rose-100 transition-all shadow-3xs cursor-pointer"
                            title={t.remove[currentLanguage] || t.remove.en}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          <div className="space-y-4">
                            {/* Image */}
                            <div className="aspect-square w-full rounded-xl overflow-hidden bg-slate-50/50 border border-slate-100 relative flex items-center justify-center p-2">
                              <img
                                src={getOptimizedImageUrl(product.imageUrl, typeof window !== "undefined" ? window.innerWidth < 768 : false)}
                                alt={product.name}
                                className="max-h-full max-w-full object-contain rounded-lg"
                                referrerPolicy="no-referrer"
                              />
                              {hasDiscount && (
                                <span className="absolute bottom-2 left-2 bg-rose-500 text-white font-mono font-black text-[9px] px-2 py-0.5 rounded-md shadow-3xs">
                                  -{product.discountPercent}%
                                </span>
                              )}
                            </div>

                            {/* Basic Details */}
                            <div className={isRTL ? "text-right" : "text-left"}>
                              <h4 className="text-[12.5px] font-black text-slate-800 leading-tight line-clamp-2">
                                {product.name}
                              </h4>

                              {store && (
                                <div className="flex items-center gap-1 mt-1.5 text-[10.5px] text-slate-450">
                                  <span>🏪</span>
                                  <span className="font-semibold underline truncate max-w-[120px]">
                                    {store.name}
                                  </span>
                                  {store.rating && (
                                    <span className="text-amber-500 font-bold ml-1 font-mono">
                                      ★ {store.rating.toFixed(1)}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Stats and pricing table */}
                            <div className="border-t border-b border-slate-100 py-3 space-y-3 text-[11px] leading-relaxed">
                              {/* Price */}
                              <div className="flex justify-between items-center gap-2">
                                <span className="text-slate-400 uppercase font-bold tracking-wider font-mono text-[9.5px]">
                                  {t.price[currentLanguage] || t.price.en}
                                </span>
                                <div className="text-right">
                                  <span className="font-black text-emerald-600 font-mono text-sm">
                                    {effPrice.toLocaleString()} DA
                                  </span>
                                  {hasDiscount && (
                                    <span className="block text-[9.5px] text-slate-400 line-through font-mono">
                                      {product.price.toLocaleString()} DA
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Rating */}
                              <div className="flex justify-between items-center">
                                <span className="text-slate-400 uppercase font-bold tracking-wider font-mono text-[9.5px]">
                                  {t.rating[currentLanguage] || t.rating.en}
                                </span>
                                <div className="flex items-center gap-1 text-slate-700 font-semibold">
                                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                                  <span className="font-mono">{product.rating ? product.rating.toFixed(1) : "N/A"}</span>
                                  <span className="text-slate-400">({product.reviews?.length || 0})</span>
                                </div>
                              </div>

                              {/* Category */}
                              <div className="flex justify-between items-center">
                                <span className="text-slate-400 uppercase font-bold tracking-wider font-mono text-[9.5px]">
                                  {t.category[currentLanguage] || t.category.en}
                                </span>
                                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold uppercase tracking-tight text-[9.5px] font-mono">
                                  {product.category}
                                </span>
                              </div>

                              {/* Stock */}
                              <div className="flex justify-between items-center">
                                <span className="text-slate-400 uppercase font-bold tracking-wider font-mono text-[9.5px]">
                                  {t.availability[currentLanguage] || t.availability.en}
                                </span>
                                {product.stock > 0 ? (
                                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                                    <Check className="w-3.5 h-3.5 shrink-0" />
                                    {t.inStock[currentLanguage].replace("{count}", String(product.stock)) || t.inStock.en.replace("{count}", String(product.stock))}
                                  </span>
                                ) : (
                                  <span className="text-rose-500 font-bold flex items-center gap-1">
                                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                    {t.outOfStock[currentLanguage] || t.outOfStock.en}
                                  </span>
                                )}
                              </div>

                              {/* Weight */}
                              {product.weight && (
                                <div className="flex justify-between items-center">
                                  <span className="text-slate-400 uppercase font-bold tracking-wider font-mono text-[9.5px]">
                                    {t.weight[currentLanguage] || t.weight.en}
                                  </span>
                                  <span className="font-semibold text-slate-700 font-mono">
                                    {product.weight >= 1000 
                                      ? `${(product.weight / 1000).toFixed(2)} kg` 
                                      : `${product.weight} g`}
                                  </span>
                                </div>
                              )}

                              {/* Dimensions */}
                              {product.dimensions && (
                                <div className="flex justify-between items-center">
                                  <span className="text-slate-400 uppercase font-bold tracking-wider font-mono text-[9.5px]">
                                    {t.dimensions[currentLanguage] || t.dimensions.en}
                                  </span>
                                  <span className="font-semibold text-slate-700 font-mono text-[10px]">
                                    {product.dimensions.width} × {product.dimensions.height} × {product.dimensions.depth} cm
                                  </span>
                                </div>
                              )}

                              {/* Colors */}
                              {product.colors && product.colors.length > 0 && (
                                <div className="flex justify-between items-center">
                                  <span className="text-slate-400 uppercase font-bold tracking-wider font-mono text-[9.5px]">
                                    {t.colors[currentLanguage] || t.colors.en}
                                  </span>
                                  <div className="flex items-center gap-1">
                                    {product.colors.map((c) => (
                                      <span
                                        key={c.name}
                                        className="w-3 h-3 rounded-full border border-slate-200 shadow-3xs"
                                        style={{ backgroundColor: c.hex }}
                                        title={c.name}
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Sizes */}
                              {product.sizes && product.sizes.length > 0 && (
                                <div className="flex justify-between items-center">
                                  <span className="text-slate-400 uppercase font-bold tracking-wider font-mono text-[9.5px]">
                                    {t.sizes[currentLanguage] || t.sizes.en}
                                  </span>
                                  <span className="font-semibold text-slate-700">
                                    {product.sizes.join(", ")}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Specifications section */}
                            <div className={isRTL ? "text-right" : "text-left"}>
                              <h5 className="text-[10px] uppercase font-bold tracking-wider text-slate-450 mb-2 font-mono">
                                {t.specifications[currentLanguage] || t.specifications.en}
                              </h5>
                              {product.specifications && product.specifications.length > 0 ? (
                                <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
                                  {product.specifications.map((spec) => (
                                    <div
                                      key={spec.key}
                                      className="flex justify-between gap-2 border-b border-slate-100 pb-1 text-[10.5px]"
                                    >
                                      <span className="text-slate-450 truncate font-semibold">
                                        {spec.key}
                                      </span>
                                      <span className="text-slate-700 font-bold truncate max-w-[120px]">
                                        {spec.value}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-[10px] text-slate-400 italic">
                                  {t.noSpecs[currentLanguage] || t.noSpecs.en}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Action Box */}
                          <div className="mt-5 pt-3 border-t border-slate-100">
                            <button
                              onClick={() => {
                                if (store && product.stock > 0) {
                                  onAddToCart(product, store, 1);
                                }
                              }}
                              disabled={product.stock <= 0}
                              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all active:scale-[0.98] ${
                                product.stock > 0
                                  ? "bg-slate-900 hover:bg-slate-800 text-white shadow-3xs cursor-pointer"
                                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
                              }`}
                            >
                              <ShoppingCart className="w-3.5 h-3.5" />
                              <span>{t.addToCart[currentLanguage] || t.addToCart.en}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Additional detailed specification grid across all keys */}
                  {allSpecKeys.length > 0 && (
                    <div className="mt-4 border border-slate-150 bg-slate-50 rounded-2xl overflow-hidden p-4">
                      <h4 className="text-xs font-black text-slate-800 mb-4 uppercase tracking-wider font-mono">
                        ⚖️ {t.specifications[currentLanguage] || t.specifications.en} Matrix
                      </h4>
                      <div className="space-y-3 text-xs">
                        {allSpecKeys.map((key) => (
                          <div key={key} className="grid grid-cols-12 gap-3 items-center border-b border-slate-100 pb-2.5 last:border-0 last:pb-0">
                            {/* Key */}
                            <div className="col-span-3 text-slate-400 font-semibold truncate text-[10px] uppercase tracking-wide">
                              {key}
                            </div>
                            {/* Values for each product */}
                            <div className="col-span-9 grid gap-3" style={{
                              gridTemplateColumns: `repeat(${comparedProducts.length}, minmax(0, 1fr))`
                            }}>
                              {comparedProducts.map((p) => {
                                const spec = p.specifications?.find((s) => s.key === key);
                                return (
                                  <div key={p.id || p.name} className="font-extrabold text-slate-800 truncate font-sans">
                                    {spec ? spec.value : <span className="text-slate-300">—</span>}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
