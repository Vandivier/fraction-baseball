import Link from "next/link";

import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";
import PlayerSummary from "~/components/PlayerSummary";
import StatsSummary from "~/components/StatsSummary";

export default async function Home() {
  const session = await auth();

  return (
    <HydrateClient>
      <main className="min-h-screen bg-gradient-to-b from-[var(--gradient-start)] to-[var(--gradient-end)] text-[var(--foreground)]">
        <div className="container mx-auto px-4 py-16">
          <div className="mb-12 flex flex-col items-center justify-center">
            <h1 className="mb-6 text-center text-5xl font-extrabold tracking-tight sm:text-[5rem]">
              My Baseball App
            </h1>

            <p className="mb-4 text-center text-3xl">
              {session?.user
                ? `Hello ${session.user.username || session.user.name}`
                : "Hello Guest"}
            </p>

            {!session && (
              <Link
                href="/api/auth/signin"
                className="cursor-pointer rounded-full bg-gray-700 px-10 py-3 font-semibold text-white shadow-md transition-colors hover:bg-gray-800"
              >
                Sign in
              </Link>
            )}
          </div>

          {/* Show baseball components only for signed-in users */}
          {session?.user && (
            <div className="space-y-8">
              <PlayerSummary />
              <StatsSummary />
            </div>
          )}
        </div>
      </main>
    </HydrateClient>
  );
}
