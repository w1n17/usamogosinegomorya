import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
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
  return (
    <html lang="ru">
      <body className={`${montserrat.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
