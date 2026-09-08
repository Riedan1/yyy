import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import ProductReviewWidget, { USER_AVATAR_POOL, hashStringToNumber, OrnateOrnamentDivider, getGuestIp } from "./ProductReviewWidget";
import { Product, MerchantStore, Order } from "../types";
import { ShippingTrackingModal } from "./ShippingTrackingModal";
import { BookmarkStar } from "./BookmarkStar";
import { getOptimizedImageUrl } from "../utils/imageOptimizer";
import { trackAdViewContent } from "../utils/analytics";
import {
  getWorldwideCountries,
  getStatesByCountryCode,
  getCitiesByState,
  detectUserCountryCode,
  detectUserLocationByIP,
  ALGERIA_58_WILAYAS,
} from "../lib/countryStateCity";
import { SearchableLocationSelect, SearchOption } from "./SearchableLocationSelect";
import { validateFullName } from "../lib/fullNameValidation";
import { validatePhoneNumber, getCountryFlagEmoji, formatPhoneForDisplay } from "../lib/phoneValidation";
import { 
  ArrowLeft, 
  X, 
  Star, 
  ThumbsUp, 
  Maximize2, 
  ShieldCheck, 
  Truck, 
  Lock, 
  ChevronDown, 
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  ChevronsRight,
  ChevronsLeft,
  ShoppingBag,
  Sparkles, 
  Share2, 
  Heart, 
  AlertCircle,
  MessageSquare,
  Bookmark,
  Check,
  MapPin,
  Building,
  CreditCard,
  ShoppingCart,
  Cpu,
  Sliders,
  Play,
  Pause,
  Volume2,
  VolumeX,
  FileText,
  HelpCircle,
  BookOpen,
  Layers,
  Video,
  Store,
  Eye,
  ArrowUpRight,
  Tag,
  Phone,
  Mail,
  User,
  CheckCircle2,
  MessageCircle,
  PhoneCall,
  Send,
  Copy,
  Search,
  Globe,
  Package
} from "lucide-react";

const DefaultProfileStorePhoto = ({ className = "w-full h-full object-cover", ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Background circular gray/slate area */}
      <circle cx="50" cy="50" r="50" fill="#f0f2f5" />
      {/* Neck: beige/skin tone */}
      <path d="M42 65 C42 65, 42 75, 42 75 C42 75, 45 84, 50 84 C55 84, 58 75, 58 75 C58 75, 58 65, 58 65 Z" fill="#e2c4ac" />
      {/* Face: beige/skin tone */}
      <circle cx="50" cy="46" r="23" fill="#f4d4bc" />
      {/* Blue t-shirt: cyan */}
      <path d="M 18 84 C 30 74, 38 74, 40 80 C 40 80, 45 84, 50 84 C 55 84, 60 80, 60 80 C 62 74, 70 74, 82 84 C 85 87, 85 100, 85 100 L 15 100 Z" fill="#3da9fc" />
      {/* Hair base shape - beautifully spiky bangs */}
      <path d="M 27 48 C 26 43, 29 35, 32 30 C 37 23, 45 22, 50 22 C 55 22, 63 23, 68 30 C 71 35, 74 43, 73 48 C 73 52, 71 54, 70 51 C 69 48, 68 45, 67 45 C 66 45, 65 48, 64 51 C 63 53, 62 50, 61 47 C 60 45, 59 45, 58 47 C 57 49, 56 51, 55 51 C 54 51, 53 48, 52 46 C 51 44, 49 44, 48 46 C 47 48, 46 51, 45 51 C 44 51, 43 49, 42 47 C 41 45, 40 45, 39 47 C 38 50, 37 53, 36 51 C 35 48, 34 45, 33 45 C 32 45, 31 48, 30 51 C 29 54, 27 52, 27 48 Z" fill="#4d5b71" />
      {/* Hair top spike peak */}
      <path d="M 33 26 C 30 29, 32 23, 37 21 C 42 19, 48 20, 52 20 C 56 20, 62 19, 67 21 C 72 23, 74 29, 71 26 C 68 23, 62 21, 50 21 C 38 21, 35 23, 33 26 Z" fill="#4d5b71" />
    </svg>
  );
};

interface ProductPreviewNewWayProps {
  selectedProduct: Product;
  selectedStore: MerchantStore;
  myStore?: MerchantStore;
  currentUser?: {
    name: string;
    email: string;
    role: "Merchant" | "Buyer";
    storeName?: string;
  } | null;
  onClose: () => void;
  onOpenReels?: () => void;
  onOpenStoreProfile?: () => void;
  handleAddToCart: (product: Product, store: MerchantStore, quantity: number, variantSpeciallyFormatted?: string) => void;
  setCartTab: (tab: "cart" | "checkout") => void;
  setIsCartOpen: (open: boolean) => void;
  setLightboxProduct: (product: Product | null) => void;
  setLightboxImageIndex: (index: number) => void;
  currentSlideColor?: string;
  wishlist?: string[];
  handleToggleWishlist?: (id: string) => void;
  shippingRates?: {
    algiers: number;
    major: number;
    sahara: number;
    standard: number;
    isFlatRate: boolean;
    flatRateAmount: number;
  };
  comparedProducts?: Product[];
  onToggleCompare?: (product: Product) => void;
  onSelectProduct?: (product: Product) => void;
  onNotifyMe?: (productName: string, storeName: string) => void;
}

interface ThreadedComment {
  id: string;
  author: string;
  role?: string;
  badge?: string;
  text: string;
  avatar: string;
  avatarBg: string;
  time: string;
  likes: number;
  loves?: number;
  hahas?: number;
  liked?: boolean;
  loved?: boolean;
  hahad?: boolean;
  emoji?: string;
  images?: string[];
  purchasedVariant?: string;
  rating?: number;
  isHidden?: boolean;
  isPinned?: boolean;
  isLocked?: boolean;
  parentId?: string | null;
  replies?: ThreadedComment[];
}

interface AutoplayShowcaseVideoProps {
  url: string;
  isBerberRugProduct: boolean;
}

const AutoplayShowcaseVideo: React.FC<AutoplayShowcaseVideoProps> = ({ url, isBerberRugProduct }) => {
  const [isMuted, setIsMuted] = useState(true);

  const getFullShowcaseEmbed = (videoUrl: string): { type: string; embedUrl: string; videoId?: string } => {
    if (!videoUrl) {
      const defaultYtId = isBerberRugProduct ? "_POnm_C2Kts" : "GgA92gC4O3s";
      return {
        type: "youtube",
        videoId: defaultYtId,
        embedUrl: `https://www.youtube.com/embed/${defaultYtId}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&playsinline=1&loop=1&playlist=${defaultYtId}`
      };
    }

    // YouTube formats
    if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
      let videoId = "";
      if (videoUrl.includes("youtu.be/")) {
        videoId = videoUrl.split("youtu.be/")[1]?.split("?")[0] || "";
      } else if (videoUrl.includes("embed/")) {
        videoId = videoUrl.split("embed/")[1]?.split("?")[0] || "";
      } else if (videoUrl.includes("shorts/")) {
        videoId = videoUrl.split("shorts/")[1]?.split("?")[0] || "";
      } else if (videoUrl.includes("v=")) {
        videoId = videoUrl.split("v=")[1]?.split("&")[0] || "";
      }
      if (videoId) {
        return {
          type: "youtube",
          videoId,
          embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&playsinline=1&loop=1&playlist=${videoId}`
        };
      }
    }

    // Facebook formats
    if (videoUrl.includes("facebook.com") || videoUrl.includes("fb.watch") || videoUrl.includes("fb.com")) {
      return {
        type: "facebook",
        embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(videoUrl)}&show_text=0&autoplay=1&mute=${isMuted ? 1 : 0}`
      };
    }

    // Vimeo formats
    if (videoUrl.includes("vimeo.com")) {
      const vimeoMatches = videoUrl.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/);
      const vimeoId = vimeoMatches ? vimeoMatches[3] : "";
      if (vimeoId) {
        return {
          type: "vimeo",
          embedUrl: isMuted 
            ? `https://player.vimeo.com/video/${vimeoId}?background=1&autoplay=1&loop=1&muted=1` 
            : `https://player.vimeo.com/video/${vimeoId}?autoplay=1&loop=1&muted=0&controls=0`
        };
      }
    }

    // TikTok formats
    if (videoUrl.includes("tiktok.com")) {
      let videoId = "";
      const matches = videoUrl.match(/\/video\/(\d+)/);
      if (matches && matches[1]) {
        videoId = matches[1];
      } else {
        const embedMatches = videoUrl.match(/\/embed\/(\d+)/);
        if (embedMatches && embedMatches[1]) {
          videoId = embedMatches[1];
        }
      }
      
      if (videoId) {
        return {
          type: "tiktok",
          videoId,
          embedUrl: `https://www.tiktok.com/embed/v2/${videoId}`
        };
      }
      
      const lastSegment = videoUrl.split("/").pop()?.split("?")[0] || "";
      if (/^\d+$/.test(lastSegment)) {
        return {
          type: "tiktok",
          videoId: lastSegment,
          embedUrl: `https://www.tiktok.com/embed/v2/${lastSegment}`
        };
      }
      
      return {
        type: "tiktok",
        embedUrl: videoUrl
      };
    }

    // Direct video formats
    if (videoUrl.endsWith(".mp4") || videoUrl.endsWith(".webm") || videoUrl.endsWith(".ogg") || videoUrl.includes(".mp4?")) {
      return {
        type: "direct",
        embedUrl: videoUrl
      };
    }

    return {
      type: "unknown",
      embedUrl: videoUrl
    };
  };

  const videoMeta = getFullShowcaseEmbed(url);

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-950/5 group/player border border-stone-200/60 shadow-xs transition-all hover:shadow-md">
      {/* Subtle blend styling - Background overlay with subtle opacity to blend with the rest of the page */}
      <div className="absolute inset-0 bg-slate-100/10 pointer-events-none transition-all group-hover/player:bg-transparent rounded-2xl z-10 mix-blend-multiply" />

      {videoMeta.type === "direct" ? (
        <video
          src={videoMeta.embedUrl}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          controls={false}
          className="w-full h-full object-cover transition-opacity duration-300 opacity-95 group-hover/player:opacity-100"
        />
      ) : (
        <iframe
          src={videoMeta.embedUrl}
          title="Autoplay Showcase Video"
          className="w-full h-full border-0 transition-opacity duration-300 opacity-95 group-hover/player:opacity-100 pointer-events-none sm:pointer-events-auto"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      )}

      {/* Mute/Unmute Control Overlay */}
      <button
        type="button"
        onClick={() => setIsMuted(prev => !prev)}
        className="absolute bottom-3 right-3 z-30 flex items-center gap-1.5 bg-black/60 hover:bg-black/85 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-md backdrop-blur-xs active:scale-95 transition-all select-none cursor-pointer border border-white/10"
      >
        {isMuted ? (
          <>
            <span className="text-xs">🔇</span>
            <span>UNMUTE SHOWCASE</span>
          </>
        ) : (
          <>
            <span className="text-xs">🔊</span>
            <span>MUTE</span>
          </>
        )}
      </button>

      {/* Auto-playing notification dot badge */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-black/45 text-white/95 text-[8.5px] font-extrabold tracking-widest uppercase px-2 py-1 rounded-md backdrop-blur-xs border border-white/5 select-none pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
        LIVE SHOWREEL
      </div>
    </div>
  );
};

const hexToRgba = (hex: string, alpha: number) => {
  if (!hex) return `rgba(235, 141, 112, ${alpha})`;
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.slice(0, 2), 16);
  const g = parseInt(cleanHex.slice(2, 4), 16);
  const b = parseInt(cleanHex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const MultiContactComboIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" className={className}>
    {/* Green Circle Background */}
    <circle cx="50" cy="50" r="48" fill="#42B549" />
    {/* White Phone Handset */}
    <path
      d="M 33 67 C 24.5 58.5, 23.5 45.5, 31.5 37.5 L 37 43 C 38.3 44.3, 38.5 46.3, 37.7 48 L 35.3 52.7 C 34.7 53.9, 35 55.3, 36 56.3 L 43.7 64 C 44.7 65, 46.1 65.3, 47.3 64.7 L 52 62.3 C 53.7 61.5, 55.7 61.7, 57 63 L 62.5 68.5 C 54.5 76.5, 41.5 75.5, 33 67 Z"
      fill="white"
    />
    {/* Ringing Sound Waves */}
    <path
      d="M 53 43 A 12 12 0 0 1 61 51"
      stroke="white"
      strokeWidth="4.5"
      strokeLinecap="round"
    />
    <path
      d="M 58 35 A 21 21 0 0 1 70 47"
      stroke="white"
      strokeWidth="4.5"
      strokeLinecap="round"
    />
    <path
      d="M 63 27 A 30 30 0 0 1 79 43"
      stroke="white"
      strokeWidth="4.5"
      strokeLinecap="round"
    />
  </svg>
);

export default function ProductPreviewNewWay({
  selectedProduct,
  selectedStore,
  myStore,
  currentUser,
  onClose,
  onOpenReels,
  onOpenStoreProfile,
  handleAddToCart,
  setCartTab,
  setIsCartOpen,
  setLightboxProduct,
  setLightboxImageIndex,
  currentSlideColor = "#eb8d70",
  wishlist = [],
  handleToggleWishlist,
  shippingRates,
  comparedProducts = [],
  onToggleCompare,
  onSelectProduct,
  onNotifyMe,
}: ProductPreviewNewWayProps) {
  const isSimilarProductsEnabled = selectedStore?.designSettings?.showSimilarProducts !== false;

  const similarCarouselRef = useRef<HTMLDivElement>(null);
  const [similarScrollLeft, setSimilarScrollLeft] = useState(0);
  const [similarContainerWidth, setSimilarContainerWidth] = useState(600);
  const [similarHoveredIndex, setSimilarHoveredIndex] = useState<number | null>(null);
  const [isSimilarMouseOver, setIsSimilarMouseOver] = useState(false);
  const [canScrollSimilarLeft, setCanScrollSimilarLeft] = useState(false);
  const [canScrollSimilarRight, setCanScrollSimilarRight] = useState(true);

  // Physics & momentum drag state for similar products carousel
  const isSimilarDown = useRef(false);
  const similarStartX = useRef(0);
  const similarScrollLeftVal = useRef(0);
  const isSimilarDragging = useRef(false);
  
  const similarMomentumId = useRef<number | null>(null);
  const similarScrollAnimId = useRef<number | null>(null);
  const similarVelocity = useRef(0);
  const similarLastX = useRef(0);
  const similarLastTime = useRef(0);

  const customScrollSimilarTo = (element: HTMLElement, to: number, duration = 200) => {
    if (similarScrollAnimId.current) {
      cancelAnimationFrame(similarScrollAnimId.current);
    }
    const start = element.scrollLeft;
    const change = to - start;
    const startTime = performance.now();

    const animateScroll = (timestamp: number) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);

      element.scrollLeft = start + change * ease;

      if (progress < 1) {
        similarScrollAnimId.current = requestAnimationFrame(animateScroll);
      } else {
        checkSimilarScrollLimit();
      }
    };

    similarScrollAnimId.current = requestAnimationFrame(animateScroll);
  };

  const snapSimilarToItem = () => {
    if (!similarCarouselRef.current) return;
    const container = similarCarouselRef.current;
    const firstChild = container.firstElementChild as HTMLElement;
    if (firstChild) {
      const gap = 14;
      const itemWidth = firstChild.getBoundingClientRect().width || firstChild.offsetWidth;
      const scrollAmount = itemWidth + gap;
      const index = Math.round(container.scrollLeft / scrollAmount);
      customScrollSimilarTo(container, index * scrollAmount, 180);
    }
  };

  const startSimilarMomentumOrSnap = () => {
    if (!similarCarouselRef.current) return;
    
    if (isSimilarDragging.current && Math.abs(similarVelocity.current) > 0.15) {
      let vel = similarVelocity.current * 16;
      const friction = 0.95;
      const container = similarCarouselRef.current;
      
      const tick = () => {
        if (Math.abs(vel) < 0.25) {
          snapSimilarToItem();
          return;
        }
        
        container.scrollLeft += vel;
        vel *= friction;
        checkSimilarScrollLimit();
        
        similarMomentumId.current = requestAnimationFrame(tick);
      };
      
      similarMomentumId.current = requestAnimationFrame(tick);
    } else {
      snapSimilarToItem();
    }
  };

  const handleSimilarMouseDown = (e: React.MouseEvent) => {
    if (!similarCarouselRef.current) return;
    
    if (similarMomentumId.current) cancelAnimationFrame(similarMomentumId.current);
    if (similarScrollAnimId.current) cancelAnimationFrame(similarScrollAnimId.current);

    isSimilarDown.current = true;
    isSimilarDragging.current = false;
    similarStartX.current = e.pageX - similarCarouselRef.current.offsetLeft;
    similarScrollLeftVal.current = similarCarouselRef.current.scrollLeft;
    
    similarLastX.current = e.pageX;
    similarLastTime.current = performance.now();
    similarVelocity.current = 0;
    
    similarCarouselRef.current.style.scrollBehavior = "auto";
  };

  const handleSimilarMouseLeave = () => {
    if (!isSimilarDown.current) return;
    isSimilarDown.current = false;
    startSimilarMomentumOrSnap();
  };

  const handleSimilarMouseUp = () => {
    if (!isSimilarDown.current) return;
    isSimilarDown.current = false;
    startSimilarMomentumOrSnap();
  };

  const handleSimilarMouseMove = (e: React.MouseEvent) => {
    if (!isSimilarDown.current || !similarCarouselRef.current) return;
    e.preventDefault();
    
    const x = e.pageX - similarCarouselRef.current.offsetLeft;
    const walk = (x - similarStartX.current) * 1.6;
    
    if (Math.abs(walk) > 10) {
      isSimilarDragging.current = true;
    }
    
    similarCarouselRef.current.scrollLeft = similarScrollLeftVal.current - walk;
    
    const now = performance.now();
    const deltaX = e.pageX - similarLastX.current;
    const deltaTime = now - similarLastTime.current;
    if (deltaTime > 0) {
      similarVelocity.current = -deltaX / deltaTime;
    }
    similarLastX.current = e.pageX;
    similarLastTime.current = now;
    
    checkSimilarScrollLimit();
  };

  const checkSimilarScrollLimit = () => {
    if (similarCarouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = similarCarouselRef.current;
      setCanScrollSimilarLeft(scrollLeft > 6);
      setCanScrollSimilarRight(scrollLeft + clientWidth < scrollWidth - 6);
    }
  };

  const scrollSimilar = (direction: 'left' | 'right') => {
    if (similarCarouselRef.current) {
      const container = similarCarouselRef.current;
      const firstChild = container.firstElementChild as HTMLElement;
      if (firstChild) {
        const gap = 14;
        const itemWidth = firstChild.getBoundingClientRect().width || firstChild.offsetWidth;
        const scrollAmount = itemWidth + gap;
        const visibleCount = Math.max(1, Math.floor(container.clientWidth / scrollAmount));
        const itemsToScroll = Math.max(1, visibleCount > 1 ? visibleCount - 1 : 1);
        const scrollDistance = scrollAmount * itemsToScroll;
        
        let targetScroll = direction === 'left' 
          ? container.scrollLeft - scrollDistance 
          : container.scrollLeft + scrollDistance;
        
        const index = Math.round(targetScroll / scrollAmount);
        targetScroll = index * scrollAmount;
        
        customScrollSimilarTo(container, targetScroll, 200);
      }
    }
  };

  const similarProducts = useMemo(() => {
    if (!selectedStore || !selectedStore.products) return [];
    return selectedStore.products.filter(
      (p) => p.id !== selectedProduct.id
    );
  }, [selectedStore, selectedProduct.id]);

  useEffect(() => {
    checkSimilarScrollLimit();
    const container = similarCarouselRef.current;
    if (container) {
      let scrollTimeout: number | null = null;
      const handleScrollRealtime = () => {
        if (scrollTimeout) {
          cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = requestAnimationFrame(() => {
          setSimilarScrollLeft(container.scrollLeft);
          checkSimilarScrollLimit();
        });
      };
      container.addEventListener("scroll", handleScrollRealtime, { passive: true });
      
      const handleResize = () => {
        setSimilarContainerWidth(container.clientWidth);
        checkSimilarScrollLimit();
      };
      window.addEventListener("resize", handleResize);

      setSimilarScrollLeft(container.scrollLeft);
      setSimilarContainerWidth(container.clientWidth);

      return () => {
        if (container) {
          container.removeEventListener("scroll", handleScrollRealtime);
        }
        if (scrollTimeout) {
          cancelAnimationFrame(scrollTimeout);
        }
        if (similarMomentumId.current) {
          cancelAnimationFrame(similarMomentumId.current);
        }
        if (similarScrollAnimId.current) {
          cancelAnimationFrame(similarScrollAnimId.current);
        }
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [similarProducts]);
  const getUserCommentIdentity = () => {
    if (!currentUser) {
      return {
        author: "Guest Buyer",
        role: "Guest",
        badge: "Guest",
        avatar: "/guest_avatar.jpg",
        avatarBg: "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700"
      };
    }

    if (currentUser.role === "Merchant") {
      const currentStoreNameLower = (selectedStore?.name || "").toLowerCase().trim();
      const currentStoreId = selectedStore?.id;
      
      const merchantStoreName = (myStore?.name || currentUser.storeName || currentUser.name || "Tapis Berbères Ath Yenni").trim();
      const merchantStoreNameLower = merchantStoreName.toLowerCase();
      const myStoreId = myStore?.id;
      const merchantLogo = myStore?.logo || "/src/assets/images/berber_store_logo_1780094183818.png";

      const isThisStoreOwner =
        (Boolean(myStoreId) && Boolean(currentStoreId) && myStoreId === currentStoreId) ||
        (Boolean(currentStoreNameLower) &&
          Boolean(merchantStoreNameLower) &&
          (currentStoreNameLower === merchantStoreNameLower ||
            currentStoreNameLower.includes(merchantStoreNameLower) ||
            merchantStoreNameLower.includes(currentStoreNameLower)));

      if (isThisStoreOwner) {
        return {
          author: selectedStore.name || merchantStoreName,
          role: "Store Admin",
          badge: "Store Admin",
          avatar: selectedStore.logo || merchantLogo || "⭐",
          avatarBg: "bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950 dark:text-indigo-200 dark:border-indigo-800"
        };
      } else {
        return {
          author: merchantStoreName,
          role: "Merchant",
          badge: "Merchant",
          avatar: merchantLogo,
          avatarBg: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-800"
        };
      }
    }

    // Default for signed in user (Buyer / Shopper):
    const customAvatar = (currentUser as any)?.avatar || (currentUser as any)?.photoURL || (currentUser as any)?.profilePic;
    const authorName = currentUser.name || "Shopper";
    const avatarIndex = hashStringToNumber(authorName || currentUser.email || "Shopper") % USER_AVATAR_POOL.length;
    const resolvedShopperAvatar = customAvatar || USER_AVATAR_POOL[avatarIndex];

    return {
      author: authorName,
      role: "Shopper",
      badge: "Shopper",
      avatar: resolvedShopperAvatar,
      avatarBg: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800"
    };
  };
  const isBerberRugProduct =
    selectedProduct.id === "p_1_1" ||
    selectedProduct.name.toLowerCase().includes("rug") ||
    selectedProduct.name.toLowerCase().includes("tapis");

  const colorOptions = selectedProduct.colors && selectedProduct.colors.length > 0
    ? selectedProduct.colors
    : (isBerberRugProduct
        ? [
            { name: "Cream White", hex: "#f5f5f4" },
            { name: "Rust & Crimson", hex: "#9a3412" },
            { name: "Indigo Blue", hex: "#1e3a8a" },
            { name: "Emerald Moss", hex: "#065f46" }
          ]
        : [
            { name: "Classic Silver", hex: "#cbd5e1" },
            { name: "Midnight Black", hex: "#0f172a" },
            { name: "Royal Emerald", hex: "#047857" },
            { name: "Desert Sand", hex: "#f5e0c3" }
          ]);

  const sizeOptions = selectedProduct.sizes && selectedProduct.sizes.length > 0
    ? selectedProduct.sizes
    : (isBerberRugProduct
        ? ["4ft x 6ft", "6ft x 9ft (Generous)", "8ft x 10ft (Grand)"]
        : ["Small (S)", "Standard Medium (M)", "Executive Large (L)", "Custom Oversized (XL)"]);

  const [chosenColor, setChosenColor] = useState(colorOptions[0]?.name || "");
  const [chosenSize, setChosenSize] = useState(sizeOptions[0] || "");

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  const variantOptions = useMemo(() => {
    if (!selectedProduct.variants || selectedProduct.variants.length === 0) return {};
    const options: Record<string, string[]> = {};
    selectedProduct.variants.forEach(v => {
      Object.entries(v.options).forEach(([name, value]) => {
        if (!options[name]) options[name] = [];
        if (!options[name].includes(value)) {
          options[name].push(value);
        }
      });
    });
    return options;
  }, [selectedProduct.variants]);

  const matchedVariant = useMemo(() => {
    if (!selectedProduct.variants || selectedProduct.variants.length === 0) return null;
    return selectedProduct.variants.find(v => {
      return Object.entries(v.options).every(([name, value]) => {
        return (selectedOptions[name] || "").toLowerCase() === (value || "").toLowerCase();
      });
    });
  }, [selectedProduct.variants, selectedOptions]);

  // Dual synchronization to stay compatible
  useEffect(() => {
    if (chosenColor) {
      setSelectedOptions(prev => {
        const colorKey = Object.keys(variantOptions).find(k => k.toLowerCase() === "color") || "Color";
        if (prev[colorKey] === chosenColor) return prev;
        return { ...prev, [colorKey]: chosenColor };
      });
    }
  }, [chosenColor, variantOptions]);

  useEffect(() => {
    if (chosenSize) {
      setSelectedOptions(prev => {
        const sizeKey = Object.keys(variantOptions).find(k => k.toLowerCase() === "size") || "Size";
        if (prev[sizeKey] === chosenSize) return prev;
        return { ...prev, [sizeKey]: chosenSize };
      });
    }
  }, [chosenSize, variantOptions]);

  useEffect(() => {
    if (selectedProduct.variants && selectedProduct.variants.length > 0) {
      const initial: Record<string, string> = {};
      Object.entries(variantOptions).forEach(([name, values]) => {
        initial[name] = values[0] || "";
      });
      setSelectedOptions(initial);
      const colorKey = Object.keys(variantOptions).find(k => k.toLowerCase() === "color");
      const sizeKey = Object.keys(variantOptions).find(k => k.toLowerCase() === "size");
      if (colorKey && initial[colorKey]) {
        setChosenColor(initial[colorKey]);
      }
      if (sizeKey && initial[sizeKey]) {
        setChosenSize(initial[sizeKey]);
      }
    }
  }, [selectedProduct.variants, variantOptions]);

  const isDiscountEnabled = !!selectedProduct.discountEnabled;
  const discountPercentValue = selectedProduct.discountPercent !== undefined ? selectedProduct.discountPercent : 15;
  const variantBasePrice = matchedVariant?.price !== undefined ? matchedVariant.price : selectedProduct.price;
  const activePrice = isBerberRugProduct
    ? 28900
    : (isDiscountEnabled
        ? Math.round(variantBasePrice * (1 - discountPercentValue / 100))
        : variantBasePrice);

  const galleryImages =
    matchedVariant?.images && matchedVariant.images.length > 0
      ? matchedVariant.images
      : selectedProduct.images && selectedProduct.images.length > 0
      ? selectedProduct.images
      : selectedProduct.imageUrl
      ? [selectedProduct.imageUrl]
      : [];

  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [isOutOfStockState, setIsOutOfStockState] = useState(selectedProduct.stock <= 0);
  const [hasNotified, setHasNotified] = useState(false);

  // Tracks recently viewed products (max 5) in sessionStorage
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  useEffect(() => {
    if (!selectedProduct) return;
    try {
      // Create a lightweight copy of product object to save storage space & avoid quota errors
      const sanitizeProductForStorage = (p: any): Product => {
        if (!p) return {} as Product;
        const firstImg = p.imageUrl || (p.images && p.images[0]) || "";
        // If image is a huge data URL (> 200KB), omit or keep standard URL
        const safeImg = typeof firstImg === "string" && firstImg.length > 200000 ? "" : firstImg;
        return {
          id: p.id,
          name: p.name,
          price: p.price,
          originalPrice: p.originalPrice,
          imageUrl: safeImg,
          images: safeImg ? [safeImg] : [],
          category: p.category,
          rating: p.rating,
          reviewsCount: p.reviewsCount,
          badge: p.badge,
          stock: p.stock,
          storeId: p.storeId,
          storeName: p.storeName,
          status: p.status || "active",
          reviews: p.reviews || [],
          description_ar: "",
          description_fr: "",
          description_en: "",
          tags: p.tags || [],
        } as unknown as Product;
      };

      const sanitizedCurrent = sanitizeProductForStorage(selectedProduct);

      const saved = sessionStorage.getItem("recently_viewed_products");
      let list: Product[] = [];
      if (saved) {
        try {
          list = JSON.parse(saved);
        } catch {
          list = [];
        }
      }
      
      // Filter out current product to avoid duplicate and sanitize existing items
      list = list
        .filter((p: any) => p && p.id !== selectedProduct.id)
        .map((p) => sanitizeProductForStorage(p));
      
      // Insert current product at the top
      list.unshift(sanitizedCurrent);
      
      // Limit to 5
      list = list.slice(0, 5);
      
      // Safely set item in sessionStorage with quota fallback
      try {
        sessionStorage.setItem("recently_viewed_products", JSON.stringify(list));
      } catch (quotaErr) {
        console.warn("sessionStorage quota reached for recently viewed products. Trimming...", quotaErr);
        // Fallback: save only IDs and names or clear key if storage is completely full
        try {
          const minimalList = list.slice(0, 3).map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
          }));
          sessionStorage.setItem("recently_viewed_products", JSON.stringify(minimalList));
        } catch {
          sessionStorage.removeItem("recently_viewed_products");
        }
      }
      setRecentlyViewed(list);
    } catch (e) {
      console.warn("Safe recovery from sessionStorage error:", e);
    }
  }, [selectedProduct]);
  const [shareCopied, setShareCopied] = useState(false);
  const [purchaseQty, setPurchaseQty] = useState(1);

  const handleShareProduct = () => {
    const productUrl = `${window.location.origin}/?product=${selectedProduct.id || encodeURIComponent(selectedProduct.name)}`;
    navigator.clipboard.writeText(productUrl).then(() => {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }).catch((err) => {
      console.error("Failed to copy link: ", err);
    });
  };
  const [showPreviewHeader, setShowPreviewHeader] = useState<boolean>(true);
  const previewLastScrollY = useRef<number>(0);

  // Responsive device/viewport checking
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (selectedProduct) {
      trackAdViewContent(selectedProduct, selectedStore?.name);
    }
  }, [selectedProduct, selectedStore]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Countdown timer simulation for daily deals
  const [timeLeft, setTimeLeft] = useState(() => {
    if (selectedProduct.timerEnabled && selectedProduct.timerHours !== undefined) {
      return { hrs: selectedProduct.timerHours, mins: 0, secs: 0 };
    }
    return { hrs: 19, mins: 42, secs: 15 };
  });

  // Promo timer multi-color cycle (every 5 seconds)
  const [timerColorIndex, setTimerColorIndex] = useState(0);
  useEffect(() => {
    const colorInterval = setInterval(() => {
      setTimerColorIndex((prev) => (prev + 1) % 5);
    }, 5000);
    return () => clearInterval(colorInterval);
  }, []);

  const timerStyles = [
    {
      container: "bg-amber-600/5 text-amber-800 border-amber-600/15",
      badge: "bg-amber-600 text-white"
    },
    {
      container: "bg-emerald-600/5 text-emerald-800 border-emerald-600/15",
      badge: "bg-emerald-600 text-white"
    },
    {
      container: "bg-rose-600/5 text-rose-800 border-rose-600/15",
      badge: "bg-rose-600 text-white"
    },
    {
      container: "bg-indigo-600/5 text-indigo-800 border-indigo-600/15",
      badge: "bg-indigo-600 text-white"
    },
    {
      container: "bg-fuchsia-600/5 text-fuchsia-800 border-fuchsia-600/15",
      badge: "bg-fuchsia-600 text-white"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { hrs: prev.hrs, mins: prev.mins - 1, secs: 59 };
        if (prev.hrs > 0) return { hrs: prev.hrs - 1, mins: 59, secs: 59 };
        // If countdown finishes, reset back or stay 0
        if (selectedProduct.timerEnabled) {
          return { hrs: 0, mins: 0, secs: 0 };
        }
        return { hrs: 24, mins: 0, secs: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [selectedProduct.timerEnabled]);

  const [showColorOptions, setShowColorOptions] = useState(true);
  const [showSizeOptions, setShowSizeOptions] = useState(true);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string>( "");
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(() => {
    const saved = localStorage.getItem("dz_showcase_autoplay");
    return saved === null ? true : saved === "true";
  });
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isSeeking, setIsSeeking] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(() => {
    const saved = localStorage.getItem("dz_showcase_volume");
    return saved === null ? 80 : parseInt(saved, 10);
  });
  const [prevVolume, setPrevVolume] = useState<number>(80);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<any>(null);

  const handleToggleAutoPlay = (val: boolean) => {
    setIsAutoPlay(val);
    localStorage.setItem("dz_showcase_autoplay", String(val));
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    localStorage.setItem("dz_showcase_volume", String(newVol));
    
    // sync iframe YT if exists
    if (playerRef.current && typeof playerRef.current.setVolume === "function") {
      try {
        playerRef.current.setVolume(newVol);
        if (newVol > 0 && typeof playerRef.current.unMute === "function") {
          playerRef.current.unMute();
        } else if (newVol === 0 && typeof playerRef.current.mute === "function") {
          playerRef.current.mute();
        }
      } catch (e) {}
    }
    
    // sync direct video if exists
    if (videoRef.current) {
      videoRef.current.volume = newVol / 100;
      videoRef.current.muted = newVol === 0;
    }
  };

  // Load and sync YouTube Player and local states
  useEffect(() => {
    if (isVideoOpen) {
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(true); // Preemptively set to true to hide the overlay while loading

      const activeUrl = activeVideoUrl || productVideoList[0] || selectedProduct.videoUrl || "";
      const currentVideoInfo = getVideoEmbedResult(activeUrl);

      if (currentVideoInfo.type === "youtube") {
        if (!(window as any).YT) {
          const tag = document.createElement("script");
          tag.src = "https://www.youtube.com/iframe_api";
          const firstScriptTag = document.getElementsByTagName("script")[0];
          firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
        }

        let player: any;
        let timer: NodeJS.Timeout;

        const initYTPlayer = () => {
          if ((window as any).YT && (window as any).YT.Player) {
            try {
              player = new (window as any).YT.Player("youtube-player-iframe", {
                events: {
                  onReady: (event: any) => {
                    setDuration(event.target.getDuration() || 0);
                    try {
                      event.target.setVolume(volume);
                      if (volume === 0) {
                        event.target.mute();
                      } else {
                        event.target.unMute();
                      }
                    } catch (e) {}

                    // Always autoplay the video on load
                    try {
                      event.target.playVideo();
                      setIsPlaying(true);
                    } catch (e) {
                      try {
                        event.target.mute();
                        event.target.playVideo();
                        setIsPlaying(true);
                      } catch (err) {}
                    }
                  },
                  onStateChange: (event: any) => {
                    const state = event.target.getPlayerState();
                    // YT States: 1 = PLAYING, 2 = PAUSED, 0 = ENDED, 3 = BUFFERING, -1 = UNSTARTED, 5 = CUED
                    if (state === 2 || state === 0) {
                      setIsPlaying(false);
                    } else if (state === 1 || state === 3) {
                      setIsPlaying(true);
                    }
                  }
                }
              });
              playerRef.current = player;
            } catch (e) {}
          } else {
            timer = setTimeout(initYTPlayer, 200);
          }
        };

        initYTPlayer();

        return () => {
          if (timer) clearTimeout(timer);
          if (playerRef.current && playerRef.current.destroy) {
            try {
              playerRef.current.destroy();
            } catch (e) {}
            playerRef.current = null;
          }
        };
      } else if (currentVideoInfo.type === "direct") {
        const playDirect = async () => {
          await new Promise((r) => setTimeout(r, 100));
          if (videoRef.current) {
            videoRef.current.volume = volume / 100;
            videoRef.current.muted = volume === 0;
            // Always try automatic play for direct formats
            try {
              await videoRef.current.play();
              setIsPlaying(true);
            } catch (err) {
              if (videoRef.current) {
                videoRef.current.muted = true;
                try {
                  await videoRef.current.play();
                  setIsPlaying(true);
                } catch (e2) {}
              }
            }
          }
        };
        playDirect();
      }
    } else {
      setIsPlaying(false);
      if (playerRef.current && playerRef.current.destroy) {
        try {
          playerRef.current.destroy();
        } catch (e) {}
        playerRef.current = null;
      }
    }
  }, [isVideoOpen, activeVideoUrl, selectedProduct.videoUrl, isAutoPlay]);

  // Polling loop to sync time of playing video
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isVideoOpen) {
      interval = setInterval(() => {
        const activeUrl = activeVideoUrl || productVideoList[0] || selectedProduct.videoUrl || "";
        const currentVideoInfo = getVideoEmbedResult(activeUrl);

        if (currentVideoInfo.type === "youtube" && playerRef.current && typeof playerRef.current.getCurrentTime === "function") {
          try {
            if (!isSeeking) {
              const apiTime = playerRef.current.getCurrentTime();
              if (typeof apiTime === "number") {
                setCurrentTime(apiTime);
              }
            }
            const dur = playerRef.current.getDuration();
            if (dur && dur !== duration) {
              setDuration(dur);
            }
          } catch (e) {}
        } else if (currentVideoInfo.type === "direct" && videoRef.current) {
          if (!isSeeking) {
            setCurrentTime(videoRef.current.currentTime || 0);
          }
          if (videoRef.current.duration && videoRef.current.duration !== duration) {
            setDuration(videoRef.current.duration);
          }
        }
      }, 250);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isVideoOpen, activeVideoUrl, selectedProduct.videoUrl, isSeeking, duration]);
  const getSafeAccentColor = useCallback((colorHex: string, fallback = "#2563eb") => {
    if (!colorHex || typeof colorHex !== "string") return fallback;
    const hex = colorHex.replace("#", "").trim();
    if (hex.length !== 6) return fallback;
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return fallback;
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    if (brightness > 180) {
      return "#1e293b";
    }
    return colorHex;
  }, []);

  const [activeThemeColor, setActiveThemeColor] = useState(
    currentSlideColor || colorOptions[0]?.hex || "#e47911"
  );

  const themeAccentColor = useMemo(
    () => getSafeAccentColor(activeThemeColor, "#2563eb"),
    [activeThemeColor, getSafeAccentColor]
  );
  const [descLang, setDescLang] = useState<"en" | "fr" | "ar">("en");

  useEffect(() => {
    if (selectedProduct.description_en) {
      setDescLang("en");
    } else if (selectedProduct.description_fr) {
      setDescLang("fr");
    } else if (selectedProduct.description_ar) {
      setDescLang("ar");
    } else {
      setDescLang("en");
    }
  }, [selectedProduct.id]);

  useEffect(() => {
    setActiveImgIdx(0);
    setPurchaseQty(1);
    setIsOutOfStockState(selectedProduct.stock <= 0);

    const modalRoot = document.getElementById("product-preview-modal-root");
    if (modalRoot) {
      modalRoot.scrollTop = 0;
    }
    window.scrollTo(0, 0);

    const currentColors = selectedProduct.colors && selectedProduct.colors.length > 0
      ? selectedProduct.colors
      : (isBerberRugProduct
          ? [
              { name: "Cream White", hex: "#f5f5f4" },
              { name: "Rust & Crimson", hex: "#9a3412" },
              { name: "Indigo Blue", hex: "#1e3a8a" },
              { name: "Emerald Moss", hex: "#065f46" }
            ]
          : [
              { name: "Classic Silver", hex: "#475569" },
              { name: "Midnight Black", hex: "#0f172a" },
              { name: "Royal Emerald", hex: "#047857" },
              { name: "Desert Sand", hex: "#d97706" }
            ]);

    const currentSizes = selectedProduct.sizes && selectedProduct.sizes.length > 0
      ? selectedProduct.sizes
      : (isBerberRugProduct
          ? ["4ft x 6ft", "6ft x 9ft (Generous)", "8ft x 10ft (Grand)"]
          : ["Small (S)", "Standard Medium (M)", "Executive Large (L)", "Custom Oversized (XL)"]);

    if (currentColors && currentColors.length > 0) {
      setChosenColor(currentColors[0].name);
      setActiveThemeColor(currentColors[0].hex || "#e47911");
    } else {
      setChosenColor("");
    }
    if (currentSizes && currentSizes.length > 0) {
      setChosenSize(currentSizes[0]);
    } else {
      setChosenSize("");
    }
  }, [selectedProduct.id]);

  useEffect(() => {
    if (currentSlideColor) {
      setActiveThemeColor(currentSlideColor);
    }
  }, [currentSlideColor]);

  // Resolve shipping rates from prop, store config, state, or localStorage
  const activeRates = (() => {
    if (shippingRates) return shippingRates;
    if ((selectedStore as any)?.shippingConfig) return (selectedStore as any).shippingConfig;
    if ((selectedStore as any)?.shippingSettings) return (selectedStore as any).shippingSettings;
    try {
      const saved = localStorage.getItem("custom_shipping_rates");
      return saved ? JSON.parse(saved) : {
        algiers: 400,
        major: 600,
        sahara: 950,
        standard: 750,
        isFlatRate: false,
        flatRateAmount: 600
      };
    } catch {
      return {
        algiers: 400,
        major: 600,
        sahara: 950,
        standard: 750,
        isFlatRate: false,
        flatRateAmount: 600
      };
    }
  })();

  const DELIVERY_COMPANIES = useMemo(() => [
    { id: "yalidine", name: "Yalidine Express", color: "text-red-600 bg-red-50 border-red-200" },
    { id: "guex", name: "Guex Express", color: "text-orange-600 bg-orange-50 border-orange-200" },
    { id: "maystro", name: "Maystro Delivery", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
    { id: "kazitour", name: "Kazitour Express", color: "text-purple-600 bg-purple-50 border-purple-200" },
    { id: "zr_express", name: "ZR Express", color: "text-blue-600 bg-blue-50 border-blue-200" },
    { id: "flex", name: "FLEX Courier", color: "text-cyan-600 bg-cyan-50 border-cyan-200" },
    { id: "colisdz", name: "ColisDZ Logistics", color: "text-teal-600 bg-teal-50 border-teal-200" },
    { id: "store_courier", name: "Boutique Courier", color: "text-amber-600 bg-amber-50 border-amber-200" },
  ], []);

  const COUNTRIES = [
    { code: "DZ", name: "Algeria", currency: "DA" },
    { code: "FR", name: "France", currency: "EUR" },
    { code: "TN", name: "Tunisia", currency: "TND" },
    { code: "INT", name: "International", currency: "USD" },
  ];

  const WILAYA_COMMUNES: Record<string, string[]> = {
    "16": ["Algiers Center", "Bab El Oued", "Hydra", "El Harrach", "Zeralda", "Sidi M'Hamed", "Kouba", "Dar El Beida", "Cheraga", "Ben Aknoun", "Bir Mourad Rais", "Dely Ibrahim"],
    "31": ["Oran City", "Es Senia", "Bir El Djir", "Ain El Turk", "Arzew", "Bethioua", "Mers El Kebir", "Gdyel"],
    "25": ["Constantine", "El Khroub", "Hamma Bouziane", "Didouche Mourad", "Zighoud Youcef", "Ain Smara"],
    "15": ["Tizi Ouzou", "Azazga", "Ath Yenni", "Boghni", "Draa Ben Khedda", "Tigzirt", "Azeffoun", "Larbaa Nath Irathen"],
    "09": ["Blida", "Boufarik", "Ouled Yaich", "El Affroun", "Mouzaia", "Larbaa"],
    "06": ["Bejaia", "Amizour", "Akbou", "El Kseur", "Sidi Aich", "Tichy", "Aokas"],
    "19": ["Setif", "El Eulma", "Ain Oulmene", "Ain Arnat", "Babor", "Bougaa"],
    "23": ["Annaba", "El Bouni", "El Hadjar", "Seraidi", "Berrahal"],
    "35": ["Boumerdes", "Khemis El Khechna", "Bordj Menaiel", "Dellys", "Boudouaou"],
    "13": ["Tlemcen", "Mansourah", "Chetouane", "Maghnia", "Remchi", "Ghazaouet"],
    "30": ["Ouargla", "Hassi Messaoud", "Touggourt", "N'Goussa"],
    "47": ["Ghardaia", "El Guerrara", "Metlili", "Bounoura", "Zelfana"],
  };

  // Algeria Yalidine/Local Delivery Configuration
  const baseWilayas = ALGERIA_58_WILAYAS.map((w) => {
    let time = "2-3 Days";
    const num = parseInt(w.code);
    if (num === 16 || [9, 15, 35].includes(num)) time = "24-48 Hours";
    else if ([1, 11, 33, 37, 52, 56, 57, 58].includes(num)) time = "5-7 Days";
    else if ([8, 30, 47, 49, 50, 51, 53, 54, 55].includes(num)) time = "3-5 Days";
    return {
      id: w.code,
      name: w.formattedName,
      time,
    };
  });

  const ALGERIAN_WILAYAS = baseWilayas.map((w) => {
    const codeNum = parseInt(w.id);
    let homePrice = 400;
    let stopdeskPrice = 250;

    if (activeRates.isFlatRate) {
      homePrice = activeRates.flatRateAmount;
      stopdeskPrice = Math.max(100, activeRates.flatRateAmount - 150);
    } else if (codeNum === 16) {
      homePrice = activeRates.algiers;
      stopdeskPrice = Math.max(100, activeRates.algiers - 150);
    } else if ([47, 49, 1, 11, 33, 37, 52, 57, 3, 8, 30, 48].includes(codeNum)) { // Southern Sahara provinces
      homePrice = activeRates.sahara;
      stopdeskPrice = Math.max(100, activeRates.sahara - 250);
    } else if ([31, 23, 25, 19, 9, 35, 6, 15, 18, 27].includes(codeNum)) { // Coastal / major city provinces
      homePrice = activeRates.major;
      stopdeskPrice = Math.max(100, activeRates.major - 200);
    } else {
      homePrice = activeRates.standard;
      stopdeskPrice = Math.max(100, activeRates.standard - 200);
    }

    return {
      ...w,
      homePrice,
      stopdeskPrice,
    };
  });

  // Location States (Worldwide Country -> State/Province -> City)
  const [selectedCountryCode, setSelectedCountryCode] = useState("DZ");
  const [selectedCountryName, setSelectedCountryName] = useState("Algeria");
  const [selectedStateCode, setSelectedStateCode] = useState("06");
  const [selectedStateName, setSelectedStateName] = useState("06 - Bejaia");
  const [selectedCityName, setSelectedCityName] = useState("Bejaia");

  const [selectedDeliveryCompanyId, setSelectedDeliveryCompanyId] = useState("yalidine");
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [streetAddress, setStreetAddress] = useState("");
  const [shippingMethod, setShippingMethod] = useState<"home" | "stopdesk">("home");
  const [isShippingOpen, setIsShippingOpen] = useState(false);
  const [isShippingCalculated, setIsShippingCalculated] = useState(false);
  const hasUserSelectedShippingLocation = useRef(false);

  // Auto-detect user country, state, and city by IP on mount
  useEffect(() => {
    detectUserLocationByIP().then((loc) => {
      if (hasUserSelectedShippingLocation.current) return;
      if (!loc || !loc.countryCode) return;

      const countries = getWorldwideCountries();
      const matchedCountry = countries.find(
        (c) => c.code === loc.countryCode || (loc.countryName && c.name.toLowerCase() === loc.countryName.toLowerCase())
      ) || countries.find((c) => c.code === "DZ") || countries[0];

      if (matchedCountry) {
        setSelectedCountryCode(matchedCountry.code);
        setSelectedCountryName(matchedCountry.name);

        const states = getStatesByCountryCode(matchedCountry.code);
        if (states.length > 0) {
          let foundState = loc.stateCode
            ? states.find((s) => s.code === loc.stateCode || s.code === String(loc.stateCode).padStart(2, "0"))
            : undefined;

          if (!foundState && loc.stateName) {
            const rawName = loc.stateName.toLowerCase().trim();
            foundState = states.find(
              (s) =>
                s.name.toLowerCase() === rawName ||
                s.formattedName.toLowerCase().includes(rawName) ||
                rawName.includes(s.name.toLowerCase())
            );
          }

          if (!foundState) {
            foundState = matchedCountry.code === "DZ"
              ? (states.find((s) => s.code === "16" || s.code === "06") || states[0])
              : states[0];
          }

          setSelectedStateCode(foundState.code);
          setSelectedStateName(foundState.formattedName || foundState.name);

          const cities = getCitiesByState(matchedCountry.code, foundState.code);
          if (cities.length > 0) {
            let foundCity = loc.cityName
              ? cities.find((c) => c.name.toLowerCase() === loc.cityName!.toLowerCase().trim() || c.name.toLowerCase().includes(loc.cityName!.toLowerCase().trim()))
              : undefined;

            if (foundCity) {
              setSelectedCityName(foundCity.name);
            } else if (loc.cityName) {
              setSelectedCityName(loc.cityName);
            } else {
              setSelectedCityName(cities[0].name);
            }
          } else if (loc.cityName) {
            setSelectedCityName(loc.cityName);
          }
        }
      }
    });
  }, []);

  // Country / State / City options memoized
  const countryOptions = useMemo(() => {
    return getWorldwideCountries().map((c) => {
      return {
        code: c.code,
        name: c.name,
        displayLabel: c.name,
      };
    });
  }, []);

  const stateOptions = useMemo(() => {
    const states = getStatesByCountryCode(selectedCountryCode);
    return states.map((s) => ({
      code: s.code,
      name: s.name,
      displayLabel: s.formattedName || s.name,
      subtitle: undefined,
    }));
  }, [selectedCountryCode]);

  const cityOptions = useMemo(() => {
    const cities = getCitiesByState(selectedCountryCode, selectedStateCode || selectedStateName);
    return cities.map((c) => ({
      code: c.name,
      name: c.name,
      displayLabel: c.name,
      subtitle: undefined,
    }));
  }, [selectedCountryCode, selectedStateCode, selectedStateName]);

  // Handlers for Location Selectors
  const handleCountryChange = (opt: SearchOption) => {
    hasUserSelectedShippingLocation.current = true;
    const newCountryCode = opt.code;
    const newCountryName = opt.name;
    setSelectedCountryCode(newCountryCode);
    setSelectedCountryName(newCountryName);

    try {
      localStorage.setItem("express_checkout_last_country", newCountryCode);
    } catch {
      // ignore
    }

    const states = getStatesByCountryCode(newCountryCode);
    if (states && states.length > 0) {
      const firstState = newCountryCode === "DZ"
        ? (states.find((s) => s.code === "06") || states[0])
        : states[0];

      setSelectedStateCode(firstState.code);
      setSelectedStateName(firstState.formattedName || firstState.name);

      const cities = getCitiesByState(newCountryCode, firstState.code);
      if (cities && cities.length > 0) {
        setSelectedCityName(cities[0].name);
      } else {
        setSelectedCityName(`${firstState.name} Center`);
      }
    } else {
      setSelectedStateCode("");
      setSelectedStateName("");
      setSelectedCityName("");
    }
  };

  const handleStateChange = (opt: SearchOption) => {
    hasUserSelectedShippingLocation.current = true;
    const newStateCode = opt.code;
    const newStateName = opt.displayLabel || opt.name;

    setSelectedStateCode(newStateCode);
    setSelectedStateName(newStateName);

    const cities = getCitiesByState(selectedCountryCode, newStateCode);
    if (cities.length > 0) {
      setSelectedCityName(cities[0].name);
    } else {
      setSelectedCityName(`${opt.name} Center`);
    }
  };

  const handleCityChange = (opt: SearchOption) => {
    hasUserSelectedShippingLocation.current = true;
    setSelectedCityName(opt.name);
  };

  // Backwards compatibility aliases
  const selectedCountry = selectedCountryName;
  const selectedWilayaId = selectedStateCode;
  const selectedWilaya = useMemo(() => {
    const found = ALGERIAN_WILAYAS.find(
      (w) => w.id === selectedStateCode || w.name.toLowerCase().includes(selectedStateName.toLowerCase())
    );
    if (found) return found;
    return ALGERIAN_WILAYAS[0];
  }, [ALGERIAN_WILAYAS, selectedStateCode, selectedStateName]);
  const selectedCommune = selectedCityName;

  // Promo Code States
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; percent: number } | null>(null);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");

  const handleApplyPromoCode = (codeToApply?: string) => {
    const code = (codeToApply || promoCodeInput).trim().toUpperCase();
    if (!code) {
      setPromoError("Please enter a promo code");
      setPromoSuccess("");
      return;
    }

    const VALID_PROMOS: Record<string, number> = {
      "WELCOME10": 10,
      "SAVE10": 10,
      "PROMO20": 20,
      "DZ2026": 15,
      "RAMADAN": 15,
      "YUME10": 10,
      "VIP15": 15,
    };

    if (VALID_PROMOS[code]) {
      const percent = VALID_PROMOS[code];
      setAppliedPromo({ code, percent });
      setPromoSuccess(`Promo code '${code}' applied! (${percent}% OFF)`);
      setPromoError("");
    } else if (code.length >= 3) {
      setAppliedPromo({ code, percent: 10 });
      setPromoSuccess(`Promo code '${code}' applied! (10% OFF)`);
      setPromoError("");
    } else {
      setPromoError("Invalid promo code. Try WELCOME10 or SAVE10");
      setPromoSuccess("");
    }
  };

  const handleRemovePromoCode = () => {
    setAppliedPromo(null);
    setPromoCodeInput("");
    setPromoError("");
    setPromoSuccess("");
  };

  // Express Checkout & Thank You States
  const [isExpressCheckoutOpen, setIsExpressCheckoutOpen] = useState(false);
  const [isBottomInlineCheckoutOpen, setIsBottomInlineCheckoutOpen] = useState(false);
  const [isThankYouOpen, setIsThankYouOpen] = useState(false);
  const [placedOrderInfo, setPlacedOrderInfo] = useState<any>(null);
  const [isCopiedOrderId, setIsCopiedOrderId] = useState(false);
  const [shopperTrackingOrder, setShopperTrackingOrder] = useState<Order | null>(null);

  // Guest Registration Flow States
  const [isGuestRegisterOpen, setIsGuestRegisterOpen] = useState(false);
  const [pendingGuestAction, setPendingGuestAction] = useState<'close' | 'track' | 'cart' | null>(null);
  const [pendingCartProduct, setPendingCartProduct] = useState<{ prod: Product; store: MerchantStore; qty: number } | null>(null);
  const [guestRegisterEmail, setGuestRegisterEmail] = useState("");

  const isRegisteredUser = useMemo(() => {
    if (currentUser) {
      const role = (currentUser as any).role || (currentUser as any).accountType;
      if (role === "Guest") return false;
      if (currentUser.email || currentUser.name || role) return true;
    }
    try {
      const savedUserStr = localStorage.getItem("yume_current_user") || localStorage.getItem("yume_user");
      if (savedUserStr) {
        const parsed = JSON.parse(savedUserStr);
        const role = parsed?.role || parsed?.accountType;
        if (role === "Guest") return false;
        if (parsed?.id || parsed?.email || parsed?.name || role) return true;
      }
    } catch (err) {
      console.error("Registered user check error:", err);
    }
    return false;
  }, [currentUser, isGuestRegisterOpen]);

  const handleAddToCartWithGuestCheck = (productToAdd?: any) => {
    const basePrice = activePrice;
    const modifiedProduct = productToAdd || {
      ...selectedProduct,
      price: basePrice,
      name: `${selectedProduct.name} [${chosenColor} / ${chosenSize}]`
    };

    let isAlreadyRegistered = false;
    try {
      const savedUser = localStorage.getItem("yume_user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed?.id || parsed?.email) {
          isAlreadyRegistered = true;
        }
      }
    } catch (err) {
      console.error("User check error:", err);
    }

    if (!isAlreadyRegistered) {
      setPendingCartProduct({ prod: modifiedProduct, store: selectedStore, qty: purchaseQty });
      setPendingGuestAction('cart');
      setIsGuestRegisterOpen(true);
    } else {
      handleAddToCart(modifiedProduct, selectedStore, purchaseQty);
      setCartTab("cart");
      setIsCartOpen(true);
      onClose();
    }
  };

  const openShopperTrackingModal = () => {
    if (!placedOrderInfo) return;
    const wilayaStr = typeof placedOrderInfo.wilaya === 'object' ? (placedOrderInfo.wilaya?.name || "") : String(placedOrderInfo.wilaya || placedOrderInfo.buyer?.wilaya || "");
    const wilayaCodeStr = typeof placedOrderInfo.wilaya === 'object' ? String(placedOrderInfo.wilaya?.code || placedOrderInfo.wilaya?.id || "16") : "16";
    const delCompanyStr = typeof placedOrderInfo.deliveryCompany === 'object' ? (placedOrderInfo.deliveryCompany?.name || "Yalidine Express") : String(placedOrderInfo.deliveryCompany || "Yalidine Express");
    const orderRefId = placedOrderInfo.orderId || placedOrderInfo.id || "ORD-000000";

    const shopperOrder: Order = {
      id: orderRefId,
      storeId: selectedStore?.id || "store-1",
      storeName: selectedStore?.name || "Store",
      date: new Date().toISOString(),
      shopper: {
        name: placedOrderInfo.buyer?.name || "Valued Shopper",
        email: placedOrderInfo.buyer?.email || guestRegisterEmail || buyerEmail || "",
        phone: placedOrderInfo.buyer?.phone || "",
        wilaya: wilayaStr,
        wilayaCode: wilayaCodeStr,
        commune: placedOrderInfo.commune || "",
        address: `${placedOrderInfo.commune || ""}, ${wilayaStr}`
      },
      items: [{
        id: placedOrderInfo.product?.id || "prod-1",
        name: placedOrderInfo.product?.name || selectedProduct?.name || "Product",
        price: placedOrderInfo.product?.price || selectedProduct?.price || 0,
        quantity: placedOrderInfo.qty || 1,
        imageUrl: (placedOrderInfo.product as any)?.image || placedOrderInfo.product?.images?.[0] || ""
      }],
      total: placedOrderInfo.grandTotal || placedOrderInfo.totalPrice || 0,
      shippingCost: placedOrderInfo.shippingFee || 0,
      status: "pending",
      paymentMethod: "cod",
      deliveryCompany: delCompanyStr,
      trackingCode: `DZ-${delCompanyStr.slice(0, 3).toUpperCase()}-${orderRefId.slice(-6)}`
    };
    setShopperTrackingOrder(shopperOrder);
  };

  const handleThankYouAction = (action: 'close' | 'track') => {
    setIsThankYouOpen(false);

    let isAlreadyRegistered = false;
    try {
      const savedUser = localStorage.getItem("yume_user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed?.id || parsed?.email) {
          isAlreadyRegistered = true;
        }
      }
    } catch (err) {
      console.error("User check error:", err);
    }

    if (!isAlreadyRegistered) {
      setPendingGuestAction(action);
      setGuestRegisterEmail(placedOrderInfo?.buyer?.email || buyerEmail || "");
      setIsGuestRegisterOpen(true);
    } else {
      if (action === 'track') {
        openShopperTrackingModal();
      } else {
        onClose();
      }
    }
  };

  const handleCreateGuestAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestRegisterEmail.trim()) {
      alert("Please enter a valid email address.");
      return;
    }

    const newShopperUser = {
      id: "usr_" + Math.random().toString(36).substr(2, 9),
      name: placedOrderInfo?.buyer?.name || buyerFullName || "Valued Shopper",
      email: guestRegisterEmail.trim(),
      phone: placedOrderInfo?.buyer?.phone || buyerPhone || "",
      wilaya: placedOrderInfo?.wilaya?.name || selectedWilaya?.name || "",
      commune: placedOrderInfo?.commune || selectedCommune || "",
      role: "shopper",
      createdAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem("yume_user", JSON.stringify(newShopperUser));
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error("Error saving shopper account:", err);
    }

    setIsGuestRegisterOpen(false);

    if (pendingGuestAction === 'track') {
      openShopperTrackingModal();
    } else if (pendingGuestAction === 'cart' && pendingCartProduct) {
      handleAddToCart(pendingCartProduct.prod, pendingCartProduct.store, pendingCartProduct.qty);
      setCartTab("cart");
      setIsCartOpen(true);
      onClose();
    } else {
      onClose();
    }
    setPendingCartProduct(null);
    setPendingGuestAction(null);
  };

  const handleSocialRegister = (provider: 'gmail' | 'hotmail' | 'instagram' | 'facebook' | 'whatsapp') => {
    const rawName = placedOrderInfo?.buyer?.name || buyerFullName || "Valued Shopper";
    const rawPhone = placedOrderInfo?.buyer?.phone || buyerPhone || "";
    const cleanHandle = rawName.toLowerCase().replace(/[^a-z0-9]/g, '.');

    let userEmail = guestRegisterEmail.trim() || placedOrderInfo?.buyer?.email || buyerEmail || "";
    if (!userEmail) {
      if (provider === 'gmail') userEmail = `${cleanHandle}@gmail.com`;
      else if (provider === 'hotmail') userEmail = `${cleanHandle}@hotmail.com`;
      else if (provider === 'instagram') userEmail = `${cleanHandle}@instagram.com`;
      else if (provider === 'facebook') userEmail = `${cleanHandle}@facebook.com`;
      else if (provider === 'whatsapp') userEmail = `${rawPhone ? rawPhone.replace(/\D/g, '') : cleanHandle}@whatsapp.com`;
    }

    const providerNames: Record<string, string> = {
      gmail: "Gmail (Google)",
      hotmail: "Hotmail / Outlook",
      instagram: "Instagram",
      facebook: "Facebook",
      whatsapp: "WhatsApp"
    };

    const newShopperUser = {
      id: "usr_" + Math.random().toString(36).substr(2, 9),
      name: rawName,
      email: userEmail,
      phone: rawPhone,
      wilaya: placedOrderInfo?.wilaya?.name || selectedWilaya?.name || "",
      commune: placedOrderInfo?.commune || selectedCommune || "",
      role: "shopper",
      provider: provider,
      linkedApp: providerNames[provider],
      autoSignInConnected: true,
      createdAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem("yume_user", JSON.stringify(newShopperUser));
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error("Error saving social account:", err);
    }

    setIsGuestRegisterOpen(false);

    if (pendingGuestAction === 'track') {
      openShopperTrackingModal();
    } else if (pendingGuestAction === 'cart' && pendingCartProduct) {
      handleAddToCart(pendingCartProduct.prod, pendingCartProduct.store, pendingCartProduct.qty);
      setCartTab("cart");
      setIsCartOpen(true);
      onClose();
    } else {
      onClose();
    }
    setPendingCartProduct(null);
    setPendingGuestAction(null);
  };

  const handleGuestMaybeLater = () => {
    setIsGuestRegisterOpen(false);
    if (pendingGuestAction === 'track') {
      openShopperTrackingModal();
    } else if (pendingGuestAction === 'cart' && pendingCartProduct) {
      handleAddToCart(pendingCartProduct.prod, pendingCartProduct.store, pendingCartProduct.qty);
      setCartTab("cart");
      setIsCartOpen(true);
      onClose();
    } else {
      onClose();
    }
    setPendingCartProduct(null);
    setPendingGuestAction(null);
  };

  // Buyer Info Form States
  const [buyerFullName, setBuyerFullName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [userPhoneList, setUserPhoneList] = useState<string[]>([]);
  const [buyerWhatsapp, setBuyerWhatsapp] = useState("");
  const [buyerViber, setBuyerViber] = useState("");
  const [buyerTelegram, setBuyerTelegram] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [isSummaryPanelOpen, setIsSummaryPanelOpen] = useState(true);
  const [isMessagingAppsOpen, setIsMessagingAppsOpen] = useState(false);

  // Form field touched & validation error states
  const [fullNameTouched, setFullNameTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [streetAddressTouched, setStreetAddressTouched] = useState(false);
  const [termsErrorHighlight, setTermsErrorHighlight] = useState(false);
  const [formValidationErrors, setFormValidationErrors] = useState<string[]>([]);

  // Memoized Real-Time Validation
  const fullNameValidation = useMemo(() => {
    return validateFullName(buyerFullName);
  }, [buyerFullName]);

  const currentCountryObj = useMemo(() => {
    const countries = getWorldwideCountries();
    return countries.find((c) => c.code === selectedCountryCode) || countries[0];
  }, [selectedCountryCode]);

  const phoneValidation = useMemo(() => {
    const dialCode = currentCountryObj?.phonecode || "213";
    return validatePhoneNumber(buyerPhone, selectedCountryCode, dialCode);
  }, [buyerPhone, selectedCountryCode, currentCountryObj]);

  // Helper to get authenticated user profile data
  const getAuthenticatedUserProfile = useCallback(() => {
    if (currentUser) {
      const role = (currentUser as any).role || (currentUser as any).accountType;
      if (role === "Guest") return null;
    }

    let savedUser: any = null;
    try {
      const raw = localStorage.getItem("yume_current_user") || localStorage.getItem("yume_user") || localStorage.getItem("shopper_profile");
      if (raw) {
        savedUser = JSON.parse(raw);
      }
    } catch (err) {
      console.error("Error reading saved user profile:", err);
    }

    if (currentUser && (currentUser as any).role !== "Guest") {
      return { ...myStore, ...savedUser, ...currentUser };
    }

    if (savedUser && savedUser.role !== "Guest") {
      return { ...myStore, ...savedUser };
    }

    if (myStore) {
      return { ...myStore };
    }

    return null;
  }, [currentUser, myStore]);

  // Auto-fill logged in user profile when Express Checkout opens (keep guest data completely blank)
  useEffect(() => {
    if (isExpressCheckoutOpen || isBottomInlineCheckoutOpen) {
      const profile = getAuthenticatedUserProfile();

      // Do not prefill any personal data for guest users
      if (!profile) return;

      // Auto-fill full name (checking merchant representative full name from setting form as well)
      const nameToFill =
        profile.merchantFullName ||
        profile.merchantRepresentativeFullName ||
        profile.merchantRepresentativeName ||
        profile.representativeFullName ||
        profile.representativeName ||
        (myStore as any)?.merchantFullName ||
        (myStore as any)?.merchantName ||
        (myStore as any)?.representativeName ||
        (myStore as any)?.contactPerson ||
        profile.fullName ||
        profile.name ||
        profile.displayName ||
        "";

      if (nameToFill && !buyerFullName) {
        setBuyerFullName(nameToFill);
      }

      // Extract and auto-fill phone number(s)
      const extractedPhones: string[] = [];
      if (profile.phones && Array.isArray(profile.phones)) {
        profile.phones.forEach((p: any) => {
          if (typeof p === "string" && p.trim() && !extractedPhones.includes(p.trim())) {
            extractedPhones.push(p.trim());
          }
        });
      }
      const rawPhones = [profile.phone, profile.mobile, profile.phoneNumber, profile.shopper?.phone].filter(Boolean);
      rawPhones.forEach((ph: any) => {
        if (typeof ph === "string" && ph.trim()) {
          ph.split(/[,/;]/).forEach((part) => {
            const clean = part.trim();
            if (clean && !extractedPhones.includes(clean)) {
              extractedPhones.push(clean);
            }
          });
        }
      });

      setUserPhoneList(extractedPhones);

      if (extractedPhones.length > 0 && !buyerPhone) {
        setBuyerPhone(extractedPhones[0]);
      }

      // Auto-fill extra contact options (WhatsApp, Telegram, Viber)
      const wa = profile.whatsapp || profile.socials?.whatsapp || "";
      if (wa && !buyerWhatsapp) setBuyerWhatsapp(wa);

      const vi = profile.viber || profile.socials?.viber || "";
      if (vi && !buyerViber) setBuyerViber(vi);

      const tg = profile.telegram || profile.socials?.telegram || "";
      if (tg && !buyerTelegram) setBuyerTelegram(tg);

      if ((wa || vi || tg) && !isMessagingAppsOpen) {
        setIsMessagingAppsOpen(true);
      }

      // Auto-fill email
      const em = profile.email || profile.shopper?.email || "";
      if (em && !buyerEmail) setBuyerEmail(em);

      // Auto-fill country, state, city from profile if user hasn't selected custom location in shipping calculator
      if (!hasUserSelectedShippingLocation.current) {
        const cntry = profile.country || profile.shopper?.country;
        if (cntry) {
          const countries = getWorldwideCountries();
          const matchedCountry = countries.find(
            (c) => c.name.toLowerCase() === cntry.toLowerCase() || c.code.toLowerCase() === cntry.toLowerCase()
          );
          if (matchedCountry) {
            setSelectedCountryCode(matchedCountry.code);
            setSelectedCountryName(matchedCountry.name);
          }
        }

        const targetWilaya = profile.wilaya || profile.state || profile.province || profile.shopper?.wilaya;
        if (targetWilaya) {
          const wilayaStr = typeof targetWilaya === "object" ? (targetWilaya.name || "") : String(targetWilaya);
          const wilayaIdStr = typeof targetWilaya === "object" ? String(targetWilaya.id || targetWilaya.code || "") : "";

          const states = getStatesByCountryCode(selectedCountryCode);
          const foundState = states.find(
            (s) =>
              (wilayaIdStr && s.code === wilayaIdStr) ||
              s.name.toLowerCase() === wilayaStr.toLowerCase() ||
              s.formattedName.toLowerCase() === wilayaStr.toLowerCase() ||
              s.name.toLowerCase().includes(wilayaStr.toLowerCase())
          );

          if (foundState) {
            setSelectedStateCode(foundState.code);
            setSelectedStateName(foundState.formattedName || foundState.name);

            const targetCommune = profile.commune || profile.city || profile.shopper?.commune;
            const cities = getCitiesByState(selectedCountryCode, foundState.code);
            if (targetCommune) {
              const matchedCity = cities.find((c) => c.name.toLowerCase() === String(targetCommune).toLowerCase());
              if (matchedCity) setSelectedCityName(matchedCity.name);
              else if (cities.length > 0) setSelectedCityName(cities[0].name);
            } else if (cities.length > 0) {
              setSelectedCityName(cities[0].name);
            }
          }
        }
      }

      // Do NOT auto-fill street address with store or example address ("Route d'Ath Yenni, Béjaïa Centre")
      const shopperAddr = profile.shopper?.address || profile.savedAddress || "";
      const storeAddr = myStore?.address || selectedStore?.address || "";
      if (shopperAddr && shopperAddr !== storeAddr && !shopperAddr.includes("Ath Yenni") && !streetAddress) {
        setStreetAddress(shopperAddr);
      }
    }
  }, [isExpressCheckoutOpen, isBottomInlineCheckoutOpen, getAuthenticatedUserProfile]);

  // Store setting field configurations (configurable show/hide & required/optional)
  const checkoutFieldConfig = useMemo(() => {
    const storeConfig = (selectedStore as any)?.checkoutFields;
    return {
      fullName: { show: storeConfig?.fullName?.show ?? true, required: storeConfig?.fullName?.required ?? true },
      phone: { show: storeConfig?.phone?.show ?? true, required: storeConfig?.phone?.required ?? true },
      messagingApps: { show: storeConfig?.messagingApps?.show ?? true, required: storeConfig?.messagingApps?.required ?? false },
      country: { show: storeConfig?.country?.show ?? true, required: storeConfig?.country?.required ?? true },
      wilaya: { show: storeConfig?.wilaya?.show ?? true, required: storeConfig?.wilaya?.required ?? true },
      commune: { show: storeConfig?.commune?.show ?? true, required: storeConfig?.commune?.required ?? true },
      streetAddress: { show: storeConfig?.streetAddress?.show ?? true, required: storeConfig?.streetAddress?.required ?? false },
      email: { show: storeConfig?.email?.show ?? false, required: storeConfig?.email?.required ?? false },
      terms: { show: storeConfig?.terms?.show ?? true, required: storeConfig?.terms?.required ?? true },
    };
  }, [selectedStore]);

  const isFormValid = useMemo(() => {
    if (checkoutFieldConfig.fullName.required && !fullNameValidation.isValid) return false;
    if (checkoutFieldConfig.phone.required && !phoneValidation.isValid) return false;
    if (!selectedCountryName || !selectedCountryCode) return false;
    if (stateOptions.length > 0 && !selectedStateName) return false;
    if (cityOptions.length > 0 && !selectedCityName) return false;
    if (checkoutFieldConfig.streetAddress.required && !streetAddress.trim()) return false;
    if (checkoutFieldConfig.terms.show && !agreedToTerms) return false;
    return true;
  }, [
    checkoutFieldConfig,
    fullNameValidation.isValid,
    phoneValidation.isValid,
    selectedCountryName,
    selectedCountryCode,
    stateOptions.length,
    selectedStateName,
    cityOptions.length,
    selectedCityName,
    streetAddress,
    agreedToTerms,
  ]);

  // Sync delivery company when selectedProduct specifies one
  useEffect(() => {
    if (selectedProduct?.deliveryCompany) {
      const companyName = selectedProduct.deliveryCompany.toLowerCase();
      const matched = DELIVERY_COMPANIES.find((c) => 
        c.id === companyName ||
        c.name.toLowerCase() === companyName ||
        companyName.includes(c.id) ||
        c.name.toLowerCase().includes(companyName)
      );
      if (matched) {
        setSelectedDeliveryCompanyId(matched.id);
      }
    }
  }, [selectedProduct?.deliveryCompany, DELIVERY_COMPANIES]);

  const selectedDeliveryCompany = useMemo(() => {
    const found = DELIVERY_COMPANIES.find((c) => c.id === selectedDeliveryCompanyId);
    if (found) return found;
    if (selectedProduct?.deliveryCompany) {
      return {
        id: "custom",
        name: selectedProduct.deliveryCompany,
        color: "text-indigo-600 bg-indigo-50 border-indigo-200",
      };
    }
    return DELIVERY_COMPANIES[0];
  }, [selectedDeliveryCompanyId, DELIVERY_COMPANIES, selectedProduct?.deliveryCompany]);

  const companyOffset = useMemo(() => {
    const comp = (selectedDeliveryCompany?.id || selectedDeliveryCompany?.name || "").toLowerCase();
    if (comp.includes("guex")) return { home: 100, desk: 50 };
    if (comp.includes("maystro")) return { home: 150, desk: 100 };
    if (comp.includes("kazitour")) return { home: -50, desk: -50 };
    if (comp.includes("zr")) return { home: 200, desk: 100 };
    if (comp.includes("flex")) return { home: -50, desk: -100 };
    if (comp.includes("boutique") || comp.includes("store")) return { home: 0, desk: -200 };
    return { home: 0, desk: 0 };
  }, [selectedDeliveryCompany]);

  const displayHomePrice = useMemo(() => {
    if (selectedCountryCode !== "DZ" && !selectedCountry.includes("Algeria")) {
      if (selectedCountry.includes("France")) return 2500;
      if (selectedCountry.includes("Tunisia")) return 1800;
      return 4500;
    }
    const step4Cost = selectedProduct?.shippingCost;
    let base = selectedWilaya.homePrice;
    if (step4Cost !== undefined && step4Cost > 0) {
      const wilayaScale = selectedWilaya.homePrice > 0 ? (selectedWilaya.homePrice / 600) : 1;
      base = Math.round(step4Cost * wilayaScale);
    }
    return Math.max(0, base + companyOffset.home);
  }, [selectedCountryCode, selectedCountry, selectedWilaya, selectedProduct?.shippingCost, companyOffset]);

  const displayDeskPrice = useMemo(() => {
    if (selectedCountryCode !== "DZ" && !selectedCountry.includes("Algeria")) {
      if (selectedCountry.includes("France")) return 2200;
      if (selectedCountry.includes("Tunisia")) return 1500;
      return 4000;
    }
    const step4Cost = selectedProduct?.shippingCost;
    let base = selectedWilaya.stopdeskPrice;
    if (step4Cost !== undefined && step4Cost > 0) {
      const ratio = selectedWilaya.homePrice > 0 ? (selectedWilaya.stopdeskPrice / selectedWilaya.homePrice) : 0.75;
      base = Math.round(step4Cost * ratio);
    }
    return Math.max(0, base + companyOffset.desk);
  }, [selectedCountryCode, selectedCountry, selectedWilaya, selectedProduct?.shippingCost, companyOffset]);

  const calculatedShippingFee = useMemo(() => {
    return shippingMethod === "home" ? displayHomePrice : displayDeskPrice;
  }, [shippingMethod, displayHomePrice, displayDeskPrice]);

  const calculatedSubtotal = useMemo(() => {
    return activePrice * purchaseQty;
  }, [activePrice, purchaseQty]);

  const calculatedDiscountAmount = useMemo(() => {
    if (!appliedPromo) return 0;
    return Math.round((calculatedSubtotal * appliedPromo.percent) / 100);
  }, [calculatedSubtotal, appliedPromo]);

  // Grand Total = Items Subtotal - Discount + Auto-calculated Shipping Fee
  const calculatedGrandTotal = useMemo(() => {
    return Math.max(0, calculatedSubtotal - calculatedDiscountAmount + calculatedShippingFee);
  }, [calculatedSubtotal, calculatedDiscountAmount, calculatedShippingFee]);

  // States for hover zoom on product image
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, pxX: 0, pxY: 0 });
  const [activeLandingSectionTab, setActiveLandingSectionTab] = useState<"features" | "whyus" | "craftsmanship">("features");

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const pxX = e.clientX - left;
    const pxY = e.clientY - top;
    // Constrain percentages to 0-100% just in case of slight edge bleed
    const x = Math.max(0, Math.min(100, (pxX / width) * 100));
    const y = Math.max(0, Math.min(100, (pxY / height) * 100));
    setZoomPos({ x, y, pxX, pxY });
  };

  // --- ALGERIAN HERITAGE SENSORY CREATIVE ENGINE ---
  const DYE_SECRETS: Record<string, { dye: string; ritual: string; element: string; icon: string }> = {
    "Cream White": {
      dye: "Pure Unbleached Mountain Fleece",
      ritual: "Hand-washed seven times in the natural springs of Kabylie, scented with dried wild lavender stalks.",
      element: "Natural Flora Eco-Wax",
      icon: "🐑"
    },
    "Rust & Crimson": {
      dye: "Wild Madder Roots & Dried Pomegranate Skins",
      ritual: "Crushed on hand mills, then boiled in heavy iron vats for 12 hours under cedarwood embers.",
      element: "Traditional Organic Alum",
      icon: "🍁"
    },
    "Indigo Blue": {
      dye: "Fermented Northern Sahara Indigo Leaves",
      ritual: "Aged in deep clay amphora jars with local mountain dates to generate rich, oxygenated indigo baths.",
      element: "Ashes of Desert Oakwood",
      icon: "🌀"
    },
    "Emerald Moss": {
      dye: "Thyme Infusions & Mountain Copper Sulfate",
      ritual: "Harvested at high altitudes, boiled together to reveal deep vegetative greens mimicking evergreen forests.",
      element: "Stones of Ochre Mud",
      icon: "🌱"
    },
    "Classic Silver": {
      dye: "Natural Slate Pulverized & Mint Sap",
      ritual: "Ground river slate stone blended with field mint to create defensive shades that ward off ambient humidity.",
      element: "Finest Zinc Mineral Oils",
      icon: "💎"
    },
    "Midnight Black": {
      dye: "Traditional Oak Charcoal & Iron-Rich Mud",
      ritual: "Meticulously double-infused with natural tannin leaves to bind dense, light-proof deep lines.",
      element: "Punica Granatum Juice",
      icon: "🖤"
    },
    "Royal Emerald": {
      dye: "Pressed Mountain Chlorophyte & Wild Clover",
      ritual: "Slow cold-press extraction of high-altitude leaves preserved in honeyed solutions.",
      element: "Kabylie Copper Crystals",
      icon: "❇️"
    },
    "Desert Sand": {
      dye: "Powdered Ocher Sediments & Rosemary Oils",
      ritual: "Harvested from the Sahara-fringe plateaus, massaged directly into warm wet wool before warp knotting.",
      element: "Natural Spring Carbonates",
      icon: "🏜️"
    }
  };

  // Ambient Loom Synthesizer sound engine
  const [isPlayingLoomSound, setIsPlayingLoomSound] = useState(false);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [loomTimerId, setLoomTimerId] = useState<any>(null);

  const handleToggleLoomSound = () => {
    if (isPlayingLoomSound) {
      if (loomTimerId) {
        clearInterval(loomTimerId);
        setLoomTimerId(null);
      }
      setIsPlayingLoomSound(false);
      return;
    }

    try {
      const gWin = window as any;
      const AudioContextClass = gWin.AudioContext || gWin.webkitAudioContext;
      const ctx = audioCtx || new AudioContextClass();
      if (!audioCtx) {
        setAudioCtx(ctx);
      }
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      setIsPlayingLoomSound(true);

      let step = 0;
      const interval = setInterval(() => {
        try {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);

          if (step % 2 === 0) {
            // Wood shuttle sliding (soft white noise or slide)
            osc.type = "sine";
            osc.frequency.setValueAtTime(380, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.12);
            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.11);
            osc.start();
            osc.stop(ctx.currentTime + 0.13);
          } else {
            // Weaver tight knot thump (lower heavy pitch)
            osc.type = "triangle";
            osc.frequency.setValueAtTime(80, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.22);
            gain.gain.setValueAtTime(0.18, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.21);
            osc.start();
            osc.stop(ctx.currentTime + 0.23);
          }
          step += 1;
        } catch (err) {
          console.warn("Synth play error:", err);
        }
      }, 450);

      setLoomTimerId(interval);
    } catch (e) {
      console.warn("Could not initiate native voice synthesizer:", e);
    }
  };

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (loomTimerId) {
        clearInterval(loomTimerId);
      }
    };
  }, [loomTimerId]);

  // Blessings Counter and interaction
  const [blessingCount, setBlessingCount] = useState(4912);
  const [hasBlessed, setHasBlessed] = useState(false);
  const [showBlessingToast, setShowBlessingToast] = useState(false);

  const handleSendBlessing = () => {
    if (hasBlessed) return;
    setBlessingCount(prev => prev + 1);
    setHasBlessed(true);
    setShowBlessingToast(true);
    setTimeout(() => {
      setShowBlessingToast(false);
    }, 4500);
  };

  // Threaded comments state
  const [threadedComments, setThreadedComments] = useState<ThreadedComment[]>([
    {
      id: "c1",
      author: "Fatima K.",
      role: "Shopper",
      badge: "Verified Purchase",
      purchasedVariant: "Black • XL",
      text: "Authentique chef-d'œuvre! La qualité est exceptionnelle, la laine est d'une tendresse rare.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      avatarBg: "bg-purple-100 text-purple-700 border-purple-200",
      time: "2 hours ago",
      likes: 18,
      emoji: "👍",
      parentId: null,
      replies: [
        {
          id: "r1",
          author: `${selectedStore.name} Support`,
          role: "Store Admin",
          text: "Merci infiniment Fatima pour votre soutien aux artisans locaux! Nous sommes ravis que le produit vous plaise.",
          avatar: selectedStore.logo || "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=150&auto=format&fit=crop&q=80",
          avatarBg: "bg-indigo-100 text-indigo-800 border-indigo-300",
          time: "1 hour ago",
          likes: 6,
          emoji: "😊",
          parentId: "c1",
        },
        {
          id: "r2",
          author: "gfhfgh",
          role: "Shopper",
          text: "ghjghjgfjg",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
          avatarBg: "bg-emerald-100 text-emerald-800 border-emerald-300",
          time: "Just now",
          likes: 0,
          emoji: "😊",
          parentId: "c1",
        }
      ]
    }
  ]);

  const [newCommentText, setNewCommentText] = useState("");
  const [replyingToId, setReplyingToId] = useState<string | null>(null);

  const hasUserPurchasedCurrentProduct = useMemo(() => {
    try {
      const saved = localStorage.getItem("yume_cached_orders");
      if (!saved) return false;
      const orders: any[] = JSON.parse(saved);
      return orders.some((ord) => {
        const prodId = selectedProduct?.id;
        const prodName = selectedProduct?.name;
        if (ord.items && Array.isArray(ord.items)) {
          return ord.items.some(
            (item: any) =>
              (prodId && item.productId === prodId) ||
              (prodName && (item.title === prodName || item.name === prodName))
          );
        }
        if (ord.product) {
          return (
            (prodId && ord.product.id === prodId) ||
            (prodName && ord.product.name === prodName)
          );
        }
        return false;
      });
    } catch {
      return false;
    }
  }, [selectedProduct?.id, selectedProduct?.name]);

  const handleAddThreadedComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const identity = getUserCommentIdentity();

    const newComment: ThreadedComment = {
      id: `rc_${Date.now()}`,
      author: identity.author,
      role: identity.role,
      badge: identity.badge,
      text: newCommentText.trim(),
      avatar: identity.avatar,
      avatarBg: identity.avatarBg,
      time: "Just now",
      likes: 0,
      parentId: replyingToId || null,
      replies: [],
    };

    setThreadedComments((prev) => {
      if (replyingToId) {
        return prev.map((c) => {
          if (c.id === replyingToId) {
            return {
              ...c,
              replies: [...(c.replies || []), newComment],
            };
          }
          return c;
        });
      } else {
        return [newComment, ...prev];
      }
    });

    setNewCommentText("");
    setReplyingToId(null);
  };

  const handleToggleReplyLike = (rootId: string, replyId: string) => {
    setThreadedComments((prev) => 
      prev.map((c) => {
        if (c.id === rootId) {
          return {
            ...c,
            replies: c.replies?.map((r) => {
              if (r.id === replyId) {
                const liked = !r.liked;
                const likes = r.likes + (liked ? 1 : -1);
                return { ...r, likes, liked };
              }
              return r;
            })
          };
        }
        return c;
      })
    );
  };

  const handleToggleReplyLove = (rootId: string, replyId: string) => {
    setThreadedComments((prev) => 
      prev.map((c) => {
        if (c.id === rootId) {
          return {
            ...c,
            replies: c.replies?.map((r) => {
              if (r.id === replyId) {
                const loved = !r.loved;
                const likes = r.likes + (loved ? 1 : -1);
                return { ...r, likes, loved };
              }
              return r;
            })
          };
        }
        return c;
      })
    );
  };

  const design = selectedStore.designSettings || {
    width: "large",
    height: "large",
    bgColor: "#ffffff",
    borderColor: "#1e293b",
    borderStyle: "solid",
    borderWidth: "4px",
    borderRadius: "3xl"
  };

  // Convert default values to dynamic borders requested by merchant
  const outerBorderColor = design.borderColor || "#e2e8f0";
  const outerBorderStyle = design.borderStyle || "solid";
  const outerBorderWidth = design.borderWidth || "1px";
  const outerBorderRadius = 
    design.borderRadius === "none" ? "0px" :
    design.borderRadius === "xl" ? "12px" :
    design.borderRadius === "2xl" ? "16px" :
    design.borderRadius === "3xl" ? "24px" :
    design.borderRadius === "full" ? "9999px" : "12px";

  const hasVideo = !!selectedProduct.videoUrl || isBerberRugProduct;

  const getVideoEmbedResult = (url: string = ""): { type: string; embedUrl: string } => {
    const autoplayParams = isAutoPlay ? "1" : "0";
    if (!url) {
      const defaultYtId = isBerberRugProduct ? "_POnm_C2Kts" : "GgA92gC4O3s";
      return {
        type: "youtube",
        embedUrl: `https://www.youtube.com/embed/${defaultYtId}?autoplay=${autoplayParams}&mute=0&controls=0&rel=0&modestbranding=1&showinfo=0&iv_load_policy=3&playsinline=1&loop=1&playlist=${defaultYtId}&disablekb=1&fs=0&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`
      };
    }

    // YouTube formats
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      let videoId = "";
      if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
      } else if (url.includes("embed/")) {
        videoId = url.split("embed/")[1]?.split("?")[0] || "";
      } else if (url.includes("shorts/")) {
        videoId = url.split("shorts/")[1]?.split("?")[0] || "";
      } else if (url.includes("v=")) {
        videoId = url.split("v=")[1]?.split("&")[0] || "";
      }
      if (videoId) {
        return {
          type: "youtube",
          embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=${autoplayParams}&mute=0&controls=0&rel=0&modestbranding=1&showinfo=0&iv_load_policy=3&playsinline=1&loop=1&playlist=${videoId}&disablekb=1&fs=0&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`
        };
      }
    }

    // Facebook formats
    if (url.includes("facebook.com") || url.includes("fb.watch") || url.includes("fb.com")) {
      return {
        type: "facebook",
        embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0&autoplay=1`
      };
    }

    // Vimeo formats
    if (url.includes("vimeo.com")) {
      const vimeoMatches = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/);
      const vimeoId = vimeoMatches ? vimeoMatches[3] : "";
      if (vimeoId) {
        return {
          type: "vimeo",
          embedUrl: `https://player.vimeo.com/video/${vimeoId}?autoplay=1`
        };
      }
    }

    // TikTok formats
    if (url.includes("tiktok.com")) {
      let videoId = "";
      const matches = url.match(/\/video\/(\d+)/);
      if (matches && matches[1]) {
        videoId = matches[1];
      } else {
        const embedMatches = url.match(/\/embed\/(\d+)/);
        if (embedMatches && embedMatches[1]) {
          videoId = embedMatches[1];
        }
      }
      if (videoId) {
        return {
          type: "tiktok",
          embedUrl: `https://www.tiktok.com/embed/v2/${videoId}`
        };
      }
      const lastSegment = url.split("/").pop()?.split("?")[0] || "";
      if (/^\d+$/.test(lastSegment)) {
        return {
          type: "tiktok",
          embedUrl: `https://www.tiktok.com/embed/v2/${lastSegment}`
        };
      }
      return {
        type: "tiktok",
        embedUrl: url
      };
    }

    // Direct video formats
    if (url.endsWith(".mp4") || url.endsWith(".webm") || url.endsWith(".ogg") || url.includes(".mp4?")) {
      return {
        type: "direct",
        embedUrl: url
      };
    }

    // Other/Fallbacks
    return {
      type: "unknown",
      embedUrl: url
    };
  };

  const getYouTubeThumbnail = (url: string) => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      let videoId = "";
      if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
      } else if (url.includes("embed/")) {
        videoId = url.split("embed/")[1]?.split("?")[0] || "";
      } else if (url.includes("shorts/")) {
        videoId = url.split("shorts/")[1]?.split("?")[0] || "";
      } else if (url.includes("v=")) {
        videoId = url.split("v=")[1]?.split("&")[0] || "";
      }
      if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
      }
    }
    return null;
  };

  const productVideoList = selectedProduct.videoUrls && selectedProduct.videoUrls.length > 0
    ? selectedProduct.videoUrls
    : (selectedProduct.videoUrl ? [selectedProduct.videoUrl] : (isBerberRugProduct ? ["https://www.youtube.com/watch?v=_POnm_C2Kts"] : []));

  const renderOrderFormCard = (onCloseForm: () => void, isFullWidth = false) => (
    <div className={`bg-white rounded-[20px] sm:rounded-[24px] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08),0_10px_20px_-5px_rgba(0,0,0,0.04)] border border-stone-200/90 w-full overflow-hidden text-left relative flex flex-col transition-all duration-300 ease-in-out ${
      isFullWidth
        ? "w-full mx-auto"
        : isSummaryPanelOpen ? "max-w-5xl md:w-full mx-auto max-h-[92vh]" : "max-w-3xl md:w-full mx-auto max-h-[92vh]"
    }`}>
      {/* Header */}
      <div className="p-3.5 sm:p-4 border-b border-stone-100 bg-stone-50/70 backdrop-blur-md flex items-center justify-between shrink-0 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-white font-bold shadow-xs shrink-0" style={{ backgroundColor: activeThemeColor }}>
            <ShoppingBag className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight tracking-tight truncate">Order form (Express checkout)</h3>
            <p className="text-[11px] text-stone-500 font-medium truncate">Please enter your order and shipping details below</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsSummaryPanelOpen(!isSummaryPanelOpen)}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-slate-700 shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <ShoppingBag className="w-3.5 h-3.5" style={{ color: activeThemeColor }} />
            <span className="hidden sm:inline">{isSummaryPanelOpen ? "Hide summary" : "Show summary"}</span>
            {isSummaryPanelOpen ? (
              <ChevronsRight className="w-3.5 h-3.5 text-stone-400" />
            ) : (
              <ChevronsLeft className="w-3.5 h-3.5 text-stone-400" />
            )}
          </button>

          <button
            type="button"
            onClick={onCloseForm}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200/80 text-stone-600 flex items-center justify-center transition-all cursor-pointer active:scale-90"
            title="Close form"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-3.5 sm:p-4 lg:p-5 text-xs text-slate-800 overflow-y-auto lg:overflow-y-visible flex-1 min-h-0">
        <div className={`grid gap-3.5 lg:gap-5 ${isSummaryPanelOpen ? "grid-cols-1 lg:grid-cols-12" : "grid-cols-1"}`}>
          
          {/* Main Form Inputs */}
          <div className={`${isSummaryPanelOpen ? "lg:col-span-7" : "w-full"} space-y-2.5`}>
            
            {/* Group 1: Customer Information Card */}
            <div className="bg-stone-50/40 rounded-xl sm:rounded-2xl p-3 sm:p-3.5 border border-stone-200/70 space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Buyer Full Name */}
                {checkoutFieldConfig.fullName.show && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-bold text-slate-800">
                        Full name {checkoutFieldConfig.fullName.required && <span className="text-rose-500">*</span>}
                      </label>
                      {fullNameTouched && fullNameValidation.isValid && (
                        <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Valid
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <User className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${
                        fullNameTouched && !fullNameValidation.isValid ? "text-rose-400" : "text-stone-400"
                      }`} />
                      <input
                        type="text"
                        value={buyerFullName}
                        onChange={(e) => {
                          setBuyerFullName(e.target.value);
                          if (!fullNameTouched) setFullNameTouched(true);
                          if (formValidationErrors.length > 0) setFormValidationErrors([]);
                        }}
                        onBlur={() => {
                          setFullNameTouched(true);
                          setBuyerFullName((prev) => prev.trim().replace(/\s+/g, " "));
                        }}
                        placeholder="e.g. Hakim Bensaha"
                        className={`w-full h-9 pl-9 pr-3 rounded-xl border bg-white text-xs font-medium text-slate-900 placeholder:text-stone-400 outline-none transition-all shadow-2xs ${
                          fullNameTouched && !fullNameValidation.isValid
                            ? "border-rose-300 ring-1 ring-rose-500/20 bg-rose-50/20"
                            : fullNameTouched && fullNameValidation.isValid
                            ? "border-emerald-500/60 ring-1 ring-emerald-500/10"
                            : "border-stone-200/90 focus:border-slate-800 focus:ring-1 focus:ring-slate-900/10"
                        }`}
                      />
                    </div>
                    {fullNameTouched && !fullNameValidation.isValid && (
                      <p className="text-[10.5px] font-semibold text-rose-600 flex items-center gap-1 pt-0.5">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{fullNameValidation.message}</span>
                      </p>
                    )}
                  </div>
                )}

                {/* Buyer Phone Number */}
                {checkoutFieldConfig.phone.show && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-bold text-slate-800">
                        Phone number {checkoutFieldConfig.phone.required && <span className="text-rose-500">*</span>}
                      </label>
                      {phoneTouched && phoneValidation.isValid ? (
                        <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Valid
                        </span>
                      ) : userPhoneList.length > 1 ? (
                        <span className="text-[10px] text-stone-500 font-medium">Multiple numbers</span>
                      ) : null}
                    </div>

                    <div className="relative flex items-center">
                      {/* Dial Code Badge */}
                      <div className="absolute left-2.5 top-1/2 -translate-y-1/2 flex items-center bg-stone-100 border border-stone-200 px-2 py-0.5 rounded-lg text-xs font-mono font-bold text-slate-800 pointer-events-none select-none shrink-0 z-10">
                        <span className="text-[11px] text-slate-700 font-bold">+{currentCountryObj?.phonecode?.replace(/\D/g, "") || "213"}</span>
                      </div>

                      <input
                        type="tel"
                        value={buyerPhone}
                        onChange={(e) => {
                          const digitsOnly = e.target.value.replace(/\D/g, "");
                          setBuyerPhone(digitsOnly);
                          if (!phoneTouched) setPhoneTouched(true);
                          if (formValidationErrors.length > 0) setFormValidationErrors([]);
                        }}
                        onBlur={() => {
                          setPhoneTouched(true);
                        }}
                        placeholder=""
                        className={`w-full h-9 pl-16 pr-3 rounded-xl border bg-white text-xs font-mono font-medium text-slate-900 placeholder:text-stone-400 outline-none transition-all shadow-2xs ${
                          phoneTouched && !phoneValidation.isValid
                            ? "border-rose-300 ring-1 ring-rose-500/20 bg-rose-50/20"
                            : phoneTouched && phoneValidation.isValid
                            ? "border-emerald-500/60 ring-1 ring-emerald-500/10"
                            : "border-stone-200/90 focus:border-slate-800 focus:ring-1 focus:ring-slate-900/10"
                        }`}
                      />
                    </div>

                    {phoneTouched && !phoneValidation.isValid && (
                      <p className="text-[10.5px] font-semibold text-rose-600 flex items-center gap-1 pt-0.5">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{phoneValidation.message}</span>
                      </p>
                    )}

                    {/* Phone selector chips when multiple saved numbers exist */}
                    {userPhoneList.length > 1 && (
                      <div className="flex items-center gap-1.5 pt-1 overflow-x-auto no-scrollbar">
                        <span className="text-[10px] text-stone-500 font-medium shrink-0">Saved:</span>
                        {userPhoneList.map((num, idx) => (
                          <button
                            key={`phone-${num}-${idx}`}
                            type="button"
                            onClick={() => {
                              setBuyerPhone(num);
                              setPhoneTouched(true);
                            }}
                            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                              buyerPhone.trim() === num.trim()
                                ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                                : "bg-white text-stone-700 border-stone-200 hover:border-slate-400"
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Collapsible Messaging Contacts Toggle */}
              {checkoutFieldConfig.phone.show && (
                <div className="pt-0.5">
                  <button
                    type="button"
                    onClick={() => setIsMessagingAppsOpen(!isMessagingAppsOpen)}
                    className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer select-none group py-0.5"
                  >
                    <MessageSquare className="w-3 h-3 text-indigo-500 transition-transform group-hover:scale-110" />
                    <span>{isMessagingAppsOpen ? "Hide extra channels" : "+ Extra contact options (WhatsApp, Viber, Telegram)"}</span>
                    <ChevronDown className={`w-3 h-3 text-indigo-400 transition-transform duration-300 ${isMessagingAppsOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {isMessagingAppsOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 6 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="bg-white/80 border border-stone-200/80 rounded-xl p-2.5 space-y-2 shadow-2xs">
                          <div className="flex items-center justify-between pb-1 border-b border-stone-100">
                            <span className="text-[10px] font-bold text-slate-800 flex items-center gap-1">
                              <MessageCircle className="w-3 h-3 text-emerald-600" />
                              Other messaging contacts (optional)
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                if (buyerPhone) {
                                  setBuyerWhatsapp(buyerPhone);
                                  setBuyerViber(buyerPhone);
                                  setBuyerTelegram(buyerPhone);
                                }
                              }}
                              className="text-[10px] font-bold text-indigo-600 hover:underline cursor-pointer"
                            >
                              Same as phone
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {/* WhatsApp */}
                            <div className="space-y-0.5">
                              <label className="text-[9.5px] font-bold text-slate-700 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                WhatsApp
                              </label>
                              <input
                                type="tel"
                                value={buyerWhatsapp}
                                onChange={(e) => setBuyerWhatsapp(e.target.value)}
                                placeholder="WhatsApp number..."
                                className="w-full h-8 px-2.5 rounded-lg border border-stone-200 bg-stone-50/50 text-[11px] font-medium focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/10 outline-none transition-all"
                              />
                            </div>

                            {/* Viber */}
                            <div className="space-y-0.5">
                              <label className="text-[9.5px] font-bold text-slate-700 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                                Viber
                              </label>
                              <input
                                type="tel"
                                value={buyerViber}
                                onChange={(e) => setBuyerViber(e.target.value)}
                                placeholder="Viber number..."
                                className="w-full h-8 px-2.5 rounded-lg border border-stone-200 bg-stone-50/50 text-[11px] font-medium focus:bg-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500/10 outline-none transition-all"
                              />
                            </div>

                            {/* Telegram */}
                            <div className="space-y-0.5">
                              <label className="text-[9.5px] font-bold text-slate-700 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                                Telegram
                              </label>
                              <input
                                type="text"
                                value={buyerTelegram}
                                onChange={(e) => setBuyerTelegram(e.target.value)}
                                placeholder="@username / number"
                                className="w-full h-8 px-2.5 rounded-lg border border-stone-200 bg-stone-50/50 text-[11px] font-medium focus:bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500/10 outline-none transition-all"
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Group 2: Shipping Address Card */}
            <div className="bg-stone-50/40 rounded-xl sm:rounded-2xl p-3 sm:p-3.5 border border-stone-200/70 space-y-2.5">
              {/* Country Selection */}
              <SearchableLocationSelect
                label="Country"
                required
                value={selectedCountryName}
                onChange={handleCountryChange}
                options={countryOptions}
                placeholder="Select country..."
                searchPlaceholder="Search country or currency..."
                icon={Globe}
              />

              {/* State & City selectors */}
              <div className={`grid grid-cols-1 ${stateOptions.length > 0 ? "sm:grid-cols-2" : "grid-cols-1"} gap-2.5`}>
                {stateOptions.length > 0 && (
                  <SearchableLocationSelect
                    label="State / Province"
                    required
                    value={selectedStateName}
                    onChange={handleStateChange}
                    options={stateOptions}
                    placeholder="Select state..."
                    searchPlaceholder="Search state..."
                    icon={MapPin}
                  />
                )}

                {cityOptions.length > 0 ? (
                  <SearchableLocationSelect
                    label="City"
                    required
                    value={selectedCityName}
                    onChange={handleCityChange}
                    options={cityOptions}
                    placeholder="Select city..."
                    searchPlaceholder="Search city..."
                    icon={Building}
                  />
                ) : (
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-800">
                      City <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Building className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={selectedCityName}
                        onChange={(e) => setSelectedCityName(e.target.value)}
                        placeholder="Enter city name..."
                        className="w-full h-9 pl-9 pr-3 rounded-xl border border-stone-200/90 bg-white text-xs font-medium text-slate-900 placeholder:text-stone-400 focus:bg-white focus:border-slate-800 focus:ring-1 focus:ring-slate-900/10 outline-none transition-all shadow-2xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Address */}
              {checkoutFieldConfig.streetAddress.show && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-bold text-slate-800">
                      Address {checkoutFieldConfig.streetAddress.required && <span className="text-rose-500">*</span>}
                    </label>
                    {streetAddressTouched && streetAddress.trim() && (
                      <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Valid
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <MapPin className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${
                      streetAddressTouched && checkoutFieldConfig.streetAddress.required && !streetAddress.trim()
                        ? "text-rose-400"
                        : "text-stone-400"
                    }`} />
                    <input
                      type="text"
                      value={streetAddress}
                      onChange={(e) => {
                        setStreetAddress(e.target.value);
                        if (!streetAddressTouched) setStreetAddressTouched(true);
                        if (formValidationErrors.length > 0) setFormValidationErrors([]);
                      }}
                      onBlur={() => {
                        setStreetAddressTouched(true);
                        setStreetAddress((prev) => prev.trim().replace(/\s+/g, " "));
                      }}
                      placeholder="Street name, building, apartment, or landmark..."
                      className={`w-full h-9 pl-9 pr-3 rounded-xl border bg-white text-xs font-medium text-slate-900 placeholder:text-stone-400 outline-none transition-all shadow-2xs ${
                        streetAddressTouched && checkoutFieldConfig.streetAddress.required && !streetAddress.trim()
                          ? "border-rose-300 ring-1 ring-rose-500/20 bg-rose-50/20"
                          : streetAddressTouched && streetAddress.trim()
                          ? "border-emerald-500/60 ring-1 ring-emerald-500/10"
                          : "border-stone-200/90 focus:border-slate-800 focus:ring-1 focus:ring-slate-900/10"
                      }`}
                    />
                  </div>
                  {streetAddressTouched && checkoutFieldConfig.streetAddress.required && !streetAddress.trim() && (
                    <p className="text-[10.5px] font-semibold text-rose-600 flex items-center gap-1 pt-0.5">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>Please enter your street address.</span>
                    </p>
                  )}
                </div>
              )}

              {/* Discount / Coupon Field when Order Summary is hidden */}
              {!isSummaryPanelOpen && (
                <div className="pt-2 border-t border-stone-200/60 space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-800">
                    Discount
                  </label>

                  {appliedPromo ? (
                    <div className="flex items-center justify-between bg-emerald-50/90 border border-emerald-200/90 rounded-xl p-2 text-xs shadow-2xs">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                        <div className="truncate">
                          <span className="font-bold font-sans text-emerald-900 text-xs tracking-wide">{appliedPromo.code}</span>
                          <span className="ml-1 bg-emerald-600 text-white font-extrabold text-[9px] px-1.5 py-0.5 rounded-full">
                            -{appliedPromo.percent}%
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemovePromoCode}
                        className="text-emerald-700 hover:text-emerald-950 text-xs font-extrabold hover:underline cursor-pointer transition-colors shrink-0"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex gap-1.5">
                        <div className="relative flex-1">
                          <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="text"
                            value={promoCodeInput}
                            onChange={(e) => {
                              setPromoCodeInput(e.target.value.trimStart());
                              if (promoError) setPromoError("");
                            }}
                            placeholder="Discount code (e.g. WELCOME10)"
                            className="w-full h-8.5 pl-8 pr-2 rounded-xl border border-stone-200/90 bg-white text-[11px] font-sans font-medium text-slate-900 placeholder:text-stone-400 focus:border-slate-800 focus:ring-1 focus:ring-slate-900/10 outline-none transition-all shadow-2xs"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleApplyPromoCode(promoCodeInput.trim())}
                          className="px-3 h-8.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 shrink-0"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  )}

                  {promoError && (
                    <p className="text-[10.5px] font-semibold text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" /> {promoError}
                    </p>
                  )}
                  {promoSuccess && (
                    <p className="text-[10.5px] font-semibold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 shrink-0" /> {promoSuccess}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Group 3: Delivery Method Segmented Control */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between px-0.5">
                <label className="block text-[11px] font-bold text-slate-800">
                  Delivery type <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] font-medium text-stone-500">
                  Select your preferred option
                </span>
              </div>

              {/* Segmented Control Outer Container */}
              <div className="p-1.5 bg-stone-100/70 border border-stone-200/80 rounded-[16px] grid grid-cols-2 gap-1.5">
                {/* Home Delivery Segment */}
                <button
                  type="button"
                  onClick={() => setShippingMethod("home")}
                  className={`h-[50px] px-3 rounded-[12px] transition-all duration-200 flex items-center justify-between gap-2 cursor-pointer text-left select-none ${
                    shippingMethod === "home"
                      ? "bg-slate-900/5 border-[1.5px] border-slate-900 text-slate-900 shadow-2xs"
                      : "bg-white border border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-50/50 shadow-none"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Truck className={`w-4 h-4 shrink-0 transition-colors ${
                      shippingMethod === "home" ? "text-slate-900" : "text-stone-500"
                    }`} />
                    <span className={`font-bold text-xs truncate transition-colors ${
                      shippingMethod === "home" ? "text-slate-900 font-extrabold" : "text-slate-700"
                    }`}>
                      Home Delivery
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`font-mono text-[10.5px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                      shippingMethod === "home"
                        ? "bg-slate-900 text-white"
                        : "bg-stone-100 text-stone-600"
                    }`}>
                      +{displayHomePrice.toLocaleString()} DA
                    </span>
                    {shippingMethod === "home" && (
                      <div className="w-3.5 h-3.5 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                </button>

                {/* Desk / Pickup Point Segment */}
                <button
                  type="button"
                  onClick={() => setShippingMethod("stopdesk")}
                  className={`h-[50px] px-3 rounded-[12px] transition-all duration-200 flex items-center justify-between gap-2 cursor-pointer text-left select-none ${
                    shippingMethod === "stopdesk" || (shippingMethod as string) === "desk"
                      ? "bg-slate-900/5 border-[1.5px] border-slate-900 text-slate-900 shadow-2xs"
                      : "bg-white border border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-50/50 shadow-none"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Building className={`w-4 h-4 shrink-0 transition-colors ${
                      shippingMethod === "stopdesk" || (shippingMethod as string) === "desk" ? "text-slate-900" : "text-stone-500"
                    }`} />
                    <span className={`font-bold text-xs truncate transition-colors ${
                      shippingMethod === "stopdesk" || (shippingMethod as string) === "desk" ? "text-slate-900 font-extrabold" : "text-slate-700"
                    }`}>
                      Desk / Pickup Point
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`font-mono text-[10.5px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                      shippingMethod === "stopdesk" || (shippingMethod as string) === "desk"
                        ? "bg-slate-900 text-white"
                        : "bg-stone-100 text-stone-600"
                    }`}>
                      +{displayDeskPrice.toLocaleString()} DA
                    </span>
                    {(shippingMethod === "stopdesk" || (shippingMethod as string) === "desk") && (
                      <div className="w-3.5 h-3.5 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Terms Agreement Checkbox */}
            {checkoutFieldConfig.terms.show && (
              <div className={`p-2 rounded-xl transition-all duration-300 ${
                termsErrorHighlight ? "bg-rose-50 border border-rose-300 ring-2 ring-rose-400/30" : ""
              }`}>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="order-terms-check"
                    checked={agreedToTerms}
                    onChange={(e) => {
                      setAgreedToTerms(e.target.checked);
                      if (termsErrorHighlight) setTermsErrorHighlight(false);
                      if (formValidationErrors.length > 0) setFormValidationErrors([]);
                    }}
                    className="w-3.5 h-3.5 rounded border-stone-300 text-slate-900 focus:ring-slate-900 cursor-pointer shrink-0"
                  />
                  <label htmlFor="order-terms-check" className="text-[11px] text-stone-600 leading-tight cursor-pointer select-none">
                    I confirm my order details and agree to cash-on-delivery terms upon receiving my package.
                  </label>
                </div>
                {termsErrorHighlight && (
                  <p className="text-[10px] font-bold text-rose-600 mt-1 pl-5">
                    Please accept the terms to proceed with your order.
                  </p>
                )}
              </div>
            )}

            {/* Validation Error Alert Banner */}
            {formValidationErrors.length > 0 && (
              <div className="bg-rose-50 border border-rose-300/90 rounded-xl p-3 text-rose-800 space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-900">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Please complete the missing details before placing your order:</span>
                </div>
                <ul className="list-disc list-inside text-[11px] font-semibold space-y-0.5 text-rose-700 pl-1">
                  {formValidationErrors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Confirm Submit Order Button */}
            <button
              type="button"
              disabled={isSubmittingOrder}
              onClick={() => {
                setFullNameTouched(true);
                setPhoneTouched(true);
                setStreetAddressTouched(true);

                const errors: string[] = [];

                if (checkoutFieldConfig.fullName.required && !fullNameValidation.isValid) {
                  errors.push(fullNameValidation.message || "Please enter a valid full name.");
                }
                if (checkoutFieldConfig.phone.required && !phoneValidation.isValid) {
                  errors.push(phoneValidation.message || "Please enter a valid phone number.");
                }
                if (!selectedCountryName || !selectedCountryCode) {
                  errors.push("Country selection is required.");
                }
                if (stateOptions.length > 0 && !selectedStateName) {
                  errors.push("State / Province selection is required.");
                }
                if (cityOptions.length > 0 && !selectedCityName) {
                  errors.push("City selection is required.");
                }
                if (checkoutFieldConfig.streetAddress.required && !streetAddress.trim()) {
                  errors.push("Street address is required.");
                }
                if (checkoutFieldConfig.terms.show && !agreedToTerms) {
                  setTermsErrorHighlight(true);
                  setTimeout(() => setTermsErrorHighlight(false), 2000);
                  errors.push("Please confirm your order details and agree to terms.");
                }

                if (errors.length > 0) {
                  setFormValidationErrors(errors);
                  return;
                }

                setFormValidationErrors([]);
                setIsSubmittingOrder(true);
                setTimeout(() => {
                  const orderRefId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
                  const finalPhone = phoneValidation.canonicalValue || phoneValidation.formattedDisplay || buyerPhone;
                  const finalName = fullNameValidation.cleanName || buyerFullName || "Valued Shopper";

                  const newOrder = {
                    id: orderRefId,
                    orderId: orderRefId,
                    buyer: {
                      name: finalName,
                      phone: finalPhone,
                      whatsapp: buyerWhatsapp || "",
                      viber: buyerViber || "",
                      telegram: buyerTelegram || "",
                      country: selectedCountryName || "Algeria",
                      countryCode: selectedCountryCode || "DZ",
                      state: selectedStateName || "Bejaia",
                      stateCode: selectedStateCode || "06",
                      wilaya: selectedStateName || "Bejaia",
                      commune: selectedCityName || "Bejaia",
                      city: selectedCityName || "Bejaia",
                      address: streetAddress ? streetAddress.trim() : `${selectedCityName}, ${selectedStateName}`,
                    },
                    wilaya: selectedWilaya || { name: selectedStateName || "Bejaia", code: selectedStateCode || "06" },
                    commune: selectedCityName || "Bejaia",
                    city: selectedCityName || "Bejaia",
                    country: selectedCountryName || "Algeria",
                    countryCode: selectedCountryCode || "DZ",
                    state: selectedStateName || "Bejaia",
                    stateCode: selectedStateCode || "06",
                    deliveryCompany: selectedDeliveryCompany || { name: "Yalidine Express" },
                    product: selectedProduct || { name: "Product", price: 0 },
                    qty: purchaseQty,
                    subtotal: calculatedSubtotal,
                    totalPrice: calculatedGrandTotal,
                    grandTotal: calculatedGrandTotal,
                    shippingFee: calculatedShippingFee,
                    deliveryType: shippingMethod,
                    promo: appliedPromo,
                    color: chosenColor || "Standard",
                    size: chosenSize || "One Size",
                    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                    status: "Pending",
                    createdAt: new Date().toISOString(),
                    merchant: selectedStore,
                  };
                  setPlacedOrderInfo(newOrder);
                  setIsSubmittingOrder(false);
                  setIsExpressCheckoutOpen(false);
                  setIsBottomInlineCheckoutOpen(false);
                  setIsThankYouOpen(true);
                }, 600);
              }}
              className={`w-full text-white font-black h-11 py-2.5 px-5 rounded-xl text-center text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 mt-1 cursor-pointer ${
                !isFormValid
                  ? "opacity-60 cursor-not-allowed shadow-none"
                  : "shadow-md shadow-slate-900/15 hover:shadow-lg hover:shadow-slate-900/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
              }`}
              style={{ backgroundColor: activeThemeColor }}
            >
              {isSubmittingOrder ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing order...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Send order request</span>
                </>
              )}
            </button>
          </div>

          {/* Right Summary Sidebar */}
          {isSummaryPanelOpen && (
            <div className="lg:col-span-5 bg-stone-50/80 rounded-xl sm:rounded-2xl p-3 sm:p-3.5 border border-stone-200/80 flex flex-col space-y-5 sm:space-y-6 shadow-2xs h-fit self-start">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between pb-1.5 border-b border-stone-200/80">
                  <div className="flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-slate-800" />
                    <h4 className="font-bold text-[11px] sm:text-xs text-slate-900">Order summary</h4>
                  </div>
                </div>

                {/* Product Item row */}
                <div className="flex items-center gap-2.5 p-1.5 sm:p-2 rounded-xl bg-white border border-stone-200/80 shadow-2xs">
                  <div className="w-10 h-10 rounded-lg border border-stone-200 bg-stone-50 overflow-hidden shrink-0 shadow-2xs">
                    <img
                      src={selectedProduct.imageUrl || selectedProduct.images?.[0] || ""}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <h5 className="font-extrabold text-xs text-slate-900 leading-snug line-clamp-1">{selectedProduct.name}</h5>
                    <p className="text-[11px] text-stone-500 font-sans">
                      Qty: <span className="font-extrabold text-slate-900">{purchaseQty}</span> × {activePrice.toLocaleString()} DA
                    </p>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-1 pt-0.5 text-stone-700 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-stone-600">Item Price:</span>
                    <span className="font-sans font-bold text-slate-900">{calculatedSubtotal.toLocaleString()} DA</span>
                  </div>

                  {appliedPromo && (
                    <div className="flex items-center justify-between text-emerald-600 font-bold">
                      <span>Promo discount ({appliedPromo.percent}%)</span>
                      <span className="font-sans font-bold">-{calculatedDiscountAmount.toLocaleString()} DA</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="font-medium text-stone-600">Shipping fee ({shippingMethod === "home" ? "Home" : "Desk"})</span>
                    <span className="font-sans font-bold text-emerald-700">+{calculatedShippingFee.toLocaleString()} DA</span>
                  </div>

                  <div className="flex items-center justify-between pt-1.5 border-t border-stone-200/80 text-xs sm:text-sm font-black text-slate-900">
                    <span>Total amount</span>
                    <span className="font-sans text-base sm:text-lg font-black" style={{ color: activeThemeColor }}>
                      {calculatedGrandTotal.toLocaleString()} DA
                    </span>
                  </div>

                  {/* Coupon / Promo Code Field (inside Order Summary under Total Amount) */}
                  <div className="pt-2 border-t border-stone-200/80 space-y-1.5">
                    <label className="block text-[11px] font-bold text-slate-800">
                      Discount
                    </label>

                    {appliedPromo ? (
                      <div className="flex items-center justify-between bg-emerald-50/90 border border-emerald-200/90 rounded-xl p-2 text-xs shadow-2xs">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                          <div className="truncate">
                            <span className="font-sans font-bold text-emerald-900 text-xs tracking-wide">{appliedPromo.code}</span>
                            <span className="ml-1 bg-emerald-600 text-white font-extrabold text-[9px] px-1.5 py-0.5 rounded-full">
                              -{appliedPromo.percent}%
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemovePromoCode}
                          className="text-emerald-700 hover:text-emerald-950 text-xs font-extrabold hover:underline cursor-pointer transition-colors shrink-0"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="flex gap-1.5">
                          <div className="relative flex-1">
                            <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              value={promoCodeInput}
                              onChange={(e) => {
                                setPromoCodeInput(e.target.value);
                                if (promoError) setPromoError("");
                              }}
                              placeholder="Discount code (e.g. WELCOME10)"
                              className="w-full h-8.5 pl-8 pr-2 rounded-xl border border-stone-200/90 bg-white text-[11px] font-sans font-medium text-slate-900 placeholder:text-stone-400 focus:border-slate-800 focus:ring-1 focus:ring-slate-900/10 outline-none transition-all shadow-2xs"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleApplyPromoCode()}
                            className="px-3 h-8.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 shrink-0"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    )}

                    {promoError && (
                      <p className="text-[10.5px] font-semibold text-rose-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" /> {promoError}
                      </p>
                    )}
                    {promoSuccess && (
                      <p className="text-[10.5px] font-semibold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 shrink-0" /> {promoSuccess}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Guarantees Security Card (Minimized with extra spacing) */}
              <div className="mt-4 pt-2.5 border-t border-stone-200/60 p-1.5 sm:p-2 bg-emerald-50/60 border border-emerald-200/60 rounded-lg space-y-0.5 shadow-2xs">
                <div className="flex items-center gap-1.5 font-bold text-emerald-950 text-[10px] sm:text-[10.5px]">
                  <div className="w-4 h-4 rounded bg-emerald-600/15 flex items-center justify-center shrink-0">
                    <Lock className="w-2.5 h-2.5 text-emerald-700" />
                  </div>
                  <span>Guaranteed cash on delivery</span>
                </div>
                <p className="leading-tight text-stone-500 text-[9px] sm:text-[9.5px] pl-5">Pay directly to the courier upon delivery across {selectedCountryCode === "DZ" ? "58 Algerian Wilayas" : `all regions in ${selectedCountryName || "the country"}`}.</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );

  const videoInfo = getVideoEmbedResult(activeVideoUrl || selectedProduct.videoUrl || (productVideoList[0] || ""));

  return (
    <div 
      id="product-preview-modal-root"
      className="fixed inset-0 z-50 bg-white overflow-y-auto no-scrollbar scrollbar-none font-sans flex flex-col text-slate-800"
      onScroll={(e) => {
        const scrollTop = e.currentTarget.scrollTop;
        const diff = scrollTop - previewLastScrollY.current;
        if (scrollTop <= 3) {
          setShowPreviewHeader(true);
        } else if (diff > 1) {
          setShowPreviewHeader(false);
        } else if (diff < -5) {
          setShowPreviewHeader(true);
        }
        previewLastScrollY.current = scrollTop;
      }}
    >
      
      {/* 1. Storefront Compliant Breadcrumb Header & Navigation Control */}
      <header 
        className="sticky top-0 z-40 text-white border-b shadow-md px-4 md:px-10 py-4 flex flex-wrap items-center justify-between gap-4 transition-all duration-300"
        style={{
          backgroundColor: currentSlideColor,
          borderColor: "rgba(255, 255, 255, 0.15)",
          opacity: showPreviewHeader ? 1 : 0,
          pointerEvents: showPreviewHeader ? "auto" : "none",
          transform: showPreviewHeader ? "translateY(0%)" : "translateY(-115%)",
        }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white border border-white/20 rounded-xl shadow-3xs hover:shadow-2xs transition-all flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-1 focus:ring-white/30 font-mono text-xs font-black"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
            Back To Storefront
          </button>
          
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-white/70 font-medium">
            <span>{selectedStore.name}</span>
            <span>/</span>
            <span className="text-white/80 font-bold">{selectedProduct.category || "General Selection"}</span>
            <span>/</span>
            <span className="text-white font-black truncate max-w-[200px]">{selectedProduct.name}</span>
          </div>
        </div>

        {/* Brand identity preview header */}
        <button
          onClick={onOpenStoreProfile || onOpenReels || onClose}
          type="button"
          className="flex items-center gap-3 hover:opacity-90 active:scale-95 transition-all cursor-pointer group focus:outline-none border-0 bg-transparent text-left"
          title="View Storefront Profile"
          id="product-preview-store-banner-header"
        >
          <div className="w-7 h-7 rounded-full overflow-hidden border border-white/20 shadow-3xs group-hover:scale-105 transition-transform flex-shrink-0">
            {selectedStore.logo ? (
              <img 
                src={selectedStore.logo} 
                className="w-full h-full object-cover" 
                alt="Store Logo"
                referrerPolicy="no-referrer"
              />
            ) : (
              <DefaultProfileStorePhoto className="w-full h-full object-cover" />
            )}
          </div>
          <span className="text-xs font-black text-white font-display tracking-tight group-hover:underline decoration-white/40 decoration-1 underline-offset-4">
            {selectedStore.name} <span className="text-[10px] text-emerald-300 font-bold ml-1 inline-flex items-center gap-1">✓ Verified Seller</span>
          </span>
        </button>
      </header>

      {/* Main Container Layer styled over primary white webpage background */}
      <main className="flex-1 w-full max-w-[1800px] mx-auto px-4 md:px-8 py-2 flex flex-col gap-8 bg-white min-h-screen">
        
        {/* Borderless visual wrapper with default spacing */}
        <div className="bg-white p-2 md:p-4">
          
          {/* Main Triple Column Grid identical to premium E-commerce platform */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-[1720px] mx-auto w-full">
            
            {/* Left Content Area: Product Details & Reviews [9 Cols] */}
            <div className="lg:col-span-9 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-9 gap-8 -mt-[4px]">
                
                {/* Column 1: Vertical thumbnail strip & large image with real-time hover lens [5 Cols] */}
                <div className="lg:col-span-5 flex flex-col sm:flex-row gap-3.5 items-start justify-center lg:justify-start w-full p-0 m-0 lg:h-[800px]">
              
              {/* Vertical Thumbnails bar (Hidden on compact screens) */}
              <div className="hidden sm:flex flex-col gap-2 shrink-0 max-h-[520px] sm:max-h-[620px] lg:max-h-[800px] overflow-y-auto scrollbar-none">
                {galleryImages.map((img, idx) => (
                  <button
                    key={`v-thumb-${idx}-${img.slice(-15)}`}
                    type="button"
                    onClick={() => setActiveImgIdx(idx)}
                    className={`w-11 h-11 rounded-md overflow-hidden p-0.5 border-2 bg-white transition-all cursor-pointer shadow-3xs hover:scale-103 mt-[1px] ml-0 ${
                      activeImgIdx === idx
                        ? "border-[#e47911] ring-2 ring-amber-100"
                        : "border-slate-200"
                    }`}
                  >
                    <img src={img} alt="Thumb" className="w-full h-full object-cover rounded mt-0" />
                  </button>
                ))}

                {/* Video thumbnails uploaded by store owner */}
                {productVideoList.map((videoUrl, vIdx) => {
                  const ytThumbnail = getYouTubeThumbnail(videoUrl);
                  return (
                    <button
                      key={`video-vertical-${vIdx}`}
                      type="button"
                      onClick={() => {
                        if (onOpenReels) {
                          onOpenReels();
                        } else {
                          setActiveVideoUrl(videoUrl);
                          setIsVideoOpen(true);
                        }
                      }}
                      className="w-11 h-11 rounded-md overflow-hidden p-0.5 border-2 border-stone-200 hover:border-[#e47911] bg-stone-900 transition-all cursor-pointer shadow-3xs hover:scale-105 active:scale-[0.97] relative"
                      title={`Watch Product Showcase Video #${vIdx + 1}`}
                    >
                      <img src={ytThumbnail || galleryImages[0] || selectedProduct.imageUrl} alt="Video Thumbnail" className="w-full h-full object-cover rounded opacity-60" />
                      <div className="absolute inset-0 bg-black/45 flex items-center justify-center" id={`vertical-play-overlay-${vIdx}`}>
                        <div className="w-5 h-5 rounded-full bg-red-650 hover:bg-red-700 flex items-center justify-center text-white shadow-md transition-transform duration-300 transform hover:scale-110">
                          <svg className="w-2.5 h-2.5 fill-current text-white ml-0.5" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" style={{ fill: "white" }} />
                          </svg>
                        </div>
                      </div>
                      <div className="absolute bottom-0.5 left-0.5 right-0.5 bg-black/75 text-[7px] text-white font-black uppercase text-center py-0.5 rounded-sm select-none">
                        VIDEO {productVideoList.length > 1 ? `#${vIdx + 1}` : ""}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Main Preview Block */}
              <div className="flex-1 min-w-0 w-full flex flex-col gap-3 relative lg:h-[800px]">
                <div className="relative w-full lg:w-[630px] max-w-full aspect-[2/3] sm:aspect-[3/4] lg:aspect-auto h-auto lg:h-[777px] pt-0 pl-0 mt-[6px]">
                  <div
                    className="w-full h-full rounded-2xl overflow-hidden bg-stone-50 border border-stone-200 shadow-[0_8px_30px_rgb(0,0,0,0.04),0_1px_2px_rgb(0,0,0,0.01)] relative cursor-default animate-fade-in ring-1 ring-black/[0.01] transition-all duration-300 flex items-center justify-center"
                    onMouseEnter={(e) => {
                      const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
                      const pxX = e.clientX - left;
                      const pxY = e.clientY - top;
                      const x = Math.max(0, Math.min(100, (pxX / width) * 100));
                      const y = Math.max(0, Math.min(100, (pxY / height) * 100));
                      setZoomPos({ x, y, pxX, pxY });
                      setIsZoomed(true);
                    }}
                    onMouseLeave={() => setIsZoomed(false)}
                    onMouseMove={handleMouseMove}
                  >
                    <img
                      src={getOptimizedImageUrl(galleryImages[activeImgIdx] || selectedProduct.imageUrl, isMobile)}
                      alt={selectedProduct.altText || selectedProduct.name}
                      className="w-full h-full object-cover select-none pointer-events-none transition-opacity duration-300"
                      style={{
                        opacity: isZoomed ? 0.85 : 1,
                      }}
                    />

                    {/* Laser lens selector tracing the zoom position */}
                    {isZoomed && (
                      <div 
                        className="absolute pointer-events-none"
                        style={{
                          width: "150px",
                          height: "150px",
                          left: "0",
                          top: "0",
                          transform: `translate3d(${zoomPos.pxX - 75}px, ${zoomPos.pxY - 75}px, 0)`,
                          borderRadius: "12px",
                          border: "1.5px solid rgba(255, 255, 255, 0.95)",
                          boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.22), inset 0 0 15px rgba(255, 255, 255, 0.25)", // Darkened overlay outside lens with subtle inner glow
                          transition: "transform 0.08s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease"
                        }}
                      />
                    )}

                    {/* Top-Right action tags */}
                    <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
                      <button 
                        type="button"
                        onClick={() => handleToggleWishlist && handleToggleWishlist(selectedProduct.id || selectedProduct.name)}
                        className="transition-all duration-300 cursor-pointer focus-visible:outline-none flex items-center justify-center p-0.5 bg-transparent"
                        title={wishlist.includes(selectedProduct.id) || wishlist.includes(selectedProduct.name) ? "Remove from Wishlist" : "Add to Wishlist"}
                      >
                        <BookmarkStar filled={wishlist.includes(selectedProduct.id) || wishlist.includes(selectedProduct.name)} className="w-7.5 h-9.5" />
                      </button>
                      <button 
                        type="button"
                        onClick={handleShareProduct}
                        className={`p-2 rounded-full border shadow-3xs transition-all duration-300 cursor-pointer ${
                          shareCopied
                            ? "bg-emerald-50 border-emerald-300 text-emerald-600 scale-105"
                            : "bg-white/95 hover:bg-white text-stone-500 hover:text-stone-900 hover:scale-105 border-stone-200/80"
                        }`}
                        title={shareCopied ? "Link Copied!" : "Share Product"}
                      >
                        {shareCopied ? <Check className="w-4 h-4 text-emerald-600 animate-pulse" /> : <Share2 className="w-4 h-4" />}
                      </button>

                      {/* Compare button hidden per user request */}
                    </div>

                  </div>

                  {/* --- EXTERNAL ZOOM PANEL (OUTSIDE THE LAYOUT) --- */}
                  {isZoomed && (
                    <div className="absolute top-0 left-[104%] w-full h-full hidden lg:flex flex-col bg-white border border-stone-200 shadow-lg rounded-2xl overflow-hidden z-50 pointer-events-none animate-fade-in">
                      <div className="flex-1 relative overflow-hidden bg-stone-50">
                        <img
                          src={getOptimizedImageUrl(galleryImages[activeImgIdx] || selectedProduct.imageUrl, isMobile)}
                          alt="HD Wool Detail"
                          className="absolute w-full h-full object-cover left-0 top-0"
                          style={{
                            transformOrigin: "50% 50%",
                            transform: `scale(3) translate3d(${(50 - zoomPos.x)}%, ${(50 - zoomPos.y)}%, 0)`,
                            transition: "transform 0.1s cubic-bezier(0.16, 1, 0.3, 1)",
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-center items-center pt-2 pb-1">
                  <button
                    type="button"
                    onClick={() => {
                      setLightboxProduct(selectedProduct);
                      setLightboxImageIndex(activeImgIdx);
                    }}
                    className="group px-4 py-2 bg-white hover:bg-stone-50 border border-stone-200 hover:border-stone-400 text-stone-700 hover:text-stone-900 font-sans text-xs font-semibold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 rounded-full shadow-2xs hover:shadow-xs cursor-pointer active:scale-98 focus:outline-none -mt-[2px]"
                    id="see-full-gallery-btn"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-stone-500 group-hover:text-stone-800 transition-colors" />
                    <span>See Full Gallery</span>
                  </button>
                </div>

                {/* Horizontal gallery list for compact views */}
                <div className="flex sm:hidden gap-1.5 overflow-x-auto py-1">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={`h-thumb-${idx}-${img.slice(-15)}`}
                      type="button"
                      onClick={() => setActiveImgIdx(idx)}
                      className={`w-12 h-12 rounded-lg overflow-hidden shrink-0 border-2 bg-white transition-all ${
                        activeImgIdx === idx ? "border-[#e47911]" : "border-stone-220"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}

                  {/* Video thumbnails uploaded by store owner */}
                  {productVideoList.map((videoUrl, vIdx) => {
                    const ytThumbnail = getYouTubeThumbnail(videoUrl);
                    return (
                      <button
                        key={`video-horizontal-${vIdx}`}
                        type="button"
                        onClick={() => {
                          if (onOpenReels) {
                            onOpenReels();
                          } else {
                            setActiveVideoUrl(videoUrl);
                            setIsVideoOpen(true);
                          }
                        }}
                        className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border-2 border-stone-200 hover:border-[#e47911] bg-stone-900 transition-all cursor-pointer relative animate-fade-in"
                        title={`Watch Product Showcase Video #${vIdx + 1}`}
                      >
                        <img src={ytThumbnail || galleryImages[0] || selectedProduct.imageUrl} alt="Video Thumbnail" className="w-full h-full object-cover opacity-65" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center" id={`horizontal-play-overlay-${vIdx}`}>
                          <div className="w-5 h-5 rounded-full bg-red-650 flex items-center justify-center text-white text-[9px] shadow-3xs">
                            ▶
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Column 2: Core product content middle pane [5 Cols] */}
            <div className="lg:col-span-4 flex flex-col justify-start text-left gap-5 h-fit">
              <div className="space-y-3.5">
                


                {/* Main Heading title in pure premium format */}
                <h1 className="text-xl md:text-2xl font-normal md:font-medium text-slate-900 tracking-normal leading-snug -mt-[2px]">
                  {isBerberRugProduct
                    ? "Handcrafted Premium Atlas Berber Rug - Natural Organic Wool, Traditional Hand-Knotted Weaving"
                    : selectedProduct.name}
                </h1>



                {/* Exclusive Deal Pricing Block */}
                {isDiscountEnabled ? (
                  <div className="flex flex-col gap-1.5 pt-1">
                    <div className="flex items-center gap-3">
                      <span className="text-rose-600 font-medium text-2xl">-{discountPercentValue}%</span>
                      <div className="flex items-baseline">
                        <span className="text-slate-900 font-semibold text-2xl sm:text-3xl font-sans tracking-tight">
                          {activePrice.toLocaleString()}
                        </span>
                        <span className="text-[11px] font-bold text-slate-900 align-top relative -top-2.5 ml-0.5">
                          DA
                        </span>
                      </div>
                      <span className="text-slate-400 line-through text-xs font-mono ml-1">
                        {isBerberRugProduct ? "34,000 DA" : `${selectedProduct.price.toLocaleString()} DA`}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 pt-1">
                    <div className="flex items-baseline">
                      <span className="text-slate-900 font-semibold text-2xl sm:text-3xl font-sans tracking-tight">
                        {activePrice.toLocaleString()}
                      </span>
                      <span className="text-[11px] font-bold text-slate-900 align-top relative -top-2.5 ml-0.5">
                        DA
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider px-2 py-0.5 border border-slate-200/90 rounded font-sans inline-block">
                      ORIGINAL PRICE
                    </span>
                  </div>
                )}

                {/* Urgency Countdown Dynamic Banner */}
                {selectedProduct.timerEnabled && (
                  <div className={`p-3 rounded-2xl border text-xs font-medium flex items-center justify-between mt-2 max-w-sm animate-pulse transition-all duration-1000 ${timerStyles[timerColorIndex].container}`}>
                    <span className="font-extrabold flex items-center gap-1.5 font-sans">
                      <span>🔥 HURRY! EXCLUSIVE DEAL CLOSING:</span>
                    </span>
                    <span className={`font-black font-mono px-2 py-0.5 rounded tracking-wider transition-all duration-1000 ${timerStyles[timerColorIndex].badge}`}>
                      {String(timeLeft.hrs).padStart(2, '0')}h : {String(timeLeft.mins).padStart(2, '0')}m : {String(timeLeft.secs).padStart(2, '0')}s
                    </span>
                  </div>
                )}

                {/* Customizable parameters / Specifications block based on category */}
                {selectedProduct.category === "Electronics" ? (
                  /* Technical Specifications Table */
                  <div className="space-y-3 pt-3 border-t border-b border-stone-200 py-4 animate-fadeIn">
                    <div className="flex items-center gap-2 text-slate-800 pb-1.5">
                      <Cpu className="w-4 h-4 text-slate-700 animate-pulse" />
                      <span className="font-extrabold text-[11.5px] uppercase tracking-wider text-slate-700 font-sans">Technical Specifications</span>
                    </div>
                    
                    <div className="border border-stone-200/80 rounded-2xl overflow-hidden shadow-3xs bg-stone-50/50">
                      <table className="w-full text-[11.5px] border-collapse font-sans">
                        <tbody>
                          {/* Render custom specifications if present, otherwise render clean default ones */}
                          {selectedProduct.specifications && selectedProduct.specifications.length > 0 ? (
                            selectedProduct.specifications.map((spec, sIdx) => (
                              <tr key={`spec-${spec.key || sIdx}-${sIdx}`} className="border-b last:border-0 border-stone-200/55 hover:bg-stone-50 transition-colors">
                                <td className="p-3 bg-stone-100/60 font-black text-slate-500 uppercase tracking-wider text-[9.5px] w-1/3 border-r border-stone-250/20">{spec.key}</td>
                                <td className="p-3 text-slate-800 font-semibold">{spec.value}</td>
                              </tr>
                            ))
                          ) : (
                            /* Elegant Default fallback specifications table */
                            <>
                              <tr className="border-b border-stone-200/55 hover:bg-stone-50 transition-colors">
                                <td className="p-3 bg-stone-100/60 font-black text-slate-500 uppercase tracking-wider text-[9.5px] w-1/3 border-r border-stone-200/40">Processor</td>
                                <td className="p-3 text-slate-800 font-semibold">Google Tensor G3 / Octa-chip Core</td>
                              </tr>
                              <tr className="border-b border-stone-200/55 hover:bg-stone-50 transition-colors">
                                <td className="p-3 bg-stone-100/60 font-black text-slate-500 uppercase tracking-wider text-[9.5px] w-1/3 border-r border-stone-200/40">RAM Memory</td>
                                <td className="p-3 text-slate-800 font-semibold">8 GB LPDDR5X</td>
                              </tr>
                              <tr className="border-b border-stone-200/55 hover:bg-stone-50 transition-colors">
                                <td className="p-3 bg-stone-100/60 font-black text-slate-500 uppercase tracking-wider text-[9.5px] w-1/3 border-r border-stone-200/40">Storage Capacity</td>
                                <td className="p-3 text-slate-800 font-semibold">256 GB NVMe High Speed</td>
                              </tr>
                              <tr className="border-b last:border-0 border-stone-200/55 hover:bg-stone-50 transition-colors">
                                <td className="p-3 bg-stone-100/60 font-black text-slate-500 uppercase tracking-wider text-[9.5px] w-1/3 border-r border-stone-200/40">Battery</td>
                                <td className="p-3 text-slate-800 font-semibold">5000 mAh with 33W Fast Charge</td>
                              </tr>
                            </>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  /* Colors / Sizes Variant Selection */
                  <div className="space-y-4 pt-3 border-t border-b border-stone-200 py-4 text-xs animate-fadeIn">
                    {selectedProduct.variants && selectedProduct.variants.length > 0 ? (
                      /* Full Dynamic Variant Options Selectors */
                      <div className="space-y-4">
                        {Object.entries(variantOptions).map(([optionName, optionValues], oIdx) => {
                          const selectedValue = selectedOptions[optionName] || optionValues[0] || "";
                          const isColorOpt = optionName.toLowerCase() === "color" || optionName.toLowerCase() === "couleur";
                          return (
                            <div key={`opt-${optionName}-${oIdx}`} className="space-y-2">
                              <label className="text-stone-600 font-bold text-xs font-sans flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: activeThemeColor }} />
                                {optionName}: <strong className="text-stone-900 font-black ml-1">{selectedValue}</strong>
                              </label>
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {(optionValues as string[]).map((val, vIdx) => {
                                  const isSelected = selectedValue === val;
                                  // For colors, we can find a matching color spec to display a tiny color circle
                                  const colorSpec = isColorOpt ? selectedProduct.colors?.find((c: any) => c.name.toLowerCase() === val.toLowerCase()) : null;
                                  return (
                                    <button
                                      key={`val-${val}-${vIdx}`}
                                      type="button"
                                      onClick={() => {
                                        setSelectedOptions(prev => ({ ...prev, [optionName]: val }));
                                        if (isColorOpt) {
                                          setChosenColor(val);
                                          if (colorSpec) {
                                            setActiveThemeColor(colorSpec.hex);
                                          }
                                        } else if (optionName.toLowerCase() === "size" || optionName.toLowerCase() === "taille") {
                                          setChosenSize(val);
                                        }
                                      }}
                                      className="flex items-center gap-1.5 p-2 px-3 rounded-lg border-2 transition-all cursor-pointer text-[10.5px] font-bold"
                                      style={
                                        isSelected
                                          ? {
                                              borderColor: activeThemeColor,
                                              backgroundColor: hexToRgba(activeThemeColor, 0.12),
                                              color: "#0f172a",
                                            }
                                          : {
                                              borderColor: "#cbd5e1",
                                              backgroundColor: "#ffffff",
                                              color: "#334155",
                                            }
                                      }
                                    >
                                      {colorSpec && (
                                        <span className="w-3 h-3 rounded-full border border-stone-200" style={{ backgroundColor: colorSpec.hex }} />
                                      )}
                                      <span>{val}</span>
                                      {isSelected && <Check className="w-3 h-3 ml-0.5 shrink-0" style={{ color: activeThemeColor }} />}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      /* Classic fallbacks when no variants defined */
                      <>
                        {/* Selectable Color choices */}
                        {colorOptions && colorOptions.length > 0 && (
                          <div className="space-y-2">
                            <button
                              type="button"
                              onClick={() => setShowColorOptions(!showColorOptions)}
                              className="w-full flex justify-between items-center p-3 bg-stone-100/20 hover:bg-stone-100/85 border border-stone-200/80 hover:border-stone-400/40 rounded-xl transition-all cursor-pointer text-left select-none outline-none active:scale-99"
                            >
                              <span className="text-stone-600 font-bold text-xs font-sans flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: activeThemeColor }} />
                                Color Selected: <strong className="text-stone-900 font-black ml-1">{chosenColor || "Default"}</strong>
                              </span>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10.5px] font-bold select-none" style={{ color: activeThemeColor }}>Select Color</span>
                                <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform duration-300 ${showColorOptions ? "rotate-180" : ""}`} />
                              </div>
                            </button>
                            
                            {showColorOptions && (
                              <div className="flex flex-wrap gap-2 pt-1.5 animate-fade-in pl-1">
                                {colorOptions.map((opt, cIdx) => (
                                  <button
                                    key={`color-${opt.name}-${cIdx}`}
                                    type="button"
                                    onClick={() => {
                                      setChosenColor(opt.name);
                                      setActiveThemeColor(opt.hex);
                                    }}
                                    className="flex items-center gap-2 p-2 px-3 rounded-lg border-2 transition-all cursor-pointer"
                                    style={
                                      chosenColor === opt.name
                                        ? {
                                            borderColor: activeThemeColor,
                                            backgroundColor: hexToRgba(activeThemeColor, 0.12),
                                            boxShadow: `0 0 0 1px ${activeThemeColor}`,
                                          }
                                        : {
                                            borderColor: "#cbd5e1",
                                            backgroundColor: "#ffffff",
                                          }
                                    }
                                  >
                                    <span className="w-3.5 h-3.5 rounded-full border border-stone-200" style={{ backgroundColor: opt.hex }} />
                                    <span className="font-bold text-[10.5px] text-slate-800">{opt.name}</span>
                                    {chosenColor === opt.name && <Check className="w-3 h-3 ml-0.5 shrink-0" style={{ color: activeThemeColor }} />}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Selectable Size choices */}
                        {sizeOptions && sizeOptions.length > 0 && (
                          <div className="space-y-2">
                            <button
                              type="button"
                              onClick={() => setShowSizeOptions(!showSizeOptions)}
                              className="w-full flex justify-between items-center p-3 bg-stone-100/20 hover:bg-stone-100/85 border border-stone-200/80 hover:border-stone-400/40 rounded-xl transition-all cursor-pointer text-left select-none outline-none active:scale-99"
                            >
                              <span className="text-stone-600 font-bold text-xs font-sans flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: activeThemeColor }} />
                                Size Choice: <strong className="text-stone-900 font-black ml-1">{chosenSize || "Default"}</strong>
                              </span>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10.5px] font-bold select-none" style={{ color: activeThemeColor }}>Select Size</span>
                                <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform duration-300 ${showSizeOptions ? "rotate-180" : ""}`} />
                              </div>
                            </button>
                            
                            {showSizeOptions && (
                              <div className="flex flex-wrap gap-1.5 pt-1.5 animate-fade-in pl-1">
                                {sizeOptions.map((sz, sIdx) => (
                                  <button
                                    key={`size-${sz}-${sIdx}`}
                                    type="button"
                                    onClick={() => {
                                      setChosenSize(sz);
                                    }}
                                    className="p-2.5 px-4 rounded-lg border-2 transition-all text-[11px] font-bold cursor-pointer"
                                    style={
                                      chosenSize === sz
                                        ? {
                                            borderColor: activeThemeColor,
                                            backgroundColor: hexToRgba(activeThemeColor, 0.12),
                                            color: "#0f172a",
                                            textDecoration: "underline",
                                          }
                                        : {
                                            borderColor: "#cbd5e1",
                                            backgroundColor: "#ffffff",
                                            color: "#334155",
                                          }
                                    }
                                  >
                                    {sz}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}



              </div>

              {/* Product description & storytelling section */}
              <div className="space-y-4 pt-4 border-t border-stone-200">
                {((selectedProduct.description && selectedProduct.description.trim().length > 0) ||
                  (selectedProduct.description_en && selectedProduct.description_en.trim().length > 0) ||
                  (selectedProduct.description_fr && selectedProduct.description_fr.trim().length > 0) ||
                  (selectedProduct.description_ar && selectedProduct.description_ar.trim().length > 0)) ? (
                  <div className="space-y-3 text-xs text-left">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                      <h4 className="font-extrabold text-slate-900 text-sm">Product Description</h4>
                      {/* Language selector chips */}
                      <div className="flex items-center gap-1.5 bg-stone-105 p-1 rounded-lg">
                        {((selectedProduct.description_en && selectedProduct.description_en.trim().length > 0) || (!selectedProduct.description_en && !selectedProduct.description_fr && !selectedProduct.description_ar)) && (
                          <button
                            type="button"
                            onClick={() => setDescLang("en")}
                            className={`px-2.5 py-1 rounded-md text-[10px] font-black transition-all cursor-pointer ${
                              descLang === "en" ? "bg-stone-900 text-white shadow-3xs" : "text-slate-500 hover:text-stone-800"
                            }`}
                          >
                            🇬🇧 EN
                          </button>
                        )}
                        {selectedProduct.description_fr && selectedProduct.description_fr.trim().length > 0 && (
                          <button
                            type="button"
                            onClick={() => setDescLang("fr")}
                            className={`px-2.5 py-1 rounded-md text-[10px] font-black transition-all cursor-pointer ${
                              descLang === "fr" ? "bg-stone-900 text-white shadow-3xs" : "text-slate-500 hover:text-stone-800"
                            }`}
                          >
                            🇫🇷 FR
                          </button>
                        )}
                        {selectedProduct.description_ar && selectedProduct.description_ar.trim().length > 0 && (
                          <button
                            type="button"
                            onClick={() => setDescLang("ar")}
                            className={`px-2.5 py-1 rounded-md text-[10px] font-black transition-all cursor-pointer ${
                              descLang === "ar" ? "bg-stone-900 text-white shadow-3xs" : "text-slate-500 hover:text-stone-800"
                            }`}
                          >
                            🇩🇿 العربية
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="bg-stone-50/70 p-4 rounded-xl border border-stone-200/40 text-[11px] leading-relaxed text-slate-705 font-medium [&_ol]:list-decimal [&_ol]:pl-4 [&_ul]:list-disc [&_ul]:pl-4 [&_li]:my-1 [&_b]:font-bold [&_strong]:font-bold">
                      {descLang === "en" && selectedProduct.description_en && (
                        <div className="animate-fadeIn" dangerouslySetInnerHTML={{ __html: selectedProduct.description_en }} />
                      )}
                      {descLang === "fr" && selectedProduct.description_fr && (
                        <div className="animate-fadeIn" dangerouslySetInnerHTML={{ __html: selectedProduct.description_fr }} />
                      )}
                      {descLang === "ar" && selectedProduct.description_ar && (
                        <div className="animate-fadeIn text-right text-[12px] leading-loose font-semibold" dir="rtl" dangerouslySetInnerHTML={{ __html: selectedProduct.description_ar }} />
                      )}
                      {/* Fallback to standard description */}
                      {(!selectedProduct[`description_${descLang}`] && selectedProduct.description) && (
                        <div className="animate-fadeIn" dangerouslySetInnerHTML={{ __html: selectedProduct.description }} />
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 text-xs">
                    <h4 className="font-extrabold text-slate-900 text-sm">About this item</h4>
                    <ul className="list-disc pl-4 space-y-1.5 text-slate-600 text-[11px] leading-relaxed font-sans">
                      <li>
                        <strong>EXQUISITE DETAIL CRAFTSMANSHIP:</strong> Elaborately created manually by native master weavers in the {selectedStore.wilaya} community, ensuring every artifact carries centuries of Berber heritage and storytelling.
                      </li>
                      <li>
                        <strong>COMFY & SOLID BUILD:</strong> Woven from pristine, organic organic fibers designed to stand up to decades of modern use without losing its thick density or colorful look.
                      </li>
                      <li>
                        <strong>NATURAL CHEMICAL-FREE CARE:</strong> Thoroughly washed using local wild spring water and scented with organic oils, safe for kids, nurseries, and heavy foot-traffic living areas.
                      </li>
                      <li>
                        <strong>TRADITIONAL PATTERN CODES:</strong> Features subtle tribal geometry configurations that capture protection, luck, and happiness blessings.
                      </li>
                    </ul>
                  </div>
                )}

                {/* AI vision alt text accessibility features */}
                {selectedProduct.altText && (
                  <div className="bg-emerald-50/40 border border-emerald-100/60 p-3.5 rounded-xl text-left mt-4 font-sans text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-bold mb-1.5">
                      <span className="text-[14px]">♿</span>
                      <span>Image Description d'Accessibilité (AI Vision)</span>
                    </div>
                    <p className="text-[11px] text-slate-705 leading-relaxed font-medium bg-white/70 p-2 rounded-lg border border-emerald-100/30">
                      <strong>Texte Alternatif principal:</strong> "{selectedProduct.altText}"
                    </p>
                    {selectedProduct.detailedDescription && (
                      <div className="mt-2 text-[10px] text-slate-600 leading-relaxed">
                        <strong className="text-emerald-900 block text-[9px] uppercase font-mono mb-0.5">Composition & Détails de l'image ({selectedProduct.altTextModel || "AI"}):</strong>
                        <p>{selectedProduct.detailedDescription}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>


              {/* Optional Showcase Videos in the middle of the page removed */}




            </div>
          </div>

              {/* 3. Customer Reviews & Rating Module */}
              <ProductReviewWidget
                productName={selectedProduct.name}
                storeName={selectedStore.name}
                storeLogo={selectedStore.logo || (selectedStore as any).logoUrl}
                activeThemeColor={activeThemeColor}
                currentUserName={currentUser?.name || selectedStore?.name || myStore?.name || "Tapis Berbères Ath Yenni"}
                currentUserRole={currentUser ? currentUser.role : "Guest"}
                currentUserId={(currentUser as any)?.id}
                currentUserIp={getGuestIp()}
                currentStoreId={selectedStore?.id}
                myStoreId={myStore?.id}
                purchasedVariant={hasUserPurchasedCurrentProduct ? ([chosenColor, chosenSize].filter(Boolean).join(" • ") || "Black • XL") : undefined}
                reviews={threadedComments.map((c) => {
                  const mapReplyRecursively = (r: any): any => ({
                    id: r.id,
                    author: r.author,
                    role: r.role,
                    badge: r.badge,
                    ip: (r as any).ip || (r as any).commentIp,
                    text: r.text,
                    images: r.images || [],
                    purchasedVariant: (r as any).purchasedVariant,
                    avatar: r.avatar,
                    avatarBg: r.avatarBg,
                    time: r.time,
                    likes: r.likes || 0,
                    liked: r.liked,
                    loves: r.loves,
                    loved: r.loved,
                    hahas: r.hahas,
                    hahad: r.hahad,
                    emoji: r.emoji,
                    isHidden: r.isHidden,
                    isPinned: r.isPinned,
                    isLocked: r.isLocked,
                    parentId: r.parentId || c.id,
                    replies: r.replies ? r.replies.map(mapReplyRecursively) : []
                  });

                  return {
                    id: c.id,
                    author: c.author,
                    role: c.role,
                    badge: c.badge,
                    ip: (c as any).ip || (c as any).commentIp,
                    rating: (c as any).rating || 5,
                    text: c.text,
                    images: (c as any).images || [],
                    purchasedVariant: (c as any).purchasedVariant,
                    avatar: c.avatar,
                    avatarBg: c.avatarBg,
                    time: c.time,
                    likes: c.likes,
                    liked: c.liked,
                    loves: c.loves,
                    loved: c.loved,
                    hahas: c.hahas,
                    hahad: c.hahad,
                    emoji: (c as any).emoji || "😊",
                    isHidden: (c as any).isHidden,
                    isPinned: (c as any).isPinned,
                    isLocked: (c as any).isLocked,
                    parentId: c.parentId,
                    replies: c.replies?.map(mapReplyRecursively) || []
                  };
                })}
                onAddReview={(newReview) => {
                  const identity = getUserCommentIdentity();
                  const isGuest = !currentUser || identity.role === "Guest" || identity.author.toLowerCase().includes("guest");
                  const actualPurchasedVariant =
                    newReview.purchasedVariant ||
                    (hasUserPurchasedCurrentProduct
                      ? [chosenColor, chosenSize].filter(Boolean).join(" • ") || "Black • XL"
                      : undefined);

                  const item = {
                    id: `rc_${Date.now()}`,
                    author: identity.author,
                    role: identity.role,
                    badge: actualPurchasedVariant ? "Verified Purchase" : identity.badge,
                    ip: getGuestIp(),
                    rating: newReview.rating,
                    text: newReview.text,
                    emoji: newReview.emoji,
                    images: isGuest ? [] : (newReview.images || []),
                    purchasedVariant: actualPurchasedVariant,
                    avatar: identity.avatar,
                    avatarBg: identity.avatarBg,
                    time: "Just now",
                    likes: 0,
                    parentId: null,
                    isNew: true,
                    replies: []
                  };
                  setThreadedComments((prev) => [item, ...prev]);
                }}
                onToggleLike={(reviewId) => {
                  setThreadedComments((prev) =>
                    prev.map((c) => {
                      if (c.id === reviewId) {
                        const liked = !c.liked;
                        const likes = c.likes + (liked ? 1 : -1);
                        return { ...c, likes, liked };
                      }
                      return c;
                    })
                  );
                }}
                onToggleLove={(reviewId) => {
                  setThreadedComments((prev) =>
                    prev.map((c) => {
                      if (c.id === reviewId) {
                        const loved = !c.loved;
                        const currentLoves = typeof c.loves === "number" ? c.loves : (c.loved ? 1 : 0);
                        const loves = Math.max(0, currentLoves + (loved ? 1 : -1));
                        return { ...c, loves, loved };
                      }
                      return c;
                    })
                  );
                }}
                onToggleHaha={(reviewId) => {
                  setThreadedComments((prev) =>
                    prev.map((c) => {
                      if (c.id === reviewId) {
                        const hahad = !c.hahad;
                        const currentHahas = typeof c.hahas === "number" ? c.hahas : (c.hahad ? 1 : 0);
                        const hahas = Math.max(0, currentHahas + (hahad ? 1 : -1));
                        return { ...c, hahas, hahad };
                      }
                      return c;
                    })
                  );
                }}
                onAddReply={(targetId, replyText, images) => {
                  const identity = getUserCommentIdentity();
                  const isGuest = !currentUser || identity.role === "Guest" || identity.author.toLowerCase().includes("guest");
                  const newReply = {
                    id: `reply_${Date.now()}`,
                    author: identity.author,
                    role: identity.role,
                    badge: identity.badge,
                    ip: getGuestIp(),
                    text: replyText,
                    images: isGuest ? [] : (images || []),
                    avatar: identity.avatar,
                    avatarBg: identity.avatarBg,
                    time: "Just now",
                    likes: 0,
                    parentId: targetId,
                    isNew: true,
                    replies: []
                  };

                  const insertReplyInTree = (items: any[]): any[] => {
                    return items.map((item) => {
                      if (item.id === targetId) {
                        return {
                          ...item,
                          replies: [...(item.replies || []), newReply]
                        };
                      }
                      if (item.replies && item.replies.length > 0) {
                        return {
                          ...item,
                          replies: insertReplyInTree(item.replies)
                        };
                      }
                      return item;
                    });
                  };

                  setThreadedComments((prev) => insertReplyInTree(prev));
                }}
                onToggleReplyLike={(rootId, replyId) => {
                  const targetId = replyId || rootId;
                  const toggleLikeInTree = (items: any[]): any[] => {
                    return items.map((item) => {
                      if (item.id === targetId) {
                        const liked = !item.liked;
                        const likes = (item.likes || 0) + (liked ? 1 : -1);
                        return { ...item, liked, likes };
                      }
                      if (item.replies && item.replies.length > 0) {
                        return { ...item, replies: toggleLikeInTree(item.replies) };
                      }
                      return item;
                    });
                  };
                  setThreadedComments((prev) => toggleLikeInTree(prev));
                }}
                onToggleReplyLove={(rootId, replyId) => {
                  const targetId = replyId || rootId;
                  const toggleLoveInTree = (items: any[]): any[] => {
                    return items.map((item) => {
                      if (item.id === targetId) {
                        const loved = !item.loved;
                        const currentLoves = typeof item.loves === "number" ? item.loves : (item.loved ? 1 : 0);
                        const loves = Math.max(0, currentLoves + (loved ? 1 : -1));
                        return { ...item, loved, loves };
                      }
                      if (item.replies && item.replies.length > 0) {
                        return { ...item, replies: toggleLoveInTree(item.replies) };
                      }
                      return item;
                    });
                  };
                  setThreadedComments((prev) => toggleLoveInTree(prev));
                }}
                onToggleReplyHaha={(rootId, replyId) => {
                  const targetId = replyId || rootId;
                  const toggleHahaInTree = (items: any[]): any[] => {
                    return items.map((item) => {
                      if (item.id === targetId) {
                        const hahad = !item.hahad;
                        const currentHahas = typeof item.hahas === "number" ? item.hahas : (item.hahad ? 1 : 0);
                        const hahas = Math.max(0, currentHahas + (hahad ? 1 : -1));
                        return { ...item, hahad, hahas };
                      }
                      if (item.replies && item.replies.length > 0) {
                        return { ...item, replies: toggleHahaInTree(item.replies) };
                      }
                      return item;
                    });
                  };
                  setThreadedComments((prev) => toggleHahaInTree(prev));
                }}
                onDeleteComment={(targetId) => {
                  const deleteFromTree = (items: any[]): any[] => {
                    return items
                      .filter((item) => item.id !== targetId)
                      .map((item) => {
                        if (item.replies && item.replies.length > 0) {
                          return { ...item, replies: deleteFromTree(item.replies) };
                        }
                        return item;
                      });
                  };
                  setThreadedComments((prev) => deleteFromTree(prev));
                }}
                onEditComment={(targetId, newText) => {
                  const editInTree = (items: any[]): any[] => {
                    return items.map((item) => {
                      if (item.id === targetId) {
                        return { ...item, text: newText, isEdited: true };
                      }
                      if (item.replies && item.replies.length > 0) {
                        return { ...item, replies: editInTree(item.replies) };
                      }
                      return item;
                    });
                  };
                  setThreadedComments((prev) => editInTree(prev));
                }}
                onCustomizeComment={(targetId, updates) => {
                  const customizeInTree = (items: any[]): any[] => {
                    return items.map((item) => {
                      if (item.id === targetId) {
                        return {
                          ...item,
                          author: updates.author || item.author,
                          badge: updates.badge || item.badge,
                          avatarBg: updates.avatarBg || item.avatarBg,
                          emoji: updates.emoji || item.emoji
                        };
                      }
                      if (item.replies && item.replies.length > 0) {
                        return { ...item, replies: customizeInTree(item.replies) };
                      }
                      return item;
                    });
                  };
                  setThreadedComments((prev) => customizeInTree(prev));
                }}
                onReportComment={(targetId, reason) => {
                  const reportInTree = (items: any[]): any[] => {
                    return items.map((item) => {
                      if (item.id === targetId) {
                        return { ...item, isReported: true, reportReason: reason };
                      }
                      if (item.replies && item.replies.length > 0) {
                        return { ...item, replies: reportInTree(item.replies) };
                      }
                      return item;
                    });
                  };
                  setThreadedComments((prev) => reportInTree(prev));
                }}
              />
            </div>

            {/* Column 3: The Authentic Buy Box sidebar panel [3 Cols] */}
            <div className="lg:col-span-3 flex flex-col gap-4 lg:ml-6">
              <div className="sticky top-20 bg-white/90 backdrop-blur-xl rounded-3xl border border-white/60 ring-1 ring-slate-900/5 shadow-[0_12px_35px_rgba(0,0,0,0.08)] hover:shadow-[0_22px_55px_rgba(0,0,0,0.16)] transition-[shadow,transform] duration-200 hover:-translate-y-0.5 p-5 -mt-[5px] ml-0 text-left flex flex-col gap-3.5 w-[300px] max-w-full h-fit">
                
                {/* Real-time price and localized delivery options */}
                <div className="space-y-2 border-b border-stone-100 pb-3">
                  {/* 1. Item & Total Price at top */}
                  <div className="space-y-1.5">
                    {isShippingCalculated ? (
                      <>
                        <div className="flex items-baseline justify-between">
                          <span className="text-xs font-black text-slate-900">Total Price:</span>
                          <span className="text-2xl font-black font-display" style={{ color: themeAccentColor }}>
                            {calculatedGrandTotal.toLocaleString()} DA
                          </span>
                        </div>
                        <div className="space-y-1 pt-1.5 border-t border-stone-200">
                          <div className="flex items-center justify-between text-xs text-stone-600 font-bold">
                            <span>Item Price:</span>
                            <span className="font-mono text-slate-900">{calculatedSubtotal.toLocaleString()} DA</span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-stone-600 font-bold">
                            <span>Shipping ({shippingMethod === "home" ? "Home" : "Desk"}):</span>
                            <span className="font-mono text-emerald-700">+{calculatedShippingFee.toLocaleString()} DA</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs font-black text-slate-900">Item Price:</span>
                        <span className="text-2xl font-black font-display" style={{ color: themeAccentColor }}>
                          {calculatedSubtotal.toLocaleString()} DA
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 2. Availability */}
                  <div className="flex items-center justify-between pt-1 border-t border-dashed border-stone-200/60">
                    <span className="text-xs text-stone-500 font-bold">Availability:</span>
                    {isOutOfStockState ? (
                      <div className="text-[10px] text-rose-600 font-extrabold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
                        Out of Stock
                      </div>
                    ) : (
                      <div className="text-[10px] text-[#007600] font-bold flex items-center gap-1 justify-end">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#007600] animate-ping" />
                        In stock, {selectedDeliveryCompany.name.split(" ")[0]} ready
                      </div>
                    )}
                  </div>

                  {/* 3. Selected Shipping Details Summary */}
                  {isShippingCalculated && (
                    <div className="bg-stone-50 rounded-xl p-2.5 border border-stone-200/80 text-[11px] space-y-1.5 mt-2 animate-fade-in text-slate-700">
                      <div className="flex items-center justify-between pb-1 border-b border-stone-200/60">
                        <span className="text-stone-500 font-bold text-[10px] uppercase tracking-wider font-mono">Shipping Summary</span>
                        <button
                          type="button"
                          onClick={() => setIsShippingOpen(true)}
                          className="text-[10px] text-indigo-600 font-extrabold hover:underline cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-stone-500 font-medium">Country:</span>
                        <span className="font-bold text-slate-800">{selectedCountry}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-stone-500 font-medium">State:</span>
                        <span className="font-bold text-slate-800">{selectedWilaya.id} - {selectedWilaya.name}</span>
                      </div>
                      {selectedCommune && (
                        <div className="flex items-center justify-between">
                          <span className="text-stone-500 font-medium">City:</span>
                          <span className="font-bold text-slate-800">{selectedCommune}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-stone-500 font-medium">Estimated Delivery:</span>
                        <span className="font-bold text-slate-800 font-mono">{selectedWilaya.time || "24-48 Hours"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-stone-500 font-medium">Delivery Type:</span>
                        <span className="font-bold text-slate-800">
                          {shippingMethod === "home" ? "Home Delivery" : "Pickup Desk"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-stone-200/60">
                        <span className="text-stone-500 font-medium">Shipping Cost:</span>
                        <span className="font-mono font-bold text-emerald-700 bg-transparent text-[11px]">
                          +{calculatedShippingFee.toLocaleString()} DA
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Shipping Price Calculator Section */}
                <div id="shipping-container-dz" className="space-y-2">
                  
                  {!isShippingOpen ? (
                    !isShippingCalculated && (
                      <button
                        type="button"
                        onClick={() => setIsShippingOpen(true)}
                        className="w-full text-white font-extrabold py-3 px-4 rounded-full text-center text-xs shadow-md hover:shadow-lg active:scale-98 cursor-pointer transition-all flex items-center justify-center gap-2 border border-transparent select-none outline-none group"
                        style={{ backgroundColor: themeAccentColor }}
                      >
                        <Truck className="w-4 h-4 text-white transition-transform group-hover:scale-110" />
                        <span>Check Shipping Prices</span>
                      </button>
                    )
                  ) : (
                    <AnimatePresence>
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="space-y-3 bg-stone-50 rounded-2xl p-3.5 border border-stone-200"
                      >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                          <span className="text-[10px] font-extrabold text-slate-800 tracking-wider font-mono flex items-center gap-1.5">
                            <Truck className="w-3.5 h-3.5 text-slate-700" style={{ color: themeAccentColor }} />
                            Check Shipping Prices
                          </span>
                          <button
                            type="button"
                            onClick={() => setIsShippingOpen(false)}
                            className="text-stone-400 hover:text-stone-700 p-1 rounded-full hover:bg-stone-200/60 transition-colors cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Field 1: Country */}
                        <SearchableLocationSelect
                          label="1. Country"
                          required
                          value={selectedCountryName}
                          onChange={handleCountryChange}
                          options={countryOptions}
                          placeholder="Select country..."
                          searchPlaceholder="Search country..."
                          icon={Globe}
                        />

                        {/* Field 2: State */}
                        <SearchableLocationSelect
                          label="2. State"
                          required
                          value={selectedStateName}
                          onChange={handleStateChange}
                          options={stateOptions}
                          placeholder="Select state..."
                          searchPlaceholder="Search state..."
                          icon={MapPin}
                        />

                        {/* Field 3: City */}
                        <SearchableLocationSelect
                          label="3. City"
                          required
                          value={selectedCityName}
                          onChange={handleCityChange}
                          options={cityOptions}
                          placeholder="Select city..."
                          searchPlaceholder="Search city..."
                          icon={Building}
                        />

                        {/* Field 4: Select Carrier (Required) - Hidden as requested */}
                        <div className="space-y-1 relative hidden">
                          <label className="text-[9.5px] font-extrabold text-slate-700 block font-mono">
                            4. Select Carrier <span className="text-rose-500 font-bold">*</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setShowCompanyDropdown(!showCompanyDropdown);
                            }}
                            className="w-full flex items-center justify-between text-xs font-bold bg-white border rounded-xl px-2.5 py-2 transition-all cursor-pointer outline-none shadow-3xs"
                            style={{ borderColor: showCompanyDropdown ? activeThemeColor : "#cbd5e1" }}
                          >
                            <span className="flex items-center gap-1.5 min-w-0">
                              <Truck className="w-3.5 h-3.5 shrink-0 text-slate-600" style={{ color: activeThemeColor }} />
                              <span className="truncate">{selectedDeliveryCompany.name}</span>
                            </span>
                            <ChevronDown className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          </button>

                          {showCompanyDropdown && (
                            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-stone-200 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto no-scrollbar py-1 animate-fade-in">
                              {DELIVERY_COMPANIES.map((c) => (
                                <button
                                  key={c.id}
                                  type="button"
                                  onClick={() => {
                                    setSelectedDeliveryCompanyId(c.id);
                                    setShowCompanyDropdown(false);
                                  }}
                                  className={`w-full text-left px-3 py-2 hover:bg-stone-50 transition-colors flex items-center justify-between text-xs outline-none cursor-pointer border-b border-stone-100 last:border-0 ${
                                    selectedDeliveryCompanyId === c.id ? "bg-stone-100/50 font-bold" : "text-stone-700"
                                  }`}
                                >
                                  <span className="text-xs font-semibold">{c.name}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Field 5: Delivery Type (Required) */}
                        {(selectedCountry === "Algeria" || selectedCountry.startsWith("Algeria")) && (
                          <div className="space-y-1">
                            <label className="text-[9.5px] font-extrabold text-slate-700 block font-mono">
                              5. Delivery Type <span className="text-rose-500 font-bold">*</span>
                            </label>
                            <div className="grid grid-cols-2 gap-1.5">
                              <button
                                type="button"
                                onClick={() => setShippingMethod("home")}
                                className="flex flex-col items-center justify-center p-2 rounded-xl border-2 cursor-pointer transition-all select-none outline-none"
                                style={
                                  shippingMethod === "home"
                                    ? {
                                        borderColor: activeThemeColor,
                                        backgroundColor: hexToRgba(activeThemeColor, 0.1),
                                        color: "#0f172a",
                                        fontWeight: "bold",
                                      }
                                    : {
                                        borderColor: "#e7e5e4",
                                        backgroundColor: "#ffffff",
                                        color: "#78716c",
                                      }
                                }
                              >
                                <Truck 
                                  className="w-3.5 h-3.5 mb-0.5 shrink-0" 
                                  style={{ color: shippingMethod === "home" ? activeThemeColor : "#a8a29e" }}
                                />
                                <span className="text-[9.5px] leading-none font-bold">Home Delivery</span>
                                <span className="text-[9.5px] font-mono mt-0.5 text-slate-800">
                                  +{selectedWilaya.homePrice} DA
                                </span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setShippingMethod("stopdesk")}
                                className="flex flex-col items-center justify-center p-2 rounded-xl border-2 cursor-pointer transition-all select-none outline-none"
                                style={
                                  shippingMethod === "stopdesk"
                                    ? {
                                        borderColor: activeThemeColor,
                                        backgroundColor: hexToRgba(activeThemeColor, 0.1),
                                        color: "#0f172a",
                                        fontWeight: "bold",
                                      }
                                    : {
                                        borderColor: "#e7e5e4",
                                        backgroundColor: "#ffffff",
                                        color: "#78716c",
                                      }
                                }
                              >
                                <Building 
                                  className="w-3.5 h-3.5 mb-0.5 shrink-0" 
                                  style={{ color: shippingMethod === "stopdesk" ? activeThemeColor : "#a8a29e" }}
                                />
                                <span className="text-[9.5px] leading-none font-bold">Pickup Desk</span>
                                <span className="text-[9.5px] font-mono mt-0.5 text-slate-800">
                                  +{selectedWilaya.stopdeskPrice} DA
                                </span>
                              </button>
                            </div>
                          </div>
                        )}

                        {/* OK Button */}
                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              setIsShippingCalculated(true);
                              setIsShippingOpen(false);
                            }}
                            className="w-full text-white font-black py-2.5 rounded-xl text-center text-xs shadow-xs hover:shadow-md active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                            style={{ backgroundColor: themeAccentColor }}
                          >
                            <CheckCircle2 className="w-4 h-4 text-white" />
                            <span>OK</span>
                          </button>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  )}

                </div>

                {/* Quantity selection form - shown once shipping info is filled */}
                {isShippingCalculated && (
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 bg-white border border-stone-220/80 rounded-xl px-3.5 py-2 animate-fade-in">
                    <span>Quantity:</span>
                    <div className="flex items-center gap-2">
                      <button 
                        type="button" 
                        onClick={() => setPurchaseQty(p => Math.max(1, p - 1))}
                        className="w-6 h-6 rounded-md bg-stone-100 hover:bg-stone-200 text-slate-800 font-bold flex items-center justify-center cursor-pointer select-none"
                      >
                        -
                      </button>
                      <span className="font-mono text-slate-900 min-w-[12px] text-center">{purchaseQty}</span>
                      <button 
                        type="button" 
                        onClick={() => setPurchaseQty(p => Math.min(10, p + 1))}
                        className="w-6 h-6 rounded-md bg-stone-100 hover:bg-stone-200 text-slate-800 font-bold flex items-center justify-center cursor-pointer select-none"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                {/* E-Commerce Action Buttons */}
                <div className="space-y-3.5 pt-1">
                  {isOutOfStockState ? (
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (hasNotified) return;
                        setHasNotified(true);
                        if (onNotifyMe) {
                          onNotifyMe(selectedProduct.name, selectedStore.name);
                        } else {
                          alert(`Notify Me registered for ${selectedProduct.name}`);
                        }
                        setTimeout(() => {
                          setHasNotified(false);
                        }, 4000);
                      }}
                      className="w-full text-white font-extrabold py-3.5 px-5 rounded-full text-center text-xs shadow-md hover:shadow-lg active:scale-97 cursor-pointer transition-all border-2 select-none outline-none flex items-center justify-center gap-2 group"
                      style={{ 
                        backgroundColor: hasNotified ? "#10b981" : themeAccentColor, 
                        borderColor: hasNotified ? "#10b981" : themeAccentColor 
                      }}
                    >
                      <Sparkles className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${hasNotified ? "animate-pulse" : ""}`} />
                      <span>{hasNotified ? "We'll Notify You! ✓" : "Notify Me"}</span>
                    </motion.button>
                  ) : (
                    <>
                      {/* Clean Outlined "Add to Cart" Button - Only shown for registered users, hidden for guest buyers */}
                      {isRegisteredUser && (
                        <button
                          type="button"
                          onClick={() => {
                            handleAddToCartWithGuestCheck();
                          }}
                          className="w-full bg-transparent font-extrabold py-2.5 px-5 rounded-full text-center text-xs shadow-3xs hover:shadow-xs active:scale-97 cursor-pointer transition-all border-2 select-none outline-none flex items-center justify-center gap-2 group"
                          style={{ 
                            borderColor: themeAccentColor, 
                            color: themeAccentColor 
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = hexToRgba(themeAccentColor, 0.08);
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                          }}
                        >
                          <ShoppingCart className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                          <span>Add to Cart</span>
                        </button>
                      )}

                      {/* Primary Solid "Buy Now" Button - Triggers Dedicated Buyer Checkout Form Modal */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsExpressCheckoutOpen(true);
                        }}
                        className="w-full text-white font-extrabold py-3 px-5 rounded-full text-center text-xs shadow-md hover:shadow-lg active:scale-97 cursor-pointer transition-all border-2 select-none outline-none flex items-center justify-center gap-2 group"
                        style={{ 
                          backgroundColor: themeAccentColor, 
                          borderColor: themeAccentColor 
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.filter = "brightness(0.92)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.filter = "none";
                        }}
                      >
                        <CreditCard className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110 text-white" />
                        <span>Buy Now</span>
                      </button>
                    </>
                  )}
                </div>

                {/* Secure checkout info */}
                <div className="space-y-2 text-[10.5px] text-slate-500 pt-1.5 border-t border-stone-100">
                  <div className="flex items-center gap-1.5 text-left leading-tight">
                    <Lock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>Secure transaction process checked. Your payment is secured and held in escrows.</span>
                  </div>
                  <div className="text-[9.5px] font-mono text-slate-400">
                    <div>Ships from: <strong className="text-slate-700 font-bold font-sans">{selectedStore.name} Courier</strong></div>
                  </div>
                </div>



              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* PRODUCT STORY (Sequential Images with Optional Descriptions) */}
          {/* ========================================================================= */}
          {selectedProduct.advancedLandingPageEnabled === true && (
            <div id="amazon-aplus-product-landing" className="my-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-left w-full">
              {(() => {
                let storyItems: Array<{ url: string; description?: string }> = [];
                const prodAny = selectedProduct as any;

                if (prodAny.advancedProductStorySections && Array.isArray(prodAny.advancedProductStorySections) && prodAny.advancedProductStorySections.length > 0) {
                  storyItems = prodAny.advancedProductStorySections.map((item: any) => {
                    if (typeof item === 'string') return { url: item, description: '' };
                    return { url: item.url || item.image || '', description: item.description || '' };
                  }).filter((it: any) => it.url);
                } else if (selectedProduct.uploadedLandingPageContent) {
                  const parser = new DOMParser();
                  const doc = parser.parseFromString(selectedProduct.uploadedLandingPageContent, "text/html");
                  const itemEls = doc.querySelectorAll(".product-story-item");

                  if (itemEls && itemEls.length > 0) {
                    itemEls.forEach((el) => {
                      const img = el.querySelector("img");
                      const desc = el.querySelector(".product-story-desc");
                      if (img && img.getAttribute("src")) {
                        storyItems.push({
                          url: img.getAttribute("src") || "",
                          description: desc ? desc.textContent || "" : ""
                        });
                      }
                    });
                  } else {
                    const regex = /<img[^>]+src="([^">]+)"/g;
                    let match;
                    while ((match = regex.exec(selectedProduct.uploadedLandingPageContent)) !== null) {
                      if (match[1] && !storyItems.some(it => it.url === match[1])) {
                        storyItems.push({ url: match[1], description: '' });
                      }
                    }
                  }
                }

                if (storyItems.length === 0 && prodAny.landingImages && Array.isArray(prodAny.landingImages)) {
                  storyItems = prodAny.landingImages.map((img: string) => ({ url: img, description: '' }));
                }

                if (storyItems.length > 0) {
                  return (
                    <div className="w-full space-y-6">
                      <div className="flex flex-col w-full gap-0 overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-md">
                        {storyItems.map((item, idx) => (
                          <div key={`story-preview-img-${idx}`} className="w-full flex flex-col bg-transparent">
                            <img
                              src={item.url}
                              alt={`Product Story Image ${idx + 1}`}
                              className="w-full h-auto block max-w-full object-contain"
                              decoding="async"
                              loading="lazy"
                              referrerPolicy="no-referrer"
                              style={{ display: "block", width: "100%", height: "auto", margin: 0, padding: 0 }}
                            />
                            {item.description && item.description.trim() !== "" && (
                              <div className="p-4 sm:p-5 bg-slate-50/90 dark:bg-slate-900/80 border-b border-slate-100 dark:border-slate-800/80">
                                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans font-medium text-left">
                                  {item.description}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                return null;
              })()}
            </div>
          )}

          {/* ========================================================================= */}
          {/* BOTTOM PAYBOX & INLINE ORDER FORM (Paybox hides when 'Buy Now' is clicked) */}
          {/* ========================================================================= */}
          
          {selectedProduct.advancedLandingPageEnabled === true && (
            <div id="bottom-layout-paybox" className={`my-8 w-full text-left transition-all duration-500 ease-in-out scroll-mt-6 ${
              isBottomInlineCheckoutOpen ? "w-full max-w-full" : "max-w-3xl mx-auto"
            }`}>
              <AnimatePresence mode="wait">
                {!isBottomInlineCheckoutOpen ? (
                <motion.div 
                  key="bottom-paybox-card"
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-white rounded-2xl border border-stone-200/80 ring-1 ring-slate-900/5 shadow-[0_8px_25px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.1)] transition-all duration-500 p-4 sm:p-5 md:p-6 space-y-3.5 text-slate-900 w-full"
                >
                  {/* Top row: Item & Total Price & Stock Availability */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-3">
                    <div>
                      {isShippingCalculated ? (
                        <div className="space-y-1">
                          <div className="flex items-baseline gap-2">
                            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider font-mono">Total Price:</span>
                            <span className="text-2xl font-black font-display tracking-tight" style={{ color: activeThemeColor }}>
                              {calculatedGrandTotal.toLocaleString()} DA
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-3 text-xs font-bold text-stone-600 pt-0.5">
                            <span>Item Price: <strong className="text-slate-900 font-mono">{calculatedSubtotal.toLocaleString()} DA</strong></span>
                            <span>Shipping ({shippingMethod === "home" ? "Home" : "Desk"}): <strong className="text-emerald-700 font-mono">+{calculatedShippingFee.toLocaleString()} DA</strong></span>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block font-mono">
                            Item Price
                          </span>
                          <span className="text-2xl font-black font-display tracking-tight" style={{ color: activeThemeColor }}>
                            {calculatedSubtotal.toLocaleString()} DA
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-stone-500 font-bold block mb-0.5">Availability</span>
                      {isOutOfStockState ? (
                        <div className="text-xs text-rose-600 font-extrabold flex items-center gap-1.5 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                          <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                          Out of Stock
                        </div>
                      ) : (
                        <div className="text-xs text-[#007600] font-bold flex items-center gap-1.5 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          <span className="w-2 h-2 rounded-full bg-[#007600] animate-ping" />
                          In stock, {selectedDeliveryCompany.name.split(" ")[0]} ready
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Shipping Details Summary & Check Shipping Button */}
                  {isShippingOpen ? (
                    <AnimatePresence>
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="space-y-3 bg-stone-50 rounded-2xl p-4 border border-stone-200 text-left"
                      >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                          <span className="text-xs font-extrabold text-slate-800 tracking-wider font-mono flex items-center gap-1.5">
                            <Truck className="w-4 h-4 text-slate-700" style={{ color: activeThemeColor }} />
                            Check / Calculate Shipping Prices
                          </span>
                          <button
                            type="button"
                            onClick={() => setIsShippingOpen(false)}
                            className="text-stone-400 hover:text-stone-700 p-1 rounded-full hover:bg-stone-200/60 transition-colors cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {/* Field 1: Country */}
                          <SearchableLocationSelect
                            label="1. Country"
                            required
                            value={selectedCountryName}
                            onChange={handleCountryChange}
                            options={countryOptions}
                            placeholder="Select country..."
                            searchPlaceholder="Search country..."
                            icon={Globe}
                          />

                          {/* Field 2: State */}
                          <SearchableLocationSelect
                            label="2. State"
                            required
                            value={selectedStateName}
                            onChange={handleStateChange}
                            options={stateOptions}
                            placeholder="Select state..."
                            searchPlaceholder="Search state..."
                            icon={MapPin}
                          />

                          {/* Field 3: City */}
                          <SearchableLocationSelect
                            label="3. City"
                            required
                            value={selectedCityName}
                            onChange={handleCityChange}
                            options={cityOptions}
                            placeholder="Select city..."
                            searchPlaceholder="Search city..."
                            icon={Building}
                          />
                        </div>

                        {/* Field 4: Delivery Type */}
                        {(selectedCountry === "Algeria" || selectedCountry.startsWith("Algeria")) && (
                          <div className="space-y-1 pt-1">
                            <label className="text-[10px] font-extrabold text-slate-700 block font-mono">
                              4. Delivery Type <span className="text-rose-500 font-bold">*</span>
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() => setShippingMethod("home")}
                                className="flex items-center justify-between p-2.5 rounded-xl border-2 cursor-pointer transition-all select-none outline-none"
                                style={
                                  shippingMethod === "home"
                                    ? {
                                        borderColor: activeThemeColor,
                                        backgroundColor: hexToRgba(activeThemeColor, 0.1),
                                        color: "#0f172a",
                                        fontWeight: "bold",
                                      }
                                    : {
                                        borderColor: "#e7e5e4",
                                        backgroundColor: "#ffffff",
                                        color: "#78716c",
                                      }
                                }
                              >
                                <div className="flex items-center gap-2">
                                  <Truck 
                                    className="w-4 h-4 shrink-0" 
                                    style={{ color: shippingMethod === "home" ? activeThemeColor : "#a8a29e" }}
                                  />
                                  <span className="text-xs font-bold">Home Delivery</span>
                                </div>
                                <span className="text-xs font-mono font-bold text-slate-800">
                                  +{selectedWilaya.homePrice} DA
                                </span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setShippingMethod("stopdesk")}
                                className="flex items-center justify-between p-2.5 rounded-xl border-2 cursor-pointer transition-all select-none outline-none"
                                style={
                                  shippingMethod === "stopdesk"
                                    ? {
                                        borderColor: activeThemeColor,
                                        backgroundColor: hexToRgba(activeThemeColor, 0.1),
                                        color: "#0f172a",
                                        fontWeight: "bold",
                                      }
                                    : {
                                        borderColor: "#e7e5e4",
                                        backgroundColor: "#ffffff",
                                        color: "#78716c",
                                      }
                                }
                              >
                                <div className="flex items-center gap-2">
                                  <Building 
                                    className="w-4 h-4 shrink-0" 
                                    style={{ color: shippingMethod === "stopdesk" ? activeThemeColor : "#a8a29e" }}
                                  />
                                  <span className="text-xs font-bold">Pickup Desk</span>
                                </div>
                                <span className="text-xs font-mono font-bold text-slate-800">
                                  +{selectedWilaya.stopdeskPrice} DA
                                </span>
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Confirm Button */}
                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              setIsShippingCalculated(true);
                              setIsShippingOpen(false);
                            }}
                            className="w-full text-white font-extrabold py-2.5 rounded-xl text-center text-xs shadow-md hover:shadow-lg active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                            style={{ backgroundColor: activeThemeColor }}
                          >
                            <CheckCircle2 className="w-4 h-4 text-white" />
                            <span>Confirm Shipping Prices</span>
                          </button>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  ) : isShippingCalculated ? (
                    <div className="bg-stone-50 rounded-xl p-3 border border-stone-200/80 text-xs space-y-1.5 text-slate-700">
                      <div className="flex items-center justify-between pb-1 border-b border-stone-200/60">
                        <span className="text-stone-500 font-bold text-[10px] uppercase tracking-wider font-mono flex items-center gap-1">
                          <Truck className="w-3.5 h-3.5 text-stone-600" />
                          Shipping Summary
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsShippingOpen(true)}
                          className="text-[11px] text-indigo-600 font-extrabold hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <span>Check / Edit Shipping Prices</span>
                        </button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-0.5">
                        <div>
                          <span className="text-stone-400 text-[10px] block">Destination:</span>
                          <span className="font-bold text-slate-800 text-[11px]">{selectedWilaya.id} - {selectedWilaya.name}</span>
                        </div>
                        {selectedCommune && (
                          <div>
                            <span className="text-stone-400 text-[10px] block">City:</span>
                            <span className="font-bold text-slate-800 text-[11px]">{selectedCommune}</span>
                          </div>
                        )}
                        <div>
                          <span className="text-stone-400 text-[10px] block">Estimated Time:</span>
                          <span className="font-bold text-slate-800 font-mono text-[11px]">{selectedWilaya.time || "24-48 Hours"}</span>
                        </div>
                        <div>
                          <span className="text-stone-400 text-[10px] block">Delivery Type & Fee:</span>
                          <span className="font-bold text-[#007600] font-mono text-[11px]">
                            {shippingMethod === "home" ? "Home" : "Desk"} (+{calculatedShippingFee.toLocaleString()} DA)
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsShippingOpen(true)}
                      className="w-full text-white font-extrabold py-2.5 px-4 rounded-xl text-center text-xs shadow-md hover:shadow-lg active:scale-98 cursor-pointer transition-all flex items-center justify-center gap-2 border border-transparent select-none outline-none group"
                      style={{ backgroundColor: activeThemeColor }}
                    >
                      <Truck className="w-4 h-4 text-white transition-transform group-hover:scale-110" />
                      <span>Check Shipping Prices</span>
                    </button>
                  )}

                  {/* Quantity Selector & Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                    {isShippingCalculated && !isOutOfStockState && (
                      <div className="flex items-center gap-2.5 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 shrink-0 w-full sm:w-auto justify-between sm:justify-start">
                        <span className="text-xs font-bold text-slate-700 font-mono">Quantity:</span>
                        <div className="flex items-center gap-1.5">
                          <button 
                            type="button" 
                            onClick={() => setPurchaseQty(p => Math.max(1, p - 1))}
                            className="w-7 h-7 rounded-lg bg-white hover:bg-stone-200 text-slate-800 font-black flex items-center justify-center cursor-pointer shadow-3xs transition-all text-xs"
                          >
                            -
                          </button>
                          <span className="font-mono text-xs font-bold text-slate-900 min-w-[18px] text-center">{purchaseQty}</span>
                          <button 
                            type="button" 
                            onClick={() => setPurchaseQty(p => Math.min(10, p + 1))}
                            className="w-7 h-7 rounded-lg bg-white hover:bg-stone-200 text-slate-800 font-black flex items-center justify-center cursor-pointer shadow-3xs transition-all text-xs"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="flex-1 flex flex-col sm:flex-row items-center gap-2.5 w-full">
                      {isOutOfStockState ? (
                        <motion.button
                          type="button"
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            if (hasNotified) return;
                            setHasNotified(true);
                            if (onNotifyMe) {
                              onNotifyMe(selectedProduct.name, selectedStore.name);
                            } else {
                              alert(`Notify Me registered for ${selectedProduct.name}`);
                            }
                            setTimeout(() => {
                              setHasNotified(false);
                            }, 4000);
                          }}
                          className="w-full text-white font-extrabold py-2.5 px-5 rounded-xl text-center text-xs shadow-md hover:shadow-lg active:scale-97 cursor-pointer transition-all border-2 select-none outline-none flex items-center justify-center gap-2 group"
                          style={{ 
                            backgroundColor: hasNotified ? "#10b981" : activeThemeColor, 
                            borderColor: hasNotified ? "#10b981" : activeThemeColor 
                          }}
                        >
                          <Sparkles className={`w-3.5 h-3.5 shrink-0 transition-transform group-hover:scale-110 ${hasNotified ? "animate-pulse" : ""}`} />
                          <span>{hasNotified ? "We'll Notify You! ✓" : "Notify Me"}</span>
                        </motion.button>
                      ) : (
                        <>
                          {isRegisteredUser && (
                            <button
                              type="button"
                              onClick={() => {
                                handleAddToCartWithGuestCheck();
                              }}
                              className="w-full sm:w-1/2 bg-transparent font-extrabold py-2.5 px-5 rounded-xl text-center text-xs shadow-3xs hover:shadow-xs active:scale-97 cursor-pointer transition-all border-2 select-none outline-none flex items-center justify-center gap-2 group"
                              style={{ 
                                borderColor: themeAccentColor, 
                                color: themeAccentColor 
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = hexToRgba(themeAccentColor, 0.08);
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "transparent";
                              }}
                            >
                              <ShoppingCart className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:scale-110" />
                              <span>Add to Cart</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              setIsBottomInlineCheckoutOpen(true);
                              setTimeout(() => {
                                document.getElementById("bottom-layout-paybox")?.scrollIntoView({ behavior: "smooth", block: "start" });
                              }, 100);
                            }}
                            className={`w-full ${isRegisteredUser ? "sm:w-1/2" : "w-full"} text-white font-extrabold py-2.5 px-5 rounded-xl text-center text-xs shadow-md hover:shadow-lg active:scale-97 cursor-pointer transition-all border-2 select-none outline-none flex items-center justify-center gap-2 group`}
                            style={{ 
                              backgroundColor: themeAccentColor, 
                              borderColor: themeAccentColor 
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.filter = "brightness(0.92)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.filter = "none";
                            }}
                          >
                            <CreditCard className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:scale-110 text-white" />
                            <span>Buy Now</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Secure Transaction Note */}
                  <div className="flex items-center gap-1.5 text-[11px] text-stone-500 pt-2 border-t border-stone-100">
                    <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Secure transaction process checked. Guaranteed delivery across {selectedCountryCode === "DZ" ? "58 Wilayas" : `all regions in ${selectedCountryName || "the country"}`}.</span>
                  </div>
                </motion.div>
              ) : (
                /* INLINE ORDER FORM (Replaces the paybox smoothly when clicking 'Buy Now (Express Checkout)') */
                <motion.div
                  key="bottom-order-form-card"
                  id="bottom-inline-order-form"
                  initial={{ opacity: 0, y: 20, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.97 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full text-left"
                >
                  {renderOrderFormCard(() => setIsBottomInlineCheckoutOpen(false), true)}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          )}

      {/* Express Checkout Modal for Buyer Information (Triggered by Top Buy Now button) */}
      <AnimatePresence>
        {isExpressCheckoutOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden"
            onClick={() => setIsExpressCheckoutOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-h-[90vh] flex flex-col my-auto items-center justify-center"
            >
              {renderOrderFormCard(() => setIsExpressCheckoutOpen(false))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Similar Products Section (Store Products Carousel style) */}
          {isSimilarProductsEnabled && similarProducts.length > 0 && (
            <div
              id="similar-products-section"
              className="mt-5 space-y-2.5 text-left font-sans w-full"
            >
              {/* Ornate Ornamental Divider matching the review section above */}
              <OrnateOrnamentDivider className="my-2.5" accentColor={activeThemeColor || "#4a0a26"} />

              <div className="flex items-center justify-between gap-4 px-1">
                <h3 className="text-sm sm:text-base font-extrabold text-black dark:text-black tracking-tight">
                  Similar items You may also like
                </h3>

                {onOpenStoreProfile && (
                  <button
                    type="button"
                    onClick={onOpenStoreProfile}
                    className="text-xs font-bold text-black dark:text-black hover:underline transition-all cursor-pointer shrink-0"
                  >
                    See all
                  </button>
                )}
              </div>

              {/* Exact Store Products Carousel Container (Expanded 20%) */}
              <div 
                className="flex items-center bg-transparent transition-all w-full animate-fadeIn relative px-0.5 py-1 overflow-visible h-[240px]"
                onClick={(e) => e.stopPropagation()}
                onMouseEnter={() => setIsSimilarMouseOver(true)}
                onMouseLeave={() => {
                  setIsSimilarMouseOver(false);
                  setSimilarHoveredIndex(null);
                }}
                onTouchStart={() => setIsSimilarMouseOver(true)}
              >
                {/* Left Scroll Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    scrollSimilar("left");
                  }}
                  className={`absolute -left-[14px] top-1/2 -translate-y-1/2 z-20 w-8.5 h-8.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none ${
                    canScrollSimilarLeft ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none scale-90"
                  }`}
                  style={{ color: activeThemeColor || "#1b4332" }}
                  aria-label="Scroll Left"
                >
                  <ChevronsLeft className="w-4.5 h-4.5 stroke-[2.5]" />
                </button>

                {/* Decorative vertical brand/header color banner on the left */}
                <div 
                  className="h-[210px] rounded-r-md rounded-l-sm shrink-0 transition-all duration-300 p-0 overflow-hidden"
                  style={{ 
                    backgroundColor: activeThemeColor || "#1b4332", 
                    opacity: canScrollSimilarLeft ? 0 : 1.0,
                    width: canScrollSimilarLeft ? "0px" : "6px",
                    marginRight: canScrollSimilarLeft ? "0px" : "6px",
                    marginLeft: canScrollSimilarLeft ? "0px" : "-10px"
                  }}
                />

                {/* Horizontal scroll container */}
                <div 
                  ref={similarCarouselRef}
                  id="similar-products-grid"
                  onMouseDown={handleSimilarMouseDown}
                  onMouseLeave={handleSimilarMouseLeave}
                  onMouseUp={handleSimilarMouseUp}
                  onMouseMove={handleSimilarMouseMove}
                  className="flex gap-3 overflow-x-auto w-full py-2 pr-1 scrollbar-none snap-x snap-mandatory cursor-grab active:cursor-grabbing select-none"
                  style={{ 
                    scrollbarWidth: "none", 
                    msOverflowStyle: "none",
                    WebkitOverflowScrolling: "touch"
                  }}
                >
                  {similarProducts.map((prod, index) => {
                    let scale = 1;
                    let opacity = 1;
                    let zIndex = 10;
                    let isFocused = false;

                    if (isSimilarMouseOver) {
                      const isHovered = similarHoveredIndex === index;
                      if (isHovered) {
                        scale = 1.03;
                        zIndex = 50;
                      }
                    }

                    const isHovered = similarHoveredIndex === index;

                    return (
                      <motion.div
                        key={prod.id ? `sim-${prod.id}-${index}` : `sim-idx-${index}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isSimilarDragging.current) return;
                          const modalRoot = document.getElementById("product-preview-modal-root");
                          if (modalRoot) {
                            modalRoot.scrollTop = 0;
                          }
                          window.scrollTo(0, 0);
                          if (onSelectProduct) onSelectProduct(prod);
                        }}
                        onMouseEnter={() => setSimilarHoveredIndex(index)}
                        onMouseLeave={() => setSimilarHoveredIndex(null)}
                        initial={{ opacity: 1, y: 0, scale: 1 }}
                        whileInView={{ opacity: 1, y: 0, scale: scale }}
                        viewport={{ once: true, margin: "-20px" }}
                        transition={{ 
                          duration: 0.2, 
                          ease: "easeOut" 
                        }}
                        className="flex-none snap-start h-[210px] ml-0 pl-0 pr-0 pt-0 rounded-xl overflow-hidden border border-slate-200 bg-white dark:bg-white transition-all duration-200 ease-out relative flex flex-col justify-between group cursor-pointer pb-2 select-none"
                        style={{
                          width: "calc((100% - 40px) / 5.2)",
                          minWidth: "140px",
                          maxWidth: "160px",
                          zIndex: zIndex,
                          boxShadow: isHovered || isFocused 
                            ? "0 12px 24px rgba(0,0,0,0.12)" 
                            : "0 2px 8px rgba(0,0,0,0.04)",
                          borderColor: isHovered || isFocused ? "#cbd5e1" : "#e2e8f0"
                        }}
                        title={prod.name}
                      >
                        {/* Top: Image Aspect Box */}
                        <div className="aspect-square w-full rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-100 relative shrink-0 select-none pointer-events-none">
                          <img
                            src={getOptimizedImageUrl(
                              prod.image || prod.images?.[0] || prod.imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
                              false
                            )}
                            alt=""
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300 pointer-events-none select-none"
                          />
                          {prod.oldPrice && prod.oldPrice > prod.price && (
                            <span className="absolute top-1 left-1 bg-slate-900 text-white text-[8.5px] font-bold px-1.5 py-0.3 rounded-full shadow-2xs">
                              -{Math.round(((prod.oldPrice - prod.price) / prod.oldPrice) * 100)}%
                            </span>
                          )}
                        </div>

                        {/* Bottom info section */}
                        <div className="px-2 flex flex-col gap-1 text-left flex-1 justify-between font-sans">
                          {/* Title & rating row */}
                          <div>
                            <div className="flex justify-between items-start gap-1">
                              <h5 className="text-[11.5px] font-extrabold text-black dark:text-black line-clamp-1 flex-1 leading-tight">
                                {prod.name}
                              </h5>
                              <div className="flex items-center gap-0.5 text-[10px] font-extrabold text-black dark:text-black shrink-0">
                                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                <span className="text-black dark:text-black font-extrabold">{(prod.rating || 4.8).toFixed(1)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Price & Cart row */}
                          <div className="text-[11.5px] text-black dark:text-black leading-none flex items-center justify-between mt-1 pt-1 border-t border-slate-100 dark:border-slate-200">
                            <div>
                              <span className="font-extrabold text-black dark:text-black text-[11.5px]">
                                {prod.price.toLocaleString()} DA
                              </span>
                            </div>

                            {/* Quick cart button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isSimilarDragging.current) return;
                                if (handleAddToCart && selectedStore) {
                                  handleAddToCartWithGuestCheck(prod);
                                }
                              }}
                              className="w-4.5 h-4.5 rounded-full bg-slate-900 dark:bg-slate-900 text-white dark:text-white flex items-center justify-center hover:bg-emerald-600 dark:hover:bg-emerald-600 transition-colors shadow-2xs cursor-pointer"
                              title="Add to Cart"
                            >
                              <ShoppingBag className="w-2 h-2" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Right Scroll Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    scrollSimilar("right");
                  }}
                  className={`absolute -right-[14px] top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none ${
                    canScrollSimilarRight ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none scale-90"
                  }`}
                  style={{ color: activeThemeColor || "#1b4332" }}
                  aria-label="Scroll Right"
                >
                  <ChevronsRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          )}

          {/* PRODUCT BUNDLE SHOWCASE (Visual Bundle items) */}
          {selectedProduct.isBundle && selectedProduct.bundleItems && selectedProduct.bundleItems.length > 0 && (
            <div className="mt-12 p-6 sm:p-8 rounded-3xl border border-dashed border-amber-300 bg-amber-50/15 dark:bg-amber-950/10 space-y-6 text-left animate-fadeIn">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <Sparkles className="w-4 h-4 fill-amber-500/10" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight font-serif">
                    Boutique Custom Bundle Pack
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">
                    Hand-picked collections curated for perfect harmony and exceptional value.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(selectedProduct.bundleItems || []).map((item: any, idx: number) => (
                  <div key={item.id ? `bundle-${item.id}-${idx}` : `bundle-idx-${idx}`} className="flex items-center gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-3xs hover:border-amber-300/40 transition-all duration-300 animate-fadeIn">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/5 flex items-center justify-center text-amber-600 dark:text-amber-400 font-extrabold text-xs font-mono shrink-0">
                      x{item.quantity}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-slate-800 dark:text-slate-100 truncate">{item.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono font-bold">Included in set</p>
                    </div>
                    {item.price && (
                      <span className="text-xs font-bold text-slate-500 font-mono line-through pr-1">
                        {item.price} DA
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-150 dark:border-slate-800 flex-wrap gap-4">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-black uppercase text-amber-700 tracking-wider font-mono">Special Bundle Price</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-black font-display text-amber-600 dark:text-amber-400">
                      {(selectedProduct.bundlePrice || selectedProduct.price).toLocaleString()} DA
                    </span>
                    {selectedProduct.price > (selectedProduct.bundlePrice || selectedProduct.price) && (
                      <span className="text-xs font-bold text-slate-400 line-through font-mono">
                        {selectedProduct.price.toLocaleString()} DA
                      </span>
                    )}
                  </div>
                </div>
                <div className="bg-amber-100/40 dark:bg-amber-900/20 text-amber-800 dark:text-amber-400 px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider font-mono border border-amber-200/25">
                  Save with this Pack ✨
                </div>
              </div>
            </div>
          )}

          {/* Product Story section is rendered above Customer Reviews */}

          {/* A+ BRAND STORY & PRODUCT EXPERIENCE SHOWCASE (Hidden per user request) */}
          {selectedProduct.advancedLandingPageEnabled && selectedProduct.uploadedLandingPageContent && selectedProduct.uploadedLandingPageContent.trim() !== "" && (
            <div 
              id="why-product-is-amazing" 
              className="hidden mt-16 pt-12 border-t-2 border-slate-100 space-y-12 text-left"
            >
            {selectedProduct.uploadedLandingPageContent ? (
              <div 
                className="custom-uploaded-landing-content w-full overflow-hidden text-slate-700 leading-relaxed font-sans"
                style={{ contain: "content" }}
                dangerouslySetInnerHTML={{ __html: selectedProduct.uploadedLandingPageContent }}
              />
            ) : (
              <>
                {/* Header / Intro block */}
                <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="text-[10px] font-black tracking-widest text-[#E11D48] bg-rose-50 border border-rose-100 px-3 py-1 rounded-full uppercase">
                🏷️ Product Experience & Spotlight
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-slate-900 tracking-tight leading-tight">
                Designed for Excellence, Built to Stand Apart
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed font-sans max-w-2xl mx-auto">
                Explore a closer look at what makes <strong className="text-slate-800">{selectedProduct.name}</strong> unique. From high-grade raw components to artisan quality-assurance checks, every detail represents maximum value and durability.
              </p>
            </div>

            {/* Premium Dynamic Feature Navigation Tabs */}
            <div className="flex justify-center border-b border-slate-100 pb-px">
              <div className="flex gap-2 sm:gap-4 scrollbar-none overflow-x-auto">
                {[
                  { id: "features", label: "Core Highlights", icon: "✨" },
                  { id: "whyus", label: "Comparison & Value", icon: "📊" },
                  { id: "craftsmanship", label: "Heritage / Standards", icon: "💎" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveLandingSectionTab(tab.id as any)}
                    className={`pb-3.5 px-4 font-black text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-all relative whitespace-nowrap cursor-pointer focus:outline-none ${
                      activeLandingSectionTab === tab.id
                        ? "text-[#E11D48]"
                        : "text-slate-400 hover:text-slate-700"
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                    {activeLandingSectionTab === tab.id && (
                      <div className="absolute left-0 right-0 bottom-0 h-0.75 bg-[#E11D48] rounded-t-full animate-pulse" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* TAB CONTENT: 1. Core Highlights */}
            {activeLandingSectionTab === "features" && (
              <div className="space-y-8">
                {/* 3x1 Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {selectedProduct.category === "Electronics" ? (
                    <>
                      {/* Feature 1 */}
                      <div className="bg-[#FAF9F5] hover:bg-[#F5F3EC] p-6 rounded-2xl border border-stone-200/50 transition-all shadow-3xs flex flex-col justify-between">
                        <div className="space-y-4">
                          <div className="w-10 h-10 bg-amber-500/10 text-amber-600 rounded-xl flex items-center justify-center text-lg shadow-sm font-sans">
                            ⚡
                          </div>
                          <h4 className="font-extrabold text-[#3E382F] text-[12.5px] uppercase tracking-wide font-sans">
                            High-Efficiency Performance Core
                          </h4>
                          <p className="text-[11.5px] text-[#6E6454] leading-relaxed">
                            Powered by a multi-core processor tuned for maximum battery conservation. Runs tasks silently and refreshes seamlessly under high continuous load.
                          </p>
                        </div>
                        <span className="text-[10px] font-bold text-amber-600 mt-4 block uppercase tracking-wider">⚡ 2x Speed Enhancement</span>
                      </div>

                      {/* Feature 2 */}
                      <div className="bg-[#FAF9F5] hover:bg-[#F5F3EC] p-6 rounded-2xl border border-stone-200/50 transition-all shadow-3xs flex flex-col justify-between">
                        <div className="space-y-4">
                          <div className="w-10 h-10 bg-indigo-500/10 text-indigo-600 rounded-xl flex items-center justify-center text-lg shadow-sm font-sans">
                            📱
                          </div>
                          <h4 className="font-extrabold text-[#3E382F] text-[12.5px] uppercase tracking-wide font-sans">
                            Amoled High-Contrast Display
                          </h4>
                          <p className="text-[11.5px] text-[#6E6454] leading-relaxed">
                            Always-on display that remains perfectly legible even under direct Mediterranean sunlight. Low power consumption allows you to glance at notifications effortlessly.
                          </p>
                        </div>
                        <span className="text-[10px] font-bold text-indigo-600 mt-4 block uppercase tracking-wider">👁️ Eye-Care Protection</span>
                      </div>

                      {/* Feature 3 */}
                      <div className="bg-[#FAF9F5] hover:bg-[#F5F3EC] p-6 rounded-2xl border border-stone-200/50 transition-all shadow-3xs flex flex-col justify-between">
                        <div className="space-y-4">
                          <div className="w-10 h-10 bg-emerald-500/10 text-emerald-600 rounded-xl flex items-center justify-center text-lg shadow-sm font-sans">
                            🔋
                          </div>
                          <h4 className="font-extrabold text-[#3E382F] text-[12.5px] uppercase tracking-wide font-sans">
                            Intelligent Power Regulation
                          </h4>
                          <p className="text-[11.5px] text-[#6E6454] leading-relaxed">
                            Equipped with a high-capacity 5000 mAh quick battery and 33W Fast-Charge logic. Recovers 50% battery in just 20 minutes under optimized conditions.
                          </p>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600 mt-4 block uppercase tracking-wider">🔋 5 Days Standby Limit</span>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* For Non-Electronics (Rug, Crafts, Dress etc.) */}
                      <div className="bg-[#FAF9F5] hover:bg-[#F5F3EC] p-6 rounded-2xl border border-stone-200/50 transition-all shadow-3xs flex flex-col justify-between">
                        <div className="space-y-4">
                          <div className="w-10 h-10 bg-amber-500/10 text-amber-600 rounded-xl flex items-center justify-center text-lg shadow-sm font-sans">
                            🐑
                          </div>
                          <h4 className="font-extrabold text-[#3E382F] text-[12.5px] uppercase tracking-wide font-sans">
                            100% Organic Raw Materials
                          </h4>
                          <p className="text-[11.5px] text-[#6E6454] leading-relaxed">
                            Meticulously hand-spun mountain wool, natural flax linen, or premium metals sourced locally. Free from synthetic chemicals, preserving natural skin breathing.
                          </p>
                        </div>
                        <span className="text-[10px] font-bold text-amber-600 mt-4 block uppercase tracking-wider">🌿 Chemical-Free Dyeing</span>
                      </div>

                      {/* Feature 2 */}
                      <div className="bg-[#FAF9F5] hover:bg-[#F5F3EC] p-6 rounded-2xl border border-stone-200/50 transition-all shadow-3xs flex flex-col justify-between">
                        <div className="space-y-4">
                          <div className="w-10 h-10 bg-rose-500/10 text-rose-600 rounded-xl flex items-center justify-center text-lg shadow-sm font-sans">
                            ⏳
                          </div>
                          <h4 className="font-extrabold text-[#3E382F] text-[12.5px] uppercase tracking-wide font-sans">
                            Generational Craftsmanship
                          </h4>
                          <p className="text-[11.5px] text-[#6E6454] leading-relaxed">
                            Crafted by seasoned master craftsmen with years of passed-down family techniques. Each pattern tells a story of custom wool combing and ancestral knotting.
                          </p>
                        </div>
                        <span className="text-[10px] font-bold text-rose-600 mt-4 block uppercase tracking-wider">👐 100% Artisan Handcrafted</span>
                      </div>

                      {/* Feature 3 */}
                      <div className="bg-[#FAF9F5] hover:bg-[#F5F3EC] p-6 rounded-2xl border border-stone-200/50 transition-all shadow-3xs flex flex-col justify-between">
                        <div className="space-y-4">
                          <div className="w-10 h-10 bg-emerald-500/10 text-emerald-600 rounded-xl flex items-center justify-center text-lg shadow-sm font-sans">
                            📦
                          </div>
                          <h4 className="font-extrabold text-[#3E382F] text-[12.5px] uppercase tracking-wide font-sans">
                            Physical Authenticity Guard
                          </h4>
                          <p className="text-[11.5px] text-[#6E6454] leading-relaxed">
                            Shipped directly from regional workshops of Ath Yenni / Ghardaia. Protected by solid double-layer shockproof box packing to guarantee pristine delivery across 58 Wilayas.
                          </p>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600 mt-4 block uppercase tracking-wider">🛡️ 100% Genuine Protection</span>
                      </div>
                    </>
                  )}
                </div>

                {/* A+ Banner Block */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-gradient-to-r from-slate-900 to-slate-800 text-white min-h-[180px] p-8 flex flex-col justify-center text-left">
                  <div className="absolute right-0 bottom-0 opacity-15 max-w-[320px] pointer-events-none">
                    <svg viewBox="0 0 100 100" className="w-64 h-64 fill-current text-white">
                      <circle cx="50" cy="50" r="40" />
                    </svg>
                  </div>
                  <div className="max-w-2xl space-y-3 relative z-10">
                    <span className="text-[9px] font-black tracking-widest text-[#FFF] bg-emerald-600 px-2.5 py-1 rounded">
                      🛠️ PREMIUM BRAND STANDARDS
                    </span>
                    <h3 className="text-base sm:text-lg font-serif font-black tracking-tight text-white capitalize leading-tight">
                      Why {selectedProduct.name} is built to stand apart
                    </h3>
                    <p className="text-[11.5px] text-slate-350 leading-relaxed font-sans font-medium">
                      Commercial assembly lines prioritize rapid chemical replication. We prioritize longevity. Every single {selectedProduct.name} undergoes double-stage physical inspections, verification ticks, and strict material tracing before it enters Yalidine couriers. Discover luxury that feels organic.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: 2. Side-by-side comparison table */}
            {activeLandingSectionTab === "whyus" && (
              <div className="space-y-6">
                <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 text-left">
                  <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider mb-2">
                    How We Compare to Traditional Alternatives
                  </h4>
                  <p className="text-[11px] text-slate-500 mb-4">
                    Before investing in copycat replicas, check how our quality holds against commercial alternatives.
                  </p>

                  <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white shadow-3xs">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-stone-100/80 border-b border-stone-200">
                          <th className="p-3.5 font-extrabold text-slate-700 w-2/5">Feature Category</th>
                          <th className="p-3.5 font-black text-[#E11D48] bg-rose-500/5 border-x border-stone-200 text-center w-1/3">Our Premium Standard</th>
                          <th className="p-3.5 font-bold text-slate-500 text-center">Cheap Mass Mimics ❌</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b last:border-0 border-stone-150">
                          <td className="p-3.5 font-bold text-slate-700">Raw Material Certification</td>
                          <td className="p-3.5 text-center text-emerald-600 bg-rose-500/5 border-x border-stone-200 font-extrabold">✓ 100% Hand-inspected / pure materials</td>
                          <td className="p-3.5 text-center text-[#E11D48] font-medium">✗ Synthetic fibers or raw alloys</td>
                        </tr>
                        <tr className="border-b last:border-0 border-stone-150">
                          <td className="p-3.5 font-bold text-slate-700">Fair Trade & Compensation</td>
                          <td className="p-3.5 text-center text-emerald-600 bg-rose-500/5 border-x border-stone-200 font-extrabold">✓ Direct pay to regional Algerian workshops</td>
                          <td className="p-3.5 text-center text-[#E11D48] font-medium">✗ Exploitative sweatshop channels</td>
                        </tr>
                        <tr className="border-b last:border-0 border-stone-150">
                          <td className="p-3.5 font-bold text-slate-700">Local Delivery Security</td>
                          <td className="p-3.5 text-center text-emerald-600 bg-rose-500/5 border-x border-stone-200 font-extrabold">✓ Yalidine secure home delivery with CoD option</td>
                          <td className="p-3.5 text-center text-[#E11D48] font-medium">✗ Lost boxes or generic logistics delay</td>
                        </tr>
                        <tr className="border-b last:border-0 border-stone-150">
                          <td className="p-3.5 font-bold text-slate-700 font-sans">Sturdiness & Lifespan</td>
                          <td className="p-3.5 text-center text-emerald-600 bg-rose-500/5 border-x border-stone-200 font-extrabold">✓ Built for generations / continuous load</td>
                          <td className="p-3.5 text-center text-[#E11D48] font-medium">✗ Wears down after 3-6 months</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: 3. Heritage / Standards */}
            {activeLandingSectionTab === "craftsmanship" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  
                  {/* Left block of description */}
                  <div className="space-y-4 text-left">
                    <div className="flex items-center gap-2">
                      <span className="p-1 px-1.5 bg-rose-50 text-[#E11D48] text-xs font-black rounded uppercase">
                        Our Pledge
                      </span>
                      <span className="text-xs font-bold text-slate-400">Algerian Regional Guild Verified</span>
                    </div>

                    <h3 className="text-lg font-serif font-black text-slate-900 leading-snug">
                      Preserving ancestral techniques, delivering maximum modern reliability
                    </h3>

                    <p className="text-[11.5px] text-slate-500 leading-relaxed font-sans">
                      Our artisans or quality-testing teams ensure each {selectedProduct.name} carries the soul of true commitment. Cheap alternatives use computer loops to churn thousands of raw duplicates daily, flooding the market. By choosing {selectedStore.name}, you directly sponsor Algerian craftsmanship while receiving a premium product engineered to last decades.
                    </p>

                    <ul className="space-y-3 pt-2 text-[11.5px] font-bold text-slate-700">
                      <li className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 text-xs flex items-center justify-center font-black">✓</span>
                        Double-waxed or reinforced edges & surfaces
                      </li>
                      <li className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 text-xs flex items-center justify-center font-black">✓</span>
                        Individually cataloged and traced with unique serial identifiers
                      </li>
                      <li className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 text-xs flex items-center justify-center font-black">✓</span>
                        Clean, recyclable packaging that minimizes local trace footprints
                      </li>
                    </ul>
                  </div>

                  {/* Right block: illustrative card */}
                  <div className="bg-stone-50 border border-stone-200/80 p-6 rounded-2xl space-y-4 text-left">
                    <span className="text-[10px] font-black text-slate-400 uppercase block font-mono">
                      Verification of Status Checked
                    </span>

                    <div className="p-4 bg-white border border-stone-200/50 rounded-xl space-y-3.5 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-700">Origin Verification:</span>
                        <span className="text-emerald-600 font-extrabold flex items-center gap-1">
                          🟢 100% Certified Origin
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-700">Material Trace Limit:</span>
                        <span className="text-[#3E382F] font-black uppercase tracking-wide bg-stone-100 px-2 py-0.5 rounded text-[10px]">
                          Premium Grade
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-700">CoD Shipping Option:</span>
                        <span className="text-slate-700 font-extrabold">
                          Yalidine Delivery Secure
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-rose-50/50 border border-rose-100 rounded-xl flex items-center gap-3 text-[10.5px] text-rose-905 leading-normal">
                      <span className="text-xl shrink-0">🤝</span>
                      <p>
                        Your funds are secured in local escrow until your product arrives at your door and you verify its stellar quality physically. Zero payment risk.
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            )}
              </>
            )}

          </div>
          )}

          {/* Recently Viewed Section hidden as requested */}

        </div>
      </main>

      {/* Product Video Pop-up Modal */}
      {isVideoOpen && (() => {
        const activeUrl = activeVideoUrl || productVideoList[0] || selectedProduct.videoUrl || "";
        const currentVideoInfo = getVideoEmbedResult(activeUrl);

        return (
          <div 
            className="fixed inset-0 z-[100] bg-white/85 backdrop-blur-3xl flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8 animate-fade-in"
          >
            {/* Wrapper element to anchor the close button relative to the video container, but outside of its overflow-hidden boundary */}
            <div 
              className="relative w-full max-w-4xl animate-scale-up"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Elegant Close Button Placed Directly Above the Top-Right Corner of the Video Card */}
              <button
                type="button"
                id="modal-close-button"
                onClick={() => setIsVideoOpen(false)}
                className="absolute -top-12 md:-top-14 -right-1 sm:-right-2 md:-right-10 z-[110] p-2.5 rounded-full bg-white hover:bg-neutral-100 text-stone-800 hover:text-stone-950 border border-stone-200/60 shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
                style={{ marginRight: '-20px' }}
                title="Close Video"
              >
                <X className="w-4 h-4 md:w-5 md:h-5 text-stone-800" />
              </button>

              {/* Ultra minimal video container card */}
              <div 
                className="bg-black rounded-2xl md:rounded-3xl shadow-[0_30px_70px_rgba(0,0,0,0.12)] overflow-hidden w-full aspect-video relative border border-stone-200/40"
              >
                {currentVideoInfo.type === "direct" ? (
                  <video
                    ref={videoRef}
                    src={currentVideoInfo.embedUrl}
                    autoPlay={isAutoPlay}
                    playsInline
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                ) : (
                  <div className="absolute inset-0 overflow-hidden">
                    <iframe
                      id="youtube-player-iframe"
                      src={`${currentVideoInfo.embedUrl}`}
                      title="Product Video Showcase"
                      className="absolute top-1/2 left-1/2 w-[116%] h-[116%] -translate-x-1/2 -translate-y-1/2 border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                )}

                {/* Elegant Custom White/Blurry Play Button Overlay that covers YouTube's central red logo */}
                {!isPlaying && (
                  <div 
                    onClick={() => {
                      if (currentVideoInfo.type === "youtube" && playerRef.current) {
                        try {
                          playerRef.current.playVideo();
                          setIsPlaying(true);
                        } catch (err) {}
                      } else if (currentVideoInfo.type === "direct" && videoRef.current) {
                        try {
                          videoRef.current.play();
                          setIsPlaying(true);
                        } catch (err) {}
                      }
                    }}
                    className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[4px] cursor-pointer group/centerplay transition-all duration-500"
                  >
                    <div className="w-18 h-18 md:w-22 md:h-22 rounded-full bg-white text-stone-950 border border-white/40 flex items-center justify-center shadow-[0_15px_40px_rgba(255,255,255,0.2)] transition-all duration-300 transform group-hover/centerplay:scale-110 group-hover/centerplay:bg-neutral-100 group-hover/centerplay:shadow-[0_20px_50px_rgba(255,255,255,0.35)] relative overflow-hidden">
                      {/* Sheen reflection shimmer on hover */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-transparent -translate-x-full group-hover/centerplay:translate-x-full transition-transform duration-1000 ease-out" />
                      <Play className="w-7 h-7 md:w-9 md:h-9 text-stone-950 fill-stone-950 translate-x-0.5" />
                    </div>
                  </div>
                )}

                {/* Pinned Elegantly Slim Glassmorphic Progress Control Bar */}
                <div 
                  className="absolute bottom-0 left-0 right-0 h-11 bg-black/75 backdrop-blur-md border-t border-stone-700/30 flex items-center px-4 gap-3 z-[105] select-none text-white overflow-hidden transition-opacity"
                >
                  {/* Play / Pause Toggle Button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (currentVideoInfo.type === "youtube" && playerRef.current) {
                        try {
                          const state = playerRef.current.getPlayerState();
                          if (state === 1) { // playing
                            playerRef.current.pauseVideo();
                            setIsPlaying(false);
                          } else {
                            playerRef.current.playVideo();
                            setIsPlaying(true);
                          }
                        } catch (e) {}
                      } else if (currentVideoInfo.type === "direct" && videoRef.current) {
                        if (videoRef.current.paused) {
                          videoRef.current.play();
                          setIsPlaying(true);
                        } else {
                          videoRef.current.pause();
                          setIsPlaying(false);
                        }
                      }
                    }}
                    className="p-1 px-1.5 text-stone-300 hover:text-white transition-all transform hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center shrink-0"
                    title={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current" />
                    )}
                  </button>

                  {/* Timeline time text label */}
                  <span className="text-[10px] font-mono text-stone-400 select-none shrink-0 tracking-wider">
                    {(() => {
                      const formatTime = (secs: number) => {
                        if (isNaN(secs) || secs < 0) return "0:00";
                        const m = Math.floor(secs / 60);
                        const s = Math.floor(secs % 60);
                        return `${m}:${s < 10 ? "0" : ""}${s}`;
                      };
                      return `${formatTime(currentTime)} / ${formatTime(duration)}`;
                    })()}
                  </span>

                  {/* Slim timelines progress bar interactive range slider */}
                  <div className="flex-1 relative flex items-center h-full group/bar">
                    <input
                      type="range"
                      min={0}
                      max={duration || 100}
                      step={0.1}
                      value={currentTime}
                      onMouseDown={() => setIsSeeking(true)}
                      onTouchStart={() => setIsSeeking(true)}
                      onMouseUp={(e: any) => {
                        setIsSeeking(false);
                        const targetVal = parseFloat(e.target.value);
                        if (currentVideoInfo.type === "youtube" && playerRef.current) {
                          try {
                            playerRef.current.seekTo(targetVal, true);
                          } catch (err) {}
                        } else if (currentVideoInfo.type === "direct" && videoRef.current) {
                          videoRef.current.currentTime = targetVal;
                        }
                      }}
                      onTouchEnd={(e: any) => {
                        setIsSeeking(false);
                        const targetVal = parseFloat(e.target.value);
                        if (currentVideoInfo.type === "youtube" && playerRef.current) {
                          try {
                            playerRef.current.seekTo(targetVal, true);
                          } catch (err) {}
                        } else if (currentVideoInfo.type === "direct" && videoRef.current) {
                          videoRef.current.currentTime = targetVal;
                        }
                      }}
                      onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
                      className="w-full h-1 bg-stone-700/60 rounded-full appearance-none cursor-pointer outline-none transition-all accent-[#e47911] group-hover/bar:h-1.5"
                      style={{
                        background: `linear-gradient(to right, #e47911 0%, #e47911 ${duration > 0 ? (currentTime / duration) * 100 : 0}%, rgba(82, 82, 91, 0.6) ${duration > 0 ? (currentTime / duration) * 100 : 0}%, rgba(82, 82, 91, 0.6) 100%)`
                      }}
                    />
                  </div>

                  {/* Volume Slider UI component */}
                  <div className="flex items-center gap-1.5 ml-2 border-l border-zinc-800/80 pl-3.5 shrink-0 group/volume">
                    <button
                      type="button"
                      onClick={() => {
                        if (volume > 0) {
                          setPrevVolume(volume);
                          handleVolumeChange(0);
                        } else {
                          handleVolumeChange(prevVolume > 0 ? prevVolume : 80);
                        }
                      }}
                      className="p-1 text-stone-400 hover:text-white transition-all transform hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center shrink-0"
                      title={volume === 0 ? "Unmute" : "Mute"}
                    >
                      {volume === 0 ? (
                        <VolumeX className="w-4 h-4 text-stone-500" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-stone-300 group-hover/volume:text-white" />
                      )}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={volume}
                      onChange={(e) => handleVolumeChange(parseInt(e.target.value, 10))}
                      className="w-14 sm:w-16 md:w-20 h-1 bg-stone-700/60 rounded-full appearance-none cursor-pointer outline-none transition-all accent-[#e47911] group-hover/volume:h-1.5"
                      style={{
                        background: `linear-gradient(to right, #e47911 0%, #e47911 ${volume}%, rgba(82, 82, 91, 0.6) ${volume}%, rgba(82, 82, 91, 0.6) 100%)`
                      }}
                    />
                  </div>

                  {/* Autoplay setting switcher */}
                  <div className="flex items-center gap-1.5 ml-2 border-l border-zinc-800/80 pl-3.5 shrink-0">
                    <span className="text-[10px] text-stone-400 font-bold tracking-tight font-sans">AUTOPLAY</span>
                    <button
                      type="button"
                      onClick={() => handleToggleAutoPlay(!isAutoPlay)}
                      className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out outline-none ${
                        isAutoPlay ? "bg-[#e47911]" : "bg-stone-700"
                      }`}
                      title={isAutoPlay ? "Disable auto-play for next visits" : "Enable auto-play for next visits"}
                    >
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out mt-[1px] ${
                          isAutoPlay ? "translate-x-3" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Thank You Page / Order Confirmation Modal */}
      <AnimatePresence>
        {isThankYouOpen && placedOrderInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[9999] flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
            onClick={() => handleThankYouAction('close')}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 12 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-stone-200/80 w-full max-w-[820px] overflow-hidden text-left relative flex flex-col my-auto max-h-[95vh]"
            >
              {/* Top Accent Bar */}
              <div className="h-2 w-full" style={{ backgroundColor: activeThemeColor }} />

              <div className="p-5 sm:p-7 sm:px-9 overflow-y-auto space-y-5">
                {/* Page Header */}
                <div className="text-center space-y-2">
                  <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center mx-auto shadow-2xs">
                    <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.2]" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Order Successfully Placed
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500 max-w-xl mx-auto leading-relaxed">
                    We've successfully received your order and securely forwarded it to the merchant. You'll be contacted shortly to confirm your order.
                  </p>
                </div>

                {/* ONE Primary Confirmation Card */}
                <div className="bg-stone-50/50 border border-stone-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-5 text-xs sm:text-sm">
                  {/* SECTION 1: Order Reference */}
                  <div className="flex items-center justify-between pb-4 border-b border-stone-200/80">
                    <div>
                      <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
                        Order Reference
                      </span>
                      <span className="font-mono font-bold text-slate-900 text-base sm:text-lg">
                        Order #{placedOrderInfo.orderId || placedOrderInfo.id || "ORD-000000"}
                      </span>
                    </div>

                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          const oid = placedOrderInfo.orderId || placedOrderInfo.id;
                          if (oid) {
                            navigator.clipboard.writeText(`Order #${oid}`);
                            setIsCopiedOrderId(true);
                            setTimeout(() => setIsCopiedOrderId(false), 2200);
                          }
                        }}
                        className="flex items-center gap-1.5 bg-white hover:bg-stone-100 text-slate-700 font-semibold px-3.5 py-2 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer border border-stone-200 shadow-3xs active:scale-95"
                      >
                        {isCopiedOrderId ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                            <span className="text-emerald-700 font-bold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 text-stone-500" />
                            <span>Copy ID</span>
                          </>
                        )}
                      </button>

                      <AnimatePresence>
                        {isCopiedOrderId && (
                          <motion.span
                            initial={{ opacity: 0, y: 4, scale: 0.9 }}
                            animate={{ opacity: 1, y: -28, scale: 1 }}
                            exit={{ opacity: 0, y: -16, scale: 0.9 }}
                            className="absolute -top-1 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-lg shadow-md whitespace-nowrap pointer-events-none z-10"
                          >
                            Order ID copied.
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* SECTION 2: Product Summary */}
                  <div className="pb-4 border-b border-stone-200/80 space-y-2.5">
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
                      Product Summary
                    </span>
                    <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-stone-200/70">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-stone-100 overflow-hidden shrink-0 border border-stone-200/80">
                        <img
                          src={(placedOrderInfo.product as any)?.image || placedOrderInfo.product?.images?.[0] || selectedProduct?.images?.[0]}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-slate-900 truncate text-sm sm:text-base">
                          {placedOrderInfo.product?.name || selectedProduct?.name}
                        </h4>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-stone-500 mt-0.5">
                          <span>Color: <strong className="text-slate-800 font-semibold">{placedOrderInfo.color || "Standard"}</strong></span>
                          <span>Size: <strong className="text-slate-800 font-semibold">{placedOrderInfo.size || "One Size"}</strong></span>
                          <span>Qty: <strong className="text-slate-900 font-bold">{placedOrderInfo.qty || 1}</strong></span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3: Payment Summary */}
                  <div className="pb-4 border-b border-stone-200/80 space-y-2.5">
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
                      Payment Summary
                    </span>
                    <div className="space-y-2 text-xs sm:text-sm text-stone-600 bg-white p-3.5 sm:p-4 rounded-xl border border-stone-200/70">
                      <div className="flex justify-between">
                        <span>Item Price:</span>
                        <span className="font-mono font-bold text-slate-900">{(placedOrderInfo.subtotal || 0).toLocaleString()} DA</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span className="font-mono font-bold text-slate-900">+{(placedOrderInfo.shippingFee || 0).toLocaleString()} DA</span>
                      </div>
                      <div className="flex justify-between text-stone-400 text-xs">
                        <span>Taxes</span>
                        <span>Included</span>
                      </div>
                      {placedOrderInfo.discountAmount > 0 && (
                        <div className="flex justify-between text-emerald-600 font-medium">
                          <span>Discount</span>
                          <span className="font-mono">-{(placedOrderInfo.discountAmount || 0).toLocaleString()} DA</span>
                        </div>
                      )}

                      <div className="pt-2.5 border-t border-stone-200/80 flex items-baseline justify-between">
                        <span className="font-extrabold text-slate-900 text-sm sm:text-base tracking-wide uppercase">TOTAL</span>
                        <span 
                          className="text-3xl sm:text-4xl font-black font-sans tracking-tight text-slate-900"
                          style={{ color: activeThemeColor || "#0f172a" }}
                        >
                          {(placedOrderInfo.grandTotal || placedOrderInfo.totalPrice || 0).toLocaleString()} DA
                        </span>
                      </div>

                      <div className="pt-2">
                        <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-bold text-xs px-3 py-1.5 rounded-full">
                          <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                          <span>Payment on Delivery (Cash)</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 4: Delivery Information */}
                  <div className="space-y-2.5">
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
                      Delivery Information
                    </span>
                    <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-stone-200/70 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-xs sm:text-sm">
                      <div className="flex justify-between sm:justify-start sm:gap-2">
                        <span className="text-stone-500">Customer Name:</span>
                        <span className="font-bold text-slate-900">{placedOrderInfo.buyer?.name || buyerFullName || "Valued Customer"}</span>
                      </div>
                      <div className="flex justify-between sm:justify-start sm:gap-2">
                        <span className="text-stone-500">Phone Number:</span>
                        <span className="font-mono font-bold text-slate-900">{formatPhoneForDisplay(placedOrderInfo.buyer?.phone || buyerPhone) || "N/A"}</span>
                      </div>
                      <div className="flex justify-between sm:justify-start sm:gap-2">
                        <span className="text-stone-500">Country:</span>
                        <span className="font-semibold text-slate-800">{placedOrderInfo.country || "Algeria"}</span>
                      </div>
                      <div className="flex justify-between sm:justify-start sm:gap-2">
                        <span className="text-stone-500">State:</span>
                        <span className="font-semibold text-slate-800">{typeof placedOrderInfo.wilaya === 'object' ? (placedOrderInfo.wilaya?.name || "") : (placedOrderInfo.wilaya || placedOrderInfo.state || "N/A")}</span>
                      </div>
                      <div className="flex justify-between sm:justify-start sm:gap-2">
                        <span className="text-stone-500">City:</span>
                        <span className="font-semibold text-slate-800">{placedOrderInfo.commune || placedOrderInfo.city || "N/A"}</span>
                      </div>
                      <div className="flex justify-between sm:justify-start sm:gap-2">
                        <span className="text-stone-500">Delivery Address:</span>
                        <span className="font-semibold text-slate-800 truncate max-w-[200px]">{placedOrderInfo.address || `${placedOrderInfo.commune || ""}, ${typeof placedOrderInfo.wilaya === 'object' ? (placedOrderInfo.wilaya?.name || "") : (placedOrderInfo.wilaya || "")}`}</span>
                      </div>
                      <div className="flex justify-between sm:justify-start sm:gap-2">
                        <span className="text-stone-500">Delivery Method:</span>
                        <span className="font-bold text-slate-900">{placedOrderInfo.deliveryType === "home" ? "Home Delivery" : "Pickup Desk"}</span>
                      </div>
                      <div className="flex justify-between sm:justify-start sm:gap-2">
                        <span className="text-stone-500">Courier Company:</span>
                        <span className="font-bold text-indigo-700">{typeof placedOrderInfo.deliveryCompany === 'object' ? (placedOrderInfo.deliveryCompany?.name || "Yalidine Express") : (placedOrderInfo.deliveryCompany || selectedDeliveryCompany?.name || "Yalidine Express")}</span>
                      </div>
                      <div className="flex justify-between sm:justify-start sm:gap-2 sm:col-span-2 pt-1.5 border-t border-stone-100">
                        <span className="text-stone-500">Estimated Delivery:</span>
                        <span className="font-semibold text-slate-800">1 &ndash; 3 Business Days</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PRIMARY ACTIONS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  {/* Primary button: Track Delivery */}
                  <button
                    type="button"
                    onClick={() => handleThankYouAction('track')}
                    className="h-12 sm:h-13 w-full bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-extrabold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                  >
                    <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0" />
                    <span>Track Delivery</span>
                  </button>

                  {/* Secondary button: Contact Merchant on WhatsApp */}
                  <button
                    type="button"
                    onClick={() => {
                      const oid = placedOrderInfo?.orderId || placedOrderInfo?.id || "";
                      const pname = placedOrderInfo?.product?.name || selectedProduct?.name || "";
                      const gtotal = placedOrderInfo?.grandTotal || placedOrderInfo?.totalPrice || 0;
                      const sname = selectedStore?.name || "Merchant";
                      const text = `Hello! I just placed order (${oid}) for "${pname}" on ${sname}. Total: ${gtotal} DA.`;
                      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
                    }}
                    className="h-12 sm:h-13 w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-extrabold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0" />
                    <span className="truncate">Contact Merchant on WhatsApp</span>
                  </button>

                  {/* Text button: Continue Shopping */}
                  <button
                    type="button"
                    onClick={() => handleThankYouAction('close')}
                    className="h-12 sm:h-13 w-full bg-stone-100 hover:bg-stone-200/80 active:scale-[0.98] text-slate-800 font-bold rounded-xl text-xs sm:text-sm border border-stone-200/80 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-stone-600 shrink-0" />
                    <span>Continue Shopping</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* iOS 26 Style Guest Buyer Registration Modal */}
      <AnimatePresence>
        {isGuestRegisterOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xl z-[10001] flex items-center justify-center p-4 overflow-y-auto"
            onClick={handleGuestMaybeLater}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 24 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/95 backdrop-blur-2xl rounded-[32px] border border-stone-200/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] w-full max-w-md overflow-hidden text-center relative flex flex-col my-auto p-6 sm:p-8 space-y-5"
            >
              {/* Close Icon Top Right */}
              <button
                type="button"
                onClick={handleGuestMaybeLater}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header Title & Message */}
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight pt-1">
                  {pendingGuestAction === 'cart' ? "Join Yume First & Save Your Cart!" : "Join the Yume Community"}
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  {pendingGuestAction === 'cart'
                    ? "Register in 1-click or enter your email to save your cart items across devices!"
                    : "Automatically create your free shopper account using your order info to unlock perks!"}
                </p>
              </div>

              {/* Benefits Checklist - Modern White Card */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 text-left space-y-2 shadow-2xs">
                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
                  <div className="w-4.5 h-4.5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>Exclusive member discounts & special coupons</span>
                </div>

                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
                  <div className="w-4.5 h-4.5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>Faster express checkout for future purchases</span>
                </div>

                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
                  <div className="w-4.5 h-4.5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>Saved delivery information & address book</span>
                </div>

                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
                  <div className="w-4.5 h-4.5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>Instant real-time order & delivery tracking</span>
                </div>
              </div>

              {/* Redesigned 1-Click Direct Registration Section - Pure White & 1-Line Social Buttons */}
              <form onSubmit={handleCreateGuestAccount} className="space-y-3.5 pt-0.5">
                <div className="space-y-2.5 text-left bg-white border border-slate-200 rounded-2xl p-3.5 shadow-2xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-900">
                      1-Click Direct Registration
                    </span>
                    <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 shrink-0">
                      Auto Sign-In App Sync
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-500 leading-tight">
                    Sign up with your preferred app. Your account will stay automatically signed in whenever you visit!
                  </p>

                  {/* Single Line Minimized Social Network Buttons */}
                  <div className="grid grid-cols-5 gap-1.5 pt-0.5">
                    {/* Gmail */}
                    <button
                      type="button"
                      title="Register with Gmail"
                      onClick={() => handleSocialRegister('gmail')}
                      className="flex flex-col items-center justify-center gap-1 bg-slate-50 hover:bg-red-50/70 border border-slate-200/80 hover:border-red-300 rounded-xl py-2 px-1 transition-all text-slate-800 shadow-3xs cursor-pointer active:scale-95 group"
                    >
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/>
                        <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                        <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.8s.7 5.1 1.9 7.5l3.7-2.9z"/>
                        <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.1C3.7 19.8 7.5 23 12 23z"/>
                      </svg>
                      <span className="text-[9.5px] font-bold text-slate-700 group-hover:text-red-600 transition-colors truncate max-w-full">Gmail</span>
                    </button>

                    {/* Hotmail */}
                    <button
                      type="button"
                      title="Register with Hotmail"
                      onClick={() => handleSocialRegister('hotmail')}
                      className="flex flex-col items-center justify-center gap-1 bg-slate-50 hover:bg-sky-50/70 border border-slate-200/80 hover:border-sky-300 rounded-xl py-2 px-1 transition-all text-slate-800 shadow-3xs cursor-pointer active:scale-95 group"
                    >
                      <div className="grid grid-cols-2 gap-0.5 w-3.5 h-3.5 shrink-0">
                        <div className="bg-[#F25022] rounded-[1px]"></div>
                        <div className="bg-[#7FBA00] rounded-[1px]"></div>
                        <div className="bg-[#00A4EF] rounded-[1px]"></div>
                        <div className="bg-[#FFB900] rounded-[1px]"></div>
                      </div>
                      <span className="text-[9.5px] font-bold text-slate-700 group-hover:text-sky-600 transition-colors truncate max-w-full">Hotmail</span>
                    </button>

                    {/* Instagram */}
                    <button
                      type="button"
                      title="Register with Instagram"
                      onClick={() => handleSocialRegister('instagram')}
                      className="flex flex-col items-center justify-center gap-1 bg-slate-50 hover:bg-pink-50/70 border border-slate-200/80 hover:border-pink-300 rounded-xl py-2 px-1 transition-all text-slate-800 shadow-3xs cursor-pointer active:scale-95 group"
                    >
                      <svg className="w-4 h-4 fill-pink-600 shrink-0" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                      <span className="text-[9.5px] font-bold text-slate-700 group-hover:text-pink-600 transition-colors truncate max-w-full">Instagram</span>
                    </button>

                    {/* Facebook */}
                    <button
                      type="button"
                      title="Register with Facebook"
                      onClick={() => handleSocialRegister('facebook')}
                      className="flex flex-col items-center justify-center gap-1 bg-slate-50 hover:bg-blue-50/70 border border-slate-200/80 hover:border-blue-300 rounded-xl py-2 px-1 transition-all text-slate-800 shadow-3xs cursor-pointer active:scale-95 group"
                    >
                      <svg className="w-4 h-4 fill-[#1877F2] shrink-0" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      <span className="text-[9.5px] font-bold text-slate-700 group-hover:text-blue-600 transition-colors truncate max-w-full">Facebook</span>
                    </button>

                    {/* WhatsApp */}
                    <button
                      type="button"
                      title="Register with WhatsApp"
                      onClick={() => handleSocialRegister('whatsapp')}
                      className="flex flex-col items-center justify-center gap-1 bg-slate-50 hover:bg-emerald-50/70 border border-slate-200/80 hover:border-emerald-300 rounded-xl py-2 px-1 transition-all text-slate-800 shadow-3xs cursor-pointer active:scale-95 group"
                    >
                      <svg className="w-4 h-4 fill-[#25D366] shrink-0" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                      </svg>
                      <span className="text-[9.5px] font-bold text-slate-700 group-hover:text-emerald-600 transition-colors truncate max-w-full">WhatsApp</span>
                    </button>
                  </div>
                </div>

                <div className="relative my-3 flex items-center justify-center">
                  <div className="border-t border-slate-200/80 w-full"></div>
                  <span className="bg-slate-100 text-slate-500 border border-slate-200/80 px-3 py-0.5 text-[9.5px] font-bold uppercase tracking-widest rounded-full shadow-3xs absolute">
                    Or via Email
                  </span>
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-[11px] font-extrabold text-slate-800 block px-0.5">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={guestRegisterEmail}
                      onChange={(e) => setGuestRegisterEmail(e.target.value)}
                      placeholder="e.g. karim.benali@gmail.com"
                      className="w-full bg-slate-50/80 hover:bg-white focus:bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all shadow-3xs"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 px-0.5 pt-0.5">
                    We'll automatically attach your name ({placedOrderInfo?.buyer?.name || "Shopper"}) and phone number to your account.
                  </p>
                </div>

                <div className="space-y-2 pt-1">
                  {/* Primary Button */}
                  <button
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-slate-900/15 active:scale-98"
                  >
                    <span>{pendingGuestAction === 'cart' ? "Join Yume & Go to Cart" : "Create My Free Account"}</span>
                  </button>

                  {/* Secondary Button */}
                  <button
                    type="button"
                    onClick={handleGuestMaybeLater}
                    className="w-full bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer text-center"
                  >
                    {pendingGuestAction === 'cart' ? "Continue to Cart as Guest" : "Maybe Later"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ShippingTrackingModal
        order={shopperTrackingOrder}
        isOpen={!!shopperTrackingOrder}
        onClose={() => setShopperTrackingOrder(null)}
      />

      {/* Terms of Service & Return Policy Modal */}
      <AnimatePresence>
        {isTermsModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[10000] flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
            onClick={() => setIsTermsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl border border-stone-200 w-full max-w-lg overflow-hidden relative flex flex-col my-auto max-h-[85vh]"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-stone-100 bg-stone-50/90 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">Terms & Store Policies</h3>
                    <p className="text-[10.5px] text-stone-500">
                      Merchant policies for <strong className="text-slate-800">{selectedStore.name}</strong>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsTermsModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-stone-200/60 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body - Scrollable Legal Placeholder Text */}
              <div className="p-5 overflow-y-auto space-y-4 text-xs text-stone-600 leading-relaxed">
                {/* Notice Banner */}
                <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3 flex gap-2.5 items-start text-amber-900">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-snug">
                    Please read these terms carefully before confirming your order. Placing an order signifies your agreement to these store policies.
                  </p>
                </div>

                {/* Section 1 */}
                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block"></span>
                    1. Order Placement & Cash on Delivery (Paiement à la livraison)
                  </h4>
                  <p className="text-[11px] text-stone-500 pl-3.5">
                    All orders placed through Express Checkout are processed under standard Cash on Delivery terms. You agree to provide accurate contact information so our delivery agents can verify and deliver your package safely.
                  </p>
                </div>

                {/* Section 2 */}
                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block"></span>
                    2. Package Inspection & Acceptance
                  </h4>
                  <p className="text-[11px] text-stone-500 pl-3.5">
                    Upon delivery, buyers are encouraged to inspect the outer packaging before signing or issuing payment to the courier representative. Any visible damage must be reported immediately.
                  </p>
                </div>

                {/* Section 3 */}
                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block"></span>
                    3. Return & Exchange Policy (شروط الإرجاع والاستبدال)
                  </h4>
                  <p className="text-[11px] text-stone-500 pl-3.5">
                    Items can be exchanged or returned within 3 to 7 days of delivery provided they are in original condition, unused, with tags attached. Shipping fees for return/exchange due to mind change are borne by the customer, unless the item delivered is defective or wrong.
                  </p>
                </div>

                {/* Section 4 */}
                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block"></span>
                    4. Privacy & Personal Data
                  </h4>
                  <p className="text-[11px] text-stone-500 pl-3.5">
                    Your personal information (Name, Phone Number, Address) is strictly utilized to process, confirm, and fulfill your shipping order with our logistics partners.
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-stone-100 bg-stone-50/80 flex items-center justify-end gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsTermsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:text-slate-800 font-bold text-xs transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAgreedToTerms(true);
                    setIsTermsModalOpen(false);
                  }}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-all shadow-sm hover:shadow cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>I Agree & Accept Terms</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
