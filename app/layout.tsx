import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const serifFont = Instrument_Serif({ subsets: ["latin"], variable: "--font-serif", weight: "400" });

export const metadata: Metadata = {
  title: "PitchPolish — AI Pitch Review",
  description: "Like a $200/hr VC partner, for $19/mo.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <html lang="en" className={`${inter.variable} ${serifFont.variable} dark`} suppressHydrationWarning>
        <body className="bg-[#080c16] text-[#e8e8f0] font-sans antialiased selection:bg-amber-500/20">
          {children}
        </body>
      </html>
    </Providers>
  );
}