import React, { useState, useEffect, useMemo } from "react";
import { format, isToday, parseISO } from "date-fns";
import { io } from "socket.io-client";
import { Calendar, Clock, User, Phone, Trash2, ShieldAlert, LogOut, Loader2, Search, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { useLanguage } from "../i18n";

interface Booking {
  id: string;
  serviceId: string;
  clientName: string;
  clientPhone: string;
  date: string;
  time: string;
  status: "confirmed" | "cancelled" | "completed";
  createdAt: string;
}

interface Service {
  id: string;
  name: string;
  nameAr: string;
}

export default function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const { t, isRTL, language } = useLanguage();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [blockDate, setBlockDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [blockTime, setBlockTime] = useState("09:00");

  const fetchData = async () => {
    try {
      const API = import.meta.env.VITE_API_URL || "";
      const [bookingsRes, servicesRes] = await Promise.all([
        fetch(`${API}/api/admin/bookings`),
        fetch(`${API}/api/services`)
      ]);
      const bookingsData = await bookingsRes.json();
      const servicesData = await servicesRes.json();
      setBookings(bookingsData);
      setServices(servicesData);
    } catch (err) {
      console.error("Failed to fetch admin data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Establish WebSocket Connection
    const socket = io();

    socket.on("connect", () => {
      console.log("WebSocket connected for real-time updates");
    });

    socket.on("bookings_updated", () => {
      console.log("Real-time update received! Fetching fresh data...");
      fetchData();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleCancel = async (id: string) => {
    if (!confirm(t('admin_cancel_confirm'))) return;
    try {
      const API = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${API}/api/admin/bookings/${id}`, { method: "DELETE" });
      if (res.ok) {
        // Optimistic UI update: remove from current state immediately
        setBookings(prev => prev.filter(b => b.id !== id));
        // Follow-up with refresh to ensure sync
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to cancel booking");
      }
    } catch (err) {
      console.error("Failed to cancel booking", err);
      alert("Network error. Please check your connection.");
    }
  };

  const handleComplete = async (id: string) => {
    try {
      const API = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${API}/api/admin/bookings/${id}/complete`, { method: "PUT" });
      if (res.ok) fetchData();
    } catch (err) {
      console.error("Failed to complete booking", err);
    }
  };

  const handleBlockSlot = async () => {
    try {
      const API = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${API}/api/admin/block`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: blockDate, time: blockTime }),
      });
      if (res.ok) {
        alert(t("admin_block_success"));
      }
    } catch (err) {
      console.error("Failed to block slot", err);
    }
  };

  const getServiceName = (id: string) => {
    const s = services.find(s => s.id === id);
    if (!s) return t("admin_unknown_service");
    return language === 'ar' ? s.nameAr : s.name;
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => 
      b.status !== "cancelled" && 
      (b.clientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
       b.clientPhone.includes(searchQuery))
    );
  }, [bookings, searchQuery]);

  const todayBookings = filteredBookings.filter(b => b.date === format(new Date(), "yyyy-MM-dd"))
    .sort((a, b) => a.time.localeCompare(b.time));
  
  const upcomingBookings = filteredBookings.filter(b => b.date !== format(new Date(), "yyyy-MM-dd"))
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-trendy-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8 bg-trendy-card rounded-3xl shadow-2xl border border-white/5 relative overflow-hidden my-8 md:my-16">
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-trendy-primary via-trendy-accent to-trendy-primary" />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 relative z-10">
        <div>
          <h2 className="text-3xl font-black gold-text-gradient tracking-tight">{t('admin_title')}</h2>
          <p className="text-trendy-muted mt-1">{t('admin_subtitle')}</p>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl transition-all font-bold">
          <LogOut className={cn("w-5 h-5", isRTL && "rotate-180")} /> {t('admin_tab_settings') /* Hacky reuse, but clean */}
        </button>
      </div>

      <div className="relative z-10 mb-8">
        <label className="block text-xs font-black uppercase tracking-widest text-trendy-muted mb-2">{t('admin_search_placeholder')}</label>
        <div className="relative">
          <Search className={cn("absolute top-1/2 -translate-y-1/2 w-5 h-5 text-trendy-muted", isRTL ? "right-4" : "left-4")} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('admin_search_placeholder')}
            className={cn("w-full py-4 rounded-2xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-trendy-primary/20 focus:border-trendy-primary transition-all text-trendy-text outline-none", isRTL ? "pr-12 pl-6" : "pl-12 pr-6")}
          />
        </div>
      </div>

      <div className="space-y-10 relative z-10">
        <section>
          <h3 className="text-xl font-bold flex items-center gap-2 text-trendy-text mb-4 border-b border-white/10 pb-2">
            <Calendar className="w-5 h-5 text-trendy-primary" /> {t('admin_tab_today')}
          </h3>
          <div className="space-y-3">
            {todayBookings.length === 0 ? (
              <p className="text-trendy-muted text-center py-6 bg-white/5 rounded-xl border border-dashed border-white/10">{t('admin_no_today')}</p>
            ) : (
              todayBookings.map((b) => (
                <BookingCard key={b.id} booking={b} serviceName={getServiceName(b.serviceId)} onCancel={handleCancel} onComplete={handleComplete} />
              ))
            )}
          </div>
        </section>

        <section>
          <h3 className="text-xl font-bold flex items-center gap-2 text-trendy-text mb-4 border-b border-white/10 pb-2">
            <Clock className="w-5 h-5 text-trendy-primary" /> {t('admin_tab_upcoming')}
          </h3>
          <div className="space-y-3">
            {upcomingBookings.length === 0 ? (
              <p className="text-trendy-muted text-center py-6 bg-white/5 rounded-xl border border-dashed border-white/10">{t('admin_no_upcoming')}</p>
            ) : (
              upcomingBookings.map((b) => (
                <BookingCard key={b.id} booking={b} serviceName={getServiceName(b.serviceId)} onCancel={handleCancel} onComplete={handleComplete} showDate />
              ))
            )}
          </div>
        </section>

        <section className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10">
          <h3 className="text-lg font-bold mb-2 flex items-center gap-2 text-trendy-text">
            <ShieldAlert className="w-5 h-5 text-trendy-primary" /> {t('admin_block_title')}
          </h3>
          <p className="text-sm text-trendy-muted mb-4">{t('admin_block_desc')}</p>
          <div className="grid sm:grid-cols-3 gap-4">
            <input
              type="date"
              value={blockDate}
              onChange={(e) => setBlockDate(e.target.value)}
              className="p-3 rounded-xl border border-white/10 bg-white/5 focus:ring-2 focus:ring-trendy-primary/20 text-trendy-text outline-none"
            />
            <input
              type="time"
              step="1800"
              value={blockTime}
              onChange={(e) => setBlockTime(e.target.value)}
              className="p-3 rounded-xl border border-white/10 bg-white/5 focus:ring-2 focus:ring-trendy-primary/20 text-trendy-text outline-none"
            />
            <button
              onClick={handleBlockSlot}
              className="gold-gradient text-obsidian px-4 py-3 rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <ShieldAlert className="w-4 h-4" /> {t('admin_block_btn')}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

const BookingCard: React.FC<{ booking: Booking, serviceName: string, onCancel: (id: string) => void | Promise<void>, onComplete: (id: string) => void | Promise<void>, showDate?: boolean }> = ({ booking, serviceName, onCancel, onComplete, showDate }) => {
  const { t, isRTL } = useLanguage();
  const isCompleted = booking.status === "completed";

  return (
    <div className={cn(
      "p-5 border rounded-2xl transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4",
      isCompleted ? "bg-white/5 border-trendy-primary/30 opacity-75" : "bg-white/10 border-white/10 shadow-sm hover:border-white/30"
    )}>
      <div className="flex gap-4 items-center">
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0",
          isCompleted ? "bg-trendy-primary/20 text-trendy-primary" : "bg-white/10 text-trendy-muted"
        )}>
          <User className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-lg text-trendy-text leading-tight">{booking.clientName}</h4>
            {isCompleted && (
              <span className="text-[10px] uppercase font-black tracking-wider text-trendy-primary border border-trendy-primary/30 px-2 py-0.5 rounded-full">
                {t('admin_status_completed')}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-trendy-muted mt-1">
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {booking.time}</span>
            {showDate && <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {booking.date}</span>}
            <span className="flex items-center gap-1 font-medium text-trendy-primary">{serviceName}</span>
          </div>
        </div>
      </div>
      <div className={cn("flex items-center gap-2 w-full sm:w-auto", isRTL ? "sm:justify-start" : "sm:justify-end")}>
        <a href={`tel:${booking.clientPhone}`} className="p-2.5 bg-white/5 text-trendy-text hover:text-trendy-primary hover:bg-white/10 rounded-xl transition-all" title="Call">
          <Phone className="w-4 h-4" />
        </a>
        {!isCompleted && (
          <button onClick={() => onComplete(booking.id)} className="p-2.5 bg-white/5 text-trendy-text hover:text-green-400 hover:bg-green-400/10 rounded-xl transition-all" title={t('admin_mark_completed')}>
            <CheckCircle className="w-4 h-4" />
          </button>
        )}
        <button onClick={() => onCancel(booking.id)} className="p-2.5 bg-white/5 text-trendy-text hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all" title="Delete">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
