import React, { useState, useEffect } from "react";
import { Scissors, Zap, Wind, User, Sparkles, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "../i18n";

interface Service {
  id: string;
  name: string;
  nameAr: string;
  duration: number;
  price: number;
}

export default function ServicesPage({ onBook }: { onBook: () => void }) {
  const { t, language } = useLanguage();
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then(setServices);
  }, []);

  const icons = [
    <Scissors className="w-6 h-6" />,
    <Zap className="w-6 h-6" />,
    <Wind className="w-6 h-6" />,
    <Sparkles className="w-6 h-6" />,
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black tracking-tight gold-text-gradient">{t('services_title')}</h2>
        <p className="text-trendy-muted max-w-md mx-auto">
          {t('services_subtitle')}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group p-6 bg-trendy-card rounded-3xl border border-white/5 hover:border-trendy-primary/50 transition-all hover:shadow-2xl hover:shadow-trendy-primary/10 shimmer-bg"
          >
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="w-12 h-12 bg-trendy-primary/10 rounded-2xl flex items-center justify-center text-trendy-primary group-hover:gold-gradient group-hover:text-obsidian transition-all">
                {icons[index % icons.length]}
              </div>
              <span className="text-2xl font-black gold-text-gradient">${service.price}</span>
            </div>
            <h3 className="text-xl font-bold text-trendy-text mb-2 relative z-10">{language === 'ar' ? service.nameAr : service.name}</h3>
            <p className="text-trendy-muted text-sm mb-6 relative z-10">{service.duration} {t('services_duration_suffix')}</p>
            <button
              onClick={onBook}
              className="w-full py-3 rounded-xl bg-white/5 text-trendy-text font-bold flex items-center justify-center gap-2 group-hover:gold-gradient group-hover:text-obsidian transition-all relative z-10"
            >
              {t('services_book_now')} <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>


    </div>
  );
}
