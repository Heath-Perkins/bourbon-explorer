import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { Header } from "@/components/Header";
import { BourbonCard } from "@/components/BourbonCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DesktopFilters, 
  MobileFilters, 
  ActiveFilters,
  FilterState 
} from "@/components/CatalogFilters";
import { bourbons, categories, priceRanges } from "@/data/bourbons";
import { cn } from "@/lib/utils";

// Helper to parse MSRP string to number
function parseMsrp(msrp?: string): number | null {
  if (!msrp) return null;
  const match = msrp.match(/\$(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

// Helper to match distillery name to filter id
function matchDistillery(distilleryName: string, filterId: string): boolean {
  const name = distilleryName.toLowerCase();
  const mappings: Record<string, string[]> = {
    'buffalo-trace': ['buffalo trace'],
    'heaven-hill': ['heaven hill', 'evan williams', 'elijah craig', 'larceny', 'henry mckenna'],
    'wild-turkey': ['wild turkey'],
    'jim-beam': ['jim beam', 'beam', 'bookers', 'knob creek', 'basil hayden', 'baker'],
    'four-roses': ['four roses'],
    'makers-mark': ["maker's mark", 'makers mark'],
    'brown-forman': ['brown-forman', 'old forester', 'woodford reserve'],
    'barton-1792': ['barton', '1792'],
    'michters': ["michter's", 'michters'],
    'angels-envy': ["angel's envy", 'angels envy'],
    'bardstown': ['bardstown bourbon'],
    'craft': ['new riff', 'wilderness trail', 'peerless', 'castle & key', 'rabbit hole', 'starlight'],
    'mgp': ['mgp', 'lawrenceburg'],
    'antique': ['stitzel-weller', 'old fitzgerald', 'antique', 'estate', 'pre-fire'],
  };
  
  const keywords = mappings[filterId] || [filterId.replace('-', ' ')];
  return keywords.some(keyword => name.includes(keyword));
}

export default function Catalog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filters, setFilters] = useState<FilterState>({
    distilleries: [],
    rarities: [],
    priceRange: 'all',
    flavors: [],
  });

  const activeFilterCount = useMemo(() => {
    return (
      filters.distilleries.length +
      filters.rarities.length +
      (filters.priceRange !== 'all' ? 1 : 0) +
      filters.flavors.length
    );
  }, [filters]);

  const filteredBourbons = useMemo(() => {
    return bourbons.filter((bourbon) => {
      // Search
      const matchesSearch = 
        bourbon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bourbon.distillery.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bourbon.flavorProfile.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Category
      const matchesCategory = 
        selectedCategory === "all" || bourbon.category === selectedCategory;
      
      // Distillery
      const matchesDistillery = 
        filters.distilleries.length === 0 ||
        filters.distilleries.some(d => matchDistillery(bourbon.distillery, d));
      
      // Rarity
      const matchesRarity = 
        filters.rarities.length === 0 ||
        filters.rarities.includes(bourbon.rarity);
      
      // Price
      let matchesPrice = true;
      if (filters.priceRange !== 'all') {
        const priceConfig = priceRanges.find(p => p.id === filters.priceRange);
        const bourbonMsrp = parseMsrp(bourbon.msrp);
        if (priceConfig && 'min' in priceConfig && bourbonMsrp !== null) {
          matchesPrice = bourbonMsrp >= priceConfig.min && bourbonMsrp < priceConfig.max;
        } else if (priceConfig && bourbonMsrp === null) {
          matchesPrice = false;
        }
      }
      
      // Flavors
      const matchesFlavors = 
        filters.flavors.length === 0 ||
        filters.flavors.some(f => 
          bourbon.flavorProfile.some(bp => bp.toLowerCase().includes(f.toLowerCase()))
        );
      
      return matchesSearch && matchesCategory && matchesDistillery && matchesRarity && matchesPrice && matchesFlavors;
    });
  }, [searchQuery, selectedCategory, filters]);

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setFilters({
      distilleries: [],
      rarities: [],
      priceRange: 'all',
      flavors: [],
    });
  };

  const hasActiveFilters = searchQuery || selectedCategory !== "all" || activeFilterCount > 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero */}
      <section className="bg-secondary/30 border-b border-border">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Bourbon Catalog
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Explore our comprehensive collection of {bourbons.length}+ bourbons. Filter by distillery, 
            rarity, price, or flavor profile to find your perfect pour.
          </p>
        </div>
      </section>

      {/* Search and Category Bar */}
      <section className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bourbons, distilleries, or flavors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            {/* Mobile filter trigger */}
            <MobileFilters 
              filters={filters} 
              onFiltersChange={setFilters} 
              activeFilterCount={activeFilterCount}
            />
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  selectedCategory === category.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Active filters display */}
          {activeFilterCount > 0 && (
            <div className="mt-4">
              <ActiveFilters filters={filters} onFiltersChange={setFilters} />
            </div>
          )}
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            {/* Desktop Sidebar Filters */}
            <DesktopFilters 
              filters={filters} 
              onFiltersChange={setFilters} 
              activeFilterCount={activeFilterCount}
            />

            {/* Results */}
            <div className="flex-1 min-w-0">
              {/* Results count */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-medium text-foreground">{filteredBourbons.length}</span> of {bourbons.length} bourbons
                </p>
                {hasActiveFilters && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={clearAllFilters}
                  >
                    Clear all filters
                  </Button>
                )}
              </div>

              {/* Grid */}
              {filteredBourbons.length > 0 ? (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredBourbons.map((bourbon, index) => (
                    <BourbonCard key={bourbon.id} bourbon={bourbon} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-lg font-medium mb-2">No bourbons found</p>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search or filters
                  </p>
                  <Button variant="outline" onClick={clearAllFilters}>
                    Clear all filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
