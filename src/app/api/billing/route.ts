import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Stripe integration placeholder
// In production, install stripe and implement:
// - POST /api/billing { action: "create-checkout" } → Stripe Checkout session
// - POST /api/billing { action: "portal" } → Stripe Customer Portal
// - Webhook handler for subscription events

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  switch (body.action) {
    case "create-checkout":
      // TODO: Create Stripe Checkout session
      // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
      // const checkoutSession = await stripe.checkout.sessions.create({...});
      return NextResponse.json({
        url: "https://checkout.stripe.com/placeholder",
        message: "Stripe checkout not yet configured. Add STRIPE_SECRET_KEY to .env.local",
      });

    case "portal":
      // TODO: Create Stripe Customer Portal session
      return NextResponse.json({
        url: "https://billing.stripe.com/placeholder",
        message: "Stripe portal not yet configured.",
      });

    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }
}
