import { ValidationUtils } from './validation.utils';

/**
 * @file state-validation.utils.ts
 * @description Utilidades de validación avanzada para estado en el sistema MicroTrust
 * @author Víctor Cuaresma <victor.cuaresma@utec.edu.pe>
 * @copyright 2025-2026 Víctor Cuaresma
 * @since 2025-10-13
 * @version 1.0.0
 */

/**
 * @class StateValidationUtils
 * @description Clase que contiene métodos de validación para estado de la aplicación
 */
export class StateValidationUtils {
  /**
   * @method validateStateConfig
   * @description Valida la configuración del estado de la aplicación
   * @param {any} config - Configuración de estado a validar
   * @returns {object} Resultado de validación con isValid y errors
   */
  static validateStateConfig(config: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!config || typeof config !== 'object') {
      errors.push('La configuración de estado no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar nombre del estado
    if (!('name' in config)) {
      errors.push('name es requerido');
    } else if (typeof config.name !== 'string') {
      errors.push('name debe ser una cadena');
    } else if (config.name.length === 0) {
      errors.push('name no puede estar vacío');
    } else if (config.name.length > 100) {
      errors.push('name no debe exceder 100 caracteres');
    }
    
    // Validar propiedades del estado
    if ('properties' in config) {
      if (typeof config.properties !== 'object') {
        errors.push('properties debe ser un objeto');
      } else {
        for (const [propName, propConfig] of Object.entries(config.properties)) {
          if (typeof propName !== 'string') {
            errors.push('Los nombres de propiedad deben ser cadenas');
            break;
          }
          
          if (typeof propConfig !== 'object') {
            errors.push(`La configuración de propiedad ${propName} debe ser un objeto`);
            break;
          }
          
          const propValidation = this.validatePropertyConfig(propConfig as any);
          if (!propValidation.isValid) {
            errors.push(...propValidation.errors.map(err => `property ${propName} error: ${err}`));
          }
        }
      }
    }
    
    // Validar acciones
    if ('actions' in config) {
      if (!Array.isArray(config.actions)) {
        errors.push('actions debe ser un array');
      } else {
        for (let i = 0; i < config.actions.length; i++) {
          const actionValidation = this.validateActionConfig(config.actions[i]);
          if (!actionValidation.isValid) {
            errors.push(...actionValidation.errors.map(err => `action[${i}] error: ${err}`));
          }
        }
      }
    }
    
    // Validar middlewares
    if ('middlewares' in config) {
      if (!Array.isArray(config.middlewares)) {
        errors.push('middlewares debe ser un array');
      } else {
        for (let i = 0; i < config.middlewares.length; i++) {
          const middlewareValidation = this.validateMiddlewareConfig(config.middlewares[i]);
          if (!middlewareValidation.isValid) {
            errors.push(...middlewareValidation.errors.map(err => `middleware[${i}] error: ${err}`));
          }
        }
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * @method validatePropertyConfig
   * @description Valida la configuración de una propiedad de estado
   * @param {any} config - Configuración de propiedad a validar
   * @returns {object} Resultado de validación con isValid y errors
   */
  static validatePropertyConfig(config: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!config || typeof config !== 'object') {
      errors.push('La configuración de propiedad no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar tipo de propiedad
    if (!('type' in config)) {
      errors.push('type es requerido');
    } else {
      const validTypes = ['string', 'number', 'boolean', 'array', 'object', 'null', 'undefined'];
      if (typeof config.type !== 'string' || !validTypes.includes(config.type)) {
        errors.push(`type debe ser una de: ${validTypes.join(', ')}`);
      }
    }
    
    // Validar valor por defecto
    if ('defaultValue' in config) {
      // La validación del valor por defecto depende del tipo
      const typeValidation = this.validateValueByType(config.defaultValue, config.type);
      if (!typeValidation.isValid) {
        errors.push(...typeValidation.errors.map(err => `defaultValue error: ${err}`));
      }
    }
    
    // Validar si es requerido
    if ('required' in config) {
      if (typeof config.required !== 'boolean') {
        errors.push('required debe ser un valor booleano');
      }
    }
    
    // Validar validadores personalizados
    if ('validators' in config) {
      if (!Array.isArray(config.validators)) {
        errors.push('validators debe ser un array');
      } else {
        for (let i = 0; i < config.validators.length; i++) {
          const validatorValidation = this.validateValidatorConfig(config.validators[i]);
          if (!validatorValidation.isValid) {
            errors.push(...validatorValidation.errors.map(err => `validator[${i}] error: ${err}`));
          }
        }
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * @method validateActionConfig
   * @description Valida la configuración de una acción de estado
   * @param {any} config - Configuración de acción a validar
   * @returns {object} Resultado de validación con isValid y errors
   */
  static validateActionConfig(config: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!config || typeof config !== 'object') {
      errors.push('La configuración de acción no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar nombre de la acción
    if (!('name' in config)) {
      errors.push('name es requerido');
    } else if (typeof config.name !== 'string') {
      errors.push('name debe ser una cadena');
    } else if (config.name.length === 0) {
      errors.push('name no puede estar vacío');
    } else if (config.name.length > 100) {
      errors.push('name no debe exceder 100 caracteres');
    }
    
    // Validar tipo de acción
    if ('type' in config) {
      const validTypes = ['sync', 'async'];
      if (typeof config.type !== 'string' || !validTypes.includes(config.type)) {
        errors.push(`type debe ser una de: ${validTypes.join(', ')}`);
      }
    }
    
    // Validar payload
    if ('payload' in config) {
      if (typeof config.payload !== 'object') {
        errors.push('payload debe ser un objeto');
      }
    }
    
    // Validar reducers
    if ('reducers' in config) {
      if (!Array.isArray(config.reducers)) {
        errors.push('reducers debe ser un array');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * @method validateMiddlewareConfig
   * @description Valida la configuración de un middleware
   * @param {any} config - Configuración de middleware a validar
   * @returns {object} Resultado de validación con isValid y errors
   */
  static validateMiddlewareConfig(config: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!config || typeof config !== 'object') {
      errors.push('La configuración de middleware no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar nombre del middleware
    if (!('name' in config)) {
      errors.push('name es requerido');
    } else if (typeof config.name !== 'string') {
      errors.push('name debe ser una cadena');
    } else if (config.name.length === 0) {
      errors.push('name no puede estar vacío');
    } else if (config.name.length > 100) {
      errors.push('name no debe exceder 100 caracteres');
    }
    
    // Validar orden
    if ('order' in config) {
      if (typeof config.order !== 'number') {
        errors.push('order debe ser un número');
      }
    }
    
    // Validar condiciones
    if ('conditions' in config) {
      if (!Array.isArray(config.conditions)) {
        errors.push('conditions debe ser un array');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * @method validateValidatorConfig
   * @description Valida la configuración de un validador
   * @param {any} config - Configuración de validador a validar
   * @returns {object} Resultado de validación con isValid y errors
   */
  static validateValidatorConfig(config: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!config || typeof config !== 'object') {
      errors.push('La configuración de validador no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar nombre del validador
    if (!('name' in config)) {
      errors.push('name es requerido');
    } else if (typeof config.name !== 'string') {
      errors.push('name debe ser una cadena');
    } else if (config.name.length === 0) {
      errors.push('name no puede estar vacío');
    } else if (config.name.length > 100) {
      errors.push('name no debe exceder 100 caracteres');
    }
    
    // Validar función de validación
    if (!('validate' in config)) {
      errors.push('validate es requerido');
    } else if (typeof config.validate !== 'function') {
      errors.push('validate debe ser una función');
    }
    
    // Validar mensaje de error
    if ('errorMessage' in config) {
      if (typeof config.errorMessage !== 'string') {
        errors.push('errorMessage debe ser una cadena');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * @method validateValueByType
   * @description Valida un valor según su tipo esperado
   * @param {any} value - Valor a validar
   * @param {string} type - Tipo esperado
   * @returns {object} Resultado de validación con isValid y errors
   */
  static validateValueByType(value: any, type: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    switch (type) {
      case 'string':
        if (typeof value !== 'string') {
          errors.push('El valor debe ser una cadena');
        }
        break;
      case 'number':
        if (typeof value !== 'number') {
          errors.push('El valor debe ser un número');
        }
        break;
      case 'boolean':
        if (typeof value !== 'boolean') {
          errors.push('El valor debe ser un booleano');
        }
        break;
      case 'array':
        if (!Array.isArray(value)) {
          errors.push('El valor debe ser un array');
        }
        break;
      case 'object':
        if (typeof value !== 'object' || value === null || Array.isArray(value)) {
          errors.push('El valor debe ser un objeto');
        }
        break;
      case 'null':
        if (value !== null) {
          errors.push('El valor debe ser null');
        }
        break;
      case 'undefined':
        if (value !== undefined) {
          errors.push('El valor debe ser undefined');
        }
        break;
      default:
        errors.push(`Tipo desconocido: ${type}`);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}