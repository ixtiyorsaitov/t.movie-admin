export interface IPrice {
  name: string;
  price: number;
  period: PeriodType;
  expiresPeriodCount: number;
  description: string;
  features: Array<{ text: string; included: boolean }>;
  buttonText: string;
  buttonVariant: "default" | "outline" | "secondary";
  recommended: boolean;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  _id: string;
}