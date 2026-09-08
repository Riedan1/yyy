import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

const guestAvatarImg = "/guest_avatar.jpg";
import {
  Star,
  ThumbsUp,
  Heart,
  Laugh,
  Check,
  MessageSquare,
  MessageCircle,
  Sparkles,
  Send,
  Globe,
  X,
  User,
  ShieldCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Pencil,
  Trash2,
  SlidersHorizontal,
  Flag,
  CornerDownRight,
  ChevronUp,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Shield,
  Camera,
  Eye,
  EyeOff,
  Pin,
  Lock,
  Unlock,
  Copy,
  Link,
  Loader2,
  Image as ImageIcon
} from "lucide-react";

export type Lang = "en" | "ar";

export interface ReviewReply {
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
  parentId: string;
  isReported?: boolean;
  isEdited?: boolean;
  isNew?: boolean;
  isHighlighted?: boolean;
  purchasedVariant?: string;
  images?: string[];
  ip?: string;
  isHidden?: boolean;
  isPinned?: boolean;
  isLocked?: boolean;
  replies?: ReviewReply[];
}

export interface ReviewItem {
  id: string;
  author: string;
  role?: string;
  badge?: string;
  rating?: number;
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
  parentId?: string | null;
  isReported?: boolean;
  isEdited?: boolean;
  isNew?: boolean;
  isHighlighted?: boolean;
  purchasedVariant?: string;
  images?: string[];
  ip?: string;
  isHidden?: boolean;
  isPinned?: boolean;
  isLocked?: boolean;
  replies?: ReviewReply[];
}

interface ProductReviewWidgetProps {
  productName: string;
  storeName: string;
  storeLogo?: string;
  activeThemeColor?: string;
  reviews: ReviewItem[];
  onAddReview: (review: { rating: number; emoji: string; text: string; lang: Lang; images?: string[]; purchasedVariant?: string }) => Promise<void> | void;
  onToggleLike: (reviewId: string) => void;
  onToggleLove: (reviewId: string) => void;
  onToggleHaha?: (reviewId: string) => void;
  onAddReply: (targetId: string, replyText: string, images?: string[]) => void;
  onToggleReplyLike: (rootId: string, replyId: string) => void;
  onToggleReplyLove: (rootId: string, replyId: string) => void;
  onToggleReplyHaha?: (rootId: string, replyId: string) => void;
  onDeleteComment?: (id: string) => void;
  onEditComment?: (id: string, newText: string) => void;
  onCustomizeComment?: (id: string, updates: { author?: string; badge?: string; avatarBg?: string; emoji?: string }) => void;
  onReportComment?: (id: string, reason: string) => void;
  onToggleHide?: (id: string) => void;
  onTogglePin?: (id: string) => void;
  onToggleLock?: (id: string) => void;
  currentStoreId?: string;
  myStoreId?: string;
  currentUserId?: string;
  currentUserName?: string;
  currentUserRole?: string;
  currentUserIp?: string;
  purchasedVariant?: string;
  initialLang?: Lang;
}

export function compressImage(file: File, maxDimension = 1200, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedDataUrl);
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function getGuestIp(): string {
  try {
    let savedIp = localStorage.getItem("yume_guest_ip");
    if (!savedIp) {
      const r1 = Math.floor(Math.random() * 200) + 10;
      const r2 = Math.floor(Math.random() * 250) + 1;
      savedIp = `197.204.${r1}.${r2}`;
      localStorage.setItem("yume_guest_ip", savedIp);

      fetch("https://api.ipify.org?format=json")
        .then((res) => res.json())
        .then((data) => {
          if (data && data.ip) {
            localStorage.setItem("yume_guest_ip", data.ip);
          }
        })
        .catch(() => {});
    }
    return savedIp;
  } catch {
    return "197.204.8.44";
  }
}

export function evaluateCommentPermissions({
  commentAuthor,
  commentUserId,
  commentRole,
  commentBadge,
  commentIp,
  currentUserName,
  currentUserId,
  currentUserRole,
  currentUserIp,
  currentStoreId,
  myStoreId,
  storeName,
  isNew
}: {
  commentAuthor?: string;
  commentUserId?: string;
  commentRole?: string;
  commentBadge?: string;
  commentIp?: string;
  currentUserName?: string;
  currentUserId?: string;
  currentUserRole?: string;
  currentUserIp?: string;
  currentStoreId?: string;
  myStoreId?: string;
  storeName?: string;
  isNew?: boolean;
}) {
  const authorLower = (commentAuthor || "").toLowerCase().trim();
  const effectiveUserName = currentUserName || storeName || "";
  const currentUserLower = effectiveUserName.toLowerCase().trim();
  const storeLower = (storeName || "").toLowerCase().trim();

  // Strict store scoping:
  // Store owners and moderators can only manage comments within their own store.
  // If currentStoreId and myStoreId are defined and differ, isSameStore is false.
  const isSameStore =
    Boolean(currentStoreId) && Boolean(myStoreId)
      ? currentStoreId === myStoreId
      : true;

  // Strict store owner/mod role check:
  // Must be Store Admin, Moderator, or Merchant AND must be in their own store!
  const isStoreOwnerOrMod =
    isSameStore &&
    Boolean(currentUserRole) &&
    (currentUserRole === "Store Admin" ||
      currentUserRole === "Moderator" ||
      currentUserRole === "Merchant");

  if (isNew) {
    return { isCommentOwner: true, isStoreOwnerOrMod };
  }

  const effectiveUserIp = currentUserIp || getGuestIp();

  const isIdMatch = Boolean(currentUserId) && Boolean(commentUserId) && currentUserId === commentUserId;
  const isNameMatch =
    Boolean(currentUserLower) &&
    Boolean(authorLower) &&
    (authorLower === currentUserLower ||
      authorLower.includes(currentUserLower) ||
      currentUserLower.includes(authorLower));

  const isStoreMatch =
    isStoreOwnerOrMod &&
    Boolean(storeLower) &&
    Boolean(authorLower) &&
    (authorLower === storeLower ||
      authorLower.includes(storeLower) ||
      storeLower.includes(authorLower));

  const isGuestComment =
    (commentRole || "").toLowerCase().includes("guest") ||
    (commentBadge || "").toLowerCase().includes("guest") ||
    authorLower.includes("guest");

  const isCurrentGuest =
    !currentUserRole ||
    currentUserRole.toLowerCase() === "guest" ||
    currentUserLower.includes("guest");

  let isCommentOwner = false;

  if (isIdMatch) {
    isCommentOwner = true;
  } else if (commentIp && effectiveUserIp) {
    // Guest IP comparison: Must match the comment's IP address!
    isCommentOwner = commentIp === effectiveUserIp;
  } else if (isGuestComment && isCurrentGuest) {
    // Fallback if comment has no explicit IP stored
    isCommentOwner = isNameMatch;
  } else if (isNameMatch || isStoreMatch) {
    isCommentOwner = true;
  }

  return {
    isCommentOwner,
    isStoreOwnerOrMod
  };
}

const EMOJI_OPTIONS = [
  { rating: 1, emoji: "😢", labelEn: "Dissatisfied", labelAr: "غير راضٍ", color: "from-rose-500 to-red-600" },
  { rating: 2, emoji: "🙁", labelEn: "Fair", labelAr: "مقبول", color: "from-amber-500 to-orange-500" },
  { rating: 3, emoji: "😐", labelEn: "Good", labelAr: "جيد", color: "from-yellow-400 to-amber-500" },
  { rating: 4, emoji: "😊", labelEn: "Great", labelAr: "ممتاز", color: "from-emerald-400 to-teal-500" },
  { rating: 5, emoji: "🤩", labelEn: "Exceptional", labelAr: "استثنائي", color: "from-indigo-500 to-purple-600" }
];

const PROMPTS: Record<Lang, string[]> = {
  en: [
    "Share your experience—you might help someone find their next favorite product.",
    "Loved it? Tell others what made it special!",
    "Not what you expected? Share honestly.",
    "What was the best part of your purchase?",
    "How did this item fit into your daily routine?",
    "Help fellow shoppers with a quick review!",
    "Your voice matters—what did you think?",
    "Spill the details! How's the quality and feel?",
    "Would you recommend this to a friend?",
    "Tell us your honest thoughts in a few words.",
    "What surprised you most about this product?",
    "How was your unboxing experience?",
    "Is it a 10/10 or is there room to grow?",
    "What advice would you give to future buyers?",
    "Did it live up to the hype for you?",
    "Drop a quick note about your experience!",
    "What made you choose this item today?",
    "How does it feel in person compared to photos?",
    "Got a favorite feature? We'd love to know!",
    "Share your impression to guide the community."
  ],
  ar: [
    "شارك تجربتك—قد تساعد متسوقاً آخر في العثور على منتجه المفضل التالي.",
    "عجبك المنتج؟ أخبر الآخرين بما جعله مميزًا.",
    "لم يكن كما توقعت؟ شارك رأيك بصراحة.",
    "ما هو أفضل جزء في مشترياتك؟",
    "كيف يناسب هذا المنتج روتينك اليومي؟",
    "ساعد المتسوقين الآخرين بتقييم سريع!",
    "رأيك يهمنا—ما انطباعك عن المنتج؟",
    "شاركنا التفاصيل! كيف كانت الجودة واللمسة؟",
    "هل تنصح به أصدقاءك؟",
    "أخبرنا برأيك الصريح بكلمات بسيطة.",
    "ما الذي فاجأك أكثر في هذا المنتج؟",
    "كيف كانت تجربة فتح الصندوق؟",
    "هل يستحق التقييم الكامل أم هناك مجال للتحسين؟",
    "ما هي النصيحة التي تقدمها للمتسوقين القادمين؟",
    "هل كان عند مستوى تطلعاتك؟",
    "اترك ملاحظة سريعة عن تجربتك!",
    "ما الذي جعلك تختار هذا المنتج اليوم؟",
    "كيف تبدو جودته على الواقع مقارنة بالصور؟",
    "هل لديك ميزة مفضلة؟ يسعدنا معرفتها!",
    "شاركي انطباعك لتوجيه مجتمع المتسوقين."
  ]
};

const PRESET_TAGS: Record<Lang, string[]> = {
  en: [
    "High Quality",
    "Superb Craftsmanship",
    "100% Recommended",
    "Authentic Heritage",
    "Fast Shipping",
    "Excellent Value",
    "Great Customer Support",
    "Fits Perfectly",
    "Beautiful Packaging",
    "Top Notch Finish",
    "Durable & Sturdy",
    "Met All Expectations",
    "Will Buy Again",
    "Soft & Comfortable",
    "Smooth Delivery"
  ],
  ar: [
    "جودة عالية",
    "صنع يدوي متقن",
    "موصى به 100%",
    "تراث أصيل",
    "شحن سريع",
    "قيمة ممتازة",
    "خدمة عملاء رائعة",
    "مقاس ممتاز",
    "تغليف أنيق",
    "تشطيب فاخر",
    "متين وجيد",
    "تجاوز التوقعات",
    "سأشتري مجدداً",
    "مريح وناعم",
    "توصيل سلس"
  ]
};

function getRandomPrompt(lang: Lang): string {
  const list = PROMPTS[lang];
  const idx = Math.floor(Math.random() * list.length);
  return list[idx];
}

export function LineArtFaceIcon({
  rating,
  emoji,
  className = "w-6 h-6 text-slate-800 dark:text-slate-200"
}: {
  rating?: number;
  emoji?: string;
  className?: string;
}) {
  let faceType = "happy";
  if (rating === 1 || emoji === "😢") faceType = "sad";
  else if (rating === 2 || emoji === "🙁") faceType = "roll";
  else if (rating === 3 || emoji === "😐") faceType = "neutral";
  else if (rating === 4 || emoji === "😊") faceType = "happy";
  else if (rating === 5 || emoji === "🤩") faceType = "excited";

  if (faceType === "sad") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9.5" />
        <circle cx="8.5" cy="10" r="1" fill="currentColor" stroke="none" />
        <circle cx="15.5" cy="10" r="1" fill="currentColor" stroke="none" />
        <path d="M8.5 15.5c1.2-1.2 2.3-1.8 3.5-1.8s2.3.6 3.5 1.8" />
        <path d="M7.5 11.5c.3.8.2 1.5-.3 1.8" />
      </svg>
    );
  }

  if (faceType === "roll") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9.5" />
        <circle cx="9" cy="8.5" r="1.5" />
        <circle cx="15" cy="8.5" r="1.5" />
        <circle cx="9" cy="7.8" r="0.6" fill="currentColor" stroke="none" />
        <circle cx="15" cy="7.8" r="0.6" fill="currentColor" stroke="none" />
        <path d="M9 15h6" />
      </svg>
    );
  }

  if (faceType === "neutral") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9.5" />
        <circle cx="9" cy="10" r="1" fill="currentColor" stroke="none" />
        <circle cx="15" cy="10" r="1" fill="currentColor" stroke="none" />
        <path d="M8.5 14.5h7" />
      </svg>
    );
  }

  if (faceType === "happy") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9.5" />
        <path d="M7.5 9.5c.7-.8 1.8-.8 2.5 0" />
        <path d="M14 9.5c.7-.8 1.8-.8 2.5 0" />
        <path d="M8.5 14c1 1.2 2.2 1.8 3.5 1.8s2.5-.6 3.5-1.8" />
      </svg>
    );
  }

  // Excited / Starry / Heart eyes
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9.5" />
      <path d="M9 7.5l.5 1 1.1.2-.8.8.2 1.1-1-.5-1 .5.2-1.1-.8-.8 1.1-.2z" />
      <path d="M15 7.5l.5 1 1.1.2-.8.8.2 1.1-1-.5-1 .5.2-1.1-.8-.8 1.1-.2z" />
      <path d="M8 14c1 2 2.3 2.8 4 2.8s3-.8 4-2.8" />
    </svg>
  );
}

// 3-dots Action Menu for Comment / Reply Management dynamically based on user role & store scoping
function ItemActionMenu({
  isRtl,
  isCommentOwner,
  isStoreOwnerOrMod,
  isHidden,
  isPinned,
  isLocked,
  onEdit,
  onCustomize,
  onDelete,
  onHide,
  onPin,
  onLock,
  onReport,
  onCopyLink
}: {
  isRtl: boolean;
  isCommentOwner: boolean;
  isStoreOwnerOrMod: boolean;
  isHidden?: boolean;
  isPinned?: boolean;
  isLocked?: boolean;
  onEdit?: () => void;
  onCustomize?: () => void;
  onDelete?: () => void;
  onHide?: () => void;
  onPin?: () => void;
  onLock?: () => void;
  onReport?: () => void;
  onCopyLink?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopy = () => {
    if (onCopyLink) {
      onCopyLink();
    } else {
      try {
        navigator.clipboard.writeText(window.location.href);
      } catch (e) {}
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-200/80 transition-colors cursor-pointer"
        title={isRtl ? "خيارات التعليق" : "Manage comment"}
      >
        <MoreVertical className="w-3.5 h-3.5" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.12 }}
            className={`absolute z-30 ${
              isRtl ? "left-0" : "right-0"
            } mt-1 w-44 bg-white dark:bg-white rounded-xl shadow-2xl border border-slate-200 dark:border-slate-200 py-1 text-[11px] font-bold text-slate-800 dark:text-slate-800 divide-y divide-slate-100 dark:divide-slate-100 select-none`}
          >
            {/* Options for Comment Owner & Store Admin / Moderator */}
            {(isCommentOwner || isStoreOwnerOrMod) && (
              <div className="py-0.5">
                {isCommentOwner && onEdit && (
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      onEdit();
                    }}
                    className="w-full text-left rtl:text-right px-3 py-1.5 flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-100 text-slate-800 dark:text-slate-800 hover:text-indigo-600 transition-colors cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span>{isRtl ? "تعديل" : "Edit"}</span>
                  </button>
                )}

                {onDelete && (
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      onDelete();
                    }}
                    className="w-full text-left rtl:text-right px-3 py-1.5 flex items-center gap-2 hover:bg-rose-50 dark:hover:bg-rose-50 text-rose-600 font-extrabold transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>{isRtl ? "حذف" : "Delete"}</span>
                  </button>
                )}
              </div>
            )}

            {/* Options for Store Owner / Moderator of SAME Store */}
            {isStoreOwnerOrMod && (
              <div className="py-0.5">
                {onHide && (
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      onHide();
                    }}
                    className="w-full text-left rtl:text-right px-3 py-1.5 flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-100 text-slate-800 dark:text-slate-800 hover:text-amber-600 transition-colors cursor-pointer"
                  >
                    {isHidden ? (
                      <>
                        <Eye className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{isRtl ? "إظهار التعليق" : "Unhide Comment"}</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>{isRtl ? "إخفاء التعليق" : "Hide Comment"}</span>
                      </>
                    )}
                  </button>
                )}

                {onPin && (
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      onPin();
                    }}
                    className="w-full text-left rtl:text-right px-3 py-1.5 flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-100 text-slate-800 dark:text-slate-800 hover:text-purple-600 transition-colors cursor-pointer"
                  >
                    <Pin className={`w-3.5 h-3.5 shrink-0 ${isPinned ? "text-purple-600 fill-current" : "text-purple-500"}`} />
                    <span>{isPinned ? (isRtl ? "إلغاء التثبيت" : "Unpin Comment") : (isRtl ? "تثبيت التعليق" : "Pin Comment")}</span>
                  </button>
                )}

                {onLock && (
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      onLock();
                    }}
                    className="w-full text-left rtl:text-right px-3 py-1.5 flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-100 text-slate-800 dark:text-slate-800 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    {isLocked ? (
                      <>
                        <Unlock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span>{isRtl ? "فتح الردود" : "Unlock Replies"}</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span>{isRtl ? "قفل الردود" : "Lock Replies"}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* Options for Regular Users & Guests or Visiting Store Owners */}
            {!isCommentOwner && !isStoreOwnerOrMod && (
              <div className="py-0.5">
                {onReport && (
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      onReport();
                    }}
                    className="w-full text-left rtl:text-right px-3 py-1.5 flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-100 text-slate-800 dark:text-slate-800 hover:text-orange-600 transition-colors cursor-pointer"
                  >
                    <Flag className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    <span>{isRtl ? "إبلاغ" : "Report"}</span>
                  </button>
                )}
              </div>
            )}

            {/* Common Option: Copy Link */}
            <div className="py-0.5">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  handleCopy();
                }}
                className="w-full text-left rtl:text-right px-3 py-1.5 flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-100 text-slate-800 dark:text-slate-800 hover:text-indigo-600 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> : <Copy className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                <span>{copied ? (isRtl ? "تم النسخ!" : "Copied!") : (isRtl ? "نسخ الرابط" : "Copy Link")}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ReviewImageLightboxModal({
  images,
  initialIndex = 0,
  onClose,
  isRtl
}: {
  images: string[];
  initialIndex?: number;
  onClose: () => void;
  isRtl?: boolean;
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  if (!images || images.length === 0) return null;

  const currentImage = images[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4" onClick={onClose}>
        <div className="relative max-w-4xl max-h-[85vh] w-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute -top-12 right-0 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-20"
            title={isRtl ? "إغلاق" : "Close"}
          >
            <X className="w-6 h-6" />
          </button>

          {/* Counter Badge */}
          {images.length > 1 && (
            <div className="absolute -top-12 left-0 bg-slate-900/80 border border-slate-700 text-white font-mono text-xs font-bold px-3 py-1 rounded-full z-20">
              {currentIndex + 1} / {images.length}
            </div>
          )}

          {/* Previous Button */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              className="absolute -left-12 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-20"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Active Image */}
          <div className="relative overflow-hidden rounded-2xl max-h-[80vh]">
            <motion.img
              key={currentImage}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              src={currentImage}
              alt="Review attachment fullscreen"
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            />
          </div>

          {/* Next Button */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={handleNext}
              className="absolute -right-12 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-20"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>
    </AnimatePresence>
  );
}

// Role helper type & badge logic
export type CommentRole =
  | "Guest"
  | "Shopper"
  | "Merchant"
  | "Store Admin"
  | "Moderator";

export function getResolvedRole(
  rawRole?: string,
  authorName?: string,
  isReply?: boolean,
  storeName?: string
): CommentRole {
  const roleLower = (rawRole || "").toLowerCase().trim();
  const authorLower = (authorName || "").toLowerCase().trim();
  const storeLower = (storeName || "").toLowerCase().trim();

  // 1. Guest check
  if (roleLower === "guest" || (authorLower.includes("guest") && !roleLower.includes("admin") && !roleLower.includes("merchant"))) {
    return "Guest";
  }

  // 2. Is this author the owner/admin of THIS current store page? (Takes top priority over generic merchant)
  const isCurrentStoreOwnerOrAdmin =
    roleLower === "store admin" ||
    roleLower.includes("إدارة") ||
    (Boolean(storeLower) &&
      Boolean(authorLower) &&
      (authorLower === storeLower ||
        authorLower.includes(storeLower) ||
        storeLower.includes(authorLower) ||
        (authorLower.includes("support") && authorLower.includes(storeLower))));

  if (isCurrentStoreOwnerOrAdmin) {
    return "Store Admin";
  }

  if (
    roleLower === "shopper" ||
    roleLower === "shoper" ||
    roleLower === "verified buyer" ||
    roleLower === "buyer" ||
    roleLower === "verified" ||
    roleLower.includes("مؤكد") ||
    roleLower.includes("مشتري") ||
    roleLower.includes("متسوق")
  ) {
    return "Shopper";
  }

  if (roleLower === "merchant" || roleLower === "owner" || roleLower === "seller" || roleLower.includes("تاجر")) {
    return "Merchant";
  }

  if (roleLower === "moderator" || roleLower === "mod" || roleLower.includes("مشرف")) {
    return "Moderator";
  }

  const isMerchantOrStoreOwner =
    authorLower.includes("admin") ||
    authorLower.includes("support") ||
    authorLower.includes("owner") ||
    authorLower.includes("merchant") ||
    authorLower.includes("seller") ||
    authorLower.includes("vendeur") ||
    authorLower.includes("propriétaire") ||
    authorLower.includes("proprietaire");

  if (isMerchantOrStoreOwner) {
    return "Merchant";
  }

  return "Shopper";
}

export const USER_AVATAR_POOL = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1548142813-c348350df52b?w=150&auto=format&fit=crop&q=80"
];

export function hashStringToNumber(str: string): number {
  let hash = 0;
  if (!str || str.length === 0) return 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

export function UserAvatar({
  avatar,
  avatarBg,
  author,
  role,
  badge,
  storeLogo,
  storeName,
  size = "md",
  className = ""
}: {
  avatar?: string;
  avatarBg?: string;
  author?: string;
  role?: string;
  badge?: string;
  storeLogo?: string;
  storeName?: string;
  size?: "md" | "sm";
  className?: string;
}) {
  const [imgError, setImgError] = useState(false);

  const resolvedRole = getResolvedRole(role || badge, author, false, storeName);
  const isStoreOrAdmin =
    resolvedRole === "Store Admin" ||
    (Boolean(storeName) && (author || "").toLowerCase().trim() === storeName!.toLowerCase().trim()) ||
    (Boolean(storeName) && (author || "").toLowerCase().includes(storeName!.toLowerCase()));

  const defaultStoreLogo =
    storeLogo || "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=150&auto=format&fit=crop&q=80";

  const isExplicitImageUrl =
    avatar &&
    (avatar.startsWith("http://") ||
      avatar.startsWith("https://") ||
      avatar.startsWith("data:image/") ||
      avatar.startsWith("/")) &&
    avatar !== "/guest_avatar.jpg" &&
    avatar !== "👤";

  const isGuest =
    resolvedRole === "Guest" ||
    (role || "").toLowerCase().includes("guest") ||
    (badge || "").toLowerCase().includes("guest") ||
    (author || "").toLowerCase().includes("guest");

  let resolvedAvatarUrl: string;

  if (isExplicitImageUrl) {
    resolvedAvatarUrl = avatar!;
  } else if (isGuest) {
    resolvedAvatarUrl = guestAvatarImg;
  } else if (isStoreOrAdmin) {
    resolvedAvatarUrl = defaultStoreLogo;
  } else {
    const authorLower = (author || "").toLowerCase().trim();
    if (authorLower.includes("fatima")) {
      resolvedAvatarUrl = USER_AVATAR_POOL[0];
    } else if (authorLower.includes("omar")) {
      resolvedAvatarUrl = USER_AVATAR_POOL[1];
    } else if (authorLower.includes("sarah") || authorLower.includes("sara")) {
      resolvedAvatarUrl = USER_AVATAR_POOL[2];
    } else if (authorLower.includes("karim")) {
      resolvedAvatarUrl = USER_AVATAR_POOL[3];
    } else if (authorLower.includes("amine") || authorLower.includes("alex")) {
      resolvedAvatarUrl = USER_AVATAR_POOL[4];
    } else {
      const idx = hashStringToNumber(author || "Shopper") % USER_AVATAR_POOL.length;
      resolvedAvatarUrl = USER_AVATAR_POOL[idx];
    }
  }

  const fallbackUiAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    author || "User"
  )}&background=6366f1&color=fff&size=128`;

  const displayAvatarUrl = imgError ? fallbackUiAvatar : resolvedAvatarUrl;

  const sizeClass = size === "sm" ? "w-7.5 h-7.5 sm:w-8 sm:h-8" : "w-8.5 h-8.5 sm:w-9 sm:h-9";

  return (
    <div
      className={`rounded-full flex items-center justify-center shrink-0 overflow-hidden border border-slate-200/80 dark:border-slate-700/60 shadow-2xs ${sizeClass} ${className}`}
    >
      <img
        src={displayAvatarUrl}
        alt={author || "User Avatar"}
        className="w-full h-full object-cover rounded-full"
        onError={() => {
          if (!imgError) setImgError(true);
        }}
      />
    </div>
  );
}

export function RoleBadge({
  role,
  badge,
  author,
  storeName,
  isRtl,
  isReply
}: {
  role?: string;
  badge?: string;
  author?: string;
  storeName?: string;
  isRtl?: boolean;
  isReply?: boolean;
}) {
  const resolvedRole = getResolvedRole(role || badge, author, isReply, storeName);

  const roleConfig: Record<
    string,
    { en: string; ar: string; className: string; icon: React.ReactNode }
  > = {
    Guest: {
      en: "Guest",
      ar: "زائر",
      className:
        "bg-slate-100 text-slate-700 dark:bg-slate-200 dark:text-slate-800 border-slate-200/80 font-bold",
      icon: <User className="w-2.5 h-2.5 text-slate-700 stroke-[2.5]" />
    },
    Shopper: {
      en: "Shopper",
      ar: "متسوق",
      className:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-100/90 dark:text-emerald-700 border-emerald-200/60 font-bold",
      icon: <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-700 stroke-[2.5]" />
    },
    Merchant: {
      en: "Merchant",
      ar: "تاجر",
      className:
        "bg-purple-50 text-purple-600 dark:bg-purple-100/90 dark:text-purple-700 border-purple-200/60 font-bold",
      icon: <Sparkles className="w-2.5 h-2.5 text-purple-600 dark:text-purple-700 stroke-[2.5]" />
    },
    "Store Admin": {
      en: "Store Admin",
      ar: "إدارة المتجر",
      className:
        "bg-indigo-50 text-indigo-600 dark:bg-indigo-100/90 dark:text-indigo-700 border-indigo-200/60 font-bold",
      icon: <ShieldCheck className="w-2.5 h-2.5 text-indigo-600 dark:text-indigo-700 stroke-[2.5]" />
    },
    Moderator: {
      en: "Moderator",
      ar: "مشرف",
      className:
        "bg-amber-50 text-amber-600 dark:bg-amber-100/90 dark:text-amber-700 border-amber-200/60 font-bold",
      icon: <Shield className="w-2.5 h-2.5 text-amber-600 dark:text-amber-700 stroke-[2.5]" />
    }
  };

  if (resolvedRole === "Guest") {
    return null;
  }

  const config = roleConfig[resolvedRole] || roleConfig["Shopper"];

  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] sm:text-[10.5px] font-bold tracking-tight px-2.5 py-0.5 rounded-full border border-transparent shadow-2xs ${config.className}`}
    >
      <span>{isRtl ? config.ar : config.en}</span>
    </span>
  );
}

// Recursive Single Reply Component (supports endless nested replies & Facebook-style view X replies)
function SingleReply({
  reply,
  storeLogo,
  storeName,
  activeThemeColor,
  isRtl,
  replyingToId,
  setReplyingToId,
  replyText,
  setReplyText,
  handleSendReply,
  onToggleReplyLike,
  onToggleReplyLove,
  onToggleReplyHaha,
  editingId,
  setEditingId,
  editText,
  setEditText,
  handleSaveEdit,
  setCustomizingTarget,
  setReportingTarget,
  setDeletingTarget,
  onToggleHide,
  onTogglePin,
  onToggleLock,
  setLightboxState,
  currentStoreId,
  myStoreId,
  currentUserId,
  currentUserName,
  currentUserRole,
  currentUserIp,
  depth = 1
}: {
  key?: string;
  reply: ReviewReply;
  storeLogo?: string;
  storeName?: string;
  activeThemeColor?: string;
  isRtl: boolean;
  replyingToId: string | null;
  setReplyingToId: (id: string | null) => void;
  replyText: string;
  setReplyText: (text: string) => void;
  handleSendReply: (targetId: string, images?: string[]) => void;
  onToggleReplyLike?: (rootId: string, replyId: string) => void;
  onToggleReplyLove?: (rootId: string, replyId: string) => void;
  onToggleReplyHaha?: (rootId: string, replyId: string) => void;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  editText: string;
  setEditText: (text: string) => void;
  handleSaveEdit: (id: string, text: string) => void;
  setCustomizingTarget: (item: any) => void;
  setReportingTarget: (item: any) => void;
  setDeletingTarget: (item: any) => void;
  onToggleHide?: (id: string) => void;
  onTogglePin?: (id: string) => void;
  onToggleLock?: (id: string) => void;
  setLightboxState?: (state: { images: string[]; index: number } | null) => void;
  currentStoreId?: string;
  myStoreId?: string;
  currentUserId?: string;
  currentUserName?: string;
  currentUserRole?: string;
  currentUserIp?: string;
  depth?: number;
}) {
  const isReplying = replyingToId === reply.id;
  const isEditing = editingId === reply.id;
  const isNew = reply.isNew || reply.isHighlighted;
  const isDirectlyRepliedTo = isReplying;
  const [showAllReplies, setShowAllReplies] = useState(false);
  const [isThreadExpanded, setIsThreadExpanded] = useState(true);
  const isDeepLevel = depth >= 3;
  const [isDeepExpanded, setIsDeepExpanded] = useState(!isDeepLevel);
  const [replyImages, setReplyImages] = useState<string[]>([]);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isGuestUser =
    !currentUserRole ||
    currentUserRole.toLowerCase().includes("guest") ||
    (currentUserName || "").toLowerCase().includes("guest");

  const handleSendNestedReply = async () => {
    if ((!replyText.trim() && replyImages.length === 0) || isSubmittingReply || isUploadingPhoto) return;
    setIsSubmittingReply(true);
    try {
      const imagesToSend = isGuestUser ? [] : replyImages;
      await handleSendReply(reply.id, imagesToSend);
      setReplyText("");
      setReplyImages([]);
      setReplyingToId(null);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const { isCommentOwner, isStoreOwnerOrMod } = evaluateCommentPermissions({
    commentAuthor: reply.author,
    commentRole: reply.role,
    commentBadge: reply.badge,
    commentIp: reply.ip,
    currentUserName,
    currentUserId,
    currentUserRole,
    currentUserIp,
    currentStoreId,
    myStoreId,
    storeName,
    isNew: reply.isNew
  });

  const childReplies = reply.replies || [];
  const hasMoreThanTwo = childReplies.length > 2;
  const visibleChildReplies = hasMoreThanTwo && !showAllReplies ? childReplies.slice(0, 2) : childReplies;

  const likesCount = reply.likes || (reply.liked ? 1 : 0);
  const lovesCount = typeof reply.loves === "number" ? reply.loves : (reply.loved ? 1 : 0);
  const hahasCount = typeof reply.hahas === "number" ? reply.hahas : (reply.hahad ? 1 : 0);

  return (
    <div className="threaded-comment-thread-view space-y-2">
      <div
        className={`p-3 sm:p-3.5 rounded-xl border text-xs space-y-2 transition-all duration-300 shadow-2xs ${
          isNew
            ? "bg-indigo-50/90 border-indigo-400 ring-2 ring-indigo-500/30 shadow-xs"
            : isDirectlyRepliedTo
            ? "bg-amber-50/90 border-amber-400 ring-2 ring-amber-400/30 shadow-xs"
            : "bg-[#f1f5f9]/90 dark:bg-slate-100 border-slate-200/90 dark:border-slate-300"
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <UserAvatar
              avatar={reply.avatar}
              avatarBg={reply.avatarBg}
              author={reply.author}
              role={reply.role}
              badge={reply.badge}
              storeLogo={storeLogo}
              storeName={storeName}
              size="sm"
            />
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-xs sm:text-[13px] text-slate-900 dark:text-slate-900">
                  {reply.author}
                </span>
                <RoleBadge
                  role={reply.role}
                  badge={reply.badge}
                  author={reply.author}
                  storeName={storeName}
                  isRtl={isRtl}
                  isReply={true}
                />
                {/* Purchased Variant Badge next to blue circle badge */}
                {(reply.purchasedVariant || (reply as any).variant) && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 dark:text-slate-500 bg-transparent px-0 py-0 whitespace-nowrap">
                    <CheckCircle2 className="w-3 h-3 text-blue-500 shrink-0" />
                    <span>{isRtl ? "المقتنى: " : "Purchased: "}{reply.purchasedVariant || (reply as any).variant}</span>
                  </span>
                )}
                {isNew && (
                  <span className="text-[8.5px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider bg-indigo-600 text-white animate-pulse">
                    {isRtl ? "جديد" : "NEW"}
                  </span>
                )}
                {isDirectlyRepliedTo && !isNew && (
                  <span className="text-[8.5px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider bg-amber-500 text-white">
                    {isRtl ? "جاري الرد" : "Replying"}
                  </span>
                )}
                {reply.isReported && (
                  <span className="text-[8px] font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300 flex items-center gap-0.5">
                    <Flag className="w-2 h-2" />
                    <span>{isRtl ? "قيد المراجعة" : "Under Review"}</span>
                  </span>
                )}
                {reply.isEdited && (
                  <span className="text-[8.5px] text-slate-400 italic">
                    {isRtl ? "(معدّل)" : "(edited)"}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10.5px] text-slate-400 font-normal">{reply.time}</span>

            <ItemActionMenu
              isRtl={isRtl}
              isCommentOwner={isCommentOwner}
              isStoreOwnerOrMod={isStoreOwnerOrMod}
              isHidden={reply.isHidden}
              isPinned={reply.isPinned}
              isLocked={reply.isLocked}
              onEdit={() => {
                setEditingId(reply.id);
                setEditText(reply.text);
              }}
              onCustomize={() => setCustomizingTarget(reply)}
              onReport={() => setReportingTarget(reply)}
              onDelete={() => setDeletingTarget(reply)}
              onHide={onToggleHide ? () => onToggleHide(reply.id) : undefined}
              onPin={onTogglePin ? () => onTogglePin(reply.id) : undefined}
              onLock={onToggleLock ? () => onToggleLock(reply.id) : undefined}
            />
          </div>
        </div>

        {/* Hidden Notice for reply */}
        {reply.isHidden && (
          <div className="text-[10px] italic font-medium px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50 w-fit">
            {isStoreOwnerOrMod
              ? (isRtl ? "[تعليق مخفي - يظهر للمشرفين فقط]" : "[Hidden reply - visible to moderators only]")
              : (isRtl ? "[تم إخفاء التعليق من قبل المشرف]" : "[Reply hidden by moderator]")}
          </div>
        )}

        {isEditing ? (
          <div className="space-y-1.5 py-1">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSaveEdit(reply.id, editText);
                }
              }}
              className="w-full text-xs p-2 rounded-lg border border-indigo-400 bg-white text-slate-900 outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
              rows={2}
            />
            <div className="flex items-center justify-end gap-1.5">
              <button
                type="button"
                onClick={() => setEditingId(null)}
                className="px-2 py-1 rounded-md text-[10px] font-medium text-slate-600 hover:bg-slate-200 cursor-pointer"
              >
                {isRtl ? "إلغاء" : "Cancel"}
              </button>
              <button
                type="button"
                onClick={() => handleSaveEdit(reply.id, editText)}
                className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer"
              >
                {isRtl ? "حفظ" : "Save"}
              </button>
            </div>
          </div>
        ) : (
          (!reply.isHidden || isStoreOwnerOrMod) && (
            <p className="text-xs sm:text-[12.5px] text-slate-800 dark:text-slate-900 font-normal leading-relaxed font-sans">{reply.text}</p>
          )
        )}

        {/* Reply Attachment Thumbnails (Up to 2) */}
        {reply.images && reply.images.length > 0 && (!reply.isHidden || isStoreOwnerOrMod) && (
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            {reply.images.slice(0, 2).map((imgUrl, idx) => (
              <button
                key={`reply-img-${reply.id}-${idx}`}
                type="button"
                onClick={() => setLightboxState && setLightboxState({ images: reply.images!, index: idx })}
                className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-300 shadow-2xs group cursor-pointer hover:scale-105 transition-transform"
              >
                <img src={imgUrl} alt="Reply attachment" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Action bar for reply: Like, Love, Haha, Reply */}
        <div className="flex items-center gap-3.5 pt-1.5 text-xs font-medium text-slate-600 dark:text-slate-600 select-none border-t border-slate-200/70">
          <motion.button
            type="button"
            whileTap={{ scale: 0.86 }}
            onClick={() => onToggleReplyLike && onToggleReplyLike(reply.parentId, reply.id)}
            className={`relative flex items-center gap-1 hover:text-indigo-600 transition-colors cursor-pointer ${
              reply.liked || likesCount > 0 ? "text-indigo-600 font-semibold" : ""
            }`}
          >
            {reply.liked && (
              <motion.span
                key="reply-ripple-like"
                initial={{ scale: 0.4, opacity: 0.8 }}
                animate={{ scale: 1.8, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="absolute -inset-1 rounded-full bg-indigo-500/20 pointer-events-none"
              />
            )}
            <motion.span
              animate={reply.liked ? { scale: [1, 1.45, 1] } : { scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="inline-flex items-center justify-center"
            >
              <ThumbsUp className={`w-3 h-3 ${reply.liked ? "fill-current" : ""}`} />
            </motion.span>
            <span>{reply.liked ? (isRtl ? "تم الإعجاب" : "Liked") : (isRtl ? "إعجاب" : "Like")}</span>
            {likesCount > 0 && (
              <span className="font-bold text-indigo-600 dark:text-indigo-600 ml-0.5">
                {likesCount}
              </span>
            )}
          </motion.button>

          <motion.button
            type="button"
            whileTap={{ scale: 0.86 }}
            onClick={() => onToggleReplyLove && onToggleReplyLove(reply.parentId, reply.id)}
            className={`relative flex items-center gap-1 hover:text-rose-500 transition-colors cursor-pointer ${
              reply.loved || lovesCount > 0 ? "text-rose-500 font-semibold" : ""
            }`}
          >
            {reply.loved && (
              <motion.span
                key="reply-ripple-love"
                initial={{ scale: 0.4, opacity: 0.8 }}
                animate={{ scale: 1.8, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="absolute -inset-1 rounded-full bg-rose-500/20 pointer-events-none"
              />
            )}
            <motion.span
              animate={reply.loved ? { scale: [1, 1.45, 1] } : { scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="inline-flex items-center justify-center"
            >
              <Heart className={`w-3 h-3 ${reply.loved ? "fill-current" : ""}`} />
            </motion.span>
            <span>{reply.loved ? (isRtl ? "مفضل" : "Loved") : (isRtl ? "أحببته" : "Love")}</span>
            {lovesCount > 0 && (
              <span className="font-bold text-rose-600 dark:text-rose-600 ml-0.5">
                {lovesCount}
              </span>
            )}
          </motion.button>

          <motion.button
            type="button"
            whileTap={{ scale: 0.86 }}
            onClick={() => onToggleReplyHaha && onToggleReplyHaha(reply.parentId, reply.id)}
            className={`relative flex items-center gap-1 hover:text-amber-500 transition-colors cursor-pointer ${
              reply.hahad || hahasCount > 0 ? "text-amber-500 font-semibold" : ""
            }`}
          >
            {reply.hahad && (
              <motion.span
                key="reply-ripple-haha"
                initial={{ scale: 0.4, opacity: 0.8 }}
                animate={{ scale: 1.8, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="absolute -inset-1 rounded-full bg-amber-500/20 pointer-events-none"
              />
            )}
            <motion.span
              animate={reply.hahad ? { scale: [1, 1.45, 1], rotate: [0, -12, 12, 0] } : { scale: 1, rotate: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="inline-flex items-center justify-center"
            >
              <Laugh className={`w-3 h-3 ${reply.hahad ? "stroke-[2.5]" : ""}`} />
            </motion.span>
            <span>{reply.hahad ? (isRtl ? "مضحك" : "Haha'd") : (isRtl ? "هههه" : "Haha")}</span>
            {hahasCount > 0 && (
              <span className="font-bold text-amber-600 dark:text-amber-600 ml-0.5">
                {hahasCount}
              </span>
            )}
          </motion.button>

          {!reply.isLocked && (
            <button
              type="button"
              onClick={() => {
                setReplyingToId(isReplying ? null : reply.id);
                setReplyText("");
                setReplyImages([]);
              }}
              className="flex items-center gap-1 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-2.5 h-2.5" />
              <span>{isRtl ? "رد" : "Reply"}</span>
            </button>
          )}

          {childReplies.length > 0 && (
            <button
              type="button"
              onClick={() => setIsThreadExpanded((prev) => !prev)}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 font-semibold transition-all cursor-pointer text-[9.5px] select-none ml-auto"
              title={isThreadExpanded ? (isRtl ? "إخفاء الردود" : "Collapse replies") : (isRtl ? "عرض الردود" : "Expand replies")}
            >
              <MessageCircle className="w-2.5 h-2.5 text-indigo-500 shrink-0" />
              <span>
                {isThreadExpanded
                  ? (isRtl ? `إخفاء الردود (${childReplies.length})` : `Hide replies (${childReplies.length})`)
                  : (isRtl ? `عرض الردود (${childReplies.length})` : `View replies (${childReplies.length})`)}
              </span>
              <ChevronDown className={`w-2.5 h-2.5 transition-transform duration-300 ${isThreadExpanded ? "rotate-180" : ""}`} />
            </button>
          )}
        </div>
      </div>

      {/* Reply input for this specific reply */}
      {isReplying && !reply.isLocked && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="pt-1 pl-2 sm:pl-3 space-y-1.5"
        >
          {/* Image Previews for Reply (up to 2) */}
          {(replyImages.length > 0 || isUploadingPhoto) && (
            <div className="flex items-center gap-1.5 flex-wrap">
              {replyImages.map((img, i) => (
                <div key={`reply-upload-img-${i}`} className="relative w-10 h-10 rounded-lg overflow-hidden border border-slate-300 shadow-2xs">
                  <img src={img} alt="preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setReplyImages((prev) => prev.filter((_, idx) => idx !== i))}
                    className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}

              {isUploadingPhoto && (
                <div className="w-10 h-10 rounded-lg border border-indigo-400 bg-indigo-50/90 dark:bg-indigo-900/30 flex flex-col items-center justify-center text-indigo-600 animate-pulse shrink-0">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-[7px] font-extrabold">{isRtl ? "رفع..." : "Loading..."}</span>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-1.5">
            {!isGuestUser ? (
              <>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={async (e) => {
                    const files = Array.from(e.target.files || []) as File[];
                    if (!files.length) return;
                    const remaining = 2 - replyImages.length;
                    if (remaining <= 0) return;
                    const selected = files.slice(0, remaining);
                    setIsUploadingPhoto(true);
                    try {
                      const compressed = await Promise.all(selected.map((file) => compressImage(file)));
                      setReplyImages((prev) => [...prev, ...compressed].slice(0, 2));
                    } catch (err) {
                      console.error("Failed to upload photo", err);
                    } finally {
                      setIsUploadingPhoto(false);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }
                  }}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={replyImages.length >= 2 || isUploadingPhoto || isSubmittingReply}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-300 bg-white hover:bg-slate-100 text-slate-600 cursor-pointer disabled:opacity-40"
                  title={isRtl ? "إضافة صور (أقصى 2)" : "Attach photos (max 2)"}
                >
                  <Camera className="w-3.5 h-3.5 text-indigo-500" />
                </button>
              </>
            ) : (
              <button
                type="button"
                disabled
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed opacity-50"
                title={isRtl ? "رفع الصور غير متاح للزائرين" : "Photo upload disabled for guest buyers"}
              >
                <Camera className="w-3.5 h-3.5 text-slate-400" />
              </button>
            )}
            <input
              type="text"
              value={replyText}
              disabled={isSubmittingReply}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSendNestedReply();
                }
              }}
              placeholder={isRtl ? `رد على ${reply.author}...` : `Reply to ${reply.author}...`}
              className="flex-1 text-[11px] p-1.5 rounded-lg border border-slate-200 dark:border-slate-300 bg-white dark:bg-white text-slate-900 outline-none focus:border-indigo-500 disabled:opacity-50"
            />
            <button
              type="button"
              onClick={handleSendNestedReply}
              disabled={isSubmittingReply || isUploadingPhoto || (!replyText.trim() && replyImages.length === 0)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-[11px] font-bold cursor-pointer hover:bg-slate-800 disabled:opacity-50 shrink-0 flex items-center gap-1"
            >
              {isSubmittingReply ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{isRtl ? "جاري الإرسال..." : "Sending..."}</span>
                </>
              ) : (
                <span>{isRtl ? "إرسال" : "Reply"}</span>
              )}
            </button>
          </div>
        </motion.div>
      )}

      {/* Load More Replies button for deeper threads (depth >= 3) */}
      {childReplies.length > 0 && isThreadExpanded && isDeepLevel && !isDeepExpanded && (
        <div className="pt-0.5">
          <button
            type="button"
            onClick={() => setIsDeepExpanded(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50/90 dark:bg-indigo-100/90 hover:bg-indigo-100 dark:hover:bg-indigo-200 text-indigo-700 dark:text-indigo-950 border border-indigo-200/90 dark:border-indigo-300/90 font-semibold text-[10.5px] shadow-2xs hover:shadow-xs transition-all cursor-pointer select-none active:scale-[0.98]"
          >
            <CornerDownRight className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-700 shrink-0" />
            <span>
              {isRtl
                ? `تحميل المزيد من الردود (${childReplies.length})`
                : `Load More Replies (${childReplies.length})`}
            </span>
          </button>
        </div>
      )}

      {/* Nested child replies */}
      <AnimatePresence>
        {childReplies.length > 0 && isThreadExpanded && isDeepExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
            className={`${
              depth >= 3
                ? "pl-1.5 sm:pl-2 border-l border-indigo-300/80 dark:border-indigo-400/70 space-y-1.5 mt-1.5"
                : "pl-3 sm:pl-4 border-l-2 border-slate-200/80 dark:border-slate-300 space-y-1.5 mt-1.5"
            }`}
          >
            {visibleChildReplies.map((childReply) => (
              <SingleReply
                key={childReply.id}
                reply={childReply}
                storeLogo={storeLogo}
                storeName={storeName}
                activeThemeColor={activeThemeColor}
                isRtl={isRtl}
                replyingToId={replyingToId}
                setReplyingToId={setReplyingToId}
                replyText={replyText}
                setReplyText={setReplyText}
                handleSendReply={handleSendReply}
                onToggleReplyLike={onToggleReplyLike}
                onToggleReplyLove={onToggleReplyLove}
                onToggleReplyHaha={onToggleReplyHaha}
                editingId={editingId}
                setEditingId={setEditingId}
                editText={editText}
                setEditText={setEditText}
                handleSaveEdit={handleSaveEdit}
                setCustomizingTarget={setCustomizingTarget}
                setReportingTarget={setReportingTarget}
                setDeletingTarget={setDeletingTarget}
                onToggleHide={onToggleHide}
                onTogglePin={onTogglePin}
                onToggleLock={onToggleLock}
                setLightboxState={setLightboxState}
                currentStoreId={currentStoreId}
                myStoreId={myStoreId}
                currentUserId={currentUserId}
                currentUserName={currentUserName}
                currentUserRole={currentUserRole}
                depth={depth + 1}
              />
            ))}

            {/* Facebook-style toggle button when > 2 replies */}
            {hasMoreThanTwo && !showAllReplies && (
              <button
                type="button"
                onClick={() => setShowAllReplies(true)}
                className="flex items-center gap-1.5 text-[11px] font-extrabold text-slate-700 dark:text-slate-700 hover:text-indigo-600 dark:hover:text-indigo-600 transition-colors py-0.5 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-200 cursor-pointer select-none"
              >
                <CornerDownRight className="w-3 h-3 text-slate-500 shrink-0" />
                <span>
                  {isRtl
                    ? `عرض بقية الردود (${childReplies.length - 2})`
                    : `View ${childReplies.length - 2} more ${childReplies.length - 2 === 1 ? "reply" : "replies"}`}
                </span>
              </button>
            )}

            {hasMoreThanTwo && showAllReplies && (
              <button
                type="button"
                onClick={() => setShowAllReplies(false)}
                className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 hover:text-slate-800 transition-colors py-0.5 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-200 cursor-pointer select-none"
              >
                <ChevronUp className="w-3 h-3 text-slate-400 shrink-0" />
                <span>{isRtl ? "إخفاء الردود" : "Hide replies"}</span>
              </button>
            )}

            {isDeepLevel && (
              <button
                type="button"
                onClick={() => setIsDeepExpanded(false)}
                className="flex items-center gap-1 text-[10px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors py-0.5 px-2 rounded cursor-pointer select-none"
              >
                <ChevronUp className="w-3 h-3 shrink-0" />
                <span>{isRtl ? "إخفاء الردود العملاقة" : "Collapse deep thread"}</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* Customize Modal */
function CustomizeModal({
  item,
  isRtl,
  onClose,
  onSave
}: {
  item: any;
  isRtl: boolean;
  onClose: () => void;
  onSave: (updates: { author: string; badge: string; avatarBg: string; emoji: string }) => void;
}) {
  const [author, setAuthor] = useState(item.author || "");
  const [badge, setBadge] = useState(item.badge || "Store Admin");
  const [avatarBg, setAvatarBg] = useState(
    item.avatarBg || "bg-indigo-100 text-indigo-800 border-indigo-300"
  );
  const [emoji, setEmoji] = useState(item.emoji || "⭐");

  const BADGE_PRESETS = [
    { en: "Guest", ar: "زائر" },
    { en: "Shopper", ar: "متسوق" },
    { en: "Merchant", ar: "تاجر" },
    { en: "Store Admin", ar: "إدارة المتجر" },
    { en: "Moderator", ar: "مشرف" }
  ];

  const COLOR_OPTIONS = [
    { name: "Amber", bg: "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200" },
    { name: "Indigo", bg: "bg-indigo-100 text-indigo-900 border-indigo-300 dark:bg-indigo-950 dark:text-indigo-200" },
    { name: "Emerald", bg: "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200" },
    { name: "Rose", bg: "bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950 dark:text-rose-200" },
    { name: "Slate", bg: "bg-slate-100 text-slate-900 border-slate-300 dark:bg-slate-800 dark:text-slate-100" },
    { name: "Violet", bg: "bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950 dark:text-purple-200" }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4"
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-amber-500" />
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              {isRtl ? "تخصيص بيانات التعليق" : "Customize Comment"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          {/* Author Name */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
              {isRtl ? "اسم صاحب التعليق:" : "Author Name:"}
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium outline-none focus:border-indigo-500"
            />
          </div>

          {/* Badge Label */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
              {isRtl ? "الشارة / الصفة:" : "Badge Label:"}
            </label>
            <input
              type="text"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium outline-none focus:border-indigo-500"
            />
            <div className="flex flex-wrap gap-1.5 pt-1">
              {BADGE_PRESETS.map((preset) => (
                <button
                  key={preset.en}
                  type="button"
                  onClick={() => setBadge(isRtl ? preset.ar : preset.en)}
                  className="px-2.5 py-0.5 rounded-full text-[8.5px] font-extrabold tracking-wider bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 cursor-pointer transition-all"
                >
                  {isRtl ? preset.ar : preset.en}
                </button>
              ))}
            </div>
          </div>

          {/* Avatar Background */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
              {isRtl ? "لون رمز الشعار:" : "Avatar Theme Color:"}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setAvatarBg(c.bg)}
                  className={`p-2 rounded-xl text-center text-[10px] font-bold border transition-all cursor-pointer ${c.bg} ${
                    avatarBg === c.bg ? "ring-2 ring-indigo-500 font-extrabold" : "opacity-80 hover:opacity-100"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            {isRtl ? "إلغاء" : "Cancel"}
          </button>
          <button
            type="button"
            onClick={() => {
              onSave({ author, badge, avatarBg, emoji });
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl text-xs font-extrabold bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-md"
          >
            {isRtl ? "حفظ التغييرات" : "Save Customization"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* Report Modal */
function ReportModal({
  item,
  isRtl,
  onClose,
  onSubmit
}: {
  item: any;
  isRtl: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}) {
  const [reason, setReason] = useState("spam");
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const REASONS = [
    { id: "spam", en: "Spam or advertisement", ar: "محتوى عشوائي أو إعلانات" },
    { id: "inappropriate", en: "Inappropriate or offensive language", ar: "ألفاظ غير لائقة أو مسيئة" },
    { id: "misleading", en: "False or misleading information", ar: "معلومات كاذبة أو مضللة" },
    { id: "harassment", en: "Harassment or hate speech", ar: "مضايقة أو خطاب كراهية" },
    { id: "other", en: "Other issue", ar: "سبب آخر" }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4"
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-orange-500">
            <Flag className="w-4 h-4 fill-current" />
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              {isRtl ? "الإبلاغ عن تعليق" : "Report Comment"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-6 space-y-2">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              {isRtl ? "تم إرسال البلاغ بنجاح" : "Report Submitted"}
            </h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              {isRtl
                ? "شكراً لك. سيقوم فريق الإدارة بمراجعة هذا التعليق واتخاذ الإجراء المناسب."
                : "Thank you. Our moderation team will review this comment shortly."}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 cursor-pointer"
            >
              {isRtl ? "إغلاق" : "Close"}
            </button>
          </div>
        ) : (
          <div className="space-y-3 text-xs">
            <p className="text-slate-600 dark:text-slate-300 font-medium">
              {isRtl ? "يرجى اختيار سبب الإبلاغ عن هذا التعليق:" : "Please select a reason for reporting this comment:"}
            </p>

            <div className="space-y-2">
              {REASONS.map((r) => (
                <label
                  key={r.id}
                  onClick={() => setReason(r.id)}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer ${
                    reason === r.id
                      ? "border-orange-500 bg-orange-50/50 dark:bg-orange-950/30 text-slate-900 dark:text-white font-bold"
                      : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="reportReason"
                    checked={reason === r.id}
                    onChange={() => setReason(r.id)}
                    className="text-orange-500 focus:ring-orange-500"
                  />
                  <span>{isRtl ? r.ar : r.en}</span>
                </label>
              ))}
            </div>

            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder={isRtl ? "تفاصيل إضافية (اختياري)..." : "Additional details (optional)..."}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-orange-500"
              rows={2}
            />

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                {isRtl ? "إلغاء" : "Cancel"}
              </button>
              <button
                type="button"
                onClick={() => {
                  const selectedReasonObj = REASONS.find((r) => r.id === reason);
                  const fullReason = details
                    ? `${selectedReasonObj?.en || reason}: ${details}`
                    : selectedReasonObj?.en || reason;
                  onSubmit(fullReason);
                  setSubmitted(true);
                }}
                className="px-4 py-1.5 rounded-xl text-xs font-extrabold bg-orange-600 hover:bg-orange-700 text-white cursor-pointer shadow-md"
              >
                {isRtl ? "تقديم البلاغ" : "Submit Report"}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

/* Delete Confirm Modal */
function DeleteConfirmModal({
  isRtl,
  onClose,
  onConfirm
}: {
  isRtl: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-center"
      >
        <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
          <Trash2 className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
            {isRtl ? "حذف هذا التعليق؟" : "Delete this comment?"}
          </h3>
          <p className="text-xs text-slate-500">
            {isRtl ? "سيتم إزالة هذا التعليق وجميع ردوده بشكل نهائي." : "This will permanently remove the comment and its nested replies."}
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 cursor-pointer"
          >
            {isRtl ? "إلغاء" : "Cancel"}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 py-2 rounded-xl text-xs font-extrabold bg-rose-600 hover:bg-rose-700 text-white cursor-pointer shadow-md"
          >
            {isRtl ? "تأكيد الحذف" : "Yes, Delete"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function TopLevelReviewItem({
  item,
  storeLogo,
  storeName,
  activeThemeColor,
  isRtl,
  onToggleLike,
  onToggleLove,
  onToggleHaha,
  replyingToId,
  setReplyingToId,
  replyText,
  setReplyText,
  handleSendReply,
  onToggleReplyLike,
  onToggleReplyLove,
  onToggleReplyHaha,
  editingId,
  setEditingId,
  editText,
  setEditText,
  handleSaveEdit,
  setCustomizingTarget,
  setReportingTarget,
  setDeletingTarget,
  onToggleHide,
  onTogglePin,
  onToggleLock,
  setLightboxState,
  currentStoreId,
  myStoreId,
  currentUserId,
  currentUserName,
  currentUserRole,
  currentUserIp
}: {
  key?: string;
  item: ReviewItem;
  storeLogo?: string;
  storeName?: string;
  activeThemeColor?: string;
  isRtl: boolean;
  onToggleLike: (id: string) => void;
  onToggleLove: (id: string) => void;
  onToggleHaha?: (id: string) => void;
  replyingToId: string | null;
  setReplyingToId: (id: string | null) => void;
  replyText: string;
  setReplyText: (text: string) => void;
  handleSendReply: (targetId: string, images?: string[]) => void;
  onToggleReplyLike?: (rootId: string, replyId: string) => void;
  onToggleReplyLove?: (rootId: string, replyId: string) => void;
  onToggleReplyHaha?: (rootId: string, replyId: string) => void;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  editText: string;
  setEditText: (text: string) => void;
  handleSaveEdit: (id: string, text: string) => void;
  setCustomizingTarget: (item: any) => void;
  setReportingTarget: (item: any) => void;
  setDeletingTarget: (item: any) => void;
  onToggleHide?: (id: string) => void;
  onTogglePin?: (id: string) => void;
  onToggleLock?: (id: string) => void;
  setLightboxState?: (state: { images: string[]; index: number } | null) => void;
  currentStoreId?: string;
  myStoreId?: string;
  currentUserId?: string;
  currentUserName?: string;
  currentUserRole?: string;
  currentUserIp?: string;
}) {
  const [showAllReplies, setShowAllReplies] = useState(false);
  const [isThreadExpanded, setIsThreadExpanded] = useState(true);
  const [topReplyImages, setTopReplyImages] = useState<string[]>([]);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const topFileInputRef = useRef<HTMLInputElement>(null);

  const { isCommentOwner, isStoreOwnerOrMod } = evaluateCommentPermissions({
    commentAuthor: item.author,
    commentRole: item.role,
    commentBadge: item.badge,
    commentIp: item.ip,
    currentUserName,
    currentUserId,
    currentUserRole,
    currentUserIp,
    currentStoreId,
    myStoreId,
    storeName,
    isNew: item.isNew
  });

  const replies = item.replies || [];
  const hasMoreThanTwo = replies.length > 2;
  const visibleReplies = hasMoreThanTwo && !showAllReplies ? replies.slice(0, 2) : replies;
  const isEditing = editingId === item.id;
  const isNew = item.isNew || item.isHighlighted;
  const isDirectlyRepliedTo = replyingToId === item.id;
  const likesCount = item.likes || (item.liked ? 1 : 0);
  const lovesCount = typeof item.loves === "number" ? item.loves : (item.loved ? 1 : 0);
  const hahasCount = typeof item.hahas === "number" ? item.hahas : (item.hahad ? 1 : 0);

  const isGuestUser =
    !currentUserRole ||
    currentUserRole.toLowerCase().includes("guest") ||
    (currentUserName || "").toLowerCase().includes("guest");

  const handleSendTopReply = async () => {
    if ((!replyText.trim() && topReplyImages.length === 0) || isSubmittingReply || isUploadingPhoto) return;
    setIsSubmittingReply(true);
    try {
      const imagesToSend = isGuestUser ? [] : topReplyImages;
      await handleSendReply(item.id, imagesToSend);
      setReplyText("");
      setTopReplyImages([]);
      setReplyingToId(null);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`threaded-comment-thread-view p-4 sm:p-5 rounded-2xl border transition-all duration-300 space-y-3 ${
        item.isPinned
          ? "bg-purple-50/70 border-purple-300 ring-2 ring-purple-400/20 shadow-md"
          : isNew
          ? "bg-indigo-50/90 border-indigo-400 ring-2 ring-indigo-500/30 shadow-md"
          : isDirectlyRepliedTo
          ? "bg-amber-50/90 border-amber-400 ring-2 ring-amber-400/30 shadow-sm"
          : "bg-[#f8fafc] dark:bg-white border-slate-200/90 dark:border-slate-300 shadow-2xs"
      }`}
    >
      {/* Pinned Badge Banner */}
      {item.isPinned && (
        <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-purple-700 bg-purple-100 border border-purple-200 px-2.5 py-0.5 rounded-full w-fit">
          <Pin className="w-3 h-3 text-purple-600 fill-current" />
          <span>{isRtl ? "مراجعة مثبّتة في الأعلى" : "Pinned Review"}</span>
        </div>
      )}

      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <UserAvatar
            avatar={item.avatar}
            avatarBg={item.avatarBg}
            author={item.author}
            role={item.role}
            badge={item.badge}
            storeLogo={storeLogo}
            storeName={storeName}
            size="md"
          />
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-xs sm:text-[13.5px] text-slate-900 dark:text-slate-900">
                {item.author}
              </span>
              <RoleBadge
                role={item.role}
                badge={item.badge}
                author={item.author}
                storeName={storeName}
                isRtl={isRtl}
                isReply={false}
              />
              {/* Purchased Variant Badge (transparent background beside blue circle/badge) */}
              {(item.purchasedVariant || (item as any).variant) && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-500 bg-transparent px-0 py-0 whitespace-nowrap">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>{isRtl ? "المقتنى: " : "Purchased: "}{item.purchasedVariant || (item as any).variant}</span>
                </span>
              )}
              {isNew && (
                <span className="text-[8.5px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-600 text-white animate-pulse">
                  {isRtl ? "جديد" : "NEW"}
                </span>
              )}
              {isDirectlyRepliedTo && !isNew && (
                <span className="text-[8.5px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500 text-white">
                  {isRtl ? "جاري الرد..." : "Replying..."}
                </span>
              )}
              {item.isReported && (
                <span className="text-[8px] font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300 flex items-center gap-0.5">
                  <Flag className="w-2 h-2" />
                  <span>{isRtl ? "قيد المراجعة" : "Under Review"}</span>
                </span>
              )}
              {item.isEdited && (
                <span className="text-[8.5px] text-slate-400 italic">
                  {isRtl ? "(معدّل)" : "(edited)"}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center text-amber-400">
                {Array.from({ length: item.rating || 5 }).map((_, i) => (
                  <Star key={`star-${item.id}-${i}`} className="w-2.5 h-2.5 fill-current" />
                ))}
              </div>
              <span className="text-[9.5px] text-slate-500 font-normal">
                {item.time}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {item.emoji && (
            <span className="p-1 rounded-xl bg-slate-100 dark:bg-slate-200/80 border border-slate-200 dark:border-slate-300 flex items-center justify-center">
              <LineArtFaceIcon emoji={item.emoji} rating={item.rating} className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-800 dark:text-slate-800" />
            </span>
          )}

          <ItemActionMenu
            isRtl={isRtl}
            isCommentOwner={isCommentOwner}
            isStoreOwnerOrMod={isStoreOwnerOrMod}
            isHidden={item.isHidden}
            isPinned={item.isPinned}
            isLocked={item.isLocked}
            onEdit={() => {
              setEditingId(item.id);
              setEditText(item.text);
            }}
            onCustomize={() => setCustomizingTarget(item)}
            onReport={() => setReportingTarget(item)}
            onDelete={() => setDeletingTarget(item)}
            onHide={onToggleHide ? () => onToggleHide(item.id) : undefined}
            onPin={onTogglePin ? () => onTogglePin(item.id) : undefined}
            onLock={onToggleLock ? () => onToggleLock(item.id) : undefined}
          />
        </div>
      </div>

      {/* Hidden Banner */}
      {item.isHidden && (
        <div className="text-[11px] italic font-medium px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50 w-fit">
          {isStoreOwnerOrMod
            ? (isRtl ? "[تعليق مخفي - يظهر للمشرفين فقط]" : "[Hidden review - visible to moderators only]")
            : (isRtl ? "[تم إخفاء التعليق من قبل المشرف]" : "[Review hidden by moderator]")}
        </div>
      )}

      {/* Review content text */}
      {isEditing ? (
        <div className="space-y-1.5 py-1">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSaveEdit(item.id, editText);
              }
            }}
            className="w-full text-xs p-2 rounded-lg border border-indigo-400 bg-white text-slate-900 outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
            rows={2}
          />
          <div className="flex items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={() => setEditingId(null)}
              className="px-2.5 py-1 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-200 cursor-pointer"
            >
              {isRtl ? "إلغاء" : "Cancel"}
            </button>
            <button
              type="button"
              onClick={() => handleSaveEdit(item.id, editText)}
              className="px-3 py-1 rounded-md text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer"
            >
              {isRtl ? "حفظ التغييرات" : "Save Changes"}
            </button>
          </div>
        </div>
      ) : (
        (!item.isHidden || isStoreOwnerOrMod) && (
          <p className="text-xs sm:text-[12.5px] text-slate-700 dark:text-slate-800 font-normal sm:font-medium leading-relaxed font-sans">
            {item.text}
          </p>
        )
      )}

      {/* Attached Images Gallery (Up to 5) */}
      {item.images && item.images.length > 0 && (!item.isHidden || isStoreOwnerOrMod) && (
        <div className="flex items-center gap-2 flex-wrap pt-1">
          {item.images.slice(0, 5).map((imgUrl, idx) => (
            <button
              key={`rev-img-${item.id}-${idx}`}
              type="button"
              onClick={() => setLightboxState && setLightboxState({ images: item.images!, index: idx })}
              className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-300 shadow-2xs group cursor-pointer hover:scale-105 transition-transform"
            >
              <img src={imgUrl} alt={`Review photo ${idx + 1}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Interactive buttons */}
      <div className="flex items-center gap-3 text-[11px] font-medium text-slate-600 dark:text-slate-600 select-none pt-0.5 border-t border-slate-200/80 dark:border-slate-200">
        <motion.button
          type="button"
          whileTap={{ scale: 0.86 }}
          onClick={() => onToggleLike(item.id)}
          className={`relative flex items-center gap-1 hover:text-indigo-600 transition-colors cursor-pointer ${
            item.liked ? "text-indigo-600 font-semibold" : ""
          }`}
        >
          {item.liked && (
            <motion.span
              key="ripple-like"
              initial={{ scale: 0.4, opacity: 0.8 }}
              animate={{ scale: 1.8, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute -inset-1 rounded-full bg-indigo-500/20 pointer-events-none"
            />
          )}
          <motion.span
            animate={item.liked ? { scale: [1, 1.45, 1] } : { scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="inline-flex items-center justify-center"
          >
            <ThumbsUp className={`w-3 h-3 ${item.liked ? "fill-current" : ""}`} />
          </motion.span>
          <span>{item.liked ? (isRtl ? "تم الإعجاب" : "Liked") : (isRtl ? "إعجاب" : "Like")}</span>
          {likesCount > 0 && (
            <span className="text-[9.5px] font-bold px-0.5 py-0.2 bg-transparent text-indigo-600 dark:text-indigo-400">
              {likesCount}
            </span>
          )}
        </motion.button>

        <motion.button
          type="button"
          whileTap={{ scale: 0.86 }}
          onClick={() => onToggleLove(item.id)}
          className={`relative flex items-center gap-1 hover:text-rose-500 transition-colors cursor-pointer ${
            item.loved ? "text-rose-500 font-semibold" : ""
          }`}
        >
          {item.loved && (
            <motion.span
              key="ripple-love"
              initial={{ scale: 0.4, opacity: 0.8 }}
              animate={{ scale: 1.8, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute -inset-1 rounded-full bg-rose-500/20 pointer-events-none"
            />
          )}
          <motion.span
            animate={item.loved ? { scale: [1, 1.45, 1] } : { scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="inline-flex items-center justify-center"
          >
            <Heart className={`w-3 h-3 ${item.loved ? "fill-current" : ""}`} />
          </motion.span>
          <span>{item.loved ? (isRtl ? "مفضل" : "Loved") : (isRtl ? "أحببته" : "Love")}</span>
          {lovesCount > 0 && (
            <span className="text-[9.5px] font-bold px-0.5 py-0.2 bg-transparent text-rose-600 dark:text-rose-400">
              {lovesCount}
            </span>
          )}
        </motion.button>

        <motion.button
          type="button"
          whileTap={{ scale: 0.86 }}
          onClick={() => onToggleHaha && onToggleHaha(item.id)}
          className={`relative flex items-center gap-1 hover:text-amber-500 transition-colors cursor-pointer ${
            item.hahad ? "text-amber-500 font-semibold" : ""
          }`}
        >
          {item.hahad && (
            <motion.span
              key="ripple-haha"
              initial={{ scale: 0.4, opacity: 0.8 }}
              animate={{ scale: 1.8, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute -inset-1 rounded-full bg-amber-500/20 pointer-events-none"
            />
          )}
          <motion.span
            animate={item.hahad ? { scale: [1, 1.45, 1], rotate: [0, -12, 12, 0] } : { scale: 1, rotate: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="inline-flex items-center justify-center"
          >
            <Laugh className={`w-3 h-3 ${item.hahad ? "stroke-[2.5]" : ""}`} />
          </motion.span>
          <span>{item.hahad ? (isRtl ? "مضحك" : "Haha'd") : (isRtl ? "هههه" : "Haha")}</span>
          {hahasCount > 0 && (
            <span className="text-[9.5px] font-bold px-0.5 py-0.2 bg-transparent text-amber-600 dark:text-amber-400">
              {hahasCount}
            </span>
          )}
        </motion.button>

        {!item.isLocked ? (
          <button
            type="button"
            onClick={() => {
              setReplyingToId(replyingToId === item.id ? null : item.id);
              setReplyText("");
              setTopReplyImages([]);
            }}
            className="flex items-center gap-1 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <MessageSquare className="w-3 h-3" />
            <span>{isRtl ? "رد" : "Reply"}</span>
          </button>
        ) : (
          <span className="flex items-center gap-1 text-[10px] text-slate-400 italic">
            <Lock className="w-2.5 h-2.5" />
            <span>{isRtl ? "الردود مغلقة" : "Replies locked"}</span>
          </span>
        )}

        {replies.length > 0 && (
          <button
            type="button"
            onClick={() => setIsThreadExpanded((prev) => !prev)}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-700 dark:text-slate-800 font-semibold transition-all cursor-pointer text-[10.5px] select-none ml-auto"
            title={isThreadExpanded ? (isRtl ? "إخفاء الردود" : "Collapse replies") : (isRtl ? "عرض الردود" : "Expand replies")}
          >
            <MessageCircle className="w-3 h-3 text-indigo-500 shrink-0" />
            <span>
              {isThreadExpanded
                ? (isRtl ? `إخفاء الردود (${replies.length})` : `Hide replies (${replies.length})`)
                : (isRtl ? `عرض الردود (${replies.length})` : `View replies (${replies.length})`)}
            </span>
            <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isThreadExpanded ? "rotate-180" : ""}`} />
          </button>
        )}
      </div>

      {/* Reply Form */}
      {replyingToId === item.id && !item.isLocked && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="pt-1.5 space-y-1.5"
        >
          {(topReplyImages.length > 0 || isUploadingPhoto) && (
            <div className="flex items-center gap-1.5 flex-wrap">
              {topReplyImages.map((img, i) => (
                <div key={`top-reply-img-${i}`} className="relative w-10 h-10 rounded-lg overflow-hidden border border-slate-300 shadow-2xs">
                  <img src={img} alt="preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setTopReplyImages((prev) => prev.filter((_, idx) => idx !== i))}
                    className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}

              {isUploadingPhoto && (
                <div className="w-10 h-10 rounded-lg border border-indigo-400 bg-indigo-50/90 dark:bg-indigo-900/30 flex flex-col items-center justify-center text-indigo-600 animate-pulse shrink-0">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-[7.5px] font-extrabold">{isRtl ? "رفع..." : "Loading..."}</span>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-1.5">
            {!isGuestUser ? (
              <>
                <input
                  type="file"
                  ref={topFileInputRef}
                  onChange={async (e) => {
                    const files = Array.from(e.target.files || []) as File[];
                    if (!files.length) return;
                    const remaining = 2 - topReplyImages.length;
                    if (remaining <= 0) return;
                    const selected = files.slice(0, remaining);
                    setIsUploadingPhoto(true);
                    try {
                      const compressed = await Promise.all(selected.map((file) => compressImage(file)));
                      setTopReplyImages((prev) => [...prev, ...compressed].slice(0, 2));
                    } catch (err) {
                      console.error("Failed uploading reply image", err);
                    } finally {
                      setIsUploadingPhoto(false);
                      if (topFileInputRef.current) topFileInputRef.current.value = "";
                    }
                  }}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => topFileInputRef.current?.click()}
                  disabled={topReplyImages.length >= 2 || isUploadingPhoto || isSubmittingReply}
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-300 bg-slate-50 dark:bg-white text-slate-600 hover:bg-slate-100 cursor-pointer disabled:opacity-40"
                  title={isRtl ? "إرفاق صور (أقصى 2)" : "Attach photos (max 2)"}
                >
                  <Camera className="w-4 h-4 text-indigo-500" />
                </button>
              </>
            ) : (
              <button
                type="button"
                disabled
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed opacity-50"
                title={isRtl ? "رفع الصور غير متاح للزائرين" : "Photo upload disabled for guest buyers"}
              >
                <Camera className="w-4 h-4 text-slate-400" />
              </button>
            )}
            <input
              type="text"
              value={replyText}
              disabled={isSubmittingReply}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSendTopReply();
                }
              }}
              placeholder={isRtl ? "اكتب رداً على المراجعة..." : "Type a reply to this review..."}
              className="flex-1 text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-300 bg-slate-50 dark:bg-white text-slate-900 outline-none focus:border-indigo-500 disabled:opacity-50"
            />
            <button
              type="button"
              onClick={handleSendTopReply}
              disabled={isSubmittingReply || isUploadingPhoto || (!replyText.trim() && topReplyImages.length === 0)}
              className="px-3 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold cursor-pointer hover:bg-slate-800 disabled:opacity-50 shrink-0 flex items-center gap-1"
            >
              {isSubmittingReply ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{isRtl ? "جاري الإرسال..." : "Sending..."}</span>
                </>
              ) : (
                <span>{isRtl ? "إرسال" : "Reply"}</span>
              )}
            </button>
          </div>
        </motion.div>
      )}

      {/* Nested Replies */}
      <AnimatePresence>
        {replies.length > 0 && isThreadExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
            className="mt-3 pl-3.5 sm:pl-5 border-l-2 border-indigo-400/60 dark:border-indigo-400/70 space-y-3"
          >
            {visibleReplies.map((reply) => (
              <SingleReply
                key={reply.id}
                reply={reply}
                storeLogo={storeLogo}
                storeName={storeName}
                activeThemeColor={activeThemeColor}
                isRtl={isRtl}
                replyingToId={replyingToId}
                setReplyingToId={setReplyingToId}
                replyText={replyText}
                setReplyText={setReplyText}
                handleSendReply={handleSendReply}
                onToggleReplyLike={onToggleReplyLike}
                onToggleReplyLove={onToggleReplyLove}
                onToggleReplyHaha={onToggleReplyHaha}
                editingId={editingId}
                setEditingId={setEditingId}
                editText={editText}
                setEditText={setEditText}
                handleSaveEdit={handleSaveEdit}
                setCustomizingTarget={setCustomizingTarget}
                setReportingTarget={setReportingTarget}
                setDeletingTarget={setDeletingTarget}
                onToggleHide={onToggleHide}
                onTogglePin={onTogglePin}
                onToggleLock={onToggleLock}
                setLightboxState={setLightboxState}
                currentStoreId={currentStoreId}
                myStoreId={myStoreId}
                currentUserId={currentUserId}
                currentUserName={currentUserName}
                currentUserRole={currentUserRole}
                depth={1}
              />
            ))}

            {/* Facebook-style View X replies toggle */}
            {hasMoreThanTwo && !showAllReplies && (
              <button
                type="button"
                onClick={() => setShowAllReplies(true)}
                className="flex items-center gap-1.5 text-xs font-extrabold text-slate-700 dark:text-slate-700 hover:text-indigo-600 dark:hover:text-indigo-600 transition-colors py-1 px-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-200 cursor-pointer select-none my-1"
              >
                <CornerDownRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>
                  {isRtl
                    ? `عرض بقية الردود (${replies.length - 2})`
                    : `View ${replies.length - 2} more ${replies.length - 2 === 1 ? "reply" : "replies"}`}
                </span>
              </button>
            )}

            {hasMoreThanTwo && showAllReplies && (
              <button
                type="button"
                onClick={() => setShowAllReplies(false)}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors py-1 px-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-200 cursor-pointer select-none my-1"
              >
                <ChevronUp className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{isRtl ? "إخفاء الردود" : "Hide replies"}</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function OrnateOrnamentDivider({ className = "", accentColor = "#4a0a26" }: { className?: string; accentColor?: string }) {
  return (
    <div className={`relative flex items-center justify-center w-full my-4 py-1 select-none ${className}`} id="ornate-decorative-divider">
      {/* Outer soft line fading to transparent at edges */}
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent" />
      </div>
      {/* Core thin accent line fading to transparent */}
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-[85%] mx-auto h-[1px]" style={{ background: `linear-gradient(to right, transparent, ${accentColor}33, ${accentColor}55, ${accentColor}33, transparent)` }} />
      </div>
      {/* Decorative center shield/diamonds on clean background */}
      <div className="relative flex justify-center bg-white dark:bg-slate-900 px-3" style={{ backgroundColor: "#ffffff" }}>
        <div className="flex gap-1.5 items-center bg-white" style={{ backgroundColor: "#ffffff" }}>
          <span className="w-0.5 h-0.5 rounded-full bg-slate-300 dark:bg-slate-600" />
          <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-500" />
          <span className="w-1.5 h-1.5 rotate-45 border border-slate-300 dark:border-slate-600 shrink-0" style={{ backgroundColor: "#ffffff" }} />
          <span className="w-2.5 h-2.5 rotate-45 border shrink-0" style={{ borderColor: accentColor, backgroundColor: accentColor }} />
          <span className="w-1.5 h-1.5 rotate-45 border border-slate-300 dark:border-slate-600 shrink-0" style={{ backgroundColor: "#fffafa" }} />
          <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-500" />
          <span className="w-0.5 h-0.5 rounded-full bg-slate-300 dark:bg-slate-600 bg-white" style={{ backgroundColor: "#ffffff" }} />
        </div>
      </div>
    </div>
  );
}

export default function ProductReviewWidget({
  productName,
  storeName,
  storeLogo,
  activeThemeColor = "#6366f1",
  reviews,
  onAddReview,
  onToggleLike,
  onToggleLove,
  onToggleHaha,
  onAddReply,
  onToggleReplyLike,
  onToggleReplyLove,
  onToggleReplyHaha,
  onDeleteComment,
  onEditComment,
  onCustomizeComment,
  onReportComment,
  onToggleHide,
  onTogglePin,
  onToggleLock,
  currentStoreId,
  myStoreId,
  currentUserId,
  currentUserName,
  currentUserRole,
  purchasedVariant,
  initialLang = "en"
}: ProductReviewWidgetProps) {
  const [lang, setLang] = useState<Lang>(initialLang);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedEmoji, setSelectedEmoji] = useState<string>("😊");
  const [reviewText, setReviewText] = useState("");
  const [reviewImages, setReviewImages] = useState<string[]>([]);
  const [isUploadingReviewPhoto, setIsUploadingReviewPhoto] = useState(false);
  const reviewFileInputRef = useRef<HTMLInputElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState<string>("");
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const tagsScrollRef = React.useRef<HTMLDivElement>(null);

  // Sorting & Filtering state
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "highest" | "lowest" | "helpful">("newest");
  const [photoFilter, setPhotoFilter] = useState<"all" | "with_photos" | "no_photos">("all");

  // Lightbox State
  const [lightboxState, setLightboxState] = useState<{ images: string[]; index: number } | null>(null);

  // Management State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [customizingTarget, setCustomizingTarget] = useState<any | null>(null);
  const [reportingTarget, setReportingTarget] = useState<any | null>(null);
  const [deletingTarget, setDeletingTarget] = useState<any | null>(null);

  const isRtl = lang === "ar";

  const handleSaveEdit = (id: string, text: string) => {
    setEditingId(null);
    if (onEditComment) onEditComment(id, text);
  };

  const handleConfirmDelete = (id: string) => {
    setDeletingTarget(null);
    if (onDeleteComment) onDeleteComment(id);
  };

  const handleSaveCustomize = (updates: { author: string; badge: string; avatarBg: string; emoji: string }) => {
    if (customizingTarget && onCustomizeComment) {
      onCustomizeComment(customizingTarget.id, updates);
    }
    setCustomizingTarget(null);
  };

  const handleSubmitReport = (reason: string) => {
    if (reportingTarget && onReportComment) {
      onReportComment(reportingTarget.id, reason);
    }
  };

  useEffect(() => {
    setCurrentPrompt(getRandomPrompt(lang));
  }, [lang]);

  const handleEmojiSelect = (rating: number, emoji: string) => {
    setSelectedRating(rating);
    setSelectedEmoji(emoji);
    setIsExpanded(true);
    setCurrentPrompt(getRandomPrompt(lang));
  };

  const handleOpenForm = () => {
    if (!selectedRating) {
      setSelectedRating(5);
      setSelectedEmoji("🤩");
    }
    setIsExpanded(true);
    setCurrentPrompt(getRandomPrompt(lang));
  };

  const isGuestUser =
    !currentUserRole ||
    currentUserRole.toLowerCase().includes("guest") ||
    (currentUserName || "").toLowerCase().includes("guest");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRating || !reviewText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAddReview({
        rating: selectedRating,
        emoji: selectedEmoji,
        text: reviewText.trim(),
        lang,
        images: isGuestUser ? [] : reviewImages,
        purchasedVariant
      });
      setReviewText("");
      setReviewImages([]);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setIsExpanded(false);
      }, 300);
    } catch (err) {
      console.error("Failed to submit review:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendReply = (rootId: string, images?: string[]) => {
    if (!replyText.trim() && (!images || images.length === 0)) return;
    const imagesToSend = isGuestUser ? [] : images;
    onAddReply(rootId, replyText.trim(), imagesToSend);
    setReplyText("");
    setReplyingToId(null);
  };

  const totalPhotosCount = useMemo(() => {
    return reviews.reduce((acc, r) => acc + (r.images?.length || 0), 0);
  }, [reviews]);

  const filteredAndSortedReviews = useMemo(() => {
    let list = [...reviews];

    // Filter by photos
    if (photoFilter === "with_photos") {
      list = list.filter((r) => r.images && r.images.length > 0);
    } else if (photoFilter === "no_photos") {
      list = list.filter((r) => !r.images || r.images.length === 0);
    }

    // Sort
    list.sort((a, b) => {
      // Pinned always on top
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      if (sortBy === "highest") {
        return (b.rating || 5) - (a.rating || 5);
      }
      if (sortBy === "lowest") {
        return (a.rating || 5) - (b.rating || 5);
      }
      if (sortBy === "helpful") {
        const scoreA = (a.likes || 0) + (a.loves || 0) * 1.5 + (a.hahas || 0);
        const scoreB = (b.likes || 0) + (b.loves || 0) * 1.5 + (b.hahas || 0);
        return scoreB - scoreA;
      }
      if (sortBy === "oldest") {
        return a.id.localeCompare(b.id);
      }
      // default newest
      return b.id.localeCompare(a.id);
    });

    return list;
  }, [reviews, photoFilter, sortBy]);

  return (
    <div
      id="threaded-comments-root"
      dir={isRtl ? "rtl" : "ltr"}
      className="mt-2 pt-2 text-left space-y-4 font-sans"
    >
      {/* Decorative Ornate Line Divider matching reference image */}
      <OrnateOrnamentDivider className="my-2" accentColor={activeThemeColor || "#4a0a26"} />

      {/* FLOATING EMOJI REACTION TRIGGER BAR & POPUP REVIEW COMPOSER DIALOG */}
      <div className="relative">
        {/* COLLAPSED FLOATING PILL TRIGGER BAR */}
        <div className="bg-slate-50/80 dark:bg-slate-100/90 border border-slate-200/90 dark:border-slate-300 rounded-full py-1.5 px-3 sm:px-4 shadow-2xs max-w-xl mx-auto flex flex-row items-center justify-between gap-2 text-left">
          <div className="flex items-center gap-2 px-1">
            <span className="text-xs sm:text-[12.5px] font-medium text-slate-700 dark:text-slate-800 whitespace-nowrap">
              {isRtl ? "كيف كانت تجربتك؟" : "How was your experience?"}
            </span>
          </div>

          {/* Emoji Options row */}
          <div className="flex items-center gap-1.5">
            {EMOJI_OPTIONS.map((opt) => (
              <motion.button
                key={opt.rating}
                type="button"
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.85 }}
                onClick={() => handleEmojiSelect(opt.rating, opt.emoji)}
                className="group relative w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-white dark:bg-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-100 border border-slate-200/80 dark:border-slate-300 flex items-center justify-center transition-colors duration-200 cursor-pointer shadow-2xs"
                title={`${opt.labelEn} / ${opt.labelAr}`}
              >
                <motion.span
                  whileTap={{ scale: 1.3, rotate: 12 }}
                  className="group-hover:rotate-6 transition-transform flex items-center justify-center"
                >
                  <LineArtFaceIcon rating={opt.rating} emoji={opt.emoji} className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-700 dark:text-slate-800" />
                </motion.span>
                <span className="absolute -bottom-7 bg-slate-900 text-white text-[10px] font-medium px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20 shadow-xs">
                  {isRtl ? opt.labelAr : opt.labelEn}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Write Review Button */}
          <button
            type="button"
            onClick={handleOpenForm}
            className="px-3.5 py-1.5 rounded-full text-[11px] font-semibold text-white shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center gap-1 shrink-0 whitespace-nowrap"
            style={{ backgroundColor: activeThemeColor }}
          >
            <span>{isRtl ? "اكتب مراجعتك" : "Write a review"}</span>
          </button>
        </div>

        {/* POPUP REVIEW DIALOG WITH TRANSPARENT & BLURRY BACKDROP */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              key="review-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsExpanded(false)}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm"
            >
              <motion.div
                key="expanded-widget"
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-slate-100 border border-slate-200 dark:border-slate-300 rounded-2xl p-4 sm:p-5 shadow-2xl max-w-lg w-full text-left relative overflow-hidden space-y-3"
              >
                {/* Absolute Close button at top right */}
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="absolute top-2.5 right-2.5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-200 transition-colors cursor-pointer z-10"
                  title={isRtl ? "إغلاق" : "Close"}
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Emoji / Rating Selection Row */}
                <div className="space-y-1 text-left">
                  <span className="text-[10px] font-black text-slate-500 dark:text-slate-600 tracking-wider block">
                    {isRtl ? "اختر التقييم والإيموجي المناسب:" : "Select Your Rating & Emoji:"}
                  </span>

                  <div className="flex items-center justify-between gap-1 p-1.5 bg-slate-50 dark:bg-slate-200/80 rounded-xl border border-slate-200/80 dark:border-slate-300">
                    {EMOJI_OPTIONS.map((opt) => {
                      const isSelected = selectedRating === opt.rating;
                      return (
                        <motion.button
                          key={opt.rating}
                          type="button"
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            setSelectedRating(opt.rating);
                            setSelectedEmoji(opt.emoji);
                          }}
                          className={`relative flex-1 py-1.5 px-1 rounded-lg flex flex-col items-center gap-0.5 transition-colors cursor-pointer overflow-hidden ${
                            isSelected
                              ? "bg-white dark:bg-white border border-slate-300 shadow-2xs"
                              : "hover:bg-slate-100 dark:hover:bg-slate-100 opacity-70 hover:opacity-100"
                          }`}
                        >
                          {isSelected && (
                            <motion.span
                              key="emoji-sel-ripple"
                              initial={{ scale: 0.4, opacity: 0.7 }}
                              animate={{ scale: 1.5, opacity: 0 }}
                              transition={{ duration: 0.35, ease: "easeOut" }}
                              className="absolute inset-0 rounded-lg bg-indigo-500/20 pointer-events-none"
                            />
                          )}
                          <motion.div
                            animate={isSelected ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                          >
                            <LineArtFaceIcon rating={opt.rating} emoji={opt.emoji} className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-slate-800 dark:text-slate-900" />
                          </motion.div>
                          <div className="flex items-center gap-0.5 text-amber-400">
                            {Array.from({ length: opt.rating }).map((_, i) => (
                              <Star key={`opt-star-${opt.rating}-${i}`} className="w-2 h-2 fill-current" />
                            ))}
                          </div>
                          <span className="text-[9.5px] font-extrabold tracking-wider text-slate-800 dark:text-slate-900 leading-none">
                            {isRtl ? opt.labelAr : opt.labelEn}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Random Prompt Quote Box */}
                <div className="bg-gradient-to-r from-indigo-50/90 via-purple-50/90 to-pink-50/90 dark:from-indigo-100/90 dark:via-purple-100/90 dark:to-pink-100/90 p-3 rounded-xl border border-indigo-200/90 dark:border-indigo-300 flex items-center justify-center text-center shadow-[0_0_16px_rgba(99,102,241,0.22)]">
                  <p className="text-xs sm:text-[13px] font-extrabold bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900 bg-clip-text text-transparent leading-relaxed italic text-center tracking-wide drop-shadow-[0_1px_2px_rgba(99,102,241,0.25)]">
                    "{currentPrompt}"
                  </p>
                </div>

                {/* Review Text Form */}
                <form onSubmit={handleSubmit} className="space-y-2.5">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-600 dark:text-slate-600">
                      <span className="text-[10px] font-black tracking-wider text-slate-500 dark:text-slate-600">{isRtl ? "رأيك الصريح:" : "Your Opinion:"}</span>
                      <span className="font-mono text-[9.5px] font-bold text-slate-400">{reviewText.length} / 500</span>
                    </div>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          const form = e.currentTarget.form;
                          if (form) {
                            form.requestSubmit();
                          }
                        }
                      }}
                      placeholder={
                        isRtl
                          ? "اكتب تفاصيل تجربتك انطباعك عن الجودة والمنتج..."
                          : "Describe your experience, item quality, feel, or satisfaction..."
                      }
                      rows={2}
                      maxLength={500}
                      className="w-full text-xs leading-relaxed border border-slate-200 dark:border-slate-300 rounded-xl p-2.5 placeholder:text-slate-400 font-sans outline-none bg-slate-50 dark:bg-white text-slate-900 dark:text-slate-900 font-medium resize-none transition-all duration-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  {/* Image Upload Area for Review (Up to 5 images) */}
                  {isGuestUser ? (
                    <div className="p-2.5 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 bg-[#f1f6fc] dark:bg-[#f1f6fc] flex items-center justify-between text-slate-500 text-[11px] font-medium">
                      <div className="flex items-center gap-2">
                        <Camera className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>
                          {isRtl
                            ? "إرفاق الصور متاح فقط للمستخدمين المسجلين (غير متاح للزائرين)."
                            : "Photo attachments are disabled for guest buyers."}
                        </span>
                      </div>
                      <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-slate-200/60 dark:bg-slate-700 text-slate-600 dark:text-slate-300 shrink-0">
                        {isRtl ? "غير متاح للزائر" : "Guest Mode"}
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-1.5 text-left bg-[#f1f6fc] dark:bg-[#f1f6fc] p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/60">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black tracking-wider text-slate-500 dark:text-slate-600">
                          {isRtl ? "إرفاق صور (حتى 5 صور):" : "Attach Photos (Up to 5):"}
                        </span>
                        <span className="text-[9.5px] font-bold text-slate-400">
                          {reviewImages.length} / 5
                        </span>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {reviewImages.map((img, index) => (
                          <div key={`rev-upload-img-${index}`} className="relative w-14 h-14 rounded-xl overflow-hidden border border-slate-300 shadow-2xs group">
                            <img src={img} alt="review attachment" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setReviewImages((prev) => prev.filter((_, i) => i !== index))}
                              className="absolute top-0.5 right-0.5 p-1 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}

                        {isUploadingReviewPhoto && (
                          <div className="w-14 h-14 rounded-xl border-2 border-indigo-400 bg-indigo-50/90 dark:bg-indigo-900/30 flex flex-col items-center justify-center text-indigo-600 animate-pulse shrink-0 shadow-2xs gap-0.5">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-[7.5px] font-extrabold">{isRtl ? "جاري الرفع..." : "Uploading..."}</span>
                          </div>
                        )}

                        {reviewImages.length < 5 && (
                          <>
                            <input
                              type="file"
                              ref={reviewFileInputRef}
                              onChange={async (e) => {
                                const files = Array.from(e.target.files || []) as File[];
                                if (!files.length) return;
                                const remaining = 5 - reviewImages.length;
                                if (remaining <= 0) return;
                                const selected = files.slice(0, remaining);
                                setIsUploadingReviewPhoto(true);
                                try {
                                  const compressed = await Promise.all(selected.map((file) => compressImage(file)));
                                  setReviewImages((prev) => [...prev, ...compressed].slice(0, 5));
                                } catch (err) {
                                  console.error("Error uploading review photo", err);
                                } finally {
                                  setIsUploadingReviewPhoto(false);
                                  if (reviewFileInputRef.current) reviewFileInputRef.current.value = "";
                                }
                              }}
                              accept="image/*"
                              multiple
                              className="hidden"
                            />
                            <button
                              type="button"
                              onClick={() => reviewFileInputRef.current?.click()}
                              disabled={isUploadingReviewPhoto || isSubmitting}
                              className="w-14 h-14 rounded-xl border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-slate-50 hover:bg-indigo-50/50 flex flex-col items-center justify-center gap-0.5 text-slate-500 hover:text-indigo-600 transition-all cursor-pointer disabled:opacity-40"
                              title={isRtl ? "إضافة صور" : "Add photos"}
                            >
                              <Camera className="w-4 h-4" />
                              <span className="text-[8.5px] font-extrabold">{isRtl ? "+ صورة" : "+ Photo"}</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Quick Presets Horizontal Row with Navigation Arrows */}
                  <div className="space-y-1 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black tracking-wider text-slate-500 dark:text-slate-600">
                        {isRtl ? "عبارات سريعة مقترحة:" : "Quick Preset Tags:"}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            if (tagsScrollRef.current) {
                              const amount = isRtl ? 180 : -180;
                              tagsScrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
                            }
                          }}
                          className="w-5 h-5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-200/80 dark:hover:bg-slate-300 text-slate-700 dark:text-slate-800 flex items-center justify-center transition-all cursor-pointer border border-slate-200 dark:border-slate-300 active:scale-95"
                          title={isRtl ? "السابق" : "Previous"}
                        >
                          <ChevronLeft className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (tagsScrollRef.current) {
                              const amount = isRtl ? -180 : 180;
                              tagsScrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
                            }
                          }}
                          className="w-5 h-5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-200/80 dark:hover:bg-slate-300 text-slate-700 dark:text-slate-800 flex items-center justify-center transition-all cursor-pointer border border-slate-200 dark:border-slate-300 active:scale-95"
                          title={isRtl ? "التالي" : "Next"}
                        >
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div
                      ref={tagsScrollRef}
                      className="flex items-center gap-1.5 overflow-x-auto py-0.5 px-0.5 scroll-smooth no-scrollbar"
                      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                      {PRESET_TAGS[lang].map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() =>
                            setReviewText((prev) => (prev ? `${prev} ${tag}` : tag))
                          }
                          className="shrink-0 whitespace-nowrap text-[9.5px] font-extrabold tracking-wider text-slate-800 dark:text-slate-800 bg-slate-100 dark:bg-slate-200/80 hover:bg-indigo-50 dark:hover:bg-indigo-100 hover:text-indigo-700 border border-slate-200 dark:border-slate-300 px-2.5 py-1 rounded-full cursor-pointer transition-all active:scale-95 shadow-2xs"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submit Action Row */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-600 dark:text-slate-600 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>
                        {isRtl
                          ? "نقدر مراجعتك الصادقة لمساعدة مجتمع المتسوقين"
                          : "We appreciate your honest contribution."}
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={!selectedRating || !reviewText.trim() || isSubmitting || isUploadingReviewPhoto}
                      className={`px-4 py-1.5 rounded-full text-[11px] font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                        submitSuccess
                          ? "bg-emerald-600 text-white"
                          : selectedRating && reviewText.trim() && !isSubmitting && !isUploadingReviewPhoto
                          ? "text-white hover:opacity-95 active:scale-98"
                          : "bg-slate-200 dark:bg-slate-300 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none"
                      }`}
                      style={
                        selectedRating && reviewText.trim() && !submitSuccess && !isSubmitting && !isUploadingReviewPhoto
                          ? { backgroundColor: activeThemeColor }
                          : {}
                      }
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-1.5">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>
                            {reviewImages.length > 0
                              ? (isRtl ? "جاري نشر المراجعة مع الصور..." : "Posting with photos...")
                              : (isRtl ? "جاري النشر..." : "Posting...")}
                          </span>
                        </div>
                      ) : submitSuccess ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>{isRtl ? "تمت الإضافة بنجاح!" : "Review Posted!"}</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3 h-3" />
                          <span>{isRtl ? "إرسال المراجعة" : "Send Review"}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FILTER & SORTING CONTROL BAR ABOVE REVIEWS */}
      <div className="flex items-center justify-between gap-2 py-2 px-3 bg-[#f1f4f8] rounded-2xl border border-slate-200 dark:border-slate-300 flex-wrap text-xs">
        {/* Photo Filters */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setPhotoFilter("all")}
            className={`px-3 py-1 rounded-full text-[11px] font-extrabold transition-all cursor-pointer ${
              photoFilter === "all"
                ? "bg-[#0f172b] text-white shadow-2xs"
                : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-300"
            }`}
          >
            {isRtl ? "الكل" : "All Reviews"} ({reviews.length})
          </button>
          <button
            type="button"
            onClick={() => setPhotoFilter("with_photos")}
            className={`px-3 py-1 rounded-full text-[11px] font-extrabold transition-all cursor-pointer flex items-center gap-1 ${
              photoFilter === "with_photos"
                ? "bg-[#0f172b] text-white shadow-2xs"
                : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-300"
            }`}
          >
            <Camera className="w-3 h-3" />
            <span>{isRtl ? "مع صور" : "Photos"}</span>
            <span
              className={`text-[9px] px-1.5 py-0.2 rounded-full font-black ${
                photoFilter === "with_photos"
                  ? "bg-white/20 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {totalPhotosCount}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setPhotoFilter("no_photos")}
            className={`px-3 py-1 rounded-full text-[11px] font-extrabold transition-all cursor-pointer ${
              photoFilter === "no_photos"
                ? "bg-[#0f172b] text-white shadow-2xs"
                : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-300"
            }`}
          >
            {isRtl ? "بدون صور" : "Without Photos"}
          </button>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-1.5 ml-auto">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-[11px] font-bold text-slate-600 dark:text-slate-700">
            {isRtl ? "ترتيب حسب:" : "Sort:"}
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-[11px] font-bold bg-white text-slate-800 border border-slate-300 rounded-xl px-2.5 py-1 outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-2xs"
          >
            <option value="newest">{isRtl ? "الأحدث" : "Newest"}</option>
            <option value="oldest">{isRtl ? "الأقدم" : "Oldest"}</option>
            <option value="highest">{isRtl ? "الأعلى تقييماً" : "Highest Rated"}</option>
            <option value="lowest">{isRtl ? "الأقل تقييماً" : "Lowest Rated"}</option>
            <option value="helpful">{isRtl ? "الأكثر فائدة" : "Most Helpful"}</option>
          </select>
        </div>
      </div>

      {/* REVIEWS LIST DISPLAY */}
      <div className="space-y-3 pt-1">
        {filteredAndSortedReviews.length === 0 ? (
          <div className="text-center py-8 bg-white dark:bg-slate-100 rounded-2xl border border-slate-200 dark:border-slate-300 p-4 space-y-1.5">
            <span className="text-2xl">⭐</span>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-800">
              {isRtl ? "لا توجد مراجعات مطابقة حتى الآن." : "No matching reviews found."}
            </p>
          </div>
        ) : (
          filteredAndSortedReviews.map((item) => (
            <TopLevelReviewItem
              key={item.id}
              item={item}
              storeLogo={storeLogo}
              storeName={storeName}
              activeThemeColor={activeThemeColor}
              isRtl={isRtl}
              onToggleLike={onToggleLike}
              onToggleLove={onToggleLove}
              onToggleHaha={onToggleHaha}
              replyingToId={replyingToId}
              setReplyingToId={setReplyingToId}
              replyText={replyText}
              setReplyText={setReplyText}
              handleSendReply={handleSendReply}
              onToggleReplyLike={onToggleReplyLike}
              onToggleReplyLove={onToggleReplyLove}
              onToggleReplyHaha={onToggleReplyHaha}
              editingId={editingId}
              setEditingId={setEditingId}
              editText={editText}
              setEditText={setEditText}
              handleSaveEdit={handleSaveEdit}
              setCustomizingTarget={setCustomizingTarget}
              setReportingTarget={setReportingTarget}
              setDeletingTarget={setDeletingTarget}
              onToggleHide={onToggleHide}
              onTogglePin={onTogglePin}
              onToggleLock={onToggleLock}
              setLightboxState={setLightboxState}
              currentStoreId={currentStoreId}
              myStoreId={myStoreId}
              currentUserId={currentUserId}
              currentUserName={currentUserName}
              currentUserRole={currentUserRole}
            />
          ))
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxState && (
          <ReviewImageLightboxModal
            images={lightboxState.images}
            initialIndex={lightboxState.index}
            onClose={() => setLightboxState(null)}
          />
        )}
      </AnimatePresence>

      {/* Modals for Customization, Report, and Delete */}
      <AnimatePresence>
        {customizingTarget && (
          <CustomizeModal
            item={customizingTarget}
            isRtl={isRtl}
            onClose={() => setCustomizingTarget(null)}
            onSave={handleSaveCustomize}
          />
        )}

        {reportingTarget && (
          <ReportModal
            item={reportingTarget}
            isRtl={isRtl}
            onClose={() => setReportingTarget(null)}
            onSubmit={handleSubmitReport}
          />
        )}

        {deletingTarget && (
          <DeleteConfirmModal
            isRtl={isRtl}
            onClose={() => setDeletingTarget(null)}
            onConfirm={() => handleConfirmDelete(deletingTarget.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
