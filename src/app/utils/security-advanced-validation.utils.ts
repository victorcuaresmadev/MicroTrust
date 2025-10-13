export class SecurityAdvancedValidationUtils {
  // Validar política de contenido (CSP)
  static validateContentSecurityPolicy(csp: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!csp || typeof csp !== 'object') {
      errors.push('La política de contenido no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar directivas
    const validDirectives = [
      'default-src', 'script-src', 'style-src', 'img-src', 'font-src',
      'connect-src', 'media-src', 'object-src', 'child-src', 'frame-src',
      'worker-src', 'manifest-src', 'base-uri', 'form-action', 'frame-ancestors'
    ];
    
    for (const [directive, sources] of Object.entries(csp)) {
      if (!validDirectives.includes(directive)) {
        errors.push(`Directiva CSP inválida: ${directive}`);
        continue;
      }
      
      if (typeof sources !== 'string' && !Array.isArray(sources)) {
        errors.push(`Las fuentes para ${directive} deben ser una cadena o array`);
        continue;
      }
      
      // Validar fuentes individuales si es un array
      if (Array.isArray(sources)) {
        for (const source of sources) {
          if (typeof source !== 'string') {
            errors.push(`Cada fuente en ${directive} debe ser una cadena`);
            break;
          }
        }
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validar header de seguridad
  static validateSecurityHeader(header: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!header || typeof header !== 'object') {
      errors.push('El header de seguridad no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar nombre
    if (!header.name || typeof header.name !== 'string') {
      errors.push('name es requerido y debe ser una cadena');
    }
    
    // Validar valor
    if (!header.value || typeof header.value !== 'string') {
      errors.push('value es requerido y debe ser una cadena');
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
    
    // Validar CSP (opcional)
    if ('csp' in config) {
      const cspValidation = this.validateContentSecurityPolicy(config.csp);
      if (!cspValidation.isValid) {
        errors.push(...cspValidation.errors.map(err => `CSP error: ${err}`));
      }
    }
    
    // Validar headers de seguridad (opcional)
    if ('securityHeaders' in config) {
      if (!Array.isArray(config.securityHeaders)) {
        errors.push('securityHeaders debe ser un array');
      } else {
        for (const header of config.securityHeaders) {
          const headerValidation = this.validateSecurityHeader(header);
          if (!headerValidation.isValid) {
            errors.push(...headerValidation.errors.map(err => `header error: ${err}`));
          }
        }
      }
    }
    
    // Validar HSTS (opcional)
    if ('hsts' in config) {
      if (typeof config.hsts !== 'object') {
        errors.push('hsts debe ser un objeto');
      } else {
        if ('maxAge' in config.hsts) {
          if (typeof config.hsts.maxAge !== 'number' || config.hsts.maxAge <= 0) {
            errors.push('hsts.maxAge debe ser un número positivo');
          }
        }
        
        if ('includeSubDomains' in config.hsts) {
          if (typeof config.hsts.includeSubDomains !== 'boolean') {
            errors.push('hsts.includeSubDomains debe ser un valor booleano');
          }
        }
        
        if ('preload' in config.hsts) {
          if (typeof config.hsts.preload !== 'boolean') {
            errors.push('hsts.preload debe ser un valor booleano');
          }
        }
      }
    }
    
    // Validar CORS (opcional)
    if ('cors' in config) {
      if (typeof config.cors !== 'object') {
        errors.push('cors debe ser un objeto');
      } else {
        if ('origins' in config.cors) {
          if (!Array.isArray(config.cors.origins)) {
            errors.push('cors.origins debe ser un array');
          } else {
            for (const origin of config.cors.origins) {
              if (typeof origin !== 'string') {
                errors.push('Cada origen en cors.origins debe ser una cadena');
                break;
              }
            }
          }
        }
        
        if ('methods' in config.cors) {
          if (!Array.isArray(config.cors.methods)) {
            errors.push('cors.methods debe ser un array');
          } else {
            const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];
            for (const method of config.cors.methods) {
              if (typeof method !== 'string' || !validMethods.includes(method.toUpperCase())) {
                errors.push(`Método CORS inválido: ${method}`);
                break;
              }
            }
          }
        }
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validar token JWT
  static validateJwtToken(token: string): boolean {
    if (typeof token !== 'string') return false;
    
    // Verificar formato de token JWT
    const tokenRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
    return tokenRegex.test(token);
  }

  // Validar claim de JWT
  static validateJwtClaim(claim: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!claim || typeof claim !== 'object') {
      errors.push('El claim de JWT no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar issuer (opcional)
    if ('iss' in claim) {
      if (typeof claim.iss !== 'string') {
        errors.push('iss debe ser una cadena');
      }
    }
    
    // Validar subject (opcional)
    if ('sub' in claim) {
      if (typeof claim.sub !== 'string') {
        errors.push('sub debe ser una cadena');
      }
    }
    
    // Validar audience (opcional)
    if ('aud' in claim) {
      if (typeof claim.aud !== 'string' && !Array.isArray(claim.aud)) {
        errors.push('aud debe ser una cadena o array');
      }
    }
    
    // Validar expiration (opcional)
    if ('exp' in claim) {
      if (typeof claim.exp !== 'number' || claim.exp <= 0) {
        errors.push('exp debe ser un número positivo');
      }
    }
    
    // Validar not before (opcional)
    if ('nbf' in claim) {
      if (typeof claim.nbf !== 'number' || claim.nbf <= 0) {
        errors.push('nbf debe ser un número positivo');
      }
    }
    
    // Validar issued at (opcional)
    if ('iat' in claim) {
      if (typeof claim.iat !== 'number' || claim.iat <= 0) {
        errors.push('iat debe ser un número positivo');
      }
    }
    
    // Validar JWT ID (opcional)
    if ('jti' in claim) {
      if (typeof claim.jti !== 'string') {
        errors.push('jti debe ser una cadena');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validar política de rate limiting
  static validateRateLimitPolicy(policy: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!policy || typeof policy !== 'object') {
      errors.push('La política de rate limiting no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar ventana de tiempo
    if (!policy.windowMs || typeof policy.windowMs !== 'number' || policy.windowMs <= 0) {
      errors.push('windowMs es requerido y debe ser un número positivo');
    }
    
    // Validar límite máximo
    if (!policy.max || typeof policy.max !== 'number' || policy.max <= 0) {
      errors.push('max es requerido y debe ser un número positivo');
    }
    
    // Validar mensaje (opcional)
    if ('message' in policy) {
      if (typeof policy.message !== 'string') {
        errors.push('message debe ser una cadena');
      }
    }
    
    // Validar código de estado (opcional)
    if ('statusCode' in policy) {
      if (typeof policy.statusCode !== 'number' || policy.statusCode < 400 || policy.statusCode >= 600) {
        errors.push('statusCode debe ser un código de estado HTTP válido (400-599)');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validar input sanitizado
  static validateSanitizedInput(input: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (input === null || input === undefined) {
      return { isValid: true, errors };
    }
    
    // Verificar que no contenga scripts peligrosos
    const dangerousPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
      /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi
    ];
    
    const inputString = typeof input === 'string' ? input : JSON.stringify(input);
    
    for (const pattern of dangerousPatterns) {
      if (pattern.test(inputString)) {
        errors.push('El input contiene patrones peligrosos');
        break;
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validar política de cookies
  static validateCookiePolicy(policy: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!policy || typeof policy !== 'object') {
      errors.push('La política de cookies no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar secure (opcional)
    if ('secure' in policy) {
      if (typeof policy.secure !== 'boolean') {
        errors.push('secure debe ser un valor booleano');
      }
    }
    
    // Validar httpOnly (opcional)
    if ('httpOnly' in policy) {
      if (typeof policy.httpOnly !== 'boolean') {
        errors.push('httpOnly debe ser un valor booleano');
      }
    }
    
    // Validar sameSite (opcional)
    if ('sameSite' in policy) {
      const validSameSite = ['Strict', 'Lax', 'None'];
      if (typeof policy.sameSite !== 'string' || !validSameSite.includes(policy.sameSite)) {
        errors.push(`sameSite debe ser uno de: ${validSameSite.join(', ')}`);
      }
    }
    
    // Validar domain (opcional)
    if ('domain' in policy) {
      if (typeof policy.domain !== 'string') {
        errors.push('domain debe ser una cadena');
      }
    }
    
    // Validar path (opcional)
    if ('path' in policy) {
      if (typeof policy.path !== 'string') {
        errors.push('path debe ser una cadena');
      }
    }
    
    // Validar maxAge (opcional)
    if ('maxAge' in policy) {
      if (typeof policy.maxAge !== 'number' || policy.maxAge < 0) {
        errors.push('maxAge debe ser un número no negativo');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validar política de permisos
  static validatePermissionPolicy(policy: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!policy || typeof policy !== 'object') {
      errors.push('La política de permisos no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar permisos
    const validPermissions = [
      'geolocation', 'midi', 'notifications', 'push', 'sync-xhr',
      'microphone', 'camera', 'magnetometer', 'gyroscope',
      'fullscreen', 'payment', 'usb', 'vr', 'xr-spatial-tracking'
    ];
    
    for (const [permission, value] of Object.entries(policy)) {
      if (!validPermissions.includes(permission)) {
        errors.push(`Permiso inválido: ${permission}`);
        continue;
      }
      
      if (typeof value !== 'string') {
        errors.push(`El valor para ${permission} debe ser una cadena`);
        continue;
      }
      
      const validValues = ['self', '*', 'none'];
      if (!validValues.includes(value) && !value.startsWith('https://')) {
        errors.push(`Valor inválido para ${permission}: ${value}`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}