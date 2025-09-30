import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const navigation = [
  { name: "Dashboard", href: "/", icon: "fas fa-chart-line" },
  { name: "Users", href: "/users", icon: "fas fa-users" },
  { name: "Wallets", href: "/wallets", icon: "fas fa-wallet" },
  { name: "Transactions", href: "/transactions", icon: "fas fa-exchange-alt" },
  { name: "Services", href: "/services", icon: "fas fa-tags" },
  { name: "Reports", href: "/reports", icon: "fas fa-chart-bar" },
  { name: "Support", href: "/support", icon: "fas fa-headset" },
  { name: "Settings", href: "/settings", icon: "fas fa-cog" },
];

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const [location] = useLocation();

  return (
    <aside 
      className={cn(
        "bg-card border-r border-border flex flex-col transition-all duration-300",
        isOpen ? "w-64" : "w-0 lg:w-16"
      )}
      data-testid="sidebar"
    >
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <i className="fas fa-bolt text-primary-foreground text-sm"></i>
          </div>
          {isOpen && (
            <h1 className="text-xl font-bold text-foreground">VTU Admin</h1>
          )}
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          
          return (
            <Link key={item.name} href={item.href}>
              <a
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  !isOpen && "justify-center"
                )}
                data-testid={`nav-${item.name.toLowerCase()}`}
              >
                <i className={cn(item.icon, "w-5")}></i>
                {isOpen && <span>{item.name}</span>}
              </a>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
            <i className="fas fa-user text-secondary-foreground text-sm"></i>
          </div>
          {isOpen && (
            <div className="flex-1">
              <p className="text-sm font-medium">Super Admin</p>
              <p className="text-xs text-muted-foreground">admin@vtu.com</p>
            </div>
          )}
          <button 
            className="text-muted-foreground hover:text-foreground"
            onClick={() => window.location.href = '/api/logout'}
            data-testid="button-logout"
          >
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </div>
    </aside>
  );
}
