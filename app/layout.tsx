import type { Metadata } from "next";
import "./globals.css";
import { Fredoka, Caveat } from "next/font/google";
import { cn } from "@/lib/utils";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fredoka",
});
const caveat = Caveat({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-caveat" });

export const metadata: Metadata = { title: "Wagaza - Gateway WhatsApp untuk semua!" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn(fredoka.variable, caveat.variable)}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
