/**
 * Image Optimizer utility
 * Optimizes image URLs for responsive display, switching to WebP format,
 * lowering rendering dimensions and quality when viewport is mobile (< 768px).
 */
export function getOptimizedImageUrl(url: string | undefined, isMobile: boolean): string | undefined {
  if (!url) return undefined;

  // Support Unsplash dynamic image parameters
  if (url.includes("unsplash.com")) {
    try {
      const urlObj = new URL(url);
      
      // Auto-switch to webp format
      urlObj.searchParams.set("fm", "webp");
      
      if (isMobile) {
        // Significantly reduced source dimensions and file weight for mobile
        urlObj.searchParams.set("w", "480");
        urlObj.searchParams.set("q", "75");
      } else {
        // High quality with webp compression for desktop
        urlObj.searchParams.set("w", "1000");
        urlObj.searchParams.set("q", "85");
      }
      
      // Ensure fit is crop to preserve cards aspect ratio
      if (!urlObj.searchParams.has("fit")) {
        urlObj.searchParams.set("fit", "crop");
      }
      
      return urlObj.toString();
    } catch (e) {
      // String manipulation fallback
      let optimized = url;
      if (!optimized.includes("fm=")) {
        optimized += optimized.includes("?") ? "&fm=webp" : "?fm=webp";
      } else {
        optimized = optimized.replace(/fm=[a-zA-Z0-9]+/g, "fm=webp");
      }
      
      if (isMobile) {
        if (!optimized.includes("w=")) {
          optimized += "&w=480&q=75";
        } else {
          optimized = optimized.replace(/w=[0-9]+/g, "w=480").replace(/q=[0-9]+/g, "q=75");
        }
      } else {
        if (!optimized.includes("w=")) {
          optimized += "&w=1000&q=85";
        } else {
          optimized = optimized.replace(/w=[0-9]+/g, "w=1000").replace(/q=[0-9]+/g, "q=85");
        }
      }
      return optimized;
    }
  }

  return url;
}
