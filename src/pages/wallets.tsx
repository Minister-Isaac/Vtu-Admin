import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import FundWalletModal from "@/components/modals/fund-wallet-modal";
import { formatCurrency } from "@/lib/utils";

export default function Wallets() {
  const [showFundModal, setShowFundModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/users"],
    retry: false,
  });

  const { data: fundings, isLoading: fundingsLoading } = useQuery({
    queryKey: ["/api/wallets/fundings"],
    retry: false,
  });

  const handleFundWallet = (userId: string) => {
    setSelectedUserId(userId);
    setShowFundModal(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground" data-testid="text-wallets-title">Wallet Management</h1>
          <p className="text-sm text-muted-foreground">
            Monitor and manage user wallet balances and funding history
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              User Wallets
              <Button 
                size="sm"
                onClick={() => setShowFundModal(true)}
                data-testid="button-fund-wallet"
              >
                <i className="fas fa-plus mr-2"></i>
                Fund Wallet
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="w-32 h-4 bg-gray-200 rounded"></div>
                        <div className="w-24 h-3 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    <div className="w-20 h-6 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {users?.users?.map((user: any) => (
                  <div 
                    key={user.id} 
                    className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent/50"
                    data-testid={`wallet-user-${user.id}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {user.firstName?.charAt(0) || user.email?.charAt(0) || '?'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <Badge variant={user.role === 'reseller' ? 'secondary' : user.role === 'api' ? 'outline' : 'default'}>
                          {user.role}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground" data-testid={`text-balance-${user.id}`}>
                        ₦{parseFloat(user.walletBalance || '0').toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleFundWallet(user.id)}
                        data-testid={`button-fund-${user.id}`}
                      >
                        Fund
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Funding History</CardTitle>
          </CardHeader>
          <CardContent>
            {fundingsLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-2">
                      <div className="w-32 h-4 bg-gray-200 rounded"></div>
                      <div className="w-24 h-3 bg-gray-200 rounded"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="w-16 h-4 bg-gray-200 rounded"></div>
                      <div className="w-12 h-3 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {fundings?.slice(0, 10).map((funding: any) => (
                  <div 
                    key={funding.id} 
                    className="flex items-center justify-between p-3 border border-border rounded-lg"
                    data-testid={`funding-${funding.id}`}
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {funding.paymentMethod === 'manual' ? 'Manual Funding' : funding.paymentMethod}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(funding.createdAt).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Ref: {funding.reference}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600" data-testid={`text-funding-amount-${funding.id}`}>
                        +₦{parseFloat(funding.amount).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                      </p>
                      <Badge 
                        variant={funding.status === 'success' ? 'default' : funding.status === 'pending' ? 'secondary' : 'destructive'}
                      >
                        {funding.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                {(!fundings || fundings.length === 0) && (
                  <p className="text-center text-muted-foreground py-8">
                    No funding history available
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <FundWalletModal
        open={showFundModal}
        onClose={() => {
          setShowFundModal(false);
          setSelectedUserId(null);
        }}
        userId={selectedUserId}
      />
    </div>
  );
}
