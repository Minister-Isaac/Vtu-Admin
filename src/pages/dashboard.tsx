import { useQuery } from "@tanstack/react-query";
import FinancialOverview from "@/components/dashboard/financial-overview";
import Charts from "@/components/dashboard/charts";
import RecentActivity from "@/components/dashboard/recent-activity";
import QuickActions from "@/components/dashboard/quick-actions";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Dashboard() {
  const { toast } = useToast();

  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    retry: false,
  });

  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ["/api/dashboard/revenue"],
    retry: false,
  });

  const { data: topUsers, isLoading: topUsersLoading } = useQuery({
    queryKey: ["/api/dashboard/top-users"],
    retry: false,
  });

  const { data: recentTransactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ["/api/transactions", "limit=10"],
    retry: false,
  });

  // Handle unauthorized errors
  useEffect(() => {
    if (statsError && isUnauthorizedError(statsError as Error)) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [statsError, toast]);

  if (statsLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-6 h-32" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-lg p-6 h-80" />
            <div className="bg-card border border-border rounded-lg p-6 h-80" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6" data-testid="dashboard-content">
      <div>
        <h1 className="text-2xl font-bold text-foreground" data-testid="text-dashboard-title">Dashboard</h1>
        <p className="text-sm text-muted-foreground" data-testid="text-welcome-message">Welcome back, Super Admin</p>
      </div>

      <FinancialOverview 
        stats={stats} 
        isLoading={statsLoading}
      />

      <Charts 
        revenueData={revenueData} 
        isLoading={revenueLoading}
        serviceBreakdown={stats?.serviceBreakdown || []}
      />

      <RecentActivity 
        transactions={recentTransactions?.transactions || []}
        topUsers={topUsers || []}
        isLoading={transactionsLoading || topUsersLoading}
      />

      <QuickActions />
    </div>
  );
}
