import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Image from "next/image";
import "./globals.css";

// Подключение шрифта Montserrat с разными весами
const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Мини-гостиница | Уютное размещение",
  description: "Комфортные номера по доступным ценам. Забронируйте проживание в нашей мини-гостинице.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const telegramUsername = "Bleacksea2026";
  return (
    <html lang="ru">
      <body className={`${montserrat.variable} antialiased`}>
        {children}

        <a
          href={`https://t.me/${telegramUsername}`}
          target="_blank"
          rel="noreferrer"
          className="fixed right-4 bottom-4 z-60 w-14 h-14 rounded-full bg-white shadow-none flex items-center justify-center hover:scale-[1.03] active:scale-[0.98] transition-transform"
          aria-label="Написать в Telegram"
        >
          <Image src="/image/main/tg.png" alt="" width={48} height={48} priority />
        </a>
      </body>
    </html>
  );
}
