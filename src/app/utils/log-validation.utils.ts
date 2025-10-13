export class LogValidationUtils {
  // Validar nivel de log
  static validateLogLevel(level: string): boolean {
    const validLevels = ['debug', 'info', 'warn', 'error'];
    return validLevels.includes(level.toLowerCase());
  }

  // Validar mensaje de log
  static validateLogMessage(message: string): boolean {
    return typeof message === 'string' && message.trim().length > 0;
  }

  // Validar datos de contexto
  static validateLogContext(context: any): boolean {
    if (context === null || context === undefined) return true; // Contexto opcional
    
    // Verificar que sea un objeto serializable
    if (typeof context !== 'object') return false;
    
    try {
      JSON.stringify(context);
      return true;
    } catch {
      return false;
    }
  }

  // Validar timestamp de log
  static validateLogTimestamp(timestamp: Date): boolean {
    return timestamp instanceof Date && !isNaN(timestamp.getTime());
  }

  // Validar origen del log
  static validateLogSource(source: string): boolean {
    return typeof source === 'string' && source.trim().length > 0;
  }

  // Validar entrada de log completa
  static validateLogEntry(entry: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!entry || typeof entry !== 'object') {
      errors.push('La entrada de log no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar nivel
    if (!entry.level || !this.validateLogLevel(entry.level)) {
      errors.push('El nivel de log no es válido');
    }
    
    // Validar mensaje
    if (!entry.message || !this.validateLogMessage(entry.message)) {
      errors.push('El mensaje de log no es válido');
    }
    
    // Validar timestamp
    if (!entry.timestamp || !this.validateLogTimestamp(entry.timestamp)) {
      errors.push('El timestamp de log no es válido');
    }
    
    // Validar origen (opcional)
    if (entry.source !== undefined && !this.validateLogSource(entry.source)) {
      errors.push('El origen del log no es válido');
    }
    
    // Validar contexto (opcional)
    if (entry.context !== undefined && !this.validateLogContext(entry.context)) {
      errors.push('El contexto del log no es válido');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validar configuración de logger
  static validateLoggerConfig(config: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!config || typeof config !== 'object') {
      errors.push('La configuración del logger no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar nivel mínimo
    if (config.minLevel !== undefined && !this.validateLogLevel(config.minLevel)) {
      errors.push('minLevel no es un nivel de log válido');
    }
    
    // Validar formato
    if (config.format !== undefined) {
      const validFormats = ['json', 'text', 'simple'];
      if (typeof config.format !== 'string' || !validFormats.includes(config.format)) {
        errors.push(`format debe ser uno de: ${validFormats.join(', ')}`);
      }
    }
    
    // Validar salida
    if (config.output !== undefined) {
      const validOutputs = ['console', 'file', 'network', 'memory'];
      if (typeof config.output !== 'string' || !validOutputs.includes(config.output)) {
        errors.push(`output debe ser uno de: ${validOutputs.join(', ')}`);
      }
    }
    
    // Validar tamaño máximo de archivo
    if (config.maxFileSize !== undefined) {
      if (typeof config.maxFileSize !== 'number' || config.maxFileSize <= 0) {
        errors.push('maxFileSize debe ser un número positivo');
      }
    }
    
    // Validar número máximo de archivos
    if (config.maxFiles !== undefined) {
      if (typeof config.maxFiles !== 'number' || config.maxFiles <= 0 || !Number.isInteger(config.maxFiles)) {
        errors.push('maxFiles debe ser un número entero positivo');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validar error de log
  static validateLogError(error: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!error || typeof error !== 'object') {
      errors.push('El error de log no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar mensaje
    if (!error.message || typeof error.message !== 'string') {
      errors.push('El mensaje del error debe ser una cadena');
    }
    
    // Validar stack trace (opcional)
    if (error.stack !== undefined && typeof error.stack !== 'string') {
      errors.push('El stack trace del error debe ser una cadena');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}