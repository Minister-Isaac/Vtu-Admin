import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ChartsProps {
  revenueData: any[];
  isLoading: boolean;
  serviceBreakdown: any[];
}

export default function Charts({ revenueData, isLoading, serviceBreakdown }: ChartsProps) {
  const serviceTypeColors = {
    airtime: 'bg-blue-500',
    data: 'bg-green-500',
    tv: 'bg-purple-500',
    electricity: 'bg-yellow-500',
    other: 'bg-gray-500',
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 animate-pulse bg-gray-200 rounded-lg"></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Service Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                    <div className="w-20 h-4 bg-gray-200 rounded"></div>
                  </div>
                  <div className="w-16 h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Revenue Trends</CardTitle>
            <Select defaultValue="7">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
            <div className="text-center">
              <i className="fas fa-chart-area text-4xl mb-2 opacity-50"></i>
              <p className="font-semibold">Revenue Chart</p>
              <p className="text-sm opacity-75">Chart visualization would be implemented here</p>
              {revenueData && revenueData.length > 0 && (
                <p className="text-xs mt-2">
                  Data points: {revenueData.length}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Service Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {serviceBreakdown.map((service, index) => {
              const amount = parseFloat(service.totalAmount || '0');
              const total = serviceBreakdown.reduce((sum, s) => sum + parseFloat(s.totalAmount || '0'), 0);
              const percentage = total > 0 ? (amount / total * 100) : 0;
              
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className={`w-3 h-3 rounded-full ${serviceTypeColors[service.serviceType as keyof typeof serviceTypeColors] || 'bg-gray-500'}`}
                    ></div>
                    <span className="text-sm text-foreground">{service.serviceName}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground" data-testid={`text-service-amount-${index}`}>
                      ₦{amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</p>
                  </div>
                </div>
              );
            })}
            {serviceBreakdown.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No service data available
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
