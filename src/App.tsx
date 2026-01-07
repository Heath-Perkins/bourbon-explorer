import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CompareBar } from "@/components/CompareBar";
import Index from "./pages/Index";
import Catalog from "./pages/Catalog";
import BourbonDetail from "./pages/BourbonDetail";
import Diary from "./pages/Diary";
import NewReview from "./pages/NewReview";
import Wishlist from "./pages/Wishlist";
import Compare from "./pages/Compare";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/bourbon/:id" element={<BourbonDetail />} />
          <Route path="/diary" element={<Diary />} />
          <Route path="/diary/new" element={<NewReview />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <CompareBar />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
