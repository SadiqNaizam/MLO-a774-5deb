import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Heart } from 'lucide-react'; // Assuming Heart for wishlist

interface ListingCardProps {
  id: string | number;
  title: string;
  imageUrl: string;
  pricePerNight: number;
  location: string;
  rating?: number; // Optional average rating
  reviewCount?: number; // Optional review count
  tags?: string[]; // e.g., "Superhost", "Great View"
  onWishlistToggle?: (id: string | number) => void;
  isWishlisted?: boolean;
}

const ListingCard: React.FC<ListingCardProps> = ({
  id,
  title,
  imageUrl,
  pricePerNight,
  location,
  rating,
  reviewCount,
  tags,
  onWishlistToggle,
  isWishlisted
}) => {
  console.log("Rendering ListingCard for:", title);

  return (
    <Card className="w-full overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      <Link to={`/listing/${id}`} className="block">
        <CardHeader className="p-0 relative">
          <AspectRatio ratio={16 / 9}>
            <img
              src={imageUrl || '/placeholder.svg'}
              alt={title}
              className="object-cover w-full h-full"
              onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
            />
          </AspectRatio>
          {onWishlistToggle && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-black/30 hover:bg-black/50 text-white rounded-full"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onWishlistToggle(id); }}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={cn("h-5 w-5", isWishlisted ? "fill-red-500 text-red-500" : "text-white")} />
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 mr-1" /> {location}
          </div>
          <CardTitle className="text-lg font-semibold line-clamp-2">{title}</CardTitle>
          {rating && reviewCount && (
            <div className="flex items-center text-sm">
              <Star className="h-4 w-4 mr-1 text-yellow-400 fill-yellow-400" />
              <span>{rating.toFixed(1)}</span>
              <span className="text-muted-foreground ml-1">({reviewCount} reviews)</span>
            </div>
          )}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {tags.slice(0, 3).map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
            </div>
          )}
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div>
          <span className="text-xl font-bold">${pricePerNight}</span>
          <span className="text-sm text-muted-foreground"> / night</span>
        </div>
        <Link to={`/listing/${id}`}>
          <Button size="sm">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
export default ListingCard;