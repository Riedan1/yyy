import { useState, useEffect } from "react";

export interface PlanFeatureConfig {
  allowImageUploadDevice: boolean;
  allowVideoUploadDevice: boolean;
  allowExternalVideoLinks: boolean;
  maxImages: number;
  maxVideos: number;
}

export interface PlatformFeatureConfig {
  // Global defaults & limits
  globalAllowImageUploadDevice: boolean;
  globalAllowVideoUploadDevice: boolean;
  globalAllowExternalVideoLinks: boolean;
  globalMaxImagesPerProduct: number;
  globalMaxVideosPerProduct: number;
  globalMaxImageSizeBytesMB: number;
  globalMaxVideoSizeBytesMB: number;
  allowedImageTypes: string;
  allowedVideoTypes: string;

  // Per subscription tier overrides / permissions
  planConfigs: Record<string, PlanFeatureConfig>;
}

export const DEFAULT_PLATFORM_FEATURE_CONFIG: PlatformFeatureConfig = {
  globalAllowImageUploadDevice: true,
  globalAllowVideoUploadDevice: true,
  globalAllowExternalVideoLinks: true,
  globalMaxImagesPerProduct: 10,
  globalMaxVideosPerProduct: 2,
  globalMaxImageSizeBytesMB: 5,
  globalMaxVideoSizeBytesMB: 50,
  allowedImageTypes: "jpeg, png, webp, gif",
  allowedVideoTypes: "mp4, webm, mov",
  planConfigs: {
    Basic: {
      allowImageUploadDevice: true,
      allowVideoUploadDevice: false,
      allowExternalVideoLinks: true,
      maxImages: 5,
      maxVideos: 1,
    },
    Pro: {
      allowImageUploadDevice: true,
      allowVideoUploadDevice: true,
      allowExternalVideoLinks: true,
      maxImages: 10,
      maxVideos: 2,
    },
    "Pro Plus": {
      allowImageUploadDevice: true,
      allowVideoUploadDevice: true,
      allowExternalVideoLinks: true,
      maxImages: 10,
      maxVideos: 2,
    },
    Premium: {
      allowImageUploadDevice: true,
      allowVideoUploadDevice: true,
      allowExternalVideoLinks: true,
      maxImages: 10,
      maxVideos: 2,
    },
  },
};

const STORAGE_KEY = "yumi_platform_feature_config";

export function getPlatformFeatureConfig(): PlatformFeatureConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_PLATFORM_FEATURE_CONFIG,
        ...parsed,
        planConfigs: {
          ...DEFAULT_PLATFORM_FEATURE_CONFIG.planConfigs,
          ...(parsed.planConfigs || {}),
        },
      };
    }
  } catch (e) {
    console.error("Failed to parse platform feature config:", e);
  }
  return DEFAULT_PLATFORM_FEATURE_CONFIG;
}

export function savePlatformFeatureConfig(config: PlatformFeatureConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new CustomEvent("yumi_feature_config_changed", { detail: config }));
  } catch (e) {
    console.error("Failed to save platform feature config:", e);
  }
}

export interface EffectiveStoreFeatureConfig {
  allowImageUploadDevice: boolean;
  allowVideoUploadDevice: boolean;
  allowExternalVideoLinks: boolean;
  maxImages: number;
  maxVideos: number;
  maxImageSizeBytesMB: number;
  maxVideoSizeBytesMB: number;
  allowedImageTypes: string;
  allowedVideoTypes: string;
}

export function getEffectiveStoreFeatureConfig(subscriptionTier?: string): EffectiveStoreFeatureConfig {
  const config = getPlatformFeatureConfig();
  const tierKey = subscriptionTier || "Premium";
  const planConfig = config.planConfigs[tierKey] || config.planConfigs["Premium"] || {
    allowImageUploadDevice: true,
    allowVideoUploadDevice: true,
    allowExternalVideoLinks: true,
    maxImages: 10,
    maxVideos: 2,
  };

  return {
    allowImageUploadDevice: config.globalAllowImageUploadDevice && planConfig.allowImageUploadDevice,
    allowVideoUploadDevice: config.globalAllowVideoUploadDevice && planConfig.allowVideoUploadDevice,
    allowExternalVideoLinks: config.globalAllowExternalVideoLinks && planConfig.allowExternalVideoLinks,
    maxImages: Math.min(config.globalMaxImagesPerProduct, planConfig.maxImages),
    maxVideos: Math.min(config.globalMaxVideosPerProduct, planConfig.maxVideos),
    maxImageSizeBytesMB: config.globalMaxImageSizeBytesMB,
    maxVideoSizeBytesMB: config.globalMaxVideoSizeBytesMB,
    allowedImageTypes: config.allowedImageTypes,
    allowedVideoTypes: config.allowedVideoTypes,
  };
}

export function useEffectiveStoreFeatureConfig(subscriptionTier?: string): EffectiveStoreFeatureConfig {
  const [effective, setEffective] = useState<EffectiveStoreFeatureConfig>(() =>
    getEffectiveStoreFeatureConfig(subscriptionTier)
  );

  useEffect(() => {
    const handleUpdate = () => {
      setEffective(getEffectiveStoreFeatureConfig(subscriptionTier));
    };

    window.addEventListener("storage", handleUpdate);
    window.addEventListener("yumi_feature_config_changed", handleUpdate);
    handleUpdate();

    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("yumi_feature_config_changed", handleUpdate);
    };
  }, [subscriptionTier]);

  return effective;
}

