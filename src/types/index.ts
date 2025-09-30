export interface Transaction {
  id: string;
  userId: string;
  serviceId?: string;
  amount: string;
  status: 'pending' | 'success' | 'failed';
  type: string;
  description?: string;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
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
}

export interface Pagination {
  total: number;
  totalPages: number;
}

export interface TransactionResponse {
  transactions: Transaction[];
  pagination: Pagination;
}
