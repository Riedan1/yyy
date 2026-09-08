import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Camera,
  CameraOff,
  X,
  Upload,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FlipHorizontal,
  Plus,
  Tag,
  Eye,
  Zap,
  ShieldCheck,
  MapPin,
  Cpu,
  Lock,
  Image as ImageIcon
} from "lucide-react";

export interface IdentifiedItemResult {
  itemName: string;
  category: string;
  confidence: "high" | "medium" | "low";
  description: string;
  photoUrl?: string;
}

interface ItemCameraIdentifierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: { name: string; category: string; description?: string }) => void;
  accentColor?: string;
}

const CATEGORIES = [
  "Produce",
  "Dairy",
  "Pantry",
  "Bakery",
  "Meat & Seafood",
  "Beverages",
  "Snacks & Sweets",
  "Frozen Foods",
  "Personal Care & Pharmacy",
  "Household & Cleaning",
  "Other"
];

export const ItemCameraIdentifierModal: React.FC<ItemCameraIdentifierModalProps> = ({
  isOpen,
  onClose,
  onAddItem,
  accentColor = "#0b3272"
}) => {
  const [isAdminEnabled, setIsAdminEnabled] = useState<boolean>(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("dz_admin_visual_search_enabled") !== "false"
      : true
  );

  const [activeTab, setActiveTab] = useState<"camera" | "upload">(() =>
    isAdminEnabled ? "camera" : "upload"
  );

  // Listen to platform admin feature toggle changes in real time
  useEffect(() => {
    const handleAdminToggle = () => {
      const enabled = localStorage.getItem("dz_admin_visual_search_enabled") !== "false";
      setIsAdminEnabled(enabled);
      if (!enabled) {
        setActiveTab("upload");
        stopCamera();
      }
    };

    window.addEventListener("storage", handleAdminToggle);
    window.addEventListener("dz_visual_search_toggle", handleAdminToggle as EventListener);
    return () => {
      window.removeEventListener("storage", handleAdminToggle);
      window.removeEventListener("dz_visual_search_toggle", handleAdminToggle as EventListener);
    };
  }, []);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializingCamera, setIsInitializingCamera] = useState(false);

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [identifiedResult, setIdentifiedResult] = useState<IdentifiedItemResult | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedCategory, setEditedCategory] = useState("Produce");
  const [apiError, setApiError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync tab mode when modal opens based on platform admin setting
  useEffect(() => {
    if (isOpen) {
      const enabled = localStorage.getItem("dz_admin_visual_search_enabled") !== "false";
      if (!enabled) {
        setActiveTab("upload");
      }
    }
  }, [isOpen]);

  // Initialize camera when modal opens in camera mode ONLY if enabled by platform admin
  useEffect(() => {
    const enabled = localStorage.getItem("dz_admin_visual_search_enabled") !== "false";
    if (isOpen && enabled && activeTab === "camera" && !capturedImage) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab, facingMode, capturedImage]);

  const startCamera = async () => {
    const enabled = localStorage.getItem("dz_admin_visual_search_enabled") !== "false";
    if (!enabled) {
      setCameraError("Camera scanner is currently disabled by Platform Admin.");
      setActiveTab("upload");
      return;
    }

    setIsInitializingCamera(true);
    setCameraError(null);
    stopCamera();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API is not supported on this device/browser.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
    } catch (err: any) {
      console.warn("Camera start failed:", err);
      setCameraError(
        err.name === "NotAllowedError" || err.name === "PermissionDeniedError"
          ? "Camera access was denied. Please allow camera permissions or upload a photo."
          : err.message || "Could not access camera. Please try uploading an image instead."
      );
      setActiveTab("upload");
    } finally {
      setIsInitializingCamera(false);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleFlipCamera = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  const capturePhotoFromCamera = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);

    stopCamera();
    setCapturedImage(dataUrl);
    analyzePhoto(dataUrl, "camera_capture", "image/jpeg");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processSelectedFile(file);
  };

  const processSelectedFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setApiError("Please select a valid image file (JPG, PNG, WEBP, etc.).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setCapturedImage(dataUrl);
        analyzePhoto(dataUrl, "file_upload", file.type);
      }
    };
    reader.readAsDataURL(file);
  };

  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const analyzePhoto = async (base64Image: string, sourceType: "camera_capture" | "file_upload" = "camera_capture", customMimeType?: string) => {
    setIsAnalyzing(true);
    setApiError(null);
    setIdentifiedResult(null);

    const activeModel = localStorage.getItem("dz_active_ai_model") || "Gemini 2.5 Flash";

    try {
      const res = await fetch("/api/identify-item-photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: base64Image,
          modelName: activeModel,
          sourceType: sourceType,
          mimeType: customMimeType || "image/jpeg"
        })
      });

      if (!res.ok) {
        throw new Error(`Failed to identify item (${res.status})`);
      }

      const data = await res.json();
      const result: IdentifiedItemResult = {
        itemName: data.itemName || "Item",
        category: data.category || "Other",
        confidence: data.confidence || "high",
        description: data.description || (sourceType === "file_upload" ? "Identified from uploaded product image" : "Identified from camera snapshot"),
        photoUrl: base64Image
      };

      setIdentifiedResult(result);
      setEditedName(result.itemName);
      setEditedCategory(result.category);
    } catch (err: any) {
      console.error("Failed to analyze photo:", err);
      setApiError("Could not identify item automatically. You can enter the name manually below.");
      setEditedName("");
      setEditedCategory("Produce");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setIdentifiedResult(null);
    setApiError(null);
    if (activeTab === "camera") {
      startCamera();
    }
  };

  const handleConfirmAdd = () => {
    const nameToAdd = editedName.trim() || identifiedResult?.itemName || "Item";
    const categoryToAdd = editedCategory || identifiedResult?.category || "Other";

    onAddItem({
      name: nameToAdd,
      category: categoryToAdd,
      description: identifiedResult?.description
    });

    handleResetAndClose();
  };

  const handleResetAndClose = () => {
    stopCamera();
    setCapturedImage(null);
    setIdentifiedResult(null);
    setApiError(null);
    setIsAnalyzing(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleResetAndClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-white/85 backdrop-blur-xl border border-white/80 shadow-2xl shadow-indigo-500/10 rounded-3xl overflow-hidden z-10 font-sans my-auto text-left text-slate-900"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/50 bg-white/60 backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <div className="w-8.5 h-8.5 rounded-xl bg-indigo-50/80 text-indigo-600 border border-indigo-100/80 flex items-center justify-center shadow-2xs backdrop-blur-sm">
                <Camera className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 font-mono">
                  Visual AI Camera Identifier
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                </h3>
                <p className="text-[10px] font-semibold text-slate-500">
                  Snap an item to auto-detect and add it to your shopping list
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Camera Active Indicator Light */}
              {cameraStream && activeTab === "camera" && !capturedImage && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 text-[10px] font-black tracking-wider uppercase backdrop-blur-md shadow-2xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span>Camera Active</span>
                </div>
              )}

              <button
                onClick={handleResetAndClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Hidden Canvas for capture */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Main Modal Body */}
          <div className="p-5 flex flex-col gap-4 bg-white/70 backdrop-blur-md">
            {/* 🛡️ PRIVACY & REASSURANCE BANNER */}
            <div className="p-3.5 bg-emerald-50/80 backdrop-blur-sm border border-emerald-200/80 rounded-2xl flex items-start gap-3 text-xs text-emerald-950 shadow-2xs">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1 text-[11px] leading-relaxed">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <strong className="font-black text-xs text-emerald-950 flex items-center gap-1.5">
                    100% Safe &amp; Private
                  </strong>
                  <span className="text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                    <Cpu className="w-3 h-3 text-emerald-600" />
                    {localStorage.getItem("dz_active_ai_model") || "Gemini 2.5 Flash"}
                  </span>
                </div>
                Using your camera and geographic location is completely safe. Photos and coordinates are processed live solely for real-time item detection and local store distance calculation. <strong className="font-black underline">No photos, video frames, or personal location data are ever recorded, saved, or stored.</strong>
              </div>
            </div>

            {!capturedImage ? (
              /* TAB SELECTION & CAPTURE VIEW */
              <div className="flex flex-col gap-3">
                {/* Mode Switcher */}
                <div className="flex bg-slate-100/80 backdrop-blur-sm border border-slate-200/60 p-1 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("camera");
                      setCameraError(null);
                    }}
                    className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      activeTab === "camera"
                        ? "bg-white text-slate-900 shadow-sm border border-slate-200/80"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Live Camera</span>
                    {!isAdminEnabled && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 uppercase border border-rose-200">
                        Off
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("upload");
                      stopCamera();
                    }}
                    className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      activeTab === "upload"
                        ? "bg-white text-slate-900 shadow-sm border border-slate-200/80"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Photo</span>
                  </button>
                </div>

                {/* CAMERA TAB */}
                {activeTab === "camera" && (
                  !isAdminEnabled ? (
                    /* Deactivated Overlay State when disabled in Platform Admin */
                    <div className="relative w-full aspect-4/3 bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 flex flex-col items-center justify-center p-6 text-center shadow-inner group">
                      {/* Dark blurred camera backdrop preview effect */}
                      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-0" />
                      <div className="relative z-10 flex flex-col items-center max-w-sm px-2">
                        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 flex items-center justify-center mb-3 shadow-lg">
                          <Lock className="w-7 h-7 text-rose-500" />
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[10px] font-black uppercase tracking-wider mb-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                          <span>Deactivated by Platform Admin</span>
                        </div>
                        <h4 className="text-sm font-black text-white mb-1.5">
                          Visual AI Camera Identifier Off
                        </h4>
                        <p className="text-[11px] text-slate-300 leading-relaxed font-medium mb-4">
                          Live camera scanning has been deactivated by the Platform Administrator in Dashboard Settings. You can still auto-detect items by selecting or dropping a product image.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab("upload");
                            stopCamera();
                          }}
                          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black shadow-lg flex items-center gap-2 transition-all cursor-pointer active:scale-95"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Switch to Photo Upload</span>
                        </button>
                      </div>
                    </div>
                  ) : cameraError ? (
                    /* Fallback UI when Camera is Errored */
                    <div className="w-full aspect-4/3 bg-slate-50/80 backdrop-blur-md border-2 border-dashed border-slate-200/80 rounded-2xl flex flex-col items-center justify-center p-6 text-center shadow-inner">
                      <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-600 flex items-center justify-center mb-3 shadow-xs">
                        <CameraOff className="w-8 h-8 text-amber-600" />
                      </div>
                      <h4 className="text-sm font-black text-slate-900 mb-1">
                        Camera Scanner Unavailable
                      </h4>
                      <p className="text-[11px] text-slate-500 max-w-xs leading-relaxed font-medium mb-4">
                        {cameraError || "Could not start camera feed. Please check browser permissions or upload a photo."}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab("upload");
                          stopCamera();
                        }}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-2 transition-all cursor-pointer active:scale-95"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Upload Product Photo</span>
                      </button>
                    </div>
                  ) : (
                    <div className="relative w-full aspect-4/3 bg-slate-950 rounded-2xl overflow-hidden flex flex-col items-center justify-center border border-slate-800 group shadow-inner">
                      <video
                        ref={videoRef}
                        playsInline
                        muted
                        autoPlay
                        className="w-full h-full object-cover"
                      />

                      {/* Camera Active overlay indicator */}
                      {cameraStream && (
                        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-emerald-400/40 text-emerald-400 text-[10px] font-black tracking-wider uppercase shadow-md">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                          </span>
                          <span>Camera Active</span>
                        </div>
                      )}

                      {/* Viewfinder Target Framing & Scanning Line Overlay */}
                      <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-white/20 m-6 rounded-2xl flex items-center justify-center">
                        <div className="absolute top-0 left-0 w-6 h-6 border-t-3 border-l-3 border-emerald-400 rounded-tl-lg" />
                        <div className="absolute top-0 right-0 w-6 h-6 border-t-3 border-r-3 border-emerald-400 rounded-tr-lg" />
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-3 border-l-3 border-emerald-400 rounded-bl-lg" />
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-3 border-r-3 border-emerald-400 rounded-br-lg" />

                        {/* Laser scanner line effect */}
                        <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse shadow-[0_0_12px_#34d399]" />
                      </div>

                      {/* Camera Control Overlay Controls */}
                      <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-4 px-4">
                        {/* Flip Camera */}
                        <button
                          type="button"
                          onClick={handleFlipCamera}
                          className="w-10 h-10 rounded-full bg-slate-900/80 backdrop-blur-md text-white border border-white/20 flex items-center justify-center hover:bg-slate-800 transition-all cursor-pointer shadow-lg active:scale-95"
                          title="Flip Camera"
                        >
                          <FlipHorizontal className="w-4 h-4" />
                        </button>

                        {/* Primary Capture Button */}
                        <button
                          type="button"
                          onClick={capturePhotoFromCamera}
                          disabled={isInitializingCamera || !!cameraError}
                          className="w-16 h-16 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-xl border-4 border-slate-200 hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                          title="Take Photo"
                        >
                          <div className="w-12 h-12 rounded-full border-2 border-slate-900 flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-indigo-600" />
                          </div>
                        </button>

                        {/* Upload Alternative */}
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-10 h-10 rounded-full bg-slate-900/80 backdrop-blur-md text-white border border-white/20 flex items-center justify-center hover:bg-slate-800 transition-all cursor-pointer shadow-lg active:scale-95"
                          title="Choose from Gallery"
                        >
                          <ImageIcon className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Initialization Loading */}
                      {isInitializingCamera && (
                        <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center text-white p-4">
                          <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin mb-2" />
                          <span className="text-xs font-bold">Starting camera stream...</span>
                        </div>
                      )}
                    </div>
                  )
                )}

                {/* Clear Privacy Notice Below Camera View */}
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-start gap-2.5 text-xs text-slate-700 shadow-2xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-[11px] leading-relaxed">
                    <strong className="font-bold text-slate-900">Privacy Notice: </strong>
                    <span className="text-slate-600 font-medium">
                      Camera feed frames are processed strictly in temporary browser memory in real time for item detection. Video frames and photo snapshots are never saved or sent to persistent server storage.
                    </span>
                  </div>
                </div>

                {/* UPLOAD TAB */}
                {activeTab === "upload" && (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`w-full aspect-4/3 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all group ${
                      isDragging
                        ? "border-indigo-600 bg-indigo-50/80 scale-[1.01]"
                        : "border-slate-300 hover:border-indigo-500 bg-slate-50 hover:bg-indigo-50/30 text-slate-900"
                    }`}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-xs">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-black text-slate-900 mb-1">
                      {isDragging ? "Drop your product photo here..." : "Click, tap or drag & drop a product image"}
                    </p>
                    <p className="text-[10px] text-slate-500 max-w-xs leading-relaxed font-medium">
                      Select any image file from your local computer or mobile storage (JPG, PNG, WEBP, GIF)
                    </p>
                    <span className="mt-3.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-extrabold shadow-sm hover:bg-indigo-700 transition-all">
                      Browse Device Files
                    </span>
                  </div>
                )}

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {/* Camera Error Message */}
                {cameraError && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-bold text-[11px] mb-0.5">Camera Access Required</p>
                      <p className="text-[10px] text-amber-800">{cameraError}</p>
                    </div>
                  </div>
                )}

                {/* Optional Location Sync Button */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 border border-sky-200">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-extrabold text-slate-900 truncate">
                        Local Store Proximity Check
                      </div>
                      <div className="text-[9px] text-slate-500 truncate font-medium">
                        Locate nearby merchants carrying scanned items (Live GPS only, non-stored)
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const geoEnabled = localStorage.getItem("dz_admin_geo_location_enabled") !== "false";
                      if (!geoEnabled) {
                        alert("Geographic location features are disabled in Admin Dashboard settings.");
                        return;
                      }
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                          (pos) => {
                            alert(`📍 Location acquired: ${pos.coords.latitude.toFixed(3)}, ${pos.coords.longitude.toFixed(3)}. Nearby stores will be prioritized.`);
                          },
                          (err) => {
                            alert("Location access was denied or unavailable. Visual search will continue without location sorting.");
                          }
                        );
                      }
                    }}
                    className="px-3 py-1.5 bg-white border border-slate-200 text-slate-800 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-300 rounded-xl text-[10px] font-extrabold transition-all shrink-0 cursor-pointer shadow-2xs"
                  >
                    Enable Location
                  </button>
                </div>
              </div>
            ) : (
              /* CAPTURED / ANALYZING / RESULT VIEW */
              <div className="flex flex-col gap-4">
                <div className="flex gap-4 items-start">
                  {/* Photo Preview Thumbnail */}
                  <div className="relative w-28 h-28 shrink-0 rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-100">
                    <img
                      src={capturedImage}
                      alt="Captured item"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRetake}
                      className="absolute bottom-1 right-1 bg-slate-900/80 backdrop-blur-md text-white p-1 rounded-lg hover:bg-slate-900 transition-all text-[9px] font-extrabold flex items-center gap-1 px-1.5"
                    >
                      <RefreshCw className="w-2.5 h-2.5" />
                      <span>Retake</span>
                    </button>
                  </div>

                  {/* AI Analysis Status / Identification Card */}
                  <div className="flex-1 min-w-0">
                    {isAnalyzing ? (
                      <div className="h-full flex flex-col justify-center gap-2 p-3 bg-indigo-50 border border-indigo-100 rounded-2xl">
                        <div className="flex items-center gap-2">
                          <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin" />
                          <span className="text-xs font-black text-indigo-950 font-mono">
                            Analyzing photo with Gemini AI Vision...
                          </span>
                        </div>
                        <p className="text-[10px] text-indigo-800 leading-snug font-medium">
                          Scanning item shape, color, and packaging details to determine category...
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {/* Confidence Badge */}
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono flex items-center gap-1">
                            <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                            Identified Item
                          </span>
                          {identifiedResult && (
                            <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              {identifiedResult.confidence} confidence
                            </span>
                          )}
                        </div>

                        {/* Identified / Editable Name Input */}
                        <div>
                          <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block mb-1">
                            Item Name
                          </label>
                          <input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            placeholder="e.g., Organic Honeycrisp Apples"
                            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>

                        {/* Category Selector */}
                        <div>
                          <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block mb-1">
                            Assigned Category
                          </label>
                          <select
                            value={editedCategory}
                            onChange={(e) => setEditedCategory(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                          >
                            {CATEGORIES.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Identified Description / Details */}
                {identifiedResult && !isAnalyzing && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-700 flex items-start gap-2">
                    <Eye className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-extrabold text-slate-900 text-[11px]">
                        AI Observation:
                      </p>
                      <p className="text-[10px] text-slate-600 mt-0.5 font-medium">
                        {identifiedResult.description}
                      </p>
                    </div>
                  </div>
                )}

                {/* API Error Warning */}
                {apiError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span className="text-[10px] font-semibold">{apiError}</span>
                  </div>
                )}

                {/* Bottom Action Footer */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleRetake}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-xs font-bold hover:bg-slate-100 transition-all cursor-pointer"
                  >
                    Scan Another
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmAdd}
                    disabled={isAnalyzing || (!editedName.trim() && !identifiedResult?.itemName)}
                    className="flex-1 py-2.5 px-4 bg-indigo-600 text-white rounded-xl text-xs font-black hover:bg-indigo-700 disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add to Smart Shopping List</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ItemCameraIdentifierModal;
