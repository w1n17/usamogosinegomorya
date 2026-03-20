"use client";

import Image from "next/image";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

function WavesIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3 8c2.5 2 5.5 2 8 0s5.5-2 8 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M3 12c2.5 2 5.5 2 8 0s5.5-2 8 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M3 16c2.5 2 5.5 2 8 0s5.5-2 8 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 22a10 10 0 100-20 10 10 0 000 20z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M12 6v6l4 2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function WaterActivitiesSection() {
  const rentImages = [
    "/image/water/rent/1ae974b1-44f5-423d-8881-1c6c09789968.jpg",
    "/image/water/rent/fb192044-58a5-42d4-909c-a1cf82e81c1a.jpg",
  ] as const;

  const couchImages = [
    "/image/water/couch/08446dd7-d67a-4cba-ad2b-ab1634a9dca0.jpg",
    "/image/water/couch/635f855c-d96e-4d15-8054-d929fdd591c5.jpg",
    "/image/water/couch/5d272f13-6527-482f-a494-dbf9d77046f4.jpg",
  ] as const;

  const [activeRentIdx, setActiveRentIdx] = useState(0);
  const [activeCouchIdx, setActiveCouchIdx] = useState(0);

  const activeRentSrc = rentImages[activeRentIdx % rentImages.length];
  const activeCouchSrc = couchImages[activeCouchIdx % couchImages.length];

  useEffect(() => {
    if (rentImages.length <= 1) return;
    const id = window.setInterval(() => {
      setActiveRentIdx((prev) => (prev + 1) % rentImages.length);
    }, 5000);

    return () => {
      window.clearInterval(id);
    };
  }, [rentImages.length]);

  useEffect(() => {
    if (couchImages.length <= 1) return;
    const id = window.setInterval(() => {
      setActiveCouchIdx((prev) => (prev + 1) % couchImages.length);
    }, 5000);

    return () => {
      window.clearInterval(id);
    };
  }, [couchImages.length]);

  return (
    <section id="water-activities" className="bg-[#E0F2F1]/30">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-14">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-3">
            <Image src="/image/comfort/logo_section.png" alt="" width={24} height={24} />
            <h2 className="font-bold text-slate-900 leading-tight text-[22px] sm:text-[26px] xl:text-[32px]">
              Активный отдых на воде
            </h2>
          </div>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.55 }}
            className="rounded-2xl bg-[#E0F2F1]/30 border border-slate-100 shadow-sm overflow-hidden"
          >
            <div className="relative w-full h-[220px] sm:h-[260px] bg-slate-50">
              <AnimatePresence mode="sync">
                <motion.div
                  key={activeRentSrc}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={activeRentSrc}
                    alt="Аренда SUP-бордов"
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 520px, 100vw"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="p-7 sm:p-8">
              <h3 className="font-bold text-slate-900 text-[20px]">Аренда SUP-бордов</h3>
              <p className="mt-3 text-slate-600 text-[14px] leading-relaxed max-w-lg">
                Откройте для себя прогулки на SUP-бордах по морской стихии, наслаждаясь утренним штилем или
                закатом прямо на морской глади...
              </p>

              <div className="mt-6 flex items-center gap-3 text-slate-700 text-[14px]">
                <span className="w-8 h-8 rounded-full bg-[#EAF2F9] text-[#0047AB] flex items-center justify-center shrink-0">
                  <WavesIcon className="w-4 h-4" />
                </span>
                <span>Всего 30 метров до воды</span>
              </div>

              <motion.a
                href="#footer"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="mt-7 inline-flex items-center justify-center bg-[#0047AB] text-white font-semibold rounded-[8px] px-6 h-[46px] text-[14px] whitespace-nowrap hover:bg-[#003a8c] transition-colors"
              >
                Узнать цену
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="rounded-2xl bg-[#E0F2F1]/30 border border-slate-100 shadow-sm overflow-hidden"
          >
            <div className="relative w-full h-[220px] sm:h-[260px] bg-slate-50">
              <AnimatePresence mode="sync">
                <motion.div
                  key={activeCouchSrc}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={activeCouchSrc}
                    alt="Уроки управления SUP-бордом"
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 520px, 100vw"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="p-7 sm:p-8">
              <h3 className="font-bold text-slate-900 text-[20px]">Уроки управления SUP-бордом</h3>
              <p className="mt-3 text-slate-600 text-[14px] leading-relaxed max-w-lg">
                Освойте искусство скольжения по воде под руководством опытного инструктора. Мы научим вас
                правильно стоять на доске, держать баланс и эффективно грести. Подходит для любого уровня
                подготовки.
              </p>

              <div className="mt-6 flex items-center gap-3 text-slate-700 text-[14px]">
                <span className="w-8 h-8 rounded-full bg-[#EAF2F9] text-[#0047AB] flex items-center justify-center shrink-0">
                  <ClockIcon className="w-4 h-4" />
                </span>
                <span>Занятия по предварительной записи</span>
              </div>

              <motion.a
                href="#footer"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="mt-7 inline-flex items-center justify-center bg-[#0047AB] text-white font-semibold rounded-[8px] px-6 h-[46px] text-[14px] whitespace-nowrap hover:bg-[#003a8c] transition-colors"
              >
                Записаться
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
