import React, { useState, useRef, useEffect, useMemo } from "react";
import { Search, ChevronDown, Check, X, Plus, Edit3 } from "lucide-react";

export interface SearchOption {
  code: string;
  name: string;
  displayLabel?: string;
  subtitle?: string;
}

interface SearchableLocationSelectProps {
  label: string;
  required?: boolean;
  value: string; // selected code or name
  onChange: (selected: SearchOption) => void;
  options: SearchOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  icon: React.ElementType;
  disabled?: boolean;
  error?: string;
  allowCustom?: boolean;
  customOptionLabel?: string;
}

export const SearchableLocationSelect: React.FC<SearchableLocationSelectProps> = ({
  label,
  required = true,
  value,
  onChange,
  options,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  icon: Icon,
  disabled = false,
  error,
  allowCustom = true,
  customOptionLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCustomInputMode, setIsCustomInputMode] = useState(false);
  const [customText, setCustomText] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Find currently selected option
  const selectedOption = useMemo(() => {
    if (!value) return null;
    return (
      options.find(
        (opt) =>
          opt.code === value ||
          opt.name.toLowerCase() === value.toLowerCase() ||
          opt.displayLabel?.toLowerCase() === value.toLowerCase()
      ) || null
    );
  }, [value, options]);

  // Filter options based on query
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const q = searchQuery.toLowerCase().trim();
    return options.filter((opt) => {
      const nameMatch = opt.name.toLowerCase().includes(q);
      const codeMatch = opt.code.toLowerCase().includes(q);
      const labelMatch = opt.displayLabel ? opt.displayLabel.toLowerCase().includes(q) : false;
      const subtitleMatch = opt.subtitle ? opt.subtitle.toLowerCase().includes(q) : false;
      return nameMatch || codeMatch || labelMatch || subtitleMatch;
    });
  }, [options, searchQuery]);

  const showCustomAddOption = useMemo(() => {
    if (!allowCustom || !searchQuery.trim()) return false;
    const q = searchQuery.trim().toLowerCase();
    return !options.some((opt) => opt.name.toLowerCase() === q || opt.code.toLowerCase() === q);
  }, [allowCustom, searchQuery, options]);

  // Reset internal custom states when opening/closing
  useEffect(() => {
    if (isOpen) {
      setIsCustomInputMode(false);
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery("");
      setIsCustomInputMode(false);
      setCustomText("");
    }
  }, [isOpen]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (option: SearchOption) => {
    onChange(option);
    setIsOpen(false);
    setSearchQuery("");
    setIsCustomInputMode(false);
  };

  const displayTitle = selectedOption
    ? selectedOption.displayLabel || selectedOption.name
    : value || placeholder;

  return (
    <div className="space-y-1.5 relative" ref={dropdownRef}>
      <label className="block text-xs sm:text-[12.5px] font-bold text-slate-800 select-none">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>

      {/* Trigger Button */}
      <div className="relative">
        <Icon className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />

        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`w-full h-10 sm:h-11 pl-10 pr-9 text-left rounded-xl border bg-white text-xs sm:text-sm font-semibold text-slate-900 outline-none transition-all shadow-2xs flex items-center justify-between cursor-pointer ${
            disabled
              ? "bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed"
              : error
              ? "border-rose-400 ring-1 ring-rose-400/20"
              : isOpen
              ? "border-slate-800 ring-1 ring-slate-900/10"
              : "border-stone-200/90 hover:border-stone-300 focus:border-slate-800"
          }`}
        >
          <span className="truncate block font-semibold text-slate-900 text-xs sm:text-sm">
            {displayTitle}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none z-10 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-slate-800" : ""
            }`}
          />
        </button>
      </div>

      {error && <p className="text-[11px] text-rose-500 font-medium pt-0.5">{error}</p>}

      {/* Searchable Dropdown Popover */}
      {isOpen && !disabled && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-stone-200/90 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {isCustomInputMode ? (
            /* Custom Free Text Input Mode */
            <div className="p-3.5 bg-stone-50/90 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold text-slate-900">Enter Custom Name</span>
                <button
                  type="button"
                  onClick={() => setIsCustomInputMode(false)}
                  className="text-stone-400 hover:text-stone-700 p-0.5 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-stone-500 font-medium leading-tight">
                Specify your custom location name if not listed in options:
              </p>
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder={`Type custom ${label.toLowerCase()}...`}
                  autoFocus
                  className="flex-1 h-9.5 px-3 text-xs sm:text-sm rounded-lg border border-stone-300 bg-white text-slate-900 placeholder:text-stone-400 focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-900/10 font-medium"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && customText.trim()) {
                      e.preventDefault();
                      handleSelect({ code: customText.trim(), name: customText.trim() });
                    }
                  }}
                />
                <button
                  type="button"
                  disabled={!customText.trim()}
                  onClick={() => {
                    if (customText.trim()) {
                      handleSelect({ code: customText.trim(), name: customText.trim() });
                    }
                  }}
                  className="px-3.5 h-9.5 text-xs sm:text-sm font-extrabold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer transition-all disabled:opacity-50 shrink-0 shadow-2xs"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Search Header */}
              <div className="p-2.5 border-b border-stone-100 bg-stone-50/70 relative flex items-center">
                <Search className="w-4 h-4 text-stone-400 absolute left-4.5 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full h-9 pl-9 pr-8 text-xs sm:text-sm rounded-lg border border-stone-200 bg-white text-slate-900 placeholder:text-stone-400 focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-900/10 transition-all font-medium"
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setIsOpen(false);
                    if (e.key === "Enter") {
                      if (filteredOptions.length > 0) {
                        e.preventDefault();
                        handleSelect(filteredOptions[0]);
                      } else if (showCustomAddOption) {
                        e.preventDefault();
                        handleSelect({ code: searchQuery.trim(), name: searchQuery.trim() });
                      }
                    }
                  }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 text-stone-400 hover:text-stone-600 p-0.5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Options Scroll List */}
              <div className="max-h-60 overflow-y-auto p-1.5 font-sans space-y-0.5 custom-scrollbar">
                {/* Custom Option Banner from Search Query */}
                {showCustomAddOption && (
                  <button
                    type="button"
                    onClick={() => handleSelect({ code: searchQuery.trim(), name: searchQuery.trim() })}
                    className="w-full text-left px-3.5 py-2.5 text-xs sm:text-sm rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold transition-colors flex items-center gap-2 cursor-pointer border border-emerald-200/70 mb-1"
                  >
                    <Plus className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span className="truncate">Use custom: &quot;{searchQuery.trim()}&quot;</span>
                  </button>
                )}

                {filteredOptions.length > 0 ? (
                  filteredOptions.map((opt) => {
                    const isSelected =
                      selectedOption?.code === opt.code ||
                      selectedOption?.name.toLowerCase() === opt.name.toLowerCase();

                    return (
                      <button
                        key={`${opt.code}_${opt.name}`}
                        type="button"
                        onClick={() => handleSelect(opt)}
                        className={`w-full text-left px-3.5 py-2.5 text-xs sm:text-sm rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? "bg-slate-900 text-white font-bold"
                            : "hover:bg-stone-100/90 text-slate-800 font-semibold"
                        }`}
                      >
                        <div className="min-w-0 truncate pr-2">
                          <span className="truncate block font-semibold">
                            {opt.displayLabel || opt.name}
                          </span>
                          {opt.subtitle && (
                            <span
                              className={`text-[11px] block truncate ${
                                isSelected ? "text-slate-300" : "text-stone-400"
                              }`}
                            >
                              {opt.subtitle}
                            </span>
                          )}
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-white shrink-0 ml-1" />}
                      </button>
                    );
                  })
                ) : !showCustomAddOption ? (
                  <div className="px-3.5 py-3.5 text-center text-xs sm:text-sm text-stone-400 font-medium">
                    No matching results found
                  </div>
                ) : null}

                {/* Persistent Other/Custom Option at bottom */}
                {allowCustom && (
                  <button
                    type="button"
                    onClick={() => {
                      if (searchQuery.trim()) {
                        handleSelect({ code: searchQuery.trim(), name: searchQuery.trim() });
                      } else {
                        setCustomText(value || "");
                        setIsCustomInputMode(true);
                      }
                    }}
                    className="w-full text-left px-3.5 py-2.5 text-xs sm:text-sm rounded-lg text-slate-700 hover:bg-stone-100 font-semibold transition-colors flex items-center gap-2 cursor-pointer border-t border-stone-100 mt-1 pt-2"
                  >
                    <Edit3 className="w-4 h-4 text-slate-500 shrink-0" />
                    <span className="truncate">
                      {customOptionLabel || `Other ${label} (Type custom name...)`}
                    </span>
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

