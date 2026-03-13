"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

// Навигация хедера для мини-гостиницы
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToFooter = () => {
    const el = document.getElementById("footer");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const navItems = [
    { name: "Главная", href: "#hero" },
    { name: "О нас", href: "#welcome" },
    { name: "Номера", href: "#rooms" },
    { name: "Удобства", href: "#amenities" },
    { name: "Контакты", href: "#footer" },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 md:h-20">
          {/* Логотип */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center gap-3 font-bold text-[#0047AB] whitespace-nowrap text-[18px] xl:text-[20px] max-w-[70vw] truncate"
          >
            <Image src="/image/main/logo.png" alt="" width={28} height={28} className="shrink-0" />
            <span className="truncate">У самого синего моря</span>
          </motion.div>

          <div className="hidden xl:flex items-center ml-auto gap-[30px]">
            {/* Десктопная навигация */}
            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex items-center whitespace-nowrap gap-6"
            >
              {navItems.map((item) => (
                <motion.li
                  key={item.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={item.href}
                    className="text-gray-700 hover:text-[#0047AB] transition-colors font-medium whitespace-nowrap text-[14px]"
                  >
                    {item.name}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>

            {/* Кнопка бронирования (десктоп) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="shrink-0"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={scrollToFooter}
                className="px-5 py-2.5 bg-[#0047AB] text-white rounded-lg font-medium hover:bg-[#003a8c] transition-colors whitespace-nowrap text-[16px]"
              >
                Забронировать
              </motion.button>
            </motion.div>
          </div>

          {/* Бургер-меню (мобильное) */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="xl:hidden p-2 text-gray-700 hover:text-[#0047AB] transition-colors"
            aria-label="Открыть меню"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Мобильное меню */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="xl:hidden overflow-hidden"
            >
              <ul className="py-4 space-y-3">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="block py-2 text-gray-700 hover:text-[#0047AB] transition-colors font-medium"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
                <li className="pt-2">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      scrollToFooter();
                    }}
                    className="w-full px-5 py-2.5 bg-[#0047AB] text-white rounded-lg font-medium hover:bg-[#003a8c] transition-colors whitespace-nowrap text-[16px]"
                  >
                    Забронировать
                  </button>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}
