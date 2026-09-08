import React, { useState, useMemo } from "react";
import {
  ShieldCheck,
  Lock,
  User,
  Package,
  Eye,
  EyeOff,
  Trash2,
  Check,
  X,
  Search,
  Plus,
  Award,
  Activity,
  TrendingUp,
  Settings,
  Layers,
  Store,
  Phone,
  Mail,
  Globe,
  LogOut,
  Key,
  Megaphone,
  Percent,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Star,
  MessageSquare,
  Palette,
  Folder,
  FolderOpen,
  ArrowUp,
  ArrowDown,
  Edit2,
  AlertTriangle,
  Smartphone,
  CheckCircle,
  Zap,
  Play,
  Sliders,
  Clock,
  Camera,
  Cpu,
  Sparkles as SparklesIcon,
  Globe2,
  Scan,
  Compass
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import PlatformOwnerFeatureManagementCard from "./PlatformOwnerFeatureManagementCard";
import {
  fetchBrandsFromFirestore,
  saveBrandToFirestore,
  deleteBrandFromFirestore,
  fetchPendingModelsFromFirestore,
  processPendingModel,
  Brand,
  PendingModel
} from "../utils/brandsStore";
import { MerchantStore, Product, Order, Review, CoverTemplate, MainCategory, Subcategory, CategoryTemplateField } from "../types";
import { COMMUNICATIVE_WILAYAS } from "../data";
import {
  saveMainCategoryToFirestore,
  saveSubcategoryToFirestore,
  deleteMainCategoryFromFirestore,
  deleteSubcategoryFromFirestore,
  saveReorderedCategoriesToFirestore,
  saveReorderedSubcategoriesToFirestore
} from "../utils/categoriesStore";

interface PlatformAdminWorkspaceProps {
  stores: MerchantStore[];
  setStores: React.Dispatch<React.SetStateAction<MerchantStore[]>>;
  orders: Order[];
  platformCommission: number;
  setPlatformCommission: (comm: number) => void;
  globalAnnouncement: string;
  setGlobalAnnouncement: (ann: string) => void;
  adminUsername: string;
  adminPassword: string;
  onUpdateCredentials: (user: string, pass: string) => boolean;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (loggedIn: boolean) => void;
  onLogout: () => void;
  currentSlideColor: string;
  darkMode: boolean;
  currentLanguage?: string;
  coverTemplates?: CoverTemplate[];
  onSaveCoverTemplates?: (tpls: CoverTemplate[]) => void;
  mainCategories: MainCategory[];
  setMainCategories: React.Dispatch<React.SetStateAction<MainCategory[]>>;
  subcategories: Subcategory[];
  setSubcategories: React.Dispatch<React.SetStateAction<Subcategory[]>>;
  globalAnimationDelay?: number;
  setGlobalAnimationDelay?: (delay: number) => void;
}

// Sub-component for elegant Product Card rendering in Admin layout
function AdminProductCard({
  product,
  storeName,
  storeId,
  handleUpdateProductStock,
  handleUpdateProductPrice,
  handleDeleteProduct,
}: {
  key?: any;
  product: Product;
  storeName: string;
  storeId: string;
  handleUpdateProductStock: (storeId: string, productId: string, nextStock: number) => void;
  handleUpdateProductPrice: (storeId: string, productId: string, nextPrice: number) => void;
  handleDeleteProduct: (storeId: string, productId: string) => void;
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Derive active slides list
  const slides = useMemo(() => {
    const list = [product.imageUrl];
    if (product.images && product.images.length > 0) {
      product.images.forEach((img) => {
        if (img && !list.includes(img)) {
          list.push(img);
        }
      });
    }

    // fallback mock slides by category for rich visualization
    if (list.length < 3) {
      if (product.category === "Food") {
        list.push(
          "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80"
        );
      } else if (product.category === "Crafts") {
        list.push(
          "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80"
        );
      } else if (product.category === "Fashion") {
        list.push(
          "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&auto=format&fit=crop&q=80"
        );
      } else {
        list.push(
          "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=80"
        );
      }
    }
    return list.slice(0, 5);
  }, [product]);

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const ratingVal = product.rating || 4.8;
  const reviewsCount = product.reviews?.length || 4;

  return (
    <div
      className="flex flex-col gap-2 relative bg-transparent border-0 p-0 select-none group/card text-left transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Aspect-Ratio Box containing Image Slideshow / Buttons */}
      <div className="aspect-square w-full rounded-[16px] overflow-hidden bg-stone-100 dark:bg-slate-900 relative shadow-sm border border-stone-150/40 dark:border-slate-800/60 group/img">
        <div className="w-full h-full relative">
          <img
            src={slides[currentSlide]}
            alt={product.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover select-none transition-all duration-500 scale-100 group-hover/card:scale-103"
          />

          {/* Solid Choice Brand Label Badge */}
          <div className="absolute top-3 left-3 bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white font-black text-[9px] px-2 py-0.5 rounded-full shadow-2xs uppercase tracking-wider font-mono select-none">
            ✨ Choice
          </div>

          {/* Quick Category indicator top right */}
          <div className="absolute top-3 right-3 bg-slate-900/90 text-white font-bold text-[9px] px-2.5 py-0.5 rounded-full shadow-xxs font-sans">
            {product.category}
          </div>
        </div>

        {/* Dynamic Chevron Left / Right Carousel Controls */}
        <AnimatePresence>
          {isHovered && slides.length > 1 && (
            <>
              {/* Left Arrow Button */}
              <button
                type="button"
                onClick={prevSlide}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white hover:bg-slate-100 flex items-center justify-center text-slate-800 shadow-[0_4px_10px_rgba(0,0,0,0.15)] hover:scale-105 active:scale-95 transition-all z-10 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.5px]" />
              </button>

              {/* Right Arrow Button */}
              <button
                type="button"
                onClick={nextSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white hover:bg-slate-100 flex items-center justify-center text-slate-800 shadow-[0_4px_10px_rgba(0,0,0,0.15)] hover:scale-105 active:scale-95 transition-all z-10 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 stroke-[2.5px]" />
              </button>
            </>
          )}
        </AnimatePresence>

        {/* Small Progress Dots Bottom Carousel Center overlay */}
        {slides.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 select-none">
            {slides.map((_, idx) => (
              <div
                key={idx}
                className={`rounded-full transition-all duration-300 ${
                  idx === currentSlide
                    ? "bg-white w-2 h-2 scale-110"
                    : "bg-white/50 w-1.5 h-1.5"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Description Meta Section Block below the image */}
      <div className="flex flex-col text-left font-sans mt-0.5">
        {/* Row 1: Title & Inline Rating */}
        <div className="flex justify-between items-start gap-1">
          <h5 className="text-[14.5px] font-bold text-slate-900 dark:text-white line-clamp-1 flex-1 leading-snug">
            {product.name}
          </h5>
          <div className="flex items-center gap-1 text-[13px] font-medium text-slate-800 dark:text-slate-200 shrink-0">
            <Star className="w-3.5 h-3.5 text-slate-900 fill-slate-900 dark:text-amber-400 dark:fill-amber-400" />
            <span>{ratingVal.toFixed(1)}</span>
            <span className="text-stone-400">({reviewsCount})</span>
          </div>
        </div>

        {/* Row 2: Origin boutique / store info */}
        <div className="text-[13px] text-stone-500 dark:text-slate-400 font-medium line-clamp-1 leading-normal">
          Boutique: {storeName}
        </div>

        {/* Row 3: Delivery Window & Stock Indicators */}
        <div className="text-[13px] text-stone-500 dark:text-slate-400 leading-normal flex items-center justify-between">
          <span>Standard Choice delivery</span>
          {product.stock <= 3 && product.stock > 0 ? (
            <span className="text-rose-600 font-black text-xs animate-pulse">Low stock: {product.stock}!</span>
          ) : product.stock === 0 ? (
            <span className="text-rose-600 font-extrabold bg-rose-50 dark:bg-rose-950/20 px-1 py-0.5 rounded text-[10px]">SOLDOUT</span>
          ) : (
            <span className="text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded text-[10px]">{product.stock} in stock</span>
          )}
        </div>

        {/* Row 4: Stock Incrementor adjusters */}
        <div className="flex justify-between items-center text-xs text-stone-500 dark:text-slate-400 py-1.5 border-b border-stone-100 dark:border-slate-800/50 mt-1 mb-1.5">
          <span className="font-semibold text-slate-600 dark:text-slate-300">Set Stock Count:</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleUpdateProductStock(storeId, product.id, (product.stock || 0) * 1 - 1)}
              className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer border border-stone-250 dark:border-slate-700"
              title="Minus stock"
            >
              -
            </button>
            <span className="text-xs font-mono font-black w-6 text-center text-slate-900 dark:text-white">
              {product.stock || 0}
            </span>
            <button
              type="button"
              onClick={() => handleUpdateProductStock(storeId, product.id, (product.stock || 0) * 1 + 1)}
              className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer border border-stone-250 dark:border-slate-700"
              title="Add stock"
            >
              +
            </button>
          </div>
        </div>

        {/* Row 4b: Price Adjuster */}
        <div className="flex justify-between items-center text-xs text-stone-500 dark:text-slate-400 pb-1.5 border-b border-stone-100 dark:border-slate-800/50 mb-1.5">
          <span className="font-semibold text-slate-600 dark:text-slate-300">Adjust Price (DA):</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleUpdateProductPrice(storeId, product.id, Math.max(0, product.price - 50))}
              className="w-7 h-5 rounded-md flex items-center justify-center text-[10px] font-black bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer border border-stone-250 dark:border-slate-700"
              title="Minus 50 DA"
            >
              -50
            </button>
            <input
              type="number"
              value={product.price || 0}
              onChange={(e) => handleUpdateProductPrice(storeId, product.id, Math.max(0, Number(e.target.value)))}
              className="text-xs font-mono font-black w-16 text-center bg-stone-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-stone-200 dark:border-slate-800 rounded py-0.5 outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={() => handleUpdateProductPrice(storeId, product.id, product.price + 50)}
              className="w-7 h-5 rounded-md flex items-center justify-center text-[10px] font-black bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer border border-stone-250 dark:border-slate-700"
              title="Plus 50 DA"
            >
              +50
            </button>
          </div>
        </div>

        {/* Row 5: Pricing details and action buttons */}
        <div className="flex items-center justify-between pt-0.5">
          <div>
            <span className="font-extrabold text-[#222222] dark:text-white text-[15.5px]">
              {product.price.toLocaleString()} DA
            </span>
            <span className="text-stone-500 dark:text-slate-400 font-medium font-sans text-xs"> total</span>
          </div>

          <button
            type="button"
            onClick={() => handleDeleteProduct(storeId, product.id)}
            className="px-2.5 py-1.5 rounded-lg text-rose-600 dark:text-rose-400 bg-rose-50 hover:bg-rose-500 hover:text-white dark:bg-rose-950/20 dark:hover:bg-rose-500 dark:hover:text-white text-[11px] font-extrabold flex items-center gap-1 transition-all cursor-pointer border border-rose-100 dark:border-rose-900/40"
            title="Surgical asset deletion moderated"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Moderate</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PlatformAdminWorkspace({
  stores,
  setStores,
  orders,
  platformCommission,
  setPlatformCommission,
  globalAnnouncement,
  setGlobalAnnouncement,
  adminUsername,
  adminPassword,
  onUpdateCredentials,
  isAdminLoggedIn,
  setIsAdminLoggedIn,
  onLogout,
  currentSlideColor,
  darkMode,
  currentLanguage = "en",
  coverTemplates = [],
  onSaveCoverTemplates,
  mainCategories,
  setMainCategories,
  subcategories,
  setSubcategories,
  globalAnimationDelay = 0.5,
  setGlobalAnimationDelay,
}: PlatformAdminWorkspaceProps) {
  const [testPulse, setTestPulse] = useState(false);
  // Local admin translation helper
  const t = (key: string) => {
    const dicts: Record<string, Record<string, string>> = {
      en: {
        adminTitle: "Enterprise Platform Controller",
        adminRole: "System Administrator",
        authorizedProfile: "Authorized Profile:",
        logout: "Logout",
        platformOverview: "Platform Overview",
        storesRegistry: "Stores Registry ({count})",
        catalogModeration: "Catalog Moderation ({count})",
        reviewsManagement: "Reviews Management ({count})",
        globalSettings: "Global Settings",
      },
      fr: {
        adminTitle: "Espace d'Administration Plateforme",
        adminRole: "Administrateur Système",
        authorizedProfile: "Profil Autorisé :",
        logout: "Déconnexion",
        platformOverview: "Aperçu de la Plateforme",
        storesRegistry: "Registre des Boutiques ({count})",
        catalogModeration: "Modération du Catalogue ({count})",
        reviewsManagement: "Gestion des Avis ({count})",
        globalSettings: "Configuration Globale",
      },
      ar: {
        adminTitle: "لوحة التحكم وإدارة منصة شوبيفاي الجزائري",
        adminRole: "مشرف النظام",
        authorizedProfile: "الملف الشخصي المرخص:",
        logout: "تسجيل الخروج",
        platformOverview: "الملخص العام للمنصة",
        storesRegistry: "سجل المتاجر ({count})",
        catalogModeration: "إدارة ومراقبة المنتجات ({count})",
        reviewsManagement: "المراجعات والتقييمات ({count})",
        globalSettings: "الإعدادات العامة والعمولات",
      }
    };
    const lang = currentLanguage === "ar" || currentLanguage === "fr" || currentLanguage === "en" ? currentLanguage : "en";
    return dicts[lang][key] || key;
  };

  // Local admin tab
  const [adminTab, setAdminTab] = useState<"overview" | "stores" | "products" | "settings" | "reviews" | "categories" | "brands">("overview");

  // Feature Toggles state (Visual Search & Geo Location)
  const [visualSearchEnabled, setVisualSearchEnabled] = useState<boolean>(() => {
    return localStorage.getItem("dz_admin_visual_search_enabled") !== "false";
  });
  const [geoLocationEnabled, setGeoLocationEnabled] = useState<boolean>(() => {
    return localStorage.getItem("dz_admin_geo_location_enabled") !== "false";
  });

  const toggleVisualSearch = (val: boolean) => {
    setVisualSearchEnabled(val);
    localStorage.setItem("dz_admin_visual_search_enabled", val ? "true" : "false");
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new CustomEvent("dz_visual_search_toggle", { detail: { enabled: val } }));
  };

  const toggleGeoLocation = (val: boolean) => {
    setGeoLocationEnabled(val);
    localStorage.setItem("dz_admin_geo_location_enabled", val ? "true" : "false");
    window.dispatchEvent(new Event("storage"));
  };

  // Yumi Orders Module Governance state
  const [globalOrdersMode, setGlobalOrdersMode] = useState<"both" | "classic" | "advanced">(
    () => (localStorage.getItem("yumi_admin_global_orders_mode") as "both" | "classic" | "advanced") || "both"
  );

  const [planOrdersMode, setPlanOrdersMode] = useState<Record<string, "both" | "classic" | "advanced">>(() => {
    try {
      const saved = localStorage.getItem("yumi_admin_plan_orders_mode");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return { Basic: "classic", Pro: "both", "Pro Plus": "both", Premium: "both" };
  });

  const handleUpdateGlobalOrdersMode = (mode: "both" | "classic" | "advanced") => {
    setGlobalOrdersMode(mode);
    localStorage.setItem("yumi_admin_global_orders_mode", mode);
    window.dispatchEvent(new Event("storage"));
  };

  const handleUpdatePlanOrdersMode = (plan: string, mode: "both" | "classic" | "advanced") => {
    const next = { ...planOrdersMode, [plan]: mode };
    setPlanOrdersMode(next);
    localStorage.setItem("yumi_admin_plan_orders_mode", JSON.stringify(next));
    window.dispatchEvent(new Event("storage"));
  };

  // AI Models Management state (Gemini, DeepSeek, OpenAI, Kimi, and Custom Manual Models)
  const [activeAiModel, setActiveAiModel] = useState<string>(() => {
    return localStorage.getItem("dz_active_ai_model") || "Gemini 2.5 Flash";
  });

  const [customAiModels, setCustomAiModels] = useState<Array<{
    id: string;
    name: string;
    provider: string;
    baseUrl?: string;
    apiKey?: string;
    modelId?: string;
  }>>(() => {
    try {
      const saved = localStorage.getItem("dz_custom_ai_models");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      { id: "cm-1", name: "Gemini 2.5 Flash", provider: "Google GenAI", modelId: "gemini-2.5-flash" },
      { id: "cm-2", name: "DeepSeek V3", provider: "DeepSeek AI", modelId: "deepseek-v3" },
      { id: "cm-3", name: "OpenAI GPT-4o", provider: "OpenAI", modelId: "gpt-4o" },
      { id: "cm-4", name: "Kimi k1.5", provider: "Moonshot AI / Kimi", modelId: "kimi-k1.5" },
    ];
  });

  const [isAddingCustomModel, setIsAddingCustomModel] = useState(false);
  const [newModelName, setNewModelName] = useState("");
  const [newModelProvider, setNewModelProvider] = useState("Custom Provider");
  const [newModelBaseUrl, setNewModelBaseUrl] = useState("");
  const [newModelApiKey, setNewModelApiKey] = useState("");
  const [newModelId, setNewModelId] = useState("");

  const handleSelectActiveModel = (modelName: string) => {
    setActiveAiModel(modelName);
    localStorage.setItem("dz_active_ai_model", modelName);
    window.dispatchEvent(new Event("storage"));
  };

  const handleAddCustomModel = () => {
    if (!newModelName.trim()) return;
    const modelItem = {
      id: "cm-" + Date.now(),
      name: newModelName.trim(),
      provider: newModelProvider.trim() || "Custom Provider",
      baseUrl: newModelBaseUrl.trim(),
      apiKey: newModelApiKey.trim(),
      modelId: newModelId.trim() || newModelName.toLowerCase().replace(/\s+/g, "-")
    };

    const updated = [...customAiModels, modelItem];
    setCustomAiModels(updated);
    localStorage.setItem("dz_custom_ai_models", JSON.stringify(updated));
    setActiveAiModel(modelItem.name);
    localStorage.setItem("dz_active_ai_model", modelItem.name);
    window.dispatchEvent(new Event("storage"));

    setNewModelName("");
    setNewModelProvider("Custom Provider");
    setNewModelBaseUrl("");
    setNewModelApiKey("");
    setNewModelId("");
    setIsAddingCustomModel(false);
  };

  const handleDeleteCustomModel = (id: string) => {
    const updated = customAiModels.filter(m => m.id !== id);
    setCustomAiModels(updated);
    localStorage.setItem("dz_custom_ai_models", JSON.stringify(updated));
    if (activeAiModel === customAiModels.find(m => m.id === id)?.name) {
      const fallback = updated[0]?.name || "Gemini 2.5 Flash";
      setActiveAiModel(fallback);
      localStorage.setItem("dz_active_ai_model", fallback);
    }
    window.dispatchEvent(new Event("storage"));
  };

  // Brands & Models Management states
  const [brands, setBrands] = useState<Brand[]>([]);
  const [pendingModels, setPendingModels] = useState<PendingModel[]>([]);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [showAddBrand, setShowAddBrand] = useState(false);
  const [brandForm, setBrandForm] = useState({
    id: "",
    name: "",
    category: "electronics_devices",
    modelsString: ""
  });

  const loadBrandsAndPending = async () => {
    try {
      const brandsData = await fetchBrandsFromFirestore();
      setBrands(brandsData);
      const pendingData = await fetchPendingModelsFromFirestore();
      setPendingModels(pendingData);
    } catch (err) {
      console.error("Error loading brands and pending models: ", err);
    }
  };

  React.useEffect(() => {
    loadBrandsAndPending();
  }, [adminTab]);

  // Login inputs
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Search & Filter state
  const [storeQuery, setStoreQuery] = useState("");
  const [productQuery, setProductQuery] = useState("");

  // Edit Store states
  const [editingStoreId, setEditingStoreId] = useState<string | null>(null);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [templateForm, setTemplateForm] = useState({
    id: "",
    name: "",
    description: "",
    badgeText: "",
  });
  const [isAddingTemplate, setIsAddingTemplate] = useState(false);

  // Dynamic Category & Subcategory management states
  const [selectedMainCategoryId, setSelectedMainCategoryId] = useState<string>("");
  const [showAddMainCategory, setShowAddMainCategory] = useState(false);
  const [editingMainCategory, setEditingMainCategory] = useState<MainCategory | null>(null);
  const [mainCategoryForm, setMainCategoryForm] = useState({
    id: "",
    names: { en: "", ar: "", fr: "" },
    icon: "Shirt",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80",
  });

  const [showAddSubcategory, setShowAddSubcategory] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
  const [subcategoryForm, setSubcategoryForm] = useState<{
    id: string;
    names: { en: string; ar: string; fr: string };
    icon: string;
    image: string;
    sizeSystemEnabled: boolean;
    sizeSystemLabel: string;
    sizeSystemSizes: string;
    recommendedMaterials: string;
    fields: CategoryTemplateField[];
  }>({
    id: "",
    names: { en: "", ar: "", fr: "" },
    icon: "Folder",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=80",
    sizeSystemEnabled: false,
    sizeSystemLabel: "Sizes",
    sizeSystemSizes: "",
    recommendedMaterials: "",
    fields: [],
  });

  const [newSpecField, setNewSpecField] = useState({
    name: "",
    type: "text" as "text" | "number" | "boolean" | "select",
    required: false,
    options: "",
    unit: "",
    placeholder: "",
  });

  const [categoriesTab, setCategoriesTab] = useState<"main" | "sub">("main");
  const [mainCatSearch, setMainCatSearch] = useState("");
  const [subCatSearch, setSubCatSearch] = useState("");
  const [subCatDeptFilter, setSubCatDeptFilter] = useState<string>("all");

  // Category sorting states
  const [catSortField, setCatSortField] = useState<"name" | "date" | null>(null);
  const [catSortOrder, setCatSortOrder] = useState<"asc" | "desc">("asc");

  const getCategoryCreatedAt = (cat: MainCategory | Subcategory) => {
    if (cat.createdAt) return cat.createdAt;
    // Map stable mock dates for default categories to make sorting obvious and deterministic
    const stableDates: Record<string, string> = {
      fashion: "2026-07-01T10:00:00Z",
      kids: "2026-07-02T10:00:00Z",
      health_beauty: "2026-07-03T10:00:00Z",
      electronics: "2026-07-04T10:00:00Z",
      home_living: "2026-07-05T10:00:00Z",
      sports_toys: "2026-07-06T10:00:00Z",
      arts_crafts: "2026-07-07T10:00:00Z",
      food_beverages: "2026-07-08T10:00:00Z",
      automotive_tools: "2026-07-09T10:00:00Z",
      
      fashion_all: "2026-07-01T11:00:00Z",
      fashion_clothing: "2026-07-01T12:00:00Z",
      fashion_shoes: "2026-07-01T13:00:00Z",
      fashion_bags: "2026-07-01T14:00:00Z",
      fashion_jewelry: "2026-07-01T15:00:00Z",
      fashion_watches: "2026-07-01T16:00:00Z",
      fashion_hats_caps: "2026-07-01T17:00:00Z",
      
      kids_clothing: "2026-07-02T11:00:00Z",
      kids_shoes: "2026-07-02T12:00:00Z",
      kids_accessories: "2026-07-02T13:00:00Z",
      kids_toys: "2026-07-02T14:00:00Z",
      kids_baby_essentials: "2026-07-02T15:00:00Z",
    };
    return stableDates[cat.id] || "2026-07-10T10:00:00Z";
  };

  const handleCatSort = (field: "name" | "date") => {
    if (catSortField === field) {
      setCatSortOrder(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setCatSortField(field);
      setCatSortOrder("asc");
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  React.useEffect(() => {
    if (!selectedMainCategoryId && mainCategories.length > 0) {
      setSelectedMainCategoryId(mainCategories[0].id);
    }
  }, [mainCategories, selectedMainCategoryId]);

  // Safe delete policy states
  const [safeDeleteMainCategory, setSafeDeleteMainCategory] = useState<MainCategory | null>(null);
  const [safeDeleteSubcategory, setSafeDeleteSubcategory] = useState<Subcategory | null>(null);
  const [safeDeleteAction, setSafeDeleteAction] = useState<"archive" | "move">("archive");
  const [safeDeleteTargetId, setSafeDeleteTargetId] = useState<string>("");
  const [editStoreForm, setEditStoreForm] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    subdomain: "",
    wilaya: "Algiers",
    ordersMode: "both" as "both" | "classic" | "advanced",
  });

  // Create Store states
  const [showCreateStore, setShowCreateStore] = useState(false);
  const [newStoreForm, setNewStoreForm] = useState({
    name: "",
    subdomain: "",
    wilaya: "Algiers",
    address: "",
    phone: "",
    email: "",
    description: "",
  });

  // Settings Credentials editor states
  const [newAdminUser, setNewAdminUser] = useState("");
  const [newAdminPass, setNewAdminPass] = useState("");
  const [settingsFeedback, setSettingsFeedback] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUser || !loginPass) {
      setErrorMsg("Please enter both username and password.");
      return;
    }

    if (loginUser === adminUsername && loginPass === adminPassword) {
      try {
        localStorage.setItem("is_dz_admin_logged_in", "true");
      } catch (err) {}
      setIsAdminLoggedIn(true);
      setErrorMsg("");
    } else {
      setErrorMsg("Incorrect admin username or password. Please verify.");
    }
  };

  const handleDeleteStore = (storeId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to completely remove this store and all its products from the platform?");
    if (confirmDelete) {
      setStores((prev) => prev.filter((s) => s.id !== storeId));
    }
  };

  const handleToggleVerify = (storeId: string) => {
    setStores((prev) =>
      prev.map((s) => (s.id === storeId ? { ...s, verified: !s.verified } : s))
    );
  };

  const handleTogglePremiumTier = (storeId: string, tier: "Starter" | "Growth" | "Pro") => {
    setStores((prev) =>
      prev.map((s) => (s.id === storeId ? { ...s, premiumTier: tier } : s))
    );
  };

  const startEditingStore = (store: MerchantStore) => {
    setEditingStoreId(store.id);
    setEditStoreForm({
      name: store.name,
      description: store.description,
      address: store.address,
      phone: store.contact.phone || "",
      email: store.contact.email || "",
      subdomain: store.subdomain.replace(".platform.dz", ""),
      wilaya: store.wilaya,
      ordersMode: store.ordersMode || "both",
    });
  };

  const handleSaveStoreChanges = (storeId: string) => {
    if (!editStoreForm.name || !editStoreForm.subdomain) {
      alert("Name and subdomain are required.");
      return;
    }

    setStores((prev) =>
      prev.map((s) => {
        if (s.id === storeId) {
          return {
            ...s,
            name: editStoreForm.name,
            description: editStoreForm.description,
            address: editStoreForm.address,
            wilaya: editStoreForm.wilaya,
            ordersMode: editStoreForm.ordersMode,
            subdomain: `${editStoreForm.subdomain.toLowerCase().replace(/\s+/g, "")}.platform.dz`,
            contact: {
              ...s.contact,
              phone: editStoreForm.phone,
              email: editStoreForm.email,
            },
          };
        }
        return s;
      })
    );
    setEditingStoreId(null);
  };

  const handleNewStoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoreForm.name || !newStoreForm.subdomain) {
      alert("Store Name and Subdomain are required.");
      return;
    }

    const newSlug = newStoreForm.subdomain.toLowerCase().replace(/\s+/g, "");
    if (stores.some((s) => s.slug === newSlug)) {
      alert("Subdomain slug already exists. Please choose a different subdomain.");
      return;
    }

    const newStore: MerchantStore = {
      id: `store_admin_${Date.now()}`,
      name: newStoreForm.name,
      slug: newSlug,
      subdomain: `${newSlug}.platform.dz`,
      logo: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=150&auto=format&fit=crop&q=80",
      banner: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80",
      description: newStoreForm.description || "Premium merchant registered by primary administrator.",
      bio: `Official certified partner merchant delivering high quality products in ${newStoreForm.wilaya}.`,
      wilaya: newStoreForm.wilaya,
      wilayaCode: "16",
      address: newStoreForm.address || `Algiers Center, Algeria`,
      coordinates: {
        lat: 36.7525 + (Math.random() - 0.5) * 0.1,
        lng: 3.0420 + (Math.random() - 0.5) * 0.1,
      },
      rating: 5.0,
      categories: ["Crafts", "Food"],
      verified: true,
      premiumTier: "Pro",
      contact: {
        phone: newStoreForm.phone || "+213 555 12 34 56",
        email: newStoreForm.email || `${newSlug}@platform.dz`,
      },
      products: [],
      reviews: [],
    };

    setStores((prev) => [...prev, newStore]);
    setNewStoreForm({
      name: "",
      subdomain: "",
      wilaya: "Algiers",
      address: "",
      phone: "",
      email: "",
      description: "",
    });
    setShowCreateStore(false);
  };

  const handleDeleteProduct = (storeId: string, productId: string) => {
    const confirmation = window.confirm("Are you sure you want to moderate (delete) this product?");
    if (confirmation) {
      setStores((prev) =>
        prev.map((store) => {
          if (store.id === storeId) {
            return {
              ...store,
              products: store.products.filter((p) => p.id !== productId),
            };
          }
          return store;
        })
      );
    }
  };

  const handleUpdateProductStock = (storeId: string, productId: string, nextStock: number) => {
    if (nextStock < 0) return;
    setStores((prev) =>
      prev.map((store) => {
        if (store.id === storeId) {
          return {
            ...store,
            products: store.products.map((p) => (p.id === productId ? { ...p, stock: nextStock } : p)),
          };
        }
        return store;
      })
    );
  };

  const handleUpdateProductPrice = (storeId: string, productId: string, nextPrice: number) => {
    if (nextPrice < 0) return;
    setStores((prev) =>
      prev.map((store) => {
        if (store.id === storeId) {
          return {
            ...store,
            products: store.products.map((p) => (p.id === productId ? { ...p, price: nextPrice } : p)),
          };
        }
        return store;
      })
    );
  };

  const handleUpdateAdminPass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminUser || !newAdminPass) {
      setSettingsFeedback("Both fields are required.");
      return;
    }

    const success = onUpdateCredentials(newAdminUser, newAdminPass);
    if (success) {
      setSettingsFeedback("Credentials updated successfully! Use these for next logins.");
      setNewAdminUser("");
      setNewAdminPass("");
      setTimeout(() => setSettingsFeedback(""), 4000);
    } else {
      setSettingsFeedback("Save failed. Try different values.");
    }
  };

  const totalStores = stores.length;
  const totalProducts = useMemo(() => {
    return stores.reduce((acc, s) => acc + (s.products?.length || 0), 0);
  }, [stores]);

  const totalSales = useMemo(() => {
    return orders.reduce((acc, o) => acc + o.total, 0);
  }, [orders]);

  const estimatedProfit = useMemo(() => {
    return (totalSales * platformCommission) / 100;
  }, [totalSales, platformCommission]);

  const orderDistributionByStatus = useMemo(() => {
    const counts = { pending: 0, accepted: 0, shipped: 0, delivered: 0 };
    orders.forEach((o) => {
      if (o.status in counts) {
        counts[o.status as keyof typeof counts]++;
      }
    });
    return counts;
  }, [orders]);

  const filteredStores = stores.filter((s) => {
    const q = storeQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.subdomain.toLowerCase().includes(q) ||
      s.wilaya.toLowerCase().includes(q)
    );
  });

  const allProducts = useMemo(() => {
    const list: { product: Product; storeName: string; storeId: string }[] = [];
    stores.forEach((s) => {
      if (s.products) {
        s.products.forEach((p) => {
          list.push({ product: p, storeName: s.name, storeId: s.id });
        });
      }
    });
    return list;
  }, [stores]);

  const filteredProducts = allProducts.filter((p) => {
    const q = productQuery.toLowerCase();
    return (
      p.product.name.toLowerCase().includes(q) ||
      p.product.category.toLowerCase().includes(q) ||
      p.storeName.toLowerCase().includes(q)
    );
  });

  // Centrally view and moderate reviews from all stores
  interface AggregatedReview {
    review: Review;
    type: "store" | "product";
    storeId: string;
    storeName: string;
    productId?: string;
    productName?: string;
  }

  // Sentiment, Rating, Store, Type filters
  const [reviewsSearch, setReviewsSearch] = useState("");
  const [reviewsSentimentFilter, setReviewsSentimentFilter] = useState<"all" | "positive" | "neutral" | "negative">("all");
  const [reviewsRatingFilter, setReviewsRatingFilter] = useState<number | "all">("all");
  const [reviewsTypeFilter, setReviewsTypeFilter] = useState<"all" | "store" | "product">("all");
  const [reviewsStoreFilter, setReviewsStoreFilter] = useState<string>("all");
  const [reviewsSortOrder, setReviewsSortOrder] = useState<"newest" | "oldest" | "highest" | "lowest">("newest");

  // Inline replies or inline edits
  const [replyingReviewId, setReplyingReviewId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editReviewForm, setEditReviewForm] = useState({
    comment: "",
    rating: 5,
    sentiment: "positive" as "positive" | "neutral" | "negative",
  });

  const allReviews = useMemo(() => {
    const list: AggregatedReview[] = [];
    stores.forEach((store) => {
      // 1. Store level reviews
      if (store.reviews) {
        store.reviews.forEach((rev) => {
          list.push({
            review: rev,
            type: "store",
            storeId: store.id,
            storeName: store.name,
          });
        });
      }
      // 2. Product level reviews
      if (store.products) {
        store.products.forEach((prod) => {
          if (prod.reviews) {
            prod.reviews.forEach((rev) => {
              list.push({
                review: rev,
                type: "product",
                storeId: store.id,
                storeName: store.name,
                productId: prod.id,
                productName: prod.name,
              });
            });
          }
        });
      }
    });

    // Sort by date or id or descending order to see newest first
    return list.sort((a, b) => {
      const dateA = new Date(a.review.date).getTime() || 0;
      const dateB = new Date(b.review.date).getTime() || 0;
      return dateB - dateA;
    });
  }, [stores]);

  const filteredReviews = useMemo(() => {
    const list = allReviews.filter((item) => {
      // Search matches author, store, comment, or product
      const searchLower = reviewsSearch.toLowerCase();
      const matchesSearch =
        item.review.author.toLowerCase().includes(searchLower) ||
        item.review.comment.toLowerCase().includes(searchLower) ||
        item.storeName.toLowerCase().includes(searchLower) ||
        (item.productName && item.productName.toLowerCase().includes(searchLower));

      const matchesSentiment = reviewsSentimentFilter === "all" || item.review.sentiment === reviewsSentimentFilter;
      const matchesRating = reviewsRatingFilter === "all" || Math.floor(item.review.rating) === reviewsRatingFilter;
      const matchesType = reviewsTypeFilter === "all" || item.type === reviewsTypeFilter;
      const matchesStore = reviewsStoreFilter === "all" || item.storeId === reviewsStoreFilter;

      return matchesSearch && matchesSentiment && matchesRating && matchesType && matchesStore;
    });

    return [...list].sort((a, b) => {
      if (reviewsSortOrder === "newest") {
        const dateA = new Date(a.review.date).getTime() || 0;
        const dateB = new Date(b.review.date).getTime() || 0;
        return dateB - dateA;
      }
      if (reviewsSortOrder === "oldest") {
        const dateA = new Date(a.review.date).getTime() || 0;
        const dateB = new Date(b.review.date).getTime() || 0;
        return dateA - dateB;
      }
      if (reviewsSortOrder === "highest") {
        return b.review.rating - a.review.rating;
      }
      if (reviewsSortOrder === "lowest") {
        return a.review.rating - b.review.rating;
      }
      return 0;
    });
  }, [allReviews, reviewsSearch, reviewsSentimentFilter, reviewsRatingFilter, reviewsTypeFilter, reviewsStoreFilter, reviewsSortOrder]);

  const handleDeleteReview = (agg: AggregatedReview) => {
    const confirmDelete = window.confirm("Are you sure you want to moderate & permanently delete this review from the platform?");
    if (!confirmDelete) return;

    setStores((prev) =>
      prev.map((store) => {
        if (store.id !== agg.storeId) return store;

        if (agg.type === "store") {
          return {
            ...store,
            reviews: store.reviews.filter((r) => r.id !== agg.review.id),
          };
        } else if (agg.type === "product" && agg.productId) {
          return {
            ...store,
            products: store.products.map((prod) => {
              if (prod.id !== agg.productId) return prod;
              return {
                ...prod,
                reviews: prod.reviews.filter((r) => r.id !== agg.review.id),
              };
            }),
          };
        }
        return store;
      })
    );
  };

  const startReplyingReview = (agg: AggregatedReview) => {
    setReplyingReviewId(agg.review.id);
    setReplyText(agg.review.reply || "");
  };

  const handleSaveReply = (agg: AggregatedReview) => {
    setStores((prev) =>
      prev.map((store) => {
        if (store.id !== agg.storeId) return store;

        if (agg.type === "store") {
          return {
            ...store,
            reviews: store.reviews.map((r) =>
              r.id === agg.review.id ? { ...r, reply: replyText.trim() || undefined } : r
            ),
          };
        } else if (agg.type === "product" && agg.productId) {
          return {
            ...store,
            products: store.products.map((prod) => {
              if (prod.id !== agg.productId) return prod;
              return {
                ...prod,
                reviews: prod.reviews.map((r) =>
                  r.id === agg.review.id ? { ...r, reply: replyText.trim() || undefined } : r
                ),
              };
            }),
          };
        }
        return store;
      })
    );
    setReplyingReviewId(null);
    setReplyText("");
  };

  const startEditingReview = (agg: AggregatedReview) => {
    setEditingReviewId(agg.review.id);
    setEditReviewForm({
      comment: agg.review.comment,
      rating: agg.review.rating,
      sentiment: agg.review.sentiment || "positive",
    });
  };

  const handleSaveEdit = (agg: AggregatedReview) => {
    if (!editReviewForm.comment.trim()) {
      alert("Review comment cannot be empty.");
      return;
    }

    setStores((prev) =>
      prev.map((store) => {
        if (store.id !== agg.storeId) return store;

        if (agg.type === "store") {
          return {
            ...store,
            reviews: store.reviews.map((r) =>
              r.id === agg.review.id
                ? { ...r, comment: editReviewForm.comment.trim(), rating: editReviewForm.rating, sentiment: editReviewForm.sentiment }
                : r
            ),
          };
        } else if (agg.type === "product" && agg.productId) {
          return {
            ...store,
            products: store.products.map((prod) => {
              if (prod.id !== agg.productId) return prod;
              return {
                ...prod,
                reviews: prod.reviews.map((r) =>
                  r.id === agg.review.id
                    ? { ...r, comment: editReviewForm.comment.trim(), rating: editReviewForm.rating, sentiment: editReviewForm.sentiment }
                    : r
                ),
              };
            }),
          };
        }
        return store;
      })
    );
    setEditingReviewId(null);
  };

  // Render Login Card if not logged in
  if (!isAdminLoggedIn) {
    return (
      <div className="flex-1 flex items-center justify-center py-16 px-4 font-sans leading-normal">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-stone-150/40 dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.08)] overflow-hidden"
        >
          {/* Elegant header */}
          <div className="p-8 pb-6 bg-gradient-to-br from-rose-500/10 via-stone-500/5 to-transparent text-center border-b border-light-divider dark:border-slate-800">
            <div 
              style={{ backgroundColor: currentSlideColor || "#ff385c" }}
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto shadow-md mb-4 transition-colors duration-300"
            >
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-xl font-extrabold text-[#222222] dark:text-white tracking-tight leading-snug">
              Platform Inspector Login
            </h2>
            <p className="text-xs text-stone-500 dark:text-slate-400 mt-1.5 font-sans font-medium">
              Administrative credentials required to control Algerian multi-tenant shop environments.
            </p>
          </div>

          <form onSubmit={handleLogin} className="p-8 flex flex-col gap-5">
            {errorMsg && (
              <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 text-rose-700 dark:text-rose-400 text-xs font-bold p-3.5 rounded-xl flex items-center gap-2">
                <span>⚠️</span>
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[10px] uppercase font-black tracking-widest text-[#717171] dark:text-slate-400 font-mono">
                Admin Username
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                  placeholder="e.g. admin"
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 rounded-xl outline-none text-xs font-bold font-mono focus:border-stone-400 dark:focus:border-slate-600 transition-all text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[10px] uppercase font-black tracking-widest text-[#717171] dark:text-slate-400 font-mono">
                Admin Security Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 rounded-xl outline-none text-xs font-mono font-bold focus:border-stone-400 dark:focus:border-slate-600 transition-all text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-slate-600 dark:hover:text-white transition-all cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              style={{ backgroundColor: currentSlideColor || "#ff385c" }}
              className="w-full mt-2 py-3 text-white font-extrabold text-xs rounded-xl shadow-sm cursor-pointer transition-all hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-1.5 duration-200"
            >
              <ShieldCheck className="w-4 h-4" />
              Secure Authorization
            </button>

            <div className="border-t border-stone-100 dark:border-slate-800 pt-4 text-center">
              <span className="text-[10px] text-stone-400 dark:text-slate-500 font-bold tracking-tight">
                Default Credentials: <code className="font-bold bg-stone-50 dark:bg-slate-800 px-1 py-0.5 rounded text-rose-550 dark:text-rose-400 font-mono">admin</code> &amp; <code className="font-bold bg-stone-50 dark:bg-slate-800 px-1 py-0.5 rounded text-rose-550 dark:text-rose-400 font-mono">algeria2026</code>
              </span>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  // Dashboard content
  return (
    <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col gap-6 font-sans leading-normal text-slate-850 dark:text-slate-100 px-1 md:px-0">
      
      {/* Admin header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-stone-150/40 dark:border-slate-800/80 shadow-3xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3.5">
          <div 
            style={{ color: currentSlideColor || "#ff385c", backgroundColor: `${currentSlideColor}15` || "#ff385c15" }}
            className="w-12 h-12 rounded-2xl flex items-center justify-center border border-stone-150/50 dark:border-slate-800 shadow-xxs shrink-0"
          >
            <ShieldCheck className="w-6 h-6 animate-pulse" />
          </div>
          <div className="text-left font-sans">
            <div className="flex items-center gap-2">
              <span 
                style={{ color: currentSlideColor || "#ff385c", backgroundColor: `${currentSlideColor}15` || "#ff385c15" }}
                className="text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full font-mono"
              >
                {t("adminRole")}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <h1 className="text-lg font-extrabold text-[#222222] dark:text-white tracking-tight mt-0.5">
              {t("adminTitle")}
            </h1>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2.5 self-stretch sm:self-auto">
          <div className="bg-stone-50 dark:bg-slate-950 border border-stone-150/30 dark:border-slate-850 rounded-xl px-3 py-1.5 text-left shrink-0">
            <span className="text-[9px] uppercase font-bold text-[#717171] dark:text-slate-400 block font-mono">{t("authorizedProfile")}</span>
            <span className="text-xs font-black text-slate-800 dark:text-slate-200 font-mono">@{adminUsername}</span>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 dark:text-rose-400 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-rose-100/40 shadow-xxs shrink-0"
            title="Log out of secure admin dashboard"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">{t("logout")}</span>
          </button>
        </div>
      </div>

      {/* Admin control navigation bar */}
      <div className="flex items-center gap-1.5 border-b border-stone-150 dark:border-slate-800 overflow-x-auto pb-1 select-none">
        <button
          onClick={() => setAdminTab("overview")}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-extrabold border-b-2 transition-all cursor-pointer ${
            adminTab === "overview"
              ? "text-slate-900 dark:text-white border-slate-900 dark:border-white"
              : "border-transparent text-stone-500 dark:text-slate-400 hover:text-stone-700 dark:hover:text-white"
          }`}
          style={adminTab === "overview" && currentSlideColor ? { borderBottomColor: currentSlideColor, color: currentSlideColor } : {}}
        >
          <Activity className="w-4 h-4" />
          <span>{t("platformOverview")}</span>
        </button>
        <button
          onClick={() => setAdminTab("stores")}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-extrabold border-b-2 transition-all cursor-pointer ${
            adminTab === "stores"
              ? "text-slate-900 dark:text-white border-slate-900 dark:border-white"
              : "border-transparent text-stone-500 dark:text-slate-405 hover:text-stone-704 dark:hover:text-white"
          }`}
          style={adminTab === "stores" && currentSlideColor ? { borderBottomColor: currentSlideColor, color: currentSlideColor } : {}}
        >
          <Store className="w-4 h-4" />
          <span>{t("storesRegistry").replace("{count}", String(totalStores))}</span>
        </button>
        <button
          onClick={() => setAdminTab("products")}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-extrabold border-b-2 transition-all cursor-pointer ${
            adminTab === "products"
              ? "text-slate-900 dark:text-white border-slate-900 dark:border-white"
              : "border-transparent text-stone-500 dark:text-slate-400 hover:text-stone-700 dark:hover:text-white"
          }`}
          style={adminTab === "products" && currentSlideColor ? { borderBottomColor: currentSlideColor, color: currentSlideColor } : {}}
        >
          <Layers className="w-4 h-4" />
          <span>{t("catalogModeration").replace("{count}", String(totalProducts))}</span>
        </button>
        <button
          onClick={() => setAdminTab("reviews")}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-extrabold border-b-2 transition-all cursor-pointer ${
            adminTab === "reviews"
              ? "text-slate-900 dark:text-white border-slate-900 dark:border-white"
              : "border-transparent text-stone-500 dark:text-slate-400 hover:text-stone-700 dark:hover:text-white"
          }`}
          style={adminTab === "reviews" && currentSlideColor ? { borderBottomColor: currentSlideColor, color: currentSlideColor } : {}}
        >
          <MessageSquare className="w-4 h-4" />
          <span>{t("reviewsManagement").replace("{count}", String(allReviews.length))}</span>
        </button>
        <button
          onClick={() => setAdminTab("categories")}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-extrabold border-b-2 transition-all cursor-pointer ${
            adminTab === "categories"
              ? "text-slate-900 dark:text-white border-slate-900 dark:border-white"
              : "border-transparent text-stone-500 dark:text-slate-400 hover:text-stone-700 dark:hover:text-white"
          }`}
          style={adminTab === "categories" && currentSlideColor ? { borderBottomColor: currentSlideColor, color: currentSlideColor } : {}}
        >
          <Palette className="w-4 h-4" />
          <span>Categories ({mainCategories.length})</span>
        </button>
        <button
          onClick={() => setAdminTab("brands")}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-extrabold border-b-2 transition-all cursor-pointer ${
            adminTab === "brands"
              ? "text-slate-900 dark:text-white border-slate-900 dark:border-white"
              : "border-transparent text-stone-500 dark:text-slate-400 hover:text-stone-700 dark:hover:text-white"
          }`}
          style={adminTab === "brands" && currentSlideColor ? { borderBottomColor: currentSlideColor, color: currentSlideColor } : {}}
        >
          <Smartphone className="w-4 h-4" />
          <span>Brands &amp; Models</span>
        </button>
        <button
          onClick={() => setAdminTab("settings")}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-extrabold border-b-2 transition-all cursor-pointer ${
            adminTab === "settings"
              ? "text-slate-900 dark:text-white border-slate-900 dark:border-white"
              : "border-transparent text-stone-500 dark:text-slate-400 hover:text-stone-700 dark:hover:text-white"
          }`}
          style={adminTab === "settings" && currentSlideColor ? { borderBottomColor: currentSlideColor, color: currentSlideColor } : {}}
        >
          <Settings className="w-4 h-4" />
          <span>{t("globalSettings")}</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="w-full">
        {adminTab === "overview" && (
          <div className="flex flex-col gap-6">
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div 
                onClick={() => setAdminTab("stores")}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-stone-150/40 dark:border-slate-800 shadow-3xs text-left cursor-pointer hover:border-stone-300 dark:hover:border-slate-700 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#717171] dark:text-slate-400 font-mono">Registered Stores</span>
                  <div className="p-1.5 rounded-lg bg-stone-50 dark:bg-slate-800 text-stone-700 dark:text-slate-300">
                    <Store className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-[#222222] dark:text-white mt-1.5">
                  {stores.length}
                </div>
                <span className="text-[9.5px] text-emerald-600 font-bold block mt-1">
                  🟢 100% active state
                </span>
              </div>

              <div 
                onClick={() => setAdminTab("products")}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-stone-150/40 dark:border-slate-800 shadow-3xs text-left cursor-pointer hover:border-stone-300 dark:hover:border-slate-700 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#717171] dark:text-slate-400 font-mono">Catalog Products</span>
                  <div className="p-1.5 rounded-lg bg-stone-50 dark:bg-slate-800 text-stone-700 dark:text-slate-300">
                    <Layers className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-[#222222] dark:text-white mt-1.5">
                  {totalProducts}
                </div>
                <span className="text-[9.5px] text-stone-500 dark:text-slate-400 font-medium block mt-1">
                  In crafts, food, fashion...
                </span>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-stone-150/40 dark:border-slate-800 shadow-3xs text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#717171] dark:text-slate-400 font-mono">Total Sales Volume</span>
                  <div className="p-1.5 rounded-lg bg-stone-50 dark:bg-slate-800 text-stone-700 dark:text-slate-300">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-1.5 font-mono">
                  {totalSales.toLocaleString()} <span className="text-[10px] font-sans font-black text-stone-400">DA</span>
                </div>
                <span className="text-[9.5px] text-emerald-500 font-bold block mt-1">
                  From {orders.length} checkouts
                </span>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-stone-150/40 dark:border-slate-800 shadow-3xs text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#717171] dark:text-slate-400 font-mono">Platform Admin Profit</span>
                  <div className="p-1.5 rounded-lg bg-stone-50 dark:bg-slate-800 text-stone-700 dark:text-slate-300">
                    <Percent className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-1.5 font-mono">
                  {estimatedProfit.toLocaleString()} <span className="text-[10px] font-sans font-black text-stone-400">DA</span>
                </div>
                <span className="text-[9.5px] text-stone-500 dark:text-slate-400 font-bold block mt-1">
                  Commission set: {platformCommission}%
                </span>
              </div>

            </div>

            {/* distribution & logs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-stone-150/40 dark:border-slate-800 text-left">
                <h3 className="text-sm font-extrabold text-[#222222] dark:text-white font-sans uppercase tracking-wider mb-4 border-b border-stone-100 dark:border-slate-800 pb-2 flex items-center gap-1.5">
                  📁 Order Status Distribution
                </h3>
                
                <div className="flex flex-col gap-4">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      <span>Pending Verification</span>
                      <span className="font-mono text-[11px] font-bold">{orderDistributionByStatus.pending} orders</span>
                    </div>
                    <div className="w-full bg-stone-100 dark:bg-slate-950 h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500 bg-amber-500" 
                        style={{ width: `${orders.length ? (orderDistributionByStatus.pending / orders.length) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      <span>Accepted by Merchants</span>
                      <span className="font-mono text-[11px] font-bold">{orderDistributionByStatus.accepted} orders</span>
                    </div>
                    <div className="w-full bg-stone-100 dark:bg-slate-950 h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500 bg-sky-500" 
                        style={{ width: `${orders.length ? (orderDistributionByStatus.accepted / orders.length) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      <span>Shipped in Transit</span>
                      <span className="font-mono text-[11px] font-bold">{orderDistributionByStatus.shipped} orders</span>
                    </div>
                    <div className="w-full bg-stone-100 dark:bg-slate-950 h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500" 
                        style={{ 
                          width: `${orders.length ? (orderDistributionByStatus.shipped / orders.length) * 100 : 0}%`,
                          backgroundColor: currentSlideColor || "#ff385c"
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      <span>Delivered Successfully</span>
                      <span className="font-mono text-[11px] font-bold">{orderDistributionByStatus.delivered} orders</span>
                    </div>
                    <div className="w-full bg-stone-100 dark:bg-slate-950 h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500 bg-emerald-500" 
                        style={{ width: `${orders.length ? (orderDistributionByStatus.delivered / orders.length) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-stone-50 dark:bg-slate-950 rounded-xl p-3 border border-stone-150/25 dark:border-slate-850 flex items-start gap-2.5">
                  <span className="text-stone-400">💡</span>
                  <span className="text-[10px] text-stone-500 dark:text-slate-400 leading-normal font-sans font-medium">
                    State synchronization handles buyer track displays automatically. Status changes in any merchant workspace triggers real-time in-app toast alerts instantly!
                  </span>
                </div>
              </div>

              {/* Event logging */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-stone-150/40 dark:border-slate-800 text-left">
                <h3 className="text-sm font-extrabold text-[#222222] dark:text-white font-sans uppercase tracking-wider mb-4 border-b border-stone-100 dark:border-slate-800 pb-2 flex items-center gap-1.5">
                  📡 Real-time Platform Events
                </h3>

                <div className="flex flex-col gap-2 font-mono text-[10px] text-stone-600 dark:text-slate-400 overflow-y-auto max-h-[220px]">
                  <div className="flex items-start gap-1 p-1 bg-stone-50 dark:bg-zinc-950 rounded border-l-2 border-stone-400">
                    <span className="text-stone-500 shrink-0">[INFO]</span>
                    <span>Admin authenticated from securely cached LocalStorage token session.</span>
                  </div>
                  <div className="flex items-start gap-1 p-1 bg-stone-50 dark:bg-zinc-950 rounded border-l-2 border-emerald-500">
                    <span className="text-emerald-500 shrink-0">[OK]</span>
                    <span>Loaded {stores.length} independent merchant profiles on platform core successfully.</span>
                  </div>
                  <div className="flex items-start gap-1 p-1 bg-stone-50 dark:bg-zinc-950 rounded border-l-2 border-indigo-400">
                    <span className="text-indigo-500 shrink-0">[POLL]</span>
                    <span>Synchronized {orders.length} order receipts from backend state. Live polling connected.</span>
                  </div>
                  <div className="flex items-start gap-1 p-1 bg-stone-50 dark:bg-zinc-950 rounded border-l-2 border-rose-450">
                    <span className="text-rose-600 shrink-0">[CORE]</span>
                    <span>Gemini-powered copy writing assistant module core active on port 3000.</span>
                  </div>
                </div>

                <div className="mt-8 bg-stone-50 dark:bg-slate-950 border border-stone-150/40 dark:border-slate-800/80 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <div className="text-left">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      Need another independent shop?
                    </span>
                    <span className="text-[10px] text-stone-500 dark:text-slate-400 font-sans font-medium">
                      Create verified store profiles across all 58 provinces on the spot as an Admin.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAdminTab("stores");
                      setShowCreateStore(true);
                    }}
                    style={{ backgroundColor: currentSlideColor || "#ff385c" }}
                    className="px-3 py-1.5 text-white font-extrabold text-[10px] rounded-lg shadow-2xs shrink-0 transition-all cursor-pointer hover:opacity-95"
                  >
                    + Register Store
                  </button>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* TAB: Stores Directory */}
        {adminTab === "stores" && (
          <div className="flex flex-col gap-5">
            
            {/* Search and Trigger Register */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-stone-150/40 dark:border-slate-800 shadow-3xs">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Filter store registry by Name, domain prefix or Wilaya..."
                  value={storeQuery}
                  onChange={(e) => setStoreQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-stone-50 dark:bg-slate-950 border border-stone-250 dark:border-slate-800 rounded-xl outline-none text-xs font-semibold focus:border-stone-400 transition-all text-slate-900 dark:text-white font-sans"
                />
              </div>

              <button
                type="button"
                onClick={() => setShowCreateStore(!showCreateStore)}
                style={{ backgroundColor: showCreateStore ? "#333333" : (currentSlideColor || "#ff385c") }}
                className="px-4 py-2.5 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-all hover:opacity-95 duration-200"
              >
                {showCreateStore ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span>{showCreateStore ? "Cancel Register" : "Register Store Boutique"}</span>
              </button>
            </div>

            {/* Create form slide */}
            <AnimatePresence>
              {showCreateStore && (
                <motion.form
                  onSubmit={handleNewStoreSubmit}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-stone-150 dark:border-slate-850 shadow-sm text-left flex flex-col gap-4 overflow-hidden"
                >
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-800 dark:text-white font-mono">
                    ➕ Administrative Store Creator Wizard
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold text-stone-400 font-mono">
                        Store Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Bio Dates Oasis"
                        value={newStoreForm.name}
                        onChange={(e) => setNewStoreForm({ ...newStoreForm, name: e.target.value })}
                        className="p-2.5 bg-stone-50 dark:bg-slate-105 border border-stone-250 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold text-stone-400 font-mono">
                        Desired Subdomain
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          placeholder="e.g. dates-oasis"
                          value={newStoreForm.subdomain}
                          onChange={(e) => setNewStoreForm({ ...newStoreForm, subdomain: e.target.value })}
                          className="w-full p-2.5 pr-20 bg-stone-50 dark:bg-slate-105 border border-stone-250 dark:border-slate-800 rounded-xl text-xs font-black font-mono text-slate-900 dark:text-white outline-none"
                        />
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-black text-stone-400 font-mono">
                          .platform.dz
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold text-stone-400 font-mono">
                        Algerian Location Wilaya
                      </label>
                      <select
                        value={newStoreForm.wilaya}
                        onChange={(e) => setNewStoreForm({ ...newStoreForm, wilaya: e.target.value })}
                        className="p-2.5 bg-stone-50 dark:bg-slate-105 border border-stone-250 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none"
                      >
                        {COMMUNICATIVE_WILAYAS.map((w) => (
                          <option key={w.name} value={w.name}>
                            {w.name} ({w.code})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold text-stone-400 font-mono">
                        Merchant Contact Phone
                      </label>
                      <input
                        type="tel"
                        placeholder="+213 555 12 34 56"
                        value={newStoreForm.phone}
                        onChange={(e) => setNewStoreForm({ ...newStoreForm, phone: e.target.value })}
                        className="p-2.5 bg-stone-50 dark:bg-slate-105 border border-stone-250 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-900 dark:text-white outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold text-stone-400 font-mono">
                        Merchant Email
                      </label>
                      <input
                        type="email"
                        placeholder="oasis@store.dz"
                        value={newStoreForm.email}
                        onChange={(e) => setNewStoreForm({ ...newStoreForm, email: e.target.value })}
                        className="p-2.5 bg-stone-50 dark:bg-slate-105 border border-stone-250 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-900 dark:text-white outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold text-stone-400 font-mono">
                        Store Boutique Address
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Route de Touggourt, Biskra"
                        value={newStoreForm.address}
                        onChange={(e) => setNewStoreForm({ ...newStoreForm, address: e.target.value })}
                        className="p-2.5 bg-stone-50 dark:bg-slate-105 border border-stone-250 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-900 dark:text-white outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold text-stone-400 font-mono">
                      Headline Description Pitch
                    </label>
                    <textarea
                      placeholder="e.g. Custom organic harvest direct from dates farms shipped into all 58 Wilayas."
                      rows={2}
                      value={newStoreForm.description}
                      onChange={(e) => setNewStoreForm({ ...newStoreForm, description: e.target.value })}
                      className="p-2.5 bg-stone-50 dark:bg-slate-105 border border-stone-250 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-900 dark:text-white outline-none resize-none leading-normal font-sans"
                    />
                  </div>

                  <button
                    type="submit"
                    style={{ backgroundColor: currentSlideColor || "#ff385c" }}
                    className="mt-2 py-3 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer hover:opacity-95"
                  >
                    🎉 Complete Secure Merchant Setup &amp; Place on Algerian Map
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Table or Registry items list */}
            <div className="flex flex-col gap-4">
              {filteredStores.length === 0 ? (
                <div className="bg-stone-50 dark:bg-slate-950 rounded-2xl py-12 border border-stone-150 dark:border-slate-850 text-center text-stone-400">
                  <span className="text-2xl">🔍</span>
                  <p className="text-xs font-bold mt-2 font-sans">No stores registry match query filters.</p>
                </div>
              ) : (
                filteredStores.map((store) => {
                  const isEditing = editingStoreId === store.id;
                  return (
                    <div
                      key={store.id}
                      className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-stone-150/40 dark:border-slate-800 shadow-3xs text-left relative transition-all duration-300"
                    >
                      {/* Left indicator accent strip */}
                      <div 
                        style={{ backgroundColor: currentSlideColor || "#ff385c" }}
                        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl transition-colors duration-300" 
                      />

                      {isEditing ? (
                        /* Edit store subform input fields */
                        <div className="flex flex-col gap-4 font-sans text-left">
                          <h4 className="text-xs font-black uppercase text-slate-800 dark:text-white font-mono flex items-center gap-1">
                            <span>✏️</span> Edit details: {store.name}
                          </h4>

                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            <div className="flex flex-col gap-1">
                              <label className="text-[9px] uppercase font-bold text-stone-400 font-mono">Store Name</label>
                              <input
                                type="text"
                                className="p-2 bg-stone-50 dark:bg-slate-950 border border-stone-150/50 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-900 dark:text-white outline-none"
                                value={editStoreForm.name}
                                onChange={(e) => setEditStoreForm({ ...editStoreForm, name: e.target.value })}
                              />
                            </div>

                            <div className="flex flex-col gap-1">
                              <label className="text-[9px] uppercase font-bold text-stone-400 font-mono">Subdomain label</label>
                              <input
                                type="text"
                                className="p-2 bg-stone-50 dark:bg-slate-950 border border-stone-150/50 dark:border-slate-800 rounded-lg text-xs font-mono font-bold text-slate-900 dark:text-white outline-none"
                                value={editStoreForm.subdomain}
                                onChange={(e) => setEditStoreForm({ ...editStoreForm, subdomain: e.target.value })}
                              />
                            </div>

                            <div className="flex flex-col gap-1">
                              <label className="text-[9px] uppercase font-bold text-stone-400 font-mono">Location Province</label>
                              <select
                                className="p-2 bg-stone-50 dark:bg-slate-950 border border-stone-150/50 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-900 dark:text-white outline-none"
                                value={editStoreForm.wilaya}
                                onChange={(e) => setEditStoreForm({ ...editStoreForm, wilaya: e.target.value })}
                              >
                                {COMMUNICATIVE_WILAYAS.map((w) => (
                                  <option key={w.name} value={w.name}>{w.name}</option>
                                ))}
                              </select>
                            </div>

                            <div className="flex flex-col gap-1">
                              <label className="text-[9px] uppercase font-bold text-stone-400 font-mono">Orders Module Mode Assignment</label>
                              <select
                                className="p-2 bg-stone-50 dark:bg-slate-950 border border-stone-150/50 dark:border-slate-800 rounded-lg text-xs font-bold text-indigo-600 dark:text-indigo-400 outline-none"
                                value={editStoreForm.ordersMode}
                                onChange={(e) => setEditStoreForm({ ...editStoreForm, ordersMode: e.target.value as any })}
                              >
                                <option value="both">⚡ Both Modes Allowed (Classic & Advanced Switcher)</option>
                                <option value="classic">⚡ Classic Mode Only (Simplicity & Speed)</option>
                                <option value="advanced">📊 Advanced Mode Only (Rich Intelligence & Analytics)</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="flex flex-col gap-1">
                              <label className="text-[9px] uppercase font-bold text-stone-400 font-mono">Boutique Phone</label>
                              <input
                                type="text"
                                className="p-2 bg-stone-50 dark:bg-slate-950 border border-stone-150/50 dark:border-slate-800 rounded-lg text-xs font-mono font-bold text-slate-900 dark:text-white outline-none"
                                value={editStoreForm.phone}
                                onChange={(e) => setEditStoreForm({ ...editStoreForm, phone: e.target.value })}
                              />
                            </div>

                            <div className="flex flex-col gap-1">
                              <label className="text-[9px] uppercase font-bold text-stone-400 font-mono">Store Email</label>
                              <input
                                type="email"
                                className="p-2 bg-stone-50 dark:bg-slate-950 border border-stone-150/50 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-900 dark:text-white outline-none"
                                value={editStoreForm.email}
                                onChange={(e) => setEditStoreForm({ ...editStoreForm, email: e.target.value })}
                              />
                            </div>

                            <div className="flex flex-col gap-1">
                              <label className="text-[9px] uppercase font-bold text-stone-400 font-mono">Physical Address</label>
                              <input
                                type="text"
                                className="p-2 bg-stone-50 dark:bg-slate-950 border border-stone-150/50 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-900 dark:text-white outline-none"
                                value={editStoreForm.address}
                                onChange={(e) => setEditStoreForm({ ...editStoreForm, address: e.target.value })}
                              />
                            </div>
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] uppercase font-bold text-stone-400 font-mono">Store Headline Pitch</label>
                            <textarea
                              rows={2}
                              className="p-2 bg-stone-50 dark:bg-slate-950 border border-stone-150/50 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-900 dark:text-white outline-none resize-none leading-normal font-sans"
                              value={editStoreForm.description}
                              onChange={(e) => setEditStoreForm({ ...editStoreForm, description: e.target.value })}
                            />
                          </div>

                          <div className="flex items-center gap-2 mt-1">
                            <button
                              type="button"
                              onClick={() => handleSaveStoreChanges(store.id)}
                              style={{ backgroundColor: currentSlideColor || "#ff385c" }}
                              className="px-4 py-2 text-white font-extrabold text-[11px] rounded-lg cursor-pointer hover:opacity-90"
                            >
                              Save Settings
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingStoreId(null)}
                              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-slate-350 font-extrabold text-[11px] rounded-lg cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Normal read view info lines matching same colors with main page */
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          
                          <div className="flex items-start gap-4 flex-1 min-w-0 font-sans">
                            {store.logo ? (
                              <img
                                src={store.logo}
                                alt={store.name}
                                className="w-12 h-12 object-cover rounded-xl border border-stone-200/50 dark:border-slate-800 shrink-0 select-none bg-stone-50"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 font-black flex items-center justify-center shrink-0">
                                🏬
                              </div>
                            )}

                            <div className="text-left min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-extrabold text-[#222222] dark:text-white text-sm truncate leading-snug">
                                  {store.name}
                                </h3>
                                {store.verified && (
                                  <span className="text-[8.5px] font-black uppercase text-emerald-600 bg-emerald-50 dark:bg-emerald-950/25 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                    <Check className="w-2.5 h-2.5 stroke-[3px]" /> Verified DZ
                                  </span>
                                )}
                                <span className="text-[8.5px] font-bold uppercase px-1.5 py-0.5 rounded font-mono bg-stone-50 dark:bg-slate-850 text-stone-600 dark:text-slate-300">
                                  Tier: {store.premiumTier}
                                </span>
                              </div>

                              <p className="text-xs text-stone-500 dark:text-slate-400 line-clamp-1 mt-0.5 font-sans font-medium">
                                {store.description}
                              </p>

                              <div className="flex items-center gap-2.5 text-[10.5px] text-[#717171] dark:text-slate-400 font-bold font-mono mt-1.5 flex-wrap">
                                <span className="flex items-center gap-1 font-sans">
                                  <MapPin className="w-3.5 h-3.5" style={{ color: currentSlideColor || "#ff385c" }} />
                                  {store.wilaya}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1 font-mono text-stone-600 dark:text-stone-300">
                                  <Globe className="w-3.5 h-3.5 text-stone-400" />
                                  {store.subdomain}
                                </span>
                                <span>•</span>
                                <span className="text-stone-550 dark:text-slate-400 font-sans">
                                  {store.products?.length || 0} catalog items
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Quick Admin Toggles & settings rights */}
                          <div className="flex flex-wrap items-center gap-2 md:justify-end shrink-0 py-1">
                            
                            <div className="flex flex-col gap-0.5 text-left">
                              <span className="text-[8px] uppercase tracking-wider font-extrabold text-stone-400 font-mono">Set Merchant Tier</span>
                              <select
                                value={store.premiumTier}
                                onChange={(e) => handleTogglePremiumTier(store.id, e.target.value as any)}
                                className="p-1.5 text-[11px] font-semibold outline-none bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200"
                              >
                                <option value="Starter">Starter</option>
                                <option value="Growth">Growth</option>
                                <option value="Pro">Pro (Unlimited)</option>
                              </select>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleToggleVerify(store.id)}
                              className={`px-3 py-1.5 rounded-xl text-[10px] font-bold tracking-tight transition-all cursor-pointer ${
                                store.verified
                                  ? "bg-[#ff385c]/10 text-[#ff385c] dark:bg-[#ff385c]/20"
                                  : "bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-slate-800 dark:text-slate-350"
                              }`}
                              style={store.verified && currentSlideColor ? { color: currentSlideColor, backgroundColor: `${currentSlideColor}15` } : {}}
                            >
                              {store.verified ? "Revoke Badge" : "Approve Shop"}
                            </button>

                            <button
                              type="button"
                              onClick={() => startEditingStore(store)}
                              className="px-3 py-1.5 bg-stone-50 hover:bg-stone-100 text-[#222222] dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-slate-200 rounded-xl text-[10px] font-bold transition-all cursor-pointer border border-stone-205 dark:border-slate-700"
                            >
                              ✏️ Edit Info
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteStore(store.id)}
                              className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 dark:text-rose-450 rounded-xl transition-all cursor-pointer"
                              title="Delete store completely"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                          </div>

                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

          </div>
        )}

        {/* TAB: Catalog Moderation with Spectacular Layout */}
        {adminTab === "products" && (
          <div className="flex flex-col gap-6 text-left">
            
            {/* Action filter input */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-stone-150/40 dark:border-slate-800 shadow-3xs flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Moderation search by Product Name, category, store boutique..."
                  value={productQuery}
                  onChange={(e) => setProductQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 rounded-xl outline-none text-xs font-semibold focus:border-stone-400 transition-all font-sans text-slate-900 dark:text-white"
                />
              </div>
              <div className="text-[10px] uppercase font-black tracking-widest text-stone-500 dark:text-slate-300 font-mono px-3 py-1.5 bg-stone-50 dark:bg-slate-950 border border-stone-150/45 dark:border-slate-800 rounded-lg shrink-0 flex items-center justify-center select-none font-bold">
                Total searchable products: {allProducts.length}
              </div>
            </div>

            {/* List Products Catalog inside the brand-new Layout Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.length === 0 ? (
                <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4 bg-stone-50 dark:bg-slate-950 rounded-2xl py-16 border border-stone-150 dark:border-slate-850 text-center text-stone-400">
                  <span className="text-3xl">🛍️</span>
                  <p className="text-xs font-bold mt-2 font-sans text-stone-500">No catalog products match current search criteria.</p>
                </div>
              ) : (
                filteredProducts.map(({ product, storeName, storeId }) => (
                  <AdminProductCard
                    key={product.id}
                    product={product}
                    storeName={storeName}
                    storeId={storeId}
                    handleUpdateProductStock={handleUpdateProductStock}
                    handleUpdateProductPrice={handleUpdateProductPrice}
                    handleDeleteProduct={handleDeleteProduct}
                  />
                ))
              )}
            </div>

          </div>
        )}

        {/* TAB: Reviews Management */}
        {adminTab === "reviews" && (
          <div className="flex flex-col gap-6">
            
            {/* Reviews Specific Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-stone-150/40 dark:border-slate-800 text-left">
                <span className="text-[10px] uppercase font-bold text-stone-400 font-mono">Platform Reviews</span>
                <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
                  {allReviews.length}
                </div>
                <span className="text-[10px] text-stone-500 font-medium font-sans">Accumulated client feedback</span>
              </div>

              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-stone-150/40 dark:border-slate-800 text-left">
                <span className="text-[10px] uppercase font-bold text-stone-400 font-mono">Platform Average Rating</span>
                <div className="text-xl font-black text-slate-900 dark:text-white mt-1 flex items-center gap-1">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500 shrink-0" />
                  <span>
                    {(
                      allReviews.reduce((acc, r) => acc + r.review.rating, 0) /
                      (allReviews.length || 1)
                    ).toFixed(1)}
                  </span>
                  <span className="text-xs text-stone-400 font-normal font-sans">/5.0</span>
                </div>
                <span className="text-[10px] text-emerald-600 font-bold font-sans font-sans">Excellent client satisfaction</span>
              </div>

              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-stone-150/40 dark:border-slate-800 text-left">
                <span className="text-[10px] uppercase font-bold text-stone-400 font-mono">Sentiment Quality</span>
                <div className="text-xl font-black text-slate-900 dark:text-white mt-1 flex gap-2">
                  <span title="Positive" className="text-emerald-600">
                    🟢 {allReviews.filter((r) => r.review.sentiment === "positive").length}
                  </span>
                  <span title="Neutral" className="text-amber-600">
                    🟡 {allReviews.filter((r) => r.review.sentiment === "neutral").length}
                  </span>
                  <span title="Negative" className="text-rose-600">
                    🔴 {allReviews.filter((r) => r.review.sentiment === "negative").length}
                  </span>
                </div>
                <span className="text-[10px] text-stone-500 font-medium font-sans">Automatic sentiment parsing active</span>
              </div>

              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-stone-150/40 dark:border-slate-800 text-left">
                <span className="text-[10px] uppercase font-bold text-stone-400 font-mono">Reply Status</span>
                <div className="text-xl font-black text-slate-900 dark:text-white mt-1 font-sans">
                  {allReviews.filter((r) => r.review.reply).length} <span className="text-xs text-stone-400 font-normal font-sans">/ {allReviews.length} replied</span>
                </div>
                <span className="text-[10px] text-emerald-600 font-bold font-sans">
                  {((allReviews.filter((r) => r.review.reply).length / (allReviews.length || 1)) * 100).toFixed(0)}% response rate
                </span>
              </div>
            </div>

            {/* Filters dashboard */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-stone-150/40 dark:border-slate-800/80 shadow-3xs text-left flex flex-col gap-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white font-mono flex items-center gap-1.5">
                <Search className="w-4 h-4" /> Filter &amp; Inspect Platform Reviews
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                
                {/* Search query */}
                <div className="flex flex-col gap-1 sm:col-span-2 md:col-span-1 lg:col-span-1">
                  <label className="text-[9px] uppercase font-black text-stone-400 font-mono">Search Reviews</label>
                  <input
                    type="text"
                    placeholder="Search query..."
                    value={reviewsSearch}
                    onChange={(e) => setReviewsSearch(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-slate-955 border border-stone-200 dark:border-slate-855 rounded-xl outline-none text-xs text-slate-950 dark:text-white font-sans"
                  />
                </div>

                {/* Store filter */}
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] uppercase font-black text-stone-400 font-mono">Store Scope</label>
                  <select
                    value={reviewsStoreFilter}
                    onChange={(e) => setReviewsStoreFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-slate-955 border border-stone-200 dark:border-slate-855 rounded-xl outline-none text-xs text-slate-955 dark:text-white font-sans"
                  >
                    <option value="all">All Stores ({stores.length})</option>
                    {stores.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                {/* Type Filter */}
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] uppercase font-black text-stone-400 font-mono">Review Target</label>
                  <select
                    value={reviewsTypeFilter}
                    onChange={(e) => setReviewsTypeFilter(e.target.value as any)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-slate-955 border border-stone-200 dark:border-slate-855 rounded-xl outline-none text-xs text-slate-955 dark:text-white font-sans"
                  >
                    <option value="all">All Targets</option>
                    <option value="store">Store Level Reviews</option>
                    <option value="product">Product Level Reviews</option>
                  </select>
                </div>

                {/* Sentiment Filter */}
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] uppercase font-black text-stone-400 font-mono">Sentiment Analysis</label>
                  <select
                    value={reviewsSentimentFilter}
                    onChange={(e) => setReviewsSentimentFilter(e.target.value as any)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-slate-955 border border-stone-200 dark:border-slate-855 rounded-xl outline-none text-xs text-slate-955 dark:text-white font-sans"
                  >
                    <option value="all">All Sentiments</option>
                    <option value="positive">🟢 Positive Sentiment</option>
                    <option value="neutral">🟡 Neutral Sentiment</option>
                    <option value="negative">🔴 Negative Sentiment</option>
                  </select>
                </div>

                {/* Rating Filter */}
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] uppercase font-black text-stone-400 font-mono">Star Rating</label>
                  <select
                    value={reviewsRatingFilter}
                    onChange={(e) => setReviewsRatingFilter(e.target.value === "all" ? "all" : parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-slate-955 border border-stone-200 dark:border-slate-855 rounded-xl outline-none text-xs text-slate-955 dark:text-white font-sans"
                  >
                    <option value="all">All Stars</option>
                    <option value={5}>⭐⭐⭐⭐⭐ 5 Stars</option>
                    <option value={4}>⭐⭐⭐⭐ 4 Stars</option>
                    <option value={3}>⭐⭐⭐ 3 Stars</option>
                    <option value={2}>⭐⭐ 2 Stars</option>
                    <option value={1}>⭐ 1 Star</option>
                  </select>
                </div>

                {/* Sort Order Selector */}
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] uppercase font-black text-stone-400 font-mono">Sort Reviews</label>
                  <select
                    value={reviewsSortOrder}
                    onChange={(e) => setReviewsSortOrder(e.target.value as any)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-slate-955 border border-stone-200 dark:border-slate-855 rounded-xl outline-none text-xs text-slate-955 dark:text-white font-sans"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="highest">Highest Rating</option>
                    <option value="lowest">Lowest Rating</option>
                  </select>
                </div>

              </div>
              
              {/* Reset filter text */}
              {(reviewsSearch || reviewsStoreFilter !== "all" || reviewsTypeFilter !== "all" || reviewsSentimentFilter !== "all" || reviewsRatingFilter !== "all" || reviewsSortOrder !== "newest") && (
                <div className="flex justify-between items-center bg-stone-50 dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-stone-150 dark:border-slate-850">
                  <span className="text-[10px] text-stone-500 font-sans">Filtered showing {filteredReviews.length} of {allReviews.length} total reviews.</span>
                  <button
                    onClick={() => {
                      setReviewsSearch("");
                      setReviewsStoreFilter("all");
                      setReviewsTypeFilter("all");
                      setReviewsSentimentFilter("all");
                      setReviewsRatingFilter("all");
                      setReviewsSortOrder("newest");
                    }}
                    className="text-[10px] font-black text-rose-600 hover:text-rose-700 cursor-pointer text-left font-sans"
                  >
                    Reset Active Filters
                  </button>
                </div>
              )}
            </div>

            {/* Reviews display grid */}
            <div className="flex flex-col gap-4">
              {filteredReviews.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-2xl py-16 border border-stone-150/40 dark:border-slate-800 text-center text-stone-400">
                  <span className="text-3xl">💬</span>
                  <p className="text-xs font-bold mt-2 font-sans text-stone-500">No client reviews correspond to current filter selections.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                  {filteredReviews.map((agg) => {
                    const isReplying = replyingReviewId === agg.review.id;
                    const isEditing = editingReviewId === agg.review.id;
                    
                    return (
                      <div
                        key={`${agg.type}-${agg.review.id}`}
                        className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-stone-150/40 dark:border-slate-800 flex flex-col justify-between gap-4 shadow-3xs relative transition-all duration-300 hover:shadow-2xs hover:border-stone-250 dark:hover:border-slate-700"
                      >
                        {/* Upper info card */}
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <div className="flex items-center gap-2 font-sans">
                                <span className="font-extrabold text-slate-954 dark:text-white text-sm">
                                  {agg.review.author}
                                </span>
                                {agg.review.authorLocation && (
                                  <span className="text-[10px] text-stone-400 font-bold bg-stone-100 dark:bg-slate-950 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                    <MapPin className="w-3 h-3 text-stone-400" />
                                    {agg.review.authorLocation}
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] font-medium text-stone-400 block mt-0.5 font-sans">
                                Submitted on {agg.review.date}
                              </span>
                            </div>

                            {/* Rating badge & sentiment indicator */}
                            <div className="flex items-center gap-1.5 font-sans">
                              <span className={`text-[9px] uppercase font-black font-mono tracking-widest px-2 py-0.5 rounded-full ${
                                agg.review.sentiment === "positive" 
                                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20" 
                                  : agg.review.sentiment === "negative" 
                                    ? "bg-rose-50 text-rose-600 dark:bg-rose-950/20" 
                                    : "bg-amber-50 text-amber-600 dark:bg-amber-950/20"
                              }`}>
                                {agg.review.sentiment === "positive" ? "🟢 Positive" : agg.review.sentiment === "negative" ? "🔴 Negative" : "🟡 Neutral"}
                              </span>
                              <div className="flex bg-stone-50 dark:bg-slate-950 px-2 py-0.5 rounded-lg border border-stone-150 dark:border-slate-800 items-center gap-1">
                                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                <span className="text-xs font-black text-slate-800 dark:text-slate-100 font-mono">{agg.review.rating}</span>
                              </div>
                            </div>
                          </div>

                          {/* Link context bar */}
                          <div className="p-2 bg-stone-50/70 dark:bg-slate-950/40 rounded-xl border border-stone-150/50 dark:border-slate-800/40 text-[11px] leading-tight flex flex-wrap gap-x-3 gap-y-1 mt-1 shrink-0 font-sans">
                            <div>
                              <span className="text-stone-400 font-bold">Store:</span>{" "}
                              <span className="font-extrabold text-slate-850 dark:text-slate-250">{agg.storeName}</span>
                            </div>
                            {agg.type === "product" && (
                              <div>
                                <span className="text-stone-400 font-bold">Product:</span>{" "}
                                <span className="font-extrabold text-rose-550 dark:text-rose-452">{agg.productName}</span>
                              </div>
                            )}
                            <span className="text-[8.5px] uppercase font-black font-mono tracking-widest text-[#717171] bg-white dark:bg-slate-900 px-1 rounded shadow-3xs ml-auto">
                              {agg.type === "store" ? "Store Review" : "Product Review"}
                            </span>
                          </div>

                          {/* Editable or Standard review body comments */}
                          {isEditing ? (
                            <div className="flex flex-col gap-3 mt-2 p-3 bg-stone-50 dark:bg-slate-950/80 rounded-xl border border-stone-200 dark:border-slate-855 text-left font-sans">
                              <span className="text-[9px] uppercase font-black text-stone-450 font-mono">Redact / Edit Review:</span>
                              <textarea
                                rows={3}
                                value={editReviewForm.comment}
                                onChange={(e) => setEditReviewForm({ ...editReviewForm, comment: e.target.value })}
                                className="w-full p-2 bg-white dark:bg-slate-900 border border-stone-250 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-900 dark:text-white outline-none resize-none font-sans"
                              />
                              
                              <div className="grid grid-cols-2 gap-3 items-center">
                                <div className="flex flex-col gap-1">
                                  <label className="text-[9px] uppercase font-bold text-stone-400 font-mono font-sans">Set Rating Score</label>
                                  <select
                                    value={editReviewForm.rating}
                                    onChange={(e) => setEditReviewForm({ ...editReviewForm, rating: parseFloat(e.target.value) })}
                                    className="p-1.5 bg-white dark:bg-slate-900 border border-stone-250 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-905 dark:text-white font-sans"
                                  >
                                    <option value={5}>5.0 Stars (Perfect)</option>
                                    <option value={4}>4.0 Stars (Good)</option>
                                    <option value={3}>3.0 Stars (Average)</option>
                                    <option value={2}>2.0 Stars (Poor)</option>
                                    <option value={1}>1.0 Star (Terrible)</option>
                                  </select>
                                </div>

                                <div className="flex flex-col gap-1">
                                  <label className="text-[9px] uppercase font-bold text-stone-400 font-mono font-sans flex-row">Review Sentiment</label>
                                  <select
                                    value={editReviewForm.sentiment}
                                    onChange={(e) => setEditReviewForm({ ...editReviewForm, sentiment: e.target.value as any })}
                                    className="p-1.5 bg-white dark:bg-slate-900 border border-stone-250 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-955 dark:text-white font-sans"
                                  >
                                    <option value="positive">🟢 Positive</option>
                                    <option value="neutral">🟡 Neutral</option>
                                    <option value="negative">🔴 Negative</option>
                                  </select>
                                </div>
                              </div>

                              <div className="flex justify-end gap-2 mt-1">
                                <button
                                  type="button"
                                  onClick={() => setEditingReviewId(null)}
                                  className="px-2.5 py-1 text-[10px] font-bold text-stone-500 hover:bg-stone-100 rounded cursor-pointer font-sans"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSaveEdit(agg)}
                                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-extrabold text-[10px] cursor-pointer font-sans"
                                >
                                  Save Redaction
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs text-slate-800 dark:text-stone-300 font-sans italic leading-relaxed mt-2 pl-2 border-l-2 border-stone-200 dark:border-slate-700">
                              "{agg.review.comment}"
                            </p>
                          )}

                          {/* Official system or merchant reply block display */}
                          {agg.review.reply && !isReplying && (
                            <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-stone-150 dark:border-slate-855 text-left font-sans">
                              <div className="flex items-center gap-1 text-[10px] uppercase font-black text-stone-500 font-mono">
                                <span>💬 Response:</span>
                                <span className="text-[9px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 px-1 rounded font-mono">Official Admin DZ</span>
                              </div>
                              <p className="text-xs text-slate-700 dark:text-slate-400 mt-1 font-medium leading-relaxed italic">
                                "{agg.review.reply}"
                              </p>
                            </div>
                          )}

                          {/* Write reply inline textbox toggler */}
                          {isReplying && (
                            <div className="mt-3 p-3 bg-stone-50 dark:bg-slate-950 rounded-xl border border-stone-250 dark:border-slate-800 flex flex-col gap-2 font-sans">
                              <label className="text-[9px] uppercase font-black text-stone-450 font-mono">Compose Platform Reply:</label>
                              <textarea
                                rows={2}
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="E.g. Thank you for your review! We value your feedback on the Algerian crafts marketplace."
                                className="w-full p-2 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-lg text-xs text-slate-950 dark:text-white outline-none resize-none font-sans"
                              />
                              <div className="flex justify-end gap-2 text-xs">
                                <button
                                  type="button"
                                  onClick={() => setReplyingReviewId(null)}
                                  className="px-2.5 py-1 font-bold text-stone-500 hover:bg-stone-100 rounded cursor-pointer font-sans"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSaveReply(agg)}
                                  className="px-3 py-1 bg-slate-900 dark:bg-white text-white dark:text-black font-black text-[10px] rounded cursor-pointer font-sans"
                                  style={currentSlideColor ? { backgroundColor: currentSlideColor, color: "white" } : {}}
                                >
                                  Submit Reply
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Bottom action row buttons line footer */}
                        <div className="flex items-center justify-between border-t border-stone-100 dark:border-slate-800/80 pt-3 mt-auto shrink-0 select-none font-sans">
                          <button
                            type="button"
                            onClick={() => handleDeleteReview(agg)}
                            className="text-rose-600 hover:text-[#222222] dark:hover:text-white flex items-center gap-1 text-xs font-black transition-all cursor-pointer font-sans"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => startEditingReview(agg)}
                              className="px-3 py-1 bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-855 dark:text-stone-300 font-bold text-[10px] rounded-lg transition-all cursor-pointer border border-stone-200 dark:border-slate-700/60 font-sans"
                            >
                              Edit Review
                            </button>
                            <button
                              type="button"
                              onClick={() => startReplyingReview(agg)}
                              className="px-3 py-1 text-white hover:opacity-95 text-[10px] font-extrabold rounded-lg shadow-xxs transition-all cursor-pointer font-sans"
                              style={{ backgroundColor: currentSlideColor || "#ff385c" }}
                            >
                              {agg.review.reply ? "Modify Reply" : "Reply Review"}
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB: Global Settings */}
        {adminTab === "settings" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            
            {/* Configure Credentials (set password & username just for me) */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-stone-150/40 dark:border-slate-800 flex flex-col gap-4 font-sans text-left">
              <h3 className="text-sm font-extrabold text-[#222222] dark:text-white uppercase tracking-wider border-b border-light-divider dark:border-slate-800 pb-2 flex items-center gap-1.5">
                <Key className="w-4 h-4" style={{ color: currentSlideColor || "#ff385c" }} />
                Configure Admin Credentials
              </h3>
              
              <p className="text-xs text-stone-500 dark:text-slate-400 leading-normal font-medium">
                Update the platform inspector admin logins. Once verified, these custom credentials must be supplied to access the controller page in future sessions.
              </p>

              {settingsFeedback && (
                <div className={`text-xs font-bold p-3 rounded-xl border ${
                  settingsFeedback.includes("successfully") 
                    ? "bg-emerald-50 dark:bg-emerald-950/25 border-emerald-100 text-emerald-700 dark:text-emerald-400"
                    : "bg-rose-50 dark:bg-rose-950/20 border-rose-100 text-rose-700 dark:text-rose-455"
                }`}>
                  {settingsFeedback}
                </div>
              )}

              <form onSubmit={handleUpdateAdminPass} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-stone-400 font-mono">
                    Custom Admin Username
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. secureOwner"
                    value={newAdminUser}
                    onChange={(e) => setNewAdminUser(e.target.value)}
                    className="p-2.5 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-850 rounded-xl text-xs font-bold font-mono outline-none focus:border-stone-450 transition-all text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-stone-400 font-mono">
                    New Security Password
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. premiumSecret2026"
                    value={newAdminPass}
                    onChange={(e) => setNewAdminPass(e.target.value)}
                    className="p-2.5 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-850 rounded-xl text-xs font-bold font-mono outline-none focus:border-stone-450 transition-all text-slate-900 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  style={{ backgroundColor: currentSlideColor || "#ff385c" }}
                  className="mt-1 py-3 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all cursor-pointer hover:opacity-95 duration-200 flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4 stroke-[3px]" />
                  Save Admin Credentials
                </button>
              </form>
            </div>

            {/* Yumi Platform Owner Feature Management & Governance System */}
            <PlatformOwnerFeatureManagementCard currentSlideColor={currentSlideColor} />

            {/* Yumi Orders Module Governance & Policies */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-stone-150/40 dark:border-slate-800 flex flex-col gap-5 font-sans text-left md:col-span-2">
              <div className="flex justify-between items-start border-b border-stone-150 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-black uppercase text-slate-900 dark:text-white font-mono flex items-center gap-2">
                    <Package className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Yumi Orders Module Mode Governance & Policies</span>
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-slate-400 mt-1">
                    Control interface access across Classic Mode (simplicity & speed) and Advanced Mode (rich order analytics & intelligence) globally, per subscription tier, or overridden per individual store.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Global Platform Policy */}
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-slate-950 border border-stone-150 dark:border-slate-850 space-y-3">
                  <span className="text-[10px] uppercase font-mono font-bold text-stone-400 block">
                    1. Platform Global Default Mode
                  </span>
                  <select
                    value={globalOrdersMode}
                    onChange={(e) => handleUpdateGlobalOrdersMode(e.target.value as any)}
                    className="w-full p-2.5 bg-white dark:bg-slate-900 border border-stone-250 dark:border-slate-800 rounded-xl text-xs font-black text-indigo-600 dark:text-indigo-400 outline-none"
                  >
                    <option value="both">⚡ Both Modes Enabled (Merchants toggle between Classic & Advanced)</option>
                    <option value="classic">⚡ Force Classic Mode Globally (Maximum Simplicity & Speed)</option>
                    <option value="advanced">📊 Force Advanced Pro Mode Globally (Rich Analytics & Intelligence)</option>
                  </select>
                  <p className="text-[11px] text-stone-500 leading-normal">
                    Setting a forced global mode restricts all stores unless overridden per subscription plan or per store in Stores Registry.
                  </p>
                </div>

                {/* Plan Policy Mapping */}
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-slate-950 border border-stone-150 dark:border-slate-850 space-y-3">
                  <span className="text-[10px] uppercase font-mono font-bold text-stone-400 block">
                    2. Subscription Tier Default Policies
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                    {["Basic", "Pro", "Pro Plus", "Premium"].map((tier) => (
                      <div key={tier} className="flex flex-col gap-1">
                        <span className="font-bold text-stone-700 dark:text-slate-300 text-[11px]">{tier} Tier</span>
                        <select
                          value={planOrdersMode[tier] || "both"}
                          onChange={(e) => handleUpdatePlanOrdersMode(tier, e.target.value as any)}
                          className="p-1.5 bg-white dark:bg-slate-900 border border-stone-250 dark:border-slate-800 rounded-lg text-[11px] font-bold outline-none"
                        >
                          <option value="both">Both Modes</option>
                          <option value="classic">Classic Only</option>
                          <option value="advanced">Advanced Only</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Broadcast announcements & commission settings */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-stone-150/40 dark:border-slate-800 flex flex-col gap-4 font-sans text-left">
              
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-extrabold text-[#222222] dark:text-white uppercase tracking-wider border-b border-light-divider dark:border-slate-800 pb-2 flex items-center gap-1.5">
                  <Megaphone className="w-4 h-4 text-rose-500 animate-pulse" />
                  Broadcast Global Announcement Banner
                </h3>

                <p className="text-xs text-stone-500 dark:text-slate-400 leading-normal font-medium">
                  Configure a system-wide banner displaying at the top margin of the marketplace buyer screen. Perfect for marketing hot sales, maintenance notifications, or general support alerts.
                </p>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-stone-400 font-mono">
                    Announcement Banner Text
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. 🇩🇿 Celebration of Algerian Artisans! direct checkout and track shipping across Biskra, Adrar, Oran & Algiers!"
                    value={globalAnnouncement}
                    onChange={(e) => setGlobalAnnouncement(e.target.value)}
                    className="p-2.5 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-850 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none leading-normal resize-none font-sans"
                  />
                </div>

                {globalAnnouncement ? (
                  <button
                    type="button"
                    onClick={() => setGlobalAnnouncement("")}
                    className="py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-pink-950/20 dark:text-pink-400 font-extrabold text-[11px] rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-all border border-rose-150"
                  >
                    <X className="w-3.5 h-3.5" />
                    Clear Live Banner Display
                  </button>
                ) : (
                  <span className="text-[10px] text-stone-400 font-bold block text-center py-1">
                    ⚪ There is currently no live banner. Fill text to broadcast!
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-3 pt-3 border-t border-stone-100 dark:border-slate-850">
                <h3 className="text-sm font-extrabold text-[#222222] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Percent className="w-4 h-4 text-emerald-500" />
                  Tax &amp; Platform Commission Fee
                </h3>

                <p className="text-xs text-stone-500 dark:text-slate-400 leading-normal font-medium">
                  Define the transaction fee percentage captured on every shop's checkout. Used to calculate estimated platform earnings pools automatically.
                </p>

                <div className="flex items-center gap-4 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 p-3 rounded-xl font-mono">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 shrink-0">
                    Fee: {platformCommission}%
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    step="1"
                    value={platformCommission}
                    onChange={(e) => setPlatformCommission(parseInt(e.target.value))}
                    className="flex-grow accent-slate-900 dark:accent-white cursor-pointer h-1 bg-stone-200 dark:bg-slate-800 rounded-lg appearance-none"
                    style={{ accentColor: currentSlideColor }}
                  />
                  <span className="text-[10px] font-bold text-stone-450 uppercase shrink-0">
                    Max 30%
                  </span>
                </div>
              </div>

              {/* ⚡ YUME NETWORK GLOBAL ANIMATION DELAY & DURATION CONTROLLER (Owner Exclusive) ⚡ */}
              <div className="flex flex-col gap-3 pt-4 border-t border-stone-100 dark:border-slate-850">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-[#222222] dark:text-white uppercase tracking-wider flex items-center gap-1.5 font-sans">
                    <Zap className="w-4 h-4 text-amber-500 animate-pulse" />
                    Global Animation Delay &amp; Duration
                  </h3>
                  <span 
                    className="px-2.5 py-1 rounded-full text-[11px] font-mono font-black text-white shadow-xs"
                    style={{ backgroundColor: currentSlideColor || "#ff385c" }}
                  >
                    {(globalAnimationDelay ?? 0.5).toFixed(2)}s ({Math.round((globalAnimationDelay ?? 0.5) * 1000)}ms)
                  </span>
                </div>

                <p className="text-xs text-stone-500 dark:text-slate-400 leading-normal font-medium">
                  As the owner of Yume Network, control the global transition speed &amp; effect delay across all Marketplace tabs, Merchant Workspace sub-views, and Admin portals.
                </p>

                <div className="flex flex-col gap-2.5 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 p-3.5 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono font-bold text-stone-400 dark:text-slate-500 shrink-0 uppercase">
                      0.0s (Instant)
                    </span>
                    <input
                      type="range"
                      min="0.0"
                      max="2.0"
                      step="0.05"
                      value={globalAnimationDelay ?? 0.5}
                      onChange={(e) => setGlobalAnimationDelay?.(parseFloat(e.target.value))}
                      className="flex-grow accent-slate-900 dark:accent-white cursor-pointer h-2 bg-stone-200 dark:bg-slate-800 rounded-lg appearance-none"
                      style={{ accentColor: currentSlideColor || "#ff385c" }}
                    />
                    <span className="text-[10px] font-mono font-bold text-stone-400 dark:text-slate-500 shrink-0 uppercase">
                      2.0s (Slow Motion)
                    </span>
                  </div>

                  {/* Quick Presets */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-stone-200/60 dark:border-slate-800/80">
                    <span className="text-[10px] font-extrabold uppercase text-stone-400 dark:text-slate-500 mr-1 font-mono">
                      Presets:
                    </span>
                    {[
                      { label: "⚡ Instant (0.1s)", val: 0.1 },
                      { label: "🚀 Fast (0.3s)", val: 0.3 },
                      { label: "✨ Default (0.5s)", val: 0.5 },
                      { label: "🌊 Smooth (0.8s)", val: 0.8 },
                      { label: "🎬 Cinematic (1.2s)", val: 1.2 },
                    ].map((preset) => {
                      const isSelected = Math.abs((globalAnimationDelay ?? 0.5) - preset.val) < 0.02;
                      return (
                        <button
                          key={preset.val}
                          type="button"
                          onClick={() => setGlobalAnimationDelay?.(preset.val)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer font-sans ${
                            isSelected
                              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs scale-105"
                              : "bg-white dark:bg-slate-900 text-stone-600 dark:text-slate-300 border border-stone-200 dark:border-slate-800 hover:border-stone-400"
                          }`}
                        >
                          {preset.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Interactive Test Motion Effect Box */}
                <div className="mt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setTestPulse(true);
                      setTimeout(() => setTestPulse(false), Math.max(300, (globalAnimationDelay ?? 0.5) * 1000 + 200));
                    }}
                    className="w-full py-2.5 px-3 bg-stone-100 dark:bg-slate-850 hover:bg-stone-200/80 dark:hover:bg-slate-800 rounded-xl border border-stone-200/80 dark:border-slate-800 text-[11px] font-extrabold text-stone-700 dark:text-slate-200 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Test Transition Effect Timing ({((globalAnimationDelay ?? 0.5)).toFixed(2)}s)
                  </button>

                  <AnimatePresence>
                    {testPulse && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 8 }}
                        transition={{ duration: globalAnimationDelay ?? 0.5, ease: "easeInOut" }}
                        className="mt-2.5 p-3 rounded-xl bg-gradient-to-r from-emerald-500/10 via-sky-500/10 to-indigo-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          Yume Transition Effect executed at {(globalAnimationDelay ?? 0.5).toFixed(2)}s duration!
                        </span>
                        <span className="text-[10px] font-mono uppercase bg-emerald-500/20 px-2 py-0.5 rounded-full">
                          Active Speed
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

            </div>

            {/* 📸 & 📍 PLATFORM FEATURE CONTROL TOGGLES (Visual Search & Geographic Location) */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-stone-150/40 dark:border-slate-800 flex flex-col gap-5 font-sans text-left col-span-1 md:col-span-2 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-stone-100 dark:border-slate-800">
                <div>
                  <h3 className="text-sm font-extrabold text-[#222222] dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-indigo-500" />
                    Feature Controls & System Toggles
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5 font-medium">
                    Enable or disable platform-wide interactive features like visual camera identification and geographic location services.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800/80 uppercase">
                    Admin Overrides
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Toggle 1: Visual Search & AI Camera */}
                <div className="p-4 bg-stone-50/80 dark:bg-slate-950 border border-stone-200/80 dark:border-slate-800 rounded-2xl flex items-center justify-between gap-4 transition-all hover:border-indigo-300 dark:hover:border-indigo-800">
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl shrink-0 ${visualSearchEnabled ? "bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400" : "bg-stone-200 dark:bg-slate-800 text-stone-400"}`}>
                      <Camera className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-black text-slate-900 dark:text-white">Visual AI Camera Identifier</h4>
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase ${visualSearchEnabled ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400" : "bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-400"}`}>
                          {visualSearchEnabled ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 dark:text-slate-400 mt-1 leading-relaxed font-medium">
                        Controls visual AI photo identification, camera icons in search bars, and smart item snapping.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleVisualSearch(!visualSearchEnabled)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${visualSearchEnabled ? "bg-indigo-600" : "bg-stone-300 dark:bg-slate-800"}`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${visualSearchEnabled ? "translate-x-5" : "translate-x-0"}`}
                    />
                  </button>
                </div>

                {/* Toggle 2: Geographic Location & Proximity */}
                <div className="p-4 bg-stone-50/80 dark:bg-slate-950 border border-stone-200/80 dark:border-slate-800 rounded-2xl flex items-center justify-between gap-4 transition-all hover:border-sky-300 dark:hover:border-sky-800">
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl shrink-0 ${geoLocationEnabled ? "bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400" : "bg-stone-200 dark:bg-slate-800 text-stone-400"}`}>
                      <Compass className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-black text-slate-900 dark:text-white">Geographic Location Features</h4>
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase ${geoLocationEnabled ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400" : "bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-400"}`}>
                          {geoLocationEnabled ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 dark:text-slate-400 mt-1 leading-relaxed font-medium">
                        Controls Wilaya geolocation sorting, GPS proximity distances, and artisan location maps.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleGeoLocation(!geoLocationEnabled)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${geoLocationEnabled ? "bg-sky-600" : "bg-stone-300 dark:bg-slate-800"}`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${geoLocationEnabled ? "translate-x-5" : "translate-x-0"}`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* 🧠 MULTI-AI MODELS & CUSTOM PROVIDER ENGINE MANAGER */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-stone-150/40 dark:border-slate-800 flex flex-col gap-5 font-sans text-left col-span-1 md:col-span-2 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-stone-100 dark:border-slate-800">
                <div>
                  <h3 className="text-sm font-extrabold text-[#222222] dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-amber-500" />
                    AI Models & Provider Engine Hub
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5 font-medium">
                    Select from primary AI models (Gemini, DeepSeek, OpenAI, Kimi) or configure custom model providers manually.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200/80 dark:border-amber-800/80 flex items-center gap-1.5">
                    <SparklesIcon className="w-3 h-3 text-amber-500 animate-spin" />
                    Active: <strong className="font-extrabold">{activeAiModel}</strong>
                  </span>
                </div>
              </div>

              {/* Preset Models Selection */}
              <div>
                <label className="text-[10px] uppercase font-bold text-stone-400 dark:text-slate-500 font-mono block mb-2">
                  Quick Select Active Engine Model:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { name: "Gemini 2.5 Flash", provider: "Google DeepMind", badge: "Default AI", icon: "🌌" },
                    { name: "DeepSeek V3", provider: "DeepSeek AI", badge: "Reasoning", icon: "⚡" },
                    { name: "OpenAI GPT-4o", provider: "OpenAI", badge: "Omni Pro", icon: "🤖" },
                    { name: "Kimi k1.5", provider: "Moonshot AI / Kimi", badge: "Long Context", icon: "🌙" },
                  ].map((m) => {
                    const isSelected = activeAiModel === m.name;
                    return (
                      <button
                        key={m.name}
                        type="button"
                        onClick={() => handleSelectActiveModel(m.name)}
                        className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer relative flex flex-col justify-between gap-3 ${
                          isSelected
                            ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 shadow-md scale-[1.02]"
                            : "bg-stone-50/80 dark:bg-slate-950 text-slate-800 dark:text-slate-200 border-stone-200 dark:border-slate-800 hover:border-slate-400"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-xl">{m.icon}</span>
                          <span className={`text-[8.5px] font-extrabold px-2 py-0.5 rounded-full uppercase ${isSelected ? "bg-amber-400 text-slate-950" : "bg-stone-200 dark:bg-slate-800 text-stone-600 dark:text-slate-400"}`}>
                            {isSelected ? "ACTIVE" : m.badge}
                          </span>
                        </div>
                        <div>
                          <div className="text-xs font-black leading-tight">{m.name}</div>
                          <div className={`text-[10px] font-medium mt-0.5 ${isSelected ? "text-slate-300 dark:text-slate-600" : "text-stone-400 dark:text-slate-500"}`}>
                            {m.provider}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Added AI Models List */}
              <div className="mt-2 border-t border-stone-100 dark:border-slate-800 pt-4">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-[10px] uppercase font-bold text-stone-400 dark:text-slate-500 font-mono">
                    Configured & Custom Models ({customAiModels.length}):
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsAddingCustomModel(true)}
                    className="px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-extrabold hover:bg-slate-800 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Manual AI Model</span>
                  </button>
                </div>

                {/* Custom Add Form */}
                {isAddingCustomModel && (
                  <div className="p-4 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 rounded-2xl mb-4 text-left flex flex-col gap-3 animate-fade-in">
                    <h4 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Plus className="w-3.5 h-3.5 text-indigo-500" />
                      Add Custom AI Model / Provider Endpoint
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-stone-400 font-mono block mb-1">Model Name *</label>
                        <input
                          type="text"
                          placeholder="e.g. Claude 3.5 Sonnet / Llama 3.3"
                          value={newModelName}
                          onChange={(e) => setNewModelName(e.target.value)}
                          className="w-full text-xs bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-indigo-500 font-medium"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-stone-400 font-mono block mb-1">Provider / Vendor</label>
                        <input
                          type="text"
                          placeholder="e.g. Anthropic / Groq / Ollama / Custom API"
                          value={newModelProvider}
                          onChange={(e) => setNewModelProvider(e.target.value)}
                          className="w-full text-xs bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-indigo-500 font-medium"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-stone-400 font-mono block mb-1">Model ID / Alias</label>
                        <input
                          type="text"
                          placeholder="e.g. claude-3-5-sonnet-20241022"
                          value={newModelId}
                          onChange={(e) => setNewModelId(e.target.value)}
                          className="w-full text-xs font-mono bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-stone-400 font-mono block mb-1">API Endpoint Base URL (Optional)</label>
                        <input
                          type="text"
                          placeholder="e.g. https://api.anthropic.com/v1"
                          value={newModelBaseUrl}
                          onChange={(e) => setNewModelBaseUrl(e.target.value)}
                          className="w-full text-xs font-mono bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => setIsAddingCustomModel(false)}
                        className="px-3.5 py-2 bg-stone-200 dark:bg-slate-800 text-stone-700 dark:text-slate-300 rounded-xl text-xs font-extrabold hover:bg-stone-300 transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleAddCustomModel}
                        disabled={!newModelName.trim()}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-extrabold hover:bg-indigo-700 disabled:opacity-40 transition-all cursor-pointer shadow-xs"
                      >
                        Save &amp; Set Active
                      </button>
                    </div>
                  </div>
                )}

                {/* Models List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {customAiModels.map((m) => {
                    const isSelected = activeAiModel === m.name;
                    return (
                      <div
                        key={m.id}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                          isSelected
                            ? "bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800"
                            : "bg-stone-50/50 dark:bg-slate-950 border-stone-200/80 dark:border-slate-800"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 flex items-center justify-center text-xs font-bold shrink-0">
                            🤖
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900 dark:text-white truncate flex items-center gap-1.5">
                              <span>{m.name}</span>
                              {isSelected && (
                                <span className="text-[9px] font-black bg-indigo-600 text-white px-1.5 py-0.2 rounded uppercase">
                                  Active
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-stone-400 dark:text-slate-500 font-mono truncate">
                              {m.provider} {m.modelId ? `• ${m.modelId}` : ""}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {!isSelected && (
                            <button
                              type="button"
                              onClick={() => handleSelectActiveModel(m.name)}
                              className="px-2.5 py-1 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-indigo-600 hover:text-white border border-stone-200 dark:border-slate-800 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                            >
                              Use
                            </button>
                          )}
                          {!["cm-1", "cm-2", "cm-3", "cm-4"].includes(m.id) && (
                            <button
                              type="button"
                              onClick={() => handleDeleteCustomModel(m.id)}
                              className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                              title="Delete model"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 🌟 GORGEOUS BOUTIQUE COVER TEMPLATES CONFIGURATION AND MANAGER 🌟 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-stone-150/40 dark:border-slate-800 mt-6 flex flex-col gap-5 text-left font-sans col-span-1 md:col-span-2 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-light-divider dark:border-slate-800/80">
                <div>
                  <h3 className="text-sm font-extrabold text-[#222222] dark:text-white uppercase tracking-wider flex items-center gap-1.5 font-sans">
                    <Layers className="w-4.5 h-4.5 text-amber-500 animate-bounce" />
                    Manage Platform Boutique Cover Templates
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-slate-400 leading-normal mt-0.5 font-medium">
                    Administer cover templates displayed inside merchant style customizer dashboards. Create, update, or deprecate design settings models.
                  </p>
                </div>

                {!isAddingTemplate && !editingTemplateId && (
                  <button
                    type="button"
                    onClick={() => {
                      setTemplateForm({ id: `tpl-${Date.now().toString().slice(-4)}`, name: "", description: "", badgeText: "" });
                      setIsAddingTemplate(true);
                    }}
                    style={{ backgroundColor: currentSlideColor || "#ff385c" }}
                    className="px-3.5 py-2 rounded-xl text-white font-extrabold text-[11px] uppercase tracking-wide flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all w-full sm:w-auto justify-center font-sans"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Create New Design Template
                  </button>
                )}
              </div>

              {/* Template Editor/Creator Form */}
              {(isAddingTemplate || editingTemplateId) && (
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col gap-4 animate-fade-in text-left">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-xs font-black text-slate-850 dark:text-white flex items-center gap-1.5 uppercase tracking-wide font-mono">
                      {isAddingTemplate ? "➕ Register New cover Template" : "✏️ Customise cover template properties"}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingTemplate(false);
                        setEditingTemplateId(null);
                      }}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold text-stone-400 font-mono">Template ID (Unique reference)</label>
                      <input
                        type="text"
                        disabled={!!editingTemplateId}
                        value={templateForm.id}
                        onChange={(e) => setTemplateForm({ ...templateForm, id: e.target.value })}
                        className="p-2.5 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-bold font-mono outline-none text-slate-900 dark:text-white disabled:opacity-60"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold text-stone-400 font-mono">Display Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Classic Slideshow"
                        value={templateForm.name}
                        onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                        className="p-2.5 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold text-stone-400 font-mono">Badge Text Accent (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. PREMIUM LUXURY"
                        value={templateForm.badgeText}
                        onChange={(e) => setTemplateForm({ ...templateForm, badgeText: e.target.value })}
                        className="p-2.5 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold text-stone-400 font-mono">Description Bio</label>
                      <input
                        type="text"
                        placeholder="e.g. Generates structured perspective layout animations with image floating transitions."
                        value={templateForm.description}
                        onChange={(e) => setTemplateForm({ ...templateForm, description: e.target.value })}
                        className="p-2.5 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingTemplate(false);
                        setEditingTemplateId(null);
                      }}
                      className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!templateForm.id || !templateForm.name || !templateForm.description) {
                          alert("Please fill all required parameters.");
                          return;
                        }
                        if (onSaveCoverTemplates) {
                          if (isAddingTemplate) {
                            const exists = coverTemplates.some(t => t.id === templateForm.id);
                            if (exists) {
                              alert("Template ID already exists! Please supply a unique value.");
                              return;
                            }
                            const newTpl: CoverTemplate = {
                              id: templateForm.id,
                              name: templateForm.name,
                              description: templateForm.description,
                              badgeText: templateForm.badgeText,
                              images: []
                            };
                            onSaveCoverTemplates([...coverTemplates, newTpl]);
                          } else {
                            const updated = coverTemplates.map(t => {
                              if (t.id === editingTemplateId) {
                                return {
                                  ...t,
                                  name: templateForm.name,
                                  description: templateForm.description,
                                  badgeText: templateForm.badgeText
                                };
                              }
                              return t;
                            });
                            onSaveCoverTemplates(updated);
                          }
                        }
                        setIsAddingTemplate(false);
                        setEditingTemplateId(null);
                      }}
                      style={{ backgroundColor: currentSlideColor || "#ff385c" }}
                      className="px-5 py-2 rounded-xl text-white font-extrabold text-xs cursor-pointer"
                    >
                      Apply & Deploy Template
                    </button>
                  </div>
                </div>
              )}

              {/* Cover Templates List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {coverTemplates.map((tpl) => (
                  <div
                    key={tpl.id}
                    className="p-4 rounded-2xl border border-stone-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[9.5px] uppercase font-bold text-slate-400 font-mono bg-slate-200/55 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
                          Reference ID: {tpl.id}
                        </span>
                        {tpl.badgeText && (
                          <span className="text-[9px] font-black tracking-wider uppercase text-rose-650 bg-rose-50 dark:bg-pink-950/20 px-2 py-0.5 rounded-sm">
                            ★ {tpl.badgeText}
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs font-black text-slate-900 dark:text-white leading-tight font-sans block mb-1">
                        {tpl.name}
                      </h4>
                      <p className="text-[11px] text-stone-500 dark:text-slate-400 leading-normal font-medium">
                        {tpl.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-250 dark:border-slate-800/80 flex items-center justify-between">
                      <span className="text-[10px] text-stone-400 font-bold font-mono">
                        {(tpl.images || []).length} registered slides
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setTemplateForm({
                              id: tpl.id,
                              name: tpl.name,
                              description: tpl.description,
                              badgeText: tpl.badgeText || ""
                            });
                            setEditingTemplateId(tpl.id);
                            setIsAddingTemplate(false);
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-350 font-bold text-[10.5px] border border-stone-200 dark:border-slate-700 cursor-pointer transition-all"
                        >
                          Configure Settings
                        </button>

                        {tpl.id !== "toonhub" && tpl.id !== "classic" && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm("Are you sure you want to delete this custom template?")) {
                                if (onSaveCoverTemplates) {
                                  onSaveCoverTemplates(coverTemplates.filter(t => t.id !== tpl.id));
                                }
                              }
                            }}
                            className="p-1.5 rounded-xl text-rose-550 hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer"
                            title="Remove Cover Template"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB: Brands & Models Management */}
        {adminTab === "brands" && (
          <div className="flex flex-col gap-8 text-left font-sans animate-fade-in">
            {/* Header & Stats Bar */}
            <div className="bg-slate-50 dark:bg-slate-900/40 p-5 rounded-3xl border border-stone-150/40 dark:border-slate-800/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-indigo-500" />
                  Smartphone Brands &amp; Models Registry
                </h2>
                <p className="text-xs text-stone-500 dark:text-slate-400 font-medium">
                  Manage official smartphone brands, approved models, and process custom submissions from merchants.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl border border-stone-200 dark:border-slate-800 text-center shadow-sm">
                  <span className="text-xs font-mono text-stone-400 font-bold block uppercase">Brands</span>
                  <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">{brands.length}</span>
                </div>
                <div className="bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl border border-stone-200 dark:border-slate-800 text-center shadow-sm">
                  <span className="text-xs font-mono text-stone-400 font-bold block uppercase">Pending Review</span>
                  <span className="text-xl font-extrabold text-amber-600 dark:text-amber-400">{pendingModels.filter(m => m.status === "pending").length}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingBrand(null);
                    setBrandForm({ id: "", name: "", category: "electronics_devices", modelsString: "" });
                    setShowAddBrand(true);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black px-4 py-3 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95 transition-all"
                >
                  <Plus className="w-4 h-4 stroke-[3]" /> Add Brand
                </button>
              </div>
            </div>

            {/* Brands Form Modal / Panel */}
            {showAddBrand && (
              <div className="bg-slate-50 dark:bg-slate-900/40 p-6 rounded-3xl border border-indigo-200 dark:border-indigo-900/60 flex flex-col gap-4">
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  {editingBrand ? `Edit Brand: ${editingBrand.name}` : "Create New Device Brand"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-black text-slate-600 dark:text-slate-400">Unique Brand ID (lowercase)</label>
                    <input
                      type="text"
                      disabled={!!editingBrand}
                      placeholder="e.g. tech_brand, mobile_corp"
                      value={brandForm.id}
                      onChange={(e) => setBrandForm({ ...brandForm, id: e.target.value.toLowerCase().replace(/\s+/g, "_") })}
                      className="text-xs font-semibold p-3 border bg-white rounded-lg outline-none text-black disabled:bg-slate-100"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-black text-slate-600 dark:text-slate-400">Display Brand Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Tech Brand, Mobile Corp"
                      value={brandForm.name}
                      onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                      className="text-xs font-semibold p-3 border bg-white rounded-lg outline-none text-black"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-black text-slate-600 dark:text-slate-400">Main Category</label>
                    <select
                      value={brandForm.category}
                      onChange={(e) => setBrandForm({ ...brandForm, category: e.target.value })}
                      className="text-xs font-semibold p-3 border bg-white rounded-lg outline-none text-black"
                    >
                      <option value="electronics_devices">Smart Devices &amp; Electronics</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black text-slate-600 dark:text-slate-400">Models List (comma-separated)</label>
                  <textarea
                    placeholder="Model 15 Pro, Model 15, Model 14"
                    value={brandForm.modelsString}
                    onChange={(e) => setBrandForm({ ...brandForm, modelsString: e.target.value })}
                    rows={3}
                    className="text-xs font-semibold p-3 border bg-white rounded-lg outline-none text-black"
                  />
                  <span className="text-[10px] text-stone-400 font-bold">Provide official models separated by commas.</span>
                </div>
                <div className="flex justify-end gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddBrand(false);
                      setEditingBrand(null);
                    }}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800 px-4 py-2 border rounded-lg animate-fade-in"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      if (!brandForm.id || !brandForm.name) {
                        alert("Please provide Brand ID and Display Name.");
                        return;
                      }
                      const modelsList = brandForm.modelsString
                        .split(",")
                        .map(m => m.trim())
                        .filter(Boolean);

                      const updatedBrand: Brand = {
                        id: brandForm.id,
                        name: brandForm.name,
                        category: brandForm.category,
                        models: modelsList
                      };

                      try {
                        await saveBrandToFirestore(updatedBrand);
                        await loadBrandsAndPending();
                        setShowAddBrand(false);
                        setEditingBrand(null);
                      } catch (err) {
                        alert("Error saving brand: " + err);
                      }
                    }}
                    className="bg-indigo-600 text-white text-xs font-black px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Save Brand
                  </button>
                </div>
              </div>
            )}

            {/* Grid Layout: Pending Submissions & Approved Brands */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Side: Pending Models Queue */}
              <div className="lg:col-span-4 bg-white dark:bg-slate-950 p-5 rounded-3xl border border-stone-200/60 dark:border-slate-800/80 flex flex-col gap-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <h3 className="text-xs font-mono font-black text-slate-800 uppercase tracking-widest">
                    Review Queue ({pendingModels.filter(p => p.status === "pending").length})
                  </h3>
                  <span className="px-2 py-0.5 bg-amber-50 text-[9.5px] font-black text-amber-600 rounded">
                    Merchant Custom Entries
                  </span>
                </div>

                <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
                  {pendingModels.length === 0 ? (
                    <div className="py-8 text-center text-xs text-stone-400 italic font-medium">
                      No custom model submissions found.
                    </div>
                  ) : (
                    pendingModels.map(pending => (
                      <div 
                        key={pending.id} 
                        className={`p-3.5 border rounded-2xl flex flex-col gap-2.5 transition-all text-left ${
                          pending.status === "pending"
                            ? "bg-amber-50/20 border-amber-200/60"
                            : pending.status === "approved"
                            ? "bg-emerald-50/10 border-emerald-100"
                            : "bg-rose-50/10 border-rose-100"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded uppercase">
                              {pending.brandName}
                            </span>
                            <h4 className="text-xs font-black text-slate-900 mt-1">
                              {pending.modelName}
                            </h4>
                          </div>
                          <span className={`text-[9.5px] font-bold font-mono px-1.5 py-0.5 rounded ${
                            pending.status === "pending"
                              ? "bg-amber-100 text-amber-700"
                              : pending.status === "approved"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-rose-100 text-rose-750"
                          }`}>
                            {pending.status}
                          </span>
                        </div>

                        {pending.status === "pending" && (
                          <div className="flex gap-2 justify-end pt-1 border-t border-slate-100">
                            <button
                              type="button"
                              onClick={async () => {
                                try {
                                  await processPendingModel(pending, "rejected");
                                  await loadBrandsAndPending();
                                } catch (err) {
                                  alert("Error processing: " + err);
                                }
                              }}
                              className="text-[10px] font-black text-rose-600 hover:bg-rose-50 px-2 py-1.5 rounded transition-colors"
                            >
                              Reject
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                try {
                                  await processPendingModel(pending, "approved");
                                  await loadBrandsAndPending();
                                } catch (err) {
                                  alert("Error processing: " + err);
                                }
                              }}
                              className="bg-emerald-600 text-white text-[10px] font-black px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors"
                            >
                              Approve &amp; Add
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Right Side: Approved Brands and Models */}
              <div className="lg:col-span-8 bg-white dark:bg-slate-950 p-5 rounded-3xl border border-stone-200/60 dark:border-slate-800/80 flex flex-col gap-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <h3 className="text-xs font-mono font-black text-slate-800 uppercase tracking-widest">
                    Approved Device Brands &amp; Models ({brands.length})
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {brands.map(brand => (
                    <div 
                      key={brand.id}
                      className="p-4 border border-stone-150 rounded-2xl hover:border-indigo-400 transition-colors flex flex-col justify-between gap-3 text-left"
                    >
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-black text-slate-900">{brand.name}</h4>
                          <span className="text-[10px] text-stone-400 font-mono font-bold uppercase">{brand.id}</span>
                        </div>
                        <p className="text-[10.5px] text-slate-400 font-mono font-medium mt-1 uppercase">
                          📂 {brand.category}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-3">
                          {brand.models.map(m => (
                            <span 
                              key={m}
                              className="text-[9.5px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded"
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end pt-3 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingBrand(brand);
                            setBrandForm({
                              id: brand.id,
                              name: brand.name,
                              category: brand.category,
                              modelsString: brand.models.join(", ")
                            });
                            setShowAddBrand(true);
                          }}
                          className="text-[10.5px] font-black text-indigo-600 hover:underline"
                        >
                          Edit Brand
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            if (confirm(`Are you sure you want to delete ${brand.name}?`)) {
                              try {
                                await deleteBrandFromFirestore(brand.id);
                                await loadBrandsAndPending();
                              } catch (err) {
                                alert("Error deleting: " + err);
                              }
                            }
                          }}
                          className="text-[10.5px] font-black text-rose-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: Dynamic Categories Management */}
        {adminTab === "categories" && (
          <div className="flex flex-col gap-8 text-left font-sans animate-fade-in">
            
            {/* Header & Stats Bar */}
            <div className="bg-slate-50 dark:bg-slate-900/40 p-5 rounded-3xl border border-stone-150/40 dark:border-slate-800/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Palette className="w-5 h-5 text-indigo-500" />
                  Dynamic Category Catalog System
                </h2>
                <p className="text-xs text-stone-500 dark:text-slate-400 font-medium">
                  Add, edit, reorder or safe-delete catalog departments, subcategories, custom sizing constraints, and fields.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl border border-stone-200 dark:border-slate-800 text-center shadow-sm">
                  <span className="text-xs font-mono text-stone-400 font-bold block uppercase">Main Categories</span>
                  <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">{mainCategories.length}</span>
                </div>
                <div className="bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl border border-stone-200 dark:border-slate-800 text-center shadow-sm">
                  <span className="text-xs font-mono text-stone-400 font-bold block uppercase">Subcategories</span>
                  <span className="text-xl font-extrabold text-amber-600 dark:text-amber-400">{subcategories.length}</span>
                </div>
              </div>
            </div>

            {/* Table-based Interactive Directory Tabs */}
            <div className="flex border-b border-stone-200 dark:border-slate-800 gap-6 -mt-2">
              <button
                type="button"
                onClick={() => setCategoriesTab("main")}
                className={`pb-3.5 font-bold text-sm border-b-2 transition-all cursor-pointer flex items-center gap-2 px-1 ${
                  categoriesTab === "main"
                    ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-black"
                    : "border-transparent text-stone-500 dark:text-slate-400 hover:text-stone-700 dark:hover:text-slate-200"
                }`}
              >
                <Folder className="w-4 h-4" />
                Main Departments Registry
              </button>
              <button
                type="button"
                onClick={() => setCategoriesTab("sub")}
                className={`pb-3.5 font-bold text-sm border-b-2 transition-all cursor-pointer flex items-center gap-2 px-1 ${
                  categoriesTab === "sub"
                    ? "border-amber-600 text-amber-600 dark:border-amber-400 dark:text-amber-400 font-black"
                    : "border-transparent text-stone-500 dark:text-slate-400 hover:text-stone-700 dark:hover:text-slate-200"
                }`}
              >
                <FolderOpen className="w-4 h-4" />
                Subcategories Directory
              </button>
            </div>

            {categoriesTab === "main" ? (
              /* TAB: MAIN CATEGORIES MANAGEMENT TABLE */
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-stone-200 dark:border-slate-800 flex flex-col gap-6 animate-fade-in">
                {/* Search and Action Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
                  <div className="relative flex-1 max-w-md">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-stone-400">
                      <Search className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      placeholder="Search main departments by name or ID..."
                      value={mainCatSearch}
                      onChange={(e) => setMainCatSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-stone-50/50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 rounded-2xl text-xs font-bold outline-none text-slate-900 dark:text-white placeholder:text-stone-400 focus:border-indigo-500 focus:bg-white transition-all"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingMainCategory(null);
                      setMainCategoryForm({
                        id: "",
                        names: { en: "", ar: "", fr: "" },
                        icon: "Shirt",
                        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80"
                      });
                      setShowAddMainCategory(true);
                    }}
                    className="px-4 py-2 rounded-2xl bg-indigo-600 text-white font-extrabold text-xs hover:bg-indigo-700 shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    Create Main Department
                  </button>
                </div>

                {/* Form to Add/Edit Main Category inline */}
                {showAddMainCategory && (
                  <div className="p-5 rounded-2xl border border-indigo-100 dark:border-slate-800 bg-indigo-50/10 dark:bg-slate-950/20 flex flex-col gap-4 text-left animate-fade-in">
                    <div className="flex justify-between items-center border-b border-indigo-100/50 dark:border-slate-800/80 pb-2">
                      <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Palette className="w-4 h-4 text-indigo-500" />
                        {editingMainCategory ? "Update Existing Department Blueprint" : "Register New Department"}
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddMainCategory(false);
                          setEditingMainCategory(null);
                        }}
                        className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      {!editingMainCategory ? (
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] uppercase font-bold text-stone-400 font-mono">Unique Key ID</label>
                          <input
                            type="text"
                            placeholder="e.g. fashion_attire"
                            value={mainCategoryForm.id}
                            onChange={(e) => setMainCategoryForm({ ...mainCategoryForm, id: e.target.value.toLowerCase().replace(/\\s+/g, "_") })}
                            className="p-2.5 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none text-slate-900 dark:text-white"
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1 opacity-70">
                          <label className="text-[10px] uppercase font-bold text-stone-400 font-mono">Unique Key ID (Immutable)</label>
                          <input
                            type="text"
                            disabled
                            value={mainCategoryForm.id}
                            className="p-2.5 bg-stone-100 dark:bg-slate-800 border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none text-stone-500 cursor-not-allowed"
                          />
                        </div>
                      )}

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-bold text-stone-400 font-mono">English Title Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Clothing & Apparel"
                          value={mainCategoryForm.names.en}
                          onChange={(e) => setMainCategoryForm({ ...mainCategoryForm, names: { ...mainCategoryForm.names, en: e.target.value } })}
                          className="p-2.5 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none text-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-bold text-stone-400 font-mono">Arabic Title Name</label>
                        <input
                          type="text"
                          placeholder="e.g. ملابس وأزياء"
                          value={mainCategoryForm.names.ar}
                          onChange={(e) => setMainCategoryForm({ ...mainCategoryForm, names: { ...mainCategoryForm.names, ar: e.target.value } })}
                          className="p-2.5 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none text-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-bold text-stone-400 font-mono">French Title Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Vêtements & Mode"
                          value={mainCategoryForm.names.fr}
                          onChange={(e) => setMainCategoryForm({ ...mainCategoryForm, names: { ...mainCategoryForm.names, fr: e.target.value } })}
                          className="p-2.5 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-bold text-stone-400 font-mono">Icon Representation</label>
                        <select
                          value={mainCategoryForm.icon}
                          onChange={(e) => setMainCategoryForm({ ...mainCategoryForm, icon: e.target.value })}
                          className="p-2.5 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white cursor-pointer"
                        >
                          {["Shirt", "Sparkles", "Smartphone", "Home", "Activity", "Palette", "Utensils", "Wrench", "Tv", "Heart", "Camera", "Gem", "BookOpen", "GlassWater"].map(ic => (
                            <option key={ic} value={ic}>{ic}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-bold text-stone-400 font-mono">Splash Image URL</label>
                        <input
                          type="text"
                          placeholder="e.g. Unsplash cover photo URL"
                          value={mainCategoryForm.image}
                          onChange={(e) => setMainCategoryForm({ ...mainCategoryForm, image: e.target.value })}
                          className="p-2.5 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-stone-100 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddMainCategory(false);
                          setEditingMainCategory(null);
                        }}
                        className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          const formId = editingMainCategory ? editingMainCategory.id : mainCategoryForm.id;
                          if (!formId || !mainCategoryForm.names.en) {
                            alert("Please fill at least the English name and a unique key ID.");
                            return;
                          }

                          const finalNames = {
                            en: mainCategoryForm.names.en,
                            ar: mainCategoryForm.names.ar || mainCategoryForm.names.en,
                            fr: mainCategoryForm.names.fr || mainCategoryForm.names.en,
                          };

                          const newCat: MainCategory = {
                            id: formId,
                            names: finalNames,
                            icon: mainCategoryForm.icon,
                            image: mainCategoryForm.image,
                            order: editingMainCategory ? editingMainCategory.order : mainCategories.length,
                            createdAt: editingMainCategory ? (editingMainCategory.createdAt || getCategoryCreatedAt(editingMainCategory)) : new Date().toISOString(),
                          };

                          await saveMainCategoryToFirestore(newCat);

                          if (editingMainCategory) {
                            setMainCategories(prev => prev.map(c => c.id === formId ? newCat : c));
                          } else {
                            setMainCategories(prev => [...prev, newCat]);
                          }

                          setShowAddMainCategory(false);
                          setEditingMainCategory(null);
                        }}
                        className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-black text-xs hover:bg-indigo-700 cursor-pointer"
                      >
                        {editingMainCategory ? "Save Changes" : "Create Department"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Main Category Management Table */}
                <div className="overflow-x-auto rounded-2xl border border-stone-200 dark:border-slate-800 shadow-sm">
                  <table id="platform-admin-category-table" className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900 border-b border-stone-200 dark:border-slate-800 text-stone-500 dark:text-slate-400 uppercase tracking-wider font-mono text-[10px] font-bold">
                        <th className="px-5 py-3.5 font-semibold">Department Image</th>
                        <th className="px-5 py-3.5 font-semibold">Unique Key ID</th>
                        <th 
                          className="px-5 py-3.5 font-semibold cursor-pointer select-none hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
                          onClick={() => handleCatSort("name")}
                        >
                          <div className="flex items-center gap-1">
                            Category Name
                            {catSortField === "name" ? (catSortOrder === "asc" ? " ▲" : " ▼") : " ↕"}
                          </div>
                        </th>
                        <th className="px-5 py-3.5 font-semibold">Arabic Name</th>
                        <th className="px-5 py-3.5 font-semibold">French Name</th>
                        <th 
                          className="px-5 py-3.5 font-semibold cursor-pointer select-none hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
                          onClick={() => handleCatSort("date")}
                        >
                          <div className="flex items-center gap-1">
                            Created Date
                            {catSortField === "date" ? (catSortOrder === "asc" ? " ▲" : " ▼") : " ↕"}
                          </div>
                        </th>
                        <th className="px-5 py-3.5 font-semibold text-center">Subcategories</th>
                        <th className="px-5 py-3.5 font-semibold text-center">Sort Order</th>
                        <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-150 dark:divide-slate-800/60">
                      {[...mainCategories]
                        .filter(cat => {
                          const search = mainCatSearch.toLowerCase().trim();
                          if (!search) return true;
                          return (
                            cat.id.toLowerCase().includes(search) ||
                            (cat.names.en || "").toLowerCase().includes(search) ||
                            (cat.names.ar || "").toLowerCase().includes(search) ||
                            (cat.names.fr || "").toLowerCase().includes(search)
                          );
                        })
                        .sort((a, b) => {
                          if (!catSortField) return 0;
                          if (catSortField === "name") {
                            const nameA = (a.names.en || "").toLowerCase();
                            const nameB = (b.names.en || "").toLowerCase();
                            if (nameA < nameB) return catSortOrder === "asc" ? -1 : 1;
                            if (nameA > nameB) return catSortOrder === "asc" ? 1 : -1;
                            return 0;
                          } else {
                            const dateA = new Date(getCategoryCreatedAt(a)).getTime();
                            const dateB = new Date(getCategoryCreatedAt(b)).getTime();
                            return catSortOrder === "asc" ? dateA - dateB : dateB - dateA;
                          }
                        })
                        .map((cat, idx, arr) => {
                          const subCount = subcategories.filter(s => s.mainCategoryId === cat.id).length;
                          return (
                            <tr 
                              key={cat.id}
                              className="bg-white dark:bg-slate-950/20 hover:bg-slate-50/60 dark:hover:bg-slate-900/30 transition-colors"
                            >
                              <td className="px-5 py-3">
                                <div className="flex items-center gap-3">
                                  {cat.image ? (
                                    <img 
                                      src={cat.image} 
                                      alt={cat.names.en} 
                                      className="w-10 h-10 rounded-xl object-cover border border-stone-200 dark:border-slate-850 bg-stone-100" 
                                      referrerPolicy="no-referrer" 
                                    />
                                  ) : (
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                      <Palette className="w-5 h-5" />
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-5 py-3 font-mono text-[11px] font-bold text-slate-500 dark:text-slate-400">
                                {cat.id}
                              </td>
                              <td className="px-5 py-3 font-black text-slate-900 dark:text-white">
                                {cat.names.en}
                              </td>
                              <td className="px-5 py-3 font-black text-slate-900 dark:text-white" dir="rtl">
                                {cat.names.ar}
                              </td>
                              <td className="px-5 py-3 text-stone-600 dark:text-slate-300">
                                {cat.names.fr || "—"}
                              </td>
                              <td className="px-5 py-3 font-mono text-[11px] text-stone-600 dark:text-slate-300">
                                {formatDate(getCategoryCreatedAt(cat))}
                              </td>
                              <td className="px-5 py-3 text-center">
                                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/30">
                                  {subCount} registered
                                </span>
                              </td>
                              <td className="px-5 py-3">
                                <div className="flex items-center justify-center gap-1">
                                  <button
                                    type="button"
                                    disabled={idx === 0}
                                    onClick={async () => {
                                      const originalIdx = mainCategories.findIndex(c => c.id === cat.id);
                                      if (originalIdx > 0) {
                                        const newList = [...mainCategories];
                                        const [temp] = newList.splice(originalIdx, 1);
                                        newList.splice(originalIdx - 1, 0, temp);
                                        setMainCategories(newList);
                                        await saveReorderedCategoriesToFirestore(newList);
                                      }
                                    }}
                                    className="p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-slate-800 disabled:opacity-30 text-stone-500"
                                    title="Move Up"
                                  >
                                    <ArrowUp className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={idx === arr.length - 1}
                                    onClick={async () => {
                                      const originalIdx = mainCategories.findIndex(c => c.id === cat.id);
                                      if (originalIdx !== -1 && originalIdx < mainCategories.length - 1) {
                                        const newList = [...mainCategories];
                                        const [temp] = newList.splice(originalIdx, 1);
                                        newList.splice(originalIdx + 1, 0, temp);
                                        setMainCategories(newList);
                                        await saveReorderedCategoriesToFirestore(newList);
                                      }
                                    }}
                                    className="p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-slate-800 disabled:opacity-30 text-stone-500"
                                    title="Move Down"
                                  >
                                    <ArrowDown className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                              <td className="px-5 py-3 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingMainCategory(cat);
                                      setMainCategoryForm({
                                        id: cat.id,
                                        names: cat.names,
                                        icon: cat.icon,
                                        image: cat.image
                                      });
                                      setShowAddMainCategory(true);
                                    }}
                                    className="p-2 rounded-xl text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/30"
                                    title="Edit Department"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSafeDeleteMainCategory(cat);
                                      setSafeDeleteAction("archive");
                                      setSafeDeleteTargetId(mainCategories.find(c => c.id !== cat.id)?.id || "");
                                    }}
                                    className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 border border-transparent hover:border-rose-100 dark:hover:border-rose-900/30"
                                    title="Remove Department"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      {mainCategories.filter(cat => {
                        const search = mainCatSearch.toLowerCase().trim();
                        if (!search) return true;
                        return (
                          cat.id.toLowerCase().includes(search) ||
                          (cat.names.en || "").toLowerCase().includes(search) ||
                          (cat.names.ar || "").toLowerCase().includes(search) ||
                          (cat.names.fr || "").toLowerCase().includes(search)
                        );
                      }).length === 0 && (
                        <tr>
                          <td colSpan={9} className="py-12 text-center text-stone-400 dark:text-slate-500 font-bold text-xs">
                            No main departments match your search query.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* TAB: SUBCATEGORIES MANAGEMENT TABLE */
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-stone-200 dark:border-slate-800 flex flex-col gap-6 animate-fade-in">
                {/* Search, Filter, and Action Bar */}
                <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
                  <div className="flex flex-col sm:flex-row flex-1 gap-3 max-w-2xl">
                    <div className="relative flex-1">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-stone-400">
                        <Search className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        placeholder="Search subcategories by name, ID, or materials..."
                        value={subCatSearch}
                        onChange={(e) => setSubCatSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-stone-50/50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 rounded-2xl text-xs font-bold outline-none text-slate-900 dark:text-white placeholder:text-stone-400 focus:border-indigo-500 focus:bg-white transition-all"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-stone-400 font-mono shrink-0">Dept:</span>
                      <select
                        value={subCatDeptFilter}
                        onChange={(e) => setSubCatDeptFilter(e.target.value)}
                        className="p-2 bg-stone-50/50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white cursor-pointer outline-none focus:border-indigo-500 transition-all"
                      >
                        <option value="all">All Departments</option>
                        {mainCategories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.names.en}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingSubcategory(null);
                      // Default to first category if none active in the selection
                      if (!selectedMainCategoryId && mainCategories.length > 0) {
                        setSelectedMainCategoryId(mainCategories[0].id);
                      }
                      setSubcategoryForm({
                        id: "",
                        names: { en: "", ar: "", fr: "" },
                        icon: "Folder",
                        image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=80",
                        sizeSystemEnabled: false,
                        sizeSystemLabel: "Sizes Available",
                        sizeSystemSizes: "S, M, L, XL",
                        recommendedMaterials: "Cotton, Linen",
                        fields: [
                          { name: "Material", type: "text", required: false, placeholder: "e.g. 100% Wool" }
                        ]
                      });
                      setShowAddSubcategory(true);
                    }}
                    className="px-4 py-2 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    Create Subcategory
                  </button>
                </div>

                {/* Form to Add/Edit Subcategory inline */}
                {showAddSubcategory && (
                  <div className="p-5 rounded-2xl border border-amber-150 dark:border-slate-800 bg-amber-50/10 dark:bg-slate-950/20 flex flex-col gap-4 text-left animate-fade-in">
                    <div className="flex justify-between items-center border-b border-amber-100 dark:border-slate-800/80 pb-2">
                      <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Folder className="w-4 h-4 text-amber-500" />
                        {editingSubcategory ? "Update Existing Subcategory Blueprint" : "Register New Subcategory"}
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddSubcategory(false);
                          setEditingSubcategory(null);
                        }}
                        className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-bold text-stone-400 font-mono">Parent Department Link</label>
                        <select
                          value={selectedMainCategoryId}
                          onChange={(e) => setSelectedMainCategoryId(e.target.value)}
                          className="p-2.5 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white cursor-pointer"
                        >
                          {mainCategories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.names.en} (id: {cat.id})</option>
                          ))}
                        </select>
                      </div>

                      {!editingSubcategory ? (
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] uppercase font-bold text-stone-400 font-mono">Unique Key Code</label>
                          <input
                            type="text"
                            placeholder="e.g. smart_watches"
                            value={subcategoryForm.id}
                            onChange={(e) => setSubcategoryForm({ ...subcategoryForm, id: e.target.value.toLowerCase().replace(/\\s+/g, "_") })}
                            className="p-2.5 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none text-slate-900 dark:text-white"
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1 opacity-70">
                          <label className="text-[10px] uppercase font-bold text-stone-400 font-mono">Unique Key Code (Immutable)</label>
                          <input
                            type="text"
                            disabled
                            value={subcategoryForm.id}
                            className="p-2.5 bg-stone-100 dark:bg-slate-800 border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none text-stone-500 cursor-not-allowed"
                          />
                        </div>
                      )}

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-bold text-stone-400 font-mono">English Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Running Shoes"
                          value={subcategoryForm.names.en}
                          onChange={(e) => setSubcategoryForm({ ...subcategoryForm, names: { ...subcategoryForm.names, en: e.target.value } })}
                          className="p-2.5 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none text-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-bold text-stone-400 font-mono">Arabic Name</label>
                        <input
                          type="text"
                          placeholder="e.g. أحذية الجري"
                          value={subcategoryForm.names.ar}
                          onChange={(e) => setSubcategoryForm({ ...subcategoryForm, names: { ...subcategoryForm.names, ar: e.target.value } })}
                          className="p-2.5 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-bold text-stone-400 font-mono">French Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Chaussures de Course"
                          value={subcategoryForm.names.fr}
                          onChange={(e) => setSubcategoryForm({ ...subcategoryForm, names: { ...subcategoryForm.names, fr: e.target.value } })}
                          className="p-2.5 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none text-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="flex flex-col gap-1 col-span-2">
                        <label className="text-[10px] uppercase font-bold text-stone-400 font-mono">Recommended/Allowed Materials (Comma-separated)</label>
                        <input
                          type="text"
                          placeholder="e.g. Polyester, Mesh, Rubber"
                          value={subcategoryForm.recommendedMaterials}
                          onChange={(e) => setSubcategoryForm({ ...subcategoryForm, recommendedMaterials: e.target.value })}
                          className="p-2.5 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    {/* Sizing Matrix System */}
                    <div className="border-t border-stone-200 dark:border-slate-800 pt-3">
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="checkbox"
                          id="sizeSystemEnabledTable"
                          checked={subcategoryForm.sizeSystemEnabled}
                          onChange={(e) => setSubcategoryForm({ ...subcategoryForm, sizeSystemEnabled: e.target.checked })}
                          className="w-4 h-4 cursor-pointer"
                        />
                        <label htmlFor="sizeSystemEnabledTable" className="text-[11px] font-black text-slate-800 dark:text-slate-200 cursor-pointer select-none">
                          Enable Sizing System Blueprint Matrix
                        </label>
                      </div>

                      {subcategoryForm.sizeSystemEnabled && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-6">
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] uppercase font-bold text-stone-400 font-mono">Sizing Title Label</label>
                            <input
                              type="text"
                              placeholder="e.g. Shoes Size (EU)"
                              value={subcategoryForm.sizeSystemLabel}
                              onChange={(e) => setSubcategoryForm({ ...subcategoryForm, sizeSystemLabel: e.target.value })}
                              className="p-2 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none text-slate-900 dark:text-white"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] uppercase font-bold text-stone-400 font-mono">Available Matrix Dimensions (Comma-separated)</label>
                            <input
                              type="text"
                              placeholder="e.g. 38, 39, 40, 41, 42, 43"
                              value={subcategoryForm.sizeSystemSizes}
                              onChange={(e) => setSubcategoryForm({ ...subcategoryForm, sizeSystemSizes: e.target.value })}
                              className="p-2 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none text-slate-900 dark:text-white"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Specifications field designer */}
                    <div className="border-t border-stone-200 dark:border-slate-800 pt-3">
                      <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wide block mb-2">
                        Custom Schema Blueprints ({subcategoryForm.fields.length})
                      </span>

                      <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto bg-stone-50 dark:bg-slate-950 p-3 rounded-2xl mb-3">
                        {subcategoryForm.fields.map((f, fidx) => (
                          <div key={fidx} className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border border-stone-150 dark:border-slate-800/60">
                            <div className="text-left">
                              <span className="text-xs font-extrabold text-slate-800 dark:text-white">{f.name}</span>
                              <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-stone-100 dark:bg-slate-800 text-stone-500 font-bold uppercase font-mono">
                                {f.type} {f.required ? "• Required" : ""}
                              </span>
                              {f.unit && <span className="ml-2 text-[10px] text-stone-400 font-bold font-mono">Unit: {f.unit}</span>}
                              {f.options && <span className="ml-2 text-[9.5px] text-amber-600 font-bold block">Options: {f.options.join(", ")}</span>}
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setSubcategoryForm({
                                  ...subcategoryForm,
                                  fields: subcategoryForm.fields.filter((_, idx) => idx !== fidx)
                                });
                              }}
                              className="p-1 rounded text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/25"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="p-3 rounded-2xl bg-stone-50 dark:bg-slate-950 border border-stone-150 dark:border-slate-800/60 flex flex-col gap-2">
                        <span className="text-[10px] font-bold text-stone-500 uppercase font-mono block">Define Blueprint Spec Field</span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <input
                            type="text"
                            placeholder="Field Name (e.g. Battery Capacity)"
                            value={newSpecField.name}
                            onChange={(e) => setNewSpecField({ ...newSpecField, name: e.target.value })}
                            className="p-2 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none text-slate-900 dark:text-white"
                          />
                          <select
                            value={newSpecField.type}
                            onChange={(e) => setNewSpecField({ ...newSpecField, type: e.target.value as any })}
                            className="p-2 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white cursor-pointer"
                          >
                            <option value="text">Text Input</option>
                            <option value="number">Numeric Value</option>
                            <option value="boolean">Yes/No Toggle</option>
                            <option value="select">Dropdown Menu</option>
                          </select>
                          <div className="flex items-center gap-1.5 pl-2">
                            <input
                              type="checkbox"
                              id="newSpecFieldRequiredTable"
                              checked={newSpecField.required}
                              onChange={(e) => setNewSpecField({ ...newSpecField, required: e.target.checked })}
                              className="w-4 h-4 cursor-pointer"
                            />
                            <label htmlFor="newSpecFieldRequiredTable" className="text-[10.5px] font-bold text-slate-600 dark:text-slate-350 cursor-pointer select-none">
                              Field Required?
                            </label>
                          </div>
                        </div>

                        {newSpecField.type === "select" && (
                          <input
                            type="text"
                            placeholder="Options list (Comma-separated e.g. lithium, polymer, alkaline)"
                            value={newSpecField.options}
                            onChange={(e) => setNewSpecField({ ...newSpecField, options: e.target.value })}
                            className="p-2 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none text-slate-900 dark:text-white"
                          />
                        )}

                        {newSpecField.type === "number" && (
                          <input
                            type="text"
                            placeholder="Value unit metric (e.g. mAh, V, Watt)"
                            value={newSpecField.unit}
                            onChange={(e) => setNewSpecField({ ...newSpecField, unit: e.target.value })}
                            className="p-2 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none text-slate-900 dark:text-white"
                          />
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            if (!newSpecField.name) {
                              alert("Please supply a valid field name.");
                              return;
                            }
                            const optsArr = newSpecField.options
                              ? newSpecField.options.split(",").map(o => o.trim()).filter(Boolean)
                              : undefined;
                            
                            const addedField: CategoryTemplateField = {
                              name: newSpecField.name,
                              type: newSpecField.type,
                              required: newSpecField.required,
                              placeholder: newSpecField.placeholder || `Enter ${newSpecField.name}`,
                              options: optsArr,
                              unit: newSpecField.unit || undefined
                            };

                            setSubcategoryForm({
                              ...subcategoryForm,
                              fields: [...subcategoryForm.fields, addedField]
                            });

                            // Clear row
                            setNewSpecField({
                              name: "",
                              type: "text",
                              required: false,
                              options: "",
                              unit: "",
                              placeholder: ""
                            });
                          }}
                          className="px-3.5 py-2.5 self-end rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-amber-800 dark:text-amber-400 font-extrabold text-[10.5px] cursor-pointer"
                        >
                          + Save Field Blueprint to Schema
                        </button>
                      </div>
                    </div>

                    {/* Subcategory form submit actions */}
                    <div className="flex justify-end gap-2 pt-2 border-t border-amber-100 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddSubcategory(false);
                          setEditingSubcategory(null);
                        }}
                        className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          const formId = editingSubcategory ? editingSubcategory.id : subcategoryForm.id;
                          if (!formId || !subcategoryForm.names.en) {
                            alert("Please fill at least the English name and a unique key ID.");
                            return;
                          }

                          const finalNames = {
                            en: subcategoryForm.names.en,
                            ar: subcategoryForm.names.ar || subcategoryForm.names.en,
                            fr: subcategoryForm.names.fr || subcategoryForm.names.en,
                          };

                          const newSub: Subcategory = {
                            id: formId,
                            mainCategoryId: selectedMainCategoryId,
                            names: finalNames,
                            icon: subcategoryForm.icon,
                            image: subcategoryForm.image,
                            order: editingSubcategory ? editingSubcategory.order : subcategories.filter(s => s.mainCategoryId === selectedMainCategoryId).length,
                            sizeSystem: {
                              enabled: subcategoryForm.sizeSystemEnabled,
                              label: subcategoryForm.sizeSystemLabel,
                              sizes: subcategoryForm.sizeSystemSizes
                                ? subcategoryForm.sizeSystemSizes.split(",").map(s => s.trim()).filter(Boolean)
                                : []
                            },
                            recommendedMaterials: subcategoryForm.recommendedMaterials
                              ? subcategoryForm.recommendedMaterials.split(",").map(m => m.trim()).filter(Boolean)
                              : [],
                            fields: subcategoryForm.fields,
                            createdAt: editingSubcategory ? (editingSubcategory.createdAt || getCategoryCreatedAt(editingSubcategory)) : new Date().toISOString(),
                          };

                          await saveSubcategoryToFirestore(newSub);

                          if (editingSubcategory) {
                            setSubcategories(prev => prev.map(s => s.id === formId ? newSub : s));
                          } else {
                            setSubcategories(prev => [...prev, newSub]);
                          }

                          setShowAddSubcategory(false);
                          setEditingSubcategory(null);
                        }}
                        className="px-5 py-2 rounded-xl bg-amber-600 text-white font-black text-xs hover:bg-amber-700 cursor-pointer"
                      >
                        {editingSubcategory ? "Save Changes" : "Create Subcategory"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Subcategories Management Table */}
                <div className="overflow-x-auto rounded-2xl border border-stone-200 dark:border-slate-800 shadow-sm">
                  <table id="platform-admin-category-table" className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900 border-b border-stone-200 dark:border-slate-800 text-stone-500 dark:text-slate-400 uppercase tracking-wider font-mono text-[10px] font-bold">
                        <th className="px-5 py-3.5 font-semibold">Unique Key</th>
                        <th 
                          className="px-5 py-3.5 font-semibold cursor-pointer select-none hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
                          onClick={() => handleCatSort("name")}
                        >
                          <div className="flex items-center gap-1">
                            Category Name
                            {catSortField === "name" ? (catSortOrder === "asc" ? " ▲" : " ▼") : " ↕"}
                          </div>
                        </th>
                        <th className="px-5 py-3.5 font-semibold">Arabic Name</th>
                        <th className="px-5 py-3.5 font-semibold">French Name</th>
                        <th className="px-5 py-3.5 font-semibold">Parent Department</th>
                        <th 
                          className="px-5 py-3.5 font-semibold cursor-pointer select-none hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
                          onClick={() => handleCatSort("date")}
                        >
                          <div className="flex items-center gap-1">
                            Created Date
                            {catSortField === "date" ? (catSortOrder === "asc" ? " ▲" : " ▼") : " ↕"}
                          </div>
                        </th>
                        <th className="px-5 py-3.5 font-semibold">Sizing Matrix</th>
                        <th className="px-5 py-3.5 font-semibold">Blueprint Specs Schema</th>
                        <th className="px-5 py-3.5 font-semibold text-center">Sort Order</th>
                        <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-150 dark:divide-slate-800/60">
                      {[...subcategories]
                        .filter(sub => {
                          // Filter by selected parent department
                          if (subCatDeptFilter !== "all" && sub.mainCategoryId !== subCatDeptFilter) {
                            return false;
                          }
                          // Filter by search query
                          const search = subCatSearch.toLowerCase().trim();
                          if (!search) return true;
                          return (
                            sub.id.toLowerCase().includes(search) ||
                            (sub.names.en || "").toLowerCase().includes(search) ||
                            (sub.names.ar || "").toLowerCase().includes(search) ||
                            (sub.names.fr || "").toLowerCase().includes(search) ||
                            (sub.recommendedMaterials || []).some(m => m.toLowerCase().includes(search)) ||
                            (sub.fields || []).some(f => f.name.toLowerCase().includes(search))
                          );
                        })
                        .sort((a, b) => {
                          if (!catSortField) return 0;
                          if (catSortField === "name") {
                            const nameA = (a.names.en || "").toLowerCase();
                            const nameB = (b.names.en || "").toLowerCase();
                            if (nameA < nameB) return catSortOrder === "asc" ? -1 : 1;
                            if (nameA > nameB) return catSortOrder === "asc" ? 1 : -1;
                            return 0;
                          } else {
                            const dateA = new Date(getCategoryCreatedAt(a)).getTime();
                            const dateB = new Date(getCategoryCreatedAt(b)).getTime();
                            return catSortOrder === "asc" ? dateA - dateB : dateB - dateA;
                          }
                        })
                        .map((sub, idx, arr) => {
                          const parentCat = mainCategories.find(c => c.id === sub.mainCategoryId);
                          const parentName = parentCat ? parentCat.names.en : sub.mainCategoryId;
                          return (
                            <tr 
                              key={sub.id}
                              className="bg-white dark:bg-slate-950/20 hover:bg-slate-50/60 dark:hover:bg-slate-900/30 transition-colors"
                            >
                              <td className="px-5 py-3 font-mono text-[11px] font-bold text-slate-500 dark:text-slate-400">
                                {sub.id}
                              </td>
                              <td className="px-5 py-3 font-black text-slate-900 dark:text-white">
                                {sub.names.en}
                              </td>
                              <td className="px-5 py-3 font-black text-slate-900 dark:text-white" dir="rtl">
                                {sub.names.ar}
                              </td>
                              <td className="px-5 py-3 text-stone-600 dark:text-slate-300">
                                {sub.names.fr || "—"}
                              </td>
                              <td className="px-5 py-3">
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400 border border-indigo-100/50">
                                  {parentName}
                                </span>
                              </td>
                              <td className="px-5 py-3 font-mono text-[11px] text-stone-600 dark:text-slate-300">
                                {formatDate(getCategoryCreatedAt(sub))}
                              </td>
                              <td className="px-5 py-3">
                                {sub.sizeSystem?.enabled ? (
                                  <div className="flex flex-col gap-0.5 text-left">
                                    <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400">
                                      {sub.sizeSystem.label}
                                    </span>
                                    <span className="text-[9.5px] font-mono text-stone-400 leading-none">
                                      {(sub.sizeSystem.sizes || []).join(", ")}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-stone-400 italic text-[10px]">Disabled</span>
                                )}
                              </td>
                              <td className="px-5 py-3">
                                <div className="flex flex-col gap-1 max-w-[200px]">
                                  {sub.recommendedMaterials && sub.recommendedMaterials.length > 0 && (
                                    <div className="text-[10px] text-stone-400 leading-tight">
                                      <span className="font-bold text-stone-500">Materials: </span>
                                      {sub.recommendedMaterials.join(", ")}
                                    </div>
                                  )}
                                  {sub.fields && sub.fields.length > 0 && (
                                    <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                                      <span className="font-bold text-amber-600 dark:text-amber-400">Fields: </span>
                                      {sub.fields.map(f => f.name).join(", ")}
                                    </div>
                                  )}
                                  {(!sub.recommendedMaterials?.length && !sub.fields?.length) && (
                                    <span className="text-stone-400 italic text-[10px]">No Custom Blueprints</span>
                                  )}
                                </div>
                              </td>
                              <td className="px-5 py-3">
                                <div className="flex items-center justify-center gap-1">
                                  <button
                                    type="button"
                                    disabled={idx === 0}
                                    onClick={async () => {
                                      const originalIdx = subcategories.findIndex(s => s.id === sub.id);
                                      if (originalIdx > 0) {
                                        const newList = [...subcategories];
                                        const [temp] = newList.splice(originalIdx, 1);
                                        newList.splice(originalIdx - 1, 0, temp);
                                        setSubcategories(newList);
                                        await saveReorderedSubcategoriesToFirestore(newList);
                                      }
                                    }}
                                    className="p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-slate-800 disabled:opacity-30 text-stone-500"
                                    title="Move Up"
                                  >
                                    <ArrowUp className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={idx === arr.length - 1}
                                    onClick={async () => {
                                      const originalIdx = subcategories.findIndex(s => s.id === sub.id);
                                      if (originalIdx !== -1 && originalIdx < subcategories.length - 1) {
                                        const newList = [...subcategories];
                                        const [temp] = newList.splice(originalIdx, 1);
                                        newList.splice(originalIdx + 1, 0, temp);
                                        setSubcategories(newList);
                                        await saveReorderedSubcategoriesToFirestore(newList);
                                      }
                                    }}
                                    className="p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-slate-800 disabled:opacity-30 text-stone-500"
                                    title="Move Down"
                                  >
                                    <ArrowDown className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                              <td className="px-5 py-3 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingSubcategory(sub);
                                      setSelectedMainCategoryId(sub.mainCategoryId);
                                      setSubcategoryForm({
                                        id: sub.id,
                                        names: sub.names,
                                        icon: sub.icon,
                                        image: sub.image,
                                        sizeSystemEnabled: sub.sizeSystem?.enabled || false,
                                        sizeSystemLabel: sub.sizeSystem?.label || "Sizes Available",
                                        sizeSystemSizes: (sub.sizeSystem?.sizes || []).join(", "),
                                        recommendedMaterials: (sub.recommendedMaterials || []).join(", "),
                                        fields: sub.fields || []
                                      });
                                      setShowAddSubcategory(true);
                                    }}
                                    className="p-2 rounded-xl text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20 border border-transparent hover:border-amber-100 dark:hover:border-amber-900/30"
                                    title="Edit Subcategory"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSafeDeleteSubcategory(sub);
                                      setSafeDeleteAction("archive");
                                      setSafeDeleteTargetId(subcategories.find(s => s.id !== sub.id && s.mainCategoryId === sub.mainCategoryId)?.id || "");
                                    }}
                                    className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 border border-transparent hover:border-rose-100 dark:hover:border-rose-900/30"
                                    title="Remove Subcategory"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      {subcategories.filter(sub => {
                        if (subCatDeptFilter !== "all" && sub.mainCategoryId !== subCatDeptFilter) {
                          return false;
                        }
                        const search = subCatSearch.toLowerCase().trim();
                        if (!search) return true;
                        return (
                          sub.id.toLowerCase().includes(search) ||
                          (sub.names.en || "").toLowerCase().includes(search) ||
                          (sub.names.ar || "").toLowerCase().includes(search) ||
                          (sub.names.fr || "").toLowerCase().includes(search)
                        );
                      }).length === 0 && (
                        <tr>
                          <td colSpan={10} className="py-12 text-center text-stone-400 dark:text-slate-500 font-bold text-xs">
                            No subcategories match your search filter criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}            {/* SAFE DELETE MODAL FOR MAIN CATEGORY */}
            {safeDeleteMainCategory && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-stone-200 dark:border-slate-800 max-w-md w-full shadow-2xl flex flex-col gap-4 text-left">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5 text-rose-600">
                    <AlertTriangle className="w-5 h-5 text-rose-500 animate-pulse" />
                    Safe Category Delete Guard
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-slate-400 leading-normal font-bold">
                    You are deleting the Main Category <span className="text-indigo-600 dark:text-indigo-400 font-black">"{safeDeleteMainCategory.names[currentLanguage] || safeDeleteMainCategory.names.en}"</span>.
                    Please select a safe policy to preserve references:
                  </p>

                  <div className="flex flex-col gap-2 pt-2">
                    <label className="flex items-center gap-2.5 p-3 rounded-2xl border border-stone-150 dark:border-slate-800 bg-stone-50/55 dark:bg-slate-950/50 cursor-pointer">
                      <input
                        type="radio"
                        name="safeDeletePolicyMain"
                        value="archive"
                        checked={safeDeleteAction === "archive"}
                        onChange={() => setSafeDeleteAction("archive")}
                        className="w-4 h-4"
                      />
                      <div className="text-left">
                        <span className="text-xs font-black text-slate-800 dark:text-slate-200 block">Archive Category</span>
                        <span className="text-[10px] text-stone-400 dark:text-slate-500 font-semibold block">Hides the category from selection menus but keeps historical references intact.</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-2.5 p-3 rounded-2xl border border-stone-150 dark:border-slate-800 bg-stone-50/55 dark:bg-slate-950/50 cursor-pointer">
                      <input
                        type="radio"
                        name="safeDeletePolicyMain"
                        value="move"
                        checked={safeDeleteAction === "move"}
                        onChange={() => setSafeDeleteAction("move")}
                        className="w-4 h-4"
                      />
                      <div className="text-left w-full">
                        <span className="text-xs font-black text-slate-800 dark:text-slate-200 block">Move Subcategories to Department</span>
                        <span className="text-[10px] text-stone-400 dark:text-slate-500 font-semibold block mb-2">Re-assign all subcategories of this department to a target category.</span>
                        {safeDeleteAction === "move" && (
                          <select
                            value={safeDeleteTargetId}
                            onChange={(e) => setSafeDeleteTargetId(e.target.value)}
                            className="w-full p-2 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                          >
                            {mainCategories.filter(c => c.id !== safeDeleteMainCategory.id).map(c => (
                              <option key={c.id} value={c.id}>{c.names[currentLanguage] || c.names.en}</option>
                            ))}
                          </select>
                        )}
                      </div>
                    </label>
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-stone-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setSafeDeleteMainCategory(null)}
                      className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 text-stone-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        if (!safeDeleteMainCategory) return;
                        try {
                          await deleteMainCategoryFromFirestore(safeDeleteMainCategory.id, {
                            action: safeDeleteAction,
                            targetMainCategoryId: safeDeleteAction === "move" ? safeDeleteTargetId : undefined
                          });
                          // Update local state
                          if (safeDeleteAction === "archive") {
                            setMainCategories(prev => prev.filter(c => c.id !== safeDeleteMainCategory.id));
                            setSubcategories(prev => prev.filter(s => s.mainCategoryId !== safeDeleteMainCategory.id));
                          } else {
                            setMainCategories(prev => prev.filter(c => c.id !== safeDeleteMainCategory.id));
                            setSubcategories(prev => prev.map(s => s.mainCategoryId === safeDeleteMainCategory.id ? { ...s, mainCategoryId: safeDeleteTargetId } : s));
                          }
                          setSafeDeleteMainCategory(null);
                        } catch (e) {
                          alert("Error executing safe delete on Main Category.");
                        }
                      }}
                      className="px-5 py-2 rounded-xl bg-rose-600 text-white font-extrabold text-xs cursor-pointer hover:bg-rose-700 transition-all"
                    >
                      Confirm Delete
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SAFE DELETE MODAL FOR SUBCATEGORY */}
            {safeDeleteSubcategory && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-stone-200 dark:border-slate-800 max-w-md w-full shadow-2xl flex flex-col gap-4 text-left">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5 text-rose-600">
                    <AlertTriangle className="w-5 h-5 text-rose-500 animate-pulse" />
                    Safe Subcategory Delete Guard
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-slate-400 leading-normal font-bold">
                    You are deleting the Subcategory <span className="text-amber-600 dark:text-amber-400 font-black">"{safeDeleteSubcategory.names[currentLanguage] || safeDeleteSubcategory.names.en}"</span>.
                    Please select a safe policy to preserve references:
                  </p>

                  <div className="flex flex-col gap-2 pt-2">
                    <label className="flex items-center gap-2.5 p-3 rounded-2xl border border-stone-150 dark:border-slate-800 bg-stone-50/55 dark:bg-slate-950/50 cursor-pointer">
                      <input
                        type="radio"
                        name="safeDeletePolicySub"
                        value="archive"
                        checked={safeDeleteAction === "archive"}
                        onChange={() => setSafeDeleteAction("archive")}
                        className="w-4 h-4"
                      />
                      <div className="text-left">
                        <span className="text-xs font-black text-slate-800 dark:text-slate-200 block">Archive Subcategory</span>
                        <span className="text-[10px] text-stone-400 dark:text-slate-500 font-semibold block">Hides the subcategory from selection menus but keeps historical references intact.</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-2.5 p-3 rounded-2xl border border-stone-150 dark:border-slate-800 bg-stone-50/55 dark:bg-slate-950/50 cursor-pointer">
                      <input
                        type="radio"
                        name="safeDeletePolicySub"
                        value="move"
                        checked={safeDeleteAction === "move"}
                        onChange={() => setSafeDeleteAction("move")}
                        className="w-4 h-4"
                      />
                      <div className="text-left w-full">
                        <span className="text-xs font-black text-slate-800 dark:text-slate-200 block">Move Products to Subcategory</span>
                        <span className="text-[10px] text-stone-400 dark:text-slate-500 font-semibold block mb-2">Re-assign all existing store products under this subcategory to another active target.</span>
                        {safeDeleteAction === "move" && (
                          <select
                            value={safeDeleteTargetId}
                            onChange={(e) => setSafeDeleteTargetId(e.target.value)}
                            className="w-full p-2 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                          >
                            {subcategories.filter(s => s.id !== safeDeleteSubcategory.id).map(s => (
                              <option key={s.id} value={s.id}>{s.names[currentLanguage] || s.names.en}</option>
                            ))}
                          </select>
                        )}
                      </div>
                    </label>
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-stone-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setSafeDeleteSubcategory(null)}
                      className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 text-stone-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        if (!safeDeleteSubcategory) return;
                        try {
                          // Create list of all products from all stores
                          const allProducts: any[] = [];
                          stores.forEach(st => {
                            if (st.products) {
                              st.products.forEach(p => {
                                allProducts.push({ ...p, storeId: st.id });
                              });
                            }
                          });

                          const onUpdateProductCategory = (prodId: string, nextSubId: string) => {
                            setStores(prevStores => prevStores.map(store => {
                              if (store.products) {
                                return {
                                  ...store,
                                  products: store.products.map(p => p.id === prodId ? { ...p, category: nextSubId, subcategory: nextSubId } : p)
                                };
                              }
                              return store;
                            }));
                          };

                          await deleteSubcategoryFromFirestore(
                            safeDeleteSubcategory.id,
                            {
                              action: safeDeleteAction,
                              targetSubcategoryId: safeDeleteAction === "move" ? safeDeleteTargetId : undefined
                            },
                            allProducts,
                            onUpdateProductCategory
                          );

                          // Update local state
                          setSubcategories(prev => prev.filter(s => s.id !== safeDeleteSubcategory.id));
                          setSafeDeleteSubcategory(null);
                        } catch (e) {
                          alert("Error executing safe delete on Subcategory.");
                        }
                      }}
                      className="px-5 py-2 rounded-xl bg-rose-600 text-white font-extrabold text-xs cursor-pointer hover:bg-rose-700 transition-all"
                    >
                      Confirm Delete
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
      </div>

    </div>
  );
}
