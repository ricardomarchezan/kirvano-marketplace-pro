import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Marketplace from "./pages/Marketplace";
import SaasProducts from "./pages/SaasProducts";
import Finances from "./pages/Finances";
import Integrations from "./pages/Integrations";
import Sales from "./pages/Sales";
import Help from "./pages/Help";
import Referral from "./pages/Referral";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/vendas" element={<Sales />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/saas" element={<SaasProducts />} />
          <Route path="/financas" element={<Finances />} />
          <Route path="/integracoes" element={<Integrations />} />
          <Route path="/ajuda" element={<Help />} />
          <Route path="/indicacao" element={<Referral />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
