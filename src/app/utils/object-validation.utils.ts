export class ObjectValidationUtils {
  // Validar que sea un objeto
  static validateObject(obj: any): boolean {
    return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
  }

  // Validar que un objeto no esté vacío
  static validateNonEmptyObject(obj: any): boolean {
    return this.validateObject(obj) && Object.keys(obj).length > 0;
  }

  // Validar propiedades requeridas
  static validateRequiredProperties(obj: any, requiredProps: string[]): boolean {
    if (!this.validateObject(obj)) return false;
    
    return requiredProps.every(prop => prop in obj);
  }

  // Validar tipos de propiedades
  static validatePropertyTypes(obj: any, typeMap: Record<string, string>): boolean {
    if (!this.validateObject(obj)) return false;
    
    for (const [prop, expectedType] of Object.entries(typeMap)) {
      if (!(prop in obj)) continue; // Propiedad opcional
      
      const actualType = typeof obj[prop];
      if (actualType !== expectedType) {
        // Manejar casos especiales
        if (expectedType === 'array' && Array.isArray(obj[prop])) continue;
        if (expectedType === 'null' && obj[prop] === null) continue;
        if (expectedType === 'integer' && Number.isInteger(obj[prop])) continue;
        
        return false;
      }
    }
    
    return true;
  }

  // Validar rango de valores numéricos
  static validateNumericRanges(obj: any, rangeMap: Record<string, { min: number; max: number }>): boolean {
    if (!this.validateObject(obj)) return false;
    
    for (const [prop, range] of Object.entries(rangeMap)) {
      if (!(prop in obj)) continue; // Propiedad opcional
      
      const value = obj[prop];
      if (typeof value !== 'number') return false;
      
      if (value < range.min || value > range.max) return false;
    }
    
    return true;
  }

  // Validar patrones de strings
  static validateStringPatterns(obj: any, patternMap: Record<string, RegExp>): boolean {
    if (!this.validateObject(obj)) return false;
    
    for (const [prop, pattern] of Object.entries(patternMap)) {
      if (!(prop in obj)) continue; // Propiedad opcional
      
      const value = obj[prop];
      if (typeof value !== 'string') return false;
      
      if (!pattern.test(value)) return false;
    }
    
    return true;
  }

  // Validar objeto anidado
  static validateNestedObject(obj: any, nestedValidators: Record<string, (value: any) => boolean>): boolean {
    if (!this.validateObject(obj)) return false;
    
    for (const [prop, validator] of Object.entries(nestedValidators)) {
      if (!(prop in obj)) continue; // Propiedad opcional
      
      if (!validator(obj[prop])) return false;
    }
    
    return true;
  }

  // Validar objeto con esquema completo
  static validateObjectSchema(
    obj: any,
    schema: {
      required?: string[];
      types?: Record<string, string>;
      ranges?: Record<string, { min: number; max: number }>;
      patterns?: Record<string, RegExp>;
      nested?: Record<string, (value: any) => boolean>;
    }
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Validar que sea un objeto
    if (!this.validateObject(obj)) {
      errors.push('El valor no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar propiedades requeridas
    if (schema.required) {
      const missingProps = schema.required.filter(prop => !(prop in obj));
      if (missingProps.length > 0) {
        errors.push(`Faltan las propiedades requeridas: ${missingProps.join(', ')}`);
      }
    }
    
    // Validar tipos de propiedades
    if (schema.types) {
      for (const [prop, expectedType] of Object.entries(schema.types)) {
        if (!(prop in obj)) continue; // Propiedad opcional
        
        const actualType = typeof obj[prop];
        let isValidType = actualType === expectedType;
        
        // Manejar casos especiales
        if (!isValidType) {
          if (expectedType === 'array' && Array.isArray(obj[prop])) isValidType = true;
          if (expectedType === 'null' && obj[prop] === null) isValidType = true;
          if (expectedType === 'integer' && Number.isInteger(obj[prop])) isValidType = true;
        }
        
        if (!isValidType) {
          errors.push(`La propiedad "${prop}" debe ser de tipo ${expectedType}, pero es ${actualType}`);
        }
      }
    }
    
    // Validar rangos numéricos
    if (schema.ranges) {
      for (const [prop, range] of Object.entries(schema.ranges)) {
        if (!(prop in obj)) continue; // Propiedad opcional
        
        const value = obj[prop];
        if (typeof value !== 'number') {
          errors.push(`La propiedad "${prop}" debe ser un número para validar el rango`);
          continue;
        }
        
        if (value < range.min || value > range.max) {
          errors.push(`La propiedad "${prop}" debe estar entre ${range.min} y ${range.max}`);
        }
      }
    }
    
    // Validar patrones de strings
    if (schema.patterns) {
      for (const [prop, pattern] of Object.entries(schema.patterns)) {
        if (!(prop in obj)) continue; // Propiedad opcional
        
        const value = obj[prop];
        if (typeof value !== 'string') {
          errors.push(`La propiedad "${prop}" debe ser una cadena para validar el patrón`);
          continue;
        }
        
        if (!pattern.test(value)) {
          errors.push(`La propiedad "${prop}" no cumple con el patrón requerido`);
        }
      }
    }
    
    // Validar objetos anidados
    if (schema.nested) {
      for (const [prop, validator] of Object.entries(schema.nested)) {
        if (!(prop in obj)) continue; // Propiedad opcional
        
        if (!validator(obj[prop])) {
          errors.push(`La propiedad "${prop}" no cumple con la validación anidada`);
        }
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}