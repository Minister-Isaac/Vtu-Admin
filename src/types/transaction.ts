export interface Transaction {
  id: string;
  status: "success" | "pending" | "failed";
  type: "purchase" | "funding" | "refund" | string;
  amount: number;
  userId: string;
  createdAt: string;
  [key: string]: any; 
}

export interface Pagination {
  total: number;
  totalPages: number;
}

export interface TransactionResponse {
  transactions: Transaction[];
  pagination: Pagination;
}
