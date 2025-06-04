import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Users, MinusCircle, PlusCircle, AlertCircle } from 'lucide-react';
import { format, differenceInCalendarDays, addDays } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

interface BookingWidgetProps {
  pricePerNight: number;
  minNights?: number;
  maxGuests?: number;
  unavailableDates?: Date[]; // Array of disabled dates
  onBook: (details: { dateRange: DateRange; guests: number; totalPrice: number; totalNights: number }) => void;
  initialDateRange?: DateRange;
  initialGuests?: number;
}

const BookingWidget: React.FC<BookingWidgetProps> = ({
  pricePerNight,
  minNights = 1,
  maxGuests = 4,
  unavailableDates = [],
  onBook,
  initialDateRange,
  initialGuests = 1,
}) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(initialDateRange || { from: new Date(), to: addDays(new Date(), minNights) });
  const [guests, setGuests] = useState(Math.max(1, Math.min(initialGuests, maxGuests)));
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalNights, setTotalNights] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  console.log("Rendering BookingWidget with state:", { dateRange, guests, pricePerNight });

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      const nights = differenceInCalendarDays(dateRange.to, dateRange.from);
      if (nights < minNights) {
        setErrorMessage(`Minimum stay is ${minNights} nights.`);
        setTotalNights(0);
        setTotalPrice(0);
        return;
      }
      setErrorMessage(null);
      setTotalNights(nights);
      setTotalPrice(nights * pricePerNight);
    } else {
      setTotalNights(0);
      setTotalPrice(0);
      setErrorMessage(null);
    }
  }, [dateRange, pricePerNight, minNights]);

  const handleBooking = () => {
    if (!dateRange?.from || !dateRange?.to || totalNights < minNights) {
      setErrorMessage("Please select valid dates and meet the minimum night stay.");
      return;
    }
    console.log("Booking initiated:", { dateRange, guests, totalPrice, totalNights });
    onBook({ dateRange, guests, totalPrice, totalNights });
  };

  const handleGuestChange = (amount: number) => {
    setGuests(prev => Math.max(1, Math.min(prev + amount, maxGuests)));
  };
  
  const disabledCalendarDays = [
    ...unavailableDates,
    { before: new Date() } // Disable past dates
  ];

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">
          <span className="font-bold">${pricePerNight.toFixed(2)}</span> / night
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Date Picker */}
        <div>
          <Label className="text-xs font-semibold uppercase">Dates</Label>
          <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal mt-1",
                  !dateRange && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "MMM dd, yyyy")} - {format(dateRange.to, "MMM dd, yyyy")}
                    </>
                  ) : (
                    format(dateRange.from, "MMM dd, yyyy")
                  )
                ) : (
                  <span>Check in - Check out</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={(newRange) => {
                    setDateRange(newRange);
                    if (newRange?.from && newRange?.to) setIsDatePickerOpen(false);
                }}
                numberOfMonths={1}
                disabled={disabledCalendarDays}
                fromDate={new Date()} // Ensure users can't select past dates as start
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Guests */}
        <div>
          <Label htmlFor="guests" className="text-xs font-semibold uppercase">Guests</Label>
          <div className="flex items-center justify-between border rounded-md p-2 mt-1">
            <Button variant="ghost" size="icon" onClick={() => handleGuestChange(-1)} disabled={guests <= 1}>
              <MinusCircle className="h-5 w-5" />
            </Button>
            <span className="font-medium">{guests} guest{guests > 1 ? 's' : ''}</span>
            <Button variant="ghost" size="icon" onClick={() => handleGuestChange(1)} disabled={guests >= maxGuests}>
              <PlusCircle className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {errorMessage && (
          <div className="text-sm text-red-600 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1"/> {errorMessage}
          </div>
        )}

        {/* Price Breakdown (optional, if dates selected) */}
        {dateRange?.from && dateRange?.to && totalNights >= minNights && (
            <div className="space-y-1 pt-2">
                <Separator className="my-2"/>
                <div className="flex justify-between text-sm">
                    <span>${pricePerNight.toFixed(2)} x {totalNights} night{totalNights > 1 ? 's' : ''}</span>
                    <span>${(pricePerNight * totalNights).toFixed(2)}</span>
                </div>
                {/* Add other fees here if applicable, e.g., service fee, cleaning fee */}
                <Separator className="my-2"/>
                <div className="flex justify-between font-semibold text-base">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                </div>
            </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
            className="w-full" 
            onClick={handleBooking} 
            disabled={!dateRange?.from || !dateRange?.to || totalNights < minNights || !!errorMessage}
        >
          Reserve
        </Button>
      </CardFooter>
    </Card>
  );
};
export default BookingWidget;