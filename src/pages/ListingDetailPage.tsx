import React from 'react';
import { useParams } from 'react-router-dom';
import NavigationMenu from '@/components/layout/NavigationMenu';
import ResponsiveImageGallery from '@/components/ResponsiveImageGallery';
import StarRatingInput from '@/components/StarRatingInput';
import BookingWidget from '@/components/BookingWidget';
import Footer from '@/components/layout/Footer';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, User, ShieldCheck, Utensils, Wifi, Car, CalendarDays } from 'lucide-react'; // Example icons
import { DateRange } from 'react-day-picker';

// Mock data for a single listing - in a real app, this would be fetched
const mockListing = {
  id: '1',
  title: 'Spectacular Oceanfront Villa with Private Pool',
  location: 'Maui, Hawaii',
  host: {
    name: 'Alice Wonderland',
    avatarUrl: 'https://i.pravatar.cc/150?u=alicehost',
    joinDate: 'Joined in March 2018',
    isSuperhost: true,
  },
  images: [
    { id: 'img1', src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop', alt: 'Villa exterior' },
    { id: 'img2', src: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1000&auto=format&fit=crop', alt: 'Living room' },
    { id: 'img3', src: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=1000&auto=format&fit=crop', alt: 'Bedroom' },
    { id: 'img4', src: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=1000&auto=format&fit=crop', alt: 'Pool area' },
    { id: 'img5', src: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=1000&auto=format&fit=crop', alt: 'Kitchen' },
  ],
  description: "Experience luxury at its finest in this stunning oceanfront villa. Enjoy breathtaking views, a private infinity pool, and direct beach access. Perfect for families or romantic getaways. The villa features 4 bedrooms, 3 bathrooms, a fully equipped gourmet kitchen, and spacious living areas.",
  amenities: [
    { icon: <Wifi size={20} />, name: 'Fast WiFi' },
    { icon: <Utensils size={20} />, name: 'Fully equipped kitchen' },
    { icon: <Car size={20} />, name: 'Free parking on premises' },
    { icon: <Home size={20} />, name: 'Private pool' },
    { icon: <ShieldCheck size={20} />, name: 'Self check-in' },
  ],
  houseRules: [
    'No smoking', 'No pets allowed', 'No parties or events', 'Check-in time is 3 PM - 9 PM', 'Check out by 11 AM'
  ],
  reviews: [
    { id: 'r1', userName: 'John D.', rating: 5, comment: 'Absolutely amazing place! The views are incredible and Alice was a fantastic host.', date: 'October 2023' },
    { id: 'r2', userName: 'Sarah K.', rating: 4, comment: 'Beautiful villa, very clean and well-equipped. Pool was a highlight. A bit pricey but worth it for a special occasion.', date: 'September 2023' },
  ],
  overallRating: 4.9,
  reviewCount: 78,
  pricePerNight: 450,
  maxGuests: 8,
  minNights: 3,
  unavailableDates: [new Date(2024, 6, 20), new Date(2024, 6, 21)] // July 20, 21, 2024 (month is 0-indexed)
};


const ListingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get listing ID from URL
  console.log(`ListingDetailPage loaded for ID: ${id}. Displaying mock data.`);
  // In a real app, fetch listing data based on ID:
  // const [listing, setListing] = useState<typeof mockListing | null>(null);
  // useEffect(() => { fetchListing(id).then(setListing); }, [id]);
  // if (!listing) return <div>Loading...</div>;
  const listing = mockListing; // Using mock data for this example

  const handleBooking = (details: { dateRange: DateRange; guests: number; totalPrice: number; totalNights: number }) => {
    console.log('Booking initiated:', details);
    // Navigate to booking page or show confirmation
    alert(`Booking for ${details.totalNights} nights, ${details.guests} guests. Total: $${details.totalPrice.toFixed(2)}`);
  };
  
  const handleRatingChange = (newRating: number) => {
      console.log("User submitted rating (mock):", newRating);
      // Here you would typically send this to a backend
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavigationMenu isAuthenticated={true} userName="Guest" /> {/* Example: user is logged in */}
      
      <header className="bg-muted/30 py-4 border-b">
          <div className="container mx-auto px-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/search-results">Search Results</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="truncate max-w-xs">{listing.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Title and Meta */}
        <section className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{listing.title}</h1>
          <div className="flex items-center space-x-4 text-muted-foreground">
            <div className="flex items-center">
              <StarRatingInput initialRating={listing.overallRating} readOnly size="sm" />
              <span className="ml-2">{listing.overallRating.toFixed(1)} ({listing.reviewCount} reviews)</span>
            </div>
            <span>·</span>
            <span>{listing.location}</span>
            {listing.host.isSuperhost && <Badge variant="default">Superhost</Badge>}
          </div>
        </section>

        {/* Image Gallery */}
        <section className="mb-8">
          <ResponsiveImageGallery images={listing.images} mainImageRatio={16/10} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content Area (Description, Amenities, Reviews) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Host Info */}
            <section>
                 <Card className="border-none shadow-none">
                    <CardHeader className="flex flex-row items-center justify-between p-0 pb-4">
                        <div>
                            <h2 className="text-2xl font-semibold">Hosted by {listing.host.name}</h2>
                            <p className="text-sm text-muted-foreground">{listing.host.joinDate} · {listing.maxGuests} guests</p>
                        </div>
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={listing.host.avatarUrl} alt={listing.host.name} />
                            <AvatarFallback>{listing.host.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </CardHeader>
                </Card>
                <hr/>
            </section>

            {/* Description */}
            <section>
              <h2 className="text-2xl font-semibold mb-3">About this place</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{listing.description}</p>
            </section>
            <hr/>
            {/* Amenities */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">What this place offers</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                {listing.amenities.map(amenity => (
                  <div key={amenity.name} className="flex items-center space-x-3">
                    {React.cloneElement(amenity.icon, {className: "text-muted-foreground"})}
                    <span>{amenity.name}</span>
                  </div>
                ))}
              </div>
            </section>
             <hr/>
            {/* Accordion for Rules and Reviews */}
            <Accordion type="multiple" defaultValue={['reviews']} className="w-full">
              <AccordionItem value="rules">
                <AccordionTrigger className="text-xl font-semibold">House Rules</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    {listing.houseRules.map(rule => <li key={rule}>{rule}</li>)}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="reviews">
                <AccordionTrigger className="text-xl font-semibold">Guest Reviews ({listing.reviewCount})</AccordionTrigger>
                <AccordionContent className="space-y-6">
                  {listing.reviews.map(review => (
                    <Card key={review.id} className="bg-muted/30">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Avatar className="h-10 w-10">
                                    {/* In real app, avatar would be dynamic */}
                                    <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle className="text-base">{review.userName}</CardTitle>
                                    <p className="text-xs text-muted-foreground">{review.date}</p>
                                </div>
                            </div>
                            <StarRatingInput initialRating={review.rating} readOnly size="sm" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700">{review.comment}</p>
                      </CardContent>
                    </Card>
                  ))}
                  {/* Placeholder for leaving a review */}
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="text-lg font-semibold mb-2">Leave a review</h3>
                    <StarRatingInput maxStars={5} onRatingChange={handleRatingChange} size="md"/>
                    {/* Add a textarea and submit button here */}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Booking Widget Area (Sticky on large screens) */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6"> {/* Adjust top offset based on nav height */}
              <BookingWidget
                pricePerNight={listing.pricePerNight}
                minNights={listing.minNights}
                maxGuests={listing.maxGuests}
                unavailableDates={listing.unavailableDates.map(d => new Date(d))}
                onBook={handleBooking}
              />
               <Card className="text-center">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Have questions about booking?</p>
                  <Button variant="outline" className="mt-2">Contact Host</Button>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ListingDetailPage;