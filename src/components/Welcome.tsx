"use client";

import Image from "next/image";
import { motion } from "framer-motion";

// Секция "Добро пожаловать" с описанием гостиницы
export default function Welcome() {
  return (
    <section id="welcome" className="bg-[#F7F3EB]">
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8 py-14 sm:py-16 xl:h-[580px] xl:py-0 flex items-center justify-center">
        {/* Заголовок секции */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl"
        >
          <div className="flex justify-center mb-4">
            <Image src="/image/main/dobro.png" alt="" width={32} height={32} />
          </div>

          <h2 className="font-bold text-gray-900 leading-tight text-[28px] sm:text-[32px] lg:text-[36px] xl:text-[40px]">
            Добро
            <br />
            пожаловать
          </h2>

          <p className="mt-6 text-gray-600 text-[16px] sm:text-[18px] xl:text-[20px] leading-relaxed">
            Рады приветствовать вас в нашем уютном уголке у Черного моря! Мы создали «У самого синего моря»
            как место, где каждый гость чувствует себя особенным. Путь до пляжа «Лагуна» с развитой
            инфраструктурой займет у вас не более 1 минуты — это всего 30 метров! Просыпайтесь под шум волн,
            наслаждайтесь утренним кофе и позвольте нам позаботиться о вашем идеальном отдыхе.
          </p>

          <p className="mt-8 text-[#6B7280] text-[14px] sm:text-[15px] xl:text-[16px]">
            С теплотой и заботой!
          </p>
        </motion.div>
      </div>
    </section>
  );
}
