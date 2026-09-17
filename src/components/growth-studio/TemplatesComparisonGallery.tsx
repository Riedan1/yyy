import React, { useState } from "react";
import { 
  Layers, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Table, 
  LayoutGrid, 
  Eye, 
  Sliders, 
  Smartphone, 
  TrendingUp, 
  Tag,
  Flame,
  Zap,
  Info
} from "lucide-react";
import { GROWTH_TEMPLATES_CATALOG, GrowthTemplateDefinition } from "../../data/growthStudioPdfData";
import { GrowthLandingPage, StrategyFocus } from "../../types/growthStudio";

interface TemplatesComparisonGalleryProps {
  onApplyTemplate: (template: GrowthTemplateDefinition) => void;
  onPreviewTemplate?: (template: GrowthTemplateDefinition) => void;
}

export const TemplatesComparisonGallery: React.FC<TemplatesComparisonGalleryProps> = ({
  onApplyTemplate,
  onPreviewTemplate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [activeDetailTemplate, setActiveDetailTemplate] = useState<GrowthTemplateDefinition | null>(null);

  const categories = ["All", "Trading & E-Book", "Luxury", "Retail", "Subscription", "SaaS", "Tech", "Apparel", "Social", "Health", "Wellness"];

  const filteredTemplates = GROWTH_TEMPLATES_CATALOG.filter((tpl) => {
    if (selectedCategory === "All") return true;
    if (selectedCategory === "Trading & E-Book") {
      return tpl.id.includes("trading") || tpl.targetCategory.toLowerCase().includes("trading") || tpl.name.toLowerCase().includes("book") || tpl.targetCategory.toLowerCase().includes("finance");
    }
    return tpl.targetCategory.toLowerCase().includes(selectedCategory.toLowerCase()) ||
           tpl.name.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  return (
    <div className="space-y-6 text-left">
      
      {/* Header & Controls */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900">
              <Layers className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>11 Growth-Focused Page Templates & Archetypes</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  PDF Blueprint Catalog
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Pre-engineered conversion architectures with product-matched aesthetics (finance dark mode, luxury obsidian, emerald skincare, ergonomic retail), distinct hero layouts, and targeted conversion triggers.
              </p>
            </div>
          </div>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2">
          <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold">
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === "cards"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === "table"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>PDF Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category filter pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* VIEW MODE 1: CARDS GRID */}
      {viewMode === "cards" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      {template.targetCategory}
                    </span>
                    <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {template.name}
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 whitespace-nowrap">
                    {template.badge}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                  {template.description}
                </p>

                {/* Conversion Anatomy Points */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                  <div className="flex items-start gap-1.5">
                    <span className="font-bold text-slate-500 shrink-0 w-24">Primary CTA:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                      "{template.primaryCta}"
                    </span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="font-bold text-slate-500 shrink-0 w-24">Hero Layout:</span>
                    <span className="text-slate-700 dark:text-slate-300">{template.heroLayout}</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 shrink-0 w-24">Conversion Key:</span>
                    <span className="text-indigo-900 dark:text-indigo-300 font-medium">{template.uniqueConversionElement}</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="font-bold text-slate-500 shrink-0 w-24">Mobile Behavior:</span>
                    <span className="text-slate-700 dark:text-slate-300">{template.mobileBehavior}</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="font-bold text-amber-600 dark:text-amber-400 shrink-0 w-24">A/B Test Plan:</span>
                    <span className="text-slate-600 dark:text-slate-400 italic">{template.recommendedAbTest}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setActiveDetailTemplate(template)}
                    className="px-2.5 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 cursor-pointer"
                    title="Inspect details"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Inspect</span>
                  </button>

                  {onPreviewTemplate && (
                    <button
                      type="button"
                      onClick={() => onPreviewTemplate(template)}
                      className="px-2.5 py-2 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center gap-1 cursor-pointer border border-indigo-200/60 dark:border-indigo-800/60"
                      title="Preview page"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onApplyTemplate(template)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95 shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Deploy</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW MODE 2: FULL COMPARATIVE TABLE (EXACT FROM PDF PAGES 4-5) */}
      {viewMode === "table" && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Template Name</th>
                  <th className="py-3 px-4">Target Category</th>
                  <th className="py-3 px-4">Primary CTA</th>
                  <th className="py-3 px-4">Hero Layout</th>
                  <th className="py-3 px-4">Unique Conversion Element</th>
                  <th className="py-3 px-4">Mobile Behavior</th>
                  <th className="py-3 px-4">Recommended A/B Test</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredTemplates.map((tpl) => (
                  <tr key={tpl.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-black text-slate-900 dark:text-white whitespace-nowrap">
                      {tpl.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium">
                      {tpl.targetCategory}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white">
                        "{tpl.primaryCta}"
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 max-w-xs">
                      {tpl.heroLayout}
                    </td>
                    <td className="py-3.5 px-4 text-indigo-600 dark:text-indigo-400 font-medium max-w-xs">
                      {tpl.uniqueConversionElement}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 max-w-xs">
                      {tpl.mobileBehavior}
                    </td>
                    <td className="py-3.5 px-4 text-amber-700 dark:text-amber-400 italic max-w-xs">
                      {tpl.recommendedAbTest}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onApplyTemplate(tpl)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
                      >
                        Apply
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DETAIL INSPECTION MODAL */}
      {activeDetailTemplate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-left">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-black uppercase text-indigo-600 dark:text-indigo-400">
                  {activeDetailTemplate.targetCategory}
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {activeDetailTemplate.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveDetailTemplate(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-1">Architecture Overview</h4>
                <p className="text-slate-600 dark:text-slate-400">{activeDetailTemplate.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-500 block mb-1">Primary CTA Button</span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    "{activeDetailTemplate.primaryCta}"
                  </span>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-500 block mb-1">Conversion Trigger</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {activeDetailTemplate.uniqueConversionElement}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500">Hero Section Layout</span>
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                  {activeDetailTemplate.heroLayout}
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500">Mobile Adaptation & Sticky CTA</span>
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                  {activeDetailTemplate.mobileBehavior}
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">Recommended A/B Testing Plan</span>
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300">
                  {activeDetailTemplate.recommendedAbTest}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold text-slate-500">Pre-Configured Sections ({activeDetailTemplate.suggestedSections.length})</span>
                <div className="space-y-2">
                  {activeDetailTemplate.suggestedSections.map((sec, i) => (
                    <div key={sec.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase text-indigo-600 dark:text-indigo-400">
                          Section {i + 1}: {sec.type}
                        </span>
                        <div className="font-bold text-slate-900 dark:text-white text-xs">
                          {sec.headline}
                        </div>
                      </div>
                      {sec.price && (
                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {sec.price.toLocaleString()} DA
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveDetailTemplate(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  onApplyTemplate(activeDetailTemplate);
                  setActiveDetailTemplate(null);
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Instantiate Into Campaign</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
