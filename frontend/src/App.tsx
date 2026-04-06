import React, { useState, useEffect, useRef, useCallback } from "react";
import { Scissors, Calendar, ShieldCheck, Menu, X, Instagram, MapPin, Phone, Clock, Zap, Sparkles, Globe, User } from "lucide-react";
import { motion, AnimatePresence, useInView } from "motion/react";
import BookingFlow from "./components/BookingFlow";
import AdminDashboard from "./components/AdminDashboard";
import AdminLogin from "./components/AdminLogin";
import ServicesPage from "./components/ServicesPage";
import { cn } from "./lib/utils";
import { LanguageProvider, useLanguage } from "./i18n";

type Overlay = "book" | null;
type Section = "home" | "services";

function App() {
  const { t, language, setLanguage, isRTL } = useLanguage();
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>("home");
  const [isScrolled, setIsScrolled] = useState(false);

  // Section refs for IntersectionObserver
  const homeRef = useRef<HTMLElement>(null);
  const servicesRef = useRef<HTMLElement>(null);

  // Render logic in Root handles routing, App is just the main site

  // Track scroll position for navbar effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // IntersectionObserver for active section tracking
  useEffect(() => {
    const sections = [
      { ref: homeRef, id: "home" as Section },
      { ref: servicesRef, id: "services" as Section },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id as Section;
            setActiveSection(id);
          }
        });
      },
      {
        rootMargin: "-30% 0px -60% 0px",
        threshold: 0,
      }
    );

    sections.forEach(({ ref }) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  // Smooth scroll to section
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = 64; // h-16 = 4rem = 64px
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - navHeight,
        behavior: "smooth",
      });
    }
    setIsMenuOpen(false);
    setOverlay(null);
  }, []);

  // Lock body scroll when overlay is open
  useEffect(() => {
    if (overlay) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [overlay]);

  const scrollNavItems: { id: Section; label: string }[] = [
    { id: "home", label: t("nav_home") },
    { id: "services", label: t("nav_services") },
  ];

  return (
    <div className="min-h-screen bg-trendy-bg text-trendy-text font-sans selection:bg-trendy-primary selection:text-obsidian noise-overlay">
      {/* Floating 3D Orbs Background */}
      <div className="floating-orbs" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="orb orb-4" />
        <div className="orb orb-5" />
      </div>

      {/* Floating Particles */}
      <div className="particles" aria-hidden="true">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${12 + Math.random() * 20}s`,
              animationDelay: `${Math.random() * 15}s`,
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              opacity: 0.2 + Math.random() * 0.4,
            }}
          />
        ))}
      </div>
      {/* Navigation */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        isScrolled
          ? "bg-trendy-bg/95 backdrop-blur-xl border-white/10 shadow-lg shadow-black/30"
          : "bg-trendy-bg/80 backdrop-blur-md border-white/5"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => scrollToSection("home")}>
              <div className="w-10 h-10 gold-gradient rounded-xl flex items-center justify-center transition-transform group-hover:rotate-12 shadow-lg shadow-trendy-primary/20">
                <Scissors className="w-6 h-6 text-obsidian" />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase gold-text-gradient">LOAI . ALHNDI</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {scrollNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={cn(
                    "text-sm font-semibold transition-all duration-300 relative py-1",
                    activeSection === item.id && overlay === null
                      ? "text-trendy-primary"
                      : "text-trendy-muted hover:text-trendy-text"
                  )}
                >
                  {item.label}
                  {activeSection === item.id && overlay === null && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-[1px] left-0 right-0 h-[2px] gold-gradient rounded-full"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>
              ))}


              <div className="h-6 w-px bg-white/10 mx-2" />

              <button
                onClick={() => setLanguage(language === "en" ? "ar" : "en")}
                className="flex items-center gap-2 text-sm font-bold text-trendy-muted hover:text-trendy-primary transition-colors"
              >
                <Globe className="w-4 h-4" />
                {language === "en" ? "العربية" : "English"}
              </button>

              <button
                onClick={() => setOverlay("book")}
                className="gold-gradient text-obsidian px-6 py-2.5 rounded-full text-sm font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-trendy-primary/20"
              >
                {t("hero_cta")}
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button className="md:hidden p-2 text-trendy-text" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-trendy-bg pt-20 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6 text-2xl font-bold text-trendy-text">
              {scrollNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={cn(
                    "text-left transition-colors",
                    activeSection === item.id ? "text-trendy-primary" : ""
                  )}
                >
                  {item.label}
                </button>
              ))}

              <button onClick={() => { setOverlay("book"); setIsMenuOpen(false); }}>{t("hero_cta")}</button>
              <button
                onClick={() => { setLanguage(language === "en" ? "ar" : "en"); setIsMenuOpen(false); }}
                className="flex items-center gap-2 text-trendy-primary"
              >
                <Globe className="w-6 h-6" />
                {language === "en" ? "العربية" : "English"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== SINGLE PAGE CONTENT ===== */}
      <main className="pt-16">
        {/* HOME SECTION */}
        <section id="home" ref={homeRef} className="py-16 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-7xl mx-auto"
          >
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-trendy-primary/10 rounded-full text-sm font-bold text-trendy-primary uppercase tracking-widest border border-trendy-primary/20"
                >
                  <ShieldCheck className="w-4 h-4" /> {t("hero_badge")}
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className={cn("text-6xl sm:text-8xl font-black tracking-tighter leading-[0.9] text-trendy-text", isRTL && "text-right")}
                >
                  {t("hero_title_1")} <br /><span className="gold-text-gradient">{t("hero_title_2")}</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className={cn("text-xl text-trendy-muted max-w-lg leading-relaxed", isRTL && "text-right")}
                >
                  {t("hero_subtitle")}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className={cn("flex flex-wrap gap-4", isRTL && "flex-row-reverse")}
                >
                  <button
                    onClick={() => setOverlay("book")}
                    className="gold-gradient text-obsidian px-10 py-5 rounded-2xl text-lg font-bold hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-trendy-primary/20 glow-gold-intense flex items-center gap-2"
                  >
                    {t("hero_cta")} <Calendar className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => scrollToSection("services")}
                    className="px-10 py-5 rounded-2xl text-lg font-bold border-2 border-white/10 hover:border-trendy-primary transition-all text-trendy-text bg-white/5"
                  >
                    {t("nav_services")}
                  </button>
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: 0 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 2 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                className="relative"
              >
                <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white/5 glow-gold">
                  <img
                    src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=1000"
                    alt="Barber Shop"
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-trendy-card p-6 rounded-2xl shadow-xl border border-white/5 max-w-[200px] -rotate-3">
                  <p className="text-sm font-bold italic text-trendy-text">{t("testimonial_text")}</p>
                  <p className="text-xs text-trendy-muted mt-2">{t("testimonial_author")}</p>
                </div>
              </motion.div>
            </div>

            {/* Info Section */}
            <div className="grid sm:grid-cols-3 gap-8">
              {[
                { icon: <MapPin className="w-8 h-8 mb-4 text-trendy-primary" />, title: t("info_location_title"), desc: t("info_location_desc") },
                { icon: <Clock className="w-8 h-8 mb-4 text-trendy-primary" />, title: t("info_hours_title"), desc: <>{t("info_hours_line1")}<br />{t("info_hours_line2")}</> },
                { icon: <Phone className="w-8 h-8 mb-4 text-trendy-primary" />, title: t("info_contact_title"), desc: <a href="tel:0788248382" className="hover:text-trendy-primary transition-colors">0788248382</a> },
              ].map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className="p-8 bg-trendy-card/60 backdrop-blur-sm rounded-3xl border border-white/5 shadow-sm hover:shadow-xl hover:border-trendy-primary/30 transition-all duration-300 card-glow"
                >
                  {card.icon}
                  <h3 className="text-xl font-bold mb-2 text-trendy-text">{card.title}</h3>
                  <p className="text-trendy-muted">{card.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Glowing Section Divider */}
        <div className="section-divider" aria-hidden="true" />

        {/* SERVICES SECTION */}
        <section id="services" ref={servicesRef} className="py-24 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <ServicesPage onBook={() => setOverlay("book")} />
          </motion.div>
        </section>


      </main>

      {/* ===== OVERLAYS: Booking & Barber Access ===== */}
      <AnimatePresence>
        {overlay === "book" && (
          <motion.div
            key="book-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-trendy-bg/90 backdrop-blur-sm"
          >
            <div className="w-full max-w-4xl mx-auto py-8 px-4 relative">
              <button
                onClick={() => setOverlay(null)}
                className="sticky top-4 float-right z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors mb-4"
              >
                <X className="w-5 h-5" />
              </button>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <BookingFlow />
              </motion.div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-trendy-card/50 border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-trendy-primary rounded-lg flex items-center justify-center">
                <Scissors className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-black tracking-tighter uppercase text-trendy-text">LOAI . ALHNDI</span>
            </div>
            <div className="flex gap-6">
              <a href="https://www.instagram.com/loiy_a_lhndi?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer">
                <Instagram className="w-5 h-5 text-trendy-muted hover:text-trendy-primary cursor-pointer transition-colors" />
              </a>
            </div>
            <p className="text-sm text-trendy-muted">{t("footer_rights")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function AdminApp() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) setIsAdminLoggedIn(true);
  }, []);

  const handleAdminLogin = (token: string) => {
    localStorage.setItem("admin_token", token);
    setIsAdminLoggedIn(true);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("admin_token");
    setIsAdminLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-trendy-bg text-trendy-text font-sans selection:bg-trendy-primary selection:text-obsidian noise-overlay">
      {isAdminLoggedIn ? (
        <AdminDashboard onLogout={handleAdminLogout} />
      ) : (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <AdminLogin onLogin={handleAdminLogin} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function Root() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <LanguageProvider>
      {path === "/admin" ? <AdminApp /> : <App />}
    </LanguageProvider>
  );
}
