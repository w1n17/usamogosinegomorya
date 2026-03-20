"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type CalendarResponse = {
  busyDays: string[];
};

function isoDayFromDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function addMonths(d: Date, months: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + months, 1);
}

function daysInMonth(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

function mondayIndex(jsDay: number): number {
  return (jsDay + 6) % 7;
}

export default function ApartmentAvailabilityCalendar() {
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [busyDays, setBusyDays] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/tvil-calendar", { cache: "no-store" });
        if (!res.ok) throw new Error("failed");
        const data = (await res.json()) as CalendarResponse;
        if (!cancelled) setBusyDays(data.busyDays ?? []);
      } catch {
        if (!cancelled) setError("Не удалось загрузить календарь занятости");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const busySet = useMemo(() => new Set(busyDays), [busyDays]);

  const title = useMemo(() => {
    const monthName = month.toLocaleString("ru-RU", { month: "long" });
    const year = month.getFullYear();
    const cap = monthName.length > 0 ? monthName[0].toUpperCase() + monthName.slice(1) : monthName;
    return `${cap} ${year}`;
  }, [month]);

  const grid = useMemo(() => {
    const first = startOfMonth(month);
    const firstDow = mondayIndex(first.getDay());
    const totalDays = daysInMonth(month);

    const cells: Array<{ date: Date | null; iso: string | null }> = [];

    for (let i = 0; i < firstDow; i += 1) {
      cells.push({ date: null, iso: null });
    }

    for (let day = 1; day <= totalDays; day += 1) {
      const dt = new Date(month.getFullYear(), month.getMonth(), day);
      cells.push({ date: dt, iso: isoDayFromDate(dt) });
    }

    while (cells.length % 7 !== 0) {
      cells.push({ date: null, iso: null });
    }

    return cells;
  }, [month]);

  const todayIso = useMemo(() => isoDayFromDate(new Date()), []);

  return (
    <section id="apartment-calendar" className="bg-[#E0F2F1]/30">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-14">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="font-bold text-slate-900 leading-tight text-[22px] sm:text-[26px] xl:text-[32px]">
            Календарь занятости квартиры
          </h2>
          <p className="mt-3 text-slate-600 text-[14px] sm:text-[15px] leading-relaxed max-w-2xl mx-auto">
            Здесь отображаются занятые даты по данным ТВИЛ. Свободные дни не подсвечены.
          </p>
        </motion.div>

        <div className="mt-8 rounded-2xl bg-[#E0F2F1]/30 border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 sm:px-6 py-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setMonth((prev) => addMonths(prev, -1))}
              className="h-10 w-10 rounded-full bg-[#E0F2F1]/30 border border-slate-200 shadow-sm flex items-center justify-center"
              aria-label="Предыдущий месяц"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-700" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="font-semibold text-slate-900 text-[16px] sm:text-[18px]">{title}</div>

            <button
              type="button"
              onClick={() => setMonth((prev) => addMonths(prev, 1))}
              className="h-10 w-10 rounded-full bg-[#E0F2F1]/30 border border-slate-200 shadow-sm flex items-center justify-center"
              aria-label="Следующий месяц"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-700" aria-hidden="true">
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="px-5 sm:px-6 pb-6">
            <div className="grid grid-cols-7 gap-2 text-slate-500 text-[12px]">
              <div className="text-center">Пн</div>
              <div className="text-center">Вт</div>
              <div className="text-center">Ср</div>
              <div className="text-center">Чт</div>
              <div className="text-center">Пт</div>
              <div className="text-center">Сб</div>
              <div className="text-center">Вс</div>
            </div>

            <div className="mt-3 grid grid-cols-7 gap-2">
              {grid.map((cell, idx) => {
                const isBusy = cell.iso ? busySet.has(cell.iso) : false;
                const isToday = cell.iso ? cell.iso === todayIso : false;

                const base =
                  "h-10 sm:h-11 rounded-lg border flex items-center justify-center text-[13px] sm:text-[14px]";

                const cls = cell.date
                  ? isBusy
                    ? `${base} bg-[#005B96]/15 border-[#005B96]/25 text-[#005B96] font-semibold`
                    : `${base} bg-[#E0F2F1]/30 border-slate-200 text-slate-800`
                  : `${base} bg-transparent border-transparent`;

                const todayCls = isToday ? " ring-2 ring-[#0047AB]/25" : "";

                return (
                  <div key={idx} className={cls + todayCls}>
                    {cell.date ? cell.date.getDate() : ""}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex items-center gap-4 text-[13px] text-slate-600">
              <div className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 rounded bg-[#005B96]/15 border border-[#005B96]/25" />
                Занято
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 rounded bg-[#E0F2F1]/30 border border-slate-200" />
                Свободно
              </div>
            </div>

            {isLoading ? (
              <div className="mt-4 text-[13px] text-slate-500">Загрузка...</div>
            ) : null}
            {error ? (
              <div className="mt-4 text-[13px] text-rose-700">{error}</div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
