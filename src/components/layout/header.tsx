import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  onSidebarToggle: () => void;
}

export default function Header({ onSidebarToggle }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="bg-card border-b border-border px-6 py-4" data-testid="header">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSidebarToggle}
            className="lg:hidden"
            data-testid="button-sidebar-toggle"
          >
            <i className="fas fa-bars"></i>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground" data-testid="text-page-title">
              Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, Super Admin
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Button variant="ghost" size="sm" className="relative">
              <i className="fas fa-bell text-lg"></i>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full text-xs"></span>
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <i className="fas fa-user text-primary-foreground text-sm"></i>
            </div>
            <span className="text-sm font-medium hidden md:inline" data-testid="text-user-name">
              {user?.firstName || user?.email || 'Admin'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
