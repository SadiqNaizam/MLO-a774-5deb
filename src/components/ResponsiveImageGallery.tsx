import React, { useState } from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageItem {
  src: string;
  alt: string;
  id: string | number;
}

interface ResponsiveImageGalleryProps {
  images: ImageItem[];
  mainImageRatio?: number; // e.g., 1 for square, 16/9 for wide
  thumbnailSize?: string; // e.g., 'w-16 h-16' or 'w-20 h-20'
}

const ResponsiveImageGallery: React.FC<ResponsiveImageGalleryProps> = ({
  images,
  mainImageRatio = 16 / 9,
  thumbnailSize = 'w-20 h-16', // Rectangular thumbnails are common
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  console.log("Rendering ResponsiveImageGallery, current index:", currentIndex, "images count:", images.length);

  if (!images || images.length === 0) {
    return (
        <div className="w-full bg-muted flex items-center justify-center rounded-md" style={{aspectRatio: `${mainImageRatio}`}}>
            <p className="text-muted-foreground">No image available</p>
        </div>
    );
  }

  const handleThumbnailClick = (index: number) => {
    console.log("Thumbnail clicked, setting index to:", index);
    setCurrentIndex(index);
  };

  const handlePrev = () => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const handleNext = () => setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  const currentImage = images[currentIndex];

  return (
    <div className="flex flex-col gap-4">
        {/* Main Image with Navigation */}
        <div className="relative">
            <AspectRatio ratio={mainImageRatio} className="bg-muted rounded-lg overflow-hidden">
                 <img
                    src={currentImage.src || '/placeholder.svg'}
                    alt={currentImage.alt || 'Main listing image'}
                    className="object-cover w-full h-full transition-opacity duration-300 ease-in-out"
                    key={currentImage.id} // For transition on image change
                    onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
                />
            </AspectRatio>
            {images.length > 1 && (
              <>
                <Button variant="outline" size="icon" className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full" onClick={handlePrev}>
                  <ChevronLeft className="h-5 w-5"/>
                </Button>
                <Button variant="outline" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full" onClick={handleNext}>
                  <ChevronRight className="h-5 w-5"/>
                </Button>
              </>
            )}
        </div>

        {/* Thumbnails Scrollable Horizontally */}
        {images.length > 1 && (
            <div className="overflow-x-auto pb-2">
                <div className="flex space-x-2">
                    {images.map((image, index) => (
                    <button
                        key={image.id}
                        onClick={() => handleThumbnailClick(index)}
                        className={cn(
                            "block rounded-md overflow-hidden border-2 transition-all flex-shrink-0",
                            index === currentIndex ? 'border-primary' : 'border-transparent hover:border-muted-foreground/50',
                            thumbnailSize
                        )}
                    >
                        <img
                            src={image.src || '/placeholder.svg'}
                            alt={image.alt || `Thumbnail ${index + 1}`}
                            className="object-cover w-full h-full"
                            onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
                         />
                    </button>
                    ))}
                </div>
            </div>
        )}
    </div>
  );
};
export default ResponsiveImageGallery;