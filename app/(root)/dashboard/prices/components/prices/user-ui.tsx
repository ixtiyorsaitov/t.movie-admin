import React from "react";
import { IPrice } from "@/types/price";
import { PriceCardPreview } from "@/components/core/price-card-preview";

const PricesUserUI = ({ datas }: { datas: IPrice[] }) => {
  return (
    <div className="py-12 sm:px-6 bg-secondary my-4 rounded">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-foreground mb-4 text-balance">
            {"Ta'riflar va Narxlar"}
          </h1>
          <p className="text-lg text-muted-foreground text-balance">
            Hoziroq boshlang va {"ko'p"} imkoniyatlarga ega {"bo'ling!"}
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {datas.map((plan) => (
            <PriceCardPreview key={plan._id} data={plan} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricesUserUI;
