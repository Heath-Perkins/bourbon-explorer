import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, AlertTriangle, Trophy } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bourbon, bourbons } from "@/data/bourbons";
import { cn } from "@/lib/utils";

interface BourbonValue {
  id: string;
  name: string;
  distillery: string;
  msrp: number;
  secondary: number;
  markup: number;
  markupPercent: number;
  color: string;
  rarity: Bourbon['rarity'];
}

function parsePriceToNumber(price?: string): number | null {
  if (!price) return null;
  const match = price.match(/\$(\d+[\d,]*)/);
  if (!match) return null;
  return parseInt(match[1].replace(/,/g, ''), 10);
}

function getMarkupColor(percent: number): string {
  if (percent <= 25) return "text-green-600 dark:text-green-400";
  if (percent <= 100) return "text-yellow-600 dark:text-yellow-400";
  if (percent <= 300) return "text-orange-600 dark:text-orange-400";
  return "text-red-600 dark:text-red-400";
}

function getMarkupBadge(percent: number): { label: string; variant: "default" | "secondary" | "destructive" | "outline" } {
  if (percent <= 25) return { label: "Fair Value", variant: "default" };
  if (percent <= 100) return { label: "Slight Premium", variant: "secondary" };
  if (percent <= 300) return { label: "High Premium", variant: "outline" };
  return { label: "Extreme Premium", variant: "destructive" };
}

export default function ValueCalculator() {
  const bourbonValues = useMemo<BourbonValue[]>(() => {
    return bourbons
      .map(bourbon => {
        const msrp = parsePriceToNumber(bourbon.msrp);
        const secondary = parsePriceToNumber(bourbon.secondaryPrice);
        
        if (msrp === null || secondary === null || msrp === 0) return null;
        
        const markup = secondary - msrp;
        const markupPercent = ((secondary - msrp) / msrp) * 100;
        
        return {
          id: bourbon.id,
          name: bourbon.name,
          distillery: bourbon.distillery,
          msrp,
          secondary,
          markup,
          markupPercent,
          color: bourbon.color,
          rarity: bourbon.rarity,
        };
      })
      .filter((b): b is BourbonValue => b !== null)
      .sort((a, b) => b.markupPercent - a.markupPercent);
  }, []);

  const bestValue = bourbonValues.slice(-5).reverse();
  const worstValue = bourbonValues.slice(0, 5);
  
  const avgMarkup = bourbonValues.reduce((sum, b) => sum + b.markupPercent, 0) / bourbonValues.length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/catalog">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold">
              Value Calculator
            </h1>
            <p className="text-muted-foreground text-sm">
              Compare MSRP vs secondary market prices
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Bourbons Analyzed</p>
                <p className="text-2xl font-bold">{bourbonValues.length}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Markup</p>
                <p className="text-2xl font-bold">{avgMarkup.toFixed(0)}%</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Highest Markup</p>
                <p className="text-2xl font-bold">{worstValue[0]?.markupPercent.toFixed(0)}%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Best Value */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingDown className="h-5 w-5 text-green-500" />
                Best Value (Lowest Markup)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {bestValue.map((bourbon, i) => (
                <Link 
                  key={bourbon.id} 
                  to={`/bourbon/${bourbon.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <span className="w-6 h-6 rounded-full bg-green-500 text-white text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span 
                    className="w-4 h-4 rounded-full shrink-0"
                    style={{ backgroundColor: bourbon.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{bourbon.name}</p>
                    <p className="text-xs text-muted-foreground">{bourbon.distillery}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600 dark:text-green-400">
                      +{bourbon.markupPercent.toFixed(0)}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ${bourbon.msrp} → ${bourbon.secondary}
                    </p>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Worst Value */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-red-500" />
                Highest Markup (Collector Premiums)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {worstValue.map((bourbon, i) => (
                <Link 
                  key={bourbon.id} 
                  to={`/bourbon/${bourbon.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <span className="w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span 
                    className="w-4 h-4 rounded-full shrink-0"
                    style={{ backgroundColor: bourbon.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{bourbon.name}</p>
                    <p className="text-xs text-muted-foreground">{bourbon.distillery}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-600 dark:text-red-400">
                      +{bourbon.markupPercent.toFixed(0)}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ${bourbon.msrp} → ${bourbon.secondary}
                    </p>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Full List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">All Bourbons by Markup</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {bourbonValues.map((bourbon) => {
                const badge = getMarkupBadge(bourbon.markupPercent);
                return (
                  <Link 
                    key={bourbon.id} 
                    to={`/bourbon/${bourbon.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/30 transition-colors border-b border-border/50 last:border-0"
                  >
                    <span 
                      className="w-4 h-4 rounded-full shrink-0"
                      style={{ backgroundColor: bourbon.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{bourbon.name}</p>
                      <p className="text-xs text-muted-foreground">{bourbon.distillery}</p>
                    </div>
                    <div className="hidden sm:block text-right text-sm">
                      <span className="text-muted-foreground">MSRP:</span>{" "}
                      <span className="font-medium">${bourbon.msrp}</span>
                    </div>
                    <div className="hidden sm:block text-right text-sm">
                      <span className="text-muted-foreground">Secondary:</span>{" "}
                      <span className="font-medium">${bourbon.secondary}</span>
                    </div>
                    <div className="text-right min-w-[80px]">
                      <p className={cn("font-bold", getMarkupColor(bourbon.markupPercent))}>
                        +{bourbon.markupPercent.toFixed(0)}%
                      </p>
                      <Badge variant={badge.variant} className="text-xs mt-1">
                        {badge.label}
                      </Badge>
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
