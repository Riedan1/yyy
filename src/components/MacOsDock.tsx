import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Settings, Sliders, Palette, Check, SlidersHorizontal, Layers, Sparkles, 
  MoreHorizontal, Share2, Info, QrCode, Volume2, VolumeX, Flag, Ban, 
  Copy, Download, ExternalLink, ShieldCheck, CheckCircle2, ArrowLeft, Loader2,
  Hand, Zap, Timer, Gauge, Clock
} from "lucide-react";
import QRCode from "qrcode";
import { SkeuomorphicSwitch } from "./SkeuomorphicSwitch";

const safeGetString = (val: any): string => {
  if (!val) return "";
  try {
    if (typeof val === "string") return val.toLowerCase();
    if (typeof val === "number" || typeof val === "boolean") return String(val).toLowerCase();
    if (typeof val === "function") return val.toString().toLowerCase();
    if (Array.isArray(val)) {
      return val.map(safeGetString).join(" ");
    }
    if (typeof val === "object") {
      if (val.props) {
        return (
          safeGetString(val.props.children) + " " +
          safeGetString(val.props.title) + " " +
          safeGetString(val.props["aria-label"])
        );
      }
    }
  } catch (e) {
    console.error("safeGetString error", e);
  }
  return "";
};

export interface MacOsDockProps {
  children: React.ReactNode;
  currentLanguage?: "ar" | "en" | "fr";
  storeId?: string;
  storeName?: string;
  storeUrl?: string;
  accentColor?: string;
  isOwner?: boolean;
}

export default function MacOsDock({ 
  children, 
  currentLanguage = "en",
  storeId = "default-store",
  storeName = "Store",
  storeUrl = window.location.href,
  accentColor = "#4f46e5",
  isOwner = false
}: MacOsDockProps) {
  // Customizable state preserved in local storage for Dock customization
  const [maxScale, setMaxScale] = useState<number>(() => {
    try {
      const stored = localStorage.getItem("dock_max_scale");
      return stored ? Math.min(1.5, Number(stored)) : 1.2;
    } catch {
      return 1.2;
    }
  });

  const [gapSize, setGapSize] = useState<"small" | "medium" | "large">(() => {
    try {
      return (localStorage.getItem("dock_gap_size") as "small" | "medium" | "large") || "medium";
    } catch {
      return "medium";
    }
  });

  const [dockTheme, setDockTheme] = useState<"frosted" | "obsidian" | "aurora" | "neon">(() => {
    try {
      return (localStorage.getItem("dock_theme") as "frosted" | "obsidian" | "aurora" | "neon") || "frosted";
    } catch {
      return "frosted";
    }
  });

  const [showTooltips, setShowTooltips] = useState<boolean>(() => {
    try {
      return localStorage.getItem("dock_show_tooltips") !== "false";
    } catch {
      return true;
    }
  });

  const [showIndicatorDots, setShowIndicatorDots] = useState<boolean>(() => {
    try {
      return localStorage.getItem("dock_show_indicator_dots") === "true";
    } catch {
      return false;
    }
  });

  // UI state for dropdown and views inside dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeMenuSection, setActiveMenuSection] = useState<"main" | "settings" | "qrcode" | "report" | "block">("main");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Mute State
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    try {
      return localStorage.getItem(`dock_muted_store_${storeId}`) === "true";
    } catch {
      return false;
    }
  });

  // Poke State
  const [isPoked, setIsPoked] = useState(false);

  // Block/Report confirmation states
  const [isReported, setIsReported] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [isBlocked, setIsBlocked] = useState(() => {
    try {
      return localStorage.getItem(`dock_blocked_store_${storeId}`) === "true";
    } catch {
      return false;
    }
  });

  // QR Code Generation
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [isQrLoading, setIsQrLoading] = useState(false);
  const [isQrCopied, setIsQrCopied] = useState(false);

  // Persistence for Dock Settings
  useEffect(() => {
    try {
      localStorage.setItem("dock_max_scale", String(maxScale));
      localStorage.setItem("dock_gap_size", gapSize);
      localStorage.setItem("dock_theme", dockTheme);
      localStorage.setItem("dock_show_tooltips", String(showTooltips));
      localStorage.setItem("dock_show_indicator_dots", String(showIndicatorDots));
    } catch (e) {
      console.error("Failed to save dock configuration:", e);
    }
  }, [maxScale, gapSize, dockTheme, showTooltips, showIndicatorDots]);

  // Generate QR code when entering QR mode
  useEffect(() => {
    if (activeMenuSection === "qrcode" && !qrCodeDataUrl) {
      setIsQrLoading(true);
      QRCode.toDataURL(storeUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: "#0f172a", // slate 900
          light: "#ffffff"
        }
      })
      .then((url) => {
        setQrCodeDataUrl(url);
        setIsQrLoading(false);
      })
      .catch((err) => {
        console.error("Failed to generate QR in dock:", err);
        setIsQrLoading(false);
      });
    }
  }, [activeMenuSection, storeUrl, qrCodeDataUrl]);

  // Handle Mute toggle
  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    try {
      localStorage.setItem(`dock_muted_store_${storeId}`, String(nextMuted));
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Block toggle
  const handleToggleBlock = () => {
    const nextBlocked = !isBlocked;
    setIsBlocked(nextBlocked);
    try {
      localStorage.setItem(`dock_blocked_store_${storeId}`, String(nextBlocked));
    } catch (e) {
      console.error(e);
    }
    setActiveMenuSection("main");
  };

  // Handle Report submission
  const handleReportSubmit = (reason: string) => {
    setReportReason(reason);
    setIsReported(true);
    setTimeout(() => {
      setIsReported(false);
      setActiveMenuSection("main");
    }, 2000);
  };

  // Convert children to array to track indexes
  const childrenArray = React.Children.toArray(children).filter(Boolean);

  // Parse children to separate Share/Details and main dock buttons (Follow, Message)
  const shareChild = childrenArray.find((child: any) => {
    if (!child || !child.props) return false;
    try {
      const onClickStr = safeGetString(child.props.onClick);
      const titleStr = safeGetString(child.props.title);
      const ariaLabel = safeGetString(child.props["aria-label"]);
      const keyStr = safeGetString(child.key);
      const childrenText = safeGetString(child.props.children);
      
      return (
        onClickStr.includes("share") ||
        titleStr.includes("share") ||
        titleStr.includes("مشاركة") ||
        titleStr.includes("partager") ||
        ariaLabel.includes("share") ||
        keyStr.includes("share") ||
        childrenText.includes("share") ||
        childrenText.includes("مشاركة") ||
        childrenText.includes("partager")
      );
    } catch (e) {
      console.error("Error in shareChild find", e);
      return false;
    }
  }) as React.ReactElement | undefined;

  const detailsChild = childrenArray.find((child: any) => {
    if (!child || !child.props) return false;
    try {
      const onClickStr = safeGetString(child.props.onClick);
      const titleStr = safeGetString(child.props.title);
      const ariaLabel = safeGetString(child.props["aria-label"]);
      const keyStr = safeGetString(child.key);
      const childrenText = safeGetString(child.props.children);
      
      return (
        onClickStr.includes("detail") ||
        onClickStr.includes("showstoredetails") ||
        titleStr.includes("detail") ||
        titleStr.includes("تفاصيل") ||
        ariaLabel.includes("detail") ||
        keyStr.includes("detail") ||
        childrenText.includes("detail") ||
        childrenText.includes("تفاصيل") ||
        childrenText.includes("détail")
      );
    } catch (e) {
      console.error("Error in detailsChild find", e);
      return false;
    }
  }) as React.ReactElement | undefined;

  // The main row in the dock: only render children that are NOT Share or Details
  const mainDockChildren = childrenArray.filter((child: any) => {
    if (child === shareChild || child === detailsChild) return false;
    return true;
  });

  // Magnification curve helper for main dock row
  const getScale = (idx: number) => {
    if (hoveredIndex === null) return 1;
    const distance = Math.abs(idx - hoveredIndex);
    if (distance === 0) return maxScale;
    return 1;
  };

  // Lift offset curve helper
  const getYOffset = (idx: number) => {
    if (hoveredIndex === null) return 0;
    const distance = Math.abs(idx - hoveredIndex);
    const factor = (maxScale - 1) / 0.4;
    const baseOffset = distance === 0 ? -8 : 0;
    return baseOffset * Math.max(0, factor);
  };

  // Theme styling mapping for Dock bar
  const getThemeClasses = () => {
    switch (dockTheme) {
      case "obsidian":
        return "bg-slate-950/85 border-slate-800/80 shadow-2xl text-white";
      case "aurora":
        return "bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 border-pink-500/20 shadow-pink-500/5 shadow-xl text-slate-800 dark:text-white";
      case "neon":
        return "bg-slate-900/60 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] text-white";
      case "frosted":
      default:
        return "bg-white/40 dark:bg-slate-900/40 border-white/20 dark:border-slate-800/30 shadow-lg text-slate-800 dark:text-white";
    }
  };

  const getGapClasses = () => {
    switch (gapSize) {
      case "small":
        return "gap-4 px-3 py-1.5";
      case "large":
        return "gap-8 px-5 py-2.5";
      case "medium":
      default:
        return "gap-6 px-4 py-2";
    }
  };

  // Translations
  const t = {
    moreTitle: { en: "More Actions", ar: "المزيد من الإجراءات", fr: "Plus d'actions" },
    settingsTitle: { en: "Dock Settings", ar: "إعدادات الشريط", fr: "Paramètres du Dock" },
    magnification: { en: "Magnification Factor", ar: "مستوى التكبير", fr: "Facteur de grossissement" },
    gap: { en: "Spacing Size", ar: "حجم التباعد", fr: "Taille de l'espacement" },
    theme: { en: "Dock Skin", ar: "مظهر الشريط", fr: "Thème du Dock" },
    tooltips: { en: "Show Tooltips", ar: "إظهار تلميحات الأدوات", fr: "Afficher les info-bulles" },
    indicatorDots: { en: "Show Active Indicators", ar: "إظهار نقاط المؤشر", fr: "Indicateurs d'activité" },
    back: { en: "Back", ar: "عودة", fr: "Retour" },
    
    // Dropdown Items
    share: { en: "Share Store", ar: "مشاركة المتجر", fr: "Partager la boutique" },
    details: { en: "Store Details", ar: "تفاصيل المتجر", fr: "Détails de la boutique" },
    settings: { en: "Customizer", ar: "تخصيص المظهر", fr: "Personnaliser" },
    qrcode: { en: "Generate QR Code", ar: "توليد رمز QR", fr: "Générer le code QR" },
    mute: { en: "Mute Store", ar: "كتم المتجر", fr: "Muter la boutique" },
    unmute: { en: "Unmute Store", ar: "إلغاء كتم المتجر", fr: "Démuter la boutique" },
    poke: { en: "Rush store", ar: "استعجال المتجر", fr: "Bousculer la boutique" },
    poked: { en: "Rushed! ⏱️", ar: "تم الاستعجال! ⏱️", fr: "Bousculé ! ⏱️" },
    report: { en: "Report Store", ar: "إبلاغ عن المتجر", fr: "Signaler la boutique" },
    block: { en: "Block Store", ar: "حظر المتجر", fr: "Bloquer la boutique" },
    unblock: { en: "Unblock Store", ar: "إلغاء حظر المتجر", fr: "Débloquer la boutique" },

    // States
    copied: { en: "Copied!", ar: "تم النسخ!", fr: "Copié !" },
    download: { en: "Download", ar: "تحميل", fr: "Télécharger" },
    reportSuccess: { en: "Report submitted successfully!", ar: "تم تقديم البلاغ بنجاح!", fr: "Signalement envoyé !" },
    selectReason: { en: "Select a reason for reporting:", ar: "اختر سبب الإبلاغ:", fr: "Raison du signalement :" },
    blockConfirm: { en: "Are you sure you want to block this store? You will no longer see its products.", ar: "هل أنت متأكد من حظر هذا المتجر؟ لن ترى منتجاته بعد الآن.", fr: "Bloquer cette boutique ?" },
    confirm: { en: "Confirm Block", ar: "تأكيد الحظر", fr: "Confirmer le blocage" },
    cancel: { en: "Cancel", ar: "إلغاء", fr: "Annuler" },
  };

  const currentLang = currentLanguage === "ar" || currentLanguage === "fr" ? currentLanguage : "en";

  return (
    <div className="relative flex items-center select-none" id="macos-dock-wrapper">
      {/* Dock Main Row */}
      <motion.div
        layout
        className={`flex items-center rounded-2xl border backdrop-blur-md transition-colors duration-300 ${getThemeClasses()} ${getGapClasses()}`}
        id="macos-dock-container"
        style={{
          transformOrigin: "bottom center",
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: "0px",
          paddingBottom: "5px",
          backgroundColor: "transparent",
          borderColor: "transparent",
          boxShadow: "none",
          backdropFilter: "none"
        }}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {/* Render only Follow and Message inside the dock bar row */}
        {mainDockChildren.map((child, idx) => {
          const scale = getScale(idx);
          const y = getYOffset(idx);
          const childElement = child as React.ReactElement;
          
          const isActive = childElement?.props?.className?.includes("is-following") || 
                           childElement?.props?.className?.includes("bg-amber-600") || 
                           childElement?.props?.className?.includes("text-white");

          const tooltipLabel = childElement?.props?.title || 
                               childElement?.props?.children?.props?.children || 
                               childElement?.props?.children || 
                               "Action";

          return (
            <div
              key={idx}
              className="relative flex flex-col items-center"
              onMouseEnter={() => setHoveredIndex(idx)}
            >
              {/* Animating child wrapper */}
              <motion.div
                animate={{
                  scale,
                  y,
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 25,
                  mass: 0.8
                }}
                className="origin-bottom flex items-center justify-center shrink-0"
              >
                {React.cloneElement(childElement, {
                  title: undefined
                })}
              </motion.div>

              {/* Active Indicator dots */}
              {showIndicatorDots && isActive && (
                <div className="absolute -bottom-1.5 flex justify-center w-full">
                  <motion.div 
                    layoutId={`dock-dot-${idx}`}
                    className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_6px_#f59e0b] shrink-0"
                  />
                </div>
              )}
            </div>
          );
        })}

        {/* Separating Divider */}
        <div className="w-[1.5px] h-6 bg-slate-400/25 dark:bg-slate-500/25 mx-1 shrink-0" />

        {/* Dynamic Round More Button with 3 dots */}
        <div
          className="relative flex flex-col items-center"
          onMouseEnter={() => setHoveredIndex(mainDockChildren.length)}
        >
          <motion.button
            animate={{
              scale: getScale(mainDockChildren.length),
              y: getYOffset(mainDockChildren.length),
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25
            }}
            onClick={() => {
              setIsDropdownOpen(!isDropdownOpen);
              setActiveMenuSection("main");
            }}
            style={{
              backgroundColor: accentColor,
              borderColor: accentColor
            }}
            className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all border text-white shadow-sm hover:brightness-110 active:scale-95 ${
              isDropdownOpen ? "rotate-90" : ""
            }`}
          >
            <MoreHorizontal className="w-4.5 h-4.5 stroke-[2.5px] text-white" />
          </motion.button>
        </div>
      </motion.div>

      {/* Dropdown Menu - Opens DOWNWARD with white background and neat sections */}
      <AnimatePresence>
        {isDropdownOpen && (
          <>
            {/* Click-away backdrop */}
            <div 
              className="fixed inset-0 z-40 bg-transparent"
              onClick={() => setIsDropdownOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 450, damping: 28 }}
              className="absolute top-full right-0 mt-3 z-50 w-64 bg-white border border-slate-200 shadow-xl rounded-2xl p-1.5 text-left text-slate-800"
              style={{ transformOrigin: "top right" }}
            >
              {activeMenuSection === "main" && (
                <div className="flex flex-col gap-0.5 font-sans text-[11.5px] font-semibold">
                  
                  {/* SECTION 1: MAIN NAVIGATION ACTIONS */}
                  <div className="px-2 py-1 text-[9px] uppercase tracking-wider text-slate-400 font-bold font-mono">
                    {currentLang === "ar" ? "الإجراءات الرئيسية" : "Main Actions"}
                  </div>

                  {/* 1. Share Store */}
                  <button
                    onClick={() => {
                      if (shareChild) {
                        shareChild.props.onClick();
                      } else {
                        navigator.clipboard.writeText(storeUrl);
                      }
                    }}
                     className="w-full px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2.5 text-left text-slate-700 hover:text-slate-900 cursor-pointer"
                  >
                    <Share2 className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="flex-1 truncate">{t.share[currentLang]}</span>
                    {safeGetString(shareChild?.props?.children).includes("copied") || safeGetString(shareChild).includes("copied") ? (
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded-full font-bold">
                        {t.copied[currentLang]}
                      </span>
                    ) : null}
                  </button>

                  {/* 2. Store Details */}
                  <button
                    onClick={() => {
                      if (detailsChild) {
                        detailsChild.props.onClick();
                      }
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2.5 text-left text-slate-700 hover:text-slate-900 cursor-pointer"
                  >
                    <Info className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="flex-1 truncate">{t.details[currentLang]}</span>
                    <div className={`w-2 h-2 rounded-full ${safeGetString(detailsChild?.props?.children).includes("hide") || (typeof detailsChild?.props?.className === "string" && (detailsChild.props.className.includes("bg-amber-600") || detailsChild.props.className.includes("text-white"))) ? "bg-amber-500" : "bg-transparent"}`} />
                  </button>

                  <div className="h-[1px] bg-slate-100 my-1" />

                  {/* SECTION 2: UTILITIES */}
                  <div className="px-2 py-1 text-[9px] uppercase tracking-wider text-slate-400 font-bold font-mono">
                    {currentLang === "ar" ? "أدوات وميزات" : "Utilities & Features"}
                  </div>

                  {/* 3. Settings (Dock Customization) */}
                  {isOwner && (
                    <button
                      onClick={() => setActiveMenuSection("settings")}
                      className="w-full px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2.5 text-left text-slate-700 hover:text-slate-900 cursor-pointer"
                    >
                      <Settings className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="flex-1 truncate">{t.settingsTitle[currentLang]}</span>
                    </button>
                  )}

                  {/* 4. Generating QR Code */}
                  <button
                    onClick={() => setActiveMenuSection("qrcode")}
                    className="w-full px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2.5 text-left text-slate-700 hover:text-slate-900 cursor-pointer"
                  >
                    <QrCode className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="flex-1 truncate">{t.qrcode[currentLang]}</span>
                  </button>

                  {/* 5. Mute Store */}
                  <button
                    onClick={handleToggleMute}
                    className="w-full px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2.5 text-left text-slate-700 hover:text-slate-900 cursor-pointer"
                  >
                    {isMuted ? (
                      <>
                        <Volume2 className="w-4 h-4 text-amber-500 shrink-0 animate-pulse" />
                        <span className="flex-1 font-bold text-amber-600">{t.unmute[currentLang]}</span>
                        <span className="text-[10px] bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded-full font-bold">
                          {currentLang === "ar" ? "مكتوم" : "Muted"}
                        </span>
                      </>
                    ) : (
                      <>
                        <VolumeX className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="flex-1">{t.mute[currentLang]}</span>
                      </>
                    )}
                  </button>

                  {/* 5.5 Poke Store */}
                  <button
                    onClick={() => {
                      setIsPoked(true);
                      setTimeout(() => setIsPoked(false), 2000);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2.5 text-left text-slate-700 hover:text-slate-900 cursor-pointer"
                  >
                    <Timer className={`w-4 h-4 shrink-0 transition-all duration-300 ${isPoked ? "text-amber-500 scale-125 rotate-12" : "text-slate-400"}`} />
                    <span className="flex-1 truncate">{t.poke[currentLang]}</span>
                    {isPoked && (
                      <span className="text-[10px] bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded-full font-bold animate-bounce">
                        {t.poked[currentLang]}
                      </span>
                    )}
                  </button>

                  <div className="h-[1px] bg-slate-100 my-1" />

                  {/* SECTION 3: SAFETY & HARM PREVENTION */}
                  <div className="px-2 py-1 text-[9px] uppercase tracking-wider text-slate-400 font-bold font-mono">
                    {currentLang === "ar" ? "الأمان والحظر" : "Safety Actions"}
                  </div>

                  {/* 6. Report Store */}
                  <button
                    onClick={() => setActiveMenuSection("report")}
                    className="w-full px-2.5 py-1.5 rounded-lg hover:bg-rose-50/50 hover:text-rose-600 transition-colors flex items-center gap-2.5 text-left text-slate-700 cursor-pointer"
                  >
                    <Flag className="w-4 h-4 text-rose-400 shrink-0" />
                    <span className="flex-1 truncate">{t.report[currentLang]}</span>
                  </button>

                  {/* 7. Block Store */}
                  <button
                    onClick={() => {
                      if (isBlocked) {
                        handleToggleBlock();
                      } else {
                        setActiveMenuSection("block");
                      }
                    }}
                    className={`w-full px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-2.5 text-left cursor-pointer ${
                      isBlocked 
                        ? "bg-rose-50 text-rose-600 hover:bg-rose-100" 
                        : "hover:bg-rose-50/50 hover:text-rose-600 text-slate-700"
                    }`}
                  >
                    <Ban className={`w-4 h-4 shrink-0 ${isBlocked ? "text-rose-500" : "text-rose-400"}`} />
                    <span className="flex-1">{isBlocked ? t.unblock[currentLang] : t.block[currentLang]}</span>
                    {isBlocked && (
                      <span className="text-[10px] bg-rose-500/10 text-rose-600 px-1.5 py-0.5 rounded-full font-bold">
                        {currentLang === "ar" ? "محظور" : "Blocked"}
                      </span>
                    )}
                  </button>

                </div>
              )}

              {/* VIEW: SETTINGS SUBMENU */}
              {activeMenuSection === "settings" && (
                <div className="p-1 font-sans text-xs">
                  <button
                    onClick={() => setActiveMenuSection("main")}
                    className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-bold mb-3 pb-2 border-b border-slate-100 w-full cursor-pointer text-left"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{t.back[currentLang]}</span>
                  </button>

                  <div className="space-y-4 pt-1">
                    {/* Scale factor / Magnification */}
                    <div className="space-y-1.5 px-1">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-semibold text-slate-500">{t.magnification[currentLang]}</span>
                        <span className="font-bold text-amber-500 font-mono">{maxScale.toFixed(2)}x</span>
                      </div>
                      <input
                        type="range"
                        min="1.0"
                        max="1.50"
                        step="0.05"
                        value={maxScale}
                        onChange={(e) => setMaxScale(Number(e.target.value))}
                        className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                    </div>

                    {/* Gap size */}
                    <div className="space-y-1.5 px-1">
                      <span className="font-semibold text-slate-500 text-[11px] block">{t.gap[currentLang]}</span>
                      <div className="grid grid-cols-3 gap-1">
                        {(["small", "medium", "large"] as const).map((sz) => (
                          <button
                            key={sz}
                            onClick={() => setGapSize(sz)}
                            className={`py-1 rounded-md border text-[9.5px] font-bold capitalize transition-all cursor-pointer ${
                              gapSize === sz
                                ? "bg-amber-500/10 border-amber-500 text-amber-600"
                                : "border-slate-100 bg-slate-50 hover:bg-slate-100 text-slate-600"
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Themes */}
                    <div className="space-y-1.5 px-1">
                      <span className="font-semibold text-slate-500 text-[11px] block">{t.theme[currentLang]}</span>
                      <div className="grid grid-cols-2 gap-1">
                        {(["frosted", "obsidian", "aurora", "neon"] as const).map((skin) => (
                          <button
                            key={skin}
                            onClick={() => setDockTheme(skin)}
                            className={`py-1 px-1.5 rounded-lg border text-[9.5px] font-bold capitalize transition-all flex items-center justify-between cursor-pointer ${
                              dockTheme === skin
                                ? "bg-amber-500 border-amber-500 text-white"
                                : "border-slate-100 bg-slate-50 hover:bg-slate-100 text-slate-600"
                            }`}
                          >
                            <span>{skin}</span>
                            {dockTheme === skin && <Check className="w-3 h-3 stroke-[3px]" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Toggles */}
                    <div className="space-y-3 pt-2.5 border-t border-slate-100 px-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-slate-500 hover:text-slate-800 transition-colors">
                          {t.tooltips[currentLang]}
                        </span>
                        <SkeuomorphicSwitch
                          checked={showTooltips}
                          onChange={setShowTooltips}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-slate-500 hover:text-slate-800 transition-colors">
                          {t.indicatorDots[currentLang]}
                        </span>
                        <SkeuomorphicSwitch
                          checked={showIndicatorDots}
                          onChange={setShowIndicatorDots}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW: QR CODE GENERATOR */}
              {activeMenuSection === "qrcode" && (
                <div className="p-1 font-sans text-xs flex flex-col items-center">
                  <button
                    onClick={() => setActiveMenuSection("main")}
                    className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-bold mb-3 pb-2 border-b border-slate-100 w-full cursor-pointer text-left"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{t.back[currentLang]}</span>
                  </button>

                  <div className="text-center font-bold text-slate-700 mb-2 truncate max-w-full px-2">
                    {storeName}
                  </div>

                  <div className="relative w-40 h-40 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center p-2 shadow-inner mb-3">
                    {isQrLoading ? (
                      <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
                    ) : qrCodeDataUrl ? (
                      <img 
                        src={qrCodeDataUrl} 
                        alt="Store QR Code" 
                        className="w-full h-full object-contain rounded-lg animate-fade-in"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="text-[10px] text-slate-400">Failed to load</span>
                    )}
                  </div>

                  <div className="flex gap-1.5 w-full px-1">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(storeUrl);
                        setIsQrCopied(true);
                        setTimeout(() => setIsQrCopied(false), 2000);
                      }}
                      className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10.5px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    >
                      {isQrCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">{t.copied[currentLang]}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>{currentLang === "ar" ? "نسخ الرابط" : "Copy Link"}</span>
                        </>
                      )}
                    </button>

                    {qrCodeDataUrl && (
                      <a
                        href={qrCodeDataUrl}
                        download={`${storeName.toLowerCase().replace(/\s+/g, "-")}-qr-code.png`}
                        className="flex-1 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[10.5px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors text-center text-white"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{t.download[currentLang]}</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* VIEW: REPORT ACTION */}
              {activeMenuSection === "report" && (
                <div className="p-1 font-sans text-xs">
                  <button
                    onClick={() => setActiveMenuSection("main")}
                    className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-bold mb-3 pb-2 border-b border-slate-100 w-full cursor-pointer text-left"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{t.back[currentLang]}</span>
                  </button>

                  {isReported ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center py-6 text-center text-emerald-600 font-bold gap-2"
                    >
                      <CheckCircle2 className="w-10 h-10 text-emerald-500 animate-bounce" />
                      <span>{t.reportSuccess[currentLang]}</span>
                      <span className="text-[10px] text-slate-400 font-medium">Reason: {reportReason}</span>
                    </motion.div>
                  ) : (
                    <div className="space-y-2">
                      <span className="font-semibold text-slate-500 block text-[10px] uppercase font-mono px-1">
                        {t.selectReason[currentLang]}
                      </span>

                      <div className="flex flex-col gap-1">
                        {[
                          { key: "spam", en: "Spam or Advertising", ar: "محتوى عشوائي أو إعلان", fr: "Spam ou publicité" },
                          { key: "scam", en: "Scam or Fraudulent", ar: "احتيال أو نصب", fr: "Arnaque ou fraude" },
                          { key: "inappropriate", en: "Inappropriate Content", ar: "محتوى غير لائق", fr: "Contenu inapproprié" },
                          { key: "intellectual", en: "Intellectual Property Violation", ar: "انتهاك الملكية الفكرية", fr: "Violation de propriété" },
                        ].map((opt) => (
                          <button
                            key={opt.key}
                            onClick={() => handleReportSubmit(opt[currentLang])}
                            className="w-full text-left p-2 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-rose-600 transition-colors font-semibold cursor-pointer border border-transparent hover:border-rose-100"
                          >
                            {opt[currentLang]}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* VIEW: BLOCK CONFIRMATION */}
              {activeMenuSection === "block" && (
                <div className="p-1 font-sans text-xs">
                  <button
                    onClick={() => setActiveMenuSection("main")}
                    className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-bold mb-3 pb-2 border-b border-slate-100 w-full cursor-pointer text-left"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{t.back[currentLang]}</span>
                  </button>

                  <div className="p-2 space-y-4">
                    <div className="flex items-start gap-2.5">
                      <Ban className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                      <p className="text-slate-600 font-semibold leading-relaxed">
                        {t.blockConfirm[currentLang]}
                      </p>
                    </div>

                    <div className="flex gap-2 justify-end pt-1">
                      <button
                        onClick={() => setActiveMenuSection("main")}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold cursor-pointer transition-colors"
                      >
                        {t.cancel[currentLang]}
                      </button>
                      <button
                        onClick={handleToggleBlock}
                        className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-bold cursor-pointer transition-colors"
                      >
                        {t.confirm[currentLang]}
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
