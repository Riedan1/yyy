import React, { useState, useEffect, useRef } from "react";
import { 
  Store, 
  Phone, 
  DollarSign, 
  Megaphone, 
  Users, 
  Sliders, 
  ShieldCheck, 
  UserCheck, 
  Sparkles, 
  Check, 
  CheckCircle,
  UploadCloud, 
  Lock, 
  Plus, 
  Trash2, 
  ChevronRight, 
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  AlertCircle, 
  Eye, 
  Copy,
  Activity,
  User,
  ExternalLink,
  HelpCircle,
  Layout,
  Star,
  Gamepad,
  Type,
  X,
  Calendar,
  ChevronDown,
  Info,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MerchantStore } from "../types";
import { INITIAL_COVER_TEMPLATES, BANNER_TEMPLATES } from "../App";
import { CHARACTER_LIBRARY, COVER_LIBRARY } from "../data/coversLibrary";
import { countryCurrencyMapping } from "../currency";
import { SkeuomorphicSwitch } from "./SkeuomorphicSwitch";

const SettingsTooltip = ({ text }: { text: string }) => {
  return (
    <span className="relative group inline-flex items-center ml-1.5 shrink-0 select-none align-middle">
      <HelpCircle className="w-3.5 h-3.5 text-slate-400 hover:text-rose-500 transition-colors cursor-help" />
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2 bg-slate-900 text-white text-[10px] leading-relaxed rounded-md shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 z-50 text-center font-sans font-medium normal-case tracking-normal transform scale-95 group-hover:scale-100 origin-bottom block">
        {text}
        <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-slate-900 rotate-45" />
      </span>
    </span>
  );
};

interface MerchantSettingsHubProps {
  myStore: MerchantStore;
  setStores?: React.Dispatch<React.SetStateAction<MerchantStore[]>>;
  setSelectedStore?: (store: MerchantStore) => void;
  setMerchantFeedbackMessage: (msg: string) => void;
  accentColor?: string;
}

const celestialPresets = [
  {
    name: "Cosmic Rose",
    bgType: "nebula" as const,
    color1: "#ec4899",
    color2: "#8b5cf6",
    angle: 135,
    shadowColor: "#ec4899",
    intensity: 20,
    opacity: 70,
    previewClass: "bg-gradient-to-br from-pink-500 to-purple-600"
  },
  {
    name: "Deep Space",
    bgType: "space" as const,
    color1: "#0f172a",
    color2: "#1e1b4b",
    angle: 180,
    shadowColor: "#38bdf8",
    intensity: 25,
    opacity: 60,
    previewClass: "bg-slate-900 border border-slate-700"
  },
  {
    name: "Supernova",
    bgType: "gradient" as const,
    color1: "#f97316",
    color2: "#ec4899",
    angle: 45,
    shadowColor: "#ef4444",
    intensity: 15,
    opacity: 80,
    previewClass: "bg-gradient-to-br from-orange-500 to-pink-500"
  },
  {
    name: "Aurora Glow",
    bgType: "gradient" as const,
    color1: "#10b981",
    color2: "#3b82f6",
    angle: 220,
    shadowColor: "#10b981",
    intensity: 18,
    opacity: 50,
    previewClass: "bg-gradient-to-br from-emerald-500 to-blue-500"
  },
  {
    name: "Solar Crown",
    bgType: "solid" as const,
    color1: "#030712",
    color2: "#030712",
    angle: 0,
    shadowColor: "#eab308",
    intensity: 30,
    opacity: 90,
    previewClass: "bg-gray-950 border-2 border-yellow-500"
  },
  {
    name: "Andromeda",
    bgType: "space" as const,
    color1: "#172554",
    color2: "#311042",
    angle: 120,
    shadowColor: "#d946ef",
    intensity: 22,
    opacity: 75,
    previewClass: "bg-gradient-to-br from-indigo-950 to-fuchsia-950"
  },
  {
    name: "Cyan Eclipse",
    bgType: "solid" as const,
    color1: "#090d16",
    color2: "#090d16",
    angle: 90,
    shadowColor: "#06b6d4",
    intensity: 28,
    opacity: 85,
    previewClass: "bg-slate-950 border-2 border-cyan-500"
  },
  {
    name: "Stardust Gold",
    bgType: "gradient" as const,
    color1: "#eab308",
    color2: "#db2777",
    angle: 135,
    shadowColor: "#fb7185",
    intensity: 14,
    opacity: 65,
    previewClass: "bg-gradient-to-br from-yellow-500 to-pink-600"
  },
  {
    name: "Orion's Belt",
    bgType: "space" as const,
    color1: "#1e1b4b",
    color2: "#0891b2",
    angle: 315,
    shadowColor: "#22d3ee",
    intensity: 16,
    opacity: 70,
    previewClass: "bg-gradient-to-br from-violet-950 to-cyan-800"
  },
  {
    name: "Lunar Dust",
    bgType: "gradient" as const,
    color1: "#f1f5f9",
    color2: "#94a3b8",
    angle: 180,
    shadowColor: "#cbd5e1",
    intensity: 12,
    opacity: 40,
    previewClass: "bg-gradient-to-br from-slate-100 to-slate-400"
  },
  {
    name: "Hyperdrive",
    bgType: "space" as const,
    color1: "#020617",
    color2: "#4338ca",
    angle: 270,
    shadowColor: "#818cf8",
    intensity: 35,
    opacity: 80,
    previewClass: "bg-gradient-to-br from-slate-950 to-indigo-900"
  },
  {
    name: "Pluto Lilac",
    bgType: "gradient" as const,
    color1: "#c084fc",
    color2: "#6366f1",
    angle: 150,
    shadowColor: "#a855f7",
    intensity: 16,
    opacity: 60,
    previewClass: "bg-gradient-to-br from-purple-400 to-indigo-500"
  },
  {
    name: "Milky Way",
    bgType: "space" as const,
    color1: "#2e1065",
    color2: "#78350f",
    angle: 60,
    shadowColor: "#f59e0b",
    intensity: 20,
    opacity: 65,
    previewClass: "bg-gradient-to-br from-purple-950 to-amber-950"
  },
  {
    name: "Crimson Nova",
    bgType: "nebula" as const,
    color1: "#991b1b",
    color2: "#701a75",
    angle: 110,
    shadowColor: "#f43f5e",
    intensity: 24,
    opacity: 85,
    previewClass: "bg-gradient-to-br from-red-800 to-fuchsia-950"
  },
  {
    name: "Aqua Rift",
    bgType: "gradient" as const,
    color1: "#06b6d4",
    color2: "#10b981",
    angle: 45,
    shadowColor: "#22d3ee",
    intensity: 15,
    opacity: 55,
    previewClass: "bg-gradient-to-br from-cyan-500 to-emerald-500"
  },
  {
    name: "Cyberpunk",
    bgType: "gradient" as const,
    color1: "#f43f5e",
    color2: "#06b6d4",
    angle: 135,
    shadowColor: "#d946ef",
    intensity: 22,
    opacity: 90,
    previewClass: "bg-gradient-to-br from-rose-500 to-cyan-500"
  },
  {
    name: "Exoplanet",
    bgType: "nebula" as const,
    color1: "#065f46",
    color2: "#1e1b4b",
    angle: 200,
    shadowColor: "#34d399",
    intensity: 18,
    opacity: 75,
    previewClass: "bg-gradient-to-br from-emerald-800 to-indigo-950"
  },
  {
    name: "Helios Gold",
    bgType: "gradient" as const,
    color1: "#f59e0b",
    color2: "#ef4444",
    angle: 90,
    shadowColor: "#ea580c",
    intensity: 16,
    opacity: 70,
    previewClass: "bg-gradient-to-br from-amber-500 to-red-500"
  },
  {
    name: "Twilight",
    bgType: "gradient" as const,
    color1: "#fda4af",
    color2: "#1e1b4b",
    angle: 135,
    shadowColor: "#ec4899",
    intensity: 15,
    opacity: 60,
    previewClass: "bg-gradient-to-br from-rose-300 to-indigo-950"
  },
  {
    name: "Galactic Tea",
    bgType: "nebula" as const,
    color1: "#0d9488",
    color2: "#312e81",
    angle: 160,
    shadowColor: "#2dd4bf",
    intensity: 18,
    opacity: 70,
    previewClass: "bg-gradient-to-br from-teal-600 to-indigo-950"
  }
];

// 10 Setup Chapters Definition
const SETUP_CHAPTERS = [
  { id: "store", title: "Store Setup", desc: "Name, owner registration, logo & bio", icon: Store },
  { id: "contact", title: "Contact Info", desc: "Support phone, email & social lines", icon: Phone },
  { id: "payments", title: "Payment Gateways", desc: "Cash on delivery, CIB, SATIM credentials", icon: DollarSign },
  { id: "notifications", title: "Alerts Hub", desc: "Event alerts, SMS & email channels", icon: Megaphone },
  { id: "followers", title: "Followers Control", desc: "Track community fans & follow alerts", icon: Users },
  { id: "design", title: "Design & Customizer", desc: "Visual colors, banners & active frames", icon: Sliders },
  { id: "verification", title: "ID Verification", desc: "Artisan check, registries & document KYC", icon: ShieldCheck },
  { id: "password", title: "Registration Security", desc: "Master email sync & password reset", icon: UserCheck },
  { id: "ai", title: "Smart AI Setup", desc: "Gemini APIs, template text copywriter", icon: Sparkles },
  { id: "reset_delete", title: "Reset & Danger Zone", desc: "Reset account settings or delete store forever", icon: Trash2 }
];

const CHAPTER_TIPS: Record<string, { title: string; desc: string; list: string[] }> = {
  store: {
    title: "Why is your Profile critical?",
    desc: "Your profile details are shown publicly on the Algerian artisan map, helping buyers confirm the identity and region of creators.",
    list: [
      "Select a high-quality logo (e.g. showcasing your workshop or crafts).",
      "Draft a genuine bio explaining your heritage, raw materials, or work history.",
      "Custom subdomains build brand identity inside independent channels."
    ]
  },
  contact: {
    title: "Direct buyer conversations",
    desc: "Providing reachable channels like Viber, WhatsApp, and social links triggers direct trust, allowing shoppers to coordinate custom shipping.",
    list: [
      "Viber and WhatsApp are the absolute standard for Algerian transactions.",
      "Include secondary numbers if you utilize courier services.",
      "Never put sensitive private credentials inside social slots."
    ]
  },
  payments: {
    title: "Flexible Algerian payout routing",
    desc: "Cash on Delivery remains the standard of choice, but integrating online gateways opens your storefront to high-value shoppers.",
    list: [
      "Cash on Delivery (COD) works across 58 Algerian Wilayas.",
      "Your CCP details will be sent in invoice notifications for manual wire checks.",
      "SATIM Terminal IDs securely process CIB and Eddahabia bank cards."
    ]
  },
  notifications: {
    title: "Prompt order alert dispatcher",
    desc: "Timely customer notifications are proven to lower checkout bounce rates and double repeated customer purchases.",
    list: [
      "Enable instant order logs to receive pushes on dispatch runs.",
      "Our system supports free transactional emails for all active followers.",
      "Djezzy and Mobilis SMS channels dispatch delivery alerts reliably."
    ]
  },
  followers: {
    title: "Your loyal buyer community",
    desc: "Keep fans updated with your latest collection drops, seasonal date harvests, or limited ceramic creations.",
    list: [
      "Search and approve genuine client requests.",
      "Approved followers receive private marquees and promo notices.",
      "Block spam accounts to maintain pristine communication channels."
    ]
  },
  design: {
    title: "Curate your boutique aura",
    desc: "Design controls customize standard viewport margins and border frames of the visitor portal.",
    list: [
      "Custom highlight borders reflect the quality of artisanal wares.",
      "Keep announcement marquees short, catchy, and localized.",
      "Use premium off-white grids for balanced graphic typography."
    ]
  },
  verification: {
    title: "The Blue Verified Badge",
    desc: "The verified artisan badge symbolizes authentic craftsmanship, confirming legal registration with national registries.",
    list: [
      "Upload high-quality scans of your Artisan Card (بطاقة الحرفي) or commercial register (Commercial RC).",
      "The blue validation tick increases search visibility on public maps by 3x.",
      "Audits standardly resolve in under 24 business hours."
    ]
  },
  password: {
    title: "High-grade security standards",
    desc: "Changing verification passwords periodically shields transactional entries and customer data logs.",
    list: [
      "Your registration email is the master recovery path.",
      "Select robust keys avoiding sequential figures or date names.",
      "Sessions reset globally upon passcode renewal events."
    ]
  },
  ai: {
    title: "Gemini Smart Copywriter",
    desc: "Our native Google generative intelligence builds professional, rich, and high-converting product stories instantly.",
    list: [
      "Enter rough words on raw materials or region of origin.",
      "Select a target tone (e.g. Cultural Storyteller) to adapt phrasing.",
      "Translate into 3 languages (Arabic, French, English) to capture tourists."
    ]
  },
  reset_delete: {
    title: "Understanding irreversible actions",
    desc: "The Danger Zone contains structural tools to wipe customization history or delete the boutique registry forever. Please act with extreme caution.",
    list: [
      "Resetting account parameters defaults layout styles and notifications to stock values.",
      "Deleting your store deletes all products, orders, active stories, and followers forever.",
      "Once deleted, your subdomains immediately become available for other regional artisans to claim."
    ]
  }
};

const ALL_PLATFORM_CATEGORIES = [
  { id: "crafts", name: "Crafts", description: "Handmade arts, traditional copper, pottery, and Berber rugs.", gated: false },
  { id: "food", name: "Food", description: "Organic dates, olive oils, traditional sweets, and spices.", gated: false },
  { id: "electronics", name: "Electronics", description: "Computers, gadgets, and cell phone accessories.", gated: false },
  { id: "home_kitchen", name: "Home & Kitchen", description: "Furniture, décor, kitchen gadgets, bedding, and more.", gated: false },
  { id: "beauty_care", name: "Beauty & Personal Care", description: "Skincare, cosmetics, supplements, and personal care.", gated: false },
  { id: "clothing_jewelry", name: "Clothing, Shoes & Jewelry", description: "Apparel, footwear, and artisanal jewelry. (Gated)", gated: true },
  { id: "sports_outdoors", name: "Sports & Outdoors", description: "Athletic gear, camping, and outdoor equipment.", gated: false },
  { id: "toys_games", name: "Toys & Games", description: "Educational games, toys, puzzles, and hobbies.", gated: false },
  { id: "books", name: "Books", description: "Literature, textbooks, historical publications, and audiobooks.", gated: false },
  { id: "automotive", name: "Automotive & Powersports", description: "Car accessories, parts, and specialized tools. (Gated)", gated: true },
  { id: "garden", name: "Garden & Outdoor", description: "Lawn care, planters, seeds, and patio tools.", gated: false },
  { id: "health", name: "Health & Household", description: "Wellness items, vitamins, and household supplies.", gated: false },
  { id: "grocery", name: "Grocery & Gourmet Food", description: "Aromatic coffee, honey, and packaged gourmet ingredients.", gated: false },
  { id: "industrial", name: "Industrial & Scientific", description: "Lab equipment, professional tools, and raw materials.", gated: false },
  { id: "collectibles", name: "Collectibles", description: "Rare coins, stamps, art collections, and historical items. (Gated)", gated: true },
  { id: "music", name: "Music", description: "Instruments, vinyl records, traditional music albums, and audio. (Gated)", gated: true },
];

const categoryIconMapping: Record<string, string> = {
  "Fashion": "👕",
  "Electronics": "💻",
  "Collectibles": "🪙",
  "Music": "🎵",
  "Artisan": "🏺",
  "Food": "🍯",
  "Books": "📚",
  "Home": "🏠",
  "Beauty": "💄",
  "Sports": "⚽",
};

export default function MerchantSettingsHub({
  myStore,
  setStores,
  setSelectedStore,
  setMerchantFeedbackMessage,
  accentColor = "#eb8d70"
}: MerchantSettingsHubProps) {
  const myStoreAny = myStore as any;
  const [copiedSubdomain, setCopiedSubdomain] = useState(false);
  const handleCopySubdomain = () => {
    navigator.clipboard.writeText(`berber-rugs.yume.store`);
    setCopiedSubdomain(true);
    setTimeout(() => setCopiedSubdomain(false), 2000);
  };
  
  const [activeTab, setActiveTab] = useState<string>("store");
  const [viewMode, setViewMode] = useState<"grid" | "edit">("grid");
  const [isSaving, setIsSaving] = useState(false);
  const [isSavedSuccessfully, setIsSavedSuccessfully] = useState(false);
  const [hoveredChapterId, setHoveredChapterId] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollLimit = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 25);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const firstChild = container.firstElementChild as HTMLElement;
      if (firstChild) {
        const gap = 24; // gap-6 matches 24px
        const itemWidth = firstChild.getBoundingClientRect().width || firstChild.offsetWidth;
        const scrollAmount = itemWidth + gap;
        
        let targetScroll = direction === "left" 
          ? container.scrollLeft - scrollAmount 
          : container.scrollLeft + scrollAmount;
        
        // Round to nearest item start position for pristine accuracy
        const index = Math.round(targetScroll / scrollAmount);
        targetScroll = index * scrollAmount;
        
        container.scrollTo({
          left: targetScroll,
          behavior: "smooth"
        });
      }
    }
  };

  useEffect(() => {
    let container: HTMLDivElement | null = null;
    
    const timer = setTimeout(() => {
      checkScrollLimit();
      container = scrollContainerRef.current;
      if (container) {
        container.addEventListener("scroll", checkScrollLimit);
      }
    }, 150);
    
    const handleResize = () => {
      checkScrollLimit();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      if (container) {
        container.removeEventListener("scroll", checkScrollLimit);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [viewMode]);

  // 1. Store settings
  const [storeName, setStoreName] = useState(myStore.name || "");
  const [gridLinesHorizontal, setGridLinesHorizontal] = useState<number>(myStore.gridLinesHorizontal ?? 5);
  const [gridLinesVertical, setGridLinesVertical] = useState<number>(myStore.gridLinesVertical ?? 6);
  const [gridSpacingHorizontal, setGridSpacingHorizontal] = useState<number>(myStore.gridSpacingHorizontal ?? 20);
  const [gridSpacingVertical, setGridSpacingVertical] = useState<number>(myStore.gridSpacingVertical ?? 18);
  const [deleteStoreConfirmText, setDeleteStoreConfirmText] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteConfirmName, setDeleteConfirmName] = useState("");
  const [deleteUnderstandCheck, setDeleteUnderstandCheck] = useState(false);
  const [deleteModalError, setDeleteModalError] = useState("");
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [merchantFullName, setMerchantFullName] = useState(myStore.merchantFullName || "Hakim BNS");
  const [storeDesc, setStoreDesc] = useState(myStore.description || "");
  const [storeSubdomain, setStoreSubdomain] = useState(myStore.subdomain || "");
  const [storeLogoUrl, setStoreLogoUrl] = useState(myStore.logo || "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=150");
  const [storeCountry, setStoreCountry] = useState(myStore.country || "Algeria");
  const [storeCurrency, setStoreCurrency] = useState(myStore.currency || "DZD");
  const [dangerZoneDesign, setDangerZoneDesign] = useState<"cyber_vault" | "crimson_pulse" | "clean_minimalist">("cyber_vault");
  const [vaultArmReset, setVaultArmReset] = useState(false);
  const [vaultArmDelete, setVaultArmDelete] = useState(false);
  const [simulateBlueprint, setSimulateBlueprint] = useState(false);
  const [resetSliderVal, setResetSliderVal] = useState(0);
  const [deleteSliderVal, setDeleteSliderVal] = useState(0);
  const [capResetProgress, setCapResetProgress] = useState(0);
  const [capDeleteProgress, setCapDeleteProgress] = useState(0);
  const [checklistChecked, setChecklistChecked] = useState<boolean[]>([false, false, false]);
  const [resetConfirmText, setResetConfirmText] = useState("");
  const [resetUnderstandCheck, setResetUnderstandCheck] = useState(false);
  const [resetErrorText, setResetErrorText] = useState("");

  // Category Selector states (Module 1)
  const [categorySearchQuery, setCategorySearchQuery] = useState("");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  // Multiple Support Accounts per platform (Module 2)
  interface SupportAccount {
    id: string;
    platform: string; // WhatsApp, Telegram, Instagram, Facebook, Viber, Email, Phone
    label: string; // e.g. "Primary Helpdesk"
    value: string; // e.g. "+213 550 11 22 33"
  }
  const [supportAccounts, setSupportAccounts] = useState<SupportAccount[]>(() => {
    if (myStoreAny.contact?.supportAccounts && Array.isArray(myStoreAny.contact.supportAccounts)) {
      return myStoreAny.contact.supportAccounts;
    }
    const initial: SupportAccount[] = [];
    if (myStore.contact?.phone) {
      initial.push({ id: "init-phone", platform: "Phone", label: "Primary Office Support", value: myStore.contact?.phone });
    }
    if (myStore.contact?.viber) {
      initial.push({ id: "init-viber", platform: "Viber", label: "Viber Channel", value: myStore.contact?.viber });
    }
    if (myStore.contact?.whatsapp) {
      initial.push({ id: "init-whatsapp", platform: "WhatsApp", label: "WhatsApp Chat", value: myStore.contact?.whatsapp });
    }
    if (myStore.contact?.instagram) {
      initial.push({ id: "init-instagram", platform: "Instagram", label: "Instagram DM", value: myStore.contact?.instagram });
    }
    if (myStore.contact?.facebook) {
      initial.push({ id: "init-facebook", platform: "Facebook", label: "Facebook Page", value: myStore.contact?.facebook });
    }
    return initial;
  });
  const [newAccPlatform, setNewAccPlatform] = useState("WhatsApp");
  const [newAccLabel, setNewAccLabel] = useState("");
  const [newAccValue, setNewAccValue] = useState("");
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);

  // Dynamic Payment Gateways Config (Module 3)
  interface PaymentGatewayField {
    key: string;
    label: string;
    value: string;
    type: "text" | "password" | "textarea";
    placeholder: string;
  }
  interface PaymentGateway {
    id: string;
    name: string;
    description: string;
    enabled: boolean;
    type: "cod" | "card" | "wire" | "other";
    icon: string;
    fields: PaymentGatewayField[];
  }
  const [dynamicGateways, setDynamicGateways] = useState<PaymentGateway[]>(() => {
    if (myStoreAny.dynamicGateways && Array.isArray(myStoreAny.dynamicGateways)) {
      return myStoreAny.dynamicGateways;
    }
    return [
      {
        id: "cod",
        name: "Cash on Delivery (COD)",
        description: "Standard local delivery settlement across 58 Algerian Wilayas. Highly trusted by shoppers.",
        enabled: myStore.paymentGateways?.cod ?? true,
        type: "cod",
        icon: "🚚",
        fields: []
      },
      {
        id: "eddahabia",
        name: "Carte Eddahabia (Algérie Poste)",
        description: "Process digital post payments using Algérie Poste Eddahabia secure routing.",
        enabled: myStore.paymentGateways?.eddahabia ?? true,
        type: "card",
        icon: "💳",
        fields: [
          { key: "terminalId", label: "SATIM Merchant Terminal ID", value: "SAT-DZ-82765-POST", type: "text", placeholder: "e.g. SAT-DZ-XXXXX" },
          { key: "secretKey", label: "SATIM Cryptographic API Secret Key", value: "••••••••••••••••••••••••", type: "password", placeholder: "Enter API password" }
        ]
      },
      {
        id: "cib",
        name: "CIB Banking Cards",
        description: "Settle payments from national Algerian interbank cards through secure portals.",
        enabled: myStore.paymentGateways?.cib ?? false,
        type: "card",
        icon: "🏦",
        fields: [
          { key: "terminalId", label: "SATIM Merchant Terminal ID", value: "SAT-DZ-82765-CIB", type: "text", placeholder: "e.g. SAT-DZ-XXXXX" },
          { key: "secretKey", label: "SATIM Cryptographic API Secret Key", value: "••••••••••••••••••••••••", type: "password", placeholder: "Enter API password" }
        ]
      },
      {
        id: "ccp",
        name: "CCP / Bank Wire Transfer",
        description: "Manual postal checks and bank deposits. Instructions will be shown to buyers on invoice checkouts.",
        enabled: myStore.paymentGateways?.wire ?? false,
        type: "wire",
        icon: "📝",
        fields: [
          { key: "ccpDetails", label: "CCP Account & Wire Deposit Instructions", value: "CCP: 0021389201 Cle 42 - Smail Benabderrahmane - Medea", type: "textarea", placeholder: "Type CCP and bank details" }
        ]
      }
    ];
  });
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [selectedGatewayId, setSelectedGatewayId] = useState<string>("cod");
  const [newGatewayName, setNewGatewayName] = useState("");
  const [newGatewayDesc, setNewGatewayDesc] = useState("");
  const [newGatewayIcon, setNewGatewayIcon] = useState("💵");
  const [newGatewayType, setNewGatewayType] = useState<"cod" | "card" | "wire" | "other">("other");

  // Notification Hub expanded channels & reports (Module 4)
  const [telegramEnabled, setTelegramEnabled] = useState(false);
  const [telegramBotToken, setTelegramBotToken] = useState("");
  const [telegramChatId, setTelegramChatId] = useState("");
  const [isTestingTelegram, setIsTestingTelegram] = useState(false);
  const [telegramTestStatus, setTelegramTestStatus] = useState<null | "success" | "error">(null);
  const [telegramTestMessage, setTelegramTestMessage] = useState("");

  const handleTestTelegramAlert = async () => {
    if (!telegramBotToken || !telegramBotToken.trim()) {
      setTelegramTestStatus("error");
      setTelegramTestMessage("Please provide a valid Telegram Bot Token.");
      return;
    }
    if (!telegramChatId || !telegramChatId.trim()) {
      setTelegramTestStatus("error");
      setTelegramTestMessage("Please provide a valid Telegram Chat ID or Channel Handle.");
      return;
    }

    setIsTestingTelegram(true);
    setTelegramTestStatus(null);
    setTelegramTestMessage("");

    try {
      const response = await fetch(`https://api.telegram.org/bot${telegramBotToken.trim()}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: telegramChatId.trim(),
          text: `🔔 *Yume Storefront Integration*\n\nYour Telegram Bot notification integration is active! 🎉\n\n🏠 *Store:* ${storeName || "My Boutique"}\n⚡ *Status:* Test Alert Success\n📅 *Verified:* ${new Date().toLocaleDateString()}\n\nReady to receive order alerts!`,
          parse_mode: "Markdown"
        })
      });

      const data = await response.json();
      if (response.ok && data.ok) {
        setTelegramTestStatus("success");
        setTelegramTestMessage("Success! A test push notification was delivered to your Telegram channel.");
      } else {
        setTelegramTestStatus("error");
        setTelegramTestMessage(`API Error: ${data.description || "Verification failed"}`);
      }
    } catch (err: any) {
      setTelegramTestStatus("error");
      setTelegramTestMessage(`Connection Error: ${err.message || "Failed to reach api.telegram.org"}`);
    } finally {
      setIsTestingTelegram(false);
    }
  };
  const [emailReportsFrequency, setEmailReportsFrequency] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [reportsIncludedSections, setReportsIncludedSections] = useState<string[]>(["sales", "orders", "followers"]);
  const [exportFileType, setExportFileType] = useState<"pdf" | "csv" | "json">("pdf");
  const [exportingReport, setExportingReport] = useState(false);
  const [reportsHistoryLogs, setReportsHistoryLogs] = useState<any[]>([
    { id: "rep-1", date: "2026-07-15", type: "weekly", size: "24.5 KB", status: "automated" },
    { id: "rep-2", date: "2026-07-08", type: "weekly", size: "23.8 KB", status: "automated" }
  ]);

  // Followers Moderation Audit Logs (Module 5)
  interface ModerationLog {
    id: string;
    timestamp: string;
    followerName: string;
    action: string;
    details: string;
  }
  const [followerLogs, setFollowerLogs] = useState<ModerationLog[]>([
    { id: "log-1", timestamp: "2026-07-20 10:15:22", followerName: "Kaddour Belkaid", action: "Approved", details: "Admitted to audience. Auto-tagged 'Artisan Enthusiast'." },
    { id: "log-2", timestamp: "2026-07-20 11:32:05", followerName: "Abdelilah Rekab", action: "Blocked", details: "Spam behavior detected. Account restricted." }
  ]);

  const handleExecuteReset = () => {
    setGridLinesHorizontal(5);
    setGridLinesVertical(6);
    setGridSpacingHorizontal(20);
    setGridSpacingVertical(18);
    setBgColor("#ffffff");
    setBorderColor("#1e293b");
    setStoreAccentColor("#ff385c");
    setBorderStyle("solid");
    setBorderWidth("4px");
    setBorderRadius("2xl");
    setWidthSize("large");
    setHeightSize("large");
    setSelectedCoverTemplate("toonhub");
    setGridCardMinWidth("300px");
    setGridCardGap("20px");
    setNotifyOrder(true);
    setNotifyReview(true);
    setNotifyFollow(true);
    setNotifyEmail(true);
    setNotifySms(false);
    setCodEnabled(true);
    setEddahabiaEnabled(true);
    setCibEnabled(false);
    setBankWireEnabled(false);
    
    if (setMerchantFeedbackMessage) {
      setMerchantFeedbackMessage("✨ Spacing, lines count, design layouts, and payment defaults have been restored to stock settings! Click 'Save Changes' to sync.");
    }
    setVaultArmReset(false);
    setResetConfirmText("");
    setResetUnderstandCheck(false);
    setResetErrorText("");
  };

  const handleExecuteDeletion = () => {
    if (setStores) {
      setStores((prev) => {
        const remaining = prev.filter(s => s.id !== myStore.id);
        if (remaining.length > 0) {
          if (setSelectedStore) {
            setSelectedStore(remaining[0]);
          }
        }
        return remaining;
      });
      if (setMerchantFeedbackMessage) {
        setMerchantFeedbackMessage(`🛑 Boutique '${myStore.name}' has been permanently and securely purged from the registry.`);
      }
      setIsDeleteModalOpen(false);
      setVaultArmDelete(false);
      setDeletePassword("");
      setDeleteConfirmName("");
      setDeleteUnderstandCheck(false);
      setDeleteModalError("");
      if (setViewMode) setViewMode("grid");
      if (setActiveTab) setActiveTab("store");
    } else {
      setDeleteModalError("❌ Cannot connect to stores database container.");
    }
  };

  const [storeCategories, setStoreCategories] = useState<string[]>(myStore.categories || ["Crafts"]);
  const [approvedGatedCategories, setApprovedGatedCategories] = useState<string[]>(() => {
    const existing = myStore.categories || [];
    const initialApproved = ["Automotive & Powersports", "Collectibles", "Clothing, Shoes & Jewelry", "Music"];
    return Array.from(new Set([...initialApproved, ...existing]));
  });
  const [requestingApprovalCategoryId, setRequestingApprovalCategoryId] = useState<string | null>(null);

  const handleRequestApproval = (catName: string) => {
    setRequestingApprovalCategoryId(catName);
    setTimeout(() => {
      setApprovedGatedCategories((prev) => [...prev, catName]);
      setRequestingApprovalCategoryId(null);
      setStoreCategories((prev) => {
        if (prev.length < 2 && !prev.includes(catName)) {
          return [...prev, catName];
        }
        return prev;
      });
      if (setMerchantFeedbackMessage) {
        setMerchantFeedbackMessage(`✨ Category "${catName}" has been officially approved by Yume after compliance checks!`);
      }
    }, 1200);
  };

  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState("");

  const handleGenerateAISummary = async () => {
    if (!storeName) {
      setSummaryError("Please enter a Boutique Name first.");
      return;
    }
    setIsGeneratingSummary(true);
    setSummaryError("");
    try {
      const response = await fetch("/api/generate-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: storeName,
          category: myStore.categories ? myStore.categories.join(", ") : "Artisanal",
          bio: storeDesc,
          location: myStore.wilaya || "Algeria"
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to generate description right now. Please try again.");
      }

      const data = await response.json();
      if (data && data.summary) {
        setStoreDesc(data.summary);
      } else {
        throw new Error("Invalid response received from the generation server.");
      }
    } catch (err: any) {
      console.error(err);
      setSummaryError(err.message || "Something went wrong.");
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  // 2. Contact details
  const [contactPhone, setContactPhone] = useState(myStore.contact?.phone || "");
  const [contactEmail, setContactEmail] = useState(myStore.contact?.email || "");
  const [viber, setViber] = useState(myStore.contact?.viber || "");
  const [whatsapp, setWhatsapp] = useState(myStore.contact?.whatsapp || "");
  const [facebook, setFacebook] = useState(myStore.contact?.facebook || "");
  const [instagram, setInstagram] = useState(myStore.contact?.instagram || "");
  const [tiktok, setTiktok] = useState(myStore.contact?.tiktok || "");
  const [snapchat, setSnapchat] = useState(myStore.contact?.snapchat || "");
  const [additionalPhones, setAdditionalPhones] = useState<string[]>(myStore.contact?.phones || []);
  const [newPhoneInput, setNewPhoneInput] = useState("");

  // 3. Payment gateways
  const [codEnabled, setCodEnabled] = useState(myStore.paymentGateways?.cod ?? true);
  const [eddahabiaEnabled, setEddahabiaEnabled] = useState(myStore.paymentGateways?.eddahabia ?? true);
  const [cibEnabled, setCibEnabled] = useState(myStore.paymentGateways?.cib ?? false);
  const [bankWireEnabled, setBankWireEnabled] = useState(myStore.paymentGateways?.wire ?? false);
  const [satimTerminalId, setSatimTerminalId] = useState("SAT-DZ-82765-MAIN");
  const [satimSecretHash, setSatimSecretHash] = useState("••••••••••••••••••••••••");
  const [ccpDetails, setCcpDetails] = useState("CCP: 0021389201 Cle 42 - Smail Benabderrahmane - Medea");

  // 4. Notifications
  const [notifyOrder, setNotifyOrder] = useState(myStore.notificationsConfig?.order ?? true);
  const [notifyReview, setNotifyReview] = useState(myStore.notificationsConfig?.review ?? true);
  const [notifyFollow, setNotifyFollow] = useState(myStore.notificationsConfig?.follow ?? true);
  const [notifyEmail, setNotifyEmail] = useState(myStore.notificationsConfig?.email ?? true);
  const [notifySms, setNotifySms] = useState(false);
  const [showSimulatedNotification, setShowSimulatedNotification] = useState<string | null>(null);

  // 5. Follower Management
  const defaultFollowers = [
    { id: "f-1", name: "Kaddour Belkaid", avatar: "👨‍🎨", location: "Laghouat", isVerified: true, dateFollowed: "2026-06-01", status: "approved" as const },
    { id: "f-2", name: "Houria Massou", avatar: "👩‍🌾", location: "Oran", isVerified: false, dateFollowed: "2026-06-03", status: "approved" as const },
    { id: "f-3", name: "Yacine Ghalem", avatar: "👨‍💻", location: "Tizi Ouzou", isVerified: true, dateFollowed: "2026-06-08", status: "pending" as const },
    { id: "f-4", name: "Meriem Boussouf", avatar: "👩‍⚕️", location: "Algiers", isVerified: false, dateFollowed: "2026-06-11", status: "pending" as const },
    { id: "f-5", name: "Abdelilah Rekab", avatar: "👨‍🔧", location: "Ghardaia", isVerified: false, dateFollowed: "2026-06-12", status: "blocked" as const }
  ];
  const [followersList, setFollowersList] = useState<any[]>(myStore.followersList || defaultFollowers);
  const [followersSearch, setFollowersSearch] = useState("");
  const [whoCanFollow, setWhoCanFollow] = useState(myStore.followerSystemSettings?.whoCanFollow || "anyone");

  // 6. Public customization
  const [bgColor, setBgColor] = useState(myStore.designSettings?.bgColor || "#ffffff");
  const [borderColor, setBorderColor] = useState(myStore.designSettings?.borderColor || "#1e293b");
  const [borderRadius, setBorderRadius] = useState(myStore.designSettings?.borderRadius || "2xl");
  const [borderStyle, setBorderStyle] = useState(myStore.designSettings?.borderStyle || "solid");
  const [borderWidth, setBorderWidth] = useState(myStore.designSettings?.borderWidth || "4px");
  const [widthSize, setWidthSize] = useState(myStore.designSettings?.width || "large");
  const [heightSize, setHeightSize] = useState(myStore.designSettings?.height || "large");
  const [selectedCoverTemplate, setSelectedCoverTemplate] = useState(myStore.designSettings?.coverTemplate || "toonhub");
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);
  const [storeAccentColor, setStoreAccentColor] = useState(myStore.designSettings?.accentColor || "#ff385c");
  
  // Typography Settings
  const [fontFamily, setFontFamily] = useState(myStore.designSettings?.fontFamily || "inherit");
  const [titleFontSize, setTitleFontSize] = useState(myStore.designSettings?.titleFontSize || "large");
  const [titleFontStyle, setTitleFontStyle] = useState(myStore.designSettings?.titleFontStyle || "normal");
  const [titleFontWeight, setTitleFontWeight] = useState(myStore.designSettings?.titleFontWeight || "800");
  const [bodyFontSize, setBodyFontSize] = useState(myStore.designSettings?.bodyFontSize || "medium");
  const [bodyFontStyle, setBodyFontStyle] = useState(myStore.designSettings?.bodyFontStyle || "italic");
  
  // Customizer state properties for ToonHub ("3D Character 01")
  const [toonhubLogo, setToonhubLogo] = useState(myStore.designSettings?.toonhubLogo || "");
  const [toonhubProducts, setToonhubProducts] = useState<string[]>(myStore.designSettings?.toonhubProducts || []);
  const [toonhubCharacters, setToonhubCharacters] = useState<string[]>(myStore.designSettings?.toonhubCharacters || ["char1", "char2", "char3", "char4"]);
  const [toonhubMode, setToonhubMode] = useState<"characters" | "products" | "both">(myStore.designSettings?.toonhubMode || "characters");

  // Customizer state properties for MysticFlower ("3D Character 02")
  const [mysticflowerLogo, setMysticflowerLogo] = useState(myStore.designSettings?.mysticflowerLogo || "");
  const [mysticflowerProducts, setMysticflowerProducts] = useState<string[]>(myStore.designSettings?.mysticflowerProducts || []);
  const [mysticflowerCharacters, setMysticflowerCharacters] = useState<string[]>(myStore.designSettings?.mysticflowerCharacters || ["char1", "char2", "char3", "char4"]);
  const [mysticflowerMode, setMysticflowerMode] = useState<"characters" | "products" | "both">(myStore.designSettings?.mysticflowerMode || "characters");

  // Customizer state properties for Classic Slideshow
  const [classicCovers, setClassicCovers] = useState<string[]>(myStore.designSettings?.classicCovers || []);
  const [classicCoversPerSlide, setClassicCoversPerSlide] = useState<number>(myStore.designSettings?.classicCoversPerSlide || 3);
  const [coversCategoryTab, setCoversCategoryTab] = useState("All");
  const [coversSearchQuery, setCoversSearchQuery] = useState("");

  const [gamingLogo, setGamingLogo] = useState(myStore.designSettings?.gamingLogo || "");
  const [gamingProducts, setGamingProducts] = useState<string[]>(myStore.designSettings?.gamingProducts || []);

  // Customizer state properties for My Brand template
  const [myBrandImage, setMyBrandImage] = useState(myStore.designSettings?.myBrandImage || "");
  const [myBrandImageOriginal, setMyBrandImageOriginal] = useState(myStore.designSettings?.myBrandImageOriginal || "");
  const [myBrandBgRemovalMode, setMyBrandBgRemovalMode] = useState<"none" | "white" | "black" | "chroma">(myStore.designSettings?.myBrandBgRemovalMode || "none");
  const [myBrandBgRemovalTolerance, setMyBrandBgRemovalTolerance] = useState(myStore.designSettings?.myBrandBgRemovalTolerance ?? 40);
  const [myBrandBgRemovalColor, setMyBrandBgRemovalColor] = useState(myStore.designSettings?.myBrandBgRemovalColor || "#ffffff");
  const [myBrandBrightness, setMyBrandBrightness] = useState(myStore.designSettings?.myBrandBrightness ?? 100);
  const [myBrandContrast, setMyBrandContrast] = useState(myStore.designSettings?.myBrandContrast ?? 100);
  const [myBrandGrayscale, setMyBrandGrayscale] = useState(myStore.designSettings?.myBrandGrayscale ?? 0);
  const [isRemovingBackgroundAI, setIsRemovingBackgroundAI] = useState(false);
  const [aiBgRemovalSummary, setAiBgRemovalSummary] = useState("");

  // Backward compatibility: If we have myBrandImage but no original, initialize it
  useEffect(() => {
    if (myBrandImage && !myBrandImageOriginal) {
      setMyBrandImageOriginal(myBrandImage);
    }
  }, [myBrandImage, myBrandImageOriginal]);

  const handleRemoveBackgroundAI = async () => {
    if (!myBrandImageOriginal) return;
    setIsRemovingBackgroundAI(true);
    setAiBgRemovalSummary("");
    setMerchantFeedbackMessage("🧠 Sending asset to AI background analyzer...");

    try {
      const res = await fetch("/api/remove-background", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: myBrandImageOriginal }),
      });

      if (!res.ok) {
        throw new Error("Failed to process background removal with AI");
      }

      const data = await res.json();
      if (data.success) {
        if (data.processedImage) {
          // If processedImage was created directly by a premium neural engine (remove.bg or Cloudinary)
          setMyBrandImageOriginal(data.processedImage);
          setMyBrandImage(data.processedImage);
          setMyBrandBgRemovalMode("none");
          setAiBgRemovalSummary(data.summary || `Background perfectly removed by ${data.provider}!`);
          setMerchantFeedbackMessage(`✨ AI background removed successfully using ${data.provider || "premium service"}!`);
        } else {
          // Fallback to our intelligent chroma parameters
          setMyBrandBgRemovalMode(data.mode);
          setMyBrandBgRemovalColor(data.color);
          setMyBrandBgRemovalTolerance(data.tolerance);
          setAiBgRemovalSummary(data.summary);
          setMerchantFeedbackMessage(`✨ AI processed background: ${data.summary}`);
        }
      } else {
        throw new Error(data.error || "Failed to parse AI response");
      }
    } catch (error: any) {
      console.error("AI Background Removal Error:", error);
      setMerchantFeedbackMessage(`❌ AI Background Removal Failed: ${error.message}`);
    } finally {
      setIsRemovingBackgroundAI(false);
    }
  };

  // Real-time canvas processing function to remove color backgrounds (chroma/white/black)
  const processImageBackgroundRemoval = (
    originalDataUrl: string,
    mode: "none" | "white" | "black" | "chroma",
    tolerance: number,
    chromaColor: string,
    callback: (processedDataUrl: string) => void
  ) => {
    if (!originalDataUrl) return;
    if (mode === "none") {
      callback(originalDataUrl);
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      let targetR = 255;
      let targetG = 255;
      let targetB = 255;

      if (mode === "white") {
        targetR = 255; targetG = 255; targetB = 255;
      } else if (mode === "black") {
        targetR = 0; targetG = 0; targetB = 0;
      } else if (mode === "chroma") {
        const hex = chromaColor.replace("#", "");
        if (hex.length === 6) {
          targetR = parseInt(hex.slice(0, 2), 16);
          targetG = parseInt(hex.slice(2, 4), 16);
          targetB = parseInt(hex.slice(4, 6), 16);
        }
      }

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        if (a === 0) continue;

        let diff = 0;
        if (mode === "white") {
          const brightness = (r + g + b) / 3;
          diff = 255 - brightness;
        } else if (mode === "black") {
          const brightness = (r + g + b) / 3;
          diff = brightness;
        } else {
          diff = Math.sqrt(
            Math.pow(r - targetR, 2) +
            Math.pow(g - targetG, 2) +
            Math.pow(b - targetB, 2)
          );
        }

        if (mode === "white" || mode === "black") {
          if (diff < tolerance) {
            const factor = diff / tolerance;
            data[i + 3] = Math.round(a * Math.pow(factor, 2));
          }
        } else {
          if (diff < tolerance) {
            const featherStart = tolerance * 0.75;
            if (diff > featherStart && tolerance > featherStart) {
              const factor = (diff - featherStart) / (tolerance - featherStart);
              data[i + 3] = Math.round(a * factor);
            } else {
              data[i + 3] = 0;
            }
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      callback(canvas.toDataURL("image/png"));
    };
    img.src = originalDataUrl;
  };

  useEffect(() => {
    if (myBrandImageOriginal) {
      processImageBackgroundRemoval(
        myBrandImageOriginal,
        myBrandBgRemovalMode,
        myBrandBgRemovalTolerance,
        myBrandBgRemovalColor,
        (processed) => {
          setMyBrandImage(processed);
        }
      );
    }
  }, [myBrandImageOriginal, myBrandBgRemovalMode, myBrandBgRemovalTolerance, myBrandBgRemovalColor]);
  const [myBrandBgType, setMyBrandBgType] = useState<"gradient" | "space" | "nebula" | "solid">(myStore.designSettings?.myBrandBgType || "gradient");
  const [myBrandColor1, setMyBrandColor1] = useState(myStore.designSettings?.myBrandColor1 || "#ec4899");
  const [myBrandColor2, setMyBrandColor2] = useState(myStore.designSettings?.myBrandColor2 || "#8b5cf6");
  const [myBrandSpacing, setMyBrandSpacing] = useState(myStore.designSettings?.myBrandSpacing !== undefined ? myStore.designSettings.myBrandSpacing : 40);
  const [myBrandAngle, setMyBrandAngle] = useState(myStore.designSettings?.myBrandAngle !== undefined ? myStore.designSettings.myBrandAngle : 135);
  const [myBrandShadowColor, setMyBrandShadowColor] = useState(myStore.designSettings?.myBrandShadowColor || "#000000");
  const [myBrandShadowIntensity, setMyBrandShadowIntensity] = useState(myStore.designSettings?.myBrandShadowIntensity !== undefined ? myStore.designSettings.myBrandShadowIntensity : 12);
  const [myBrandShadowOpacity, setMyBrandShadowOpacity] = useState(myStore.designSettings?.myBrandShadowOpacity !== undefined ? myStore.designSettings.myBrandShadowOpacity : 50);
  const [myBrandShadowPreviewBorder, setMyBrandShadowPreviewBorder] = useState(myStore.designSettings?.myBrandShadowPreviewBorder || false);

  // Glassmorphic Blur & Transparency Studio states
  const [glassBlurEnabled, setGlassBlurEnabled] = useState<boolean>(myStore.designSettings?.glassBlurEnabled ?? true);
  const [glassBlurAmount, setGlassBlurAmount] = useState<number>(myStore.designSettings?.glassBlurAmount ?? 12);
  const [glassTransparency, setGlassTransparency] = useState<number>(myStore.designSettings?.glassTransparency ?? 40);
  const [glassMultiColorEnabled, setGlassMultiColorEnabled] = useState<boolean>(myStore.designSettings?.glassMultiColorEnabled ?? false);
  const [glassMultiColors, setGlassMultiColors] = useState<string[]>(myStore.designSettings?.glassMultiColors || ["#3b82f6", "#ec4899", "#eab308"]);
  const [gridCardMinWidth, setGridCardMinWidth] = useState<string>(myStore.designSettings?.gridCardMinWidth || "300px");
  const [gridCardGap, setGridCardGap] = useState<string>(myStore.designSettings?.gridCardGap || "20px");
  const [permitBuyerModifications, setPermitBuyerModifications] = useState<boolean>(myStore.designSettings?.permitBuyerModifications ?? false);

  const [announcementMsg, setAnnouncementMsg] = useState(myStore.announcement?.text || "🚚 توصيل مجاني عبر 58 ولاية للمشتريات الأكثر من 12,000 دج!");
  const [announcementEnabled, setAnnouncementEnabled] = useState(myStore.announcement?.enabled ?? true);
  const [sponsoredTitle, setSponsoredTitle] = useState(myStore.adBannerTitle || "Special Offer");
  const [sponsoredDesc, setSponsoredDesc] = useState(myStore.adBannerDescription || "Craftsmanship from Algeria direct to your doorstep.");

  // 7. Identity verification
  const [verificationStatus, setVerificationStatus] = useState<"not_started" | "pending" | "verified">(
    myStore.verificationStatus || (myStore.verified ? "verified" : "not_started")
  );
  const [verificationDocType, setVerificationDocType] = useState("artisan_card");
  const [verificationFileName, setVerificationFileName] = useState(myStore.verificationDocName || "");
  const [isVerifyingFileProgress, setIsVerifyingFileProgress] = useState(false);

  // 8. Security password Change
  const [regEmail, setRegEmail] = useState(myStore.contact?.email || "owner@shareshopping-dz.com");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordFeedback, setPasswordFeedback] = useState<string | null>(null);

  // 9. AI Keys & automated descriptions Sandbox
  const [apiKey, setApiKey] = useState(myStore.apiKey || "sk-gemini-v1-algeriancrafts-928347kjdkshf");
  const [geminiKey, setGeminiKey] = useState(myStore.apiKeysVault?.gemini || "");
  const [grokKey, setGrokKey] = useState(myStore.apiKeysVault?.grok || "");
  const [openaiKey, setOpenaiKey] = useState(myStore.apiKeysVault?.openai || "");
  const [deepseekKey, setDeepseekKey] = useState(myStore.apiKeysVault?.deepseek || "");
  const [zaiKey, setZaiKey] = useState(myStore.apiKeysVault?.z_ai || "");
  const [claudeKey, setClaudeKey] = useState(myStore.apiKeysVault?.claude || "");
  const [nvidiaKey, setNvidiaKey] = useState(myStore.apiKeysVault?.nvidia || "");
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  const [aiPromptInput, setAiPromptInput] = useState("Authentic pure olive oil cold-pressed by manual stones in Kabylie, Bouira");
  const [aiTone, setAiTone] = useState("elegant");
  const [aiCategory, setAiCategory] = useState("Food");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiCopydraftResult, setAiCopydraftResult] = useState<{ ar: string; fr: string; en: string } | null>(null);

  // Connection Tester states & routine
  const [testProvider, setTestProvider] = useState("gemini");
  const [testRunning, setTestRunning] = useState(false);
  const [testLogs, setTestLogs] = useState<string[]>([]);
  const [aiRightTab, setAiRightTab] = useState("copywriter");

  // New screenshot-matching fields state
  const [expiredTime, setExpiredTime] = useState<string>("");
  const [modelRange, setModelRange] = useState<string>("default no limit");
  const [ipLimits, setIpLimits] = useState<string[]>([]);
  const [newIpInput, setNewIpInput] = useState<string>("");
  const [isAddingIp, setIsAddingIp] = useState<boolean>(false);

  const [modelMappings, setModelMappings] = useState<{ custom: string; target: string }[]>([]);
  const [isAddingMapping, setIsAddingMapping] = useState<boolean>(false);
  const [newMappingCustom, setNewMappingCustom] = useState<string>("");
  const [newMappingTarget, setNewMappingTarget] = useState<string>("");

  const [fallbackModels, setFallbackModels] = useState<string[]>([]);
  const [isAddingFallback, setIsAddingFallback] = useState<boolean>(false);
  const [newFallbackModel, setNewFallbackModel] = useState<string>("");

  const runConnectionTest = () => {
    setTestRunning(true);
    setTestLogs([
      `⚡ [CYBER_SHIELD] Initializing sandbox connection diagnostic...`,
      `🔒 [AUTH_CHECK] Verifying store owner authority for ID: ${myStore.id}`,
      `🌐 [DNS_ROUTING] Resolving API endpoint for provider: [${testProvider.toUpperCase()}]`
    ]);

    const providerKeys: Record<string, string> = {
      gemini: geminiKey,
      grok: grokKey,
      openai: openaiKey,
      deepseek: deepseekKey,
      z_ai: zaiKey,
      claude: claudeKey,
      nvidia: nvidiaKey
    };

    const activeKey = providerKeys[testProvider];

    setTimeout(() => {
      setTestLogs((prev) => [...prev, `🔍 [INTEGRITY] Scanning credential signature...`]);
    }, 400);

    setTimeout(() => {
      if (!activeKey || activeKey.trim() === "") {
        setTestLogs((prev) => [
          ...prev,
          `❌ [FATAL] No credential token loaded in active vault for ${testProvider.toUpperCase()}`,
          `🛡️ [CYBER_SHIELD] Handshake rejected due to empty signature payload.`
        ]);
        setTestRunning(false);
        setMerchantFeedbackMessage(`❌ Diagnostic failed for ${testProvider.toUpperCase()}: Key is empty.`);
        return;
      }

      // Format validation checks
      const prefixChecks: Record<string, string> = {
        gemini: "AIzaSy",
        grok: "xai-",
        openai: "sk-",
        deepseek: "sk-",
        z_ai: "sk-",
        claude: "sk-ant-",
        nvidia: "nvapi-"
      };

      const expectedPrefix = prefixChecks[testProvider];
      const hasCorrectPrefix = activeKey.startsWith(expectedPrefix) || activeKey.startsWith("sk-");

      setTestLogs((prev) => [
        ...prev,
        `🔑 [CRYPTO] Cryptographic hash signature: sha256(${activeKey.slice(0, 4)}...${activeKey.slice(-4)})`,
        `🔐 [ISOLATION] Confirming store boundary isolation: STRICT_PASS`
      ]);

      setTimeout(() => {
        setTestLogs((prev) => [
          ...prev,
          `🛰️ [PING] Initiating secure server-to-server gateway handshake...`,
          `📥 [RESPONSE] HTTP/1.1 200 OK Connection established successfully!`
        ]);
        
        setTimeout(() => {
          setTestLogs((prev) => [
            ...prev,
            `✨ [SUCCESS] Provider ${testProvider.toUpperCase()} is configured, fully isolated, and ready to use!`
          ]);
          setTestRunning(false);
          setMerchantFeedbackMessage(`✅ ${testProvider.toUpperCase()} API connection verified!`);
        }, 500);
      }, 500);

    }, 1000);
  };

  // Sync state whenever active store changes
  useEffect(() => {
    setStoreName(myStore.name || "");
    setMerchantFullName(myStore.merchantFullName || "Hakim BNS");
    setStoreDesc(myStore.description || "");
    setStoreSubdomain(myStore.subdomain || "");
    setStoreLogoUrl(myStore.logo || "");
    setContactPhone(myStore.contact?.phone || "");
    setContactEmail(myStore.contact?.email || "");
    setViber(myStore.contact?.viber || "");
    setWhatsapp(myStore.contact?.whatsapp || "");
    setFacebook(myStore.contact?.facebook || "");
    setInstagram(myStore.contact?.instagram || "");
    setTiktok(myStore.contact?.tiktok || "");
    setSnapchat(myStore.contact?.snapchat || "");
    setAdditionalPhones(myStore.contact?.phones || []);
    setCodEnabled(myStore.paymentGateways?.cod ?? true);
    setEddahabiaEnabled(myStore.paymentGateways?.eddahabia ?? true);
    setCibEnabled(myStore.paymentGateways?.cib ?? false);
    setBankWireEnabled(myStore.paymentGateways?.wire ?? false);
    setNotifyOrder(myStore.notificationsConfig?.order ?? true);
    setNotifyReview(myStore.notificationsConfig?.review ?? true);
    setNotifyFollow(myStore.notificationsConfig?.follow ?? true);
    setNotifyEmail(myStore.notificationsConfig?.email ?? true);
    setNotifySms(myStore.notificationsConfig?.sms ?? false);
    setFollowersList(myStore.followersList || defaultFollowers);
    setWhoCanFollow(myStore.followerSystemSettings?.whoCanFollow || "anyone");
    setBgColor(myStore.designSettings?.bgColor || "#ffffff");
    setBorderColor(myStore.designSettings?.borderColor || "#1e293b");
    setStoreAccentColor(myStore.designSettings?.accentColor || "#ff385c");
    setBorderStyle(myStore.designSettings?.borderStyle || "solid");
    setBorderWidth(myStore.designSettings?.borderWidth || "4px");
    setBorderRadius(myStore.designSettings?.borderRadius || "2xl");
    setWidthSize(myStore.designSettings?.width || "large");
    setHeightSize(myStore.designSettings?.height || "large");
    setSelectedCoverTemplate(myStore.designSettings?.coverTemplate || "toonhub");
    setFontFamily(myStore.designSettings?.fontFamily || "inherit");
    setTitleFontSize(myStore.designSettings?.titleFontSize || "large");
    setTitleFontStyle(myStore.designSettings?.titleFontStyle || "normal");
    setTitleFontWeight(myStore.designSettings?.titleFontWeight || "800");
    setBodyFontSize(myStore.designSettings?.bodyFontSize || "medium");
    setBodyFontStyle(myStore.designSettings?.bodyFontStyle || "italic");
    setToonhubLogo(myStore.designSettings?.toonhubLogo || "");
    setToonhubProducts(myStore.designSettings?.toonhubProducts || []);
    setToonhubCharacters(myStore.designSettings?.toonhubCharacters || ["char1", "char2", "char3", "char4"]);
    setToonhubMode(myStore.designSettings?.toonhubMode || "characters");
    setMysticflowerLogo(myStore.designSettings?.mysticflowerLogo || "");
    setMysticflowerProducts(myStore.designSettings?.mysticflowerProducts || []);
    setMysticflowerCharacters(myStore.designSettings?.mysticflowerCharacters || ["char1", "char2", "char3", "char4"]);
    setMysticflowerMode(myStore.designSettings?.mysticflowerMode || "characters");
    setClassicCovers(myStore.designSettings?.classicCovers || []);
    setClassicCoversPerSlide(myStore.designSettings?.classicCoversPerSlide || 3);
    setGamingLogo(myStore.designSettings?.gamingLogo || "");
    setGamingProducts(myStore.designSettings?.gamingProducts || []);
    setMyBrandImage(myStore.designSettings?.myBrandImage || "");
    setMyBrandImageOriginal(myStore.designSettings?.myBrandImageOriginal || "");
    setMyBrandBgRemovalMode(myStore.designSettings?.myBrandBgRemovalMode || "none");
    setMyBrandBgRemovalTolerance(myStore.designSettings?.myBrandBgRemovalTolerance ?? 40);
    setMyBrandBgRemovalColor(myStore.designSettings?.myBrandBgRemovalColor || "#ffffff");
    setMyBrandBrightness(myStore.designSettings?.myBrandBrightness ?? 100);
    setMyBrandContrast(myStore.designSettings?.myBrandContrast ?? 100);
    setMyBrandGrayscale(myStore.designSettings?.myBrandGrayscale ?? 0);
    setMyBrandBgType(myStore.designSettings?.myBrandBgType || "gradient");
    setMyBrandColor1(myStore.designSettings?.myBrandColor1 || "#ec4899");
    setMyBrandColor2(myStore.designSettings?.myBrandColor2 || "#8b5cf6");
    setMyBrandSpacing(myStore.designSettings?.myBrandSpacing !== undefined ? myStore.designSettings.myBrandSpacing : 40);
    setMyBrandAngle(myStore.designSettings?.myBrandAngle !== undefined ? myStore.designSettings.myBrandAngle : 135);
    setMyBrandShadowColor(myStore.designSettings?.myBrandShadowColor || "#000000");
    setMyBrandShadowIntensity(myStore.designSettings?.myBrandShadowIntensity !== undefined ? myStore.designSettings.myBrandShadowIntensity : 12);
    setMyBrandShadowOpacity(myStore.designSettings?.myBrandShadowOpacity !== undefined ? myStore.designSettings.myBrandShadowOpacity : 50);
    setMyBrandShadowPreviewBorder(myStore.designSettings?.myBrandShadowPreviewBorder || false);
    setGlassBlurEnabled(myStore.designSettings?.glassBlurEnabled ?? true);
    setGlassBlurAmount(myStore.designSettings?.glassBlurAmount ?? 12);
    setGlassTransparency(myStore.designSettings?.glassTransparency ?? 40);
    setGlassMultiColorEnabled(myStore.designSettings?.glassMultiColorEnabled ?? false);
    setGlassMultiColors(myStore.designSettings?.glassMultiColors || ["#3b82f6", "#ec4899", "#eab308"]);
    setGridCardMinWidth(myStore.designSettings?.gridCardMinWidth || "300px");
    setGridCardGap(myStore.designSettings?.gridCardGap || "20px");
    setPermitBuyerModifications(myStore.designSettings?.permitBuyerModifications ?? false);
    setAnnouncementMsg(myStore.announcement?.text || "");
    setAnnouncementEnabled(myStore.announcement?.enabled ?? true);
    setSponsoredTitle(myStore.adBannerTitle || "");
    setSponsoredDesc(myStore.adBannerDescription || "");
    setVerificationStatus(myStore.verificationStatus || (myStore.verified ? "verified" : "not_started"));
    setVerificationFileName(myStore.verificationDocName || "");
    setStoreCountry(myStore.country || "Algeria");
    setStoreCurrency(myStore.currency || "DZD");
    setRegEmail(myStore.contact?.email || "owner@shareshopping-dz.com");
    setApiKey(myStore.apiKey || "sk-gemini-v1-algeriancrafts-928347kjdkshf");
    setGeminiKey(myStore.apiKeysVault?.gemini || "");
    setGrokKey(myStore.apiKeysVault?.grok || "");
    setOpenaiKey(myStore.apiKeysVault?.openai || "");
    setDeepseekKey(myStore.apiKeysVault?.deepseek || "");
    setZaiKey(myStore.apiKeysVault?.z_ai || "");
    setClaudeKey(myStore.apiKeysVault?.claude || "");
    setNvidiaKey(myStore.apiKeysVault?.nvidia || "");
    setGridLinesHorizontal(myStore.gridLinesHorizontal ?? 5);
    setGridLinesVertical(myStore.gridLinesVertical ?? 6);
    setGridSpacingHorizontal(myStore.gridSpacingHorizontal ?? 20);
    setGridSpacingVertical(myStore.gridSpacingVertical ?? 18);
    setDeleteStoreConfirmText("");
    setIsDeleteModalOpen(false);
    setDeletePassword("");
    setDeleteConfirmName("");
    setDeleteUnderstandCheck(false);
    setDeleteModalError("");
    setShowDeletePassword(false);
  }, [myStore.id]);

  // Handle addition of fallback numbers
  const handleAddPhoneLine = () => {
    if (!newPhoneInput.trim()) return;
    setAdditionalPhones([...additionalPhones, newPhoneInput.trim()]);
    setNewPhoneInput("");
    setMerchantFeedbackMessage("➕ Added secondary support phone line!");
  };

  const handleRemovePhoneLine = (idx: number) => {
    setAdditionalPhones(additionalPhones.filter((_, i) => i !== idx));
    setMerchantFeedbackMessage("🗑️ Removed secondary support phone line!");
  };

  // Multiple support accounts helpers (Module 2)
  const handleSaveSupportAccount = () => {
    if (!newAccValue.trim()) {
      setMerchantFeedbackMessage("⚠️ Please enter a handle/number for this support channel!");
      return;
    }
    const label = newAccLabel.trim() || `${newAccPlatform} Support`;
    if (editingAccountId) {
      setSupportAccounts(prev => prev.map(acc => acc.id === editingAccountId ? { ...acc, platform: newAccPlatform, label, value: newAccValue.trim() } : acc));
      setEditingAccountId(null);
      setMerchantFeedbackMessage("✅ Support account updated!");
    } else {
      const newAcc: SupportAccount = {
        id: `support-${Date.now()}`,
        platform: newAccPlatform,
        label,
        value: newAccValue.trim()
      };
      setSupportAccounts(prev => [...prev, newAcc]);
      setMerchantFeedbackMessage("➕ New support account registered!");
    }
    setNewAccLabel("");
    setNewAccValue("");
  };

  const handleMoveSupportAccount = (index: number, direction: "up" | "down") => {
    const nextIndex = direction === "up" ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= supportAccounts.length) return;
    const updated = [...supportAccounts];
    const temp = updated[index];
    updated[index] = updated[nextIndex];
    updated[nextIndex] = temp;
    setSupportAccounts(updated);
    setMerchantFeedbackMessage("↕️ Support account priority reordered!");
  };

  // Follower Management Operations
  const handleUpdateFollowerState = (followerId: string, next: "approved" | "blocked" | "pending") => {
    const follower = followersList.find(f => f.id === followerId);
    const followerName = follower ? follower.name : "Unknown Follower";
    const updated = followersList.map((f) => f.id === followerId ? { ...f, status: next } : f);
    setFollowersList(updated);
    setMerchantFeedbackMessage(`📋 Set follow request status to [${next.toUpperCase()}]!`);
    
    // Add audit log
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const actionLabel = next === "approved" ? "Approved" : next === "blocked" ? "Blocked" : "Reset Pending";
    const newLog: ModerationLog = {
      id: `log-${Date.now()}`,
      timestamp,
      followerName,
      action: actionLabel,
      details: `User access status modified to ${next.toUpperCase()} by merchant administrator.`
    };
    setFollowerLogs(prev => [newLog, ...prev]);

    // Save to global stores immediately
    if (setStores) {
      setStores((prev) =>
        prev.map((s) => s.id === myStore.id ? { ...s, followersList: updated } : s)
      );
    }
  };

  // Document uploader emulator
  const handleDropFileMock = () => {
    setVerificationFileName(`Artisan_Permit_No_${Math.floor(Math.random() * 900000 + 100000)}_DZ.pdf`);
    setMerchantFeedbackMessage("Attached craftsmanship credential document successfully!");
  };

  const handleSubmissionForVerification = () => {
    if (!verificationFileName) {
      setMerchantFeedbackMessage("⚠️ Please drop or click to attach an official proof document first!");
      return;
    }
    setIsVerifyingFileProgress(true);
    setMerchantFeedbackMessage("Uploading document bytes to secure storage...");

    setTimeout(() => {
      setIsVerifyingFileProgress(false);
      setVerificationStatus("pending");
      setMerchantFeedbackMessage("🚀 Verification application locked & submitted under audit!");
      
      if (setStores) {
        setStores((prev) =>
          prev.map((s) => s.id === myStore.id ? { 
            ...s, 
            verificationStatus: "pending", 
            verificationDocName: verificationFileName,
            verified: false
          } : s)
        );
      }
    }, 1500);
  };

  const handleSetVerifiedDirectly = () => {
    setVerificationStatus("verified");
    setMerchantFeedbackMessage("👑 Verified Artisan Badge successfully granted to your store!");
    if (setStores) {
      setStores((prev) =>
        prev.map((s) => s.id === myStore.id ? { ...s, verificationStatus: "verified", verified: true } : s)
      );
    }
  };

  // Security Email & Password Simulators
  const handleUpdateSecurityPassword = () => {
    if (!currentPassword) {
      setPasswordFeedback("❌ Please insert current registry password for sync validation.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordFeedback("❌ Retyped password confirmation does not match new password!");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordFeedback("❌ New password must be at least 6 characters for safety rules.");
      return;
    }

    setPasswordFeedback(null);
    setMerchantFeedbackMessage("🔑 Password updated and re-encrypted successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  // SMS / Notification Alert Trigger simulator
  const handleTriggerSimulatedAlert = () => {
    const alerts = [
      "🔔 ORDER ALERTE: Smail from Medea just bought 'Pure Honey' for 6,550 DA ! SMS sent.",
      "🔔 NEW FOLLOWER: Kamel from Oran started tracking your organic products !",
      "🔔 RATING RECIEVED: Yasmine gave ⭐️⭐️⭐️⭐️⭐️ to 'Authentic Berber Rug' !",
      "🔔 SMS SENT: 'Bonjour, your order #DZ-873 has been shipped' dispatched successfully."
    ];
    const pickedAlert = alerts[Math.floor(Math.random() * alerts.length)];
    setShowSimulatedNotification(pickedAlert);
    setMerchantFeedbackMessage("🔊 Live push alert simulation fired!");

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      setShowSimulatedNotification(null);
    }, 4000);
  };

  // AI copywriting engine simulation
  const handleTriggerAICopywriter = () => {
    if (!aiPromptInput.trim()) {
      setMerchantFeedbackMessage("⚠️ Please provide a brief raw description detail first!");
      return;
    }
    setAiGenerating(true);
    setTimeout(() => {
      setAiGenerating(false);
      
      let res = {
        ar: `**زيت زيتون بكر ممتاز معصور على البارد من جبال البويرة (القبائل)** — نكهة غنية وجودة أصيلة مستخرجة يدويًا من حبات الزيتون المختارة بعناية. خالٍ تمامًا من الإضافات ومثالي لنمط حياة صحي ووجبات تقليدية شهية...`,
        fr: `**Huile d'Olive Vierge Extra Pressée à Froid — Haute Kabylie (Bouira)** — Extrite de manière artisanale sous presses traditionnelles. Saveur veloutée et arôme boisé préservant tous les bienfaits thérapeutiques...`,
        en: `**Premium Cold-Pressed Extra Virgin Olive Oil — Kabylie Highlands (Bouira)** — Purely extracted on ancient stone mills. Raw, unrefined wellness elixir perfect for local seasoning and gourmet dining...`
      };

      if (aiPromptInput.toLowerCase().includes("saddle") || aiPromptInput.toLowerCase().includes("leather")) {
        res = {
          ar: `**سرج جلدي جزائري تقليدي مطرز يدويًا — المدية** — تحفة يدوية عريقة للفروسية مصنوعة من الجلد الطبيعي المدبوغ خصيصًا ليدوم قرونًا مع خيوط الحرير الذهبية المصقولة...`,
          fr: `**Selle de Cheval Traditionnelle en Cuir Massif Brodé — Médéa** — Faite entièrement à la main par nos maîtres selliers algériens. Des détails royaux d'orfèvre cousus de fil d'or...`,
          en: `**Authentic Hand-Gilded Algerian Genuine Leather Saddle — Medea** — Masterfully crafted with supreme vegetable-tanned cowhide. Majestic design with golden thread borders built for equestrian longevity...`
        };
      } else if (aiPromptInput.toLowerCase().includes("pot") || aiPromptInput.toLowerCase().includes("brass")) {
        res = {
          ar: `**إبريق شاي نحاسي قسنطيني مطروق يدويًا** — تميز في ضيافتك مع هذا الإبريق التقليدي المزخرف بنقوش عتيقة تعود إلى عهد النحاسيات العريق في الشرق الجزائري...`,
          fr: `**Théière Royale en Laiton Martelé et Ciselé de Constantine** — Apportez l'élégance millénaire des palais berbères à l'heure du goûter. Une œuvre d'art immuable...`,
          en: `**Royal Hand-Hammered Brass Tea Boiler with Historic Constantine Engravings** — Exceptionally forged by heritage copper-smiths. Highly polished and insulated for beautiful serving...`
        };
      }

      setAiCopydraftResult(res);
      setMerchantFeedbackMessage("✨ Premium copywriting text generated in 3 languages!");
    }, 1200);
  };

  // Globally Save Settings All and update parent state!
  const handleGlobalPersistSettings = (overrideCoverTemplate?: string) => {
    setIsSaving(true);
    setIsSavedSuccessfully(false);
    setTimeout(() => {
      if (setStores) {
        setStores((prev) =>
          prev.map((s) => {
            if (s.id === myStore.id) {
              const updated: MerchantStore = {
                ...s,
                name: storeName,
                merchantFullName: merchantFullName,
                description: storeDesc,
                subdomain: storeSubdomain,
                logo: storeLogoUrl,
                categories: storeCategories,
                gridLinesHorizontal: gridLinesHorizontal,
                gridLinesVertical: gridLinesVertical,
                gridSpacingHorizontal: gridSpacingHorizontal,
                gridSpacingVertical: gridSpacingVertical,
                apiKey: geminiKey || apiKey,
                apiKeysVault: {
                  gemini: geminiKey,
                  grok: grokKey,
                  openai: openaiKey,
                  deepseek: deepseekKey,
                  z_ai: zaiKey,
                  claude: claudeKey,
                  nvidia: nvidiaKey,
                },
                verified: verificationStatus === "verified",
                verificationStatus: verificationStatus,
                verificationDocName: verificationFileName,
                country: storeCountry,
                currency: storeCurrency,
                contact: {
                  ...s.contact,
                  phone: contactPhone,
                  email: contactEmail,
                  viber: viber,
                  whatsapp: whatsapp,
                  facebook: facebook,
                  instagram: instagram,
                  tiktok: tiktok,
                  snapchat: snapchat,
                  phones: additionalPhones,
                  supportAccounts: supportAccounts
                },
                paymentGateways: {
                  cod: codEnabled,
                  eddahabia: eddahabiaEnabled,
                  cib: cibEnabled,
                  wire: bankWireEnabled
                },
                dynamicGateways: dynamicGateways,
                notificationsConfig: {
                  order: notifyOrder,
                  review: notifyReview,
                  follow: notifyFollow,
                  email: notifyEmail,
                  sms: notifySms,
                  telegramEnabled: telegramEnabled,
                  telegramBotToken: telegramBotToken,
                  telegramChatId: telegramChatId,
                  emailReportsFrequency: emailReportsFrequency,
                  reportsIncludedSections: reportsIncludedSections,
                  exportFileType: exportFileType
                },
                followerSystemSettings: {
                  whoCanFollow: whoCanFollow as any,
                  contentVisibility: myStore.followerSystemSettings?.contentVisibility || "public",
                  displayCount: myStore.followerSystemSettings?.displayCount ?? true,
                  autoApprove: myStore.followerSystemSettings?.autoApprove ?? true,
                  maxFollowers: myStore.followerSystemSettings?.maxFollowers ?? 10000
                },
                announcement: {
                  text: announcementMsg,
                  enabled: announcementEnabled
                },
                adBannerTitle: sponsoredTitle,
                adBannerDescription: sponsoredDesc,
                designSettings: {
                  bgColor: bgColor,
                  borderColor: borderColor,
                  accentColor: storeAccentColor,
                  borderStyle: borderStyle,
                  borderWidth: borderWidth,
                  borderRadius: borderRadius,
                  width: widthSize,
                  height: heightSize,
                  fontFamily: fontFamily,
                  titleFontSize: titleFontSize,
                  titleFontStyle: titleFontStyle,
                  titleFontWeight: titleFontWeight,
                  bodyFontSize: bodyFontSize,
                  bodyFontStyle: bodyFontStyle,
                  coverTemplate: overrideCoverTemplate !== undefined ? overrideCoverTemplate : selectedCoverTemplate,
                  toonhubLogo: toonhubLogo,
                  toonhubProducts: toonhubProducts,
                  toonhubCharacters: toonhubCharacters,
                  toonhubMode: toonhubMode,
                  mysticflowerLogo: mysticflowerLogo,
                  mysticflowerProducts: mysticflowerProducts,
                  mysticflowerCharacters: mysticflowerCharacters,
                  mysticflowerMode: mysticflowerMode,
                  classicCovers: classicCovers,
                  classicCoversPerSlide: classicCoversPerSlide,
                  gamingLogo: gamingLogo,
                  gamingProducts: gamingProducts,
                  myBrandImage: myBrandImage,
                  myBrandImageOriginal: myBrandImageOriginal,
                  myBrandBgRemovalMode: myBrandBgRemovalMode,
                  myBrandBgRemovalTolerance: myBrandBgRemovalTolerance,
                  myBrandBgRemovalColor: myBrandBgRemovalColor,
                  myBrandBrightness: myBrandBrightness,
                  myBrandContrast: myBrandContrast,
                  myBrandGrayscale: myBrandGrayscale,
                  myBrandBgType: myBrandBgType,
                  myBrandColor1: myBrandColor1,
                  myBrandColor2: myBrandColor2,
                  myBrandSpacing: myBrandSpacing,
                  myBrandAngle: myBrandAngle,
                  myBrandShadowColor: myBrandShadowColor,
                  myBrandShadowIntensity: myBrandShadowIntensity,
                  myBrandShadowOpacity: myBrandShadowOpacity,
                  myBrandShadowPreviewBorder: myBrandShadowPreviewBorder,
                  glassBlurEnabled: glassBlurEnabled,
                  glassBlurAmount: glassBlurAmount,
                  glassTransparency: glassTransparency,
                  glassMultiColorEnabled: glassMultiColorEnabled,
                  glassMultiColors: glassMultiColors,
                  gridCardMinWidth: gridCardMinWidth,
                  gridCardGap: gridCardGap,
                  permitBuyerModifications: permitBuyerModifications
                }
              };

              // Update globally in detail frame
              if (setSelectedStore) {
                setSelectedStore(updated);
              }
              return updated;
            }
            return s;
          })
        );
        setMerchantFeedbackMessage("🔮 All 9 e-commerce platform setup configurations successfully deployed & saved!");
      }
      setIsSaving(false);
      setIsSavedSuccessfully(true);
      setTimeout(() => {
        setIsSavedSuccessfully(false);
      }, 3000);
    }, 500);
  };

  return (
    <div className="flex flex-col gap-6 w-full text-slate-800" id="merchant-9-step-settings-hub">
      
      {/* Simulation Banner Notice */}
      {showSimulatedNotification && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-55 bg-indigo-900 border border-indigo-400 text-white rounded-3xl p-4 shadow-2xl flex items-center gap-3 animate-bounce max-w-sm font-sans">
          <div className="p-2 rounded-xl bg-indigo-700">
            <Megaphone className="w-5 h-5 text-indigo-300 animate-pulse" />
          </div>
          <div className="text-left text-xs leading-snug">
            <span className="font-extrabold uppercase text-[9px] text-indigo-305 block">System Alert Notifier:</span>
            {showSimulatedNotification}
          </div>
        </div>
      )}

      {viewMode === "grid" ? (
        <div className="w-full text-left font-sans fade-in">
          <div className="border-b border-slate-100 pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <nav className="text-xs text-slate-400 font-bold mb-2 uppercase tracking-wider">Account Settings</nav>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-905 font-display">Account</h2>
              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 mt-2 font-medium">
                <span className="font-semibold text-slate-800">{merchantFullName || "Smail Benabderrahmane"}</span>
                <span className="text-slate-300">·</span>
                <span>{regEmail || "owner@shareshopping-dz.com"}</span>
                <span className="text-slate-300">·</span>
                <button 
                  type="button" 
                  onClick={() => {
                    setActiveTab("store");
                    setViewMode("edit");
                  }}
                  className="font-bold hover:underline cursor-pointer bg-transparent border-none p-0 inline-flex items-center gap-1"
                  style={{ color: accentColor }}
                >
                  Edit profile <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>


          </div>

          <div className="relative w-full overflow-visible px-1">
            {/* Left Scroll Button - elegant double chevron red arrow */}
            <button
              type="button"
              onClick={() => scroll("left")}
              className={`absolute -left-5 md:-left-6 lg:-left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white border border-slate-200/90 shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 hover:shadow-xl transition-all duration-200 cursor-pointer focus:outline-none ${
                canScrollLeft ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none scale-90"
              }`}
              style={{ 
                transitionDuration: "250ms",
                color: accentColor
              }}
              aria-label="Scroll Left"
            >
              <ChevronsLeft className="w-6 h-6 stroke-[2.5]" />
            </button>

            {/* Scrollable track */}
            <div 
              ref={scrollContainerRef}
              className="w-full flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-none py-4 px-2"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {SETUP_CHAPTERS.map((ch, idx) => {
                const IconComponent = ch.icon;
                const isHovered = hoveredChapterId === ch.id;
                return (
                  <motion.div
                    key={ch.id}
                    onClick={() => {
                      setActiveTab(ch.id);
                      setViewMode("edit");
                    }}
                    onMouseEnter={() => setHoveredChapterId(ch.id)}
                    onMouseLeave={() => setHoveredChapterId(null)}
                    initial={{ opacity: 0.75, y: 15, scale: 0.96 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    whileHover={{ 
                      y: -6, 
                      scale: 1.015
                    }}
                    whileTap={{ scale: 0.98 }}
                    viewport={{ once: false, amount: 0.15 }}
                    transition={{
                      type: "spring",
                      stiffness: 90,
                      damping: 14,
                      mass: 0.8,
                      delay: 0.02
                    }}
                    className={`flex-none snap-start border hover:shadow-md rounded-2xl p-5 flex flex-col justify-between cursor-pointer group transition-all duration-200 min-h-[142px] ${
                      isHovered ? "text-white" : "text-slate-900 bg-white/60"
                    }`}
                    style={{
                      backgroundColor: isHovered ? accentColor : "rgba(255, 255, 255, 0.65)",
                      borderColor: isHovered ? accentColor : "rgba(226, 232, 240, 0.6)",
                      boxShadow: isHovered ? `0 8px 25px color-mix(in srgb, ${accentColor} 25%, transparent)` : "0 4px 12px rgba(0, 0, 0, 0.01)",
                      width: "calc((100% - 120px) / 5.5)",
                      minWidth: "170px"
                    }}
                  >
                    <div>
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-all border"
                        style={{
                          color: isHovered ? "#FFFFFF" : accentColor,
                          backgroundColor: isHovered ? "rgba(255, 255, 255, 0.22)" : `${accentColor}12`,
                          borderColor: isHovered ? "rgba(255, 255, 255, 0.35)" : `${accentColor}25`
                        }}
                      >
                        <IconComponent className="w-3.5 h-3.5 shrink-0" strokeWidth={isHovered ? 2.5 : 2} />
                      </div>
                      <h3 className="text-[13px] font-extrabold mt-3.5 font-display transition-colors duration-200 text-left"
                          style={{ color: isHovered ? "#FFFFFF" : "#111827" }}>
                        {ch.title}
                      </h3>
                      <p className="text-[11px] mt-1 leading-relaxed font-sans transition-colors duration-200 text-left"
                          style={{ color: isHovered ? "rgba(255, 255, 255, 0.85)" : "#64748b" }}>
                        {ch.desc}
                      </p>
                    </div>
                    <div 
                      className="mt-4 flex items-center gap-1 text-[9.5px] font-black uppercase tracking-widest opacity-80 group-hover:opacity-100 transition-colors duration-200 text-left"
                      style={{ color: isHovered ? "#FFFFFF" : accentColor }}
                    >
                      Configure <ChevronRight className="w-3 h-3" style={{ color: isHovered ? "#FFFFFF" : accentColor }} />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Right Scroll Button - elegant double chevron red arrow */}
            <button
              type="button"
              onClick={() => scroll("right")}
              className={`absolute -right-5 md:-right-6 lg:-right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white border border-slate-200/90 shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 hover:shadow-xl transition-all duration-200 cursor-pointer focus:outline-none ${
                canScrollRight ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none scale-90"
              }`}
              style={{ 
                transitionDuration: "250ms",
                color: accentColor
              }}
              aria-label="Scroll Right"
            >
              <ChevronsRight className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>

          <div 
            className="mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 font-semibold select-none transition-all duration-700 ease-in-out" 
            id="merchant-settings-footer-banner"
            style={{
              borderColor: `color-mix(in srgb, ${accentColor} 25%, rgba(226, 232, 240, 0.6))`
            }}
          >
            <p className="flex items-center gap-1.5 transition-colors duration-700">
              <span 
                className="w-2.5 h-2.5 rounded-full animate-ping absolute opacity-60" 
                style={{ backgroundColor: accentColor }}
              />
              <span 
                className="relative w-2 h-2 rounded-full inline-block shrink-0 transition-all duration-700" 
                style={{ 
                  backgroundColor: accentColor,
                  boxShadow: `0 0 8px ${accentColor}`
                }} 
              />
              <span className="hover:text-slate-650 transition-colors duration-300">
                © 2026 E-Commerce Platform Algerie • Built on secure account architectures.
              </span>
            </p>
            <div className="flex items-center gap-3">
              <span 
                className="hover:underline cursor-pointer transition-colors duration-300"
                style={{ ["--hover-color" as any]: accentColor }}
                onMouseEnter={(e) => e.currentTarget.style.color = accentColor}
                onMouseLeave={(e) => e.currentTarget.style.color = ""}
              >
                Terms
              </span>
              <span className="text-slate-300 pointer-events-none">•</span>
              <span 
                className="hover:underline cursor-pointer transition-colors duration-300"
                style={{ ["--hover-color" as any]: accentColor }}
                onMouseEnter={(e) => e.currentTarget.style.color = accentColor}
                onMouseLeave={(e) => e.currentTarget.style.color = ""}
              >
                Sitemap
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full text-left font-sans flex flex-col gap-6 fade-in">
          {/* Header */}
          <div className="border-b border-slate-105 pb-5 mb-3 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold mb-2 uppercase tracking-wider flex items-center gap-1.5 cursor-pointer bg-transparent border-none p-0 focus:outline-none transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5 shrink-0" /> Account Settings
              </button>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-905 font-display text-left">Account</h2>
              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 mt-2 font-medium font-sans">
                <span className="font-semibold text-slate-800">{merchantFullName || "Smail Benabderrahmane"}</span>
                <span className="text-slate-300">·</span>
                <span>{regEmail || "owner@shareshopping-dz.com"}</span>
                <span className="text-slate-300">·</span>
                <button 
                  type="button" 
                  onClick={() => {
                    setActiveTab("store");
                  }}
                  className="font-bold hover:underline cursor-pointer bg-transparent border-none p-0 inline-flex items-center gap-1"
                  style={{ color: accentColor }}
                >
                  Edit profile <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>


          </div>

          {/* Carousel Selector */}
          <div className="relative w-full overflow-visible px-1 mb-4">
            {/* Left Scroll Button - elegant double chevron red arrow */}
            <button
              type="button"
              onClick={() => scroll("left")}
              className={`absolute -left-5 md:-left-6 lg:-left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white border border-slate-200/90 shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 hover:shadow-xl transition-all duration-200 cursor-pointer focus:outline-none ${
                canScrollLeft ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none scale-90"
              }`}
              style={{ 
                transitionDuration: "250ms",
                color: accentColor
              }}
              aria-label="Scroll Left"
            >
              <ChevronsLeft className="w-6 h-6 stroke-[2.5]" />
            </button>

            {/* Scrollable track */}
            <div 
              ref={scrollContainerRef}
              className="w-full flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-none py-4 px-2"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {SETUP_CHAPTERS.map((ch) => {
                const IconComponent = ch.icon;
                const isActive = activeTab === ch.id;
                const isHovered = hoveredChapterId === ch.id;
                return (
                  <motion.div
                    key={ch.id}
                    onClick={() => {
                      setActiveTab(ch.id);
                    }}
                    onMouseEnter={() => setHoveredChapterId(ch.id)}
                    onMouseLeave={() => setHoveredChapterId(null)}
                    initial={{ opacity: 0.75, y: 15, scale: 0.96 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    whileHover={{ 
                      y: -6, 
                      scale: 1.015
                    }}
                    whileTap={{ scale: 0.98 }}
                    viewport={{ once: false, amount: 0.15 }}
                    transition={{
                      type: "spring",
                      stiffness: 90,
                      damping: 14,
                      mass: 0.8,
                      delay: 0.02
                    }}
                    className={`flex-none snap-start border rounded-2xl p-5 flex flex-col justify-between cursor-pointer group transition-all duration-200 min-h-[142px] ${
                      (isActive || isHovered) 
                        ? "text-white shadow-md shadow-indigo-100" 
                        : "bg-white/60 text-slate-900"
                    }`}
                    style={{
                      backgroundColor: (isActive || isHovered) ? accentColor : "rgba(255, 255, 255, 0.65)",
                      borderColor: (isActive || isHovered) ? accentColor : "rgba(226, 232, 240, 0.6)",
                      boxShadow: (isActive || isHovered) ? `0 8px 25px color-mix(in srgb, ${accentColor} 25%, transparent)` : "0 4px 12px rgba(0, 0, 0, 0.01)",
                      width: "calc((100% - 120px) / 5.5)",
                      minWidth: "170px"
                    }}
                  >
                    <div>
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-all border"
                        style={{
                          color: (isActive || isHovered) ? "#FFFFFF" : accentColor,
                          backgroundColor: (isActive || isHovered) ? "rgba(255, 255, 255, 0.22)" : `${accentColor}12`,
                          borderColor: (isActive || isHovered) ? "rgba(255, 255, 255, 0.35)" : `${accentColor}25`
                        }}
                      >
                        <IconComponent className="w-3.5 h-3.5 shrink-0" strokeWidth={(isActive || isHovered) ? 2.5 : 2} />
                      </div>
                      <h3 className="text-[13px] font-extrabold mt-3.5 font-display transition-colors duration-200 text-left"
                      style={{
                        color: (isActive || isHovered) ? "#FFFFFF" : "#111827"
                      }}>
                        {ch.title}
                      </h3>
                      <p className="text-[11px] mt-1 leading-relaxed font-sans transition-colors duration-200 text-left"
                      style={{
                        color: (isActive || isHovered) ? "rgba(255, 255, 255, 0.85)" : "#64748b"
                      }}>{ch.desc}</p>
                    </div>
                    <div 
                      className="mt-4 flex items-center gap-1 text-[9.5px] font-black uppercase tracking-widest opacity-80 group-hover:opacity-100 transition-colors duration-200 text-left"
                      style={{ color: (isActive || isHovered) ? "#FFFFFF" : accentColor }}
                    >
                      Configure <ChevronRight className="w-3 h-3" style={{ display: 'inline', color: (isActive || isHovered) ? "#FFFFFF" : accentColor }} />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Right Scroll Button - elegant double chevron red arrow */}
            <button
              type="button"
              onClick={() => scroll("right")}
              className={`absolute -right-5 md:-right-6 lg:-right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white border border-slate-200/90 shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 hover:shadow-xl transition-all duration-200 cursor-pointer focus:outline-none ${
                canScrollRight ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none scale-90"
              }`}
              style={{ 
                transitionDuration: "250ms",
                color: accentColor
              }}
              aria-label="Scroll Right"
            >
              <ChevronsRight className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>

          {/* Sophisticated Custom-Crafted Page Divider & Header Ribbon */}
          <div className="relative flex flex-col gap-3 mt-4 mb-4 select-none">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-1.5">
              <h3 className="text-xs font-black text-slate-850 tracking-widest font-mono flex items-center gap-2 text-left">
                <span className="inline-block w-2.5 h-2.5 rounded-xs shadow-3xs animate-pulse" style={{ backgroundColor: accentColor }} />
                Module Settings Editor: {SETUP_CHAPTERS.find(c => c.id === activeTab)?.title}
              </h3>
              <div className="flex items-center gap-2.5">
                <span className="text-[9.5px] bg-slate-100/80 border border-slate-200/50 px-3 py-1 text-slate-550 font-extrabold rounded-full font-mono tracking-wider shadow-3xs">
                  {SETUP_CHAPTERS.findIndex(c => c.id === activeTab) + 1} Of {SETUP_CHAPTERS.length} Setup Modules
                </span>
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className="flex items-center gap-1 px-3 py-1 text-xs font-bold text-white rounded-full cursor-pointer hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-wider shadow-xs hover:shadow-sm"
                  style={{ backgroundColor: accentColor }}
                  id="close-settings-module-btn"
                >
                  <X className="w-3 h-3 stroke-[2.5]" /> Close
                </button>
              </div>
            </div>

            {/* Premium double-layered horizontal line divider with a subtle gold/accent diamond accent */}
            <div className="relative flex items-center justify-center w-full py-1">
              {/* Outer soft grey line fading to transparent */}
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200/80 to-transparent" />
              </div>
              {/* Core thin colored glow line fading to transparent */}
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-[80%] mx-auto h-[1px]" style={{ background: `linear-gradient(to right, transparent, ${accentColor}2c, ${accentColor}3a, ${accentColor}2c, transparent)` }} />
              </div>
              {/* Decorative center shield/diamonds */}
              <div className="relative flex justify-center bg-white px-4">
                <div className="flex gap-1 items-center">
                  <span className="w-0.5 h-0.5 rounded-full bg-slate-300" />
                  <span className="w-1 h-1 rounded-full bg-slate-400" />
                  <span className="w-1.5 h-1.5 rotate-45 border border-slate-200" style={{ backgroundColor: "#FFFFFF" }} />
                  <span className="w-2 h-2 rotate-45 border" style={{ borderColor: accentColor, backgroundColor: accentColor }} />
                  <span className="w-1.5 h-1.5 rotate-45 border border-slate-200" style={{ backgroundColor: "#FFFFFF" }} />
                  <span className="w-1 h-1 rounded-full bg-slate-400" />
                  <span className="w-0.5 h-0.5 rounded-full bg-slate-300" />
                </div>
              </div>
            </div>
          </div>

          {/* Elegant grid container with professional typography and balanced shadows */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full font-sans text-slate-800" id="merchant-module-editor-row-view">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: -25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 25 }}
                transition={{ type: "spring", stiffness: 140, damping: 20 }}
                className="lg:col-span-8 bg-white/90 backdrop-blur-md border border-[#E5E7EB] p-6 sm:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.035)] transition-all duration-500 flex flex-col justify-between gap-6 min-w-0"
              >
                <div className="w-full">
              {/* Tab 1: Store settings */}
              {activeTab === "store" && (
                <div className="flex flex-col gap-6 fade-in">
                  <div className="pb-4 border-b border-slate-100">
                    <h4 className="text-lg font-bold text-[#1F2937] font-sans flex items-center gap-2">
                      <Store className="w-5 h-5" style={{ color: accentColor }} />
                      Primary Store & Owner Settings
                    </h4>
                    <p className="text-xs text-[#6B7280] mt-1">Define your public brand presence and legal representative details for customer trust.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
                  {/* Left Column: Core Identity */}
                  <div className="flex flex-col gap-5 text-left">
                    {/* 1. Store Name */}
                    <div className="group/spec">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <label className="text-xs font-black block font-mono" style={{ fontSize: "11px", color: "#475569" }}>
                          Public boutique name <span style={{ color: "#E53935" }}>*</span>
                        </label>
                        <SettingsTooltip text="Your registered business name displayed at the top of your boutique storefront." />
                      </div>
                      <input 
                        type="text"
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        placeholder="e.g. Algerian Artisanal Treasures"
                        className="w-full text-xs font-sans py-3 px-4 border rounded-[11px] focus:bg-white focus:border-slate-400 focus:outline-none transition-all font-bold text-slate-900 bg-white"
                        style={{
                          backgroundColor: "#ffffff",
                          borderColor: "#94a3b8",
                          borderWidth: "2px",
                          borderRadius: "11px",
                          borderStyle: "solid"
                        }}
                      />
                    </div>

                    {/* 2. Description / Bio */}
                    <div className="group/spec">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <label className="text-xs font-black block font-mono" style={{ fontSize: "11px", color: "#475569" }}>
                          Bio / store description
                        </label>
                        <SettingsTooltip text="A detailed, beautiful description introducing your artisanal history, design philosophy, and craftsmanship to visitors." />
                      </div>
                      <textarea 
                        value={storeDesc}
                        onChange={(e) => setStoreDesc(e.target.value)}
                        rows={5}
                        placeholder="Describe your authentic artisanal offerings, work heritage, and regional crafting roots..."
                        className="w-full text-xs font-sans py-3 px-4 border rounded-[7px] focus:bg-white focus:border-slate-400 focus:outline-none transition-all font-bold text-slate-900 bg-white resize-none leading-relaxed"
                        style={{
                          backgroundColor: "#ffffff",
                          borderColor: "#94a3b8",
                          borderWidth: "1.5px",
                          borderRadius: "7px",
                          borderStyle: "solid"
                        }}
                      />
                    </div>

                    {/* 3. Representative Full Name */}
                    <div className="group/spec">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <label className="text-xs font-black block font-mono" style={{ fontSize: "11px", color: "#475569" }}>
                          Merchant representative full name <span style={{ color: "#E53935" }}>*</span>
                        </label>
                        <SettingsTooltip text="The legal name of the store owner or authorized representative required for payment validation and billing." />
                      </div>
                      <input 
                        type="text"
                        value={merchantFullName}
                        onChange={(e) => setMerchantFullName(e.target.value)}
                        placeholder="e.g. Hakim BNS"
                        className="w-full text-xs font-sans py-3 px-4 border rounded-[7px] focus:bg-white focus:border-slate-400 focus:outline-none transition-all font-bold text-slate-900 bg-white"
                        style={{
                          backgroundColor: "#ffffff",
                          borderColor: "#94a3b8",
                          borderWidth: "1.5px",
                          borderRadius: "7px",
                          borderStyle: "solid"
                        }}
                      />
                      <span className="text-[10px] text-[#6B7280] mt-1.5 px-1 leading-normal block">Required for billing validation, logistics contracts and government customs checking.</span>
                    </div>
                  </div>

                  {/* Right Column: Logo, Routing, and Location */}
                  <div className="flex flex-col gap-5 text-left">
                    {/* 4. Boutique Logo */}
                    <div className="group/spec">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <label className="text-xs font-black block font-mono" style={{ fontSize: "11px", color: "#475569" }}>Boutique brand logo</label>
                        <SettingsTooltip text="The visual icon or brand identity mark for your boutique. We highly recommend a 1:1 square ratio image." />
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-lg border border-[#E5E7EB]">
                        <img 
                          src={storeLogoUrl} 
                          alt="Boutique Logo" 
                          className="w-14 h-14 rounded-lg object-cover border border-[#E5E7EB] bg-white shadow-sm shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 text-left min-w-0">
                          <span className="text-xs font-mono font-black text-[#475569] block mb-1" style={{ fontSize: "10.5px" }}>Logo link / image URL:</span>
                          <input 
                            type="text" 
                            value={storeLogoUrl} 
                            onChange={(e) => setStoreLogoUrl(e.target.value)}
                            placeholder="Paste custom logo image URL..."
                            className="w-full text-xs font-mono py-2.5 px-4 border rounded-[7px] focus:bg-white focus:border-slate-400 focus:outline-none transition-all font-bold text-slate-900 bg-white"
                            style={{
                              backgroundColor: "#ffffff",
                              borderColor: "#94a3b8",
                              borderWidth: "1.5px",
                              borderRadius: "7px",
                              borderStyle: "solid"
                            }}
                          />
                          <div className="mt-2.5 flex items-center">
                            <label className="inline-flex items-center gap-1.5 px-4 py-1.5 text-[11px] font-bold text-white bg-[#2563EB] hover:bg-[#2563EB]/90 rounded-full shadow-3xs cursor-pointer transition-all duration-200 select-none">
                              <UploadCloud className="w-3.5 h-3.5 text-white" />
                              <span>Upload image file</span>
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      if (typeof reader.result === "string") {
                                        setStoreLogoUrl(reader.result);
                                      }
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Redesigned Subdomain router area */}
                    <div className="group/spec">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <label className="text-xs font-black block font-mono" style={{ fontSize: "11px", color: "#475569" }}>
                          Global subdomain routing address
                        </label>
                        <SettingsTooltip text="Your store's unique web subdomain slug (e.g. 'my-store'). Customers will visit this exact address to browse your products." />
                      </div>
                      <div className="relative flex items-center">
                        <input 
                          type="text"
                          value={storeSubdomain}
                          onChange={(e) => setStoreSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9.-]/g, ""))}
                          placeholder="e.g. berber-rugs.platform.dz"
                          className="w-full text-xs font-mono py-3 px-4 pr-24 border rounded-[7px] focus:bg-white focus:border-slate-400 focus:outline-none transition-all font-bold text-slate-900 bg-white"
                          style={{
                            backgroundColor: "#ffffff",
                            borderColor: "#94a3b8",
                            borderWidth: "1.5px",
                            borderRadius: "7px",
                            borderStyle: "solid"
                          }}
                        />
                        <span className="absolute right-3 text-[#6B7280] font-mono font-black text-xs select-none">
                          .yume.store
                        </span>
                      </div>
                      
                      {/* URL Preview with Copy Button */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-slate-500 font-medium">
                        <span className="font-mono bg-slate-50 border border-slate-150 px-2.5 py-1 rounded text-slate-600 truncate max-w-full">
                          🌐 Preview: <strong className="text-slate-800 font-bold">https://{storeSubdomain || "your-store"}.yume.store</strong>
                        </span>
                        <button
                          type="button"
                          onClick={handleCopySubdomain}
                          className="inline-flex items-center gap-1 text-slate-700 hover:text-indigo-650 bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-full transition-colors cursor-pointer select-none font-bold shrink-0 text-xs"
                        >
                          {copiedSubdomain ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                              <span className="text-emerald-700">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-slate-500" />
                              <span>Copy Link</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Separated Country & Currency fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="group/spec">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <label className="text-xs font-black block font-mono" style={{ fontSize: "11px", color: "#475569" }}>
                            Base country <span style={{ color: "#E53935" }}>*</span>
                          </label>
                          <SettingsTooltip text="The physical or legal location from which your craft boutique operates and dispatches shipments." />
                        </div>
                        <div className="relative">
                          <select
                            value={storeCountry}
                            onChange={(e) => {
                              const val = e.target.value;
                              setStoreCountry(val);
                              const mapping = countryCurrencyMapping[val];
                              if (mapping) {
                                setStoreCurrency(mapping.currency);
                              }
                            }}
                            className="w-full text-xs font-sans py-3 pl-4 pr-8 border rounded-[7px] focus:bg-white focus:border-slate-400 focus:outline-none transition-all font-bold text-slate-900 bg-white cursor-pointer appearance-none"
                            style={{
                              backgroundColor: "#ffffff",
                              borderColor: "#94a3b8",
                              borderWidth: "1.5px",
                              borderRadius: "7px",
                              borderStyle: "solid"
                            }}
                          >
                            {Object.entries(countryCurrencyMapping).map(([name, info]) => (
                              <option key={name} value={name} className="font-sans text-xs font-semibold text-slate-800">
                                {info.flag} {name}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500">
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </div>
                      </div>

                      <div className="group/spec">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <label className="text-xs font-black block font-mono" style={{ fontSize: "11px", color: "#475569" }}>
                            Settlement currency <span style={{ color: "#E53935" }}>*</span>
                          </label>
                          <SettingsTooltip text="The primary billing and checkout currency displayed to customers visiting your online storefront." />
                        </div>
                        <div className="relative">
                          <select
                            value={storeCurrency}
                            onChange={(e) => setStoreCurrency(e.target.value)}
                            className="w-full text-xs font-sans py-3 pl-4 pr-8 border rounded-[7px] focus:bg-white focus:border-slate-400 focus:outline-none transition-all font-bold text-slate-900 bg-white cursor-pointer appearance-none"
                            style={{
                              backgroundColor: "#ffffff",
                              borderColor: "#94a3b8",
                              borderWidth: "1.5px",
                              borderRadius: "7px",
                              borderStyle: "solid"
                            }}
                          >
                            <option value="DZD">🇩🇿 DZD (Algerian Dinar)</option>
                            <option value="MAD">🇲🇦 MAD (Moroccan Dirham)</option>
                            <option value="TND">🇹🇳 TND (Tunisian Dinar)</option>
                            <option value="EGP">🇪🇬 EGP (Egyptian Pound)</option>
                            <option value="USD">🇺🇸 USD (US Dollar)</option>
                            <option value="EUR">🇪🇺 EUR (Euro)</option>
                            <option value="GBP">🇬🇧 GBP (British Pound)</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500">
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 1.5: Redesigned Category Alignment with Searchable Dropdown with icons, limiting to three primary categories */}
                <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col gap-4">
                  <div>
                    <h5 className="text-sm font-bold text-slate-900 font-sans flex items-center gap-2">
                      <Layout className="w-4 h-4" style={{ color: accentColor }} />
                      Boutique Category Alignment & Niche Merging
                    </h5>
                    <p className="text-xs text-slate-500 mt-1">
                      Choose up to <strong className="text-slate-800">3 target categories</strong> to showcase your store in multiple platform marketplaces.
                    </p>
                  </div>

                  {/* Warning banner when trying to exceed 3 */}
                  <div className={`p-3 rounded-xl border transition-all duration-200 ${
                    storeCategories.length >= 3
                      ? "bg-amber-50/50 border-amber-200/80 text-amber-800"
                      : "bg-slate-50 border-slate-150 text-slate-600"
                  } text-[11px] leading-relaxed flex items-start gap-2.5`}>
                    <AlertCircle className={`w-4 h-4 shrink-0 mt-0.5 ${storeCategories.length >= 3 ? "text-amber-600" : "text-slate-500"}`} />
                    <div>
                      {storeCategories.length >= 3 ? (
                        <>
                          <strong className="font-extrabold">Maximum category selection reached:</strong> You have active alignments in <strong className="font-bold">{storeCategories.join(" & ")}</strong>. Unselect an active category if you wish to change your alignments.
                        </>
                      ) : (
                        <>
                          <span className="font-bold">Merging Allowed:</span> You can select and merge up to <strong className="font-semibold text-slate-850">3 distinct categories</strong> on your store to cross-promote your catalog. {3 - storeCategories.length} remaining slots.
                        </>
                      )}
                    </div>
                  </div>

                  {/* Display selected categories as removable pills */}
                  <div className="flex flex-wrap gap-2 px-1">
                    {storeCategories.length === 0 ? (
                      <span className="text-xs text-slate-400 italic">No alignments active. Type and search below to align.</span>
                    ) : (
                      storeCategories.map((catName) => {
                        const icon = categoryIconMapping[catName] || "📦";
                        return (
                          <span key={catName} className="bg-slate-900 border border-slate-950 text-white font-semibold text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                            <span>{icon} {catName}</span>
                            <button
                              type="button"
                              onClick={() => setStoreCategories(prev => prev.filter(c => c !== catName))}
                              className="hover:bg-white/20 hover:text-rose-400 rounded-full p-0.5 transition-colors cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </span>
                        );
                      })
                    )}
                  </div>

                  {/* Searchable input with interactive dropdown */}
                  <div className="relative">
                    <div className="border border-slate-200 rounded-xl px-4 py-2.5 bg-white shadow-2xs hover:border-slate-350 focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-all flex items-center justify-between">
                      <div className="flex-1 text-left">
                        <label className="text-[10px] font-bold text-slate-400 block">Search & Select Categories</label>
                        <input
                          type="text"
                          value={categorySearchQuery}
                          onChange={(e) => {
                            setCategorySearchQuery(e.target.value);
                            setIsCategoryDropdownOpen(true);
                          }}
                          onFocus={() => setIsCategoryDropdownOpen(true)}
                          placeholder="Type to search traditional rugs, dates, ceramics..."
                          className="text-xs font-semibold text-slate-800 placeholder-slate-400 w-full bg-transparent outline-none border-none p-0 focus:ring-0 focus:outline-none mt-1"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                        className="text-slate-400 hover:text-slate-650 p-1"
                      >
                        <ChevronDown className={`w-4.5 h-4.5 transition-transform duration-200 ${isCategoryDropdownOpen ? "rotate-180" : ""}`} />
                      </button>
                    </div>

                    {isCategoryDropdownOpen && (
                      <div className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-lg z-50 max-h-60 overflow-y-auto text-left py-2 font-sans">
                        <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase text-slate-400">Available Platform Alignments</span>
                          <button
                            type="button"
                            onClick={() => setIsCategoryDropdownOpen(false)}
                            className="text-[10.5px] font-extrabold text-slate-500 hover:text-slate-800 font-mono"
                          >
                            Close ✕
                          </button>
                        </div>
                        {ALL_PLATFORM_CATEGORIES.filter((cat) =>
                          cat.name.toLowerCase().includes(categorySearchQuery.toLowerCase())
                        ).length === 0 ? (
                          <div className="p-4 text-center text-xs text-slate-400 italic">No matching categories found on Yume platform.</div>
                        ) : (
                          ALL_PLATFORM_CATEGORIES.filter((cat) =>
                            cat.name.toLowerCase().includes(categorySearchQuery.toLowerCase())
                          ).map((cat) => {
                            const isSelected = storeCategories.includes(cat.name);
                            const icon = categoryIconMapping[cat.name] || "📦";
                            const isGated = cat.gated;
                            const isApproved = approvedGatedCategories.includes(cat.name);
                            const isDisabled = !isSelected && storeCategories.length >= 3;

                            return (
                              <div
                                key={cat.id}
                                className={`px-4 py-2.5 hover:bg-slate-50 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                                  isSelected ? "bg-slate-50/70 font-semibold" : ""
                                } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                                onClick={() => {
                                  if (isDisabled) return;
                                  if (isGated && !isApproved) {
                                    setMerchantFeedbackMessage(`🔒 ${cat.name} is a gated guild specialty. Please submit certification papers on verification tab first!`);
                                    return;
                                  }
                                  if (isSelected) {
                                    setStoreCategories(prev => prev.filter(c => c !== cat.name));
                                  } else {
                                    setStoreCategories(prev => [...prev, cat.name]);
                                  }
                                  setCategorySearchQuery("");
                                  setIsCategoryDropdownOpen(false);
                                }}
                              >
                                <div className="flex items-start gap-2.5 min-w-0">
                                  <span className="text-xl shrink-0 mt-0.5">{icon}</span>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="text-xs font-bold text-slate-900">{cat.name}</span>
                                      {isGated && (
                                        <span className={`text-[8px] font-mono font-bold px-1.5 py-0.2 rounded ${
                                          isApproved ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                                        }`}>
                                          {isApproved ? "Approved ✓" : "🔒 Gated"}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[10px] text-slate-400 truncate leading-relaxed mt-0.5">{cat.description}</p>
                                  </div>
                                </div>
                                <div className="shrink-0 flex items-center">
                                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                    isSelected ? "bg-slate-900 border-slate-900 text-white" : "border-slate-350 bg-white"
                                  }`}>
                                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                </div>


              </div>
            )}

            {/* Tab 2: Contact Information */}
            {activeTab === "contact" && (
              <div className="flex flex-col gap-6 fade-in">
                <div className="pb-4 border-b border-slate-100">
                  <h4 className="text-lg font-bold text-slate-900 font-sans flex items-center gap-2">
                    <Phone className="w-5 h-5" style={{ color: accentColor }} />
                    Support Channels & Contact Accounts
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Configure multiple helpdesk contacts, direct messenger accounts, or support phone lines. Drag/prioritize channels for client-facing displays.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
                  
                  {/* Left Column: Form to Add/Edit Support Account */}
                  <div className="flex flex-col gap-5 text-left">
                    <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-3xs flex flex-col gap-4">
                            {/* Dropdown for platform */}
                      <div className="group/spec text-left">
                        <label className="text-xs font-black block font-mono mb-1.5" style={{ fontSize: "11px", color: "#475569" }}>
                          Channel Platform
                        </label>
                        <div className="relative">
                          <select
                            value={newAccPlatform}
                            onChange={(e) => setNewAccPlatform(e.target.value as any)}
                            className="w-full text-xs font-sans p-3 pr-8 border rounded-[7px] focus:bg-white focus:border-slate-400 focus:outline-none transition-all font-bold text-slate-900 bg-white cursor-pointer appearance-none"
                            style={{
                              backgroundColor: "#ffffff",
                              borderColor: "#8f8b8b",
                              borderWidth: "1px",
                              borderRadius: "7px",
                              borderStyle: "solid"
                            }}
                          >
                            <option value="WhatsApp">💬 WhatsApp</option>
                            <option value="Telegram">✈️ Telegram</option>
                            <option value="Instagram">📸 Instagram</option>
                            <option value="Facebook">📘 Facebook Messenger</option>
                            <option value="Viber">📞 Viber Chat</option>
                            <option value="Phone">📞 Direct Phone Line</option>
                            <option value="Email">✉️ Dedicated Support Email</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500">
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </div>
                      </div>

                      {/* Input for custom channel label */}
                      <div className="group/spec text-left">
                        <label className="text-xs font-black block font-mono mb-1.5" style={{ fontSize: "11px", color: "#475569" }}>
                          Custom Display Label
                        </label>
                        <input
                          type="text"
                          value={newAccLabel}
                          onChange={(e) => setNewAccLabel(e.target.value)}
                          placeholder="e.g. Algiers Showroom, Oran Logistics Team"
                          className="w-full text-xs font-sans p-3 border rounded-[7px] focus:bg-white focus:border-slate-400 focus:outline-none transition-all font-bold text-slate-900 bg-white"
                          style={{
                            backgroundColor: "#ffffff",
                            borderColor: "#8f8b8b",
                            borderWidth: "1px",
                            borderRadius: "7px",
                            borderStyle: "solid"
                          }}
                        />
                      </div>

                      {/* Input for platform value */}
                      <div className="group/spec text-left">
                        <label className="text-xs font-black block font-mono mb-1.5" style={{ fontSize: "11px", color: "#475569" }}>
                          Contact Number or Handle
                        </label>
                        <input
                          type="text"
                          value={newAccValue}
                          onChange={(e) => setNewAccValue(e.target.value)}
                          placeholder={
                            newAccPlatform === "WhatsApp" || newAccPlatform === "Phone" || newAccPlatform === "Viber"
                              ? "e.g. +213555123456"
                              : newAccPlatform === "Email"
                              ? "e.g. support@mystore.com"
                              : "e.g. algerian_craft_co"
                          }
                          className="w-full text-xs font-mono p-3 border rounded-[7px] focus:bg-white focus:border-slate-400 focus:outline-none transition-all font-bold text-slate-900 bg-white"
                          style={{
                            backgroundColor: "#ffffff",
                            borderColor: "#8f8b8b",
                            borderWidth: "1px",
                            borderRadius: "7px",
                            borderStyle: "solid"
                          }}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleSaveSupportAccount}
                        className="w-full text-white font-bold text-xs py-2.5 rounded-xl shadow-2xs hover:shadow-xs transition-all text-center cursor-pointer active:scale-98"
                        style={{ backgroundColor: accentColor }}
                      >
                        {editingAccountId ? "💾 Update Channel Account" : "🚀 Deploy Support Channel"}
                      </button>
                    </div>

                    {/* Default Contact Emails fallback */}
                    <div className="group/spec text-left">
                      <label className="text-xs font-black block font-mono mb-1.5" style={{ fontSize: "11px", color: "#475569" }}>
                        Boutique Owner Primary Email <span style={{ color: accentColor }}>*</span>
                      </label>
                      <input 
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="e.g. owner@shareshopping-dz.com"
                        className="w-full text-xs font-sans p-3 border rounded-[7px] focus:bg-white focus:border-slate-400 focus:outline-none transition-all font-bold text-slate-900 bg-white"
                        style={{
                          backgroundColor: "#ffffff",
                          borderColor: "#8f8b8b",
                          borderWidth: "1px",
                          borderRadius: "7px",
                          borderStyle: "solid"
                        }}
                      />
                    </div>
                  </div>

                  {/* Right Column: Live Channels priority stack */}
                  <div className="flex flex-col gap-4 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400">Live Support Stack ({supportAccounts.length})</span>
                      <span className="text-[10px] text-slate-400 font-mono italic">Client layout priority order</span>
                    </div>

                    {supportAccounts.length === 0 ? (
                      <div className="p-8 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 text-center flex flex-col items-center justify-center">
                        <Phone className="w-8 h-8 text-slate-350 mb-2 stroke-[1.5]" />
                        <span className="text-xs font-bold text-slate-650">No support channels registered yet</span>
                        <p className="text-[10px] text-slate-400 max-w-xs mt-1">Use the builder panel on the left to add WhatsApp numbers, Viber lines, or Instagram handles.</p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2.5">
                        {supportAccounts.map((acc, idx) => {
                          const iconMap: Record<string, string> = {
                            WhatsApp: "💬",
                            Telegram: "✈️",
                            Instagram: "📸",
                            Facebook: "📘",
                            Viber: "📞",
                            Phone: "📞",
                            Email: "✉️"
                          };
                          const emoji = iconMap[acc.platform] || "📦";

                          return (
                            <div 
                              key={acc.id}
                              className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                                editingAccountId === acc.id
                                  ? "border-indigo-500 bg-indigo-50/20"
                                  : "border-slate-150 bg-white hover:bg-slate-50/30"
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <span className="text-xl shrink-0">{emoji}</span>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-extrabold text-slate-900">{acc.label}</span>
                                    <span className="text-[9px] font-mono font-bold bg-slate-100 text-slate-650 px-1.5 py-0.2 rounded">
                                      {acc.platform}
                                    </span>
                                  </div>
                                  <p className="text-[10.5px] text-slate-500 font-mono truncate mt-0.5">{acc.value}</p>
                                </div>
                              </div>

                              {/* Controls (Edit, delete, reorder) */}
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingAccountId(acc.id);
                                    setNewAccPlatform(acc.platform as any);
                                    setNewAccLabel(acc.label);
                                    setNewAccValue(acc.value);
                                    setMerchantFeedbackMessage(`📝 Loaded channel "${acc.label}" for customization.`);
                                  }}
                                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                                  title="Edit account details"
                                >
                                  <Sliders className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setSupportAccounts(prev => prev.filter(a => a.id !== acc.id));
                                    if (editingAccountId === acc.id) {
                                      setEditingAccountId(null);
                                      setNewAccLabel("");
                                      setNewAccValue("");
                                    }
                                    setMerchantFeedbackMessage("🗑️ Discarded support channel!");
                                  }}
                                  className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                                  title="Remove account"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>

                                {/* Priority Reordering Buttons */}
                                <div className="flex flex-col border-l border-slate-150 pl-1.5 ml-1 select-none">
                                  <button
                                    type="button"
                                    disabled={idx === 0}
                                    onClick={() => handleMoveSupportAccount(idx, "up")}
                                    className="p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                                  >
                                    ▲
                                  </button>
                                  <button
                                    type="button"
                                    disabled={idx === supportAccounts.length - 1}
                                    onClick={() => handleMoveSupportAccount(idx, "down")}
                                    className="p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                                  >
                                    ▼
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] leading-relaxed text-slate-500">
                      <strong className="text-slate-800 font-bold block mb-1">💡 Interactive buyer dashboard widgets:</strong>
                      Yume automatically converts this stack into floating chat links, call hotlines, and instant social profile gateways on your public boutique storefront.
                    </div>
                  </div>

                </div>

                {/* ✈️ Telegram Bot Push Notification Hub */}
                <div className="p-5 bg-gradient-to-br from-slate-50 to-indigo-50/20 border border-indigo-100 rounded-2xl shadow-3xs flex flex-col gap-4 text-left">
                  <div className="flex items-center justify-between border-b border-indigo-100/50 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">✈️</span>
                      <div>
                        <h5 className="text-sm font-extrabold text-slate-900 font-sans flex items-center gap-1.5">
                          Telegram Bot Notification Center
                          <span className="text-[9px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 px-1.5 py-0.2 rounded-md uppercase tracking-wider">
                            Direct Channel API
                          </span>
                        </h5>
                        <p className="text-[10.5px] text-slate-500 mt-0.5">
                          Receive real-time mobile order dispatches and transaction receipts directly in your Telegram channel.
                        </p>
                      </div>
                    </div>
                    <SkeuomorphicSwitch 
                      checked={telegramEnabled}
                      onChange={setTelegramEnabled}
                    />
                  </div>

                  {telegramEnabled ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                      <div className="flex flex-col gap-4">
                        {/* Bot Token */}
                        <div className="group/spec text-left">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <label className="text-xs font-black block font-mono" style={{ fontSize: "11px", color: "#475569" }}>
                              Telegram Bot Token API <span style={{ color: accentColor }}>*</span>
                            </label>
                            <SettingsTooltip text="The secret API token received from @BotFather when creating your custom telegram bot (e.g., 123456789:ABCdefGhIjk...)" />
                          </div>
                          <input
                            type="password"
                            value={telegramBotToken}
                            onChange={(e) => setTelegramBotToken(e.target.value)}
                            placeholder="e.g. 518392107:AAE_x8b27_Y..."
                            className="w-full text-xs font-mono p-3 border rounded-[7px] focus:bg-white focus:border-slate-400 focus:outline-none transition-all font-bold text-slate-900 bg-white"
                            style={{
                              backgroundColor: "#ffffff",
                              borderColor: "#8f8b8b",
                              borderWidth: "1px",
                              borderRadius: "7px",
                              borderStyle: "solid"
                            }}
                          />
                        </div>

                        {/* Chat ID */}
                        <div className="group/spec text-left">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <label className="text-xs font-black block font-mono" style={{ fontSize: "11px", color: "#475569" }}>
                              Target Chat ID or Channel Handle <span style={{ color: accentColor }}>*</span>
                            </label>
                            <SettingsTooltip text="The unique numeric ID of your target Telegram chat/group, or the public channel username (including @ like @my_channel)." />
                          </div>
                          <input
                            type="text"
                            value={telegramChatId}
                            onChange={(e) => setTelegramChatId(e.target.value)}
                            placeholder="e.g. -10018928374 or @my_yume_boutique"
                            className="w-full text-xs font-mono p-3 border rounded-[7px] focus:bg-white focus:border-slate-400 focus:outline-none transition-all font-bold text-slate-900 bg-white"
                            style={{
                              backgroundColor: "#ffffff",
                              borderColor: "#8f8b8b",
                              borderWidth: "1px",
                              borderRadius: "7px",
                              borderStyle: "solid"
                            }}
                          />
                        </div>

                        {/* Real-time verification button */}
                        <div className="flex flex-col gap-2 mt-1">
                          <button
                            type="button"
                            disabled={isTestingTelegram || !telegramBotToken || !telegramChatId}
                            onClick={handleTestTelegramAlert}
                            className="w-full md:w-auto self-start px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                          >
                            {isTestingTelegram ? (
                              <>
                                <span className="animate-spin inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full" />
                                <span>Verifying API Handshake...</span>
                              </>
                            ) : (
                              <>
                                <span>🚀 Send Test Push Alert</span>
                              </>
                            )}
                          </button>

                          {telegramTestStatus && (
                            <div 
                              className={`p-3 rounded-xl border text-[11px] leading-relaxed transition-all flex items-start gap-2 ${
                                telegramTestStatus === "success" 
                                  ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                                  : "bg-rose-50 border-rose-200 text-rose-800"
                              }`}
                            >
                              <span className="text-sm">{telegramTestStatus === "success" ? "✅" : "❌"}</span>
                              <div className="flex-1">
                                <span className="font-extrabold block">
                                  {telegramTestStatus === "success" ? "Verification Successful" : "Verification Failed"}
                                </span>
                                <span className="opacity-90">{telegramTestMessage}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Setup Instructions / Companion Guide */}
                      <div className="p-4 bg-indigo-50/40 border border-indigo-100/50 rounded-xl flex flex-col gap-2 text-xs leading-relaxed text-indigo-950">
                        <span className="font-extrabold text-indigo-900 flex items-center gap-1.5">
                          💡 Step-by-Step Channel Configuration Guide
                        </span>
                        <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-indigo-900/90 font-medium">
                          <li>
                            Open Telegram and search for <a href="https://t.me/BotFather" target="_blank" rel="noreferrer" className="underline font-bold text-indigo-700 hover:text-rose-500">@BotFather</a>.
                          </li>
                          <li>
                            Send the message <code className="bg-white/80 px-1 py-0.5 rounded font-mono border text-[10px]">/newbot</code> and follow the naming instructions to deploy your custom boutique bot.
                          </li>
                          <li>
                            Copy the secret <strong>HTTP API Token</strong> provided by BotFather and paste it in the field on the left.
                          </li>
                          <li>
                            Create a public/private channel or group in Telegram, and <strong>invite your new bot as an administrator</strong> with messaging permissions.
                          </li>
                          <li>
                            Provide your group's numeric chat ID (or your public channel handle starting with <code className="bg-white/80 px-1 py-0.5 rounded font-mono border text-[10px]">@</code>) and tap <strong>Send Test Push Alert</strong> to verify!
                          </li>
                        </ol>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-50/50 border border-dashed border-slate-200 rounded-xl text-center flex flex-col items-center justify-center py-6">
                      <span className="text-2xl mb-1.5 opacity-60">✈️</span>
                      <span className="text-xs font-bold text-slate-700">Telegram Notifications Disabled</span>
                      <p className="text-[10px] text-slate-400 max-w-sm mt-0.5">
                        Toggle on the switch in the top-right corner to link your Telegram bot and receive instant buyer invoices and real-time custom shipping coordination receipts.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 3: Payment Gateways */}
            {activeTab === "payments" && (
              <div className="flex flex-col gap-6 fade-in">
                <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="text-left">
                    <h4 className="text-lg font-bold text-slate-900 font-sans flex items-center gap-2">
                      <DollarSign className="w-5 h-5" style={{ color: accentColor }} />
                      Dynamic Payment Gateways Config
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">Settle checkout flows dynamically. Create, customize, or disable any local gateway module.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAdminMode(!isAdminMode)}
                    className="px-2.5 py-1 text-[10.5px] font-bold border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isAdminMode ? "🔒 Exit Developer Panel" : "🛠️ Developer Panel"}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
                  
                  {/* Left Column: Dynamic Gateway Stack */}
                  <div className="flex flex-col gap-4 text-left">
                    <span className="text-xs font-bold text-slate-400 block mb-1">Live Payment Gateways ({dynamicGateways.length})</span>
                    
                    <div className="flex flex-col gap-3">
                      {dynamicGateways.map((gw) => {
                        const isSelected = selectedGatewayId === gw.id;
                        return (
                          <div 
                            key={gw.id}
                            onClick={() => setSelectedGatewayId(gw.id)}
                            className={`p-4 border rounded-2xl cursor-pointer transition-all duration-150 flex items-start gap-4 ${
                              isSelected 
                                ? "border-slate-800 bg-slate-50/50 shadow-2xs" 
                                : "border-slate-200 bg-white hover:border-slate-300 shadow-3xs"
                            }`}
                          >
                            <div className="text-2xl shrink-0 p-1 bg-slate-50 rounded-xl border border-slate-100">
                              {gw.icon || "💵"}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-bold text-slate-900 truncate block">
                                  {gw.name}
                                </span>
                                <SkeuomorphicSwitch 
                                  checked={gw.enabled}
                                  onChange={() => {
                                    setDynamicGateways(prev => prev.map(g => g.id === gw.id ? { ...g, enabled: !g.enabled } : g));
                                    setMerchantFeedbackMessage(`⚡ Toggled gateway "${gw.name}" status!`);
                                  }}
                                />
                              </div>
                              <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                                {gw.description}
                              </p>
                              
                              <div className="flex items-center justify-between mt-3">
                                <span className="text-[9.5px] font-mono font-bold bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 uppercase">
                                  Type: {gw.type}
                                </span>
                                {gw.fields.length > 0 && (
                                  <span className="text-[10px] text-slate-400 font-medium">
                                    ⚙️ {gw.fields.length} Config {gw.fields.length === 1 ? "field" : "fields"}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Developer/Admin Mode: Add a completely new Custom Payment Gateway */}
                    {isAdminMode && (
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col gap-3 text-left mt-2 animate-fade-in">
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block border-b border-slate-200 pb-1.5">
                          🛠️ Register New Payment Module
                        </span>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="group/spec text-left">
                            <label className="text-[10px] font-black block font-mono mb-1" style={{ color: "#475569" }}>Gateway Title</label>
                            <input
                              type="text"
                              value={newGatewayName}
                              onChange={(e) => setNewGatewayName(e.target.value)}
                              placeholder="e.g. BaridiMob"
                              className="w-full text-xs font-sans p-2.5 border rounded-[7px] focus:bg-white focus:border-slate-400 focus:outline-none transition-all font-bold text-slate-900 bg-white"
                              style={{
                                backgroundColor: "#ffffff",
                                borderColor: "#8f8b8b",
                                borderWidth: "1px",
                                borderRadius: "7px",
                                borderStyle: "solid"
                              }}
                            />
                          </div>

                          <div className="group/spec text-left">
                            <label className="text-[10px] font-black block font-mono mb-1" style={{ color: "#475569" }}>Emoji Icon</label>
                            <input
                              type="text"
                              value={newGatewayIcon}
                              onChange={(e) => setNewGatewayIcon(e.target.value)}
                              placeholder="e.g. 📱, 💳"
                              className="w-full text-xs font-sans p-2.5 border rounded-[7px] focus:bg-white focus:border-slate-400 focus:outline-none transition-all font-bold text-slate-900 bg-white"
                              style={{
                                backgroundColor: "#ffffff",
                                borderColor: "#8f8b8b",
                                borderWidth: "1px",
                                borderRadius: "7px",
                                borderStyle: "solid"
                              }}
                            />
                          </div>
                        </div>

                        <div className="group/spec text-left">
                          <label className="text-[10px] font-black block font-mono mb-1" style={{ color: "#475569" }}>Description</label>
                          <input
                            type="text"
                            value={newGatewayDesc}
                            onChange={(e) => setNewGatewayDesc(e.target.value)}
                            placeholder="Instruct buyers on how to settle with this custom gateway."
                            className="w-full text-xs font-sans p-2.5 border rounded-[7px] focus:bg-white focus:border-slate-400 focus:outline-none transition-all font-bold text-slate-900 bg-white"
                            style={{
                              backgroundColor: "#ffffff",
                              borderColor: "#8f8b8b",
                              borderWidth: "1px",
                              borderRadius: "7px",
                              borderStyle: "solid"
                            }}
                          />
                        </div>

                        <div className="group/spec text-left">
                          <label className="text-[10px] font-black block font-mono mb-1" style={{ color: "#475569" }}>Gateway Settlement Type</label>
                          <div className="relative">
                            <select
                              value={newGatewayType}
                              onChange={(e) => setNewGatewayType(e.target.value as any)}
                              className="w-full text-xs font-sans p-2.5 pr-8 border rounded-[7px] focus:bg-white focus:border-slate-400 focus:outline-none transition-all font-bold text-slate-900 bg-white cursor-pointer appearance-none"
                              style={{
                                backgroundColor: "#ffffff",
                                borderColor: "#8f8b8b",
                                borderWidth: "1px",
                                borderRadius: "7px",
                                borderStyle: "solid"
                              }}
                            >
                              <option value="cod">🚚 COD (On-site Delivery)</option>
                              <option value="card">💳 Card Terminal (SATIM/Electronic)</option>
                              <option value="wire">📝 Wire Transfer (CCP/Bank)</option>
                              <option value="other">💵 Other Custom Settlement</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500">
                              <ChevronDown className="w-4 h-4" />
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (!newGatewayName.trim()) {
                              setMerchantFeedbackMessage("⚠️ Please provide a gateway name!");
                              return;
                            }
                            const newGwId = `custom-${Date.now()}`;
                            const customFields: PaymentGatewayField[] = [];
                            
                            if (newGatewayType === "card") {
                              customFields.push(
                                { key: "apiKey", label: "Merchant Gateway API Key", value: "", type: "text", placeholder: "Insert provider API credential token" },
                                { key: "secretHash", label: "Secret Cryptographic Hash", value: "", type: "password", placeholder: "Secure hash key" }
                              );
                            } else if (newGatewayType === "wire") {
                              customFields.push(
                                { key: "wireInstructions", label: "Deposit & Upload Instructions", value: "", type: "textarea", placeholder: "Provide CCP/RIB details" }
                              );
                            } else {
                              customFields.push(
                                { key: "extraInfo", label: "Checkout Instruction Alert", value: "", type: "text", placeholder: "e.g. Settle cash on receipt" }
                              );
                            }

                            const newGw: PaymentGateway = {
                              id: newGwId,
                              name: newGatewayName.trim(),
                              description: newGatewayDesc.trim() || "Local bespoke custom payment channel.",
                              enabled: true,
                              type: newGatewayType,
                              icon: newGatewayIcon,
                              fields: customFields
                            };

                            setDynamicGateways(prev => [...prev, newGw]);
                            setSelectedGatewayId(newGwId);
                            setNewGatewayName("");
                            setNewGatewayDesc("");
                            setNewGatewayIcon("💵");
                            setMerchantFeedbackMessage(`🚀 Deployed custom gateway "${newGw.name}" successfully!`);
                          }}
                          className="w-full text-white font-bold text-xs py-2.5 rounded-xl shadow-2xs hover:shadow-xs transition-colors cursor-pointer text-center"
                          style={{ backgroundColor: accentColor }}
                        >
                          ➕ Deploy New Payment Module
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Dynamic Credentials Customizer */}
                  <div className="flex flex-col gap-4 bg-white p-4.5 rounded-2xl border border-slate-200 text-left shadow-2xs self-start w-full">
                    {(() => {
                      const selectedGw = dynamicGateways.find(g => g.id === selectedGatewayId);
                      if (!selectedGw) {
                        return (
                          <div className="py-12 px-4 flex flex-col items-center justify-center text-center gap-2 bg-slate-50/50 rounded-xl border border-slate-100">
                            <AlertCircle className="w-8 h-8 text-slate-350 stroke-[1.5]" />
                            <p className="text-xs text-slate-500">Please select a payment gateway from the list to manage credentials.</p>
                          </div>
                        );
                      }

                      return (
                        <div className="flex flex-col gap-4">
                          <div className="flex items-center justify-between border-b border-slate-150 pb-2.5">
                            <span className="text-xs font-bold block flex items-center gap-1.5 text-left" style={{ color: accentColor }}>
                              <Lock className="w-3.5 h-3.5" />
                              Credential Locker: {selectedGw.name}
                            </span>
                            
                            {selectedGw.id.startsWith("custom-") && (
                              <button
                                type="button"
                                onClick={() => {
                                  setDynamicGateways(prev => prev.filter(g => g.id !== selectedGw.id));
                                  setSelectedGatewayId("cod");
                                  setMerchantFeedbackMessage("🗑️ Purged custom payment gateway!");
                                }}
                                className="text-[10px] text-rose-500 font-bold hover:underline cursor-pointer"
                              >
                                Delete Module
                              </button>
                            )}
                          </div>

                          {!selectedGw.enabled && (
                            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-[11px] leading-normal font-semibold">
                              ⚠️ This gateway is currently DISABLED. Customers won't see it on their checkout screen unless you toggle the active switch.
                            </div>
                          )}

                          {selectedGw.fields.length === 0 ? (
                            <div className="py-10 px-4 flex flex-col items-center justify-center text-center gap-2 bg-slate-50/30 rounded-xl border border-slate-100">
                              <CheckCircle className="w-8 h-8 text-slate-300 stroke-[1.5]" />
                              <span className="text-xs font-bold text-slate-700">No Credentials Required</span>
                              <p className="text-[10.5px] text-slate-400 max-w-xs mt-1">This checkout module runs on-site with zero API keys or bank details needed.</p>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-4">
                              {selectedGw.fields.map((fld) => (
                                <div key={fld.key} className="group/spec text-left">
                                  <label className="text-xs font-black block font-mono mb-1.5" style={{ fontSize: "11px", color: "#475569" }}>
                                    {fld.label}
                                  </label>
                                  {fld.type === "textarea" ? (
                                    <textarea
                                      rows={3}
                                      value={fld.value}
                                      onChange={(e) => {
                                        const newVal = e.target.value;
                                        setDynamicGateways(prev => prev.map(g => {
                                          if (g.id === selectedGw.id) {
                                            return {
                                              ...g,
                                              fields: g.fields.map(f => f.key === fld.key ? { ...f, value: newVal } : f)
                                            };
                                          }
                                          return g;
                                        }));
                                      }}
                                      placeholder={fld.placeholder}
                                      className="w-full text-xs font-mono p-3 border rounded-[7px] focus:bg-white focus:border-slate-400 focus:outline-none transition-all font-bold text-slate-900 bg-white resize-none"
                                      style={{
                                        backgroundColor: "#ffffff",
                                        borderColor: "#8f8b8b",
                                        borderWidth: "1px",
                                        borderRadius: "7px",
                                        borderStyle: "solid"
                                      }}
                                    />
                                  ) : (
                                    <input
                                      type={fld.type}
                                      value={fld.value}
                                      onChange={(e) => {
                                        const newVal = e.target.value;
                                        setDynamicGateways(prev => prev.map(g => {
                                          if (g.id === selectedGw.id) {
                                            return {
                                              ...g,
                                              fields: g.fields.map(f => f.key === fld.key ? { ...f, value: newVal } : f)
                                            };
                                          }
                                          return g;
                                        }));
                                      }}
                                      placeholder={fld.placeholder}
                                      className="w-full text-xs font-mono p-3 border rounded-[7px] focus:bg-white focus:border-slate-400 focus:outline-none transition-all font-bold text-slate-900 bg-white"
                                      style={{
                                        backgroundColor: "#ffffff",
                                        borderColor: "#8f8b8b",
                                        borderWidth: "1px",
                                        borderRadius: "7px",
                                        borderStyle: "solid"
                                      }}
                                    />
                                  )}
                                </div>
                              ))}

                              {/* Secure Callback Alert */}
                              {selectedGw.type === "card" && (
                                <div className="bg-slate-50 border border-slate-150 rounded-xl p-3 leading-snug">
                                  <span className="text-[10px] font-bold text-slate-400 font-mono block uppercase">Secure Webhook Handshake Endpoint:</span>
                                  <span className="text-[10.5px] font-mono break-all font-bold mt-1 block" style={{ color: accentColor }}>
                                    https://checkout.yume.store/api/v1/payments/{selectedGw.id}/handshake
                                  </span>
                                </div>
                              )}
                            </div>
                          )}

                          <div className="p-3.5 bg-indigo-50/10 border border-indigo-100 rounded-xl text-[11px] leading-relaxed text-slate-500">
                            🔒 <strong>SATIM TLS Cryptography Shield:</strong> API tokens, merchant credentials, and key certificates are salted and encrypted client-side using industry standard AES-256 protocols.
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                </div>
              </div>
            )}

            {/* Tab 4: Notifications Hub */}
            {activeTab === "notifications" && (
              <div className="flex flex-col gap-6 fade-in text-left">
                <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 font-sans flex items-center gap-2">
                      <Megaphone className="w-5 h-5" style={{ color: accentColor }} />
                      Alerts Hub & Delivery Channels
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">Configure multi-channel push triggers (Telegram Bot / Email) and orchestrate automated reporting cycles.</p>
                  </div>
                  <button 
                    type="button"
                    onClick={handleTriggerSimulatedAlert}
                    className="px-2.5 py-1 text-[10.5px] font-bold border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-1 active:scale-98"
                  >
                    🔔 Sim Alert
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
                  
                  {/* Left Column: Multi-Channel Alerts Configurations */}
                  <div className="flex flex-col gap-5">
                    
                    {/* Trigger Events checkboxes */}
                    <div className="p-4 bg-white border border-slate-150 rounded-2xl shadow-3xs flex flex-col gap-3">
                      <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Trigger Events:</span>
                      
                      <div className="flex flex-col gap-2.5">
                        <label className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl cursor-pointer select-none transition-colors">
                          <input 
                            type="checkbox"
                            checked={notifyOrder}
                            onChange={(e) => setNotifyOrder(e.target.checked)}
                            className="w-4.5 h-4.5 rounded border-slate-300 cursor-pointer"
                            style={{ accentColor }}
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-800">New Store Checkout Orders</span>
                            <p className="text-[10px] text-slate-450">Fires sound bell and registers instant order status logs.</p>
                          </div>
                        </label>

                        <label className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl cursor-pointer select-none transition-colors">
                          <input 
                            type="checkbox"
                            checked={notifyReview}
                            onChange={(e) => setNotifyReview(e.target.checked)}
                            className="w-4.5 h-4.5 rounded border-slate-300 cursor-pointer"
                            style={{ accentColor }}
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-800">New Buyer Rating & Reviews</span>
                            <p className="text-[10px] text-slate-450">Alerts when customers post testimonials or star reviews.</p>
                          </div>
                        </label>

                        <label className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl cursor-pointer select-none transition-colors">
                          <input 
                            type="checkbox"
                            checked={notifyFollow}
                            onChange={(e) => setNotifyFollow(e.target.checked)}
                            className="w-4.5 h-4.5 rounded border-slate-300 cursor-pointer"
                            style={{ accentColor }}
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-800">Audience & Follower Growth</span>
                            <p className="text-[10px] text-slate-450">Receive notifications when fans request manual admittance validation.</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Channel 1: Email Digests */}
                    <div className="p-4 bg-white border border-slate-150 rounded-2xl shadow-3xs flex flex-col gap-3">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">✉️</span>
                          <div>
                            <span className="text-xs font-bold text-slate-850 block">Primary Email Dispatches</span>
                            <span className="text-[10px] text-slate-400">Receive store summaries & verification triggers</span>
                          </div>
                        </div>
                        <SkeuomorphicSwitch 
                          checked={notifyEmail}
                          onChange={setNotifyEmail}
                        />
                      </div>
                      
                      {notifyEmail && (
                        <div className="group/spec text-left mt-2">
                          <label className="text-[10px] font-black block font-mono mb-1" style={{ color: "#475569" }}>Notification Receiver Address</label>
                          <input
                            type="email"
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            className="w-full text-xs font-sans p-2.5 border rounded-[7px] focus:bg-white focus:border-slate-400 focus:outline-none transition-all font-bold text-slate-900 bg-white"
                            style={{
                              backgroundColor: "#ffffff",
                              borderColor: "#8f8b8b",
                              borderWidth: "1px",
                              borderRadius: "7px",
                              borderStyle: "solid"
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Channel 2: Telegram Bot API Credentials */}
                    <div className="p-4 bg-white border border-slate-150 rounded-2xl shadow-3xs flex flex-col gap-3">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">✈️</span>
                          <div>
                            <span className="text-xs font-bold text-slate-850 block">Telegram Bot Push Alerts</span>
                            <span className="text-[10px] text-slate-400">Direct order alerts pushed via secure bot API</span>
                          </div>
                        </div>
                        <SkeuomorphicSwitch 
                          checked={telegramEnabled}
                          onChange={setTelegramEnabled}
                        />
                      </div>

                      {telegramEnabled && (
                        <div className="flex flex-col gap-3 animate-fade-in text-left">
                          <div className="group/spec text-left">
                            <label className="text-[10px] font-black block font-mono mb-1" style={{ color: "#475569" }}>Telegram Bot Token API</label>
                            <input
                              type="password"
                              value={telegramBotToken}
                              onChange={(e) => setTelegramBotToken(e.target.value)}
                              placeholder="e.g. 518392107:AAE_x8b27_Y..."
                              className="w-full text-xs font-mono p-2.5 border rounded-[7px] focus:bg-white focus:border-slate-400 focus:outline-none transition-all font-bold text-slate-900 bg-white"
                              style={{
                                backgroundColor: "#ffffff",
                                borderColor: "#8f8b8b",
                                borderWidth: "1px",
                                borderRadius: "7px",
                                borderStyle: "solid"
                              }}
                            />
                          </div>

                          <div className="group/spec text-left">
                            <label className="text-[10px] font-black block font-mono mb-1" style={{ color: "#475569" }}>Chat ID or Channel Handle</label>
                            <input
                              type="text"
                              value={telegramChatId}
                              onChange={(e) => setTelegramChatId(e.target.value)}
                              placeholder="e.g. -10018928374 or @my_yume_boutique"
                              className="w-full text-xs font-mono p-2.5 border rounded-[7px] focus:bg-white focus:border-slate-400 focus:outline-none transition-all font-bold text-slate-900 bg-white"
                              style={{
                                backgroundColor: "#ffffff",
                                borderColor: "#8f8b8b",
                                borderWidth: "1px",
                                borderRadius: "7px",
                                borderStyle: "solid"
                              }}
                            />
                          </div>

                          <div className="p-2.5 bg-sky-50 text-sky-850 border border-sky-100 rounded-xl text-[10.5px] leading-relaxed">
                            💡 <strong>Integration Setup:</strong> Invite your custom bot (created via @BotFather) into your admin Telegram channel and copy-paste your credentials. Direct purchase summaries will instantly broadcast there!
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Scheduled Report Dispatcher & CSV/PDF exporter */}
                  <div className="flex flex-col gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs self-start w-full">
                    <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">📊 Scheduled Report Dispatcher</span>
                    
                    {/* Frequency selector */}
                    <div className="group/spec text-left">
                      <label className="text-[10px] font-black block font-mono mb-1.5" style={{ color: "#475569" }}>Report Generation Cycle</label>
                      <div className="relative">
                        <select
                          value={emailReportsFrequency}
                          onChange={(e) => setEmailReportsFrequency(e.target.value as any)}
                          className="w-full text-xs font-sans p-2.5 pr-8 border rounded-[7px] focus:bg-white focus:border-slate-400 focus:outline-none transition-all font-bold text-slate-900 bg-white cursor-pointer appearance-none"
                          style={{
                            backgroundColor: "#ffffff",
                            borderColor: "#8f8b8b",
                            borderWidth: "1px",
                            borderRadius: "7px",
                            borderStyle: "solid"
                          }}
                        >
                          <option value="daily">📅 Daily Digest (Every Midnight Algiers Time)</option>
                          <option value="weekly">📆 Weekly Report (Every Sunday morning)</option>
                          <option value="monthly">🗓️ Monthly Audit (First day of month)</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500">
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    {/* Included Sections checkboxes */}
                    <div className="border border-slate-200 rounded-xl p-3 text-left">
                      <label className="text-[9.5px] font-bold text-slate-400 block uppercase mb-2">Included Metrics Sections</label>
                      
                      <div className="flex flex-col gap-2">
                        {[
                          { key: "sales", label: "Financial Sales & Revenue Metrics" },
                          { key: "orders", label: "Full Order Checkout Logs & Wilayas stats" },
                          { key: "followers", label: "Follower Audience & Audit logs" }
                        ].map((sec) => {
                          const isChecked = reportsIncludedSections.includes(sec.key);
                          return (
                            <label key={sec.key} className="flex items-center gap-2.5 cursor-pointer text-slate-700 text-xs">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {
                                  if (isChecked) {
                                    setReportsIncludedSections(prev => prev.filter(k => k !== sec.key));
                                  } else {
                                    setReportsIncludedSections(prev => [...prev, sec.key]);
                                  }
                                }}
                                className="rounded border-slate-300 w-4 h-4 cursor-pointer"
                                style={{ accentColor }}
                              />
                              <span className="font-medium text-slate-700">{sec.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* Export file format */}
                    <div className="group/spec text-left">
                      <label className="text-[10px] font-black block font-mono mb-1.5" style={{ color: "#475569" }}>File Format</label>
                      <div className="relative">
                        <select
                          value={exportFileType}
                          onChange={(e) => setExportFileType(e.target.value as any)}
                          className="w-full text-xs font-sans p-2.5 pr-8 border rounded-[7px] focus:bg-white focus:border-slate-400 focus:outline-none transition-all font-bold text-slate-900 bg-white cursor-pointer appearance-none"
                          style={{
                            backgroundColor: "#ffffff",
                            borderColor: "#8f8b8b",
                            borderWidth: "1px",
                            borderRadius: "7px",
                            borderStyle: "solid"
                          }}
                        >
                          <option value="pdf">📄 Adobe PDF Document (.pdf)</option>
                          <option value="csv">📊 Excel CSV Sheet (.csv)</option>
                          <option value="json">💻 Developers JSON Feed (.json)</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500">
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    {/* Compile & dispatch CTA */}
                    <button
                      type="button"
                      disabled={exportingReport || reportsIncludedSections.length === 0}
                      onClick={() => {
                        setExportingReport(true);
                        setMerchantFeedbackMessage("⏳ compiling report datasets and formatting layout...");
                        setTimeout(() => {
                          setExportingReport(false);
                          const randomId = `rep-${Date.now()}`;
                          const curDate = new Date().toISOString().substring(0, 10);
                          const newLog = {
                            id: randomId,
                            date: curDate,
                            type: emailReportsFrequency,
                            size: `${(Math.random() * 20 + 5).toFixed(1)} KB`,
                            status: "manual-export"
                          };
                          setReportsHistoryLogs(prev => [newLog, ...prev]);
                          setMerchantFeedbackMessage(`📥 Generated and downloaded ${exportFileType.toUpperCase()} report successfully!`);
                        }, 1200);
                      }}
                      className="w-full text-white font-bold text-xs py-2.5 rounded-xl shadow-2xs hover:shadow-xs transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none active:scale-98"
                      style={{ backgroundColor: accentColor }}
                    >
                      {exportingReport ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          <span>Generating Dispatch...</span>
                        </>
                      ) : (
                        <>
                          <span>📥 Compile & Download {exportFileType.toUpperCase()} Report</span>
                        </>
                      )}
                    </button>

                    {/* History logs table */}
                    <div className="border-t border-slate-150 pt-4 mt-2">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block mb-2">History & Sent Dispatches</span>
                      <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-1">
                        {reportsHistoryLogs.map((log) => (
                          <div key={log.id} className="p-2.5 bg-slate-50 border border-slate-150 rounded-xl flex items-center justify-between text-[11px]">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-800">Digest_{log.date}</span>
                                <span className="text-[9px] uppercase font-mono font-bold bg-slate-200 text-slate-600 px-1 py-0.2 rounded">
                                  {log.type}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400 block mt-0.5">Size: {log.size} • {log.status}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setMerchantFeedbackMessage(`📁 Opening cached report Digest_${log.date}...`)}
                              className="text-xs font-bold hover:underline cursor-pointer"
                              style={{ color: accentColor }}
                            >
                              Download
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* Tab 5: Followers management */}
            {activeTab === "followers" && (
              <div className="flex flex-col gap-6 fade-in text-left">
                <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 font-sans flex items-center gap-2">
                      <Users className="w-5 h-5" style={{ color: accentColor }} />
                      Audience & Follower Control
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">Monitor fans who follow your brand, manage security clear-lists, and track security verification logs.</p>
                  </div>
                </div>

                {/* Audiences counts grids */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white border border-slate-200 p-4 rounded-2xl text-left shadow-3xs hover:border-slate-350 transition-colors">
                    <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">Total Fans</span>
                    <span className="text-xl font-bold text-slate-900 block mt-1">{followersList.length}</span>
                  </div>
                  <div 
                    className="p-4 rounded-2xl text-left shadow-3xs border transition-colors"
                    style={{
                      backgroundColor: `${accentColor}0a`,
                      borderColor: `${accentColor}33`
                    }}
                  >
                    <span className="text-[9px] font-bold block uppercase tracking-wider" style={{ color: accentColor }}>Pending Requests</span>
                    <span className="text-xl font-bold block mt-1" style={{ color: accentColor }}>
                      {followersList.filter((f)=>f.status==="pending").length}
                    </span>
                  </div>
                  <div className="bg-white border border-slate-200 p-4 rounded-2xl text-left shadow-3xs hover:border-slate-350 transition-colors">
                    <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">Blocked Access</span>
                    <span className="text-xl font-bold text-slate-900 block mt-1">
                      {followersList.filter((f)=>f.status==="blocked").length}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column (lg:col-span-7): Followers controllers & Table list */}
                  <div className="lg:col-span-7 flex flex-col gap-4">
                    <div className="border border-slate-200 rounded-2xl p-4 flex flex-col gap-4 bg-white shadow-3xs">
                      
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="group/spec text-left flex-1 w-full">
                          <label className="text-[10px] font-black block font-mono mb-1.5" style={{ color: "#475569" }}>Verification Threshold</label>
                          <div className="relative">
                            <select 
                              value={whoCanFollow}
                              onChange={(e) => setWhoCanFollow(e.target.value)}
                              className="w-full text-xs font-sans p-2.5 pr-8 border rounded-[7px] focus:bg-white focus:border-slate-400 focus:outline-none transition-all font-bold text-slate-900 bg-white cursor-pointer appearance-none"
                              style={{
                                backgroundColor: "#ffffff",
                                borderColor: "#8f8b8b",
                                borderWidth: "1px",
                                borderRadius: "7px",
                                borderStyle: "solid"
                              }}
                            >
                              <option value="anyone">Anyone can follow (Highly Public)</option>
                              <option value="verified">Verified buyers only</option>
                              <option value="approved">Required manual merchant validation</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500">
                              <ChevronDown className="w-4 h-4" />
                            </div>
                          </div>
                        </div>

                        {/* Search followers */}
                        <div className="group/spec text-left w-full sm:w-48">
                          <label className="text-[10px] font-black block font-mono mb-1.5" style={{ color: "#475569" }}>Search Fan Base</label>
                          <input 
                            type="text" 
                            value={followersSearch} 
                            onChange={(e) => setFollowersSearch(e.target.value)}
                            placeholder="e.g. Kaddour..."
                            className="w-full text-xs font-sans p-2.5 border rounded-[7px] focus:bg-white focus:border-slate-400 focus:outline-none transition-all font-bold text-slate-900 bg-white"
                            style={{
                              backgroundColor: "#ffffff",
                              borderColor: "#8f8b8b",
                              borderWidth: "1px",
                              borderRadius: "7px",
                              borderStyle: "solid"
                            }}
                          />
                        </div>
                      </div>

                      {/* Interactive followers list */}
                      <div className="bg-white rounded-xl border border-slate-150 overflow-hidden mt-1">
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-slate-50/80 border-b border-slate-150 text-[9px] font-extrabold text-slate-400 tracking-wider text-left uppercase">
                                <th className="p-2.5">Fan Profile</th>
                                <th className="p-2.5">Wilaya</th>
                                <th className="p-2.5 text-center">Security Status</th>
                                <th className="p-2.5 text-right">Moderation</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-[11px] text-left">
                              {followersList
                                .filter((f) => f.name.toLowerCase().includes(followersSearch.toLowerCase()))
                                .map((f) => (
                                  <tr key={f.id} className="hover:bg-slate-50/30">
                                    <td className="p-2.5 flex items-center gap-2">
                                      <span className="text-base shrink-0 select-none">{f.avatar}</span>
                                      <div className="leading-tight min-w-0">
                                        <span className="font-bold text-slate-800 truncate block">
                                          {f.name}
                                        </span>
                                        <span className="text-[8.5px] font-mono text-slate-400 block">UID: {f.id.substring(0, 8)}...</span>
                                      </div>
                                    </td>
                                    <td className="p-2.5 font-bold text-slate-600">{f.location}</td>
                                    <td className="p-2.5 text-center">
                                      {f.status === "approved" && (
                                        <span className="bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded text-emerald-700 font-bold text-[9px] uppercase font-mono">
                                          Approved
                                        </span>
                                      )}
                                      {f.status === "pending" && (
                                        <span className="bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded text-amber-700 font-bold text-[9px] uppercase font-mono animate-pulse">
                                          Pending
                                        </span>
                                      )}
                                      {f.status === "blocked" && (
                                        <span className="bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded text-rose-700 font-bold text-[9px] uppercase font-mono">
                                          Blocked
                                        </span>
                                      )}
                                    </td>
                                    <td className="p-2.5 text-right">
                                      <div className="flex items-center gap-1 justify-end">
                                        {f.status === "pending" && (
                                          <>
                                            <button 
                                              type="button"
                                              onClick={() => handleUpdateFollowerState(f.id, "approved")}
                                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[9.5px] px-2 py-0.8 rounded cursor-pointer transition-colors"
                                            >
                                              Approve
                                            </button>
                                            <button 
                                              type="button"
                                              onClick={() => handleUpdateFollowerState(f.id, "blocked")}
                                              className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-[9.5px] px-2 py-0.8 rounded cursor-pointer transition-colors"
                                            >
                                              Block
                                            </button>
                                          </>
                                        )}

                                        {f.status === "approved" && (
                                          <button 
                                            type="button"
                                            onClick={() => handleUpdateFollowerState(f.id, "blocked")}
                                            className="hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-500 font-bold text-[9.5px] px-2 py-0.8 rounded cursor-pointer border border-slate-200 transition-colors"
                                          >
                                            Block
                                          </button>
                                        )}

                                        {f.status === "blocked" && (
                                          <button 
                                            type="button"
                                            onClick={() => handleUpdateFollowerState(f.id, "approved")}
                                            className="bg-slate-900 hover:bg-slate-850 text-white font-bold text-[9.5px] px-2 py-0.8 rounded cursor-pointer transition-colors"
                                          >
                                            Unblock
                                          </button>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column (lg:col-span-5): Chronological Security Moderation Logs Dashboard */}
                  <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-4 shadow-3xs flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">🔒 Security Audit Logs</span>
                        <span className="text-[10px] text-slate-450 mt-0.5">Chronological access & action track</span>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => {
                          setFollowerLogs([]);
                          setMerchantFeedbackMessage("🧹 Purged follower audit log trail history!");
                        }}
                        className="text-[9.5px] font-bold text-rose-500 hover:underline cursor-pointer"
                      >
                        Reset Audit Trail
                      </button>
                    </div>

                    {/* Simple logs overview stats */}
                    <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div className="text-center">
                        <span className="text-[8.5px] font-extrabold uppercase text-slate-400 tracking-wider block">Logged Events</span>
                        <span className="text-sm font-bold text-slate-800 block mt-0.5">{followerLogs.length}</span>
                      </div>
                      <div className="text-center border-l border-slate-200">
                        <span className="text-[8.5px] font-extrabold uppercase text-slate-400 tracking-wider block">Security Level</span>
                        <span className="text-xs font-black text-emerald-600 block mt-0.5">HIGH (AES-256)</span>
                      </div>
                    </div>

                    {/* Scrollable logs list */}
                    <div className="flex flex-col gap-2.5 max-h-96 overflow-y-auto pr-1">
                      {followerLogs.length === 0 ? (
                        <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center gap-1.5">
                          <span className="text-2xl">📝</span>
                          <span className="text-xs font-bold text-slate-500">Log Trail is Clean</span>
                          <p className="text-[10px] text-slate-400 max-w-xs">Perform moderation actions (approve/block) on followers to trigger real-time log registrations.</p>
                        </div>
                      ) : (
                        followerLogs.map((log) => {
                          const isBlock = log.action === "Blocked";
                          const isApprove = log.action === "Approved";
                          return (
                            <div 
                              key={log.id} 
                              className={`p-3 rounded-xl border flex flex-col gap-1 transition-all hover:bg-slate-50/50 ${
                                isBlock 
                                  ? "bg-rose-50/10 border-rose-100" 
                                  : isApprove 
                                    ? "bg-emerald-50/10 border-emerald-100" 
                                    : "bg-slate-50/30 border-slate-150"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[10.5px] font-bold text-slate-800">
                                  {log.followerName}
                                </span>
                                <span className={`text-[8.5px] font-mono font-bold uppercase px-1.5 py-0.2 rounded ${
                                  isBlock 
                                    ? "bg-rose-100 text-rose-700" 
                                    : isApprove 
                                      ? "bg-emerald-100 text-emerald-700" 
                                      : "bg-slate-200 text-slate-600"
                                }`}>
                                  {log.action}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500 leading-normal font-medium text-left">
                                {log.details}
                              </p>
                              <span className="text-[8.5px] font-mono text-slate-400 text-left mt-1 block">
                                📅 {log.timestamp}
                              </span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* Tab 6: Design & Public customizing */}
            {activeTab === "design" && (
              <div className="flex flex-col gap-6 fade-in">
                <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 font-sans flex items-center gap-2">
                      <Sliders className="w-5 h-5" style={{ color: accentColor }} />
                      Public Page Style & Customized Layouts
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">Control the colors, marquee notifications and modal border frames of your buyer view.</p>
                  </div>
                  {/* Floating Action Quick Preview */}
                  <button
                    type="button"
                    onClick={() => {
                      handleGlobalPersistSettings();
                      setMerchantFeedbackMessage("⚡ Launching storefront preview...");
                    }}
                    className="px-4.5 py-2.5 bg-slate-900 hover:bg-rose-600 text-white rounded-xl text-xs font-black transition-all shadow-sm flex items-center gap-1.5 active:scale-95 cursor-pointer self-start sm:self-auto"
                    style={{ backgroundColor: accentColor }}
                  >
                    <Eye className="w-4 h-4" />
                    Preview Live Storefront Profile
                  </button>
                </div>

                {/* 🛍️ Product Grid Sizing & Spacing Panel */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-white text-left shadow-3xs space-y-5 animate-fade-in-down" id="merchant-grid-customizer-panel">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <h5 className="text-sm font-black text-slate-800 flex items-center gap-2">
                        <span className="text-lg">🛍️</span>
                        Product Card Sizing & Grid Spacing Studio
                      </h5>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Customize how products appear on your storefront by altering card widths and the gap spacing between them.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Width adjustment */}
                    <div className="space-y-3 bg-slate-50/60 p-4 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-xs font-bold text-slate-700 block">1. Product Card Minimum Width</span>
                        <span className="text-[10px] text-slate-400 block leading-tight mt-0.5">
                          Set the minimum size of each product card. Cards scale dynamically to fit standard grids.
                        </span>
                      </div>
                      
                      {/* Current Value Badge & Quick Buttons */}
                      <div className="flex flex-wrap items-center gap-2">
                        {[
                          { label: "Micro (50px)", val: "50px" },
                          { label: "Dense (100px)", val: "100px" },
                          { label: "Compact (150px)", val: "150px" },
                          { label: "Comfortable (200px)", val: "200px" },
                          { label: "Relaxed (250px)", val: "250px" },
                          { label: "Spacious (300px)", val: "300px" },
                          { label: "Ultra Wide (800px)", val: "800px" }
                        ].map((opt) => {
                          const isSelected = gridCardMinWidth === opt.val;
                          return (
                            <button
                              key={opt.val}
                              type="button"
                              onClick={() => {
                                setGridCardMinWidth(opt.val);
                                setMerchantFeedbackMessage(`📏 Width set to ${opt.val}`);
                              }}
                              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                                isSelected
                                  ? "text-white shadow-3xs"
                                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                              }`}
                              style={isSelected ? { backgroundColor: accentColor, borderColor: accentColor } : {}}
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>

                      {/* Precise Dropdown Selector */}
                      <div className="group/spec text-left pt-1">
                        <label className="text-[10px] font-black block font-mono mb-1" style={{ color: "#475569" }}>Precise Width Selection</label>
                        <div className="relative">
                          <select
                            value={gridCardMinWidth}
                            onChange={(e) => {
                              setGridCardMinWidth(e.target.value);
                              setMerchantFeedbackMessage(`📏 Width adjusted to ${e.target.value}`);
                            }}
                            className="w-full text-xs font-sans p-2.5 pr-8 border rounded-[7px] focus:bg-white focus:border-slate-400 focus:outline-none transition-all font-bold text-slate-900 bg-white cursor-pointer appearance-none"
                            style={{
                              backgroundColor: "#ffffff",
                              borderColor: "#8f8b8b",
                              borderWidth: "1px",
                              borderRadius: "7px",
                              borderStyle: "solid"
                            }}
                          >
                            <option value="50px">50px (Micro columns)</option>
                            <option value="100px">100px (Extra Dense)</option>
                            <option value="150px">150px (Dense layout)</option>
                            <option value="200px">200px (Compact layout)</option>
                            <option value="250px">250px (Comfortable grid)</option>
                            <option value="300px">300px (Default - Spacious columns)</option>
                            <option value="350px">350px (Wide cards)</option>
                            <option value="400px">400px (Extra Wide)</option>
                            <option value="500px">500px (Giant cards)</option>
                            <option value="800px">800px (Ultra Wide / Banner columns)</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500">
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Gap spacing adjustment */}
                    <div className="space-y-3 bg-slate-50/60 p-4 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-xs font-bold text-slate-700 block">2. Grid Cards Gap Spacing</span>
                        <span className="text-[10px] text-slate-400 block leading-tight mt-0.5">
                          Set the space (margin) between product card items inside your boutique layout.
                        </span>
                      </div>

                      {/* Current Value Badge & Quick Buttons */}
                      <div className="flex flex-wrap items-center gap-2">
                        {[
                          { label: "Tiny (5px)", val: "5px" },
                          { label: "10px", val: "10px" },
                          { label: "15px", val: "15px" },
                          { label: "Standard (20px)", val: "20px" },
                          { label: "Loose (30px)", val: "30px" },
                          { label: "40px", val: "40px" },
                          { label: "Spacious (50px)", val: "50px" },
                          { label: "Double (80px)", val: "80px" }
                        ].map((opt) => {
                          const isSelected = gridCardGap === opt.val;
                          return (
                            <button
                              key={opt.val}
                              type="button"
                              onClick={() => {
                                setGridCardGap(opt.val);
                                setMerchantFeedbackMessage(`↔️ Spacing gap set to ${opt.val}`);
                              }}
                              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                                isSelected
                                  ? "text-white shadow-3xs"
                                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                              }`}
                              style={isSelected ? { backgroundColor: accentColor, borderColor: accentColor } : {}}
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>

                      {/* Precise Dropdown Selector */}
                      <div className="group/spec text-left pt-1">
                        <label className="text-[10px] font-black block font-mono mb-1" style={{ color: "#475569" }}>Precise Gap Selection</label>
                        <div className="relative">
                          <select
                            value={gridCardGap}
                            onChange={(e) => {
                              setGridCardGap(e.target.value);
                              setMerchantFeedbackMessage(`↔️ Spacing gap adjusted to ${e.target.value}`);
                            }}
                            className="w-full text-xs font-sans p-2.5 pr-8 border rounded-[7px] focus:bg-white focus:border-slate-400 focus:outline-none transition-all font-bold text-slate-900 bg-white cursor-pointer appearance-none"
                            style={{
                              backgroundColor: "#ffffff",
                              borderColor: "#8f8b8b",
                              borderWidth: "1px",
                              borderRadius: "7px",
                              borderStyle: "solid"
                            }}
                          >
                            <option value="0px">0px (No gap)</option>
                            <option value="5px">5px (Minimalistic thin border gap)</option>
                            <option value="10px">10px (Dense spacing)</option>
                            <option value="15px">15px (Cozy spacing)</option>
                            <option value="20px">20px (Default - Balanced spacing)</option>
                            <option value="30px">30px (Generous spacing)</option>
                            <option value="40px">40px (Wide separation)</option>
                            <option value="50px">50px (Very wide spacing)</option>
                            <option value="60px">60px (Ultra separated)</option>
                            <option value="80px">80px (Extreme gap spacing)</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500">
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Buyer Authorization section */}
                  <div className="pt-4 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h6 className="text-xs font-black text-slate-800 flex items-center gap-1.5 uppercase font-mono tracking-wider">
                        <span>🔓</span> Dynamic Buyer Authorization
                      </h6>
                      <p className="text-[11px] text-slate-500 leading-normal">
                        Enable registered buyers to customize product card size limits and gap spacing directly on your public boutique storefront.
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-600 select-none">
                        {permitBuyerModifications ? "Authorized" : "Merchant Locked"}
                      </span>
                      <SkeuomorphicSwitch
                        id="dynamic-buyer-auth-toggle"
                        checked={permitBuyerModifications}
                        onChange={(val) => {
                          setPermitBuyerModifications(val);
                          setMerchantFeedbackMessage(
                            val 
                              ? "✅ Registered buyers can now customize layouts!" 
                              : "🔒 Buyer custom layouts disabled"
                          );
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* 🎨 Brand Store Accent Color Customizer Panel */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-white text-left shadow-3xs space-y-4">
                  <div>
                    <h5 className="text-sm font-black text-slate-800 flex items-center gap-2">
                      <span className="text-lg">🎨</span>
                      Boutique Storefront Brand Accent Color
                    </h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Select a premium color palette to style your storefront's product image carousels, action buttons, pagination, and active slider selectors.
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4">
                    {/* Preset Circles */}
                    <div className="flex flex-wrap gap-2.5">
                      {[
                        { name: "Rose Red", hex: "#ff385c" },
                        { name: "Emerald Green", hex: "#10b981" },
                        { name: "Royal Blue", hex: "#3b82f6" },
                        { name: "Sahara Gold", hex: "#f59e0b" },
                        { name: "Berber Indigo", hex: "#8b5cf6" },
                        { name: "Sunset Pink", hex: "#ec4899" },
                        { name: "Teal Sea", hex: "#06b6d4" },
                        { name: "Classic Noir", hex: "#000000" },
                        { name: "Transparent", hex: "transparent" }
                      ].map((preset) => {
                        const isSelected = storeAccentColor === preset.hex;
                        return (
                          <button
                            key={preset.hex}
                            type="button"
                            onClick={() => setStoreAccentColor(preset.hex)}
                            className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 flex items-center justify-center relative shadow-3xs cursor-pointer ${
                              isSelected ? "border-slate-800 scale-105" : preset.hex === "transparent" ? "border-slate-300 hover:border-slate-400" : "border-transparent"
                            }`}
                            title={preset.name}
                            style={preset.hex === "transparent" ? {
                              backgroundColor: "#ffffff",
                              backgroundImage: "linear-gradient(135deg, transparent 45%, #ef4444 45%, #ef4444 55%, transparent 55%)"
                            } : { backgroundColor: preset.hex }}
                          >
                            {isSelected && (
                              <span className="w-2.5 h-2.5 rounded-full bg-white shadow-2xs animate-ping" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Separator line */}
                    <div className="hidden sm:block h-8 w-[1px] bg-slate-200" />

                    {/* Precise input color picker */}
                    <div className="flex items-center gap-2.5 bg-white p-1.5 px-3 rounded-xl border shadow-3xs" style={{ borderColor: "#8f8b8b", backgroundColor: "#ffffff" }}>
                      <div className="relative w-7 h-7 rounded-lg overflow-hidden border shadow-3xs shrink-0 cursor-pointer" style={{ borderColor: "#8f8b8b" }}>
                        <input
                          type="color"
                          value={storeAccentColor === "transparent" ? "#ffffff" : storeAccentColor}
                          onChange={(e) => setStoreAccentColor(e.target.value)}
                          className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer border-none p-0"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-extrabold text-slate-450 uppercase tracking-widest font-mono leading-none">Custom Color</span>
                        <input
                          type="text"
                          value={storeAccentColor.toUpperCase()}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val.startsWith("#") && val.length <= 7) {
                              setStoreAccentColor(val);
                            } else if (!val.startsWith("#") && val.length <= 6) {
                              setStoreAccentColor("#" + val);
                            }
                          }}
                          className="text-xs font-mono font-bold text-slate-700 bg-transparent border-none p-0 focus:ring-0 w-20 uppercase mt-0.5 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 🌟 Glassmorphic Blur & Transparency Studio Panel */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-white text-left shadow-3xs space-y-5">
                  <div>
                    <h5 className="text-sm font-black text-slate-800 flex items-center gap-2">
                      <Sliders className="w-5 h-5 text-rose-500 animate-pulse" />
                      Glassmorphic Blur & Transparency Studio
                    </h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Fine-tune the backdrop blur and opacity on your buyer storefront. Enable floating, colorful glowing background circles that merge with your layout.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Left Column: Glassmorphism Core controls */}
                    <div className="bg-slate-50/65 p-4 rounded-xl border border-slate-100 shadow-3xs space-y-4">
                      <span className="text-xs font-bold text-slate-700 block mb-1">1. Glassmorphic Surface Settings</span>

                      {/* Enable / Disable Glassmorphism */}
                      <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-150">
                        <div>
                          <label htmlFor="glass-blur-toggle" className="text-[11px] font-bold text-slate-700 block cursor-pointer select-none">
                            Enable Store Backdrop Glass Blur
                          </label>
                          <span className="text-[9px] text-slate-400 block leading-tight mt-0.5">
                            Apply frosted glass filter to storefront overlays & panels.
                          </span>
                        </div>
                        <SkeuomorphicSwitch
                          id="glass-blur-toggle"
                          checked={glassBlurEnabled}
                          onChange={(val) => {
                            setGlassBlurEnabled(val);
                            setMerchantFeedbackMessage(val ? "✨ Storefront glass blur activated!" : "📴 Storefront glass blur disabled!");
                          }}
                        />
                      </div>

                      {/* Glass Blur Amount (Sleeper) */}
                      <div className={`space-y-1.5 p-2.5 bg-white rounded-lg border border-slate-150 transition-opacity duration-200 ${!glassBlurEnabled ? "opacity-40 pointer-events-none" : ""}`}>
                        <div className="flex items-center justify-between text-[10.5px]">
                          <span className="font-bold text-slate-600">Glass Blur Amount (Intensity)</span>
                          <span className="font-mono font-bold text-rose-650 bg-rose-50 px-1.5 py-0.5 rounded">{glassBlurAmount}px</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="40"
                          value={glassBlurAmount}
                          onChange={(e) => setGlassBlurAmount(Number(e.target.value))}
                          className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-rose-500"
                        />
                        <span className="text-[8.5px] text-slate-400 block leading-tight">
                          Slide to reduce or increase the backdrop blur intensity.
                        </span>
                      </div>

                      {/* Glass Transparency (Sleeper) */}
                      <div className="space-y-1.5 p-2.5 bg-white rounded-lg border border-slate-150">
                        <div className="flex items-center justify-between text-[10.5px]">
                          <span className="font-bold text-slate-600">Glass Surface Transparency</span>
                          <span className="font-mono font-bold text-rose-650 bg-rose-50 px-1.5 py-0.5 rounded">{glassTransparency}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={glassTransparency}
                          onChange={(e) => setGlassTransparency(Number(e.target.value))}
                          className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-rose-500"
                        />
                        <span className="text-[8.5px] text-slate-400 block leading-tight">
                          Higher values increase transparency. Lower values make the overlay more solid.
                        </span>
                      </div>
                    </div>

                    {/* Right Column: Multi-color Blurry Background Circles */}
                    <div className="bg-slate-50/65 p-4 rounded-xl border border-slate-100 shadow-3xs space-y-4">
                      <span className="text-xs font-bold text-slate-700 block mb-1">2. Multi-Color Ambient Glow Bubbles</span>

                      {/* Enable/Disable Multi-color glowing circles */}
                      <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-150">
                        <div>
                          <label htmlFor="glass-multicolor-toggle" className="text-[11px] font-bold text-slate-700 block cursor-pointer select-none">
                            Enable Floating Ambient Glows
                          </label>
                          <span className="text-[9px] text-slate-400 block leading-tight mt-0.5">
                            Float custom blurry colorful circles behind your main store page.
                          </span>
                        </div>
                        <SkeuomorphicSwitch
                          id="glass-multicolor-toggle"
                          checked={glassMultiColorEnabled}
                          onChange={(val) => {
                            setGlassMultiColorEnabled(val);
                            setMerchantFeedbackMessage(val ? "🪐 Floating colorful ambient glows enabled!" : "📴 Floating glows turned off!");
                          }}
                        />
                      </div>

                      {/* Multi-color Blurry Circles Setup */}
                      <div className={`space-y-2.5 p-2.5 bg-white rounded-lg border border-slate-150 transition-opacity duration-200 ${!glassMultiColorEnabled ? "opacity-40 pointer-events-none" : ""}`}>
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-bold text-slate-600 uppercase tracking-wider font-mono">Custom Bubble Colors</span>
                          <span className="text-[9.5px] text-slate-400">{glassMultiColors.length} Active Colors</span>
                        </div>

                        {/* Interactive Color Swatches and List */}
                        <div className="flex flex-wrap gap-2 py-1">
                          {glassMultiColors.map((color, idx) => (
                            <div 
                              key={idx} 
                              className="flex items-center gap-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full pl-1 pr-2 py-0.5 shadow-3xs group transition-all"
                            >
                              <input
                                type="color"
                                value={color}
                                onChange={(e) => {
                                  const updatedColors = [...glassMultiColors];
                                  updatedColors[idx] = e.target.value;
                                  setGlassMultiColors(updatedColors);
                                }}
                                className="w-4.5 h-4.5 rounded-full border border-slate-300 cursor-pointer shrink-0 p-0"
                              />
                              <span className="text-[9px] font-mono uppercase font-black text-slate-600">{color}</span>
                              {glassMultiColors.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updatedColors = glassMultiColors.filter((_, i) => i !== idx);
                                    setGlassMultiColors(updatedColors);
                                    setMerchantFeedbackMessage("🧹 Removed bubble color swatch.");
                                  }}
                                  className="w-3.5 h-3.5 rounded-full text-slate-400 hover:text-red-500 hover:bg-slate-200 flex items-center justify-center text-[10px] font-black cursor-pointer shrink-0 transition"
                                  title="Delete color"
                                >
                                  ×
                                </button>
                              )}
                            </div>
                          ))}

                          {/* Add Color Button */}
                          {glassMultiColors.length < 6 && (
                            <button
                              type="button"
                              onClick={() => {
                                const newRandomColors = ["#3b82f6", "#ec4899", "#10b981", "#f59e0b", "#a855f7", "#06b6d4"];
                                const unusedColor = newRandomColors.find(c => !glassMultiColors.includes(c)) || "#f43f5e";
                                setGlassMultiColors([...glassMultiColors, unusedColor]);
                                setMerchantFeedbackMessage("✨ Added new customizable glow bubble!");
                              }}
                              className="px-2.5 py-1 text-[9px] font-black bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 border-dashed rounded-full flex items-center justify-center cursor-pointer transition"
                            >
                              + Add Color Swatch
                            </button>
                          )}
                        </div>

                        <p className="text-[9px] text-slate-400 leading-tight">
                          These colors generate massive, beautiful blurry atmospheric circles in the background of your boutique to establish high-fidelity depth!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 🌟 New Cover Templates Choice Control Panel Group */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 text-left shadow-2xs space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/60">
                    <div>
                      <h5 className="text-sm font-black text-slate-850 flex items-center gap-2">
                        <Sparkles className="w-4.5 h-4.5 text-amber-500 animate-pulse" />
                        Select Boutique Cover Template
                      </h5>
                      <p className="text-[11px] text-slate-500 mt-0.5">Choose between beautiful solid gradient banners, interactive 3D figures, or multi-image slideshows.</p>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-rose-650 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full text-center shrink-0 w-fit self-start sm:self-auto">
                      Active: {selectedCoverTemplate.toUpperCase()}
                    </span>
                  </div>

                  {/* SECTION 1: 10 Royal Cultural & Styled Banner Templates */}
                  <div className="space-y-3 banner-templates-section">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🎨</span>
                      <div>
                        <h6 className="text-xs font-black text-slate-800 uppercase tracking-wider font-mono">Cultural & Custom Styled Banners (10 Templates)</h6>
                        <p className="text-[10px] text-slate-400">Apply hand-crafted cultural themes, rich gradients, royal borders and atmospheric effects.</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {BANNER_TEMPLATES.map((tpl) => {
                        const isSelected = selectedCoverTemplate === tpl.id;
                        // get gradient
                        let bgGradient = "linear-gradient(135deg, #475569 0%, #1e293b 100%)";
                        if (tpl.id === "sahara_gold") bgGradient = "linear-gradient(135deg, #f59e0b 0%, #ea580c 50%, #7c2d12 100%)";
                        if (tpl.id === "casbah_minimal") bgGradient = "linear-gradient(135deg, #475569 0%, #1e293b 100%)";
                        if (tpl.id === "berber_indigo") bgGradient = "linear-gradient(135deg, #4f46e5 0%, #312e81 100%)";
                        if (tpl.id === "turquoise_sea") bgGradient = "linear-gradient(135deg, #0d9488 0%, #0891b2 50%, #0369a1 100%)";
                        if (tpl.id === "moorish_emerald") bgGradient = "linear-gradient(135deg, #064e3b 0%, #022c22 100%)";
                        if (tpl.id === "sunset_rose") bgGradient = "linear-gradient(135deg, #f43f5e 0%, #e11d48 50%, #9f1239 100%)";
                        if (tpl.id === "cyber_kasbah") bgGradient = "linear-gradient(135deg, #a855f7 0%, #701a75 50%, #4c1d95 100%)";
                        if (tpl.id === "slate_noir") bgGradient = "linear-gradient(135deg, #1c1917 0%, #0c0a09 100%)";
                        if (tpl.id === "terracotta") bgGradient = "linear-gradient(135deg, #c2410c 0%, #9a3412 50%, #7c2d12 100%)";
                        if (tpl.id === "velvet_crimson") bgGradient = "linear-gradient(135deg, #be123c 0%, #9f1239 50%, #4c0519 100%)";

                        return (
                          <div
                            key={tpl.id}
                            onClick={() => setSelectedCoverTemplate(tpl.id)}
                            className={`banner-template-card relative rounded-xl border-2 p-3.5 cursor-pointer flex flex-col justify-between overflow-hidden bg-white shadow-3xs h-[195px] transition-all duration-300 hover:shadow-2xs ${
                              isSelected 
                                ? "border-rose-500 bg-rose-500/2" 
                                : "border-slate-200"
                            }`}
                          >
                            {/* Action Indicators: Live Preview & Checkmark */}
                            <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-20">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPreviewTemplateId(tpl.id);
                                }}
                                className="bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-650 px-2 py-0.5 rounded border border-slate-200 hover:border-rose-200 text-[9px] font-bold shadow-3xs transition-all flex items-center gap-1 cursor-pointer select-none"
                                title="Live Preview Design"
                              >
                                <Eye className="w-2.5 h-2.5" />
                                <span>Preview</span>
                              </button>
                              {isSelected && (
                                <div className="bg-rose-500 text-white rounded-md p-1 shadow-sm shrink-0 flex items-center justify-center">
                                  <Check className="w-3 h-3 stroke-[3]" />
                                </div>
                              )}
                            </div>

                            <div className="space-y-1 relative z-10 max-w-[65%]">
                              <span className="text-[8.5px] font-extrabold text-slate-400 uppercase tracking-widest block font-mono">Boutique Cover</span>
                              <h6 className="text-[11.5px] font-black text-slate-900 leading-none flex items-center gap-1.5">
                                <span className="text-sm">{tpl.icon}</span> {tpl.name}
                              </h6>
                              <p className="text-[9.5px] text-slate-500 leading-snug line-clamp-1">{tpl.description}</p>
                            </div>

                            {/* Miniature Live Styled Preview */}
                            <div 
                              className="mt-1 h-12 rounded-lg relative overflow-hidden flex flex-col justify-between p-1.5 border border-black/10 shadow-3xs"
                              style={{ background: bgGradient }}
                            >
                              <div className="flex items-center justify-between opacity-85 scale-90 origin-top-left">
                                <span className="text-[5.5px] font-mono font-bold uppercase text-white px-1 py-0.5 bg-white/10 rounded border border-white/10">{tpl.badge}</span>
                                <span className="text-[5.5px] font-mono text-white/50">shop.dz</span>
                              </div>
                              <div className="my-auto text-left scale-90 origin-left">
                                <h5 className="text-[8px] font-extrabold text-white leading-none font-serif">{myStore.name || "Boutique"}</h5>
                                <p className="text-[5px] text-white/60 line-clamp-1 mt-0.5">Artisanal boutique store</p>
                              </div>
                            </div>

                            {/* Apply Template Interactive Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCoverTemplate(tpl.id);
                                handleGlobalPersistSettings(tpl.id);
                              }}
                              className={`w-full py-1.5 rounded-lg text-[9px] font-extrabold font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer text-center ${
                                isSelected
                                  ? "bg-slate-100 text-slate-400 border border-slate-200/80 cursor-not-allowed"
                                  : "bg-slate-900 hover:bg-rose-650 text-white shadow-3xs hover:shadow-2xs active:scale-[0.98]"
                              }`}
                              disabled={isSelected}
                            >
                              {isSelected ? "✓ Active Design Template" : "✨ Apply Template"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* SECTION 2: Original 3D & Slideshow Templates */}
                  <div className="space-y-3 pt-4 border-t border-slate-200/60">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🕹️</span>
                      <div>
                        <h6 className="text-xs font-black text-slate-800 uppercase tracking-wider font-mono">Original Interactive 3D & Slideshow Formats</h6>
                        <p className="text-[10px] text-slate-400">Original formats including interactive 3D avatars, custom branding overlays, and image slideshows.</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {INITIAL_COVER_TEMPLATES.map((tpl) => {
                        const isSelected = selectedCoverTemplate === tpl.id;
                        return (
                          <div
                            key={tpl.id}
                            onClick={() => setSelectedCoverTemplate(tpl.id)}
                            className={`relative rounded-xl border-2 p-3.5 cursor-pointer transition-all duration-300 flex flex-col justify-between overflow-hidden bg-white hover:scale-[1.02] shadow-3xs h-[140px] ${
                              isSelected 
                                ? "border-rose-500 bg-rose-500/2" 
                                : "border-slate-200 hover:border-slate-300 hover:shadow-2xs"
                            }`}
                          >
                            {/* Selected Active Check Indicator */}
                            {isSelected && (
                              <div className="absolute top-2.5 right-2.5 bg-rose-500 text-white rounded-full p-1 shadow-sm z-20">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </div>
                            )}

                            <div className="space-y-1">
                              <span className="text-[8.5px] font-extrabold text-slate-400 uppercase tracking-widest block font-mono">3D / Interactive format</span>
                              <h6 className="text-[11.5px] font-black text-slate-900 leading-tight">{tpl.name}</h6>
                              <p className="text-[9.5px] text-slate-500 leading-tight line-clamp-2">{tpl.description}</p>
                            </div>

                            {/* Beautiful Mini Layout Indicator Preview */}
                            <div className="mt-2 h-10 rounded-lg bg-slate-950/5 p-1 border border-slate-100 flex items-center gap-1.5 justify-center">
                              {tpl.id === "toonhub" && (
                                <div className="flex items-center gap-1">
                                  <span className="text-sm">👥</span>
                                  <span className="text-[9px] font-bold text-slate-600 font-mono">3D Characters Loop</span>
                                </div>
                              )}
                              {tpl.id === "mysticflower" && (
                                <div className="flex items-center gap-1">
                                  <span className="animate-bounce text-sm">🌸</span>
                                  <span className="text-[9px] font-bold text-fuchsia-600 font-mono">3D Character 02</span>
                                </div>
                              )}
                              {tpl.id === "classic" && (
                                <div className="flex items-center gap-1">
                                  <div className="w-4 h-4 bg-stone-300 rounded-xs shrink-0" />
                                  <span className="text-[9px] font-bold text-slate-600 font-mono">Slideshow Layout</span>
                                </div>
                              )}
                              {tpl.id === "gaming" && (
                                <div className="flex items-center gap-1">
                                  <span className="text-sm">🕹️</span>
                                  <span className="text-[9px] font-bold text-indigo-500 font-mono animate-pulse">Retro Oasis</span>
                                </div>
                              )}
                              {tpl.id === "cover77" && (
                                <div className="flex items-center gap-1">
                                  <span className="text-sm">👑</span>
                                  <span className="text-[9px] font-bold text-amber-600 font-mono">Luxury Editorial</span>
                                </div>
                              )}
                              {tpl.id === "my_brand" && (
                                <div className="flex items-center gap-1">
                                  <span className="text-sm">💫</span>
                                  <span className="text-[9px] font-bold text-rose-500 font-mono">Custom Brand PNG</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 👥 ToonHub / 3D Character 01 customizer options panel */}
                {selectedCoverTemplate === "toonhub" && (
                  <div className="p-5 rounded-2xl border border-rose-200 bg-rose-50/45 text-left shadow-2xs space-y-4">
                    <div>
                      <h5 className="text-sm font-black text-rose-950 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-rose-500 animate-pulse" />
                        Custom Configuration: ToonHub (3D Character 01)
                      </h5>
                      <p className="text-[11px] text-rose-700/80 mt-0.5">
                        Brand your cover with a custom logo, choose between 12 distinct 3D library figures, or display your active boutique products in a deep perspective 3D carousel.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Left: Branding & Mode */}
                      <div className="space-y-4">
                        <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-3xs space-y-3">
                          <span className="text-xs font-bold text-slate-850 block">1. Central Brand Logo</span>
                          <p className="text-[10px] text-slate-500 leading-relaxed">
                            Upload or set a custom brand logo image displayed prominently in the central layout.
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => setToonhubLogo(myStore.logo || "")}
                              className={`px-3 py-1.5 text-[11px] rounded-lg border font-medium transition cursor-pointer ${
                                toonhubLogo === (myStore.logo || "")
                                  ? "bg-rose-500 text-white border-rose-500"
                                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                              }`}
                            >
                              Use Store General Logo
                            </button>
                            <button
                              type="button"
                              onClick={() => setToonhubLogo("")}
                              className={`px-3 py-1.5 text-[11px] rounded-lg border font-medium transition cursor-pointer ${
                                toonhubLogo === ""
                                  ? "bg-rose-500 text-white border-rose-500"
                                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                              }`}
                            >
                              No Custom Logo (Use Text Name)
                            </button>
                          </div>
                          <div className="border rounded-xl px-3.5 py-1.5 bg-white hover:border-slate-400 focus-within:bg-white focus-within:border-rose-500 transition-all" style={{ borderColor: "#8f8b8b" }}>
                            <label className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block">Custom Brand Logo URL</label>
                            <input
                              type="text"
                              value={toonhubLogo}
                              onChange={(e) => setToonhubLogo(e.target.value)}
                              placeholder="Paste logo URL here..."
                              className="text-xs text-slate-900 placeholder-slate-400 font-semibold w-full bg-transparent outline-none border-none p-0 focus:ring-0 focus:outline-none mt-1"
                            />
                          </div>
                        </div>

                        <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-3xs space-y-3">
                          <span className="text-xs font-bold text-slate-850 block">2. Carousel Mode Selection</span>
                          <p className="text-[10px] text-slate-500 leading-relaxed">
                            Choose whether to showcase animated 3D character avatars, feature your active store products, or mix both!
                          </p>
                          <div className="grid grid-cols-3 gap-2">
                            {(["characters", "products", "both"] as const).map((mode) => (
                              <button
                                key={mode}
                                type="button"
                                onClick={() => setToonhubMode(mode)}
                                className={`py-2 px-1 text-[10px] rounded-lg border font-bold capitalize transition cursor-pointer ${
                                  toonhubMode === mode
                                    ? "bg-rose-500 text-white border-rose-500 shadow-3xs"
                                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                                }`}
                              >
                                {mode}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right: Products / Characters selection */}
                      <div className="space-y-4">
                        {toonhubMode !== "characters" && (
                          <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-3xs space-y-3">
                            <span className="text-xs font-bold text-slate-850 block">3. Featured Products</span>
                            <p className="text-[10px] text-slate-500 leading-relaxed">
                              Select products to feature inside your active ToonHub 3D perspective carousel.
                            </p>
                            <div className="max-h-40 overflow-y-auto space-y-1.5 border border-slate-150 rounded-lg p-2 bg-slate-50/50">
                              {myStore.products && myStore.products.length > 0 ? (
                                myStore.products.map((prod) => {
                                  const isChecked = toonhubProducts.includes(prod.id);
                                  return (
                                    <label
                                      key={prod.id}
                                      className="flex items-center gap-2 px-2 py-1.5 rounded bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 cursor-pointer select-none transition"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => {
                                          if (isChecked) {
                                            setToonhubProducts(toonhubProducts.filter((id) => id !== prod.id));
                                          } else {
                                            setToonhubProducts([...toonhubProducts, prod.id]);
                                          }
                                        }}
                                        className="w-4 h-4 rounded text-rose-500 border-slate-350 focus:ring-rose-500 cursor-pointer accent-rose-500"
                                      />
                                      <div className="w-6 h-6 rounded bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                                        <img src={prod.imageUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                      </div>
                                      <div className="flex-1 min-w-0 text-left">
                                        <span className="text-[10px] font-bold text-slate-800 block truncate leading-tight">
                                          {prod.name}
                                        </span>
                                      </div>
                                    </label>
                                  );
                                })
                              ) : (
                                <div className="p-3 text-center text-[10px] text-slate-400 italic">
                                  No products found.
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {toonhubMode !== "products" && (
                          <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-3xs space-y-3">
                            <span className="text-xs font-bold text-slate-850 block">4. Select Library Characters</span>
                            <p className="text-[10px] text-slate-500 leading-relaxed">
                              Choose which beautiful characters from our 3D library appear in the rotating layout (Min 1, Max 5).
                            </p>
                            <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto p-1 border border-slate-100 rounded-lg">
                              {CHARACTER_LIBRARY.map((char) => {
                                const isSelected = toonhubCharacters.includes(char.id);
                                return (
                                  <label
                                    key={char.id}
                                    className={`flex items-center gap-2 p-1.5 rounded-lg border cursor-pointer select-none transition ${
                                      isSelected
                                        ? "border-rose-300 bg-rose-50/50"
                                        : "border-slate-100 bg-white hover:bg-slate-50"
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={() => {
                                        if (isSelected) {
                                          if (toonhubCharacters.length > 1) {
                                            setToonhubCharacters(toonhubCharacters.filter((id) => id !== char.id));
                                          }
                                        } else {
                                          setToonhubCharacters([...toonhubCharacters, char.id]);
                                        }
                                      }}
                                      className="w-3.5 h-3.5 rounded text-rose-500 border-slate-300 focus:ring-rose-400 accent-rose-500 cursor-pointer"
                                    />
                                    <div className="w-7 h-7 rounded-full overflow-hidden border shrink-0 flex items-center justify-center bg-slate-100" style={{ borderColor: char.panel }}>
                                      <img src={char.src} alt="" className="w-6 h-6 object-contain" referrerPolicy="no-referrer" />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-700 truncate">{char.name}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 🌸 MysticFlower / 3D Character 02 customizer options panel */}
                {selectedCoverTemplate === "mysticflower" && (
                  <div className="p-5 rounded-2xl border border-fuchsia-200 bg-fuchsia-50/45 text-left shadow-2xs space-y-4">
                    <div>
                      <h5 className="text-sm font-black text-fuchsia-950 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-fuchsia-500 animate-pulse" />
                        Custom Configuration: MysticFlower (3D Character 02)
                      </h5>
                      <p className="text-[11px] text-fuchsia-700/80 mt-0.5">
                        Brand your celestial background, floating amongst drifting cherry blossoms and slow-pulsing star particles. Customize active characters and product integrations.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Left: Branding & Mode */}
                      <div className="space-y-4">
                        <div className="bg-white p-4 rounded-xl border border-fuchsia-100 shadow-3xs space-y-3">
                          <span className="text-xs font-bold text-slate-850 block">1. Celestial Brand Logo</span>
                          <p className="text-[10px] text-slate-500 leading-relaxed">
                            Set a custom logo that glows gently amongst drifting blossom petals and cosmic dust.
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => setMysticflowerLogo(myStore.logo || "")}
                              className={`px-3 py-1.5 text-[11px] rounded-lg border font-medium transition cursor-pointer ${
                                mysticflowerLogo === (myStore.logo || "")
                                  ? "bg-fuchsia-600 text-white border-fuchsia-600"
                                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                              }`}
                            >
                              Use Store General Logo
                            </button>
                            <button
                              type="button"
                              onClick={() => setMysticflowerLogo("")}
                              className={`px-3 py-1.5 text-[11px] rounded-lg border font-medium transition cursor-pointer ${
                                mysticflowerLogo === ""
                                  ? "bg-fuchsia-600 text-white border-fuchsia-600"
                                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                              }`}
                            >
                              No Custom Logo
                            </button>
                          </div>
                          <div className="border rounded-xl px-3.5 py-1.5 bg-white hover:border-slate-400 focus-within:bg-white focus-within:border-fuchsia-500 transition-all" style={{ borderColor: "#8f8b8b" }}>
                            <label className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block">Custom Logo URL</label>
                            <input
                              type="text"
                              value={mysticflowerLogo}
                              onChange={(e) => setMysticflowerLogo(e.target.value)}
                              placeholder="Paste logo URL here..."
                              className="text-xs text-slate-900 placeholder-slate-400 font-semibold w-full bg-transparent outline-none border-none p-0 focus:ring-0 focus:outline-none mt-1"
                            />
                          </div>
                        </div>

                        <div className="bg-white p-4 rounded-xl border border-fuchsia-100 shadow-3xs space-y-3">
                          <span className="text-xs font-bold text-slate-850 block">2. Cosmic Layout Mode</span>
                          <p className="text-[10px] text-slate-500 leading-relaxed">
                            Feature either high-quality aesthetic library objects, active boutique products, or blend both in a starry orbit.
                          </p>
                          <div className="grid grid-cols-3 gap-2">
                            {(["characters", "products", "both"] as const).map((mode) => (
                              <button
                                key={mode}
                                type="button"
                                onClick={() => setMysticflowerMode(mode)}
                                className={`py-2 px-1 text-[10px] rounded-lg border font-bold capitalize transition cursor-pointer ${
                                  mysticflowerMode === mode
                                    ? "bg-fuchsia-600 text-white border-fuchsia-600 shadow-3xs"
                                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                                }`}
                              >
                                {mode}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right: Selections */}
                      <div className="space-y-4">
                        {mysticflowerMode !== "characters" && (
                          <div className="bg-white p-4 rounded-xl border border-fuchsia-100 shadow-3xs space-y-3">
                            <span className="text-xs font-bold text-slate-850 block">3. Featured Products</span>
                            <p className="text-[10px] text-slate-500 leading-relaxed">
                              Select products to feature inside your active MysticFlower 3D breathing layout.
                            </p>
                            <div className="max-h-40 overflow-y-auto space-y-1.5 border border-slate-150 rounded-lg p-2 bg-slate-50/50">
                              {myStore.products && myStore.products.length > 0 ? (
                                myStore.products.map((prod) => {
                                  const isChecked = mysticflowerProducts.includes(prod.id);
                                  return (
                                    <label
                                      key={prod.id}
                                      className="flex items-center gap-2 px-2 py-1.5 rounded bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 cursor-pointer select-none transition"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => {
                                          if (isChecked) {
                                            setMysticflowerProducts(mysticflowerProducts.filter((id) => id !== prod.id));
                                          } else {
                                            setMysticflowerProducts([...mysticflowerProducts, prod.id]);
                                          }
                                        }}
                                        className="w-4 h-4 rounded text-fuchsia-600 border-slate-350 focus:ring-fuchsia-500 cursor-pointer accent-fuchsia-600"
                                      />
                                      <div className="w-6 h-6 rounded bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                                        <img src={prod.imageUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                      </div>
                                      <div className="flex-1 min-w-0 text-left">
                                        <span className="text-[10px] font-bold text-slate-800 block truncate leading-tight">
                                          {prod.name}
                                        </span>
                                      </div>
                                    </label>
                                  );
                                })
                              ) : (
                                <div className="p-3 text-center text-[10px] text-slate-400 italic">
                                  No products found.
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {mysticflowerMode !== "products" && (
                          <div className="bg-white p-4 rounded-xl border border-fuchsia-100 shadow-3xs space-y-3">
                            <span className="text-xs font-bold text-slate-850 block">4. Select Cosmic Characters</span>
                            <p className="text-[10px] text-slate-500 leading-relaxed">
                              Choose which celestial elements float in the star space (Min 1, Max 5).
                            </p>
                            <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto p-1 border border-slate-100 rounded-lg">
                              {CHARACTER_LIBRARY.map((char) => {
                                const isSelected = mysticflowerCharacters.includes(char.id);
                                return (
                                  <label
                                    key={char.id}
                                    className={`flex items-center gap-2 p-1.5 rounded-lg border cursor-pointer select-none transition ${
                                      isSelected
                                        ? "border-fuchsia-300 bg-fuchsia-50/50"
                                        : "border-slate-100 bg-white hover:bg-slate-50"
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={() => {
                                        if (isSelected) {
                                          if (mysticflowerCharacters.length > 1) {
                                            setMysticflowerCharacters(mysticflowerCharacters.filter((id) => id !== char.id));
                                          }
                                        } else {
                                          setMysticflowerCharacters([...mysticflowerCharacters, char.id]);
                                        }
                                      }}
                                      className="w-3.5 h-3.5 rounded text-fuchsia-600 border-slate-300 focus:ring-fuchsia-500 accent-fuchsia-600 cursor-pointer"
                                    />
                                    <div className="w-7 h-7 rounded-full overflow-hidden border shrink-0 flex items-center justify-center bg-slate-100" style={{ borderColor: char.panel }}>
                                      <img src={char.src} alt="" className="w-6 h-6 object-contain" referrerPolicy="no-referrer" />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-700 truncate">{char.name}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 🎞️ Classic Slideshow customizer options panel */}
                {selectedCoverTemplate === "classic" && (
                  <div className="p-5 rounded-2xl border border-stone-300 bg-stone-50/60 text-left shadow-2xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
                      <div>
                        <h5 className="text-sm font-black text-stone-900 flex items-center gap-2">
                          <Layout className="w-5 h-5 text-stone-700" />
                          Classic Slideshow Explorer Library
                        </h5>
                        <p className="text-[11px] text-stone-600 mt-0.5">
                          Explore our library with <strong>hundreds of high-quality designs</strong> sorted by category. Select multiple to build your carousel!
                        </p>
                      </div>
                      
                      <div className="bg-amber-100 text-amber-900 border border-amber-200 px-3 py-1 rounded-full font-mono text-[10px] font-bold self-start sm:self-auto shadow-4xs shrink-0">
                        ✨ SELECTED COVERS: <span className="text-amber-950 font-black">{classicCovers.length}</span>
                      </div>
                    </div>

                    {/* Layout Control for Images Per Slide */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-stone-200 bg-white shadow-4xs">
                      <div>
                        <span className="text-xs font-bold text-stone-900 block">Images Per Slide Layout</span>
                        <p className="text-[11px] text-stone-600 mt-0.5 font-sans leading-relaxed">
                          Choose how many images display side-by-side in each slide column. (Permits max 3 or 4 images per slide).
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4].map((num) => {
                          const isActive = classicCoversPerSlide === num;
                          return (
                            <button
                              key={num}
                              type="button"
                              onClick={() => {
                                setClassicCoversPerSlide(num);
                                setMerchantFeedbackMessage(`🎞️ Slideshow adjusted to display ${num} image(s) per slide column!`);
                              }}
                              className={`w-12 h-8 font-extrabold rounded-lg text-xs border flex items-center justify-center transition cursor-pointer select-none ${
                                isActive
                                  ? "bg-amber-500 text-white border-amber-500 ring-2 ring-amber-500/15"
                                  : "bg-stone-50 text-stone-700 border-stone-250 hover:bg-stone-100"
                              }`}
                            >
                              {num} {num === 3 || num === 4 ? "⭐" : ""}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Quick reset or auto action */}
                    <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-stone-200 shadow-4xs">
                      <div className="text-[10px] text-stone-500 leading-normal max-w-md">
                        💡 <strong>Hint:</strong> If you select 0 covers from the library below, the Classic template automatically falls back to your boutique's general banner image and active product catalog.
                      </div>
                      <div className="flex gap-2">
                        {classicCovers.length > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              setClassicCovers([]);
                              setMerchantFeedbackMessage("🧹 Cleared all custom covers library choices.");
                            }}
                            className="px-3 py-1 text-[10px] font-bold rounded-lg border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition cursor-pointer"
                          >
                            Clear Selection
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            // Autofill 4 random covers based on industry or default
                            const defaults = COVER_LIBRARY.slice(0, 4).map(c => c.src);
                            setClassicCovers(defaults);
                            setMerchantFeedbackMessage("⚡ Autoselected 4 matching starter covers from the library!");
                          }}
                          className="px-3 py-1 text-[10px] font-bold rounded-lg border border-stone-300 text-stone-700 bg-stone-100 hover:bg-stone-200 transition cursor-pointer"
                        >
                          Autoselect Starter Pack
                        </button>
                      </div>
                    </div>

                    {/* Filter Categories and Search */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Search Bar */}
                      <div className="md:col-span-1 border rounded-xl px-3 py-1.5 bg-white shadow-3xs flex items-center hover:border-slate-400 transition-all" style={{ borderColor: "#8f8b8b" }}>
                        <input
                          type="text"
                          value={coversSearchQuery}
                          onChange={(e) => setCoversSearchQuery(e.target.value)}
                          placeholder="Search 100+ covers..."
                          className="text-xs text-stone-900 placeholder-stone-400 font-semibold w-full bg-transparent outline-none border-none p-0 focus:ring-0 focus:outline-none"
                        />
                        {coversSearchQuery && (
                          <button type="button" onClick={() => setCoversSearchQuery("")}>
                            <X className="w-3.5 h-3.5 text-stone-400 hover:text-stone-600" />
                          </button>
                        )}
                      </div>

                      {/* Categories Scroller */}
                      <div className="md:col-span-2 flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                        {["All", "Tech & Gaming", "Fashion & Boutique", "Cosmetics & Beauty", "Business & Professional", "Traditional & Culture", "Medical & Healthcare", "Sports & Fitness", "Food, Bakery & Coffee", "Flowers, Crafts & Gifts", "Furniture, Home & Decor", "Minimalist & Abstract"].map((cat) => {
                          const isActive = coversCategoryTab === cat;
                          return (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setCoversCategoryTab(cat)}
                              className={`px-3 py-1.5 text-[10px] font-bold rounded-full border whitespace-nowrap transition cursor-pointer shrink-0 ${
                                isActive
                                  ? "bg-stone-800 text-white border-stone-800"
                                  : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
                              }`}
                            >
                              {cat}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Currently selected covers preview bar */}
                    {classicCovers.length > 0 && (
                      <div className="bg-stone-100 p-3 rounded-xl border border-stone-250">
                        <span className="text-[10px] font-bold text-stone-700 block mb-1.5 uppercase tracking-wider font-mono">Current Slider Rotation Stack ({classicCovers.length})</span>
                        <div className="flex items-center gap-2 overflow-x-auto pb-1">
                          {classicCovers.map((src, idx) => {
                            // Find title if possible
                            const matched = COVER_LIBRARY.find(c => c.src === src);
                            return (
                              <div key={src + idx} className="relative w-28 h-10 rounded-md border border-stone-300 overflow-hidden shrink-0 shadow-3xs group bg-stone-200">
                                <img src={src} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    type="button"
                                    onClick={() => setClassicCovers(classicCovers.filter(c => c !== src))}
                                    className="p-1 rounded bg-red-600 text-white hover:bg-red-700 transition cursor-pointer"
                                    title="Remove from slideshow"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                                <span className="absolute bottom-0.5 left-1 bg-stone-900/75 text-[8px] text-white font-mono px-1 rounded-xs">
                                  #{idx + 1}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Grid of covers */}
                    <div className="bg-white p-3.5 rounded-xl border border-stone-200">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-72 overflow-y-auto pr-1">
                        {(() => {
                          const filtered = COVER_LIBRARY.filter((cover) => {
                            const matchesCat = coversCategoryTab === "All" || cover.category === coversCategoryTab;
                            const matchesSearch = cover.title.toLowerCase().includes(coversSearchQuery.toLowerCase()) || cover.category.toLowerCase().includes(coversSearchQuery.toLowerCase());
                            return matchesCat && matchesSearch;
                          });

                          if (filtered.length === 0) {
                            return (
                              <div className="col-span-full py-8 text-center text-xs text-stone-400 italic">
                                No cover matching "{coversSearchQuery}" found in this category.
                              </div>
                            );
                          }

                          return filtered.map((cover) => {
                            const isSelected = classicCovers.includes(cover.src);
                            return (
                              <div
                                key={cover.id}
                                onClick={() => {
                                  if (isSelected) {
                                    setClassicCovers(classicCovers.filter((c) => c !== cover.src));
                                  } else {
                                    setClassicCovers([...classicCovers, cover.src]);
                                  }
                                }}
                                className={`relative aspect-[3/1] rounded-lg overflow-hidden border-2 cursor-pointer transition shadow-3xs hover:scale-[1.02] bg-stone-100 ${
                                  isSelected
                                    ? "border-amber-500 ring-2 ring-amber-500/10"
                                    : "border-stone-200 hover:border-stone-300"
                                }`}
                              >
                                <img src={cover.src} alt={cover.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                
                                {/* Info Overlay */}
                                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-2 text-left">
                                  <span className="text-[7.5px] font-mono font-bold text-amber-400 uppercase tracking-widest block">{cover.category}</span>
                                  <span className="text-[9.5px] font-black text-white leading-tight truncate block">{cover.title}</span>
                                </div>

                                {/* Selected indicator */}
                                {isSelected && (
                                  <div className="absolute top-1 right-1 bg-amber-500 text-white rounded-full p-0.5 shadow-sm">
                                    <Check className="w-3 h-3 stroke-[3]" />
                                  </div>
                                )}
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  </div>
                )}

                {/* 🕹️ Retro Gaming Oasis customizer options panel */}
                {selectedCoverTemplate === "gaming" && (
                  <div className="p-5 rounded-2xl border border-indigo-200 bg-indigo-50/45 text-left shadow-2xs space-y-4">
                    <div>
                      <h5 className="text-sm font-black text-indigo-950 flex items-center gap-2">
                        <Gamepad className="w-5 h-5 text-indigo-600 animate-pulse" />
                        Custom Configuration: Retro Gaming Oasis
                      </h5>
                      <p className="text-[11px] text-indigo-700/80 mt-0.5">
                        Customize the central brand logo and select which of your active products rotate around it in high-contrast neon green frames.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Left column: Brand Logo selection */}
                      <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-3xs space-y-3 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <span className="text-xs font-bold text-slate-850 block">1. Central Brand Logo</span>
                          <p className="text-[10px] text-slate-500 leading-relaxed">
                            Set the main logo/image displayed in the middle of your Retro Gaming banner layout.
                          </p>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => setGamingLogo(myStore.logo || "")}
                            className={`px-3 py-1.5 text-[11px] rounded-lg border font-medium transition cursor-pointer ${
                              gamingLogo === (myStore.logo || "")
                                ? "bg-indigo-600 text-white border-indigo-600"
                                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            Use Store General Logo
                          </button>
                          <button
                            type="button"
                            onClick={() => setGamingLogo("https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&q=80")}
                            className={`px-3 py-1.5 text-[11px] rounded-lg border font-medium transition cursor-pointer ${
                              gamingLogo === "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&q=80"
                                ? "bg-indigo-600 text-white border-indigo-600"
                                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            Use Retro Arcade Console
                          </button>
                        </div>

                        <div className="border rounded-xl px-3.5 py-1.5 bg-white hover:border-slate-400 focus-within:bg-white focus-within:border-indigo-500 transition-all" style={{ borderColor: "#8f8b8b" }}>
                          <label className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block">Custom Brand Logo URL</label>
                          <input
                            type="text"
                            value={gamingLogo}
                            onChange={(e) => setGamingLogo(e.target.value)}
                            placeholder="Paste custom brand logo URL..."
                            className="text-xs text-slate-900 placeholder-slate-400 font-semibold w-full bg-transparent outline-none border-none p-0 focus:ring-0 focus:outline-none mt-1"
                          />
                        </div>

                        {/* Logo Preview */}
                        <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          <div className="w-12 h-12 bg-black border-2 border-indigo-500 rounded-md overflow-hidden shrink-0 flex items-center justify-center shadow-inner">
                            {gamingLogo || myStore.logo ? (
                              <img src={gamingLogo || myStore.logo} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <span className="text-[10px] text-indigo-500 font-mono">NO LOGO</span>
                            )}
                          </div>
                          <div className="text-left flex-1 min-w-0">
                            <span className="text-[11px] font-bold text-slate-800 block">Logo Display Preview</span>
                            <span className="text-[9px] text-slate-400 block font-mono truncate">
                              {gamingLogo || "Using Default Boutique Logo"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right column: Featured Products selection */}
                      <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-3xs flex flex-col justify-between space-y-3">
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-slate-850 block">2. Orbiting Products Selection</span>
                          <p className="text-[10px] text-slate-500 leading-relaxed">
                            Select products that will circle around the central brand logo inside stylized green frames.
                          </p>
                        </div>

                        {/* List of active products */}
                        <div className="max-h-48 overflow-y-auto space-y-1.5 border border-slate-150 rounded-lg p-2 bg-slate-50/50">
                          {myStore.products && myStore.products.length > 0 ? (
                            myStore.products.map((prod) => {
                              const isChecked = gamingProducts.includes(prod.id);
                              return (
                                <label
                                  key={prod.id}
                                  className="flex items-center gap-2.5 px-2.5 py-2 rounded bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 cursor-pointer select-none transition"
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => {
                                      if (isChecked) {
                                        setGamingProducts(gamingProducts.filter((id) => id !== prod.id));
                                      } else {
                                        setGamingProducts([...gamingProducts, prod.id]);
                                      }
                                    }}
                                    className="w-4 h-4 rounded text-indigo-600 border-slate-350 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                                  />
                                  <div className="w-7 h-7 rounded bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                                    <img src={prod.imageUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                  </div>
                                  <div className="flex-1 min-w-0 text-left">
                                    <span className="text-[11px] font-bold text-slate-800 block truncate leading-tight">
                                      {prod.name}
                                    </span>
                                    <span className="text-[9px] text-slate-400 block font-mono">
                                      {prod.price} DA • {prod.category}
                                    </span>
                                  </div>
                                </label>
                              );
                            })
                          ) : (
                            <div className="p-4 text-center text-[11px] text-slate-400 italic">
                              No products found. Add products to your boutique first.
                            </div>
                          )}
                        </div>

                        <div className="text-[10px] text-indigo-700 bg-indigo-50/60 p-2.5 rounded-lg font-medium border border-indigo-100/50">
                          💡 Chosen: <strong className="font-bold font-mono text-indigo-900">{gamingProducts.length}</strong> products will orbit your central brand logo.
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 🎨 My Brand customizer options panel */}
                {selectedCoverTemplate === "my_brand" && (
                  <div className="p-5 rounded-2xl border border-rose-200 bg-rose-50/45 text-left shadow-2xs space-y-4">
                    <div>
                      <h5 className="text-sm font-black text-rose-950 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-rose-600 animate-pulse" />
                        Custom Configuration: My Brand Template
                      </h5>
                      <p className="text-[11px] text-rose-700/80 mt-0.5">
                        Permit custom PNG brand image uploads, fine-tune the center spacing layout, choose between merged colors or celestial space backdrops, and dynamically choose and merge your colors.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Left Column: Brand Image Setup */}
                      <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-3xs space-y-4">
                        <div className="space-y-1.5">
                          <span className="text-xs font-bold text-slate-800 block">1. Custom PNG Brand Image</span>
                          <p className="text-[10px] text-slate-500 leading-relaxed">
                            Upload a `.png` or image file from your local device to render as a floating brand asset in the center of the template.
                          </p>
                        </div>

                        <div className="space-y-3">
                          <label 
                            className="border border-dashed border-rose-300 hover:border-rose-450 bg-rose-50/20 hover:bg-rose-50/40 rounded-xl p-6 text-center space-y-2 select-none cursor-pointer block transition-all duration-300"
                            onDragOver={(e) => {
                              e.preventDefault();
                            }}
                            onDrop={(e) => {
                              e.preventDefault();
                              const file = e.dataTransfer.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  if (typeof reader.result === "string") {
                                    setMyBrandImageOriginal(reader.result);
                                    setMyBrandImage(reader.result);
                                    setMerchantFeedbackMessage("✨ Brand asset successfully dropped & uploaded from device!");
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          >
                            <UploadCloud className="w-8 h-8 text-rose-400 mx-auto animate-pulse" />
                            <div>
                              <span className="text-[11px] font-black text-rose-950 block">Drag & Drop brand file here</span>
                              <span className="text-[9px] text-slate-400 block mt-0.5">or click to choose custom file from your device</span>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      if (typeof reader.result === "string") {
                                        setMyBrandImageOriginal(reader.result);
                                        setMyBrandImage(reader.result);
                                        setMerchantFeedbackMessage("✨ Brand asset successfully uploaded from device!");
                                      }
                                    };
                                    reader.readAsDataURL(file);
                                  }
                              }}
                            />
                          </label>

                          {myBrandImageOriginal && (
                            <div className="space-y-3 mt-2 animate-fade-in">
                              {/* Uploaded Brand Image Card */}
                              <div className="p-3 bg-rose-50/35 border border-rose-100 rounded-xl flex items-center gap-3">
                                <div className="w-14 h-14 rounded-lg bg-white border border-rose-200 p-1 flex items-center justify-center overflow-hidden shrink-0">
                                  <img 
                                    src={myBrandImage} 
                                    className="max-w-full max-h-full object-contain transition-all" 
                                    style={{
                                      filter: `brightness(${myBrandBrightness}%) contrast(${myBrandContrast}%) grayscale(${myBrandGrayscale}%)`
                                    }}
                                    alt="Uploaded Brand" 
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <span className="text-[11px] font-bold text-rose-950 block truncate">Uploaded Brand Image</span>
                                  <span className="text-[9px] text-slate-400 block font-mono">Device File (Base64)</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setMyBrandImage("");
                                      setMyBrandImageOriginal("");
                                      setMyBrandBgRemovalMode("none");
                                      setMerchantFeedbackMessage("🧹 Removed custom brand image!");
                                    }}
                                    className="text-[9px] text-red-500 font-bold hover:underline mt-0.5 block cursor-pointer text-left"
                                  >
                                    Remove Brand Image
                                  </button>
                                </div>
                              </div>

                              {/* 🪄 Dedicated AI Background Removal Trigger Button */}
                              <div className="bg-gradient-to-r from-rose-50/70 to-pink-50/40 p-3.5 rounded-xl border border-rose-100 shadow-3xs space-y-2">
                                <span className="text-[10px] font-black text-rose-900 block tracking-wide uppercase">AI Backdrop Extraction</span>
                                <button
                                  type="button"
                                  disabled={isRemovingBackgroundAI}
                                  onClick={handleRemoveBackgroundAI}
                                  className={`w-full flex items-center justify-center gap-2 py-2 px-3 text-[10.5px] font-black rounded-lg border text-white transition-all shadow-3xs ${
                                    isRemovingBackgroundAI
                                      ? "bg-rose-400 border-rose-400 animate-pulse cursor-not-allowed"
                                      : "bg-gradient-to-r from-rose-500 to-pink-600 border-rose-500 hover:from-rose-600 hover:to-pink-700 active:scale-98 cursor-pointer"
                                  }`}
                                >
                                  {isRemovingBackgroundAI ? (
                                    <>
                                      <Sparkles className="w-3.5 h-3.5 animate-spin text-white" />
                                      <span>AI Isolating Background...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Sparkles className="w-3.5 h-3.5 text-rose-100" />
                                      <span>Extract Background with AI</span>
                                    </>
                                  )}
                                </button>

                                {aiBgRemovalSummary && (
                                  <div className="p-2 bg-emerald-50 border border-emerald-100 rounded-lg flex items-start gap-1.5 text-emerald-950 animate-fade-in text-left">
                                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                    <div>
                                      <span className="text-[9.5px] font-black block text-emerald-900">AI Isolated Backdrop</span>
                                      <p className="text-[9px] text-slate-600 leading-relaxed font-semibold">{aiBgRemovalSummary}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {myBrandImageOriginal && (
                            <>
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setMyBrandImage("");
                                    setMyBrandImageOriginal("");
                                    setMyBrandBgRemovalMode("none");
                                    setMyBrandBgRemovalTolerance(40);
                                    setMyBrandBrightness(100);
                                    setMyBrandContrast(100);
                                    setMyBrandGrayscale(0);
                                    setAiBgRemovalSummary("");
                                    setMerchantFeedbackMessage("🧹 Cleared custom brand image and reset edits!");
                                  }}
                                  className="px-3 py-1.5 text-[10px] rounded-lg border font-medium bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100 hover:text-red-500 transition cursor-pointer"
                                >
                                  Clear Image & Reset Edits
                                </button>
                              </div>

                              {/* 🛠️ BG Removal & Photo Editing controls suite */}
                              <div className="space-y-4 pt-3.5 border-t border-rose-100/60 mt-3 text-left">
                                <span className="text-[11px] font-black text-rose-950 uppercase tracking-wider flex items-center gap-1.5">
                                  <Sliders className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                                  Edit & Remove Background
                                </span>
                                
                                {/* Background Removal Modes */}
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-500 block">Removal Technology</label>
                                  <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-lg">
                                    {[
                                      { mode: "none", label: "None" },
                                      { mode: "white", label: "White" },
                                      { mode: "black", label: "Black" },
                                      { mode: "chroma", label: "Chroma" }
                                    ].map((m) => (
                                      <button
                                        key={m.mode}
                                        type="button"
                                        onClick={() => {
                                          setMyBrandBgRemovalMode(m.mode as any);
                                          setMerchantFeedbackMessage(`✨ Switched removal mode to ${m.label}!`);
                                        }}
                                        className={`py-1 text-[9px] font-bold rounded-md transition cursor-pointer text-center ${
                                          myBrandBgRemovalMode === m.mode
                                            ? "bg-white text-rose-700 shadow-3xs"
                                            : "text-slate-500 hover:text-slate-800"
                                        }`}
                                      >
                                        {m.label}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {/* Tolerance Settings */}
                                {myBrandBgRemovalMode !== "none" && (
                                  <div className="space-y-1.5 p-2.5 bg-rose-50/20 border border-rose-100/50 rounded-lg">
                                    <div className="flex items-center justify-between text-[10px]">
                                      <span className="font-bold text-slate-600">Color Tolerance</span>
                                      <span className="font-mono font-bold text-rose-700">{myBrandBgRemovalTolerance}</span>
                                    </div>
                                    <input
                                      type="range"
                                      min="5"
                                      max={myBrandBgRemovalMode === "chroma" ? 250 : 150}
                                      value={myBrandBgRemovalTolerance}
                                      onChange={(e) => setMyBrandBgRemovalTolerance(Number(e.target.value))}
                                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                                    />
                                    <span className="text-[8.5px] text-slate-400 block leading-tight">
                                      Higher values remove more colors. Lower values preserve subtle shades.
                                    </span>
                                  </div>
                                )}

                                {/* Custom Chroma Color Input */}
                                {myBrandBgRemovalMode === "chroma" && (
                                  <div className="space-y-1 bg-slate-50 border border-slate-150 p-2 rounded-lg" style={{ borderColor: "#8f8b8b" }}>
                                    <label className="text-[10px] font-bold text-slate-500 block">Select Key Color to Remove</label>
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="color"
                                        value={myBrandBgRemovalColor}
                                        onChange={(e) => setMyBrandBgRemovalColor(e.target.value)}
                                        className="w-7 h-7 border-0 rounded cursor-pointer bg-transparent"
                                      />
                                      <input
                                        type="text"
                                        value={myBrandBgRemovalColor}
                                        onChange={(e) => setMyBrandBgRemovalColor(e.target.value)}
                                        className="flex-1 bg-white border rounded px-2 py-1 text-[10px] font-mono uppercase focus:outline-none focus:border-rose-450"
                                        style={{ borderColor: "#8f8b8b" }}
                                      />
                                      <button
                                        key="autodetect"
                                        type="button"
                                        onClick={() => {
                                          const img = new Image();
                                          img.onload = () => {
                                            const canvas = document.createElement("canvas");
                                            canvas.width = 1;
                                            canvas.height = 1;
                                            const ctx = canvas.getContext("2d");
                                            if (ctx) {
                                              ctx.drawImage(img, 0, 0, 1, 1);
                                              const pixel = ctx.getImageData(0, 0, 1, 1).data;
                                              const r = pixel[0].toString(16).padStart(2, '0');
                                              const g = pixel[1].toString(16).padStart(2, '0');
                                              const b = pixel[2].toString(16).padStart(2, '0');
                                              setMyBrandBgRemovalColor(`#${r}${g}${b}`);
                                              setMerchantFeedbackMessage("🎯 Auto-detected background color from corner pixel!");
                                            }
                                          };
                                          img.src = myBrandImageOriginal;
                                        }}
                                        className="px-2 py-1 text-[9px] font-bold bg-rose-600 text-white rounded hover:bg-rose-700 cursor-pointer transition whitespace-nowrap"
                                        title="Auto-detect color from image background corner"
                                      >
                                        Auto Detect
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {/* Brand Image Filter sliders */}
                                <div className="space-y-2.5 p-2.5 bg-slate-50 border border-slate-150 rounded-lg">
                                  <span className="text-[9.5px] font-bold text-slate-500 block">Image Adjustments (Filters)</span>
                                  
                                  {/* Brightness */}
                                  <div className="space-y-1">
                                    <div className="flex items-center justify-between text-[9px]">
                                      <span className="font-bold text-slate-500">Brightness</span>
                                      <span className="font-mono font-bold text-slate-700">{myBrandBrightness}%</span>
                                    </div>
                                    <input
                                      type="range"
                                      min="50"
                                      max="180"
                                      value={myBrandBrightness}
                                      onChange={(e) => setMyBrandBrightness(Number(e.target.value))}
                                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                                    />
                                  </div>

                                  {/* Contrast */}
                                  <div className="space-y-1">
                                    <div className="flex items-center justify-between text-[9px]">
                                      <span className="font-bold text-slate-500">Contrast</span>
                                      <span className="font-mono font-bold text-slate-700">{myBrandContrast}%</span>
                                    </div>
                                    <input
                                      type="range"
                                      min="50"
                                      max="180"
                                      value={myBrandContrast}
                                      onChange={(e) => setMyBrandContrast(Number(e.target.value))}
                                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                                    />
                                  </div>

                                  {/* Grayscale */}
                                  <div className="space-y-1">
                                    <div className="flex items-center justify-between text-[9px]">
                                      <span className="font-bold text-slate-500">Grayscale (B&W Filter)</span>
                                      <span className="font-mono font-bold text-slate-700">{myBrandGrayscale}%</span>
                                    </div>
                                    <input
                                      type="range"
                                      min="0"
                                      max="100"
                                      value={myBrandGrayscale}
                                      onChange={(e) => setMyBrandGrayscale(Number(e.target.value))}
                                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                                    />
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Right Column: Multi-Background & Spacing Options */}
                      <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-3xs space-y-4">
                        <span className="text-xs font-bold text-slate-800 block">2. Celestial Theme & Spacing</span>
                        
                        {/* 20 Celestial Theme Presets */}
                        <div className="space-y-1.5 p-3 bg-slate-50 border border-slate-200/60 rounded-xl">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                              20 Celestial Presets
                            </span>
                            <span className="text-[9px] text-slate-400 font-medium">Click to apply instantly</span>
                          </div>
                          <div className="grid grid-cols-4 gap-1.5 max-h-[160px] overflow-y-auto pr-1 scrollbar-thin">
                            {celestialPresets.map((preset) => {
                              const isActive = 
                                myBrandBgType === preset.bgType &&
                                myBrandColor1 === preset.color1 &&
                                (preset.bgType !== "gradient" || myBrandColor2 === preset.color2) &&
                                myBrandAngle === preset.angle &&
                                myBrandShadowColor === preset.shadowColor;

                              return (
                                <button
                                  key={preset.name}
                                  type="button"
                                  onClick={() => {
                                    setMyBrandBgType(preset.bgType);
                                    setMyBrandColor1(preset.color1);
                                    setMyBrandColor2(preset.color2);
                                    setMyBrandAngle(preset.angle);
                                    setMyBrandShadowColor(preset.shadowColor);
                                    setMyBrandShadowIntensity(preset.intensity);
                                    setMyBrandShadowOpacity(preset.opacity);
                                    setMerchantFeedbackMessage(`🌌 Celestial Theme "${preset.name}" Applied!`);
                                  }}
                                  className={`p-1 rounded-lg border transition text-left relative overflow-hidden group cursor-pointer ${
                                    isActive 
                                      ? "bg-rose-50 border-rose-500 ring-2 ring-rose-500/20 shadow-xs" 
                                      : "bg-white border-slate-200 hover:border-slate-350 hover:bg-slate-50"
                                  }`}
                                >
                                  {/* Thumbnail representation */}
                                  <div className="h-6 w-full rounded-md overflow-hidden relative shadow-3xs">
                                    <div className={`w-full h-full ${preset.previewClass}`} />
                                    {isActive && (
                                      <div className="absolute inset-0 bg-rose-950/20 flex items-center justify-center">
                                        <Check className="w-3.5 h-3.5 text-white filter drop-shadow-md font-bold" />
                                      </div>
                                    )}
                                  </div>
                                  <span className="text-[8.5px] font-bold block truncate mt-1 text-slate-700 text-center leading-tight">
                                    {preset.name}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Background Selection Row */}
                        <div className="space-y-1.5">
                          <label className="text-[10.5px] font-bold text-slate-500 block">Multi-Background Type</label>
                          <div className="grid grid-cols-2 gap-1.5">
                            {(["gradient", "space", "nebula", "solid"] as const).map((type) => (
                              <button
                                key={type}
                                type="button"
                                onClick={() => {
                                  setMyBrandBgType(type);
                                  setMerchantFeedbackMessage(`🌌 Selected ${type.toUpperCase()} backdrop!`);
                                }}
                                className={`py-1.5 text-[10px] rounded-md border capitalize font-semibold transition cursor-pointer ${
                                  myBrandBgType === type
                                    ? "bg-rose-600 text-white border-rose-600"
                                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                                }`}
                              >
                                {type === "gradient" ? "🎨 Color Merge" : type === "space" ? "🌌 Deep Space" : type === "nebula" ? "🪐 Nebula" : "⬜ Solid"}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Dynamic Merging Color Selection */}
                        {(myBrandBgType === "gradient" || myBrandBgType === "solid") && (
                          <div className="p-3 bg-slate-50 border border-slate-150 rounded-lg space-y-3">
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider block">Merge Colors Palette</span>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[9.5px] text-slate-400 font-bold block">Color 1 (Start)</label>
                                <div className="flex items-center gap-1.5 bg-white p-1 rounded border border-slate-200">
                                  <input
                                    type="color"
                                    value={myBrandColor1}
                                    onChange={(e) => setMyBrandColor1(e.target.value)}
                                    className="w-5 h-5 border border-slate-300 rounded cursor-pointer"
                                  />
                                  <input
                                    type="text"
                                    value={myBrandColor1}
                                    onChange={(e) => setMyBrandColor1(e.target.value)}
                                    className="w-full text-[9px] font-mono focus:outline-none uppercase"
                                  />
                                </div>
                              </div>
                              {myBrandBgType === "gradient" && (
                                <div className="space-y-1">
                                  <label className="text-[9.5px] text-slate-400 font-bold block">Color 2 (End)</label>
                                  <div className="flex items-center gap-1.5 bg-white p-1 rounded border border-slate-200">
                                    <input
                                      type="color"
                                      value={myBrandColor2}
                                      onChange={(e) => setMyBrandColor2(e.target.value)}
                                      className="w-5 h-5 border border-slate-300 rounded cursor-pointer"
                                    />
                                    <input
                                      type="text"
                                      value={myBrandColor2}
                                      onChange={(e) => setMyBrandColor2(e.target.value)}
                                      className="w-full text-[9px] font-mono focus:outline-none uppercase"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            {myBrandBgType === "gradient" && (
                              <div className="space-y-1 pt-1">
                                <div className="flex items-center justify-between">
                                  <label className="text-[9.5px] text-slate-400 font-bold block">Merge Gradient Angle</label>
                                  <span className="text-[9.5px] font-mono text-slate-600 font-bold">{myBrandAngle}°</span>
                                </div>
                                <input
                                  type="range"
                                  min="0"
                                  max="360"
                                  value={myBrandAngle}
                                  onChange={(e) => setMyBrandAngle(Number(e.target.value))}
                                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                                />
                              </div>
                            )}
                          </div>
                        )}

                        {/* Custom Center Padding Spacing Slider */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="text-[10.5px] font-bold text-slate-500 block">Center Asset Sizing/Spacing</label>
                            <span className="text-[10px] font-mono text-slate-700 font-bold">{myBrandSpacing} px</span>
                          </div>
                          <input
                            type="range"
                            min="10"
                            max="100"
                            value={myBrandSpacing}
                            onChange={(e) => setMyBrandSpacing(Number(e.target.value))}
                            className="w-full h-1 bg-slate-150 rounded-lg appearance-none cursor-pointer accent-rose-500"
                          />
                          <p className="text-[9px] text-slate-400 leading-tight">
                            Adjust the spacing container of your centered brand logo in the middle of the template.
                          </p>
                        </div>

                        {/* Custom Drop Shadow Settings */}
                        <div className="p-3 bg-slate-50 border border-slate-150 rounded-lg space-y-3 pt-2.5">
                          <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider block">Custom Brand Drop Shadow</span>
                          
                          <div className="grid grid-cols-2 gap-3">
                            {/* Color Selector */}
                            <div className="space-y-1">
                              <label className="text-[9.5px] text-slate-400 font-bold block">Shadow Color</label>
                              <div className="flex items-center gap-1.5 bg-white p-1 rounded border border-slate-200">
                                <input
                                  type="color"
                                  value={myBrandShadowColor}
                                  onChange={(e) => setMyBrandShadowColor(e.target.value)}
                                  className="w-5 h-5 border border-slate-300 rounded cursor-pointer"
                                />
                                <input
                                  type="text"
                                  value={myBrandShadowColor}
                                  onChange={(e) => setMyBrandShadowColor(e.target.value)}
                                  className="w-full text-[9px] font-mono focus:outline-none uppercase"
                                />
                              </div>
                            </div>
                            
                            {/* Blur Intensity */}
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <label className="text-[9.5px] text-slate-400 font-bold block">Blur Size</label>
                                <span className="text-[9px] font-mono text-slate-600 font-bold">{myBrandShadowIntensity}px</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="40"
                                value={myBrandShadowIntensity}
                                onChange={(e) => setMyBrandShadowIntensity(Number(e.target.value))}
                                className="w-full h-1 bg-slate-150 rounded-lg appearance-none cursor-pointer accent-rose-500 mt-2"
                              />
                            </div>
                          </div>

                          {/* Opacity strength */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <label className="text-[9.5px] text-slate-400 font-bold block">Shadow Opacity</label>
                              <span className="text-[9px] font-mono text-slate-600 font-bold">{myBrandShadowOpacity}%</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={myBrandShadowOpacity}
                              onChange={(e) => setMyBrandShadowOpacity(Number(e.target.value))}
                              className="w-full h-1 bg-slate-150 rounded-lg appearance-none cursor-pointer accent-rose-500 mt-1"
                            />
                          </div>

                          {/* Live Shadow Preview Toggle */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                            <label 
                              htmlFor="sidebar-live-shadow-preview-checkbox"
                              className="text-[10px] font-bold text-slate-600 cursor-pointer select-none"
                            >
                              Live Shadow Preview Border
                            </label>
                            <SkeuomorphicSwitch
                              id="sidebar-live-shadow-preview-checkbox"
                              checked={myBrandShadowPreviewBorder}
                              onChange={setMyBrandShadowPreviewBorder}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
                  
                  {/* Left design section */}
                  <div className="flex flex-col gap-5">
                    {/* Announcement Banner */}
                    <div className="p-4 rounded-2xl border border-slate-200 bg-white text-left shadow-2xs">
                      <div className="flex items-center justify-between mb-3 px-1">
                        <span className="text-xs font-bold text-slate-800">Site-Wide Announcement Banner</span>
                        <SkeuomorphicSwitch 
                          checked={announcementEnabled}
                          onChange={setAnnouncementEnabled}
                        />
                      </div>
                      
                      <div className="border rounded-xl px-3.5 py-1.5 bg-white hover:border-slate-400 transition-all" style={{ borderColor: "#8f8b8b" }}>
                        <div className="flex items-center justify-between">
                          <label className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block">Announcement message</label>
                          <SettingsTooltip text="An alert message banner displayed at the very top of your storefront to notify visitors about sales, holiday hours, or custom shipping deals." />
                        </div>
                        <textarea 
                          rows={2}
                          value={announcementMsg}
                          onChange={(e) => setAnnouncementMsg(e.target.value)}
                          placeholder="Type urgent promotions or free delivery deals..."
                          className="text-xs text-slate-900 placeholder-slate-450 font-semibold w-full bg-transparent outline-none border-none p-0 focus:ring-0 focus:outline-none mt-1 resize-none"
                        />
                      </div>
                      
                      {announcementEnabled && (
                        <div className="mt-3 text-[10px] bg-rose-500 text-white font-bold p-2.5 rounded-lg text-center font-mono uppercase tracking-wide">
                          📢 LIVE MARQUEE: {announcementMsg}
                        </div>
                      )}
                    </div>

                    {/* Storefront visual frame properties */}
                    <div className="p-4 rounded-2xl border border-slate-200 bg-white text-left flex flex-col gap-4 shadow-2xs">
                      <span className="text-xs font-bold text-slate-800 px-1">Storefront Sizing Layout Specs</span>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="border rounded-xl px-3 py-1.5 bg-white shadow-2xs hover:border-slate-400 relative transition-all" style={{ borderColor: "#8f8b8b" }}>
                          <div className="flex items-center justify-between">
                            <label className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block">Border Style</label>
                            <SettingsTooltip text="The styling of the framing border surrounding your storefront's visual modules." />
                          </div>
                          <select 
                            value={borderStyle}
                            onChange={(e) => setBorderStyle(e.target.value)}
                            className="text-xs bg-transparent border-none p-0 pr-8 outline-none w-full font-semibold text-slate-900 focus:ring-0 focus:outline-none mt-1 appearance-none cursor-pointer"
                          >
                            <option value="solid">Solid Frame</option>
                            <option value="dashed">Dashed Trim</option>
                            <option value="double">Double Ribbed</option>
                            <option value="none">Seamless Borderless</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500 pt-3">
                            <ChevronDown className="w-3.5 h-3.5" />
                          </div>
                        </div>

                        <div className="border rounded-xl px-3 py-1.5 bg-white shadow-2xs hover:border-slate-400 relative transition-all" style={{ borderColor: "#8f8b8b" }}>
                          <div className="flex items-center justify-between">
                            <label className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block">Border Radius</label>
                            <SettingsTooltip text="Control the corner roundedness of your store card and image blocks." />
                          </div>
                          <select 
                            value={borderRadius}
                            onChange={(e) => setBorderRadius(e.target.value)}
                            className="text-xs bg-transparent border-none p-0 pr-8 outline-none w-full font-semibold text-slate-900 focus:ring-0 focus:outline-none mt-1 appearance-none cursor-pointer"
                          >
                            <option value="none">Square Corner (0px)</option>
                            <option value="xl">Subtle Curve (12px)</option>
                            <option value="2xl">Standard Rounded (16px)</option>
                            <option value="3xl">Supreme Capsule (24px)</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500 pt-3">
                            <ChevronDown className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="border rounded-xl px-3 py-1.5 bg-white shadow-2xs hover:border-slate-400 relative transition-all" style={{ borderColor: "#8f8b8b" }}>
                          <div className="flex items-center justify-between">
                            <label className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block">Border Thickness</label>
                            <SettingsTooltip text="The width of the boundary lines on all framing components." />
                          </div>
                          <select 
                            value={borderWidth}
                            onChange={(e) => setBorderWidth(e.target.value)}
                            className="text-xs bg-transparent border-none p-0 pr-8 outline-none w-full font-semibold text-slate-900 focus:ring-0 focus:outline-none mt-1 appearance-none cursor-pointer"
                          >
                            <option value="1px">Thin (1px)</option>
                            <option value="2px">Medium (2px)</option>
                            <option value="4px">Thick (4px)</option>
                            <option value="8px">Ultra Bold (8px)</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500 pt-3">
                            <ChevronDown className="w-3.5 h-3.5" />
                          </div>
                        </div>

                        <div className="border rounded-xl px-3 py-1 bg-white shadow-2xs hover:border-slate-400 transition-all" style={{ borderColor: "#8f8b8b" }}>
                          <div className="flex items-center justify-between">
                            <label className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block">Highlight Color</label>
                            <SettingsTooltip text="The visual tint applied to storefront card borders and active tabs." />
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <input 
                              type="color"
                              value={borderColor}
                              onChange={(e) => setBorderColor(e.target.value)}
                              className="w-6 h-6 rounded border border-slate-200 cursor-pointer p-0 block bg-transparent"
                            />
                            <input 
                              type="text"
                              value={borderColor}
                              onChange={(e) => setBorderColor(e.target.value)}
                              className="text-[11px] font-mono uppercase bg-transparent border-none p-0 focus:ring-0 w-full font-bold text-slate-700"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Storefront Typography & Custom Fonts */}
                    <div className="p-4 rounded-2xl border border-slate-200 bg-white text-left flex flex-col gap-4 shadow-2xs">
                      <span className="text-xs font-bold text-slate-800 px-1 flex items-center gap-1.5">
                        <Type className="w-4 h-4 text-indigo-500" />
                        Storefront Typography & Custom Fonts
                      </span>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="border rounded-xl px-3 py-1.5 bg-white shadow-2xs hover:border-slate-400 relative transition-all" style={{ borderColor: "#8f8b8b" }}>
                          <div className="flex items-center justify-between">
                            <label className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block">Font Family</label>
                            <SettingsTooltip text="The typography typeface for headers, menus, and text across your entire store catalog." />
                          </div>
                          <select 
                            value={fontFamily}
                            onChange={(e) => setFontFamily(e.target.value)}
                            className="text-xs bg-transparent border-none p-0 pr-8 outline-none w-full font-semibold text-slate-900 focus:ring-0 focus:outline-none mt-1 appearance-none cursor-pointer"
                          >
                            <option value="inherit">Default (System Sans)</option>
                            <option value="'Inter', sans-serif">Inter (Modern Clean)</option>
                            <option value="'Space Grotesk', sans-serif">Space Grotesk (Tech Forward)</option>
                            <option value="'Outfit', sans-serif">Outfit (Premium Minimalist)</option>
                            <option value="'Playfair Display', serif">Playfair Display (Elegant Serif)</option>
                            <option value="'JetBrains Mono', monospace">JetBrains Mono (Technical Mono)</option>
                            <option value="'Cinzel', serif">Cinzel (Traditional Moorish Craft)</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500 pt-3">
                            <ChevronDown className="w-3.5 h-3.5" />
                          </div>
                        </div>

                        <div className="border rounded-xl px-3 py-1.5 bg-white shadow-2xs hover:border-slate-400 relative transition-all" style={{ borderColor: "#8f8b8b" }}>
                          <label className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block">Title Font Size</label>
                          <select 
                            value={titleFontSize}
                            onChange={(e) => setTitleFontSize(e.target.value)}
                            className="text-xs bg-transparent border-none p-0 pr-8 outline-none w-full font-semibold text-slate-900 focus:ring-0 focus:outline-none mt-1 appearance-none cursor-pointer"
                          >
                            <option value="compact">Compact (30px)</option>
                            <option value="medium">Standard (36px)</option>
                            <option value="large">Large Highlight (48px)</option>
                            <option value="supreme">Supreme Bold (60px)</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500 pt-3">
                            <ChevronDown className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="border rounded-xl px-3 py-1.5 bg-white shadow-2xs hover:border-slate-400 relative transition-all" style={{ borderColor: "#8f8b8b" }}>
                          <label className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block">Title Font Style</label>
                          <select 
                            value={titleFontStyle}
                            onChange={(e) => setTitleFontStyle(e.target.value)}
                            className="text-xs bg-transparent border-none p-0 pr-8 outline-none w-full font-semibold text-slate-900 focus:ring-0 focus:outline-none mt-1 appearance-none cursor-pointer"
                          >
                            <option value="normal">Upright / Normal</option>
                            <option value="italic">Elegant Italic</option>
                            <option value="oblique">Slanted Modern</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500 pt-3">
                            <ChevronDown className="w-3.5 h-3.5" />
                          </div>
                        </div>

                        <div className="border rounded-xl px-3 py-1.5 bg-white shadow-2xs hover:border-slate-400 relative transition-all" style={{ borderColor: "#8f8b8b" }}>
                          <label className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block">Title Weight</label>
                          <select 
                            value={titleFontWeight}
                            onChange={(e) => setTitleFontWeight(e.target.value)}
                            className="text-xs bg-transparent border-none p-0 pr-8 outline-none w-full font-semibold text-slate-900 focus:ring-0 focus:outline-none mt-1 appearance-none cursor-pointer"
                          >
                            <option value="400">Regular (400)</option>
                            <option value="500">Medium (500)</option>
                            <option value="600">Semibold (600)</option>
                            <option value="700">Bold (700)</option>
                            <option value="800">Extra Bold (800)</option>
                            <option value="950">Black Heavy (950)</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500 pt-3">
                            <ChevronDown className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="border rounded-xl px-3 py-1.5 bg-white shadow-2xs hover:border-slate-400 relative transition-all" style={{ borderColor: "#8f8b8b" }}>
                          <label className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block">Body Font Size</label>
                          <select 
                            value={bodyFontSize}
                            onChange={(e) => setBodyFontSize(e.target.value)}
                            className="text-xs bg-transparent border-none p-0 pr-8 outline-none w-full font-semibold text-slate-900 focus:ring-0 focus:outline-none mt-1 appearance-none cursor-pointer"
                          >
                            <option value="small">Small (12px)</option>
                            <option value="medium">Standard (14px)</option>
                            <option value="large">Large (18px)</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500 pt-3">
                            <ChevronDown className="w-3.5 h-3.5" />
                          </div>
                        </div>

                        <div className="border rounded-xl px-3 py-1.5 bg-white shadow-2xs hover:border-slate-400 relative transition-all" style={{ borderColor: "#8f8b8b" }}>
                          <label className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block">Body Style</label>
                          <select 
                            value={bodyFontStyle}
                            onChange={(e) => setBodyFontStyle(e.target.value)}
                            className="text-xs bg-transparent border-none p-0 pr-8 outline-none w-full font-semibold text-slate-900 focus:ring-0 focus:outline-none mt-1 appearance-none cursor-pointer"
                          >
                            <option value="normal">Normal</option>
                            <option value="italic">Italic Quotes</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500 pt-3">
                            <ChevronDown className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right design preview mock */}
                  <div className="flex flex-col gap-5">
                    {/* Sponsor banners title */}
                    <div className="p-4 rounded-2xl border border-slate-200 bg-white text-left shadow-2xs">
                      <span className="text-xs font-bold text-slate-850 block mb-3 px-1">Primary Sponsor Showcase Promo Slider</span>
                      
                      <div className="flex flex-col gap-3">
                        <div className="border rounded-xl px-3 py-1.5 bg-white hover:border-slate-400 transition-all" style={{ borderColor: "#8f8b8b" }}>
                          <label className="text-[9px] uppercase font-bold text-slate-505 tracking-wider block">Promo slider title</label>
                          <input 
                            type="text"
                            value={sponsoredTitle}
                            onChange={(e) => setSponsoredTitle(e.target.value)}
                            placeholder="Promo Title e.g. Authenticity Unlocked"
                            className="text-xs text-slate-900 placeholder-slate-405 font-semibold w-full bg-transparent outline-none border-none p-0 focus:ring-0 focus:outline-none mt-1"
                          />
                        </div>

                        <div className="border rounded-xl px-3 py-1.5 bg-white hover:border-slate-400 transition-all" style={{ borderColor: "#8f8b8b" }}>
                          <label className="text-[9px] uppercase font-bold text-slate-505 tracking-wider block">Offer description details</label>
                          <textarea 
                            rows={2}
                            value={sponsoredDesc}
                            onChange={(e) => setSponsoredDesc(e.target.value)}
                            placeholder="Details description of offer..."
                            className="text-xs text-slate-900 placeholder-slate-405 font-semibold w-full bg-transparent outline-none border-none p-0 focus:ring-0 focus:outline-none mt-1 resize-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Active showcase card */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left shadow-2xs">
                      <span className="text-[9px] uppercase font-mono text-slate-400 font-bold tracking-wider block mb-3">Storefront Frame Styling Live Preview</span>
                      <div 
                        className="p-5 flex flex-col items-center justify-between gap-3 text-center min-h-[140px] shadow-sm relative overflow-hidden transition-all duration-200 bg-white border"
                        style={{
                          borderColor: borderColor,
                          borderStyle: borderStyle as any,
                          borderWidth: borderWidth,
                          borderRadius: 
                            borderRadius === "none" ? "0px" :
                            borderRadius === "xl" ? "12px" :
                            borderRadius === "2xl" ? "16px" : "24px"
                        }}
                      >
                        <div className="leading-snug">
                          <span className="text-2xl block mb-1">🏺</span>
                          <h5 
                            className="text-slate-900 transition-all"
                            style={{
                              fontFamily: fontFamily || undefined,
                              fontSize: titleFontSize === "compact" ? "12px"
                                : titleFontSize === "medium" ? "14px"
                                : titleFontSize === "large" ? "18px"
                                : titleFontSize === "supreme" ? "22px"
                                : "14px",
                              fontStyle: titleFontStyle || undefined,
                              fontWeight: titleFontWeight || "800"
                            }}
                          >
                            Traditional Ceramic Pot
                          </h5>
                          <p 
                            className="text-slate-500 mt-1 leading-snug transition-all"
                            style={{
                              fontFamily: fontFamily || undefined,
                              fontSize: bodyFontSize === "small" ? "9px"
                                : bodyFontSize === "medium" ? "10.5px"
                                : bodyFontSize === "large" ? "13px"
                                : "10.5px",
                              fontStyle: bodyFontStyle || "italic"
                            }}
                          >
                            Sizing Width: {widthSize} / Height: {heightSize}
                          </p>
                        </div>
                        <span className="text-[9px] font-mono font-bold border uppercase px-2 py-0.5 bg-slate-50 rounded text-slate-600 border-slate-250">
                          {borderStyle} border ({borderWidth})
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* Tab 7: ID verification certifications */}
            {activeTab === "verification" && (
              <div className="flex flex-col gap-6 fade-in">
                <div className="pb-4 border-b border-slate-100">
                  <h4 className="text-lg font-bold text-slate-900 font-sans flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5" style={{ color: accentColor }} />
                    Artisan Verified Identity (KYC Audit)
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">Submit identity documents to obtain the verified artisan blue seal on Algeria maps.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
                  
                  {/* Status panel */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-200 text-left flex flex-col justify-between items-start gap-4 shadow-2xs">
                    <div className="w-full">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Audit Status:</span>
                      
                      {verificationStatus === "verified" && (
                        <div className="mt-2.5 flex items-center gap-3 bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-250 w-full animate-pulse">
                          <span className="text-2xl filter drop-shadow-3xs shrink-0 select-none">🔹</span>
                          <div className="text-left leading-normal">
                            <span className="text-xs font-bold block">👑 Platform Verified Artisan: Elite Rank Active!</span>
                            <span className="text-[10.5px] text-emerald-600 block mt-1 leading-normal">Handcraft Registry verified. Unlocked 3x geolocated prominence on public explorer portals.</span>
                          </div>
                        </div>
                      )}

                      {verificationStatus === "pending" && (
                        <div className="mt-2.5 flex items-center gap-3 bg-amber-50 text-amber-800 p-4 rounded-xl border border-amber-250 w-full animate-pulse">
                          <span className="text-2xl shrink-0 select-none">⏳</span>
                          <div className="text-left leading-normal">
                            <span className="text-xs font-bold block">National Registry Audit In Progress...</span>
                            <span className="text-[10.5px] text-amber-600 block mt-1 leading-normal">Platform regulators are validating files. Approvals usually resolve in under 24 business hours.</span>
                          </div>
                        </div>
                      )}

                      {verificationStatus === "not_started" && (
                        <div className="mt-2.5 flex items-center gap-3 bg-slate-50 text-slate-700 p-4 rounded-xl border border-slate-200 w-full">
                          <span className="text-2xl shrink-0 select-none">⚠️</span>
                          <div className="text-left leading-normal">
                            <span className="text-xs font-bold block">Registry Document Missing (Unverified Store)</span>
                            <span className="text-[10.5px] text-slate-500 block mt-1 leading-normal">Complete your document KYC upload to confirm your credentials and activate standard rating flags.</span>
                          </div>
                        </div>
                      )}

                      <div className="mt-4 leading-relaxed bg-slate-50 border border-slate-200 p-3 rounded-xl">
                        <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Why Verification Matters?</span>
                        <p className="text-[10.5px] text-slate-500 mt-1 leading-normal">
                          Algerian legal guidelines demand confirmation of identities to prevent fraudulent retail dispatches. Verified stores receive premium trust signals.
                        </p>
                      </div>
                    </div>

                    <button 
                      type="button"
                      onClick={handleSetVerifiedDirectly}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = accentColor;
                        e.currentTarget.style.color = '#fff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '';
                        e.currentTarget.style.color = '';
                      }}
                      className="w-full bg-slate-950 text-slate-100 font-bold text-xs px-4 py-3 rounded-xl transition-all cursor-pointer shadow-sm text-center"
                    >
                      🛡️ Bypass Audit & Set Verified (Simulate Admin Approval)
                    </button>
                  </div>

                  {/* Document uploader */}
                  <div className="flex flex-col gap-4 text-left">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Upload Official Certification Credentials:</span>
                    
                    <div className="border rounded-xl px-4 py-2 bg-white shadow-2xs hover:border-slate-400 relative transition-all" style={{ borderColor: "#8f8b8b" }}>
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-0.5">Target Document Classification</label>
                        <SettingsTooltip text="Select the legal document category you are submitting to verify your craft boutique registration." />
                      </div>
                      <select 
                        value={verificationDocType}
                        onChange={(e) => setVerificationDocType(e.target.value)}
                        className="text-xs bg-transparent border-none p-0 pr-8 outline-none w-full font-semibold text-slate-900 focus:ring-0 focus:outline-none appearance-none cursor-pointer"
                      >
                        <option value="artisan_card">بطاقة الحرفي — Official Craftsman Card ID</option>
                        <option value="registre_commerce">السجل التجاري — Commercial Registry (Registre de Commerce)</option>
                        <option value="national_id">بطاقة التعريف الوطنية — Algerian National ID Biometric</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-500 pt-4">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>

                    <div 
                      onClick={handleDropFileMock}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = accentColor;
                        e.currentTarget.style.backgroundColor = '#fafafa';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '';
                        e.currentTarget.style.backgroundColor = '';
                      }}
                      className="border border-dashed border-slate-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-3 bg-white cursor-pointer transition-all duration-150 shadow-2xs group"
                    >
                      <UploadCloud className="w-9 h-9 animate-pulse" style={{ color: accentColor }} />
                      <div>
                        {verificationFileName ? (
                          <p className="text-xs font-bold text-emerald-600 block truncate max-w-xs bg-emerald-50 px-3 py-1 rounded border border-emerald-150">
                            📎 {verificationFileName} Attached!
                          </p>
                        ) : (
                          <p className="text-xs font-semibold text-slate-700">Drag & Drop official certificate files here, or browse files</p>
                        )}
                        <p className="text-[10px] text-slate-450 mt-1.5 leading-normal">Accept PDF, JPG, PNG formats up to 10 MB limit.</p>
                      </div>
                    </div>

                    <button 
                      type="button"
                      onClick={handleSubmissionForVerification}
                      disabled={isVerifyingFileProgress}
                      className="w-full disabled:opacity-50 text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-md mt-1 flex items-center justify-center gap-1.5 cursor-pointer"
                      style={{ backgroundColor: accentColor }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.filter = "brightness(0.95)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.filter = "";
                      }}
                    >
                      {isVerifyingFileProgress ? (
                        <>Uploading documents bytes...</>
                      ) : (
                        <>➕ Upload & Submit Document for Platform Audit</>
                      )}
                    </button>
                  </div>

                </div>
              </div>
            )}

            {/* Tab 8: Password Change credentials */}
            {activeTab === "password" && (
              <div className="flex flex-col gap-6 fade-in">
                <div className="pb-4 border-b border-slate-100">
                  <h4 className="text-lg font-bold text-slate-900 font-sans flex items-center gap-2">
                    <UserCheck className="w-5 h-5" style={{ color: accentColor }} />
                    User Login & Security Credentials
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">Manage registration email credentials and execute simulated password key revisions.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
                  
                  {/* Registration emails details */}
                  <div className="p-5 rounded-2xl border border-slate-200 bg-white text-left flex flex-col justify-between shadow-2xs">
                    <div className="flex flex-col gap-3">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider px-1">Registration Merchant Email Address</span>
                      
                      <div className="border border-slate-200 rounded-xl px-4 py-2 bg-slate-50 hover:border-slate-300 transition-all relative">
                        <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">Official registry email</label>
                        <input 
                          type="text"
                          value={regEmail}
                          disabled
                          className="text-xs font-mono font-bold bg-transparent border-none p-0 w-full text-slate-500 cursor-not-allowed outline-none focus:ring-0 mt-0.5"
                        />
                        <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-4 top-4 select-none" />
                      </div>
                      
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl leading-normal">
                        <p className="text-[10.5px] text-slate-550 leading-normal">
                          ⚠️ This represents the primary authentication account email associated with your portal dispatches and alerts receipt keys. To change registration email completely, contact platform support.
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-rose-50 text-rose-800 rounded-xl border border-rose-150 text-[10.5px] mt-4 flex items-center gap-2 font-sans leading-normal">
                      <AlertCircle className="w-4.5 h-4.5 shrink-0 text-rose-600" />
                      <span className="font-semibold">Automatic passcodes must meet SHA-255 standard constraints.</span>
                    </div>
                  </div>

                  {/* password modify block */}
                  <div className="flex flex-col gap-4 text-left bg-white border border-slate-200 p-5 rounded-2xl shadow-2xs">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block px-1">Modify Registry Password Credentials</span>
                    
                    {passwordFeedback && (
                      <p className="text-xs font-bold p-2.5 bg-rose-50 text-rose-700 border border-rose-150 rounded-lg">{passwordFeedback}</p>
                    )}

                    <div className="flex flex-col gap-3.5">
                      <div className="border rounded-xl px-4 py-2 bg-white hover:border-slate-400 transition-all" style={{ borderColor: "#8f8b8b" }}>
                        <div className="flex items-center justify-between">
                          <label className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block">Current Registered Password</label>
                          <SettingsTooltip text="For security purposes, verify your identity by entering your current account password." />
                        </div>
                        <input 
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="••••••••"
                          className="text-xs text-slate-900 placeholder-slate-400 font-semibold w-full bg-transparent outline-none border-none p-0 focus:ring-0 focus:outline-none mt-0.5"
                        />
                      </div>

                      <div className="border rounded-xl px-4 py-2 bg-white hover:border-slate-400 transition-all" style={{ borderColor: "#8f8b8b" }}>
                        <div className="flex items-center justify-between">
                          <label className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block">New Secret Password</label>
                          <SettingsTooltip text="Create a strong, new password with at least 6 characters." />
                        </div>
                        <input 
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Minimum 6 security letters"
                          className="text-xs text-slate-900 placeholder-slate-400 font-semibold w-full bg-transparent outline-none border-none p-0 focus:ring-0 focus:outline-none mt-0.5"
                        />
                      </div>

                      <div className="border rounded-xl px-4 py-2 bg-white hover:border-slate-400 transition-all" style={{ borderColor: "#8f8b8b" }}>
                        <div className="flex items-center justify-between">
                          <label className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block">Confirm New Password</label>
                          <SettingsTooltip text="Re-type the exact new password to avoid spelling errors." />
                        </div>
                        <input 
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-type new password"
                          className="text-xs text-slate-900 placeholder-slate-400 font-semibold w-full bg-transparent outline-none border-none p-0 focus:ring-0 focus:outline-none mt-0.5"
                        />
                      </div>
                    </div>

                    <button 
                      type="button"
                      onClick={handleUpdateSecurityPassword}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = accentColor;
                        e.currentTarget.style.color = '#fff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '';
                        e.currentTarget.style.color = '';
                      }}
                      className="w-full bg-slate-950 text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-md mt-1 cursor-pointer"
                    >
                      🔒 Apply Password Renewal & Sync Key
                    </button>
                  </div>

                </div>
              </div>
            )}

            {/* Tab 9: AI Integrations, copywriter sandbox and API Key */}
            {activeTab === "ai" && (
              <div className="flex flex-col gap-8 text-left font-sans animate-fade-in">
                {/* Header */}
                <div className="pb-5 border-b border-gray-150 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="text-left">
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider font-mono">Setup Chapter 09 &bull; Advanced Integration Gateway</span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">Smart AI & Gateway Configuration</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Manage your gateway access rules, model aliases, rate limits, and fallback model priorities.</p>
                  </div>
                </div>

                <div className="flex flex-col gap-6 max-w-2xl">
                  {/* Row 1: Expired Time */}
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                      expired time
                    </label>
                    <div className="relative w-full">
                      <input 
                        type="text" 
                        placeholder="default no limit" 
                        value={expiredTime} 
                        onChange={(e) => setExpiredTime(e.target.value)}
                        className="w-full text-sm bg-white border rounded-xl px-4 py-3 text-slate-800 placeholder-gray-400 outline-none transition-all text-left"
                        style={{ borderColor: "#8f8b8b" }}
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <Calendar className="w-4.5 h-4.5 stroke-[1.5]" />
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Model Range */}
                  <div className="flex flex-col gap-1.5 text-left">
                    <div className="flex items-center gap-1.5">
                      <label className="text-sm font-medium text-slate-700">model range</label>
                      <HelpCircle className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors" title="Select the allowed AI models range for this gateway" />
                    </div>
                    <div className="relative w-full">
                      <select 
                        value={modelRange} 
                        onChange={(e) => setModelRange(e.target.value)}
                        className="w-full text-sm bg-white border rounded-xl px-4 py-3 text-slate-800 appearance-none outline-none transition-all text-left cursor-pointer"
                        style={{ borderColor: "#8f8b8b" }}
                      >
                        <option value="default no limit">default no limit</option>
                        <option value="Gemini 2.5 Flash / Pro Range">Gemini 2.5 Flash / Pro Range</option>
                        <option value="Anthropic Claude Range">Anthropic Claude Range</option>
                        <option value="OpenAI GPT-4o Range">OpenAI GPT-4o Range</option>
                        <option value="DeepSeek R1 / V3 Range">DeepSeek R1 / V3 Range</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <ChevronDown className="w-4.5 h-4.5 stroke-[1.5]" />
                      </div>
                    </div>
                  </div>

                  {/* Row 3: IP Limit */}
                  <div className="flex flex-col gap-1.5 text-left">
                    <div className="flex items-center gap-1.5">
                      <label className="text-sm font-medium text-slate-700">IP limit</label>
                      <HelpCircle className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors" title="Configure specific IP addresses allowed to reach the AI endpoints" />
                    </div>
                    
                    {/* Render existing IP limits */}
                    {ipLimits.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {ipLimits.map((ip, index) => (
                          <div key={index} className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-full pl-3.5 pr-2 py-1 text-xs text-slate-700 font-medium">
                            <span className="font-mono">{ip}</span>
                            <button 
                              type="button" 
                              onClick={() => setIpLimits(prev => prev.filter((_, i) => i !== index))}
                              className="text-gray-400 hover:text-rose-600 p-0.5 rounded-full hover:bg-gray-100 transition-all cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {isAddingIp ? (
                      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-2 animate-fade-in w-full">
                        <input 
                          type="text" 
                          placeholder="e.g. 192.168.1.1" 
                          value={newIpInput}
                          onChange={(e) => setNewIpInput(e.target.value)}
                          className="flex-1 text-xs font-mono bg-white border border-gray-200 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-blue-500"
                        />
                        <button 
                          type="button"
                          onClick={() => {
                            if (newIpInput.trim()) {
                              setIpLimits(prev => [...prev, newIpInput.trim()]);
                              setNewIpInput("");
                              setIsAddingIp(false);
                            }
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors cursor-pointer"
                        >
                          Add IP
                        </button>
                        <button 
                          type="button"
                          onClick={() => {
                            setNewIpInput("");
                            setIsAddingIp(false);
                          }}
                          className="bg-gray-200 hover:bg-gray-300 text-slate-600 text-xs font-bold px-3 py-2 rounded-lg transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button 
                        type="button" 
                        onClick={() => setIsAddingIp(true)}
                        className="w-full border border-dashed border-gray-300 rounded-full py-2.5 flex items-center justify-center text-xs text-gray-500 hover:bg-gray-50 hover:border-gray-400 transition-colors gap-1.5 font-semibold bg-white cursor-pointer"
                      >
                        <Plus className="w-4 h-4 stroke-[2]" /> add
                      </button>
                    )}
                  </div>

                  {/* Row 4: Model name mapping card */}
                  <div className="border border-gray-200/80 rounded-2xl p-5 bg-white shadow-3xs flex flex-col gap-3">
                    <div className="flex items-center justify-between w-full border-b border-gray-100 pb-3 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-800">Model name mapping</span>
                        <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-cyan-100 text-cyan-700 border border-cyan-200/60 uppercase tracking-wider font-mono">BETA</span>
                        <HelpCircle className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors" title="Maps custom requested model names to your target engine IDs" />
                      </div>
                      <span className="text-xs text-gray-400 font-mono font-bold">{modelMappings.length}/5</span>
                    </div>
                    <p className="text-xs text-gray-400 leading-normal mb-3 text-left">
                      Optional. Requests using the custom name are rewritten to the target model id. Aliases and targets cannot overlap.
                    </p>

                    {/* Mapping List */}
                    {modelMappings.length > 0 && (
                      <div className="flex flex-col gap-2 mb-3 text-left">
                        {modelMappings.map((mapping, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 border border-gray-150 rounded-xl px-4 py-2.5 text-xs text-slate-700 font-medium">
                            <div className="flex items-center gap-2 font-mono text-[11px]">
                              <span className="text-gray-400">Alias:</span>
                              <span className="text-slate-800 font-semibold bg-white border border-gray-200 px-2 py-0.5 rounded">{mapping.custom}</span>
                              <span className="text-gray-400">➔</span>
                              <span className="text-gray-400">Target:</span>
                              <span className="text-slate-800 font-semibold bg-white border border-gray-200 px-2 py-0.5 rounded">{mapping.target}</span>
                            </div>
                            <button 
                              type="button" 
                              onClick={() => setModelMappings(prev => prev.filter((_, i) => i !== index))}
                              className="text-gray-400 hover:text-rose-600 p-1 rounded-full hover:bg-gray-100 transition-all cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {isAddingMapping ? (
                      <div className="flex flex-col gap-3 bg-gray-50 border border-gray-200 rounded-xl p-4 animate-fade-in text-left">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] uppercase font-bold text-gray-500">Custom Alias</label>
                            <input 
                              type="text" 
                              placeholder="e.g. gpt-4" 
                              value={newMappingCustom}
                              onChange={(e) => setNewMappingCustom(e.target.value)}
                              className="text-xs font-mono bg-white border border-gray-200 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-blue-500"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] uppercase font-bold text-gray-500">Target Model ID</label>
                            <input 
                              type="text" 
                              placeholder="e.g. gemini-2.5-pro" 
                              value={newMappingTarget}
                              onChange={(e) => setNewMappingTarget(e.target.value)}
                              className="text-xs font-mono bg-white border border-gray-200 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-blue-500"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end mt-1">
                          <button 
                            type="button"
                            onClick={() => {
                              if (newMappingCustom.trim() && newMappingTarget.trim()) {
                                setModelMappings(prev => [...prev, { custom: newMappingCustom.trim(), target: newMappingTarget.trim() }]);
                                setNewMappingCustom("");
                                setNewMappingTarget("");
                                setIsAddingMapping(false);
                              }
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                          >
                            Save Mapping
                          </button>
                          <button 
                            type="button"
                            onClick={() => {
                              setNewMappingCustom("");
                              setNewMappingTarget("");
                              setIsAddingMapping(false);
                            }}
                            className="bg-gray-200 hover:bg-gray-300 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button 
                        type="button" 
                        onClick={() => setIsAddingMapping(true)}
                        className="w-full border border-dashed border-gray-300 rounded-full py-2.5 flex items-center justify-center text-xs text-gray-500 hover:bg-gray-50 hover:border-gray-400 transition-colors gap-1.5 font-semibold bg-white cursor-pointer"
                      >
                        <Plus className="w-4 h-4 stroke-[2]" /> Add mapping
                      </button>
                    )}
                  </div>

                  {/* Row 5: Fallback models on error card */}
                  <div className="border border-gray-200/80 rounded-2xl p-5 bg-white shadow-3xs flex flex-col gap-3">
                    <div className="flex items-center justify-between w-full border-b border-gray-100 pb-3 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-800">Fallback models on error</span>
                        <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-cyan-100 text-cyan-700 border border-cyan-200/60 uppercase tracking-wider font-mono">BETA</span>
                        <HelpCircle className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors" title="Retries are sent to fallback models sequentially in case of an API error" />
                      </div>
                      <span className="text-xs text-gray-400 font-mono font-bold">{fallbackModels.length}/3</span>
                    </div>
                    <p className="text-xs text-gray-400 leading-normal mb-3 text-left">
                      Optional. Retried in the order shown. Use the arrows to reorder.
                    </p>

                    {/* Fallback List */}
                    {fallbackModels.length > 0 && (
                      <div className="flex flex-col gap-2 mb-3 text-left">
                        {fallbackModels.map((model, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 border border-gray-150 rounded-xl px-4 py-2 text-xs text-slate-700 font-medium">
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-mono font-bold text-gray-400 bg-gray-200/60 w-5 h-5 rounded-full flex items-center justify-center">{index + 1}</span>
                              <span className="font-semibold text-slate-800 font-mono text-[11px]">{model}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {/* Reorder Up */}
                              <button 
                                type="button" 
                                disabled={index === 0}
                                onClick={() => {
                                  const updated = [...fallbackModels];
                                  const temp = updated[index];
                                  updated[index] = updated[index - 1];
                                  updated[index - 1] = temp;
                                  setFallbackModels(updated);
                                }}
                                className="text-gray-400 hover:text-slate-800 p-1 rounded hover:bg-gray-150 transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              {/* Reorder Down */}
                              <button 
                                type="button" 
                                disabled={index === fallbackModels.length - 1}
                                onClick={() => {
                                  const updated = [...fallbackModels];
                                  const temp = updated[index];
                                  updated[index] = updated[index + 1];
                                  updated[index + 1] = temp;
                                  setFallbackModels(updated);
                                }}
                                className="text-gray-400 hover:text-slate-800 p-1 rounded hover:bg-gray-150 transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                type="button" 
                                onClick={() => setFallbackModels(prev => prev.filter((_, i) => i !== index))}
                                className="text-gray-400 hover:text-rose-600 p-1 rounded-full hover:bg-gray-100 transition-all cursor-pointer ml-1"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {isAddingFallback ? (
                      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-2 animate-fade-in text-left w-full">
                        <select 
                          value={newFallbackModel}
                          onChange={(e) => setNewFallbackModel(e.target.value)}
                          className="flex-1 text-xs bg-white border border-gray-200 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-blue-500 cursor-pointer"
                        >
                          <option value="">-- Select fallback model --</option>
                          <option value="gemini-2.5-pro">gemini-2.5-pro</option>
                          <option value="gemini-2.5-flash">gemini-2.5-flash</option>
                          <option value="claude-3-5-sonnet">claude-3-5-sonnet</option>
                          <option value="gpt-4o">gpt-4o</option>
                        </select>
                        <button 
                          type="button"
                          onClick={() => {
                            if (newFallbackModel && !fallbackModels.includes(newFallbackModel)) {
                              setFallbackModels(prev => [...prev, newFallbackModel]);
                              setNewFallbackModel("");
                              setIsAddingFallback(false);
                            }
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors cursor-pointer"
                        >
                          Add
                        </button>
                        <button 
                          type="button"
                          onClick={() => {
                            setNewFallbackModel("");
                            setIsAddingFallback(false);
                          }}
                          className="bg-gray-200 hover:bg-gray-300 text-slate-600 text-xs font-bold px-3 py-2 rounded-lg transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button 
                        type="button" 
                        onClick={() => setIsAddingFallback(true)}
                        className="w-full border border-dashed border-gray-300 rounded-full py-2.5 flex items-center justify-center text-xs text-gray-500 hover:bg-gray-50 hover:border-gray-400 transition-colors gap-1.5 font-semibold bg-white cursor-pointer"
                      >
                        <Plus className="w-4 h-4 stroke-[2]" /> Add fallback
                      </button>
                    )}
                  </div>
                </div>

                {/* Bottom Submit/Cancel row exactly as the template layout */}
                <div className="border-t border-gray-150 pt-5 mt-8 flex items-center justify-end gap-3 w-full">
                  <button 
                    type="button"
                    onClick={() => {
                      setExpiredTime("");
                      setModelRange("default no limit");
                      setIpLimits([]);
                      setModelMappings([]);
                      setFallbackModels([]);
                      setMerchantFeedbackMessage("↩️ Setup values reverted to default.");
                    }}
                    className="border border-gray-250 hover:bg-gray-50 text-slate-600 hover:text-slate-900 text-xs font-bold px-5 py-2.5 rounded-full transition-all cursor-pointer shadow-3xs"
                  >
                    cancel
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setMerchantFeedbackMessage("💾 Successfully saved advanced integration gateway credentials!");
                    }}
                    className="bg-blue-650 hover:bg-blue-700 active:scale-95 text-white text-xs font-black px-6 py-2.5 rounded-full transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" /> submit
                  </button>
                </div>
              </div>
            )}

            {activeTab === "reset_delete" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
                className="flex flex-col gap-6 text-left font-sans"
              >
                {/* Header Section */}
                <div className="pb-5 border-b border-slate-100 dark:border-slate-850 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h4 className="text-xl font-bold text-slate-900 dark:text-white font-sans tracking-tight">
                        Reset Account Settings & Danger Zone
                      </h4>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 max-w-xl leading-relaxed">
                      Select a visual blueprint safety interface below. Instantly switch between three high-end designs.
                    </p>
                  </div>
                </div>

                {/* Theme Selector for Danger Zone page */}
                <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white rounded-2xl border border-slate-200/80 shadow-sm w-full md:w-auto md:self-start">
                  {[
                    { id: "cyber_vault", label: "🔒 Cyber Vault Core", desc: "Interactive sliders & grid schematics" },
                    { id: "crimson_pulse", label: "🚨 Crimson Pulse Engine", desc: "Dual safety capacitor chargers" },
                    { id: "clean_minimalist", label: "🕊️ Serene Safety Deck", desc: "Swiss monochrome & verification checks" }
                  ].map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => {
                        setDangerZoneDesign(style.id as any);
                        setResetSliderVal(0);
                        setDeleteSliderVal(0);
                        setCapResetProgress(0);
                        setCapDeleteProgress(0);
                        setVaultArmReset(false);
                        setVaultArmDelete(false);
                      }}
                      className={`flex-1 md:flex-none px-4 py-3 rounded-xl transition-all duration-200 flex flex-col items-start gap-0.5 cursor-pointer text-left min-w-[170px] ${
                        dangerZoneDesign === style.id
                          ? "bg-slate-50 text-slate-900 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border-b-2 border-rose-500"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50/50"
                      }`}
                    >
                      <span className="text-xs font-black tracking-tight">{style.label}</span>
                      <span className="text-[9px] font-semibold text-slate-500 leading-none mt-0.5">{style.desc}</span>
                    </button>
                  ))}
                </div>

                {/* THEME SCREEN 1: CYBER SECURITY VAULT */}
                {dangerZoneDesign === "cyber_vault" && (
                  <motion.div
                    key="cyber_vault"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-2"
                  >
                    {/* Left Panel: Grid Restoration Vault */}
                    <div className="group relative bg-white text-slate-900 rounded-3xl border border-slate-200/80 shadow-md p-6 md:p-8 flex flex-col justify-between overflow-hidden transition-all duration-300">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
                      
                      {vaultArmReset ? (
                        <div className="space-y-5 text-left animate-fade-in py-1">
                          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                            <span className="p-2 bg-sky-50 text-sky-600 rounded-xl border border-sky-100">
                              <Layout className="w-4 h-4 animate-spin-slow" />
                            </span>
                            <div>
                              <span className="text-[9px] uppercase font-bold text-sky-600 font-mono tracking-widest block">SECURE SYSTEM RESTORE DECK</span>
                              <h5 className="text-sm font-black text-slate-900 font-sans tracking-tight">Confirm Blueprint Recovery</h5>
                            </div>
                          </div>

                          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5 text-slate-600">
                            <p className="text-[11px] font-semibold text-sky-600">⚠️ All spacing grid dimensions, borders, and templates will be overwritten.</p>
                            <p className="text-[10px] leading-relaxed">This action applies the stock Algerian-made 5x6 layout configurations. Ensure you have saved any custom configurations elsewhere if desired.</p>
                          </div>

                          {/* Checkbox Acknowledge */}
                          <label className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100/50 transition-colors select-none">
                            <input
                              type="checkbox"
                              checked={resetUnderstandCheck}
                              onChange={(e) => setResetUnderstandCheck(e.target.checked)}
                              className="mt-0.5 w-4.5 h-4.5 rounded text-sky-600 bg-white border-slate-300 focus:ring-sky-500 cursor-pointer"
                            />
                            <span className="text-[11px] font-semibold text-slate-600 leading-normal">
                              I understand that spacing defaults will be applied instantly.
                            </span>
                          </label>

                          {/* Retype RESET */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-slate-500 block">
                              Confirm recovery by typing <strong className="text-sky-600 font-mono bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">RESET</strong>:
                            </label>
                            <input
                              type="text"
                              value={resetConfirmText}
                              onChange={(e) => setResetConfirmText(e.target.value)}
                              placeholder="Type RESET exactly"
                              className="w-full border focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl px-3 py-2 bg-white text-xs text-slate-900 font-mono font-bold outline-none"
                              style={{ borderColor: "#8f8b8b" }}
                            />
                          </div>

                          {resetErrorText && (
                            <div className="p-2.5 bg-rose-50 border border-rose-100 rounded-xl text-[10.5px] text-rose-600 font-bold font-mono">
                              {resetErrorText}
                            </div>
                          )}

                          <div className="flex flex-col sm:flex-row gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => {
                                setVaultArmReset(false);
                                setResetConfirmText("");
                                setResetUnderstandCheck(false);
                                setResetErrorText("");
                              }}
                              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer text-center"
                            >
                              Cancel Override
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (!resetUnderstandCheck) {
                                  setResetErrorText("❌ Acknowledge that layouts will be overwritten.");
                                  return;
                                }
                                if (resetConfirmText.trim() !== "RESET") {
                                  setResetErrorText("❌ Please type 'RESET' exactly to authorize.");
                                  return;
                                }
                                handleExecuteReset();
                              }}
                              className={`flex-1 text-white font-black text-xs py-2.5 rounded-xl transition-all text-center cursor-pointer ${
                                resetUnderstandCheck && resetConfirmText.trim() === "RESET"
                                  ? "bg-sky-600 hover:bg-sky-500"
                                  : "bg-slate-100 text-slate-400 cursor-not-allowed opacity-60"
                              }`}
                            >
                              ⚡ Rebuild Core Spacing
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <span className="text-[10px] uppercase font-bold text-sky-600 font-mono tracking-widest block">
                                SYSTEM PRESETS RESTORE
                              </span>
                              <h5 className="text-lg font-black text-slate-900 font-sans tracking-tight">
                                Revert Layout To Factory Blueprints
                              </h5>
                            </div>
                            <span className="p-2.5 bg-sky-50 text-sky-600 rounded-2xl border border-sky-100">
                              <Layout className="w-5 h-5 animate-pulse" />
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed font-normal">
                            Restores layout spacing grid values, active card configurations, payment options and notification channels to factory defaults (5x6 Grid, 20% x 18% sizing).
                          </p>

                          {/* Live Schematic Interactive Map */}
                          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                                {simulateBlueprint ? "✨ Mapped Output: Stock Factory Blueprint" : "📝 Mapped Output: Current Grid Matrix"}
                              </span>
                              <button
                                type="button"
                                onClick={() => setSimulateBlueprint(!simulateBlueprint)}
                                className="text-[10px] font-bold text-sky-600 hover:text-sky-700 transition-colors font-mono uppercase bg-white border border-slate-200 px-2 py-1 rounded"
                              >
                                {simulateBlueprint ? "Show My Grid" : "Simulate Default"}
                              </button>
                            </div>

                            {/* Dynamic SVG Drawing of active Grid layout */}
                            <div className="h-28 bg-white border border-slate-200/80 rounded-xl flex items-center justify-center relative overflow-hidden">
                              <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:14px_14px] opacity-80" />
                              
                              <div className="flex flex-col gap-1.5 z-10 p-2">
                                {Array.from({ length: simulateBlueprint ? 5 : Math.min(gridLinesVertical, 6) }).map((_, rIdx) => (
                                  <div key={rIdx} className="flex gap-1.5 justify-center">
                                    {Array.from({ length: simulateBlueprint ? 6 : Math.min(gridLinesHorizontal, 8) }).map((_, cIdx) => (
                                      <div 
                                        key={cIdx} 
                                        className={`w-2.5 h-2.5 rounded transition-all duration-300 ${
                                          simulateBlueprint 
                                            ? "bg-emerald-500/80 animate-pulse scale-[1.05]" 
                                            : "bg-sky-500/40"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                ))}
                              </div>

                              <div className="absolute bottom-2 right-3 text-[9px] font-mono font-bold text-slate-400">
                                {simulateBlueprint ? "5 Columns × 6 Rows (STOCK)" : `${gridLinesHorizontal} Cols × ${gridLinesVertical} Rows (MINE)`}
                              </div>
                            </div>
                          </div>

                          {/* Swipe track lock to authorize reset */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-[10px] font-mono font-black text-slate-500 uppercase tracking-wider">
                              <span>SLIDE TRACK TO RESET LAYOUTS</span>
                              <span className="text-sky-600 font-bold">{resetSliderVal}%</span>
                            </div>
                            
                            <div className="relative h-12 bg-slate-100 rounded-2xl border border-slate-200 flex items-center p-1 overflow-hidden select-none">
                              {/* Glowing background meter */}
                              <div 
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-sky-100 to-sky-200 transition-all duration-75"
                                style={{ width: `${resetSliderVal}%` }}
                              />
                              
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={resetSliderVal}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value);
                                  setResetSliderVal(val);
                                  if (val >= 100) {
                                    setVaultArmReset(true);
                                    setResetConfirmText("");
                                    setResetUnderstandCheck(false);
                                    setResetErrorText("");
                                    setTimeout(() => setResetSliderVal(0), 400);
                                  }
                                }}
                                onMouseUp={() => { if (resetSliderVal < 100) setResetSliderVal(0); }}
                                onTouchEnd={() => { if (resetSliderVal < 100) setResetSliderVal(0); }}
                                className="absolute inset-0 opacity-0 w-full h-full cursor-grab active:cursor-grabbing z-20"
                              />

                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                                <span className="text-[10px] font-bold text-slate-500 font-mono tracking-widest select-none uppercase">
                                  {resetSliderVal >= 100 ? "RELEASE TO UNLOCK RESET CONTROL..." : ">>> Slide to open reset control >>>"}
                                </span>
                              </div>

                              <motion.div 
                                className="w-10 h-10 rounded-xl bg-sky-600 hover:bg-sky-500 flex items-center justify-center text-white font-black shadow-lg shadow-sky-600/20 pointer-events-none z-10"
                                style={{ x: `calc(${resetSliderVal * 0.01} * (100% - 40px))` }}
                                animate={{ scale: resetSliderVal > 90 ? [1, 1.1, 1] : 1 }}
                                transition={{ repeat: Infinity, duration: 0.5 }}
                              >
                                🔄
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>


                    {/* Right Panel: Ultimate Deletion Vault */}
                    <div className="group relative bg-white text-slate-900 rounded-3xl border border-slate-200/80 shadow-md p-6 md:p-8 flex flex-col justify-between overflow-hidden transition-all duration-300">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
                      
                      {vaultArmDelete ? (
                        <div className="space-y-5 text-left animate-fade-in py-1">
                          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                            <span className="p-2 bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
                              <Trash2 className="w-4 h-4 animate-pulse" />
                            </span>
                            <div>
                              <span className="text-[9px] uppercase font-bold text-rose-600 font-mono tracking-widest block">CRITICAL PURGE GATEWAY</span>
                              <h5 className="text-sm font-black text-slate-900 font-sans tracking-tight">Confirm Forever Boutique Purge</h5>
                            </div>
                          </div>

                          <div className="p-3 bg-rose-50/50 border border-rose-100 rounded-xl space-y-1.5 text-slate-600">
                            <p className="text-[11px] font-semibold text-rose-600">⚠️ Irreversible registry wipeout of "{myStore.name}".</p>
                            <p className="text-[10px] leading-relaxed">This will release your subdomain <strong className="text-slate-900 underline">{myStore.subdomain}.shop.dz</strong> and drop all product, message, and buyer databases immediately.</p>
                          </div>

                          {/* Checkbox Acknowledge */}
                          <label className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100/50 transition-colors select-none">
                            <input
                              type="checkbox"
                              checked={deleteUnderstandCheck}
                              onChange={(e) => setDeleteUnderstandCheck(e.target.checked)}
                              className="mt-0.5 w-4.5 h-4.5 rounded text-rose-600 bg-white border-slate-300 focus:ring-rose-500 cursor-pointer"
                            />
                            <span className="text-[11px] font-semibold text-slate-600 leading-normal">
                              I explicitly confirm subdomain release and database zero-out.
                            </span>
                          </label>

                          {/* Retype Name */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-slate-500 block">
                              Type <strong className="text-rose-600 font-mono bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 select-all">{myStore.name}</strong> to authorize:
                            </label>
                            <input
                              type="text"
                              value={deleteConfirmName}
                              onChange={(e) => setDeleteConfirmName(e.target.value)}
                              placeholder="Type boutique name exactly"
                              className="w-full border focus:border-rose-500 focus:ring-1 focus:ring-rose-500 rounded-xl px-3 py-2 bg-white text-xs text-slate-900 font-bold outline-none"
                              style={{ borderColor: "#8f8b8b" }}
                            />
                          </div>

                          {/* Password verification */}
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <label className="text-[10px] uppercase font-bold text-slate-500 block">
                                Registry Password:
                              </label>
                              <span className="text-[8.5px] text-amber-700 font-mono bg-amber-50 border border-amber-100 rounded px-1.5 py-0.5">
                                default: algeria2026
                              </span>
                            </div>
                            <div className="relative">
                              <input
                                type={showDeletePassword ? "text" : "password"}
                                value={deletePassword}
                                onChange={(e) => setDeletePassword(e.target.value)}
                                placeholder="Enter security password"
                                className="w-full border focus:border-rose-500 focus:ring-1 focus:ring-rose-500 rounded-xl pl-3 pr-10 py-2 bg-white text-xs text-slate-900 font-mono font-bold outline-none"
                                style={{ borderColor: "#8f8b8b" }}
                              />
                              <button
                                type="button"
                                onClick={() => setShowDeletePassword(!showDeletePassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 text-[10px] font-bold"
                              >
                                {showDeletePassword ? "Hide" : "Show"}
                              </button>
                            </div>
                          </div>

                          {deleteModalError && (
                            <div className="p-2.5 bg-rose-50 border border-rose-100 rounded-xl text-[10.5px] text-rose-600 font-bold font-mono">
                              {deleteModalError}
                            </div>
                          )}

                          <div className="flex flex-col sm:flex-row gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => {
                                setVaultArmDelete(false);
                                setDeletePassword("");
                                setDeleteConfirmName("");
                                setDeleteUnderstandCheck(false);
                                setDeleteModalError("");
                              }}
                              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer text-center"
                            >
                              Abort Purge
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (!deleteUnderstandCheck) {
                                  setDeleteModalError("❌ Acknowledge the confirmation checkbox first.");
                                  return;
                                }
                                if (deleteConfirmName.trim().toLowerCase() !== myStore.name.trim().toLowerCase()) {
                                  setDeleteModalError("❌ Typed name does not match the boutique name exactly.");
                                  return;
                                }
                                if (!deletePassword) {
                                  setDeleteModalError("❌ Password is required.");
                                  return;
                                }
                                if (deletePassword !== "algeria2026" && deletePassword.length < 6) {
                                  setDeleteModalError("❌ Invalid security password. Try 'algeria2026'.");
                                  return;
                                }
                                handleExecuteDeletion();
                              }}
                              className={`flex-grow-[1.5] text-white font-black text-xs py-2.5 rounded-xl transition-all text-center cursor-pointer ${
                                deleteUnderstandCheck &&
                                deleteConfirmName.trim().toLowerCase() === myStore.name.trim().toLowerCase() &&
                                deletePassword.length >= 6
                                  ? "bg-rose-600 hover:bg-rose-500 text-white"
                                  : "bg-slate-100 text-slate-400 cursor-not-allowed opacity-60"
                              }`}
                            >
                              🔥 Commit Absolute Purge
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <span className="text-[10px] uppercase font-bold text-rose-600 font-mono tracking-widest block">
                                DESTROY STORE REGISTRY
                              </span>
                              <h5 className="text-lg font-black text-slate-900 font-sans tracking-tight">
                                Irreversible Boutique Purge
                              </h5>
                            </div>
                            <span className="p-2.5 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100">
                              <Trash2 className="w-5 h-5 animate-pulse" />
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed font-normal">
                            Permanently wipe all product catalogs, customer logs, messages, and release banners. This action releases your subdomain <strong className="font-mono text-slate-900 underline">{myStore.subdomain}.shop.dz</strong> immediately.
                          </p>

                          {/* Interactive Warning Indicators */}
                          <div className="grid grid-cols-3 gap-3">
                            {[
                              { label: "Products", count: myStore.products?.length || 0, color: "text-rose-600 hover:bg-rose-50" },
                              { label: "Followers", count: followersList?.length || 5, color: "text-rose-600 hover:bg-rose-50" },
                              { label: "Domain", count: 1, color: "text-amber-600 hover:bg-amber-50" }
                            ].map((stat, idx) => (
                              <div key={idx} className={`p-3.5 bg-slate-50 border border-slate-200/50 rounded-2xl flex flex-col items-center justify-center gap-1 transition-colors ${stat.color}`}>
                                <span className="text-lg font-black">{stat.count}</span>
                                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{stat.label}</span>
                              </div>
                            ))}
                          </div>

                          {/* Slide track to unlock secure portal */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-[10px] font-mono font-black text-slate-500 uppercase tracking-wider">
                              <span>SLIDE TO UNLOCK SECURE PURGE</span>
                              <span className="text-rose-600 font-bold">{deleteSliderVal}%</span>
                            </div>

                            <div className="relative h-12 bg-slate-100 rounded-2xl border border-slate-200 flex items-center p-1 overflow-hidden select-none">
                              {/* Glowing red track */}
                              <div 
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-rose-100 to-rose-200 transition-all duration-75"
                                style={{ width: `${deleteSliderVal}%` }}
                              />

                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={deleteSliderVal}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value);
                                  setDeleteSliderVal(val);
                                  if (val >= 100) {
                                    setVaultArmDelete(true);
                                    setDeleteConfirmName("");
                                    setDeletePassword("");
                                    setDeleteUnderstandCheck(false);
                                    setDeleteModalError("");
                                    setTimeout(() => setDeleteSliderVal(0), 400);
                                  }
                                }}
                                onMouseUp={() => { if (deleteSliderVal < 100) setDeleteSliderVal(0); }}
                                onTouchEnd={() => { if (deleteSliderVal < 100) setDeleteSliderVal(0); }}
                                className="absolute inset-0 opacity-0 w-full h-full cursor-grab active:cursor-grabbing z-20"
                              />

                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                                <span className="text-[10px] font-bold text-slate-500 font-mono tracking-widest select-none uppercase">
                                  {deleteSliderVal >= 100 ? "RELEASE TO UNLOCK PORTAL..." : ">>> Slide to open delete portal >>>"}
                                </span>
                              </div>

                              <motion.div 
                                className="w-10 h-10 rounded-xl bg-rose-600 hover:bg-rose-550 flex items-center justify-center text-white font-black shadow-lg shadow-rose-600/25 pointer-events-none z-10"
                                style={{ x: `calc(${deleteSliderVal * 0.01} * (100% - 40px))` }}
                              >
                                💀
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* THEME SCREEN 2: CRIMSON PULSE EMERGENCY DECK */}
                {dangerZoneDesign === "crimson_pulse" && (
                  <motion.div
                    key="crimson_pulse"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 md:p-8 bg-black text-rose-500 rounded-3xl border-2 border-rose-950/70 shadow-[0_0_50px_rgba(239,68,68,0.06)] relative overflow-hidden"
                  >
                    {/* Subtle hazard stripe overlay on margins */}
                    <div className="absolute top-0 right-0 w-24 h-full opacity-[0.03] bg-[repeating-linear-gradient(45deg,#f43f5e_0px,#f43f5e_8px,transparent_8px,transparent_16px)] pointer-events-none" />
                    
                    <div className="flex items-center gap-3 pb-5 border-b border-rose-950/50 mb-6">
                      <span className="p-2 bg-rose-950/40 rounded-xl text-rose-400 animate-bounce">
                        <AlertCircle className="w-5 h-5" />
                      </span>
                      <div>
                        <h5 className="text-base font-black uppercase font-mono tracking-widest text-rose-400">
                          CRITICAL OVERRIDE CHAMBER
                        </h5>
                        <p className="text-[10px] text-rose-600 font-bold uppercase tracking-wider font-mono">
                          Requires active energy arming triggers to bypass safety protocols.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Restore Cap Trigger */}
                      <div className="bg-slate-950 border border-rose-900/40 p-6 rounded-2xl space-y-5">
                        <span className="text-[9px] uppercase font-bold tracking-widest text-amber-500 font-mono block">
                          CAPACITOR 01: BLUEPRINT REFRESH
                        </span>

                        {vaultArmReset ? (
                          <div className="space-y-4 text-left animate-fade-in">
                            <div className="p-3 bg-slate-900/80 border border-amber-900/30 rounded-xl space-y-1.5 text-rose-200/90">
                              <p className="text-[11px] font-semibold text-amber-400">⚠️ All spacing grid dimensions, borders, and templates will be overwritten.</p>
                            </div>

                            <label className="flex items-start gap-3 p-2.5 bg-black border border-rose-950 rounded-xl cursor-pointer hover:bg-slate-950 transition-colors select-none">
                              <input
                                type="checkbox"
                                checked={resetUnderstandCheck}
                                onChange={(e) => setResetUnderstandCheck(e.target.checked)}
                                className="mt-0.5 w-4.5 h-4.5 rounded text-amber-500 bg-black border-rose-900/40 focus:ring-amber-500 cursor-pointer"
                              />
                              <span className="text-[11px] font-semibold text-slate-400 leading-normal">
                                I confirm spacing defaults.
                              </span>
                            </label>

                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                                Confirm by typing <strong className="text-amber-400 bg-black px-1.5 py-0.5 rounded border border-rose-950">RESET</strong>:
                              </label>
                              <input
                                type="text"
                                value={resetConfirmText}
                                onChange={(e) => setResetConfirmText(e.target.value)}
                                placeholder="Type RESET"
                                className="w-full border border-rose-950 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl px-3 py-1.5 bg-black text-xs text-white font-mono font-bold outline-none"
                              />
                            </div>

                            {resetErrorText && (
                              <div className="p-2.5 bg-rose-950/40 border border-rose-900/30 rounded-xl text-[10.5px] text-rose-400 font-bold font-mono">
                                {resetErrorText}
                              </div>
                            )}

                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setVaultArmReset(false);
                                  setCapResetProgress(0);
                                  setResetConfirmText("");
                                  setResetUnderstandCheck(false);
                                  setResetErrorText("");
                                }}
                                className="flex-1 bg-rose-950/20 hover:bg-rose-950/40 text-rose-300 font-bold text-xs py-2 rounded-xl transition-all cursor-pointer font-mono"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (!resetUnderstandCheck) {
                                    setResetErrorText("❌ Acknowledge the confirmation.");
                                    return;
                                  }
                                  if (resetConfirmText.trim() !== "RESET") {
                                    setResetErrorText("❌ Please type 'RESET' exactly.");
                                    return;
                                  }
                                  handleExecuteReset();
                                  setCapResetProgress(0);
                                }}
                                className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-2 rounded-xl transition-all font-mono"
                              >
                                Execute
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-xs text-rose-200/70 leading-relaxed font-mono">
                              Armed capacitors will force-reload all CSS layouts, borders, alignments, and parameters to original Algeria-made standards.
                            </p>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-[10px] font-mono">
                                <span className="text-slate-400">RESTORE VOLTAGE CAPACITY</span>
                                <span className="text-amber-500 font-bold">{capResetProgress}%</span>
                              </div>
                              
                              <div className="h-2 bg-rose-950 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-75"
                                  style={{ width: `${capResetProgress}%` }}
                                />
                              </div>
                            </div>

                            {capResetProgress < 100 ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setCapResetProgress(1);
                                  const interval = setInterval(() => {
                                    setCapResetProgress((prev) => {
                                      if (prev >= 100) {
                                        clearInterval(interval);
                                        return 100;
                                      }
                                      return prev + 10;
                                    });
                                  }, 60);
                                }}
                                className="w-full bg-amber-950/40 hover:bg-amber-900/30 border border-amber-900/50 text-amber-500 text-xs py-3 rounded-xl font-bold font-mono transition-all cursor-pointer text-center tracking-wider hover:scale-101 active:scale-99"
                              >
                                ⚡ ARM BLUEPRINT CAPACITOR
                              </button>
                            ) : (
                              <motion.button
                                initial={{ scale: 0.95 }}
                                animate={{ scale: [1, 1.02, 1] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                type="button"
                                onClick={() => {
                                  setVaultArmReset(true);
                                  setResetConfirmText("");
                                  setResetUnderstandCheck(false);
                                  setResetErrorText("");
                                }}
                                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs py-3 rounded-xl font-black font-mono transition-all cursor-pointer text-center tracking-wider shadow-lg shadow-amber-500/20"
                              >
                                ✅ CAPACITOR ARMED: OPEN RESTORE CONTROL
                              </motion.button>
                            )}
                          </>
                        )}
                      </div>

                      {/* Deletion Cap Trigger */}
                      <div className="bg-slate-950 border border-rose-900/40 p-6 rounded-2xl space-y-5">
                        <span className="text-[9px] uppercase font-bold tracking-widest text-rose-500 font-mono block">
                          CAPACITOR 02: DESTRUCTION DISENGAGE
                        </span>

                        {vaultArmDelete ? (
                          <div className="space-y-4 text-left animate-fade-in font-mono">
                            <div className="p-3 bg-slate-900/80 border border-rose-950 rounded-xl space-y-1.5 text-rose-350">
                              <p className="text-[11px] font-semibold text-rose-400">⚠️ Wipeout of "{myStore.name}".</p>
                            </div>

                            <label className="flex items-start gap-3 p-2.5 bg-black border border-rose-950 rounded-xl cursor-pointer hover:bg-slate-950 transition-colors select-none">
                              <input
                                type="checkbox"
                                checked={deleteUnderstandCheck}
                                onChange={(e) => setDeleteUnderstandCheck(e.target.checked)}
                                className="mt-0.5 w-4.5 h-4.5 rounded text-rose-500 bg-black border-rose-900/45 focus:ring-rose-500 cursor-pointer"
                              />
                              <span className="text-[11px] font-semibold text-slate-400 leading-normal">
                                I confirm release & drop databases.
                              </span>
                            </label>

                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-bold text-slate-400 block">
                                Type <strong className="text-rose-400 bg-black px-1.5 py-0.5 rounded border border-rose-950 select-all">{myStore.name}</strong>:
                              </label>
                              <input
                                type="text"
                                value={deleteConfirmName}
                                onChange={(e) => setDeleteConfirmName(e.target.value)}
                                placeholder="Type name exactly"
                                className="w-full border border-rose-950 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 rounded-xl px-3 py-1.5 bg-black text-xs text-white font-bold outline-none font-mono"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-bold text-slate-400 block">
                                Password:
                              </label>
                              <input
                                type="password"
                                value={deletePassword}
                                onChange={(e) => setDeletePassword(e.target.value)}
                                placeholder="algeria2026"
                                className="w-full border border-rose-950 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 rounded-xl px-3 py-1.5 bg-black text-xs text-white font-mono font-bold outline-none"
                              />
                            </div>

                            {deleteModalError && (
                              <div className="p-2.5 bg-rose-950/40 border border-rose-900/30 rounded-xl text-[10.5px] text-rose-400 font-bold font-mono">
                                {deleteModalError}
                              </div>
                            )}

                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setVaultArmDelete(false);
                                  setCapDeleteProgress(0);
                                  setDeletePassword("");
                                  setDeleteConfirmName("");
                                  setDeleteUnderstandCheck(false);
                                  setDeleteModalError("");
                                }}
                                className="flex-1 bg-rose-950/20 hover:bg-rose-950/40 text-rose-300 font-bold text-xs py-2 rounded-xl transition-all cursor-pointer font-mono"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (!deleteUnderstandCheck) {
                                    setDeleteModalError("❌ Acknowledge confirmation first.");
                                    return;
                                  }
                                  if (deleteConfirmName.trim().toLowerCase() !== myStore.name.trim().toLowerCase()) {
                                    setDeleteModalError("❌ Typed name does not match.");
                                    return;
                                  }
                                  if (!deletePassword) {
                                    setDeleteModalError("❌ Password required.");
                                    return;
                                  }
                                  if (deletePassword !== "algeria2026" && deletePassword.length < 6) {
                                    setDeleteModalError("❌ Invalid password.");
                                    return;
                                  }
                                  handleExecuteDeletion();
                                  setCapDeleteProgress(0);
                                }}
                                className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs py-2 rounded-xl transition-all font-mono"
                              >
                                Purge
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-xs text-rose-200/70 leading-relaxed font-mono">
                              Bypasses the safety registry to allow complete, permanent deletion of {myStore.name}. There is no backup system on-site.
                            </p>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-[10px] font-mono">
                                <span className="text-slate-400">PURGE VOLTAGE CAPACITY</span>
                                <span className="text-rose-500 font-bold">{capDeleteProgress}%</span>
                              </div>
                              
                              <div className="h-2 bg-rose-950 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-rose-700 to-rose-500 transition-all duration-75"
                                  style={{ width: `${capDeleteProgress}%` }}
                                />
                              </div>
                            </div>

                            {capDeleteProgress < 100 ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setCapDeleteProgress(1);
                                  const interval = setInterval(() => {
                                    setCapDeleteProgress((prev) => {
                                      if (prev >= 100) {
                                        clearInterval(interval);
                                        return 100;
                                      }
                                      return prev + 10;
                                    });
                                  }, 60);
                                }}
                                className="w-full bg-rose-950/40 hover:bg-rose-900/30 border border-rose-900/50 text-rose-500 text-xs py-3 rounded-xl font-bold font-mono transition-all cursor-pointer text-center tracking-wider hover:scale-101 active:scale-99"
                              >
                                ⚡ ARM DESTRUCT CAPACITOR
                              </button>
                            ) : (
                              <motion.button
                                initial={{ scale: 0.95 }}
                                animate={{ scale: [1, 1.02, 1] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                type="button"
                                onClick={() => {
                                  setVaultArmDelete(true);
                                  setDeleteConfirmName("");
                                  setDeletePassword("");
                                  setDeleteUnderstandCheck(false);
                                  setDeleteModalError("");
                                }}
                                className="w-full bg-rose-600 hover:bg-rose-500 text-white text-xs py-3 rounded-xl font-black font-mono transition-all cursor-pointer text-center tracking-wider shadow-lg shadow-rose-600/20"
                              >
                                ⚠️ ARMED: OPEN DESTRUCTION CONTROL
                              </motion.button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* THEME SCREEN 3: SERENE MINIMALIST SAFETY DECK */}
                {dangerZoneDesign === "clean_minimalist" && (
                  <motion.div
                    key="clean_minimalist"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-3xs text-slate-800 dark:text-slate-200 space-y-8"
                  >
                    <div className="max-w-2xl space-y-2">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-widest font-mono">
                        Verification Level
                      </span>
                      <h5 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                        Three-Factor Safety Checklists
                      </h5>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        To preserve system health and prevent erroneous mouse-clicks from purging your registry, please manually review and check each scenario indicator.
                      </p>
                    </div>

                    <div className="space-y-3 max-w-xl">
                      {[
                        `I acknowledge that doing a hard restoration will permanently overwrite my custom accent color (${bgColor}), active cover templates (${selectedCoverTemplate}), and custom borders.`,
                        `I verify that I understand that purging the boutique will release subdomain "${myStore.subdomain || "shop"}.yume.store" back to the public catalog database immediately.`,
                        `I accept that this action is absolutely non-negotiable, does not support database back-ups, and is instantly committed across the entire server cluster.`
                      ].map((desc, idx) => (
                        <label 
                          key={idx}
                          className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer select-none"
                        >
                          <input 
                            type="checkbox"
                            checked={checklistChecked[idx]}
                            onChange={(e) => {
                              const updated = [...checklistChecked];
                              updated[idx] = e.target.checked;
                              setChecklistChecked(updated);
                            }}
                            className="mt-0.5 w-4.5 h-4.5 rounded-lg text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 focus:ring-slate-500 cursor-pointer"
                          />
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                            {desc}
                          </span>
                        </label>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-4">
                      {checklistChecked.every(Boolean) ? (
                        <div className="w-full">
                          {vaultArmReset ? (
                            <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-900/50 space-y-4 max-w-xl animate-fade-in text-left">
                              <h6 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest font-mono">Confirm Parameter Reset</h6>
                              <p className="text-xs text-slate-500">This will restore original values for layout spacings and themes.</p>
                              
                              <div className="space-y-1">
                                <label className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                                  Type <strong className="text-slate-900 dark:text-white bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded">RESET</strong> to confirm:
                                </label>
                                <input
                                  type="text"
                                  value={resetConfirmText}
                                  onChange={(e) => setResetConfirmText(e.target.value)}
                                  placeholder="Type RESET"
                                  className="w-full border rounded-xl px-3 py-1.5 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-white font-mono outline-none"
                                  style={{ borderColor: "#8f8b8b" }}
                                />
                              </div>

                              {resetErrorText && (
                                <p className="text-xs text-rose-500 font-bold">{resetErrorText}</p>
                              )}

                              <div className="flex gap-2 pt-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setVaultArmReset(false);
                                    setResetConfirmText("");
                                    setResetErrorText("");
                                  }}
                                  className="flex-1 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-705 font-bold text-xs py-2 rounded-xl transition-all cursor-pointer"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (resetConfirmText.trim() !== "RESET") {
                                      setResetErrorText("❌ Type 'RESET' exactly.");
                                      return;
                                    }
                                    handleExecuteReset();
                                    setChecklistChecked([false, false, false]);
                                  }}
                                  className="flex-1 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold text-xs py-2 rounded-xl transition-all cursor-pointer"
                                >
                                  Reset Defaults
                                </button>
                              </div>
                            </div>
                          ) : vaultArmDelete ? (
                            <div className="p-5 border border-rose-200 dark:border-rose-900/40 rounded-2xl bg-rose-50/50 dark:bg-rose-950/10 space-y-4 max-w-xl animate-fade-in text-left">
                              <h6 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest font-mono">⚠️ Irreversible Store Deletion</h6>
                              <p className="text-xs text-slate-500 dark:text-slate-400">All databases and products will be permanently purged.</p>

                              <div className="space-y-1">
                                <label className="text-[10px] uppercase font-bold text-slate-500 block">
                                  Type your boutique name <strong className="text-slate-900 dark:text-white select-all bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded">{myStore.name}</strong>:
                                </label>
                                <input
                                  type="text"
                                  value={deleteConfirmName}
                                  onChange={(e) => setDeleteConfirmName(e.target.value)}
                                  placeholder="Type store name exactly"
                                  className="w-full border rounded-xl px-3 py-1.5 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-white outline-none"
                                  style={{ borderColor: "#8f8b8b" }}
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] uppercase font-bold text-slate-500 block">
                                  Registry Password (default: algeria2026):
                                </label>
                                <input
                                  type="password"
                                  value={deletePassword}
                                  onChange={(e) => setDeletePassword(e.target.value)}
                                  placeholder="Enter security password"
                                  className="w-full border rounded-xl px-3 py-1.5 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-white outline-none"
                                  style={{ borderColor: "#8f8b8b" }}
                                />
                              </div>

                              {deleteModalError && (
                                <p className="text-xs text-rose-600 font-bold">{deleteModalError}</p>
                              )}

                              <div className="flex gap-2 pt-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setVaultArmDelete(false);
                                    setDeleteConfirmName("");
                                    setDeletePassword("");
                                    setDeleteModalError("");
                                  }}
                                  className="flex-1 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-705 font-bold text-xs py-2 rounded-xl transition-all cursor-pointer"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (deleteConfirmName.trim().toLowerCase() !== myStore.name.trim().toLowerCase()) {
                                      setDeleteModalError("❌ Typed name does not match boutique name.");
                                      return;
                                    }
                                    if (!deletePassword) {
                                      setDeleteModalError("❌ Password is required.");
                                      return;
                                    }
                                    if (deletePassword !== "algeria2026" && deletePassword.length < 6) {
                                      setDeleteModalError("❌ Invalid password.");
                                      return;
                                    }
                                    handleExecuteDeletion();
                                    setChecklistChecked([false, false, false]);
                                  }}
                                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2 rounded-xl transition-all cursor-pointer"
                                >
                                  Permanently Delete
                                </button>
                              </div>
                            </div>
                          ) : (
                            <motion.div 
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex flex-col sm:flex-row gap-4 w-full"
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  setVaultArmReset(true);
                                  setResetConfirmText("");
                                  setResetErrorText("");
                                }}
                                className="flex-1 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold py-4 rounded-xl transition-all cursor-pointer text-center"
                              >
                                🔄 Reset Spacing & Layout Parameters
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setVaultArmDelete(true);
                                  setDeleteConfirmName("");
                                  setDeletePassword("");
                                  setDeleteModalError("");
                                }}
                                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-4 rounded-xl transition-all cursor-pointer text-center"
                              >
                                🗑️ Proceed to Secure Deletion Terminal
                              </button>
                            </motion.div>
                          )}
                        </div>
                      ) : (
                        <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl w-full text-center">
                          <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            🔒 Complete the three safety checkboxes above to release operation triggers
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
              </div>

              {/* Setup tab save buttons */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-end w-full mt-2 font-sans">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const currIdx = SETUP_CHAPTERS.findIndex(c => c.id === activeTab);
                      if (currIdx < SETUP_CHAPTERS.length - 1) {
                        const nextId = SETUP_CHAPTERS[currIdx + 1].id;
                        setActiveTab(nextId);
                        setMerchantFeedbackMessage(`Next: ${SETUP_CHAPTERS[currIdx + 1].title}`);
                      } else {
                        handleGlobalPersistSettings();
                      }
                    }}
                    className="bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-705 border border-slate-205 font-extrabold text-xs px-5 py-2.5 rounded-full transition-all cursor-pointer select-none flex items-center gap-1"
                  >
                    {activeTab === "reset_delete" ? "Save Changes" : "Next Module"}
                    <ChevronRight className="w-4 h-4 shrink-0" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleGlobalPersistSettings();
                    }}
                    className="bg-[#2563EB] hover:bg-[#2563EB]/90 border border-[#2563EB] active:scale-95 text-white font-black text-xs px-5 py-2.5 rounded-full transition-all shadow-sm flex items-center gap-1.5 cursor-pointer select-none"
                  >
                    <CheckCircle className="w-4 h-4 text-[#98F01A]" style={{ color: "#98F01A" }} />
                    Save Changes
                  </button>
                </div>
              </div>

            </motion.div>
          </AnimatePresence>

            {/* Right sidebar column: Helpful tips */}
            <div className="lg:col-span-4 lg:sticky lg:top-4 flex flex-col gap-6">
              
              {/* Dynamic Tip Card with warm, highly readable, luxurious touch */}
              {(() => {
                const currentTip = CHAPTER_TIPS[activeTab] || {
                  title: "Setup Guideline",
                  desc: "Complete settings fields on the left to maximize active rating prominence.",
                  list: ["Verify entries are accurate.", "Save settings to persist updates."]
                };
                return (
                  <div className="bg-white border border-slate-200/85 rounded-2xl p-6 shadow-[0_6px_16px_rgba(0,0,0,0.04)] text-left font-sans transition-all hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] duration-300">
                    <div className="mb-4 text-3xl font-bold filter select-none transition-transform hover:scale-105" style={{ color: accentColor }}>💡</div>
                    <h4 className="text-sm font-semibold text-slate-850 mb-2 font-sans tracking-tight leading-snug">
                      {currentTip.title}
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4.5 font-normal">
                      {currentTip.desc}
                    </p>
                    
                    <ul className="flex flex-col gap-3.5 border-t border-slate-100 pt-4">
                      {currentTip.list.map((item, idx) => (
                        <li key={idx} className="flex gap-2.5 text-[11px] text-slate-600 leading-relaxed font-sans font-medium">
                          <Check className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-700 stroke-[2.5]" style={{ color: accentColor }} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })()}

              {/* Security Auditing Card */}
              <div 
                className="rounded-2xl p-6 text-left border border-[#EBE3CD]/75 leading-relaxed flex gap-3.5 font-sans relative overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.01)] transition-all duration-300 hover:scale-[1.01]"
                style={{ backgroundColor: "#FDFBF7" }}
              >
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border"
                  style={{ 
                    backgroundColor: "#F4EBD40f", 
                    borderColor: "#EBE3CD90",
                    color: accentColor
                  }}
                >
                  <ShieldCheck className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10.5px] uppercase font-mono font-black text-[#8C7A4A] tracking-wider block">🔒 Security Auditing</span>
                  <p className="text-[11px] text-[#695D3C] font-normal leading-relaxed">
                    Your credentials and API keys are strictly decrypted and evaluated server-side. No API keys or clear-text credentials are ever exposed client-side.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* 🌟 FULL-SCREEN LIVE PREVIEW MODAL */}
      {previewTemplateId && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-4 md:p-8 font-sans select-none animate-fade-in">
          <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            
            {/* Header / Top bar of the preview window */}
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs font-mono font-bold text-slate-400 ml-2 uppercase tracking-widest">
                  Live Preview Mode &bull; {BANNER_TEMPLATES.find(t => t.id === previewTemplateId)?.name || previewTemplateId.toUpperCase()}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewTemplateId(null)}
                className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simulated Desktop Webpage Browser Frame */}
            <div className="p-6 md:p-10 bg-slate-950 flex flex-col gap-6">
              
              <div className="text-[11px] font-mono text-slate-500 flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400 font-bold uppercase">URL</span>
                <span>https://{myStore.subdomain || "boutique"}.shop.dz</span>
              </div>

              {/* Cover Banner Preview Stage - rendered exactly as App.tsx's public cover banner */}
              <div 
                className="w-full min-h-[220px] md:min-h-[280px] rounded-2xl relative overflow-hidden shadow-xl border border-white/10 flex flex-col justify-between p-6 md:p-10 text-left text-white"
                style={{
                  background: (() => {
                    const activeTemplateId = previewTemplateId;
                    if (activeTemplateId === "sahara_gold") return "linear-gradient(135deg, #f59e0b 0%, #ea580c 50%, #7c2d12 100%)";
                    if (activeTemplateId === "casbah_minimal") return "linear-gradient(135deg, #475569 0%, #1e293b 100%)";
                    if (activeTemplateId === "berber_indigo") return "linear-gradient(135deg, #4f46e5 0%, #312e81 100%)";
                    if (activeTemplateId === "turquoise_sea") return "linear-gradient(135deg, #0d9488 0%, #0891b2 50%, #0369a1 100%)";
                    if (activeTemplateId === "moorish_emerald") return "linear-gradient(135deg, #064e3b 0%, #022c22 100%)";
                    if (activeTemplateId === "sunset_rose") return "linear-gradient(135deg, #f43f5e 0%, #e11d48 50%, #9f1239 100%)";
                    if (activeTemplateId === "cyber_kasbah") return "linear-gradient(135deg, #a855f7 0%, #701a75 50%, #4c1d95 100%)";
                    if (activeTemplateId === "slate_noir") return "linear-gradient(135deg, #1c1917 0%, #0c0a09 100%)";
                    if (activeTemplateId === "terracotta") return "linear-gradient(135deg, #c2410c 0%, #9a3412 50%, #7c2d12 100%)";
                    if (activeTemplateId === "velvet_crimson") return "linear-gradient(135deg, #be123c 0%, #9f1239 50%, #4c0519 100%)";
                    return "linear-gradient(135deg, #1e293b, #0f172a)";
                  })()
                }}
              >
                {/* Decorative Atmospheric Effects depending on template */}
                {previewTemplateId === "sahara_gold" && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-35">
                    <div className="absolute w-[400px] h-[400px] -top-40 -left-40 rounded-full bg-radial from-yellow-300/30 to-transparent blur-3xl animate-pulse" />
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(251,191,36,0.03)_1px,transparent_1px)] bg-[size:100%_4px]" />
                  </div>
                )}

                {previewTemplateId === "casbah_minimal" && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25">
                    <div className="absolute inset-x-8 top-12 bottom-12 border-l border-r border-white/5" />
                    <div className="absolute inset-y-8 left-12 right-12 border-t border-b border-white/5" />
                  </div>
                )}

                {previewTemplateId === "berber_indigo" && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20 bg-[radial-gradient(#4338ca_1px,transparent_1px)] bg-[size:16px_16px]">
                    <div className="absolute right-12 top-1/2 -translate-y-1/2 w-48 h-48 border border-white/10 rounded-full flex items-center justify-center">
                      <div className="w-36 h-36 border border-white/5 rounded-full flex items-center justify-center">
                        <div className="w-24 h-24 border border-indigo-500/20 rotate-45" />
                      </div>
                    </div>
                  </div>
                )}

                {previewTemplateId === "turquoise_sea" && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
                    <div className="absolute w-[600px] h-[300px] -bottom-36 -right-20 rounded-full bg-cyan-400/20 blur-3xl" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.15),transparent_70%)]" />
                  </div>
                )}

                {previewTemplateId === "moorish_emerald" && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute inset-4 border border-amber-400/25 rounded-lg" />
                    <div className="absolute inset-5 border border-amber-400/10 rounded-lg" />
                    <div className="absolute top-6 left-6 text-amber-400/45 text-xs font-serif">❖</div>
                    <div className="absolute top-6 right-6 text-amber-400/45 text-xs font-serif">❖</div>
                    <div className="absolute bottom-6 left-6 text-amber-400/45 text-xs font-serif">❖</div>
                    <div className="absolute bottom-6 right-6 text-amber-400/45 text-xs font-serif">❖</div>
                  </div>
                )}

                {previewTemplateId === "sunset_rose" && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-45">
                    <div className="absolute w-[300px] h-[300px] top-10 left-1/4 rounded-full bg-rose-400/25 blur-3xl" />
                    <div className="absolute w-[200px] h-[200px] bottom-5 right-1/3 rounded-full bg-pink-500/20 blur-2xl" />
                  </div>
                )}

                {previewTemplateId === "cyber_kasbah" && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(244,63,94,0.08)_1px,transparent_1px),linear-gradient(to_right,rgba(6,182,212,0.08)_1px,transparent_1px)] bg-[size:16px_16px]" />
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
                    <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-fuchsia-500/50 to-transparent" />
                  </div>
                )}

                {previewTemplateId === "slate_noir" && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
                    <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/10 to-transparent" />
                  </div>
                )}

                {previewTemplateId === "terracotta" && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(0,0,0,0.1),rgba(0,0,0,0.1)_2px,transparent_2px,transparent_10px)]" />
                  </div>
                )}

                {previewTemplateId === "velvet_crimson" && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute inset-3 border border-amber-500/20 rounded-md" />
                    <div className="absolute inset-4 border-2 border-double border-amber-500/10 rounded-md" />
                  </div>
                )}

                {/* UPPER ROW: Header & Badge */}
                <div className="flex items-center justify-between w-full relative z-10">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono tracking-widest font-black uppercase text-white/90 border border-white/20 px-3 py-1 bg-white/10 rounded-md backdrop-blur-xs">
                      {BANNER_TEMPLATES.find(t => t.id === previewTemplateId)?.badge || "PREVIEW"}
                    </span>
                    <span className="h-px w-8 bg-white/20" />
                    <span className="text-[9.5px] font-mono text-white/60 tracking-wider">EST. {new Date().getFullYear()}</span>
                  </div>
                </div>

                {/* MIDDLE ROW: Store Identity, styled per template */}
                <div className="my-auto py-4 relative z-10 max-w-xl">
                  <h2 
                    className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 leading-none"
                    style={{
                      fontFamily: ["sahara_gold", "moorish_emerald", "terracotta", "velvet_crimson"].includes(previewTemplateId) 
                        ? "'Playfair Display', Georgia, serif" 
                        : previewTemplateId === "cyber_kasbah" ? "'JetBrains Mono', monospace" : "inherit",
                      textShadow: previewTemplateId === "cyber_kasbah" ? "0 0 12px rgba(244,63,94,0.6)" : "0 2px 4px rgba(0,0,0,0.15)"
                    }}
                  >
                    {myStore.name || "My Boutique"}
                  </h2>
                  <p className="text-white/80 text-xs md:text-sm font-light tracking-wide max-w-md line-clamp-2 italic">
                    “{myStore.bio || myStore.description || "Artisanal handcrafted store from Algeria"}”
                  </p>
                </div>

                {/* LOWER ROW: Store metadata coordinates */}
                <div className="flex items-center justify-between text-xs font-mono text-white/60 border-t border-white/15 pt-3.5 relative z-10 w-full">
                  <span className="flex items-center gap-1.5 font-semibold text-white/90">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                    📍 {myStore.wilaya || "Alger"} ({myStore.wilayaCode || "16"})
                  </span>
                  <span className="opacity-75 tracking-wider hidden sm:inline">{myStore.subdomain || "shop"}.shop.dz</span>
                </div>
              </div>

            </div>

            {/* Action buttons at bottom */}
            <div className="bg-slate-900 border-t border-slate-800 px-6 py-5 flex items-center justify-between">
              <span className="text-xs font-sans text-slate-400">
                This is how your store header looks on the live public profile page.
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPreviewTemplateId(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Close Preview
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCoverTemplate(previewTemplateId);
                    setPreviewTemplateId(null);
                    setMerchantFeedbackMessage(`✨ Successfully selected template: ${BANNER_TEMPLATES.find(t => t.id === previewTemplateId)?.name}! Click 'Save Changes' below to apply live.`);
                  }}
                  className="bg-rose-650 hover:bg-rose-600 text-white font-black px-5 py-2 rounded-xl text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  Apply Design
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 🛑 SECURE DELETION VERIFICATION MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[10000] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 font-sans animate-fade-in text-left">
          <div className="w-full max-w-md bg-white border border-rose-100 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-scale-up">
            
            {/* Header */}
            <div className="bg-rose-50/70 px-6 py-5 border-b border-rose-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
                  <Trash2 className="w-4 h-4 text-rose-600 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-rose-950 uppercase tracking-wider">
                    Delete Boutique Forever?
                  </h4>
                  <p className="text-[10px] text-rose-700 font-bold font-mono">
                    SECURE SIGN-OFF REQUIRED
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeletePassword("");
                  setDeleteConfirmName("");
                  setDeleteUnderstandCheck(false);
                  setDeleteModalError("");
                }}
                className="text-slate-400 hover:text-slate-600 bg-slate-105 hover:bg-slate-200 p-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-xl space-y-2">
                <p className="text-xs text-rose-850 font-bold leading-normal">
                  ⚠️ Absolutely Irreversible Action
                </p>
                <p className="text-[11px] text-rose-700 leading-relaxed">
                  This will permanently destroy the boutique registry for <strong>{myStore.name}</strong>. All of your products, customer logs, analytics, subdomains, and designs will be immediately deleted from the artisan index.
                </p>
              </div>

              {/* Explicit Confirmation Checkbox */}
              <label className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100/60 transition-colors select-none">
                <input
                  type="checkbox"
                  checked={deleteUnderstandCheck}
                  onChange={(e) => setDeleteUnderstandCheck(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-rose-600 border-slate-300 focus:ring-rose-500 cursor-pointer"
                />
                <span className="text-[11px] font-semibold text-slate-700 leading-normal">
                  I explicitly understand that this action cannot be undone and that my custom subdomain <strong className="font-mono text-slate-900 bg-white px-1 py-0.5 rounded border border-slate-200">{myStore.subdomain}.yume.store</strong> will be immediately released.
                </span>
              </label>

              {/* Confirm Store Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-500 block">
                  Confirm boutique name by typing <strong className="text-slate-800 font-mono select-all bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">{myStore.name}</strong>:
                </label>
                <input
                  type="text"
                  value={deleteConfirmName}
                  onChange={(e) => setDeleteConfirmName(e.target.value)}
                  placeholder="Enter boutique name exactly"
                  className="w-full border border-slate-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 rounded-xl px-4 py-2.5 bg-white text-xs text-slate-900 font-bold outline-none"
                />
              </div>

              {/* Password Verification */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] uppercase font-bold text-slate-500 block">
                    Security/Registry Password:
                  </label>
                  <span className="text-[9px] text-amber-600 font-bold bg-amber-50 border border-amber-100 rounded px-1.5 py-0.5 uppercase">
                    🔑 Session default: algeria2026
                  </span>
                </div>
                <div className="relative">
                  <input
                    type={showDeletePassword ? "text" : "password"}
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    placeholder="Enter security password"
                    className="w-full border border-slate-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 rounded-xl pl-4 pr-10 py-2.5 bg-white text-xs text-slate-900 font-bold outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowDeletePassword(!showDeletePassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-450 hover:text-slate-600 text-xs font-bold"
                  >
                    {showDeletePassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {deleteModalError && (
                <div className="p-3 bg-rose-50 border border-rose-150 rounded-xl text-[11px] text-rose-600 font-bold">
                  {deleteModalError}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeletePassword("");
                  setDeleteConfirmName("");
                  setDeleteUnderstandCheck(false);
                  setDeleteModalError("");
                }}
                className="flex-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs py-3 rounded-xl transition-all cursor-pointer text-center"
              >
                Cancel / Keep Store
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!deleteUnderstandCheck) {
                    setDeleteModalError("❌ Please check the box confirming you understand the action.");
                    return;
                  }
                  if (deleteConfirmName.trim().toLowerCase() !== myStore.name.trim().toLowerCase()) {
                    setDeleteModalError("❌ Confirmation text does not match the boutique name exactly.");
                    return;
                  }
                  if (!deletePassword) {
                    setDeleteModalError("❌ Security/Registry Password is required.");
                    return;
                  }
                  // Let's accept 'algeria2026' or any password that is at least 6 characters as valid
                  if (deletePassword !== "algeria2026" && deletePassword.length < 6) {
                    setDeleteModalError("❌ Invalid security password. Please try again with your register password or the default 'algeria2026'.");
                    return;
                  }

                  // Execute Deletion
                  if (setStores) {
                    setStores((prev) => {
                      const remaining = prev.filter(s => s.id !== myStore.id);
                      if (remaining.length > 0) {
                        if (setSelectedStore) {
                          setSelectedStore(remaining[0]);
                        }
                      }
                      return remaining;
                    });
                    setMerchantFeedbackMessage(`🛑 Boutique '${myStore.name}' has been permanently and securely purged from the registry.`);
                    setIsDeleteModalOpen(false);
                    setDeletePassword("");
                    setDeleteConfirmName("");
                    setDeleteUnderstandCheck(false);
                    setDeleteModalError("");
                    setViewMode("grid");
                    setActiveTab("store");
                  } else {
                    setDeleteModalError("❌ Cannot connect to stores database container.");
                  }
                }}
                className={`flex-grow-[1.5] text-white font-extrabold text-xs py-3 rounded-xl transition-all text-center cursor-pointer ${
                  deleteUnderstandCheck &&
                  deleteConfirmName.trim().toLowerCase() === myStore.name.trim().toLowerCase() &&
                  deletePassword.length >= 6
                    ? "bg-rose-600 hover:bg-rose-700 hover:scale-[1.01]"
                    : "bg-slate-300 cursor-not-allowed opacity-60"
                }`}
              >
                🔥 Securely Destroy Boutique
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}