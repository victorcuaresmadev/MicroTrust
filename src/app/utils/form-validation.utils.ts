export class FormValidationUtils {
  // Validar campo requerido
  static validateRequired(value: any): boolean {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return true;
  }

  // Validar longitud mínima
  static validateMinLength(value: string, minLength: number): boolean {
    if (typeof value !== 'string') return false;
    return value.trim().length >= minLength;
  }

  // Validar longitud máxima
  static validateMaxLength(value: string, maxLength: number): boolean {
    if (typeof value !== 'string') return false;
    return value.trim().length <= maxLength;
  }

  // Validar rango de longitud
  static validateLengthRange(value: string, minLength: number, maxLength: number): boolean {
    if (typeof value !== 'string') return false;
    const length = value.trim().length;
    return length >= minLength && length <= maxLength;
  }

  // Validar número positivo
  static validatePositiveNumber(value: number): boolean {
    return typeof value === 'number' && value > 0;
  }

  // Validar número no negativo
  static validateNonNegativeNumber(value: number): boolean {
    return typeof value === 'number' && value >= 0;
  }

  // Validar rango numérico
  static validateNumberRange(value: number, min: number, max: number): boolean {
    return typeof value === 'number' && value >= min && value <= max;
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

  // Validar campo booleano
  static validateBoolean(value: any): boolean {
    return typeof value === 'boolean';
  }

  // Validar campo de selección (no vacío)
  static validateSelection(value: any): boolean {
    return value !== null && value !== undefined && value !== '';
  }

  // Validar array de selección múltiple
  static validateMultipleSelection(values: any[]): boolean {
    return Array.isArray(values) && values.length > 0;
  }

  // Validar checkbox
  static validateCheckbox(checked: boolean, required: boolean = false): boolean {
    if (!required) return true;
    return checked === true;
  }

  // Validar campo de archivo
  static validateFile(file: any, allowedTypes: string[] = [], maxSize: number = 0): boolean {
    if (!file) return false;
    
    // Validar tipo de archivo
    if (allowedTypes.length > 0 && file.type) {
      if (!allowedTypes.includes(file.type)) return false;
    }
    
    // Validar tamaño de archivo
    if (maxSize > 0 && file.size) {
      if (file.size > maxSize) return false;
    }
    
    return true;
  }

  // Validar formulario completo
  static validateForm(
    formData: Record<string, any>,
    validationRules: Record<string, (value: any) => boolean>
  ): { isValid: boolean; errors: Record<string, boolean> } {
    const errors: Record<string, boolean> = {};
    let isValid = true;
    
    for (const [field, validator] of Object.entries(validationRules)) {
      const value = formData[field];
      const isFieldValid = validator(value);
      
      if (!isFieldValid) {
        errors[field] = true;
        isValid = false;
      }
    }
    
    return {
      isValid,
      errors
    };
  }
}