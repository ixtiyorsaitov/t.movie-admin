import { cn } from "@/lib/utils";
import { StarIcon } from "lucide-react";
import React from "react";

type Props = {
  value: number; // current rating (can be fractional like 3.5)
  size?: number; // px size of each star (default 20)
  max?: number; // number of stars (default 5)
  className?: string;
  "aria-label"?: string;
};

export function ReadOnlyStars({
  value,
  size = 20,
  max = 5,
  className,
  "aria-label": ariaLabel,
}: Props) {
  // clamp value between 0 and max
  const clamped = Math.max(0, Math.min(value, max));
  // percent of total width to fill
  const fillPercent = (clamped / max) * 100;

  // inline style width for filled-layer
  const filledStyle: React.CSSProperties = {
    width: `${fillPercent}%`,
  };

  // SVG star - filled and outline look identical; color controlled by parent
  const StarSVG = ({ filled = true }: { filled?: boolean }) => (
    <StarIcon
      className={cn(
        filled ? "text-primary fill-primary" : "text-muted-foreground"
      )}
      size={size}
    />
  );

  return (
    <div
      className={cn("inline-block select-none", className)}
      role="img"
      aria-label={ariaLabel ?? `Rating: ${clamped} out of ${max}`}
      title={`${clamped} / ${max}`}
      style={{ lineHeight: 0 /* remove extra gap under svg */ }}
    >
      {/* container that holds both empty and filled layers */}
      <div className="relative inline-block" style={{ fontSize: 0 }}>
        {/* Empty (outline/unfilled) stars */}
        <div className="flex gap-1">
          {Array.from({ length: max }).map((_, i) => (
            <span
              key={`empty-${i}`}
              className="text-muted-foreground"
              style={{ lineHeight: 0 }}
            >
              <StarSVG filled={false} />
            </span>
          ))}
        </div>

        {/* Filled layer — absolutely positioned, clipped by width */}
        <div
          className="absolute inset-0 top-0 left-0 overflow-hidden pointer-events-none"
          style={filledStyle}
          aria-hidden="true"
        >
          <div className="flex gap-1">
            {Array.from({ length: max }).map((_, i) => (
              <span
                key={`filled-${i}`}
                className="text-yellow-400" // filled color; tailwind default
                style={{ lineHeight: 0 }}
              >
                <StarSVG filled={true} />
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReadOnlyStars;
