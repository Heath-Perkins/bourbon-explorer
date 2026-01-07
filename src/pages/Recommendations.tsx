import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { BourbonCard } from "@/components/BourbonCard";
import { FlavorSelector } from "@/components/FlavorSelector";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { bourbons, Bourbon } from "@/data/bourbons";
import { sampleReviews } from "@/data/reviews";
import { Sparkles, History, Sliders, Star, Wine, Share2, Check, Copy } from "lucide-react";
import { toast } from "sonner";
function calculateFlavorScore(bourbon: Bourbon, preferredFlavors: string[]): number {
  if (preferredFlavors.length === 0) return 0;
  const matches = bourbon.flavorProfile.filter((f) =>
    preferredFlavors.some((pf) => f.toLowerCase().includes(pf.toLowerCase()) || pf.toLowerCase().includes(f.toLowerCase()))
  );
  return (matches.length / preferredFlavors.length) * 100;
}

function getFlavorProfileFromReviews(): { flavors: string[]; bourbonIds: string[] } {
  const flavorCounts: Record<string, number> = {};
  const bourbonIds: string[] = [];

  sampleReviews.forEach((review) => {
    bourbonIds.push(review.bourbonId);
    review.discernibleFlavors.forEach((flavor) => {
      flavorCounts[flavor] = (flavorCounts[flavor] || 0) + 1;
    });
  });

  const sortedFlavors = Object.entries(flavorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([flavor]) => flavor);

  return { flavors: sortedFlavors, bourbonIds };
}

export default function Recommendations() {
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("preferences");
  const [copied, setCopied] = useState(false);

  const { flavors: reviewFlavors, bourbonIds: reviewedBourbonIds } = useMemo(
    () => getFlavorProfileFromReviews(),
    []
  );

  const shareRecommendations = async (recommendations: { bourbon: Bourbon; score: number }[], title: string) => {
    const bourbonList = recommendations
      .slice(0, 5)
      .map((r, i) => `${i + 1}. ${r.bourbon.name} (${Math.round(r.score)}% match)`)
      .join("\n");

    const shareText = `🥃 My Bourbon Recommendations from Bourbon Vault\n\n${title}:\n${bourbonList}\n\nDiscover your perfect pour at Bourbon Vault!`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Bourbon Recommendations",
          text: shareText,
          url: shareUrl,
        });
        toast.success("Shared successfully!");
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          fallbackCopy(shareText + "\n" + shareUrl);
        }
      }
    } else {
      fallbackCopy(shareText + "\n" + shareUrl);
    }
  };

  const fallbackCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const preferenceRecommendations = useMemo(() => {
    if (selectedFlavors.length === 0) return [];
    return bourbons
      .map((bourbon) => ({
        bourbon,
        score: calculateFlavorScore(bourbon, selectedFlavors),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12);
  }, [selectedFlavors]);

  const reviewBasedRecommendations = useMemo(() => {
    if (reviewFlavors.length === 0) return [];
    return bourbons
      .filter((b) => !reviewedBourbonIds.includes(b.id))
      .map((bourbon) => ({
        bourbon,
        score: calculateFlavorScore(bourbon, reviewFlavors),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12);
  }, [reviewFlavors, reviewedBourbonIds]);

  const topRatedRecommendations = useMemo(() => {
    const topReviewedIds = sampleReviews
      .filter((r) => r.rating >= 4)
      .map((r) => r.bourbonId);

    if (topReviewedIds.length === 0) return [];

    const topReviewedBourbons = bourbons.filter((b) => topReviewedIds.includes(b.id));
    const combinedFlavors = topReviewedBourbons.flatMap((b) => b.flavorProfile);

    return bourbons
      .filter((b) => !topReviewedIds.includes(b.id))
      .map((bourbon) => ({
        bourbon,
        score: calculateFlavorScore(bourbon, combinedFlavors),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">AI-Powered Recommendations</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Discover Your Next <span className="text-primary">Pour</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Get personalized bourbon recommendations based on your flavor preferences and tasting history.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full max-w-lg mx-auto grid-cols-2">
            <TabsTrigger value="preferences" className="gap-2">
              <Sliders className="h-4 w-4" />
              By Flavor
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <History className="h-4 w-4" />
              From Reviews
            </TabsTrigger>
          </TabsList>

          {/* Flavor Preferences Tab */}
          <TabsContent value="preferences" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wine className="h-5 w-5 text-primary" />
                  Select Your Preferred Flavors
                </CardTitle>
                <CardDescription>
                  Choose the flavor notes you enjoy most, and we'll find bourbons that match.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FlavorSelector selected={selectedFlavors} onChange={setSelectedFlavors} />
                {selectedFlavors.length > 0 && (
                  <div className="flex items-center gap-2 pt-2">
                    <span className="text-sm text-muted-foreground">Selected:</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedFlavors.map((f) => (
                        <Badge key={f} variant="default" className="bg-primary">
                          {f}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedFlavors([])}
                      className="ml-auto text-muted-foreground"
                    >
                      Clear all
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {preferenceRecommendations.length > 0 ? (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-serif text-2xl font-semibold">
                    Recommended for You
                    <span className="text-muted-foreground text-base font-normal ml-2">
                      ({preferenceRecommendations.length} matches)
                    </span>
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareRecommendations(preferenceRecommendations, "Based on my flavor preferences")}
                    className="gap-2"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                    Share
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {preferenceRecommendations.map(({ bourbon, score }, index) => (
                    <div key={bourbon.id} className="relative">
                      <div className="absolute top-2 right-2 z-10">
                        <Badge className="bg-primary text-primary-foreground">
                          {Math.round(score)}% match
                        </Badge>
                      </div>
                      <BourbonCard bourbon={bourbon} index={index} />
                    </div>
                  ))}
                </div>
              </section>
            ) : selectedFlavors.length > 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <p className="text-muted-foreground">No matches found for your selection. Try different flavors.</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Select some flavors above to get recommendations.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Review History Tab */}
          <TabsContent value="history" className="space-y-8">
            {reviewFlavors.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5 text-primary" />
                    Your Flavor Profile
                  </CardTitle>
                  <CardDescription>
                    Based on {sampleReviews.length} tasting notes, here are your most mentioned flavors.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {reviewFlavors.map((flavor, i) => (
                      <Badge
                        key={flavor}
                        variant={i < 3 ? "default" : "secondary"}
                        className={i < 3 ? "bg-primary" : ""}
                      >
                        {flavor}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {reviewBasedRecommendations.length > 0 ? (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-serif text-2xl font-semibold">
                    Based on Your Diary
                    <span className="text-muted-foreground text-base font-normal ml-2">
                      (excluding already reviewed)
                    </span>
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareRecommendations(reviewBasedRecommendations, "Based on my tasting diary")}
                    className="gap-2"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                    Share
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {reviewBasedRecommendations.map(({ bourbon, score }, index) => (
                    <div key={bourbon.id} className="relative">
                      <div className="absolute top-2 right-2 z-10">
                        <Badge className="bg-primary text-primary-foreground">
                          {Math.round(score)}% match
                        </Badge>
                      </div>
                      <BourbonCard bourbon={bourbon} index={index} />
                    </div>
                  ))}
                </div>
              </section>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Add more tasting notes to get personalized recommendations.</p>
                </CardContent>
              </Card>
            )}

            {topRatedRecommendations.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-serif text-2xl font-semibold flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Similar to Your Top Rated
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareRecommendations(topRatedRecommendations, "Similar to my top-rated bourbons")}
                    className="gap-2"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                    Share
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {topRatedRecommendations.map(({ bourbon, score }, index) => (
                    <div key={bourbon.id} className="relative">
                      <div className="absolute top-2 right-2 z-10">
                        <Badge className="bg-primary text-primary-foreground">
                          {Math.round(score)}% match
                        </Badge>
                      </div>
                      <BourbonCard bourbon={bourbon} index={index} />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
