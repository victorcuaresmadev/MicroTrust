export class PromiseValidationUtils {
  // Validar que un valor sea una promesa
  static validatePromise(promise: any): boolean {
    return promise instanceof Promise || 
           (promise && typeof promise.then === 'function' && typeof promise.catch === 'function');
  }

  // Validar tiempo de espera
  static validateTimeout(timeout: number): boolean {
    return typeof timeout === 'number' && timeout > 0 && isFinite(timeout);
  }

  // Validar número de reintentos
  static validateRetryCount(retryCount: number): boolean {
    return Number.isInteger(retryCount) && retryCount >= 0;
  }

  // Validar delay entre reintentos
  static validateRetryDelay(delay: number): boolean {
    return typeof delay === 'number' && delay >= 0 && isFinite(delay);
  }

  // Validar límite de concurrencia
  static validateConcurrencyLimit(limit: number): boolean {
    return Number.isInteger(limit) && limit > 0 && limit <= 100; // Límite razonable
  }

  // Validar array de promesas
  static validatePromiseArray(promises: any[]): boolean {
    if (!Array.isArray(promises)) return false;
    
    return promises.every(promise => this.validatePromise(promise));
  }

  // Validar función que retorna promesa
  static validatePromiseFunction(fn: any): boolean {
    if (typeof fn !== 'function') return false;
    
    // No podemos validar directamente que retorne una promesa sin ejecutarla
    // Pero podemos verificar que sea una función
    return true;
  }

  // Validar configuración de retry
  static validateRetryConfig(config: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!config || typeof config !== 'object') {
      errors.push('La configuración de retry no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar maxRetries
    if (config.maxRetries !== undefined) {
      if (!this.validateRetryCount(config.maxRetries)) {
        errors.push('maxRetries debe ser un número entero no negativo');
      }
    }
    
    // Validar delay
    if (config.delay !== undefined) {
      if (!this.validateRetryDelay(config.delay)) {
        errors.push('delay debe ser un número no negativo');
      }
    }
    
    // Validar backoff
    if (config.backoff !== undefined) {
      if (typeof config.backoff !== 'boolean') {
        errors.push('backoff debe ser un valor booleano');
      }
    }
    
    // Validar factor de backoff
    if (config.backoffFactor !== undefined) {
      if (typeof config.backoffFactor !== 'number' || config.backoffFactor < 1) {
        errors.push('backoffFactor debe ser un número mayor o igual a 1');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validar configuración de timeout
  static validateTimeoutConfig(config: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!config || typeof config !== 'object') {
      errors.push('La configuración de timeout no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar timeout
    if (config.timeout !== undefined) {
      if (!this.validateTimeout(config.timeout)) {
        errors.push('timeout debe ser un número positivo');
      }
    }
    
    // Validar mensaje de timeout
    if (config.timeoutMessage !== undefined) {
      if (typeof config.timeoutMessage !== 'string') {
        errors.push('timeoutMessage debe ser una cadena');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validar configuración de concurrencia
  static validateConcurrencyConfig(config: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!config || typeof config !== 'object') {
      errors.push('La configuración de concurrencia no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar límite de concurrencia
    if (config.limit !== undefined) {
      if (!this.validateConcurrencyLimit(config.limit)) {
        errors.push('limit debe ser un número entero positivo no mayor a 100');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}