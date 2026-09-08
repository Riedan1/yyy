import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Check,
  Upload,
  Video,
  Image as ImageIcon,
  Sliders,
  Layers,
  Save,
  AlertCircle,
  Sparkles,
  Info
} from "lucide-react";
import {
  PlatformFeatureConfig,
  getPlatformFeatureConfig,
  savePlatformFeatureConfig,
  DEFAULT_PLATFORM_FEATURE_CONFIG,
  PlanFeatureConfig
} from "../utils/platformFeatureConfig";

interface PlatformOwnerFeatureManagementCardProps {
  currentSlideColor?: string;
}

export const PlatformOwnerFeatureManagementCard: React.FC<PlatformOwnerFeatureManagementCardProps> = ({
  currentSlideColor = "#ff385c"
}) => {
  const [config, setConfig] = useState<PlatformFeatureConfig>(getPlatformFeatureConfig);
  const [saveFeedback, setSaveFeedback] = useState<string>("");

  useEffect(() => {
    const handleUpdate = () => {
      setConfig(getPlatformFeatureConfig());
    };
    window.addEventListener("storage", handleUpdate);
    window.addEventListener("yumi_feature_config_changed", handleUpdate);
    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("yumi_feature_config_changed", handleUpdate);
    };
  }, []);

  const handleGlobalToggle = (key: keyof PlatformFeatureConfig, value: any) => {
    setConfig((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handlePlanToggle = (plan: string, key: keyof PlanFeatureConfig, value: any) => {
    setConfig((prev) => ({
      ...prev,
      planConfigs: {
        ...prev.planConfigs,
        [plan]: {
          ...(prev.planConfigs[plan] || DEFAULT_PLATFORM_FEATURE_CONFIG.planConfigs[plan] || {
            allowImageUploadDevice: true,
            allowVideoUploadDevice: true,
            allowExternalVideoLinks: true,
            maxImages: 10,
            maxVideos: 2,
          }),
          [key]: value,
        },
      },
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    savePlatformFeatureConfig(config);
    setSaveFeedback("✨ Yumi Platform Feature Management settings updated successfully!");
    setTimeout(() => setSaveFeedback(""), 5000);
  };

  const handleResetDefaults = () => {
    if (window.confirm("Reset all platform feature configurations and subscription plan rules to defaults?")) {
      setConfig(DEFAULT_PLATFORM_FEATURE_CONFIG);
      savePlatformFeatureConfig(DEFAULT_PLATFORM_FEATURE_CONFIG);
      setSaveFeedback("Restored default platform feature configurations.");
      setTimeout(() => setSaveFeedback(""), 4000);
    }
  };

  const plans = ["Basic", "Pro", "Pro Plus", "Premium"];

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-stone-150/40 dark:border-slate-800 flex flex-col gap-6 font-sans text-left md:col-span-2 shadow-sm relative overflow-hidden">
      {/* Decorative Gradient Background */}
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-10"
        style={{ backgroundColor: currentSlideColor }}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-150 dark:border-slate-800 pb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono text-[10px] uppercase font-black tracking-wider flex items-center gap-1 border border-amber-500/20">
              <ShieldCheck className="w-3 h-3" />
              Yumi Platform Owner Only
            </span>
            <span className="text-[10px] font-mono text-stone-400">Feature Management System</span>
          </div>
          <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider font-mono mt-1 flex items-center gap-2">
            <Sliders className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400" />
            Product & Media Feature Governance Engine
          </h3>
          <p className="text-xs text-stone-500 dark:text-slate-400 mt-1">
            Control global media upload permissions (Device Images, Device Videos, External Video Links), max quotas, file limits, and plan tier matrix. The Add Product interface automatically adapts without frontend changes.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3 py-2 rounded-xl text-xs font-bold text-stone-600 dark:text-slate-400 hover:bg-stone-100 dark:hover:bg-slate-800 border border-stone-200 dark:border-slate-800 transition-all cursor-pointer"
          >
            Reset Defaults
          </button>
          <button
            type="button"
            onClick={handleSave}
            style={{ backgroundColor: currentSlideColor }}
            className="px-4 py-2 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all cursor-pointer hover:opacity-95 flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            Save Governance Settings
          </button>
        </div>
      </div>

      {saveFeedback && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-fade-in">
          <Sparkles className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{saveFeedback}</span>
        </div>
      )}

      {/* Main Governance Grid */}
      <form onSubmit={handleSave} className="space-y-6 relative z-10">
        
        {/* SECTION 1: GLOBAL MEDIA TOGGLES & CONSTRAINTS */}
        <div className="p-5 rounded-2xl bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-850 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-slate-800 pb-2.5">
            <h4 className="text-xs font-extrabold uppercase font-mono tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              1. Global Platform Default Media Controls
            </h4>
            <span className="text-[10px] font-mono font-bold text-stone-400">Master Switches</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Global Image Upload */}
            <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-stone-200 dark:border-slate-800 flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Device Image Upload</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.globalAllowImageUploadDevice}
                  onChange={(e) => handleGlobalToggle("globalAllowImageUploadDevice", e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
              </div>
              <p className="text-[10.5px] text-stone-500 leading-normal font-medium">
                Allow merchants to upload product photos directly from local device/phone.
              </p>
            </div>

            {/* Global Video Upload from Device */}
            <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-stone-200 dark:border-slate-800 flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-indigo-500" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Device Video Upload</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.globalAllowVideoUploadDevice}
                  onChange={(e) => handleGlobalToggle("globalAllowVideoUploadDevice", e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
              </div>
              <p className="text-[10.5px] text-stone-500 leading-normal font-medium">
                Allow uploading MP4/WEBM video files directly from local storage.
              </p>
            </div>

            {/* Global External Video Links */}
            <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-stone-200 dark:border-slate-800 flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-rose-500" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">External Video Links</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.globalAllowExternalVideoLinks}
                  onChange={(e) => handleGlobalToggle("globalAllowExternalVideoLinks", e.target.checked)}
                  className="w-4 h-4 accent-rose-600 rounded cursor-pointer"
                />
              </div>
              <p className="text-[10.5px] text-stone-500 leading-normal font-medium">
                Allow pasting Instagram Reels, TikTok, or YouTube embed video links.
              </p>
            </div>

          </div>

          {/* Numerical Limits & File Specifications */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-stone-200 dark:border-slate-800 flex flex-col gap-1">
              <label className="text-[10px] uppercase font-mono font-bold text-stone-400">
                Max Images / Product
              </label>
              <input
                type="number"
                min={1}
                max={30}
                value={config.globalMaxImagesPerProduct}
                onChange={(e) => handleGlobalToggle("globalMaxImagesPerProduct", parseInt(e.target.value) || 1)}
                className="w-full p-2 bg-stone-50 dark:bg-slate-950 border border-stone-250 dark:border-slate-800 rounded-lg text-xs font-black text-slate-900 dark:text-white outline-none font-mono"
              />
            </div>

            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-stone-200 dark:border-slate-800 flex flex-col gap-1">
              <label className="text-[10px] uppercase font-mono font-bold text-stone-400">
                Max Videos / Product
              </label>
              <input
                type="number"
                min={0}
                max={10}
                value={config.globalMaxVideosPerProduct}
                onChange={(e) => handleGlobalToggle("globalMaxVideosPerProduct", parseInt(e.target.value) || 0)}
                className="w-full p-2 bg-stone-50 dark:bg-slate-950 border border-stone-250 dark:border-slate-800 rounded-lg text-xs font-black text-slate-900 dark:text-white outline-none font-mono"
              />
            </div>

            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-stone-200 dark:border-slate-800 flex flex-col gap-1">
              <label className="text-[10px] uppercase font-mono font-bold text-stone-400">
                Max Image Size (MB)
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={config.globalMaxImageSizeBytesMB}
                onChange={(e) => handleGlobalToggle("globalMaxImageSizeBytesMB", parseInt(e.target.value) || 5)}
                className="w-full p-2 bg-stone-50 dark:bg-slate-950 border border-stone-250 dark:border-slate-800 rounded-lg text-xs font-black text-slate-900 dark:text-white outline-none font-mono"
              />
            </div>

            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-stone-200 dark:border-slate-800 flex flex-col gap-1">
              <label className="text-[10px] uppercase font-mono font-bold text-stone-400">
                Max Video Size (MB)
              </label>
              <input
                type="number"
                min={1}
                max={500}
                value={config.globalMaxVideoSizeBytesMB}
                onChange={(e) => handleGlobalToggle("globalMaxVideoSizeBytesMB", parseInt(e.target.value) || 50)}
                className="w-full p-2 bg-stone-50 dark:bg-slate-950 border border-stone-250 dark:border-slate-800 rounded-lg text-xs font-black text-slate-900 dark:text-white outline-none font-mono"
              />
            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-stone-200 dark:border-slate-800 flex flex-col gap-1">
              <label className="text-[10px] uppercase font-mono font-bold text-stone-400">
                Allowed Image File Extensions
              </label>
              <input
                type="text"
                value={config.allowedImageTypes}
                onChange={(e) => handleGlobalToggle("allowedImageTypes", e.target.value)}
                placeholder="jpeg, png, webp, gif"
                className="w-full p-2 bg-stone-50 dark:bg-slate-950 border border-stone-250 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-900 dark:text-white outline-none font-mono"
              />
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-stone-200 dark:border-slate-800 flex flex-col gap-1">
              <label className="text-[10px] uppercase font-mono font-bold text-stone-400">
                Allowed Video File Extensions
              </label>
              <input
                type="text"
                value={config.allowedVideoTypes}
                onChange={(e) => handleGlobalToggle("allowedVideoTypes", e.target.value)}
                placeholder="mp4, webm, mov"
                className="w-full p-2 bg-stone-50 dark:bg-slate-950 border border-stone-250 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-900 dark:text-white outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: SUBSCRIPTION PLAN TIER MATRIX */}
        <div className="p-5 rounded-2xl bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-850 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-slate-800 pb-2.5">
            <h4 className="text-xs font-extrabold uppercase font-mono tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-500" />
              2. Subscription Tier Feature Matrix & Quota Allocation
            </h4>
            <span className="text-[10px] font-mono font-bold text-stone-400">Per Tier Governance</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-stone-200 dark:border-slate-800 text-[10px] uppercase font-mono font-black text-stone-400">
                  <th className="py-2 px-3">Subscription Tier</th>
                  <th className="py-2 px-3 text-center">Device Images</th>
                  <th className="py-2 px-3 text-center">Device Videos</th>
                  <th className="py-2 px-3 text-center">External Video Links</th>
                  <th className="py-2 px-3 text-center">Max Images</th>
                  <th className="py-2 px-3 text-center">Max Videos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 dark:divide-slate-850">
                {plans.map((plan) => {
                  const planData = config.planConfigs[plan] || DEFAULT_PLATFORM_FEATURE_CONFIG.planConfigs[plan] || {
                    allowImageUploadDevice: true,
                    allowVideoUploadDevice: true,
                    allowExternalVideoLinks: true,
                    maxImages: 10,
                    maxVideos: 2,
                  };

                  return (
                    <tr key={plan} className="hover:bg-white/60 dark:hover:bg-slate-900/60 transition-all">
                      <td className="py-3 px-3 font-extrabold text-slate-900 dark:text-white font-mono flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentSlideColor }} />
                        <span>{plan} Plan</span>
                      </td>

                      {/* Device Images */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={planData.allowImageUploadDevice}
                          onChange={(e) => handlePlanToggle(plan, "allowImageUploadDevice", e.target.checked)}
                          className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                        />
                      </td>

                      {/* Device Videos */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={planData.allowVideoUploadDevice}
                          onChange={(e) => handlePlanToggle(plan, "allowVideoUploadDevice", e.target.checked)}
                          className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                        />
                      </td>

                      {/* External Video Links */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={planData.allowExternalVideoLinks}
                          onChange={(e) => handlePlanToggle(plan, "allowExternalVideoLinks", e.target.checked)}
                          className="w-4 h-4 accent-rose-600 rounded cursor-pointer"
                        />
                      </td>

                      {/* Max Images */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="number"
                          min={1}
                          max={30}
                          value={planData.maxImages}
                          onChange={(e) => handlePlanToggle(plan, "maxImages", parseInt(e.target.value) || 1)}
                          className="w-16 p-1.5 bg-white dark:bg-slate-900 border border-stone-250 dark:border-slate-800 rounded-lg text-xs font-black text-center font-mono outline-none"
                        />
                      </td>

                      {/* Max Videos */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="number"
                          min={0}
                          max={10}
                          value={planData.maxVideos}
                          onChange={(e) => handlePlanToggle(plan, "maxVideos", parseInt(e.target.value) || 0)}
                          className="w-16 p-1.5 bg-white dark:bg-slate-900 border border-stone-250 dark:border-slate-800 rounded-lg text-xs font-black text-center font-mono outline-none"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 3: VISUAL LOGIC & PREVIEW GUARANTEE */}
        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
          <Info className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block">Automatic Merchant UI Adaptation Rules:</span>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] opacity-90 font-mono">
              <li>Both Video methods enabled &rarr; Shows URL link input + device file upload button.</li>
              <li>Only External Video links enabled &rarr; Shows URL link input (device upload button hidden).</li>
              <li>Only Device Video upload enabled &rarr; Shows device upload button (URL link input hidden).</li>
              <li>Both Video methods disabled &rarr; Entire Video block & divider are completely hidden from Add Product UI.</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            style={{ backgroundColor: currentSlideColor }}
            className="px-6 py-3 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer hover:opacity-95 flex items-center gap-2"
          >
            <Check className="w-4 h-4 stroke-[3px]" />
            Save Platform Owner Configurations
          </button>
        </div>

      </form>
    </div>
  );
};

export default PlatformOwnerFeatureManagementCard;
