/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Redesigned as an elegant Maps Canvas
 */

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Map, ZoomIn, ZoomOut, Navigation, Compass, Star, CheckCircle, Maximize2, Globe, Layers, ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion } from "motion/react";
import { MerchantStore } from "../types";
import { WilayaInfo } from "../data";

interface MapCanvasProps {
  stores: MerchantStore[];
  centerLat: number;
  centerLng: number;
  zoom: number;
  onZoomChange?: (zoom: number) => void;
  onViewportChange: (bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number }) => void;
  onSelectStore: (store: MerchantStore) => void;
  selectedStore: MerchantStore | null;
  activeWilaya: WilayaInfo;
  onTeleport: (info: WilayaInfo) => void;
  isProximityActive?: boolean;
  proximityRadius?: number;
  userLocation?: { lat: number; lng: number } | null;
  proximityCenter?: { lat: number; lng: number; label: string } | null;
  hoveredStoreId?: string | null;
  wishlist?: string[];
}



export default function MapCanvas({
  stores,
  centerLat,
  centerLng,
  zoom,
  onZoomChange,
  onViewportChange,
  onSelectStore,
  selectedStore,
  activeWilaya,
  onTeleport,
  isProximityActive = false,
  proximityRadius = 7.5,
  userLocation,
  proximityCenter,
  hoveredStoreId = null,
  wishlist = [],
}: MapCanvasProps) {
  // Map drawing styles: roadmap (standard vector layout) or satellite (dark topography hybrid)
  const [mapStyle, setMapStyle] = useState<"roadmap" | "satellite">("roadmap");

  const dynamicParks = useMemo(() => {
    return [
      { lat: centerLat + 0.03, lng: centerLng - 0.04, r: 120, name: "Central Park Reserve" },
      { lat: centerLat - 0.02, lng: centerLng + 0.06, r: 180, name: "Botanical Green Valley" },
      { lat: centerLat + 0.04, lng: centerLng + 0.02, r: 100, name: "Eco Trails Forest" },
      { lat: centerLat - 0.05, lng: centerLng - 0.03, r: 140, name: "Regional Wildlife Park" }
    ];
  }, [centerLat, centerLng]);

  // Offset variables to pan the map
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Reset pan whenever center coordinates or zoom level change (e.g., user selected another Wilaya)
  useEffect(() => {
    setPanX(0);
    setPanY(0);
  }, [centerLat, centerLng, zoom]);

  // Active carousel index inside the selected store info window popup
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Reset carousel index when the selected store changes
  useEffect(() => {
    setCarouselIndex(0);
  }, [selectedStore?.id]);

  // Derive beautiful thematic carousel images for the selected store
  const selectedStoreCarouselImages = useMemo(() => {
    if (!selectedStore) return [];
    
    // Start with any custom product images
    const images: string[] = [];
    
    // Add product images if any
    if (selectedStore.products && selectedStore.products.length > 0) {
      selectedStore.products.forEach(p => {
        if (p.imageUrl) images.push(p.imageUrl);
        if (p.images && p.images.length > 0) {
          p.images.forEach(img => {
            if (img && !images.includes(img)) images.push(img);
          });
        }
      });
    }

    // Add store's own banner
    if (selectedStore.banner && !images.includes(selectedStore.banner)) {
      images.push(selectedStore.banner);
    }
    
    // Fallback thematic mockups based on category
    const mainCategory = selectedStore.categories?.[0] || "Home";
    const categoryPresets: Record<string, string[]> = {
      Fashion: [
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80",
        "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&q=80",
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80"
      ],
      Crafts: [
        "https://images.unsplash.com/photo-1618220179428-22790b461013?w=400&q=80",
        "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&q=80",
        "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&q=80"
      ],
      Food: [
        "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80",
        "https://images.unsplash.com/photo-1519676867240-f03562e64548?w=400&q=80",
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80"
      ]
    };

    const presets = categoryPresets[mainCategory] || [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=400&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=80"
    ];

    presets.forEach(url => {
      if (images.length < 5 && !images.includes(url)) {
        images.push(url);
      }
    });

    return images;
  }, [selectedStore]);

  // Minimum starting price helper
  const selectedStoreMinPrice = useMemo(() => {
    if (!selectedStore) return 1500;
    const minPrice = selectedStore.products && selectedStore.products.length > 0 
      ? Math.min(...selectedStore.products.map(p => p.price)) 
      : 1500;
    return minPrice;
  }, [selectedStore]);

  // Dimensions of the map viewport, with dynamic ResizeObserver
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(480);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const rectWidth = entries[0].contentRect.width;
      const rectHeight = entries[0].contentRect.height;
      if (rectWidth && rectWidth > 0) {
        setWidth(rectWidth);
      }
      if (rectHeight && rectHeight > 0) {
        setHeight(rectHeight);
      }
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, []);

  // Compute scale coefficient based on zoom
  const scale = useMemo(() => {
    return Math.pow(1.5, zoom - 10) * 1200;
  }, [zoom]);

  // Map projection: Converts (Lat, Lng) to local (X, Y) canvas coordinates relative to the center
  const project = (lat: number, lng: number) => {
    const x = (lng - centerLng) * scale + width / 2 + panX;
    const y = -(lat - centerLat) * scale + height / 2 + panY;
    return { x, y };
  };

  // Reverse projection: Converts local (X, Y) back to (Lat, Lng) coordinates
  const unproject = (x: number, y: number) => {
    const lng = (x - width / 2 - panX) / scale + centerLng;
    const lat = -(y - height / 2 - panY) / scale + centerLat;
    return { lat, lng };
  };

  // Whenever pan or zoom changes, compute the current bounding box in Lat/Lng and notify parent
  useEffect(() => {
    const topLeft = unproject(0, 0);
    const bottomRight = unproject(width, height);
    
    const minLat = Math.min(topLeft.lat, bottomRight.lat);
    const maxLat = Math.max(topLeft.lat, bottomRight.lat);
    const minLng = Math.min(topLeft.lng, bottomRight.lng);
    const maxLng = Math.max(topLeft.lng, bottomRight.lng);

    onViewportChange({ minLat, maxLat, minLng, maxLng });
  }, [panX, panY, centerLat, centerLng, scale]);

  // Handle Drag / Pan gestures
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - panX, y: e.clientY - panY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanX(e.clientX - dragStart.current.x);
    setPanY(e.clientY - dragStart.current.y);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Center on a clicked cluster point and zoom in elegantly
  const handleClusterClick = (c: { id: string; stores: MerchantStore[]; lat: number; lng: number }) => {
    const newZoom = Math.min(15, zoom + 2);
    const newScale = Math.pow(1.5, newZoom - 10) * 1200;

    // Calculate new local coordinate pans for the upcoming center coordinates & scale zoom
    const newPanX = -(c.lng - centerLng) * newScale;
    const newPanY = (c.lat - centerLat) * newScale;

    setPanX(newPanX);
    setPanY(newPanY);

    if (onZoomChange) {
      onZoomChange(newZoom);
    }
  };

  // Group nearby stores in degrees corresponding to targeted screen-pixels to preserve panning stability
  const mapElements = useMemo(() => {
    if (zoom >= 13) {
      // Return raw stores list when zoomed in
      return stores.map((store) => ({
        type: "store" as const,
        id: store.id,
        store,
        lat: store.coordinates.lat,
        lng: store.coordinates.lng,
      }));
    }

    const clusters: {
      id: string;
      stores: MerchantStore[];
      centerLat: number;
      centerLng: number;
    }[] = [];

    // Conversion ratio of pixels back to degree space for stability
    const clusterRadius = 65; // pixel threshold
    const degreeThreshold = clusterRadius / scale;

    stores.forEach((store) => {
      const lat = store.coordinates.lat;
      const lng = store.coordinates.lng;

      let found = false;
      for (const c of clusters) {
        const dLat = lat - c.centerLat;
        const dLng = lng - c.centerLng;
        const dist = Math.sqrt(dLat * dLat + dLng * dLng);

        if (dist < degreeThreshold) {
          c.stores.push(store);
          // Recenter centroid around actual items inside
          const count = c.stores.length;
          c.centerLat = (c.centerLat * (count - 1) + lat) / count;
          c.centerLng = (c.centerLng * (count - 1) + lng) / count;
          found = true;
          break;
        }
      }

      if (!found) {
        clusters.push({
          id: `cluster-${store.id}`,
          stores: [store],
          centerLat: lat,
          centerLng: lng,
        });
      }
    });

    return clusters.map((c) => {
      if (c.stores.length === 1) {
        return {
          type: "store" as const,
          id: c.stores[0].id,
          store: c.stores[0],
          lat: c.stores[0].coordinates.lat,
          lng: c.stores[0].coordinates.lng,
        };
      } else {
        return {
          type: "cluster" as const,
          id: c.id,
          stores: c.stores,
          lat: c.centerLat,
          lng: c.centerLng,
        };
      }
    });
  }, [stores, zoom, scale]);

  // Beautiful decorative background grid and roads for elegant visual commerce map
  const roads = useMemo(() => {
    const tempRoads = [];
    const step = 90;
    // Generate organic concentric grid streets (white)
    for (let i = -1500; i < 2500; i += step) {
      tempRoads.push({
        y1: i,
        y2: i,
        x1: -1500,
        x2: 2500,
        type: i % 270 === 0 ? "highway" : "street",
      });
      tempRoads.push({
        x1: i,
        x2: i,
        y1: -1500,
        y2: 2500,
        type: i % 270 === 0 ? "highway" : "street",
      });
    }

    // Wavy beach/coastline coordinates to represent Mediterranean edge
    const coastPoints = [];
    for (let x = -400; x <= width + 800; x += 30) {
      const sineVal = Math.sin((x - panX) / 140) * 12;
      coastPoints.push({ x, y: height / 4 - 40 + panY + sineVal });
    }

    return { grid: tempRoads, coast: coastPoints };
  }, [panX, panY]);

  // Current center coordinates based on current panning map center
  const currentCenterCoords = useMemo(() => {
    return unproject(width / 2, height / 2);
  }, [panX, panY, scale, centerLat, centerLng]);

  // Pre-calculate proximity search indicator on the map surface
  const proximityCircle = useMemo(() => {
    if (!isProximityActive) return null;
    const centerObj = proximityCenter || { lat: centerLat, lng: centerLng };
    const projectedCenter = project(centerObj.lat, centerObj.lng);
    // 1 degree latitude = 111.12 km
    const radiusInDegrees = proximityRadius / 111.12;
    const pxRadius = radiusInDegrees * scale;
    return {
      cx: projectedCenter.x,
      cy: projectedCenter.y,
      r: pxRadius,
      label: proximityCenter?.label || "Zone de recherche"
    };
  }, [isProximityActive, proximityCenter, centerLat, centerLng, proximityRadius, scale, panX, panY]);

  // Pre-calculate user location GPS dot
  const userLocationDot = useMemo(() => {
    if (!userLocation) return null;
    return project(userLocation.lat, userLocation.lng);
  }, [userLocation, scale, panX, panY, centerLat, centerLng]);

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full h-[450px] lg:h-full rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm transition-all duration-500 ${
        mapStyle === "roadmap" ? "bg-[#F7F6F3]" : "bg-[#1C2C22]"
      }`}
    >
      
      {/* Floating Info / Proximity Stats (Sleek Elegant Look) */}
      <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-slate-100 max-w-xs transition-all duration-300 pointer-events-none">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <h4 className="text-[11px] font-bold text-slate-800 font-sans tracking-tight flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-slate-500 animate-spin" style={{ animationDuration: '8s' }} /> 
            Proximité Algérie
          </h4>
        </div>
        <div className="mt-1 text-[9px] font-mono text-zinc-500 flex justify-between items-center gap-2">
          <span>LAT: {currentCenterCoords.lat.toFixed(4)}°N</span>
          <span>LNG: {currentCenterCoords.lng.toFixed(4)}°E</span>
        </div>
      </div>



      {/* Right Zoom Control Stack (Sleek style: Round, crisp buttons with shadows) */}
      <div className="absolute right-4 bottom-24 z-10 flex flex-col gap-2">
        {/* Recenter / Focus button */}
        <button
          onClick={() => {
            setPanX(0);
            setPanY(0);
          }}
          title="Recadrer la carte"
          className="w-10 h-10 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 hover:text-black rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.12)] border border-slate-100 flex items-center justify-center transition-all cursor-pointer"
        >
          <Navigation className="w-4 h-4" />
        </button>

        {/* Zoom Plus */}
        <button
          onClick={() => {
            if (onZoomChange) onZoomChange(Math.min(16, zoom + 1));
          }}
          title="Zoom avant"
          className="w-10 h-10 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 hover:text-black rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.12)] border border-slate-100 flex items-center justify-center transition-all cursor-pointer"
        >
          <ZoomIn className="w-4 h-4 font-bold" />
        </button>

        {/* Zoom Minus */}
        <button
          onClick={() => {
            if (onZoomChange) onZoomChange(Math.max(8, zoom - 1));
          }}
          title="Zoom arrière"
          className="w-10 h-10 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 hover:text-black rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.12)] border border-slate-100 flex items-center justify-center transition-all cursor-pointer"
        >
          <ZoomOut className="w-4 h-4 font-bold" />
        </button>
      </div>

      {/* Elegant Map Style Toggle Pill at the Bottom-Center of the viewport */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur-md p-1 rounded-full shadow-[0_4px_22px_rgba(0,0,0,0.15)] border border-slate-200 flex items-center gap-1 animate-fade-in pointer-events-auto">
        <button
          onClick={() => setMapStyle("roadmap")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider transition-all duration-200 cursor-pointer ${
            mapStyle === "roadmap"
              ? "bg-zinc-900 border-zinc-900 text-white shadow-xs scale-105"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent"
          }`}
          title="Afficher la carte routière standard"
        >
          <Map className="w-3.5 h-3.5" />
          <span>Roadmap</span>
        </button>
        <button
          onClick={() => setMapStyle("satellite")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider transition-all duration-200 cursor-pointer ${
            mapStyle === "satellite"
              ? "bg-zinc-900 border-zinc-900 text-white shadow-xs scale-105"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent"
          }`}
          title="Afficher le style satellite avec végétation"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Satellite</span>
        </button>
      </div>

      {/* Actual Drawing Canvas Viewport */}
      <div
        className="relative w-full overflow-hidden cursor-grab select-none active:cursor-grabbing shadow-[inset_0_2px_8px_rgba(0,0,0,0.04)] border-t border-slate-100/40"
        style={{ height: `${height}px` }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* SVG visual vector map layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          {/* Custom Stylized Water / Mediterranean Sea Body */}
          {centerLat > 34 && (
            <path
              d={`M -200 -200 
                  L ${width + 400} -200 
                  L ${width + 400} ${height / 4.5 + panY} 
                  Q ${width / 2} ${height / 4.5 + 45 + panY} -200 ${height / 4.5 - 10 + panY} 
                  Z`}
              fill={mapStyle === "roadmap" ? "#BCE1FA" : "#0F1E36"}
              opacity="0.9"
            />
          )}

          {/* Golden coast beach accent */}
          {centerLat > 34 && (
            <path
              d={`M ${roads.coast.map((p) => `${p.x},${p.y}`).join(" L ")}`}
              fill="none"
              stroke={mapStyle === "roadmap" ? "#FBFAF6" : "#C2B280"}
              strokeWidth="5"
              opacity="0.8"
            />
          )}

          {/* Realistic Green Park Reserves / Forests mapped realistically in pan lockstep */}
          {dynamicParks.map((park, pIdx) => {
            const projectedPark = project(park.lat, park.lng);
            const size = (park.r * scale) / 1200;
            // Only draw inside bounds
            if (projectedPark.x < -200 || projectedPark.x > width + 200 || projectedPark.y < -200 || projectedPark.y > height + 200) {
              return null;
            }
            return (
              <g key={`park-${pIdx}`} opacity="0.85">
                <circle
                  cx={projectedPark.x}
                  cy={projectedPark.y}
                  r={size}
                  fill={mapStyle === "roadmap" ? "#E1F2DF" : "#0E2413"}
                />
                {zoom >= 11 && (
                  <text
                    x={projectedPark.x}
                    y={projectedPark.y}
                    fill={mapStyle === "roadmap" ? "#6B9B73" : "#86EFAC"}
                    fontSize="9px"
                    fontWeight="semibold"
                    fontFamily="sans-serif"
                    textAnchor="middle"
                    opacity="0.75"
                    className="pointer-events-none select-none"
                  >
                    {park.name}
                  </text>
                )}
              </g>
            );
          })}

          {/* Streets (Clean white lines with subtle borders) */}
          <g stroke={mapStyle === "roadmap" ? "#FFFFFF" : "rgba(255, 255, 255, 0.12)"} strokeWidth="1.75">
            {roads.grid
              .filter((r) => r.type === "street")
              .map((road, i) =>
                road.y1 === road.y2 ? (
                  <line
                    key={`h-${i}`}
                    x1={road.x1 + panX}
                    y1={road.y1 + panY}
                    x2={road.x2 + panX}
                    y2={road.y2 + panY}
                  />
                ) : (
                  <line
                    key={`v-${i}`}
                    x1={road.x1 + panX}
                    y1={road.y1 + panY}
                    x2={road.x2 + panX}
                    y2={road.y2 + panY}
                  />
                )
              )}
          </g>

          {/* Major High-speed Express Highways (Crisp wide lanes) */}
          <g stroke={mapStyle === "roadmap" ? "#ffffff" : "rgba(255, 255, 255, 0.3)"} strokeWidth="3.5">
            {roads.grid
              .filter((r) => r.type === "highway")
              .map((road, i) =>
                road.y1 === road.y2 ? (
                  <line
                    key={`highway-h-${i}`}
                    x1={road.x1 + panX}
                    y1={road.y1 + panY}
                    x2={road.x2 + panX}
                    y2={road.y2 + panY}
                  />
                ) : (
                  <line
                    key={`highway-v-${i}`}
                    x1={road.x1 + panX}
                    y1={road.y1 + panY}
                    x2={road.x2 + panX}
                    y2={road.y2 + panY}
                  />
                )
              )}
          </g>

          {/* Highway yellow inner core */}
          <g stroke={mapStyle === "roadmap" ? "#FFF1C2" : "#F59E0B"} strokeWidth="1.5">
            {roads.grid
              .filter((r) => r.type === "highway")
              .map((road, i) =>
                road.y1 === road.y2 ? (
                  <line
                    key={`highway-core-h-${i}`}
                    x1={road.x1 + panX}
                    y1={road.y1 + panY}
                    x2={road.x2 + panX}
                    y2={road.y2 + panY}
                  />
                ) : (
                  <line
                    key={`highway-core-v-${i}`}
                    x1={road.x1 + panX}
                    y1={road.y1 + panY}
                    x2={road.x2 + panX}
                    y2={road.y2 + panY}
                  />
                )
              )}
          </g>

          {/* Proximity Circle (Sleek Style) */}
          {proximityCircle && (
            <g>
              {/* Outer boundary fill */}
              <circle
                cx={proximityCircle.cx}
                cy={proximityCircle.cy}
                r={proximityCircle.r}
                fill="rgba(244, 63, 94, 0.04)"
                stroke="#F43F5E"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                className="transition-all duration-300"
              />
              {/* Subtle inner concentric guide line */}
              <circle
                cx={proximityCircle.cx}
                cy={proximityCircle.cy}
                r={proximityCircle.r * 0.9}
                fill="none"
                stroke="rgba(244, 63, 94, 0.12)"
                strokeWidth="0.75"
              />
              {/* Floating radius text label inside the search bounds */}
              {zoom >= 11 && (
                <g transform={`translate(${proximityCircle.cx}, ${proximityCircle.cy - proximityCircle.r + 14})`}>
                  <rect
                    x="-65"
                    y="-8"
                    width="130"
                    height="16"
                    rx="8"
                    fill="#F43F5E"
                    stroke="#ffffff"
                    strokeWidth="1"
                    className="shadow-sm"
                  />
                  <text
                    x="0"
                    y="3"
                    fill="#ffffff"
                    fontSize="8px"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                    textAnchor="middle"
                  >
                    RAYON DE RECHERCHE: {proximityRadius} KM
                  </text>
                </g>
              )}
            </g>
          )}

          {/* User Location GPS Dot (Custom pulsing blue beacon) */}
          {userLocationDot && (
            <g>
              {/* Pulsing radar shadow halo */}
              <circle
                cx={userLocationDot.x}
                cy={userLocationDot.y}
                r={24}
                fill="none"
                stroke="#3B82F6"
                strokeWidth="1.5"
                opacity="0.25"
              >
                <animate
                  attributeName="r"
                  values="10;32"
                  dur="3s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.4;0"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </circle>
              {/* Pulse ripple fill */}
              <circle
                cx={userLocationDot.x}
                cy={userLocationDot.y}
                r={12}
                fill="rgba(59, 130, 246, 0.15)"
              />
              {/* Crisp white outer sleeve */}
              <circle
                cx={userLocationDot.x}
                cy={userLocationDot.y}
                r={7.5}
                fill="#3B82F6"
                stroke="#ffffff"
                strokeWidth="2"
              />
              {/* Deep sapphire center core */}
              <circle
                cx={userLocationDot.x}
                cy={userLocationDot.y}
                r={3}
                fill="#1D4ED8"
              />
            </g>
          )}

          {/* Proximity Scanning Radar visual circles */}
          <circle
            cx={width / 2 + panX}
            cy={height / 2 + panY}
            r={130}
            fill="rgba(244, 63, 94, 0.01)"
            stroke={mapStyle === "roadmap" ? "rgba(244, 63, 94, 0.08)" : "rgba(251, 113, 133, 0.2)"}
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <circle
            cx={width / 2 + panX}
            cy={height / 2 + panY}
            r={5}
            fill={mapStyle === "roadmap" ? "#F43F5E" : "#FB7185"}
          />
        </svg>

        {/* Dynamic Price tag overlay items OR Clustered Bubbles */}
        {mapElements.map((element) => {
          if (element.type === "cluster") {
            const { x, y } = project(element.lat, element.lng);

            // Hide if realistically out of the visible screen canvas bounds (+ offset margin)
            if (x < -100 || x > width + 100 || y < -100 || y > height + 100) {
              return null;
            }

            const count = element.stores.length;
            const topLogos = element.stores.slice(0, 3).map(s => s.logo);
            const isHeavyCluster = count > 4;

            return (
              <motion.div
                key={element.id}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => handleClusterClick(element)}
                className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30 group"
                style={{
                  left: `${x}px`,
                  top: `${y}px`,
                }}
              >
                {/* Micro-pulsing premium outer radar ring */}
                <div className={`absolute inset-0 -m-3 rounded-full bg-rose-500/10 border border-rose-500/20 group-hover:scale-115 transition-all duration-500 scale-100 ${isHeavyCluster ? "animate-pulse" : ""}`} />

                {/* Main luxurious cluster visual container */}
                <div className="relative bg-gradient-to-r from-rose-500 via-pink-600 to-orange-500 hover:brightness-105 text-white font-extrabold px-3 py-1.5 rounded-full border-2 border-white flex items-center gap-2 shadow-[0_6px_22px_rgba(225,29,72,0.35)] hover:shadow-[0_12px_28px_rgba(225,29,72,0.55)] transition-all duration-300 scale-100 group-hover:scale-105 active:scale-95 whitespace-nowrap">
                  
                  {/* Overlapped Store Logos in cluster */}
                  <div className="flex -space-x-2.5 items-center">
                    {topLogos.map((logoUrl, lIdx) => (
                      <div 
                        key={lIdx} 
                        className="w-5 h-5 rounded-full overflow-hidden border border-white bg-white/10 shadow-3xs"
                        style={{ zIndex: 10 - lIdx }}
                      >
                        <img src={logoUrl} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>

                  {/* Summary labels */}
                  <div className="flex flex-col text-left leading-none font-sans">
                    <span className="text-xs font-black tracking-tight">{count}</span>
                    <span className="text-[7.5px] uppercase tracking-wider font-extrabold opacity-95">Boutiques</span>
                  </div>

                  {/* Zone status indicator label */}
                  <span className="bg-white/20 px-1.5 py-0.5 rounded-full text-[8.5px] font-black tracking-tighter shadow-3xs">
                    {isHeavyCluster ? "Dense" : "Zone"}
                  </span>
                </div>

                {/* Visual marker bottom pointer */}
                <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-pink-650 mx-auto -mt-[1px] shadow-xs" />
              </motion.div>
            );
          }

          // Render ordinary unclustered dynamic store marker
          const store = element.store!;
          const { x, y } = project(store.coordinates.lat, store.coordinates.lng);
          const isSelected = selectedStore?.id === store.id;
          const isHovered = store.id === hoveredStoreId;

          if (x < -100 || x > width + 100 || y < -100 || y > height + 100) {
            return null;
          }

          const minPrice = store.products && store.products.length > 0 
            ? Math.min(...store.products.map(p => p.price)) 
            : 1500;

          const displayPrice = `${minPrice.toLocaleString()} DA`;
          const hasWishlistItem = store.products?.some(p => wishlist?.includes(p.id || p.name));

          return (
            <motion.div
              key={store.id}
              initial={{ opacity: 0, scale: 0.6, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 20,
              }}
              className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-full transition-[left,top] duration-500 ease-out"
              style={{
                left: `${x}px`,
                top: `${y}px`,
                zIndex: isSelected ? 50 : 25,
              }}
            >
              {hasWishlistItem && (
                <div className="absolute -top-1.5 -right-1.5 z-30 bg-rose-500 text-white rounded-full p-0.5 shadow-md flex items-center justify-center animate-bounce border border-white">
                  <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectStore(store);
                }}
                className={
                  isSelected
                    ? `p-1 pr-3 rounded-full shadow-[0_8px_24px_rgba(11,51,130,0.3)] border-2 border-indigo-400 bg-[#0b3382] text-white scale-110 transition-all duration-300 whitespace-nowrap flex items-center justify-center cursor-pointer font-sans select-none ${isHovered ? "animate-soft-pulse" : ""}`
                    : `p-0.5 pr-2.5 rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_14px_rgba(0,0,0,0.2)] border-2 border-[#0b3382] bg-white text-slate-900 transition-all duration-300 whitespace-nowrap flex items-center justify-center cursor-pointer font-sans select-none hover:-translate-y-0.5 hover:scale-105 active:scale-95 ${isHovered ? "animate-soft-pulse" : ""}`
                }
              >
                {isSelected ? (
                  <div className="flex items-center gap-1.5 h-7 text-white">
                    <div className="w-6 h-6 rounded-full overflow-hidden border border-white/40 shrink-0 bg-transparent flex items-center justify-center">
                      <img
                        src={store.logo}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col text-left leading-tight pr-1">
                      <span className="text-[9px] font-bold text-indigo-200 truncate max-w-[65px]">
                        {store.name.split(' ')[0]}
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-black text-amber-300">
                          {displayPrice}
                        </span>
                        <span className="text-[8px] font-extrabold flex items-center text-amber-300">
                          ★{store.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 h-7 text-slate-900">
                    <div className="w-5.5 h-5.5 rounded-full overflow-hidden border border-slate-200/60 shrink-0 bg-transparent flex items-center justify-center">
                      <img
                        src={store.logo}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col text-left leading-tight pr-1">
                      <span className="text-[9px] font-bold text-slate-500 truncate max-w-[55px]">
                        {store.name.split(' ')[0]}
                      </span>
                      <span className="text-[10px] font-black text-[#0b3382]">
                        {displayPrice}
                      </span>
                    </div>
                  </div>
                )}
              </button>

              <div 
                className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] mx-auto -mt-[1px] shadow-3xs"
                style={{
                  borderTopColor: isSelected ? "#0b3382" : "#0b3382",
                }}
              />
            </motion.div>
          );
        })}

        {/* Dynamic Custom InfoWindow Popup Card */}
        {selectedStore && (() => {
          const selectedStorePos = project(selectedStore.coordinates.lat, selectedStore.coordinates.lng);
          return (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 26 }}
              className="absolute pointer-events-auto z-50 bg-white rounded-2xl shadow-[0_12px_28px_rgba(0,0,0,0.18)] border border-slate-100/90 w-[230px] overflow-hidden flex flex-col font-sans transition-[left,top] duration-500 ease-out"
              style={{
                left: `${selectedStorePos.x}px`,
                top: `${selectedStorePos.y - 45}px`,
                transform: "translate(-50%, -100%)",
              }}
              onClick={(e) => {
                // Stop clicks inside the info window from propagating to trigger map drags
                e.stopPropagation();
              }}
            >
              {/* Image Slider Wrapper */}
              <div className="relative h-28 w-full group overflow-hidden bg-slate-100">
                <img
                  src={selectedStoreCarouselImages[carouselIndex] || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400"}
                  alt={selectedStore.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover select-none pointer-events-none transition-all duration-300"
                />

                {/* Close Button ("X") */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onSelectStore(null as any);
                  }}
                  className="absolute right-2 top-2 z-20 bg-black/50 hover:bg-black/75 cursor-pointer text-white p-1 rounded-full transition-all flex items-center justify-center border border-white/10"
                  aria-label="Close details"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                {/* Slider Arrows (Only if multiple images exist) */}
                {selectedStoreCarouselImages.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setCarouselIndex((prev) => (prev === 0 ? selectedStoreCarouselImages.length - 1 : prev - 1));
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-white/95 hover:bg-white border border-slate-200/80 shadow-3xs hover:scale-110 active:scale-95 flex items-center justify-center text-slate-700 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setCarouselIndex((prev) => (prev === selectedStoreCarouselImages.length - 1 ? 0 : prev + 1));
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-white/95 hover:bg-white border border-slate-200/80 shadow-3xs hover:scale-110 active:scale-95 flex items-center justify-center text-slate-700 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}

                {/* Carousel Pagination Dots */}
                {selectedStoreCarouselImages.length > 1 && (
                  <div className="absolute bottom-2 left-0 right-0 z-20 flex justify-center gap-1.5">
                    {selectedStoreCarouselImages.map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${
                          idx === carouselIndex ? "bg-white scale-125 shadow-3xs" : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Product/Store Details Section */}
              <div className="p-3 flex flex-col gap-1 text-left">
                {/* Category & Wilaya Row */}
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">
                  {selectedStore.categories?.[0] || "Artisan"} in {selectedStore.wilaya}
                </div>

                {/* Title / Store Name */}
                <h4 className="text-[13px] font-bold text-slate-900 leading-snug truncate hover:text-[#0b3382] transition-colors">
                  {selectedStore.name}
                </h4>

                {/* Star Rating Line */}
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="flex items-center gap-0.5 font-bold text-slate-800">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {selectedStore.rating.toFixed(1)}
                  </span>
                  <span className="text-slate-400 font-medium">•</span>
                  <span className="text-slate-500 font-medium">
                    {selectedStore.reviews?.length || 0} reviews
                  </span>
                </div>

                {/* Pricing & Free Cancellation Badge */}
                <div className="mt-1 pt-1.5 border-t border-slate-100/80 flex flex-col gap-1.5">
                  <div className="text-xs text-slate-900">
                    <span className="font-extrabold text-sm text-[#0b3382]">
                      {selectedStoreMinPrice.toLocaleString()} DA
                    </span>
                    <span className="text-slate-500 font-medium text-[10px] ml-1">/ starting pack</span>
                  </div>
                  
                  {/* Free Cancellation and verified badge */}
                  <div className="flex flex-wrap gap-1">
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-50 text-emerald-700 font-extrabold border border-emerald-100/60 shadow-3xs">
                      Free Cancellation
                    </span>
                    {selectedStore.verified && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] bg-sky-50 text-sky-700 font-extrabold border border-sky-100/60 shadow-3xs">
                        Verified Seller
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Pointer Pin at bottom center */}
              <div 
                className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[7px] border-t-white" 
              />
            </motion.div>
          );
        })()}

        {/* Realistic Google Logo Watermark (bottom-left) */}
        <div className="absolute left-3 bottom-3 z-10 select-none pointer-events-none flex items-center gap-1">
          <span className={`font-sans text-xs tracking-tight antialiased font-semibold ${
            mapStyle === "roadmap" ? "text-slate-500/70" : "text-white/60"
          }`}>
            <span className="text-[#4285F4]">G</span>
            <span className="text-[#EA4335]">o</span>
            <span className="text-[#FBBC05]">o</span>
            <span className="text-[#4285F4]">g</span>
            <span className="text-[#34A853]">l</span>
            <span className="text-[#EA4335]">e</span>
          </span>
        </div>

        {/* Realistic Google Map Meta Credits (bottom-right) */}
        <div className={`absolute right-3 bottom-3 z-10 text-[9px] font-mono tracking-tight select-none pointer-events-none hidden md:flex items-center gap-2 px-2 py-0.5 rounded backdrop-blur-[2px] ${
          mapStyle === "roadmap" ? "text-slate-500/80 bg-white/20" : "text-white/60 bg-black/20"
        }`}>
          <span>Keyboard shortcuts</span>
          <span>Map Data ©2026 Google</span>
          <span>1 km</span>
          <span>Terms</span>
          <span>Report a map error</span>
        </div>
      </div>


    </div>
  );
}
