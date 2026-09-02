import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Auth" }, { status: 401 });

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: "price_1YOURREALPRICEID", quantity: 1 }], // <-- REPLACE THIS
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?canceled=true`,
    metadata: { clerk_user_id: userId },
  });

  return NextResponse.json({ url: session.url });
}