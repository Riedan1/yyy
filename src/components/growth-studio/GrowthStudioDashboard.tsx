import React, { useState } from "react";
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
  Bot,
  Zap,
  ArrowRight
} from "lucide-react";
import { Product } from "../../types";
import { GrowthCampaign, GrowthLandingPage } from "../../types/growthStudio";
import { MOCK_GROWTH_CAMPAIGNS } from "./mockCampaignsData";
import { CampaignFlowVisualization } from "./CampaignFlowVisualization";
import { TrafficDistributionManager } from "./TrafficDistributionManager";
import { LandingPageBuilder } from "./LandingPageBuilder";
import { AiLandingPageGeneratorModal } from "./AiLandingPageGeneratorModal";
import { CampaignAnalyticsDashboard } from "./CampaignAnalyticsDashboard";
import { CreateCampaignModal } from "./CreateCampaignModal";
import { SmartLinkModal } from "./SmartLinkModal";
import { PublicGrowthLandingPage } from "./PublicGrowthLandingPage";

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
    return MOCK_GROWTH_CAMPAIGNS;
  });

  const [activeCampaignId, setActiveCampaignId] = useState<string>(campaigns[0]?.id || "");
  const [activeTab, setActiveTab] = useState<"flow" | "distribution" | "pages" | "analytics">("flow");

  // Modals & Builders
  const [editingLandingPage, setEditingLandingPage] = useState<GrowthLandingPage | null>(null);
  const [showAiModal, setShowAiModal] = useState(false);
  const [showCreateCampaignModal, setShowCreateCampaignModal] = useState(false);
  const [showSmartLinkModal, setShowSmartLinkModal] = useState(false);
  const [previewTestPage, setPreviewTestPage] = useState<GrowthLandingPage | null>(null);

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

  // Handle new campaign creation
  const handleCampaignCreated = (newCamp: GrowthCampaign) => {
    const updatedList = [newCamp, ...campaigns];
    setCampaigns(updatedList);
    setActiveCampaignId(newCamp.id);
    setShowCreateCampaignModal(false);
    try {
      localStorage.setItem("yomi_growth_campaigns", JSON.stringify(updatedList));
    } catch (e) {
      console.warn("Could not write to localStorage", e);
    }
  };

  // Handle AI landing pages generated
  const handleAiPagesGenerated = (newPages: GrowthLandingPage[]) => {
    if (!activeCampaign) return;
    const count = newPages.length;
    const share = Math.floor(100 / count);

    const formattedPages = newPages.map((p, idx) => ({
      ...p,
      campaignId: activeCampaign.id,
      trafficAllocation: idx === 0 ? share + (100 % count) : share
    }));

    const updated: GrowthCampaign = {
      ...activeCampaign,
      landingPages: formattedPages,
      updatedAt: new Date().toISOString()
    };

    updateActiveCampaign(updated);
    setShowAiModal(false);
    setActiveTab("pages");
  };

  // Handle test simulated purchase
  const handleSimulatedOrder = (orderData: any) => {
    if (!activeCampaign) return;
    const targetLpId = orderData.landingPageId;

    const updatedLps = activeCampaign.landingPages.map((lp) => {
      if (lp.id === targetLpId) {
        return {
          ...lp,
          metrics: {
            ...lp.metrics,
            visitors: lp.metrics.visitors + 1,
            uniqueVisitors: lp.metrics.uniqueVisitors + 1,
            conversions: lp.metrics.conversions + 1,
            revenue: lp.metrics.revenue + orderData.totalPrice
          }
        };
      }
      return lp;
    });

    const updatedCampaign: GrowthCampaign = {
      ...activeCampaign,
      landingPages: updatedLps,
      updatedAt: new Date().toISOString()
    };

    updateActiveCampaign(updatedCampaign);
  };

  if (!activeCampaign) {
    return (
      <div className="p-8 text-center space-y-4">
        <h3 className="text-lg font-bold">No Campaigns Found</h3>
        <button
          type="button"
          onClick={() => setShowCreateCampaignModal(true)}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
        >
          Create First Campaign
        </button>
      </div>
    );
  }

  // Active testing customer preview mode
  if (previewTestPage) {
    return (
      <PublicGrowthLandingPage
        campaign={activeCampaign}
        landingPage={previewTestPage}
        onOrderSuccess={(order) => {
          handleSimulatedOrder(order);
        }}
        onBackToStore={() => setPreviewTestPage(null)}
        isArabic={false}
      />
    );
  }

  return (
    <div className="space-y-6 text-left">

      {/* TOP HEADER: TITLE, CAMPAIGN SELECTOR, ACTIONS */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Left Title & Campaign Switcher */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-xs">
                <Sparkles className="w-5 h-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    Growth Studio
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800">
                    Smart Dynamic Router
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Test multiple landing pages for the same product, dynamically route ad traffic, and maximize COD conversions.
                </p>
              </div>
            </div>

            {/* Campaign Select Dropdown & Quick Info */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <div className="relative">
                <select
                  value={activeCampaign.id}
                  onChange={(e) => setActiveCampaignId(e.target.value)}
                  className="appearance-none text-xs font-bold px-3 py-1.5 pr-8 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.landingPages.length} pages)
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>

              <button
                type="button"
                onClick={() => setShowCreateCampaignModal(true)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Campaign</span>
              </button>
            </div>
          </div>

          {/* Right Campaign Quick Actions */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowSmartLinkModal(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>Smart Campaign Link</span>
            </button>

            <button
              type="button"
              onClick={() => setPreviewTestPage(activeCampaign.landingPages[0])}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5 text-indigo-500" />
              <span>Test Live</span>
            </button>
          </div>

        </div>

        {/* SUBTABS BAR: Flow Visualizer, Distribution, Pages, Analytics */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto">
          {[
            { id: "flow", label: "Campaign Flow", icon: <Share2 className="w-3.5 h-3.5" /> },
            { id: "distribution", label: "Traffic Distribution", icon: <Sliders className="w-3.5 h-3.5" /> },
            { id: "pages", label: "Landing Pages", icon: <Layers className="w-3.5 h-3.5" /> },
            { id: "analytics", label: "Analytics & Insights", icon: <BarChart3 className="w-3.5 h-3.5" /> }
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

      {/* VIEW 1: CAMPAIGN FLOW VISUALIZATION */}
      {activeTab === "flow" && (
        <CampaignFlowVisualization 
          campaign={activeCampaign}
          onOpenSmartLink={() => setShowSmartLinkModal(true)}
          isArabic={false}
        />
      )}

      {/* VIEW 2: TRAFFIC DISTRIBUTION MANAGER */}
      {activeTab === "distribution" && (
        <TrafficDistributionManager
          campaign={activeCampaign}
          onUpdateCampaign={updateActiveCampaign}
          isArabic={false}
        />
      )}

      {/* VIEW 3: LANDING PAGES MANAGEMENT & GENERATION */}
      {activeTab === "pages" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Campaign Landing Pages
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Each page is strategically engineered with different messaging angles to maximize sales.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAiModal(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate with AI</span>
              </button>
            </div>
          </div>

          {/* Grid of Landing Pages */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {activeCampaign.landingPages.map((lp, idx) => {
              const cvr = lp.metrics.uniqueVisitors > 0
                ? ((lp.metrics.conversions / lp.metrics.uniqueVisitors) * 100).toFixed(1)
                : "0.0";

              return (
                <div 
                  key={lp.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="p-5 space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-mono font-bold flex items-center justify-center">
                          0{idx + 1}
                        </span>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white">
                          {lp.name}
                        </h4>
                      </div>

                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {lp.trafficAllocation}% traffic
                      </span>
                    </div>

                    {/* Angle / Strategy Badge */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Strategic Angle
                      </span>
                      <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800 capitalize">
                        {lp.strategyFocus.replace("_", " ")}
                      </span>
                    </div>

                    {/* Preview Headline */}
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed bg-slate-50 dark:bg-slate-850 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
                      "{lp.sections[0]?.headline || "Transform Your Daily Comfort"}"
                    </p>

                    {/* Quick Metrics Bar */}
                    <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Visitors</span>
                        <span className="text-xs font-black font-mono text-slate-900 dark:text-white">
                          {lp.metrics.visitors}
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Orders</span>
                        <span className="text-xs font-black font-mono text-emerald-600 dark:text-emerald-400">
                          {lp.metrics.conversions}
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
                        <span className="text-[10px] text-slate-400 block">CVR</span>
                        <span className="text-xs font-black font-mono text-indigo-600 dark:text-indigo-400">
                          {cvr}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-4 bg-slate-50/70 dark:bg-slate-850/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewTestPage(lp)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 cursor-pointer flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditingLandingPage(lp)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit in Builder</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 4: CAMPAIGN ANALYTICS & INSIGHTS */}
      {activeTab === "analytics" && (
        <CampaignAnalyticsDashboard
          campaign={activeCampaign}
          isArabic={false}
        />
      )}

      {/* LANDING PAGE BUILDER FULLSCREEN MODAL */}
      {editingLandingPage && (
        <LandingPageBuilder
          landingPage={editingLandingPage}
          onUpdateLandingPage={(updatedLp) => {
            const updatedList = activeCampaign.landingPages.map((p) =>
              p.id === updatedLp.id ? updatedLp : p
            );
            updateActiveCampaign({
              ...activeCampaign,
              landingPages: updatedList,
              updatedAt: new Date().toISOString()
            });
            setEditingLandingPage(updatedLp);
          }}
          onClose={() => setEditingLandingPage(null)}
          isArabic={false}
        />
      )}

      {/* AI GENERATOR MODAL */}
      {showAiModal && (
        <AiLandingPageGeneratorModal
          productName={activeCampaign.product.name}
          productPrice={activeCampaign.product.price}
          productImage={activeCampaign.product.imageUrl}
          onGenerateSuccess={handleAiPagesGenerated}
          onClose={() => setShowAiModal(false)}
          isArabic={false}
        />
      )}

      {/* CREATE CAMPAIGN MODAL */}
      {showCreateCampaignModal && (
        <CreateCampaignModal
          storeProducts={storeProducts}
          onCreated={handleCampaignCreated}
          onClose={() => setShowCreateCampaignModal(false)}
          isArabic={false}
        />
      )}

      {/* SMART LINK MODAL */}
      {showSmartLinkModal && (
        <SmartLinkModal
          campaign={activeCampaign}
          onClose={() => setShowSmartLinkModal(false)}
          onOpenTestLink={(url) => {
            setShowSmartLinkModal(false);
            setPreviewTestPage(activeCampaign.landingPages[0]);
          }}
          isArabic={false}
        />
      )}

    </div>
  );
};
