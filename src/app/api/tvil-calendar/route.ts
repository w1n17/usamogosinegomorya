import { NextResponse } from "next/server";

const TVIL_ICS_URL = "https://tvil.ru/entity/ical/ics/2097597/";

function parseIcsDateToIsoDay(raw: string): string | null {
  const value = raw.trim();

  if (/^\d{8}$/.test(value)) {
    const y = value.slice(0, 4);
    const m = value.slice(4, 6);
    const d = value.slice(6, 8);
    return `${y}-${m}-${d}`;
  }

  const m = value.match(/^(\d{4})(\d{2})(\d{2})T/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;

  return null;
}

function addDaysIsoDay(isoDay: string, days: number): string {
  const [y, m, d] = isoDay.split("-").map((v) => Number(v));
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  const yy = dt.getUTCFullYear();
  const mm = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(dt.getUTCDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

function compareIsoDay(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function parseBusyDaysFromIcs(icsText: string): string[] {
  const lines = icsText
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n");

  const unfolded: string[] = [];
  for (const line of lines) {
    if ((line.startsWith(" ") || line.startsWith("\t")) && unfolded.length > 0) {
      unfolded[unfolded.length - 1] += line.slice(1);
      continue;
    }
    unfolded.push(line);
  }

  const busy = new Set<string>();

  let inEvent = false;
  let dtStart: string | null = null;
  let dtEnd: string | null = null;

  const flush = () => {
    if (!dtStart) {
      dtStart = null;
      dtEnd = null;
      return;
    }

    const startDay = parseIcsDateToIsoDay(dtStart);
    const endDay = dtEnd ? parseIcsDateToIsoDay(dtEnd) : null;

    if (!startDay) {
      dtStart = null;
      dtEnd = null;
      return;
    }

    if (!endDay) {
      busy.add(startDay);
      dtStart = null;
      dtEnd = null;
      return;
    }

    let cur = startDay;
    while (compareIsoDay(cur, endDay) < 0) {
      busy.add(cur);
      cur = addDaysIsoDay(cur, 1);
    }

    dtStart = null;
    dtEnd = null;
  };

  for (const line of unfolded) {
    if (line === "BEGIN:VEVENT") {
      inEvent = true;
      dtStart = null;
      dtEnd = null;
      continue;
    }

    if (line === "END:VEVENT") {
      if (inEvent) flush();
      inEvent = false;
      continue;
    }

    if (!inEvent) continue;

    if (line.startsWith("DTSTART")) {
      dtStart = line.split(":").slice(1).join(":");
      continue;
    }

    if (line.startsWith("DTEND")) {
      dtEnd = line.split(":").slice(1).join(":");
      continue;
    }
  }

  return Array.from(busy).sort(compareIsoDay);
}

export async function GET() {
  const res = await fetch(TVIL_ICS_URL, {
    next: { revalidate: 900 },
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch TVIL calendar" },
      { status: 502 }
    );
  }

  const icsText = await res.text();
  const busyDays = parseBusyDaysFromIcs(icsText);

  return NextResponse.json({ busyDays }, { status: 200 });
}
