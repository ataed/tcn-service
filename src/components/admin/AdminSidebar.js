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

const NAVIGATION = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Properties", href: "/listings", icon: BuildingOfficeIcon },
  { name: "Leads", href: "/leads", icon: InboxIcon },
  { name: "My Profile", href: "/profile", icon: UsersIcon },
];

export default function AdminSidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname();

  return (
    <>
      {/* 1. Mobile Backdrop (Darkens the screen when menu is open) */}
      <div
        className={`fixed inset-0 z-20 bg-black/50 transition-opacity lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* 2. The Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-30 h-screen w-64 bg-admin-surface border-r border-admin-muted/10 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header: Logo & Close Button */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-admin-muted/10">
          <h1 className="text-xl font-bold tracking-wider text-admin-accent">
            TCN{" "}
            <span className="text-admin-text-primary text-sm font-normal">
              ADMIN
            </span>
          </h1>
          {/* Close button only shows on mobile */}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-admin-text-muted"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1">
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

        {/* Footer: Sign Out */}
        <div className="absolute bottom-4 left-4 right-4 border-t border-admin-muted/10 pt-4">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors">
            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
