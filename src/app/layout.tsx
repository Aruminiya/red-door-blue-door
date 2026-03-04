import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "./providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "紅門藍門 | 純白迴廊的試煉",
  description: "每一扇門都是選擇，每一步都是試煉。在純白迴廊中，你將面對十次命運的抉擇。",
  openGraph: {
    title: "紅門藍門 | 純白迴廊的試煉",
    description: "每一扇門都是選擇，每一步都是試煉。",
    images: [{ url: "/PureWhiteCorridor.png", width: 1200, height: 630 }],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
