"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import { Mail, Phone, MapPin, Send, MessageSquare, Twitter, Instagram, Github, Linkedin, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Message sent! We'll get back to you soon.");
        setFormData({ name: "", email: "", subject: "General Inquiry", message: "" });
      } else {
        toast.error(data.error || "Failed to send message");
      }
    } catch (err) {
      toast.error("Connection error");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <AppLayout>
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* Contact Info */}
            <div>
               <motion.div
                 initial={{ opacity: 0, x: -30 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ duration: 0.6 }}
               >
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
                    <MessageSquare size={14} />
                    <span>Get in Touch</span>
                  </div>
                  <h1 className="text-5xl font-bold font-outfit tracking-tight mb-8">
                    Let's talk about your <span className="text-primary">health journey.</span>
                  </h1>
                  <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
                    Have questions about our nutrition algorithms or need technical support? 
                    Our team of health experts and developers is here to help you succeed.
                  </p>

                  <div className="space-y-8">
                    <ContactDetail 
                      icon={<Mail className="text-primary" />} 
                      title="Email Us" 
                      content="support@nutritrack.ai" 
                      desc="We usually respond within 24 hours." 
                    />
                    <ContactDetail 
                      icon={<Phone className="text-primary" />} 
                      title="Call Us" 
                      content="+1 (555) 000-TRACK" 
                      desc="Mon-Fri from 8am to 6pm EST." 
                    />
                    <ContactDetail 
                      icon={<MapPin className="text-primary" />} 
                      title="Office" 
                      content="123 Health Innovation Ave" 
                      desc="San Francisco, CA 94103, USA" 
                    />
                  </div>

                  <div className="mt-16 pt-10 border-t border-border">
                    <h4 className="font-bold mb-6">Connect with us</h4>
                    <div className="flex space-x-4">
                      <SocialIcon icon={<Twitter size={20} />} />
                      <SocialIcon icon={<Instagram size={20} />} />
                      <SocialIcon icon={<Github size={20} />} />
                      <SocialIcon icon={<Linkedin size={20} />} />
                    </div>
                  </div>
               </motion.div>
            </div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
               <div className="glass p-10 md:p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>
                  
                  <h3 className="text-2xl font-bold font-outfit mb-8 relative z-10">Send us a message</h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="John Doe"
                          className="w-full px-6 py-4 rounded-2xl bg-secondary/30 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          placeholder="john@example.com"
                          className="w-full px-6 py-4 rounded-2xl bg-secondary/30 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Subject</label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        className="w-full px-6 py-4 rounded-2xl bg-secondary/30 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none"
                      >
                         <option>General Inquiry</option>
                         <option>Technical Support</option>
                         <option>Billing & Subscription</option>
                         <option>Partnership</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Message</label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        placeholder="Tell us more about how we can help..."
                        className="w-full px-6 py-4 rounded-2xl bg-secondary/30 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-5 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-3 group"
                    >
                       {isSubmitting ? (
                         <Loader2 className="animate-spin" />
                       ) : (
                         <>
                           <span>Send Message</span>
                           <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                         </>
                       )}
                    </button>
                  </form>
               </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function ContactDetail({ icon, title, content, desc }) {
  return (
    <div className="flex items-start space-x-6 group">
       <div className="w-14 h-14 rounded-2xl glass border-border flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
          {icon}
       </div>
       <div>
          <h4 className="font-bold text-lg mb-1">{title}</h4>
          <p className="text-primary font-bold mb-1">{content}</p>
          <p className="text-sm text-muted-foreground font-medium">{desc}</p>
       </div>
    </div>
  );
}

function SocialIcon({ icon }) {
  return (
    <button className="w-12 h-12 rounded-xl glass border-border flex items-center justify-center text-muted-foreground hover:bg-white dark:hover:bg-white/10 hover:text-primary transition-all">
       {icon}
    </button>
  );
}
