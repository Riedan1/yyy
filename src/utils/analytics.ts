/**
 * Analytics Integration Utility (Google Analytics 4, Microsoft Clarity, Facebook Pixel, TikTok Pixel & Snapchat Pixel)
 * Safely handles script injection, dynamic page tracking, and interactive e-commerce touchpoints.
 */

const GA_MEASUREMENT_ID = "G-WYE46F8N1V"; // Production-grade GA4 ID
const CLARITY_PROJECT_ID = "p9e3l5r8qw";  // Production-grade Clarity ID

// Retrieve persisted custom Pixel IDs or use default demo IDs
export const getPixelConfig = () => {
  if (typeof window === "undefined") {
    return { facebookId: "847291048291039", tiktokId: "PC89204892019A", snapchatId: "snap-984209420" };
  }
  return {
    facebookId: localStorage.getItem("yume_pixel_fb") || "847291048291039",
    tiktokId: localStorage.getItem("yume_pixel_tt") || "PC89204892019A",
    snapchatId: localStorage.getItem("yume_pixel_sc") || "snap-984209420",
  };
};

export const savePixelConfig = (fbId: string, ttId: string, scId: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("yume_pixel_fb", fbId);
  localStorage.setItem("yume_pixel_tt", ttId);
  localStorage.setItem("yume_pixel_sc", scId);
  
  // Re-initialize to apply updated IDs
  initAnalytics();
};

// Global telemetry queue for live UI visualization of Pixel fires (very helpful for e-commerce developers!)
export interface PixelFireLog {
  id: string;
  timestamp: string;
  pixelType: "GA4" | "Clarity" | "Facebook" | "TikTok" | "Snapchat";
  eventName: string;
  data: Record<string, any>;
}

export const getPixelLogs = (): PixelFireLog[] => {
  if (typeof window === "undefined") return [];
  const win = window as any;
  if (!win.YUME_PIXEL_LOGS) {
    win.YUME_PIXEL_LOGS = [];
  }
  return win.YUME_PIXEL_LOGS;
};

const addPixelLog = (pixelType: PixelFireLog["pixelType"], eventName: string, data: Record<string, any>) => {
  if (typeof window === "undefined") return;
  const win = window as any;
  if (!win.YUME_PIXEL_LOGS) {
    win.YUME_PIXEL_LOGS = [];
  }
  
  const logEntry: PixelFireLog = {
    id: `PX-${Math.floor(100000 + Math.random() * 900000)}`,
    timestamp: new Date().toLocaleTimeString(),
    pixelType,
    eventName,
    data,
  };
  
  // Keep last 150 entries
  win.YUME_PIXEL_LOGS.unshift(logEntry);
  if (win.YUME_PIXEL_LOGS.length > 150) {
    win.YUME_PIXEL_LOGS.pop();
  }
};

// Inject scripts dynamically
export const initAnalytics = () => {
  if (typeof window === "undefined") return;

  const { facebookId, tiktokId, snapchatId } = getPixelConfig();

  try {
    // 1. Google Analytics 4 (gtag.js) Injection
    if (!document.getElementById("google-tag-manager")) {
      const gaScript = document.createElement("script");
      gaScript.id = "google-tag-manager";
      gaScript.async = true;
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      document.head.appendChild(gaScript);

      const gaInitScript = document.createElement("script");
      gaInitScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', '${GA_MEASUREMENT_ID}', {
          page_path: window.location.pathname,
          send_page_view: true
        });
      `;
      document.head.appendChild(gaInitScript);
      console.log("📊 Google Analytics 4 successfully initialized");
      addPixelLog("GA4", "init", { measurementId: GA_MEASUREMENT_ID });
    }

    // 2. Microsoft Clarity Script Injection
    if (!document.getElementById("microsoft-clarity")) {
      const clarityScript = document.createElement("script");
      clarityScript.id = "microsoft-clarity";
      clarityScript.type = "text/javascript";
      clarityScript.innerHTML = `
        (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
      `;
      document.head.appendChild(clarityScript);
      console.log("🔍 Microsoft Clarity successfully initialized");
      addPixelLog("Clarity", "init", { projectId: CLARITY_PROJECT_ID });
    }

    // 3. Facebook (Meta) Pixel Injection
    if (facebookId && !document.getElementById("facebook-pixel")) {
      const fbScript = document.createElement("script");
      fbScript.id = "facebook-pixel";
      fbScript.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${facebookId}');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(fbScript);
      console.log(`🔵 Facebook Pixel (${facebookId}) successfully initialized`);
      addPixelLog("Facebook", "init", { pixelId: facebookId });
    }

    // 4. TikTok Pixel Injection
    if (tiktokId && !document.getElementById("tiktok-pixel")) {
      const ttScript = document.createElement("script");
      ttScript.id = "tiktok-pixel";
      ttScript.innerHTML = `
        !function (w, d, t) {
          w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
          ttq.load('${tiktokId}');
          ttq.page();
        }(window, document, 'ttq');
      `;
      document.head.appendChild(ttScript);
      console.log(`🎵 TikTok Pixel (${tiktokId}) successfully initialized`);
      addPixelLog("TikTok", "init", { pixelId: tiktokId });
    }

    // 5. Snapchat Pixel Injection
    if (snapchatId && !document.getElementById("snapchat-pixel")) {
      const snapScript = document.createElement("script");
      snapScript.id = "snapchat-pixel";
      snapScript.innerHTML = `
        (function(e,t,n){if(e.snaptr)return;var r=e.snaptr=function(){r.handleRequest?r.handleRequest.apply(r,arguments):r.queue.push(arguments)};r.queue=[];var a=t.createElement(n);a.async=!0;a.src="https://sc-static.net/scevent.min.js";var s=t.getElementsByTagName(n)[0];s.parentNode.insertBefore(a,s)})(window,document,"script");
        snaptr('init', '${snapchatId}');
        snaptr('track', 'PAGE_VIEW');
      `;
      document.head.appendChild(snapScript);
      console.log(`👻 Snapchat Pixel (${snapchatId}) successfully initialized`);
      addPixelLog("Snapchat", "init", { pixelId: snapchatId });
    }

  } catch (error) {
    console.warn("Analytics initialization skipped or failed:", error);
  }
};

/**
 * Tracks page view across all connected platforms
 */
export const trackPageView = (path: string, title?: string) => {
  if (typeof window === "undefined") return;
  
  const formattedTitle = title || document.title;

  // 1. GA4
  const gtag = (window as any).gtag;
  if (typeof gtag === "function") {
    gtag("event", "page_view", {
      page_path: path,
      page_title: formattedTitle,
    });
    addPixelLog("GA4", "page_view", { path, title: formattedTitle });
  }

  // 2. Facebook
  const fbq = (window as any).fbq;
  if (typeof fbq === "function") {
    fbq("track", "PageView");
    addPixelLog("Facebook", "PageView", { path });
  }

  // 3. TikTok
  const ttq = (window as any).ttq;
  if (typeof ttq === "function") {
    ttq.page();
    addPixelLog("TikTok", "page", { path });
  }

  // 4. Snapchat
  const snaptr = (window as any).snaptr;
  if (typeof snaptr === "function") {
    snaptr("track", "PAGE_VIEW");
    addPixelLog("Snapchat", "PAGE_VIEW", { path });
  }

  console.debug(`[Analytics] Page View Tracked: ${path}`);
};

/**
 * Tracks generic user interaction / touchpoints
 */
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number,
  additionalParams: Record<string, any> = {}
) => {
  if (typeof window === "undefined") return;

  // Track in Google Analytics 4
  const gtag = (window as any).gtag;
  if (typeof gtag === "function") {
    gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
      ...additionalParams,
    });
    addPixelLog("GA4", action, { category, label, value, ...additionalParams });
  }

  // Track in Microsoft Clarity
  const clarity = (window as any).clarity;
  if (typeof clarity === "function") {
    clarity("event", action, {
      category,
      label,
      value: value?.toString(),
      ...additionalParams,
    });
    addPixelLog("Clarity", action, { category, label, value, ...additionalParams });
  }

  console.log(`🎯 [Analytics Touchpoint] Action: ${action} | Category: ${category} | Label: ${label || ""}`, additionalParams);
};

/**
 * Tracks e-commerce ViewContent event (Product Previewed)
 */
export const trackAdViewContent = (product: any, storeName?: string) => {
  if (typeof window === "undefined" || !product) return;

  const eventData = {
    content_name: product.name,
    content_category: product.category || "Artisanal Crafts",
    content_ids: [product.id.toString()],
    content_type: "product",
    value: product.price,
    currency: "DZD",
    store_name: storeName || "Yume Store",
  };

  // GA4 Event
  trackEvent("view_item", "Ecommerce", product.name, product.price, eventData);

  // Facebook Pixel
  const fbq = (window as any).fbq;
  if (typeof fbq === "function") {
    fbq("track", "ViewContent", {
      content_ids: [product.id.toString()],
      content_type: "product",
      content_name: product.name,
      content_category: product.category || "Artisanal Crafts",
      value: product.price,
      currency: "DZD"
    });
    addPixelLog("Facebook", "ViewContent", eventData);
  }

  // TikTok Pixel
  const ttq = (window as any).ttq;
  if (typeof ttq === "function") {
    ttq.track("ViewContent", {
      contents: [{
        content_id: product.id.toString(),
        content_type: "product",
        content_name: product.name,
        quantity: 1,
        price: product.price
      }],
      value: product.price,
      currency: "DZD"
    });
    addPixelLog("TikTok", "ViewContent", eventData);
  }

  // Snapchat Pixel
  const snaptr = (window as any).snaptr;
  if (typeof snaptr === "function") {
    snaptr("track", "VIEW_CONTENT", {
      item_ids: [product.id.toString()],
      item_category: product.category || "Artisanal Crafts",
      price: product.price,
      currency: "DZD"
    });
    addPixelLog("Snapchat", "VIEW_CONTENT", eventData);
  }
};

/**
 * Tracks e-commerce AddToCart event
 */
export const trackAdAddToCart = (product: any, quantity: number = 1) => {
  if (typeof window === "undefined" || !product) return;

  const price = product.price || 0;
  const eventData = {
    content_name: product.name,
    content_ids: [product.id.toString()],
    content_type: "product",
    value: price * quantity,
    currency: "DZD",
    quantity: quantity,
  };

  // GA4 Event
  trackEvent("add_to_cart", "Ecommerce", product.name, price * quantity, eventData);

  // Facebook Pixel
  const fbq = (window as any).fbq;
  if (typeof fbq === "function") {
    fbq("track", "AddToCart", {
      content_ids: [product.id.toString()],
      content_type: "product",
      content_name: product.name,
      value: price * quantity,
      currency: "DZD"
    });
    addPixelLog("Facebook", "AddToCart", eventData);
  }

  // TikTok Pixel
  const ttq = (window as any).ttq;
  if (typeof ttq === "function") {
    ttq.track("AddToCart", {
      contents: [{
        content_id: product.id.toString(),
        content_type: "product",
        content_name: product.name,
        quantity: quantity,
        price: price
      }],
      value: price * quantity,
      currency: "DZD"
    });
    addPixelLog("TikTok", "AddToCart", eventData);
  }

  // Snapchat Pixel
  const snaptr = (window as any).snaptr;
  if (typeof snaptr === "function") {
    snaptr("track", "ADD_CART", {
      item_ids: [product.id.toString()],
      price: price * quantity,
      currency: "DZD",
      number_items: quantity
    });
    addPixelLog("Snapchat", "ADD_CART", eventData);
  }
};

/**
 * Tracks e-commerce InitiateCheckout event
 */
export const trackAdInitiateCheckout = (cartItems: any[], totalValue: number) => {
  if (typeof window === "undefined" || !cartItems || cartItems.length === 0) return;

  const itemIds = cartItems.map(item => item.product.id.toString());
  const eventData = {
    content_ids: itemIds,
    num_items: cartItems.length,
    value: totalValue,
    currency: "DZD"
  };

  // GA4 Event
  trackEvent("begin_checkout", "Ecommerce", `Items: ${cartItems.length}`, totalValue, eventData);

  // Facebook Pixel
  const fbq = (window as any).fbq;
  if (typeof fbq === "function") {
    fbq("track", "InitiateCheckout", {
      content_ids: itemIds,
      content_type: "product",
      value: totalValue,
      currency: "DZD",
      num_items: cartItems.length
    });
    addPixelLog("Facebook", "InitiateCheckout", eventData);
  }

  // TikTok Pixel
  const ttq = (window as any).ttq;
  if (typeof ttq === "function") {
    ttq.track("InitiateCheckout", {
      contents: cartItems.map(item => ({
        content_id: item.product.id.toString(),
        content_type: "product",
        content_name: item.product.name,
        quantity: item.quantity,
        price: item.product.price
      })),
      value: totalValue,
      currency: "DZD"
    });
    addPixelLog("TikTok", "InitiateCheckout", eventData);
  }

  // Snapchat Pixel
  const snaptr = (window as any).snaptr;
  if (typeof snaptr === "function") {
    snaptr("track", "START_CHECKOUT", {
      item_ids: itemIds,
      price: totalValue,
      currency: "DZD",
      number_items: cartItems.length
    });
    addPixelLog("Snapchat", "START_CHECKOUT", eventData);
  }
};

/**
 * Tracks e-commerce Purchase event
 */
export const trackAdPurchase = (orderId: string, totalValue: number, items: any[]) => {
  if (typeof window === "undefined") return;

  const itemIds = items.map(item => (item.id || item.product?.id || "unknown").toString());
  const eventData = {
    transaction_id: orderId,
    value: totalValue,
    currency: "DZD",
    content_ids: itemIds,
    num_items: items.length
  };

  // GA4 Event
  trackEvent("purchase", "Ecommerce", orderId, totalValue, eventData);

  // Facebook Pixel
  const fbq = (window as any).fbq;
  if (typeof fbq === "function") {
    fbq("track", "Purchase", {
      content_ids: itemIds,
      content_type: "product",
      value: totalValue,
      currency: "DZD"
    });
    addPixelLog("Facebook", "Purchase", eventData);
  }

  // TikTok Pixel
  const ttq = (window as any).ttq;
  if (typeof ttq === "function") {
    ttq.track("CompletePayment", {
      contents: items.map(item => ({
        content_id: (item.id || item.product?.id || "unknown").toString(),
        content_type: "product",
        content_name: item.name || item.product?.name || "Artisanal Product",
        quantity: item.quantity || 1,
        price: item.price || totalValue
      })),
      value: totalValue,
      currency: "DZD"
    });
    addPixelLog("TikTok", "CompletePayment", eventData);
  }

  // Snapchat Pixel
  const snaptr = (window as any).snaptr;
  if (typeof snaptr === "function") {
    snaptr("track", "PURCHASE", {
      transaction_id: orderId,
      item_ids: itemIds,
      price: totalValue,
      currency: "DZD",
      number_items: items.length
    });
    addPixelLog("Snapchat", "PURCHASE", eventData);
  }
};

/**
 * Tracks custom user state tags in Microsoft Clarity for deeper cohort analysis
 */
export const identifyUserClarity = (userId: string, attributes: Record<string, string>) => {
  if (typeof window === "undefined") return;

  const clarity = (window as any).clarity;
  if (typeof clarity === "function") {
    clarity("identify", userId, attributes);
    console.debug(`[Clarity Identity] Set user: ${userId}`, attributes);
  }
};

