import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pixel Parcel",
  description: "A three-action delivery counter Mini App on Base.",
  other: {
    "base:app_id": "6a27e3e3cf15720bcb102d4a",
    "talentapp:project_verification":
      "7104ae9620018263c1a2f08bf1a75c5147df9963854519fcfd4cd28fd3d434cedc79aaac29220659d6c47bd6d00a924c17f7c64356ae40ec48880bb8d523c0cf",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
