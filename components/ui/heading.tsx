interface HeadingProps {
  title: string;
  description: string;
}

export const Heading: React.FC<HeadingProps> = ({ title, description }) => {
  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
};

import { Skeleton } from "@/components/ui/skeleton";

const HeadingSkeleton = () => {
  return (
    <div className="flex items-start justify-between w-full mb-3">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-6 w-32" /> {/* title */}
        <Skeleton className="h-4 w-64" /> {/* description */}
      </div>
      <Skeleton className="h-9 w-28 rounded-md" /> {/* button */}
    </div>
  );
};

export default HeadingSkeleton;
