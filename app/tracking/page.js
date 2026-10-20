"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Search, 
  Coffee, 
  Sun, 
  Moon, 
  Cookie, 
  Clock, 
  ChevronDown,
  ChevronUp,
  Flame,
  Zap,
  CheckCircle2,
  Target
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function TrackingPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id || user?._id) {
       fetchMeals();
    }
  }, [user]);

  const fetchMeals = async () => {
    try {
       const res = await fetch(`/api/meals?userId=${user.id || user._id}`);

       const data = await res.json();
       setMeals(Array.isArray(data) ? data : []);
    } catch (err) {
       toast.error("Failed to load logs");
    } finally {
       setIsLoading(false);
    }
  };


  const mealTypes = [
    { id: "breakfast", label: "Breakfast", icon: <Coffee size={18} />, color: "bg-primary" },
    { id: "lunch", label: "Lunch", icon: <Sun size={18} />, color: "bg-secondary" },
    { id: "dinner", label: "Dinner", icon: <Moon size={18} />, color: "bg-slate-500" },
    { id: "snack", label: "Snacks", icon: <Cookie size={18} />, color: "bg-accent" },
  ];



  const deleteMeal = async (id) => {
    try {
       const res = await fetch(`/api/meals?id=${id}`, { method: 'DELETE' });
       if (res.ok) {
          setMeals(meals.filter(m => m._id !== id));
          toast.success("Meal removed from log");
       }
    } catch (err) {
       toast.error("Failed to delete");
    }
  };


  const filteredMeals = activeTab === "all" ? meals : meals.filter(m => m.type.toLowerCase() === activeTab);

  const totals = meals.reduce((acc, current) => ({
    cals: acc.cals + (current.calories || 0),
    protein: acc.protein + (current.protein || 0),
    carbs: acc.carbs + (current.carbs || 0),
    fats: acc.fats + (current.fats || 0),
  }), { cals: 0, protein: 0, carbs: 0, fats: 0 });

  return (
    <AppLayout>
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="lg:w-2/3">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
               <div>
                  <h1 className="text-4xl font-bold font-outfit">Daily <span className="text-primary">Meal Log</span></h1>
                  <p className="text-muted-foreground mt-2">Track your intake and stay consistent with your goals.</p>
               </div>
               <Link href="/search" className="flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                  <Plus size={20} />
                  <span>Add New Food</span>
               </Link>

            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-4 mb-10">
               <button 
                 onClick={() => setActiveTab("all")}
                 className={`px-6 py-3 rounded-2xl font-bold transition-all ${activeTab === 'all' ? 'bg-foreground text-background shadow-lg' : 'glass border-border hover:bg-secondary'}`}
               >
                 All Meals
               </button>
               {mealTypes.map(type => (
                 <button 
                    key={type.id}
                    onClick={() => setActiveTab(type.id)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold transition-all ${activeTab === type.id ? `${type.color} text-primary-foreground shadow-lg` : 'glass border-border hover:bg-secondary'}`}
                 >
                    {type.icon}
                    <span>{type.label}</span>
                 </button>
               ))}
            </div>

            {/* Meals List */}
            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {filteredMeals.map((meal, idx) => (
                  <motion.div
                    key={meal._id || meal.id || idx}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="glass p-6 rounded-[2rem] border-border hover:shadow-xl transition-all relative group overflow-hidden"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                       <div className="flex items-center space-x-6">
                          <div className={`w-16 h-16 rounded-2xl ${mealTypes.find(t => t.label === meal.type)?.color || 'bg-primary'} flex items-center justify-center text-primary-foreground shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                             {mealTypes.find(t => t.label === meal.type)?.icon || <Coffee size={24} />}
                          </div>

                          <div>
                             <div className="flex items-center space-x-3 mb-1">
                                <h4 className="text-xl font-bold font-outfit">{meal.name}</h4>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter ${mealTypes.find(t => t.label === meal.type)?.color.replace('bg-', 'text-') || 'text-primary'} bg-white/50 dark:bg-white/5`}>{meal.type}</span>
                             </div>
                             <div className="flex items-center space-x-4 text-sm text-muted-foreground font-medium">
                                <span className="flex items-center space-x-1"><Clock size={14} /> <span>{meal.time}</span></span>
                                <span className="flex items-center space-x-1"><Flame size={14} className="text-orange-500" /> <span>{meal.calories || 0} kcal</span></span>
                             </div>
                          </div>
                       </div>

                       <div className="w-full md:w-auto flex flex-col md:flex-row items-stretch md:items-center gap-4">
                          <div className="grid grid-cols-3 gap-3 px-4 py-2 bg-secondary/50 rounded-xl border border-border">
                             <div className="text-center">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-0.5">Prot</p>
                                <p className="text-sm font-bold">{meal.protein}g</p>
                             </div>
                             <div className="text-center px-3 border-x border-border/50">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-0.5">Carb</p>
                                <p className="text-sm font-bold">{meal.carbs}g</p>
                             </div>
                             <div className="text-center">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-0.5">Fat</p>
                                <p className="text-sm font-bold">{meal.fats}g</p>
                             </div>
                          </div>
                          <div className="flex space-x-2">
                             <button className="p-3 glass rounded-xl text-muted-foreground hover:text-primary hover:bg-white/80 transition-all border border-border">
                                <Edit2 size={18} />
                             </button>
                             <button 
                               onClick={() => deleteMeal(meal._id || meal.id)}

                               className="p-3 glass rounded-xl text-muted-foreground hover:text-error hover:bg-white/80 transition-all border border-border"
                             >
                                <Trash2 size={18} />
                             </button>
                          </div>
                       </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredMeals.length === 0 && (
                <div className="py-20 text-center glass rounded-[3rem] border-dashed border-2 border-border">
                    <p className="text-muted-foreground font-medium">No meals logged for this category today.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Analytics */}
          <div className="lg:w-1/3">
            <div className="sticky top-32 space-y-8">
               {/* Daily Summary Card */}
               <div className="glass p-8 rounded-[2.5rem] bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
                  <h3 className="text-xl font-bold font-outfit mb-8 flex items-center space-x-2">
                    <Target className="text-primary" />
                    <span>Daily Progress</span>
                  </h3>

                  <div className="space-y-8">
                    <ProgressRing label="Calories" current={totals.cals} target={2200} unit="kcal" color="stroke-primary" />
                    <ProgressBar label="Protein" current={totals.protein} target={150} unit="g" color="bg-primary" />
                    <ProgressBar label="Carbohydrates" current={totals.carbs} target={200} unit="g" color="bg-secondary" />
                    <ProgressBar label="Fats" current={totals.fats} target={70} unit="g" color="bg-accent" />
                  </div>

                  <div className="mt-10 p-5 bg-white/40 dark:bg-white/5 rounded-3xl border border-border">
                    <div className="flex items-center space-x-3 mb-2 text-success">
                       <CheckCircle2 size={18} />
                       <span className="text-sm font-bold">Good Job!</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">You've hit your protein target early today. Keep it up!</p>
                  </div>
               </div>

               {/* Add quick meal card */}
               <div className="glass p-8 rounded-[3rem] border-dashed border-2 border-border group hover:border-primary/50 transition-colors cursor-pointer text-center">
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Search className="text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <h4 className="font-bold mb-2">Can't find your food?</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-6">Our database is updated daily. Try our barcode scanner on mobile!</p>
                  <button className="w-full py-3 glass border-border font-bold rounded-2xl text-xs hover:bg-secondary transition-all">
                     Search Global Database
                  </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function ProgressBar({ label, current, target, unit, color }) {
  const percent = Math.min((current / target) * 100, 100);
  return (
    <div className="space-y-2">
       <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
          <span className="text-muted-foreground">{label}</span>
          <span className="text-foreground">{current} / {target}{unit}</span>
       </div>
       <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 1 }}
            className={`h-full ${color} rounded-full shadow-lg shadow-current/20`}
          ></motion.div>
       </div>
    </div>
  );
}

function ProgressRing({ label, current, target, unit, color }) {
  const percent = Math.min((current / target) * 100, 100);
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="flex items-center space-x-6">
       <div className="relative w-24 h-24">
          <svg className="w-full h-full transform -rotate-90">
             <circle 
               cx="48" cy="48" r="40" 
               stroke="currentColor" 
               strokeWidth="8" 
               fill="transparent" 
               className="text-secondary"
             />
             <motion.circle 
               cx="48" cy="48" r="40" 
               stroke="currentColor" 
               strokeWidth="8" 
               fill="transparent" 
               strokeDasharray={circumference}
               initial={{ strokeDashoffset: circumference }}
               animate={{ strokeDashoffset }}
               transition={{ duration: 1.5, ease: "easeOut" }}
               className={color}
               strokeLinecap="round"
             />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
             <span className="text-xl font-bold font-outfit">{Math.round(percent)}%</span>
          </div>
       </div>
       <div>
          <h4 className="font-bold text-foreground text-lg">{current}</h4>
          <p className="text-xs font-bold text-muted-foreground uppercase opacity-70 tracking-widest">{label} consumed</p>
          <p className="text-[10px] text-muted-foreground italic mt-1">{target - current} {unit} remaining</p>
       </div>
    </div>
  );
}
