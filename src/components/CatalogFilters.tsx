import { useState } from "react";
import { X, ChevronDown, ChevronUp, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { distilleries, rarityLevels, priceRanges, flavorCategories } from "@/data/bourbons";
import { cn } from "@/lib/utils";

export interface FilterState {
  distilleries: string[];
  rarities: string[];
  priceRange: string;
  flavors: string[];
}

interface CatalogFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  activeFilterCount: number;
}

function FilterSection({ 
  title, 
  children, 
  defaultOpen = true 
}: { 
  title: string; 
  children: React.ReactNode; 
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border-b border-border pb-4">
      <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-semibold hover:text-primary transition-colors">
        {title}
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

function FilterContent({ filters, onFiltersChange }: Omit<CatalogFiltersProps, 'activeFilterCount'>) {
  const toggleDistillery = (id: string) => {
    const updated = filters.distilleries.includes(id)
      ? filters.distilleries.filter(d => d !== id)
      : [...filters.distilleries, id];
    onFiltersChange({ ...filters, distilleries: updated });
  };

  const toggleRarity = (id: string) => {
    const updated = filters.rarities.includes(id)
      ? filters.rarities.filter(r => r !== id)
      : [...filters.rarities, id];
    onFiltersChange({ ...filters, rarities: updated });
  };

  const toggleFlavor = (flavor: string) => {
    const updated = filters.flavors.includes(flavor)
      ? filters.flavors.filter(f => f !== flavor)
      : [...filters.flavors, flavor];
    onFiltersChange({ ...filters, flavors: updated });
  };

  const setPriceRange = (id: string) => {
    onFiltersChange({ ...filters, priceRange: id });
  };

  return (
    <div className="space-y-4">
      {/* Distilleries */}
      <FilterSection title="Distillery">
        <ScrollArea className="h-48">
          <div className="space-y-2 pr-4">
            {distilleries.slice(1).map((distillery) => (
              <div key={distillery.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`dist-${distillery.id}`}
                  checked={filters.distilleries.includes(distillery.id)}
                  onCheckedChange={() => toggleDistillery(distillery.id)}
                />
                <Label 
                  htmlFor={`dist-${distillery.id}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {distillery.label}
                </Label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </FilterSection>

      {/* Rarity */}
      <FilterSection title="Rarity">
        <div className="space-y-2">
          {rarityLevels.slice(1).map((rarity) => (
            <div key={rarity.id} className="flex items-center space-x-2">
              <Checkbox
                id={`rarity-${rarity.id}`}
                checked={filters.rarities.includes(rarity.id)}
                onCheckedChange={() => toggleRarity(rarity.id)}
              />
              <Label 
                htmlFor={`rarity-${rarity.id}`}
                className="text-sm font-normal cursor-pointer"
              >
                {rarity.label}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range (MSRP)">
        <div className="space-y-2">
          {priceRanges.map((price) => (
            <div key={price.id} className="flex items-center space-x-2">
              <Checkbox
                id={`price-${price.id}`}
                checked={filters.priceRange === price.id}
                onCheckedChange={() => setPriceRange(price.id === filters.priceRange ? 'all' : price.id)}
              />
              <Label 
                htmlFor={`price-${price.id}`}
                className="text-sm font-normal cursor-pointer"
              >
                {price.label}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Flavors */}
      <FilterSection title="Flavor Profile" defaultOpen={false}>
        <div className="flex flex-wrap gap-2">
          {flavorCategories.map((flavor) => (
            <button
              key={flavor}
              onClick={() => toggleFlavor(flavor)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium transition-all",
                filters.flavors.includes(flavor)
                  ? "bg-bourbon-500 text-white"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {flavor}
            </button>
          ))}
        </div>
      </FilterSection>
    </div>
  );
}

// Desktop sidebar filters
export function DesktopFilters({ filters, onFiltersChange, activeFilterCount }: CatalogFiltersProps) {
  const clearAll = () => {
    onFiltersChange({
      distilleries: [],
      rarities: [],
      priceRange: 'all',
      flavors: [],
    });
  };

  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-32 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="bg-bourbon-500 text-white">
                {activeFilterCount}
              </Badge>
            )}
          </h3>
          {activeFilterCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAll} className="text-xs">
              Clear all
            </Button>
          )}
        </div>
        <FilterContent filters={filters} onFiltersChange={onFiltersChange} />
      </div>
    </aside>
  );
}

// Mobile sheet filters
export function MobileFilters({ filters, onFiltersChange, activeFilterCount }: CatalogFiltersProps) {
  const [open, setOpen] = useState(false);

  const clearAll = () => {
    onFiltersChange({
      distilleries: [],
      rarities: [],
      priceRange: 'all',
      flavors: [],
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="lg:hidden gap-2">
          <Filter className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="bg-bourbon-500 text-white ml-1">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAll}>
                Clear all
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)] mt-4">
          <FilterContent filters={filters} onFiltersChange={onFiltersChange} />
        </ScrollArea>
        <div className="mt-4">
          <Button onClick={() => setOpen(false)} className="w-full" variant="bourbon">
            Show Results
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Active filter badges
export function ActiveFilters({ 
  filters, 
  onFiltersChange 
}: Omit<CatalogFiltersProps, 'activeFilterCount'>) {
  const activeFilters: { type: string; value: string; label: string }[] = [];

  filters.distilleries.forEach(d => {
    const dist = distilleries.find(x => x.id === d);
    if (dist) activeFilters.push({ type: 'distillery', value: d, label: dist.label });
  });

  filters.rarities.forEach(r => {
    const rarity = rarityLevels.find(x => x.id === r);
    if (rarity) activeFilters.push({ type: 'rarity', value: r, label: rarity.label });
  });

  if (filters.priceRange !== 'all') {
    const price = priceRanges.find(x => x.id === filters.priceRange);
    if (price) activeFilters.push({ type: 'price', value: filters.priceRange, label: price.label });
  }

  filters.flavors.forEach(f => {
    activeFilters.push({ type: 'flavor', value: f, label: f });
  });

  if (activeFilters.length === 0) return null;

  const removeFilter = (type: string, value: string) => {
    switch (type) {
      case 'distillery':
        onFiltersChange({ ...filters, distilleries: filters.distilleries.filter(d => d !== value) });
        break;
      case 'rarity':
        onFiltersChange({ ...filters, rarities: filters.rarities.filter(r => r !== value) });
        break;
      case 'price':
        onFiltersChange({ ...filters, priceRange: 'all' });
        break;
      case 'flavor':
        onFiltersChange({ ...filters, flavors: filters.flavors.filter(f => f !== value) });
        break;
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {activeFilters.map((filter, i) => (
        <Badge 
          key={`${filter.type}-${filter.value}-${i}`}
          variant="secondary" 
          className="gap-1 pl-3 pr-1 py-1 bg-bourbon-100 dark:bg-bourbon-900/30 text-bourbon-700 dark:text-bourbon-300"
        >
          {filter.label}
          <button
            onClick={() => removeFilter(filter.type, filter.value)}
            className="ml-1 p-0.5 rounded-full hover:bg-bourbon-200 dark:hover:bg-bourbon-800"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
    </div>
  );
}
