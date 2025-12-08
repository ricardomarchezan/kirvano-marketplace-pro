import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { FinancialSummary } from "@/components/dashboard/FinancialSummary";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { Achievements } from "@/components/dashboard/Achievements";
import { FeaturedSaas } from "@/components/dashboard/FeaturedSaas";

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <FinancialSummary />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart />
          <Achievements />
        </div>
        
        <FeaturedSaas />
      </div>
    </DashboardLayout>
  );
};

export default Index;
