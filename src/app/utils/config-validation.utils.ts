export class ConfigValidationUtils {
  // Validar configuración de aplicación
  static validateAppConfig(config: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!config || typeof config !== 'object') {
      errors.push('La configuración no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar nombre de la aplicación
    if (!config.appName || typeof config.appName !== 'string') {
      errors.push('appName es requerida y debe ser una cadena');
    }
    
    // Validar versión de la aplicación
    if (!config.appVersion || typeof config.appVersion !== 'string') {
      errors.push('appVersion es requerida y debe ser una cadena');
    }
    
    // Validar modo de producción
    if (config.production !== undefined && typeof config.production !== 'boolean') {
      errors.push('production debe ser un valor booleano');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validar configuración de red
  static validateNetworkConfig(config: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!config || typeof config !== 'object') {
      errors.push('La configuración de red no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar chain ID
    if (config.chainId !== undefined) {
      if (typeof config.chainId !== 'number' || !Number.isInteger(config.chainId) || config.chainId <= 0) {
        errors.push('chainId debe ser un número entero positivo');
      }
    }
    
    // Validar RPC URL
    if (config.rpcUrl !== undefined) {
      if (typeof config.rpcUrl !== 'string') {
        errors.push('rpcUrl debe ser una cadena');
      } else if (config.rpcUrl.trim().length === 0) {
        errors.push('rpcUrl no puede estar vacía');
      }
    }
    
    // Validar explorador de bloques
    if (config.blockExplorer !== undefined) {
      if (typeof config.blockExplorer !== 'string') {
        errors.push('blockExplorer debe ser una cadena');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validar configuración de contrato
  static validateContractConfig(config: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!config || typeof config !== 'object') {
      errors.push('La configuración de contrato no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar dirección del contrato
    if (!config.address || typeof config.address !== 'string') {
      errors.push('address es requerida y debe ser una cadena');
    }
    
    // Validar ABI
    if (!config.abi || !Array.isArray(config.abi)) {
      errors.push('abi es requerida y debe ser un array');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validar configuración de almacenamiento
  static validateStorageConfig(config: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!config || typeof config !== 'object') {
      errors.push('La configuración de almacenamiento no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar tipo de almacenamiento
    const validStorageTypes = ['localStorage', 'sessionStorage', 'indexedDB', 'memory'];
    if (config.type !== undefined && !validStorageTypes.includes(config.type)) {
      errors.push(`type debe ser uno de: ${validStorageTypes.join(', ')}`);
    }
    
    // Validar prefijo
    if (config.prefix !== undefined && typeof config.prefix !== 'string') {
      errors.push('prefix debe ser una cadena');
    }
    
    // Validar tiempo de expiración
    if (config.expiration !== undefined) {
      if (typeof config.expiration !== 'number' || config.expiration <= 0) {
        errors.push('expiration debe ser un número positivo');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validar configuración de seguridad
  static validateSecurityConfig(config: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!config || typeof config !== 'object') {
      errors.push('La configuración de seguridad no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar tiempo de expiración del token
    if (config.tokenExpiration !== undefined) {
      if (typeof config.tokenExpiration !== 'number' || config.tokenExpiration <= 0) {
        errors.push('tokenExpiration debe ser un número positivo');
      }
    }
    
    // Validar longitud mínima de contraseña
    if (config.minPasswordLength !== undefined) {
      if (typeof config.minPasswordLength !== 'number' || config.minPasswordLength < 1) {
        errors.push('minPasswordLength debe ser un número positivo');
      }
    }
    
    // Validar intentos máximos de inicio de sesión
    if (config.maxLoginAttempts !== undefined) {
      if (typeof config.maxLoginAttempts !== 'number' || config.maxLoginAttempts < 1) {
        errors.push('maxLoginAttempts debe ser un número positivo');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validar configuración de internacionalización
  static validateI18nConfig(config: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!config || typeof config !== 'object') {
      errors.push('La configuración de i18n no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar idioma por defecto
    if (config.defaultLanguage !== undefined) {
      if (typeof config.defaultLanguage !== 'string') {
        errors.push('defaultLanguage debe ser una cadena');
      } else if (!/^[a-z]{2}(-[A-Z]{2})?$/.test(config.defaultLanguage)) {
        errors.push('defaultLanguage debe tener formato de código de idioma (ej: es, en-US)');
      }
    }
    
    // Validar idiomas soportados
    if (config.supportedLanguages !== undefined) {
      if (!Array.isArray(config.supportedLanguages)) {
        errors.push('supportedLanguages debe ser un array');
      } else {
        for (const lang of config.supportedLanguages) {
          if (typeof lang !== 'string' || !/^[a-z]{2}(-[A-Z]{2})?$/.test(lang)) {
            errors.push(`Idioma inválido en supportedLanguages: ${lang}`);
          }
        }
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}