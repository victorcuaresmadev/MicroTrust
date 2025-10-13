export class ErrorValidationUtils {
  // Validar objeto de error
  static validateErrorObject(error: any): boolean {
    if (!error) return false;
    
    // Verificar que sea un objeto
    if (typeof error !== 'object') return false;
    
    // Verificar propiedades comunes de error
    return typeof error.message === 'string' || 
           typeof error.error === 'string' || 
           typeof error.code === 'string';
  }

  // Validar mensaje de error
  static validateErrorMessage(message: string): boolean {
    if (!message) return false;
    
    // Verificar que sea una cadena no vacía
    return typeof message === 'string' && message.trim().length > 0;
  }

  // Validar código de error
  static validateErrorCode(code: string): boolean {
    if (!code) return false;
    
    // Verificar que sea una cadena no vacía
    return typeof code === 'string' && code.trim().length > 0;
  }

  // Validar stack trace
  static validateStackTrace(stack: string): boolean {
    if (!stack) return true; // El stack trace es opcional
    
    // Verificar que sea una cadena
    return typeof stack === 'string';
  }

  // Validar error HTTP
  static validateHttpError(error: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Validar que sea un objeto
    if (!error || typeof error !== 'object') {
      errors.push('El error no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar status
    if (error.status !== undefined && typeof error.status !== 'number') {
      errors.push('El status del error debe ser un número');
    }
    
    // Validar mensaje
    if (error.message !== undefined && !this.validateErrorMessage(error.message)) {
      errors.push('El mensaje del error no es válido');
    }
    
    // Validar código
    if (error.code !== undefined && !this.validateErrorCode(error.code)) {
      errors.push('El código del error no es válido');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validar error de red
  static validateNetworkError(error: any): boolean {
    if (!this.validateErrorObject(error)) return false;
    
    // Verificar propiedades específicas de errores de red
    return error.name === 'NetworkError' || 
           (error.message && error.message.includes('network')) ||
           (error.message && error.message.includes('fetch'));
  }

  // Validar error de autenticación
  static validateAuthError(error: any): boolean {
    if (!this.validateErrorObject(error)) return false;
    
    // Verificar propiedades específicas de errores de autenticación
    return error.code === 'UNAUTHORIZED' || 
           error.status === 401 || 
           error.status === 403 ||
           (error.message && error.message.includes('authentication')) ||
           (error.message && error.message.includes('auth'));
  }
}