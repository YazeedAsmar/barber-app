import React, { useState } from "react";
import { Lock, Loader2, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "../i18n";
import { cn } from "../lib/utils";

export default function AdminLogin({ onLogin }: { onLogin: (token: string) => void }) {
  const { t, isRTL } = useLanguage();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const API = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${API}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        const data = await res.json();
        onLogin(data.token);
      } else {
        setError(t('admin_error_invalid'));
      }
    } catch (err) {
      setError(t('admin_error_generic'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-trendy-card rounded-2xl shadow-xl border border-white/5 shimmer-bg">
      <div className="text-center mb-8 relative z-10">
        <div className="w-16 h-16 gold-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3 shadow-lg shadow-trendy-primary/20">
          <Lock className="w-8 h-8 text-obsidian" />
        </div>
        <h2 className="text-2xl font-bold gold-text-gradient">{t('admin_login_title')}</h2>
        <p className="text-trendy-muted mt-1">{t('admin_login_desc')}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        <div>
          <label className="block text-sm font-medium text-trendy-muted mb-2">{t('admin_password_label')}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 focus:outline-none focus:ring-2 focus:ring-trendy-primary/20 focus:border-trendy-primary transition-all text-trendy-text"
            required
          />
        </div>

        {error && (
          <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-sm font-medium text-center">
            {error}
          </motion.p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full gold-gradient text-obsidian py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-trendy-primary/20"
        >
          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
            <>
              {t('admin_login_btn')} <ArrowRight className={cn("w-5 h-5", isRTL && "rotate-180")} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
