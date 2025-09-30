import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

interface FundWalletModalProps {
  open: boolean;
  onClose: () => void;
  userId?: string | null;
}

export default function FundWalletModal({ open, onClose, userId }: FundWalletModalProps) {
  const [selectedUserId, setSelectedUserId] = useState(userId || "");
  const [amount, setAmount] = useState("");
  const [action, setAction] = useState<"fund" | "deduct">("fund");
  const { toast } = useToast();

  const { data: users } = useQuery({
    queryKey: ["/api/users"],
    retry: false,
    enabled: !userId, // Only fetch if no specific userId is provided
  });

  const walletMutation = useMutation({
    mutationFn: async ({ userId, amount, action }: { userId: string; amount: string; action: "fund" | "deduct" }) => {
      const endpoint = action === "fund" ? `/api/wallets/${userId}/fund` : `/api/wallets/${userId}/deduct`;
      await apiRequest("POST", endpoint, { amount });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/wallets"] });
      toast({
        title: "Success",
        description: `Wallet ${action === "fund" ? "funded" : "debited"} successfully`,
      });
      onClose();
      setAmount("");
      setSelectedUserId("");
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: `Failed to ${action} wallet`,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUserId) {
      toast({
        title: "Error",
        description: "Please select a user",
        variant: "destructive",
      });
      return;
    }

    const amountValue = parseFloat(amount);
    if (!amountValue || amountValue <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    walletMutation.mutate({ 
      userId: selectedUserId, 
      amount: amountValue.toString(), 
      action 
    });
  };

  const selectedUser = users?.users?.find((u: any) => u.id === selectedUserId);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md" data-testid="modal-fund-wallet">
        <DialogHeader>
          <DialogTitle>
            {action === "fund" ? "Fund" : "Deduct from"} Wallet
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-2">
            <Button
              type="button"
              variant={action === "fund" ? "default" : "outline"}
              onClick={() => setAction("fund")}
              className="flex-1"
              data-testid="button-action-fund"
            >
              Fund
            </Button>
            <Button
              type="button"
              variant={action === "deduct" ? "default" : "outline"}
              onClick={() => setAction("deduct")}
              className="flex-1"
              data-testid="button-action-deduct"
            >
              Deduct
            </Button>
          </div>

          {!userId && (
            <div>
              <Label htmlFor="user">Select User</Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger data-testid="select-user">
                  <SelectValue placeholder="Choose a user" />
                </SelectTrigger>
                <SelectContent>
                  {users?.users?.map((user: any) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.firstName} {user.lastName} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {selectedUser && (
            <div className="p-3 bg-muted rounded-lg">
              <h4 className="font-medium text-foreground">
                {selectedUser.firstName} {selectedUser.lastName}
              </h4>
              <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
              <p className="text-sm font-medium text-foreground">
                Current Balance: ₦{parseFloat(selectedUser.walletBalance || '0').toLocaleString('en-NG', { minimumFractionDigits: 2 })}
              </p>
            </div>
          )}
          
          <div>
            <Label htmlFor="amount">Amount (₦)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              data-testid="input-amount"
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1"
              onClick={onClose}
              data-testid="button-cancel-wallet-action"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={walletMutation.isPending || !selectedUserId || !amount}
              data-testid="button-confirm-wallet-action"
            >
              {walletMutation.isPending 
                ? `${action === "fund" ? "Funding" : "Deducting"}...` 
                : `${action === "fund" ? "Fund" : "Deduct"} Wallet`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
