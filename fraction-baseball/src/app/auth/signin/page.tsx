"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

// Separate component that uses useSearchParams
function SignInForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setError("Invalid username or password");
        console.error("Sign-in error:", result.error);
      } else if (result?.url) {
        // Successful login, redirect to the callback URL
        window.location.href = result.url;
      } else {
        // Fallback to home page if no URL is provided
        window.location.href = "/";
      }
    } catch (error) {
      setError("An error occurred during sign in");
      console.error("Sign-in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4 rounded-md shadow-sm">
        <div>
          <label htmlFor="username" className="sr-only">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            className="relative block w-full appearance-none rounded-md border border-gray-300 bg-white/90 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="relative block w-full appearance-none rounded-md border border-gray-300 bg-white/90 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-red-300 bg-red-500 p-3 text-center text-sm font-medium text-white shadow-md dark:border-red-500 dark:bg-red-600 dark:text-white">
          {error}
        </div>
      )}

      <div className="flex flex-col space-y-4">
        <button
          type="submit"
          disabled={isLoading}
          className="group relative flex w-full cursor-pointer justify-center rounded-full bg-gray-700 px-4 py-2 text-sm font-medium text-white shadow-md transition-colors hover:bg-gray-800 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>

        <Link
          href="/"
          className="flex w-full cursor-pointer justify-center rounded-full bg-gray-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-colors hover:bg-gray-600 focus:ring-2 focus:ring-offset-2 focus:outline-none"
        >
          Back to Home
        </Link>
      </div>
    </form>
  );
}

// Loading fallback for Suspense
function SignInFormLoading() {
  return (
    <div className="mt-8 space-y-6">
      <div className="space-y-4">
        <div className="h-10 w-full animate-pulse rounded-md bg-gray-300"></div>
        <div className="h-10 w-full animate-pulse rounded-md bg-gray-300"></div>
      </div>
      <div className="h-10 w-full animate-pulse rounded-md bg-gray-400"></div>
      <div className="h-10 w-full animate-pulse rounded-md bg-gray-400"></div>
    </div>
  );
}

export default function SignIn() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[var(--gradient-start)] to-[var(--gradient-end)]">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-black/10 p-6 shadow-md dark:bg-white/10">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[var(--foreground)]">
            Sign in to your account
          </h2>
        </div>
        <Suspense fallback={<SignInFormLoading />}>
          <SignInForm />
        </Suspense>
      </div>
    </div>
  );
}
