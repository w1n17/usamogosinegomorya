"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  prices: Record<string, number>;
  bookings: Booking[];
};

type DayModalProps = {
  isOpen: boolean;
  onClose: () => void;
  dateStr: string;
  room: RoomData | null;
  onSave: (dateStr: string, roomId: string, price: number, booking?: Booking | null) => void;
};

export default function DayEditModal({ isOpen, onClose, dateStr, room, onSave }: DayModalProps) {
  const [price, setPrice] = useState<number>(0);
  const [isBooking, setIsBooking] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [stayDays, setStayDays] = useState(1);
  const [status, setStatus] = useState<"paid" | "pending" | "canceled">("pending");

  useEffect(() => {
    if (room && dateStr) {
      setPrice(room.prices[dateStr] || 0);
      const existingBooking = room.bookings.find(b => dateStr >= b.from && dateStr < b.to);
      if (existingBooking) {
        setIsBooking(true);
        setGuestName(existingBooking.guest);
        setStatus(existingBooking.status);
        // Вычисляем длительность для отображения (упрощенно)
        const start = new Date(existingBooking.from);
        const end = new Date(existingBooking.to);
        setStayDays(Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
      } else {
        setIsBooking(false);
        setGuestName("");
        setStayDays(1);
        setStatus("pending");
      }
    }
  }, [room, dateStr, isOpen]);

  if (!room) return null;

  const handleFormSave = (e: React.FormEvent) => {
    e.preventDefault();
    let newBooking: Booking | null = null;
    
    if (isBooking) {
      const endDate = new Date(dateStr);
      endDate.setDate(endDate.getDate() + stayDays);
      newBooking = {
        from: dateStr,
        to: endDate.toISOString().split('T')[0],
        guest: guestName,
        status: status
      };
    }

    onSave(dateStr, room.id, price, newBooking);
    onClose();
  };

  const handleDeleteBooking = () => {
    onSave(dateStr, room.id, price, null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{room.name}</h3>
                <p className="text-sm text-slate-500 font-medium">
                  {new Date(dateStr).toLocaleDateString("ru-RU", { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleFormSave} className="p-6 space-y-6">
              {/* Управление ценой */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 block">Цена за сутки (₽)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={price || ""}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB] outline-none transition-all font-bold text-lg"
                    placeholder="Напр. 3500"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₽</span>
                </div>
              </div>

              <div className="h-px bg-slate-100 mx-[-24px]" />

              {/* Управление бронированием */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-700">Бронирование</label>
                  <button
                    type="button"
                    onClick={() => setIsBooking(!isBooking)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isBooking ? 'bg-[#0047AB]' : 'bg-slate-200'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isBooking ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                {isBooking && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="space-y-4 overflow-hidden"
                  >
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Имя гостя</label>
                      <input
                        type="text"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0047AB]/20 outline-none text-sm"
                        placeholder="Введите имя..."
                        required={isBooking}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ночей</label>
                        <input
                          type="number"
                          min="1"
                          value={stayDays}
                          onChange={(e) => setStayDays(Number(e.target.value))}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0047AB]/20 outline-none text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Статус</label>
                        <select
                          value={status}
                          onChange={(e) => setStatus(e.target.value as any)}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0047AB]/20 outline-none text-sm appearance-none"
                        >
                          <option value="pending">Ожидание</option>
                          <option value="paid">Оплачено</option>
                          <option value="canceled">Отмена</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="pt-4 flex gap-3">
                {room.bookings.some(b => dateStr >= b.from && dateStr < b.to) && (
                  <button
                    type="button"
                    onClick={handleDeleteBooking}
                    className="flex-1 py-3 px-4 bg-rose-50 text-rose-600 font-bold rounded-xl hover:bg-rose-100 transition-colors text-sm border border-rose-100"
                  >
                    Удалить бронь
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-2 py-3 px-4 bg-[#0047AB] text-white font-bold rounded-xl hover:bg-[#003a8c] transition-all shadow-lg shadow-blue-900/10 active:scale-[0.98] text-sm"
                >
                  Применить
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
