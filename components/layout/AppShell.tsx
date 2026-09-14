"use client";

import React, { useState } from "react";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { X } from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function AppShell({ children, title, subtitle }: AppShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F7F7F2] text-[#1C2624]">
      {/* Desktop Sidebar (Substantial 288px width) */}
      <div className="hidden lg:block shrink-0">
        <AppSidebar />
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative flex w-80 max-w-xs flex-1 flex-col bg-white shadow-2xl">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 rounded-lg p-2 text-slate-500 hover:bg-slate-100 z-10"
            >
              <X className="h-5 w-5" />
            </button>
            <AppSidebar onCloseMobile={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area: Fills 1440px+ screens comfortably */}
      <div className="flex flex-1 flex-col overflow-x-hidden min-w-0">
        <AppHeader
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          title={title}
          subtitle={subtitle}
        />
        <main className="flex-1 p-6 md:p-8 lg:p-10 w-full max-w-[1560px] mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
