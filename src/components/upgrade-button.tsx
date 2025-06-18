"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useSubscription } from "@/hooks/useSubscription";
import { Loader2Icon, StarIcon } from "lucide-react";
import { createStripePortal } from "@/actions/create-stripe-portal";
import { Button } from "./ui/button";

export default function UpgradeButton() {
  const { isPro, loading } = useSubscription();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  if (!isPro && !loading) {
    return (
      <Button asChild>
        <Link href="/dashboard/upgrade">
          Upgrade <StarIcon />
        </Link>
      </Button>
    );
  }

  if (loading) {
    return (
      <Button>
        <Loader2Icon className="animate-spin" />
      </Button>
    );
  }

  const handleUpgrade = () => {
    startTransition(async () => {
      const stripePortalUrl = await createStripePortal();
      router.push(stripePortalUrl);
    });
  };

  return (
    <Button onClick={handleUpgrade} disabled={isPending} size="sm">
      {isPending ? (
        <Loader2Icon className="animate-spin" />
      ) : (
        <p>
          <span className="font-extrabold mr-1">PRO</span>
          Account
        </p>
      )}
    </Button>
  );
}
