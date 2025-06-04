import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import generated pages
import Homepage from "./pages/Homepage";
import SearchResultsPage from "./pages/SearchResultsPage";
import ListingDetailPage from "./pages/ListingDetailPage";
import BookingPage from "./pages/BookingPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import NotFound from "./pages/NotFound"; // Assuming NotFound.tsx exists

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/search-results" element={<SearchResultsPage />} />
          <Route path="/listing/:id" element={<ListingDetailPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/dashboard" element={<UserDashboardPage />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} /> {/* Always Include This Line As It Is. */}
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;