"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

import PublicBookingGrid from "@/components/PublicBookingGrid";

type ApartmentCalendarModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function ApartmentCalendarModal({ open, onClose }: ApartmentCalendarModalProps) {
  const handleClose = () => {
    const el = document.activeElement as HTMLElement | null;
    el?.blur?.();
    onClose();
  };

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-100"
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} aria-hidden="true" />

          <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="relative w-full max-w-[1000px] bg-white rounded-[24px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
              role="dialog"
              aria-modal="true"
              aria-label="Календарь цен и наличия мест"
            >
              <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">Цены и наличие мест</h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">Выберите подходящий номер и даты проживания</p>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-10 h-10 rounded-full bg-slate-200/50 hover:bg-slate-200 flex items-center justify-center transition-colors text-slate-600"
                  aria-label="Закрыть"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <div className="p-4 sm:p-6 overflow-y-auto grow">
                <PublicBookingGrid />
                
                <div className="mt-8 p-4 bg-[#E0F2F1]/50 rounded-2xl border border-[#0047AB]/10">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-center sm:text-left text-sm text-slate-600">
                      <p className="font-bold text-slate-900">Понравился вариант?</p>
                      <p>Свяжитесь с Александром для бронирования прямо сейчас!</p>
                    </div>
                    <div className="flex gap-3">
                      <a 
                        href="https://t.me/79184024845" 
                        target="_blank" 
                        rel="noreferrer"
                        className="px-5 py-2.5 bg-[#0047AB] text-white rounded-xl text-xs font-bold hover:bg-[#003a8c] transition-colors shadow-lg shadow-blue-900/10"
                      >
                        Telegram
                      </a>
                      <a 
                        href="https://wa.me/79184024845" 
                        target="_blank" 
                        rel="noreferrer"
                        className="px-5 py-2.5 bg-[#25D366] text-white rounded-xl text-xs font-bold hover:bg-[#1ebd5b] transition-colors shadow-lg shadow-green-900/10"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
