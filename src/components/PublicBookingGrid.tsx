"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

type Booking = {
  from: string;
  to: string;
  guest: string;
  status: "paid" | "pending" | "canceled";
};

type RoomData = {
  id: string;
  name: string;
  image: string;
  prices: Record<string, number>;
  bookings: Booking[];
};

type CalendarData = {
  rooms: RoomData[];
};

export default function PublicBookingGrid() {
  const [data, setData] = useState<CalendarData | null>(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const lastPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  });

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      lastPointerRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      const el = scrollRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const x = Number.isFinite(e.clientX) ? e.clientX : lastPointerRef.current.x;
      const y = Number.isFinite(e.clientY) ? e.clientY : lastPointerRef.current.y;
      const isPointerInside = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
      
      // Проверяем composedPath для sticky-элементов и вложенных ячеек
      const path = e.composedPath();
      const isOverContainer = path.some(elem => elem instanceof HTMLElement && el.contains(elem));
      
      if (!isPointerInside && !isOverContainer) return;

      if (el.scrollWidth <= el.clientWidth) return;

      // Определяем направление скролла
      const absX = Math.abs(e.deltaX);
      const absY = Math.abs(e.deltaY);
      
      // Если вертикальный скролл преобладает - не перехватываем
      if (absY > absX * 1.5) return;
      
      // Если горизонтальной компоненты нет - тоже не перехватываем
      if (absX < 0.01) return;

      const multiplier = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? rect.width : 1;
      const dx = e.deltaX * multiplier;
      const maxScrollLeft = el.scrollWidth - el.clientWidth;
      el.scrollLeft = Math.max(0, Math.min(maxScrollLeft, el.scrollLeft + dx));

      e.preventDefault();
      e.stopPropagation();
    };

    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    return () => window.removeEventListener("wheel", onWheel, { capture: true } as any);
  }, []);

  // Генерируем массив дат для колонок (от сегодня до конца года + 30 дней запас)
  const dates = (() => {
    const base = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const endOfYear = new Date(base.getFullYear(), 11, 31);
    const daysUntilEnd = Math.ceil((endOfYear.getTime() - base.getTime()) / (1000 * 60 * 60 * 24)) + 30;
    const count = Math.max(60, daysUntilEnd);
    return Array.from({ length: count }, (_, i) => {
      const d = new Date(base);
      d.setDate(d.getDate() + i);
      return d;
    });
  })();

  const formatDate = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    fetch("/api/admin/calendar")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!isFullscreen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFullscreen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isFullscreen]);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#0047AB] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const calendar = (
    <div className={isFullscreen ? "bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xl" : "bg-white/60 backdrop-blur-md rounded-2xl border border-white/60 overflow-hidden"}>
      <div className={isFullscreen ? "flex items-center justify-between p-4 bg-white border-b border-slate-200" : "flex items-center justify-between p-4 bg-white/40 border-b border-white/60"}>
        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Наличие мест и цены</h4>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const d = new Date(startDate);
              d.setDate(d.getDate() - 7);
              setStartDate(d);
            }}
            className={isFullscreen ? "p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 shadow-sm text-slate-700 transition-colors" : "p-2 rounded-xl bg-white/70 hover:bg-white border border-white/60 shadow-sm text-slate-700 transition-colors"}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => {
              const d = new Date(startDate);
              d.setDate(d.getDate() + 7);
              setStartDate(d);
            }}
            className={isFullscreen ? "p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 shadow-sm text-slate-700 transition-colors" : "p-2 rounded-xl bg-white/70 hover:bg-white border border-white/60 shadow-sm text-slate-700 transition-colors"}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          {!isFullscreen && (
            <button
              onClick={() => setIsFullscreen(true)}
              className="ml-2 px-3 py-2 rounded-xl bg-white/70 hover:bg-white border border-white/60 shadow-sm text-slate-700 transition-colors text-xs font-bold"
            >
              На весь экран
            </button>
          )}
          {isFullscreen && (
            <button
              onClick={() => setIsFullscreen(false)}
              className="ml-2 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 shadow-sm text-slate-700 transition-colors text-xs font-bold"
            >
              Закрыть
            </button>
          )}
        </div>
      </div>

      <div
        ref={scrollRef}
        className={isFullscreen ? "overflow-auto overscroll-contain max-h-[calc(100vh-96px)]" : "overflow-auto rounded-2xl overscroll-contain max-h-[70vh]"}
      >
        <table className="inline-table min-w-max border-collapse table-fixed">
          <thead className="sticky top-0 z-30">
            <tr>
              <th className={isFullscreen ? "sticky left-0 z-40 w-80 bg-white border-b border-r border-slate-200 p-4 text-left text-xs font-bold text-slate-600 uppercase" : "sticky left-0 z-40 w-56 bg-white border-b border-r border-white/60 p-3 text-left text-xs font-bold text-slate-600 uppercase"}>
                Номер
              </th>
              {dates.map((date) => (
                <th key={date.getTime()} className={isFullscreen ? "w-24 bg-white border-b border-r border-slate-200 p-3 text-center sticky top-0" : "w-20 bg-white border-b border-r border-white/60 p-2 text-center sticky top-0"}>
                  <div className={isFullscreen ? "text-[11px] text-slate-400 font-bold uppercase" : "text-[10px] text-slate-400 font-bold uppercase"}>
                    {date.toLocaleDateString("ru-RU", { weekday: "short" })}
                  </div>
                  <div className={isFullscreen ? "text-sm font-bold text-slate-600" : "text-xs font-bold text-slate-600"}>
                    {date.getDate()} {date.toLocaleDateString("ru-RU", { month: "short" }).replace('.', '')}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.rooms?.map((room) => (
              <tr key={room.id} className={isFullscreen ? "hover:bg-slate-50 transition-colors" : "hover:bg-white/40 transition-colors"}>
                <td className={isFullscreen ? "sticky left-0 z-20 bg-white border-b border-r border-slate-200 p-3" : "sticky left-0 z-20 bg-white border-b border-r border-white/60 p-2"}>
                  <div className={isFullscreen ? "flex items-center gap-3" : "flex items-center gap-2"}>
                    <div className={isFullscreen ? "relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-slate-200" : "relative w-8 h-8 rounded-md overflow-hidden shrink-0 border border-slate-100"}>
                      {room.image && <Image src={room.image} alt="" fill className="object-cover text-[8px]" />}
                    </div>
                    <div className={isFullscreen ? "text-sm font-bold text-slate-700 leading-tight" : "text-[11px] font-bold text-slate-700 leading-tight truncate"}>
                      {room.name}
                    </div>
                  </div>
                </td>
                {dates.map((date) => {
                  const dateStr = formatDate(date);
                  const price = room.prices?.[dateStr] || 0;
                  const isBooked = room.bookings?.some(b => dateStr >= b.from && dateStr < b.to) || false;

                  return (
                    <td key={dateStr} className={isFullscreen ? `h-16 border-b border-r border-slate-200 p-2 text-center ${isBooked ? "bg-rose-50/60" : ""}` : `h-12 border-b border-r border-white/60 p-1 text-center ${isBooked ? "bg-rose-50/35" : ""}`}>
                      {isBooked ? (
                        <div className={isFullscreen ? "text-[10px] font-bold text-rose-500 uppercase tracking-tighter" : "text-[9px] font-bold text-rose-400 uppercase tracking-tighter"}>Занят</div>
                      ) : (
                        <div className={isFullscreen ? "text-sm font-bold text-slate-700" : "text-[11px] font-bold text-slate-600"}>
                          {price > 0 ? `${price}₽` : "—"}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <>
      {calendar}

      {isFullscreen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-9999"
        >
          <div
            className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
            onClick={() => setIsFullscreen(false)}
          />
          <div className="absolute inset-0 p-3 sm:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className="mx-auto h-full w-full max-w-[1400px]"
              onClick={(e) => e.stopPropagation()}
            >
              {calendar}
            </motion.div>
          </div>
        </motion.div>
      )}
    </>
  );
}
