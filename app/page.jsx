"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import { ArrowRight, CheckCircle2, Star, Zap, Shield, Heart, Search, TrendingUp, Activity, PieChart, Users, Camera, Utensils } from "lucide-react";
import { useState } from "react";
import { searchFood } from "@/utils/foodApi";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setSearchError("");
    try {
      const results = await searchFood(searchQuery);
      if (results.error) {
        setSearchError(results.error);
        setSearchResults([]);
      } else {
        setSearchResults(results);
      }
    } catch (err) {
      setSearchError("An unexpected error occurred. Please try again.");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const features = [
    {
      title: "Smart Meal Tracking",
      description: "Log your meals effortlessly with our intelligent search and rapid entry system.",
      icon: <Zap className="text-primary" size={24} />,
    },
    {
      title: "Nutrient Analysis",
      description: "Get detailed breakdowns of macros, vitamins, and minerals for everything you eat.",
      icon: <Shield className="text-secondary" size={24} />,
    },
    {
      title: "Goal Management",
      description: "Set personalized health goals and track your progress with beautiful analytics.",
      icon: <Star className="text-accent" size={24} />,
    },
    {
      title: "Healthy Lifestyle",
      description: "Build lasting habits with smart reminders and personalized recommendations.",
      icon: <Heart className="text-error" size={24} />,
    },
  ];

  const galleryImages = [
    { src: "/gallery_food_1_1773331364819.png", alt: "Avocado Toast", title: "Avocado Toast with Egg" },
    { src: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop", alt: "Smoothie Bowl", title: "Vibrant Smoothie Bowl" },
    { src: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=1000&auto=format&fit=crop", alt: "Grilled Salmon", title: "Citrus Grilled Salmon" },
    { src: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000&auto=format&fit=crop", alt: "Salad Bowl", title: "Fresh Garden Bowl" },
    { src: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=1000&auto=format&fit=crop", alt: "Pizza", title: "Artisanal Veggie Pizza" },
    { src: "https://images.unsplash.com/photo-1543353071-873f17a7a088?q=80&w=1000&auto=format&fit=crop", alt: "Healthy Snacks", title: "Protein Packed Energy" },
  ];

  return (
    <AppLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden mt-[-55px] pt-12 pb-24 md:pt-20 md:pb-32">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-16 md:mb-0">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  <span>Revolutionizing Nutrition</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold font-outfit tracking-tight leading-tight mb-6">
                  Fuel Your Body with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Intelligence</span>
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-lg leading-relaxed">
                  The most advanced food nutrition tracking platform. Monitor your habits, analyze nutrients, and reach your peak performance.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link
                    href="/signup"
                    className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center group"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                  </Link>
                  <Link
                    href="/search"
                    className="px-8 py-4 bg-white/50 dark:bg-white/5 backdrop-blur-md border border-border font-bold rounded-2xl hover:bg-white/80 dark:hover:bg-white/10 transition-all flex items-center justify-center"
                  >
                    Try Search
                  </Link>
                </div>
                
                <div className="mt-12 flex items-center space-x-6">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-secondary flex items-center justify-center overflow-hidden shadow-md">
                        <img src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="User" />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-bold text-foreground">15k+</span> users tracking daily
                  </p>
                </div>
              </motion.div>
            </div>
            
            <div className="md:w-1/2 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="relative z-10"
              >
                <div className="relative group p-4">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-[3rem] blur opacity-20 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative glass rounded-[2.5rem] overflow-hidden shadow-2xl border-white/20">
                    <img
                      src="/images/bg.jpg"
                      alt="Premium Food Photography"
                      className="w-full h-[65vh] object-cover transform group-hover:scale-105 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  </div>
                  
                  {/* Floating Elements */}
                  <motion.div
                    animate={{ y: [0, -20, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="absolute -top-6 -right-6 glass p-5 rounded-[2rem] shadow-2xl hidden lg:block border-primary/20"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-2xl bg-success/20 flex items-center justify-center text-success">
                        <CheckCircle2 size={28} />
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Nutrient Check</p>
                        <p className="font-bold text-foreground">Protein Target Hit!</p>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    animate={{ y: [0, 20, 0] }}
                    transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                    className="absolute -bottom-6 -left-6 glass p-5 rounded-[2rem] shadow-2xl hidden lg:block border-secondary/20"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary">
                        <TrendingUp size={28} />
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Weight Tracker</p>
                        <p className="font-bold text-foreground">-2.4kg this month</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
              
              {/* Background Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/10 rounded-full blur-[120px] -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
<section id="features" className="py-24 relative overflow-hidden">
  {/* Background Elements */}
  <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 via-transparent to-secondary/5"></div>
  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10"></div>
  <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10"></div>
  
  <div className="container mx-auto px-6 relative">
    {/* Section Header with Animation */}
    <div className="text-center max-w-3xl mx-auto mb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6 border border-primary/20"
      >
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
        <span className="text-sm font-semibold text-primary uppercase tracking-wider">Why Choose Us</span>
      </motion.div>
      
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-4xl md:text-6xl font-bold font-outfit mb-6"
      >
        Perfect balance for your{' '}
        <span className="relative">
          <span className="text-primary relative z-10">Lifestyle</span>
          <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary/30" viewBox="0 0 100 10" preserveAspectRatio="none">
            <path d="M0,5 Q25,0 50,5 T100,5" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
        </span>
      </motion.h2>
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="text-lg text-muted-foreground max-w-2xl mx-auto"
      >
        Professional-grade tools to help you understand every bite and how it fuels your unique journey.
      </motion.p>
    </div>
    
    {/* Features Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
      {features.map((feature, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.1 }}
          whileHover={{ y: -8 }}
          className="group relative"
        >
          {/* Card Background with Gradient Border */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-[2.5rem] blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100"></div>
          
          <div className="relative glass p-8 rounded-[2.5rem] transition-all duration-500 border border-border/50 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 bg-background/50 backdrop-blur-xl">
            {/* Icon Container */}
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-lg group-hover:blur-xl transition-all opacity-0 group-hover:opacity-100"></div>
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 shadow-lg flex items-center justify-center group-hover:rotate-6 group-hover:scale-110 transition-all duration-500">
                <div className="text-white [&>svg]:w-8 [&>svg]:h-8">
                  {feature.icon}
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-2 -right-2 w-3 h-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-primary/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity delay-100"></div>
            </div>
            
            {/* Content */}
            <h3 className="text-xl font-bold mb-4 font-outfit group-hover:text-primary transition-colors">
              {feature.title}
            </h3>
            <p className="text-muted-foreground leading-relaxed font-medium text-sm">
              {feature.description}
            </p>
            
            {/* Hover Indicator */}
            <div className="absolute bottom-6 right-6 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
              <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
    
    {/* Bottom Decorative Pattern */}
    <div className="mt-16 flex justify-center gap-2 opacity-50">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="w-2 h-2 rounded-full bg-primary/30 animate-pulse" style={{ animationDelay: `${i * 200}ms` }}></div>
      ))}
    </div>
  </div>
</section>

{/* Quick Search Section */}
      <section id="search-section" className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold font-outfit mb-6 italic">Instant Food <span className="text-primary not-italic">Intelligence</span></h2>
            <p className="text-lg text-muted-foreground font-medium">Type any food or drink to get immediate nutritional breakdowns.</p>
          </div>
          
          <div className="max-w-2xl mx-auto mb-2">
             <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-[2rem] blur opacity-25 group-focus-within:opacity-50 transition duration-500"></div>
                <div className="relative flex items-center glass p-2 rounded-[2rem] shadow-3xl border-white/20">
                   <div className="pl-6 pr-4">
                      <Search className="text-muted-foreground" size={24} />
                   </div>
                   <input 
                      type="text" 
                      placeholder="Enter a food (e.g. Avocado Toast, Green Tea)"
                      className="w-full bg-transparent border-none py-5 px-2 outline-none text-lg font-medium"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                   />
                   <button 
                      onClick={handleSearch}
                      disabled={isSearching}
                      className="bg-primary text-white px-8 py-4 rounded-[1.5rem] font-bold hover:scale-105 transition-all disabled:opacity-50 shadow-xl shadow-primary/20"
                   >
                      {isSearching ? "Searching..." : "Analyze"}
                   </button>
                </div>
             </div>
          </div>
<br/> <br/> <br/> <br/> <br/>
          <AnimatePresence>
             {searchError && (
                <motion.div 
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.95 }}
                   className="max-w-xl mx-auto mb-10 p-4 rounded-2xl bg-error/10 border border-error/20 text-error text-center font-medium"
                >
                   {searchError}
                </motion.div>
             )}
          </AnimatePresence>

          <AnimatePresence>
             {searchResults.length > 0 && (
                <motion.div 
                   initial={{ opacity: 0, y: 40 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                   {searchResults.map((item, idx) => (
                      <motion.div 
                         key={item.id}
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: idx * 0.1 }}
                         className="glass rounded-[2rem] flex flex-col md:flex-row hover:shadow-2xl transition-all border-border/40 group overflow-hidden"
                      >
                         <div className="md:w-[40%] relative min-h-[200px] md:min-h-full">
                            <img 
                               src={item.image} 
                               alt={item.label} 
                               className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                            />
                            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                               <div className="bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg">
                                  <CheckCircle2 className="text-primary" size={24} />
                               </div>
                            </div>
                         </div>
                         <div className="md:w-[65%] p-8 flex flex-col justify-center">
                            <h3 className="text-xl font-extrabold mb-6 font-outfit text-foreground group-hover:text-primary transition-colors line-clamp-2 md:line-clamp-none">{item.label}</h3>
                            
                            <div className="grid grid-cols-2 gap-4">
                               <div className="bg-primary/5 p-4 rounded-3xl border border-primary/10 flex flex-col items-center md:items-start">
                                  <div className="flex items-center gap-2 mb-2">
                                     <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                                     <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Calories</p>
                                  </div>
                                  <p className="text-2xl font-black text-primary leading-none">{Math.round(item.calories)}</p>
                                  <p className="text-[10px] font-bold text-muted-foreground/60 mt-1 uppercase">kcal / serving</p>
                                </div>
                               <div className="bg-secondary/5 p-4 rounded-3xl border border-secondary/10 flex flex-col items-center md:items-start">
                                  <div className="flex items-center gap-2 mb-2">
                                     <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
                                     <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Protein</p>
                                  </div>
                                  <p className="text-2xl font-black text-secondary leading-none">{Math.round(item.protein)}<span className="text-xs font-medium ml-0.5">g</span></p>
                                  <p className="text-[10px] font-bold text-muted-foreground/60 mt-1 uppercase">Growth & Repair</p>
                               </div>
                               <div className="bg-accent/5 p-4 rounded-3xl border border-accent/10 flex flex-col items-center md:items-start">
                                  <div className="flex items-center gap-2 mb-2">
                                     <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                                     <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Carbs</p>
                                  </div>
                                  <p className="text-2xl font-black text-accent leading-none">{Math.round(item.carbs)}<span className="text-xs font-medium ml-0.5">g</span></p>
                                  <p className="text-[10px] font-bold text-muted-foreground/60 mt-1 uppercase">Energy Source</p>
                               </div>
                               <div className="bg-error/5 p-4 rounded-3xl border border-error/10 flex flex-col items-center md:items-start">
                                  <div className="flex items-center gap-2 mb-2">
                                     <div className="w-2 h-2 rounded-full bg-error animate-pulse"></div>
                                     <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Fats</p>
                                  </div>
                                  <p className="text-2xl font-black text-error leading-none">{Math.round(item.fat)}<span className="text-xs font-medium ml-0.5">g</span></p>
                                  <p className="text-[10px] font-bold text-muted-foreground/60 mt-1 uppercase">Healthy Lipids</p>
                               </div>
                            </div>
                         </div>
                      </motion.div>
                   ))}
                </motion.div>
             )}
          </AnimatePresence>
        </div>
      </section>

      {/* Analytics Visualization Section */}
      <section className="py-24 overflow-hidden">
        <div className="container mx-auto px-6">
           <div className="glass rounded-[4rem] p-12 lg:p-20 relative overflow-hidden border-border/40">
              <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10">
                 <div className="lg:w-1/2 space-y-8">
                    <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-bold uppercase tracking-widest border border-secondary/20">
                       <Activity size={16} />
                       <span>Deep Insights</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold font-outfit leading-tight text-foreground">
                       Beautiful Data, <br />
                       <span className="text-secondary">Healthier Habits</span>
                    </h2>
                    <p className="text-lg text-muted-foreground font-medium leading-relaxed max-w-lg">
                       Our analytics engine processes your data into stunning, easy-to-read charts. See exactly where your calories go and how your habits evolve over time.
                    </p>
                    <div className="space-y-4 pt-4">
                       {[
                          "Real-time Macro Breakdown",
                          "Weekly Progress Heatmaps",
                          "Smart Goal Projections"
                       ].map((item, i) => (
                          <div key={i} className="flex items-center gap-3">
                             <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center text-success">
                                <CheckCircle2 size={14} />
                             </div>
                             <span className="font-bold text-foreground">{item}</span>
                          </div>
                       ))}
                    </div>
                 </div>
                 
                 <div className="lg:w-1/2 relative">
                    <motion.div 
                       initial={{ opacity: 0, scale: 0.9, x: 50 }}
                       whileInView={{ opacity: 1, scale: 1, x: 0 }}
                       viewport={{ once: true }}
                       className="relative glass p-8 rounded-[3rem] shadow-3xl border-white/10"
                    >
                       {/* Mock UI for Analytics */}
                       <div className="space-y-8">
                          <div className="flex items-center justify-between">
                             <div>
                                <h4 className="font-bold text-xl font-outfit text-foreground">Nutrient Balance</h4>
                                <p className="text-sm text-muted-foreground font-medium">Daily average this week</p>
                             </div>
                             <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg">
                                <PieChart size={24} />
                             </div>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-6">
                             {[
                                { label: "Proteins", val: 78, color: "bg-primary", pct: "24%" },
                                { label: "Carbs", val: 56, color: "bg-secondary", pct: "45%" },
                                { label: "Fats", val: 92, color: "bg-error", pct: "31%" }
                             ].map((bar, idx) => (
                                <div key={idx} className="space-y-2">
                                   <div className="flex justify-between items-end">
                                      <span className="font-bold text-sm text-foreground">{bar.label}</span>
                                      <span className="font-black text-xs text-muted-foreground">{bar.pct}</span>
                                   </div>
                                   <div className="h-4 w-full bg-secondary/10 rounded-full overflow-hidden">
                                      <motion.div 
                                         initial={{ width: 0 }}
                                         whileInView={{ width: `${bar.val}%` }}
                                         viewport={{ once: true }}
                                         transition={{ duration: 1.5, delay: 0.2 + (idx * 0.1) }}
                                         className={`h-full ${bar.color} rounded-full`}
                                      />
                                   </div>
                                </div>
                             ))}
                          </div>

                          <div className="pt-6 mt-6 border-t border-border/50 flex items-center justify-between">
                             <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-success/10 text-success">
                                   <Activity size={20} />
                                </div>
                                <div>
                                   <p className="text-xs font-bold text-muted-foreground uppercase opacity-70">Metabolic Rate</p>
                                   <p className="text-lg font-black text-foreground">Optimal</p>
                                </div>
                             </div>
                             <button className="px-5 py-2.5 bg-foreground text-background font-bold rounded-xl text-xs hover:scale-105 transition-all">
                                View Full Report
                             </button>
                          </div>
                       </div>
                    </motion.div>
                    
                    {/* Background Visual Elements */}
                    <div className="absolute -top-20 -right-20 w-80 h-80 bg-secondary/10 rounded-full blur-[100px] -z-10"></div>
                 </div>
              </div>
           </div>
        </div>
      </section>

    

      {/* CTA Section */}
<section className="py-16 bg-gradient-to-br from-[#fff6f2] via-[#fff6f2] to-[#ffe8e0] relative overflow-hidden">
  {/* Animated Background Patterns */}
  <div className="absolute inset-0 opacity-30">
    <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#ff6900]/5 rounded-full blur-3xl animate-pulse"></div>
    <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#ff6900]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
  </div>
  
  {/* Decorative Grid Pattern */}
  <div className="absolute inset-0" style={{
    backgroundImage: `radial-gradient(circle at 1px 1px, ${'#ff6900'}20 1px, transparent 0)`,
    backgroundSize: '40px 40px'
  }}></div>
  
  <div className="container mx-auto px-6 relative z-10">
    <div className="flex flex-col lg:flex-row items-center justify-between gap-16">

      {/* Left Content - Enhanced */}
      <div className="lg:w-1/2 text-left relative">


        {/* Brand Indicator with Animation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="w-10 h-10 rounded-xl bg-[#ff6900] flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-foreground">NutriTrack</span>
            <span className="text-sm text-muted-foreground font-medium ml-2">ecosystem.</span>
          </div>
        </motion.div>

        {/* Main Heading with Enhanced Typography */}
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold font-outfit leading-[1.1] text-foreground mb-8 relative"
        >
          Transform your body with{' '}
          <span className="relative inline-block">
            <span className="text-[#ff6900] italic relative z-10">NutriTrack</span>
            <svg className="absolute -bottom-2 left-0 w-full h-4 text-[#ff6900]/30" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0,5 Q12.5,0 25,5 T50,5 T75,5 T100,5" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round"/>
            </svg>
          </span>
        </motion.h2>

        {/* Description with Enhanced Styling */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed font-medium relative"
        >
          <span className="absolute -left-4 top-0 text-4xl text-[#ff6900]/20 font-serif">"</span>
          Discover the perfect balance of nutrients and calories with our world-class tracking platform. 
          Join the largest community of health enthusiasts.
          <span className="absolute -bottom-4 right-0 text-4xl text-[#ff6900]/20 font-serif">"</span>
        </motion.p>

        

        {/* CTA Button with Enhanced Design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 items-start sm:items-center"
        >
          <Link
            href="/signup"
            className="group relative inline-block px-10 py-5 bg-[#0f172a] text-white font-bold rounded-2xl shadow-2xl hover:scale-105 transition-all uppercase tracking-widest text-xs overflow-hidden"
          >
            <span className="relative z-10">Start Your Journey Now</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#ff6900] to-[#ff4500] opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>
          
          
        </motion.div>
      </div>

      {/* Right Visual Collage - Preserved Original Design */}
      <div className="lg:w-1/2 relative flex items-center justify-center">
        <div className="relative w-full max-w-lg">

          {/* Main Image (Big Bottle) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100 }}
            className="relative z-10 bg-gradient-to-br from-[#ffece0] to-[#ffd6c0] rounded-[3rem] p-12 overflow-hidden group"
          >
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#ff6900]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <img
              src="/images/n1.png"
              alt="Nutritional Drink"
              className="w-full h-auto object-contain transform group-hover:scale-105 transition-transform duration-700 drop-shadow-2xl"
            />
          </motion.div>

          {/* Small icons/previews - Preserved with minor animation enhancement */}
          <div className="absolute -bottom-8 left-0 flex space-x-4 z-20">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.1 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
                className="w-16 h-16 glass bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-xl flex items-center justify-center cursor-pointer hover:border-[#ff6900] border-2 border-transparent transition-all"
              >
                <img
                  src={i === 1 ? "https://cdn-icons-png.flaticon.com/512/3183/3183463.png" : i === 2 ? "https://cdn-icons-png.flaticon.com/512/8740/8740492.png" : "https://cdn-icons-png.flaticon.com/512/2276/2276931.png"}
                  className="w-full h-full object-contain"
                  alt="icon"
                />
              </motion.div>
            ))}
          </div>

          {/* Background Accent - Enhanced */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[80%] bg-gradient-to-r from-[#ff6900]/20 via-[#ff6900]/10 to-transparent blur-[100px] -z-20 rounded-full animate-pulse"></div>
        </div>
      </div>

    </div>
  </div>
</section>

    </AppLayout>
  );
}
