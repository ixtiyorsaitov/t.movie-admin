"use client";

import type { IPrice } from "@/types/price";
import { PeriodType } from "@/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import z from "zod";
import { priceSchema } from "@/lib/validation";

interface Props {
  data: z.infer<typeof priceSchema> | IPrice;
}

export function PriceCardPreview({ data }: Props) {
  const {
    name = "Tarif nomi",
    price = 0,
    period = PeriodType.MONTHLY,
    expiresPeriodCount = 1,
    description = "Tarif tavsifi",
    features = [],
    buttonText = "Sotib olish",
    buttonVariant = "default",
    recommended = false,
  } = data;

  const formattedPrice = String(price || 0).replace(
    /\B(?=(\d{3})+(?!\d))/g,
    " "
  );

  return (
    <Card
      key={name}
      className={`relative p-6 bg-card border-border w-full max-w-[400px] ${
        recommended ? "border-primary/50 ring-1 ring-primary/20" : ""
      }`}
    >
      {recommended && (
        <div className="absolute top-4 right-4 z-10">
          <span className="text-xs font-medium text-accent-foreground px-3 py-1 rounded-full bg-accent">
            Tavsiya etiladi
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-foreground mb-2">{name}</h3>

        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-4xl font-bold text-foreground">
            {formattedPrice ?? 0}
          </span>
          <span className="text-muted-foreground text-base ml-1">{"so'm"}</span>
        </div>

        <div className="text-md text-primary mb-3">
          {`${expiresPeriodCount ?? 0} ${
            period === PeriodType.MONTHLY ? "oylik" : "yillik"
          }`}
        </div>

        <p className="text-sm text-muted-foreground break-all">{description}</p>
      </div>

      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            {feature.included ? (
              <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-500" />
            ) : (
              <X className="w-5 h-5 flex-shrink-0 mt-0.5 text-destructive" />
            )}
            <span className="text-sm text-foreground leading-relaxed">
              {feature.text}
            </span>
          </li>
        ))}
      </ul>

      <Button variant={buttonVariant} className={`w-full`}>
        {buttonText}
      </Button>
    </Card>
  );
}
