with open("src/components/ProductPreviewNewWay.tsx", "r") as f:
    content = f.read()

target_anchor = """              })()}
            </div>
          )}"""

replacement = """              })()}
            </div>
          )}

          {/* ========================================================================= */}
          {/* BOTTOM PAYBOX (Re-inserted below Sequential Product Layout Gallery) */}
          {/* ========================================================================= */}
          <div id="bottom-layout-paybox" className="my-8 w-full text-left">
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-slate-800 ring-1 ring-slate-900/5 shadow-xl hover:shadow-2xl transition-all duration-500 p-6 md:p-8 max-w-3xl mx-auto space-y-5">
              
              {/* Top row: Total Price & Stock Availability */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block font-mono">Total Price</span>
                  <span className="text-3xl font-black font-display tracking-tight" style={{ color: activeThemeColor }}>
                    {calculatedGrandTotal.toLocaleString()} DA
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-500 font-bold block mb-1">Availability</span>
                  {isOutOfStockState ? (
                    <div className="text-xs text-rose-600 font-extrabold flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950/40 px-3 py-1 rounded-full border border-rose-200 dark:border-rose-900">
                      <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                      Out of Stock
                    </div>
                  ) : (
                    <div className="text-xs text-emerald-700 dark:text-emerald-400 font-extrabold flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-900">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      In stock, {selectedDeliveryCompany.name.split(" ")[0]} ready
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping Details Summary */}
              {isShippingCalculated && (
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700 text-xs space-y-2 text-slate-700 dark:text-slate-300">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/60 dark:border-slate-700">
                    <span className="text-slate-500 font-bold text-[10.5px] uppercase tracking-wider font-mono">Shipping Summary</span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsShippingOpen(true);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="text-xs text-indigo-600 dark:text-indigo-400 font-extrabold hover:underline cursor-pointer"
                    >
                      Edit Shipping Info
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Destination:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{selectedWilaya.id} - {selectedWilaya.name}</span>
                    </div>
                    {selectedCommune && (
                      <div>
                        <span className="text-slate-400 text-[10px] block">City:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{selectedCommune}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-slate-400 text-[10px] block">Estimated Time:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{selectedWilaya.time || "24-48 Hours"}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Delivery Type & Fee:</span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                        {shippingMethod === "home" ? "Home" : "Desk"} (+{calculatedShippingFee.toLocaleString()} DA)
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Quantity Selector & Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                {isShippingCalculated && !isOutOfStockState && (
                  <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2.5 shrink-0 w-full sm:w-auto justify-between sm:justify-start">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">Quantity:</span>
                    <div className="flex items-center gap-2">
                      <button 
                        type="button" 
                        onClick={() => setPurchaseQty(p => Math.max(1, p - 1))}
                        className="w-8 h-8 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 font-black flex items-center justify-center cursor-pointer shadow-3xs transition-all"
                      >
                        -
                      </button>
                      <span className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100 min-w-[20px] text-center">{purchaseQty}</span>
                      <button 
                        type="button" 
                        onClick={() => setPurchaseQty(p => Math.min(10, p + 1))}
                        className="w-8 h-8 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 font-black flex items-center justify-center cursor-pointer shadow-3xs transition-all"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex-1 flex flex-col sm:flex-row items-center gap-3 w-full">
                  {isOutOfStockState ? (
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (hasNotified) return;
                        setHasNotified(true);
                        if (onNotifyMe) {
                          onNotifyMe(selectedProduct.name, selectedStore.name);
                        } else {
                          alert(`Notify Me registered for ${selectedProduct.name}`);
                        }
                        setTimeout(() => {
                          setHasNotified(false);
                        }, 4000);
                      }}
                      className="w-full text-white font-extrabold py-3.5 px-6 rounded-2xl text-center text-sm shadow-md hover:shadow-lg active:scale-97 cursor-pointer transition-all border-2 select-none outline-none flex items-center justify-center gap-2 group"
                      style={{ 
                        backgroundColor: hasNotified ? "#10b981" : activeThemeColor, 
                        borderColor: hasNotified ? "#10b981" : activeThemeColor 
                      }}
                    >
                      <Sparkles className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${hasNotified ? "animate-pulse" : ""}`} />
                      <span>{hasNotified ? "We'll Notify You! ✓" : "Notify Me"}</span>
                    </motion.button>
                  ) : (
                    <>
                      {isRegisteredUser && (
                        <button
                          type="button"
                          onClick={() => {
                            handleAddToCartWithGuestCheck();
                          }}
                          className="w-full sm:w-1/2 bg-transparent font-extrabold py-3.5 px-6 rounded-2xl text-center text-sm shadow-3xs hover:shadow-xs active:scale-97 cursor-pointer transition-all border-2 select-none outline-none flex items-center justify-center gap-2 group"
                          style={{ 
                            borderColor: activeThemeColor, 
                            color: activeThemeColor 
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = hexToRgba(activeThemeColor, 0.08);
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                          }}
                        >
                          <ShoppingCart className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                          <span>Add to Cart</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setIsExpressCheckoutOpen(true);
                        }}
                        className={`w-full ${isRegisteredUser ? "sm:w-1/2" : "w-full"} text-white font-extrabold py-3.5 px-6 rounded-2xl text-center text-sm shadow-lg hover:shadow-xl active:scale-97 cursor-pointer transition-all border-2 select-none outline-none flex items-center justify-center gap-2 group`}
                        style={{ 
                          backgroundColor: activeThemeColor, 
                          borderColor: activeThemeColor 
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.filter = "brightness(0.92)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.filter = "none";
                        }}
                      >
                        <CreditCard className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110 text-white" />
                        <span>Buy Now (Express Checkout)</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Secure Transaction Note */}
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Secure transaction process checked. Guaranteed delivery across 58 Wilayas.</span>
              </div>

            </div>
          </div>"""

if target_anchor in content:
    content = content.replace(target_anchor, replacement, 1)
    with open("src/components/ProductPreviewNewWay.tsx", "w") as f:
        f.write(content)
    print("Replaced successfully!")
else:
    print("Target anchor not found!")
