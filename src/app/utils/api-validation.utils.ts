export class ApiValidationUtils {
  // Validar endpoint de API
  static validateApiEndpoint(endpoint: string): boolean {
    if (typeof endpoint !== 'string') return false;
    return endpoint.trim().length > 0;
  }

  // Validar método HTTP
  static validateHttpMethod(method: string): boolean {
    const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];
    return validMethods.includes(method.toUpperCase());
  }

  // Validar headers de solicitud
  static validateRequestHeaders(headers: Record<string, string>): boolean {
    if (!headers || typeof headers !== 'object') return false;
    
    // Verificar que todas las claves y valores sean strings
    for (const [key, value] of Object.entries(headers)) {
      if (typeof key !== 'string' || typeof value !== 'string') {
        return false;
      }
    }
    
    return true;
  }

  // Validar parámetros de consulta
  static validateQueryParams(params: Record<string, string | number | boolean>): boolean {
    if (!params || typeof params !== 'object') return false;
    
    // Verificar tipos válidos para parámetros
    for (const [key, value] of Object.entries(params)) {
      if (typeof key !== 'string') return false;
      
      const valueType = typeof value;
      if (!['string', 'number', 'boolean'].includes(valueType)) {
        return false;
      }
    }
    
    return true;
  }

  // Validar cuerpo de solicitud
  static validateRequestBody(body: any): boolean {
    if (body === null || body === undefined) return true; // Cuerpo opcional
    
    // Verificar que sea un objeto serializable
    if (typeof body !== 'object') return false;
    
    try {
      JSON.stringify(body);
      return true;
    } catch {
      return false;
    }
  }

  // Validar código de estado HTTP
  static validateHttpStatus(status: number): boolean {
    return Number.isInteger(status) && status >= 100 && status < 600;
  }

  // Validar respuesta de API
  static validateApiResponse(response: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!response || typeof response !== 'object') {
      errors.push('La respuesta no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar status
    if (response.status !== undefined && !this.validateHttpStatus(response.status)) {
      errors.push('El status de la respuesta no es válido');
    }
    
    // Validar headers
    if (response.headers !== undefined && !this.validateRequestHeaders(response.headers)) {
      errors.push('Los headers de la respuesta no son válidos');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validar configuración de API
  static validateApiConfig(config: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!config || typeof config !== 'object') {
      errors.push('La configuración no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar baseURL
    if (!config.baseURL || typeof config.baseURL !== 'string') {
      errors.push('baseURL es requerida y debe ser una cadena');
    }
    
    // Validar timeout
    if (config.timeout !== undefined) {
      if (typeof config.timeout !== 'number' || config.timeout <= 0) {
        errors.push('timeout debe ser un número positivo');
      }
    }
    
    // Validar headers
    if (config.headers !== undefined && !this.validateRequestHeaders(config.headers)) {
      errors.push('headers no son válidos');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validar error de API
  static validateApiError(error: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!error || typeof error !== 'object') {
      errors.push('El error no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar mensaje
    if (error.message !== undefined && typeof error.message !== 'string') {
      errors.push('El mensaje del error debe ser una cadena');
    }
    
    // Validar código
    if (error.code !== undefined && typeof error.code !== 'string') {
      errors.push('El código del error debe ser una cadena');
    }
    
    // Validar status
    if (error.status !== undefined && !this.validateHttpStatus(error.status)) {
      errors.push('El status del error no es válido');
    }
    
    // Validar datos
    if (error.data !== undefined) {
      try {
        JSON.stringify(error.data);
      } catch {
        errors.push('Los datos del error no son serializables');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}