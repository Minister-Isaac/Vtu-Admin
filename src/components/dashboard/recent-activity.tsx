import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

interface RecentActivityProps {
  transactions: any[];
  topUsers: any[];
  isLoading: boolean;
}

export default function RecentActivity({ transactions, topUsers, isLoading }: RecentActivityProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="w-32 h-4 bg-gray-200 rounded"></div>
                        <div className="w-24 h-3 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    <div className="w-20 h-6 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Spenders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="w-24 h-4 bg-gray-200 rounded"></div>
                        <div className="w-16 h-3 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    <div className="w-16 h-4 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      success: "default",
      pending: "secondary", 
      failed: "destructive",
    };
    return variants[status as keyof typeof variants] || "secondary";
  };

  const getUserInitials = (user: any) => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return '??';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Transactions</CardTitle>
              <Link href="/transactions">
                <Button variant="outline" size="sm" data-testid="button-view-all-transactions">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">User</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Service</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {transactions.slice(0, 5).map((transaction, index) => (
                    <tr key={transaction.id || index} className="hover:bg-muted/50" data-testid={`transaction-row-${transaction.id}`}>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-blue-600">
                              {getUserInitials(transaction.user)}
                            </span>
                          </div>
                          <span className="text-sm text-foreground">
                            {transaction.user?.firstName} {transaction.user?.lastName} || transaction.user?.email || 'Unknown User'
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-foreground">
                        {transaction.service?.name || transaction.type || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-foreground">
                        ₦{parseFloat(transaction.amount || '0').toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={getStatusBadge(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {new Date(transaction.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {transactions.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No recent transactions
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Spenders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topUsers.slice(0, 5).map((user, index) => (
                <div key={user.id} className="flex items-center justify-between" data-testid={`top-user-${user.id}`}>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-blue-600">
                        {getUserInitials(user)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">{user.role}</p>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    ₦{parseFloat(user.totalSpent || '0').toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              ))}
              {topUsers.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No user data available
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <i className="fas fa-exclamation-triangle text-yellow-600 mt-0.5"></i>
                <div>
                  <p className="text-sm font-medium text-yellow-800">API Response Monitoring</p>
                  <p className="text-xs text-yellow-600">Check API response times</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <i className="fas fa-check-circle text-green-600 mt-0.5"></i>
                <div>
                  <p className="text-sm font-medium text-green-800">All Systems Operational</p>
                  <p className="text-xs text-green-600">99.8% uptime</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
