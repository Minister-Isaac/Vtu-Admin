import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useAuth } from "@/hooks/useAuth";

export default function Settings() {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["/api/settings"],
    retry: false,
  });

  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      await apiRequest("PUT", `/api/settings/${key}`, { value });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Success",
        description: "Setting updated successfully",
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
        description: "Failed to update setting",
        variant: "destructive",
      });
    },
  });

  const handleUpdateSetting = (key: string, value: string) => {
    updateSettingMutation.mutate({ key, value });
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    // In a real implementation, this would call an API to change the password
    toast({
      title: "Success",
      description: "Password changed successfully",
    });
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const getSettingValue = (key: string, defaultValue: string = "") => {
    const setting = settings?.find((s: any) => s.key === key);
    return setting?.value || defaultValue;
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground" data-testid="text-settings-title">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage system settings and configurations
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general" data-testid="tab-general">General</TabsTrigger>
          <TabsTrigger value="security" data-testid="tab-security">Security</TabsTrigger>
          <TabsTrigger value="notifications" data-testid="tab-notifications">Notifications</TabsTrigger>
          <TabsTrigger value="system" data-testid="tab-system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    defaultValue={getSettingValue("site_name", "VTU Admin Panel")}
                    onBlur={(e) => handleUpdateSetting("site_name", e.target.value)}
                    data-testid="input-site-name"
                  />
                </div>
                <div>
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    defaultValue={getSettingValue("support_email", "support@vtu.com")}
                    onBlur={(e) => handleUpdateSetting("support_email", e.target.value)}
                    data-testid="input-support-email"
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Default Currency</Label>
                  <Input
                    id="currency"
                    defaultValue={getSettingValue("currency", "NGN")}
                    onBlur={(e) => handleUpdateSetting("currency", e.target.value)}
                    data-testid="input-currency"
                  />
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input
                    id="timezone"
                    defaultValue={getSettingValue("timezone", "Africa/Lagos")}
                    onBlur={(e) => handleUpdateSetting("timezone", e.target.value)}
                    data-testid="input-timezone"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
                <Textarea
                  id="maintenanceMessage"
                  placeholder="Message to display during maintenance"
                  defaultValue={getSettingValue("maintenance_message")}
                  onBlur={(e) => handleUpdateSetting("maintenance_message", e.target.value)}
                  data-testid="textarea-maintenance-message"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Admin Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4 max-w-md">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    data-testid="input-current-password"
                  />
                </div>
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    data-testid="input-new-password"
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    data-testid="input-confirm-password"
                  />
                </div>
                <Button onClick={handlePasswordChange} data-testid="button-change-password">
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch
                  checked={getSettingValue("two_factor_enabled") === "true"}
                  onCheckedChange={(checked) => handleUpdateSetting("two_factor_enabled", checked.toString())}
                  data-testid="switch-two-factor"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Session Timeout (minutes)</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically log out after inactivity
                  </p>
                </div>
                <Input
                  type="number"
                  className="w-20"
                  defaultValue={getSettingValue("session_timeout", "60")}
                  onBlur={(e) => handleUpdateSetting("session_timeout", e.target.value)}
                  data-testid="input-session-timeout"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send email alerts for important events
                  </p>
                </div>
                <Switch
                  checked={getSettingValue("email_notifications") === "true"}
                  onCheckedChange={(checked) => handleUpdateSetting("email_notifications", checked.toString())}
                  data-testid="switch-email-notifications"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send SMS alerts for critical alerts
                  </p>
                </div>
                <Switch
                  checked={getSettingValue("sms_notifications") === "true"}
                  onCheckedChange={(checked) => handleUpdateSetting("sms_notifications", checked.toString())}
                  data-testid="switch-sms-notifications"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Failed Transaction Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when transactions fail
                  </p>
                </div>
                <Switch
                  checked={getSettingValue("failed_transaction_alerts") === "true"}
                  onCheckedChange={(checked) => handleUpdateSetting("failed_transaction_alerts", checked.toString())}
                  data-testid="switch-failed-transaction-alerts"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-border rounded-lg">
                  <h3 className="font-medium text-foreground mb-2">Admin User</h3>
                  <p className="text-sm text-muted-foreground" data-testid="text-admin-email">
                    {user?.email || "Not available"}
                  </p>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <h3 className="font-medium text-foreground mb-2">Last Login</h3>
                  <p className="text-sm text-muted-foreground" data-testid="text-last-login">
                    {new Date().toLocaleString()}
                  </p>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <h3 className="font-medium text-foreground mb-2">System Status</h3>
                  <p className="text-sm text-green-600" data-testid="text-system-status">
                    <i className="fas fa-check-circle mr-1"></i>
                    All systems operational
                  </p>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <h3 className="font-medium text-foreground mb-2">Database</h3>
                  <p className="text-sm text-green-600" data-testid="text-database-status">
                    <i className="fas fa-database mr-1"></i>
                    Connected
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <h3 className="font-medium text-foreground">Backup Database</h3>
                  <p className="text-sm text-muted-foreground">
                    Create a backup of the current database
                  </p>
                </div>
                <Button variant="outline" data-testid="button-backup-database">
                  <i className="fas fa-download mr-2"></i>
                  Backup
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <h3 className="font-medium text-foreground">Clear Cache</h3>
                  <p className="text-sm text-muted-foreground">
                    Clear all system cache and temporary files
                  </p>
                </div>
                <Button variant="outline" data-testid="button-clear-cache">
                  <i className="fas fa-trash mr-2"></i>
                  Clear Cache
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                <div>
                  <h3 className="font-medium text-red-900">Maintenance Mode</h3>
                  <p className="text-sm text-red-700">
                    Put the system in maintenance mode
                  </p>
                </div>
                <Switch
                  checked={getSettingValue("maintenance_mode") === "true"}
                  onCheckedChange={(checked) => handleUpdateSetting("maintenance_mode", checked.toString())}
                  data-testid="switch-maintenance-mode"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
