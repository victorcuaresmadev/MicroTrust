export class StringValidationUtils {
  // Validar que sea una cadena
  static validateString(str: any): boolean {
    return typeof str === 'string';
  }

  // Validar cadena no vacía
  static validateNonEmptyString(str: any): boolean {
    return typeof str === 'string' && str.trim().length > 0;
  }

  // Validar longitud mínima
  static validateMinLength(str: string, minLength: number): boolean {
    if (typeof str !== 'string') return false;
    return str.length >= minLength;
  }

  // Validar longitud máxima
  static validateMaxLength(str: string, maxLength: number): boolean {
    if (typeof str !== 'string') return false;
    return str.length <= maxLength;
  }

  // Validar longitud exacta
  static validateExactLength(str: string, length: number): boolean {
    if (typeof str !== 'string') return false;
    return str.length === length;
  }

  // Validar patrón con expresión regular
  static validatePattern(str: string, pattern: RegExp): boolean {
    if (typeof str !== 'string') return false;
    return pattern.test(str);
  }

  // Validar correo electrónico
  static validateEmail(email: string): boolean {
    if (typeof email !== 'string') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validar URL
  static validateUrl(url: string): boolean {
    if (typeof url !== 'string') return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Validar número de teléfono
  static validatePhone(phone: string): boolean {
    if (typeof phone !== 'string') return false;
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone);
  }

  // Validar código postal
  static validatePostalCode(postalCode: string): boolean {
    if (typeof postalCode !== 'string') return false;
    const postalCodeRegex = /^[A-Za-z0-9\s\-]{3,10}$/;
    return postalCodeRegex.test(postalCode);
  }

  // Validar que contenga solo letras
  static validateLettersOnly(str: string): boolean {
    if (typeof str !== 'string') return false;
    return /^[A-Za-z\s]+$/.test(str);
  }

  // Validar que contenga solo números
  static validateNumbersOnly(str: string): boolean {
    if (typeof str !== 'string') return false;
    return /^\d+$/.test(str);
  }

  // Validar que contenga solo letras y números
  static validateAlphanumeric(str: string): boolean {
    if (typeof str !== 'string') return false;
    return /^[A-Za-z0-9]+$/.test(str);
  }

  // Validar cadena con caracteres especiales permitidos
  static validateWithAllowedSpecialChars(str: string, allowedChars: string = ''): boolean {
    if (typeof str !== 'string') return false;
    const specialCharsRegex = new RegExp(`^[A-Za-z0-9${allowedChars.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}]+$`);
    return specialCharsRegex.test(str);
  }

  // Validar cadena JSON
  static validateJsonString(str: string): boolean {
    if (typeof str !== 'string') return false;
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  }

  // Validar cadena base64
  static validateBase64(str: string): boolean {
    if (typeof str !== 'string') return false;
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    return base64Regex.test(str);
  }
}