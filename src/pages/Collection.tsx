import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Package, Eye, Heart, Filter } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BourbonCard } from "@/components/BourbonCard";
import { useCollection, CollectionStatus } from "@/hooks/useCollection";
import { bourbons } from "@/data/bourbons";

export default function Collection() {
  const { collection, loading, removeFromCollection } = useCollection();
  const [activeTab, setActiveTab] = useState<CollectionStatus | "all">("all");

  const filteredCollection = activeTab === "all" 
    ? collection 
    : collection.filter(item => item.status === activeTab);

  const getBourbonData = (bourbonId: string) => 
    bourbons.find(b => b.id === bourbonId);

  const statusCounts = {
    own: collection.filter(c => c.status === 'own').length,
    tried: collection.filter(c => c.status === 'tried').length,
    want: collection.filter(c => c.status === 'want').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse text-muted-foreground text-center">Loading collection...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero */}
      <section className="bg-secondary/30 border-b border-border">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <Link to="/catalog">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to Catalog
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">
            My Collection
          </h1>
          <p className="text-muted-foreground">
            Track the bourbons you own, have tried, and want to try.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          {collection.length > 0 ? (
            <>
              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as CollectionStatus | "all")}>
                <TabsList className="grid w-full max-w-md grid-cols-4 mb-8">
                  <TabsTrigger value="all" className="gap-2">
                    <Filter className="h-4 w-4" />
                    All ({collection.length})
                  </TabsTrigger>
                  <TabsTrigger value="own" className="gap-2">
                    <Package className="h-4 w-4" />
                    Own ({statusCounts.own})
                  </TabsTrigger>
                  <TabsTrigger value="tried" className="gap-2">
                    <Eye className="h-4 w-4" />
                    Tried ({statusCounts.tried})
                  </TabsTrigger>
                  <TabsTrigger value="want" className="gap-2">
                    <Heart className="h-4 w-4" />
                    Want ({statusCounts.want})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab}>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCollection.map((item) => {
                      const bourbon = getBourbonData(item.bourbon_id);
                      if (!bourbon) return null;
                      return (
                        <div key={item.id} className="relative">
                          <BourbonCard bourbon={bourbon} />
                          <div className="absolute top-2 left-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              item.status === 'own' ? 'bg-green-500/20 text-green-400' :
                              item.status === 'tried' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-amber-500/20 text-amber-400'
                            }`}>
                              {item.status === 'own' ? 'Owned' : 
                               item.status === 'tried' ? 'Tried' : 'Want'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary mb-6">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-serif font-semibold mb-2">
                No bottles in your collection yet
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Start building your collection by browsing our catalog and marking bottles you own, have tried, or want.
              </p>
              <Link to="/catalog">
                <Button variant="bourbon" size="lg">
                  Browse Catalog
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
