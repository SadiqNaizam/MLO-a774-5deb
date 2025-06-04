import React from 'react';
import NavigationMenu from '@/components/layout/NavigationMenu';
import Footer from '@/components/layout/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Edit3, MapPin, Calendar, Star, UserCircle, CreditCard, Shield, Bell } from 'lucide-react';

// Mock data
const mockUser = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatarUrl: 'https://i.pravatar.cc/150?u=johndoe',
  joinDate: 'Joined January 2022',
};

const mockTrips = [
  { id: 'trip1', listingName: 'Beachfront Condo', location: 'Miami, FL', dates: 'Aug 10 - Aug 15, 2024', status: 'Upcoming', total: 750, imageUrl: 'https://images.unsplash.com/photo-1560185007-c5ca919a012d?q=80&w=400&auto=format&fit=crop' },
  { id: 'trip2', listingName: 'Mountain Cabin', location: 'Aspen, CO', dates: 'Feb 20 - Feb 25, 2024', status: 'Completed', total: 1200, imageUrl: 'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?q=80&w=400&auto=format&fit=crop' },
  { id: 'trip3', listingName: 'City Apartment', location: 'New York, NY', dates: 'Nov 01 - Nov 05, 2023', status: 'Completed', total: 600, imageUrl: 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?q=80&w=400&auto=format&fit=crop' },
];

const mockWishlist = [
    { id: 'wish1', name: 'Luxury Villa Bali', pricePerNight: 300, imageUrl: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=400&auto=format&fit=crop' },
    { id: 'wish2', name: 'Parisian Rooftop Flat', pricePerNight: 180, imageUrl: 'https://images.unsplash.com/photo-1509299349698-dd22020976a3?q=80&w=400&auto=format&fit=crop' },
];


const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  // avatarUrl: z.string().url("Invalid URL for avatar.").optional().or(z.literal('')), // Handled separately
  bio: z.string().max(200, "Bio cannot exceed 200 characters.").optional(),
});
type ProfileFormData = z.infer<typeof profileFormSchema>;

const UserDashboardPage: React.FC = () => {
  console.log('UserDashboardPage loaded');

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: mockUser.name,
      email: mockUser.email,
      bio: 'Travel enthusiast and lover of good food and new experiences.',
    }
  });

  const onProfileSubmit = async (data: ProfileFormData) => {
    console.log('Profile update submitted:', data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Profile updated successfully!');
  };
  
  const [userAvatar, setUserAvatar] = React.useState(mockUser.avatarUrl);
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => setUserAvatar(e.target?.result as string);
        reader.readAsDataURL(event.target.files[0]);
    }
  };


  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavigationMenu isAuthenticated={true} userName={mockUser.name} userAvatarUrl={userAvatar} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Welcome back, {mockUser.name}!</h1>
          <p className="text-muted-foreground">{mockUser.joinDate}</p>
        </header>

        <Tabs defaultValue="trips" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
            <TabsTrigger value="trips">My Trips</TabsTrigger>
            <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
            <TabsTrigger value="profile">Profile Settings</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          {/* My Trips Tab */}
          <TabsContent value="trips">
            <Card>
              <CardHeader>
                <CardTitle>Your Trips</CardTitle>
                <CardDescription>Manage your upcoming and past bookings.</CardDescription>
              </CardHeader>
              <CardContent>
                {mockTrips.length > 0 ? (
                <div className="space-y-6">
                  {mockTrips.map(trip => (
                    <Card key={trip.id} className="flex flex-col md:flex-row overflow-hidden">
                        <img src={trip.imageUrl} alt={trip.listingName} className="w-full md:w-1/3 lg:w-1/4 h-48 md:h-auto object-cover"/>
                        <div className="flex-1 p-4 md:p-6">
                            <h3 className="text-xl font-semibold mb-1">{trip.listingName}</h3>
                            <p className="text-sm text-muted-foreground flex items-center mb-1"><MapPin size={14} className="mr-1.5"/>{trip.location}</p>
                            <p className="text-sm text-muted-foreground flex items-center mb-2"><Calendar size={14} className="mr-1.5"/>{trip.dates}</p>
                            <div className="flex items-center justify-between mb-3">
                                <Badge variant={trip.status === 'Upcoming' ? 'default' : 'secondary'}>{trip.status}</Badge>
                                <p className="font-semibold">${trip.total}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm">View Details</Button>
                                {trip.status === 'Upcoming' && <Button variant="outline" size="sm" >Manage Booking</Button>}
                                {trip.status === 'Completed' && <Button variant="outline" size="sm" ><Star size={14} className="mr-1.5"/>Leave a Review</Button>}
                            </div>
                        </div>
                    </Card>
                  ))}
                </div>
                ) : (
                    <p className="text-muted-foreground text-center py-10">You have no trips booked yet. <Button variant="link" className="p-0 h-auto">Start exploring!</Button></p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist">
            <Card>
              <CardHeader>
                <CardTitle>Your Wishlist</CardTitle>
                <CardDescription>Places you've saved for future trips.</CardDescription>
              </CardHeader>
              <CardContent>
                {mockWishlist.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mockWishlist.map(item => (
                            <Card key={item.id} className="overflow-hidden group">
                                <div className="aspect-video overflow-hidden">
                                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                </div>
                                <CardContent className="p-4">
                                    <h3 className="font-semibold text-lg truncate group-hover:text-primary">{item.name}</h3>
                                    <p className="text-muted-foreground">${item.pricePerNight} / night</p>
                                </CardContent>
                                <CardFooter className="p-4 pt-0">
                                    <Button className="w-full" variant="outline">View Listing</Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                     <p className="text-muted-foreground text-center py-10">Your wishlist is empty. Add some dream destinations!</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Settings Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Update your personal information.</CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit(onProfileSubmit)}>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={userAvatar} alt={mockUser.name} />
                      <AvatarFallback>{mockUser.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <Label htmlFor="avatar-upload" className="cursor-pointer text-primary hover:underline">Change Photo</Label>
                      <Input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange}/>
                      <p className="text-xs text-muted-foreground mt-1">JPG, GIF or PNG. Max size of 800K</p>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Controller name="name" control={control} render={({ field }) => <Input id="name" {...field} />} />
                    {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Controller name="email" control={control} render={({ field }) => <Input id="email" type="email" {...field} />} />
                    {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio (Optional)</Label>
                    <Controller name="bio" control={control} render={({ field }) => <textarea id="bio" {...field} rows={3} className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" placeholder="Tell us a bit about yourself..." />} />
                    {errors.bio && <p className="text-sm text-red-500 mt-1">{errors.bio.message}</p>}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Changes'}</Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          {/* Account Settings Tab */}
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences and security.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                    <h3 className="text-lg font-medium flex items-center"><UserCircle size={20} className="mr-2 text-primary"/>Login & Security</h3>
                    <Button variant="outline">Change Password</Button>
                    <Button variant="outline">Two-Factor Authentication</Button>
                </div>
                <Separator />
                 <div className="space-y-3">
                    <h3 className="text-lg font-medium flex items-center"><CreditCard size={20} className="mr-2 text-primary"/>Payment Methods</h3>
                    <Button variant="outline">Manage Payment Methods</Button>
                </div>
                <Separator />
                 <div className="space-y-3">
                    <h3 className="text-lg font-medium flex items-center"><Bell size={20} className="mr-2 text-primary"/>Notifications</h3>
                    <Button variant="outline">Notification Preferences</Button>
                </div>
                 <Separator />
                 <div className="space-y-3">
                    <h3 className="text-lg font-medium flex items-center"><Shield size={20} className="mr-2 text-primary"/>Privacy & Sharing</h3>
                    <Button variant="outline">Manage Data</Button>
                </div>
                <Separator />
                <div>
                    <Button variant="destructive">Deactivate Account</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default UserDashboardPage;