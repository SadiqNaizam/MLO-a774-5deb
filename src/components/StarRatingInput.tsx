import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingInputProps {
  maxStars?: number;
  initialRating?: number;
  onRatingChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg'; // For icon size
  className?: string;
  iconClassName?: string;
}

const StarRatingInput: React.FC<StarRatingInputProps> = ({
  maxStars = 5,
  initialRating = 0,
  onRatingChange,
  readOnly = false,
  size = 'md',
  className,
  iconClassName,
}) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  console.log("Rendering StarRatingInput, rating:", rating, "hoverRating:", hoverRating);

  const handleStarClick = (index: number) => {
    if (readOnly) return;
    const newRating = index + 1;
    setRating(newRating);
    if (onRatingChange) {
      onRatingChange(newRating);
    }
    console.log("Star clicked, new rating:", newRating);
  };

  const handleMouseEnter = (index: number) => {
    if (readOnly) return;
    setHoverRating(index + 1);
  };

  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoverRating(0);
  };

  const starSizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div className={cn("flex items-center space-x-1", readOnly ? 'cursor-default' : 'cursor-pointer', className)}>
      {[...Array(maxStars)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= (hoverRating || rating);
        return (
          <Star
            key={index}
            className={cn(
              starSizeClasses[size],
              isFilled ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground fill-muted-foreground/20',
              !readOnly && 'hover:opacity-80 transition-opacity',
              iconClassName
            )}
            onClick={() => handleStarClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          />
        );
      })}
    </div>
  );
};
export default StarRatingInput;