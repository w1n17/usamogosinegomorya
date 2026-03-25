"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import RoomTagPill from "@/components/RoomTagPill";

function truncateByWords(text: string, maxChars: number) {
  const normalized = (text ?? "").replace(/\s+/g, " ").trim();
  if (normalized.length <= maxChars) return normalized;
  const cut = normalized.slice(0, maxChars);
  const lastSpace = cut.lastIndexOf(" ");
  const safe = (lastSpace > 20 ? cut.slice(0, lastSpace) : cut).trim();
  return `${safe}...`;
}

type RoomCardProps = {
  title: string;
  description: string;
  capacityLabel: string;
  tags?: string[];
  imageSrc: string;
  price?: number | null;
  onClick?: () => void;
};

export default function RoomCard({
  title,
  description,
  capacityLabel,
  tags = [],
  imageSrc,
  price,
  onClick,
}: RoomCardProps) {
  return (
    <motion.article
      whileHover={{ y: -4, boxShadow: "0 18px 48px rgba(15, 23, 42, 0.10)" }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      className="w-full h-[442px] bg-[#E0F2F1]/30 rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col cursor-pointer"
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      aria-label={onClick ? title : undefined}
    >
      <div className="relative mx-auto w-[350px] max-w-full h-[224px] shrink-0">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 352px"
        />

        <div className="absolute top-3 right-3 w-[86px] h-[24px] rounded-[99px] bg-[#005B96] text-white text-[12px] leading-none font-semibold flex items-center justify-center whitespace-nowrap">
          {capacityLabel}
        </div>
      </div>

      <div className="px-5 pt-4 pb-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-slate-900 text-[18px] xl:text-[20px] leading-snug overflow-hidden [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] min-h-[44px]">
            {title}
          </h3>
          {price !== undefined && (
            <div className="flex flex-col items-end shrink-0">
              <div className="text-[16px] font-bold text-[#0047AB]">
                {price ? `${price}₽` : "—"}
              </div>
              <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">сутки</div>
            </div>
          )}
        </div>

        <div className="mt-0 flex-none h-[66px] overflow-hidden">
          <p className="text-slate-500 text-[14px] leading-[1.45]">
            {truncateByWords(description, 80)}
          </p>
        </div>

        {tags.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mt-auto pt-2 h-[72px] overflow-hidden flex flex-wrap items-end content-end gap-2"
          >
            {tags.map((tag) => (
              <RoomTagPill key={tag} tag={tag} />
            ))}
          </motion.div>
        ) : (
          <div className="mt-auto pt-2 h-[72px]" />
        )}
      </div>
    </motion.article>
  );
}
