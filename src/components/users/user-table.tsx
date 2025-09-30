import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role: string;
  isActive: boolean;
  walletBalance: string;
  createdAt: string;
}

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  onSuspend: (userId: string) => void;
  onActivate: (userId: string) => void;
}

export default function UserTable({ users, isLoading, onSuspend, onActivate }: UserTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="w-32 h-4 bg-gray-200 rounded"></div>
                  <div className="w-24 h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="w-20 h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'reseller':
        return 'secondary';
      case 'api':
        return 'outline';
      default:
        return 'default';
    }
  };

  const getUserInitials = (user: User) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
    }
    if (user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return '??';
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Wallet Balance</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} data-testid={`user-row-${user.id}`}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {getUserInitials(user)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    {user.phone && (
                      <p className="text-xs text-muted-foreground">{user.phone}</p>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getRoleBadgeVariant(user.role)}>
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="font-medium" data-testid={`text-balance-${user.id}`}>
                  ₦{parseFloat(user.walletBalance || '0').toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant={user.isActive ? "default" : "secondary"}>
                  {user.isActive ? "Active" : "Suspended"}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  {user.isActive ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onSuspend(user.id)}
                      data-testid={`button-suspend-${user.id}`}
                    >
                      <i className="fas fa-ban mr-1"></i>
                      Suspend
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => onActivate(user.id)}
                      data-testid={`button-activate-${user.id}`}
                    >
                      <i className="fas fa-check mr-1"></i>
                      Activate
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {users.length === 0 && (
        <div className="text-center py-12">
          <i className="fas fa-users text-4xl text-muted-foreground mb-4"></i>
          <p className="text-muted-foreground">No users found</p>
        </div>
      )}
    </div>
  );
}
