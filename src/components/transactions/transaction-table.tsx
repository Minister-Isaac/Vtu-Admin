import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Transaction {
  id: string;
  user?: {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    role: string;
  };
  service?: {
    id: string;
    name: string;
    type: string;
    provider: string;
  };
  amount: string;
  status: string;
  type: string;
  description?: string;
  createdAt: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
  isLoading: boolean;
}

export default function TransactionTable({ transactions, isLoading }: TransactionTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <div className="w-32 h-4 bg-gray-200 rounded"></div>
                <div className="w-24 h-3 bg-gray-200 rounded"></div>
              </div>
              <div className="w-16 h-6 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'success':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'purchase':
        return 'default';
      case 'funding':
        return 'secondary';
      case 'refund':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getUserInitials = (user: any) => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
    }
    if (user?.email) {
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
            <TableHead>Service</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id} data-testid={`transaction-row-${transaction.id}`}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium">
                      {getUserInitials(transaction.user)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {transaction.user?.firstName} {transaction.user?.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">{transaction.user?.email}</p>
                    <Badge variant="outline" className="text-xs">
                      {transaction.user?.role}
                    </Badge>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium text-foreground">
                    {transaction.service?.name || transaction.description || 'N/A'}
                  </p>
                  {transaction.service && (
                    <p className="text-xs text-muted-foreground">
                      {transaction.service.provider} - {transaction.service.type}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span className="font-medium" data-testid={`text-amount-${transaction.id}`}>
                  ₦{parseFloat(transaction.amount || '0').toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant={getTypeBadgeVariant(transaction.type)}>
                  {transaction.type}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(transaction.status)}>
                  {transaction.status}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {new Date(transaction.createdAt).toLocaleString()}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {transactions.length === 0 && (
        <div className="text-center py-12">
          <i className="fas fa-exchange-alt text-4xl text-muted-foreground mb-4"></i>
          <p className="text-muted-foreground">No transactions found</p>
        </div>
      )}
    </div>
  );
}
