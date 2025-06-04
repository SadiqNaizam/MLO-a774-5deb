import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavigationMenu from '@/components/layout/NavigationMenu';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AlertCircle, CreditCard, User, CalendarDays, Users } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Dummy data - in a real app, this would come from previous page (e.g., state or query params)
const mockBookingDetails = {
  listingTitle: "Charming Downtown Loft",
  listingImageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800&auto=format&fit=crop",
  checkInDate: "2024-08-15",
  checkOutDate: "2024-08-18",
  guests: 2,
  pricePerNight: 120,
  nights: 3,
  serviceFee: 30,
  totalPrice: 120 * 3 + 30,
};

const bookingFormSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }).optional(),
  paymentMethod: z.string().min(1, { message: "Please select a payment method." }),
  cardNumber: z.string().min(16, {message: "Card number must be 16 digits."}).max(16, {message: "Card number must be 16 digits."}).refine(val => /^\d+$/.test(val), {message: "Card number must be digits only."}),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, {message: "Expiry date must be MM/YY format."}),
  cvc: z.string().min(3, {message: "CVC must be 3-4 digits."}).max(4, {message: "CVC must be 3-4 digits."}).refine(val => /^\d+$/.test(val), {message: "CVC must be digits only."}),
});

type BookingFormData = z.infer<typeof bookingFormSchema>;

const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation(); // To potentially get booking details from state
  console.log('BookingPage loaded');

  // Attempt to get booking details from location state or use mock
  const bookingDetails = location.state?.bookingDetails || mockBookingDetails;

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      paymentMethod: 'creditCard', // Default selection
      cardNumber: '',
      expiryDate: '',
      cvc: ''
    }
  });

  const onSubmit = async (data: BookingFormData) => {
    console.log('Booking form submitted:', data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Booking confirmed (simulated)');
    // Show success message (e.g., toast) and redirect or show confirmation
    alert('Booking confirmed! Thank you.');
    navigate('/dashboard'); // Redirect to dashboard or a confirmation page
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavigationMenu isAuthenticated={true} />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Confirm and Pay</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Booking Summary Card - Left/Top */}
            <div className="md:col-span-1 order-last md:order-first">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>{bookingDetails.listingTitle}</CardTitle>
                  <img src={bookingDetails.listingImageUrl} alt={bookingDetails.listingTitle} className="rounded-lg mt-2 aspect-video object-cover"/>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center"><CalendarDays className="w-4 h-4 mr-2"/> Dates</span>
                    <span>{new Date(bookingDetails.checkInDate).toLocaleDateString()} - {new Date(bookingDetails.checkOutDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center"><Users className="w-4 h-4 mr-2"/> Guests</span>
                    <span>{bookingDetails.guests}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span>${bookingDetails.pricePerNight.toFixed(2)} x {bookingDetails.nights} nights</span>
                    <span>${(bookingDetails.pricePerNight * bookingDetails.nights).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service fee</span>
                    <span>${bookingDetails.serviceFee.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${bookingDetails.totalPrice.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Form Card - Right/Bottom */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Your Information</CardTitle>
                  <CardDescription>Please provide your details to complete the booking.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <CardContent className="space-y-6">
                    {/* Personal Information Section */}
                    <section className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center"><User className="w-5 h-5 mr-2 text-primary"/>Personal Details</h3>
                        <div>
                            <Controller
                                name="fullName"
                                control={control}
                                render={({ field }) => <Input {...field} placeholder="Full Name" />}
                            />
                            {errors.fullName && <p className="text-sm text-red-500 mt-1">{errors.fullName.message}</p>}
                        </div>
                        <div>
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => <Input {...field} type="email" placeholder="Email Address" />}
                            />
                            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
                        </div>
                         <div>
                            <Controller
                                name="phone"
                                control={control}
                                render={({ field }) => <Input {...field} type="tel" placeholder="Phone Number (Optional)" />}
                            />
                            {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>}
                        </div>
                    </section>
                    
                    <Separator />

                    {/* Payment Information Section */}
                    <section className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center"><CreditCard className="w-5 h-5 mr-2 text-primary"/>Payment Details</h3>
                        <div>
                            <Controller
                                name="paymentMethod"
                                control={control}
                                render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                    <SelectValue placeholder="Select Payment Method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                    <SelectItem value="creditCard">Credit/Debit Card</SelectItem>
                                    <SelectItem value="paypal" disabled>PayPal (Coming Soon)</SelectItem>
                                    </SelectContent>
                                </Select>
                                )}
                            />
                            {errors.paymentMethod && <p className="text-sm text-red-500 mt-1">{errors.paymentMethod.message}</p>}
                        </div>
                        <div>
                            <Controller
                                name="cardNumber"
                                control={control}
                                render={({ field }) => <Input {...field} placeholder="Card Number (e.g., 1234567812345678)" />}
                            />
                            {errors.cardNumber && <p className="text-sm text-red-500 mt-1">{errors.cardNumber.message}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Controller
                                name="expiryDate"
                                control={control}
                                render={({ field }) => <Input {...field} placeholder="MM/YY" />}
                                />
                                {errors.expiryDate && <p className="text-sm text-red-500 mt-1">{errors.expiryDate.message}</p>}
                            </div>
                            <div>
                                <Controller
                                name="cvc"
                                control={control}
                                render={({ field }) => <Input {...field} placeholder="CVC" />}
                                />
                                {errors.cvc && <p className="text-sm text-red-500 mt-1">{errors.cvc.message}</p>}
                            </div>
                        </div>
                    </section>
                    
                    {Object.keys(errors).length > 0 && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                                Please correct the errors in the form before submitting.
                            </AlertDescription>
                        </Alert>
                    )}

                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? 'Processing...' : 'Confirm & Pay'}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingPage;