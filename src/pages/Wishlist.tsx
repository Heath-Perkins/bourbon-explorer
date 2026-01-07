import { Link } from "react-router-dom";
import { Heart, ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { BourbonCard } from "@/components/BourbonCard";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";
import { bourbons } from "@/data/bourbons";

export default function Wishlist() {
  const { favorites } = useFavorites();
  
  const wishlistBourbons = bourbons.filter(bourbon => 
    favorites.includes(bourbon.id)
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pb-24">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/catalog">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              My Wishlist
            </h1>
            <p className="text-muted-foreground">
              {wishlistBourbons.length} bourbon{wishlistBourbons.length !== 1 ? 's' : ''} saved
            </p>
          </div>
        </div>

        {wishlistBourbons.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-bourbon-100 dark:bg-bourbon-900/30 flex items-center justify-center">
              <Heart className="h-10 w-10 text-bourbon-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">
              Start exploring bourbons and tap the heart icon to save your favorites
            </p>
            <Link to="/catalog">
              <Button variant="bourbon">
                Browse Catalog
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistBourbons.map((bourbon) => (
              <BourbonCard key={bourbon.id} bourbon={bourbon} showFavorite />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
