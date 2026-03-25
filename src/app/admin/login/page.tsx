"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Если уже залогинены в сессии, перекидываем в админку
    if (sessionStorage.getItem("admin_auth") === "true") {
      router.push("/admin");
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Временно сохраняем в sessionStorage для имитации сессии
    // Проверка реального пароля будет происходить на уровне API при сохранении
    if (password.length > 0) {
      sessionStorage.setItem("admin_password", password);
      sessionStorage.setItem("admin_auth", "true");
      router.push("/admin");
    } else {
      setError("Введите пароль");
    }
  };

  return (
    <div className="min-h-screen bg-[#E0F2F1]/30 flex flex-col">
      <Header />
      <main className="grow flex items-center justify-center p-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Вход в панель управления</h1>
            <p className="text-slate-500 mt-2 text-sm">Введите пароль для управления календарем и ценами</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Пароль администратора
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB] transition-all"
                placeholder="••••••••"
                required
              />
              {error && <p className="text-rose-500 text-xs mt-2">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-[#0047AB] text-white font-bold py-3 rounded-xl hover:bg-[#003a8c] transition-colors shadow-lg shadow-blue-900/10 active:scale-[0.98]"
            >
              Войти в систему
            </button>
          </form>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
