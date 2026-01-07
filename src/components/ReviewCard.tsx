import { format } from "date-fns";
import { TastingNote } from "@/data/reviews";
import { StarRating } from "@/components/StarRating";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MapPin, Clock, GlassWater, Droplets } from "lucide-react";

interface ReviewCardProps {
  review: TastingNote;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card className="bourbon-card overflow-hidden">
      {/* Color header */}
      <div 
        className="h-16 relative"
        style={{ backgroundColor: review.visibleColor }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10" />
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-serif text-lg font-semibold">{review.bourbonName}</h3>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {format(new Date(review.dateTime), "MMM d, yyyy 'at' h:mm a")}
              </span>
              {review.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {review.location}
                </span>
              )}
            </div>
          </div>
          <StarRating rating={review.rating} size="sm" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Serving info */}
        <div className="flex items-center gap-2 text-xs">
          {review.glassware && (
            <Badge variant="secondary" className="gap-1">
              <GlassWater className="h-3 w-3" />
              {review.glassware}
            </Badge>
          )}
          {review.waterAdded && (
            <Badge variant="secondary" className="gap-1">
              <Droplets className="h-3 w-3" />
              Water
            </Badge>
          )}
          {review.iceAdded && (
            <Badge variant="secondary">On Ice</Badge>
          )}
        </div>

        {/* Tasting notes */}
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium text-foreground">Bouquet:</span>
            <p className="text-muted-foreground">{review.bouquet}</p>
          </div>
          <div>
            <span className="font-medium text-foreground">Taste:</span>
            <p className="text-muted-foreground">{review.taste}</p>
          </div>
          <div>
            <span className="font-medium text-foreground">Finish:</span>
            <p className="text-muted-foreground">{review.finish}</p>
          </div>
        </div>

        {/* Flavor tags */}
        <div className="flex flex-wrap gap-1.5">
          {review.discernibleFlavors.map((flavor) => (
            <Badge 
              key={flavor} 
              variant="outline" 
              className="text-xs bg-bourbon-cream/50 border-bourbon-amber/30 text-bourbon-copper"
            >
              {flavor}
            </Badge>
          ))}
        </div>

        {/* Overall thoughts */}
        <div className="pt-3 border-t border-border">
          <p className="text-sm italic text-foreground">"{review.overallThoughts}"</p>
        </div>
      </CardContent>
    </Card>
  );
}
