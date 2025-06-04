import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavigationMenu from '@/components/layout/NavigationMenu';
import InteractiveSearchBar from '@/components/InteractiveSearchBar';
import Sidebar from '@/components/layout/Sidebar';
import ListingCard from '@/components/ListingCard';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Label } from '@/components/ui/label';
import { DateRange } from 'react-day-picker';
import { parseISO } from 'date-fns';

// Mock data for listings
const allListings = Array.from({ length: 25 }, (_, i) => ({
  id: `${i + 1}`,
  title: `Beautiful Property ${i + 1}`,
  imageUrl: `https://source.unsplash.com/800x600/?property,modern&r=${i}`,
  pricePerNight: 50 + Math.floor(Math.random() * 300),
  location: ['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Miami, FL', 'Austin, TX'][i % 5],
  rating: (3.5 + Math.random() * 1.5),
  reviewCount: Math.floor(Math.random() * 200),
  tags: [['WiFi', 'Pool', 'Kitchen', 'Parking', 'Pet Friendly'][j] for j in [i%5, (i+1)%5, (i+2)%5] if ['WiFi', 'Pool', 'Kitchen', 'Parking', 'Pet Friendly'][j]],
  amenities: {
    wifi: Math.random() > 0.3,
    pool: Math.random() > 0.7,
    kitchen: Math.random() > 0.2,
    parking: Math.random() > 0.5,
  }
}));


const SearchResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  console.log('SearchResultsPage loaded');

  const [priceRange, setPriceRange] = useState<[number, number]>([50, 500]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const listingsPerPage = 9;

  // Initial search params from URL
  const [searchParams, setSearchParams] = useState<{ destination: string; dateRange?: DateRange; guests: number }>({
    destination: '',
    guests: 1,
  });

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const destination = query.get('destination') || '';
    const fromDate = query.get('from') ? parseISO(query.get('from')!) : undefined;
    const toDate = query.get('to') ? parseISO(query.get('to')!) : undefined;
    const guests = parseInt(query.get('guests') || '1', 10);
    
    setSearchParams({
        destination,
        dateRange: fromDate && toDate ? { from: fromDate, to: toDate } : undefined,
        guests
    });
    console.log("Initial search params from URL:", { destination, fromDate, toDate, guests });
  }, [location.search]);


  const handleSearch = (params: { destination: string; dateRange?: DateRange; guests: number }) => {
    console.log('New search on results page:', params);
    const query = new URLSearchParams();
    if (params.destination) query.append('destination', params.destination);
    if (params.dateRange?.from) query.append('from', params.dateRange.from.toISOString());
    if (params.dateRange?.to) query.append('to', params.dateRange.to.toISOString());
    query.append('guests', params.guests.toString());
    navigate(`/search-results?${query.toString()}`);
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setSelectedAmenities(prev =>
      checked ? [...prev, amenity] : prev.filter(a => a !== amenity)
    );
  };

  const filteredListings = allListings.filter(listing => {
    const matchesPrice = listing.pricePerNight >= priceRange[0] && listing.pricePerNight <= priceRange[1];
    const matchesAmenities = selectedAmenities.every(amenity => (listing.amenities as any)[amenity.toLowerCase()]);
    const matchesDestination = searchParams.destination ? listing.location.toLowerCase().includes(searchParams.destination.toLowerCase()) : true;
    return matchesPrice && matchesAmenities && matchesDestination;
  });

  const totalPages = Math.ceil(filteredListings.length / listingsPerPage);
  const currentListings = filteredListings.slice((currentPage - 1) * listingsPerPage, currentPage * listingsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo(0,0); // Scroll to top on page change
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavigationMenu isAuthenticated={false} />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <InteractiveSearchBar 
          onSearch={handleSearch} 
          className="mb-8" 
          // Pass initial values to InteractiveSearchBar if needed, based on its props definition.
          // For this example, InteractiveSearchBar manages its own state based on props.
        />
        <div className="flex flex-col md:flex-row gap-8">
          <Sidebar title="Filter Results" className="md:sticky md:top-20 md:self-start"> {/* Sticky sidebar */}
            <Accordion type="multiple" defaultValue={['price', 'amenities']} className="w-full">
              <AccordionItem value="price">
                <AccordionTrigger>Price Range</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  <Label>Price per night: ${priceRange[0]} - ${priceRange[1]}</Label>
                  <Slider
                    defaultValue={[50, 500]}
                    min={0}
                    max={1000}
                    step={10}
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    className="my-4"
                  />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="amenities">
                <AccordionTrigger>Amenities</AccordionTrigger>
                <AccordionContent className="space-y-2 pt-2">
                  {['WiFi', 'Pool', 'Kitchen', 'Parking', 'Pet Friendly'].map(amenity => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        id={`amenity-${amenity.toLowerCase()}`}
                        checked={selectedAmenities.includes(amenity)}
                        onCheckedChange={(checked) => handleAmenityChange(amenity, !!checked)}
                      />
                      <Label htmlFor={`amenity-${amenity.toLowerCase()}`}>{amenity}</Label>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
              {/* Add more filters like property type, rating etc. */}
            </Accordion>
            <Button className="w-full mt-6" onClick={() => console.log("Apply filters manually if needed")}>Apply Filters</Button>
          </Sidebar>

          <main className="flex-1">
            <h2 className="text-2xl font-semibold mb-6">
              {searchParams.destination ? `Stays in ${searchParams.destination}` : "Available Stays"} ({filteredListings.length})
            </h2>
            {currentListings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentListings.map(listing => (
                  <ListingCard key={listing.id} {...listing} rating={parseFloat(listing.rating.toFixed(1))} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-10">No listings match your criteria. Try adjusting your filters.</p>
            )}

            {totalPages > 1 && (
              <Pagination className="mt-12">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" onClick={(e) => {e.preventDefault(); handlePageChange(currentPage - 1);}} aria-disabled={currentPage === 1} className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}/>
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink href="#" isActive={currentPage === i + 1} onClick={(e) => {e.preventDefault(); handlePageChange(i + 1);}}>
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  {/* Add Ellipsis if many pages */}
                  <PaginationItem>
                    <PaginationNext href="#" onClick={(e) => {e.preventDefault(); handlePageChange(currentPage + 1);}} aria-disabled={currentPage === totalPages} className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}/>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SearchResultsPage;