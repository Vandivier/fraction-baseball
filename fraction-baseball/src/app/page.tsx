import Link from "next/link";

import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  const session = await auth();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[var(--gradient-start)] to-[var(--gradient-end)] text-[var(--foreground)]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            My Baseball App
          </h1>

          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-center text-3xl">
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
        </div>
      </main>
    </HydrateClient>
  );
}
