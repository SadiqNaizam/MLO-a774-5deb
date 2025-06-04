import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationMenu from '@/components/layout/NavigationMenu';
import InteractiveSearchBar from '@/components/InteractiveSearchBar';
import ListingCard from '@/components/ListingCard';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { DateRange } from 'react-day-picker';

// Placeholder data for featured listings
const featuredListings = [
  {
    id: '1',
    title: 'Cozy Beachfront Villa',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop',
    pricePerNight: 250,
    location: 'Malibu, California',
    rating: 4.9,
    reviewCount: 120,
    tags: ['Beachfront', 'Luxury'],
  },
  {
    id: '2',
    title: 'Modern Downtown Apartment',
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop',
    pricePerNight: 150,
    location: 'New York City, NY',
    rating: 4.7,
    reviewCount: 85,
    tags: ['City View', 'Central'],
  },
  {
    id: '3',
    title: 'Rustic Mountain Cabin',
    imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=800&auto=format&fit=crop',
    pricePerNight: 180,
    location: 'Aspen, Colorado',
    rating: 4.8,
    reviewCount: 95,
    tags: ['Mountains', 'Skiing'],
  },
];

const Homepage: React.FC = () => {
  const navigate = useNavigate();
  console.log('Homepage loaded');

  const handleSearch = (params: { destination: string; dateRange?: DateRange; guests: number }) => {
    console.log('Search params:', params);
    // Navigate to search results page with query parameters
    const queryParams = new URLSearchParams();
    if (params.destination) queryParams.append('destination', params.destination);
    if (params.dateRange?.from) queryParams.append('from', params.dateRange.from.toISOString());
    if (params.dateRange?.to) queryParams.append('to', params.dateRange.to.toISOString());
    queryParams.append('guests', params.guests.toString());
    navigate(`/search-results?${queryParams.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavigationMenu isAuthenticated={false} />
      <main className="flex-grow">
        {/* Hero Section with Search Bar */}
        <section className="relative bg-gray-800 text-white py-20 md:py-32">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-50"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=1920&auto=format&fit=crop')" }}
          ></div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Find Your Perfect Stay</h1>
            <p className="text-lg md:text-xl mb-8">Book rentals from local hosts in 191+ countries.</p>
            <div className="max-w-3xl mx-auto">
              <InteractiveSearchBar onSearch={handleSearch} className="bg-white shadow-xl rounded-lg" />
            </div>
          </div>
        </section>

        {/* Featured Listings Section */}
        <section className="py-12 px-4 bg-gray-50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Featured Stays</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredListings.map((listing) => (
                <ListingCard key={listing.id} {...listing} />
              ))}
            </div>
            <div className="text-center mt-8">
              <Button size="lg" onClick={() => navigate('/search-results')}>Explore More</Button>
            </div>
          </div>
        </section>

        {/* Call to Action / How it Works Section */}
        <section className="py-16 px-4">
            <div className="container mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4">Book with Confidence</h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                    From cozy cabins to sprawling villas, find a space that’s right for you. Every booking is protected by our community guidelines and secure payment system.
                </p>
                {/* Add more content here, e.g., icons with features */}
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Homepage;