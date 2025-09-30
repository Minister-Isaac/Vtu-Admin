import { Card, CardContent } from "@/components/ui/card";

interface FinancialOverviewProps {
  stats: any;
  isLoading: boolean;
}

export default function FinancialOverview({ stats, isLoading }: FinancialOverviewProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="w-32 h-4 bg-gray-200 rounded mb-2"></div>
                <div className="w-24 h-8 bg-gray-200 rounded mb-1"></div>
                <div className="w-20 h-3 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalFundings = parseFloat(stats?.totalFundings || '0');
  const totalExpenses = parseFloat(stats?.totalExpenses || '0');
  const profit = parseFloat(stats?.profit || '0');
  const activeUsers = stats?.activeUsers || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Fundings</p>
              <p className="text-2xl font-bold text-foreground" data-testid="text-total-fundings">
                ₦{totalFundings.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-green-600 mt-1">
                <i className="fas fa-arrow-up"></i> +12.5% from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-plus-circle text-green-600 text-xl"></i>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
              <p className="text-2xl font-bold text-foreground" data-testid="text-total-expenses">
                ₦{totalExpenses.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-red-600 mt-1">
                <i className="fas fa-arrow-up"></i> +8.2% from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-minus-circle text-red-600 text-xl"></i>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Profit</p>
              <p className="text-2xl font-bold text-green-600" data-testid="text-total-profit">
                ₦{profit.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-green-600 mt-1">
                <i className="fas fa-arrow-up"></i> +22.8% from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-chart-line text-green-600 text-xl"></i>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Users</p>
              <p className="text-2xl font-bold text-foreground" data-testid="text-active-users">
                {activeUsers.toLocaleString()}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                <i className="fas fa-arrow-up"></i> +45 new this week
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-users text-blue-600 text-xl"></i>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
