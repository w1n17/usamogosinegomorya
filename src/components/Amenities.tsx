"use client";

import Image from "next/image";
import { motion } from "framer-motion";

// Секция "Удобства в номерах"
export default function Amenities() {
  const amenities = [
    {
      iconSrc: "/image/comfort/toilet.png",
      title: "Свой санузел",
    },
    {
      iconSrc: "/image/comfort/split.png",
      title: "Сплит-система",
    },
    {
      iconSrc: "/image/comfort/tv.png",
      title: "Smart TV",
    },
    {
      iconSrc: "/image/comfort/wi-fi.png",
      title: "Wi-Fi",
    },
    {
      iconSrc: "/image/comfort/fridge.png",
      title: "Холодильник",
    },
    {
      iconSrc: "/image/comfort/svch.png",
      title: "СВЧ",
    },
    {
      iconSrc: "/image/comfort/dishes.png",
      title: "Посуда",
    },
    {
      iconSrc: "/image/comfort/teapot.png",
      title: "Чайник",
    },
    {
      iconSrc: "/image/comfort/hairdryer.png",
      title: "Фен",
    },
    {
      iconSrc: "/image/comfort/machine.png",
      title: "Стиральная машина",
    },
  ];

  return (
    <section id="amenities" className="bg-[#E0F2F1]/30 mb-6 sm:mb-8 md:mb-10">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-14 md:py-16 xl:h-[520px] xl:py-0 flex flex-col justify-center">
        {/* Заголовок секции */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-3">
            <Image src="/image/comfort/logo_section.png" alt="" width={24} height={24} />
            <h2 className="font-bold text-slate-900 leading-tight text-[22px] sm:text-[26px] xl:text-[32px] whitespace-nowrap">
              Удобства в номерах
            </h2>
          </div>
        </motion.div>

        {/* Сетка удобств */}
        <div className="mt-8 sm:mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-y-10 gap-x-6">
          {amenities.map((amenity, index) => (
            <motion.div
              key={amenity.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.99 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.04, ease: "easeOut" }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-[#EAF2F9] text-[#005B96] flex items-center justify-center">
                <Image src={amenity.iconSrc} alt={amenity.title} width={28} height={28} />
              </div>
              <div className="mt-3 text-[14px] leading-tight text-slate-500 whitespace-pre-line">
                {amenity.title}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
