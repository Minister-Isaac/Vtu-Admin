import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

const serviceSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  type: z.enum(["airtime", "data", "tv", "electricity", "other"]),
  provider: z.string().min(1, "Provider is required"),
  apiPrice: z.string().min(0, "API price must be positive"),
  normalPrice: z.string().min(0, "Normal price must be positive"),
  resellerPrice: z.string().min(0, "Reseller price must be positive"),
  apiUserPrice: z.string().min(0, "API user price must be positive"),
  isActive: z.boolean().default(true),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

export default function Services() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const { toast } = useToast();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      isActive: true,
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["/api/services"],
    retry: false,
  });

  // ✅ normalize into array safely
  const services: any[] = Array.isArray(data)
    ? data
    : Array.isArray((data as any)?.services)
    ? (data as any).services
    : [];

  const createMutation = useMutation({
    mutationFn: async (data: ServiceFormData) => {
      await apiRequest("POST", "/api/services", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      toast({
        title: "Success",
        description: "Service created successfully",
      });
      setShowAddModal(false);
      reset();
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
        description: "Failed to create service",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ServiceFormData> }) => {
      await apiRequest("PUT", `/api/services/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      toast({
        title: "Success",
        description: "Service updated successfully",
      });
      setEditingService(null);
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
        description: "Failed to update service",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ServiceFormData) => {
    if (editingService) {
      updateMutation.mutate({ id: editingService.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (service: any) => {
    setEditingService(service);
    reset({
      name: service.name,
      type: service.type,
      provider: service.provider,
      apiPrice: service.apiPrice || "0",
      normalPrice: service.normalPrice || "0",
      resellerPrice: service.resellerPrice || "0",
      apiUserPrice: service.apiUserPrice || "0",
      isActive: service.isActive,
    });
    setShowAddModal(true);
  };

  const serviceTypeColors = {
    airtime: "bg-blue-100 text-blue-800",
    data: "bg-green-100 text-green-800",
    tv: "bg-purple-100 text-purple-800",
    electricity: "bg-yellow-100 text-yellow-800",
    other: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold text-foreground"
            data-testid="text-services-title"
          >
            Service Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage services and pricing for different user tiers
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingService(null);
            reset();
            setShowAddModal(true);
          }}
          data-testid="button-add-service"
        >
          <i className="fas fa-plus mr-2"></i>
          Add Service
        </Button>
      </div>

      {/* ✅ Stats Section Fixed */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Services
                </p>
                <p
                  className="text-2xl font-bold text-foreground"
                  data-testid="text-total-services"
                >
                  {services.length}
                </p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <i className="fas fa-cogs text-blue-600"></i>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active Services
                </p>
                <p
                  className="text-2xl font-bold text-green-600"
                  data-testid="text-active-services"
                >
                  {services.filter((s: any) => s.isActive).length}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <i className="fas fa-check-circle text-green-600"></i>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Providers
                </p>
                <p
                  className="text-2xl font-bold text-purple-600"
                  data-testid="text-providers-count"
                >
                  {new Set(services.map((s: any) => s.provider)).size}
                </p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <i className="fas fa-building text-purple-600"></i>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Service Types
                </p>
                <p
                  className="text-2xl font-bold text-orange-600"
                  data-testid="text-service-types"
                >
                  {new Set(services.map((s: any) => s.type)).size}
                </p>
              </div>
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <i className="fas fa-tags text-orange-600"></i>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ✅ Your other code (services list, dialog, etc.) stays unchanged */}
      {/* ... keep the rest of your component as it was ... */}
    </div>
  );
}
