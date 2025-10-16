"use client";

import type React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Plus } from "lucide-react";

interface IFeature {
  text: string;
  included: boolean;
}

interface FeaturesInputProps {
  value: IFeature[];
  onValueChange: (value: IFeature[]) => void;
  placeholder?: string;
  disabled?: boolean; // Added disabled prop
}

export function FeaturesInput({
  value,
  onValueChange,
  placeholder,
  disabled = false, // Added disabled prop with default value
}: FeaturesInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleAddFeature = () => {
    if (inputValue.trim() && !disabled) {
      // Prevent adding when disabled
      onValueChange([...value, { text: inputValue.trim(), included: true }]);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddFeature();
    }
  };

  const handleRemoveFeature = (index: number) => {
    if (!disabled) {
      // Prevent removing when disabled
      onValueChange(value.filter((_, i) => i !== index));
    }
  };

  const handleToggleIncluded = (index: number) => {
    if (!disabled) {
      // Prevent toggling when disabled
      const newFeatures = [...value];
      newFeatures[index] = {
        ...newFeatures[index],
        included: !newFeatures[index].included,
      };
      onValueChange(newFeatures);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1"
          disabled={disabled} // Pass disabled to Input
        />
        <Button
          type="button"
          onClick={handleAddFeature}
          size="icon"
          variant="secondary"
          disabled={disabled} // Pass disabled to Button
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-2 rounded-md border bg-background p-2 text-sm"
            >
              <Checkbox
                checked={feature.included}
                onCheckedChange={() => handleToggleIncluded(index)}
                id={`feature-${index}`}
                disabled={disabled} // Pass disabled to Checkbox
              />
              <label
                htmlFor={`feature-${index}`}
                className={`flex-1 cursor-pointer ${
                  !feature.included ? "text-muted-foreground line-through" : ""
                } ${disabled ? "cursor-not-allowed opacity-50" : ""}`} // Add disabled styling to label
              >
                {feature.text}
              </label>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => handleRemoveFeature(index)}
                disabled={disabled} // Pass disabled to remove Button
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
