"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import RoomTagPill from "@/components/RoomTagPill";

type RoomCardProps = {
  title: string;
  description: string;
  capacityLabel: string;
  tags?: string[];
  imageSrc: string;
  onClick?: () => void;
};

export default function RoomCard({
  title,
  description,
  capacityLabel,
  tags = [],
  imageSrc,
  onClick,
}: RoomCardProps) {
  return (
    <motion.article
      whileHover={{ y: -4, boxShadow: "0 18px 48px rgba(15, 23, 42, 0.10)" }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      className="w-full max-w-[352px] h-[442px] bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col cursor-pointer"
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
        <h3 className="font-bold text-slate-900 text-[18px] xl:text-[20px] leading-snug">
          {title}
        </h3>

        <p className="mt-2 text-slate-500 text-[14px] leading-relaxed">
          {description}
        </p>

        {tags.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mt-auto pt-5 flex flex-wrap gap-2"
          >
            {tags.map((tag) => (
              <RoomTagPill key={tag} tag={tag} />
            ))}
          </motion.div>
        ) : null}
      </div>
    </motion.article>
  );
}
