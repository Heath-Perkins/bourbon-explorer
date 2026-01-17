import { Link } from "react-router-dom";
import { Plus, BookOpen, Trash2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StarRating } from "@/components/StarRating";
import { Badge } from "@/components/ui/badge";
import { useTastingNotes } from "@/hooks/useTastingNotes";
import { bourbons } from "@/data/bourbons";
import { format } from "date-fns";

export default function Diary() {
  const { notes, loading, deleteNote } = useTastingNotes();

  const getBourbonData = (bourbonId: string) => 
    bourbons.find(b => b.id === bourbonId);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this tasting note?')) {
      await deleteNote(id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse text-muted-foreground text-center">Loading your diary...</div>
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
          {notes.length > 0 ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {notes.map((note) => {
                const bourbon = getBourbonData(note.bourbon_id);
                return (
                  <Card key={note.id} className="overflow-hidden group">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex-shrink-0"
                            style={{ backgroundColor: note.visible_color || bourbon?.color || '#CD853F' }}
                          />
                          <div>
                            <h3 className="font-serif font-semibold line-clamp-1">
                              {note.bourbon_name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(note.tasted_at), 'MMM d, yyyy')}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                          onClick={() => handleDelete(note.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {note.rating && (
                        <div className="mb-4">
                          <StarRating rating={note.rating} size="sm" />
                        </div>
                      )}

                      {note.overall_thoughts && (
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                          {note.overall_thoughts}
                        </p>
                      )}

                      {note.discernible_flavors && note.discernible_flavors.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {note.discernible_flavors.slice(0, 4).map((flavor) => (
                            <Badge key={flavor} variant="secondary" className="text-xs">
                              {flavor}
                            </Badge>
                          ))}
                          {note.discernible_flavors.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{note.discernible_flavors.length - 4}
                            </Badge>
                          )}
                        </div>
                      )}

                      {note.location && (
                        <p className="text-xs text-muted-foreground mt-3">
                          📍 {note.location}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
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
