import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TransactionTable from "@/components/transactions/transaction-table";

import { Transaction, TransactionResponse } from "@/types";

export default function Transactions() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    status: "",
    type: "",
    userId: "",
  });

  
  const { data, isLoading } = useQuery<TransactionResponse>({
    queryKey: [
      "/api/transactions",
      `page=${page}&limit=50&status=${filters.status}&type=${filters.type}&userId=${filters.userId}`,
    ],
    retry: false,
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold text-foreground"
            data-testid="text-transactions-title"
          >
            Transaction Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitor and manage all system transactions
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Transactions
                </p>
                <p
                  className="text-2xl font-bold text-foreground"
                  data-testid="text-total-transactions"
                >
                  {data?.pagination?.total || 0}
                </p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <i className="fas fa-exchange-alt text-blue-600"></i>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Successful
                </p>
                <p
                  className="text-2xl font-bold text-green-600"
                  data-testid="text-successful-transactions"
                >
                  {data?.transactions?.filter(
                    (t: Transaction) => t.status === "success"
                  ).length || 0}
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
                  Pending
                </p>
                <p
                  className="text-2xl font-bold text-yellow-600"
                  data-testid="text-pending-transactions"
                >
                  {data?.transactions?.filter(
                    (t: Transaction) => t.status === "pending"
                  ).length || 0}
                </p>
              </div>
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <i className="fas fa-clock text-yellow-600"></i>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Transactions</CardTitle>
            <div className="flex items-center space-x-2">
            
              <Select
                value={filters.status || "all"}
                onValueChange={(value) =>
                  handleFilterChange("status", value === "all" ? "" : value)
                }
              >
                <SelectTrigger
                  className="w-32"
                  data-testid="select-status-filter"
                >
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.type || "all"}
                onValueChange={(value) =>
                  handleFilterChange("type", value === "all" ? "" : value)
                }
              >
                <SelectTrigger
                  className="w-32"
                  data-testid="select-type-filter"
                >
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="purchase">Purchase</SelectItem>
                  <SelectItem value="funding">Funding</SelectItem>
                  <SelectItem value="refund">Refund</SelectItem>
                </SelectContent>
              </Select>

              {/* User Filter */}
              <Input
                placeholder="User ID..."
                value={filters.userId}
                onChange={(e) => handleFilterChange("userId", e.target.value)}
                className="w-32"
                data-testid="input-user-filter"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <TransactionTable
            transactions={data?.transactions || []}
            isLoading={isLoading}
          />
          {data?.pagination && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {(page - 1) * 50 + 1} to{" "}
                {Math.min(page * 50, data.pagination.total)} of{" "}
                {data.pagination.total} transactions
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  data-testid="button-prev-page"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
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
    </div>
  );
}
