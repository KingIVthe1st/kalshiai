"use client";

import * as React from "react";
import { Sidebar } from "./sidebar";
import { GlobalTicker } from "./ticker";
import { CommandPalette } from "./command-palette";
import { Wallet } from "lucide-react";

// Placeholder wallet button (Phase 2 will add real wallet connection)
function WalletButton() {
  return (
    <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent)]/80 text-white text-sm font-medium transition-colors">
      <Wallet className="w-4 h-4" />
      <span>Connect Wallet</span>
    </button>
  );
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  showTicker?: boolean;
}

export function DashboardLayout({ children, showTicker = true }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--surface-1)]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="md:pl-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-[var(--surface-1)]/80 backdrop-blur-xl border-b border-[var(--border-default)]">
          {/* Ticker */}
          {showTicker && <GlobalTicker />}

          {/* Header content */}
          <div className="flex items-center justify-between px-4 md:px-6 py-3">
            {/* Left side - page title placeholder */}
            <div className="pl-12 md:pl-0">
              {/* Reserved for breadcrumbs or page title */}
            </div>

            {/* Right side - actions */}
            <div className="flex items-center gap-3">
              {/* Command palette trigger */}
              <CommandPalette />

              {/* Wallet connect (Phase 2) */}
              <WalletButton />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6">{children}</main>

        {/* Footer */}
        <footer className="border-t border-[var(--border-default)] py-4 px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-[var(--text-muted)]">
            <div className="flex items-center gap-4">
              <span>&copy; 2025 KalshiAI. All rights reserved.</span>
              <a href="#" className="hover:text-[var(--text-secondary)]">
                Terms
              </a>
              <a href="#" className="hover:text-[var(--text-secondary)]">
                Privacy
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[var(--up)] animate-pulse" />
                All systems operational
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default DashboardLayout;
