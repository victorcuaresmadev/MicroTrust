export interface ContractData {
  contractId: string;
  companyName: string;
  companyRUC: string;
  lenderAddress: string;
  borrowerName: string;
  borrowerAddress: string;
  loanAmount: number;
  interestRate: number;
  totalAmount: number;
  purpose: string;
  network: string;
  createdAt: Date;
  approvedAt?: Date;
  qrCode: string;
}