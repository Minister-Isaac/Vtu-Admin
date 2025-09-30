import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Support() {
  const [page, setPage] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [adminResponse, setAdminResponse] = useState("");
  const { toast } = useToast();

  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/support/tickets", `page=${page}&limit=50`],
    retry: false,
  });

  const updateTicketMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      await apiRequest("PUT", `/api/support/tickets/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/support/tickets"] });
      toast({
        title: "Success",
        description: "Ticket updated successfully",
      });
      setShowResponseModal(false);
      setSelectedTicket(null);
      setAdminResponse("");
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
        description: "Failed to update ticket",
        variant: "destructive",
      });
    },
  });

  const handleUpdateTicket = (ticketId: string, status: string, response?: string) => {
    const updateData: any = { status };
    if (response) {
      updateData.adminResponse = response;
    }
    updateTicketMutation.mutate({ id: ticketId, data: updateData });
  };

  const handleRespondToTicket = (ticket: any) => {
    setSelectedTicket(ticket);
    setAdminResponse(ticket.adminResponse || "");
    setShowResponseModal(true);
  };

  const statusColors = {
    open: "bg-red-100 text-red-800",
    in_progress: "bg-yellow-100 text-yellow-800",
    resolved: "bg-green-100 text-green-800",
    closed: "bg-gray-100 text-gray-800",
  };

  const priorityColors = {
    low: "bg-blue-100 text-blue-800",
    normal: "bg-gray-100 text-gray-800",
    high: "bg-orange-100 text-orange-800",
    urgent: "bg-red-100 text-red-800",
  };

  if (error && isUnauthorizedError(error as Error)) {
    return null;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground" data-testid="text-support-title">Support & Tickets</h1>
          <p className="text-sm text-muted-foreground">
            Manage customer support tickets and complaints
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Tickets</p>
                <p className="text-2xl font-bold text-foreground" data-testid="text-total-tickets">
                  {data?.pagination?.total || 0}
                </p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <i className="fas fa-ticket-alt text-blue-600"></i>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Open Tickets</p>
                <p className="text-2xl font-bold text-red-600" data-testid="text-open-tickets">
                  {data?.tickets?.filter((t: any) => t.status === 'open').length || 0}
                </p>
              </div>
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <i className="fas fa-exclamation-circle text-red-600"></i>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600" data-testid="text-inprogress-tickets">
                  {data?.tickets?.filter((t: any) => t.status === 'in_progress').length || 0}
                </p>
              </div>
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <i className="fas fa-clock text-yellow-600"></i>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold text-green-600" data-testid="text-resolved-tickets">
                  {data?.tickets?.filter((t: any) => t.status === 'resolved').length || 0}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <i className="fas fa-check-circle text-green-600"></i>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Support Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="w-48 h-4 bg-gray-200 rounded"></div>
                      <div className="w-32 h-3 bg-gray-200 rounded"></div>
                    </div>
                    <div className="w-20 h-6 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {data?.tickets?.map((ticket: any) => (
                <div key={ticket.id} className="border border-border rounded-lg p-4 hover:bg-accent/50" data-testid={`ticket-${ticket.id}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{ticket.title}</h3>
                        <Badge className={statusColors[ticket.status as keyof typeof statusColors]}>
                          {ticket.status.replace('_', ' ')}
                        </Badge>
                        <Badge className={priorityColors[ticket.priority as keyof typeof priorityColors]}>
                          {ticket.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        From: {ticket.user?.firstName} {ticket.user?.lastName} ({ticket.user?.email})
                      </p>
                      <p className="text-sm text-foreground mb-3">{ticket.description}</p>
                      {ticket.adminResponse && (
                        <div className="bg-muted p-3 rounded-lg">
                          <p className="text-sm font-medium text-foreground mb-1">Admin Response:</p>
                          <p className="text-sm text-muted-foreground">{ticket.adminResponse}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col space-y-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRespondToTicket(ticket)}
                        data-testid={`button-respond-${ticket.id}`}
                      >
                        <i className="fas fa-reply mr-2"></i>
                        Respond
                      </Button>
                      {ticket.status !== 'resolved' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateTicket(ticket.id, 'in_progress')}
                          disabled={updateTicketMutation.isPending}
                          data-testid={`button-progress-${ticket.id}`}
                        >
                          <i className="fas fa-play mr-2"></i>
                          In Progress
                        </Button>
                      )}
                      {ticket.status !== 'resolved' && (
                        <Button
                          size="sm"
                          onClick={() => handleUpdateTicket(ticket.id, 'resolved')}
                          disabled={updateTicketMutation.isPending}
                          data-testid={`button-resolve-${ticket.id}`}
                        >
                          <i className="fas fa-check mr-2"></i>
                          Resolve
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Created: {new Date(ticket.createdAt).toLocaleString()}</span>
                    {ticket.resolvedAt && (
                      <span>Resolved: {new Date(ticket.resolvedAt).toLocaleString()}</span>
                    )}
                  </div>
                </div>
              ))}
              {(!data?.tickets || data.tickets.length === 0) && (
                <div className="text-center py-12">
                  <i className="fas fa-ticket-alt text-4xl text-muted-foreground mb-4"></i>
                  <p className="text-muted-foreground">No support tickets yet</p>
                </div>
              )}
            </div>
          )}

          {data?.pagination && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {((page - 1) * 50) + 1} to {Math.min(page * 50, data.pagination.total)} of {data.pagination.total} tickets
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  data-testid="button-prev-page"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= data.pagination.totalPages}
                  data-testid="button-next-page"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showResponseModal} onOpenChange={setShowResponseModal}>
        <DialogContent data-testid="modal-respond-ticket">
          <DialogHeader>
            <DialogTitle>Respond to Ticket</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedTicket && (
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-medium text-foreground">{selectedTicket.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{selectedTicket.description}</p>
              </div>
            )}
            <div>
              <Label htmlFor="adminResponse">Admin Response</Label>
              <Textarea
                id="adminResponse"
                value={adminResponse}
                onChange={(e) => setAdminResponse(e.target.value)}
                placeholder="Type your response to the customer..."
                rows={4}
                data-testid="textarea-admin-response"
              />
            </div>
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setShowResponseModal(false)}
                data-testid="button-cancel-response"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (selectedTicket && adminResponse.trim()) {
                    handleUpdateTicket(selectedTicket.id, 'in_progress', adminResponse);
                  }
                }}
                disabled={!adminResponse.trim() || updateTicketMutation.isPending}
                data-testid="button-send-response"
              >
                {updateTicketMutation.isPending ? "Sending..." : "Send Response"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
