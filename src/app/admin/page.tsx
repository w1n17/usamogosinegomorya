"use client";

import { useState, useEffect, useRef, type MouseEvent, type WheelEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import DayEditModal from "@/components/admin/DayEditModal";

// Типы для данных календаря
type Booking = {
  from: string;
  to: string;
  guest: string;
  status: "paid" | "pending" | "canceled";
  label?: string;
};

type RoomData = {
  id: string;
  name: string;
  image: string;
  prices: Record<string, number>; // "YYYY-MM-DD": 3500
  bookings: Booking[];
};

type CalendarData = {
  rooms: RoomData[];
  lastUpdated: string;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = useState<CalendarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const lastPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const autoScrollRafRef = useRef<number | null>(null);
  
  // Состояние для модалки
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<RoomData | null>(null);

  // Состояние для выделения (drag-to-select)
  const [isDragging, setIsDragging] = useState(false);
  const [dragRoomId, setDragRoomId] = useState<string | null>(null);
  const [dragStartIdx, setDragStartIdx] = useState<number | null>(null);
  const [dragEndIdx, setDragEndIdx] = useState<number | null>(null);

  // Состояние для отображения дат
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  });

  // Генерируем массив дат для колонок (35 дней вперед)
  const dates = Array.from({ length: 35 }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    return d;
  });

  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  useEffect(() => {
    const auth = sessionStorage.getItem("admin_auth");
    if (auth !== "true") {
      router.push("/admin/login");
      return;
    }

    fetchData();
  }, [router]);

  const initializeBlob = async (initialData: CalendarData) => {
    setSaving(true);
    try {
      const password = sessionStorage.getItem("admin_password");
      const res = await fetch("/api/admin/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, data: initialData }),
      });
      if (res.ok) {
        setData(initialData);
      } else {
        setError("Не удалось инициализировать хранилище");
      }
    } catch (err) {
      setError("Ошибка при инициализации");
    } finally {
      setSaving(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/calendar");
      if (res.status === 404) {
        // Если файла еще нет в Blob, берем структуру из локального файла
        const initialRes = await fetch("/data/initial-calendar.json");
        const initialData = await initialRes.json();
        // И сразу пробуем создать файл в Blob
        await initializeBlob(initialData);
      } else if (res.ok) {
        const json = await res.json();
        setData(json);
      } else {
        setError("Ошибка при загрузке данных");
      }
    } catch (err) {
      setError("Не удалось загрузить данные");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (updatedData: CalendarData) => {
    setSaving(true);
    setError("");
    try {
      const password = sessionStorage.getItem("admin_password");
      const res = await fetch("/api/admin/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, data: updatedData }),
      });

      if (res.ok) {
        setData(updatedData);
        // Не алертим при каждом сохранении для плавности, или можно добавить тост
      } else {
        const err = await res.json();
        setError(err.error || "Ошибка сохранения");
      }
    } catch (err) {
      setError("Сетевая ошибка при сохранении");
    } finally {
      setSaving(false);
    }
  };

  const handleMouseDown = (roomId: string, dateIdx: number, e?: { clientX: number; clientY: number }) => {
    setIsDragging(true);
    setDragRoomId(roomId);
    setDragStartIdx(dateIdx);
    setDragEndIdx(dateIdx);

    if (e) {
      lastPointerRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseEnter = (dateIdx: number) => {
    if (isDragging) {
      setDragEndIdx(dateIdx);
    }
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Тачпад обычно дает deltaX, колесо мыши — deltaY.
    // Мы превращаем любой wheel в горизонтальный скролл, чтобы не нужно было нажимать кнопки.
    const dx = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (dx === 0) return;

    container.scrollLeft += dx;
    e.preventDefault();

    // Во время выделения не сбиваем drag-select: обновляем координаты
    if (isDragging) {
      lastPointerRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseUp = () => {
    if (isDragging && dragRoomId && dragStartIdx !== null && dragEndIdx !== null) {
      const room = data?.rooms.find(r => r.id === dragRoomId);
      if (room) {
        const start = Math.min(dragStartIdx, dragEndIdx);
        const end = Math.max(dragStartIdx, dragEndIdx);
        const selectedStrDates = dates.slice(start, end + 1).map(d => formatDate(d));
        
        setSelectedRoom(room);
        setSelectedDates(selectedStrDates);
        setIsModalOpen(true);
      }
    }
    setIsDragging(false);
    setDragRoomId(null);
    setDragStartIdx(null);
    setDragEndIdx(null);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) handleMouseUp();
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [isDragging, dragRoomId, dragStartIdx, dragEndIdx, data]);

  useEffect(() => {
    if (!isDragging) {
      if (autoScrollRafRef.current !== null) {
        cancelAnimationFrame(autoScrollRafRef.current);
        autoScrollRafRef.current = null;
      }
      return;
    }

    const tick = () => {
      const container = scrollContainerRef.current;
      if (!container) {
        autoScrollRafRef.current = requestAnimationFrame(tick);
        return;
      }

      const rect = container.getBoundingClientRect();
      const { x, y } = lastPointerRef.current;

      const edge = 60; // зона у края для автоскролла
      const maxSpeed = 18; // px за кадр

      let dx = 0;
      if (x < rect.left + edge) {
        const t = Math.max(0, (rect.left + edge - x) / edge);
        dx = -Math.round(maxSpeed * t);
      } else if (x > rect.right - edge) {
        const t = Math.max(0, (x - (rect.right - edge)) / edge);
        dx = Math.round(maxSpeed * t);
      }

      if (dx !== 0) {
        container.scrollLeft += dx;
      }

      // Обновляем конечный индекс выделения по элементу под курсором,
      // чтобы выделение продолжалось даже при автоскролле.
      if (dragRoomId) {
        const el = document.elementFromPoint(x, y) as HTMLElement | null;
        const cell = el?.closest?.('td[data-date-idx][data-room-id]') as HTMLElement | null;
        if (cell) {
          const roomId = cell.getAttribute('data-room-id');
          const idxRaw = cell.getAttribute('data-date-idx');
          const idx = idxRaw ? Number(idxRaw) : NaN;
          if (roomId === dragRoomId && Number.isFinite(idx)) {
            setDragEndIdx(idx);
          }
        }
      }

      autoScrollRafRef.current = requestAnimationFrame(tick);
    };

    autoScrollRafRef.current = requestAnimationFrame(tick);
    return () => {
      if (autoScrollRafRef.current !== null) {
        cancelAnimationFrame(autoScrollRafRef.current);
        autoScrollRafRef.current = null;
      }
    };
  }, [isDragging, dragRoomId]);

  const handleUpdateCell = (targetDates: string[], roomId: string, price: number, newBooking?: Booking | null) => {
    if (!data) return;

    const nextData = { ...data };
    const roomIndex = nextData.rooms.findIndex(r => r.id === roomId);
    if (roomIndex === -1) return;

    const room = { ...nextData.rooms[roomIndex] };
    
    // Обновляем цены для всех дат
    targetDates.forEach(d => {
      room.prices = { ...room.prices, [d]: price };
    });

    // Обновляем бронирование
    if (newBooking === null) {
      // Удаляем брони, попадающие в диапазон
      room.bookings = room.bookings.filter(b => !targetDates.some(d => d >= b.from && d < b.to));
    } else if (newBooking) {
      // Удаляем пересечения и добавляем новую бронь
      const filtered = room.bookings.filter(b => {
        const overlap = (newBooking.from < b.to && newBooking.to > b.from);
        return !overlap;
      });
      room.bookings = [...filtered, newBooking];
    }

    nextData.rooms[roomIndex] = room;
    nextData.lastUpdated = new Date().toISOString();
    setData(nextData);
    
    // Автоматически сохраняем в Blob
    handleSave(nextData);
  };

  const shiftDates = (days: number) => {
    const next = new Date(startDate);
    next.setDate(next.getDate() + days);
    setStartDate(next);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E0F2F1]/30 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#0047AB] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-600 font-medium">Загрузка данных...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E0F2F1]/30 flex flex-col">
      <Header />
      <main className="grow pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Управление бронированием</h1>
              <p className="text-slate-500 text-sm mt-1">Выделяйте ячейки для массового изменения цен и броней</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => shiftDates(-7)}
                className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
                title="Назад на неделю"
              >
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={() => setStartDate(new Date())}
                className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Сегодня
              </button>

              <button
                onClick={() => shiftDates(7)}
                className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
                title="Вперед на неделю"
              >
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block" />
              
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                {saving && (
                  <>
                    <div className="w-3 h-3 border-2 border-[#0047AB] border-t-transparent rounded-full animate-spin" />
                    <span>Сохранение...</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-sm flex items-center gap-3">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {/* Шахматка */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            <div
              ref={scrollContainerRef}
              className="overflow-x-auto"
              onMouseMove={handleMouseMove}
              onWheel={handleWheel}
            >
              <table className="w-max border-collapse table-fixed">
                <thead>
                  <tr>
                    <th className="sticky left-0 z-20 w-64 bg-slate-50 border-b border-r border-slate-200 p-4 text-left text-sm font-bold text-slate-700">
                      Номер / Дата
                    </th>
                    {dates.map((date) => (
                      <th key={date.getTime()} className="w-24 bg-slate-50 border-b border-r border-slate-200 p-2 text-center">
                        <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">
                          {date.toLocaleDateString("ru-RU", { weekday: "short" })}
                        </div>
                        <div className="text-sm font-bold text-slate-700">
                          {date.getDate()} {date.toLocaleDateString("ru-RU", { month: "short" }).replace('.', '')}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data?.rooms.map((room) => (
                    <tr key={room.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="sticky left-0 z-10 bg-white group-hover:bg-slate-50 border-b border-r border-slate-200 p-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-slate-100">
                            <Image src={room.image} alt="" fill className="object-cover" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-bold text-slate-900 truncate" title={room.name}>
                              {room.name}
                            </div>
                            <div className="text-[10px] text-[#0047AB] font-bold uppercase tracking-tight">
                              {room.id === 'apartment' ? 'Апартаменты' : 'Номер'}
                            </div>
                          </div>
                        </div>
                      </td>
                      {dates.map((date, dateIdx) => {
                        const dateStr = formatDate(date);
                        const price = room.prices[dateStr] || 0;
                        const isBooked = room.bookings.some(b => dateStr >= b.from && dateStr < b.to);
                        
                        const isSelected = isDragging && 
                          dragRoomId === room.id && 
                          dateIdx >= Math.min(dragStartIdx!, dragEndIdx!) && 
                          dateIdx <= Math.max(dragStartIdx!, dragEndIdx!);
                        
                        return (
                          <td 
                            key={dateStr}
                            data-room-id={room.id}
                            data-date-idx={dateIdx}
                            onMouseDown={(e) => handleMouseDown(room.id, dateIdx, e)}
                            onMouseEnter={() => handleMouseEnter(dateIdx)}
                            className={`h-16 border-b border-r border-slate-200 p-1 text-center cursor-pointer select-none transition-colors ${
                              isSelected ? "bg-[#0047AB]/20" : isBooked ? "bg-amber-50/40" : "hover:bg-blue-50/30"
                            }`}
                          >
                            <div className="flex flex-col items-center justify-center h-full gap-0.5">
                              {isBooked ? (
                                <div className="w-full py-1 bg-amber-200/60 rounded text-[9px] font-bold text-amber-800 uppercase tracking-tighter">
                                  Занято
                                </div>
                              ) : (
                                <>
                                  <div className="text-[12px] font-bold text-slate-700">
                                    {price > 0 ? `${price}₽` : "—"}
                                  </div>
                                  <div className="text-[9px] text-slate-400 font-medium">цена</div>
                                </>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <DayEditModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            dates={selectedDates}
            room={selectedRoom}
            onSave={handleUpdateCell}
          />

          <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-slate-500 bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 font-medium text-slate-900">
              <svg className="w-4 h-4 text-[#0047AB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span>Как редактировать:</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-[#0047AB]/20 border border-[#0047AB]/30" />
              <span>Зажмите и тяните для выбора диапазона</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-amber-100 border border-amber-200" />
              <span>Забронировано</span>
            </div>
            <div className="ml-auto italic">
              * Изменения сохраняются автоматически
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
