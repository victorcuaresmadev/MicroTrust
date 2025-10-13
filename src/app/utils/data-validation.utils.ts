export class DataValidationUtils {
  // Validar esquema de datos
  static validateDataSchema(schema: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!schema || typeof schema !== 'object') {
      errors.push('El esquema de datos no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar nombre del esquema
    if (!schema.name || typeof schema.name !== 'string') {
      errors.push('name es requerido y debe ser una cadena');
    }
    
    // Validar campos
    if (!('fields' in schema) || typeof schema.fields !== 'object') {
      errors.push('fields es requerido y debe ser un objeto');
    } else {
      for (const [fieldName, fieldConfig] of Object.entries(schema.fields)) {
        if (typeof fieldName !== 'string') {
          errors.push('Los nombres de campo deben ser cadenas');
          break;
        }
        
        if (typeof fieldConfig !== 'object') {
          errors.push(`La configuración del campo ${fieldName} debe ser un objeto`);
          break;
        }
        
        const fieldValidation = this.validateFieldConfig(fieldConfig as any);
        if (!fieldValidation.isValid) {
          errors.push(...fieldValidation.errors.map(err => `field ${fieldName} error: ${err}`));
        }
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validar configuración de campo
  static validateFieldConfig(config: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!config || typeof config !== 'object') {
      errors.push('La configuración del campo no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar tipo
    if (!config.type || typeof config.type !== 'string') {
      errors.push('type es requerido y debe ser una cadena');
    } else {
      const validTypes = ['string', 'number', 'boolean', 'date', 'object', 'array'];
      if (!validTypes.includes(config.type)) {
        errors.push(`type debe ser uno de: ${validTypes.join(', ')}`);
      }
    }
    
    // Validar requerido (opcional)
    if ('required' in config) {
      if (typeof config.required !== 'boolean') {
        errors.push('required debe ser un valor booleano');
      }
    }
    
    // Validar valor por defecto (opcional)
    if ('default' in config) {
      const defaultValueValidation = this.validateFieldValue(config.default, config.type);
      if (!defaultValueValidation.isValid) {
        errors.push(...defaultValueValidation.errors.map(err => `default value error: ${err}`));
      }
    }
    
    // Validar validaciones personalizadas (opcional)
    if ('validations' in config) {
      if (!Array.isArray(config.validations)) {
        errors.push('validations debe ser un array');
      } else {
        for (const validation of config.validations) {
          const validationValidation = this.validateCustomValidation(validation);
          if (!validationValidation.isValid) {
            errors.push(...validationValidation.errors.map(err => `validation error: ${err}`));
          }
        }
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validar valor de campo
  static validateFieldValue(value: any, type: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    switch (type) {
      case 'string':
        if (typeof value !== 'string') {
          errors.push('El valor debe ser una cadena');
        }
        break;
        
      case 'number':
        if (typeof value !== 'number' || !isFinite(value)) {
          errors.push('El valor debe ser un número finito');
        }
        break;
        
      case 'boolean':
        if (typeof value !== 'boolean') {
          errors.push('El valor debe ser un booleano');
        }
        break;
        
      case 'date':
        if (!(value instanceof Date) || isNaN(value.getTime())) {
          errors.push('El valor debe ser una fecha válida');
        }
        break;
        
      case 'object':
        if (typeof value !== 'object' || value === null || Array.isArray(value)) {
          errors.push('El valor debe ser un objeto');
        }
        break;
        
      case 'array':
        if (!Array.isArray(value)) {
          errors.push('El valor debe ser un array');
        }
        break;
        
      default:
        errors.push(`Tipo de campo no soportado: ${type}`);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validar validación personalizada
  static validateCustomValidation(validation: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!validation || typeof validation !== 'object') {
      errors.push('La validación personalizada no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar nombre
    if (!validation.name || typeof validation.name !== 'string') {
      errors.push('name es requerido y debe ser una cadena');
    }
    
    // Validar función de validación
    if (!validation.validator || typeof validation.validator !== 'function') {
      errors.push('validator es requerido y debe ser una función');
    }
    
    // Validar mensaje de error
    if (!validation.message || typeof validation.message !== 'string') {
      errors.push('message es requerido y debe ser una cadena');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validar datos según esquema
  static validateDataAgainstSchema(data: any, schema: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!data || typeof data !== 'object') {
      errors.push('Los datos no son un objeto válido');
      return { isValid: false, errors };
    }
    
    if (!schema || typeof schema !== 'object') {
      errors.push('El esquema no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar campos requeridos
    for (const [fieldName, fieldConfig] of Object.entries(schema.fields)) {
      const config = fieldConfig as any;
      
      // Verificar si el campo es requerido
      if (config.required && !(fieldName in data)) {
        errors.push(`El campo requerido ${fieldName} no está presente`);
        continue;
      }
      
      // Si el campo está presente, validar su valor
      if (fieldName in data) {
        const valueValidation = this.validateFieldValue(data[fieldName], config.type);
        if (!valueValidation.isValid) {
          errors.push(...valueValidation.errors.map(err => `field ${fieldName} error: ${err}`));
        }
        
        // Validar contra validaciones personalizadas
        if (config.validations && Array.isArray(config.validations)) {
          for (const validation of config.validations) {
            if (typeof validation.validator === 'function') {
              try {
                const result = validation.validator(data[fieldName]);
                if (!result) {
                  errors.push(`field ${fieldName} ${validation.message}`);
                }
              } catch (error) {
                errors.push(`field ${fieldName} error en validación personalizada: ${error}`);
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

  // Validar formato de datos
  static validateDataFormat(data: any, format: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!data) {
      errors.push('Los datos son requeridos');
      return { isValid: false, errors };
    }
    
    switch (format) {
      case 'json':
        try {
          JSON.stringify(data);
        } catch (error) {
          errors.push('Los datos no son serializables a JSON');
        }
        break;
        
      case 'xml':
        if (typeof data !== 'string') {
          errors.push('Los datos XML deben ser una cadena');
        } else {
          // Validación básica de XML
          const xmlRegex = /^<\?xml.*\?>[\s\S]*$/;
          if (!xmlRegex.test(data)) {
            errors.push('Los datos no tienen un formato XML válido');
          }
        }
        break;
        
      case 'csv':
        if (typeof data !== 'string') {
          errors.push('Los datos CSV deben ser una cadena');
        } else {
          // Validación básica de CSV
          if (data.indexOf('\n') === -1) {
            errors.push('Los datos CSV deben contener al menos una línea');
          }
        }
        break;
        
      default:
        errors.push(`Formato no soportado: ${format}`);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validar tamaño de datos
  static validateDataSize(data: any, maxSize: number): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!data) {
      errors.push('Los datos son requeridos');
      return { isValid: false, errors };
    }
    
    if (typeof maxSize !== 'number' || maxSize <= 0) {
      errors.push('maxSize debe ser un número positivo');
      return { isValid: false, errors };
    }
    
    try {
      const serializedData = JSON.stringify(data);
      const sizeInBytes = new Blob([serializedData]).size;
      
      if (sizeInBytes > maxSize) {
        errors.push(`Los datos exceden el tamaño máximo de ${maxSize} bytes`);
      }
    } catch (error) {
      errors.push('Error al calcular el tamaño de los datos');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validar estructura de datos
  static validateDataStructure(data: any, structure: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!data || typeof data !== 'object') {
      errors.push('Los datos no son un objeto válido');
      return { isValid: false, errors };
    }
    
    if (!structure || typeof structure !== 'object') {
      errors.push('La estructura no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar que todos los campos requeridos en la estructura estén presentes
    for (const [key, value] of Object.entries(structure)) {
      if (!(key in data)) {
        errors.push(`El campo requerido ${key} no está presente`);
        continue;
      }
      
      // Si el valor en la estructura es un objeto, validar recursivamente
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        const nestedValidation = this.validateDataStructure(data[key], value);
        if (!nestedValidation.isValid) {
          errors.push(...nestedValidation.errors.map(err => `nested field ${key} error: ${err}`));
        }
      }
      // Si el valor en la estructura es un array, validar que el dato sea un array
      else if (Array.isArray(value)) {
        if (!Array.isArray(data[key])) {
          errors.push(`El campo ${key} debe ser un array`);
        }
      }
      // Si el valor en la estructura es un tipo primitivo, validar el tipo
      else {
        const expectedType = typeof value;
        const actualType = typeof data[key];
        
        if (expectedType !== actualType) {
          errors.push(`El campo ${key} debe ser de tipo ${expectedType}, pero es ${actualType}`);
        }
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}