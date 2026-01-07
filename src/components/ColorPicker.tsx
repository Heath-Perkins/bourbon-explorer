import { colorPresets } from "@/data/reviews";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div 
          className="w-12 h-12 rounded-lg border-2 border-border shadow-inner"
          style={{ backgroundColor: value }}
        />
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-20 cursor-pointer rounded border-0"
        />
      </div>
      
      <div className="flex flex-wrap gap-2">
        {colorPresets.map((preset) => (
          <button
            key={preset.hex}
            type="button"
            onClick={() => onChange(preset.hex)}
            className={cn(
              "group relative w-8 h-8 rounded-full border-2 transition-all duration-200",
              value === preset.hex 
                ? "border-primary scale-110 ring-2 ring-primary/30" 
                : "border-border hover:scale-105"
            )}
            style={{ backgroundColor: preset.hex }}
            title={preset.name}
          >
            <span className="sr-only">{preset.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
