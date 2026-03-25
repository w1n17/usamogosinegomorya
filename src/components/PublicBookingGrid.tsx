"use client";

import { useState, useEffect } from "react";
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
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  });

  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    return d;
  });

  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  useEffect(() => {
    fetch("/api/admin/calendar")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#0047AB] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-inner border border-slate-100 overflow-hidden">
      <div className="flex items-center justify-between p-4 bg-slate-50 border-b border-slate-100">
        <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Наличие мест и цены</h4>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const d = new Date(startDate);
              d.setDate(d.getDate() - 7);
              setStartDate(d);
            }}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors"
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
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse table-fixed min-w-[800px]">
          <thead>
            <tr>
              <th className="sticky left-0 z-20 w-48 bg-white border-b border-r border-slate-100 p-3 text-left text-xs font-bold text-slate-500 uppercase">
                Номер
              </th>
              {dates.map((date) => (
                <th key={date.getTime()} className="w-20 bg-slate-50/50 border-b border-r border-slate-100 p-2 text-center">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">{date.toLocaleDateString("ru-RU", { weekday: "short" })}</div>
                  <div className="text-xs font-bold text-slate-600">{date.getDate()} {date.toLocaleDateString("ru-RU", { month: "short" }).replace('.', '')}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.rooms.map((room) => (
              <tr key={room.id} className="hover:bg-slate-50/30 transition-colors">
                <td className="sticky left-0 z-10 bg-white border-b border-r border-slate-100 p-2">
                  <div className="flex items-center gap-2">
                    <div className="relative w-8 h-8 rounded-md overflow-hidden shrink-0 border border-slate-100">
                      <Image src={room.image} alt="" fill className="object-cover text-[8px]" />
                    </div>
                    <div className="text-[11px] font-bold text-slate-700 leading-tight truncate">
                      {room.name}
                    </div>
                  </div>
                </td>
                {dates.map((date) => {
                  const dateStr = formatDate(date);
                  const price = room.prices[dateStr] || 0;
                  const isBooked = room.bookings.some(b => dateStr >= b.from && dateStr < b.to);

                  return (
                    <td key={dateStr} className={`h-12 border-b border-r border-slate-100 p-1 text-center ${isBooked ? "bg-rose-50/30" : ""}`}>
                      {isBooked ? (
                        <div className="text-[9px] font-bold text-rose-400 uppercase tracking-tighter">Занят</div>
                      ) : (
                        <div className="text-[11px] font-bold text-slate-600">
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
      <div className="p-3 bg-slate-50/50 border-t border-slate-100 text-[10px] text-slate-400 italic text-center">
        * Выберите подходящие даты и свяжитесь с нами для бронирования
      </div>
    </div>
  );
}
