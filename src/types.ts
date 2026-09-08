/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

export interface Review {
  id: string;
  author: string;
  authorLocation: string;
  rating: number;
  comment: string;
  date: string;
  sentiment: "positive" | "neutral" | "negative";
  reply?: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  options: { [optionName: string]: string };
  sku: string;
  price?: number;
  stock: number;
  images?: string[];
}

export interface Product {
  id: string;
  storeId: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  imageUrl: string;
  images?: string[];
  status: "active" | "draft";
  rating: number;
  reviews: Review[];
  description_ar: string;
  description_fr: string;
  description_en: string;
  description?: string;
  colors?: { name: string; hex: string }[];
  sizes?: string[];
  specifications?: { key: string; value: string }[];
  tags: string[];
  shippingCost?: number;
  deliveryCompany?: string;
  safe?: boolean;
  moderation_reason?: string;
  simulated?: boolean;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  weight?: number; // in grams
  sku?: string;
  subcategory?: string;
  variants?: ProductVariant[];
  videoUrl?: string;
  videoUrls?: string[];
  videoMetadata?: Record<string, { duration?: string; resolution?: string; format?: string }>;
  discountEnabled?: boolean;
  discountPercent?: number;
  buyPrice?: number;
  timerEnabled?: boolean;
  timerHours?: number;
  uploadedLandingPageContent?: string;
  advancedLandingPageEnabled?: boolean;
  advancedProductStorySections?: any[];
  wizardAdvancedStorySections?: any[];
  storySections?: any[];
  altText?: string;
  detailedDescription?: string;
  altTextModel?: string;
  isBundle?: boolean;
  bundleItems?: { productId: string; name: string; quantity: number; price?: number }[];
  bundlePrice?: number;
}

export interface AnnouncementBanner {
  enabled: boolean;
  text: string;
  bgColor: string;
  textColor: string;
  expiresAt: string; // "YYYY-MM-DD" style or ISO
}

export interface MerchantStore {
  id: string;
  name: string;
  slug: string; // Used for domain-mocking
  subdomain: string; // e.g. "deglet.platform.dz"
  skuPrefix?: string;
  logo: string;
  banner: string;
  banners?: string[];
  description: string;
  bio: string;
  wilaya: string;
  wilayaCode: string;
  address: string;
  coordinates: LocationCoordinates;
  rating: number;
  categories: string[];
  verified: boolean;
  premiumTier: "Starter" | "Growth" | "Pro";
  subscriptionTier?: "Basic" | "Pro" | "Pro Plus" | "Premium";
  country?: string;
  currency?: string;
  contact: {
    phone: string;
    phones?: string[];
    email: string;
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
    viber?: string;
    tiktok?: string;
    snapchat?: string;
  };
  products: Product[];
  reviews: Review[];
  announcement?: AnnouncementBanner;
  adBannerTitle?: string;
  adBannerDescription?: string;
  followersCount?: number;
  followerSystemSettings?: {
    whoCanFollow: "anyone" | "verified" | "customers" | "approved";
    contentVisibility: "public" | "followers" | "customers_followers";
    displayCount: boolean;
    autoApprove: boolean;
    maxFollowers: number;
  };
  followersList?: {
    id: string;
    name: string;
    avatar: string;
    location: string;
    isVerified: boolean;
    dateFollowed: string;
    status: "approved" | "pending" | "blocked";
  }[];
  designSettings?: {
    width: string; // "medium" | "large" | "full"
    height: string; // "medium" | "large" | "full"
    bgColor: string;
    borderColor: string;
    borderStyle: string; // "solid" | "dashed" | "double" | "dotted" | "none"
    borderWidth: string; // "1px" | "2px" | "4px" | "6px" | "8px"
    borderRadius: string; // "none" | "xl" | "2xl" | "3xl" | "full"
    accentColor?: string; // Hex color code for store carousel and buttons
    coverTemplate?: string; // "toonhub" | "classic" | etc.
    toonhubLogo?: string;
    toonhubProducts?: string[];
    toonhubCharacters?: string[];
    toonhubMode?: "characters" | "products" | "both";
    mysticflowerLogo?: string;
    mysticflowerProducts?: string[];
    mysticflowerCharacters?: string[];
    mysticflowerMode?: "characters" | "products" | "both";
    classicCovers?: string[];
    classicCoversPerSlide?: number;
    gamingLogo?: string;
    gamingProducts?: string[];
    myBrandImage?: string;
    myBrandBgType?: "gradient" | "space" | "nebula" | "solid";
    myBrandColor1?: string;
    myBrandColor2?: string;
    myBrandSpacing?: number;
    myBrandAngle?: number;
    myBrandShadowColor?: string;
    myBrandShadowIntensity?: number;
    myBrandShadowOpacity?: number;
    myBrandShadowPreviewBorder?: boolean;
    myBrandImageOriginal?: string;
    myBrandBgRemovalMode?: "none" | "white" | "black" | "chroma";
    myBrandBgRemovalTolerance?: number;
    myBrandBgRemovalColor?: string;
    myBrandBrightness?: number;
    myBrandContrast?: number;
    myBrandGrayscale?: number;
    profileBgStyle?: string;
    fontFamily?: string;
    titleFontSize?: string;
    titleFontStyle?: string;
    titleFontWeight?: string;
    bodyFontSize?: string;
    bodyFontStyle?: string;
    scrollBlurIntensity?: number;
    glassBlurEnabled?: boolean;
    glassBlurAmount?: number;
    glassTransparency?: number;
    glassMultiColorEnabled?: boolean;
    glassMultiColors?: string[];
    gridCardMinWidth?: string;
    gridCardGap?: string;
    permitBuyerModifications?: boolean;
    showSimilarProducts?: boolean;
  };
  gridLinesHorizontal?: number;
  gridLinesVertical?: number;
  gridSpacingHorizontal?: number;
  gridSpacingVertical?: number;
  merchantFullName?: string;
  apiKey?: string;
  newsletterSubscribers?: string[];
  paymentGateways?: {
    cod: boolean;
    eddahabia: boolean;
    cib: boolean;
    wire: boolean;
  };
  notificationsConfig?: {
    email: boolean;
    sms: boolean;
    order: boolean;
    review: boolean;
    follow: boolean;
    lowStockAlerts?: boolean;
    lowStockThreshold?: number;
  };
  verificationStatus?: "not_started" | "pending" | "verified";
  verificationDocName?: string;
  apiKeysVault?: MerchantApiKeys;
  coupons?: Coupon[];
  teamMembers?: TeamMember[];
  authorizationHistory?: AuthorizationHistoryEntry[];
  ordersMode?: "classic" | "advanced" | "both";
}

export interface AuthorizationHistoryEntry {
  id: string;
  buyerName: string;
  buyerEmail: string;
  action: string;
  timestamp: string;
  device: string;
  ip: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "preparator" | "viewer";
  permissions: {
    confirmOrders: boolean;
    prepareShipments: boolean;
    deliveryOperations?: boolean;
    manageProducts: boolean;
    manageDiscounts: boolean;
    adPixels?: boolean;
    manageAnalytics?: boolean;
    respondReviews?: boolean;
    manageFollowers?: boolean;
  };
  status: "active" | "invited";
  joinedDate: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number; // e.g., 10 for 10% or 500 for 500 DZD
  targetType: "all" | "category" | "product";
  targetValue?: string; // category name or product ID
  minPurchase?: number; // minimum order value to apply
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  status: "active" | "scheduled" | "expired";
  usageCount: number;
  maxUses?: number;
}

export interface MerchantApiKeys {
  gemini?: string;
  grok?: string;
  openai?: string;
  deepseek?: string;
  z_ai?: string;
  claude?: string;
  nvidia?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  storeId: string;
  storeName: string;
}

export interface Order {
  id: string;
  storeId: string;
  storeName: string;
  date: string;
  shopper: {
    name: string;
    email: string;
    phone: string;
    wilaya: string;
    wilayaCode: string;
    commune: string;
    address: string;
  };
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
  }[];
  total: number;
  shippingCost: number;
  status: "pending" | "accepted" | "shipped" | "delivered";
  paymentMethod: "cod" | "eddahabia" | "cib";
  deliveryCompany?: string;
  trackingCode?: string;
  estimatedDeliveryDate?: string;
  returnRequested?: boolean;
  returnReason?: string;
  teamMemberAssigned?: string;
  notes?: string;
}

export interface CoverTemplateImage {
  src: string;
  bg: string;
  panel?: string;
}

export interface CoverTemplate {
  id: string; // "classic" | "toonhub" | custom IDs
  name: string;
  description: string;
  badgeText: string; // e.g. "3D SHAPE", or if empty, uses selectedStore.name
  images: CoverTemplateImage[];
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  storeId: string;
  storeName: string;
  date: string;
  shopperName: string;
  product: {
    id: string;
    name: string;
    imageUrl: string;
    size?: string;
  };
  quantity: number;
  reason: string;
  reasonDetails?: string;
  deliveryMethod: string;
  refundMethod: string;
  status: "pending" | "approved" | "received" | "completed" | "rejected";
  refundAmount: number;
}

export interface CategoryTemplateField {
  name: string;
  type: "text" | "number" | "boolean" | "select";
  required: boolean;
  options?: string[]; // Used for type="select"
  placeholder?: string;
  unit?: string; // Used for type="number", e.g. "kg", "ml", "cm"
}

export interface CategoryTemplate {
  id: string; // e.g. "Fashion", "Electronics"
  name: string;
  sizeSystem: {
    enabled: boolean;
    label: string; // e.g. "Wearable Sizing Tags"
    sizes: string[]; // e.g. ["XS", "S", "M", "L", "XL"]
  };
  recommendedMaterials: string[]; // e.g. ["Wool", "Organic Cotton"]
  fields: CategoryTemplateField[];
}

export interface MainCategory {
  id: string;
  names: Record<string, string>; // multi-language names: { en, ar, fr }
  icon: string; // e.g. "Shirt"
  image: string; // Unsplash banner URL or upload
  order: number;
  isArchived?: boolean;
  createdAt?: string;
}

export interface Subcategory {
  id: string;
  mainCategoryId: string;
  names: Record<string, string>; // multi-language names: { en, ar, fr }
  icon: string;
  image: string;
  order: number;
  isArchived?: boolean;
  sizeSystem: {
    enabled: boolean;
    label: string;
    sizes: string[];
  };
  recommendedMaterials: string[];
  fields: CategoryTemplateField[];
  createdAt?: string;
}



