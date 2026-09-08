import { MerchantStore, Product } from "../types";

export interface FuzzySearchResult {
  type: "store" | "product";
  score: number; // Higher is better
  store: MerchantStore;
  product?: Product;
}

export function performFuzzySearch(
  stores: MerchantStore[],
  query: string
): FuzzySearchResult[] {
  if (!query || !query.trim()) return [];

  const cleanQuery = query.toLowerCase().trim();
  const tokens = cleanQuery.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];

  const results: FuzzySearchResult[] = [];

  // Evaluate each store
  stores.forEach((store) => {
    let storeScore = 0;
    const nameLow = store.name.toLowerCase();
    const descLow = store.description.toLowerCase();
    const bioLow = store.bio.toLowerCase();
    const wilayaLow = store.wilaya.toLowerCase();
    const addressLow = store.address.toLowerCase();

    // Exact full query matches
    if (nameLow === cleanQuery) storeScore += 400;
    else if (nameLow.includes(cleanQuery)) storeScore += 220;

    if (descLow.includes(cleanQuery)) storeScore += 100;
    if (bioLow.includes(cleanQuery)) storeScore += 80;
    if (wilayaLow.includes(cleanQuery)) storeScore += 60;
    if (addressLow.includes(cleanQuery)) storeScore += 40;

    // Token-based matches
    tokens.forEach((token) => {
      if (nameLow.includes(token)) storeScore += 60;
      if (descLow.includes(token)) storeScore += 30;
      if (bioLow.includes(token)) storeScore += 20;
      if (wilayaLow.includes(token)) storeScore += 30;
      if (addressLow.includes(token)) storeScore += 10;

      // Fuzzy spelling check on store name words
      const nameWords = nameLow.split(/\s+/).filter(Boolean);
      nameWords.forEach((word) => {
        if (word && getEditDistanceCheck(token, word)) {
          storeScore += 30;
        }
      });
    });

    if (storeScore > 0) {
      results.push({
        type: "store",
        score: storeScore,
        store,
      });
    }

    // Evaluate products of this store
    store.products.forEach((product) => {
      let prodScore = 0;
      const prodNameLow = product.name.toLowerCase();
      const descFrLow = (product.description_fr || "").toLowerCase();
      const descEnLow = (product.description_en || "").toLowerCase();
      const descArLow = (product.description_ar || "").toLowerCase();
      const catLow = product.category.toLowerCase();
      const tagsLow = (product.tags || []).map((t) => t.toLowerCase());

      // Exact full query matches
      if (prodNameLow === cleanQuery) prodScore += 450;
      else if (prodNameLow.includes(cleanQuery)) prodScore += 250;

      // Product descriptions check (simultaneously checking French, English, and Arabic descriptions)
      if (descFrLow.includes(cleanQuery)) prodScore += 150;
      if (descEnLow.includes(cleanQuery)) prodScore += 130;
      if (descArLow.includes(cleanQuery)) prodScore += 135;
      if (catLow.includes(cleanQuery)) prodScore += 80;

      // Dynamic tags
      tagsLow.forEach((tag) => {
        if (tag === cleanQuery) prodScore += 180;
        else if (tag.includes(cleanQuery)) prodScore += 90;
      });

      // Token-based matches
      tokens.forEach((token) => {
        if (prodNameLow.includes(token)) prodScore += 70;
        if (descFrLow.includes(token)) prodScore += 40;
        if (descEnLow.includes(token)) prodScore += 35;
        if (descArLow.includes(token)) prodScore += 35;
        if (catLow.includes(token)) prodScore += 20;

        tagsLow.forEach((tag) => {
          if (tag.includes(token)) prodScore += 40;
        });

        // Tolerant fuzzy spelling check on product name words
        const prodWords = prodNameLow.split(/\s+/).filter(Boolean);
        prodWords.forEach((word) => {
          if (word && getEditDistanceCheck(token, word)) {
            prodScore += 35;
          }
        });
      });

      // Boost slightly based on overall product ratings
      if (prodScore > 0) {
        if (product.rating) {
          prodScore += product.rating * 3;
        }
        results.push({
          type: "product",
          score: prodScore,
          store,
          product,
        });
      }
    });
  });

  // Sort by final score in descending order
  return results.sort((a, b) => b.score - a.score);
}

// Simple Levenshtein-based spelling check helper for fuzzy matches
function getEditDistanceCheck(s1: string, s2: string): boolean {
  if (Math.abs(s1.length - s2.length) > 2) return false;
  if (s1.length < 3 || s2.length < 3) return false;

  const m = s1.length;
  const n = s2.length;
  const d: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) d[i][0] = i;
  for (let j = 0; j <= n; j++) d[0][j] = j;

  for (let j = 1; j <= n; j++) {
    for (let i = 1; i <= m; i++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1, // deletion
        d[i][j - 1] + 1, // insertion
        d[i - 1][j - 1] + cost // substitution
      );
    }
  }

  const distance = d[m][n];
  const maxLength = Math.max(s1.length, s2.length);
  // Allow 1 substitution/deletion if length < 6, allow up to 2 errors for length >= 6
  const allowedErrors = maxLength >= 6 ? 2 : 1;
  return distance <= allowedErrors;
}
