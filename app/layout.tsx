import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { Instrument_Serif, Manrope, IBM_Plex_Mono } from "next/font/google";
import { MotionProvider } from "@/components/premium";
import "./globals.css";

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-display",
});

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "PitchPolish — Not a pitch. A score.",
  description:
    "Upload your pitch deck. PitchPolish reads every slide, scores it against investor benchmarks across nine dimensions, and tells you exactly what to fix.",
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%230c0a08'/%3E%3Ctext x='16' y='23' font-family='Georgia' font-size='19' fill='%23d6814f' text-anchor='middle' font-style='italic'%3EP.%3C/text%3E%3C/svg%3E",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const body = (
    <body className="bg-ink-900 text-paper font-sans antialiased">
      <MotionProvider>{children}</MotionProvider>
    </body>
  );

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? (
        <ClerkProvider
          appearance={{
            variables: {
              colorPrimary: "#d6814f",
              colorBackground: "#100d0a",
            },
          }}
        >
          {body}
        </ClerkProvider>
      ) : (
        body
      )}
    </html>
  );
}
