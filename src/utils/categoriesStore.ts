import { db, handleFirestoreError, OperationType } from "./firebaseStore";
import { collection, doc, getDocs, setDoc, updateDoc, writeBatch, deleteDoc, query, where } from "firebase/firestore";
import { MainCategory, Subcategory, CategoryTemplateField } from "../types";

// Base default main categories as requested
export const DEFAULT_MAIN_CATEGORIES: MainCategory[] = [
  {
    id: "fashion",
    names: { en: "Fashion", ar: "الأزياء", fr: "Mode" },
    icon: "Shirt",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80",
    order: 0
  },
  {
    id: "kids",
    names: { en: "Kids", ar: "الأطفال", fr: "Enfants" },
    icon: "Baby",
    image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=600&auto=format&fit=crop&q=80",
    order: 1
  },
  {
    id: "health_beauty",
    names: { en: "Health and Beauty", ar: "الصحة والجمال", fr: "Santé et Beauté" },
    icon: "Sparkles",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80",
    order: 2
  },
  {
    id: "electronics",
    names: { en: "Electronics", ar: "الإلكترونيات", fr: "Électronique" },
    icon: "Smartphone",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&auto=format&fit=crop&q=80",
    order: 3
  },
  {
    id: "home_living",
    names: { en: "Home and Living", ar: "المنزل والمعيشة", fr: "Maison et Jardin" },
    icon: "Home",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
    order: 4
  },
  {
    id: "sports_toys",
    names: { en: "Sports Outdoor and Toys", ar: "الرياضة والألعاب", fr: "Sports et Jouets" },
    icon: "Activity",
    image: "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=600&auto=format&fit=crop&q=80",
    order: 5
  },
  {
    id: "arts_crafts",
    names: { en: "Arts and Crafts", ar: "الفنون والحرف", fr: "Arts et Artisanat" },
    icon: "Palette",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80",
    order: 6
  },
  {
    id: "food_beverages",
    names: { en: "Food and Beverages", ar: "الأغذية والمشروبات", fr: "Alimentation et Boissons" },
    icon: "Utensils",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=80",
    order: 7
  },
  {
    id: "automotive_tools",
    names: { en: "Automotive and Tools", ar: "السيارات والأدوات", fr: "Automobile et Outils" },
    icon: "Wrench",
    image: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80",
    order: 8
  }
];

// Base default subcategories mapping the original templates & including dynamic fields
export const DEFAULT_SUBCATEGORIES: Subcategory[] = [
  // --- FASHION ---
  {
    id: "fashion_all",
    mainCategoryId: "fashion",
    names: { en: "All Fashion", ar: "كل الأزياء", fr: "Toute la Mode" },
    icon: "Shirt",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80",
    order: 0,
    sizeSystem: { enabled: false, label: "Sizes", sizes: [] },
    recommendedMaterials: ["Cotton", "Polyester", "Linen"],
    fields: [
      { name: "Material", type: "select", required: true, options: ["Cotton", "Polyester", "Linen"], placeholder: "Select material" },
      { name: "Color", type: "text", required: false, placeholder: "e.g. Red, Blue" }
    ]
  },
  {
    id: "fashion_clothing",
    mainCategoryId: "fashion",
    names: { en: "Clothing & Apparel (Men, Women)", ar: "الملابس والملابس الجاهزة للرجال والنساء", fr: "Vêtements et Habillage (Hommes, Femmes)" },
    icon: "Shirt",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80",
    order: 1,
    sizeSystem: {
      enabled: true,
      label: "Apparel Sizing (XS - 4XL)",
      sizes: ["Extra Small (XS)", "Small (S)", "Medium (M)", "Large (L)", "Extra Large (XL)", "Double XL (XXL)", "3XL", "4XL", "Custom Size"]
    },
    recommendedMaterials: ["Organic Cotton", "Linen", "Pure Wool", "Silk", "Satin", "Denim", "Velvet", "Cashmere", "Polyester", "Nylon"],
    fields: [
      { name: "Material", type: "select", required: true, options: ["Organic Cotton", "Linen", "Pure Wool", "Silk", "Satin", "Denim", "Velvet", "Cashmere", "Polyester", "Nylon"], placeholder: "Select material" },
      { name: "Gender", type: "select", required: true, options: ["Men", "Women", "Unisex"], placeholder: "Select gender" },
      { name: "Fit", type: "select", required: false, options: ["Regular Fit", "Slim Fit", "Loose Fit", "Oversized", "Tailored"], placeholder: "Select fit" },
      { name: "Season", type: "select", required: false, options: ["All Season", "Summer", "Winter", "Spring/Autumn"], placeholder: "Select season" },
      { name: "Pattern", type: "text", required: false, placeholder: "e.g. Solid, Striped, Checked, Geometric" },
      { name: "Color", type: "text", required: false, placeholder: "e.g. Cobalt Blue, Emerald Green" },
      { name: "Brand", type: "text", required: false, placeholder: "e.g. Yomi Classic" }
    ]
  },
  {
    id: "fashion_shoes",
    mainCategoryId: "fashion",
    names: { en: "Shoes & Footwear", ar: "الأحذية والأخفاف", fr: "Chaussures et Bottes" },
    icon: "Footprints",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80",
    order: 2,
    sizeSystem: {
      enabled: true,
      label: "Shoe Sizes (EU, US, UK)",
      sizes: [
        "EU 36", "EU 37", "EU 38", "EU 39", "EU 40", "EU 41", "EU 42", "EU 43", "EU 44", "EU 45",
        "US 6", "US 7", "US 8", "US 9", "US 10", "US 11", "US 12",
        "UK 5", "UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11",
        "Custom Size"
      ]
    },
    recommendedMaterials: ["Genuine Leather", "Suede", "Synthetic Mesh", "Canvas", "Rubber", "Nubuck"],
    fields: [
      { name: "Material", type: "select", required: true, options: ["Genuine Leather", "Suede", "Synthetic Mesh", "Canvas", "Rubber", "Nubuck"], placeholder: "Select shoe material" },
      { name: "Gender", type: "select", required: true, options: ["Men", "Women", "Unisex"], placeholder: "Select gender" },
      { name: "Size System", type: "select", required: false, options: ["EU System", "US System", "UK System", "Custom Sizing"], placeholder: "Select active sizing system" },
      { name: "Color", type: "text", required: false, placeholder: "e.g. Tan Brown, Matte Black" },
      { name: "Brand", type: "text", required: false, placeholder: "e.g. Yomi Athleisure" },
      { name: "Sole Type", type: "select", required: false, options: ["Rubber", "Leather", "Crepe", "EVA Foam", "TPU"], placeholder: "Select sole type" }
    ]
  },
  {
    id: "fashion_bags",
    mainCategoryId: "fashion",
    names: { en: "Bags", ar: "الحقائب", fr: "Sacs" },
    icon: "ShoppingBag",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80",
    order: 3,
    sizeSystem: { enabled: false, label: "Bag Dimensions", sizes: [] },
    recommendedMaterials: ["Genuine Leather", "Suede", "Vegan Leather", "Canvas", "Nylon", "Polyester"],
    fields: [
      { name: "Material", type: "select", required: true, options: ["Genuine Leather", "Suede", "Vegan Leather", "Canvas", "Nylon", "Polyester"], placeholder: "Select material" },
      { name: "Color", type: "text", required: false, placeholder: "e.g. Tan, Onyx, Crimson" },
      { name: "Brand", type: "text", required: false, placeholder: "e.g. Yomi Leatherworks" },
      { name: "Capacity", type: "number", required: false, unit: "L", placeholder: "e.g. 15" },
      { name: "Waterproof", type: "boolean", required: false }
    ]
  },
  {
    id: "fashion_jewelry",
    mainCategoryId: "fashion",
    names: { en: "Jewelry & Accessories", ar: "المجوهرات والإكسسوارات", fr: "Bijoux et Accessoires" },
    icon: "Gem",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80",
    order: 4,
    sizeSystem: {
      enabled: true,
      label: "Ring & Chain Sizing",
      sizes: ["Small", "Medium", "Large", "One Size", "Custom Ring Size"]
    },
    recommendedMaterials: ["925 Silver", "18K Gold", "Stainless Steel", "Brass", "Leather", "Beads"],
    fields: [
      { name: "Material", type: "select", required: true, options: ["925 Silver", "18K Gold", "Stainless Steel", "Brass", "Leather", "Beads"], placeholder: "Select metal or base" },
      { name: "Stone Type", type: "text", required: false, placeholder: "e.g. Turquoise, Red Coral, Emerald, None" },
      { name: "Color", type: "text", required: false, placeholder: "e.g. Gold, Polished Silver" },
      { name: "Weight", type: "number", required: false, unit: "g", placeholder: "e.g. 12" },
      { name: "Brand", type: "text", required: false, placeholder: "e.g. Ath Yenni Silver" }
    ]
  },
  {
    id: "fashion_watches",
    mainCategoryId: "fashion",
    names: { en: "Watches", ar: "الساعات", fr: "Montres" },
    icon: "Clock",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&auto=format&fit=crop&q=80",
    order: 5,
    sizeSystem: { enabled: false, label: "Case Size", sizes: [] },
    recommendedMaterials: ["Stainless Steel", "Titanium", "Genuine Leather", "Silicone", "Gold Plated"],
    fields: [
      { name: "Movement Type", type: "select", required: true, options: ["Automatic", "Quartz", "Smart / Digital", "Mechanical Hand-wind"], placeholder: "Select movement type" },
      { name: "Water Resistance", type: "select", required: false, options: ["3 ATM (30m)", "5 ATM (50m)", "10 ATM (100m)", "20 ATM+ (200m+)"], placeholder: "Select rating" },
      { name: "Dial Color", type: "text", required: false, placeholder: "e.g. Midnight Blue, Sunburst Silver" },
      { name: "Strap Material", type: "select", required: false, options: ["Stainless Steel", "Genuine Leather", "Silicone Rubber", "Nylon Strap"], placeholder: "Select strap" },
      { name: "Brand", type: "text", required: false, placeholder: "e.g. Yomi Horology" }
    ]
  },
  {
    id: "fashion_hats_caps",
    mainCategoryId: "fashion",
    names: { en: "Hats & Caps", ar: "القبعات والأغطية", fr: "Chapeaux et Casquettes" },
    icon: "Squirrel",
    image: "https://images.unsplash.com/photo-1534215754734-18e55d13ce35?w=600&auto=format&fit=crop&q=80",
    order: 6,
    sizeSystem: {
      enabled: true,
      label: "Hat Sizes",
      sizes: ["Small/Medium (S/M)", "Large/Extra Large (L/XL)", "One Size Fits All", "Adjustable Strap", "Custom Size"]
    },
    recommendedMaterials: ["Cotton Twill", "Polyester Mesh", "Pure Wool", "Woven Straw", "Nylon Ripstop"],
    fields: [
      { name: "Material", type: "select", required: true, options: ["Cotton Twill", "Polyester Mesh", "Pure Wool", "Woven Straw", "Nylon Ripstop"], placeholder: "Select material" },
      { name: "Color", type: "text", required: false, placeholder: "e.g. Olive Green, Navy Blue" },
      { name: "Closure Type", type: "select", required: false, options: ["Snapback", "Fitted", "Strapback / Buckle", "Flexfit / Elastic"], placeholder: "Select closure" },
      { name: "Brand", type: "text", required: false, placeholder: "e.g. Yomi Headwear" }
    ]
  },

  // --- KIDS ---
  {
    id: "kids_clothing",
    mainCategoryId: "kids",
    names: { en: "Clothing", ar: "ملابس الأطفال", fr: "Vêtements Enfants" },
    icon: "Shirt",
    image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=600&auto=format&fit=crop&q=80",
    order: 0,
    sizeSystem: {
      enabled: true,
      label: "Age-based Sizes (Newborn - 16 Years)",
      sizes: [
        "Newborn", "0-3 Months", "3-6 Months", "6-12 Months", "12-18 Months", "18-24 Months",
        "2 Years", "3 Years", "4 Years", "5 Years", "6 Years", "7 Years", "8 Years", "9 Years",
        "10 Years", "11 Years", "12 Years", "13 Years", "14 Years", "15 Years", "16 Years",
        "Custom Age Sizing"
      ]
    },
    recommendedMaterials: ["Organic Cotton", "Bamboo Fiber", "Soft Fleece", "Cotton Blend", "Linen"],
    fields: [
      { name: "Material", type: "select", required: true, options: ["Organic Cotton", "Bamboo Fiber", "Soft Fleece", "Cotton Blend", "Linen"], placeholder: "Select soft material" },
      { name: "Gender", type: "select", required: true, options: ["Boys", "Girls", "Unisex"], placeholder: "Select child gender" },
      { name: "Color", type: "text", required: false, placeholder: "e.g. Pastel Sky Blue, Soft Rose" },
      { name: "Pattern", type: "text", required: false, placeholder: "e.g. Animal Print, Stripes, Embroidered" },
      { name: "Brand", type: "text", required: false, placeholder: "e.g. Yomi Kids" },
      { name: "Care Instructions", type: "text", required: false, placeholder: "e.g. Machine wash gentle, low heat dry" }
    ]
  },
  {
    id: "kids_shoes",
    mainCategoryId: "kids",
    names: { en: "Shoes", ar: "أحذية الأطفال", fr: "Chaussures Enfants" },
    icon: "Footprints",
    image: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=600&auto=format&fit=crop&q=80",
    order: 1,
    sizeSystem: {
      enabled: true,
      label: "Kids Shoe Sizes (EU, US, UK)",
      sizes: [
        "EU 19", "EU 20", "EU 21", "EU 22", "EU 23", "EU 24", "EU 25", "EU 26", "EU 27", "EU 28", "EU 29", "EU 30", "EU 31", "EU 32", "EU 33", "EU 34", "EU 35",
        "US Kids 4", "US Kids 5", "US Kids 6", "US Kids 7", "US Kids 8", "US Kids 9", "US Kids 10", "US Kids 11", "US Kids 12",
        "UK Kids 3", "UK Kids 4", "UK Kids 5", "UK Kids 6", "UK Kids 7", "UK Kids 8", "UK Kids 9", "UK Kids 10",
        "Custom Kids Shoe Size"
      ]
    },
    recommendedMaterials: ["Soft Leather", "Canvas", "Mesh", "Synthetic Leather", "Rubber"],
    fields: [
      { name: "Material", type: "select", required: true, options: ["Soft Leather", "Canvas", "Mesh", "Synthetic Leather", "Rubber"], placeholder: "Select material" },
      { name: "Color", type: "text", required: false, placeholder: "e.g. Bright Red, Mint Green" },
      { name: "Fastening Type", type: "select", required: true, options: ["Velcro", "Slip-on", "Lace-up", "Elastic Strap"], placeholder: "Select fastening" },
      { name: "Brand", type: "text", required: false, placeholder: "e.g. Yomi Steps" }
    ]
  },
  {
    id: "kids_accessories",
    mainCategoryId: "kids",
    names: { en: "Accessories", ar: "إكسسوارات الأطفال", fr: "Accessoires Enfants" },
    icon: "Scissors",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80",
    order: 2,
    sizeSystem: { enabled: false, label: "Sizes", sizes: [] },
    recommendedMaterials: ["Hypoallergenic Cotton", "BPA-Free Plastic", "Elastic Fiber", "Soft Wool"],
    fields: [
      { name: "Type", type: "text", required: true, placeholder: "e.g. Hairclips, Socks, Sunglasses, Mittens" },
      { name: "Material", type: "select", required: true, options: ["Hypoallergenic Cotton", "BPA-Free Plastic", "Elastic Fiber", "Soft Wool"], placeholder: "Select material" },
      { name: "Color", type: "text", required: false, placeholder: "e.g. Rainbow Pastel, Lemon Yellow" },
      { name: "Brand", type: "text", required: false, placeholder: "e.g. Yomi Tiny" }
    ]
  },
  {
    id: "kids_toys",
    mainCategoryId: "kids",
    names: { en: "Toys", ar: "الألعاب", fr: "Jouets" },
    icon: "Gamepad",
    image: "https://images.unsplash.com/photo-1539627831859-a911cf04d3cd?w=600&auto=format&fit=crop&q=80",
    order: 3,
    sizeSystem: { enabled: false, label: "Size Options", sizes: [] },
    recommendedMaterials: ["BPA-Free Plastic", "Natural Maple Wood", "Organic Cotton Plush", "Food-Grade Silicone"],
    fields: [
      { name: "Recommended Age", type: "select", required: true, options: ["0-6 Months", "6-12 Months", "1-2 Years", "3-4 Years", "5-7 Years", "8-11 Years", "12+ Years"], placeholder: "Select target age group" },
      { name: "Material", type: "select", required: true, options: ["BPA-Free Plastic", "Natural Maple Wood", "Organic Cotton Plush", "Food-Grade Silicone"], placeholder: "Select core material" },
      { name: "Battery Required", type: "boolean", required: true },
      { name: "Educational", type: "boolean", required: false },
      { name: "Brand", type: "text", required: false, placeholder: "e.g. Yomi Play" }
    ]
  },
  {
    id: "kids_baby_essentials",
    mainCategoryId: "kids",
    names: { en: "Baby Essentials", ar: "مستلزمات الأطفال الرضع", fr: "Essentiels pour Bébé" },
    icon: "Smile",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&auto=format&fit=crop&q=80",
    order: 4,
    sizeSystem: { enabled: false, label: "Sizes", sizes: [] },
    recommendedMaterials: ["Medical Grade Silicone", "BPA-Free Plastic", "Organic Bamboo Cotton", "Hypoallergenic Microfiber"],
    fields: [
      { name: "Essential Type", type: "select", required: true, options: ["Feeding (baby bottles, pacifiers, accessories)", "Diapering (diapers, wipes)", "Baby Care Products (shampoo, lotion)", "Strollers & Car Seats", "Nursery & Safety Products", "Other Essentials"], placeholder: "Select category of essential" },
      { name: "Material", type: "select", required: true, options: ["Medical Grade Silicone", "BPA-Free Plastic", "Organic Bamboo Cotton", "Hypoallergenic Microfiber"], placeholder: "Select material" },
      { name: "BPA Free", type: "boolean", required: true },
      { name: "Hypoallergenic", type: "boolean", required: true },
      { name: "Brand", type: "text", required: false, placeholder: "e.g. Yomi Care" }
    ]
  },

  // --- HEALTH & BEAUTY ---
  {
    id: "health_beauty_all",
    mainCategoryId: "health_beauty",
    names: { en: "All Health & Beauty", ar: "كل الصحة والجمال", fr: "Tout Santé & Beauté" },
    icon: "Sparkles",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80",
    order: 0,
    sizeSystem: { enabled: false, label: "Volume Options", sizes: [] },
    recommendedMaterials: ["Recyclable Glass", "Bio Polymers"],
    fields: [
      { name: "Volume", type: "number", required: true, unit: "ml", placeholder: "e.g. 100" }
    ]
  },
  {
    id: "health_beauty_cosmetics",
    mainCategoryId: "health_beauty",
    names: { en: "Cosmetics", ar: "مستحضرات التجميل", fr: "Cosmétiques" },
    icon: "Sparkles",
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&auto=format&fit=crop&q=80",
    order: 1,
    sizeSystem: {
      enabled: true,
      label: "Volume & Packaging Options",
      sizes: ["Travel Size (15ml)", "Standard (50ml)", "Full Size (100ml)", "Pro/Refill (250ml)"]
    },
    recommendedMaterials: ["Amber Glass Dropper", "Recyclable PET", "Bamboo Coated Case", "Aluminum Refill Tube"],
    fields: [
      { name: "Volume", type: "number", required: true, unit: "ml", placeholder: "e.g. 50" },
      { name: "Skin Type", type: "select", required: false, options: ["All Skin Types", "Dry", "Oily", "Sensitive", "Combination", "Acne-Prone"], placeholder: "Select skin type" },
      { name: "Ingredients", type: "text", required: true, placeholder: "e.g. Mica, Kaolin Clay, Organic pigments, Rose extract" },
      { name: "Manufacturing Date", type: "text", required: false, placeholder: "e.g. 2026-05-15" },
      { name: "Expiration Date", type: "text", required: false, placeholder: "e.g. 12 Months after opening or 2028-05-15" },
      { name: "Batch Number", type: "text", required: false, placeholder: "e.g. BATCH-2026C" },
      { name: "Cruelty Free", type: "boolean", required: false },
      { name: "Organic Certified", type: "boolean", required: false }
    ]
  },
  {
    id: "health_beauty_skincare",
    mainCategoryId: "health_beauty",
    names: { en: "Skincare", ar: "العناية بالبشرة", fr: "Soins de la Peau" },
    icon: "Flower",
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&auto=format&fit=crop&q=80",
    order: 2,
    sizeSystem: {
      enabled: true,
      label: "Volume & Size Options",
      sizes: ["Sample (10ml)", "Standard (50ml)", "Large (120ml)", "Jumbo (200ml)"]
    },
    recommendedMaterials: ["Amber Glass Dropper", "Frosted Glass Jar", "Airless Pump", "Aluminum Tube"],
    fields: [
      { name: "Volume", type: "number", required: true, unit: "ml", placeholder: "e.g. 50" },
      { name: "Skin Concern", type: "select", required: false, options: ["Anti-Aging", "Hydration", "Brightening", "Acne & Blemishes", "Sun Protection", "Skin Barrier Repair"], placeholder: "Select skin concern" },
      { name: "Ingredients", type: "text", required: true, placeholder: "e.g. Pure prickly pear seed oil, Hyaluronic acid, Niacinamide" },
      { name: "Manufacturing Date", type: "text", required: false, placeholder: "e.g. 2026-03-10" },
      { name: "Expiration Date", type: "text", required: false, placeholder: "e.g. 12M or 2028-03-10" },
      { name: "Batch Number", type: "text", required: false, placeholder: "e.g. LOT-SKIN-992" },
      { name: "Cruelty Free", type: "boolean", required: false }
    ]
  },
  {
    id: "health_beauty_haircare",
    mainCategoryId: "health_beauty",
    names: { en: "Hair Care", ar: "العناية بالشعر", fr: "Soins Capillaires" },
    icon: "Scissors",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80",
    order: 3,
    sizeSystem: {
      enabled: true,
      label: "Haircare Volume Options",
      sizes: ["100ml Bottle", "250ml Classic", "500ml Family Size", "1L Salon Refill"]
    },
    recommendedMaterials: ["Recyclable PET Bottle", "Aluminum Recyclable Bottle", "Eco-friendly Refill Pouch"],
    fields: [
      { name: "Volume", type: "number", required: true, unit: "ml", placeholder: "e.g. 250" },
      { name: "Hair Type", type: "select", required: false, options: ["All Hair Types", "Dry & Damaged", "Oily Hair", "Curly & Coily", "Color-Treated", "Fine & Thinning"], placeholder: "Select hair type" },
      { name: "Ingredients", type: "text", required: true, placeholder: "e.g. Rosemary oil, Keratin, Organic Argan Oil" },
      { name: "Sulfate Free", type: "boolean", required: false },
      { name: "Brand", type: "text", required: false, placeholder: "e.g. Yomi Botanicals" }
    ]
  },
  {
    id: "health_beauty_personalcare",
    mainCategoryId: "health_beauty",
    names: { en: "Personal Care", ar: "العناية الشخصية", fr: "Soins Personnels" },
    icon: "Heart",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop&q=80",
    order: 4,
    sizeSystem: { enabled: false, label: "Sizes", sizes: [] },
    recommendedMaterials: ["Recycled Plastic", "Biodegradable Cardboard", "Paper Sachet", "Glass Jar"],
    fields: [
      { name: "Type", type: "select", required: true, options: ["Deodorants", "Body Wash & Soaps", "Oral Care", "Feminine Care", "Shaving & Grooming"], placeholder: "Select care type" },
      { name: "Volume", type: "number", required: false, unit: "ml", placeholder: "e.g. 200" },
      { name: "Weight", type: "number", required: false, unit: "g", placeholder: "e.g. 150" },
      { name: "Organic", type: "boolean", required: false }
    ]
  },
  {
    id: "health_beauty_babycare",
    mainCategoryId: "health_beauty",
    names: { en: "Baby Care", ar: "رعاية الأطفال الرضع", fr: "Soins pour Bébé" },
    icon: "Baby",
    image: "https://images.unsplash.com/photo-1515488042361-404e9250afef?w=600&auto=format&fit=crop&q=80",
    order: 5,
    sizeSystem: { enabled: false, label: "Volume", sizes: [] },
    recommendedMaterials: ["BPA-Free Recyclable Plastic", "Glass Bottle", "FSC Cardboard Pack"],
    fields: [
      { name: "Care Type", type: "select", required: true, options: ["Baby Shampoo & Wash", "Baby Lotion & Oils", "Diaper Rash Cream", "Baby Wipes", "Baby Sunscreen"], placeholder: "Select baby care type" },
      { name: "Hypoallergenic", type: "boolean", required: true },
      { name: "Pediatrician Approved", type: "boolean", required: true },
      { name: "Ingredients", type: "text", required: true, placeholder: "e.g. Calendula, Organic Chamomile Extract" },
      { name: "Volume", type: "number", required: false, unit: "ml", placeholder: "e.g. 150" }
    ]
  },
  {
    id: "health_beauty_vitamins",
    mainCategoryId: "health_beauty",
    names: { en: "Vitamins", ar: "الفيتامينات والمكملات", fr: "Vitamines" },
    icon: "ShieldAlert",
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600&auto=format&fit=crop&q=80",
    order: 6,
    sizeSystem: {
      enabled: true,
      label: "Supplement Capsule/Pill Count",
      sizes: ["30 Count", "60 Count", "90 Count", "120 Count", "180 Count"]
    },
    recommendedMaterials: ["UV-Shield Amber Glass Bottle", "BPA-Free PET Jar"],
    fields: [
      { name: "Serving Size", type: "text", required: true, placeholder: "e.g. 2 Gummies daily, 1 Capsule" },
      { name: "Active Ingredients", type: "text", required: true, placeholder: "e.g. Vitamin C, Zinc, Vitamin D3, Elderberry" },
      { name: "Manufacturing Date", type: "text", required: false, placeholder: "e.g. 2026-06-01" },
      { name: "Expiration Date", type: "text", required: true, placeholder: "e.g. 2028-06-01" },
      { name: "Batch Number", type: "text", required: false, placeholder: "e.g. LOT-VIT-5521" },
      { name: "Gluten Free", type: "boolean", required: false },
      { name: "Vegan", type: "boolean", required: false }
    ]
  },
  {
    id: "health_beauty_medical",
    mainCategoryId: "health_beauty",
    names: { en: "Medical Supplies", ar: "المستلزمات الطبية", fr: "Fournitures Médicales" },
    icon: "HeartHandshake",
    image: "https://images.unsplash.com/photo-1583324113626-70df0f4decab?w=600&auto=format&fit=crop&q=80",
    order: 7,
    sizeSystem: { enabled: false, label: "Sizes Available", sizes: [] },
    recommendedMaterials: ["Sterile Medical Grade Packaging", "Paper Carton", "Sealed Foil Bag"],
    fields: [
      { name: "Supply Type", type: "select", required: true, options: ["First Aid & Bandages", "Face Masks & Sanitizers", "Thermometers & Monitors", "Supports & Braces", "Other Supplies"], placeholder: "Select supply type" },
      { name: "Sterile", type: "boolean", required: true },
      { name: "FDA Approved", type: "boolean", required: true },
      { name: "Expiry Date", type: "text", required: false, placeholder: "e.g. 2031-12-31" }
    ]
  },

  // --- ELECTRONICS ---
  {
    id: "electronics_all",
    mainCategoryId: "electronics",
    names: { en: "All Electronics", ar: "كل الإلكترونيات", fr: "Toute l'Électronique" },
    icon: "Smartphone",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&auto=format&fit=crop&q=80",
    order: 0,
    sizeSystem: { enabled: false, label: "Form Factors", sizes: [] },
    recommendedMaterials: ["Aluminum", "Plastic"],
    fields: [
      { name: "Brand", type: "text", required: true, placeholder: "e.g. Yomi Tech" },
      { name: "Model", type: "text", required: true, placeholder: "e.g. Air Pro" }
    ]
  },
  {
    id: "electronics_smartphones",
    mainCategoryId: "electronics",
    names: { en: "Smartphones", ar: "الهواتف الذكية", fr: "Smartphones" },
    icon: "Smartphone",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80",
    order: 1,
    sizeSystem: { enabled: false, label: "Form Factors", sizes: [] },
    recommendedMaterials: ["Tempered Glass & Aluminum", "Titanium & Glass", "Recycled Polymer"],
    fields: [
      { name: "Brand", type: "select", required: true, options: ["Apple", "Samsung", "Yomi Tech", "IRIS", "Condor", "Stream System", "Google Pixel", "Xiaomi", "OnePlus", "Huawei"], placeholder: "Select manufacturer" },
      { name: "Model", type: "text", required: true, placeholder: "e.g. Galaxy S25 FE" },
      { name: "Processor", type: "select", required: false, options: ["Snapdragon 8 Gen 3", "Apple A17 Pro", "Apple A18 Pro", "Google Tensor G4", "MediaTek Dimensity 9300", "Exynos 2400", "Octa-Core Midrange"], placeholder: "Select processor chipset" },
      { name: "RAM", type: "select", required: false, options: ["4GB", "6GB", "8GB", "12GB", "16GB", "24GB"], placeholder: "Select memory RAM size" },
      { name: "Storage", type: "select", required: false, options: ["64GB", "128GB", "256GB", "512GB", "1TB"], placeholder: "Select disk space" },
      { name: "Screen Size", type: "number", required: false, unit: "inches", placeholder: "e.g. 6.7" },
      { name: "Battery Capacity", type: "number", required: false, unit: "mAh", placeholder: "e.g. 5000" },
      { name: "Camera Specs", type: "text", required: false, placeholder: "e.g. 50MP Main + 12MP Ultra-wide" },
      { name: "Network Connection", type: "select", required: false, options: ["5G + Wi-Fi 7", "5G LTE", "4G LTE Only"], placeholder: "Select connection network" },
      { name: "SIM Type", type: "select", required: false, options: ["Dual SIM (Nano + eSIM)", "eSIM Only", "Single Nano SIM"], placeholder: "Select SIM option" },
      { name: "Operating System", type: "select", required: false, options: ["iOS", "Android", "HyperOS", "HarmonyOS"], placeholder: "Select OS" }
    ]
  },
  {
    id: "electronics_tablets",
    mainCategoryId: "electronics",
    names: { en: "Tablets", ar: "الأجهزة اللوحية", fr: "Tablettes" },
    icon: "Tablet",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80",
    order: 2,
    sizeSystem: { enabled: false, label: "Form Factors", sizes: [] },
    recommendedMaterials: ["Aluminum", "Recycled Plastic", "Tempered Glass"],
    fields: [
      { name: "Brand", type: "select", required: true, options: ["Apple", "Samsung", "Lenovo", "Xiaomi", "Huawei", "Amazon Fire", "Other"], placeholder: "Select manufacturer" },
      { name: "Model", type: "text", required: true, placeholder: "e.g. iPad Pro M4" },
      { name: "Screen Size", type: "number", required: false, unit: "inches", placeholder: "e.g. 11.0" },
      { name: "RAM", type: "select", required: false, options: ["3GB", "4GB", "6GB", "8GB", "12GB", "16GB"], placeholder: "Select memory RAM size" },
      { name: "Storage", type: "select", required: false, options: ["32GB", "64GB", "128GB", "256GB", "512GB", "1TB"], placeholder: "Select disk space" },
      { name: "Processor", type: "text", required: false, placeholder: "e.g. Apple M4 Chip, Snapdragon 8 Gen 2" },
      { name: "Stylus Support", type: "boolean", required: false }
    ]
  },
  {
    id: "electronics_laptops",
    mainCategoryId: "electronics",
    names: { en: "Laptops", ar: "أجهزة الكمبيوتر المحمولة", fr: "Ordinateurs Portables" },
    icon: "Laptop",
    image: "https://images.unsplash.com/photo-1496181130204-755241544e35?w=600&auto=format&fit=crop&q=80",
    order: 3,
    sizeSystem: { enabled: false, label: "Form Factors", sizes: [] },
    recommendedMaterials: ["Anodized Aluminum", "Carbon Fiber", "Magnesium Alloy", "Premium Plastic"],
    fields: [
      { name: "Brand", type: "select", required: true, options: ["Apple", "Dell", "HP", "Lenovo", "ASUS", "Acer", "MSI", "Razer", "Microsoft Surface", "Other"], placeholder: "Select manufacturer" },
      { name: "Model", type: "text", required: true, placeholder: "e.g. ThinkPad X1 Carbon" },
      { name: "Processor", type: "select", required: false, options: ["Intel Core i9", "Intel Core i7", "Intel Core i5", "Intel Ultra 7", "AMD Ryzen 9", "AMD Ryzen 7", "AMD Ryzen 5", "Apple M3", "Apple M3 Pro / Max", "Apple M4"], placeholder: "Select processor chipset" },
      { name: "RAM", type: "select", required: false, options: ["8GB", "16GB", "24GB", "32GB", "64GB"], placeholder: "Select memory RAM size" },
      { name: "Storage", type: "select", required: false, options: ["256GB SSD", "512GB SSD", "1TB SSD", "2TB SSD"], placeholder: "Select storage size" },
      { name: "Graphics Card", type: "text", required: false, placeholder: "e.g. NVIDIA RTX 4060, Integrated" },
      { name: "Screen Size", type: "number", required: false, unit: "inches", placeholder: "e.g. 14.2" },
      { name: "Operating System", type: "select", required: false, options: ["Windows 11 Home", "Windows 11 Pro", "macOS", "Linux / Ubuntu", "ChromeOS"], placeholder: "Select OS" }
    ]
  },
  {
    id: "electronics_desktops",
    mainCategoryId: "electronics",
    names: { en: "Desktops", ar: "أجهزة الكمبيوتر المكتبية", fr: "Ordinateurs de Bureau" },
    icon: "Monitor",
    image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&auto=format&fit=crop&q=80",
    order: 4,
    sizeSystem: { enabled: false, label: "Form Factors", sizes: [] },
    recommendedMaterials: ["Steel & Tempered Glass", "Aluminum", "Molded Plastic"],
    fields: [
      { name: "Brand", type: "select", required: true, options: ["Custom Build", "Dell", "HP", "Lenovo", "Apple iMac", "Apple Mac Studio", "ASUS", "Acer"], placeholder: "Select manufacturer" },
      { name: "Processor", type: "text", required: false, placeholder: "e.g. Ryzen 7 7800X3D" },
      { name: "RAM", type: "select", required: false, options: ["8GB", "16GB", "32GB", "64GB", "128GB"], placeholder: "Select memory RAM size" },
      { name: "Storage", type: "select", required: false, options: ["512GB SSD", "1TB SSD", "2TB SSD", "2TB HDD + 512GB SSD"], placeholder: "Select disk space" },
      { name: "Graphics Card", type: "text", required: false, placeholder: "e.g. NVIDIA RTX 4070 Ti Super" },
      { name: "Power Supply", type: "number", required: false, unit: "W", placeholder: "e.g. 750" }
    ]
  },
  {
    id: "electronics_cameras",
    mainCategoryId: "electronics",
    names: { en: "Cameras", ar: "الكاميرات", fr: "Appareils Photo" },
    icon: "Camera",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80",
    order: 5,
    sizeSystem: { enabled: false, label: "Form Factors", sizes: [] },
    recommendedMaterials: ["Magnesium Alloy", "Polycarbonate", "Rubber Grip"],
    fields: [
      { name: "Brand", type: "select", required: true, options: ["Canon", "Sony", "Nikon", "Fujifilm", "Panasonic", "Leica", "GoPro", "DJI"], placeholder: "Select manufacturer" },
      { name: "Camera Type", type: "select", required: true, options: ["Mirrorless", "DSLR", "Point & Shoot", "Action Camera", "Cinema Camera"], placeholder: "Select type" },
      { name: "Sensor Resolution", type: "number", required: false, unit: "MP", placeholder: "e.g. 24.2" },
      { name: "Sensor Size", type: "select", required: false, options: ["Full Frame", "APS-C", "Micro Four Thirds", "1-inch", "Medium Format"], placeholder: "Select sensor size" },
      { name: "Video Resolution", type: "select", required: false, options: ["8K UHD", "4K 120fps", "4K 60fps", "1080p Full HD"], placeholder: "Select max video quality" }
    ]
  },
  {
    id: "electronics_headphones",
    mainCategoryId: "electronics",
    names: { en: "Headphones", ar: "سماعات الرأس", fr: "Casques et Écouteurs" },
    icon: "Headphones",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    order: 6,
    sizeSystem: { enabled: false, label: "Form Factors", sizes: [] },
    recommendedMaterials: ["Premium Leatherette", "Memory Foam", "Anodized Aluminum", "Recycled Plastic"],
    fields: [
      { name: "Brand", type: "select", required: true, options: ["Sony", "Bose", "Apple", "Sennheiser", "JBL", "Anker Soundcore", "Beats", "Audio-Technica"], placeholder: "Select brand" },
      { name: "Form Factor", type: "select", required: true, options: ["Over-Ear", "On-Ear", "In-Ear / True Wireless Earbuds", "Neckband"], placeholder: "Select type" },
      { name: "Active Noise Cancelling", type: "boolean", required: true },
      { name: "Battery Life", type: "number", required: false, unit: "hours", placeholder: "e.g. 30" },
      { name: "Connectivity", type: "select", required: false, options: ["Bluetooth 5.4 + Wired", "Bluetooth Only", "Wired Only"], placeholder: "Select connectivity" }
    ]
  },
  {
    id: "electronics_gaming",
    mainCategoryId: "electronics",
    names: { en: "Gaming", ar: "الألعاب والترفيه", fr: "Console & Jeux" },
    icon: "Gamepad",
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fit=crop&q=80",
    order: 7,
    sizeSystem: { enabled: false, label: "Form Factors", sizes: [] },
    recommendedMaterials: ["Premium Polymers", "ABS Plastic", "Braided Fiber"],
    fields: [
      { name: "Gaming Category", type: "select", required: true, options: ["Consoles", "Controllers", "Gaming Mice", "Gaming Keyboards", "VR Headsets", "Gaming Chairs", "Accessories"], placeholder: "Select category" },
      { name: "Brand", type: "select", required: true, options: ["Sony PlayStation", "Microsoft Xbox", "Nintendo", "Razer", "Logitech G", "Corsair", "SteelSeries", "ASUS ROG", "Meta"], placeholder: "Select manufacturer" },
      { name: "Compatibility", type: "text", required: false, placeholder: "e.g. PS5, PC, Xbox Series X, Switch" },
      { name: "Wireless", type: "boolean", required: true }
    ]
  },

  // --- HOME & LIVING ---
  {
    id: "home_living_all",
    mainCategoryId: "home_living",
    names: { en: "All Home & Living", ar: "كل المنزل والمعيشة", fr: "Tout Maison & Jardin" },
    icon: "Home",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
    order: 0,
    sizeSystem: { enabled: false, label: "Sizes", sizes: [] },
    recommendedMaterials: ["Wood", "Metal", "Fabric"],
    fields: [
      { name: "Material", type: "text", required: true, placeholder: "e.g. Pine wood" }
    ]
  },
  {
    id: "home_furniture",
    mainCategoryId: "home_living",
    names: { en: "Furniture & Wooden Arts", ar: "الأثاث والفنون الخشبية", fr: "Ameublement et Art du Bois" },
    icon: "Home",
    image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600&auto=format&fit=crop&q=80",
    order: 1,
    sizeSystem: {
      enabled: false,
      label: "Spatial Layout Sizing",
      sizes: []
    },
    recommendedMaterials: ["Solid Wood", "Oak", "Walnut", "Beech", "MDF", "Metal", "Glass", "Plastic", "Wood plus Metal", "Other"],
    fields: [
      { name: "Material", type: "select", required: true, options: ["Solid Wood", "Oak", "Walnut", "Beech", "MDF", "Metal", "Glass", "Plastic", "Wood plus Metal", "Other"], placeholder: "Select furniture material" },
      { name: "Assembly Required", type: "boolean", required: true },
      { name: "Weight", type: "number", required: false, unit: "kg", placeholder: "e.g. 15" },
      { name: "Width", type: "number", required: false, unit: "cm", placeholder: "e.g. 120" },
      { name: "Height", type: "number", required: false, unit: "cm", placeholder: "e.g. 75" },
      { name: "Depth", type: "number", required: false, unit: "cm", placeholder: "e.g. 60" }
    ]
  },

  // --- SPORTS & TOYS ---
  {
    id: "sports_toys_all",
    mainCategoryId: "sports_toys",
    names: { en: "All Sports & Toys", ar: "كل الرياضة والألعاب", fr: "Tout Sports et Jouets" },
    icon: "Activity",
    image: "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=600&auto=format&fit=crop&q=80",
    order: 0,
    sizeSystem: { enabled: false, label: "Size", sizes: [] },
    recommendedMaterials: ["Nylon", "Carbon Fiber", "Composite"],
    fields: [
      { name: "Material", type: "text", required: false, placeholder: "e.g. Carbon structure" },
      { name: "Age Group", type: "select", required: false, options: ["All Ages", "Infants", "Kids", "Adults"], placeholder: "Select target age" }
    ]
  },

  // --- ARTS & CRAFTS ---
  {
    id: "arts_crafts_all",
    mainCategoryId: "arts_crafts",
    names: { en: "All Arts & Crafts", ar: "كل الفنون والحرف", fr: "Tout Arts & Artisanat" },
    icon: "Palette",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80",
    order: 0,
    sizeSystem: { enabled: false, label: "Size", sizes: [] },
    recommendedMaterials: ["Clay", "Wool", "Silver", "Wood"],
    fields: [
      { name: "Handmade", type: "boolean", required: true }
    ]
  },
  {
    id: "arts_crafts_looms",
    mainCategoryId: "arts_crafts",
    names: { en: "Crafts & Traditional Looms", ar: "الحرف اليدوية والمنسوجات التقليدية", fr: "Artisanat et Métiers de Tissage" },
    icon: "Palette",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80",
    order: 1,
    sizeSystem: {
      enabled: false,
      label: "Dimension Blueprints",
      sizes: []
    },
    recommendedMaterials: ["Pure Sheep Wool", "Natural Clay", "Copper Filigree", "Olive Wood", "Saddlery Leather", "Brass Filigree"],
    fields: [
      { name: "Material", type: "select", required: true, options: ["Pure Sheep Wool", "Natural Clay", "Copper Filigree", "Olive Wood", "Saddlery Leather", "Brass Filigree"], placeholder: "Select artisan base material" },
      { name: "Width", type: "number", required: true, unit: "cm", placeholder: "e.g. 120" },
      { name: "Length", type: "number", required: true, unit: "cm", placeholder: "e.g. 180" },
      { name: "Crafting Technique", type: "text", required: true, placeholder: "e.g. Hand-knotted loom, Chased filigree, Clay baked pit" },
      { name: "Origin Region", type: "select", required: false, options: ["Ghardaïa (M'zab)", "Ath Yenni (Kabylie)", "Tlemcen", "Biskra", "Tamanrasset (Hoggar)", "Algiers Casbah"], placeholder: "Select historical origin" },
      { name: "Time to Make", type: "number", required: false, unit: "days", placeholder: "e.g. 14" },
      { name: "Weight", type: "number", required: false, unit: "kg", placeholder: "e.g. 3.5" }
    ]
  },
  {
    id: "arts_crafts_poterie",
    mainCategoryId: "arts_crafts",
    names: { en: "Ceramics & Poterie", ar: "الخزف والفخار", fr: "Céramiques et Poterie" },
    icon: "Flowerpot",
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&auto=format&fit=crop&q=80",
    order: 2,
    sizeSystem: {
      enabled: false,
      label: "Vase & Platter Sizes",
      sizes: []
    },
    recommendedMaterials: ["Terracotta Clay", "Red Clay", "Kaolin Porcelain", "Stoneware", "Glazed Ceramic"],
    fields: [
      { name: "Clay Type", type: "select", required: true, options: ["Terracotta Clay", "Red Clay", "Kaolin Porcelain", "Stoneware", "Glazed Ceramic"], placeholder: "Select clay body type" },
      { name: "Glaze Finish", type: "select", required: false, options: ["Glossy Glaze", "Matte Glaze", "Metallic luster", "Unglazed Natural"], placeholder: "Select glaze finish" },
      { name: "Kiln Temperature", type: "number", required: false, unit: "°C", placeholder: "e.g. 1200" },
      { name: "Artisanal Origin", type: "select", required: true, options: ["Bizen", "Kabylie", "Tlemcen", "M'zab Valley", "Guelma"], placeholder: "Select artisanal cluster" },
      { name: "Handmade", type: "boolean", required: true },
      { name: "Diameter", type: "number", required: false, unit: "cm", placeholder: "e.g. 25" },
      { name: "Height", type: "number", required: false, unit: "cm", placeholder: "e.g. 35" },
      { name: "Weight", type: "number", required: false, unit: "kg", placeholder: "e.g. 1.2" }
    ]
  },
  {
    id: "arts_crafts_music",
    mainCategoryId: "arts_crafts",
    names: { en: "Music & Instruments", ar: "الموسيقى والآلات الموسيقية", fr: "Musique et Instruments" },
    icon: "Music",
    image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop&q=80",
    order: 3,
    sizeSystem: {
      enabled: true,
      label: "Instrument Format Configuration",
      sizes: ["Standard", "Compact (3/4)", "Full Size (4/4)", "Concert", "Tenor", "Soprano"]
    },
    recommendedMaterials: ["Maple Wood", "Rosewood", "Spruce Wood", "Mahogany", "Brass", "Carbon Fiber", "Celluloid"],
    fields: [
      { name: "Instrument Type", type: "select", required: true, options: ["String Instrument", "Wind Instrument", "Percussion", "Keyboard", "Audio Gear", "Accessories"], placeholder: "Select instrument type" },
      { name: "Material", type: "select", required: true, options: ["Maple Wood", "Rosewood", "Spruce Wood", "Mahogany", "Brass", "Carbon Fiber"], placeholder: "Select crafting wood/metal" },
      { name: "Brand", type: "text", required: true, placeholder: "e.g. Yamani, Fender, Custom Artisan" },
      { name: "Handedness", type: "select", required: false, options: ["Right-Handed", "Left-Handed", "Ambidextrous"], placeholder: "Select handedness" },
      { name: "Number of Strings", type: "number", required: false, unit: "strings", placeholder: "e.g. 6" },
      { name: "Audio Output", type: "select", required: false, options: ["Acoustic", "Electric", "Acoustic-Electric"], placeholder: "Select audio output type" },
      { name: "Accessories Included", type: "text", required: false, placeholder: "e.g. Gig bag, tuner, spare strings, pick" }
    ]
  },

  // --- FOOD & BEVERAGES ---
  {
    id: "food_beverages_all",
    mainCategoryId: "food_beverages",
    names: { en: "All Food & Beverages", ar: "كل الأغذية والمشروبات", fr: "Tout Alimentation & Boissons" },
    icon: "Utensils",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80",
    order: 0,
    sizeSystem: { enabled: false, label: "Portion Options", sizes: [] },
    recommendedMaterials: ["Eco-friendly Bag", "Glass Jar"],
    fields: [
      { name: "Weight", type: "number", required: true, unit: "g", placeholder: "e.g. 250" }
    ]
  },
  {
    id: "food_beverages_organic",
    mainCategoryId: "food_beverages",
    names: { en: "Food & Organic Harvests", ar: "المنتجات الغذائية والمحاصيل العضوية", fr: "Alimentation et Récoltes Organiques" },
    icon: "Utensils",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=80",
    order: 1,
    sizeSystem: {
      enabled: true,
      label: "Packaging & Portion Options",
      sizes: ["100g Pack", "250g Jar", "500g Jar", "1kg Bag", "5kg Box"]
    },
    recommendedMaterials: ["Glass Jar", "Eco-friendly Cardboard", "Paper Bag", "Tin Can", "Vacuum Sealed Pack"],
    fields: [
      { name: "Weight", type: "number", required: true, unit: "g", placeholder: "e.g. 500" },
      { name: "Ingredients", type: "text", required: true, placeholder: "e.g. 100% natural deglet nour dates" },
      { name: "Allergens", type: "text", required: false, placeholder: "e.g. None, May contain traces of nuts" },
      { name: "Storage Conditions", type: "select", required: true, options: ["Keep in a cool, dry place", "Refrigerate after opening", "Store below 18°C", "Freeze"], placeholder: "Select storage condition" },
      { name: "Packaging Type", type: "select", required: true, options: ["Glass Jar", "Eco-friendly Bag", "Vacuum Sealed Pack", "Metal Tin", "Cardboard Carton"], placeholder: "Select packaging type" },
      { name: "Country of Origin", type: "select", required: true, options: ["Algeria", "Tunisia", "Morocco", "Imported"], placeholder: "Select origin country" },
      { name: "Expiration Date", type: "text", required: false, placeholder: "e.g. Best before Oct 2027" }
    ]
  },

  // --- AUTOMOTIVE & TOOLS ---
  {
    id: "automotive_tools_all",
    mainCategoryId: "automotive_tools",
    names: { en: "All Automotive & Tools", ar: "كل السيارات والأدوات", fr: "Tout Automobile & Outils" },
    icon: "Wrench",
    image: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80",
    order: 0,
    sizeSystem: { enabled: false, label: "Size", sizes: [] },
    recommendedMaterials: ["Steel", "Chrome Vanadium"],
    fields: [
      { name: "Type", type: "text", required: true, placeholder: "e.g. Hand tools, wrench" }
    ]
  }
];

// Helper to load or initialize categories from Firestore
export async function fetchCategoriesFromFirestore(): Promise<{
  mainCategories: MainCategory[];
  subcategories: Subcategory[];
}> {
  try {
    const mainSnap = await getDocs(collection(db, "categories"));
    const subSnap = await getDocs(collection(db, "subcategories"));

    let mainCategories: MainCategory[] = [];
    let subcategories: Subcategory[] = [];

    mainSnap.forEach((doc) => {
      mainCategories.push(doc.data() as MainCategory);
    });

    subSnap.forEach((doc) => {
      subcategories.push(doc.data() as Subcategory);
    });

    // Seed if empty or missing new categories/subcategories (schema evolution check)
    const missingMains = DEFAULT_MAIN_CATEGORIES.filter(c => !mainCategories.some(existing => existing.id === c.id));
    if (missingMains.length > 0) {
      console.log(`Seeding ${missingMains.length} missing default main categories into Firestore...`);
      const batch = writeBatch(db);
      for (const cat of missingMains) {
        const docRef = doc(db, "categories", cat.id);
        batch.set(docRef, cat);
      }
      await batch.commit();
      mainCategories = [...mainCategories, ...missingMains];
    }

    const missingSubs = DEFAULT_SUBCATEGORIES.filter(s => !subcategories.some(existing => existing.id === s.id));
    if (missingSubs.length > 0) {
      console.log(`Seeding ${missingSubs.length} missing default subcategories into Firestore...`);
      const batch = writeBatch(db);
      for (const sub of missingSubs) {
        const docRef = doc(db, "subcategories", sub.id);
        batch.set(docRef, sub);
      }
      await batch.commit();
      subcategories = [...subcategories, ...missingSubs];
    }

    // Filter out archives unless wanted, and sort by order
    const sortedMain = mainCategories
      .filter((c) => !c.isArchived)
      .sort((a, b) => a.order - b.order);
    const sortedSub = subcategories
      .filter((s) => !s.isArchived)
      .sort((a, b) => a.order - b.order);

    return { mainCategories: sortedMain, subcategories: sortedSub };
  } catch (error) {
    try {
      handleFirestoreError(error, OperationType.LIST, "categories");
    } catch (_) {
      // Ignore re-thrown error in fallback fetcher
    }
    // Fallback gracefully to default arrays
    return {
      mainCategories: DEFAULT_MAIN_CATEGORIES,
      subcategories: DEFAULT_SUBCATEGORIES,
    };
  }
}

// Save or Update a Main Category
export async function saveMainCategoryToFirestore(cat: MainCategory): Promise<void> {
  try {
    await setDoc(doc(db, "categories", cat.id), cat);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `categories/${cat.id}`);
    throw error;
  }
}

// Save or Update a Subcategory
export async function saveSubcategoryToFirestore(sub: Subcategory): Promise<void> {
  try {
    await setDoc(doc(db, "subcategories", sub.id), sub);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `subcategories/${sub.id}`);
    throw error;
  }
}

// Safe Delete policy for Main Category
export async function deleteMainCategoryFromFirestore(
  mainId: string,
  policy: { action: "archive" | "move"; targetMainCategoryId?: string }
): Promise<void> {
  try {
    const batch = writeBatch(db);

    if (policy.action === "archive") {
      // Archive Main Category
      const mainRef = doc(db, "categories", mainId);
      batch.update(mainRef, { isArchived: true });

      // Archive all of its subcategories
      const subSnap = await getDocs(collection(db, "subcategories"));
      subSnap.forEach((d) => {
        const sub = d.data() as Subcategory;
        if (sub.mainCategoryId === mainId) {
          batch.update(doc(db, "subcategories", sub.id), { isArchived: true });
        }
      });
    } else if (policy.action === "move" && policy.targetMainCategoryId) {
      // Move subcategories under this main category to the target main category
      const subSnap = await getDocs(collection(db, "subcategories"));
      subSnap.forEach((d) => {
        const sub = d.data() as Subcategory;
        if (sub.mainCategoryId === mainId) {
          batch.update(doc(db, "subcategories", sub.id), {
            mainCategoryId: policy.targetMainCategoryId,
          });
        }
      });

      // Delete/archive original main category
      batch.delete(doc(db, "categories", mainId));
    }

    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `categories/${mainId}`);
    throw error;
  }
}

// Safe Delete policy for Subcategory
export async function deleteSubcategoryFromFirestore(
  subId: string,
  policy: { action: "archive" | "move"; targetSubcategoryId?: string },
  productsList: any[],
  onUpdateProductCategory: (productId: string, nextSubId: string) => void
): Promise<void> {
  try {
    const batch = writeBatch(db);

    if (policy.action === "archive") {
      const subRef = doc(db, "subcategories", subId);
      batch.update(subRef, { isArchived: true });
    } else if (policy.action === "move" && policy.targetSubcategoryId) {
      // Move all products belonging to this subcategory to targetSubcategoryId
      // We will perform updates in the client product state & also Firestore (if products are saved in Firestore)
      const affectedProducts = productsList.filter((p) => p.subcategory === subId || p.category === subId);
      for (const prod of affectedProducts) {
        onUpdateProductCategory(prod.id, policy.targetSubcategoryId);
      }

      // Delete the original subcategory document
      batch.delete(doc(db, "subcategories", subId));
    }

    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `subcategories/${subId}`);
    throw error;
  }
}

// Bulk update order positions
export async function saveReorderedCategoriesToFirestore(
  categories: MainCategory[]
): Promise<void> {
  try {
    const batch = writeBatch(db);
    categories.forEach((cat, idx) => {
      batch.update(doc(db, "categories", cat.id), { order: idx });
    });
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, "categories/reorder");
    throw error;
  }
}

export async function saveReorderedSubcategoriesToFirestore(
  subcategories: Subcategory[]
): Promise<void> {
  try {
    const batch = writeBatch(db);
    subcategories.forEach((sub, idx) => {
      batch.update(doc(db, "subcategories", sub.id), { order: idx });
    });
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, "subcategories/reorder");
    throw error;
  }
}

/**
 * Resolves and localizes a category/subcategory name based on current language selection.
 * Handles both ID matching and legacy English string matches.
 */
export function getCategoryName(
  categoryId: string | undefined,
  subcategories: Subcategory[],
  mainCategories: MainCategory[],
  currentLanguage: string
): string {
  if (!categoryId) return "";
  const sub = subcategories.find(
    s => s.id === categoryId || s.names?.en?.toLowerCase() === categoryId.toLowerCase()
  );
  if (sub) {
    return sub.names?.[currentLanguage] || sub.names?.en || sub.id;
  }
  const main = mainCategories.find(
    c => c.id === categoryId || c.names?.en?.toLowerCase() === categoryId.toLowerCase()
  );
  if (main) {
    return main.names?.[currentLanguage] || main.names?.en || main.id;
  }
  return categoryId;
}
