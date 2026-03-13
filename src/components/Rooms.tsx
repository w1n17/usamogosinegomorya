"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import RoomCard from "@/components/RoomCard";
import RoomModal from "@/components/RoomModal";

// Секция с карточками номеров
export default function Rooms() {
  const roomImageById: Record<number, string> = {
    1: "/image/123/novobrachnie/05d62c2b27d4bff70b9cf1e26e32f994.jpg",
    2: "/image/55/egoist/photo_5235967796057936580_y.jpg",
    3: "/image/123/blaj/photo_5235967796057936467_y.jpg",
    4: "/image/123/blaj2/photo_5235967796057936475_y.jpg",
    5: "/image/123/blaj3/photo_5235967796057936483_y.jpg",
    6: "/image/123/blaj4/photo_5235967796057936514_y.jpg",
    7: "/image/55/blaj5/photo_5235967796057936451_y.jpg",
    8: "/image/55/sem_schastie/photo_5235967796057936603_y.jpg",
    9: "/image/55/sem_prostori/photo_5235967796057936628_y.jpg",
  };

  const roomGalleryById: Record<number, string[]> = {
    1: [
      "/image/123/novobrachnie/05d62c2b27d4bff70b9cf1e26e32f994.jpg",
      "/image/123/novobrachnie/23650fc28dbf5996bc3ac133ef29c360.jpg",
      "/image/123/novobrachnie/eaff82363fe4f59551c2a1320690439d.jpg",
      "/image/123/novobrachnie/fcd8cae521cf343f3a40e3bb70dc2b99.jpg",
    ],
    2: [
      "/image/55/egoist/photo_5235967796057936580_y.jpg",
      "/image/55/egoist/photo_5235967796057936589_y.jpg",
      "/image/55/egoist/photo_5235967796057936599_y.jpg",
      "/image/55/egoist/photo_5235967796057936602_y.jpg",
    ],
    3: [
      "/image/123/blaj/photo_5235967796057936467_y.jpg",
      "/image/123/blaj/photo_5235967796057936469_y.jpg",
      "/image/123/blaj/photo_5235967796057936471_y.jpg",
    ],
    4: [
      "/image/123/blaj2/photo_5235967796057936475_y.jpg",
      "/image/123/blaj2/photo_5235967796057936476_y.jpg",
      "/image/123/blaj2/photo_5235967796057936479_y.jpg",
      "/image/123/blaj2/photo_5235967796057936481_y.jpg",
    ],
    5: [
      "/image/123/blaj3/photo_5235967796057936483_y.jpg",
      "/image/123/blaj3/photo_5235967796057936489_y.jpg",
      "/image/123/blaj3/photo_5235967796057936495_y.jpg",
      "/image/123/blaj3/photo_5235967796057936479_y (1).jpg",
      "/image/123/blaj3/photo_5235967796057936481_y (1).jpg",
    ],
    6: [
      "/image/123/blaj4/photo_5235967796057936514_y.jpg",
      "/image/123/blaj4/photo_5235967796057936516_y.jpg",
      "/image/123/blaj4/photo_5235967796057936517_y.jpg",
      "/image/123/blaj4/photo_5235967796057936523_y.jpg",
      "/image/123/blaj4/photo_5235967796057936526_y.jpg",
    ],
    7: [
      "/image/55/blaj5/photo_5235967796057936451_y.jpg",
      "/image/55/blaj5/photo_5235967796057936453_y.jpg",
      "/image/55/blaj5/photo_5235967796057936454_y.jpg",
      "/image/55/blaj5/photo_5235967796057936884_y.jpg",
      "/image/55/blaj5/photo_5235967796057936885_y.jpg",
    ],
    8: [
      "/image/55/sem_schastie/photo_5235967796057936603_y.jpg",
      "/image/55/sem_schastie/photo_5235967796057936610_y.jpg",
      "/image/55/sem_schastie/photo_5235967796057936611_y.jpg",
      "/image/55/sem_schastie/photo_5235967796057936612_y.jpg",
      "/image/55/sem_schastie/photo_5235967796057936624_y.jpg",
    ],
    9: [
      "/image/55/sem_prostori/photo_5235967796057936628_y.jpg",
      "/image/55/sem_prostori/photo_5235967796057936636_y.jpg",
      "/image/55/sem_prostori/photo_5235967796057936642_y.jpg",
      "/image/55/sem_prostori/photo_5235967796057936646_y.jpg",
      "/image/55/sem_prostori/photo_5235967796057936650_y.jpg",
      "/image/55/sem_prostori/photo_5235967796057936657_y.jpg",
      "/image/55/sem_prostori/photo_5235967796057936659_y.jpg",
    ],
  };

  const rooms = [
    {
      id: 1,
      title: "Номер для новобрачных",
      description: "Романтическая обстановка для двоих. Расположен на 1 этаже.",
      capacityLabel: "2 местный",
      tags: ["1 этаж", "Подходит для ОВЗ"],
    },
    {
      id: 2,
      title: "Эгоист",
      description: "Уютный номер на 1 этаже с собственным входом. Идеален для комфортного проживания.",
      capacityLabel: "3 местный",
      tags: ["1 этаж", "Подходит для ОВЗ", "Отдельный вход", "Своя кухня"],
    },
    {
      id: 3,
      title: "Блаженство 1",
      description: "Светлый и уютный номер для небольшой компании или семьи.",
      capacityLabel: "3 местный",
      tags: ["2 этаж"],
    },
    {
      id: 4,
      title: "Блаженство 2",
      description: "Светлый и уютный номер для небольшой компании или семьи.",
      capacityLabel: "3 местный",
      tags: ["3 этаж", "Балкон"],
    },
    {
      id: 5,
      title: "Блаженство 3",
      description: "Светлый и уютный номер для небольшой компании или семьи.",
      capacityLabel: "3 местный",
      tags: ["4 этаж", "Балкон"],
    },
    {
      id: 6,
      title: "Блаженство 4",
      description: "Светлый и уютный номер для небольшой компании или семьи.",
      capacityLabel: "3 местный",
      tags: ["5 этаж", "Балкон"],
    },
    {
      id: 7,
      title: "Блаженство 5",
      description: "Светлый и уютный номер для небольшой компании или семьи.",
      capacityLabel: "3 местный",
      tags: ["2 этаж"],
    },
    {
      id: 8,
      title: "Семейное блаженство",
      description: "Комфортный номер для семьи с прекрасным балконом для вечерних посиделок.",
      capacityLabel: "4 местный",
      tags: ["3 этаж"],
    },
    {
      id: 9,
      title: "Семейные просторы",
      description: "Отличный выбор для большой семьи или компании друзей. Максимум пространства.",
      capacityLabel: "5 местный",
      tags: ["4 этаж"],
    },
  ];

  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

  const selectedRoom = useMemo(() => {
    if (selectedRoomId === null) return null;
    const room = rooms.find((r) => r.id === selectedRoomId);
    if (!room) return null;
    return {
      title: room.title,
      description: room.description,
      capacityLabel: room.capacityLabel,
      tags: room.tags,
      images: roomGalleryById[room.id] ?? [roomImageById[room.id]],
    };
  }, [selectedRoomId, rooms]);

  return (
    <section id="rooms" className="bg-white">
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8 py-12 sm:py-14 md:py-16">
        {/* Заголовок секции */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-8 sm:mb-10"
        >
          <div className="flex items-start gap-3">
            <Image src="/image/main/nashi.png" alt="" width={24} height={24} className="shrink-0 mt-0.5" />
            <h2 className="font-bold text-slate-900 leading-tight text-[20px] sm:text-[22px] whitespace-nowrap">
              Наши номера
            </h2>
          </div>
        </motion.div>

        {/* Карточки номеров */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
          {rooms
            .filter((room) => Boolean(roomImageById[room.id]))
            .map((room, index) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
                className="flex justify-center"
              >
                <RoomCard
                  title={room.title}
                  description={room.description}
                  capacityLabel={room.capacityLabel}
                  tags={room.tags}
                  imageSrc={roomImageById[room.id]}
                  onClick={() => setSelectedRoomId(room.id)}
                />
              </motion.div>
            ))}
        </div>

        <RoomModal
          open={selectedRoomId !== null}
          room={selectedRoom}
          onClose={() => setSelectedRoomId(null)}
        />
      </div>
    </section>
  );
}
