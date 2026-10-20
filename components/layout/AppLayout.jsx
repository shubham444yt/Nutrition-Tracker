"use client";

import Navbar from "./Navbar";
import Footer from "./Footer";
import { motion } from "framer-motion";

export default function AppLayout({ children, showNavbar = true, showFooter = true }) {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20 selection:text-primary">
      {showNavbar && <Navbar />}
      <main className={`flex-grow ${showNavbar ? "pt-24" : ""}`}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </main>
      {showFooter && <Footer />}
    </div>
  );
}
