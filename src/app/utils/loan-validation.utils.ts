import { LoanRequest } from '../interfaces/loan.interface';
import { APP_CONSTANTS } from '../constants/app.constants';
import { ValidationUtils } from './validation.utils';

export class LoanValidationUtils {
  // Validar solicitud de préstamo completa
  static validateLoanRequest(loan: LoanRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validar nombre del solicitante
    if (!ValidationUtils.isValidBorrowerName(loan.borrowerName)) {
      errors.push('El nombre del solicitante es requerido y debe tener entre 3 y 100 caracteres');
    }

    // Validar monto del préstamo
    const limit = this.getNetworkLimit(loan.network);
    if (!ValidationUtils.isValidLoanAmount(loan.amount, limit)) {
      errors.push(`El monto debe ser mayor a 0 y no exceder el límite de ${limit} para la red ${loan.network}`);
    }

    // Validar propósito del préstamo
    if (!ValidationUtils.isValidLoanPurpose(loan.purpose)) {
      errors.push('El propósito del préstamo es requerido y debe tener entre 10 y 500 caracteres');
    }

    // Validar tipo de propósito
    if (!ValidationUtils.isValidPurposeType(loan.purposeType)) {
      errors.push('El tipo de propósito no es válido');
    }

    // Validar red
    if (!ValidationUtils.isValidNetwork(loan.network)) {
      errors.push('La red seleccionada no es válida');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
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

  // Validar dirección del prestatario
  static validateBorrowerAddress(address: string): boolean {
    return ValidationUtils.isValidEthereumAddress(address);
  }

  // Validar tasa de interés
  static validateInterestRate(rate: number): boolean {
    return typeof rate === 'number' && rate >= 0 && rate <= 1;
  }

  // Validar estado del préstamo
  static validateLoanStatus(status: string): boolean {
    return ['pending', 'approved', 'rejected', 'disbursed'].includes(status);
  }
}