"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Utensils, Mail, Lock, ArrowRight, Github, Facebook, Loader2 } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login({ email, password });
    if (result.success) {
      toast.success("Welcome back!");
    } else {
      toast.error(result.error || "Login failed");
    }
    setIsLoading(false);
  };


  return (
    <AppLayout showFooter={false}>
      <div className="min-h-screen flex items-center justify-center px-6 py-20 bg-secondary/5">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="glass p-10 md:p-14 rounded-[3rem] shadow-2xl relative overflow-hidden bg-card">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>

            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-lg mb-6 group hover:rotate-6 transition-transform">
                <Utensils className="text-primary-foreground" size={32} />
              </div>
              <h2 className="text-3xl font-bold font-outfit tracking-tight mb-2">Welcome Back</h2>
              <p className="text-muted-foreground text-sm">Resume your health journey today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-secondary/30 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Password</label>
                  <Link href="#" className="text-xs text-primary font-bold hover:underline">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-secondary/30 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4.5 bg-primary text-primary-foreground font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center group"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <>
                    <span className="mr-2">Sign In</span>
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10">
              <div className="relative flex items-center justify-center mb-8">
                <div className="flex-grow border-t border-border"></div>
                <span className="px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] bg-transparent">Social Login</span>
                <div className="flex-grow border-t border-border"></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center space-x-2 py-3.5 rounded-2xl border border-border hover:bg-secondary/20 transition-colors font-bold text-sm">
                  <Github size={18} />
                  <span>GitHub</span>
                </button>
                <button className="flex items-center justify-center space-x-2 py-3.5 rounded-2xl border border-border hover:bg-secondary/20 transition-colors font-bold text-sm">
                  <Facebook size={18} className="text-blue-600" />
                  <span>Facebook</span>
                </button>
              </div>
            </div>

            <p className="mt-10 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary font-bold hover:underline">Create an account</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
