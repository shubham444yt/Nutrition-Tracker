"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, User, LayoutDashboard, Search, Utensils, BarChart3, Mail } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/", icon: null },
  { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={18} /> },
  { name: "Tracking", href: "/tracking", icon: <Utensils size={18} /> },
  { name: "Search", href: "/search", icon: <Search size={18} /> },
  { name: "Analytics", href: "/analytics", icon: <BarChart3 size={18} /> },
  { name: "Contact", href: "/contact", icon: <Mail size={18} /> },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "py-4 glass shadow-lg" : "py-6 bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary rounded-xl flex items-center justify-center shadow-lg">
              <Utensils className="text-primary-foreground" size={24} />
            </div>

            <span className="text-2xl font-bold font-outfit tracking-tighter text-foreground">
              Nutri<span className="text-primary">Track</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-md font-medium transition-colors hover:text-primary ${
                  pathname === link.href ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {user ? (
              <div className="flex items-center space-x-4 pl-4 border-l border-border">
                <Link href="/profile" className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-primary font-bold shadow-md">
                    {user.name?.charAt(0) || "U"}
                  </div>
                </Link>
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="p-2 text-muted-foreground hover:text-error transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  Login
                </Link>
                 <Link
                  href="/signup"
                  className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-full shadow-md hover:bg-primary/90 transition-all transform hover:scale-105 active:scale-95"
                >
                  Sign Up
                </Link>

              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-card border-t border-border mt-4 px-6 py-8"
            >
              <div className="flex flex-col space-y-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 text-lg font-medium ${
                      pathname === link.href ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {link.icon}
                    <span>{link.name}</span>
                  </Link>
                ))}
                
                <div className="pt-6 border-t border-border flex flex-col space-y-4">
                  {user ? (
                    <>
                      <Link
                        href="/profile"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-3 text-lg font-medium text-foreground"
                      >
                        <User size={20} />
                        <span>Profile</span>
                      </Link>
                      <button
                        onClick={() => {
                          setShowLogoutConfirm(true);
                          setIsOpen(false);
                        }}
                        className="flex items-center space-x-3 text-lg font-medium text-error"
                      >
                        <LogOut size={20} />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={() => setIsOpen(false)}
                        className="w-full py-3 text-center rounded-xl bg-secondary font-medium"
                      >
                        Login
                      </Link>
                       <Link
                        href="/signup"
                        onClick={() => setIsOpen(false)}
                        className="w-full py-3 text-center rounded-xl bg-primary text-primary-foreground font-medium shadow-lg"
                      >
                        Sign Up
                      </Link>

                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
          {showLogoutConfirm && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowLogoutConfirm(false)}
                    className="absolute inset-0 bg-background/80 backdrop-blur-md" 
                  />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative glass w-full max-w-md p-10 rounded-[2.5rem] shadow-2xl border-error/20"
                  >
                      <div className="w-20 h-20 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-8">
                          <LogOut size={40} />
                      </div>
                      <h3 className="text-3xl font-bold text-center mb-4 font-outfit">Logout Session?</h3>
                      <p className="text-muted-foreground text-center mb-10 leading-relaxed font-medium">Are you sure you want to logout? You'll need to sign in again to access your personalized nutrition data.</p>
                      
                      <div className="flex flex-col sm:flex-row gap-4">
                          <button 
                            onClick={() => {
                              logout();
                              setShowLogoutConfirm(false);
                            }}
                            className="flex-1 py-4 bg-error text-white font-bold rounded-2xl hover:bg-error/90 transition-all shadow-xl shadow-error/20"
                          >
                              Logout
                          </button>
                          <button 
                            onClick={() => setShowLogoutConfirm(false)}
                            className="flex-1 py-4 bg-secondary text-foreground font-bold rounded-2xl hover:bg-secondary/80 transition-all border border-border"
                          >
                              Cancel
                          </button>
                      </div>
                  </motion.div>
              </div>
          )}
      </AnimatePresence>
    </>
  );
}
