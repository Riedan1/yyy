import React, { useState } from "react";
import { 
  Link2, 
  Copy, 
  Check, 
  QrCode, 
  ExternalLink, 
  X, 
  ShieldCheck, 
  Sparkles,
  Share2
} from "lucide-react";
import { GrowthCampaign } from "../../types/growthStudio";

interface SmartLinkModalProps {
  campaign: GrowthCampaign;
  onClose: () => void;
  onOpenTestLink: (url: string) => void;
}

export const SmartLinkModal: React.FC<SmartLinkModalProps> = ({
  campaign,
  onClose,
  onOpenTestLink
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedAdPlatform, setSelectedAdPlatform] = useState<string>("instagram");

  const baseUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/?growth=${campaign.id}`
    : `https://yomi.store/growth/${campaign.smartLinkSlug}`;

  const getPlatformUtmLink = (platform: string) => {
    return `${baseUrl}&utm_source=${platform}&utm_medium=paid_social&utm_campaign=${campaign.smartLinkSlug}`;
  };

  const activeUtmUrl = getPlatformUtmLink(selectedAdPlatform);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-5 text-left max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Link2 className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Smart Campaign Link
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Use this single URL in all your ad creatives. Traffic splits automatically across your landing pages.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Master URL Box */}
        <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80 space-y-2">
          <span className="text-[10px] font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider block">
            Master Campaign URL
          </span>
          
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={baseUrl}
              className="w-full text-xs font-mono font-bold px-3 py-2 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white select-all"
            />
            <button
              type="button"
              onClick={() => handleCopy(baseUrl)}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "Copied!" : "Copy"}</span>
            </button>
          </div>
        </div>

        {/* UTM Generator by Ad Source */}
        <div className="space-y-2.5">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
            Pre-tagged Ad Platform Links (UTM Tracking):
          </span>

          <div className="flex flex-wrap gap-1.5">
            {[
              { id: "instagram", label: "Instagram" },
              { id: "tiktok", label: "TikTok" },
              { id: "facebook", label: "Facebook" },
              { id: "snapchat", label: "Snapchat" },
              { id: "google", label: "Google Ads" },
              { id: "whatsapp", label: "WhatsApp" }
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedAdPlatform(p.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  selectedAdPlatform === p.id
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs"
                    : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
            <span className="text-xs font-mono text-slate-600 dark:text-slate-300 truncate max-w-[340px]">
              {activeUtmUrl}
            </span>
            <button
              type="button"
              onClick={() => handleCopy(activeUtmUrl)}
              className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-700 cursor-pointer"
              title="Copy UTM Link"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center gap-4">
          <div className="p-2.5 bg-white rounded-xl shadow-xs border border-slate-200 shrink-0">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${encodeURIComponent(baseUrl)}`} 
              alt="QR Code" 
              className="w-16 h-16"
            />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-indigo-500" />
              <span>Packaging & Offline QR Code</span>
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Print this QR code on thank-you cards or flyers placed inside Algerian courier packages to route repeat buyers smoothly.
            </p>
          </div>
        </div>

        {/* Benefits Note */}
        <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-400 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>Smart Routing Continuity</span>
          </div>
          <p>
            When a buyer visits this Smart Link, our engine checks their previous visit history to maintain consistency, avoiding conflicting offers or confusion.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => onOpenTestLink(baseUrl)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Test Customer Routing</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-all cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
