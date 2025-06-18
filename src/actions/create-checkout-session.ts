"use server";

import { UserDetails } from "@/app/dashboard/upgrade/page";
import { auth } from "@clerk/nextjs/server";
import { adminDb } from "../../firebaseAdmin";
import stripe from "@/lib/stripe";
import getBaseUrl from "@/lib/get-base-url";

export const createCheckoutSession = async (userDetails: UserDetails) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  let stripeCustomerId;

  const user = await adminDb.collection("users").doc(userId).get();

  stripeCustomerId = user.data()?.stripeCustomerId;

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: userDetails.email,
      name: userDetails.name,
      metadata: {
        userId,
      },
    });
    await adminDb
      .collection("users")
      .doc(userId)
      .set({ stripeCustomerId: customer.id });

    stripeCustomerId = customer.id;
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: process.env.STRIPE_PRO_PRICE_ID,
        quantity: 1,
      },
    ],
    mode: "subscription",
    customer: stripeCustomerId,
    success_url: `${getBaseUrl()}/dashboard?upgrade=true`,
    cancel_url: `${getBaseUrl()}/dashboard/upgrade`,
  });

  return session.id;
};
