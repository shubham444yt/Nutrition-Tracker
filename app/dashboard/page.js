"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import { useAuth } from "@/context/AuthContext";
import {
  Flame,
  Droplets,
  Target,
  Trophy,
  Plus,
  TrendingUp,
  Calendar,
  ChevronRight,
  UtensilsCrossed,
  Activity,
  ArrowUpRight,
  Zap,
  Leaf
} from "lucide-react";
import NutritionChart from "@/components/dashboard/NutritionChart";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    if (user?.id) {
       fetchDailyData();
    }
  }, [user]);

  const fetchDailyData = async () => {
    try {
       const res = await fetch(`/api/meals?userId=${user.id || user._id}`);
       const data = await res.json();
       
       if (Array.isArray(data)) {
          // Filter for today's meals
          const today = new Date().toDateString();
          const todayMeals = data.filter(m => new Date(m.date).toDateString() === today);
          setMeals(todayMeals);
       } else {
          setMeals([]);
       }
    } catch (err) {
       console.error("Failed to fetch dashboard data");
       setMeals([]);
    } finally {
       setIsLoading(false);
    }
  };


  if (!mounted) return null;

  const totals = meals.reduce((acc, curr) => ({
    cals: acc.cals + (curr.calories || 0),
    prot: acc.prot + (curr.protein || 0),
    carbs: acc.carbs + (curr.carbs || 0),
    fats: acc.fats + (curr.fats || 0),
  }), { cals: 0, prot: 0, carbs: 0, fats: 0 });

  const proteinsPct = totals.cals > 0 ? Math.round((totals.prot * 4 / totals.cals) * 100) : 0;
  const carbsPct = totals.cals > 0 ? Math.round((totals.carbs * 4 / totals.cals) * 100) : 0;
  const fatsPct = totals.cals > 0 ? Math.round((totals.fats * 9 / totals.cals) * 100) : 0;

  const macroData = [
    { name: "Proteins", value: proteinsPct || 0 },
    { name: "Carbs", value: carbsPct || 0 },
    { name: "Fats", value: fatsPct || 0 },
  ];

  const dailyStats = [
    { label: "Calories", value: Math.round(totals.cals).toLocaleString(), target: user?.profile?.calorieGoal || "2,200", unit: "kcal", icon: <Flame className="text-orange-500" />, color: "bg-orange-500/10", border: "border-orange-500/20" },
    { label: "Proteins", value: Math.round(totals.prot).toString(), target: user?.profile?.proteinGoal || "120", unit: "g", icon: <Zap className="text-primary" />, color: "bg-primary/10", border: "border-primary/20" },
    { label: "Carbs", value: Math.round(totals.carbs).toString(), target: user?.profile?.carbGoal || "250", unit: "g", icon: <TrendingUp className="text-secondary" />, color: "bg-secondary/10", border: "border-secondary/20" },
    { label: "Fats", value: Math.round(totals.fats).toString(), target: user?.profile?.fatGoal || "70", unit: "g", icon: <Droplets className="text-accent" />, color: "bg-accent/10", border: "border-accent/20" },
  ];

  const recentMeals = meals.slice(0, 3).map(m => ({
    _id: m._id,
    name: m.name,
    time: m.time,
    type: m.type,
    calories: Math.round(m.calories || 0),
    tags: [m.type || "Meal"]
  }));


  const recommendations = [
    { title: "Increase Fiber", text: "You're slightly below your fiber goal. Try adding flaxseeds to your next meal.", icon: <Leaf className="text-success" /> },
    { title: "Stay Hydrated", text: "Drink 2 more glasses of water to stay on track for your hydration goal.", icon: <Droplets className="text-cyan-500" /> },
  ];

  return (
    <AppLayout>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 space-y-4 md:space-y-0 text-white">
          <div>
            <h1 className="text-4xl font-bold font-outfit text-black">Health <span className="text-primary">Overview</span></h1>
            <p className="text-muted-foreground mt-1">Welcome back, {user?.name || "Achiever"}! You're 82% towards your daily goal.</p>
          </div>
          <div className="flex space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2.5 glass border-border hover:bg-secondary/50 rounded-xl transition-all">
              <Calendar size={18} className="text-primary" />
              <span className="font-medium text-foreground">Today, Mar 11</span>
            </button>
            <Link href="/tracking" className="flex items-center space-x-2 px-6 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all">
              <Plus size={20} />
              <span>Log Meal</span>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {dailyStats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-6 glass rounded-3xl border-2 ${stat.border} hover:shadow-xl transition-all group`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  {stat.icon}
                </div>
                <div className="text-xs font-bold px-2 py-1 rounded bg-secondary text-muted-foreground uppercase tracking-widest">Daily</div>
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold font-outfit">{stat.value}</span>
                <span className="text-xs text-muted-foreground font-medium uppercase">{stat.unit}</span>
              </div>
              <div className="mt-4 h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "75%" }}
                  transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                  className={`h-full ${stat.color.replace('/10', '')} rounded-full`}
                ></motion.div>
              </div>
              <p className="mt-2 text-[10px] text-muted-foreground font-bold">Goal: {stat.target} {stat.unit}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Main Chart */}
          <div className="lg:col-span-2 glass p-8 rounded-[2.5rem] relative overflow-hidden">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold font-outfit flex items-center space-x-2">
                <Activity className="text-primary" size={20} />
                <span>Nutrient Distribution</span>
              </h3>
              <select className="bg-secondary border-none rounded-xl px-3 py-1.5 text-sm font-medium focus:ring-2 focus:ring-primary/20">
                <option>Today</option>
                <option>Yesterday</option>
                <option>Weekly Avg</option>
              </select>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="w-full md:w-1/2">
                <NutritionChart data={macroData} />
              </div>
              <div className="w-full md:w-1/2 space-y-6">
                {macroData.map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-muted-foreground">{item.name}</span>
                      <span className="text-sm font-bold">{item.value}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.value}%` }}
                        transition={{ duration: 1 }}
                        className={`h-full bg-primary rounded-full`}
                        style={{ backgroundColor: idx === 0 ? '#aaff00' : idx === 1 ? '#84cc16' : '#facc15' }}
                      ></motion.div>
                    </div>

                  </div>
                ))}
                <div className="pt-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                  <p className="text-xs font-medium text-primary leading-relaxed">Your protein intake is excellent today! This supports muscle recovery and satiety.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Goals and Progress */}
          <div className="glass p-8 rounded-[2.5rem] bg-gradient-to-br from-primary/5 to-transparent">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold font-outfit flex items-center space-x-2">
                <Target className="text-secondary" size={20} />
                <span>Active Goals</span>
              </h3>
              <Link href="/analytics" className="text-xs font-bold text-primary hover:underline">View All</Link>
            </div>

            <div className="space-y-6">
              {[
                { title: "Weight Loss", progress: 65, icon: <Activity size={18} />, color: "text-primary" },
                { title: "Muscle Build", progress: 42, icon: <Trophy size={18} />, color: "text-accent" },
              ].map((goal, idx) => (

                <div key={idx} className="p-4 bg-white dark:bg-white/5 rounded-2xl border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-xl bg-secondary ${goal.color}`}>{goal.icon}</div>
                      <span className="font-bold">{goal.title}</span>
                    </div>
                    <span className="text-xs font-bold text-primary">{goal.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${goal.progress}%` }}
                      className="h-full bg-gradient-to-r from-primary to-secondary"
                    ></motion.div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 glass border-border bg-white/30 dark:bg-white/5 rounded-[2rem] text-center">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4 border-2 border-primary/20">
                <Flame size={32} className="text-primary" />
              </div>
              <h4 className="font-bold mb-2">3 Day Streak!</h4>
              <p className="text-xs text-muted-foreground mb-4">You're doing amazing. Keep logging your meals to earn more points!</p>
              <button className="w-full py-2 bg-secondary text-foreground text-xs font-bold rounded-xl hover:bg-border transition-colors">View Streak History</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2 glass p-8 rounded-[2.5rem]">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold font-outfit flex items-center space-x-2">
                <UtensilsCrossed className="text-error" size={20} />
                <span>Daily Journal</span>
              </h3>
              <Link href="/tracking" className="flex items-center text-xs font-bold text-primary hover:underline group">
                Full Log <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="space-y-4">
              {recentMeals.map((meal, idx) => (
                <motion.div
                  key={meal._id || idx}
                  whileHover={{ scale: 1.01 }}
                  className="flex items-center justify-between p-5 rounded-[2rem] bg-secondary/30 border border-transparent hover:border-primary/20 hover:bg-secondary/50 transition-all cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 rounded-2xl bg-white dark:bg-white/10 flex items-center justify-center shadow-sm">
                      <img src={`https://source.unsplash.com/random/100x100?food,${idx}`} alt="Food" className="rounded-xl w-10 h-10 object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">{meal.name}</h4>
                      <p className="text-xs text-muted-foreground font-medium">{meal.time} • {meal.type}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-bold text-foreground">+{meal.calories} kcal</span>
                    <div className="flex space-x-2 mt-1">
                      {meal.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">{tag}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="glass p-8 rounded-[2.5rem] bg-gradient-to-tr from-secondary/40 to-transparent border-primary/10">
            <h3 className="text-xl font-bold font-outfit mb-8 flex items-center space-x-2">
              <SparklesIcon className="text-primary" />
              <span>AI Suggestions</span>
            </h3>

            <div className="space-y-6">
              {recommendations.map((rec, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-0 group-hover:opacity-10 transition duration-500"></div>
                  <div className="relative p-5 glass border-border rounded-2xl hover:bg-white/50 dark:hover:bg-white/5 transition-all">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 rounded-lg bg-white dark:bg-white/10 shadow-sm">{rec.icon}</div>
                      <h4 className="font-bold">{rec.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{rec.text}</p>
                    <button className="mt-4 flex items-center text-xs font-bold text-primary group">
                      Apply Insight <ArrowUpRight size={14} className="ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 p-6 rounded-3xl bg-primary text-primary-foreground shadow-xl shadow-primary/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
                <Zap size={100} />
              </div>
              <h4 className="font-bold text-lg mb-2 relative z-10">Power Tip</h4>
              <p className="text-sm text-primary-foreground/80 relative z-10 mb-4">Meal timing matters! Try to consume most of your carbs after your workout for optimal recovery.</p>
              <button className="text-xs font-bold underline relative z-10">Learn more about circadian nutrition</button>
            </div>

          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function SparklesIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
