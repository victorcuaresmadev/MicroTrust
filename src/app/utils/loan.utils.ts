import { LoanRequest } from '../interfaces/loan.interface';
import { APP_CONSTANTS } from '../constants/app.constants';

export class LoanUtils {
  // Calcular monto total con intereses
  static calculateTotalAmount(loan: LoanRequest): number {
    return loan.amount + (loan.amount * loan.interestRate);
  }

  // Verificar si el préstamo excede el límite
  static isLoanExceedingLimit(loan: LoanRequest): boolean {
    const limit = this.getNetworkLimit(loan.network);
    return loan.amount > limit;
  }

  // Obtener límite de red
  static getNetworkLimit(network: string): number {
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

  // Verificar si el préstamo es válido
  static isValidLoan(loan: LoanRequest): boolean {
    return (
      loan.borrowerName.trim().length > 0 &&
      loan.amount > 0 &&
      loan.purpose.trim().length > 0 &&
      this.isValidPurposeType(loan.purposeType) &&
      this.isValidNetwork(loan.network)
    );
  }

  // Validar tipo de propósito
  static isValidPurposeType(purposeType: string): boolean {
    return ['student', 'business', 'other'].includes(purposeType);
  }

  // Validar red
  static isValidNetwork(network: string): boolean {
    return ['goerli', 'holesky', 'sepolia', 'hoodi', 'ephemery'].includes(network);
  }

  // Obtener etiqueta de propósito
  static getPurposeLabel(purposeType: string): string {
    switch (purposeType) {
      case 'student': return APP_CONSTANTS.PURPOSE_TYPES.STUDENT.label;
      case 'business': return APP_CONSTANTS.PURPOSE_TYPES.BUSINESS.label;
      default: return APP_CONSTANTS.PURPOSE_TYPES.OTHER.label;
    }
  }

  // Obtener etiqueta de red
  static getNetworkLabel(network: string): string {
    switch (network) {
      case 'goerli': return APP_CONSTANTS.NETWORKS.GOERLI.name;
      case 'holesky': return APP_CONSTANTS.NETWORKS.HOLESKY.name;
      case 'sepolia': return APP_CONSTANTS.NETWORKS.SEPOLIA.name;
      case 'ephemery': return APP_CONSTANTS.NETWORKS.EPHEMERY.name;
      default: return network;
    }
  }
}