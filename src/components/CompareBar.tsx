import { Link } from "react-router-dom";
import { X, GitCompare, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompare } from "@/hooks/useCompare";
import { bourbons } from "@/data/bourbons";
import { cn } from "@/lib/utils";

export function CompareBar() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  
  if (compareList.length === 0) return null;

  const compareBourbons = bourbons.filter(b => compareList.includes(b.id));

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border shadow-lg animate-fade-up">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Label */}
          <div className="hidden sm:flex items-center gap-2 text-sm font-medium">
            <GitCompare className="h-4 w-4 text-primary" />
            <span>Compare ({compareList.length}/4)</span>
          </div>

          {/* Bourbon chips */}
          <div className="flex-1 flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {compareBourbons.map((bourbon) => (
              <div
                key={bourbon.id}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-sm whitespace-nowrap"
              >
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: bourbon.color }}
                />
                <span className="max-w-[120px] truncate">{bourbon.name}</span>
                <button
                  onClick={() => removeFromCompare(bourbon.id)}
                  className="p-0.5 rounded-full hover:bg-background/50"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="ghost" size="sm" onClick={clearCompare}>
              Clear
            </Button>
            <Link to="/compare">
              <Button variant="bourbon" size="sm" className="gap-1">
                Compare
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
