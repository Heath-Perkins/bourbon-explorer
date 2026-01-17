import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { CompareBar } from "@/components/CompareBar";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Catalog from "./pages/Catalog";
import BourbonDetail from "./pages/BourbonDetail";
import Diary from "./pages/Diary";
import NewReview from "./pages/NewReview";
import Wishlist from "./pages/Wishlist";
import Collection from "./pages/Collection";
import Compare from "./pages/Compare";
import ValueCalculator from "./pages/ValueCalculator";
import Recommendations from "./pages/Recommendations";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-center" />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/bourbon/:id" element={<BourbonDetail />} />
            <Route path="/value" element={<ValueCalculator />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/compare" element={<Compare />} />
            
            {/* Protected Routes */}
            <Route path="/diary" element={
              <ProtectedRoute><Diary /></ProtectedRoute>
            } />
            <Route path="/diary/new" element={
              <ProtectedRoute><NewReview /></ProtectedRoute>
            } />
            <Route path="/wishlist" element={
              <ProtectedRoute><Wishlist /></ProtectedRoute>
            } />
            <Route path="/collection" element={
              <ProtectedRoute><Collection /></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><Profile /></ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          <CompareBar />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
