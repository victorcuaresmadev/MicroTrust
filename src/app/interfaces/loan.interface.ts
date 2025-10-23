export interface LoanRequest {
  id: string;
  borrowerName: string;
  borrowerAddress: string;
  amount: number;
  purpose: string;
  purposeType: 'student' | 'business' | 'health' | 'events' | 'other';
  network: 'goerli' | 'holesky' | 'sepolia' | 'ephemery';
  interestRate: number;
  status: 'pending' | 'approved' | 'rejected' | 'disbursed' | 'payment_pending' | 'paid'; // Agregamos nuevos estados
  createdAt: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
  contractUrl?: string;
  events?: string; // Registro de eventos del sistema (transacciones, confirmaciones, etc.)
  loanDuration?: number; // Duración del préstamo en días
  approvedBy?: string; // Dirección del administrador que aprobó el préstamo
  rejectedBy?: string; // Dirección del administrador que rechazó el préstamo
  rejectionReason?: string; // Motivo del rechazo del préstamo
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