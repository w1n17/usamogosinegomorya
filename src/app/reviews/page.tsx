"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { motion } from "framer-motion";

const reviews = [
  {
    id: 1,
    name: "Екатерина",
    date: "Август 2024",
    text: "Отличное место! До моря действительно меньше минуты. Номера чистые, уютные. Александр — замечательный владелец, всегда готов помочь. Огромное спасибо за гостеприимство!",
    rating: 5,
  },
  {
    id: 2,
    name: "Михаил",
    date: "Июль 2025",
    text: "Отдыхали семьей, все очень понравилось. Близость к пляжу «Лагуна» — это огромный плюс. В номере было все необходимое. Александр, спасибо за теплый прием!",
    rating: 5,
  },
  {
    id: 3,
    name: "Анна",
    date: "Сентябрь 2025",
    text: "Тихое и спокойное место, идеально для отдыха. Александр очень внимателен к гостям. Обязательно вернемся еще раз!",
    rating: 5,
  },
  {
    id: 4,
    name: "Дмитрий",
    date: "Июнь 2025",
    text: "Прекрасное расположение, до пляжа рукой подать. В номерах есть всё для комфортного проживания. Хозяин очень приветливый, всё подскажет и поможет. Рекомендую!",
    rating: 5,
  },
  {
    id: 5,
    name: "Ольга",
    date: "Август 2025",
    text: "Замечательный отдых! Чистота в номерах на высшем уровне, уютная атмосфера. Пляж рядом, магазины в пешей доступности. Александр, спасибо за отличный отпуск!",
    rating: 5,
  },
  {
    id: 6,
    name: "Сергей",
    date: "Июль 2025",
    text: "Всё супер! Фото соответствуют реальности. Очень удобно, что море совсем рядом. Александр встретил, всё объяснил. Обязательно приедем снова.",
    rating: 5,
  },
  {
    id: 7,
    name: "Мария",
    date: "Сентябрь 2025",
    text: "Уютный гостевой дом, приветливый владелец. Отличное соотношение цены и качества. Близость к морю — главный козырь. Спасибо за гостеприимство!",
    rating: 5,
  },
];

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-[#E0F2F1]/30 flex flex-col">
      <Header />
      <main className="grow pt-24 pb-16">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="font-bold text-slate-900 text-[32px] sm:text-[40px] lg:text-[48px] mb-4">
              Отзывы наших гостей
            </h1>
          </motion.div>

          {/* Сетка отзывов */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col h-full hover:shadow-md transition-shadow"
              >
                {/* Рейтинг */}
                <div className="flex items-center gap-1 mb-4 text-amber-400">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                {/* Текст отзыва */}
                <p className="text-slate-700 text-[15px] leading-relaxed mb-6 grow italic">
                  &quot;{review.text}&quot;
                </p>
                {/* Инфо об авторе */}
                <div className="mt-auto border-t border-slate-50 pt-4 flex justify-between items-center">
                  <span className="font-bold text-slate-900">{review.name}</span>
                  <span className="text-slate-400 text-[13px]">{review.date}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
