"use client";

import { useState } from "react";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Bars3Icon } from "@heroicons/react/24/outline";
import dynamic from "next/dynamic"; // 1. Add this import
import "@/app/globals.css";

// 2. Import ThemeToggle Dynamically (Disable SSR)
const ThemeToggle = dynamic(
  () => import("@/components/ui/ThemeToggle").then((mod) => mod.ThemeToggle),
  { ssr: false }
);

const inter = Inter({ subsets: ["latin"] });

export default function AdminRootLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-admin-bg text-admin-text-primary font-sans transition-colors duration-300`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen flex">
            <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
              <header className="h-16 bg-admin-surface border-b border-admin-muted/10 flex items-center justify-between px-4 lg:px-8">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-2 -ml-2 rounded-md lg:hidden text-admin-text-muted hover:text-admin-text-primary"
                  >
                    <Bars3Icon className="h-6 w-6" />
                  </button>
                  <h2 className="hidden sm:block text-sm font-medium text-admin-text-muted uppercase tracking-widest">
                    Agency Control Panel
                  </h2>
                </div>

                <div className="flex items-center gap-4">
                  <ThemeToggle /> {/* No more hydration warnings! */}
                  <div className="h-8 w-8 rounded-full bg-admin-accent/20 border border-admin-accent/50" />
                </div>
              </header>

              <div className="flex-1 overflow-auto p-4 lg:p-8">{children}</div>
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
