import { Link } from "react-router-dom";
import { Bourbon } from "@/data/bourbons";
import { Badge } from "@/components/ui/badge";
import { FavoriteButton } from "@/components/FavoriteButton";
import { CompareButton } from "@/components/CompareButton";

interface BourbonCardProps {
  bourbon: Bourbon;
  index?: number;
  showFavorite?: boolean;
}

export function BourbonCard({ bourbon, index = 0, showFavorite = true }: BourbonCardProps) {
  return (
    <Link
      to={`/bourbon/${bourbon.id}`}
      className="bourbon-card group block opacity-0 animate-fade-up relative"
      style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
    >
      {/* Action buttons */}
      {showFavorite && (
        <div className="absolute top-2 left-2 z-10 flex gap-1">
          <FavoriteButton bourbonId={bourbon.id} />
          <CompareButton bourbonId={bourbon.id} />
        </div>
      )}

      {/* Color swatch header */}
      <div 
        className="h-24 relative overflow-hidden"
        style={{ backgroundColor: bourbon.color }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
        <div className="absolute bottom-2 right-2">
          <Badge variant="secondary" className="bg-white/90 text-foreground font-semibold">
            {bourbon.proof}° Proof
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {bourbon.name}
          </h3>
          <p className="text-sm text-muted-foreground">{bourbon.distillery}</p>
        </div>

        {/* Quick stats */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>{bourbon.abv}% ABV</span>
          {bourbon.age && <span>{bourbon.age}</span>}
        </div>

        {/* Flavor tags */}
        <div className="flex flex-wrap gap-1.5">
          {bourbon.flavorProfile.slice(0, 3).map((flavor) => (
            <Badge 
              key={flavor} 
              variant="outline" 
              className="text-xs bg-secondary/50 border-border"
            >
              {flavor}
            </Badge>
          ))}
          {bourbon.flavorProfile.length > 3 && (
            <Badge variant="outline" className="text-xs bg-secondary/50 border-border">
              +{bourbon.flavorProfile.length - 3}
            </Badge>
          )}
        </div>

        {/* Price */}
        {bourbon.price && (
          <p className="text-sm font-medium text-bourbon-copper">{bourbon.price}</p>
        )}
      </div>
    </Link>
  );
}
