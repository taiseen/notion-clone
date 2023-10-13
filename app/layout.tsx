import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Totion",
  description: "Note taking app",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/t.png",
        href: "/t.png",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/t.png",
        href: "/t.png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
