"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free",
    price: "P0",
    features: [
      "Create a profile",
      "List up to 3 services",
      "Receive basic bookings",
      "Standard support",
    ],
  },
  {
    name: "Basic",
    price: "P99 / month",
    features: [
      "Unlimited services",
      "Priority listing & visibility",
      "Unlimited bookings",
      "Priority support",
      "Access to provider dashboard",
    ],
    popular: true,
  },
];

export default function SubscriptionPlans() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const router = useRouter();

  const handleSelect = (planName: string) => {
    setSelectedPlan(planName);
    router.push(`/signup?plan=${encodeURIComponent(planName)}`);
  };

  return (
    <section id="plans" className="py-16 px-6 text-center bg-gray-50">
      <h2 className="text-3xl font-bold mb-8">Provider Subscription Plans</h2>
      <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`rounded-2xl shadow-lg p-6 transition-all ${
              plan.popular ? "border-2 border-purple-500" : ""
            } ${
              selectedPlan === plan.name
                ? "ring-4 ring-pink-400 scale-105"
                : "hover:scale-105"
            }`}
          >
            <CardContent>
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <p className="text-2xl font-bold my-4">{plan.price}</p>
              <ul className="space-y-2 text-gray-600 text-left">
                {plan.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
              <Button
                className="mt-6 w-full"
                onClick={() => handleSelect(plan.name)}
              >
                {plan.name === "Free" ? "Join Free" : "Upgrade to Basic"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
