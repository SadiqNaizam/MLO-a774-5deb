import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Users, Search, MapPin } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';

interface InteractiveSearchBarProps {
  onSearch: (params: { destination: string; dateRange?: DateRange; guests: number }) => void;
  className?: string;
}

const InteractiveSearchBar: React.FC<InteractiveSearchBarProps> = ({ onSearch, className }) => {
  const [destination, setDestination] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });
  const [guests, setGuests] = useState(1);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  console.log("Rendering InteractiveSearchBar with state:", { destination, dateRange, guests });

  const handleSearch = () => {
    console.log("Search initiated with params:", { destination, dateRange, guests });
    onSearch({ destination, dateRange, guests });
  };

  return (
    <div className={cn("p-4 bg-card shadow-md rounded-lg flex flex-col md:flex-row items-center gap-2 md:gap-4", className)}>
      {/* Destination Input */}
      <div className="relative w-full md:flex-1">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Where are you going?"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Date Range Picker */}
      <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full md:w-auto justify-start text-left font-normal",
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={2}
            onDayClick={() => {
                // Close popover if both dates are selected
                if (dateRange?.from && dateRange?.to) setIsDatePickerOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>

      {/* Guests Input */}
      <div className="relative w-full md:w-auto">
        <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="number"
          placeholder="Guests"
          min={1}
          value={guests}
          onChange={(e) => setGuests(Math.max(1, parseInt(e.target.value, 10)))}
          className="pl-10 w-full md:w-32"
        />
      </div>

      {/* Search Button */}
      <Button onClick={handleSearch} className="w-full md:w-auto">
        <Search className="mr-2 h-4 w-4" /> Search
      </Button>
    </div>
  );
};
export default InteractiveSearchBar;