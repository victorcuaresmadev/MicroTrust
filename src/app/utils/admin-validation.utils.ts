import { APP_CONSTANTS } from '../constants/app.constants';
import { WalletValidationUtils } from './wallet-validation.utils';

export class AdminValidationUtils {
  // Validar dirección de administrador
  static validateAdminAddress(address: string): boolean {
    if (!WalletValidationUtils.validateEthereumAddress(address)) {
      return false;
    }
    
    return APP_CONSTANTS.ADMIN_ADDRESSES.includes(address);
  }

  // Validar permisos de administrador
  static validateAdminPermissions(address: string, action: string): boolean {
    // Verificar que la dirección sea válida
    if (!this.validateAdminAddress(address)) {
      return false;
    }
    
    // Verificar permisos específicos según la acción
    switch (action) {
      case 'approve_loan':
      case 'reject_loan':
      case 'view_all_loans':
        // Todos los administradores tienen estos permisos
        return true;
      default:
        // Acción no reconocida
        return false;
    }
  }

  // Validar sesión de administrador
  static validateAdminSession(account: string | null): boolean {
    return account !== null && this.validateAdminAddress(account);
  }

  // Validar operación de préstamo
  static validateLoanOperation(
    adminAddress: string,
    loanId: string,
    operation: string
  ): { isValid: boolean; error?: string } {
    // Validar dirección de administrador
    if (!this.validateAdminAddress(adminAddress)) {
      return { isValid: false, error: 'No tienes permisos de administrador' };
    }
    
    // Validar ID del préstamo
    if (!loanId) {
      return { isValid: false, error: 'El ID del préstamo es requerido' };
    }
    
    // Validar operación
    const validOperations = ['approve', 'reject'];
    if (!validOperations.includes(operation)) {
      return { isValid: false, error: 'Operación no válida' };
    }
    
    return { isValid: true };
  }
}