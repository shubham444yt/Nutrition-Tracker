"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import { Search, Info, Plus, Loader2, Sparkles, Filter, Apple, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { searchFood } from "@/utils/foodApi";
import toast from "react-hot-toast";

export default function SearchPage() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [isAdding, setIsAdding] = useState(false);


  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    
    setIsLoading(true);
    const data = await searchFood(query);
    setResults(data);
    setIsLoading(false);
    
    if (data.length === 0) {
      toast.error("No food items found matching that search.");
    }
  };

  const addToLog = async (food) => {
    if (!user) {
      toast.error("Please login to log meals");
      return;
    }

    if (!user.id && !user._id) {
       toast.error("User session invalid. Please log in again.");
       return;
    }
    
    setIsAdding(true);
    const payload = {
      userId: user.id || user._id,
      name: food.label,
      type: "Lunch",
      calories: food.calories || 0,
      protein: food.protein || 0,
      carbs: food.carbs || 0,
      fats: food.fat || 0,
      image: food.image,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    try {
      const res = await fetch('/api/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(`${food.label} added to your daily log!`);
      } else {
        toast.error(data.error || "Failed to add to log");
        console.error("Meal add failed:", data);
      }
    } catch (err) {
      toast.error("Connection error");
      console.error("Meal add error:", err);
    } finally {
      setIsAdding(false);
    }
  };



  return (
    <AppLayout>
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Search Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-outfit mb-4">Discover <span className="text-[#ff6900]">Nutrition</span></h1>

            <p className="text-muted-foreground text-lg">Search through millions of food items to find detailed nutritional data.</p>
          </div>

          <div className="relative group mb-16">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#ff6900] to-[#aaff00] rounded-[2rem] blur opacity-20 group-focus-within:opacity-40 transition duration-500"></div>


            <form onSubmit={handleSearch} className="relative flex items-center glass p-2 rounded-[2rem] shadow-xl overflow-hidden">
               <div className="pl-6 pr-4">
                  <Search className="text-muted-foreground" size={24} />
               </div>
               <input
                 type="text"
                 value={query}
                 onChange={(e) => setQuery(e.target.value)}
                 placeholder="Search for any food, drink, or recipe..."
                 className="flex-grow py-5 bg-transparent border-none outline-none text-lg font-medium placeholder:text-muted-foreground/60"
               />
               <button 
                 type="submit"
                 disabled={isLoading}
                 className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-[1.5rem] hover:bg-primary/90 transition-all flex items-center space-x-2"
               >
                 {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Search"}
               </button>
            </form>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Results List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold font-outfit px-2">Results {results.length > 0 && `(${results.length})`}</h3>
                <button className="flex items-center space-x-1 text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
                  <Filter size={16} />
                  <span>Advanced Filters</span>
                </button>
              </div>

              <AnimatePresence mode="popLayout">
                {results.length > 0 ? (
                  results.map((food, idx) => (
                    <motion.div
                      key={food.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => setSelectedFood(food)}
                      className={`group flex items-center justify-between p-4 glass border-border rounded-3xl cursor-pointer hover:shadow-lg transition-all ${selectedFood?.id === food.id ? 'border-[#ff6900] ring-2 ring-[#ff6900]/20 bg-[#ff6900]/5' : 'hover:bg-secondary/30'}`}

                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-secondary shadow-sm">
                           <img src={food.image} alt={food.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg">{food.label}</h4>
                          <p className="text-sm text-muted-foreground font-medium">{food.calories} kcal • 100g</p>
                        </div>
                      </div>
                      <ChevronRight className={`text-muted-foreground transition-transform ${selectedFood?.id === food.id ? 'rotate-90 text-[#ff6900]' : ''}`} />

                    </motion.div>
                  ))
                ) : (
                  !isLoading && (
                    <div className="py-20 text-center glass rounded-[3rem] border-dashed border-2 border-border">
                       <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6 text-muted-foreground">
                          <Apple size={40} />
                       </div>
                       <p className="text-muted-foreground font-medium">Start typing to explore nutrition data.</p>
                       <div className="mt-8 flex flex-wrap justify-center gap-2">
                         {["Avocado", "Salmon", "Almonds", "Oatmeal", "Egg"].map(tag => (
                           <button key={tag} onClick={() => {setQuery(tag);}} className="px-4 py-2 bg-secondary/50 hover:bg-primary/10 hover:text-primary rounded-full text-sm font-bold transition-all border border-border">
                             {tag}
                           </button>
                         ))}
                       </div>
                    </div>
                  )
                )}
              </AnimatePresence>
            </div>

            {/* Nutrition Detail Panel */}
            <div className="lg:col-span-1">
              <div className="sticky top-32">
                <AnimatePresence mode="wait">
                  {selectedFood ? (
                    <motion.div
                      key={selectedFood.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="glass overflow-hidden rounded-[2.5rem] shadow-2xl border-primary/20"
                    >
                      <div className="h-48 relative overflow-hidden">
                         <img src={selectedFood.image} alt={selectedFood.label} className="w-full h-full object-cover" />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-bottom p-6 flex-col justify-end">
                            <span className="text-xs font-bold text-primary-foreground/80 uppercase tracking-widest mb-1">Detailed View</span>
                            <h3 className="text-2xl font-bold text-white font-outfit">{selectedFood.label}</h3>
                         </div>
                      </div>

                      <div className="p-8">
                         <div className="grid grid-cols-2 gap-4 mb-8">
                            <MacroBadge label="Calories" value={selectedFood.calories} unit="kcal" color="bg-[#ff6900]/10 text-[#ff6900]" />
                            <MacroBadge label="Protein" value={selectedFood.protein} unit="g" color="bg-[#aaff00]/10 text-[#aaff00]" />

                            <MacroBadge label="Carbs" value={selectedFood.carbs} unit="g" color="bg-[#facc15]/10 text-[#facc15]" />
                            <MacroBadge label="Fats" value={selectedFood.fat} unit="g" color="bg-[#22c55e]/10 text-[#22c55e]" />

                         </div>

                         <div className="space-y-6">
                            <div>
                               <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Vitamins</h5>
                               <div className="flex flex-wrap gap-2">
                                  {selectedFood.vitamins.map(v => (
                                    <span key={v} className="px-3 py-1 bg-secondary rounded-lg text-xs font-bold">{v}</span>
                                  ))}
                               </div>
                            </div>
                            <div>
                               <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Minerals</h5>
                               <div className="flex flex-wrap gap-2">
                                  {selectedFood.minerals.map(m => (
                                    <span key={m} className="px-3 py-1 bg-secondary rounded-lg text-xs font-bold">{m}</span>
                                  ))}
                               </div>
                            </div>
                         </div>

                         <div className="mt-8 pt-6 border-t border-border flex flex-col space-y-4">
                            <button 
                               onClick={() => addToLog(selectedFood)}
                               disabled={isAdding}
                               className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-primary/20 hover:scale-105 transition-all disabled:opacity-50"
                            >
                               {isAdding ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                               <span>Add to Daily Log</span>
                            </button>

                            <button className="w-full py-4 glass border-border font-bold rounded-2xl text-xs hover:bg-secondary transition-all">
                               View Full Micronutrient Profile
                            </button>
                         </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="glass p-10 rounded-[2.5rem] text-center bg-gradient-to-br from-primary/5 to-transparent border-dashed border-2 border-primary/20"
                    >
                       <Sparkles className="mx-auto text-[#ff6900] mb-6" size={48} />

                       <h4 className="text-xl font-bold mb-4">Nutrient Insights</h4>
                       <p className="text-muted-foreground text-sm leading-relaxed mb-6">Select a food item to see a complete nutritional breakdown including macros, vitamins, and minerals.</p>
                       <div className="p-4 bg-white dark:bg-white/5 rounded-2xl text-xs font-medium text-muted-foreground">
                          Pro Tip: High protein intake after exercise promotes muscle synthesis!
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function MacroBadge({ label, value, unit, color }) {
  return (
    <div className={`p-4 rounded-2xl ${color} flex flex-col items-center justify-center text-center`}>
      <span className="text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">{label}</span>
      <div className="flex items-baseline space-x-0.5">
        <span className="text-xl font-bold">{value}</span>
        <span className="text-[10px] font-bold uppercase">{unit}</span>
      </div>
    </div>
  );
}
