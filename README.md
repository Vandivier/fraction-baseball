# fraction-baseball

## installation

1. Ensure pnpm is available with node 22+
2. Copy .env.example to the same dir, rename the copy `.env`, and fill values appropriately
3. `pnpx prisma db push` and manually add any users you would like to be able to sign in.
4. `cd fraction-baseball && pnpm i` from the root dir, which contains this README.md file

you can then launch the app with `pnpm dev`

## built with

1. pnpm
2. Next.js + React
3. TailwindCSS
4. Prisma ORM
5. Supabase (postgres)
6. [T3 Stack](https://create.t3.gg/) - Reasoning [here](https://chatgpt.com/share/6817d756-8ff4-800d-9360-4e49d4b74321).
7. GitHub + Vercel
