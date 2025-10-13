import { Injectable } from '@angular/core';
import { ContractService } from '../contract/contract.service';
import { LoanRequest } from '../../interfaces/loan.interface';
import { APP_CONSTANTS } from '../../constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private loans: LoanRequest[] = [];

  constructor(private contractService: ContractService) { }

  // Calcular tasa de interés según propósito
  calculateInterestRate(purposeType: string): number {
    switch (purposeType) {
      case 'student': return APP_CONSTANTS.PURPOSE_TYPES.STUDENT.interestRate;
      case 'business': return APP_CONSTANTS.PURPOSE_TYPES.BUSINESS.interestRate;
      default: return APP_CONSTANTS.PURPOSE_TYPES.OTHER.interestRate;
    }
  }

  // Obtener límite de préstamo según red
  getLoanLimit(network: string): number {
    switch (network) {
      case 'goerli':
      case 'holesky':
        return APP_CONSTANTS.NETWORKS.GOERLI.limit;
      case 'sepolia':
      case 'ephemery':
        return APP_CONSTANTS.NETWORKS.SEPOLIA.limit;
      default:
        return 0;
    }
  }

  // Crear una nueva solicitud de préstamo
  createLoanRequest(request: Omit<LoanRequest, 'id' | 'status' | 'createdAt'>): LoanRequest {
    const newLoan: LoanRequest = {
      id: this.generateId(),
      ...request,
      status: 'pending',
      createdAt: new Date()
    };
    
    this.loans.push(newLoan);
    return newLoan;
  }

  // Obtener todas las solicitudes de préstamo
  getAllLoans(): LoanRequest[] {
    return [...this.loans];
  }

  // Obtener solicitudes por dirección de prestatario
  getLoansByBorrower(address: string): LoanRequest[] {
    return this.loans.filter(loan => loan.borrowerAddress === address);
  }

  // Obtener solicitudes pendientes (para administradores)
  getPendingLoans(): LoanRequest[] {
    return this.loans.filter(loan => loan.status === 'pending');
  }

  // Aprobar un préstamo (solo administradores)
  approveLoan(loanId: string, adminAddress: string): boolean {
    if (!this.isAdmin(adminAddress)) {
      throw new Error('Solo los administradores pueden aprobar préstamos');
    }
    
    const loan = this.loans.find(l => l.id === loanId);
    if (loan) {
      loan.status = 'approved';
      loan.approvedAt = new Date();
      // Generar contrato cuando se aprueba el préstamo
      loan.contractUrl = this.contractService.generateContract(loan);
      return true;
    }
    return false;
  }

  // Rechazar un préstamo (solo administradores)
  rejectLoan(loanId: string, adminAddress: string): boolean {
    if (!this.isAdmin(adminAddress)) {
      throw new Error('Solo los administradores pueden rechazar préstamos');
    }
    
    const loan = this.loans.find(l => l.id === loanId);
    if (loan) {
      loan.status = 'rejected';
      return true;
    }
    return false;
  }

  // Verificar si una dirección es administrador
  isAdmin(address: string): boolean {
    return APP_CONSTANTS.ADMIN_ADDRESSES.includes(address);
  }

  // Generar ID único para préstamo
  private generateId(): string {
    return 'loan_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}