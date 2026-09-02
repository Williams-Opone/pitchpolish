"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-[#080c16] flex items-center justify-center p-6">
      <SignIn
        routing="hash"
        forceRedirectUrl="/dashboard"
        appearance={{
          elements: {
            formButtonPrimary: "bg-amber-400 text-[#080c16] hover:bg-amber-300 font-bold rounded-full",
            card: "bg-[#11131a] border-white/10 shadow-2xl",
          },
        }}
      />
    </main>
  );
}