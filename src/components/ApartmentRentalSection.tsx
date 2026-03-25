"use client";

import Image from "next/image";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import ApartmentCalendarModal from "@/components/ApartmentCalendarModal";

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 2l7 4v6c0 5-3 9-7 10-4-1-7-5-7-10V6l7-4z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M9 12l2 2 4-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PinIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 21s6-5.2 6-11a6 6 0 10-12 0c0 5.8 6 11 6 11z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 10.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
        fill="currentColor"
      />
    </svg>
  );
}

function SofaIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4 10a3 3 0 013-3h10a3 3 0 013 3v6H4v-6z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M6 16v4M18 16v4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M4 12h2M18 12h2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function ApartmentRentalSection() {
  const apartmentImages = [
    "/image/apartment/photo_5317054549518389867_y.jpg",
    "/image/apartment/photo_5317054549518389868_y.jpg",
    "/image/apartment/photo_5317054549518389869_y.jpg",
    "/image/apartment/photo_5317054549518389870_y.jpg",
    "/image/apartment/photo_5317054549518389871_y.jpg",
    "/image/apartment/photo_5317054549518389872_y.jpg",
    "/image/apartment/photo_5317054549518389873_y.jpg",
    "/image/apartment/photo_5317054549518389874_y.jpg",
    "/image/apartment/photo_5317054549518389875_y.jpg",
    "/image/apartment/photo_5317054549518389876_y.jpg",
    "/image/apartment/photo_5317054549518389877_y.jpg",
    "/image/apartment/photo_5317054549518389878_y.jpg",
    "/image/apartment/photo_5317054549518389879_y.jpg",
  ] as const;

  const [activeIdx, setActiveIdx] = useState(0);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const activeSrc = apartmentImages[activeIdx % apartmentImages.length];

  useEffect(() => {
    const handleOpen = () => setIsCalendarOpen(true);
    window.addEventListener('open-calendar', handleOpen);
    return () => window.removeEventListener('open-calendar', handleOpen);
  }, []);

  const goPrev = () => {
    setActiveIdx((prev) => (prev - 1 + apartmentImages.length) % apartmentImages.length);
  };

  const goNext = () => {
    setActiveIdx((prev) => (prev + 1) % apartmentImages.length);
  };

  const items = [
    {
      icon: ShieldIcon,
      text: "Максимальная приватность и тишина",
    },
    {
      icon: PinIcon,
      text: "В шаговой доступности от моря",
    },
    {
      icon: SofaIcon,
      text: "Полный комплект мебели и техники",
    },
  ] as const;

  return (
    <section id="apartment-rental" className="bg-[#E0F2F1]/30">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="rounded-2xl bg-[#E0F2F1]/30 shadow-sm border border-slate-100 overflow-hidden">
              <div className="relative w-full aspect-4/3 bg-slate-50">
                <AnimatePresence mode="sync">
                  <motion.div
                    key={activeSrc}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={activeSrc}
                      alt="Аренда квартиры"
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 520px, 100vw"
                    />
                  </motion.div>
                </AnimatePresence>

                {apartmentImages.length > 1 ? (
                  <>
                    <button
                      type="button"
                      onClick={goPrev}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#E0F2F1]/80 border border-slate-200 shadow-sm flex items-center justify-center"
                      aria-label="Предыдущее фото"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-slate-700"
                        aria-hidden="true"
                      >
                        <path
                          d="M15 18l-6-6 6-6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    <button
                      type="button"
                      onClick={goNext}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#E0F2F1]/80 border border-slate-200 shadow-sm flex items-center justify-center"
                      aria-label="Следующее фото"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-slate-700"
                        aria-hidden="true"
                      >
                        <path
                          d="M9 6l6 6-6 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            <div className="flex items-center gap-2 text-[12px] font-semibold tracking-wide text-[#0047AB]">
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M3 10.5L12 4l9 6.5V20a1 1 0 01-1 1h-6v-6H10v6H4a1 1 0 01-1-1v-9.5z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
              ПРОЖИВАНИЕ
            </div>

            <h2 className="mt-3 font-bold text-slate-900 leading-tight text-[26px] sm:text-[30px] lg:text-[34px]">
              Аренда квартиры для
              <br />
              ценителей уединения
            </h2>

            <p className="mt-5 text-slate-600 text-[15px] sm:text-[16px] leading-relaxed max-w-xl">
              Для тех, кто предпочитает полное уединение и домашний уют, мы предлагаем в аренду современную и
              светлую квартиру с комфортной обстановкой в шаговой доступности от моря. Это идеальный вариант
              для прекрасного проживания, где вы будете чувствовать себя лучше чем дома т.к. пляж всегда рядом.
            </p>

            <a
              href="https://yandex.com/maps/-/CPR54TNG"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex w-fit text-[14px] font-semibold text-[#0047AB] hover:text-[#003a8c] transition-colors"
            >
              Открыть на карте
            </a>

            <div className="mt-7 space-y-3">
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.text} className="flex items-center gap-3 text-slate-700 text-[14px]">
                    <span className="w-8 h-8 rounded-full bg-[#EAF2F9] text-[#0047AB] flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </span>
                    <span>{item.text}</span>
                  </div>
                );
              })}
            </div>

            <motion.button
              type="button"
              onClick={() => setIsCalendarOpen(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-8 inline-flex items-center justify-center bg-[#0047AB] text-white font-semibold rounded-[8px] px-6 h-[48px] text-[14px] whitespace-nowrap hover:bg-[#003a8c] transition-colors"
            >
              Узнать подробности
            </motion.button>
          </motion.div>
        </div>
      </div>

      <ApartmentCalendarModal open={isCalendarOpen} onClose={() => setIsCalendarOpen(false)} />
    </section>
  );
}
