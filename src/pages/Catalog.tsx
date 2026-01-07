import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Header } from "@/components/Header";
import { BourbonCard } from "@/components/BourbonCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { bourbons, categories } from "@/data/bourbons";
import { cn } from "@/lib/utils";

export default function Catalog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const filteredBourbons = useMemo(() => {
    return bourbons.filter((bourbon) => {
      const matchesSearch = 
        bourbon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bourbon.distillery.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bourbon.flavorProfile.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = 
        selectedCategory === "all" || bourbon.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

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
            Explore our comprehensive collection of bourbons. Search by name, distillery, 
            or flavor profile to find your next favorite pour.
          </p>
        </div>
      </section>

      {/* Search and Filters */}
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
            
            {/* Filter toggle (mobile) */}
            <Button 
              variant="outline" 
              className="sm:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Category filters */}
          <div className={cn(
            "flex flex-wrap gap-2 mt-4 transition-all duration-300",
            showFilters ? "block" : "hidden sm:flex"
          )}>
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
        </div>
      </section>

      {/* Results */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Results count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{filteredBourbons.length}</span> bourbons
            </p>
            {(searchQuery || selectedCategory !== "all") && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
              >
                Clear filters
              </Button>
            )}
          </div>

          {/* Grid */}
          {filteredBourbons.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBourbons.map((bourbon, index) => (
                <BourbonCard key={bourbon.id} bourbon={bourbon} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg font-medium mb-2">No bourbons found</p>
              <p className="text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
