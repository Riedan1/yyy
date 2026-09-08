import re

filepath = "/src/components/PlatformAdminWorkspace.tsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Define start and end markers
start_marker = "            {/* Grid Layout: Main Categories & Subcategories */}"
end_marker = "            {/* SAFE DELETE MODAL FOR MAIN CATEGORY */}"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx == -1:
    print("Error: Start marker not found!")
    exit(1)

if end_idx == -1:
    print("Error: End marker not found!")
    exit(1)

replacement_content = """            {/* Table-based Interactive Directory Tabs */}
            <div className="flex border-b border-stone-200 dark:border-slate-800 gap-6 -mt-2">
              <button
                type="button"
                onClick={() => setCategoriesTab("main")}
                className={`pb-3.5 font-bold text-sm border-b-2 transition-all cursor-pointer flex items-center gap-2 px-1 ${
                  categoriesTab === "main"
                    ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-black"
                    : "border-transparent text-stone-500 dark:text-slate-400 hover:text-stone-700 dark:hover:text-slate-200"
                }`}
              >
                <Folder className="w-4 h-4" />
                Main Departments Registry
              </button>
              <button
                type="button"
                onClick={() => setCategoriesTab("sub")}
                className={`pb-3.5 font-bold text-sm border-b-2 transition-all cursor-pointer flex items-center gap-2 px-1 ${
                  categoriesTab === "sub"
                    ? "border-amber-600 text-amber-600 dark:border-amber-400 dark:text-amber-400 font-black"
                    : "border-transparent text-stone-500 dark:text-slate-400 hover:text-stone-700 dark:hover:text-slate-200"
                }`}
              >
                <FolderOpen className="w-4 h-4" />
                Subcategories Directory
              </button>
            </div>

            {categoriesTab === "main" ? (
              /* TAB: MAIN CATEGORIES MANAGEMENT TABLE */
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-stone-200 dark:border-slate-800 flex flex-col gap-6 animate-fade-in">
                {/* Search and Action Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
                  <div className="relative flex-1 max-w-md">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-stone-400">
                      <Search className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      placeholder="Search main departments by name or ID..."
                      value={mainCatSearch}
                      onChange={(e) => setMainCatSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-stone-50/50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 rounded-2xl text-xs font-bold outline-none text-slate-900 dark:text-white placeholder:text-stone-400 focus:border-indigo-500 focus:bg-white transition-all"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingMainCategory(null);
                      setMainCategoryForm({
                        id: "",
                        names: { en: "", ar: "", fr: "" },
                        icon: "Shirt",
                        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80"
                      });
                      setShowAddMainCategory(true);
                    }}
                    className="px-4 py-2 rounded-2xl bg-indigo-600 text-white font-extrabold text-xs hover:bg-indigo-700 shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    Create Main Department
                  </button>
                </div>

                {/* Form to Add/Edit Main Category inline */}
                {showAddMainCategory && (
                  <div className="p-5 rounded-2xl border border-indigo-100 dark:border-slate-800 bg-indigo-50/10 dark:bg-slate-950/20 flex flex-col gap-4 text-left animate-fade-in">
                    <div className="flex justify-between items-center border-b border-indigo-100/50 dark:border-slate-800/80 pb-2">
                      <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Palette className="w-4 h-4 text-indigo-500" />
                        {editingMainCategory ? "Update Existing Department Blueprint" : "Register New Department"}
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddMainCategory(false);
                          setEditingMainCategory(null);
                        }}
                        className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      {!editingMainCategory ? (
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] uppercase font-bold text-stone-400 font-mono">Unique Key ID</label>
                          <input
                            type="text"
                            placeholder="e.g. fashion_attire"
                            value={mainCategoryForm.id}
                            onChange={(e) => setMainCategoryForm({ ...mainCategoryForm, id: e.target.value.toLowerCase().replace(/\\\\s+/g, "_") })}
                            className="p-2.5 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none text-slate-900 dark:text-white"
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1 opacity-70">
                          <label className="text-[10px] uppercase font-bold text-stone-400 font-mono">Unique Key ID (Immutable)</label>
                          <input
                            type="text"
                            disabled
                            value={mainCategoryForm.id}
                            className="p-2.5 bg-stone-100 dark:bg-slate-800 border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none text-stone-500 cursor-not-allowed"
                          />
                        </div>
                      )}

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-bold text-stone-400 font-mono">English Title Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Clothing & Apparel"
                          value={mainCategoryForm.names.en}
                          onChange={(e) => setMainCategoryForm({ ...mainCategoryForm, names: { ...mainCategoryForm.names, en: e.target.value } })}
                          className="p-2.5 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none text-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-bold text-stone-400 font-mono">Arabic Title Name</label>
                        <input
                          type="text"
                          placeholder="e.g. ملابس وأزياء"
                          value={mainCategoryForm.names.ar}
                          onChange={(e) => setMainCategoryForm({ ...mainCategoryForm, names: { ...mainCategoryForm.names, ar: e.target.value } })}
                          className="p-2.5 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none text-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-bold text-stone-400 font-mono">French Title Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Vêtements & Mode"
                          value={mainCategoryForm.names.fr}
                          onChange={(e) => setMainCategoryForm({ ...mainCategoryForm, names: { ...mainCategoryForm.names, fr: e.target.value } })}
                          className="p-2.5 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-bold text-stone-400 font-mono">Icon Representation</label>
                        <select
                          value={mainCategoryForm.icon}
                          onChange={(e) => setMainCategoryForm({ ...mainCategoryForm, icon: e.target.value })}
                          className="p-2.5 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white cursor-pointer"
                        >
                          {["Shirt", "Sparkles", "Smartphone", "Home", "Activity", "Palette", "Utensils", "Wrench", "Tv", "Heart", "Camera", "Gem", "BookOpen", "GlassWater"].map(ic => (
                            <option key={ic} value={ic}>{ic}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-bold text-stone-400 font-mono">Splash Image URL</label>
                        <input
                          type="text"
                          placeholder="e.g. Unsplash cover photo URL"
                          value={mainCategoryForm.image}
                          onChange={(e) => setMainCategoryForm({ ...mainCategoryForm, image: e.target.value })}
                          className="p-2.5 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-stone-100 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddMainCategory(false);
                          setEditingMainCategory(null);
                        }}
                        className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          const formId = editingMainCategory ? editingMainCategory.id : mainCategoryForm.id;
                          if (!formId || !mainCategoryForm.names.en) {
                            alert("Please fill at least the English name and a unique key ID.");
                            return;
                          }

                          const finalNames = {
                            en: mainCategoryForm.names.en,
                            ar: mainCategoryForm.names.ar || mainCategoryForm.names.en,
                            fr: mainCategoryForm.names.fr || mainCategoryForm.names.en,
                          };

                          const newCat: MainCategory = {
                            id: formId,
                            names: finalNames,
                            icon: mainCategoryForm.icon,
                            image: mainCategoryForm.image,
                            order: editingMainCategory ? editingMainCategory.order : mainCategories.length,
                          };

                          await saveMainCategoryToFirestore(newCat);

                          if (editingMainCategory) {
                            setMainCategories(prev => prev.map(c => c.id === formId ? newCat : c));
                          } else {
                            setMainCategories(prev => [...prev, newCat]);
                          }

                          setShowAddMainCategory(false);
                          setEditingMainCategory(null);
                        }}
                        className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-black text-xs hover:bg-indigo-700 cursor-pointer"
                      >
                        {editingMainCategory ? "Save Changes" : "Create Department"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Main Category Management Table */}
                <div className="overflow-x-auto rounded-2xl border border-stone-200 dark:border-slate-800 shadow-sm">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900 border-b border-stone-200 dark:border-slate-800 text-stone-500 dark:text-slate-400 uppercase tracking-wider font-mono text-[10px] font-bold">
                        <th className="px-5 py-3.5 font-semibold">Department Image</th>
                        <th className="px-5 py-3.5 font-semibold">Unique Key ID</th>
                        <th className="px-5 py-3.5 font-semibold">English Name</th>
                        <th className="px-5 py-3.5 font-semibold">Arabic Name</th>
                        <th className="px-5 py-3.5 font-semibold">French Name</th>
                        <th className="px-5 py-3.5 font-semibold text-center">Subcategories</th>
                        <th className="px-5 py-3.5 font-semibold text-center">Sort Order</th>
                        <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-150 dark:divide-slate-800/60">
                      {mainCategories
                        .filter(cat => {
                          const search = mainCatSearch.toLowerCase().trim();
                          if (!search) return true;
                          return (
                            cat.id.toLowerCase().includes(search) ||
                            (cat.names.en || "").toLowerCase().includes(search) ||
                            (cat.names.ar || "").toLowerCase().includes(search) ||
                            (cat.names.fr || "").toLowerCase().includes(search)
                          );
                        })
                        .map((cat, idx, arr) => {
                          const subCount = subcategories.filter(s => s.mainCategoryId === cat.id).length;
                          return (
                            <tr 
                              key={cat.id}
                              className="bg-white dark:bg-slate-950/20 hover:bg-slate-50/60 dark:hover:bg-slate-900/30 transition-colors"
                            >
                              <td className="px-5 py-3">
                                <div className="flex items-center gap-3">
                                  {cat.image ? (
                                    <img 
                                      src={cat.image} 
                                      alt={cat.names.en} 
                                      className="w-10 h-10 rounded-xl object-cover border border-stone-200 dark:border-slate-850 bg-stone-100" 
                                      referrerPolicy="no-referrer" 
                                    />
                                  ) : (
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                      <Palette className="w-5 h-5" />
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-5 py-3 font-mono text-[11px] font-bold text-slate-500 dark:text-slate-400">
                                {cat.id}
                              </td>
                              <td className="px-5 py-3 font-black text-slate-900 dark:text-white">
                                {cat.names.en}
                              </td>
                              <td className="px-5 py-3 font-black text-slate-900 dark:text-white" dir="rtl">
                                {cat.names.ar}
                              </td>
                              <td className="px-5 py-3 text-stone-600 dark:text-slate-300">
                                {cat.names.fr || "—"}
                              </td>
                              <td className="px-5 py-3 text-center">
                                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/30">
                                  {subCount} registered
                                </span>
                              </td>
                              <td className="px-5 py-3">
                                <div className="flex items-center justify-center gap-1">
                                  <button
                                    type="button"
                                    disabled={idx === 0}
                                    onClick={async () => {
                                      const originalIdx = mainCategories.findIndex(c => c.id === cat.id);
                                      if (originalIdx > 0) {
                                        const newList = [...mainCategories];
                                        const [temp] = newList.splice(originalIdx, 1);
                                        newList.splice(originalIdx - 1, 0, temp);
                                        setMainCategories(newList);
                                        await saveReorderedCategoriesToFirestore(newList);
                                      }
                                    }}
                                    className="p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-slate-800 disabled:opacity-30 text-stone-500"
                                    title="Move Up"
                                  >
                                    <ArrowUp className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={idx === arr.length - 1}
                                    onClick={async () => {
                                      const originalIdx = mainCategories.findIndex(c => c.id === cat.id);
                                      if (originalIdx !== -1 && originalIdx < mainCategories.length - 1) {
                                        const newList = [...mainCategories];
                                        const [temp] = newList.splice(originalIdx, 1);
                                        newList.splice(originalIdx + 1, 0, temp);
                                        setMainCategories(newList);
                                        await saveReorderedCategoriesToFirestore(newList);
                                      }
                                    }}
                                    className="p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-slate-800 disabled:opacity-30 text-stone-500"
                                    title="Move Down"
                                  >
                                    <ArrowDown className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                              <td className="px-5 py-3 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingMainCategory(cat);
                                      setMainCategoryForm({
                                        id: cat.id,
                                        names: cat.names,
                                        icon: cat.icon,
                                        image: cat.image
                                      });
                                      setShowAddMainCategory(true);
                                    }}
                                    className="p-2 rounded-xl text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/30"
                                    title="Edit Department"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSafeDeleteMainCategory(cat);
                                      setSafeDeleteAction("archive");
                                      setSafeDeleteTargetId(mainCategories.find(c => c.id !== cat.id)?.id || "");
                                    }}
                                    className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 border border-transparent hover:border-rose-100 dark:hover:border-rose-900/30"
                                    title="Remove Department"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      {mainCategories.filter(cat => {
                        const search = mainCatSearch.toLowerCase().trim();
                        if (!search) return true;
                        return (
                          cat.id.toLowerCase().includes(search) ||
                          (cat.names.en || "").toLowerCase().includes(search) ||
                          (cat.names.ar || "").toLowerCase().includes(search) ||
                          (cat.names.fr || "").toLowerCase().includes(search)
                        );
                      }).length === 0 && (
                        <tr>
                          <td colSpan={8} className="py-12 text-center text-stone-400 dark:text-slate-500 font-bold text-xs">
                            No main departments match your search query.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* TAB: SUBCATEGORIES MANAGEMENT TABLE */
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-stone-200 dark:border-slate-800 flex flex-col gap-6 animate-fade-in">
                {/* Search, Filter, and Action Bar */}
                <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
                  <div className="flex flex-col sm:flex-row flex-1 gap-3 max-w-2xl">
                    <div className="relative flex-1">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-stone-400">
                        <Search className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        placeholder="Search subcategories by name, ID, or materials..."
                        value={subCatSearch}
                        onChange={(e) => setSubCatSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-stone-50/50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 rounded-2xl text-xs font-bold outline-none text-slate-900 dark:text-white placeholder:text-stone-400 focus:border-indigo-500 focus:bg-white transition-all"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-stone-400 font-mono shrink-0">Dept:</span>
                      <select
                        value={subCatDeptFilter}
                        onChange={(e) => setSubCatDeptFilter(e.target.value)}
                        className="p-2 bg-stone-50/50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white cursor-pointer outline-none focus:border-indigo-500 transition-all"
                      >
                        <option value="all">All Departments</option>
                        {mainCategories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.names.en}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingSubcategory(null);
                      // Default to first category if none active in the selection
                      if (!selectedMainCategoryId && mainCategories.length > 0) {
                        setSelectedMainCategoryId(mainCategories[0].id);
                      }
                      setSubcategoryForm({
                        id: "",
                        names: { en: "", ar: "", fr: "" },
                        icon: "Folder",
                        image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=80",
                        sizeSystemEnabled: false,
                        sizeSystemLabel: "Sizes Available",
                        sizeSystemSizes: "S, M, L, XL",
                        recommendedMaterials: "Cotton, Linen",
                        fields: [
                          { name: "Material", type: "text", required: false, placeholder: "e.g. 100% Wool" }
                        ]
                      });
                      setShowAddSubcategory(true);
                    }}
                    className="px-4 py-2 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    Create Subcategory
                  </button>
                </div>

                {/* Form to Add/Edit Subcategory inline */}
                {showAddSubcategory && (
                  <div className="p-5 rounded-2xl border border-amber-150 dark:border-slate-800 bg-amber-50/10 dark:bg-slate-950/20 flex flex-col gap-4 text-left animate-fade-in">
                    <div className="flex justify-between items-center border-b border-amber-100 dark:border-slate-800/80 pb-2">
                      <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Folder className="w-4 h-4 text-amber-500" />
                        {editingSubcategory ? "Update Existing Subcategory Blueprint" : "Register New Subcategory"}
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddSubcategory(false);
                          setEditingSubcategory(null);
                        }}
                        className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-bold text-stone-400 font-mono">Parent Department Link</label>
                        <select
                          value={selectedMainCategoryId}
                          onChange={(e) => setSelectedMainCategoryId(e.target.value)}
                          className="p-2.5 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white cursor-pointer"
                        >
                          {mainCategories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.names.en} (id: {cat.id})</option>
                          ))}
                        </select>
                      </div>

                      {!editingSubcategory ? (
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] uppercase font-bold text-stone-400 font-mono">Unique Key Code</label>
                          <input
                            type="text"
                            placeholder="e.g. smart_watches"
                            value={subcategoryForm.id}
                            onChange={(e) => setSubcategoryForm({ ...subcategoryForm, id: e.target.value.toLowerCase().replace(/\\\\s+/g, "_") })}
                            className="p-2.5 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none text-slate-900 dark:text-white"
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1 opacity-70">
                          <label className="text-[10px] uppercase font-bold text-stone-400 font-mono">Unique Key Code (Immutable)</label>
                          <input
                            type="text"
                            disabled
                            value={subcategoryForm.id}
                            className="p-2.5 bg-stone-100 dark:bg-slate-800 border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none text-stone-500 cursor-not-allowed"
                          />
                        </div>
                      )}

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-bold text-stone-400 font-mono">English Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Running Shoes"
                          value={subcategoryForm.names.en}
                          onChange={(e) => setSubcategoryForm({ ...subcategoryForm, names: { ...subcategoryForm.names, en: e.target.value } })}
                          className="p-2.5 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none text-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-bold text-stone-400 font-mono">Arabic Name</label>
                        <input
                          type="text"
                          placeholder="e.g. أحذية الجري"
                          value={subcategoryForm.names.ar}
                          onChange={(e) => setSubcategoryForm({ ...subcategoryForm, names: { ...subcategoryForm.names, ar: e.target.value } })}
                          className="p-2.5 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-bold text-stone-400 font-mono">French Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Chaussures de Course"
                          value={subcategoryForm.names.fr}
                          onChange={(e) => setSubcategoryForm({ ...subcategoryForm, names: { ...subcategoryForm.names, fr: e.target.value } })}
                          className="p-2.5 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none text-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="flex flex-col gap-1 col-span-2">
                        <label className="text-[10px] uppercase font-bold text-stone-400 font-mono">Recommended/Allowed Materials (Comma-separated)</label>
                        <input
                          type="text"
                          placeholder="e.g. Polyester, Mesh, Rubber"
                          value={subcategoryForm.recommendedMaterials}
                          onChange={(e) => setSubcategoryForm({ ...subcategoryForm, recommendedMaterials: e.target.value })}
                          className="p-2.5 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    {/* Sizing Matrix System */}
                    <div className="border-t border-stone-200 dark:border-slate-800 pt-3">
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="checkbox"
                          id="sizeSystemEnabledTable"
                          checked={subcategoryForm.sizeSystemEnabled}
                          onChange={(e) => setSubcategoryForm({ ...subcategoryForm, sizeSystemEnabled: e.target.checked })}
                          className="w-4 h-4 cursor-pointer"
                        />
                        <label htmlFor="sizeSystemEnabledTable" className="text-[11px] font-black text-slate-800 dark:text-slate-200 cursor-pointer select-none">
                          Enable Sizing System Blueprint Matrix
                        </label>
                      </div>

                      {subcategoryForm.sizeSystemEnabled && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-6">
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] uppercase font-bold text-stone-400 font-mono">Sizing Title Label</label>
                            <input
                              type="text"
                              placeholder="e.g. Shoes Size (EU)"
                              value={subcategoryForm.sizeSystemLabel}
                              onChange={(e) => setSubcategoryForm({ ...subcategoryForm, sizeSystemLabel: e.target.value })}
                              className="p-2 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none text-slate-900 dark:text-white"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] uppercase font-bold text-stone-400 font-mono">Available Matrix Dimensions (Comma-separated)</label>
                            <input
                              type="text"
                              placeholder="e.g. 38, 39, 40, 41, 42, 43"
                              value={subcategoryForm.sizeSystemSizes}
                              onChange={(e) => setSubcategoryForm({ ...subcategoryForm, sizeSystemSizes: e.target.value })}
                              className="p-2 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none text-slate-900 dark:text-white"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Specifications field designer */}
                    <div className="border-t border-stone-200 dark:border-slate-800 pt-3">
                      <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wide block mb-2">
                        Custom Schema Blueprints ({subcategoryForm.fields.length})
                      </span>

                      <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto bg-stone-50 dark:bg-slate-950 p-3 rounded-2xl mb-3">
                        {subcategoryForm.fields.map((f, fidx) => (
                          <div key={fidx} className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border border-stone-150 dark:border-slate-800/60">
                            <div className="text-left">
                              <span className="text-xs font-extrabold text-slate-800 dark:text-white">{f.name}</span>
                              <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-stone-100 dark:bg-slate-800 text-stone-500 font-bold uppercase font-mono">
                                {f.type} {f.required ? "• Required" : ""}
                              </span>
                              {f.unit && <span className="ml-2 text-[10px] text-stone-400 font-bold font-mono">Unit: {f.unit}</span>}
                              {f.options && <span className="ml-2 text-[9.5px] text-amber-600 font-bold block">Options: {f.options.join(", ")}</span>}
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setSubcategoryForm({
                                  ...subcategoryForm,
                                  fields: subcategoryForm.fields.filter((_, idx) => idx !== fidx)
                                });
                              }}
                              className="p-1 rounded text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/25"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="p-3 rounded-2xl bg-stone-50 dark:bg-slate-950 border border-stone-150 dark:border-slate-800/60 flex flex-col gap-2">
                        <span className="text-[10px] font-bold text-stone-500 uppercase font-mono block">Define Blueprint Spec Field</span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <input
                            type="text"
                            placeholder="Field Name (e.g. Battery Capacity)"
                            value={newSpecField.name}
                            onChange={(e) => setNewSpecField({ ...newSpecField, name: e.target.value })}
                            className="p-2 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none text-slate-900 dark:text-white"
                          />
                          <select
                            value={newSpecField.type}
                            onChange={(e) => setNewSpecField({ ...newSpecField, type: e.target.value as any })}
                            className="p-2 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white cursor-pointer"
                          >
                            <option value="text">Text Input</option>
                            <option value="number">Numeric Value</option>
                            <option value="boolean">Yes/No Toggle</option>
                            <option value="select">Dropdown Menu</option>
                          </select>
                          <div className="flex items-center gap-1.5 pl-2">
                            <input
                              type="checkbox"
                              id="newSpecFieldRequiredTable"
                              checked={newSpecField.required}
                              onChange={(e) => setNewSpecField({ ...newSpecField, required: e.target.checked })}
                              className="w-4 h-4 cursor-pointer"
                            />
                            <label htmlFor="newSpecFieldRequiredTable" className="text-[10.5px] font-bold text-slate-600 dark:text-slate-350 cursor-pointer select-none">
                              Field Required?
                            </label>
                          </div>
                        </div>

                        {newSpecField.type === "select" && (
                          <input
                            type="text"
                            placeholder="Options list (Comma-separated e.g. lithium, polymer, alkaline)"
                            value={newSpecField.options}
                            onChange={(e) => setNewSpecField({ ...newSpecField, options: e.target.value })}
                            className="p-2 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none text-slate-900 dark:text-white"
                          />
                        )}

                        {newSpecField.type === "number" && (
                          <input
                            type="text"
                            placeholder="Value unit metric (e.g. mAh, V, Watt)"
                            value={newSpecField.unit}
                            onChange={(e) => setNewSpecField({ ...newSpecField, unit: e.target.value })}
                            className="p-2 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none text-slate-900 dark:text-white"
                          />
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            if (!newSpecField.name) {
                              alert("Please supply a valid field name.");
                              return;
                            }
                            const optsArr = newSpecField.options
                              ? newSpecField.options.split(",").map(o => o.trim()).filter(Boolean)
                              : undefined;
                            
                            const addedField: CategoryTemplateField = {
                              name: newSpecField.name,
                              type: newSpecField.type,
                              required: newSpecField.required,
                              placeholder: newSpecField.placeholder || `Enter ${newSpecField.name}`,
                              options: optsArr,
                              unit: newSpecField.unit || undefined
                            };

                            setSubcategoryForm({
                              ...subcategoryForm,
                              fields: [...subcategoryForm.fields, addedField]
                            });

                            // Clear row
                            setNewSpecField({
                              name: "",
                              type: "text",
                              required: false,
                              options: "",
                              unit: "",
                              placeholder: ""
                            });
                          }}
                          className="px-3.5 py-2.5 self-end rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-amber-800 dark:text-amber-400 font-extrabold text-[10.5px] cursor-pointer"
                        >
                          + Save Field Blueprint to Schema
                        </button>
                      </div>
                    </div>

                    {/* Subcategory form submit actions */}
                    <div className="flex justify-end gap-2 pt-2 border-t border-amber-100 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddSubcategory(false);
                          setEditingSubcategory(null);
                        }}
                        className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          const formId = editingSubcategory ? editingSubcategory.id : subcategoryForm.id;
                          if (!formId || !subcategoryForm.names.en) {
                            alert("Please fill at least the English name and a unique key ID.");
                            return;
                          }

                          const finalNames = {
                            en: subcategoryForm.names.en,
                            ar: subcategoryForm.names.ar || subcategoryForm.names.en,
                            fr: subcategoryForm.names.fr || subcategoryForm.names.en,
                          };

                          const newSub: Subcategory = {
                            id: formId,
                            mainCategoryId: selectedMainCategoryId,
                            names: finalNames,
                            icon: subcategoryForm.icon,
                            image: subcategoryForm.image,
                            order: editingSubcategory ? editingSubcategory.order : subcategories.filter(s => s.mainCategoryId === selectedMainCategoryId).length,
                            sizeSystem: {
                              enabled: subcategoryForm.sizeSystemEnabled,
                              label: subcategoryForm.sizeSystemLabel,
                              sizes: subcategoryForm.sizeSystemSizes
                                ? subcategoryForm.sizeSystemSizes.split(",").map(s => s.trim()).filter(Boolean)
                                : []
                            },
                            recommendedMaterials: subcategoryForm.recommendedMaterials
                              ? subcategoryForm.recommendedMaterials.split(",").map(m => m.trim()).filter(Boolean)
                              : [],
                            fields: subcategoryForm.fields,
                          };

                          await saveSubcategoryToFirestore(newSub);

                          if (editingSubcategory) {
                            setSubcategories(prev => prev.map(s => s.id === formId ? newSub : s));
                          } else {
                            setSubcategories(prev => [...prev, newSub]);
                          }

                          setShowAddSubcategory(false);
                          setEditingSubcategory(null);
                        }}
                        className="px-5 py-2 rounded-xl bg-amber-600 text-white font-black text-xs hover:bg-amber-700 cursor-pointer"
                      >
                        {editingSubcategory ? "Save Changes" : "Create Subcategory"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Subcategories Management Table */}
                <div className="overflow-x-auto rounded-2xl border border-stone-200 dark:border-slate-800 shadow-sm">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900 border-b border-stone-200 dark:border-slate-800 text-stone-500 dark:text-slate-400 uppercase tracking-wider font-mono text-[10px] font-bold">
                        <th className="px-5 py-3.5 font-semibold">Unique Key</th>
                        <th className="px-5 py-3.5 font-semibold">English Subcategory</th>
                        <th className="px-5 py-3.5 font-semibold">Arabic Name</th>
                        <th className="px-5 py-3.5 font-semibold">French Name</th>
                        <th className="px-5 py-3.5 font-semibold">Parent Department</th>
                        <th className="px-5 py-3.5 font-semibold">Sizing Matrix</th>
                        <th className="px-5 py-3.5 font-semibold">Blueprint Specs Schema</th>
                        <th className="px-5 py-3.5 font-semibold text-center">Sort Order</th>
                        <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-150 dark:divide-slate-800/60">
                      {subcategories
                        .filter(sub => {
                          // Filter by selected parent department
                          if (subCatDeptFilter !== "all" && sub.mainCategoryId !== subCatDeptFilter) {
                            return false;
                          }
                          // Filter by search query
                          const search = subCatSearch.toLowerCase().trim();
                          if (!search) return true;
                          return (
                            sub.id.toLowerCase().includes(search) ||
                            (sub.names.en || "").toLowerCase().includes(search) ||
                            (sub.names.ar || "").toLowerCase().includes(search) ||
                            (sub.names.fr || "").toLowerCase().includes(search) ||
                            (sub.recommendedMaterials || []).some(m => m.toLowerCase().includes(search)) ||
                            (sub.fields || []).some(f => f.name.toLowerCase().includes(search))
                          );
                        })
                        .map((sub, idx, arr) => {
                          const parentCat = mainCategories.find(c => c.id === sub.mainCategoryId);
                          const parentName = parentCat ? parentCat.names.en : sub.mainCategoryId;
                          return (
                            <tr 
                              key={sub.id}
                              className="bg-white dark:bg-slate-950/20 hover:bg-slate-50/60 dark:hover:bg-slate-900/30 transition-colors"
                            >
                              <td className="px-5 py-3 font-mono text-[11px] font-bold text-slate-500 dark:text-slate-400">
                                {sub.id}
                              </td>
                              <td className="px-5 py-3 font-black text-slate-900 dark:text-white">
                                {sub.names.en}
                              </td>
                              <td className="px-5 py-3 font-black text-slate-900 dark:text-white" dir="rtl">
                                {sub.names.ar}
                              </td>
                              <td className="px-5 py-3 text-stone-600 dark:text-slate-300">
                                {sub.names.fr || "—"}
                              </td>
                              <td className="px-5 py-3">
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400 border border-indigo-100/50">
                                  {parentName}
                                </span>
                              </td>
                              <td className="px-5 py-3">
                                {sub.sizeSystem?.enabled ? (
                                  <div className="flex flex-col gap-0.5 text-left">
                                    <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400">
                                      {sub.sizeSystem.label}
                                    </span>
                                    <span className="text-[9.5px] font-mono text-stone-400 leading-none">
                                      {(sub.sizeSystem.sizes || []).join(", ")}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-stone-400 italic text-[10px]">Disabled</span>
                                )}
                              </td>
                              <td className="px-5 py-3">
                                <div className="flex flex-col gap-1 max-w-[200px]">
                                  {sub.recommendedMaterials && sub.recommendedMaterials.length > 0 && (
                                    <div className="text-[10px] text-stone-400 leading-tight">
                                      <span className="font-bold text-stone-500">Materials: </span>
                                      {sub.recommendedMaterials.join(", ")}
                                    </div>
                                  )}
                                  {sub.fields && sub.fields.length > 0 && (
                                    <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                                      <span className="font-bold text-amber-600 dark:text-amber-400">Fields: </span>
                                      {sub.fields.map(f => f.name).join(", ")}
                                    </div>
                                  )}
                                  {(!sub.recommendedMaterials?.length && !sub.fields?.length) && (
                                    <span className="text-stone-400 italic text-[10px]">No Custom Blueprints</span>
                                  )}
                                </div>
                              </td>
                              <td className="px-5 py-3">
                                <div className="flex items-center justify-center gap-1">
                                  <button
                                    type="button"
                                    disabled={idx === 0}
                                    onClick={async () => {
                                      const originalIdx = subcategories.findIndex(s => s.id === sub.id);
                                      if (originalIdx > 0) {
                                        const newList = [...subcategories];
                                        const [temp] = newList.splice(originalIdx, 1);
                                        newList.splice(originalIdx - 1, 0, temp);
                                        setSubcategories(newList);
                                        await saveReorderedSubcategoriesToFirestore(newList);
                                      }
                                    }}
                                    className="p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-slate-800 disabled:opacity-30 text-stone-500"
                                    title="Move Up"
                                  >
                                    <ArrowUp className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={idx === arr.length - 1}
                                    onClick={async () => {
                                      const originalIdx = subcategories.findIndex(s => s.id === sub.id);
                                      if (originalIdx !== -1 && originalIdx < subcategories.length - 1) {
                                        const newList = [...subcategories];
                                        const [temp] = newList.splice(originalIdx, 1);
                                        newList.splice(originalIdx + 1, 0, temp);
                                        setSubcategories(newList);
                                        await saveReorderedSubcategoriesToFirestore(newList);
                                      }
                                    }}
                                    className="p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-slate-800 disabled:opacity-30 text-stone-500"
                                    title="Move Down"
                                  >
                                    <ArrowDown className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                              <td className="px-5 py-3 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingSubcategory(sub);
                                      setSelectedMainCategoryId(sub.mainCategoryId);
                                      setSubcategoryForm({
                                        id: sub.id,
                                        names: sub.names,
                                        icon: sub.icon,
                                        image: sub.image,
                                        sizeSystemEnabled: sub.sizeSystem?.enabled || false,
                                        sizeSystemLabel: sub.sizeSystem?.label || "Sizes Available",
                                        sizeSystemSizes: (sub.sizeSystem?.sizes || []).join(", "),
                                        recommendedMaterials: (sub.recommendedMaterials || []).join(", "),
                                        fields: sub.fields || []
                                      });
                                      setShowAddSubcategory(true);
                                    }}
                                    className="p-2 rounded-xl text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20 border border-transparent hover:border-amber-100 dark:hover:border-amber-900/30"
                                    title="Edit Subcategory"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSafeDeleteSubcategory(sub);
                                      setSafeDeleteAction("archive");
                                      setSafeDeleteTargetId(subcategories.find(s => s.id !== sub.id && s.mainCategoryId === sub.mainCategoryId)?.id || "");
                                    }}
                                    className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 border border-transparent hover:border-rose-100 dark:hover:border-rose-900/30"
                                    title="Remove Subcategory"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      {subcategories.filter(sub => {
                        if (subCatDeptFilter !== "all" && sub.mainCategoryId !== subCatDeptFilter) {
                          return false;
                        }
                        const search = subCatSearch.toLowerCase().trim();
                        if (!search) return true;
                        return (
                          sub.id.toLowerCase().includes(search) ||
                          (sub.names.en || "").toLowerCase().includes(search) ||
                          (sub.names.ar || "").toLowerCase().includes(search) ||
                          (sub.names.fr || "").toLowerCase().includes(search)
                        );
                      }).length === 0 && (
                        <tr>
                          <td colSpan={9} className="py-12 text-center text-stone-400 dark:text-slate-500 font-bold text-xs">
                            No subcategories match your search filter criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}"""

start_pos = start_idx
end_pos = end_idx

new_content = content[:start_pos] + replacement_content + content[end_pos:]

with open(filepath, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Replacement successful!")
