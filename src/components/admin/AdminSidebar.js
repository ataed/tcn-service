"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  BuildingOfficeIcon,
  UsersIcon,
  InboxIcon,
  ArrowLeftOnRectangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { signOut } from "@/app/(auth)/login/actions";

const NAVIGATION = [
  { name: "Dashboard", href: "/admin/dashboard", icon: HomeIcon },
  { name: "Properties", href: "/admin/listings", icon: BuildingOfficeIcon },
  { name: "Leads", href: "/admin/leads", icon: InboxIcon },
  { name: "My Profile", href: "/admin/profile", icon: UsersIcon },
];

export default function AdminSidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname();

  return (
    <>
      {/* 1. Mobile Backdrop */}
      <div
        className={`fixed inset-0 z-20 bg-black/50 transition-opacity lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* 2. The Sidebar Container */}
      <aside
        className={`
          fixed top-0 left-0 z-40 w-64 bg-admin-surface border-r border-admin-muted/10 
          transition-transform duration-300 ease-in-out flex flex-col
          h-[100dvh]  /* 🟢 CHANGE: Uses Dynamic Height to fix mobile cutout */
          lg:translate-x-0 lg:static lg:sticky lg:top-0 lg:h-screen
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header: Fixed Height */}
        <div className="h-16 flex-shrink-0 flex items-center justify-between px-6 border-b border-admin-muted/10">
          <h1 className="text-xl font-bold tracking-wider text-admin-accent">
            TCN{" "}
            <span className="text-admin-text-primary text-sm font-normal">
              ADMIN
            </span>
          </h1>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-admin-text-muted"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation: Scrollable Area (Takes available space) */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {NAVIGATION.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-admin-accent/10 text-admin-accent"
                    : "text-admin-text-muted hover:bg-admin-bg hover:text-admin-text-primary"
                }`}
              >
                <item.icon
                  className={`h-5 w-5 ${
                    isActive
                      ? "text-admin-accent"
                      : "text-admin-text-muted group-hover:text-admin-text-primary"
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-admin-muted/10 flex-shrink-0">
          <form action={signOut}>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
