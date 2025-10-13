import { ValidationUtils } from './validation.utils';

/**
 * @file event-validation.utils.ts
 * @description Utilidades de validación avanzada para eventos en el sistema MicroTrust
 * @author Víctor Cuaresma <victor.cuaresma@utec.edu.pe>
 * @copyright 2025-2026 Víctor Cuaresma
 * @since 2025-10-13
 * @version 1.0.0
 */

/**
 * @class EventValidationUtils
 * @description Clase que contiene métodos de validación para eventos del sistema
 */
export class EventValidationUtils {
  /**
   * @method validateEventConfig
   * @description Valida la configuración de un evento
   * @param {any} config - Configuración de evento a validar
   * @returns {object} Resultado de validación con isValid y errors
   */
  static validateEventConfig(config: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!config || typeof config !== 'object') {
      errors.push('La configuración de evento no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar nombre del evento
    if (!('name' in config)) {
      errors.push('name es requerido');
    } else if (typeof config.name !== 'string') {
      errors.push('name debe ser una cadena');
    } else if (config.name.length === 0) {
      errors.push('name no puede estar vacío');
    } else if (config.name.length > 100) {
      errors.push('name no debe exceder 100 caracteres');
    }
    
    // Validar tipo de evento
    if ('type' in config) {
      const validTypes = ['click', 'submit', 'change', 'input', 'focus', 'blur', 'keydown', 'keyup', 'load', 'error'];
      if (typeof config.type !== 'string' || !validTypes.includes(config.type)) {
        errors.push(`type debe ser una de: ${validTypes.join(', ')}`);
      }
    }
    
    // Validar destino
    if ('target' in config) {
      if (typeof config.target !== 'string') {
        errors.push('target debe ser una cadena');
      } else if (config.target.length > 255) {
        errors.push('target no debe exceder 255 caracteres');
      }
    }
    
    // Validar datos asociados
    if ('data' in config) {
      if (typeof config.data !== 'object') {
        errors.push('data debe ser un objeto');
      }
    }
    
    // Validar si el evento es cancelable
    if ('cancelable' in config) {
      if (typeof config.cancelable !== 'boolean') {
        errors.push('cancelable debe ser un valor booleano');
      }
    }
    
    // Validar si el evento puede burbujear
    if ('bubbles' in config) {
      if (typeof config.bubbles !== 'boolean') {
        errors.push('bubbles debe ser un valor booleano');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * @method validateEventEmitter
   * @description Valida un emisor de eventos
   * @param {any} emitter - Emisor de eventos a validar
   * @returns {object} Resultado de validación con isValid y errors
   */
  static validateEventEmitter(emitter: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!emitter || typeof emitter !== 'object') {
      errors.push('El emisor de eventos no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar nombre del emisor
    if ('name' in emitter) {
      if (typeof emitter.name !== 'string') {
        errors.push('name debe ser una cadena');
      } else if (emitter.name.length > 100) {
        errors.push('name no debe exceder 100 caracteres');
      }
    }
    
    // Validar lista de eventos
    if ('events' in emitter) {
      if (!Array.isArray(emitter.events)) {
        errors.push('events debe ser un array');
      } else {
        for (let i = 0; i < emitter.events.length; i++) {
          const eventValidation = this.validateEventConfig(emitter.events[i]);
          if (!eventValidation.isValid) {
            errors.push(...eventValidation.errors.map(err => `event[${i}] error: ${err}`));
          }
        }
      }
    }
    
    // Validar máximo número de oyentes
    if ('maxListeners' in emitter) {
      if (typeof emitter.maxListeners !== 'number' || emitter.maxListeners < 0) {
        errors.push('maxListeners debe ser un número positivo');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * @method validateEventPayload
   * @description Valida la carga útil de un evento
   * @param {any} payload - Carga útil del evento a validar
   * @returns {object} Resultado de validación con isValid y errors
   */
  static validateEventPayload(payload: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!payload || typeof payload !== 'object') {
      errors.push('La carga útil del evento no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar ID del evento
    if ('eventId' in payload) {
      if (typeof payload.eventId !== 'string') {
        errors.push('eventId debe ser una cadena');
      } else if (payload.eventId.length === 0) {
        errors.push('eventId no puede estar vacío');
      } else if (payload.eventId.length > 50) {
        errors.push('eventId no debe exceder 50 caracteres');
      }
    }
    
    // Validar timestamp
    if ('timestamp' in payload) {
      if (typeof payload.timestamp !== 'number' || payload.timestamp < 0) {
        errors.push('timestamp debe ser un número positivo');
      }
    }
    
    // Validar datos del evento
    if ('data' in payload) {
      if (typeof payload.data !== 'object') {
        errors.push('data debe ser un objeto');
      }
    }
    
    // Validar contexto
    if ('context' in payload) {
      if (typeof payload.context !== 'object') {
        errors.push('context debe ser un objeto');
      }
    }
    
    // Validar metadatos
    if ('metadata' in payload) {
      if (typeof payload.metadata !== 'object') {
        errors.push('metadata debe ser un objeto');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}