import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Globe, Check, Search, ChevronDown } from "lucide-react";
import { countryCurrencyMapping, CountryConfig } from "../currency";

interface CountrySelectorProps {
  currentCountry: string;
  onCountryChange: (country: string) => void;
  id?: string;
}

export function CountrySelector({ currentCountry, onCountryChange, id = "country-currency-selector" }: CountrySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeConfig = countryCurrencyMapping[currentCountry] || countryCurrencyMapping["Algeria"];

  const filteredCountries = Object.entries(countryCurrencyMapping).filter(([countryName, info]) => {
    const query = searchQuery.toLowerCase();
    return (
      countryName.toLowerCase().includes(query) ||
      info.currency.toLowerCase().includes(query) ||
      (info.symbol && info.symbol.toLowerCase().includes(query))
    );
  });

  return (
    <div className="relative" id={id} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 border px-3 py-1.5 rounded-xl shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer select-none"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          borderColor: "rgba(255, 255, 255, 0.25)",
        }}
        title="Select Country / Currency"
      >
        <span className="text-[10px] font-black tracking-wider uppercase text-white flex items-center gap-1.5">
          <span className="text-sm leading-none">{activeConfig.flag}</span>
          <span>
            {activeConfig.currency} ({activeConfig.symbol})
          </span>
          <ChevronDown className="w-3 h-3 opacity-60 ml-0.5" />
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.18)] border border-slate-150 overflow-hidden z-[100] flex flex-col p-1"
          >
            {/* Search Input */}
            <div className="p-2 border-b border-slate-100 flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search country or currency..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs text-slate-700 bg-transparent border-none outline-none placeholder-slate-400"
                autoFocus
              />
            </div>

            {/* Header description */}
            <div className="text-[9px] font-extrabold text-slate-400 px-3 py-1.5 uppercase tracking-wider bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <span>Country & Currency Mapping</span>
              <span className="text-[8px] text-indigo-500 font-mono">ISO 4217</span>
            </div>

            {/* List */}
            <div className="max-h-60 overflow-y-auto p-1 space-y-0.5">
              {filteredCountries.length > 0 ? (
                filteredCountries.map(([countryName, info]) => {
                  const isSelected = currentCountry === countryName;
                  return (
                    <button
                      key={countryName}
                      onClick={() => {
                        onCountryChange(countryName);
                        setIsOpen(false);
                        setSearchQuery("");
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-bold rounded-xl transition-all duration-150 flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? "bg-indigo-50/80 text-[#0b3382]"
                          : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="text-base select-none shrink-0">{info.flag}</span>
                        <div className="flex flex-col text-left truncate leading-tight">
                          <span className="font-bold truncate">{countryName}</span>
                          <span className="text-[9px] text-slate-400 font-normal">locale: {info.locale}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {info.currency}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="p-4 text-center text-xs text-slate-400 font-medium">
                  No matching countries found.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
