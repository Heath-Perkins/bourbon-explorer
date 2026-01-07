import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

export function StarRating({ 
  rating, 
  maxRating = 5, 
  size = "md",
  interactive = false,
  onChange 
}: StarRatingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-7 w-7"
  };

  const handleClick = (index: number) => {
    if (interactive && onChange) {
      // Allow clicking same star to toggle half rating
      const newRating = index + 1;
      if (newRating === rating) {
        onChange(newRating - 0.5);
      } else {
        onChange(newRating);
      }
    }
  };

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxRating }).map((_, index) => {
        const filled = index < Math.floor(rating);
        const halfFilled = !filled && index < rating;
        
        return (
          <button
            key={index}
            type="button"
            disabled={!interactive}
            onClick={() => handleClick(index)}
            className={cn(
              "relative transition-transform",
              interactive && "hover:scale-110 cursor-pointer",
              !interactive && "cursor-default"
            )}
          >
            <Star
              className={cn(
                sizeClasses[size],
                "transition-colors",
                filled || halfFilled 
                  ? "fill-bourbon-gold text-bourbon-gold" 
                  : "text-border fill-transparent"
              )}
            />
            {halfFilled && (
              <div 
                className="absolute inset-0 overflow-hidden" 
                style={{ width: '50%' }}
              >
                <Star
                  className={cn(
                    sizeClasses[size],
                    "fill-bourbon-gold text-bourbon-gold"
                  )}
                />
              </div>
            )}
          </button>
        );
      })}
      {rating > 0 && (
        <span className="ml-2 text-sm font-medium text-muted-foreground">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
