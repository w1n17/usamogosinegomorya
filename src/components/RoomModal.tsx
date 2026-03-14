"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import RoomTagPill from "@/components/RoomTagPill";

type RoomModalRoom = {
  title: string;
  description: string;
  capacityLabel: string;
  tags?: string[];
  images: string[];
  areaM2?: number;
};

type RoomModalProps = {
  open: boolean;
  room: RoomModalRoom | null;
  onClose: () => void;
};

export default function RoomModal({ open, room, onClose }: RoomModalProps) {
  const handleClose = () => {
    const el = document.activeElement as HTMLElement | null;
    el?.blur?.();
    onClose();
  };

  const images = useMemo(() => {
    if (!room) return [];
    const list = room.images ?? [];
    const unique = Array.from(new Set(list)).filter(Boolean);
    return unique;
  }, [room]);

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isAutoPlayEnabled, setIsAutoPlayEnabled] = useState(true);
  const thumbsRef = useRef<HTMLDivElement | null>(null);

  const activeSrc = images.length > 0 ? images[Math.min(activeImageIdx, images.length - 1)] : null;

  useEffect(() => {
    if (!open) return;
    setActiveImageIdx(0);
    setIsAutoPlayEnabled(true);
  }, [open, room?.title]);

  useEffect(() => {
    if (!open) return;
    if (!isAutoPlayEnabled) return;
    if (images.length <= 1) return;

    const id = window.setInterval(() => {
      setActiveImageIdx((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => {
      window.clearInterval(id);
    };
  }, [open, images.length, isAutoPlayEnabled]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && room ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50"
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={handleClose}
            aria-hidden="true"
          />

          <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="relative w-full max-w-[1100px] bg-[#E0F2F1] rounded-[16px] overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-label={room.title}
            >
              <button
                type="button"
                onClick={handleClose}
                className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-transparent flex items-center justify-center"
                aria-label="Закрыть"
              >
                <svg
                  className="w-6 h-6 text-slate-900"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-4 sm:p-6 md:p-8">
                  <div
                    className="relative w-full aspect-4/3 rounded-[12px] overflow-hidden select-none"
                    onClick={() => setIsAutoPlayEnabled(false)}
                  >
                    {activeSrc ? (
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeSrc}
                          initial={{ opacity: 0.15 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0.15 }}
                          transition={{ duration: 0.35, ease: "easeOut" }}
                          className="absolute inset-0"
                        >
                          <Image
                            src={activeSrc}
                            alt={room.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 560px"
                            draggable={false}
                          />
                        </motion.div>
                      </AnimatePresence>
                    ) : (
                      <div className="absolute inset-0 bg-slate-100" />
                    )}

                    <div className="absolute top-3 left-3 w-[86px] h-[24px] rounded-[99px] bg-[#005B96] text-white text-[12px] leading-none font-semibold flex items-center justify-center whitespace-nowrap">
                      {room.capacityLabel}
                    </div>
                  </div>

                  {images.length > 1 ? (
                    <div className="mt-4 relative">
                      <div
                        ref={thumbsRef}
                        className="flex items-center gap-3 overflow-x-auto pr-2 no-scrollbar scroll-smooth"
                      >
                        {images.map((src, idx) => (
                          <button
                            key={`${src}-${idx}`}
                            type="button"
                            onClick={() => {
                              setIsAutoPlayEnabled(false);
                              setActiveImageIdx(idx);
                            }}
                            className="relative w-[74px] h-[54px] rounded-[8px] overflow-hidden border border-slate-200 shrink-0 focus:outline-none select-none"
                            aria-label={`Открыть фото ${idx + 1}`}
                          >
                            <Image
                              src={src}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="74px"
                              draggable={false}
                            />
                          </button>
                        ))}
                      </div>

                      <div className="pointer-events-none absolute left-0 top-0 h-full w-10 bg-linear-to-r from-[#E0F2F1]/80 to-[#E0F2F1]/0" />
                      <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-linear-to-l from-[#E0F2F1]/80 to-[#E0F2F1]/0" />

                      {images.length >= 6 ? (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              thumbsRef.current?.scrollBy({ left: -240, behavior: "smooth" })
                            }
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#E0F2F1]/80 border border-slate-200 shadow-sm flex items-center justify-center"
                            aria-label="Прокрутить фото влево"
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-4 h-4 text-slate-700"
                              aria-hidden="true"
                            >
                              <path
                                d="M15 18l-6-6 6-6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              thumbsRef.current?.scrollBy({ left: 240, behavior: "smooth" })
                            }
                            className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#E0F2F1]/80 border border-slate-200 shadow-sm flex items-center justify-center"
                            aria-label="Прокрутить фото вправо"
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-4 h-4 text-slate-700"
                              aria-hidden="true"
                            >
                              <path
                                d="M9 6l6 6-6 6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                <div className="p-6 sm:p-8 flex flex-col min-h-[420px]">
                  <div>
                    <h3 className="text-slate-900 font-bold text-[24px] leading-tight">
                      {room.title}
                    </h3>

                    {typeof room.areaM2 === "number" ? (
                      <div className="mt-2 text-slate-700 text-[14px]">
                        Площадь: <span className="font-semibold">{room.areaM2} м²</span>
                      </div>
                    ) : null}

                    {room.tags && room.tags.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {room.tags.map((t) => (
                          <RoomTagPill key={t} tag={t} size="lg" />
                        ))}
                      </div>
                    ) : null}

                    <div className="mt-6">
                      <div className="text-slate-900 font-semibold text-[16px]">О номере</div>
                      <p className="mt-2 text-slate-500 text-[14px] leading-relaxed">
                        {room.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto pt-8">
                    <motion.a
                      href="#"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="inline-flex items-center justify-center w-full h-[48px] rounded-[10px] bg-[#0047AB] text-white font-semibold text-[14px] whitespace-nowrap"
                    >
                      Забронировать этот номер
                    </motion.a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
