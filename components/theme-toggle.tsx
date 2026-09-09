"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <button
      type="button"
      className="rounded-md border border-border-default p-2 text-fg-secondary transition hover:border-fg-tertiary hover:text-fg-primary"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle color theme"
    >
      {mounted && resolvedTheme === "light" ? (
        <Moon size={16} />
      ) : (
        <Sun size={16} />
      )}
    </button>
  );
}
