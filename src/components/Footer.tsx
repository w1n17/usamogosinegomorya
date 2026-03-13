"use client";

import { motion } from "framer-motion";
import Image from "next/image";

// Footer с контактной информацией
export default function Footer() {
  const phoneDisplay = "+7 977 804-96-61";
  const phoneDigits = "79778049661";
  const telegramUsername = "Bleacksea2026";
  const yandexMapsUrl =
    "https://yandex.com/maps/org/u_samogo_sinego_morya/102195219790/";
  const yandexMapWidgetUrl =
    "https://yandex.com/map-widget/v1/?ll=39.340236%2C43.898235&mode=poi&poi%5Bpoint%5D=39.340039%2C43.898129&poi%5Buri%5D=ymapsbm1%3A%2F%2Forg%3Foid%3D102195219790&z=18.77";

  return (
    <footer id="footer" className="bg-[#0F172A] text-white">
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8 py-12 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 md:items-start">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.55 }}
            className="md:col-span-1"
          >
            <div className="flex items-start gap-3">
              <Image src="/image/main/logo.png" alt="" width={24} height={24} className="shrink-0 mt-1" />
              <div>
                <div className="font-bold leading-tight text-[18px] sm:text-[20px] whitespace-nowrap">
                  У самого синего моря
                </div>
              </div>
            </div>

            <p className="mt-4 text-slate-300/80 text-[14px] leading-relaxed max-w-md">
              Ваш идеальный отдых на черноморском побережье в городе Сочи поселке Лазаревское. 9
              комфортабельных номеров для проживания в уютных и благоустроенных в 30 метрах от пляжа.
            </p>

            <div className="mt-6 relative w-full max-w-[420px] h-[170px] rounded-xl overflow-hidden border border-white/10 bg-white/5">
              <iframe
                src={yandexMapWidgetUrl}
                title="Яндекс Карты"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
              <div className="absolute inset-0 bg-black/15 pointer-events-none" />

              <motion.a
                href={yandexMapsUrl}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex items-center gap-2 bg-white text-slate-900 rounded-md px-4 py-2 text-[13px] font-medium shadow-sm whitespace-nowrap"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
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
                Показать на карте
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="md:col-span-1 md:justify-self-center"
          >
            <div className="font-semibold text-[16px]">Контакты</div>
            <div className="mt-5 space-y-5 text-slate-300/85 text-[14px]">
              <div className="flex items-start gap-3">
                <Image src="/image/footer-contacts/flag.png" alt="" width={20} height={20} className="shrink-0 mt-0.5" />
                <div>
                  Рыбацкий
                  <br />
                  переулок, 55
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Image src="/image/footer-contacts/phone.png" alt="" width={20} height={20} className="shrink-0" />
                <a className="hover:text-white transition-colors" href={`tel:+${phoneDigits}`}>
                  {phoneDisplay}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Image src="/image/footer-contacts/review.png" alt="" width={20} height={20} className="shrink-0" />
                <a className="hover:text-white transition-colors" href="#reviews">
                  Отзывы
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="md:col-span-1 md:justify-self-end"
          >
            <div className="font-semibold text-[16px]">Бронирование</div>
            <p className="mt-4 text-slate-300/85 text-[14px] leading-relaxed max-w-sm">
              Свяжитесь с нами удобным способом
              <br />
              для уточнения наличия мест.
            </p>

            <div className="mt-6 space-y-3">
              <motion.a
                href={`https://t.me/${telegramUsername}`}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full sm:w-[280px] inline-flex items-center justify-center gap-2 rounded-lg bg-[#0EA5E9] text-white px-4 py-3 text-[14px] font-medium whitespace-nowrap"
              >
                <Image src="/image/main/mes.png" alt="" width={18} height={18} className="shrink-0" />
                Написать в Telegram
              </motion.a>

              <motion.a
                href={`https://wa.me/${phoneDigits}`}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full sm:w-[280px] inline-flex items-center justify-center gap-2 rounded-lg bg-[#22C55E] text-white px-4 py-3 text-[14px] font-medium whitespace-nowrap"
              >
                <Image src="/image/main/mes.png" alt="" width={18} height={18} className="shrink-0" />
                Написать в WhatsApp
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
