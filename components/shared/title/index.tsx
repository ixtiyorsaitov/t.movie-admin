import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import React from "react";

interface Props {
  buttonText: string;
  buttonClick?: () => void;
  buttonIcon?: LucideIcon;
  title: string;
  description: string;
}

const Title = ({
  buttonText,
  title,
  description,
  buttonIcon: Icon,
  buttonClick,
}: Props) => {
  return (
    <div className="w-full flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <Button onClick={buttonClick} className="flex gap-2 items-center">
        {Icon && <Icon className="w-4 h-4" />}
        {buttonText}
      </Button>
    </div>
  );
};

export default Title;
