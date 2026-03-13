"use client";

import Image from "next/image";

type RoomTagPillProps = {
  tag: string;
};

export default function RoomTagPill({ tag }: RoomTagPillProps) {
  const isA11y = tag.toLowerCase().includes("овз");

  return (
    <span
      className={
        isA11y
          ? "inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[12px] leading-none whitespace-nowrap"
          : "inline-flex items-center px-3 py-1 rounded-lg bg-sky-50 text-sky-700 text-[12px] leading-none whitespace-nowrap"
      }
    >
      {isA11y ? <Image src="/image/main/ovz.png" alt="" width={14} height={14} /> : null}
      {tag}
    </span>
  );
}
