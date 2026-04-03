import React, { useState, useEffect } from "react";
import { format, addDays, isToday, isPast, startOfToday } from "date-fns";
import { Calendar, Clock, User, Phone, CheckCircle, ChevronRight, ChevronLeft, Scissors, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { useLanguage } from "../i18n";

interface Service {
  id: string;
  name: string;
  nameAr: string;
  duration: number;
  price: number;
}

interface Slot {
  time: string;
  status: "available" | "booked" | "blocked";
}

export default function BookingFlow() {
  const { t, isRTL, language } = useLanguage();
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    const API = import.meta.env.VITE_API_URL || "";
    fetch(`${API}/api/services`)
      .then((res) => res.json())
      .then(setServices);
  }, []);

  useEffect(() => {
    if (step === 2 || step === 3) {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const API = import.meta.env.VITE_API_URL || "";
      fetch(`${API}/api/availability?date=${dateStr}`)
        .then((res) => res.json())
        .then(setSlots);
    }
  }, [selectedDate, step]);

  const handleBooking = async () => {
    if (!selectedService || !selectedTime || !clientName || !clientPhone) return;
    
    setLoading(true);
    try {
      const API = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${API}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedService.id,
          clientName,
          clientPhone,
          date: format(selectedDate, "yyyy-MM-dd"),
          time: selectedTime,
        }),
      });

      if (res.ok) {
        setBookingStatus("success");
        setStep(5);
      } else {
        setBookingStatus("error");
      }
    } catch (err) {
      setBookingStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const dates = Array.from({ length: 14 }, (_, i) => addDays(startOfToday(), i));

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-8 bg-trendy-card rounded-[2.5rem] shadow-2xl border border-white/5 shimmer-bg">
      <div className="mb-8 text-center relative z-10">
        <h2 className="text-3xl font-black gold-text-gradient">{t('hero_cta')}</h2>
        <p className="text-trendy-muted mt-1">{t('hero_subtitle')}</p>
      </div>

      {/* Progress Bar */}
      <div className="flex justify-between mb-12 px-2 gap-2 relative z-10">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-all duration-500",
              step >= i ? "gold-gradient shadow-[0_0_15px_rgba(212,175,55,0.4)]" : "bg-white/5"
            )}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 relative z-10"
          >
            <h3 className="text-xl font-black flex items-center gap-2 text-trendy-text">
              <Scissors className="w-6 h-6 text-trendy-primary" /> {t('booking_step_service')}
            </h3>
            <div className="grid gap-4">
              {services.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setSelectedService(s);
                    nextStep();
                  }}
                  className={cn(
                    "p-6 text-left rounded-2xl border-2 transition-all group",
                    selectedService?.id === s.id 
                      ? "border-trendy-primary bg-trendy-primary/10 shadow-lg shadow-trendy-primary/10" 
                      : "border-white/5 bg-white/5 hover:border-white/20"
                  )}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-black text-lg text-trendy-text group-hover:text-trendy-primary transition-colors">{language === 'ar' ? s.nameAr : s.name}</p>
                      <p className="text-sm text-trendy-muted">{s.duration} {t('booking_mins')}</p>
                    </div>
                    <p className="text-2xl font-black gold-text-gradient">${s.price}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8 relative z-10"
          >
            <h3 className="text-xl font-black flex items-center gap-2 text-trendy-text">
              <Calendar className="w-6 h-6 text-trendy-primary" /> {t('booking_step_date')}
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
              {dates.map((date) => (
                <button
                  key={date.toISOString()}
                  onClick={() => setSelectedDate(date)}
                  className={cn(
                    "flex-shrink-0 w-20 h-24 rounded-2xl flex flex-col items-center justify-center transition-all border-2",
                    format(selectedDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
                      ? "border-trendy-primary bg-trendy-primary/10 shadow-lg shadow-trendy-primary/10"
                      : "border-white/5 bg-white/5 hover:border-white/20"
                  )}
                >
                  <span className="text-[10px] uppercase font-black text-trendy-muted">{format(date, "EEE")}</span>
                  <span className="text-xl font-black text-trendy-text">{format(date, "d")}</span>
                </button>
              ))}
            </div>
            
            <div className="flex justify-between pt-4">
              <button onClick={prevStep} className="text-trendy-muted font-bold flex items-center gap-1 hover:text-trendy-text transition-colors">
                <ChevronLeft className={cn("w-5 h-5", isRTL && "rotate-180")} /> {t('booking_back')}
              </button>
              <button
                onClick={nextStep}
                className="gold-gradient text-obsidian px-8 py-3 rounded-xl font-black flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-trendy-primary/20"
              >
                {t('booking_next')} <ChevronRight className={cn("w-5 h-5", isRTL && "rotate-180")} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8 relative z-10"
          >
            <h3 className="text-xl font-black flex items-center gap-2 text-trendy-text">
              <Clock className="w-6 h-6 text-trendy-primary" /> {t('booking_step_time')}
            </h3>
            
            <div className="space-y-6">
              {/* Morning Section */}
              <div>
                <h4 className="text-sm font-black uppercase tracking-widest gold-text-gradient mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full gold-gradient" /> {t('booking_morning')}
                </h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {slots.filter(s => {
                    const hour = parseInt(s.time.split(':')[0]);
                    return hour < 12;
                  }).map((slot) => (
                    <button
                      key={slot.time}
                      disabled={slot.status !== "available"}
                      onClick={() => setSelectedTime(slot.time)}
                      className={cn(
                        "py-3 rounded-xl text-sm font-black border-2 transition-all",
                        slot.status === "available"
                          ? selectedTime === slot.time
                            ? "bg-trendy-primary text-obsidian border-trendy-primary shadow-lg shadow-trendy-primary/20"
                            : "bg-white/5 text-trendy-text border-white/5 hover:border-white/20"
                          : "bg-white/5 text-trendy-muted/20 border-transparent cursor-not-allowed"
                      )}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Evening Section */}
              <div>
                <h4 className="text-sm font-black uppercase tracking-widest gold-text-gradient mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full gold-gradient" /> {t('booking_evening')}
                </h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {slots.filter(s => {
                    const hour = parseInt(s.time.split(':')[0]);
                    return hour >= 12;
                  }).map((slot) => (
                    <button
                      key={slot.time}
                      disabled={slot.status !== "available"}
                      onClick={() => setSelectedTime(slot.time)}
                      className={cn(
                        "py-3 rounded-xl text-sm font-black border-2 transition-all",
                        slot.status === "available"
                          ? selectedTime === slot.time
                            ? "bg-trendy-primary text-obsidian border-trendy-primary shadow-lg shadow-trendy-primary/20"
                            : "bg-white/5 text-trendy-text border-white/5 hover:border-white/20"
                          : "bg-white/5 text-trendy-muted/20 border-transparent cursor-not-allowed"
                      )}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button onClick={prevStep} className="text-trendy-muted font-bold flex items-center gap-1 hover:text-trendy-text transition-colors">
                <ChevronLeft className={cn("w-5 h-5", isRTL && "rotate-180")} /> {t('booking_back')}
              </button>
              <button
                disabled={!selectedTime}
                onClick={nextStep}
                className="gold-gradient text-obsidian px-8 py-3 rounded-xl font-black flex items-center gap-2 disabled:opacity-50 hover:scale-105 transition-all shadow-lg shadow-trendy-primary/20"
              >
                {t('booking_next')} <ChevronRight className={cn("w-5 h-5", isRTL && "rotate-180")} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8 relative z-10"
          >
            <h3 className="text-xl font-black flex items-center gap-2 text-trendy-text">
              <User className="w-6 h-6 text-trendy-primary" /> {t('booking_step_details')}
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-trendy-muted mb-2">{t('booking_name_label')}</label>
                <div className="relative">
                  <User className={cn("absolute top-1/2 -translate-y-1/2 w-5 h-5 text-trendy-muted", isRTL ? "right-4" : "left-4")} />
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder={t('booking_name_placeholder')}
                    className={cn("w-full pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-trendy-primary/20 focus:border-trendy-primary transition-all text-trendy-text outline-none", isRTL ? "pr-12 pl-6" : "pl-12 pr-6")}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-trendy-muted mb-2">{t('booking_phone_label')}</label>
                <div className="relative">
                  <Phone className={cn("absolute top-1/2 -translate-y-1/2 w-5 h-5 text-trendy-muted", isRTL ? "right-4" : "left-4")} />
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder={t('booking_phone_placeholder')}
                    className={cn("w-full pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-trendy-primary/20 focus:border-trendy-primary transition-all text-trendy-text outline-none", isRTL ? "pr-12 pl-6" : "pl-12 pr-6")}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white/5 p-6 rounded-3xl space-y-3 border border-white/10">
              <div className="flex justify-between text-sm">
                <span className="text-trendy-muted">{t('booking_summary_service')}</span> <span className="font-black text-trendy-text">{language === 'ar' ? selectedService?.nameAr : selectedService?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-trendy-muted">{t('booking_summary_date')}</span> <span className="font-black text-trendy-text">{format(selectedDate, "MMMM d, yyyy")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-trendy-muted">{t('booking_summary_time')}</span> <span className="font-black text-trendy-text">{selectedTime}</span>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button onClick={prevStep} className="text-trendy-muted font-bold flex items-center gap-1 hover:text-trendy-text transition-colors">
                <ChevronLeft className={cn("w-5 h-5", isRTL && "rotate-180")} /> {t('booking_back')}
              </button>
              <button
                disabled={!clientName || !clientPhone || loading}
                onClick={handleBooking}
                className="gold-gradient text-obsidian px-10 py-4 rounded-2xl font-black text-lg flex items-center gap-2 disabled:opacity-50 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-trendy-primary/20"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : t('booking_confirm_btn')}
              </button>
            </div>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 space-y-8 relative z-10"
          >
            <div className="w-24 h-24 gold-gradient rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-trendy-primary/30">
              <CheckCircle className="w-12 h-12 text-obsidian" />
            </div>
            <div className="space-y-4">
              <h3 className="text-4xl font-black gold-text-gradient">{t('booking_success_title')}</h3>
              <p className="text-trendy-muted max-w-xs mx-auto text-lg">
                {t('booking_success_msg')}
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-10 py-5 bg-white/5 rounded-2xl font-black text-trendy-text hover:bg-white/10 transition-all border border-white/10"
            >
              {t('booking_success_btn')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
