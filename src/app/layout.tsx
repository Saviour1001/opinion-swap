import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import { Navbar } from "@/components";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Opinion Swap",
  description: "Built at ETH Sydney",
  icons: "/favicon.ico",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="h-screen bg-gradient-radial from-[#282828] via-[#1a1a1a] to-[#0a0a0a]">
        <Providers>
          <Navbar />
          {children}
        </Providers>
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
