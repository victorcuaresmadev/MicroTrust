export class NumberValidationUtils {
  // Validar que sea un número
  static validateNumber(num: any): boolean {
    return typeof num === 'number' && !isNaN(num) && isFinite(num);
  }

  // Validar número entero
  static validateInteger(num: any): boolean {
    return Number.isInteger(num);
  }

  // Validar número positivo
  static validatePositive(num: any): boolean {
    return typeof num === 'number' && num > 0;
  }

  // Validar número negativo
  static validateNegative(num: any): boolean {
    return typeof num === 'number' && num < 0;
  }

  // Validar número no negativo
  static validateNonNegative(num: any): boolean {
    return typeof num === 'number' && num >= 0;
  }

  // Validar número no positivo
  static validateNonPositive(num: any): boolean {
    return typeof num === 'number' && num <= 0;
  }

  // Validar número dentro de un rango
  static validateInRange(num: any, min: number, max: number): boolean {
    if (typeof num !== 'number') return false;
    return num >= min && num <= max;
  }

  // Validar número par
  static validateEven(num: any): boolean {
    return Number.isInteger(num) && num % 2 === 0;
  }

  // Validar número impar
  static validateOdd(num: any): boolean {
    return Number.isInteger(num) && num % 2 !== 0;
  }

  // Validar número primo
  static validatePrime(num: any): boolean {
    if (!Number.isInteger(num) || num < 2) return false;
    
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return false;
    }
    
    return true;
  }

  // Validar número decimal con precisión específica
  static validateDecimalPrecision(num: any, precision: number): boolean {
    if (typeof num !== 'number') return false;
    
    const str = num.toString();
    const decimalIndex = str.indexOf('.');
    
    if (decimalIndex === -1) return true; // Número entero
    
    const decimalPlaces = str.length - decimalIndex - 1;
    return decimalPlaces <= precision;
  }

  // Validar número en formato monetario
  static validateCurrency(num: any): boolean {
    if (typeof num !== 'number') return false;
    return num >= 0 && this.validateDecimalPrecision(num, 2);
  }

  // Validar porcentaje
  static validatePercentage(num: any): boolean {
    if (typeof num !== 'number') return false;
    return num >= 0 && num <= 100;
  }

  // Validar número de teléfono (como número)
  static validatePhoneNumber(num: any): boolean {
    if (typeof num !== 'number') return false;
    const str = num.toString();
    return str.length >= 7 && str.length <= 15;
  }

  // Validar coordenada geográfica
  static validateCoordinate(num: any, isLatitude: boolean = true): boolean {
    if (typeof num !== 'number') return false;
    
    if (isLatitude) {
      return num >= -90 && num <= 90;
    } else {
      return num >= -180 && num <= 180;
    }
  }
}