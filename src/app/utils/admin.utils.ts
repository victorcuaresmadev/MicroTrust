import { APP_CONSTANTS } from '../constants/app.constants';

export class AdminUtils {
  // Verificar si una dirección es de administrador
  static isAdmin(address: string): boolean {
    return APP_CONSTANTS.ADMIN_ADDRESSES.includes(address);
  }

  // Obtener todas las direcciones de administrador
  static getAdminAddresses(): string[] {
    return [...APP_CONSTANTS.ADMIN_ADDRESSES];
  }

  // Verificar si el usuario actual es administrador
  static isCurrentUserAdmin(account: string | null): boolean {
    return account ? this.isAdmin(account) : false;
  }
}