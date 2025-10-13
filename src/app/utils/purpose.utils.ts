import { APP_CONSTANTS } from '../constants/app.constants';

export class PurposeUtils {
  // Obtener etiqueta de propósito por valor
  static getPurposeLabel(purposeValue: string): string {
    const purpose = Object.values(APP_CONSTANTS.PURPOSE_TYPES).find(p => p.value === purposeValue);
    return purpose ? purpose.label : purposeValue;
  }

  // Obtener tasa de interés por valor de propósito
  static getInterestRate(purposeValue: string): number {
    const purpose = Object.values(APP_CONSTANTS.PURPOSE_TYPES).find(p => p.value === purposeValue);
    return purpose ? purpose.interestRate : APP_CONSTANTS.PURPOSE_TYPES.OTHER.interestRate;
  }

  // Verificar si es un propósito válido
  static isValidPurpose(purposeValue: string): boolean {
    return Object.values(APP_CONSTANTS.PURPOSE_TYPES).some(p => p.value === purposeValue);
  }

  // Obtener todos los tipos de propósito disponibles
  static getAvailablePurposes(): Array<{value: string, label: string, interestRate: number}> {
    return Object.values(APP_CONSTANTS.PURPOSE_TYPES);
  }
}