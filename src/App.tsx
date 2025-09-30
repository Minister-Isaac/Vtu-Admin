import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Users from "@/pages/users";
import Wallets from "@/pages/wallets";
import Transactions from "@/pages/transactions";
import Services from "@/pages/services";
import Reports from "@/pages/reports";
import Support from "@/pages/support";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";
import AdminLayout from "@/components/layout/admin-layout";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <AdminLayout>
          <Route path="/" component={Dashboard} />
          <Route path="/users" component={Users} />
          <Route path="/wallets" component={Wallets} />
          <Route path="/transactions" component={Transactions} />
          <Route path="/services" component={Services} />
          <Route path="/reports" component={Reports} />
          <Route path="/support" component={Support} />
          <Route path="/settings" component={Settings} />
        </AdminLayout>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
