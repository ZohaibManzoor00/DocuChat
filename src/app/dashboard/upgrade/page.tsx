"use client";

import { createCheckoutSession } from "@/actions/create-checkout-session";
import { createStripePortal } from "@/actions/create-stripe-portal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/useSubscription";
import { getStripe } from "@/lib/stripe-js";
import { useUser } from "@clerk/nextjs";
import { CheckCircle2, CheckIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export type UserDetails = {
  email: string;
  name: string;
};

export default function PricingPage() {
  const { user } = useUser();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { isPro, loading } = useSubscription();

  const handleUpgrade = () => {
    if (!user) return;

    const userDetails: UserDetails = {
      email: user.primaryEmailAddress?.emailAddress || "guest@gmail.com",
      name: user.fullName || "guest",
    };

    startTransition(async () => {
      const stripe = await getStripe();
      if (isPro) {
        const stripePortalUrl = await createStripePortal();
        return router.push(stripePortalUrl);
      } else {
        const sessionId = await createCheckoutSession(userDetails);
        await stripe?.redirectToCheckout({ sessionId });
      }
    });
  };

  return (
    <div>
      <div className="py-24 sm:py32 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-base font-semibold leading-7 text-primary">
            Pricing
          </h1>
          <p className="mt-2 text-4xl font-bold tracking-light sm:text-5xl">
            Supercharge your document analysis
          </p>
        </div>
        <p className="mt-6 mx-auto max-w-2xl px-10 text-center text-leading-8 text-foreground">
          Choose an affordable plan thats packed with the best features for
          interacting with your PDFs, enhancing productivity, and streamlining
          your workflow
        </p>

        <div className="max-w-md mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 md:max-w-2xl gap-8">
          <div className="ring-1 ring-border p-8 h-fit pb-12 rounded-3xl">
            <h3 className="text-lg font-semibold leading-8">Starter Plan</h3>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Explore Core Features at No Cost
            </p>
            <p className="text-4xl font-bold tracking-tight">Free</p>

            <ul role="list" className="mt-8 space-y-3 text-sm leading-6">
              <li className="flex gap-x-3">
                <CheckIcon className="size-6 flex-none text-primary" />
                Documents
              </li>
              <li className="flex gap-x-3">
                <CheckIcon className="size-6 flex-none text-primary" />
                Documents
              </li>
              <li className="flex gap-x-3">
                <CheckIcon className="size-6 flex-none text-primary" />
                Documents
              </li>
            </ul>
          </div>

          <div className="ring-2 rounded-3xl ring-primary p-8">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold leading-8 text-primary">
                Pro Plan
              </h3>
              <h3>
                {isPro && (
                  <Badge>
                    <CheckCircle2 /> Active
                  </Badge>
                )}
              </h3>
            </div>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Maximize Productivity with PRO Features
            </p>
            <p className="mt-6 flex items-baseline gap-x-1">
              <span className="text-4xl font-bold tracking-tight">$5.99</span>
              <span className="text-sm font-semibold leading-6">/ month</span>
            </p>

            <Button
              disabled={loading || isPending}
              className="bg-primary w-full shadow-sm hover:opacity-80 mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6"
              onClick={handleUpgrade}
            >
              {isPending || loading
                ? "Loading..."
                : isPro
                ? "Manage Plan"
                : "Upgrade to Pro"}
            </Button>

            <ul className="mt-8 space-y-3 text-sm leading-6" role="list">
              <li className="flex gap-x-3">
                <CheckIcon className="size-6 flex-none text-primary" />
                Store up to 20 documents
              </li>

              <li className="flex gap-x-3">
                <CheckIcon className="size-6 flex-none text-primary" />
                Edit and Delete Documents
              </li>

              <li className="flex gap-x-3">
                <CheckIcon className="size-6 flex-none text-primary" />
                Up to 100 AI Chat messages per document
              </li>

              <li className="flex gap-x-3">
                <CheckIcon className="size-6 flex-none text-primary" />
                Full Power AI Chat Functionality with Memory Recall
              </li>
              {/* <li className="flex-gap-x-3">
                <CheckIcon className="size-6 flex-none text-primary" />
                24-hour support response time
              </li>
              <li className="flex-gap-x-3">
                <CheckIcon className="size-6 flex-none text-primary" />
                Advanced Analytics
              </li> */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
