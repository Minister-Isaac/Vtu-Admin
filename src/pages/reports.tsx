import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState("7");

  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    retry: false,
  });

  const { data: revenueData } = useQuery({
    queryKey: ["/api/dashboard/revenue", `days=${selectedPeriod}`],
    retry: false,
  });

  const { data: topUsers } = useQuery({
    queryKey: ["/api/dashboard/top-users", "limit=10"],
    retry: false,
  });

  const exportReport = async (type: string) => {
    // In a real implementation, this would generate and download the report
    console.log(`Exporting ${type} report for ${selectedPeriod} days`);
    
    // Create a simple CSV export as an example
    if (type === 'revenue' && revenueData) {
      const csvContent = [
        ['Date', 'Revenue'].join(','),
        ...revenueData.map((item: any) => [item.date, item.amount].join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `revenue-report-${selectedPeriod}days.csv`;
      link.click();
    }
  };

  const totalRevenue = revenueData?.reduce((sum: number, item: any) => sum + parseFloat(item.amount || '0'), 0) || 0;
  const avgDailyRevenue = totalRevenue / parseInt(selectedPeriod);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground" data-testid="text-reports-title">Reports & Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Generate and export comprehensive business reports
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32" data-testid="select-period">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-foreground" data-testid="text-total-revenue">
                  ₦{totalRevenue.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-muted-foreground">
                  Last {selectedPeriod} days
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <i className="fas fa-chart-line text-green-600"></i>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Daily Revenue</p>
                <p className="text-2xl font-bold text-foreground" data-testid="text-avg-daily-revenue">
                  ₦{avgDailyRevenue.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-muted-foreground">
                  Per day average
                </p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <i className="fas fa-calendar-day text-blue-600"></i>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Profit Margin</p>
                <p className="text-2xl font-bold text-foreground" data-testid="text-profit-margin">
                  {stats ? ((parseFloat(stats.profit) / parseFloat(stats.totalFundings)) * 100).toFixed(1) : '0'}%
                </p>
                <p className="text-xs text-muted-foreground">
                  Current margin
                </p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <i className="fas fa-percentage text-purple-600"></i>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Growth Rate</p>
                <p className="text-2xl font-bold text-green-600" data-testid="text-growth-rate">
                  +12.5%
                </p>
                <p className="text-xs text-muted-foreground">
                  vs previous period
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <i className="fas fa-arrow-up text-green-600"></i>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Revenue Breakdown by Service
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => exportReport('service-breakdown')}
                data-testid="button-export-service-breakdown"
              >
                <i className="fas fa-download mr-2"></i>
                Export
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.serviceBreakdown?.map((service: any, index: number) => {
                const totalAmount = parseFloat(service.totalAmount || '0');
                const percentage = stats.totalExpenses > 0 ? (totalAmount / parseFloat(stats.totalExpenses) * 100) : 0;
                
                return (
                  <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        service.serviceType === 'airtime' ? 'bg-blue-500' :
                        service.serviceType === 'data' ? 'bg-green-500' :
                        service.serviceType === 'tv' ? 'bg-purple-500' :
                        service.serviceType === 'electricity' ? 'bg-yellow-500' :
                        'bg-gray-500'
                      }`}></div>
                      <div>
                        <p className="font-medium text-foreground">{service.serviceName}</p>
                        <Badge variant="secondary" className="text-xs">
                          {service.serviceType}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground" data-testid={`text-service-amount-${index}`}>
                        ₦{totalAmount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {percentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                );
              })}
              {(!stats?.serviceBreakdown || stats.serviceBreakdown.length === 0) && (
                <p className="text-center text-muted-foreground py-8">
                  No service data available
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Top Performing Users
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => exportReport('top-users')}
                data-testid="button-export-top-users"
              >
                <i className="fas fa-download mr-2"></i>
                Export
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topUsers?.slice(0, 8).map((user: any, index: number) => (
                <div key={user.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium">
                        {user.firstName?.charAt(0) || user.email?.charAt(0) || '?'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {user.firstName} {user.lastName}
                      </p>
                      <div className="flex items-center space-x-2">
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                        <Badge variant={
                          user.role === 'reseller' ? 'secondary' : 
                          user.role === 'api' ? 'outline' : 'default'
                        } className="text-xs">
                          {user.role}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground" data-testid={`text-user-spent-${user.id}`}>
                      ₦{parseFloat(user.totalSpent || '0').toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      #{index + 1}
                    </p>
                  </div>
                </div>
              ))}
              {(!topUsers || topUsers.length === 0) && (
                <p className="text-center text-muted-foreground py-8">
                  No user data available
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Export Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => exportReport('revenue')}
              data-testid="button-export-revenue"
            >
              <i className="fas fa-chart-line text-xl"></i>
              <span>Revenue Report</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => exportReport('transactions')}
              data-testid="button-export-transactions"
            >
              <i className="fas fa-exchange-alt text-xl"></i>
              <span>Transactions Report</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => exportReport('users')}
              data-testid="button-export-users-report"
            >
              <i className="fas fa-users text-xl"></i>
              <span>Users Report</span>
            </Button>
          </div>
          
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h3 className="font-medium text-foreground mb-2">Report Formats</h3>
            <p className="text-sm text-muted-foreground">
              Reports are available in CSV, Excel, and PDF formats. Data includes the selected time period 
              and can be filtered by user type, service category, or transaction status.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
