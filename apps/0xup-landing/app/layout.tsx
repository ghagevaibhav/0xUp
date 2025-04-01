import type React from "react";
import "@/app/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/app/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "0xUp - Web3 Uptime Monitoring, Decentralized",
  description:
    "Real-time checks. Staked security. No central point of failure. Ensure your dApps, APIs, and smart contracts are always online with decentralized monitoring.",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ClerkProvider>
        <body className={inter.className}>
          <Providers>{children}</Providers>
        </body>
      </ClerkProvider>
    </html>
  );
}

import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
