import React, { useState, useMemo } from "react";
import { 
  Sparkles, 
  Layers, 
  Share2, 
  Plus, 
  Sliders, 
  BarChart3, 
  Link2, 
  ExternalLink, 
  Eye, 
  Edit3, 
  CheckCircle2, 
  TrendingUp, 
  Copy, 
  Clock, 
  ShieldCheck, 
  ChevronDown,
  ArrowLeft,
  Search,
  Filter,
  Users,
  ShoppingCart,
  DollarSign,
  Play,
  Pause,
  ArrowUpRight,
  Trash2,
  AlertTriangle,
  FileText,
  Tag,
  Check,
  X,
  RefreshCw,
  Globe,
  LayoutGrid,
  List
} from "lucide-react";
import { Product } from "../../types";
import { GrowthCampaign, GrowthLandingPage } from "../../types/growthStudio";
import { INITIAL_GROWTH_CAMPAIGNS } from "./mockCampaignsData";
import { CampaignFlowVisualization } from "./CampaignFlowVisualization";
import { TrafficDistributionManager } from "./TrafficDistributionManager";
import { LandingPageBuilder } from "./LandingPageBuilder";
import { AiLandingPageGeneratorModal } from "./AiLandingPageGeneratorModal";
import { CampaignAnalyticsDashboard } from "./CampaignAnalyticsDashboard";
import { CreateCampaignModal } from "./CreateCampaignModal";
import { CreateLandingPageWizardModal } from "./CreateLandingPageWizardModal";
import { SmartLinkModal } from "./SmartLinkModal";
import { PublicGrowthLandingPage } from "./PublicGrowthLandingPage";
import { TemplatesComparisonGallery } from "./TemplatesComparisonGallery";
import { GROWTH_TEMPLATES_CATALOG, GrowthTemplateDefinition } from "../../data/growthStudioPdfData";

interface GrowthStudioDashboardProps {
  storeProducts?: Product[];
}

export const GrowthStudioDashboard: React.FC<GrowthStudioDashboardProps> = ({
  storeProducts = []
}) => {
  const [campaigns, setCampaigns] = useState<GrowthCampaign[]>(() => {
    const saved = localStorage.getItem("yomi_growth_campaigns");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved growth campaigns", e);
      }
    }
    return INITIAL_GROWTH_CAMPAIGNS;
  });

  // Top-level View Mode: "landing_pages" (direct pages table/cards), "campaigns" (executive dashboard), or "templates" (catalog)
  const [topTab, setTopTab] = useState<"landing_pages" | "campaigns" | "templates">("landing_pages");
  const [landingPageViewMode, setLandingPageViewMode] = useState<"grid" | "table">("grid");
  const [viewMode, setViewMode] = useState<"campaigns_list" | "campaign_detail">("campaigns_list");
  const [activeCampaignId, setActiveCampaignId] = useState<string>(campaigns[0]?.id || "");
  const [activeTab, setActiveTab] = useState<"flow" | "distribution" | "pages" | "analytics">("flow");

  // Filters for lists
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "draft" | "paused">("all");

  // Modals & Builders
  const [editingLandingPage, setEditingLandingPage] = useState<GrowthLandingPage | null>(null);
  const [showAiModal, setShowAiModal] = useState(false);
  const [showCreateWizardModal, setShowCreateWizardModal] = useState(false);
  const [showCreateCampaignModal, setShowCreateCampaignModal] = useState(false);
  const [showSmartLinkModal, setShowSmartLinkModal] = useState(false);
  const [previewTestPage, setPreviewTestPage] = useState<GrowthLandingPage | null>(null);

  // Confirmation dialog states
  const [pageToDelete, setPageToDelete] = useState<{ campaignId: string; page: GrowthLandingPage } | null>(null);
  const [pageToTogglePublish, setPageToTogglePublish] = useState<{ campaignId: string; page: GrowthLandingPage } | null>(null);

  const activeCampaign = campaigns.find((c) => c.id === activeCampaignId) || campaigns[0];

  // Save changes
  const updateActiveCampaign = (updated: GrowthCampaign) => {
    const updatedList = campaigns.map((c) => (c.id === updated.id ? updated : c));
    setCampaigns(updatedList);
    try {
      localStorage.setItem("yomi_growth_campaigns", JSON.stringify(updatedList));
    } catch (e) {
      console.warn("Could not write to localStorage", e);
    }
  };

  // Toggle campaign status (Running / Paused)
  const toggleCampaignStatus = (campaignId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedList = campaigns.map((c) => {
      if (c.id === campaignId) {
        return {
          ...c,
          status: c.status === "active" ? ("paused" as const) : ("active" as const),
          updatedAt: new Date().toISOString()
        };
      }
      return c;
    });
    setCampaigns(updatedList);
    try {
      localStorage.setItem("yomi_growth_campaigns", JSON.stringify(updatedList));
    } catch (err) {
      console.warn("Could not write to localStorage", err);
    }
  };

  // Handle new page created via Wizard
  const handleWizardComplete = (newPage: GrowthLandingPage, selectedProduct: Product, method: "template" | "manual" | "ai") => {
    // Check if campaign already exists for this product or create new campaign
    let targetCampaign = campaigns.find((c) => c.product.id === selectedProduct.id);
    let updatedCampaigns: GrowthCampaign[];

    if (targetCampaign) {
      const updatedLps = [newPage, ...targetCampaign.landingPages];
      const updatedCamp: GrowthCampaign = {
        ...targetCampaign,
        landingPages: updatedLps,
        updatedAt: new Date().toISOString()
      };
      updatedCampaigns = campaigns.map((c) => c.id === targetCampaign!.id ? updatedCamp : c);
      setActiveCampaignId(targetCampaign.id);
    } else {
      const newCamp: GrowthCampaign = {
        id: `camp-${Date.now()}`,
        storeId: "store-1",
        name: `${selectedProduct.name} Campaign`,
        product: {
          id: selectedProduct.id,
          name: selectedProduct.name,
          price: selectedProduct.price,
          imageUrl: selectedProduct.imageUrl,
          category: selectedProduct.category,
          description: selectedProduct.description
        },
        offer: "Special Promotional Offer: Cash on Delivery Nationwide",
        trafficSources: ["Instagram", "TikTok", "Facebook"],
        goal: "purchases",
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        distributionMode: "smart",
        distributionRationale: "Initial launch allocation with 100% test distribution.",
        smartLinkSlug: selectedProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        settings: {
          confidenceThreshold: 150,
          autoOptimize: true,
          pixelTracking: true
        },
        landingPages: [newPage]
      };
      updatedCampaigns = [newCamp, ...campaigns];
      setActiveCampaignId(newCamp.id);
    }

    setCampaigns(updatedCampaigns);
    try {
      localStorage.setItem("yomi_growth_campaigns", JSON.stringify(updatedCampaigns));
    } catch (e) {
      console.warn("Could not write to localStorage", e);
    }

    setShowCreateWizardModal(false);
    setEditingLandingPage(newPage);
  };

  // Duplicate Landing Page
  const handleDuplicateLandingPage = (campaignId: string, page: GrowthLandingPage, e: React.MouseEvent) => {
    e.stopPropagation();
    const duplicated: GrowthLandingPage = {
      ...page,
      id: `lp-${Date.now()}`,
      name: `${page.name} (Copy)`,
      metrics: {
        visitors: 0,
        uniqueVisitors: 0,
        sessions: 0,
        pageViews: 0,
        addToCart: 0,
        checkoutStarted: 0,
        conversions: 0,
        revenue: 0,
        averageOrderValue: page.metrics.averageOrderValue
      }
    };

    const updatedList = campaigns.map((camp) => {
      if (camp.id === campaignId) {
        return {
          ...camp,
          landingPages: [...camp.landingPages, duplicated],
          updatedAt: new Date().toISOString()
        };
      }
      return camp;
    });

    setCampaigns(updatedList);
    try {
      localStorage.setItem("yomi_growth_campaigns", JSON.stringify(updatedList));
    } catch (err) {
      console.warn("Could not write to localStorage", err);
    }
  };

  // Delete Landing Page
  const confirmDeleteLandingPage = () => {
    if (!pageToDelete) return;
    const { campaignId, page } = pageToDelete;

    const updatedList = campaigns.map((camp) => {
      if (camp.id === campaignId) {
        return {
          ...camp,
          landingPages: camp.landingPages.filter((p) => p.id !== page.id),
          updatedAt: new Date().toISOString()
        };
      }
      return camp;
    });

    setCampaigns(updatedList);
    try {
      localStorage.setItem("yomi_growth_campaigns", JSON.stringify(updatedList));
    } catch (err) {
      console.warn("Could not write to localStorage", err);
    }
    setPageToDelete(null);
  };

  // Toggle Publish / Unpublish Landing Page
  const confirmTogglePublish = () => {
    if (!pageToTogglePublish) return;
    const { campaignId, page } = pageToTogglePublish;
    const nextStatus = page.status === "active" ? "paused" : "active";

    const updatedList = campaigns.map((camp) => {
      if (camp.id === campaignId) {
        return {
          ...camp,
          landingPages: camp.landingPages.map((p) => p.id === page.id ? { ...p, status: nextStatus } : p),
          updatedAt: new Date().toISOString()
        };
      }
      return camp;
    });

    setCampaigns(updatedList);
    try {
      localStorage.setItem("yomi_growth_campaigns", JSON.stringify(updatedList));
    } catch (err) {
      console.warn("Could not write to localStorage", err);
    }
    setPageToTogglePublish(null);
  };

  // Direct Apply template from Blueprint Catalog
  const handleApplyTemplateFromGallery = (template: GrowthTemplateDefinition) => {
    const defaultProd = storeProducts[0] || {
      id: `prod-${Date.now()}`,
      name: template.targetCategory.includes("Trading") ? "كتاب خطواتك الأولى للربح في التداول" : "Featured Merchant Product",
      price: 4900,
      buyPrice: 6500,
      stock: 45,
      category: template.targetCategory,
      imageUrl: template.suggestedSections[0]?.imageUrl || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80"
    };

    const targetCampaign = campaigns.find(c => c.id === activeCampaignId) || campaigns[0];
    const newPage: GrowthLandingPage = {
      id: `lp-${Date.now()}`,
      campaignId: targetCampaign?.id || "default-camp",
      name: `${defaultProd.name} (${template.name})`,
      status: "active",
      strategyFocus: template.strategyFocus,
      trafficAllocation: 50,
      language: "ar",
      currency: "DA",
      market: "Algeria",
      theme: {
        primaryColor: template.suggestedTheme?.primaryColor || "#0A1F44",
        accentColor: template.suggestedTheme?.accentColor || "#E2A26C",
        backgroundColor: template.suggestedTheme?.backgroundColor || "#070F1E",
        backgroundGradient: template.suggestedTheme?.backgroundGradient || "linear-gradient(180deg, #070F1E 0%, #0A1F44 45%, #08152B 100%)",
        cardBackgroundColor: template.suggestedTheme?.cardBackgroundColor || "#0E1C36",
        textColor: template.suggestedTheme?.textColor || "#F4F6F8",
        fontFamily: "'Cairo', sans-serif",
        buttonStyle: template.suggestedTheme?.buttonStyle || "pill",
        badgeText: template.badge || "عرض حصري موثوق"
      },
      sections: template.suggestedSections.map((s, idx) => ({
        ...s,
        id: `sec-${Date.now()}-${idx}`,
        price: defaultProd.price,
        originalPrice: defaultProd.buyPrice || Math.round(defaultProd.price * 1.3)
      })),
      metrics: {
        visitors: 0,
        uniqueVisitors: 0,
        sessions: 0,
        pageViews: 0,
        addToCart: 0,
        checkoutStarted: 0,
        conversions: 0,
        revenue: 0,
        averageOrderValue: defaultProd.price
      },
      sourceBreakdown: {},
      deviceBreakdown: {
        mobile: { visitors: 0, conversions: 0, revenue: 0 },
        desktop: { visitors: 0, conversions: 0, revenue: 0 },
        tablet: { visitors: 0, conversions: 0, revenue: 0 }
      }
    };

    const updated = campaigns.map((camp) => {
      if (camp.id === targetCampaign?.id) {
        return {
          ...camp,
          landingPages: [newPage, ...camp.landingPages],
          updatedAt: new Date().toISOString()
        };
      }
      return camp;
    });

    setCampaigns(updated);
    try {
      localStorage.setItem("yomi_growth_campaigns", JSON.stringify(updated));
    } catch (e) {
      console.warn("Could not save to localStorage", e);
    }

    setTopTab("landing_pages");
    setEditingLandingPage(newPage);
  };

  // Preview template from Blueprint Catalog
  const handlePreviewTemplateFromGallery = (template: GrowthTemplateDefinition) => {
    const dummyPage: GrowthLandingPage = {
      id: `lp-preview-${template.id}`,
      campaignId: activeCampaignId || "camp-preview",
      name: `${template.name} Preview`,
      status: "active",
      strategyFocus: template.strategyFocus,
      trafficAllocation: 100,
      language: "ar",
      currency: "DA",
      market: "Algeria",
      theme: {
        primaryColor: template.suggestedTheme?.primaryColor || "#0A1F44",
        accentColor: template.suggestedTheme?.accentColor || "#E2A26C",
        backgroundColor: template.suggestedTheme?.backgroundColor || "#070F1E",
        backgroundGradient: template.suggestedTheme?.backgroundGradient || "linear-gradient(180deg, #070F1E 0%, #0A1F44 45%, #08152B 100%)",
        cardBackgroundColor: template.suggestedTheme?.cardBackgroundColor || "#0E1C36",
        textColor: template.suggestedTheme?.textColor || "#F4F6F8",
        fontFamily: "'Cairo', sans-serif",
        buttonStyle: template.suggestedTheme?.buttonStyle || "pill",
        badgeText: template.badge || "Verified Preview"
      },
      sections: template.suggestedSections.map((s, idx) => ({
        ...s,
        id: `preview-sec-${idx}`
      })),
      metrics: {
        visitors: 1240,
        uniqueVisitors: 980,
        sessions: 1400,
        pageViews: 2100,
        addToCart: 310,
        checkoutStarted: 220,
        conversions: 86,
        revenue: 421400,
        averageOrderValue: 4900
      },
      sourceBreakdown: {},
      deviceBreakdown: {
        mobile: { visitors: 1100, conversions: 78, revenue: 382200 },
        desktop: { visitors: 140, conversions: 8, revenue: 39200 },
        tablet: { visitors: 0, conversions: 0, revenue: 0 }
      }
    };
    setPreviewTestPage(dummyPage);
  };

  // Aggregated Executive Metrics across ALL campaigns
  const executiveMetrics = useMemo(() => {
    let totalLps = 0;
    let totalVisitors = 0;
    let totalConversions = 0;
    let totalRevenue = 0;
    let activeCount = 0;

    campaigns.forEach((c) => {
      if (c.status === "active") activeCount++;
      c.landingPages.forEach((lp) => {
        totalLps++;
        totalVisitors += lp.metrics.visitors;
        totalConversions += lp.metrics.conversions;
        totalRevenue += lp.metrics.revenue;
      });
    });

    const overallConversionRate = totalVisitors > 0 ? (totalConversions / totalVisitors) * 100 : 0;

    return {
      activeCampaigns: activeCount,
      totalLandingPages: totalLps,
      uniqueVisitors: totalVisitors,
      totalConversions,
      overallConversionRate,
      revenueGenerated: totalRevenue
    };
  }, [campaigns]);

  // Flatten all landing pages across campaigns for the unified Landing Pages table
  const allLandingPagesList = useMemo(() => {
    const list: Array<{
      campaignId: string;
      campaignName: string;
      product: GrowthCampaign["product"];
      page: GrowthLandingPage;
    }> = [];

    campaigns.forEach((c) => {
      c.landingPages.forEach((lp) => {
        list.push({
          campaignId: c.id,
          campaignName: c.name,
          product: c.product,
          page: lp
        });
      });
    });

    return list.filter((item) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = item.page.name.toLowerCase().includes(query) ||
        item.product.name.toLowerCase().includes(query) ||
        item.campaignName.toLowerCase().includes(query);
      
      const matchesStatus = statusFilter === "all" ? true :
        statusFilter === "active" ? item.page.status === "active" :
        statusFilter === "draft" ? item.page.status === "paused" :
        item.page.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [campaigns, searchQuery, statusFilter]);

  // Active customer preview simulation mode
  if (previewTestPage && activeCampaign) {
    return (
      <div className="relative">
        <div className="sticky top-0 z-50 bg-slate-900 text-white px-4 py-2 flex items-center justify-between text-xs font-bold border-b border-slate-700">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Customer Live Preview: {previewTestPage.name}</span>
            <span className="text-slate-400 font-mono text-[11px]">({activeCampaign.name})</span>
          </div>
          <button
            type="button"
            onClick={() => setPreviewTestPage(null)}
            className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            Exit Preview
          </button>
        </div>
        <PublicGrowthLandingPage
          campaign={activeCampaign}
          landingPage={previewTestPage}
          onOrderSuccess={() => {}}
          onBackToStore={() => setPreviewTestPage(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      
      {/* Top Main Title & Navigation Header */}
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800 shrink-0">
              <TrendingUp className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Growth Landing Pages
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Create conversion-optimized landing pages for advertising campaigns, product launches, and social-commerce traffic.
              </p>
            </div>
          </div>
        </div>

        {/* Primary Action: Create Landing Page */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            id="growth-create-landing-page-btn"
            onClick={() => setShowCreateWizardModal(true)}
            className="w-full sm:w-auto justify-center px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md hover:shadow-indigo-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Landing Page</span>
          </button>
        </div>
      </div>

      {/* Top Level Mode Tabs: Landing Pages vs Campaigns */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none w-full md:w-auto">
          <button
            type="button"
            onClick={() => {
              setTopTab("landing_pages");
              setViewMode("campaigns_list");
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              topTab === "landing_pages"
                ? "bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800 shadow-2xs font-black"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Landing Pages ({allLandingPagesList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setTopTab("campaigns");
              setViewMode("campaigns_list");
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              topTab === "campaigns"
                ? "bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800 shadow-2xs font-black"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>Campaigns & Smart Links ({campaigns.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setTopTab("templates");
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              topTab === "templates"
                ? "bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800 shadow-2xs font-black"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Templates Catalog ({GROWTH_TEMPLATES_CATALOG.length})</span>
          </button>
        </div>

        {/* Search, Status Filters & View Mode Switch */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap w-full md:w-auto justify-between sm:justify-end">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-48"
            />
          </div>

          <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold shrink-0">
            {(["all", "active", "draft"] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg transition-all capitalize cursor-pointer ${
                  statusFilter === st
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {st === "active" ? "Published" : st === "draft" ? "Draft" : "All"}
              </button>
            ))}
          </div>

          {/* Grid vs Table Toggle for Landing Pages */}
          {topTab === "landing_pages" && (
            <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold shrink-0">
              <button
                type="button"
                onClick={() => setLandingPageViewMode("grid")}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  landingPageViewMode === "grid"
                    ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                    : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
                title="Product Cards Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setLandingPageViewMode("table")}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  landingPageViewMode === "table"
                    ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                    : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
                title="Table View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: UNIFIED LANDING PAGES TABLE (REQUIREMENT 2: MAIN INTERFACE)       */}
      {/* ========================================================================= */}
      {topTab === "landing_pages" && (
        <div className="space-y-4">
          {allLandingPagesList.length === 0 ? (
            /* EMPTY STATE */
            <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-4 shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                <Layers className="w-7 h-7" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  No Landing Pages Found
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {searchQuery || statusFilter !== "all"
                    ? "No landing pages match your search criteria. Try resetting filters."
                    : "Create your first high-converting landing page to start driving ad traffic."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateWizardModal(true)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Landing Page</span>
              </button>
            </div>
          ) : landingPageViewMode === "grid" ? (
            /* ========================================================= */
            /* RESPONSIVE PRODUCT CARD LISTING AREA (GRID VIEW)          */
            /* ========================================================= */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {allLandingPagesList.map((item) => {
                const isPublished = item.page.status === "active";
                const cvr = item.page.metrics.visitors > 0
                  ? ((item.page.metrics.conversions / item.page.metrics.visitors) * 100).toFixed(1)
                  : "0.0";

                return (
                  <div 
                    key={item.page.id}
                    className="rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
                  >
                    {/* Top: Product Media Banner with Status & Strategy Overlay */}
                    <div>
                      <div className="relative h-44 sm:h-48 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden group">
                        <img 
                          src={item.product.imageUrl} 
                          alt={item.product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent pointer-events-none" />

                        {/* Top Floating Badges */}
                        <div className="absolute top-2.5 inset-x-2.5 sm:top-3 sm:inset-x-3 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => setPageToTogglePublish({ campaignId: item.campaignId, page: item.page })}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-md shadow-xs transition-transform active:scale-95 cursor-pointer ${
                              isPublished
                                ? "bg-emerald-500/90 text-white"
                                : "bg-slate-900/80 text-slate-300 border border-white/20"
                            }`}
                            title={isPublished ? "Click to unpublish" : "Click to publish"}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? "bg-white animate-pulse" : "bg-slate-400"}`} />
                            <span>{isPublished ? "Published" : "Draft"}</span>
                          </button>

                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-600/90 text-white backdrop-blur-md capitalize">
                            {item.page.strategyFocus.replace("_", " ")}
                          </span>
                        </div>

                        {/* Bottom Floating Price & Campaign Details */}
                        <div className="absolute bottom-2.5 inset-x-2.5 sm:bottom-3 sm:inset-x-3 flex items-end justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-mono font-medium text-slate-300 block truncate">
                              {item.campaignName}
                            </span>
                            <span className="text-sm sm:text-base font-black font-mono text-white">
                              {item.product.price.toLocaleString()} {item.page.currency || "DA"}
                            </span>
                          </div>

                          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-black/60 text-slate-200 border border-white/10 backdrop-blur-xs shrink-0">
                            {item.page.sections.length} Sections
                          </span>
                        </div>
                      </div>

                      {/* Middle: Page & Product Title */}
                      <div className="p-4 sm:p-5 space-y-3">
                        <div>
                          <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-snug line-clamp-1">
                            {item.page.name}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                            Product: {item.product.name}
                          </p>
                        </div>

                        {/* Performance Metrics Summary */}
                        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 p-2 sm:p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 text-left font-mono">
                          <div className="min-w-0">
                            <span className="text-[9px] sm:text-[10px] text-slate-400 block font-sans font-medium truncate">Visitors</span>
                            <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block truncate">
                              {item.page.metrics.visitors.toLocaleString()}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <span className="text-[9px] sm:text-[10px] text-slate-400 block font-sans font-medium truncate">Orders</span>
                            <span className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 block truncate">
                              {item.page.metrics.conversions}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <span className="text-[9px] sm:text-[10px] text-slate-400 block font-sans font-medium truncate">CVR</span>
                            <span className="text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 block truncate">
                              {cvr}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom: Action Buttons */}
                    <div className="p-4 pt-0 sm:p-5 sm:pt-0">
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1.5 sm:gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingLandingPage(item.page)}
                          className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px]"
                        >
                          <Edit3 className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">Edit Page</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setActiveCampaignId(item.campaignId);
                            setPreviewTestPage(item.page);
                          }}
                          className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center shrink-0"
                          title="Preview Live Page"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleDuplicateLandingPage(item.campaignId, item.page, e)}
                          className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center shrink-0"
                          title="Duplicate Page"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setPageToDelete({ campaignId: item.campaignId, page: item.page })}
                          className="p-2 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center shrink-0"
                          title="Delete Page"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* ========================================================= */
            /* TABULAR VIEW (DESKTOP / ADVANCED TABLE)                   */
            /* ========================================================= */
            <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3.5 px-5">Landing Page</th>
                      <th className="py-3.5 px-4">Associated Product</th>
                      <th className="py-3.5 px-4">Template & Focus</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Performance</th>
                      <th className="py-3.5 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {allLandingPagesList.map((item) => {
                      const isPublished = item.page.status === "active";
                      const cvr = item.page.metrics.visitors > 0
                        ? ((item.page.metrics.conversions / item.page.metrics.visitors) * 100).toFixed(1)
                        : "0.0";

                      return (
                        <tr key={item.page.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-850/40 transition-colors">
                          {/* Page Name */}
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                                <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                              </div>
                              <div className="min-w-0">
                                <span className="font-bold text-slate-900 dark:text-white block truncate">
                                  {item.page.name}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono block">
                                  Campaign: {item.campaignName}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Associated Product */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <img 
                                src={item.product.imageUrl} 
                                alt={item.product.name}
                                className="w-8 h-8 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                                referrerPolicy="no-referrer"
                              />
                              <div className="min-w-0">
                                <span className="font-bold text-slate-700 dark:text-slate-300 block truncate max-w-xs">
                                  {item.product.name}
                                </span>
                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                                  {item.product.price.toLocaleString()} {item.page.currency || "DA"}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Selected Template & Strategy */}
                          <td className="py-4 px-4">
                            <div className="space-y-1">
                              <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800 capitalize">
                                {item.page.strategyFocus.replace("_", " ")}
                              </span>
                              <span className="text-[10px] text-slate-400 block font-mono">
                                {item.page.sections.length} Sections
                              </span>
                            </div>
                          </td>

                          {/* Status: Draft or Published */}
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                              isPublished
                                ? "bg-emerald-50 dark:bg-emerald-950/70 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
                                : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500"
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                              <span>{isPublished ? "Published" : "Draft"}</span>
                            </span>
                          </td>

                          {/* Performance Metrics */}
                          <td className="py-4 px-4">
                            <div className="space-y-0.5 font-mono">
                              <span className="text-slate-900 dark:text-white font-bold block">
                                {item.page.metrics.conversions} orders ({cvr}%)
                              </span>
                              <span className="text-[10px] text-slate-400 block">
                                {item.page.metrics.visitors.toLocaleString()} visitors
                              </span>
                            </div>
                          </td>

                          {/* Actions: Edit, Preview, Duplicate, Publish/Unpublish, Delete */}
                          <td className="py-4 px-5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Edit */}
                              <button
                                type="button"
                                onClick={() => setEditingLandingPage(item.page)}
                                className="p-1.5 rounded-lg text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors cursor-pointer"
                                title="Edit in Visual Builder"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

                              {/* Preview */}
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveCampaignId(item.campaignId);
                                  setPreviewTestPage(item.page);
                                }}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                title="Live Preview"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              {/* Duplicate */}
                              <button
                                type="button"
                                onClick={(e) => handleDuplicateLandingPage(item.campaignId, item.page, e)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                title="Duplicate Page"
                              >
                                <Copy className="w-4 h-4" />
                              </button>

                              {/* Publish / Unpublish */}
                              <button
                                type="button"
                                onClick={() => setPageToTogglePublish({ campaignId: item.campaignId, page: item.page })}
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                  isPublished
                                    ? "text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                                    : "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                                }`}
                                title={isPublished ? "Unpublish Page" : "Publish Page"}
                              >
                                {isPublished ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                              </button>

                              {/* Delete */}
                              <button
                                type="button"
                                onClick={() => setPageToDelete({ campaignId: item.campaignId, page: item.page })}
                                className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                                title="Delete Page"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: CAMPAIGNS & TRAFFIC DISTRIBUTION VIEW                             */}
      {/* ========================================================================= */}
      {topTab === "campaigns" && viewMode === "campaigns_list" && (
        <div className="space-y-6">
          {/* Top Executive Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-4">
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1.5 min-w-0">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider truncate">Active Campaigns</span>
                <Play className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white truncate">
                {executiveMetrics.activeCampaigns}
              </div>
              <span className="text-[10px] text-slate-400 block font-normal truncate">
                {campaigns.length} total campaigns
              </span>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1.5 min-w-0">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider truncate">Landing Pages</span>
                <Layers className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white truncate">
                {executiveMetrics.totalLandingPages}
              </div>
              <span className="text-[10px] text-slate-400 block font-normal truncate">
                Across all ad campaigns
              </span>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1.5 min-w-0">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider truncate">Unique Visitors</span>
                <Users className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white truncate">
                {executiveMetrics.uniqueVisitors.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-400 block font-normal truncate">
                Total inbound ad traffic
              </span>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1.5 min-w-0">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider truncate">Conversions</span>
                <ShoppingCart className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 truncate">
                {executiveMetrics.totalConversions.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-400 block font-normal truncate">
                Confirmed COD orders
              </span>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1.5 min-w-0">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider truncate">Conversion Rate</span>
                <TrendingUp className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white truncate">
                {executiveMetrics.overallConversionRate.toFixed(1)}%
              </div>
              <span className="text-[10px] text-slate-400 block font-normal truncate">
                Overall funnel yield
              </span>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1.5 min-w-0">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider truncate">Revenue</span>
                <DollarSign className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white truncate">
                {executiveMetrics.revenueGenerated.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-400 block font-normal truncate">
                Total gross sales ({activeCampaign?.landingPages?.[0]?.currency || "DA"})
              </span>
            </div>
          </div>

          {/* Campaigns Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {campaigns.map((camp) => {
              const campVisitors = camp.landingPages.reduce((acc, lp) => acc + lp.metrics.visitors, 0);
              const campConversions = camp.landingPages.reduce((acc, lp) => acc + lp.metrics.conversions, 0);
              const campRevenue = camp.landingPages.reduce((acc, lp) => acc + lp.metrics.revenue, 0);
              const campCvr = campVisitors > 0 ? ((campConversions / campVisitors) * 100).toFixed(1) : "0.0";
              const isRunning = camp.status === "active";

              return (
                <div
                  key={camp.id}
                  className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 mb-2">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                            {camp.name}
                          </h3>
                          <button
                            type="button"
                            onClick={(e) => toggleCampaignStatus(camp.id, e)}
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer shrink-0 ${
                              isRunning
                                ? "bg-emerald-50 dark:bg-emerald-950/70 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
                                : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500"
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                            <span>{isRunning ? "Running" : "Paused"}</span>
                          </button>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          Product: <strong>{camp.product.name}</strong> • {camp.landingPages.length} Landing Pages
                        </p>
                      </div>

                      <span className="px-2.5 py-1 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-500 shrink-0 w-fit">
                        {camp.trafficSources.slice(0, 3).join(", ")}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-left">
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850/80 border border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-medium">Visitors</span>
                        <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                          {campVisitors.toLocaleString()}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850/80 border border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-medium">Orders</span>
                        <span className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">
                          {campConversions}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850/80 border border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-medium">CVR</span>
                        <span className="text-sm font-bold font-mono text-indigo-600 dark:text-indigo-400">
                          {campCvr}%
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850/80 border border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-medium">Revenue</span>
                        <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                          {campRevenue.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">{camp.landingPages?.[0]?.currency || "DA"}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveCampaignId(camp.id);
                        setShowSmartLinkModal(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Link2 className="w-3.5 h-3.5" />
                      <span>Smart Link</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveCampaignId(camp.id);
                        setViewMode("campaign_detail");
                      }}
                      className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Manage Flow</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: DETAILED CAMPAIGN WORKSPACE (FLOW, DISTRIBUTION, ANALYTICS)      */}
      {/* ========================================================================= */}
      {topTab === "campaigns" && viewMode === "campaign_detail" && activeCampaign && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setViewMode("campaigns_list")}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer mb-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>All Campaigns</span>
                </button>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  {activeCampaign.name}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowSmartLinkModal(true)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Link2 className="w-3.5 h-3.5" />
                  <span>Smart Link & QR</span>
                </button>
              </div>
            </div>

            {/* Subtabs Bar */}
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto">
              {[
                { id: "flow", label: "Campaign Flow", icon: <Share2 className="w-3.5 h-3.5" /> },
                { id: "distribution", label: "Traffic Distribution", icon: <Sliders className="w-3.5 h-3.5" /> },
                { id: "analytics", label: "Analytics & Performance", icon: <BarChart3 className="w-3.5 h-3.5" /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    activeTab === tab.id
                      ? "bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800 shadow-2xs font-black"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {activeTab === "flow" && (
            <CampaignFlowVisualization 
              campaign={activeCampaign}
              onOpenSmartLink={() => setShowSmartLinkModal(true)}
              onSelectLandingPage={(lpId) => {
                const target = activeCampaign.landingPages.find((p) => p.id === lpId);
                if (target) setEditingLandingPage(target);
              }}
            />
          )}

          {activeTab === "distribution" && (
            <TrafficDistributionManager
              campaign={activeCampaign}
              onUpdateDistribution={(mode, allocations, rationale) => {
                const updatedLps = activeCampaign.landingPages.map((lp) => ({
                  ...lp,
                  trafficAllocation: allocations[lp.id] ?? lp.trafficAllocation
                }));
                updateActiveCampaign({
                  ...activeCampaign,
                  distributionMode: mode,
                  distributionRationale: rationale || activeCampaign.distributionRationale,
                  landingPages: updatedLps,
                  updatedAt: new Date().toISOString()
                });
              }}
            />
          )}

          {activeTab === "analytics" && (
            <CampaignAnalyticsDashboard
              campaign={activeCampaign}
              onNavigateToDistribution={() => setActiveTab("distribution")}
            />
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 4: 11 ARCHETYPE BLUEPRINT CATALOG GALLERY                            */}
      {/* ========================================================================= */}
      {topTab === "templates" && (
        <div className="space-y-6">
          <TemplatesComparisonGallery
            onApplyTemplate={handleApplyTemplateFromGallery}
            onPreviewTemplate={handlePreviewTemplateFromGallery}
          />
        </div>
      )}

      {/* CREATE LANDING PAGE WIZARD MODAL (STEP A -> E) */}
      {showCreateWizardModal && (
        <CreateLandingPageWizardModal
          storeProducts={storeProducts}
          onComplete={handleWizardComplete}
          onClose={() => setShowCreateWizardModal(false)}
        />
      )}

      {/* LANDING PAGE BUILDER FULLSCREEN MODAL */}
      {editingLandingPage && (
        <LandingPageBuilder
          landingPage={editingLandingPage}
          onUpdateLandingPage={(updatedLp) => {
            const updatedCampaigns = campaigns.map((c) => {
              if (c.landingPages.some((p) => p.id === updatedLp.id)) {
                return {
                  ...c,
                  landingPages: c.landingPages.map((p) => p.id === updatedLp.id ? updatedLp : p),
                  updatedAt: new Date().toISOString()
                };
              }
              return c;
            });
            setCampaigns(updatedCampaigns);
            try {
              localStorage.setItem("yomi_growth_campaigns", JSON.stringify(updatedCampaigns));
            } catch (e) {
              console.warn("Could not write to localStorage", e);
            }
            setEditingLandingPage(updatedLp);
          }}
          onClose={() => setEditingLandingPage(null)}
        />
      )}

      {/* DELETE CONFIRMATION DIALOG (REQUIREMENT 2) */}
      {pageToDelete && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Delete Landing Page?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Are you sure you want to permanently delete <strong>{pageToDelete.page.name}</strong>? This will remove all associated traffic allocations and conversion metrics.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setPageToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteLandingPage}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs cursor-pointer"
              >
                Delete Page
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PUBLISH / UNPUBLISH CONFIRMATION DIALOG (REQUIREMENT 2) */}
      {pageToTogglePublish && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {pageToTogglePublish.page.status === "active" ? "Unpublish Landing Page?" : "Publish Landing Page?"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {pageToTogglePublish.page.status === "active"
                  ? `Unpublishing ${pageToTogglePublish.page.name} will pause inbound ad traffic routing to this variation.`
                  : `Publishing ${pageToTogglePublish.page.name} will enable active customer traffic routing to this variation.`}
              </p>
            </div>
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setPageToTogglePublish(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmTogglePublish}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs cursor-pointer"
              >
                {pageToTogglePublish.page.status === "active" ? "Unpublish" : "Publish Now"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SMART LINK MODAL */}
      {showSmartLinkModal && (
        <SmartLinkModal
          campaign={activeCampaign}
          onClose={() => setShowSmartLinkModal(false)}
          onOpenTestLink={() => {
            setShowSmartLinkModal(false);
            setPreviewTestPage(activeCampaign.landingPages[0]);
          }}
        />
      )}

    </div>
  );
};
