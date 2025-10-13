import { ValidationUtils } from './validation.utils';

/**
 * @file ui-validation.utils.ts
 * @description Utilidades de validación avanzada para interfaz de usuario en el sistema MicroTrust
 * @author Víctor Cuaresma <victor.cuaresma@utec.edu.pe>
 * @copyright 2025-2026 Víctor Cuaresma
 * @since 2025-10-13
 * @version 1.0.0
 */

/**
 * @class UIValidationUtils
 * @description Clase que contiene métodos de validación para elementos de interfaz de usuario
 */
export class UIValidationUtils {
  /**
   * @method validateComponentConfig
   * @description Valida la configuración de un componente de UI
   * @param {any} config - Configuración de componente a validar
   * @returns {object} Resultado de validación con isValid y errors
   */
  static validateComponentConfig(config: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!config || typeof config !== 'object') {
      errors.push('La configuración de componente no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar nombre del componente
    if (!('name' in config)) {
      errors.push('name es requerido');
    } else if (typeof config.name !== 'string') {
      errors.push('name debe ser una cadena');
    } else if (config.name.length === 0) {
      errors.push('name no puede estar vacío');
    } else if (config.name.length > 100) {
      errors.push('name no debe exceder 100 caracteres');
    }
    
    // Validar selector
    if ('selector' in config) {
      if (typeof config.selector !== 'string') {
        errors.push('selector debe ser una cadena');
      } else if (config.selector.length === 0) {
        errors.push('selector no puede estar vacío');
      } else if (config.selector.length > 100) {
        errors.push('selector no debe exceder 100 caracteres');
      }
    }
    
    // Validar template
    if ('template' in config) {
      if (typeof config.template !== 'string') {
        errors.push('template debe ser una cadena');
      }
    }
    
    // Validar estilos
    if ('styles' in config) {
      if (!Array.isArray(config.styles) && typeof config.styles !== 'string') {
        errors.push('styles debe ser un array o una cadena');
      }
    }
    
    // Validar entradas (inputs)
    if ('inputs' in config) {
      if (!Array.isArray(config.inputs)) {
        errors.push('inputs debe ser un array');
      } else {
        for (let i = 0; i < config.inputs.length; i++) {
          const inputValidation = this.validateInputConfig(config.inputs[i]);
          if (!inputValidation.isValid) {
            errors.push(...inputValidation.errors.map(err => `input[${i}] error: ${err}`));
          }
        }
      }
    }
    
    // Validar salidas (outputs)
    if ('outputs' in config) {
      if (!Array.isArray(config.outputs)) {
        errors.push('outputs debe ser un array');
      } else {
        for (let i = 0; i < config.outputs.length; i++) {
          const outputValidation = this.validateOutputConfig(config.outputs[i]);
          if (!outputValidation.isValid) {
            errors.push(...outputValidation.errors.map(err => `output[${i}] error: ${err}`));
          }
        }
      }
    }
    
    // Validar estado
    if ('state' in config) {
      if (typeof config.state !== 'object') {
        errors.push('state debe ser un objeto');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * @method validateInputConfig
   * @description Valida la configuración de una entrada de componente
   * @param {any} config - Configuración de entrada a validar
   * @returns {object} Resultado de validación con isValid y errors
   */
  static validateInputConfig(config: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!config || typeof config !== 'object') {
      errors.push('La configuración de entrada no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar nombre de la entrada
    if (!('name' in config)) {
      errors.push('name es requerido');
    } else if (typeof config.name !== 'string') {
      errors.push('name debe ser una cadena');
    } else if (config.name.length === 0) {
      errors.push('name no puede estar vacío');
    } else if (config.name.length > 50) {
      errors.push('name no debe exceder 50 caracteres');
    }
    
    // Validar tipo
    if ('type' in config) {
      const validTypes = ['string', 'number', 'boolean', 'array', 'object', 'any'];
      if (typeof config.type !== 'string' || !validTypes.includes(config.type)) {
        errors.push(`type debe ser una de: ${validTypes.join(', ')}`);
      }
    }
    
    // Validar valor por defecto
    if ('defaultValue' in config) {
      // La validación del valor por defecto depende del tipo
      // Por ahora solo verificamos que no sea undefined
      if (config.defaultValue === undefined) {
        errors.push('defaultValue no puede ser undefined');
      }
    }
    
    // Validar si es requerido
    if ('required' in config) {
      if (typeof config.required !== 'boolean') {
        errors.push('required debe ser un valor booleano');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * @method validateOutputConfig
   * @description Valida la configuración de una salida de componente
   * @param {any} config - Configuración de salida a validar
   * @returns {object} Resultado de validación con isValid y errors
   */
  static validateOutputConfig(config: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!config || typeof config !== 'object') {
      errors.push('La configuración de salida no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar nombre de la salida
    if (!('name' in config)) {
      errors.push('name es requerido');
    } else if (typeof config.name !== 'string') {
      errors.push('name debe ser una cadena');
    } else if (config.name.length === 0) {
      errors.push('name no puede estar vacío');
    } else if (config.name.length > 50) {
      errors.push('name no debe exceder 50 caracteres');
    }
    
    // Validar tipo de evento
    if ('eventType' in config) {
      if (typeof config.eventType !== 'string') {
        errors.push('eventType debe ser una cadena');
      } else if (config.eventType.length > 50) {
        errors.push('eventType no debe exceder 50 caracteres');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * @method validateUILayout
   * @description Valida una disposición de UI
   * @param {any} layout - Disposición de UI a validar
   * @returns {object} Resultado de validación con isValid y errors
   */
  static validateUILayout(layout: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!layout || typeof layout !== 'object') {
      errors.push('La disposición de UI no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar nombre de la disposición
    if (!('name' in layout)) {
      errors.push('name es requerido');
    } else if (typeof layout.name !== 'string') {
      errors.push('name debe ser una cadena');
    } else if (layout.name.length === 0) {
      errors.push('name no puede estar vacío');
    } else if (layout.name.length > 100) {
      errors.push('name no debe exceder 100 caracteres');
    }
    
    // Validar componentes
    if ('components' in layout) {
      if (!Array.isArray(layout.components)) {
        errors.push('components debe ser un array');
      } else {
        for (let i = 0; i < layout.components.length; i++) {
          const componentValidation = this.validateComponentConfig(layout.components[i]);
          if (!componentValidation.isValid) {
            errors.push(...componentValidation.errors.map(err => `component[${i}] error: ${err}`));
          }
        }
      }
    }
    
    // Validar estilo de disposición
    if ('layoutStyle' in layout) {
      const validStyles = ['grid', 'flexbox', 'block', 'inline'];
      if (typeof layout.layoutStyle !== 'string' || !validStyles.includes(layout.layoutStyle)) {
        errors.push(`layoutStyle debe ser una de: ${validStyles.join(', ')}`);
      }
    }
    
    // Validar breakpoints
    if ('breakpoints' in layout) {
      if (typeof layout.breakpoints !== 'object') {
        errors.push('breakpoints debe ser un objeto');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}