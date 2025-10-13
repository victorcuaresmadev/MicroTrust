import { ContractData } from '../interfaces/contract.interface';
import { ValidationUtils } from './validation.utils';

export class ContractValidationUtils {
  // Validar datos del contrato
  static validateContractData(contract: ContractData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validar ID del contrato
    if (!contract.contractId) {
      errors.push('El ID del contrato es requerido');
    }

    // Validar nombre de la empresa
    if (!contract.companyName) {
      errors.push('El nombre de la empresa es requerido');
    }

    // Validar RUC de la empresa
    if (!contract.companyRUC) {
      errors.push('El RUC de la empresa es requerido');
    }

    // Validar dirección del prestamista
    if (!ValidationUtils.isValidEthereumAddress(contract.lenderAddress)) {
      errors.push('La dirección del prestamista no es válida');
    }

    // Validar nombre del prestatario
    if (!contract.borrowerName) {
      errors.push('El nombre del prestatario es requerido');
    }

    // Validar dirección del prestatario
    if (!ValidationUtils.isValidEthereumAddress(contract.borrowerAddress)) {
      errors.push('La dirección del prestatario no es válida');
    }

    // Validar monto del préstamo
    if (typeof contract.loanAmount !== 'number' || contract.loanAmount <= 0) {
      errors.push('El monto del préstamo debe ser un número positivo');
    }

    // Validar tasa de interés
    if (typeof contract.interestRate !== 'number' || contract.interestRate < 0) {
      errors.push('La tasa de interés debe ser un número no negativo');
    }

    // Validar monto total
    if (typeof contract.totalAmount !== 'number' || contract.totalAmount <= 0) {
      errors.push('El monto total debe ser un número positivo');
    }

    // Validar propósito
    if (!contract.purpose) {
      errors.push('El propósito del préstamo es requerido');
    }

    // Validar red
    if (!contract.network) {
      errors.push('La red blockchain es requerida');
    }

    // Validar fechas
    if (!(contract.createdAt instanceof Date) || isNaN(contract.createdAt.getTime())) {
      errors.push('La fecha de creación no es válida');
    }

    // Validar código QR
    if (!contract.qrCode) {
      errors.push('El código QR es requerido');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validar URL del contrato
  static validateContractUrl(url: string): boolean {
    if (!url) return false;
    // Validar formato de URL
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Validar URL del código QR
  static validateQRCodeUrl(url: string): boolean {
    if (!url) return false;
    // Validar formato de URL
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}