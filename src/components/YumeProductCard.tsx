import React, { useState, useEffect } from "react";
import { Product, MerchantStore } from "../types";
import { Star, Heart, ChevronLeft, ChevronRight, Eye, ShoppingCart } from "lucide-react";
import { BookmarkStar } from "./BookmarkStar";
import { motion, AnimatePresence } from "motion/react";
import { getOptimizedImageUrl } from "../utils/imageOptimizer";
import { formatPrice, convertCurrency, countryCurrencyMapping } from "../currency";
import { usePriceUpdateHighlight } from "../utils/priceHighlight";

interface YumeProductCardProps {
  key?: any;
  prod: Product;
  selectedStore: MerchantStore;
  wishlist: string[];
  handleToggleWishlist: (idOrName: string) => void;
  setSelectedProduct: (product: Product | null) => void;
  handleAddToCart: (product: Product, store: MerchantStore, customQty?: number, customVariantName?: string) => void;
  currentLanguage: string;
  isListMode?: boolean;
  currentSlideColor?: string;
  comparedProducts?: Product[];
  onToggleCompare?: (product: Product) => void;
}


let globalScrollDirection: "up" | "down" = "down";
if (typeof window !== "undefined") {
  let lastScrollTop = 0;
  window.addEventListener(
    "scroll",
    (e) => {
      const target = e.target;
      if (!target) return;
      const isDocument = target === document || target === window.document;
      const element = isDocument ? document.documentElement : (target as HTMLElement);
      if (!element || typeof element.scrollTop === "undefined") return;

      const scrollTop = element.scrollTop;
      if (Math.abs(scrollTop - lastScrollTop) < 10) return;

      if (scrollTop > lastScrollTop) {
        globalScrollDirection = "down";
      } else if (scrollTop < lastScrollTop) {
        globalScrollDirection = "up";
      }
      lastScrollTop = scrollTop;
    },
    { capture: true, passive: true }
  );
}

function useScrollDirection() {
  return globalScrollDirection;
}

export default function YumeProductCard({
  prod,
  selectedStore,
  wishlist,
  handleToggleWishlist,
  setSelectedProduct,
  handleAddToCart,
  currentLanguage,
  isListMode = false,
  currentSlideColor,
  comparedProducts = [],
  onToggleCompare,
}: YumeProductCardProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [flyingThumbnails, setFlyingThumbnails] = useState<{ id: string; x: number; y: number }[]>([]);

  const priceFlash = usePriceUpdateHighlight(prod.id || "");
  const scrollDirection = useScrollDirection();

  // Responsive device/viewport checking
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Derive active slides list
  const slides = React.useMemo(() => {
    const list = [prod.imageUrl];
    if (prod.images && prod.images.length > 0) {
      prod.images.forEach((img) => {
        if (img && !list.includes(img)) {
          list.push(img);
        }
      });
    }

    // Add fallback mock slides by category for rich sliding capabilities
    if (list.length < 3) {
      if (prod.category === "Food") {
        list.push(
          "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80"
        );
      } else if (prod.category === "Crafts") {
        list.push(
          "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80"
        );
      } else if (prod.category === "Fashion") {
        list.push(
          "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&auto=format&fit=crop&q=80"
        );
      } else if (prod.category === "Electronics") {
        list.push(
          "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80"
        );
      } else {
        list.push(
          "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=80"
        );
      }
    }
    return list.slice(0, 5); // Max 5 slides for premium light feel
  }, [prod]);

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const tLocal = (key: string, variables?: Record<string, string | number>) => {
    const dicts: Record<string, Record<string, string>> = {
      en: {
        freeShipping: "Free Delivery",
        shippingSuffix: "delivery",
        available58: "All 58 Wilayas",
        at: "at",
        onlyLeft: "{stock} left",
        total: " total",
        addToCart: "Add to Cart",
      },
      fr: {
        freeShipping: "Livraison Gratuite",
        shippingSuffix: "livraison",
        available58: "58 Wilayas",
        at: "à",
        onlyLeft: "{stock} restant",
        total: " total",
        addToCart: "Ajouter au Panier",
      },
      ar: {
        freeShipping: "توصيل مجاني",
        shippingSuffix: "توصيل",
        available58: "الـ 58 ولاية كاملة",
        at: "في",
        onlyLeft: "متبقي {stock}!",
        total: " إجمالي",
        addToCart: "إضافة للسلة",
      }
    };
    const lang = currentLanguage === "ar" || currentLanguage === "fr" || currentLanguage === "en" ? currentLanguage : "en";
    let text = dicts[lang][key] || key;
    if (variables) {
      Object.entries(variables).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    return text;
  };

  const hasWishlist = wishlist.includes(prod.id || prod.name);
  const ratingVal = prod.rating || 4.8;
  const reviewsCount = prod.reviews?.length || Math.floor(Math.random() * 8) + 3;

  // Render prices in dinars cleanly
  const isDiscountEnabled = !!prod.discountEnabled;
  const discountPercent = prod.discountPercent !== undefined ? prod.discountPercent : 15;
  const originalPrice = prod.price || 1500;
  const currentPrice = isDiscountEnabled
    ? Math.round(originalPrice * (1 - discountPercent / 100))
    : originalPrice;
  const deliveryText = prod.shippingCost && prod.shippingCost > 0
    ? `+ ${prod.shippingCost.toLocaleString()} DA ${tLocal("shippingSuffix")}`
    : tLocal("freeShipping");

  const dateSubtext = tLocal("available58");

  const descriptionText = (() => {
    const desc = currentLanguage === "ar"
      ? prod.description_ar
      : currentLanguage === "fr"
      ? prod.description_fr
      : prod.description_en;
    return desc || prod.name;
  })();

  const storefrontAccentColor = selectedStore?.designSettings?.accentColor || "#ff385c";

  return (
    <motion.div
      id={`yume-prod-${prod.id}`}
      className="product-card-container flex flex-col gap-2.5 relative bg-transparent border-0 p-3 select-none group/card text-left transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.015 }}
      initial={scrollDirection === "down" ? { opacity: 0, y: 24, scale: 0.97 } : { opacity: 1, y: 0, scale: 1 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, margin: "-50px" }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
    >
      {/* Aspect-Ratio Box containing Image Slideshow / Buttons */}
      <div className={`aspect-[4/5] w-full rounded-[16px] overflow-hidden bg-stone-100 dark:bg-slate-900 relative shadow-sm border transition-all duration-300 group/img cursor-pointer animated-card-shadow-hover group-hover/card:border-stone-300/60 dark:group-hover/card:border-slate-700/60 ${
        hasWishlist 
          ? "border-rose-500/80 shadow-[0_0_15px_rgba(244,63,94,0.2)] ring-2 ring-rose-500/25" 
          : "border-stone-150/40 dark:border-slate-800/60"
      }`}>
        
        {/* Wishlist BookmarkStar absolute layer */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (hasWishlist) {
              if (onToggleCompare) {
                onToggleCompare(prod);
              }
            } else {
              handleToggleWishlist(prod.id || prod.name);
            }
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
          }}
          className="absolute top-2 right-2.5 transition-all z-20 cursor-pointer focus-visible:outline-none flex items-center justify-center p-0.5 bg-transparent"
          title={
            hasWishlist
              ? (comparedProducts.some((p) => p.id === prod.id)
                ? (currentLanguage === "ar" ? "إزالة من المقارنة" : currentLanguage === "fr" ? "Retirer de la comparaison" : "Remove from Comparison")
                : (currentLanguage === "ar" ? "إضافة للمقارنة" : currentLanguage === "fr" ? "Ajouter à la comparaison" : "Add to Comparison"))
              : "Ajouter aux favoris"
          }
        >
          <BookmarkStar filled={hasWishlist} className="w-7.5 h-9.5" />
        </button>

        {/* Carousel slide element */}
        <div
          onClick={() => setSelectedProduct(prod)}
          className="w-full h-full relative"
        >
          <img
            src={getOptimizedImageUrl(slides[currentSlide], isMobile)}
            alt={prod.altText || prod.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover select-none transition-all duration-500 ${
              hasWishlist ? "scale-103 brightness-[0.98]" : "scale-100 group-hover/card:scale-103"
            }`}
          />
        </div>

        {/* Dynamic Chevron Left / Right Carousel Controls inline with screenshots */}
        <AnimatePresence>
          {isHovered && slides.length > 1 && (
            <>
              {/* Left Arrow Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.95, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={prevSlide}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-7.5 h-7.5 rounded-full bg-white hover:bg-slate-50 flex items-center justify-center text-slate-800 shadow-[0_4px_10px_rgba(0,0,0,0.15)] hover:scale-105 active:scale-95 transition-all z-10 cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-rose-500 focus-visible:outline-none"
              >
                <ChevronLeft className="w-4.5 h-4.5 stroke-[2.5px]" />
              </motion.button>

              {/* Right Arrow Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.95, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={nextSlide}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-7.5 h-7.5 rounded-full bg-white hover:bg-slate-50 flex items-center justify-center text-slate-800 shadow-[0_4px_10px_rgba(0,0,0,0.15)] hover:scale-105 active:scale-95 transition-all z-10 cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-rose-500 focus-visible:outline-none"
              >
                <ChevronRight className="w-4.5 h-4.5 stroke-[2.5px]" />
              </motion.button>
            </>
          )}
        </AnimatePresence>

        {/* Small Progress Dots Bottom Carousel Center overlay */}
        {slides.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 select-none">
            {slides.map((_, idx) => {
              const isActive = idx === currentSlide;
              return (
                <div
                  key={idx}
                  className={`rounded-full transition-all duration-300 ${
                    isActive
                      ? "w-2 h-2 scale-110"
                      : "w-1.5 h-1.5"
                  }`}
                  style={{
                    backgroundColor: isActive ? storefrontAccentColor : "rgba(255,255,255,0.5)"
                  }}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Description Meta Section Block below the image */}
      <div 
        onClick={() => setSelectedProduct(prod)}
        className="flex flex-col text-left cursor-pointer font-sans px-1"
      >
        {/* Row 1: Title Only */}
        <h5 className="line-clamp-1 leading-snug mt-1 hover:text-amber-600 transition-colors text-[#051515] text-left font-bold text-[13px]">
          {prod.name}
        </h5>

        {/* Rating Row with black stars */}
        <div className="flex items-center gap-1 mt-0.5">
          <div className="flex items-center text-[10px] text-slate-900 select-none">
            {Array.from({ length: 5 }).map((_, i) => {
              const fill = i < Math.round(ratingVal);
              return (
                <span key={i} className={fill ? "text-slate-950 font-black" : "text-slate-200"}>
                  ★
                </span>
              );
            })}
          </div>
          <span className="text-[11px] font-bold text-slate-900 ml-0.5">{ratingVal.toFixed(1)}</span>
          <span className="text-[10px] text-slate-400">({reviewsCount})</span>
        </div>

        {/* Row 3: Precise bold pricing format and quick buy button */}
        <div className="text-[14px] mt-1 flex items-center justify-between">
          <div className="leading-snug flex items-center">
            <span 
              className={`inline-flex items-start text-[#263232] font-bold text-left not-italic no-underline rounded-sm transition-all duration-300 ${
                priceFlash === "up" 
                  ? "animate-price-flash-red text-red-600 bg-red-50/50" 
                  : priceFlash === "down" 
                  ? "animate-price-flash-green text-emerald-600 bg-emerald-50/50" 
                  : ""
              }`}
              title={(() => {
                const country = localStorage.getItem("dz_country") || "Algeria";
                const mCurrency = selectedStore.currency || "DZD";
                const result = formatPrice(currentPrice, mCurrency, country);
                return result.isConverted ? `Merchant Price: ${currentPrice.toLocaleString()} ${mCurrency}` : "";
              })()}
            >
              <span className="text-[10px] font-bold leading-none mt-0.5 mr-0.5 select-none self-start">
                {(() => {
                  const country = localStorage.getItem("dz_country") || "Algeria";
                  const targetConfig = countryCurrencyMapping[country] || countryCurrencyMapping["Algeria"];
                  const targetCurrency = targetConfig.currency;
                  return targetCurrency === "DZD" ? "DA" : (targetConfig.symbol || "$");
                })()}
              </span>
              <span className="text-[17px] font-extrabold leading-none tracking-tight">
                {(() => {
                  const country = localStorage.getItem("dz_country") || "Algeria";
                  const mCurrency = selectedStore.currency || "DZD";
                  const targetConfig = countryCurrencyMapping[country] || countryCurrencyMapping["Algeria"];
                  const targetCurrency = targetConfig.currency;
                  const isConverted = mCurrency !== targetCurrency;
                  const convertedAmount = isConverted 
                    ? convertCurrency(currentPrice, mCurrency, targetCurrency)
                    : currentPrice;
                  const intAmount = Math.round(convertedAmount);
                  return intAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                })()}
              </span>
            </span>

            {/* Crossed-out original price before discount */}
            {isDiscountEnabled && (
              <>
                <span className="ml-2 text-[11px] text-slate-400 line-through select-none font-medium">
                  {(() => {
                    const country = localStorage.getItem("dz_country") || "Algeria";
                    const mCurrency = selectedStore.currency || "DZD";
                    const targetConfig = countryCurrencyMapping[country] || countryCurrencyMapping["Algeria"];
                    const targetCurrency = targetConfig.currency;
                    const isConverted = mCurrency !== targetCurrency;
                    const convertedAmount = isConverted 
                      ? convertCurrency(originalPrice, mCurrency, targetCurrency)
                      : originalPrice;
                    const intAmount = Math.round(convertedAmount);
                    const formattedPrice = intAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                    const symbol = targetCurrency === "DZD" ? "DA" : (targetConfig.symbol || "$");
                    return `${formattedPrice} ${symbol}`;
                  })()}
                </span>

                <span className="ml-2 text-[10px] font-black text-rose-600 px-1.5 py-0.5 bg-rose-50 rounded-md select-none font-mono">
                  -{discountPercent}%
                </span>
              </>
            )}
          </div>

          {/* Quick Buy Plus Button */}
          {prod.stock > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                
                // Active temporary added feedback
                setIsAdded(true);
                setTimeout(() => setIsAdded(false), 800);

                // Calculate element positions for a beautiful arc flying trajectory
                const rect = e.currentTarget.getBoundingClientRect();
                const cardEl = e.currentTarget.closest('[id^="yume-prod-"]');
                const cardRect = cardEl?.getBoundingClientRect();
                let startX = 200;
                let startY = 300;
                if (rect && cardRect) {
                  startX = rect.left - cardRect.left + rect.width / 2;
                  startY = rect.top - cardRect.top + rect.height / 2;
                }
                const newId = `${Date.now()}-${Math.random()}`;
                setFlyingThumbnails((prev) => [...prev, { id: newId, x: startX, y: startY }]);

                handleAddToCart(prod, selectedStore);
              }}
              style={{
                backgroundColor: isAdded 
                  ? "rgb(16, 185, 129)" 
                  : isHovered 
                  ? storefrontAccentColor 
                  : "rgb(15, 23, 42)"
              }}
              className="p-1.5 rounded-full text-white shadow-3xs transition-all duration-300 cursor-pointer scale-95 hover:scale-105 active:scale-90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-rose-500 focus-visible:outline-none w-7 h-7 flex items-center justify-center"
              title={tLocal("addToCart")}
            >
              <AnimatePresence mode="wait">
                {isAdded ? (
                  <motion.span
                    key="check"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center justify-center"
                  >
                    <svg
                      className="w-3.5 h-3.5 stroke-current"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="3.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </motion.span>
                ) : (
                  <motion.span
                    key="cart"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center justify-center"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          )}
        </div>

        {/* Row 4: Stock Status badge with persistent uniform height to avoid layout shift */}
        <div className="h-4.5 mt-1 flex items-center">
          {prod.stock <= 3 && prod.stock > 0 ? (
            <span 
              style={{
                backgroundColor: currentSlideColor || storefrontAccentColor,
                color: "#ffffff"
              }}
              className="font-bold not-italic no-underline text-[10px] leading-[15px] px-1.5 py-0.5 rounded-sm animate-pulse"
            >
              {tLocal("onlyLeft", { stock: prod.stock })}
            </span>
          ) : null}
        </div>
      </div>

      {/* Flying feedback animation layer */}
      <AnimatePresence>
        {flyingThumbnails.map((thumbnail) => (
          <motion.div
            key={thumbnail.id}
            initial={{
              position: "absolute",
              left: thumbnail.x,
              top: thumbnail.y,
              x: "-50%",
              y: "-50%",
              scale: 1,
              opacity: 1,
              zIndex: 9999,
            }}
            animate={{
              // Curve to the upper-right corner of the relative card container
              left: [thumbnail.x, thumbnail.x + 40, thumbnail.x + 120, thumbnail.x + 220],
              top: [thumbnail.y, thumbnail.y - 100, thumbnail.y - 250, thumbnail.y - 480],
              scale: [1, 1.25, 0.65, 0.1],
              opacity: [1, 0.9, 0.75, 0],
              rotate: [0, 90, 180, 360],
            }}
            transition={{
              duration: 1.15,
              ease: [0.25, 1, 0.5, 1], // Fluid deceleration cubic bezier curve
            }}
            onAnimationComplete={() => {
              setFlyingThumbnails((prev) => prev.filter((t) => t.id !== thumbnail.id));
            }}
            className="w-12 h-12 rounded-full border-2 bg-white shadow-[0_8px_20px_rgba(0,0,0,0.25)] overflow-hidden pointer-events-none flex items-center justify-center"
            style={{
              borderColor: storefrontAccentColor,
            }}
          >
            <img
              src={getOptimizedImageUrl(prod.imageUrl, true)}
              alt={prod.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}