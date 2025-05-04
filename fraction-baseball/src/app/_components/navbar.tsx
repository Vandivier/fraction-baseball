"use client";

import { useTheme } from "next-themes";
import { signOut, useSession } from "next-auth/react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="fixed top-0 left-0 z-10 flex items-center gap-3 p-4">
      <button
        onClick={toggleTheme}
        className="cursor-pointer rounded-full bg-gray-700 p-2 shadow-md transition-colors hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
        aria-label="Toggle dark mode"
      >
        {theme === "dark" ? (
          <SunIcon className="h-5 w-5 text-yellow-300" />
        ) : (
          <MoonIcon className="h-5 w-5 text-white" />
        )}
      </button>

      {session && (
        <button
          onClick={() => signOut()}
          className="cursor-pointer rounded-full bg-gray-700 p-2 shadow-md transition-colors hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
          aria-label="Sign out"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white dark:text-gray-200"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      )}
    </div>
  );
}
