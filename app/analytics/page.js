"use client";

import { motion } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import {
   LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area
} from "recharts";
import { TrendingUp, Award, Calendar, ChevronDown, Activity, Zap, Heart, Target } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";

export default function AnalyticsPage() {
   const { user } = useAuth();
   const [weeklyData, setWeeklyData] = useState([]);
   const [stats, setStats] = useState({ weight: 0, prot: 0, health: 94 });

   useEffect(() => {
      if (user?.id || user?._id) {
         fetchAnalytics();
      }
   }, [user]);

   const fetchAnalytics = async () => {
      try {
         const res = await fetch(`/api/meals?userId=${user.id || user._id}`);

         const meals = await res.json();
         
         // Process last 7 days
         const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
         const today = new Date();
         const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = addDays(startOfWeek(today), i);
            const dayMeals = meals.filter(m => isSameDay(new Date(m.date), d));
            return {
               day: days[d.getDay()],
               cals: dayMeals.reduce((sum, m) => sum + (m.calories || 0), 0),
               prot: dayMeals.reduce((sum, m) => sum + (m.protein || 0), 0),
               target: 2100
            };
         });
         
         setWeeklyData(last7Days);
         setStats({
            weight: user.profile?.weight || 76.5,
            prot: Math.round(last7Days.reduce((sum, d) => sum + d.prot, 0) / 7),
            health: 94
         });
      } catch (err) {
         console.error("Analytics load failed");
      }
   };

   const weightTrend = [
      { month: "Jan", weight: 82.5 },
      { month: "Feb", weight: 81.2 },
      { month: "Mar", weight: 79.8 },
      { month: "Apr", weight: 78.4 },
      { month: "May", weight: 77.2 },
      { month: "Jun", weight: user?.profile?.weight || 76.5 },
   ];


   return (
      <AppLayout>
         <div className="container mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
               <div>
                  <h1 className="text-4xl md:text-5xl font-bold font-outfit">Performance <span className="text-[#ff6900]">Analytics</span></h1>

                  <p className="text-muted-foreground mt-2">Deep dive into your nutritional trends and health milestones.</p>
               </div>
               <div className="flex space-x-3">
                  <button className="flex items-center space-x-2 px-5 py-3 glass border-border hover:bg-secondary rounded-2xl transition-all font-bold">
                     <Calendar size={18} className="text-primary" />
                     <span>Last 7 Days</span>
                     <ChevronDown size={14} />
                  </button>
               </div>
            </div>

            {/* Global Highlight Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
               <HighlightCard
                  label="Weight Change"
                  value="-6.0"
                  unit="kg"
                  trend="+12%"
                  icon={<TrendingUp size={24} />}
                  color="bg-primary"
               />
               <HighlightCard
                  label="Avg Proteins"
                  value={stats.prot}
                  unit="g"
                  trend="+5%"
                  icon={<Zap size={24} />}
                  color="bg-secondary"
               />
               <HighlightCard
                  label="Heart Health"
                  value="94"
                  unit="/100"
                  trend="+2 pts"
                  icon={<Heart size={24} />}
                  color="bg-error"
               />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
               {/* Calorie Trends Chart */}
               <div className="glass p-8 rounded-[2.5rem] bg-gradient-to-br from-[#ff6900]/5 to-transparent">

                  <div className="flex items-center justify-between mb-10">
                     <h3 className="text-xl font-bold font-outfit">Calorie Consumption</h3>
                     <div className="flex space-x-4 text-xs font-bold text-muted-foreground">
                        <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-[#ff6900]"></span> <span>Intake</span></span>

                        <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-border"></span> <span>Target</span></span>
                     </div>
                  </div>
                  <div className="h-[350px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={weeklyData}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                           <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 600 }} dy={10} />
                           <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 600 }} dx={-10} />
                           <Tooltip
                              cursor={{ fill: 'rgba(170, 255, 0, 0.05)' }}
                              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                           />
                           <Bar dataKey="cals" radius={[6, 6, 6, 6]} barSize={32}>
                              {weeklyData.map((entry, index) => (
                                 <Cell key={`cell-${index}`} fill={entry.cals > entry.target ? '#ff6900' : '#aaff00'} opacity={0.8} />
                              ))}
                           </Bar>


                        </BarChart>
                     </ResponsiveContainer>
                  </div>
               </div>

               {/* Weight Progress Chart */}
               <div className="glass p-8 rounded-[2.5rem] bg-gradient-to-br from-[#aaff00]/5 to-transparent">

                  <div className="flex items-center justify-between mb-10">
                     <h3 className="text-xl font-bold font-outfit">Weight Progress</h3>
                     <button className="text-xs font-bold text-primary hover:underline">Update Weight</button>
                  </div>
                  <div className="h-[350px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={weightTrend}>
                           <defs>
                              <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#aaff00" stopOpacity={0.3} />
                                 <stop offset="95%" stopColor="#aaff00" stopOpacity={0} />
                              </linearGradient>

                           </defs>
                           <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 600 }} dy={10} />
                           <YAxis domain={['dataMin - 5', 'dataMax + 5']} axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 600 }} dx={-10} />

                           <Tooltip
                              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                           />
                           <Area type="monotone" dataKey="weight" stroke="#aaff00" strokeWidth={4} fillOpacity={1} fill="url(#colorWeight)" dot={{ r: 6, fill: '#aaff00', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8, strokeWidth: 0 }} />


                        </AreaChart>
                     </ResponsiveContainer>
                  </div>
               </div>
            </div>

            {/* Goals Management */}
            <div className="glass p-10 rounded-[3rem]">
               <div className="flex justify-between items-center mb-10">
                  <h3 className="text-2xl font-bold font-outfit flex items-center space-x-3">
                     <Award className="text-accent" size={28} />
                     <span>Milestones & Goals</span>
                  </h3>
                  <button className="px-6 py-2.5 bg-foreground text-background font-bold rounded-xl text-sm hover:opacity-90 transition-all">
                     Configure Goals
                  </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-8">
                     <GoalItem
                        title="Body Fat Reduction"
                        desc="Target: 15% body fat by June"
                        progress={72}
                        date="Due in 42 days"
                     />
                     <GoalItem
                        title="Protein Mastery"
                        desc="Maintain 120g+ daily for 30 days"
                        progress={85}
                        date="Due in 4 days"
                     />
                  </div>

                  <div className="p-8 bg-secondary/20 rounded-[2.5rem] border border-border flex flex-col justify-center text-center">
                     <div className="w-20 h-20 bg-white dark:bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl relative">
                        <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-25"></div>
                        <Target className="text-[#ff6900]" size={40} />

                     </div>
                     <h4 className="text-xl font-bold mb-3">You're on track!</h4>
                     <p className="text-muted-foreground leading-relaxed mb-8">
                        Based on your current trajectory, you will reach your weight goal 12 days ahead of schedule. Your consistency is paying off.
                     </p>
                     <div className="flex justify-center space-x-4">
                        <button className="px-6 py-3 bg-[#ff6900] text-white font-bold rounded-2xl text-xs shadow-lg shadow-[#ff6900]/20 hover:scale-105 transition-all">View Full Prediction</button>

                        <button className="px-6 py-3 glass border-border font-bold rounded-2xl text-xs hover:bg-white/80 transition-all">Post to Community</button>
                     </div>

                  </div>
               </div>
            </div>
         </div>
      </AppLayout>
   );
}

function HighlightCard({ label, value, unit, trend, icon, color }) {
   return (
      <motion.div
         whileHover={{ y: -5 }}
         className="glass p-8 rounded-[2.5rem] flex items-center justify-between border-border overflow-hidden relative"
      >
         <div className="absolute top-0 right-0 p-10 opacity-5">
            {icon}
         </div>
         <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
            <div className="flex items-baseline space-x-1 mb-2">
               <h4 className="text-4xl font-bold font-outfit">{value}</h4>
               <span className="text-xl font-medium text-muted-foreground uppercase">{unit}</span>
            </div>
            <div className="flex items-center space-x-1.5 text-xs font-bold text-success">
               <TrendingUp size={14} />
               <span>{trend} vs last month</span>
            </div>
         </div>
         <div className={`w-14 h-14 rounded-[1.25rem] ${color} flex items-center justify-center text-primary-foreground shadow-xl shadow-current/20`}>
            {icon}
         </div>

      </motion.div>
   );
}

function GoalItem({ title, desc, progress, date }) {
   return (
      <div className="space-y-4">
         <div className="flex justify-between items-start">
            <div>
               <h4 className="font-bold text-lg">{title}</h4>
               <p className="text-sm text-muted-foreground font-medium">{desc}</p>
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-3 py-1 bg-secondary rounded-lg">{date}</p>
         </div>
         <div className="relative h-4 bg-secondary rounded-full overflow-hidden">
            <motion.div
               initial={{ width: 0 }}
               animate={{ width: `${progress}%` }}
               transition={{ duration: 1.5, ease: "easeOut" }}
               className="h-full bg-gradient-to-r from-primary via-secondary to-accent shadow-lg"
            ></motion.div>
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
               <span className="text-[10px] font-bold text-white drop-shadow-sm">{progress}% Completed</span>
            </div>
         </div>
      </div>
   );
}
