"use client";

import Link from "next/link";
import { Utensils, Github, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card pt-16 pb-8 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary rounded-lg flex items-center justify-center shadow-lg">
                <Utensils className="text-white" size={18} />
              </div>
              <span className="text-xl font-bold font-outfit tracking-tighter text-foreground">
                Nutri<span className="text-primary">Track</span>
              </span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-xs">
              Empowering your health journey with high-precision nutrition tracking and personalized insights.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="#" icon={<Twitter size={20} />} />
              <SocialLink href="#" icon={<Instagram size={20} />} />
              <SocialLink href="#" icon={<Github size={20} />} />
              <SocialLink href="#" icon={<Linkedin size={20} />} />
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6 text-foreground">Platform</h4>
            <ul className="space-y-4">
              <FooterLink href="/dashboard">Dashboard</FooterLink>
              <FooterLink href="/tracking">Meal Log</FooterLink>
              <FooterLink href="/search">Food Search</FooterLink>
              <FooterLink href="/analytics">Analytics</FooterLink>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6 text-foreground">Legal</h4>
            <ul className="space-y-4">
              <FooterLink href="#">Privacy Policy</FooterLink>
              <FooterLink href="#">Terms of Service</FooterLink>
              <FooterLink href="#">Cookie Policy</FooterLink>
              <FooterLink href="#">Disclaimer</FooterLink>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6 text-foreground">Company</h4>
            <ul className="space-y-4">
              <FooterLink href="/contact">Contact Us</FooterLink>
              <FooterLink href="#">About Us</FooterLink>
              <FooterLink href="#">Careers</FooterLink>
              <FooterLink href="#">Press Kit</FooterLink>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} NutriTrack AI. All rights reserved.</p>
          <div className="flex space-x-8 mt-4 md:mt-0">
            <span className="hover:text-primary cursor-pointer transition-colors">Server Status: Online</span>
            <span className="hover:text-primary cursor-pointer transition-colors">Version: 1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }) {
  return (
    <li>
      <Link href={href} className="text-muted-foreground hover:text-primary transition-colors">
        {children}
      </Link>
    </li>
  );
}

function SocialLink({ href, icon }) {
  return (
    <a
      href={href}
      className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
    >
      {icon}
    </a>
  );
}
