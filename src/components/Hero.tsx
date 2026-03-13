"use client";

import Image from "next/image";
import { motion } from "framer-motion";

// Hero секция с приветствием и кнопкой бронирования
export default function Hero() {
  return (
    <section
      id="hero"
      className="relative isolate min-h-screen pt-16 md:pt-20"
    >
      <div className="absolute inset-0 z-0">
        <Image
          src="/image/main/main.jpg"
          alt="Море"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/30 to-black/60" />
      </div>

      <div className="relative z-10 min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-bold text-white leading-[1.05] text-[36px] sm:text-[48px] lg:text-[60px] xl:text-[72px]"
          >
            У самого синего
            <br />
            моря
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-4 sm:mt-5 text-white/90 text-[14px] sm:text-[16px] lg:text-[18px] xl:text-[20px] max-w-2xl mx-auto"
          >
            Мини гостиница в поселке Лазаревское на 9 номеров
            <br />
            в 30 метрах от пляжа
            <br />
            «Лагуна»
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 sm:mt-10 flex justify-center"
          >
            <motion.a
              href="#rooms"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center bg-[#0047AB] text-white font-semibold rounded-[8px] w-[266px] h-[56px] text-[16px] whitespace-nowrap hover:bg-[#003a8c] transition-colors"
            >
              Выбрать номер
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
