import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

interface PricingModalProps {
  open: boolean;
  onClose: () => void;
}

export default function PricingModal({ open, onClose }: PricingModalProps) {
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(undefined);
  const [prices, setPrices] = useState({
    normalPrice: "",
    resellerPrice: "",
    apiUserPrice: "",
  });
  const { toast } = useToast();

  const { data } = useQuery({
    queryKey: ["/api/services"],
    retry: false,
  });

  // ✅ Ensure it's always an array
  const services: any[] = Array.isArray(data) 
    ? data 
    : Array.isArray((data as any)?.services) 
      ? (data as any).services 
      : [];

  const updatePricingMutation = useMutation({
    mutationFn: async ({ serviceId, prices }: { serviceId: string; prices: any }) => {
      await apiRequest("PUT", `/api/services/${serviceId}`, prices);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      toast({
        title: "Success",
        description: "Pricing updated successfully",
      });
      onClose();
      setSelectedServiceId(undefined); // ✅ reset properly
      setPrices({
        normalPrice: "",
        resellerPrice: "",
        apiUserPrice: "",
      });
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
        description: "Failed to update pricing",
        variant: "destructive",
      });
    },
  });

  const handleServiceSelect = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    const service = services.find((s: any) => s.id === serviceId);
    if (service) {
      setPrices({
        normalPrice: service.normalPrice || "",
        resellerPrice: service.resellerPrice || "",
        apiUserPrice: service.apiUserPrice || "",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedServiceId) {
      toast({
        title: "Error",
        description: "Please select a service",
        variant: "destructive",
      });
      return;
    }

    const normalPrice = parseFloat(prices.normalPrice);
    const resellerPrice = parseFloat(prices.resellerPrice);
    const apiUserPrice = parseFloat(prices.apiUserPrice);

    if (isNaN(normalPrice) || isNaN(resellerPrice) || isNaN(apiUserPrice)) {
      toast({
        title: "Error",
        description: "Please enter valid prices",
        variant: "destructive",
      });
      return;
    }

    updatePricingMutation.mutate({
      serviceId: selectedServiceId,
      prices: {
        normalPrice: normalPrice.toString(),
        resellerPrice: resellerPrice.toString(),
        apiUserPrice: apiUserPrice.toString(),
      }
    });
  };

  const selectedService = services.find((s: any) => s.id === selectedServiceId);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md" data-testid="modal-pricing">
        <DialogHeader>
          <DialogTitle>Update Service Pricing</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="service">Select Service</Label>
            <Select value={selectedServiceId ?? undefined} onValueChange={handleServiceSelect}>
              <SelectTrigger data-testid="select-service">
                <SelectValue placeholder="Choose a service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service: any) => (
                  <SelectItem key={service.id} value={service.id}>
                    <div className="flex items-center space-x-2">
                      <span>{service.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {service.type}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedService && (
            <div className="p-3 bg-muted rounded-lg">
              <h4 className="font-medium text-foreground">{selectedService.name}</h4>
              <p className="text-sm text-muted-foreground">
                Provider: {selectedService.provider} | Type: {selectedService.type}
              </p>
              {selectedService.apiPrice && (
                <p className="text-sm text-muted-foreground">
                  API Cost: ₦{parseFloat(selectedService.apiPrice).toFixed(2)}
                </p>
              )}
            </div>
          )}
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="normalPrice">Normal User Price (₦)</Label>
              <Input
                id="normalPrice"
                type="number"
                step="0.01"
                min="0"
                value={prices.normalPrice}
                onChange={(e) => setPrices(prev => ({ ...prev, normalPrice: e.target.value }))}
                placeholder="0.00"
                data-testid="input-normal-price"
              />
            </div>

            <div>
              <Label htmlFor="resellerPrice">Reseller Price (₦)</Label>
              <Input
                id="resellerPrice"
                type="number"
                step="0.01"
                min="0"
                value={prices.resellerPrice}
                onChange={(e) => setPrices(prev => ({ ...prev, resellerPrice: e.target.value }))}
                placeholder="0.00"
                data-testid="input-reseller-price"
              />
            </div>

            <div>
              <Label htmlFor="apiUserPrice">API User Price (₦)</Label>
              <Input
                id="apiUserPrice"
                type="number"
                step="0.01"
                min="0"
                value={prices.apiUserPrice}
                onChange={(e) => setPrices(prev => ({ ...prev, apiUserPrice: e.target.value }))}
                placeholder="0.00"
                data-testid="input-api-user-price"
              />
            </div>
          </div>

          {selectedService && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <h5 className="text-sm font-medium text-blue-900 mb-2">Pricing Tiers</h5>
              <div className="space-y-1 text-xs text-blue-800">
                <div className="flex justify-between">
                  <span>Normal Users:</span>
                  <span>₦{prices.normalPrice || "0.00"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Resellers:</span>
                  <span>₦{prices.resellerPrice || "0.00"}</span>
                </div>
                <div className="flex justify-between">
                  <span>API Users:</span>
                  <span>₦{prices.apiUserPrice || "0.00"}</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1"
              onClick={onClose}
              data-testid="button-cancel-pricing"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={updatePricingMutation.isPending || !selectedServiceId}
              data-testid="button-update-pricing"
            >
              {updatePricingMutation.isPending ? "Updating..." : "Update Pricing"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
