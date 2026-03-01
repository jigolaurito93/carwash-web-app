import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Bungee_Hairline,
  Lexend_Giga,
  Lexend_Tera,
  Questrial,
} from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bungeeHairline = Bungee_Hairline({
  variable: "--font-bungee-hairline",
  subsets: ["latin"],
  weight: "400",
});

const lexendGiga = Lexend_Giga({
  variable: "--font-lexend-giga",
  subsets: ["latin"],
});

const lexendTera = Lexend_Tera({
  variable: "--font-lexend-tera",
  subsets: ["latin"],
});

const questrial = Questrial({
  variable: "--font-questrial",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Onyx Premium Carwash",
  description: "High Quality Car Wash",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${bungeeHairline.variable} ${lexendGiga.variable} ${lexendTera.variable} ${questrial.variable}`}
    >
      <body className="antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
