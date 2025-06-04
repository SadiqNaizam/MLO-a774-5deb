import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogIn, Menu, Search, UserCircle2 } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'; // For mobile menu

interface NavigationMenuProps {
  isAuthenticated?: boolean; // Example prop
  userName?: string;
  userAvatarUrl?: string;
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({
  isAuthenticated = false,
  userName = 'Guest',
  userAvatarUrl,
}) => {
  console.log("Rendering NavigationMenu, isAuthenticated:", isAuthenticated);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/search-results', label: 'Listings' }, // Example search results page
    // Add more links as needed
  ];

  return (
    <nav className="bg-background border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and Desktop Nav Links */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 font-bold text-xl text-primary">
              YourLogo
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop User Actions & Search */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/search-results"> {/* Assuming a general search icon link */}
              <Button variant="ghost" size="icon" aria-label="Search">
                <Search className="h-5 w-5" />
              </Button>
            </Link>
            {isAuthenticated ? (
              <Link to="/dashboard"> {/* Link to user dashboard */}
                <Avatar className="h-8 w-8">
                  <AvatarImage src={userAvatarUrl} alt={userName} />
                  <AvatarFallback>{userName?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
              </Link>
            ) : (
              <Link to="/login"> {/* Link to login page */}
                <Button variant="outline">
                  <LogIn className="mr-2 h-4 w-4" /> Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="py-4">
                  <Link to="/" className="font-bold text-lg text-primary mb-4 block" onClick={() => setIsMobileMenuOpen(false)}>
                    YourLogo
                  </Link>
                  <nav className="flex flex-col space-y-2">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        to={link.href}
                        className="text-base text-muted-foreground hover:text-foreground py-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                     <hr className="my-2"/>
                    {isAuthenticated ? (
                        <Link to="/dashboard" className="flex items-center py-2 text-base" onClick={() => setIsMobileMenuOpen(false)}>
                            <Avatar className="h-8 w-8 mr-2">
                                <AvatarImage src={userAvatarUrl} alt={userName} />
                                <AvatarFallback>{userName?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                            </Avatar>
                            My Dashboard
                        </Link>
                    ) : (
                        <Link to="/login" className="py-2 text-base" onClick={() => setIsMobileMenuOpen(false)}>
                            <Button variant="outline" className="w-full">
                                <LogIn className="mr-2 h-4 w-4" /> Login
                            </Button>
                        </Link>
                    )}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default NavigationMenu;