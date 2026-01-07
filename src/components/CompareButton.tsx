import { GitCompare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompare } from "@/hooks/useCompare";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CompareButtonProps {
  bourbonId: string;
  variant?: "icon" | "full";
  className?: string;
}

export function CompareButton({ bourbonId, variant = "icon", className }: CompareButtonProps) {
  const { isInCompare, toggleCompare, canAddMore } = useCompare();
  const isActive = isInCompare(bourbonId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isActive && !canAddMore) {
      toast.error("Compare limit reached", {
        description: "Remove a bourbon to add another (max 4)"
      });
      return;
    }
    
    const added = toggleCompare(bourbonId);
    if (added) {
      toast.success("Added to compare");
    }
  };

  if (variant === "full") {
    return (
      <Button
        onClick={handleClick}
        variant={isActive ? "secondary" : "outline"}
        className={cn("gap-2", className)}
      >
        <GitCompare className="h-4 w-4" />
        {isActive ? "In Compare" : "Add to Compare"}
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
          ? "bg-primary text-primary-foreground" 
          : "bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-primary",
        className
      )}
      aria-label={isActive ? "Remove from compare" : "Add to compare"}
    >
      <GitCompare className="h-5 w-5" />
    </button>
  );
}
