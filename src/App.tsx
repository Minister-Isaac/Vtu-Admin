import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Landing from "@/pages/landing";
import Login from "./pages/login";
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
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />

      {/* Admin routes wrapped with sidebar */}
      <AdminLayout>
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/users" component={Users} />
        <Route path="/wallets" component={Wallets} />
        <Route path="/transactions" component={Transactions} />
        <Route path="/services" component={Services} />
        <Route path="/reports" component={Reports} />
        <Route path="/support" component={Support} />
        <Route path="/settings" component={Settings} />
      </AdminLayout>

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
