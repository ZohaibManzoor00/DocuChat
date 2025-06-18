import stripe from "@/lib/stripe";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import Stripe from "stripe";
import { adminDb } from "../../../firebaseAdmin";

export async function POST(req: NextRequest) {
  const headersList = await headers();
  const body = await req.text();

  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return new Response("No signature", { status: 400 });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return new Response("No webhook secret", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return new Response("Webhook error " + error, { status: 400 });
  }

  const getUserDetails = async (customerId: string) => {
    const userDoc = await adminDb
      .collection("users")
      .where("stripeCustomerId", "==", customerId)
      .limit(1)
      .get();
    if (!userDoc.empty) {
      return userDoc.docs[0];
    }
  };

  console.log("EVENT TYPE", event.type);

  switch (event.type) {
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      const userDetails = await getUserDetails(customerId);

      if (!userDetails?.id) {
        return new Response("User not found", { status: 404 });
      }

      await adminDb
        .collection("users")
        .doc(userDetails.id)
        .update({
          isPro: subscription.status === "active" && !subscription.cancel_at_period_end,
        });
      console.log("Subscription updated", subscription.status);
      break;
    }
    case "checkout.session.completed":
      break;
    case "payment_intent.succeeded": {
      const invoice = event.data.object;
      const customerId = invoice.customer as string;

      const userDetails = await getUserDetails(customerId);

      if (!userDetails?.id) {
        return new Response("User not found", { status: 400 });
      }

      await adminDb.collection("users").doc(userDetails.id).update({
        isPro: true,
      });
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const userDetails = await getUserDetails(customerId);

      if (!userDetails?.id) {
        return new Response("User not found", { status: 404 });
      }

      await adminDb.collection("users").doc(userDetails.id).update({
        isPro: false,
      });
      break;
    }
    default:
      return new Response("Unhandled event", { status: 200 });
  }

  return new Response("Webhook received", { status: 200 });
}
