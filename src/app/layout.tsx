import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ConvexClientProvider } from "@/providers/convex-client-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Clash",
  description: "AI Clash",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
      >
        <ConvexClientProvider>
          <SidebarProvider>
            <AppSidebar />
            <main className="flex-1">
              {/* <SidebarTrigger className="absolute top-2 left-2 z-20" /> */}
              {children}
            </main>
          </SidebarProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
