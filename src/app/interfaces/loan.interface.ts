export interface LoanRequest {
  id: string;
  borrowerName: string;
  borrowerAddress: string;
  amount: number;
  purpose: string;
  purposeType: 'student' | 'business' | 'other';
  network: 'goerli' | 'holesky' | 'sepolia' | 'ephemery';
  interestRate: number;
  status: 'pending' | 'approved' | 'rejected' | 'disbursed';
  createdAt: Date;
  approvedAt?: Date;
  contractUrl?: string;
}

export interface NetworkConfig {
  name: string;
  value: string;
  limit: number;
}

export interface PurposeTypeConfig {
  value: string;
  label: string;
  interestRate: number;
}