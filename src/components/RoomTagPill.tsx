"use client";

import Image from "next/image";

type RoomTagPillProps = {
  tag: string;
  size?: "sm" | "lg";
};

export default function RoomTagPill({ tag, size = "sm" }: RoomTagPillProps) {
  const isA11y = tag.toLowerCase().includes("овз");
  const isLg = size === "lg";

  return (
    <span
      className={
        isA11y
          ? `inline-flex items-center gap-1 rounded-lg bg-emerald-50 text-emerald-700 whitespace-nowrap border border-emerald-200/60 ${
              isLg ? "px-4 py-2 text-[14px] font-semibold" : "px-2.5 py-1 text-[11px] font-medium"
            }`
          : `inline-flex items-center rounded-lg bg-sky-50 text-sky-700 whitespace-nowrap border border-sky-200/60 ${
              isLg ? "px-4 py-2 text-[14px] font-semibold" : "px-2.5 py-1 text-[11px] font-medium"
            }`
      }
    >
      {isA11y ? <Image src="/image/main/ovz.png" alt="" width={isLg ? 18 : 14} height={isLg ? 18 : 14} /> : null}
      {tag}
    </span>
  );
}
