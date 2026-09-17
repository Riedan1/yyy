import React, { useState } from "react";
import { 
  Sparkles, 
  Copy, 
  Check, 
  Terminal, 
  Database, 
  ListChecks, 
  Calendar, 
  Layers, 
  Code, 
  ChevronRight,
  ShieldCheck,
  Zap,
  ArrowRight
} from "lucide-react";
import { 
  AI_STUDIO_PROMPT_PATTERNS, 
  IMPLEMENTATION_CHECKLIST, 
  ROLLOUT_PHASES 
} from "../../data/growthStudioPdfData";
import { Product } from "../../types";

interface AiPromptStudioModalProps {
  product?: {
    name: string;
    price: number;
    description?: string;
  };
  onClose: () => void;
  onApplyPrompt?: (prompt: string) => void;
}

export const AiPromptStudioModal: React.FC<AiPromptStudioModalProps> = ({
  product,
  onClose,
  onApplyPrompt
}) => {
  const [activeTab, setActiveTab] = useState<"prompts" | "er_diagram" | "checklist" | "timeline">("prompts");
  const [selectedPromptType, setSelectedPromptType] = useState<"basic" | "constraints" | "urgency">("basic");
  const [copied, setCopied] = useState(false);

  // Form customizer for dynamic prompt substitution
  const [customProduct, setCustomProduct] = useState(product?.name || "Ergonomic Office Lumbar Chair");
  const [customPrice, setCustomPrice] = useState(product?.price?.toString() || "4900");
  const [targetAudience, setTargetAudience] = useState("Algerian remote workers, developers, and office professionals");
  const [customerProblem, setCustomerProblem] = useState("Chronic lower back stiffness and slouching during long 8+ hour screen sessions");
  const [uniqueBenefit, setUniqueBenefit] = useState("Adaptive memory-mesh matrix with free cash-on-delivery inspection before payment");

  const getComputedPrompt = () => {
    if (selectedPromptType === "basic") {
      return AI_STUDIO_PROMPT_PATTERNS.basicTemplate.prompt
        .replace("[ProductName]", customProduct)
        .replace("[AudienceDescription]", targetAudience)
        .replace("[CustomerProblem]", customerProblem)
        .replace("[UniqueBenefit]", uniqueBenefit)
        .replace("[Professional / Friendly / Urgency-driven]", "Authoritative and friendly");
    }

    if (selectedPromptType === "constraints") {
      return AI_STUDIO_PROMPT_PATTERNS.withConstraints.prompt
        .replace("[ProductName]", customProduct)
        .replace("[RegularPrice]", (parseInt(customPrice) * 1.3).toString())
        .replace("[OfferPrice]", customPrice)
        .replace("[FeaturesList]", "Aerospace breathable mesh, 4D armrest adjustment, class-4 hydraulic piston")
        .replace("[ShippingPolicy]", "Express Doorstep Courier")
        .replace("[BrandVoice]", "Modern, trustworthy, direct, and zero fluff");
    }

    return AI_STUDIO_PROMPT_PATTERNS.urgencyVariation.prompt
      .replace(/\[ProductName\]/g, customProduct)
      .replace("[StockRemaining]", "14");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getComputedPrompt());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] text-left">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>Google AI Studio Prompt & Architecture Hub</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  PDF Sections 6 & 7
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Structured prompt patterns, relational entity architecture, and technical audit checklists.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Subnav Tabs */}
        <div className="px-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-xs font-bold bg-slate-50/50 dark:bg-slate-850/50">
          <button
            type="button"
            onClick={() => setActiveTab("prompts")}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "prompts"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>AI Studio Prompt Patterns</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("er_diagram")}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "er_diagram"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Relational ER Architecture (PDF p.7)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("checklist")}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "checklist"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
            }`}
          >
            <ListChecks className="w-4 h-4" />
            <span>Technical Checklist (PDF p.8)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("timeline")}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "timeline"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Rollout Phases (PDF p.3, 10)</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto max-h-[65vh] space-y-6">
          
          {/* TAB 1: AI STUDIO PROMPTS */}
          {activeTab === "prompts" && (
            <div className="space-y-5">
              {/* Pattern Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedPromptType("basic")}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedPromptType === "basic"
                      ? "border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-slate-900 dark:text-white"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                  }`}
                >
                  <span className="text-[10px] font-mono font-bold uppercase text-indigo-600 dark:text-indigo-400 block mb-1">
                    Pattern 1 (PDF p.7)
                  </span>
                  <div className="text-xs font-black">Basic Creative Brief</div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Audience, problem statement, key differentiators, and value proposition structure.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPromptType("constraints")}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedPromptType === "constraints"
                      ? "border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-slate-900 dark:text-white"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                  }`}
                >
                  <span className="text-[10px] font-mono font-bold uppercase text-indigo-600 dark:text-indigo-400 block mb-1">
                    Pattern 2 (PDF p.7)
                  </span>
                  <div className="text-xs font-black">With Strict Constraints</div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Zero fake stats, strict brand voice, merchant price locking, and active CTAs.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPromptType("urgency")}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedPromptType === "urgency"
                      ? "border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-slate-900 dark:text-white"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                  }`}
                >
                  <span className="text-[10px] font-mono font-bold uppercase text-indigo-600 dark:text-indigo-400 block mb-1">
                    Pattern 3 (PDF p.7)
                  </span>
                  <div className="text-xs font-black">Urgency Variation</div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Rewrites copy with scarcity cues, countdown timers, and impulse order motivators.
                  </div>
                </button>
              </div>

              {/* Dynamic Variables Form */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs space-y-3">
                <span className="font-bold text-slate-700 dark:text-slate-300 block">
                  Dynamic Prompt Placeholders (Customizable)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Product Name</label>
                    <input
                      type="text"
                      value={customProduct}
                      onChange={(e) => setCustomProduct(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Price (DA)</label>
                    <input
                      type="text"
                      value={customPrice}
                      onChange={(e) => setCustomPrice(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] text-slate-500 block mb-1">Target Audience</label>
                    <input
                      type="text"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Formatted Code Block */}
              <div className="relative rounded-2xl bg-slate-950 text-slate-100 p-4 font-mono text-xs overflow-x-auto border border-slate-800">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Google AI Studio Input Prompt (English Only)</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied!" : "Copy Prompt"}</span>
                  </button>
                </div>
                <pre className="whitespace-pre-wrap leading-relaxed text-slate-200">
                  {getComputedPrompt()}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 2: RELATIONAL ER ARCHITECTURE (PDF PAGE 7 & 11) */}
          {activeTab === "er_diagram" && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                  Relational Entity Relationship (ER) Model
                </h4>
                <p>
                  Directly mirroring the architectural diagram in PDF Page 7 and Page 11:
                  A <strong>MERCHANT</strong> creates multiple <strong>LANDING_PAGE</strong>s using a <strong>TEMPLATE</strong>. 
                  Each <strong>LANDING_PAGE</strong> contains modular <strong>COMPONENT</strong>s, features <strong>PRODUCT</strong>s (with <strong>VARIANT</strong>s), and logs conversion <strong>EVENT</strong>s.
                </p>
              </div>

              {/* Visual ER Diagram Diagram Card */}
              <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="w-full max-w-lg space-y-6">
                  
                  {/* Top Level: Merchant & Template */}
                  <div className="flex items-center justify-between gap-8">
                    <div className="flex-1 p-3.5 rounded-2xl bg-indigo-600/30 border border-indigo-500/60 text-center">
                      <div className="text-[10px] font-mono text-indigo-300 uppercase tracking-wider font-bold">Entity</div>
                      <div className="text-sm font-black mt-0.5">MERCHANT</div>
                      <div className="text-[10px] text-indigo-200 mt-1">Store Owner</div>
                    </div>

                    <div className="text-[11px] font-mono text-slate-400 italic">
                      creates ↓
                    </div>

                    <div className="flex-1 p-3.5 rounded-2xl bg-violet-600/30 border border-violet-500/60 text-center">
                      <div className="text-[10px] font-mono text-violet-300 uppercase tracking-wider font-bold">Entity</div>
                      <div className="text-sm font-black mt-0.5">TEMPLATE</div>
                      <div className="text-[10px] text-violet-200 mt-1">10 PDF Architectures</div>
                    </div>
                  </div>

                  {/* Center Hub: LANDING_PAGE */}
                  <div className="flex justify-center">
                    <div className="w-full max-w-sm p-4 rounded-2xl bg-emerald-600/40 border-2 border-emerald-400 text-center shadow-lg shadow-emerald-950">
                      <div className="text-[10px] font-mono text-emerald-300 uppercase tracking-wider font-bold">Central Aggregate Root</div>
                      <div className="text-base font-black mt-0.5 text-white">LANDING_PAGE</div>
                      <div className="text-[11px] text-emerald-100 mt-1">
                        Campaign Variant (Allocated 0-100% Traffic)
                      </div>
                    </div>
                  </div>

                  {/* Connecting Arrows */}
                  <div className="flex items-center justify-around text-[10px] font-mono text-slate-400">
                    <span>contains ↓</span>
                    <span>features ↓</span>
                    <span>logs ↓</span>
                  </div>

                  {/* Bottom Sub-Entities: Component, Product/Variant, Event */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
                      <div className="text-[9px] font-mono text-slate-400">Section</div>
                      <div className="text-xs font-bold mt-0.5">COMPONENT</div>
                      <div className="text-[9px] text-slate-400 mt-1">Hero, FAQ, Proof</div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-center space-y-1">
                      <div className="text-[9px] font-mono text-slate-400">Item</div>
                      <div className="text-xs font-bold">PRODUCT</div>
                      <div className="text-[10px] font-mono text-emerald-400">↓ VARIANT</div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
                      <div className="text-[9px] font-mono text-slate-400">Analytics</div>
                      <div className="text-xs font-bold mt-0.5">EVENT</div>
                      <div className="text-[9px] text-slate-400 mt-1">Views, Clicks, Orders</div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TECHNICAL CHECKLIST (PDF PAGE 8) */}
          {activeTab === "checklist" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs">
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                  Section 7: Implementation & Compliance Checklist
                </h4>
                <p className="text-slate-600 dark:text-slate-300">
                  Strict quality, performance, and accessibility requirements defined for production growth landing pages.
                </p>
              </div>

              <div className="space-y-4">
                {IMPLEMENTATION_CHECKLIST.map((group, gIdx) => (
                  <div key={gIdx} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <h5 className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider font-mono">
                      {group.category}
                    </h5>
                    <div className="space-y-1.5">
                      {group.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>{item.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ROLLOUT TIMELINE (PDF PAGE 3 & 10) */}
          {activeTab === "timeline" && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs">
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                  Landing Page Builder Rollout Phases
                </h4>
                <p className="text-slate-600 dark:text-slate-300">
                  Timeline diagram exactly matching PDF Page 3 and Page 10.
                </p>
              </div>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                {ROLLOUT_PHASES.map((phase, idx) => (
                  <div key={idx} className="relative space-y-1">
                    <span className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${phase.color}`} />
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-xs text-slate-900 dark:text-white">
                        {phase.phase}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {phase.status}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {phase.title}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {phase.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Compliant with Google AI Studio prompt engineering and WCAG AA guidelines.
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-700 cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Active Prompt</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
