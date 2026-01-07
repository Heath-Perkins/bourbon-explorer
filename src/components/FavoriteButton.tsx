import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  bourbonId: string;
  variant?: "icon" | "full";
  className?: string;
}

export function FavoriteButton({ bourbonId, variant = "icon", className }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isActive = isFavorite(bourbonId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(bourbonId);
  };

  if (variant === "full") {
    return (
      <Button
        onClick={handleClick}
        variant={isActive ? "bourbon" : "outline"}
        className={cn("gap-2", className)}
      >
        <Heart className={cn("h-4 w-4", isActive && "fill-current")} />
        {isActive ? "In Wishlist" : "Add to Wishlist"}
      </Button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "p-2 rounded-full transition-all duration-200",
        "hover:scale-110 active:scale-95",
        isActive 
          ? "bg-bourbon-500 text-white" 
          : "bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-bourbon-500",
        className
      )}
      aria-label={isActive ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart className={cn("h-5 w-5", isActive && "fill-current")} />
    </button>
  );
}
