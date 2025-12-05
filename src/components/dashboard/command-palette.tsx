"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  TrendingUp,
  Brain,
  Bell,
  Settings,
  Wallet,
  BarChart3,
  Command,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ElementType;
  action: () => void;
  shortcut?: string;
}

interface CommandPaletteProps {
  className?: string;
}

export function CommandPalette({ className }: CommandPaletteProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Commands list
  const commands: CommandItem[] = React.useMemo(
    () => [
      {
        id: "markets",
        label: "Go to Markets",
        description: "Browse all prediction markets",
        icon: TrendingUp,
        action: () => (window.location.href = "/markets"),
        shortcut: "M",
      },
      {
        id: "insights",
        label: "AI Insights",
        description: "View AI probability analysis",
        icon: Brain,
        action: () => (window.location.href = "/insights"),
        shortcut: "I",
      },
      {
        id: "portfolio",
        label: "My Portfolio",
        description: "Track your positions",
        icon: Wallet,
        action: () => (window.location.href = "/portfolio"),
        shortcut: "P",
      },
      {
        id: "screener",
        label: "Market Screener",
        description: "Filter and find opportunities",
        icon: BarChart3,
        action: () => (window.location.href = "/screener"),
        shortcut: "S",
      },
      {
        id: "alerts",
        label: "Manage Alerts",
        description: "Configure notifications",
        icon: Bell,
        action: () => (window.location.href = "/alerts"),
        shortcut: "A",
      },
      {
        id: "settings",
        label: "Settings",
        description: "Account and preferences",
        icon: Settings,
        action: () => (window.location.href = "/settings"),
      },
    ],
    []
  );

  // Filter commands based on query
  const filteredCommands = React.useMemo(() => {
    if (!query) return commands;
    const lowerQuery = query.toLowerCase();
    return commands.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(lowerQuery) ||
        cmd.description?.toLowerCase().includes(lowerQuery)
    );
  }, [commands, query]);

  // Keyboard shortcut to open (Cmd/Ctrl + K)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when opened
  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filteredCommands.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
          setIsOpen(false);
        }
        break;
    }
  };

  return (
    <>
      {/* Trigger button (for mobile/visible trigger) */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg",
          "bg-[var(--surface-3)] border border-[var(--border-default)]",
          "text-sm text-[var(--text-tertiary)]",
          "hover:text-[var(--text-secondary)] hover:border-[var(--border-strong)]",
          "transition-colors cursor-pointer",
          className
        )}
      >
        <Search className="w-4 h-4" />
        <span>Search...</span>
        <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[var(--surface-2)] border border-[var(--border-default)] text-xs">
          <Command className="w-3 h-3" />
          <span>K</span>
        </kbd>
      </button>

      {/* Command Palette Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg z-50 px-4"
            >
              <div
                className={cn(
                  "overflow-hidden rounded-2xl",
                  "bg-[var(--surface-2)]/95 backdrop-blur-xl",
                  "border border-[var(--border-default)]",
                  "shadow-2xl shadow-black/40"
                )}
              >
                {/* Search input */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border-default)]">
                  <Search className="w-5 h-5 text-[var(--text-tertiary)]" />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search commands, markets..."
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setSelectedIndex(0);
                    }}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
                  />
                  <kbd className="px-2 py-1 rounded bg-[var(--surface-3)] text-xs text-[var(--text-tertiary)]">
                    ESC
                  </kbd>
                </div>

                {/* Commands list */}
                <div className="max-h-[320px] overflow-y-auto p-2">
                  {filteredCommands.length === 0 ? (
                    <div className="py-8 text-center text-[var(--text-tertiary)]">
                      No results found
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {filteredCommands.map((cmd, index) => {
                        const Icon = cmd.icon;
                        const isSelected = index === selectedIndex;

                        return (
                          <button
                            key={cmd.id}
                            onClick={() => {
                              cmd.action();
                              setIsOpen(false);
                            }}
                            onMouseEnter={() => setSelectedIndex(index)}
                            className={cn(
                              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg",
                              "transition-colors duration-100",
                              isSelected
                                ? "bg-[var(--accent)]/15 text-[var(--text-primary)]"
                                : "text-[var(--text-secondary)] hover:bg-[var(--surface-3)]"
                            )}
                          >
                            <div
                              className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center",
                                isSelected
                                  ? "bg-[var(--accent)]/20 text-[var(--accent)]"
                                  : "bg-[var(--surface-3)] text-[var(--text-tertiary)]"
                              )}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 text-left">
                              <p className="text-sm font-medium">{cmd.label}</p>
                              {cmd.description && (
                                <p className="text-xs text-[var(--text-tertiary)]">
                                  {cmd.description}
                                </p>
                              )}
                            </div>
                            {cmd.shortcut && (
                              <kbd className="px-2 py-1 rounded bg-[var(--surface-3)] text-xs text-[var(--text-tertiary)]">
                                {cmd.shortcut}
                              </kbd>
                            )}
                            {isSelected && (
                              <ArrowRight className="w-4 h-4 text-[var(--accent)]" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-4 py-2 border-t border-[var(--border-default)] text-xs text-[var(--text-muted)]">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <kbd className="px-1 py-0.5 rounded bg-[var(--surface-3)]">↑↓</kbd>
                      navigate
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1 py-0.5 rounded bg-[var(--surface-3)]">↵</kbd>
                      select
                    </span>
                  </div>
                  <span>Powered by KalshiAI</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default CommandPalette;
