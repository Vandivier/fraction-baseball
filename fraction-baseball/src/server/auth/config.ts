import { type DefaultSession, type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { type DefaultJWT } from "next-auth/jwt";

import { db } from "~/server/db";

// Define a type that matches our Prisma User model
type PrismaUser = {
  id: string;
  username: string;
  password: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
};

// Define a type for our custom where clause
type UserWhereInput = {
  where: {
    username: string;
  };
};

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      username: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    // Make sure id has the same modifiers as in other declarations (possibly optional)
    id?: string;
    username: string;
    name?: string | null;
    email?: string | null;
    // ...other properties
    // role: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    username: string;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        // Use non-null assertion (!) instead of 'as string'
        token.id = user.id!;
        token.username = user.username;
      }
      return token;
    },
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.id,
        username: token.username,
      },
    }),
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Early return if credentials are missing or not proper strings
        if (
          !credentials?.username ||
          typeof credentials.username !== "string" ||
          !credentials?.password ||
          typeof credentials.password !== "string"
        ) {
          return null;
        }

        try {
          // Create a properly typed query object with string username
          const userQuery: UserWhereInput = {
            where: {
              username: credentials.username,
            },
          };

          // Use type casting with our defined types
          const user = (await db.user.findUnique(
            userQuery as unknown as Parameters<typeof db.user.findUnique>[0],
          )) as PrismaUser | null;

          if (!user) {
            return null;
          }

          // Verify the password with properly typed variables
          const isPasswordValid = await compare(
            credentials.password,
            user.password,
          );

          if (!isPasswordValid) {
            return null;
          }

          // Return the user data for NextAuth
          return {
            id: user.id,
            username: user.username,
            name: user.name,
            email: user.email,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
