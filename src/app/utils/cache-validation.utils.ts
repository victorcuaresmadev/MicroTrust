import { ValidationUtils } from './validation.utils';

/**
 * @file cache-validation.utils.ts
 * @description Utilidades de validación avanzada para caché en el sistema MicroTrust
 * @author Víctor Cuaresma <victor.cuaresma@utec.edu.pe>
 * @copyright 2025-2026 Víctor Cuaresma
 * @since 2025-10-13
 * @version 1.0.0
 */

/**
 * @class CacheValidationUtils
 * @description Clase que contiene métodos de validación para configuraciones de caché
 */
export class CacheValidationUtils {
  /**
   * @method validateCacheConfig
   * @description Valida la configuración completa de caché
   * @param {any} config - Configuración de caché a validar
   * @returns {object} Resultado de validación con isValid y errors
   */
  static validateCacheConfig(config: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!config || typeof config !== 'object') {
      errors.push('La configuración de caché no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar TTL (Time To Live)
    if ('ttl' in config) {
      if (typeof config.ttl !== 'number' || config.ttl < 0) {
        errors.push('ttl debe ser un número positivo');
      }
    }
    
    // Validar tamaño máximo
    if ('maxSize' in config) {
      if (typeof config.maxSize !== 'number' || config.maxSize <= 0) {
        errors.push('maxSize debe ser un número positivo mayor que 0');
      }
    }
    
    // Validar estrategia de reemplazo
    if ('replacementStrategy' in config) {
      const validStrategies = ['LRU', 'FIFO', 'LFU'];
      if (typeof config.replacementStrategy !== 'string' || 
          !validStrategies.includes(config.replacementStrategy)) {
        errors.push(`replacementStrategy debe ser una de: ${validStrategies.join(', ')}`);
      }
    }
    
    // Validar prefijo de clave
    if ('keyPrefix' in config) {
      if (typeof config.keyPrefix !== 'string') {
        errors.push('keyPrefix debe ser una cadena');
      } else if (config.keyPrefix.length > 50) {
        errors.push('keyPrefix no debe exceder 50 caracteres');
      }
    }
    
    // Validar compresión
    if ('compression' in config) {
      if (typeof config.compression !== 'boolean') {
        errors.push('compression debe ser un valor booleano');
      }
    }
    
    // Validar persistencia
    if ('persistence' in config) {
      if (typeof config.persistence !== 'boolean') {
        errors.push('persistence debe ser un valor booleano');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * @method validateCacheEntry
   * @description Valida una entrada individual de caché
   * @param {any} entry - Entrada de caché a validar
   * @returns {object} Resultado de validación con isValid y errors
   */
  static validateCacheEntry(entry: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!entry || typeof entry !== 'object') {
      errors.push('La entrada de caché no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar clave
    if (!('key' in entry)) {
      errors.push('key es requerido');
    } else if (typeof entry.key !== 'string') {
      errors.push('key debe ser una cadena');
    } else if (entry.key.length === 0) {
      errors.push('key no puede estar vacía');
    } else if (entry.key.length > 255) {
      errors.push('key no debe exceder 255 caracteres');
    }
    
    // Validar valor
    if (!('value' in entry)) {
      errors.push('value es requerido');
    } else if (entry.value === undefined || entry.value === null) {
      errors.push('value no puede ser undefined o null');
    }
    
    // Validar timestamp
    if ('timestamp' in entry) {
      if (typeof entry.timestamp !== 'number' || entry.timestamp < 0) {
        errors.push('timestamp debe ser un número positivo');
      }
    }
    
    // Validar TTL para la entrada
    if ('ttl' in entry) {
      if (typeof entry.ttl !== 'number' || entry.ttl < 0) {
        errors.push('ttl de entrada debe ser un número positivo');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * @method validateCacheOperation
   * @description Valida una operación de caché (get, set, delete, etc.)
   * @param {any} operation - Operación de caché a validar
   * @returns {object} Resultado de validación con isValid y errors
   */
  static validateCacheOperation(operation: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!operation || typeof operation !== 'object') {
      errors.push('La operación de caché no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar tipo de operación
    if (!('type' in operation)) {
      errors.push('type es requerido');
    } else {
      const validTypes = ['get', 'set', 'delete', 'clear', 'has', 'keys', 'values', 'entries'];
      if (typeof operation.type !== 'string' || !validTypes.includes(operation.type)) {
        errors.push(`type debe ser una de: ${validTypes.join(', ')}`);
      }
    }
    
    // Validar parámetros según el tipo
    if (operation.type === 'set') {
      if (!('key' in operation)) {
        errors.push('key es requerido para operación set');
      }
      
      if (!('value' in operation)) {
        errors.push('value es requerido para operación set');
      }
    } else if (operation.type === 'get' || operation.type === 'delete' || operation.type === 'has') {
      if (!('key' in operation)) {
        errors.push(`key es requerido para operación ${operation.type}`);
      }
    }
    
    // Validar opciones
    if ('options' in operation && operation.options) {
      if (typeof operation.options !== 'object') {
        errors.push('options debe ser un objeto');
      } else {
        // Validar TTL en opciones
        if ('ttl' in operation.options) {
          if (typeof operation.options.ttl !== 'number' || operation.options.ttl < 0) {
            errors.push('options.ttl debe ser un número positivo');
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