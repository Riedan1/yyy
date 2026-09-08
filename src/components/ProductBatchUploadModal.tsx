import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  Plus, 
  Sparkles, 
  Check, 
  AlertCircle, 
  Loader2,
  Layers,
  Edit2,
  Tag,
  Maximize2,
  LayoutGrid,
  List,
  ArrowLeft
} from "lucide-react";
import { Product, MerchantStore } from "../types";
import { getOptimizedImageUrl } from "../utils/imageOptimizer";
import confetti from "canvas-confetti";

interface ProductBatchUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  myStore: MerchantStore;
  setStores: React.Dispatch<React.SetStateAction<MerchantStore[]>>;
  currentSlideColor?: string;
}

interface BatchItem {
  id: string;
  name: string;
  category: string;
  price: number;
  buyPrice: number;
  discount: number;
  stock: number;
  description: string;
  originalName: string;
  originalSize: number;
  optimizedImageUrl: string;
  additionalImages: string[];
  optimizedSize: number;
  status: "processing" | "ready" | "error";
  errorMsg?: string;
  sku: string;
}

const CATEGORY_OPTIONS = [
  { value: "Clothing", label: "Clothing / Apparel" },
  { value: "Shoes", label: "Shoes / Footwear" },
  { value: "Electronics", label: "Electronics / Computers & Phones" },
  { value: "Crafts", label: "Artisanat / Crafts" },
  { value: "Food", label: "Terroir / Food" },
  { value: "Home", label: "Home / Maison" },
  { value: "Poterie", label: "Poterie" },
  { value: "Bijouterie", label: "Bijouterie (Gated)" },
  { value: "Home & Kitchen", label: "Home & Kitchen" },
  { value: "Beauty & Personal Care", label: "Beauty & Personal Care" },
  { value: "Sports & Outdoors", label: "Sports & Outdoors" },
  { value: "Toys & Games", label: "Toys & Games" },
  { value: "Books", label: "Books / Livres" },
  { value: "Garden & Outdoor", label: "Garden & Outdoor" },
  { value: "Grocery & Gourmet Food", label: "Grocery & Gourmet Food" }
];

export default function ProductBatchUploadModal({
  isOpen,
  onClose,
  myStore,
  setStores,
  currentSlideColor = "#6366f1"
}: ProductBatchUploadModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [batchItems, setBatchItems] = useState<BatchItem[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [isPublishing, setIsPublishing] = useState(false);
  const [showPasteUrl, setShowPasteUrl] = useState(false);
  const [pastedUrls, setPastedUrls] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || typeof document === "undefined") return null;

  // Clean file names to nice Title Case product names
  const cleanFileNameToProductName = (filename: string): string => {
    // Strip extension
    let name = filename.substring(0, filename.lastIndexOf('.')) || filename;
    // Replace underscores, dashes and percent encoding with spaces
    name = name.replace(/[_\-+%20]+/g, ' ');
    // Clean multiple spaces
    name = name.replace(/\s+/g, ' ').trim();
    // Convert to Title Case
    return name
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Auto-detect category based on clean name
  const detectCategoryFromName = (name: string): string => {
    const n = name.toLowerCase();
    if (n.includes("rug") || n.includes("tapis") || n.includes("blanket") || n.includes("pillow") || n.includes("coussin")) return "Home";
    if (n.includes("pot") || n.includes("clay") || n.includes("ceramic") || n.includes("poterie") || n.includes("vase")) return "Poterie";
    if (n.includes("silver") || n.includes("bracelet") || n.includes("necklace") || n.includes("bijou") || n.includes("ring")) return "Bijouterie";
    if (n.includes("oil") || n.includes("dates") || n.includes("deglet") || n.includes("honey") || n.includes("miel") || n.includes("food") || n.includes("olive")) return "Food";
    if (n.includes("phone") || n.includes("computer") || n.includes("charger") || n.includes("cable") || n.includes("case")) return "Electronics";
    if (n.includes("shirt") || n.includes("dress") || n.includes("robe") || n.includes("coat") || n.includes("jacket") || n.includes("pant") || n.includes("wool")) return "Clothing";
    if (n.includes("shoe") || n.includes("boot") || n.includes("sneaker") || n.includes("heel")) return "Shoes";
    if (n.includes("book") || n.includes("roman") || n.includes("magazine")) return "Books";
    if (n.includes("toy") || n.includes("game") || n.includes("puzzle")) return "Toys & Games";
    return "Crafts"; // Default
  };

  // Core Media Optimization Utility via Canvas Compression
  const optimizeImageFile = (file: File): Promise<{ optimizedDataUrl: string; size: number }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Standard Max dimensions for optimized storage
          const MAX_DIM = 800;
          if (width > MAX_DIM || height > MAX_DIM) {
            if (width > height) {
              height = Math.round((height * MAX_DIM) / width);
              width = MAX_DIM;
            } else {
              width = Math.round((width * MAX_DIM) / height);
              height = MAX_DIM;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Failed to get 2D context from canvas"));
            return;
          }

          // Use white background for transparent images to look pristine on list
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          // Compress to JPEG with high quality yet optimized size (0.78 quality is the sweet spot!)
          const optimizedDataUrl = canvas.toDataURL("image/jpeg", 0.78);
          
          // Compute optimized size in bytes from base64 string
          const approxSizeBytes = Math.round((optimizedDataUrl.length - 814) * 0.75);

          resolve({
            optimizedDataUrl,
            size: approxSizeBytes
          });
        };
        img.onerror = () => reject(new Error("Failed to load image element"));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  };

  // Handling file selections
  const handleFiles = async (files: FileList) => {
    const imageFiles = Array.from(files).filter(f => f.type.startsWith("image/"));
    if (imageFiles.length === 0) return;

    // Pre-allocate temporary items with processing state
    const newItems: BatchItem[] = imageFiles.map((file, idx) => {
      const id = `b-${Date.now()}-${idx}-${Math.floor(Math.random() * 1000)}`;
      const cleanName = cleanFileNameToProductName(file.name);
      const category = detectCategoryFromName(cleanName);
      return {
        id,
        name: cleanName,
        category,
        price: 3500, // Reasonable standard DZ price
        buyPrice: 2200,
        discount: 0,
        description: "",
        stock: 12,
        originalName: file.name,
        originalSize: file.size,
        optimizedImageUrl: "",
        additionalImages: [],
        optimizedSize: 0,
        status: "processing",
        sku: `DZ-${category.substring(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`
      };
    });

    setBatchItems(prev => [...prev, ...newItems]);

    // Process each in background sequentially or in parallel
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const targetItem = newItems[i];

      try {
        const { optimizedDataUrl, size } = await optimizeImageFile(file);
        
        setBatchItems(prev => prev.map(item => {
          if (item.id === targetItem.id) {
            return {
              ...item,
              optimizedImageUrl: optimizedDataUrl,
              optimizedSize: size,
              status: "ready"
            };
          }
          return item;
        }));
      } catch (err: any) {
        setBatchItems(prev => prev.map(item => {
          if (item.id === targetItem.id) {
            return {
              ...item,
              status: "error",
              errorMsg: err.message || "Failed to process"
            };
          }
          return item;
        }));
      }
    }
  };

  // Handle URL pasting & optimization
  const handleUrlSubmit = () => {
    if (!pastedUrls.trim()) return;
    const urls = pastedUrls
      .split(/[\s,\n]+/)
      .map(u => u.trim())
      .filter(u => u.startsWith("http://") || u.startsWith("https://"));

    if (urls.length === 0) return;

    const newItems: BatchItem[] = urls.map((url, idx) => {
      const id = `b-url-${Date.now()}-${idx}`;
      // Optimize URL via the platform utility
      const optimizedUrl = getOptimizedImageUrl(url, false) || url;
      // Extract a dummy nice name
      const cleanName = `Bulk Link Product #${Math.floor(100 + Math.random() * 900)}`;

      return {
        id,
        name: cleanName,
        category: "Crafts",
        price: 4500,
        buyPrice: 3000,
        discount: 0,
        description: "",
        stock: 15,
        originalName: url.substring(url.lastIndexOf("/") + 1).split("?")[0] || "image_link",
        originalSize: 0,
        optimizedImageUrl: optimizedUrl,
        additionalImages: [],
        optimizedSize: 0, // remote
        status: "ready",
        sku: `DZ-URL-${Math.floor(100000 + Math.random() * 900000)}`
      };
    });

    setBatchItems(prev => [...prev, ...newItems]);
    setPastedUrls("");
    setShowPasteUrl(false);
  };

  // Drag and drop event handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  // Remove individual listing from batch
  const handleRemoveItem = (id: string) => {
    setBatchItems(prev => prev.filter(item => item.id !== id));
  };

  // Modify inline properties
  const updateItemProperty = (id: string, property: keyof BatchItem, value: any) => {
    setBatchItems(prev => prev.map(item => {
      if (item.id === id) {
        // If updating category, dynamically regenerate SKU prefix
        if (property === "category") {
          const catStr = String(value);
          const prefix = catStr.substring(0, 3).toUpperCase();
          const rest = item.sku.includes("-") ? item.sku.split("-")[2] || Math.floor(100000 + Math.random() * 900000) : Math.floor(100000 + Math.random() * 900000);
          return {
            ...item,
            [property]: value,
            sku: `DZ-${prefix}-${rest}`
          };
        }
        return { ...item, [property]: value };
      }
      return item;
    }));
  };

  // Multi-submit publish to state
  const handlePublishBatch = () => {
    const readyItems = batchItems.filter(item => item.status === "ready");
    if (readyItems.length === 0) return;

    setIsPublishing(true);

    const newBulkProducts: Product[] = readyItems.map(item => {
      const desc = item.description || `Premium ${item.name} from Algerian soil. Individually audited and certified by local merchant standard. Optimized media visual showcase included.`;
      return {
        id: `p-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
        storeId: myStore.id,
        name: item.name,
        category: item.category,
        price: Number(item.price) || 3500,
        stock: Number(item.stock) || 10,
        imageUrl: item.optimizedImageUrl,
        images: [item.optimizedImageUrl, ...(item.additionalImages || [])],
        status: "active",
        rating: 4.8,
        reviewsCount: 0,
        reviews: [],
        description: desc,
        description_en: desc,
        description_fr: desc,
        description_ar: desc,
        sku: item.sku,
        colors: [],
        sizes: [],
        specifications: [
          { key: "Origin", value: myStore.wilaya || "Algeria" },
          { key: "Fulfillment Type", value: "Bulk Batch List Tool" }
        ],
        tags: ["Bulk Item", "Batch Optimised", item.category],
        shippingCost: 450,
        simulated: false,
        buyPrice: item.buyPrice || undefined,
        discountEnabled: item.discount > 0,
        discountPercent: item.discount > 0 ? Number(item.discount) : undefined
      };
    });

    setStores(prev => prev.map(s => {
      if (s.id === myStore.id) {
        return {
          ...s,
          products: [...newBulkProducts, ...s.products]
        };
      }
      return s;
    }));

    // Trigger celebratory confetti burst!
    try {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    setIsPublishing(false);
    setBatchItems([]);
    onClose();
  };

  const totalOriginalBytes = batchItems.reduce((acc, curr) => acc + curr.originalSize, 0);
  const totalOptimizedBytes = batchItems.reduce((acc, curr) => acc + curr.optimizedSize, 0);
  const savingsPercent = totalOriginalBytes > 0 
    ? Math.round(((totalOriginalBytes - totalOptimizedBytes) / totalOriginalBytes) * 100)
    : 0;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex flex-col overflow-hidden font-sans">
        {/* Backdrop overlay - Solid background for Separated Mother Page look */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-50 dark:bg-slate-950"
        />

        {/* Modal panel content - Full Page */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 15 }}
          transition={{ duration: 0.35 }}
          className="relative bg-slate-50 dark:bg-slate-950 w-full h-full min-h-screen flex flex-col overflow-hidden z-10"
        >
          {/* Header */}
          <div 
            className="p-5.5 text-slate-800 bg-white flex items-center justify-between shrink-0 font-sans border-b border-slate-200"
          >
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl transition-all border border-slate-200/60 cursor-pointer shadow-xs mr-2"
              >
                <ArrowLeft className="w-4 h-4 text-slate-700" />
                <span>Back</span>
              </button>

              <div className="h-8 w-[1px] bg-slate-200 mr-1" />

              <div className="p-2.5 bg-indigo-50 rounded-xl">
                <Layers className="w-5 h-5 text-indigo-600 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-black tracking-wider text-slate-800 flex items-center gap-2">
                  Bulk Product Creator
                  <span className="text-[9px] bg-slate-100 text-slate-600 font-mono font-bold px-2 py-0.5 rounded-full lowercase">
                    v1.6
                  </span>
                </h3>
                <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                  Drag, drop and automatically optimize high-fidelity listings in seconds
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {batchItems.length > 0 && (
                <button
                  type="button"
                  disabled={isPublishing || batchItems.every(item => item.status !== "ready")}
                  onClick={handlePublishBatch}
                  className="px-4.5 py-2 text-white text-xs font-black rounded-xl hover:shadow-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer"
                  style={{ backgroundColor: currentSlideColor }}
                >
                  {isPublishing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
                      <span>Save Changes ({batchItems.filter(i => i.status === "ready").length})</span>
                    </>
                  )}
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all cursor-pointer border border-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Subtle horizontal decorative divider with gradient matching the app theme */}
          <div 
            className="h-[3px] w-full shrink-0 shadow-xs"
            style={{ 
              background: `linear-gradient(to right, transparent 5%, ${currentSlideColor} 50%, transparent 95%)` 
            }}
          />

          {/* Body content section */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 bg-white dark:bg-white scrollbar-thin">
            {batchItems.length === 0 ? (
              /* Drag & Drop Main Stage Empty State */
              <div className="flex-1 flex flex-col items-center justify-center min-h-[350px]">
                <div 
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`w-full max-w-2xl border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-center transition-all ${
                    dragActive 
                      ? "border-indigo-500 bg-indigo-50/30 scale-[1.01]" 
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleInputChange}
                    className="hidden"
                  />

                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-white shadow-md animate-bounce"
                    style={{ backgroundColor: currentSlideColor }}
                  >
                    <Upload className="w-8 h-8" />
                  </div>

                  <h4 className="text-sm font-black text-slate-800 tracking-tight font-sans">
                    Drag And Drop Product Photos Here
                  </h4>
                  <p className="text-xs text-slate-500 max-w-md mt-2 leading-relaxed">
                    Select multiple product photos from your device directory. Our built-in media optimizer will compress and scale them for rapid web performance.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 mt-6 w-full max-w-xs">
                    <button
                      type="button"
                      onClick={onButtonClick}
                      className="flex-1 text-white text-xs font-black py-2.5 px-4 rounded-xl hover:shadow-xs active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      style={{ backgroundColor: currentSlideColor }}
                    >
                      <ImageIcon className="w-4 h-4" />
                      Browse Files
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setShowPasteUrl(!showPasteUrl)}
                      className="flex-1 text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold py-2.5 px-4 rounded-xl active:scale-[0.98] transition-all cursor-pointer"
                    >
                      Paste Image URLs
                    </button>
                  </div>
                </div>

                {/* Paste URL Overlay block */}
                {showPasteUrl && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-2xl bg-white border border-slate-200 p-4 rounded-2xl mt-4 text-left shadow-sm"
                  >
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-2 font-mono">
                      Image URLs (one per line, or separated by commas)
                    </label>
                    <textarea
                      value={pastedUrls}
                      onChange={(e) => setPastedUrls(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-...&#10;https://my-cloud-storage.com/product2.jpg"
                      className="w-full h-24 border border-slate-200 rounded-xl bg-slate-50 p-2.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-indigo-400 text-slate-800"
                    />
                    <div className="flex justify-end gap-2.5 mt-3">
                      <button
                        type="button"
                        onClick={() => setShowPasteUrl(false)}
                        className="text-xs font-bold text-slate-400 hover:text-slate-600 px-3 py-1.5"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleUrlSubmit}
                        className="text-xs font-black text-white px-4 py-1.5 rounded-lg cursor-pointer hover:opacity-90 active:scale-95 transition-all"
                        style={{ backgroundColor: currentSlideColor }}
                      >
                        Process URLs
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              /* Core Interactive Workspace with table/grid switcher - Wrapped in motion container with fade-in animation to improve transition */
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col gap-5 text-left"
              >
                {/* Visual statistics on savings */}
                <div className="flex gap-4">
                  <div className="bg-white border border-slate-200 p-4 rounded-xl text-left shadow-3xs max-w-xs w-full">
                    <span className="text-[9px] font-bold text-slate-400 block tracking-wider font-mono">
                      Selected Items
                    </span>
                    <span className="text-xl font-black text-slate-800 block mt-0.5 font-mono">
                      {batchItems.length} Product Listings
                    </span>
                    <span className="text-[10px] text-slate-450 mt-1 block flex items-center gap-1.5 font-medium">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                      Ready to bulk publish
                    </span>
                  </div>
                </div>

                {/* View Mode Switcher bar */}
                <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center bg-white border border-slate-200 p-4 rounded-2xl shadow-3xs">
                  <div className="text-left font-sans">
                    <span className="text-[10px] font-black tracking-wider text-slate-400 block font-mono">Workspace Layout</span>
                    <span className="text-[11px] text-slate-500 font-semibold block">Fine-tune your products, pricing, discounts, buy/cost prices, and descriptions before publishing</span>
                  </div>

                  <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0 self-stretch sm:self-auto justify-center">
                    <button
                      type="button"
                      onClick={() => setViewMode("grid")}
                      className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                        viewMode === "grid"
                          ? "bg-white text-slate-800 shadow-3xs"
                          : "text-slate-400 hover:text-slate-700"
                      }`}
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span>Artisan Cards</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("table")}
                      className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                        viewMode === "table"
                          ? "bg-white text-slate-800 shadow-3xs"
                          : "text-slate-400 hover:text-slate-700"
                      }`}
                    >
                      <List className="w-3.5 h-3.5" />
                      <span>Excel Table</span>
                    </button>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {viewMode === "grid" ? (
                    /* Premium Card Grid Layout */
                    <motion.div
                      key="grid"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.22, ease: "easeInOut" }}
                      className="grid grid-cols-1 xl:grid-cols-2 gap-6"
                    >
                    {batchItems.map((item) => {
                      const optimizedMb = (item.optimizedSize / 1024 / 1024).toFixed(2);

                      return (
                        <motion.div 
                          key={item.id}
                          whileHover={{ y: -4, scale: 1.01 }}
                          transition={{ type: "spring", stiffness: 350, damping: 25 }}
                          className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all flex flex-col gap-4 text-left relative"
                        >
                          {/* Top row: Preview, Extra Images upload, basic details */}
                          <div className="flex gap-4">
                            {/* Left Column: Image Stack and Additional Images */}
                            <div className="flex flex-col gap-2 shrink-0">
                              <div className="relative w-24 h-24 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden shadow-inner shrink-0">
                                {item.status === "processing" ? (
                                  <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
                                ) : item.status === "ready" ? (
                                  <img
                                    src={item.optimizedImageUrl}
                                    alt="Primary"
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <AlertCircle className="w-6 h-6 text-rose-500" />
                                )}
                                <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[8px] px-1.5 py-0.5 rounded font-mono font-bold">Primary</span>
                              </div>

                              {/* Multi-image thumbnail gallery strip */}
                              <div className="flex items-center gap-1.5 flex-wrap max-w-[120px]">
                                {(item.additionalImages || []).map((img, i) => (
                                  <div key={i} className="relative w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden group">
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = (item.additionalImages || []).filter((_, idx) => idx !== i);
                                        updateItemProperty(item.id, "additionalImages", updated);
                                      }}
                                      className="absolute inset-0 bg-rose-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[7px] font-bold"
                                    >
                                      Del
                                    </button>
                                  </div>
                                ))}

                                {/* Label button to add more images */}
                                <label 
                                  className="w-7 h-7 rounded-lg border border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors"
                                  title="Add extra image to product"
                                >
                                  <Plus className="w-3.5 h-3.5 text-slate-400" />
                                  <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    onChange={(e) => {
                                      const files = Array.from(e.target.files || []) as File[];
                                      if (files.length > 0) {
                                        Promise.all(
                                          files.map((file: File) => {
                                            return new Promise<string>((resolve, reject) => {
                                              const reader = new FileReader();
                                              reader.onload = (event) => resolve(event.target?.result as string);
                                              reader.onerror = reject;
                                              reader.readAsDataURL(file);
                                            });
                                          })
                                        ).then((dataUrls) => {
                                          const currentAdd = item.additionalImages || [];
                                          updateItemProperty(item.id, "additionalImages", [...currentAdd, ...dataUrls]);
                                        });
                                      }
                                    }}
                                  />
                                </label>
                              </div>
                            </div>

                            {/* Right Column: Name & Category */}
                            <div className="flex-grow flex flex-col justify-between py-0.5 min-w-0">
                              <div className="space-y-1">
                                <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-wide block">Product Name *</label>
                                <input
                                  type="text"
                                  value={item.name}
                                  onChange={(e) => updateItemProperty(item.id, "name", e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-wide block">Category</label>
                                <select
                                  value={item.category}
                                  onChange={(e) => updateItemProperty(item.id, "category", e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold cursor-pointer focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                                >
                                  {CATEGORY_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* Middle: Description textarea */}
                          <div className="space-y-1">
                            <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-wide block">Description</label>
                            <textarea
                              value={item.description || ""}
                              onChange={(e) => updateItemProperty(item.id, "description", e.target.value)}
                              placeholder="Introduce the materials, heritage, dimensions and story of this Algerian artisan craft..."
                              className="w-full h-20 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none font-medium leading-relaxed scrollbar-thin"
                            />
                          </div>

                          {/* Bottom block: Selling, Buy Price, Discount and Stock */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-150">
                            <div className="space-y-1 text-left">
                              <label className="text-[8.5px] font-black text-slate-400 uppercase block font-mono">Selling Price (DA)</label>
                              <input
                                type="number"
                                value={item.price}
                                onChange={(e) => updateItemProperty(item.id, "price", Math.max(0, parseInt(e.target.value) || 0))}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 text-right font-mono focus:outline-none"
                              />
                            </div>

                            <div className="space-y-1 text-left">
                              <label className="text-[8.5px] font-black text-slate-400 uppercase block font-mono">Buy Price (DA)</label>
                              <input
                                type="number"
                                value={item.buyPrice}
                                onChange={(e) => updateItemProperty(item.id, "buyPrice", Math.max(0, parseInt(e.target.value) || 0))}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 text-right font-mono focus:outline-none"
                              />
                            </div>

                            <div className="space-y-1 text-left">
                              <label className="text-[8.5px] font-black text-slate-400 uppercase block font-mono font-bold">Discount (%)</label>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={item.discount}
                                onChange={(e) => updateItemProperty(item.id, "discount", Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 text-right font-mono focus:outline-none"
                              />
                            </div>

                            <div className="space-y-1 text-left">
                              <label className="text-[8.5px] font-black text-slate-400 uppercase block font-mono">Stock Units</label>
                              <input
                                type="number"
                                value={item.stock}
                                onChange={(e) => updateItemProperty(item.id, "stock", Math.max(0, parseInt(e.target.value) || 0))}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 text-right font-mono focus:outline-none"
                              />
                            </div>
                          </div>

                          {/* Card Footer SKU & Trash */}
                          <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono pt-2 border-t border-slate-100">
                            <span>SKU: {item.sku} ({optimizedMb}MB opt)</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-rose-500 hover:text-rose-650 hover:bg-rose-55/40 px-2.5 py-1 rounded-lg border border-transparent hover:border-rose-100 transition-all cursor-pointer flex items-center gap-1 font-bold"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Remove Listing
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>                ) : (
                  /* Excel-style table workspace */
                  <motion.div
                    key="table"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.22, ease: "easeInOut" }}
                    className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-3xs"
                  >
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 tracking-wider font-mono">
                            <th className="p-4 w-[100px]">Photo Preview</th>
                            <th className="p-4 min-w-[200px]">Product Details</th>
                            <th className="p-4 w-[160px]">Category</th>
                            <th className="p-4 w-[130px]">Sale Price (DA)</th>
                            <th className="p-4 w-[130px]">Buy Price (DA)</th>
                            <th className="p-4 w-[100px]">Discount (%)</th>
                            <th className="p-4 w-[100px]">Stock</th>
                            <th className="p-4 w-[80px]">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                          {batchItems.map((item) => {
                            const optimizedMb = (item.optimizedSize / 1024 / 1024).toFixed(2);

                            return (
                              <tr 
                                key={item.id}
                                className="hover:bg-slate-50/40 transition-colors"
                              >
                                {/* Thumbnail preview */}
                                <td className="p-4">
                                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-100 flex items-center justify-center">
                                    {item.status === "processing" ? (
                                      <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
                                    ) : item.status === "ready" ? (
                                      <img
                                        src={item.optimizedImageUrl}
                                        alt="Optimized Preview"
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <AlertCircle className="w-5 h-5 text-rose-500" />
                                    )}
                                  </div>
                                </td>

                                {/* Details editor */}
                                <td className="p-4">
                                  <div className="flex flex-col gap-1 text-left">
                                    <input
                                      type="text"
                                      value={item.name}
                                      onChange={(e) => updateItemProperty(item.id, "name", e.target.value)}
                                      placeholder="Enter Product Name"
                                      className="font-bold text-slate-800 border-b border-transparent hover:border-slate-200 focus:border-indigo-400 focus:outline-none pb-0.5 bg-transparent"
                                    />
                                    <div className="flex items-center gap-2.5 text-[9.5px] text-slate-400 font-medium font-mono">
                                      <span className="text-[10px]">SKU: {item.sku}</span>
                                      <span>•</span>
                                      <span>{item.status === "ready" ? `${optimizedMb}MB optimized` : "Processing"}</span>
                                    </div>
                                  </div>
                                </td>

                                {/* Category selection */}
                                <td className="p-4">
                                  <select
                                    value={item.category}
                                    onChange={(e) => updateItemProperty(item.id, "category", e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-semibold focus:outline-none focus:bg-white"
                                  >
                                    {CATEGORY_OPTIONS.map(opt => (
                                      <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                      </option>
                                    ))}
                                  </select>
                                </td>

                                {/* Price inline numeric input */}
                                <td className="p-4">
                                  <input
                                    type="number"
                                    value={item.price}
                                    onChange={(e) => updateItemProperty(item.id, "price", Math.max(0, parseInt(e.target.value) || 0))}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-800 text-right font-mono focus:outline-none focus:bg-white"
                                  />
                                </td>

                                {/* Cost buy price */}
                                <td className="p-4">
                                  <input
                                    type="number"
                                    value={item.buyPrice}
                                    onChange={(e) => updateItemProperty(item.id, "buyPrice", Math.max(0, parseInt(e.target.value) || 0))}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-800 text-right font-mono focus:outline-none focus:bg-white"
                                  />
                                </td>

                                {/* Discount */}
                                <td className="p-4">
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={item.discount}
                                    onChange={(e) => updateItemProperty(item.id, "discount", Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-800 text-right font-mono focus:outline-none focus:bg-white"
                                  />
                                </td>

                                {/* Stock inline numeric input */}
                                <td className="p-4">
                                  <input
                                    type="number"
                                    value={item.stock}
                                    onChange={(e) => updateItemProperty(item.id, "stock", Math.max(0, parseInt(e.target.value) || 0))}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-800 text-right font-mono focus:outline-none focus:bg-white"
                                  />
                                </td>

                                {/* Actions remove listing */}
                                <td className="p-4">
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-all cursor-pointer border border-transparent hover:border-rose-100"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

                {/* Optional additional helper row to append more photos */}
                <div className="flex justify-start">
                  <button
                    type="button"
                    onClick={onButtonClick}
                    className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 hover:bg-slate-200/55 text-slate-600 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Append More Photos</span>
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer controls */}
          <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end shrink-0">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Close
              </button>
              
              {batchItems.length > 0 && (
                <button
                  type="button"
                  disabled={isPublishing || batchItems.every(item => item.status !== "ready")}
                  onClick={handlePublishBatch}
                  className="px-6 py-2.5 text-white text-xs font-black rounded-xl hover:shadow-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer"
                  style={{ backgroundColor: currentSlideColor }}
                >
                  {isPublishing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-white animate-pulse" />
                      <span>Save Changes ({batchItems.filter(i => i.status === "ready").length})</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
