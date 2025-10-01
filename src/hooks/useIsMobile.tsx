import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";

;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  // Reset sidebar state depending on screen size
  useEffect(() => {
    if (!isMobile) {
      setIsOpen(true); // always open on desktop
    } else {
      setIsOpen(false); // start closed on mobile
    }
  }, [isMobile]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      {isOpen && (
        <div className="fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg md:static md:shadow-none">
          {/* Close button (only on mobile) */}
          {isMobile && (
            <div className="p-4 border-b flex justify-between items-center">
              <span className="font-bold">Menu</span>
              <button onClick={() => setIsOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
          )}
          <nav className="p-4 space-y-2">
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/users">Users</Link>
            <Link href="/wallets">Wallets</Link>
            <Link href="/transactions">Transactions</Link>
            <Link href="/services">Services</Link>
            <Link href="/reports">Reports</Link>
            <Link href="/support">Support</Link>
            <Link href="/settings">Settings</Link>
          </nav>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar with hamburger (only on mobile) */}
        {isMobile && (
          <header className="w-full bg-white border-b p-4 flex items-center">
            <button onClick={() => setIsOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="ml-4 font-semibold">Admin Panel</h1>
          </header>
        )}

        {/* Page content */}
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}
