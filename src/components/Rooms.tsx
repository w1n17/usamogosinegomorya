"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import RoomCard from "@/components/RoomCard";
import RoomModal from "@/components/RoomModal";

// Типы для данных из Blob
type Booking = {
  from: string;
  to: string;
  guest: string;
  status: "paid" | "pending" | "canceled";
};

type RoomData = {
  id: string;
  prices: Record<string, number>;
  bookings: Booking[];
};

type CalendarData = {
  rooms: RoomData[];
};

// Секция с карточками номеров
export default function Rooms() {
  const [calendarData, setCalendarData] = useState<CalendarData | null>(null);

  useEffect(() => {
    fetch("/api/admin/calendar")
      .then((res) => res.json())
      .then((data) => setCalendarData(data))
      .catch((err) => console.error("Error fetching room prices:", err));
  }, []);

  const getPriceForRoom = (roomId: string) => {
    if (!calendarData) return null;
    const room = calendarData.rooms.find((r) => r.id === roomId);
    if (!room) return null;

    // Ищем цену на сегодня
    const today = new Date().toISOString().split("T")[0];
    return room.prices[today] || null;
  };

  const roomImageById: Record<number, string> = {
    1: "/image/123/novobrachnie/05d62c2b27d4bff70b9cf1e26e32f994.jpg",
    2: "/image/55/egoist/photo_5235967796057936580_y.jpg",
    3: "/image/123/blaj/photo_5235967796057936467_y.jpg",
    4: "/image/123/blaj3/photo_5235967796057936483_y.jpg",
    5: "/image/123/blaj3/photo_5235967796057936479_y (1).jpg",
    6: "/image/123/blaj4/photo_5235967796057936514_y.jpg",
    7: "/image/55/blaj5/photo_5235967796057936454_y.jpg",
    8: "/image/55/sem_schastie/photo_5235967796057936603_y.jpg",
    9: "/image/55/sem_prostori/photo_5235967796057936642_y.jpg",
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
      "/image/123/blaj2/photo_5235967796057936476_y.jpg",
      "/image/123/blaj3/photo_5235967796057936483_y.jpg",
      "/image/123/blaj3/photo_5235967796057936495_y.jpg",
    ],
    5: [
      "/image/123/blaj3/photo_5235967796057936489_y.jpg",
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
      "/image/55/blaj5/photo_5235967796057936454_y.jpg",
      "/image/55/blaj5/photo_5235967796057936451_y.jpg",
      "/image/55/blaj5/photo_5235967796057936453_y.jpg",
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
      "/image/55/sem_prostori/photo_5235967796057936659_y.jpg",
    ],
  };

  const rooms = [
    {
      id: 1,
      slug: "room-1",
      title: "Номер для новобрачных",
      description: "В номере создана романтическая обстановка для двоих, имеется все необхожимое для комфортного проживания, включая свой санузел.",
      capacityLabel: "2 местный",
      tags: ["1 этаж", "Подходит для ОВЗ"], 
    },
    {
      id: 2,
      slug: "room-2",
      title: "Номер-студия 'Эгоист'",
      description: "Уютный номер на 1 этаже с собственным входом и кухней. В номере есть все необходимое для комфортного проживания.",
      capacityLabel: "3 местный",
      tags: ["1 этаж", "Подходит для ОВЗ", "Отдельный вход", "Своя кухня"],
    },
    {
      id: 3,
      slug: "room-3",
      title: "Блаженство 2",
      description: "Светлый и уютный номер со всем необходимым для комфортного проживания для небольшой компании или семьи.",
      capacityLabel: "3 местный",
      tags: ["2 этаж"],
    },
    {
      id: 4,
      slug: "room-4",
      title: "Блаженство 3",
      description: "Светлый и уютный номер со всем необходимым для комфортного проживания с прекрасным балконом для посиделок для небольшой компании или семьи.",
      capacityLabel: "3 местный",
      tags: ["3 этаж", "Балкон"],
    },
    {
      id: 5,
      slug: "room-5",
      title: "Блаженство 4",
      description: "Светлый и уютный номер со всем необходимым для комфортного проживания с прекрасным балконом для посиделок для небольшой компании или семьи.",
      capacityLabel: "3 местный",
      tags: ["4 этаж", "Балкон"],
    },
    {
      id: 6,
      slug: "room-6",
      title: "Блаженство 5",
      description: "Светлый и уютный номер со всем необходимым для комфортного проживания с прекрасным балконом для посиделок для небольшой компании или семьи.",
      capacityLabel: "3 местный",
      tags: ["5 этаж", "Балкон"],
    },
    {
      id: 7,
      slug: "room-7",
      title: "Блаженство 22",
      description: "Светлый и уютный номер со всем необходимым для комфортного проживания для небольшой компании или семьи.",
      capacityLabel: "3 местный",
      tags: ["2 этаж"],
    },
    {
      id: 8,
      slug: "room-8",
      title: "Семейное блаженство",
      description: "Большой, светлый, комфортабельный номер со всеми условиями для прекрасного отдыха для небольшой компании или семьи.",
      capacityLabel: "4 местный",
      tags: ["3 этаж"],
    },
    {
      id: 9,
      slug: "room-9",
      title: "Семейные просторы",
      description: "Просторный, светлый и  комфортабельный номер со всеми условиями для прекрасного отдыха для небольшой компании или семьи.",
      capacityLabel: "5 местный",
      tags: ["4 этаж"],
    },
  ];

  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

  const roomAreaById: Record<number, number> = {
    1: 15,
    2: 22,
    3: 22,
    4: 22,
    5: 22,
    6: 22,
    7: 18,
    8: 26,
    9: 26,
  };

  const selectedRoom = useMemo(() => {
    if (selectedRoomId === null) return null;
    const room = rooms.find((r) => r.id === selectedRoomId);
    if (!room) return null;
    return {
      title: room.title,
      description: room.description,
      capacityLabel: room.capacityLabel,
      tags: room.tags,
      areaM2: roomAreaById[room.id],
      images: roomGalleryById[room.id] ?? [roomImageById[room.id]],
    };
  }, [selectedRoomId, rooms]);

  return (
    <section id="rooms" className="bg-[#E0F2F1]/30">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 sm:pt-7 md:pt-8 pb-1 sm:pb-1.5 md:pb-2">
        {/* Заголовок секции */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-8 sm:mb-10"
        >
          <div className="flex items-center justify-center gap-3">
            <Image src="/image/main/nashi.png" alt="" width={24} height={24} className="shrink-0" />
            <h2 className="font-bold text-slate-900 leading-tight text-[20px] sm:text-[22px] whitespace-nowrap text-center">
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
                className="w-full"
              >
                <RoomCard
                  title={room.title}
                  description={room.description}
                  capacityLabel={room.capacityLabel}
                  tags={room.tags}
                  imageSrc={roomImageById[room.id]}
                  price={getPriceForRoom(room.slug)}
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
