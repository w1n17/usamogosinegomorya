"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

import ApartmentAvailabilityCalendar from "@/components/ApartmentAvailabilityCalendar";

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
          className="fixed inset-0 z-50"
        >
          <div className="absolute inset-0 bg-black/55" onClick={handleClose} aria-hidden="true" />

          <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="relative w-full max-w-[900px] bg-[#E0F2F1] rounded-[16px] overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Календарь занятости квартиры"
            >
              <button
                type="button"
                onClick={handleClose}
                className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-transparent flex items-center justify-center"
                aria-label="Закрыть"
              >
                <svg
                  className="w-6 h-6 text-slate-900"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              <div className="max-h-[calc(100vh-140px)] overflow-y-auto sm:max-h-none sm:overflow-visible">
                <ApartmentAvailabilityCalendar embedded />
              </div>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
