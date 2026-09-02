import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseServer } from "@/lib/supabase-server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature") || "";
  let event;

  try { event = stripe.webhooks.constructEvent(payload, sig, endpointSecret); }
  catch (e: any) { return new NextResponse(`Error: ${e.message}`, { status: 400 }); }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const sb = supabaseServer();
    await sb.from("subscriptions").upsert({
      user_id: session.metadata?.clerk_user_id,
      stripe_customer_id: session.customer,
      stripe_subscription_id: session.subscription,
      tier: "pro",
      status: "active",
    }, { onConflict: "user_id" });
  }
  return new NextResponse(null, { status: 200 });
}