import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { ProviderWrapper } from "~/app/_components/provider-wrapper";
import { ThemeProviderWrapper } from "~/app/_components/theme-provider";
import { Navbar } from "~/app/_components/navbar";

export const metadata: Metadata = {
  title: "My Baseball App",
  description: "A baseball fraction game application",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <TRPCReactProvider>
          <ProviderWrapper>
            <ThemeProviderWrapper>
              <Navbar />
              {children}
            </ThemeProviderWrapper>
          </ProviderWrapper>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
