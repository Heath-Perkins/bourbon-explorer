import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Droplets, Flame, Clock, PenLine, DollarSign, TrendingUp } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FavoriteButton } from "@/components/FavoriteButton";
import { CompareButton } from "@/components/CompareButton";
import { bourbons } from "@/data/bourbons";

export default function BourbonDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const bourbon = bourbons.find((b) => b.id === id);

  if (!bourbon) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-serif font-bold mb-4">Bourbon not found</h1>
          <Link to="/catalog">
            <Button>Return to Catalog</Button>
          </Link>
        </div>
      </div>
    );
  }

  const specs = [
    { label: "Proof", value: `${bourbon.proof}°`, icon: Flame },
    { label: "ABV", value: `${bourbon.abv}%`, icon: Droplets },
    { label: "Age", value: bourbon.age || "NAS", icon: Clock },
    { label: "Origin", value: bourbon.origin, icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Back button */}
      <div className="container mx-auto px-4 py-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      {/* Hero */}
      <section className="container mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Color display */}
          <div className="relative">
            <div 
              className="aspect-square max-w-md mx-auto rounded-3xl shadow-elevated overflow-hidden"
              style={{ backgroundColor: bourbon.color }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="glass-effect rounded-xl p-4 text-center">
                  <p className="text-xs text-white/70 uppercase tracking-wide mb-1">Bourbon Color</p>
                  <p className="font-mono text-white">{bourbon.color}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <Badge className="mb-3 bg-bourbon-amber/10 text-bourbon-copper border-bourbon-amber/30">
                {bourbon.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Badge>
              <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">
                {bourbon.name}
              </h1>
              <p className="text-xl text-muted-foreground">{bourbon.distillery}</p>
            </div>

            {/* Pricing */}
            {(bourbon.msrp || bourbon.secondaryPrice) && (
              <div className="flex flex-wrap gap-4">
                {bourbon.msrp && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
                    <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="text-xs text-muted-foreground">MSRP</p>
                      <p className="font-semibold text-green-600 dark:text-green-400">{bourbon.msrp}</p>
                    </div>
                  </div>
                )}
                {bourbon.secondaryPrice && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-bourbon-amber/10 border border-bourbon-amber/20">
                    <TrendingUp className="h-4 w-4 text-bourbon-amber" />
                    <div>
                      <p className="text-xs text-muted-foreground">Secondary Market</p>
                      <p className="font-semibold text-bourbon-amber">{bourbon.secondaryPrice}</p>
                    </div>
                  </div>
                )}
                {bourbon.msrp && bourbon.secondaryPrice && (() => {
                  const msrpNum = parseInt(bourbon.msrp.replace(/[^0-9]/g, ''));
                  const secondaryNum = parseInt(bourbon.secondaryPrice.replace(/[^0-9]/g, ''));
                  if (msrpNum && secondaryNum) {
                    const markup = ((secondaryNum - msrpNum) / msrpNum) * 100;
                    const color = markup <= 25 ? "text-green-600 dark:text-green-400 bg-green-500/10 border-green-500/20" 
                      : markup <= 100 ? "text-yellow-600 dark:text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
                      : markup <= 300 ? "text-orange-600 dark:text-orange-400 bg-orange-500/10 border-orange-500/20"
                      : "text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/20";
                    return (
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${color}`}>
                        <div>
                          <p className="text-xs text-muted-foreground">Markup</p>
                          <p className="font-semibold">+{markup.toFixed(0)}%</p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            )}

            <p className="text-muted-foreground leading-relaxed">
              {bourbon.description}
            </p>

            {/* Specs grid */}
            <div className="grid grid-cols-2 gap-4">
              {specs.map((spec) => {
                const Icon = spec.icon;
                return (
                  <Card key={spec.label} className="bg-secondary/30 border-border/50">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-bourbon-amber/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-bourbon-amber" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{spec.label}</p>
                        <p className="font-medium">{spec.value}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Mash bill */}
            {bourbon.mashBill && (
              <div>
                <h3 className="font-semibold mb-2">Mash Bill</h3>
                <p className="text-muted-foreground">{bourbon.mashBill}</p>
              </div>
            )}

            {/* Flavor profile */}
            <div>
              <h3 className="font-semibold mb-3">Flavor Profile</h3>
              <div className="flex flex-wrap gap-2">
                {bourbon.flavorProfile.map((flavor) => (
                  <Badge 
                    key={flavor}
                    variant="outline"
                    className="bg-secondary/50 border-border px-3 py-1"
                  >
                    {flavor}
                  </Badge>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-3">
              <FavoriteButton bourbonId={bourbon.id} variant="full" />
              <CompareButton bourbonId={bourbon.id} variant="full" />
              <Link to={`/diary/new?bourbon=${bourbon.id}`}>
                <Button variant="bourbon" size="lg" className="gap-2">
                  <PenLine className="h-4 w-4" />
                  Log a Tasting
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
