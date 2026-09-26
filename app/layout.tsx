import type { Metadata } from "next";

export const metadata: Metadata = { title: "Waga — WhatsApp gateway" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
