import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers, DarkModeHandler } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Providers>
        <body className={inter.className}>
          <DarkModeHandler/>
          <main>{children}</main>
        </body>
      </Providers>
    </html>
  );
}
