"use client";

import { usePathname } from "next/navigation";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showNavbar = pathname !== "/auth";

  return (
    <html lang="fr" data-theme="light">
      <body className="min-h-screen flex flex-col bg-base-100">
        {showNavbar && <Navbar />}
        <main className="flex-grow container mx-auto px-4">{children}</main>
        {showNavbar && <Footer />}
      </body>
    </html>
  );
}
