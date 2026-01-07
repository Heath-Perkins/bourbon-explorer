import { commonFlavors } from "@/data/reviews";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FlavorSelectorProps {
  selected: string[];
  onChange: (flavors: string[]) => void;
}

export function FlavorSelector({ selected, onChange }: FlavorSelectorProps) {
  const toggleFlavor = (flavor: string) => {
    if (selected.includes(flavor)) {
      onChange(selected.filter((f) => f !== flavor));
    } else {
      onChange([...selected, flavor]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {commonFlavors.map((flavor) => {
        const isSelected = selected.includes(flavor);
        return (
          <button
            key={flavor}
            type="button"
            onClick={() => toggleFlavor(flavor)}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
              isSelected
                ? "bg-bourbon-amber text-white shadow-md"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            {flavor}
          </button>
        );
      })}
    </div>
  );
}
