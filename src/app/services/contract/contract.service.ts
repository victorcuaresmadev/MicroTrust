import { Injectable } from '@angular/core';
import { LoanRequest } from '../../interfaces/loan.interface';
import { ContractData } from '../../interfaces/contract.interface';
import { APP_CONSTANTS } from '../../constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  constructor() { }

  // Generar contrato PDF (simulación)
  generateContract(loan: LoanRequest): string {
    // En una implementación real, aquí se crearía un PDF con los datos del préstamo
    // y se generaría un código QR único para el contrato
    
    // Por ahora, retornamos una URL de ejemplo
    return `contracts/${loan.id}.pdf`;
  }

  // Generar código QR (simulación)
  generateQRCode(data: string): string {
    // En una implementación real, aquí se generaría un código QR
    // Por ahora, retornamos una URL de ejemplo
    return `qrcodes/${btoa(data)}.png`;
  }

  // Obtener datos para el contrato
  getContractData(loan: LoanRequest): ContractData {
    return {
      contractId: loan.id,
      companyName: APP_CONSTANTS.COMPANY_NAME,
      companyRUC: APP_CONSTANTS.COMPANY_RUC,
      lenderAddress: APP_CONSTANTS.LENDER_ADDRESS,
      borrowerName: loan.borrowerName,
      borrowerAddress: loan.borrowerAddress,
      loanAmount: loan.amount,
      interestRate: loan.interestRate,
      totalAmount: loan.amount + (loan.amount * loan.interestRate),
      purpose: loan.purpose,
      network: loan.network,
      createdAt: loan.createdAt,
      approvedAt: loan.approvedAt,
      qrCode: this.generateQRCode(loan.id)
    };
  }
}