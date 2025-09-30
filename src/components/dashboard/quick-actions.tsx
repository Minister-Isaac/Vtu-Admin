import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AddUserModal from "@/components/modals/add-user-modal";
import FundWalletModal from "@/components/modals/fund-wallet-modal";
import PricingModal from "@/components/modals/pricing-modal";

export default function QuickActions() {
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showFundWalletModal, setShowFundWalletModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);

  const handleExportReports = () => {
    
    console.log("Exporting reports...");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="flex flex-col items-center p-4 h-auto border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
            onClick={() => setShowAddUserModal(true)}
            data-testid="button-quick-add-user"
          >
            <i className="fas fa-user-plus text-2xl text-primary mb-2"></i>
            <span className="text-sm font-medium">Add User</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col items-center p-4 h-auto border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
            onClick={() => setShowFundWalletModal(true)}
            data-testid="button-quick-fund-wallet"
          >
            <i className="fas fa-plus-circle text-2xl text-green-600 mb-2"></i>
            <span className="text-sm font-medium">Fund Wallet</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col items-center p-4 h-auto border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
            onClick={() => setShowPricingModal(true)}
            data-testid="button-quick-update-pricing"
          >
            <i className="fas fa-tags text-2xl text-purple-600 mb-2"></i>
            <span className="text-sm font-medium">Update Pricing</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col items-center p-4 h-auto border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
            onClick={handleExportReports}
            data-testid="button-quick-export-reports"
          >
            <i className="fas fa-download text-2xl text-blue-600 mb-2"></i>
            <span className="text-sm font-medium">Export Reports</span>
          </Button>
        </div>
      </CardContent>

      <AddUserModal
        open={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
      />

      <FundWalletModal
        open={showFundWalletModal}
        onClose={() => setShowFundWalletModal(false)}
      />

      <PricingModal
        open={showPricingModal}
        onClose={() => setShowPricingModal(false)}
      />
    </Card>
  );
}
