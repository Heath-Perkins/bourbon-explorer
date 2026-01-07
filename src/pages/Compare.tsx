import { Link } from "react-router-dom";
import { ArrowLeft, X, Plus, Flame, Droplets, Clock, MapPin, GitCompare } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useCompare } from "@/hooks/useCompare";
import { bourbons } from "@/data/bourbons";
import { cn } from "@/lib/utils";

interface SpecRowProps {
  label: string;
  values: (string | number | undefined)[];
  highlight?: boolean;
}

function SpecRow({ label, values, highlight }: SpecRowProps) {
  return (
    <div className={cn(
      "grid gap-4 py-3 border-b border-border/50",
      highlight && "bg-secondary/30"
    )} style={{ gridTemplateColumns: `140px repeat(${values.length}, 1fr)` }}>
      <div className="text-sm font-medium text-muted-foreground px-4">{label}</div>
      {values.map((value, i) => (
        <div key={i} className="text-sm font-medium text-center">
          {value || "—"}
        </div>
      ))}
    </div>
  );
}

export default function Compare() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  
  const compareBourbons = bourbons.filter(b => compareList.includes(b.id));

  // Find highest values for highlighting
  const maxProof = Math.max(...compareBourbons.map(b => b.proof));
  const maxAbv = Math.max(...compareBourbons.map(b => b.abv));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/catalog">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold">
                Compare Bourbons
              </h1>
              <p className="text-muted-foreground text-sm">
                {compareBourbons.length} bourbon{compareBourbons.length !== 1 ? 's' : ''} selected
              </p>
            </div>
          </div>
          
          {compareBourbons.length > 0 && (
            <Button variant="ghost" onClick={clearCompare}>
              Clear All
            </Button>
          )}
        </div>

        {compareBourbons.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
              <GitCompare className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No bourbons to compare</h2>
            <p className="text-muted-foreground mb-6">
              Add bourbons from the catalog to compare them side-by-side
            </p>
            <Link to="/catalog">
              <Button variant="bourbon">
                Browse Catalog
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Bourbon Headers */}
            <div 
              className="grid gap-4" 
              style={{ gridTemplateColumns: `140px repeat(${compareBourbons.length}, 1fr)` }}
            >
              <div /> {/* Empty cell for label column */}
              {compareBourbons.map((bourbon) => (
                <Card key={bourbon.id} className="relative group overflow-hidden">
                  <button
                    onClick={() => removeFromCompare(bourbon.id)}
                    className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  
                  {/* Color header */}
                  <div 
                    className="h-20"
                    style={{ backgroundColor: bourbon.color }}
                  />
                  
                  <CardContent className="p-4 text-center">
                    <h3 className="font-serif font-semibold line-clamp-2 mb-1">
                      {bourbon.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-2">
                      {bourbon.distillery}
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      {bourbon.category.replace('-', ' ')}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
              
              {/* Add more slot */}
              {compareBourbons.length < 4 && (
                <Link to="/catalog" className="block">
                  <Card className="h-full min-h-[180px] border-dashed flex items-center justify-center hover:bg-secondary/30 transition-colors">
                    <div className="text-center p-4">
                      <Plus className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Add bourbon</p>
                    </div>
                  </Card>
                </Link>
              )}
            </div>

            {/* Comparison Table */}
            <Card>
              <CardContent className="p-0">
                <SpecRow 
                  label="Proof" 
                  values={compareBourbons.map(b => `${b.proof}°`)}
                />
                <SpecRow 
                  label="ABV" 
                  values={compareBourbons.map(b => `${b.abv}%`)}
                />
                <SpecRow 
                  label="Age" 
                  values={compareBourbons.map(b => b.age || "NAS")}
                />
                <SpecRow 
                  label="Origin" 
                  values={compareBourbons.map(b => b.origin)}
                />
                <SpecRow 
                  label="Mash Bill" 
                  values={compareBourbons.map(b => b.mashBill)}
                />
                <SpecRow 
                  label="MSRP" 
                  values={compareBourbons.map(b => b.msrp)}
                />
                <SpecRow 
                  label="Secondary" 
                  values={compareBourbons.map(b => b.secondaryPrice)}
                />
                <SpecRow 
                  label="Rarity" 
                  values={compareBourbons.map(b => b.rarity.replace('-', ' '))}
                />
                <SpecRow 
                  label="Availability" 
                  values={compareBourbons.map(b => b.availability.replace('-', ' '))}
                />
              </CardContent>
            </Card>

            {/* Flavor Profiles */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Flavor Profiles</h3>
                <div 
                  className="grid gap-4"
                  style={{ gridTemplateColumns: `repeat(${compareBourbons.length}, 1fr)` }}
                >
                  {compareBourbons.map((bourbon) => (
                    <div key={bourbon.id}>
                      <p className="text-sm font-medium mb-2 text-center">{bourbon.name}</p>
                      <div className="flex flex-wrap justify-center gap-1">
                        {bourbon.flavorProfile.map((flavor) => (
                          <Badge 
                            key={flavor}
                            variant="outline"
                            className="text-xs bg-secondary/50"
                          >
                            {flavor}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Descriptions */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Descriptions</h3>
                <div 
                  className="grid gap-6"
                  style={{ gridTemplateColumns: `repeat(${compareBourbons.length}, 1fr)` }}
                >
                  {compareBourbons.map((bourbon) => (
                    <div key={bourbon.id}>
                      <p className="text-sm font-medium mb-2">{bourbon.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {bourbon.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
