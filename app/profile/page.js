"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import { useAuth } from "@/context/AuthContext";
import { User, Mail, Settings, Bell, Shield, LogOut, ChevronRight, Camera, Save, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const fileInputRef = useRef(null);
  
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    currentWeight: "",
    targetWeight: "",
    dailyCalorieGoal: "",
    healthGoal: "Maintain",
    profileImage: ""
  });

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user?.id || user?._id) {
      fetchProfile();
      fetchNotifications();
    }
  }, [user]);

  const fetchProfile = async () => {
    const userId = user?.id || user?._id;
    try {
      const res = await fetch(`/api/user/profile?userId=${userId}`);
      const data = await res.json();
      if (data.success && data.profile) {
        setProfileData({
          fullName: data.profile.fullName || user.name || "",
          email: data.profile.email || user.email || "",
          currentWeight: data.profile.currentWeight || "",
          targetWeight: data.profile.targetWeight || "",
          dailyCalorieGoal: data.profile.dailyCalorieGoal || "",
          healthGoal: data.profile.healthGoal || "Maintain",
          profileImage: data.profile.profileImage || ""
        });
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    const userId = user?.id || user?._id;
    try {
      const res = await fetch(`/api/notifications?userId=${userId}`);
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications);
        
        // Proactive: Add a welcome reminder if none exists
        if (data.notifications.length === 0) {
          logActivity(
            "Welcome to Your Profile!", 
            "Don't forget to complete your profile details for more accurate nutrition tracking and personalized goals.", 
            "reminder"
          );
        }
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const logActivity = async (title, message, type = 'activity') => {
    const userId = user?.id || user?._id;
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, title, message, type })
      });
      fetchNotifications();
    } catch (error) {
      console.error("Error logging activity:", error);
    }
  };

  const handleSave = async () => {
    const userId = user?.id || user?._id;
    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...profileData })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Profile updated successfully!");
        logActivity("Profile Updated", "You updated your profile information.");
      } else {
        toast.error(data.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({ ...prev, profileImage: reader.result }));
        logActivity("Profile Image Updated", "You changed your profile picture.");
      };
      reader.readAsDataURL(file);
    }
  };

  const sections = [
    { id: "profile", label: "My Profile", icon: <User size={20} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={20} /> },
    { id: "account", label: "Account Settings", icon: <Settings size={20} /> },
    { id: "security", label: "Security & Privacy", icon: <Shield size={20} /> },
  ];

  if (loading && user) {
      return (
          <AppLayout>
              <div className="flex items-center justify-center min-h-[60vh]">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
          </AppLayout>
      );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
           {/* Sidebar Navigation */}
           <div className="lg:w-1/4">
              <div className="sticky top-32 glass p-6 rounded-[2.5rem] space-y-2">
                 {sections.map(section => (
                   <button
                     key={section.id}
                     onClick={() => setActiveSection(section.id)}
                     className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${activeSection === section.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-secondary text-muted-foreground'}`}
                   >
                     <div className="flex items-center space-x-3">
                        {section.icon}
                        <span className="font-bold">{section.label}</span>
                     </div>
                     <ChevronRight size={16} className={activeSection === section.id ? 'opacity-100' : 'opacity-0'} />
                   </button>
                 ))}
                 
                 <div className="pt-6 mt-6 border-t border-border">
                    <button 
                      onClick={() => setShowLogoutConfirm(true)}
                      className="w-full flex items-center space-x-3 p-4 rounded-2xl text-error hover:bg-error/5 transition-all"
                    >
                       <LogOut size={20} />
                       <span className="font-bold">Logout Session</span>
                    </button>
                 </div>
              </div>
           </div>

           {/* Content Area */}
           <div className="lg:w-3/4">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass p-10 rounded-[3rem]"
              >
                 {activeSection === "profile" && (
                   <div className="space-y-10">
                      <div className="flex flex-col md:flex-row items-center gap-8 pb-10 border-b border-border">
                         <div className="relative group">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-background bg-secondary flex items-center justify-center text-primary text-5xl font-bold font-outfit shadow-xl">
                               {profileData.profileImage ? (
                                   <img src={profileData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                               ) : (
                                   profileData.fullName?.charAt(0) || user?.name?.charAt(0) || "U"
                               )}
                            </div>
                            <button 
                                onClick={() => fileInputRef.current.click()}
                                className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center border-4 border-background group-hover:scale-110 transition-transform shadow-lg"
                            >
                               <Camera size={18} />
                            </button>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleImageUpload} 
                                className="hidden" 
                                accept="image/*"
                            />
                         </div>
                         <div className="text-center md:text-left">
                            <h2 className="text-3xl font-bold font-outfit mb-1">{profileData.fullName || "Premium User"}</h2>
                            <p className="text-muted-foreground font-medium mb-4">{profileData.email || "user@nutritrack.ai"}</p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4">
                               <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest border border-primary/20">Pro Member</span>
                               <span className="px-4 py-1.5 bg-secondary text-muted-foreground rounded-full text-xs font-bold uppercase tracking-widest border border-border">Member since 2026</span>
                            </div>
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <ProfileField 
                           label="Full Name" 
                           placeholder="Enter your name" 
                           value={profileData.fullName}
                           onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                           icon={<User size={18} />} 
                         />
                         <ProfileField 
                           label="Email Address" 
                           placeholder="Enter your email" 
                           value={profileData.email}
                           onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                           icon={<Mail size={18} />} 
                         />
                         <ProfileField 
                           label="Current Weight (kg)" 
                           placeholder="75.0" 
                           value={profileData.currentWeight}
                           onChange={(e) => setProfileData({...profileData, currentWeight: e.target.value})}
                         />
                         <ProfileField 
                           label="Target Weight (kg)" 
                           placeholder="70.0" 
                           value={profileData.targetWeight}
                           onChange={(e) => setProfileData({...profileData, targetWeight: e.target.value})}
                         />
                         <ProfileField 
                           label="Daily Calorie Goal" 
                           placeholder="2500" 
                           value={profileData.dailyCalorieGoal}
                           onChange={(e) => setProfileData({...profileData, dailyCalorieGoal: e.target.value})}
                         />
                         <ProfileField 
                           label="Primary Health Goal" 
                           type="select"
                           value={profileData.healthGoal}
                           onChange={(e) => setProfileData({...profileData, healthGoal: e.target.value})}
                           options={["Weight Loss", "Muscle Build", "Maintain", "Improve Health"]}
                         />
                      </div>

                      <div className="pt-8 flex justify-end">
                         <button 
                           onClick={handleSave}
                           className="flex items-center space-x-2 px-10 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                         >
                            <Save size={20} />
                            <span>Save Changes</span>
                         </button>
                      </div>
                   </div>
                 )}

                 {activeSection === "notifications" && (
                   <div className="space-y-8">
                      <div className="flex items-center justify-between">
                         <h3 className="text-2xl font-bold font-outfit">Notifications & Activities</h3>
                         <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">{notifications.length} Total</span>
                      </div>
                      
                      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                         {notifications.length > 0 ? (
                            notifications.map(notif => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={notif._id} 
                                    className="flex items-start gap-4 p-5 rounded-2xl bg-secondary/30 border border-border/50 hover:bg-secondary/50 transition-colors"
                                >
                                    <div className={`mt-1 p-2 rounded-xl ${notif.type === 'reminder' ? 'bg-amber-100 text-amber-600' : notif.type === 'alert' ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary'}`}>
                                        {notif.type === 'activity' ? <CheckCircle size={18} /> : notif.type === 'reminder' ? <Clock size={18} /> : <AlertTriangle size={18} />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-lg">{notif.title}</h4>
                                            <span className="text-xs text-muted-foreground">{new Date(notif.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-muted-foreground text-sm leading-relaxed">{notif.message}</p>
                                    </div>
                                </motion.div>
                            ))
                         ) : (
                                <div className="py-20 text-center">
                                    <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6 text-muted-foreground">
                                        <Bell size={40} />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4">All quiet for now</h3>
                                    <p className="text-muted-foreground max-w-sm mx-auto">When things happen, you'll see them here. Like a personal nutrition assistant!</p>
                                </div>
                         )}
                      </div>
                   </div>
                 )}

                 {(activeSection === "account" || activeSection === "security") && (
                   <div className="py-20 text-center">
                      <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                        {activeSection === "account" ? <Settings className="text-muted-foreground" size={40} /> : <Shield className="text-muted-foreground" size={40} />}
                      </div>
                      <h3 className="text-2xl font-bold mb-4">{activeSection === "account" ? "Account Settings" : "Security & Privacy"}</h3>
                      <p className="text-muted-foreground max-w-sm mx-auto">This section is currently under construction. Stay tuned for advanced management!</p>
                   </div>
                 )}
              </motion.div>
           </div>
        </div>
      </div>

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
                            onClick={logout}
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
    </AppLayout>
  );
}

function ProfileField({ label, placeholder, value, onChange, icon, type = "text", options }) {
  return (
    <div className="space-y-2">
       <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">{label}</label>
       <div className="relative">
          {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</div>}
          
          {type === "text" ? (
            <input
              type="text"
              placeholder={placeholder}
              value={value || ""}
              onChange={onChange}
              className={`w-full ${icon ? 'pl-12' : 'px-6'} py-4 rounded-2xl bg-secondary/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none font-medium`}
            />
          ) : (
            <select 
              value={value || ""}
              onChange={onChange}
              className="w-full px-6 py-4 rounded-2xl bg-secondary/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none font-medium appearance-none"
            >
               {options.map(opt => (
                 <option key={opt}>{opt}</option>
               ))}
            </select>
          )}
       </div>
    </div>
  );
}
