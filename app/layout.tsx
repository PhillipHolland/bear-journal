import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bear Journal - Daily Journaling",
  description: "A journaling assistant powered by Grok",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
