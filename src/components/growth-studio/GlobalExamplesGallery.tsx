import React, { useState } from "react";
import { 
  Award, 
  ExternalLink, 
  CheckCircle2, 
  TrendingUp, 
  Sparkles, 
  Lightbulb, 
  Tag, 
  ChevronRight,
  ShieldCheck,
  Search,
  Layers
} from "lucide-react";
import { GLOBAL_HIGH_PERFORMING_EXAMPLES, GlobalExample } from "../../data/growthStudioPdfData";

interface GlobalExamplesGalleryProps {
  onSelectStrategyAngle?: (strategy: string) => void;
}

export const GlobalExamplesGallery: React.FC<GlobalExamplesGalleryProps> = ({
  onSelectStrategyAngle
}) => {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [selectedExample, setSelectedExample] = useState<GlobalExample | null>(GLOBAL_HIGH_PERFORMING_EXAMPLES[0]);

  const categories = ["All", "Social Proof", "Urgency", "Direct-to-Consumer", "Quiz", "Subscription"];

  const filteredExamples = GLOBAL_HIGH_PERFORMING_EXAMPLES.filter((ex) => {
    const matchesSearch = ex.brand.toLowerCase().includes(search.toLowerCase()) ||
                          ex.category.toLowerCase().includes(search.toLowerCase()) ||
                          ex.strategy.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6 text-left">
      
      {/* Header */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900">
              <Award className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>10 Global High-Performing Examples</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  PDF Section 2
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Real DTC & B2B brands analyzed for conversion optimization: above-the-fold hooks, social proof, and CRO mechanics.
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search brands or tactics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Main Split Layout: Left List + Right Detailed Strategy Teardown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Brand Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[720px] overflow-y-auto pr-1">
          {filteredExamples.map((ex) => {
            const isSelected = selectedExample?.id === ex.id;
            return (
              <div
                key={ex.id}
                onClick={() => setSelectedExample(ex)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? "bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-500 shadow-xs"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black text-slate-900 dark:text-white">
                        {ex.brand}
                      </h3>
                      <span className="text-[10px] font-mono text-slate-400">
                        {ex.url}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">
                      {ex.strategy}
                    </span>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? "text-emerald-600 translate-x-1" : "text-slate-400"}`} />
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">
                  {ex.headline}
                </p>

                <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">{ex.category}</span>
                  <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    {ex.stats}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Selected Brand Teardown (7 cols) */}
        <div className="lg:col-span-7">
          {selectedExample ? (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">
                      {selectedExample.brand}
                    </h3>
                    <a
                      href={`https://${selectedExample.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-0.5 rounded-md text-[10px] font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1 hover:underline"
                    >
                      <span>{selectedExample.url}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
                    {selectedExample.category}
                  </span>
                </div>

                <div className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs font-bold whitespace-nowrap">
                  {selectedExample.stats}
                </div>
              </div>

              {/* Strategy Core */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
                  Strategic Angle (PDF Reference)
                </span>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  {selectedExample.strategy}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {selectedExample.headline}
                </p>
              </div>

              {/* Key CRO Tactics */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Key Conversion Tactics Executed</span>
                </span>
                <div className="space-y-2">
                  {selectedExample.keyTactics.map((tactic, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{tactic}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actionable Takeaway for YOMI Merchants */}
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-1.5">
                <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-bold text-xs">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>Direct Merchant Application</span>
                </div>
                <p className="text-xs text-amber-900 dark:text-amber-200">
                  {selectedExample.takeaway}
                </p>
              </div>

              {/* Interactive Simulation / Test Angle Button */}
              {onSelectStrategyAngle && (
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => onSelectStrategyAngle(selectedExample.strategy)}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Adopt This Tactic in Campaign</span>
                  </button>
                </div>
              )}

            </div>
          ) : (
            <div className="h-full min-h-[300px] rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 flex items-center justify-center text-slate-400 text-xs">
              Select a brand example from the left to view conversion teardown.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
