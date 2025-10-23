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
  events?: string; // Registro de eventos del sistema (transacciones, confirmaciones, etc.)
  loanDuration?: number; // Duración del préstamo en días
}