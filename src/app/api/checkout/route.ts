import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { auth } from '@clerk/nextjs/server';

// Initialize Stripe (Ensure STRIPE_SECRET_KEY is in .env.local)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16', // Always hardcode API version to prevent breaking changes
});

export async function POST(req: Request) {
  try {
    // 1. Authenticate user via Clerk
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // 2. Parse request body for PricingTier info
    const body = await req.json();
    const { priceId, tenantId } = body;

    if (!priceId) {
      return new NextResponse('Price ID is required', { status: 400 });
    }

    // 3. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      billing_address_collection: 'auto',
      customer_email: undefined, // Let Stripe collect it or pass Clerk email if available
      line_items: [
        {
          price: priceId, // The Stripe Price ID (e.g., price_1N...)
          quantity: 1,
        },
      ],
      mode: 'subscription', // Assuming recurring subscription per implementation plan
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout?canceled=true`,
      client_reference_id: userId, // This gets passed to the .NET Webhook to link the Student
      metadata: {
        tenantId: tenantId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('[STRIPE_CHECKOUT_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
