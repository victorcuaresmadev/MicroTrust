import { APP_CONSTANTS } from '../constants/app.constants';

export class StatusUtils {
  // Obtener etiqueta de estado por valor
  static getStatusLabel(statusValue: string): string {
    return APP_CONSTANTS.LOAN_STATUS_LABELS[statusValue as keyof typeof APP_CONSTANTS.LOAN_STATUS_LABELS] || statusValue;
  }

  // Verificar si es un estado válido
  static isValidStatus(statusValue: string): boolean {
    return Object.values(APP_CONSTANTS.LOAN_STATUS).includes(statusValue as any);
  }

  // Obtener todos los estados disponibles
  static getAvailableStatuses(): Array<{value: string, label: string}> {
    return Object.entries(APP_CONSTANTS.LOAN_STATUS_LABELS).map(([value, label]) => ({
      value,
      label
    }));
  }
  
  // Obtener clase CSS para estado
  static getStatusClass(statusValue: string): string {
    switch (statusValue) {
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      case 'disbursed': return 'status-disbursed';
      default: return 'status-pending';
    }
  }
}