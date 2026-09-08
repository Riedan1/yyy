import express, { Request, Response, NextFunction } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = (typeof import.meta !== "undefined" && import.meta.url)
  ? fileURLToPath(import.meta.url)
  : (typeof (global as any).__filename !== "undefined" ? (global as any).__filename : "");

const __dirname = __filename ? path.dirname(__filename) : (typeof (global as any).__dirname !== "undefined" ? (global as any).__dirname : process.cwd());

// --- SECTION 1: CRITICAL POINTS & RISK CLASSIFICATION LOGGING ---
/**
 * System Risk Classification:
 * 1. CRITICAL (Auth & Financial / Orders): Brute-force risk, credential abuse, financial data manipulation.
 * 2. HIGH (AI Generation & Media Processing): Denial of Service (DoS), resource exhaustion, quota abuse.
 * 3. MEDIUM (General Store & Catalog Queries): Information gathering, parameter tampering.
 */

// PII Sanitization Helper for Security Audit Logging
function sanitizePII(data: any): any {
  if (!data || typeof data !== "object") return data;
  const sanitized = Array.isArray(data) ? [...data] : { ...data };
  
  const sensitiveKeys = ["email", "phone", "password", "token", "address", "card", "secret", "eddahabia"];
  
  for (const key of Object.keys(sanitized)) {
    const lowerKey = key.toLowerCase();
    if (sensitiveKeys.some((s) => lowerKey.includes(s))) {
      if (typeof sanitized[key] === "string" && sanitized[key].length > 0) {
        sanitized[key] = "[REDACTED_PII]";
      }
    } else if (typeof sanitized[key] === "object") {
      sanitized[key] = sanitizePII(sanitized[key]);
    }
  }
  return sanitized;
}

function logSecurityEvent(level: "INFO" | "WARN" | "ALERT", event: string, req: Request, details?: Record<string, any>) {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress || "0.0.0.0";
  const sanitizedBody = sanitizePII(req.body);
  const logEntry = {
    timestamp,
    level,
    event,
    ip,
    path: req.originalUrl,
    method: req.method,
    details: details ? sanitizePII(details) : undefined,
    requestSample: Object.keys(sanitizedBody || {}).length > 0 ? sanitizedBody : undefined,
  };
  console.log(`[SECURITY_${level}] ${JSON.stringify(logEntry)}`);
}

// --- SECTION 2: SLIDING-WINDOW RATE LIMITER & TARPITTING ---
interface RateLimitBucket {
  timestamps: number[];
}

const rateLimitStore: Map<string, RateLimitBucket> = new Map();

// Periodic cleanup of stale rate limit entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of rateLimitStore.entries()) {
    bucket.timestamps = bucket.timestamps.filter((t) => now - t < 60000);
    if (bucket.timestamps.length === 0) {
      rateLimitStore.delete(key);
    }
  }
}, 300000);

/**
 * Sliding-Window Rate Limiter Middleware Factory
 */
function createSlidingWindowRateLimiter(options: {
  windowMs: number;
  maxRequests: number;
  keyPrefix: string;
  enableTarpit?: boolean; // Tarpitting artificially delays response under heavy load
  tarpitDelayMs?: number;
}) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const ip = (req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress || "0.0.0.0").toString();
    const key = `${options.keyPrefix}:${ip}`;
    const now = Date.now();

    if (!rateLimitStore.has(key)) {
      rateLimitStore.set(key, { timestamps: [] });
    }

    const bucket = rateLimitStore.get(key)!;
    // Remove timestamps outside the sliding window
    bucket.timestamps = bucket.timestamps.filter((t) => now - t < options.windowMs);

    if (bucket.timestamps.length >= options.maxRequests) {
      logSecurityEvent("ALERT", "RATE_LIMIT_EXCEEDED", req, {
        limit: options.maxRequests,
        windowMs: options.windowMs,
        currentCount: bucket.timestamps.length,
      });

      if (options.enableTarpit) {
        const delay = options.tarpitDelayMs || 2500;
        console.warn(`[TARPIT] Applying defense-in-depth tarpit delay of ${delay}ms to IP: ${ip}`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      res.setHeader("Retry-After", Math.ceil(options.windowMs / 1000).toString());
      return res.status(429).json({
        error: "Too many requests. Please slow down and try again later.",
        retryAfterSeconds: Math.ceil(options.windowMs / 1000),
      });
    }

    bucket.timestamps.push(now);

    // Progressive tarpit delay if approaching window limit (e.g., >75% threshold)
    if (options.enableTarpit && bucket.timestamps.length > options.maxRequests * 0.75) {
      const progressiveDelay = (options.tarpitDelayMs || 1000) * 0.5;
      await new Promise((resolve) => setTimeout(resolve, progressiveDelay));
    }

    next();
  };
}

async function start() {
  const app = express();
  const PORT = 3000;

  // --- SECTION 3: RESTRICTED CORS & TRUSTED ORIGINS ---
  app.use((req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin;
    const allowedOrigins = [
      process.env.APP_URL,
      "https://ais-dev-lb6oawea2qxsbolatms2ns-336061538610.europe-west2.run.app",
      "https://ais-pre-lb6oawea2qxsbolatms2ns-336061538610.europe-west2.run.app",
    ].filter(Boolean);

    if (origin && (allowedOrigins.includes(origin) || origin.endsWith(".run.app") || origin.includes("localhost"))) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    } else if (!origin) {
      // Same-origin browser requests or non-CORS GET requests
      res.setHeader("Access-Control-Allow-Origin", "*");
    }

    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("X-XSS-Protection", "1; mode=block");

    if (req.method === "OPTIONS") {
      return res.sendStatus(204);
    }

    next();
  });

  // --- SECTION 4: PAYLOAD SIZE LIMITS & SCHEMA VALIDATION ---
  // Increased payload size limit to 50mb to support base64 images and large store catalog updates
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // Global Sliding-Window Rate Limiter for All Server Routes
  const globalLimiter = createSlidingWindowRateLimiter({
    windowMs: 60000, // 1 minute
    maxRequests: 120, // 120 requests/min
    keyPrefix: "global",
  });
  app.use("/api/", globalLimiter);

  // High-Risk Auth / Critical Rate Limiter with Active Tarpitting
  const sensitiveAuthLimiter = createSlidingWindowRateLimiter({
    windowMs: 60000, // 1 minute
    maxRequests: 10,  // Max 10 requests per minute
    keyPrefix: "auth_tarpit",
    enableTarpit: true,
    tarpitDelayMs: 2000, // 2s tarpitting penalty
  });

  // High-Risk Heavy AI Processing Rate Limiter
  const aiResourceLimiter = createSlidingWindowRateLimiter({
    windowMs: 60000, // 1 minute
    maxRequests: 20, // Max 20 AI generations/min
    keyPrefix: "ai_gen",
  });

  // Shared Gemini client wrapped safely in lazy initialization
  let ai: GoogleGenAI | null = null;
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
    try {
      ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
      console.log("Successfully initialized server-side Gemini AI Client");
    } catch (e: any) {
      console.error("Failed to initialize GoogleGenAI:", e.message);
    }
  } else {
    console.log("No valid GEMINI_API_KEY environment variable found. Server will run on beautiful AI simulation fallback mode.");
  }

  // Helper to query Gemini with retry, backoff, and model fallback to handle 503 unavailable errors under high demand
  async function generateContentWithFallback(options: {
    contents: any;
    config?: any;
    defaultModel?: string;
  }) {
    if (!ai) {
      throw new Error("Gemini AI Client not initialized.");
    }

    const { contents, config = {}, defaultModel = "gemini-3.5-flash" } = options;
    const modelsToTry = [defaultModel, "gemini-3.1-flash-lite"];
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents,
            config,
          });
          if (response) {
            return response;
          }
        } catch (err: any) {
          lastError = err;
          const status = err.status || (err.error && err.error.status);
          const message = err.message || "";
          
          console.warn(
            `Gemini AI call failed (Model: ${modelName}, Attempt: ${attempt}/2, Status: ${status}): ${message}`
          );

          if (attempt < 2 && (message.includes("503") || message.includes("UNAVAILABLE") || message.includes("ResourceExhausted") || message.includes("limit"))) {
            await new Promise((resolve) => setTimeout(resolve, 800 * attempt));
          } else {
            break;
          }
        }
      }
    }

    throw lastError || new Error("Gemini AI generation failed on all fallback paths.");
  }

  // --- API Endpoints ---

  // Health check
  app.get("/api/health", (req, res) => {
    logSecurityEvent("INFO", "HEALTH_CHECK", req);
    res.json({
      status: "ok",
      aiAvailable: !!ai,
      timestamp: new Date().toISOString(),
    });
  });

  // LLM copywriter, translator and content moderation tool with standard response schema
  app.post("/api/generate-copy", aiResourceLimiter, async (req, res) => {
    logSecurityEvent("INFO", "GENERATE_COPY_REQUEST", req);
    const { name, category, keyFeatures, originalDescription, tone, wilaya, provider } = req.body;

    // Strict Input Validation
    if (!name || typeof name !== "string" || name.trim().length === 0 || name.length > 200) {
      return res.status(400).json({ error: "Product name is required (string, max 200 chars)." });
    }
    if (!category || typeof category !== "string" || category.length > 100) {
      return res.status(400).json({ error: "Product category is required (string, max 100 chars)." });
    }

    const selectedProvider = provider || "gemini";
    let providerInstruction = "";
    if (selectedProvider === "nvidia") {
      providerInstruction = `
        [NVIDIA NIM AI Mode Enabled]
        Emphasize state-of-the-art innovation, maximum performance, modern scalability, and bold technological hooks in your copy.
        Ensure terms feel ultra-crisp, precise, and dynamic.
      `;
    } else if (selectedProvider === "openai") {
      providerInstruction = `
        [OpenAI GPT-4o Mode Enabled]
        Produce exceptionally detailed, highly structured, clear, commercial-grade text.
        Structure descriptions to be extremely SEO-optimized, focusing heavily on value propositions and specific user benefits.
      `;
    } else if (selectedProvider === "other") {
      providerInstruction = `
        [Claude / Llama Creative Mode Enabled]
        Deliver highly creative, soulful, artisanal storytelling prose.
        Focus deeply on regional heritage, authentic Algeria, handcrafted details, and the unique history of the product.
      `;
    } else {
      providerInstruction = `
        [Google Gemini 1.5 Mode Enabled]
        Provide highly accurate, balanced, bilingual translations with local Algerian context and optimal search phrases.
      `;
    }

    const prompt = `
      You are an expert Algerian SEO copywriter, marketing strategist and translator running under ${selectedProvider.toUpperCase()} provider mode. 
      
      Provider guidelines:
      ${providerInstruction}

      Analyze the following product details:
      - Product Name: ${name}
      - Category: ${category}
      - Key Features: ${keyFeatures || "None provided"}
      - Context / Original Description: ${originalDescription || "None provided"}
      - Targeted Tone: ${tone || "Artisanal & Traditional"}
      - Merchant location (Algerian Wilaya): ${wilaya || "Algiers"}

      You must generate highly appealing, native, culturally respectful, and search-optimized product copy in three languages:
      1. Arabic (native, RTL-friendly, using standard Arabic coupled with local Algerian commercial terms if beneficial).
      2. French (widely spoken commercially in Algeria).
      3. English (for international appeal and modern SEO).

      Also run a platform safety compliance review. Flag if the product is improper/prohibited (e.g., weapons, illegal substances, counterfeit, fraud).

      Return the response STRICTLY as a JSON matching the requested fields.
    `;

    if (ai) {
      try {
        const response = await generateContentWithFallback({
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title_ar: { type: Type.STRING, description: "Product Title in Arabic" },
                title_fr: { type: Type.STRING, description: "Product Title in French" },
                title_en: { type: Type.STRING, description: "Product Title in English" },
                description_ar: { type: Type.STRING, description: "SEO optimized rich description in Arabic (RTL, 3-4 professional lines)" },
                description_fr: { type: Type.STRING, description: "SEO optimized rich description in French (3-4 professional lines)" },
                description_en: { type: Type.STRING, description: "SEO optimized rich description in English (3-4 professional lines)" },
                suggested_price_dzd: { type: Type.INTEGER, description: "Suggested fair price in Algerian Dinars (e.g. 5500)" },
                wilaya_insights: { type: Type.STRING, description: "1-line insight on regional market demand in Algeria for this category" },
                tags: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "5 search tags customized for Algerian markets",
                },
                safe: { type: Type.BOOLEAN, description: "True if is safe; false if it contains prohibited/illegal merchandise" },
                moderation_reason: { type: Type.STRING, description: "Why the item was flagged, or empty string if safe" },
              },
              required: [
                "title_ar", "title_fr", "title_en",
                "description_ar", "description_fr", "description_en",
                "suggested_price_dzd", "wilaya_insights", "tags", "safe", "moderation_reason"
              ],
            },
          },
        });

        const dataStr = response.text ? response.text.trim() : "";
        const data = JSON.parse(dataStr);
        return res.json({ ...data, simulated: false });

      } catch (err: any) {
        console.warn("Gemini API call failed for description generation, running fallback:", err.message);
        // Fallback to beautiful simulated output if API crashes or returns poor response
      }
    }

    // High quality simulated fallback logic if API is unavailable
    const fallbackPrice = Math.floor(2500 + Math.random() * 12500);
    const tagsMap: Record<string, string[]> = {
      crafts: ["artisanat", "traditionnel", "premium", "dz-crafts", "fait-main"],
      food: ["terroir", "algérie", "deglet-nour", "bio", "traditionnel-dz"],
      electronics: ["high-tech", "garantie", "dz-shop", "livraison-rapide", "alger"],
      fashion: ["caftan", "style", "elégance", "moderne", "dz-couture"],
    };

    const chosenTags = tagsMap[category.toLowerCase()] || ["algeria", "marketplace", "dz-shop", "authentique", "commerce"];

    const isSafe = !name.toLowerCase().includes("weapon") && !name.toLowerCase().includes("gun") && !name.toLowerCase().includes("bomb");

    let simResponse;
    if (selectedProvider === "nvidia") {
      simResponse = {
        title_ar: `${name} - مدعوم بتقنيات عالية وبأداء متميز`,
        title_fr: `${name} - Performance Absolue & Précision`,
        title_en: `${name} - Ultra Tech NVIDIA-Accelerated`,
        description_ar: `اختبر كفاءة ${name} الاستثنائية، منتج مبتكر ومصمم لتقديم أعلى مستويات الأداء المتميز مع ضمان الجودة والمتانة التي تواكب العصر الحديث وبقوة معالجة متطورة في الجزائر.`,
        description_fr: `Faites l'expérience d'une efficacité hors norme avec ${name}, un produit conçu pour délivrer une performance industrielle de pointe, alliant technologie moderne, vitesse et robustesse sur le marché algérien.`,
        description_en: `Experience next-level performance with ${name}, accelerated by NVIDIA edge concepts. Built to deliver maximum industrial efficiency and durability. Crafted using state-of-the-art materials tailored for Algeria.`,
        suggested_price_dzd: fallbackPrice,
        wilaya_insights: `NVIDIA Edge Telemetry suggests high technical interest in ${wilaya || "Algiers"} for modern high-efficiency product alternatives.`,
        tags: [...chosenTags, "tech", "nvidia-nim", "performance"],
        safe: isSafe,
        moderation_reason: isSafe ? "" : "Prohibited keywords flagged during NVIDIA guardrails audit.",
        simulated: true,
      };
    } else if (selectedProvider === "openai") {
      simResponse = {
        title_ar: `${name} - حلول متكاملة ومحسنة للنمو والربح`,
        title_fr: `${name} - Optimisation Premium GPT-4o`,
        title_en: `${name} - Professional SEO Optimized GPT-4o`,
        description_ar: `احصل على ${name} المصمم خصيصًا لتوفير أفضل تجربة مستخدم مع ميزات رائدة وعملية. يضمن لك هذا المنتج القيمة القصوى والاستثمار الذكي طويل الأمد في السوق الجزائرية مع تحسينات ظهور SEO متكاملة.`,
        description_fr: `Optimisez votre quotidien avec ${name}, conçu pour maximiser votre retour sur investissement. Un produit structuré de niveau professionnel qui résout vos besoins avec précision en Algérie.`,
        description_en: `Maximize your efficiency with ${name}, engineered to solve your exact problems with commercial-grade precision. Highly optimized for search visibility, structural performance, durability, and customer satisfaction in Algeria.`,
        suggested_price_dzd: fallbackPrice,
        wilaya_insights: `GPT-4o Market Analysis identifies high commercial traction for ${category} listings in ${wilaya || "Algiers"} with detailed specifications.`,
        tags: [...chosenTags, "openai-gpt", "seo-optimized", "professional"],
        safe: isSafe,
        moderation_reason: isSafe ? "" : "Content failed OpenAI moderation compliance checks.",
        simulated: true,
      };
    } else if (selectedProvider === "other") {
      simResponse = {
        title_ar: `${name} - حكاية حرفية من عبق التاريخ الجزائري`,
        title_fr: `${name} - L'Ame et l'Esprit Artisanal`,
        title_en: `${name} - Handcrafted Heritage Narrative Llama`,
        description_ar: `كل قطعة من ${name} تروي قصة حب وحرفة توارثتها الأجيال. مصنوع يدويًا بشغف ليجلب لك دفء التراث الجزائري العريق وجماله الفريد إلى منزلك.`,
        description_fr: `Chaque détail de ${name} raconte l'histoire d'un savoir-faire ancestral transmis avec amour. Fait à la main pour infuser le charme et l'authenticité de l'artisanat d'art algérien au cœur de votre foyer.`,
        description_en: `Every fiber of ${name} carries the legacy of passionate local artisans. Beautifully hand-styled to bring the timeless warmth, storytelling essence, and cultural heritage of Algerian traditions directly to you.`,
        suggested_price_dzd: fallbackPrice,
        wilaya_insights: `Creative Llama Sentiment shows excellent community passion in ${wilaya || "Algiers"} for cultural heritage and handcrafted details.`,
        tags: [...chosenTags, "heritage", "storytelling", "artisanal-dz"],
        safe: isSafe,
        moderation_reason: isSafe ? "" : "Creative content policy filter triggered.",
        simulated: true,
      };
    } else {
      // Gemini (default)
      simResponse = {
        title_ar: `${name} - لمسة جزائرية أصيلة`,
        title_fr: `${name} - Excellence Algérienne`,
        title_en: `${name} - Authentic DZ Premium`,
        description_ar: `اكتشف ${name} عالي الجودة، مصنوع ومصمم بعناية فائقة ليلائم الذوق والطلب المحلي. منتج مثالي يدمج بين الجودة والتقاليد الجزائرية لتقديم أفضل قيمة.`,
        description_fr: `Découvrez la qualité exceptionnelle de ${name}, conçu pour répondre aux attentes les plus exigeantes de nos clients en Algérie. Un produit mêlant savoir-faire artisanal, durabilité et design soigné.`,
        description_en: `Experience the elegant quality of ${name}, meticulously designed for modern standards in Algeria. Crafted combining local authenticity with top-tier durability and style.`,
        suggested_price_dzd: fallbackPrice,
        wilaya_insights: `Regional demand in ${wilaya || "Algiers"} is highly receptive to artisanal products and locally sourced specialties with premium packaging.`,
        tags: chosenTags,
        safe: isSafe,
        moderation_reason: isSafe ? "" : "Prohibited keywords detected in the item catalog schema check.",
        simulated: true,
      };
    }

    setTimeout(() => {
      res.json(simResponse);
    }, 1200); // Add natural processing latency for premium simulation experience
  });

  // Unique AI Logo Generator route (Imagen + custom vector-based SVG designer fallback)
  app.post("/api/generate-logo", aiResourceLimiter, async (req, res) => {
    logSecurityEvent("INFO", "GENERATE_LOGO_REQUEST", req);
    const { storeName, storeCategory, style, colorTheme } = req.body;

    if (!storeName || typeof storeName !== "string" || storeName.trim().length === 0 || storeName.length > 150) {
      return res.status(400).json({ error: "Store name is required (string, max 150 chars)." });
    }

    const category = storeCategory && typeof storeCategory === "string" ? storeCategory.slice(0, 80) : "General";
    const selectedStyle = style && typeof style === "string" ? style.slice(0, 80) : "luxurious minimalist";
    const selectedTheme = colorTheme && typeof colorTheme === "string" ? colorTheme.slice(0, 80) : "royal gold";

    // Standard Gemini/Imagen prompt formulation
    const prompt = `A professional, clean, minimalist 1:1 square store logo icon insignia for '${storeName}' in ${category} category. Style: ${selectedStyle}. Color theme: ${selectedTheme}. High-end luxury brand identity, vector style icon centered on a beautiful solid premium-colored background, sharp geometric lines, premium boutique aesthetic, scalable vector logo design.`;

    if (ai) {
      try {
        console.log(`Submitting Imagen 4 generation request with prompt: "${prompt}"`);
        const response = await ai.models.generateImages({
          model: "imagen-4.0-generate-001",
          prompt: prompt,
          config: {
            numberOfImages: 1,
            outputMimeType: "image/jpeg",
            aspectRatio: "1:1",
          },
        });

        if (response && response.generatedImages && response.generatedImages[0]) {
          const imageBase64 = response.generatedImages[0].image.imageBytes;
          return res.json({
            success: true,
            logoUrl: `data:image/jpeg;base64,${imageBase64}`,
            simulated: false,
            style: selectedStyle,
            colorTheme: selectedTheme,
          });
        }
      } catch (err: any) {
        console.warn("Imagen API call failed. Reverting to custom SVG generator:", err.message);
      }
    }

    // High quality, dynamic SVG vector logo generator with customized luxury brand themes!
    const initials = storeName
      .split(/\s+/)
      .slice(0, 2)
      .map((w: string) => w.charAt(0).toUpperCase())
      .join("");

    let startColor = "#1e3a8a"; // royal sapphire defaults
    let endColor = "#1d4ed8";
    let accentColor = "#60a5fa";
    let textColor = "#ffffff";

    if (selectedTheme.includes("gold") || selectedTheme.includes("amber")) {
      startColor = "#1a150e"; // Obsidian / Pitch-dark gold
      endColor = "#261f14";
      accentColor = "#fbbf24"; // golden amber
      textColor = "#fef08a";
    } else if (selectedTheme.includes("rose") || selectedTheme.includes("crimson")) {
      startColor = "#4c0519"; // Deep rose / burgundy
      endColor = "#881337";
      accentColor = "#fda4af"; // petal rose
      textColor = "#ffe4e6";
    } else if (selectedTheme.includes("emerald") || selectedTheme.includes("mint") || selectedTheme.includes("green")) {
      startColor = "#064e3b"; // Forest emerald
      endColor = "#022c22";
      accentColor = "#34d399"; // energetic mint
      textColor = "#d1fae5";
    } else if (selectedTheme.includes("obsidian") || selectedTheme.includes("dark") || selectedTheme.includes("charcoal")) {
      startColor = "#0f172a"; // Deep space obsidian
      endColor = "#1e293b";
      accentColor = "#94a3b8"; // sleek slate
      textColor = "#f8fafc";
    } else if (selectedTheme.includes("violet") || selectedTheme.includes("indigo") || selectedTheme.includes("purple")) {
      startColor = "#3b0764"; // Royal violet
      endColor = "#581c87";
      accentColor = "#d8b4fe";
      textColor = "#fae8ff";
    }

    // Build custom modern corporate/artisanal geometric logo insignia as raw vector SVG content
    const svgCode = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <defs>
          <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${startColor}" />
            <stop offset="100%" stop-color="${endColor}" />
          </linearGradient>
          <filter id="subtleGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        <!-- Smooth Background -->
        <rect width="400" height="400" rx="40" fill="url(#brandGrad)" />
        
        <!-- Premium Central Concentric Shapes -->
        <circle cx="200" cy="200" r="145" fill="none" stroke="${accentColor}" stroke-opacity="0.15" stroke-width="12" />
        <circle cx="200" cy="200" r="130" fill="none" stroke="${accentColor}" stroke-opacity="0.4" stroke-width="2" />
        <circle cx="200" cy="200" r="122" fill="none" stroke="${accentColor}" stroke-width="4.5" stroke-dasharray="24 8" />
        
        <!-- Luxury Diamond Outer Accents -->
        <polygon points="200,65 212,77 200,89 188,77" fill="${accentColor}" />
        <polygon points="200,311 212,323 200,335 188,323" fill="${accentColor}" />
        <polygon points="77,200 89,212 77,224 65,212" fill="${accentColor}" />
        <polygon points="323,200 335,212 323,224 311,212" fill="${accentColor}" />
        
        <!-- Centered Clean Monogram Font Identity -->
        <text 
          x="200" 
          y="218" 
          font-family="system-ui, -apple-system, sans-serif" 
          font-size="95" 
          font-weight="900" 
          letter-spacing="-1"
          fill="${textColor}" 
          text-anchor="middle"
          filter="url(#subtleGlow)"
        >${initials || "DZ"}</text>
        
        <!-- Delicate Bottom Label Line -->
        <text 
          x="200" 
          y="282" 
          font-family="system-ui, -apple-system, 'SF Mono', monospace" 
          font-size="12" 
          font-weight="800"
          letter-spacing="5"
          fill="${accentColor}" 
          fill-opacity="0.9"
          text-anchor="middle"
        >${category.toUpperCase()}</text>
      </svg>
    `.trim();

    // Encode string to base64 so it can be read seamlessly as a regular data URL image src!
    const svgBase64 = Buffer.from(svgCode).toString("base64");
    const dataUrl = `data:image/svg+xml;base64,${svgBase64}`;

    // Return custom generated vectors directly back to active store selector
    setTimeout(() => {
      res.json({
        success: true,
        logoUrl: dataUrl,
        simulated: true,
        style: selectedStyle,
        colorTheme: selectedTheme,
      });
    }, 1000); // 1s processing delay for natural feeling
  });

  // Generate AI Merchant Summary route using Gemini 3.5 Flash or robust fallback
  app.post("/api/generate-summary", aiResourceLimiter, async (req, res) => {
    logSecurityEvent("INFO", "GENERATE_SUMMARY_REQUEST", req);
    const { name, category, bio, location } = req.body;

    if (!name || typeof name !== "string" || name.trim().length === 0 || name.length > 150) {
      return res.status(400).json({ error: "Store name is required (string, max 150 chars)." });
    }

    const prompt = `
      You are an expert copywriter specializing in Algerian artisan, craft, and boutique e-commerce.
      Write a warm, professional, highly descriptive, and engaging one-paragraph "About the Merchant" biography (approx. 3-4 sentences, max 80 words) for an online store.
      Use the following store profile details to craft the biography:
      - Store Name: ${name}
      - Category: ${category || "General / Handcrafted"}
      - Current Bio Draft / Notes: ${bio || "No description provided"}
      - Location (Algerian Wilaya): ${location || "Algeria"}

      The tone should be welcoming, premium, culturally proud, and authentic.
      You must respond with only the biography text, in English. Do not include quotes, HTML tags, greetings, or meta-commentary.
    `;

    if (ai) {
      try {
        const response = await generateContentWithFallback({
          contents: prompt,
        });

        const dataStr = response.text ? response.text.trim() : "";
        if (dataStr) {
          return res.json({ summary: dataStr, simulated: false });
        }
      } catch (err: any) {
        console.warn("Gemini AI summary generation failed, running fallback:", err.message);
      }
    }

    // High quality simulated fallback logic if API is unavailable or fails
    const fallbackTemplate = `Welcome to ${name}, a premium boutique located in ${location || "Algiers"} specializing in high-quality ${category ? category.toLowerCase() : "handcrafted goods"}. Built upon a rich heritage and dedication to local craftsmanship, we take pride in presenting beautiful selections designed to meet the highest standards. Our products combine authentic Algerian artistry with exceptional durability, making every purchase a piece of timeless quality. We are proud to share our passion with you.`;

    setTimeout(() => {
      res.json({ summary: fallbackTemplate, simulated: true });
    }, 1200); // 1.2s delay for natural feeling
  });

  // Analyze Market Trends route using Gemini 3.5 Flash or robust fallback
  app.post("/api/analyze-market-trends", aiResourceLimiter, async (req, res) => {
    logSecurityEvent("INFO", "ANALYZE_TRENDS_REQUEST", req);
    const { storeName, category, wilaya } = req.body;

    if (!wilaya || typeof wilaya !== "string" || wilaya.trim().length === 0 || wilaya.length > 100) {
      return res.status(400).json({ error: "Wilaya is required to analyze trends (string, max 100 chars)." });
    }

    const prompt = `
      You are an expert e-commerce and retail analyst specializing in local Algerian markets, craftsmanship, handcrafts, boutique operations, and regional heritage across Algerian Wilayas (provinces).
      Analyze the local market trends for the Wilaya of: ${wilaya}.
      The merchant's store is named "${storeName || "My Store"}" and operates primarily in the "${category || "General / Handcrafted"}" category.
      
      Write a brief, professional, and actionable textual recommendation (approx. 4-5 sentences, max 100 words) on current popular/trending product categories or specific items that are highly sought-after in ${wilaya} that this merchant could add to their inventory.
      
      Make the recommendation specific to ${wilaya} (incorporate authentic local specialties, materials, cultural heritage, or regional demand trends, e.g., pottery from Bider in Tlemcen, olive oil from Blida/Kabylie, copper items from Casbah, leather from Souf, wood carving from M'zab, etc.).
      
      Respond directly with the recommendation paragraph. Do not include quotes, markdown headers, HTML, or conversational intros/outros.
    `;

    if (ai) {
      try {
        const response = await generateContentWithFallback({
          contents: prompt,
        });

        const dataStr = response.text ? response.text.trim() : "";
        if (dataStr) {
          return res.json({ recommendation: dataStr, simulated: false });
        }
      } catch (err: any) {
        console.warn("Gemini AI trends generation failed, running fallback:", err.message);
      }
    }

    // High quality simulated fallback logic if API is unavailable or fails, specifically customized for the Wilaya if possible
    const fallbackTemplate = `In the Wilaya of ${wilaya || "Algeria"}, there is a strong and growing market demand for authentic, high-quality local specialities and artisanal products. Given your focus on "${category || "General / Handcrafted"}", inserting modern variations of traditional items—such as hand-painted ceramic accents, regionally inspired textiles, or premium organic packaging—can significantly capture local interest. We highly recommend expanding your inventory to include small, high-margin items featuring local ${wilaya}-inspired embellishments or partnering with local craftsmen for exclusive regional drops, which currently enjoy excellent engagement from both domestic collectors and regional travelers.`;

    setTimeout(() => {
      res.json({ recommendation: fallbackTemplate, simulated: true });
    }, 1200);
  });

  // Unique AI Product Landing Image Generator route (Imagen + custom beautiful SVG fallback)
  app.post("/api/generate-landing-image", async (req, res) => {
    const { productName, style, prompt: userPrompt } = req.body;

    if (!productName) {
      return res.status(400).json({ error: "Product name is required." });
    }

    const selectedStyle = style || "modern studio";
    const prompt = `A professional, stunning, high-end 16:9 banner image for a landing page of a premium product called '${productName}'. Visual style: ${selectedStyle}. ${userPrompt || ""}. Studio lighting, luxury commercial advertisement photography style, extremely detailed, product spotlight, beautiful composition.`;

    if (ai) {
      try {
        console.log(`Submitting Imagen 4 generation request for product landing page with prompt: "${prompt}"`);
        const response = await ai.models.generateImages({
          model: "imagen-4.0-generate-001",
          prompt: prompt,
          config: {
            numberOfImages: 1,
            outputMimeType: "image/jpeg",
            aspectRatio: "16:9",
          },
        });

        if (response && response.generatedImages && response.generatedImages[0]) {
          const imageBase64 = response.generatedImages[0].image.imageBytes;
          return res.json({
            success: true,
            imageUrl: `data:image/jpeg;base64,${imageBase64}`,
            simulated: false,
          });
        }
      } catch (err: any) {
        console.warn("Imagen API call failed for landing page image. Reverting to custom SVG/canvas generator:", err.message);
      }
    }

    // High quality beautiful dynamic SVG fallback for product landing image
    const hue = Math.floor(Math.random() * 360);
    const bgGradStart = `hsl(${hue}, 40%, 15%)`;
    const bgGradEnd = `hsl(${(hue + 30) % 360}, 50%, 8%)`;
    const accentColor = `hsl(${hue}, 80%, 65%)`;

    const svgCode = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
        <defs>
          <linearGradient id="landingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${bgGradStart}" />
            <stop offset="100%" stop-color="${bgGradEnd}" />
          </linearGradient>
          <radialGradient id="spotlight" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.15" />
            <stop offset="100%" stop-color="#000000" stop-opacity="0" />
          </radialGradient>
        </defs>
        
        <!-- Background -->
        <rect width="800" height="450" fill="url(#landingGrad)" />
        <rect width="800" height="450" fill="url(#spotlight)" />
        
        <!-- Abstract geometric layout representing product craftsmanship -->
        <circle cx="400" cy="225" r="180" fill="none" stroke="${accentColor}" stroke-opacity="0.1" stroke-width="40" />
        <circle cx="400" cy="225" r="140" fill="none" stroke="${accentColor}" stroke-opacity="0.2" stroke-width="2" />
        
        <path d="M150,120 L650,120 A20,20 0 0,1 670,140 L670,310 A20,20 0 0,1 650,330 L150,330 A20,20 0 0,1 130,310 L130,140 A20,20 0 0,1 150,120 Z" fill="none" stroke="${accentColor}" stroke-opacity="0.3" stroke-dasharray="10, 5" stroke-width="1.5" />
        
        <!-- Shiny background effects -->
        <circle cx="150" cy="120" r="3" fill="${accentColor}" />
        <circle cx="650" cy="120" r="3" fill="${accentColor}" />
        <circle cx="150" cy="330" r="3" fill="${accentColor}" />
        <circle cx="650" cy="330" r="3" fill="${accentColor}" />

        <!-- Banner Text Content -->
        <text x="400" y="190" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="4" text-transform="uppercase">${productName}</text>
        <text x="400" y="235" font-family="system-ui, sans-serif" font-size="14" font-weight="600" fill="${accentColor}" text-anchor="middle" letter-spacing="8" text-transform="uppercase">${selectedStyle}</text>
        
        <line x1="300" y1="265" x2="500" y2="265" stroke="${accentColor}" stroke-opacity="0.4" stroke-width="2" />
        
        <text x="400" y="300" font-family="system-ui, sans-serif" font-size="11" font-weight="400" fill="#cbd5e1" text-anchor="middle" font-style="italic">Generated with DZ Advanced AI Engine • Authentic Craft Spotlight</text>
      </svg>
    `.trim();

    const svgBase64 = Buffer.from(svgCode).toString("base64");
    const dataUrl = `data:image/svg+xml;base64,${svgBase64}`;

    setTimeout(() => {
      res.json({
        success: true,
        imageUrl: dataUrl,
        simulated: true,
      });
    }, 1200);
  });

  // Dedicated AI-powered background analyzer and removal service
  app.post("/api/remove-background", async (req, res) => {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: "Image data is required." });
    }

    // Regex to split mimeType and actual base64 data
    const matches = image.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
    let mimeType = "image/png";
    let base64Data = image;

    if (matches && matches.length === 3) {
      mimeType = matches[1];
      base64Data = matches[2];
    }

    // 1. Integration Option A: remove.bg AI API
    const removeBgKey = process.env.REMOVE_BG_API_KEY;
    if (removeBgKey && removeBgKey !== "YOUR_REMOVE_BG_KEY" && removeBgKey.trim() !== "") {
      try {
        console.log("Routing background removal request to premium remove.bg API");
        const formData = new URLSearchParams();
        formData.append("image_file_b64", base64Data);
        formData.append("size", "auto");

        const removeBgRes = await fetch("https://api.remove.bg/v1.0/removebg", {
          method: "POST",
          headers: {
            "X-Api-Key": removeBgKey,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData,
        });

        if (removeBgRes.ok) {
          const buffer = await removeBgRes.arrayBuffer();
          const base64Png = Buffer.from(buffer).toString("base64");
          return res.json({
            success: true,
            mode: "none", // Already transparent PNG
            color: "#ffffff",
            tolerance: 40,
            summary: "✨ Pixel-perfect background removal completed by official Remove.bg neural network!",
            processedImage: `data:image/png;base64,${base64Png}`,
            provider: "remove.bg"
          });
        } else {
          const errorText = await removeBgRes.text();
          console.error("Remove.bg API error status:", removeBgRes.status, errorText);
        }
      } catch (err: any) {
        console.error("Exception calling Remove.bg service:", err.message);
      }
    }

    // 2. Integration Option B: Cloudinary API
    const cloudinaryUrl = process.env.CLOUDINARY_URL;
    if (cloudinaryUrl && cloudinaryUrl.includes("cloudinary://") && cloudinaryUrl.trim() !== "") {
      try {
        console.log("Routing background removal request to Cloudinary Media API");
        const connMatch = cloudinaryUrl.match(/cloudinary:\/\/([^:]+):([^@]+)@(.+)/);
        if (connMatch) {
          const apiKey = connMatch[1];
          const apiSecret = connMatch[2];
          const cloudName = connMatch[3];

          const timestamp = Math.round(new Date().getTime() / 1000);
          const signatureStr = `timestamp=${timestamp}${apiSecret}`;
          const crypto = await import("crypto");
          const signature = crypto.createHash("sha1").update(signatureStr).digest("hex");

          const bodyData = new URLSearchParams();
          bodyData.append("file", `data:${mimeType};base64,${base64Data}`);
          bodyData.append("timestamp", timestamp.toString());
          bodyData.append("api_key", apiKey);
          bodyData.append("signature", signature);

          const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: "POST",
            body: bodyData,
          });

          if (cloudRes.ok) {
            const json = await cloudRes.json();
            const secureUrl = json.secure_url;
            // e_bgremoval is Cloudinary's dynamic AI backdrop extraction effect
            const transparentUrl = secureUrl.replace("/upload/", "/upload/e_bgremoval/");

            const processedRes = await fetch(transparentUrl);
            if (processedRes.ok) {
              const buffer = await processedRes.arrayBuffer();
              const base64Png = Buffer.from(buffer).toString("base64");
              return res.json({
                success: true,
                mode: "none", // Already transparent PNG
                color: "#ffffff",
                tolerance: 40,
                summary: "✨ High-fidelity background removal processed by Cloudinary AI transformation!",
                processedImage: `data:image/png;base64,${base64Png}`,
                provider: "cloudinary"
              });
            } else {
              console.error("Failed to fetch transparent transformed image from Cloudinary:", transparentUrl);
            }
          } else {
            const errorText = await cloudRes.text();
            console.error("Cloudinary upload failed:", errorText);
          }
        }
      } catch (err: any) {
        console.error("Exception calling Cloudinary media service:", err.message);
      }
    }

    // 3. Native fallback: Gemini Background Analysis & Real-time Client-side Chroma Key
    if (ai) {
      try {
        console.log(`Submitting AI background analysis for brand image (Mime: ${mimeType})`);

        const imagePart = {
          inlineData: {
            mimeType: mimeType,
            data: base64Data,
          },
        };

        const textPart = {
          text: `You are an expert design assistant. Analyze this brand logo image and determine the dominant background color that needs to be removed to make it perfectly transparent.
                 Select the best background removal technology 'mode' among:
                 - 'white': If the background is solid pure white, cream, or near-white.
                 - 'black': If the background is solid black or very dark charcoal.
                 - 'chroma': If the background is any other solid color (like red, blue, green, grey, etc.) or gradient.
                 
                 Provide the exact hex 'color' of the background (e.g. '#ffffff' or '#ecf0f1').
                 Provide a recommended 'tolerance' integer (from 15 to 110) where white/black is usually 35-50, and chroma keying is usually 40-75.
                 Provide a clean 1-sentence 'summary' of your findings (e.g., 'Detected off-white studio backdrop' or 'Identified red brand chroma background.').`,
        };

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: { parts: [imagePart, textPart] },
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                mode: { type: Type.STRING, description: "Must be 'white', 'black', or 'chroma'" },
                color: { type: Type.STRING, description: "The hex color code of the backdrop, e.g. #ffffff" },
                tolerance: { type: Type.INTEGER, description: "Color distance threshold (15 to 110)" },
                summary: { type: Type.STRING, description: "Brief design summary" },
              },
              required: ["mode", "color", "tolerance", "summary"],
            },
          },
        });

        const dataStr = response.text ? response.text.trim() : "";
        if (dataStr) {
          const parsedResult = JSON.parse(dataStr);
          return res.json({
            success: true,
            mode: parsedResult.mode || "white",
            color: parsedResult.color || "#ffffff",
            tolerance: parsedResult.tolerance || 40,
            summary: parsedResult.summary || "AI successfully processed image background keys.",
            simulated: false,
          });
        }
      } catch (err: any) {
        console.warn("Gemini AI background removal analysis failed. Using fallback:", err.message);
      }
    }

    // 4. Default high quality simulated background analysis
    setTimeout(() => {
      res.json({
        success: true,
        mode: "white",
        color: "#ffffff",
        tolerance: 45,
        summary: "AI Background Analyzer: Identified white/bright studio background.",
        simulated: true,
      });
    }, 1000);
  });


  // Memory Store for Orders
  const memoryOrders: any[] = [
    {
      id: "ORD-94821",
      storeId: "store_1",
      storeName: "Tapis Berbères Ath Yenni",
      date: "2026-05-19T14:30:00Z",
      shopper: {
        name: "Amine Belhadj",
        email: "amine.b@gmail.com",
        phone: "0662123456",
        wilaya: "Alger",
        wilayaCode: "16",
        commune: "Sidi M'Hamed",
        address: "12 Rue Didouche Mourad"
      },
      items: [
        {
          id: "p_1_2",
          name: "Bijou Kabyle - Bracelet en Argent Massif",
          price: 18500,
          quantity: 1,
          imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&auto=format&fit=crop&q=80"
        }
      ],
      total: 18500,
      shippingCost: 400,
      status: "accepted",
      paymentMethod: "eddahabia"
    },
    {
      id: "ORD-48192",
      storeId: "store_3",
      storeName: "Oasis de Deglet Nour - Ghardaïa Spécialités",
      date: "2026-05-20T00:15:00Z",
      shopper: {
        name: "Sonia Gacem",
        email: "sonia.g@yahoo.fr",
        phone: "0770987654",
        wilaya: "Oran",
        wilayaCode: "31",
        commune: "Bir El Djir",
        address: "Cité Millénium"
      },
      items: [
        {
          id: "p_3_1",
          name: "Dattes Deglet Nour Bio 'Miel Doré' - Carton 5Kg",
          price: 4800,
          quantity: 2,
          imageUrl: "https://images.unsplash.com/photo-1569591159212-b02ea8a9f239?w=400&auto=format&fit=crop&q=80"
        }
      ],
      total: 9600,
      shippingCost: 700,
      status: "pending",
      paymentMethod: "cod"
    }
  ];

  // Get orders API
  app.get("/api/orders", (req, res) => {
    logSecurityEvent("INFO", "GET_ORDERS_REQUEST", req);
    res.json(memoryOrders);
  });

  // Memory Store for Return Requests
  const memoryReturns: any[] = [
    {
      id: "RET-83942",
      orderId: "ORD-94821",
      date: "2026-06-01T10:00:00Z",
      shopperName: "Amine Belhadj",
      product: {
        id: "p_1_2",
        name: "Bijou Kabyle - Bracelet en Argent Massif",
        imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&auto=format&fit=crop&q=80",
        size: "Medium"
      },
      quantity: 1,
      reason: "product doesn't match description",
      reasonDetails: "The engraving pattern is slightly different from the website picture.",
      deliveryMethod: "drop_off",
      refundMethod: "original_payment",
      status: "approved",
      refundAmount: 18500
    }
  ];

  // Get returns API
  app.get("/api/returns", (req, res) => {
    logSecurityEvent("INFO", "GET_RETURNS_REQUEST", req);
    res.json(memoryReturns);
  });

  // Post returns API
  app.post("/api/returns", sensitiveAuthLimiter, (req, res) => {
    logSecurityEvent("INFO", "CREATE_RETURN_REQUEST", req);
    const newReturn = req.body;
    if (!newReturn || typeof newReturn !== "object") {
      return res.status(400).json({ error: "Invalid return request payload." });
    }
    if (!newReturn.id) newReturn.id = `RET-${Math.floor(10000 + Math.random() * 90000)}`;
    if (!newReturn.date) newReturn.date = new Date().toISOString();
    if (!newReturn.status) newReturn.status = "pending";
    memoryReturns.unshift(newReturn);
    res.status(201).json(newReturn);
  });

  // Post orders API (Critical Financial Entry Point with Tarpit Protection)
  app.post("/api/orders", sensitiveAuthLimiter, (req, res) => {
    logSecurityEvent("INFO", "CREATE_ORDER_REQUEST", req);
    const newObj = req.body;
    if (!newObj) {
      return res.status(400).json({ error: "Order body required." });
    }
    if (Array.isArray(newObj)) {
      newObj.forEach((o) => {
        if (!o.id) o.id = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
        if (!o.date) o.date = new Date().toISOString();
        if (!o.status) o.status = "pending";
        memoryOrders.unshift(o);
      });
      res.status(201).json(newObj);
    } else {
      if (!newObj.id) newObj.id = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
      if (!newObj.date) newObj.date = new Date().toISOString();
      if (!newObj.status) newObj.status = "pending";
      memoryOrders.unshift(newObj);
      res.status(201).json(newObj);
    }
  });

  // Update order status API
  app.put("/api/orders/:id/status", sensitiveAuthLimiter, (req, res) => {
    logSecurityEvent("INFO", "UPDATE_ORDER_STATUS_REQUEST", req, { orderId: req.params.id, status: req.body?.status });
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "accepted", "shipped", "delivered"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    // Since in-memory grouping is shared, update matching ids
    let found = false;
    for (let i = 0; i < memoryOrders.length; i++) {
      if (memoryOrders[i].id === id) {
        memoryOrders[i].status = status;
        found = true;
      }
    }

    if (!found) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ success: true, id, status });
  });

  // AI-powered category classification for shopping list items
  app.post("/api/suggest-category", async (req, res) => {
    const { itemName } = req.body;

    if (!itemName || !itemName.trim()) {
      return res.status(400).json({ error: "Item name is required." });
    }

    const trimmedItem = itemName.trim();

    const systemPrompt = `
      You are an AI grocery and retail shopping assistant. 
      Analyze the item name: "${trimmedItem}".
      Classify this item into one of the following standard categories:
      - Produce (fruits, vegetables, herbs)
      - Dairy (milk, butter, cheese, yogurt, eggs)
      - Pantry (pasta, rice, flour, oil, spices, canned goods, condiments)
      - Bakery (bread, croissants, tortillas, buns)
      - Meat & Seafood (beef, chicken, turkey, lamb, salmon, shrimp)
      - Beverages (juice, soda, water, coffee, tea)
      - Snacks & Sweets (chips, cookies, chocolate, nuts)
      - Frozen Foods (frozen meals, ice cream, frozen veggies)
      - Personal Care & Pharmacy (shampoo, soap, toothpaste, vitamins)
      - Household & Cleaning (detergent, paper towels, trash bags)
      - Other (for anything that doesn't fit the above)

      Respond STRICTLY in JSON format with a single field "category" containing exactly one of the category names above. Do not include any formatting or other text.
    `;

    if (ai) {
      try {
        const response = await generateContentWithFallback({
          contents: systemPrompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                category: { 
                  type: Type.STRING, 
                  description: "Suggested category, exactly one of: Produce, Dairy, Pantry, Bakery, Meat & Seafood, Beverages, Snacks & Sweets, Frozen Foods, Personal Care & Pharmacy, Household & Cleaning, Other" 
                },
              },
              required: ["category"],
            },
          },
        });

        const dataStr = response.text ? response.text.trim() : "";
        if (dataStr) {
          const parsedResult = JSON.parse(dataStr);
          let category = parsedResult.category || "Other";
          return res.json({ category, simulated: false });
        }
      } catch (err: any) {
        console.warn("Gemini category classification failed, running offline rules:", err.message);
      }
    }

    // High quality offline rules (local fallback matchers) for quick, reliable categorization if Gemini is offline
    const lowerItem = trimmedItem.toLowerCase();
    let category = "Other";

    if (/\b(apple|banana|orange|grape|strawberry|berry|fruit|tomato|potato|onion|garlic|carrot|cucumber|lettuce|spinach|salad|herb|mint|lemon|lime|avocado|pepper|broccoli|cabbage|peach|pear|plum|cherry|melon|watermelon|fig|date)\b/.test(lowerItem)) {
      category = "Produce";
    } else if (/\b(milk|butter|cheese|yogurt|cream|egg|dairy|cheddar|mozzarella|parmesan|margarine|kefir)\b/.test(lowerItem)) {
      category = "Dairy";
    } else if (/\b(pasta|rice|flour|oil|olive oil|sauce|spice|salt|pepper|sugar|honey|canned|beans|lentils|chickpeas|couscous|vinegar|mustard|ketchup|mayo|pantry)\b/.test(lowerItem)) {
      category = "Pantry";
    } else if (/\b(bread|bagel|croissant|toast|tortilla|bakery|pastry|bun|baguette|lavash|khobz)\b/.test(lowerItem)) {
      category = "Bakery";
    } else if (/\b(chicken|beef|meat|seafood|fish|steak|pork|turkey|salmon|tuna|shrimp|crab|lobster|lamb|sausage|bacon)\b/.test(lowerItem)) {
      category = "Meat & Seafood";
    } else if (/\b(water|soda|juice|beverage|coke|sprite|fanta|tea|coffee|beer|wine|drink|liquor|whiskey|vodka)\b/.test(lowerItem)) {
      category = "Beverages";
    } else if (/\b(chips|cookie|chocolate|sweet|candy|nut|almond|peanut|snack|popcorn|cracker|pretzel|gummy)\b/.test(lowerItem)) {
      category = "Snacks & Sweets";
    } else if (/\b(frozen|ice cream|waffle|pizza|burger|fry|fries)\b/.test(lowerItem)) {
      category = "Frozen Foods";
    } else if (/\b(soap|shampoo|toothpaste|brush|lotion|cream|vitamin|medicine|aspirin|care|hygiene|perfume|deodorant)\b/.test(lowerItem)) {
      category = "Personal Care & Pharmacy";
    } else if (/\b(detergent|cleaning|wipe|towel|paper|napkin|bag|trash|plate|sponge|dish|foil|wrap)\b/.test(lowerItem)) {
      category = "Household & Cleaning";
    }

    setTimeout(() => {
      res.json({ category, simulated: true });
    }, 400); // Small natural latency for fallback
  });

  // AI-powered photo item identification for smart shopping list (Supports Camera Snapshot & Local File Upload)
  app.post("/api/identify-item-photo", async (req, res) => {
    const { image, mimeType: clientMimeType, modelName, sourceType } = req.body;

    if (!image) {
      return res.status(400).json({ error: "An image photo or uploaded file (base64) is required." });
    }

    let mimeType = clientMimeType || "image/jpeg";
    let base64Data = "";

    const matches = image.match(/^data:([a-zA-Z0-9-]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      mimeType = matches[1];
      base64Data = matches[2];
    } else {
      base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    }

    const sourceLabel = sourceType === "file_upload" ? "uploaded image file" : "camera photo";
    const requestedModel = modelName || "Gemini 2.5 Flash";

    const systemPrompt = `You are an AI visual shopping assistant. 
Examine the ${sourceLabel} provided and identify the primary retail product, food item, grocery, or household good shown.

Rules:
1. "itemName": Provide a clean, concise, human-friendly item name suitable for a smart shopping list (e.g. "Honeycrisp Apples", "Whole Milk", "Extra Virgin Olive Oil", "Fresh Sourdough Bread", "Ground Coffee", "Avocados", "Toothpaste").
2. "category": Classify the item into EXACTLY ONE of these standard categories:
   - Produce
   - Dairy
   - Pantry
   - Bakery
   - Meat & Seafood
   - Beverages
   - Snacks & Sweets
   - Frozen Foods
   - Personal Care & Pharmacy
   - Household & Cleaning
   - Other
3. "confidence": One of "high", "medium", or "low".
4. "description": A short 1-sentence description or key detail observed in the ${sourceLabel} (e.g., "Fresh organic red apples" or "Whole milk bottle 1L").

Respond strictly in JSON format matching the schema.`;

    if (ai) {
      try {
        const imagePart = {
          inlineData: {
            mimeType: mimeType,
            data: base64Data,
          },
        };

        const response = await generateContentWithFallback({
          contents: {
            parts: [
              imagePart,
              { text: systemPrompt },
            ],
          },
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                itemName: { type: Type.STRING, description: "Identified item name for shopping list" },
                category: { type: Type.STRING, description: "Standard shopping category" },
                confidence: { type: Type.STRING, description: "Confidence level: high, medium, or low" },
                description: { type: Type.STRING, description: "Short description of what was detected in the photo" },
              },
              required: ["itemName", "category", "confidence", "description"],
            },
          },
        });

        const dataStr = response.text ? response.text.trim() : "";
        if (dataStr) {
          const parsedResult = JSON.parse(dataStr);
          return res.json({
            itemName: parsedResult.itemName || "Item",
            category: parsedResult.category || "Other",
            confidence: parsedResult.confidence || "high",
            description: parsedResult.description || `Identified from ${sourceLabel}`,
            modelUsed: requestedModel,
            sourceType: sourceType || "unknown",
            simulated: false,
          });
        }
      } catch (err: any) {
        console.warn(`Gemini photo identification failed (${requestedModel}), fallback to local heuristic:`, err.message);
      }
    }

    // High quality offline / fallback response if AI fails or key is missing
    return res.json({
      itemName: "Identified Item",
      category: "Produce",
      confidence: "medium",
      description: `Photo processed successfully (${sourceLabel}).`,
      modelUsed: requestedModel,
      sourceType: sourceType || "unknown",
      simulated: true,
    });
  });

  // Helper to fetch external image or parse data URL as base64
  async function fetchImageAsBase64(imageUrl: string): Promise<{ data: string; mimeType: string }> {
    if (!imageUrl || typeof imageUrl !== "string") {
      throw new Error("Invalid image source provided");
    }

    // Handle data URLs directly
    if (imageUrl.startsWith("data:")) {
      const matches = imageUrl.match(/^data:([a-zA-Z0-9-]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        return { mimeType: matches[1], data: matches[2] };
      }
      const mimeTypeMatch = imageUrl.match(/^data:([a-zA-Z0-9-]+\/[a-zA-Z0-9-.+]+);/);
      const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : "image/jpeg";
      const base64Data = imageUrl.replace(/^data:[^;]+;base64,/, "");
      return { mimeType, data: base64Data };
    }

    // Prepare full URL
    let fullUrl = imageUrl;
    if (fullUrl.startsWith("//")) {
      fullUrl = `https:${fullUrl}`;
    } else if (!fullUrl.startsWith("http://") && !fullUrl.startsWith("https://")) {
      throw new Error(`Unsupported image protocol for URL: ${imageUrl}`);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000); // 6s timeout

    try {
      const res = await fetch(fullUrl, {
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        },
      });
      clearTimeout(timeout);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const contentType = res.headers.get("content-type");
      const mimeType = contentType && contentType.includes("image") ? contentType.split(";")[0] : "image/jpeg";
      return {
        data: buffer.toString("base64"),
        mimeType,
      };
    } catch (error: any) {
      clearTimeout(timeout);
      console.warn("Could not fetch remote image for base64:", error.message);
      throw error;
    }
  }

  // API to generate accessible alt-text for product images using Gemini vision capabilities
  app.post("/api/generate-alt-text", async (req, res) => {
    const { image, imageUrl, model = "gemini", productName = "", category = "" } = req.body;

    const rawSource = image || imageUrl || "";

    let mimeType = "image/jpeg";
    let base64Data = "";

    if (rawSource) {
      try {
        const fetched = await fetchImageAsBase64(rawSource);
        mimeType = fetched.mimeType;
        base64Data = fetched.data;
      } catch (err: any) {
        console.warn("Image resolution for alt-text fallback gracefully:", err.message);
      }
    }

    const systemPrompt = `You are an AI accessibility specialist and professional product catalog cataloger. 
Your task is to analyze the provided product image and generate:
1. An accessible, descriptive, and clean "altText" (usually 1-2 concise sentences, optimized for screen readers, containing crucial visual information, colors, textures, and product features without redundancy, avoid starting with "image of" or "photo of").
2. A "detailedDescription" (a more detailed description of the composition, lighting, style, and product setting, tailored according to the selected AI model's style profile).

The selected AI model style profile is: ${model.toUpperCase()}.
Style guidelines for ${model.toUpperCase()}:
- GEMINI: Balanced, standard-compliant, highly accurate, and objective.
- GPT: Highly commercial, clean, professional structure, highlighting value propositions and material details.
- GROK: Punchy, direct, focused on bold highlights and real-world utility.
- MIDJOURNEY: Artistic, focuses on lighting, camera rendering (cinematic, studio, photorealistic), color palette harmony, and aesthetic atmosphere.
- LEONARDO: Creative, focus on detailing, textures, dynamic composition, and dramatic highlights.
- KLING: Cinematic, focusing on motion, depth of field, and crisp action capture.
- SEEDANCE: Dynamic, organic, focus on lifelike rendering and intricate high-fidelity textures.

Context about the product:
- Name: ${productName || "Unknown Product"}
- Category: ${category || "General"}

You must return the response strictly as a JSON object matching this schema:
{
  "altText": "Concise alternative text for screen readers...",
  "detailedDescription": "Detailed artistic or semantic description..."
}
`;

    if (ai && base64Data) {
      try {
        console.log(`Analyzing product image for alt-text with model profile: ${model}`);

        const imagePart = {
          inlineData: {
            mimeType: mimeType,
            data: base64Data,
          },
        };

        const textPart = {
          text: systemPrompt,
        };

        // Use standard generateContent with fallback
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: { parts: [imagePart, textPart] },
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                altText: { type: Type.STRING, description: "Accessible description under 150 characters" },
                detailedDescription: { type: Type.STRING, description: "Detailed description aligned with model style" },
              },
              required: ["altText", "detailedDescription"],
            },
          },
        });

        const dataStr = response.text ? response.text.trim() : "";
        if (dataStr) {
          const parsedResult = JSON.parse(dataStr);
          return res.json({
            success: true,
            altText: parsedResult.altText,
            detailedDescription: parsedResult.detailedDescription,
            modelUsed: `gemini-3.5-flash (${model}-profile)`,
            simulated: false,
          });
        }
      } catch (err: any) {
        console.warn("Gemini vision analysis failed, running beautiful fallback:", err.message);
      }
    }

    // High quality fallback alt-text generation if Gemini is offline or not configured
    let fallbackAlt = "";
    let fallbackDetailed = "";

    const descName = productName || "this exquisite handcrafted Algerian product";
    const cleanCat = category ? category.toLowerCase() : "artisanal";

    if (model === "midjourney") {
      fallbackAlt = `Cinematic studio portrait of ${descName}, showcasing rich textures and elegant regional design.`;
      fallbackDetailed = `Captured in style of Midjourney v6: A breathtaking commercial photograph of ${descName}. The composition features high-contrast studio spotlighting from the upper-left, casting soft, dramatic shadows. Vibrant color accents harmonizing beautifully with deep rustic undertones. Photorealistic texture rendering highlights the intricate manual craftsmanship.`;
    } else if (model === "leonardo") {
      fallbackAlt = `Highly detailed, dramatic close-up of ${descName} with vibrant ambient reflections.`;
      fallbackDetailed = `Style of Leonardo AI Creative: An ultra-high-definition rendering of ${descName} with a striking fantasy-matte finish. Features extremely intricate detailing, volumetric dust particles dancing in warm sun shafts, and rich, saturated color gradients emphasizing authentic heritage materials.`;
    } else if (model === "gpt") {
      fallbackAlt = `A professionally styled catalog photograph of ${descName}, perfect for modern e-commerce.`;
      fallbackDetailed = `Style of OpenAI GPT-4o: A high-fidelity, commercially optimized e-commerce presentation of ${descName}. Placed on a crisp, neutral studio backdrop. Clear, clean illumination ensures every product seam, texture, and natural color variation is perfectly legible for potential buyers, highlighting its superior durability and professional finish.`;
    } else if (model === "grok") {
      fallbackAlt = `Bold and direct shot of ${descName}, showcasing its authentic design and premium quality.`;
      fallbackDetailed = `Style of Grok AI: Direct, high-contrast, no-nonsense visual analysis. ${descName} sits front and center under strong, crisp focus. The design stands out immediately with bold silhouettes, showcasing raw authentic materials and rugged DZ craftsmanship built to last.`;
    } else if (model === "kling" || model === "seedance") {
      fallbackAlt = `A dynamic perspective of ${descName} with elegant depth of field.`;
      fallbackDetailed = `Style of ${model === "kling" ? "Kling Cinematic" : "Seedance Video"}: A cinematic freeze-frame showcasing ${descName} in a lifelike, dynamic setting. The background is softly blurred with a beautiful, creamy bokeh effect, emphasizing the sharp focal details of the foreground textures. Feels active, premium, and full of presence.`;
    } else {
      // Gemini (default)
      fallbackAlt = `A clean, professional photograph of ${descName}, a high-quality product in the ${cleanCat} category.`;
      fallbackDetailed = `Style of Google Gemini: An objective, accurate, and highly accessible visual description of ${descName}. The item is cleanly composed with even ambient lighting, clearly outlining its form, physical dimensions, material composition, and traditional Algerian decorative highlights.`;
    }

    setTimeout(() => {
      res.json({
        success: true,
        altText: fallbackAlt,
        detailedDescription: fallbackDetailed,
        modelUsed: `${model} (Simulated Fallback Engine)`,
        simulated: true,
      });
    }, 1000);
  });

  // --- Express Payload & Body Parsing Error Handling Middleware ---
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err && (err.type === "entity.too.large" || err.status === 413)) {
      logSecurityEvent("WARN", "PAYLOAD_TOO_LARGE", req, { message: err.message });
      return res.status(413).json({
        error: "Payload too large. Please reduce image sizes or upload smaller batches.",
      });
    }
    if (err && (err instanceof SyntaxError || err.status === 400)) {
      return res.status(400).json({ error: "Invalid JSON payload." });
    }
    next(err);
  });

  // --- Vite Dev & Prod Setup ---

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[DZ COMMERCE PLATFORM SERVER] listening on http://0.0.0.0:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Critical server failure on boot:", err);
});