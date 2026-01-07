import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, BookOpen } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ReviewCard } from "@/components/ReviewCard";
import { sampleReviews, TastingNote } from "@/data/reviews";

export default function Diary() {
  const [reviews, setReviews] = useState<TastingNote[]>(sampleReviews);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero */}
      <section className="bg-secondary/30 border-b border-border">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">
                My Tasting Diary
              </h1>
              <p className="text-muted-foreground">
                Your personal collection of bourbon experiences and notes.
              </p>
            </div>
            <Link to="/diary/new">
              <Button variant="bourbon" size="lg" className="gap-2">
                <Plus className="h-4 w-4" />
                New Entry
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          {reviews.length > 0 ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary mb-6">
                <BookOpen className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-serif font-semibold mb-2">
                No tasting notes yet
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Start documenting your bourbon journey by adding your first tasting note.
              </p>
              <Link to="/diary/new">
                <Button variant="bourbon" size="lg" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create First Entry
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
