import React, { useState, useEffect, useMemo, useContext } from "react";
import { 
  Plus, 
  Trash2, 
  Sparkles, 
  CheckCircle, 
  ChevronDown, 
  Palette,
  Image,
  Layers,
  Check
} from "lucide-react";
import { CategoryTemplate, MainCategory, Subcategory } from "../types";
import { fetchBrandsFromFirestore } from "../utils/brandsStore";
import { SkeuomorphicSwitch } from "./SkeuomorphicSwitch";
import DiamondDecorativeDivider from "./DiamondDecorativeDivider";
import { DEFAULT_MAIN_CATEGORIES, DEFAULT_SUBCATEGORIES } from "../utils/categoriesStore";
import { DEFAULT_CATEGORY_TEMPLATES } from "../data/categoryTemplates";

const PALETTE_COLORS = [
  { name: "Terracotta Rouge", hex: "#c2410c" },
  { name: "Sahara Sand Gold", hex: "#d97706" },
  { name: "Casbah Blue", hex: "#1e3a8a" },
  { name: "Atlas Forest Green", hex: "#065f46" },
  { name: "Moorish Purple", hex: "#6b21a8" },
  { name: "Charcoal Black", hex: "#1f2937" },
  { name: "Pearl White", hex: "#f3f4f6" },
  { name: "Natural Ecru", hex: "#fcf8f2" }
];

const MEASUREMENT_UNITS = [
  { value: "pieces", label: "Pieces (pcs)" },
  { value: "grams", label: "Grams (g)" },
  { value: "kg", label: "Kilograms (kg)" },
  { value: "ml", label: "Milliliters (ml)" },
  { value: "liters", label: "Liters (L)" },
  { value: "pairs", label: "Pairs" },
  { value: "sets", label: "Sets" },
  { value: "packs", label: "Packs" },
  { value: "meters", label: "Meters (m)" },
  { value: "boxes", label: "Boxes" }
];

const getRecommendedUnitForCategory = (categoryId: string): string => {
  const normId = (categoryId || "").toLowerCase();
  if (normId.includes("food") || normId.includes("grocery") || normId.includes("terroir")) {
    return "grams";
  }
  if (normId.includes("cosmetics") || normId.includes("beauty")) {
    return "ml";
  }
  if (normId.includes("fashion") || normId.includes("clothing") || normId.includes("shoes")) {
    return "pieces";
  }
  if (normId.includes("electronics")) {
    return "pieces";
  }
  return "pieces";
};

const ShowHintsContext = React.createContext<boolean>(false);

const HintTooltip = ({ text, currentSlideColor }: { text: string; currentSlideColor: string }) => {
  const showHints = useContext(ShowHintsContext);
  if (!showHints) return null;
  return (
    <span className="relative group/tooltip inline-flex items-center justify-center cursor-help ml-1.5 align-middle select-none shrink-0">
      <svg
        className="w-3.5 h-3.5 text-slate-400 hover:text-rose-500 transition-colors"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
      <span 
        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 scale-0 group-hover/tooltip:scale-100 transition-all duration-200 origin-bottom p-2.5 rounded-xl shadow-xl pointer-events-none leading-relaxed z-[9999] text-[11px] font-medium text-white text-center font-sans normal-case block"
        style={{ backgroundColor: currentSlideColor }}
      >
        {text}
        <span 
          className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent"
          style={{ borderTopColor: currentSlideColor }}
        />
      </span>
    </span>
  );
};

interface WizardStep4SpecsProps {
  currentSlideColor: string;
  blankProductCategory: string;
  setBlankProductCategory: (category: string) => void;
  setBlankProductSku?: (sku: string) => void;
  profSkuPrefix?: string;
  categoryTemplates?: CategoryTemplate[];
  mainCategories?: MainCategory[];
  subcategories?: Subcategory[];
  wizardProductSizes: string[];
  setWizardProductSizes: (s: string[]) => void;
  wizardProductSpecs: Array<{ key: string; value: string }>;
  setWizardProductSpecs: (specs: Array<{ key: string; value: string }>) => void;
  wizardVariantsEnabled: boolean;
  setWizardVariantsEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  wizardVariantAttrs: Array<{ name: string; tags: string[] }>;
  setWizardVariantAttrs: React.Dispatch<React.SetStateAction<Array<{ name: string; tags: string[] }>>>;
  wizardAttrInputText: Record<string, string>;
  setWizardAttrInputText: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  wizardProductVariants: any[];
  setWizardProductVariants: React.Dispatch<React.SetStateAction<any[]>>;
  wizardImages: string[];
  blankProductSku: string;
  blankProductPrice: number;
  wizardBundleEnabled: boolean;
  setWizardBundleEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  wizardBundleItems: Array<{ name: string; quantity: number }>;
  setWizardBundleItems: React.Dispatch<React.SetStateAction<Array<{ name: string; quantity: number }>>>;
  wizardBundlePrice: number;
  setWizardBundlePrice: (p: number) => void;
  currentLanguage?: "en" | "ar" | "fr";
  wizardShowHints?: boolean;
  setWizardShowHints?: (v: boolean) => void;
}

export default function WizardStep4Specs({
  currentSlideColor,
  blankProductCategory,
  setBlankProductCategory,
  setBlankProductSku,
  profSkuPrefix,
  categoryTemplates = [],
  mainCategories = [],
  subcategories = [],
  wizardProductSizes,
  setWizardProductSizes,
  wizardProductSpecs,
  setWizardProductSpecs,
  wizardVariantsEnabled,
  setWizardVariantsEnabled,
  wizardVariantAttrs,
  setWizardVariantAttrs,
  wizardAttrInputText,
  setWizardAttrInputText,
  wizardProductVariants,
  setWizardProductVariants,
  wizardImages = [],
  blankProductSku,
  blankProductPrice,
  wizardBundleEnabled,
  setWizardBundleEnabled,
  wizardBundleItems,
  setWizardBundleItems,
  wizardBundlePrice,
  setWizardBundlePrice,
  currentLanguage = "en",
  wizardShowHints = false,
  setWizardShowHints = () => {}
}: WizardStep4SpecsProps) {
  // Safe fallbacks for data sources
  const effectiveMainCategories = useMemo(() => {
    return mainCategories && mainCategories.length > 0 ? mainCategories : DEFAULT_MAIN_CATEGORIES;
  }, [mainCategories]);

  const effectiveSubcategories = useMemo(() => {
    return subcategories && subcategories.length > 0 ? subcategories : DEFAULT_SUBCATEGORIES;
  }, [subcategories]);

  const effectiveCategoryTemplates = useMemo(() => {
    return categoryTemplates && categoryTemplates.length > 0 ? categoryTemplates : DEFAULT_CATEGORY_TEMPLATES;
  }, [categoryTemplates]);

  // Determine initial selected Main Category based on current subcategory
  const [selectedMainCategoryId, setSelectedMainCategoryId] = useState<string>(() => {
    if (!blankProductCategory) return "";
    const matchedSub = effectiveSubcategories.find(
      s => s.id === blankProductCategory || s.names.en.toLowerCase() === blankProductCategory.toLowerCase()
    );
    return matchedSub ? matchedSub.mainCategoryId : "";
  });

  // Sync selected Main Category if blankProductCategory changes externally
  useEffect(() => {
    if (blankProductCategory) {
      const matchedSub = effectiveSubcategories.find(
        s => s.id === blankProductCategory || s.names.en.toLowerCase() === blankProductCategory.toLowerCase()
      );
      if (matchedSub && matchedSub.mainCategoryId !== selectedMainCategoryId) {
        setSelectedMainCategoryId(matchedSub.mainCategoryId);
      }
    }
  }, [blankProductCategory, effectiveSubcategories, selectedMainCategoryId]);

  // Track dropdown open states
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Additional UI states
  const [showAdditionalAttributes, setShowAdditionalAttributes] = useState(false);
  const [showCustomMaterialInput, setShowCustomMaterialInput] = useState(false);
  const [customMaterialText, setCustomMaterialText] = useState("");
  const [brands, setBrands] = useState<any[]>([]);

  // Swatch manager states
  const [colorSwatches, setColorSwatches] = useState<Array<{ name: string; hex: string; images: string[] }>>([
    { name: "Terracotta Rouge", hex: "#c2410c", images: [] },
    { name: "Casbah Blue", hex: "#1e3a8a", images: [] }
  ]);
  const [customSwatchName, setCustomSwatchName] = useState("");
  const [customSwatchHex, setCustomSwatchHex] = useState("#3b82f6");

  // Load brands on mount
  useEffect(() => {
    const loadBrands = async () => {
      try {
        const data = await fetchBrandsFromFirestore();
        setBrands(data);
      } catch (err) {
        console.error("Error loading brands: ", err);
      }
    };
    loadBrands();
  }, []);

  // Resolve active template for selected subcategory
  const activeTemplate = useMemo(() => {
    if (!blankProductCategory) {
      return {
        id: "General",
        name: "General product",
        sizeSystem: { enabled: false, label: "Sizes available", sizes: [] },
        recommendedMaterials: ["Natural organic", "Recycled", "Handmade blend"],
        fields: []
      } as CategoryTemplate;
    }

    const foundSub = effectiveSubcategories.find(
      s => s.id === blankProductCategory || s.names.en.toLowerCase() === blankProductCategory.toLowerCase()
    );
    if (foundSub) {
      return {
        id: foundSub.id,
        name: foundSub.names[currentLanguage] || foundSub.names.en || foundSub.id,
        sizeSystem: foundSub.sizeSystem || { enabled: false, label: "Sizes available", sizes: [] },
        recommendedMaterials: foundSub.recommendedMaterials || [],
        fields: foundSub.fields || []
      } as CategoryTemplate;
    }

    const normalized = blankProductCategory.toLowerCase();
    const legacy = effectiveCategoryTemplates.find(
      t => t.id.toLowerCase() === normalized || normalized.includes(t.id.toLowerCase())
    );
    if (legacy) return legacy;

    return {
      id: "General",
      name: "General product",
      sizeSystem: { enabled: false, label: "Sizes available", sizes: [] },
      recommendedMaterials: ["Natural organic", "Recycled", "Handmade blend"],
      fields: []
    } as CategoryTemplate;
  }, [blankProductCategory, effectiveSubcategories, effectiveCategoryTemplates, currentLanguage]);

  // Handle Main Category selection change
  const handleMainCategorySelect = (mainCatId: string) => {
    setSelectedMainCategoryId(mainCatId);
    setBlankProductCategory(""); // Reset subcategory
    setWizardProductSpecs([]); // Reset specs
    setWizardProductSizes([]); // Reset sizes
    setWizardProductVariants([]); // Reset variants
    setWizardVariantAttrs([]); // Reset variant attributes
    setOpenDropdown(null);
  };

  // Handle Subcategory selection change
  const handleSubcategorySelect = (subId: string) => {
    setBlankProductCategory(subId);
    setOpenDropdown(null);

    const subObj = effectiveSubcategories.find(s => s.id === subId);
    if (subObj && setBlankProductSku) {
      const prefix = (subObj.names.en || "CRA").substring(0, 3).toUpperCase();
      const rand = Math.floor(100000 + Math.random() * 900000);
      setBlankProductSku(`${prefix}-${rand}`);
    }

    // Initialize specs for selected subcategory template
    const newSpecs: Array<{ key: string; value: string }> = [];
    const recommendedUnit = getRecommendedUnitForCategory(subId);
    newSpecs.push({ key: "Measurement unit", value: recommendedUnit });

    const fields = subObj?.fields || [];
    fields.forEach(f => {
      if (f.name.toLowerCase() === "material") {
        newSpecs.push({ key: f.name, value: subObj?.recommendedMaterials?.[0] || "" });
      } else if (f.type === "boolean") {
        newSpecs.push({ key: f.name, value: "false" });
      } else {
        newSpecs.push({ key: f.name, value: "" });
      }
    });

    setWizardProductSpecs(newSpecs);
  };

  // Specification getters & setters
  const getSpecValue = (key: string): string => {
    const item = wizardProductSpecs.find(s => s.key.toLowerCase() === key.toLowerCase());
    return item ? item.value : "";
  };

  const handleSpecChange = (key: string, value: string) => {
    const idx = wizardProductSpecs.findIndex(s => s.key.toLowerCase() === key.toLowerCase());
    if (idx !== -1) {
      const updated = [...wizardProductSpecs];
      updated[idx].value = value;
      setWizardProductSpecs(updated);
    } else {
      setWizardProductSpecs([...wizardProductSpecs, { key, value }]);
    }
  };

  // Toggle size selection
  const toggleSize = (sizeStr: string) => {
    if (wizardProductSizes.includes(sizeStr)) {
      setWizardProductSizes(wizardProductSizes.filter(s => s !== sizeStr));
    } else {
      setWizardProductSizes([...wizardProductSizes, sizeStr]);
    }
  };

  // Add color swatch
  const handleAddColorSwatch = (name: string, hex: string) => {
    if (!name.trim()) return;
    if (colorSwatches.some(c => c.name.toLowerCase() === name.trim().toLowerCase())) return;

    const newSwatches = [...colorSwatches, { name: name.trim(), hex, images: [] }];
    setColorSwatches(newSwatches);

    if (wizardVariantsEnabled) {
      const colorAttrIdx = wizardVariantAttrs.findIndex(a => a.name.toLowerCase() === "color");
      if (colorAttrIdx !== -1) {
        const updated = [...wizardVariantAttrs];
        if (!updated[colorAttrIdx].tags.some(t => t.toLowerCase() === name.trim().toLowerCase())) {
          updated[colorAttrIdx].tags.push(name.trim());
          setWizardVariantAttrs(updated);
        }
      } else {
        setWizardVariantAttrs([...wizardVariantAttrs, { name: "Color", tags: [name.trim()] }]);
      }
    }
    setCustomSwatchName("");
  };

  // Toggle image linking for color swatch
  const toggleImageForSwatch = (swatchIndex: number, imgUrl: string) => {
    const updated = [...colorSwatches];
    const currentImages = updated[swatchIndex].images || [];
    if (currentImages.includes(imgUrl)) {
      updated[swatchIndex].images = currentImages.filter(u => u !== imgUrl);
    } else {
      updated[swatchIndex].images = [...currentImages, imgUrl];
    }
    setColorSwatches(updated);
  };

  // Toggle image linking for variant combination item
  const toggleImageForVariant = (variantIndex: number, imgUrl: string) => {
    const updated = [...wizardProductVariants];
    const currentImages = updated[variantIndex].images || [];
    if (currentImages.includes(imgUrl)) {
      updated[variantIndex].images = currentImages.filter((u: string) => u !== imgUrl);
    } else {
      updated[variantIndex].images = [...currentImages, imgUrl];
    }
    setWizardProductVariants(updated);
  };

  // Generate variant combinations
  const handleGenerateCombinations = () => {
    const validAttrs = wizardVariantAttrs.filter(a => a.name.trim() && a.tags.length > 0);
    if (validAttrs.length === 0) {
      setWizardProductVariants([]);
      return;
    }

    const combinations: any[] = [];

    const generate = (attrIndex: number, currentOptions: Record<string, string>) => {
      if (attrIndex === validAttrs.length) {
        const optionParts = Object.entries(currentOptions).map(([k, v]) => `${v}`);
        const skuTag = optionParts.join("-").toUpperCase().replace(/\s+/g, "");
        const colorVal = currentOptions["Color"] || currentOptions["color"] || "";
        const matchedSwatch = colorSwatches.find(s => s.name.toLowerCase() === colorVal.toLowerCase());

        combinations.push({
          id: `var-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          sku: `${blankProductSku || "PROD"}-${skuTag}`,
          price: blankProductPrice || 0,
          stock: 10,
          options: { ...currentOptions },
          images: matchedSwatch?.images ? [...matchedSwatch.images] : []
        });
        return;
      }

      const currentAttr = validAttrs[attrIndex];
      currentAttr.tags.forEach(tag => {
        generate(attrIndex + 1, { ...currentOptions, [currentAttr.name]: tag });
      });
    };

    generate(0, {});
    setWizardProductVariants(combinations);
  };

  // Render single field input
  const renderField = (field: { name: string; type: string; required?: boolean; options?: string[]; placeholder?: string; unit?: string }) => {
    const label = field.name;
    const value = getSpecValue(label);

    if (field.type === "select" && field.options && field.options.length > 0) {
      return (
        <div key={label} className="flex flex-col gap-1.5">
          <label className="text-xs font-black block font-mono" style={{ fontSize: "11px", color: "#1e1e1e" }}>
            <span>{label}</span> {field.required && <span className="text-rose-500">*</span>}
          </label>
          <select
            value={value}
            onChange={(e) => handleSpecChange(label, e.target.value)}
            className="w-full text-xs font-sans p-3 border rounded-[7px] font-bold text-black bg-white"
            style={{ borderColor: "#c8cdcd", borderRadius: "7px" }}
          >
            <option value="">{field.placeholder || `Select ${label.toLowerCase()}`}</option>
            {field.options.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      );
    }

    if (field.type === "boolean") {
      const isChecked = value === "true";
      return (
        <div key={label} className="flex items-center justify-between p-3 border bg-white rounded-[7px]" style={{ borderColor: "#c8cdcd" }}>
          <label className="text-xs font-black font-mono" style={{ fontSize: "11px", color: "#1e1e1e" }}>
            <span>{label}</span>
          </label>
          <SkeuomorphicSwitch
            checked={isChecked}
            onChange={(val) => handleSpecChange(label, val ? "true" : "false")}
          />
        </div>
      );
    }

    return (
      <div key={label} className="flex flex-col gap-1.5">
        <label className="text-xs font-black block font-mono" style={{ fontSize: "11px", color: "#1e1e1e" }}>
          <span>{label}</span> {field.required && <span className="text-rose-500">*</span>}
        </label>
        <div className="relative flex items-center">
          <input
            type={field.type === "number" ? "number" : "text"}
            value={value}
            onChange={(e) => handleSpecChange(label, e.target.value)}
            placeholder={field.placeholder || `Enter ${label.toLowerCase()}`}
            className="w-full text-xs font-sans p-3 border rounded-[7px] font-bold text-black bg-white"
            style={{ borderColor: "#c8cdcd", borderRadius: "7px" }}
          />
          {field.unit && (
            <span className="absolute right-3 text-xs font-mono font-bold text-slate-400">
              {field.unit}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <ShowHintsContext.Provider value={wizardShowHints}>
      <div className="space-y-6 text-left">
        {/* Step Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h3 className="text-sm font-black text-slate-900 font-mono tracking-tight" style={{ color: "#1e1e1e" }}>
              Step 3 — Category &amp; specifications
            </h3>
            <p className="text-[11px] font-medium text-slate-500">
              Select category, fill in relevant specifications, and configure product variants.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-transparent px-1 py-0.5 select-none shrink-0">
            <span className="text-[10px] font-bold font-mono text-slate-600">
              Hints
            </span>
            <SkeuomorphicSwitch
              checked={wizardShowHints}
              onChange={setWizardShowHints}
              title={wizardShowHints ? "Disable interactive guide help hints across all steps" : "Enable interactive guide help hints across all steps"}
            />
          </div>
        </div>

        {/* 1. MAIN CATEGORY SELECTION */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 mb-1 group/spec cursor-help">
            <label className="text-xs font-black block font-mono" style={{ fontSize: "11px", color: "#1e1e1e" }}>
              <span>Main category</span>
            </label>
            <HintTooltip text="Select the primary main category for your creation first." currentSlideColor={currentSlideColor} />
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === "mainCategory" ? null : "mainCategory")}
              className="w-full text-xs font-sans p-3 border rounded-[7px] focus:bg-white transition-all font-bold text-black flex items-center justify-between cursor-pointer bg-white"
              style={{ borderColor: "#c8cdcd", borderRadius: "7px", borderStyle: "solid", color: "#000000" }}
            >
              <span>
                {selectedMainCategoryId ? (
                  effectiveMainCategories.find(m => m.id === selectedMainCategoryId)?.names[currentLanguage] ||
                  effectiveMainCategories.find(m => m.id === selectedMainCategoryId)?.names.en ||
                  selectedMainCategoryId
                ) : (
                  "Select main category"
                )}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>

            {openDropdown === "mainCategory" && (
              <div 
                className="absolute left-0 top-full mt-1 w-full bg-white border border-slate-200 rounded-[7px] shadow-lg max-h-60 overflow-y-auto z-[9999]"
                style={{ borderColor: "#c8cdcd", backgroundColor: "#ffffff" }}
              >
                {effectiveMainCategories.map((mainCat) => (
                  <button
                    key={mainCat.id}
                    type="button"
                    onClick={() => handleMainCategorySelect(mainCat.id)}
                    className="w-full text-left px-4 py-2.5 text-xs font-semibold text-black hover:bg-slate-100 transition-colors bg-white cursor-pointer flex items-center gap-2"
                    style={{ color: "#000000", backgroundColor: "#ffffff" }}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentSlideColor }} />
                    {mainCat.names[currentLanguage] || mainCat.names.en}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Informative message if Main Category is not selected */}
        {!selectedMainCategoryId && (
          <div 
            className="p-4 border border-dashed text-center space-y-1 bg-slate-50/60"
            style={{ borderRadius: "7px", borderColor: "#cbd5e1" }}
          >
            <p className="text-xs font-bold text-slate-600 font-sans">
              Please select a main category above.
            </p>
            <p className="text-[11px] text-slate-400">
              Choosing a main category reveals subcategories and specifications tailored to your product.
            </p>
          </div>
        )}

        {/* 2. SUBCATEGORY SELECTION (Revealed when Main Category is selected) */}
        {selectedMainCategoryId && (
          <div className="space-y-2 animate-fade-in">
            <div className="flex items-center gap-1.5 mb-1 group/spec cursor-help">
              <label className="text-xs font-black block font-mono" style={{ fontSize: "11px", color: "#1e1e1e" }}>
                <span>Subcategory</span>
              </label>
              <HintTooltip text="Select the specific subcategory belonging to your chosen main category." currentSlideColor={currentSlideColor} />
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === "subcategory" ? null : "subcategory")}
                className="w-full text-xs font-sans p-3 border rounded-[7px] focus:bg-white transition-all font-bold text-black flex items-center justify-between cursor-pointer bg-white"
                style={{ borderColor: "#c8cdcd", borderRadius: "7px", borderStyle: "solid", color: "#000000" }}
              >
                <span>
                  {blankProductCategory ? (
                    effectiveSubcategories.find(s => s.id === blankProductCategory)?.names[currentLanguage] ||
                    effectiveSubcategories.find(s => s.id === blankProductCategory)?.names.en ||
                    blankProductCategory
                  ) : (
                    "Select subcategory"
                  )}
                </span>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </button>

              {openDropdown === "subcategory" && (
                <div 
                  className="absolute left-0 top-full mt-1 w-full bg-white border border-slate-200 rounded-[7px] shadow-lg max-h-60 overflow-y-auto z-[9999]"
                  style={{ borderColor: "#c8cdcd", backgroundColor: "#ffffff" }}
                >
                  {effectiveSubcategories
                    .filter(s => s.mainCategoryId === selectedMainCategoryId)
                    .map((subCat) => (
                      <button
                        key={subCat.id}
                        type="button"
                        onClick={() => handleSubcategorySelect(subCat.id)}
                        className="w-full text-left px-4 py-2.5 text-xs font-semibold text-black hover:bg-slate-100 transition-colors bg-white cursor-pointer"
                        style={{ color: "#000000", backgroundColor: "#ffffff" }}
                      >
                        {subCat.names[currentLanguage] || subCat.names.en}
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Informative message if Subcategory is not selected */}
        {selectedMainCategoryId && !blankProductCategory && (
          <div 
            className="p-4 border border-dashed text-center space-y-1 bg-slate-50/60"
            style={{ borderRadius: "7px", borderColor: "#cbd5e1" }}
          >
            <p className="text-xs font-bold text-slate-600 font-sans">
              Please select a subcategory.
            </p>
            <p className="text-[11px] text-slate-400">
              Selecting a subcategory unlocks specific attributes and variant choices for your item.
            </p>
          </div>
        )}

        {/* 3. DYNAMIC SPECIFICATIONS & VARIANTS (Revealed when Subcategory is selected) */}
        {selectedMainCategoryId && blankProductCategory && (
          <div className="space-y-6 animate-fade-in">
            {/* Sizing Layout if enabled */}
            {activeTemplate.sizeSystem.enabled && (
              <div className="space-y-2.5">
                <div className="flex items-center gap-1.5 mb-1.5 group/spec cursor-help">
                  <label className="text-xs font-black block font-mono" style={{ fontSize: "11px", color: "#1e1e1e" }}>
                    <span>{activeTemplate.sizeSystem.label}</span>
                  </label>
                  <HintTooltip text="Select available size options for your product." currentSlideColor={currentSlideColor} />
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeTemplate.sizeSystem.sizes.map((sz) => {
                    const isSelected = wizardProductSizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => toggleSize(sz)}
                        className="px-4 py-2.5 text-xs font-bold transition-all cursor-pointer border select-none duration-150 transform active:scale-95 flex items-center gap-1.5"
                        style={isSelected ? {
                          backgroundColor: `color-mix(in srgb, ${currentSlideColor} 5%, #ffffff)`,
                          borderColor: currentSlideColor,
                          borderWidth: "1.5px",
                          color: currentSlideColor,
                          borderRadius: "7px",
                          borderStyle: "solid"
                        } : {
                          backgroundColor: "#ffffff",
                          borderColor: "#c8cdcd",
                          borderWidth: "1px",
                          color: "#000000",
                          borderRadius: "7px",
                          borderStyle: "solid"
                        }}
                      >
                        {sz}
                        {isSelected && <CheckCircle className="w-3.5 h-3.5" style={{ color: currentSlideColor }} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Dynamic Specification Form */}
            {(() => {
              const excludedKeys = ["material", "color", "dimensions", "width", "height", "depth"];
              const requiredFields = (activeTemplate.fields || []).filter(
                f => !excludedKeys.includes(f.name.toLowerCase()) && f.required === true
              );
              const optionalFields = (activeTemplate.fields || []).filter(
                f => !excludedKeys.includes(f.name.toLowerCase()) && f.required !== true
              );

              return (
                <div className="space-y-5">
                  <DiamondDecorativeDivider className="my-2" />
                  
                  {/* Primary specifications */}
                  <div className="space-y-3">
                    <label className="text-xs font-black block font-mono" style={{ fontSize: "11.5px", color: "#1e1e1e" }}>
                      <span>Primary specifications</span>
                    </label>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Measurement Unit dropdown */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-black block font-mono" style={{ fontSize: "11px", color: "#1e1e1e" }}>
                          <span>Measurement unit</span>
                        </label>
                        <select
                          value={getSpecValue("Measurement unit")}
                          onChange={(e) => handleSpecChange("Measurement unit", e.target.value)}
                          className="w-full text-xs font-sans p-3 border rounded-[7px] font-bold text-black bg-white"
                          style={{ borderColor: "#c8cdcd", borderRadius: "7px" }}
                        >
                          <option value="">Select unit</option>
                          {MEASUREMENT_UNITS.map(u => (
                            <option key={u.value} value={u.value}>{u.label}</option>
                          ))}
                        </select>
                      </div>

                      {/* Required Template Fields */}
                      {requiredFields.map(field => renderField(field))}
                    </div>
                  </div>

                  {/* Additional attributes (optional) */}
                  {optionalFields.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAdditionalAttributes(!showAdditionalAttributes)}
                        className="flex items-center justify-between w-full text-xs font-black font-mono py-1 hover:opacity-80 transition-all text-left cursor-pointer"
                        style={{ color: "#1e1e1e" }}
                      >
                        <span className="flex items-center gap-1.5">
                          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showAdditionalAttributes ? "rotate-180" : ""}`} />
                          Additional attributes (optional)
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold lowercase">
                          {optionalFields.length} optional fields {showAdditionalAttributes ? "expanded" : "collapsed"}
                        </span>
                      </button>

                      {showAdditionalAttributes && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in pt-1">
                          {optionalFields.map(field => renderField(field))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Custom Attributes Section */}
            <DiamondDecorativeDivider className="my-2" />
            <div className="space-y-4">
              <label className="text-xs font-black block font-mono group/spec cursor-help" style={{ fontSize: "11.5px", color: "#1e1e1e" }}>
                <span>Custom attributes</span>
                <HintTooltip text="Add custom key-value specifications for unique details of your product." currentSlideColor={currentSlideColor} />
              </label>

              <div className="flex flex-col gap-2.5">
                {(() => {
                  const templateKeys = activeTemplate.fields.map(f => f.name.toLowerCase());
                  const excludedCustomKeys = ["material", "color", "dimensions", "measurement unit"];
                  const customSpecs = wizardProductSpecs.filter(
                    s => !templateKeys.includes(s.key.toLowerCase()) && 
                         !excludedCustomKeys.includes(s.key.toLowerCase())
                  );

                  if (customSpecs.length === 0) {
                    return <p className="text-[11px] text-slate-400 italic font-medium">No custom attributes added yet.</p>;
                  }

                  return wizardProductSpecs.map((spec, idx) => {
                    const isPredefined = templateKeys.includes(spec.key.toLowerCase()) || excludedCustomKeys.includes(spec.key.toLowerCase());
                    if (isPredefined) return null;

                    return (
                      <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-5">
                          <input
                            type="text"
                            value={spec.key}
                            onChange={(e) => {
                              const newSpecs = [...wizardProductSpecs];
                              newSpecs[idx].key = e.target.value;
                              setWizardProductSpecs(newSpecs);
                            }}
                            placeholder="Attribute name"
                            className="w-full text-xs font-sans p-3 border rounded-[7px] focus:bg-white font-bold text-black bg-white"
                            style={{ borderColor: "#c8cdcd", borderRadius: "7px" }}
                          />
                        </div>
                        <div className="col-span-5">
                          <input
                            type="text"
                            value={spec.value}
                            onChange={(e) => {
                              const newSpecs = [...wizardProductSpecs];
                              newSpecs[idx].value = e.target.value;
                              setWizardProductSpecs(newSpecs);
                            }}
                            placeholder="Attribute value"
                            className="w-full text-xs font-sans p-3 border rounded-[7px] focus:bg-white font-bold text-black bg-white"
                            style={{ borderColor: "#c8cdcd", borderRadius: "7px" }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setWizardProductSpecs(wizardProductSpecs.filter((_, i) => i !== idx))}
                          className="col-span-2 p-3 bg-rose-50 hover:bg-rose-100 text-rose-600 transition-all flex items-center justify-center cursor-pointer font-bold border border-rose-200"
                          style={{ borderRadius: "7px", height: "42px" }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  });
                })()}
              </div>

              <button
                type="button"
                onClick={() => setWizardProductSpecs([...wizardProductSpecs, { key: "", value: "" }])}
                className="text-xs font-bold flex items-center justify-center gap-1.5 p-3 px-4 border border-dashed cursor-pointer transition-all hover:bg-slate-50 bg-white"
                style={{ 
                  color: currentSlideColor, 
                  borderColor: `color-mix(in srgb, ${currentSlideColor} 50%, #cbd5e1)`,
                  borderRadius: "7px"
                }}
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" /> Add custom attribute
              </button>
            </div>

            {/* 4. PRODUCT VARIANTS & COLOR -> IMAGE LINKING */}
            <DiamondDecorativeDivider className="my-2" />
            <div className="space-y-4 pt-1">
              <div className="flex justify-between items-center">
                <div className="flex flex-col text-left">
                  <label className="text-xs font-black block font-mono group/spec cursor-help" style={{ fontSize: "11px", color: "#1e1e1e" }}>
                    <span>Product variants</span>
                    <HintTooltip text="Enable variants if your item offers choices such as colors, sizes, or storage capacity." currentSlideColor={currentSlideColor} />
                  </label>
                  <span className="text-[9.5px] font-bold tracking-tight block" style={{ color: "#1e1e1e" }}>Configure variant options and link images to each variant</span>
                </div>
                <SkeuomorphicSwitch
                  checked={wizardVariantsEnabled}
                  onChange={setWizardVariantsEnabled}
                />
              </div>

              {wizardVariantsEnabled ? (
                <div className="space-y-5 animate-fade-in">
                  
                  {/* Visual Color Swatches & Swatch Image Mapper */}
                  <div 
                    className="p-4 border flex flex-col gap-4"
                    style={{
                      backgroundColor: "#f8fafc",
                      borderColor: "#c8cdcd",
                      borderRadius: "7px"
                    }}
                  >
                    <h4 className="font-extrabold text-xs font-mono flex items-center gap-1.5" style={{ color: "#1e1e1e" }}>
                      <Palette className="w-4 h-4" style={{ color: currentSlideColor }} />
                      <span>Color swatches &amp; image linking</span>
                    </h4>

                    <p className="text-[10.5px] font-bold text-slate-500 leading-relaxed">
                      Select colors for your product and click on uploaded photos underneath each color swatch to link images directly to that color variant!
                    </p>

                    {/* Palette Quick Select */}
                    <div 
                      className="flex flex-wrap gap-2 py-2 p-3 border bg-white"
                      style={{ borderColor: "#c8cdcd", borderRadius: "7px" }}
                    >
                      {PALETTE_COLORS.map(c => (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => handleAddColorSwatch(c.name, c.hex)}
                          className="flex items-center gap-1.5 p-1.5 px-3 border hover:border-slate-300 bg-slate-50 text-[10px] font-extrabold cursor-pointer transition-all active:scale-95 text-black"
                          style={{ borderColor: "#c8cdcd", borderRadius: "7px" }}
                        >
                          <span className="w-3 h-3 rounded-full border border-black/10 shrink-0 shadow-xxs" style={{ backgroundColor: c.hex }} />
                          <span>{c.name}</span>
                        </button>
                      ))}
                    </div>

                    {/* Custom Add Color Swatch */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-dashed border-slate-300">
                      <div className="flex-grow flex gap-2">
                        <input
                          type="text"
                          placeholder="Custom color name (e.g. Saharan Gold)"
                          value={customSwatchName}
                          onChange={(e) => setCustomSwatchName(e.target.value)}
                          className="text-xs font-sans p-2.5 border focus:bg-white font-bold text-black bg-white flex-grow"
                          style={{ borderColor: "#c8cdcd", borderRadius: "7px" }}
                        />
                        <div 
                          className="flex items-center gap-2 border p-1 px-2 bg-white shrink-0"
                          style={{ borderColor: "#c8cdcd", borderRadius: "7px" }}
                        >
                          <input
                            type="color"
                            value={customSwatchHex}
                            onChange={(e) => setCustomSwatchHex(e.target.value)}
                            className="w-6 h-6 rounded-md cursor-pointer border-none bg-transparent"
                          />
                          <span className="text-[10px] font-mono font-bold uppercase text-black">{customSwatchHex}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddColorSwatch(customSwatchName, customSwatchHex)}
                        className="py-2.5 px-5 font-extrabold text-xs cursor-pointer inline-flex items-center justify-center gap-1.5 bg-gradient-to-b from-white/95 via-sky-50/70 to-slate-200/80 border-2 border-slate-300/90 rounded-full transition-all active:scale-95 shrink-0"
                        style={{ color: "#1e1e1e" }}
                      >
                        Add swatch
                      </button>
                    </div>

                    {/* Swatch & Image Link Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      {colorSwatches.map((sw, sIdx) => (
                        <div 
                          key={sIdx} 
                          className="p-3 bg-white border text-left flex flex-col gap-2"
                          style={{ borderColor: "#c8cdcd", borderRadius: "7px" }}
                        >
                          <div className="flex justify-between items-center pb-1 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                              <span className="w-4 h-4 rounded-full border border-black/10 shadow-xxs block shrink-0" style={{ backgroundColor: sw.hex }} />
                              <span className="text-[11px] font-black text-slate-800 font-sans">{sw.name}</span>
                              <span className="text-[9px] font-bold text-slate-400 font-mono">
                                ({sw.images?.length || 0} images linked)
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const nextSw = colorSwatches.filter((_, i) => i !== sIdx);
                                setColorSwatches(nextSw);
                              }}
                              className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Remove swatch"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Image Cards for linking */}
                          <div className="flex flex-col gap-1">
                            <span className="text-[9px] font-bold text-slate-400 font-mono">Click images below to link them to this color:</span>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {wizardImages.filter(Boolean).map((imgUrl, imgIdx) => {
                                const isLinked = sw.images?.includes(imgUrl);
                                return (
                                  <button
                                    key={imgIdx}
                                    type="button"
                                    onClick={() => toggleImageForSwatch(sIdx, imgUrl)}
                                    className="relative w-11 h-11 border overflow-hidden transition-all duration-150 transform hover:scale-105 active:scale-95 cursor-pointer"
                                    style={isLinked ? { borderColor: currentSlideColor, borderWidth: "2px", borderRadius: "7px" } : { borderColor: "#c8cdcd", borderWidth: "1px", borderRadius: "7px" }}
                                  >
                                    <img src={imgUrl} className="w-full h-full object-cover" alt="swatch mapping" referrerPolicy="no-referrer" />
                                    {isLinked && (
                                      <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                                        <Check className="w-4 h-4 text-white stroke-[3]" />
                                      </div>
                                    )}
                                  </button>
                                );
                              })}
                              {wizardImages.filter(Boolean).length === 0 && (
                                <span className="text-[9.5px] text-slate-400 italic">Please add photos in Step 2 to link them.</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Attributes Configurator Matrix */}
                  <div 
                    className="space-y-4 p-4 border"
                    style={{
                      backgroundColor: "#f8fafc",
                      borderColor: "#c8cdcd",
                      borderRadius: "7px"
                    }}
                  >
                    <h4 className="font-extrabold text-xs font-mono flex items-center gap-1.5" style={{ color: "#1e1e1e" }}>
                      <Layers className="w-4 h-4" style={{ color: currentSlideColor }} />
                      <span>Variant attributes configuration</span>
                    </h4>

                    <div className="space-y-4">
                      {wizardVariantAttrs.map((attr, attrIdx) => (
                        <div 
                          key={attrIdx} 
                          className="space-y-2 p-3 bg-white border"
                          style={{ borderColor: "#c8cdcd", borderRadius: "7px" }}
                        >
                          <div className="flex justify-between items-center">
                            <input
                              type="text"
                              value={attr.name}
                              onChange={(e) => {
                                const updated = [...wizardVariantAttrs];
                                updated[attrIdx].name = e.target.value;
                                setWizardVariantAttrs(updated);
                              }}
                              placeholder="Option name (e.g. Size)"
                              className="text-xs font-sans p-2 border focus:bg-white font-bold text-black"
                              style={{ borderColor: "#c8cdcd", borderRadius: "7px", maxWidth: "160px" }}
                            />
                            <button
                              type="button"
                              onClick={() => setWizardVariantAttrs(wizardVariantAttrs.filter((_, i) => i !== attrIdx))}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Tag display row */}
                          <div className="flex flex-wrap gap-1.5 py-1">
                            {attr.tags.length === 0 ? (
                              <span className="text-[10px] text-slate-400 italic">No option values added yet.</span>
                            ) : (
                              attr.tags.map((tag, tagIdx) => (
                                <span 
                                  key={tagIdx} 
                                  className="inline-flex items-center gap-1.5 p-1 px-3 bg-slate-50 border text-slate-850 text-[10px] font-black font-sans"
                                  style={{ borderRadius: "7px", borderColor: "#c8cdcd" }}
                                >
                                  {tag}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = [...wizardVariantAttrs];
                                      updated[attrIdx].tags = attr.tags.filter((_, i) => i !== tagIdx);
                                      setWizardVariantAttrs(updated);
                                    }}
                                    className="text-slate-400 hover:text-slate-600 font-extrabold ml-1 cursor-pointer"
                                  >
                                    &times;
                                  </button>
                                </span>
                              ))
                            )}
                          </div>

                          {/* Inline tag input */}
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={wizardAttrInputText[attr.name] || ""}
                              onChange={(e) => {
                                setWizardAttrInputText({
                                  ...wizardAttrInputText,
                                  [attr.name]: e.target.value
                                });
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  const val = (wizardAttrInputText[attr.name] || "").trim();
                                  if (val && !attr.tags.includes(val)) {
                                    const updated = [...wizardVariantAttrs];
                                    updated[attrIdx].tags.push(val);
                                    setWizardVariantAttrs(updated);
                                    setWizardAttrInputText({ ...wizardAttrInputText, [attr.name]: "" });
                                  }
                                }
                              }}
                              placeholder="Type option value and press Enter (e.g. XL, 128 GB)"
                              className="text-xs font-sans p-2 border focus:bg-white font-bold text-black flex-1"
                              style={{ borderColor: "#c8cdcd", borderRadius: "7px" }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const val = (wizardAttrInputText[attr.name] || "").trim();
                                if (val && !attr.tags.includes(val)) {
                                  const updated = [...wizardVariantAttrs];
                                  updated[attrIdx].tags.push(val);
                                  setWizardVariantAttrs(updated);
                                  setWizardAttrInputText({ ...wizardAttrInputText, [attr.name]: "" });
                                }
                              }}
                              className="p-2 px-4 font-extrabold text-xs cursor-pointer inline-flex items-center justify-center bg-slate-100 border border-slate-300 rounded-full hover:bg-slate-200"
                              style={{ color: "#1e1e1e" }}
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setWizardVariantAttrs([...wizardVariantAttrs, { name: "New option", tags: [] }])}
                        className="text-xs font-extrabold inline-flex items-center justify-center gap-1.5 p-2.5 px-4 cursor-pointer bg-white border border-slate-300 rounded-full hover:bg-slate-50"
                        style={{ color: "#1e1e1e" }}
                      >
                        <Plus className="w-3.5 h-3.5" style={{ color: "#1e1e1e" }} />
                        Add option attribute
                      </button>

                      <button
                        type="button"
                        onClick={handleGenerateCombinations}
                        className="text-xs font-extrabold inline-flex items-center gap-1.5 ml-auto p-2.5 px-5 cursor-pointer bg-slate-900 text-white rounded-full hover:bg-slate-800"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        Generate combinations
                      </button>
                    </div>
                  </div>

                  {/* Generated Variant Combinations List */}
                  {wizardProductVariants && wizardProductVariants.length > 0 && (
                    <div className="space-y-4 pt-2">
                      <h4 className="text-xs font-black block font-mono" style={{ fontSize: "11px", color: "#1e1e1e" }}>
                        <span>Variant items grid ({wizardProductVariants.length})</span>
                      </h4>

                      <div className="space-y-3.5 max-h-[520px] overflow-y-auto pr-1">
                        {wizardProductVariants.map((v, idx) => {
                          const optionString = Object.entries(v.options || {}).map(([k, val]) => `${k}: ${val}`).join(", ");
                          return (
                            <div 
                              key={v.id || idx} 
                              className="p-4 bg-white border flex flex-col gap-3 text-left"
                              style={{ borderColor: "#c8cdcd", borderRadius: "7px" }}
                            >
                              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                                <span className="text-xs font-black block font-mono" style={{ fontSize: "11px", color: currentSlideColor }}>
                                  {optionString || `Variant #${idx + 1}`}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setWizardProductVariants(wizardProductVariants.filter((_, i) => i !== idx))}
                                  className="p-1 px-2 text-rose-500 hover:bg-rose-50 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> Remove
                                </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div className="flex flex-col gap-1">
                                  <span className="text-[9.5px] font-bold text-slate-400 tracking-tight block">SKU code</span>
                                  <input
                                    type="text"
                                    value={v.sku}
                                    onChange={(e) => {
                                      const updated = [...wizardProductVariants];
                                      updated[idx].sku = e.target.value;
                                      setWizardProductVariants(updated);
                                    }}
                                    className="text-xs font-mono p-2 border font-bold text-black bg-white"
                                    style={{ borderColor: "#c8cdcd", borderRadius: "7px" }}
                                  />
                                </div>

                                <div className="flex flex-col gap-1">
                                  <span className="text-[9.5px] font-bold text-slate-400 tracking-tight block">Price (DZD)</span>
                                  <input
                                    type="number"
                                    value={v.price}
                                    onChange={(e) => {
                                      const updated = [...wizardProductVariants];
                                      updated[idx].price = Number(e.target.value);
                                      setWizardProductVariants(updated);
                                    }}
                                    className="text-xs font-sans p-2 border font-bold text-black bg-white"
                                    style={{ borderColor: "#c8cdcd", borderRadius: "7px" }}
                                  />
                                </div>

                                <div className="flex flex-col gap-1">
                                  <span className="text-[9.5px] font-bold text-slate-400 tracking-tight block">Inventory stock</span>
                                  <input
                                    type="number"
                                    value={v.stock}
                                    onChange={(e) => {
                                      const updated = [...wizardProductVariants];
                                      updated[idx].stock = Number(e.target.value);
                                      setWizardProductVariants(updated);
                                    }}
                                    className="text-xs font-sans p-2 border font-bold text-black bg-white"
                                    style={{ borderColor: "#c8cdcd", borderRadius: "7px" }}
                                  />
                                </div>
                              </div>

                              {/* Image Link Checklist for Variant */}
                              <div 
                                className="p-2.5 border border-dashed border-slate-300 bg-slate-50/50 flex flex-col gap-1.5"
                                style={{ borderRadius: "7px" }}
                              >
                                <span className="text-[9.5px] font-bold text-slate-500 font-mono flex items-center justify-between">
                                  <span className="flex items-center gap-1.5">
                                    <Image className="w-3.5 h-3.5" />
                                    Link images to this variant
                                  </span>
                                  <span>({v.images?.length || 0} assigned)</span>
                                </span>
                                <div className="flex flex-wrap gap-1.5 mt-1">
                                  {wizardImages.filter(Boolean).map((imgUrl, imgIdx) => {
                                    const isSelected = v.images?.includes(imgUrl);
                                    return (
                                      <button
                                        key={imgIdx}
                                        type="button"
                                        onClick={() => toggleImageForVariant(idx, imgUrl)}
                                        className="relative w-10 h-10 border overflow-hidden transition-all duration-150 transform hover:scale-105 active:scale-95 cursor-pointer"
                                        style={isSelected ? { borderColor: currentSlideColor, borderWidth: "2.5px", borderRadius: "7px" } : { borderColor: "#c8cdcd", borderWidth: "1px", borderRadius: "7px" }}
                                      >
                                        <img src={imgUrl} className="w-full h-full object-cover" alt="variant thumbnail" referrerPolicy="no-referrer" />
                                        {isSelected && (
                                          <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                                            <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                                          </div>
                                        )}
                                      </button>
                                    );
                                  })}
                                  {wizardImages.filter(Boolean).length === 0 && (
                                    <span className="text-[9px] text-slate-400 italic">Please upload images in Step 2 to link them here.</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div 
                  className="text-center py-5 text-slate-400 font-medium text-xs font-sans bg-slate-50 border border-dashed border-slate-200"
                  style={{ borderRadius: "7px" }}
                >
                  Product variants are currently disabled. Turn on to create size, color, or model choices.
                </div>
              )}
            </div>

            {/* 5. OPTIONAL PRODUCT BUNDLE OFFERS */}
            <DiamondDecorativeDivider className="my-2" />
            <div className="space-y-4 pt-1">
              <div className="flex justify-between items-center">
                <div className="flex flex-col text-left">
                  <label className="text-xs font-black block font-mono" style={{ fontSize: "11px", color: "#1e1e1e" }}>
                    <span>Optional product bundle offers</span>
                  </label>
                  <span className="text-[9.5px] font-bold tracking-tight block" style={{ color: "#1e1e1e" }}>Add fast cross-selling package accessories</span>
                </div>
                <SkeuomorphicSwitch
                  checked={wizardBundleEnabled}
                  onChange={setWizardBundleEnabled}
                />
              </div>

              {wizardBundleEnabled && (
                <div 
                  className="space-y-4 text-slate-900 p-4 border"
                  style={{
                    backgroundColor: "#f8fafc",
                    borderColor: "#c8cdcd",
                    borderRadius: "7px"
                  }}
                >
                  <div className="flex flex-col gap-2">
                    <span className="text-[9.5px] font-bold text-slate-400 tracking-tight block">Bundle accessory items</span>
                    
                    {wizardBundleItems.map((item, itemIdx) => (
                      <div key={itemIdx} className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-8">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => {
                              const updated = [...wizardBundleItems];
                              updated[itemIdx].name = e.target.value;
                              setWizardBundleItems(updated);
                            }}
                            placeholder="E.g. Protective Wood Wax Polish"
                            className="w-full text-xs font-sans p-2.5 border rounded-lg bg-white font-bold"
                            style={{ borderColor: "#c8cdcd", borderRadius: "7px" }}
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                              const updated = [...wizardBundleItems];
                              updated[itemIdx].quantity = Number(e.target.value);
                              setWizardBundleItems(updated);
                            }}
                            placeholder="Qty"
                            className="w-full text-xs font-sans p-2.5 border rounded-lg bg-white font-bold"
                            style={{ borderColor: "#c8cdcd", borderRadius: "7px" }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setWizardBundleItems(wizardBundleItems.filter((_, i) => i !== itemIdx))}
                          className="col-span-2 p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 transition-all flex items-center justify-center cursor-pointer font-bold border border-rose-200"
                          style={{ borderRadius: "7px" }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => setWizardBundleItems([...wizardBundleItems, { name: "", quantity: 1 }])}
                      className="text-xs font-bold flex items-center justify-center gap-1.5 p-2.5 border border-dashed cursor-pointer bg-white mt-1"
                      style={{ color: currentSlideColor, borderColor: "#cbd5e1", borderRadius: "7px" }}
                    >
                      <Plus className="w-3.5 h-3.5" /> Add bundle accessory
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ShowHintsContext.Provider>
  );
}
