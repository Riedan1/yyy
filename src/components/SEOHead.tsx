import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  structuredData?: Record<string, any>;
}

export const SEOHead = ({
  title,
  description,
  keywords,
  ogImage,
  ogUrl,
  structuredData,
}: SEOHeadProps) => {
  useEffect(() => {
    if (typeof document === "undefined") return;

    // 1. Update title
    const formattedTitle = `${title} | Yume Algerian Artisan E-Commerce`;
    document.title = formattedTitle;

    // 2. Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute("content", description);

    // 3. Update meta keywords
    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement("meta");
        metaKeywords.setAttribute("name", "keywords");
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute("content", keywords);
    }

    // 4. Update OpenGraph tags for rich social sharing (SEO key touchpoint)
    const setOgMeta = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("property", property);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    setOgMeta("og:title", formattedTitle);
    setOgMeta("og:description", description);
    setOgMeta("og:type", "website");
    if (ogImage) setOgMeta("og:image", ogImage);
    if (ogUrl) setOgMeta("og:url", ogUrl);

    // 5. Inject JSON-LD Schema.org Structured Data for Rich Snippets (Search Console Boost)
    const existingJsonLd = document.getElementById("yume-seo-jsonld");
    if (existingJsonLd) {
      existingJsonLd.remove();
    }

    const defaultSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Yume",
      "url": ogUrl || window.location.origin,
      "description": description,
    };

    const schemaToInject = structuredData || defaultSchema;

    const script = document.createElement("script");
    script.id = "yume-seo-jsonld";
    script.type = "application/ld+json";
    script.innerHTML = JSON.stringify(schemaToInject);
    document.head.appendChild(script);

    return () => {
      // Cleanup on unmount (avoid polluting head for other views)
      const scriptToRemove = document.getElementById("yume-seo-jsonld");
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [title, description, keywords, ogImage, ogUrl, structuredData]);

  return null; // Side-effect only component
};
