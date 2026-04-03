import React, { useState } from "react";
import { Search, Calendar, Clock, User, Phone, Loader2, ChevronRight, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { format, parseISO, isAfter, startOfToday } from "date-fns";
import { useLanguage } from "../i18n";

interface Booking {
  id: string;
  serviceId: string;
  clientName: string;
  clientPhone: string;
  date: string;
  time: string;
  status: "confirmed" | "cancelled";
  createdAt: string;
}

export default function ClientDashboard() {
  const { t, isRTL } = useLanguage();
  const [phone, setPhone] = useState("");
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;

    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/client/bookings?phone=${encodeURIComponent(phone)}`);
      if (!res.ok) throw new Error("Failed to fetch bookings");
      const data = await res.json();
      setBookings(data.sort((a: Booking, b: Booking) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time)));
    } catch (err) {
      setError(t('client_dash_no_bookings'));
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black tracking-tight gold-text-gradient">{t('client_dash_title')}</h2>
        <p className="text-trendy-muted max-w-md mx-auto">
          {t('client_dash_subtitle')}
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <form onSubmit={handleSearch} className="relative group">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t('client_dash_phone_placeholder')}
            className={`w-full px-6 py-4 rounded-2xl border border-white/10 bg-white/5 focus:outline-none focus:ring-2 focus:ring-trendy-primary/20 focus:border-trendy-primary transition-all text-trendy-text text-lg ${isRTL ? 'text-right' : 'text-left'}`}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-2' : 'right-2'} p-3 gold-gradient text-obsidian rounded-xl hover:opacity-90 transition-all disabled:opacity-50`}
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Search className="w-6 h-6" />}
          </button>
        </form>
      </div>

      <AnimatePresence mode="wait">
        {bookings && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {bookings.length === 0 ? (
              <div className="text-center py-12 bg-white/5 rounded-3xl border-2 border-dashed border-white/10 shimmer-bg">
                <AlertCircle className="w-12 h-12 text-trendy-muted mx-auto mb-4" />
                <p className="text-trendy-muted text-lg">{t('client_dash_no_bookings')}</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {bookings.map((booking, index) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-6 bg-trendy-card rounded-3xl border border-white/5 hover:border-trendy-primary/30 transition-all shimmer-bg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
                  >
                    <div className="flex gap-6 items-center">
                      <div className="w-16 h-16 gold-gradient rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-trendy-primary/10">
                        <Calendar className="w-8 h-8 text-obsidian" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xl font-bold text-trendy-text">{booking.clientName}</h4>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${booking.status === 'confirmed' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                            {booking.status === 'confirmed' ? t('client_dash_status_confirmed') : t('client_dash_status_cancelled')}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-trendy-muted">
                          <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-trendy-primary" /> {booking.time}</span>
                          <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-trendy-primary" /> {booking.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
                      <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-trendy-muted mb-1">{t('booking_id_label')}</p>
                        <p className="font-mono text-sm text-trendy-primary">#{booking.id}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
