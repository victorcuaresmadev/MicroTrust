import { ValidationUtils } from './validation.utils';

/**
 * @file migration-validation.utils.ts
 * @description Utilidades de validación avanzada para migraciones en el sistema MicroTrust
 * @author Víctor Cuaresma <victor.cuaresma@utec.edu.pe>
 * @copyright 2025-2026 Víctor Cuaresma
 * @since 2025-10-13
 * @version 1.0.0
 */

/**
 * @class MigrationValidationUtils
 * @description Clase que contiene métodos de validación para migraciones del sistema
 */
export class MigrationValidationUtils {
  /**
   * @method validateMigrationConfig
   * @description Valida la configuración de una migración
   * @param {any} config - Configuración de migración a validar
   * @returns {object} Resultado de validación con isValid y errors
   */
  static validateMigrationConfig(config: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!config || typeof config !== 'object') {
      errors.push('La configuración de migración no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar ID de migración
    if (!('id' in config)) {
      errors.push('id es requerido');
    } else if (typeof config.id !== 'string') {
      errors.push('id debe ser una cadena');
    } else if (config.id.length === 0) {
      errors.push('id no puede estar vacío');
    } else if (config.id.length > 50) {
      errors.push('id no debe exceder 50 caracteres');
    }
    
    // Validar nombre de la migración
    if (!('name' in config)) {
      errors.push('name es requerido');
    } else if (typeof config.name !== 'string') {
      errors.push('name debe ser una cadena');
    } else if (config.name.length === 0) {
      errors.push('name no puede estar vacío');
    } else if (config.name.length > 100) {
      errors.push('name no debe exceder 100 caracteres');
    }
    
    // Validar versión de origen
    if ('fromVersion' in config) {
      if (typeof config.fromVersion !== 'string') {
        errors.push('fromVersion debe ser una cadena');
      } else if (config.fromVersion.length === 0) {
        errors.push('fromVersion no puede estar vacía');
      } else if (config.fromVersion.length > 20) {
        errors.push('fromVersion no debe exceder 20 caracteres');
      }
    }
    
    // Validar versión de destino
    if (!('toVersion' in config)) {
      errors.push('toVersion es requerido');
    } else if (typeof config.toVersion !== 'string') {
      errors.push('toVersion debe ser una cadena');
    } else if (config.toVersion.length === 0) {
      errors.push('toVersion no puede estar vacía');
    } else if (config.toVersion.length > 20) {
      errors.push('toVersion no debe exceder 20 caracteres');
    }
    
    // Validar pasos
    if ('steps' in config) {
      if (!Array.isArray(config.steps)) {
        errors.push('steps debe ser un array');
      } else {
        for (let i = 0; i < config.steps.length; i++) {
          const stepValidation = this.validateMigrationStep(config.steps[i]);
          if (!stepValidation.isValid) {
            errors.push(...stepValidation.errors.map(err => `step[${i}] error: ${err}`));
          }
        }
      }
    }
    
    // Validar tipo de migración
    if ('type' in config) {
      const validTypes = ['database', 'configuration', 'code', 'data', 'ui'];
      if (typeof config.type !== 'string' || !validTypes.includes(config.type)) {
        errors.push(`type debe ser una de: ${validTypes.join(', ')}`);
      }
    }
    
    // Validar reversibilidad
    if ('reversible' in config) {
      if (typeof config.reversible !== 'boolean') {
        errors.push('reversible debe ser un valor booleano');
      }
    }
    
    // Validar dependencias
    if ('dependencies' in config) {
      if (!Array.isArray(config.dependencies)) {
        errors.push('dependencies debe ser un array');
      } else {
        for (const dep of config.dependencies) {
          if (typeof dep !== 'string') {
            errors.push('Cada dependencia debe ser una cadena');
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
  
  /**
   * @method validateMigrationStep
   * @description Valida un paso de migración
   * @param {any} step - Paso de migración a validar
   * @returns {object} Resultado de validación con isValid y errors
   */
  static validateMigrationStep(step: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!step || typeof step !== 'object') {
      errors.push('El paso de migración no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar nombre del paso
    if (!('name' in step)) {
      errors.push('name es requerido');
    } else if (typeof step.name !== 'string') {
      errors.push('name debe ser una cadena');
    } else if (step.name.length === 0) {
      errors.push('name no puede estar vacío');
    } else if (step.name.length > 100) {
      errors.push('name no debe exceder 100 caracteres');
    }
    
    // Validar descripción
    if ('description' in step) {
      if (typeof step.description !== 'string') {
        errors.push('description debe ser una cadena');
      } else if (step.description.length > 500) {
        errors.push('description no debe exceder 500 caracteres');
      }
    }
    
    // Validar función de ejecución
    if (!('execute' in step)) {
      errors.push('execute es requerido');
    } else if (typeof step.execute !== 'function') {
      errors.push('execute debe ser una función');
    }
    
    // Validar función de reversión
    if ('rollback' in step) {
      if (typeof step.rollback !== 'function') {
        errors.push('rollback debe ser una función');
      }
    }
    
    // Validar precondiciones
    if ('preconditions' in step) {
      if (!Array.isArray(step.preconditions)) {
        errors.push('preconditions debe ser un array');
      } else {
        for (let i = 0; i < step.preconditions.length; i++) {
          const preconditionValidation = this.validateMigrationPrecondition(step.preconditions[i]);
          if (!preconditionValidation.isValid) {
            errors.push(...preconditionValidation.errors.map(err => `precondition[${i}] error: ${err}`));
          }
        }
      }
    }
    
    // Validar postcondiciones
    if ('postconditions' in step) {
      if (!Array.isArray(step.postconditions)) {
        errors.push('postconditions debe ser un array');
      } else {
        for (let i = 0; i < step.postconditions.length; i++) {
          const postconditionValidation = this.validateMigrationPostcondition(step.postconditions[i]);
          if (!postconditionValidation.isValid) {
            errors.push(...postconditionValidation.errors.map(err => `postcondition[${i}] error: ${err}`));
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
   * @method validateMigrationPrecondition
   * @description Valida una precondición de migración
   * @param {any} precondition - Precondición de migración a validar
   * @returns {object} Resultado de validación con isValid y errors
   */
  static validateMigrationPrecondition(precondition: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!precondition || typeof precondition !== 'object') {
      errors.push('La precondición de migración no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar nombre de la precondición
    if (!('name' in precondition)) {
      errors.push('name es requerido');
    } else if (typeof precondition.name !== 'string') {
      errors.push('name debe ser una cadena');
    } else if (precondition.name.length === 0) {
      errors.push('name no puede estar vacío');
    } else if (precondition.name.length > 100) {
      errors.push('name no debe exceder 100 caracteres');
    }
    
    // Validar función de verificación
    if (!('check' in precondition)) {
      errors.push('check es requerido');
    } else if (typeof precondition.check !== 'function') {
      errors.push('check debe ser una función');
    }
    
    // Validar mensaje de error
    if ('errorMessage' in precondition) {
      if (typeof precondition.errorMessage !== 'string') {
        errors.push('errorMessage debe ser una cadena');
      } else if (precondition.errorMessage.length > 200) {
        errors.push('errorMessage no debe exceder 200 caracteres');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * @method validateMigrationPostcondition
   * @description Valida una postcondición de migración
   * @param {any} postcondition - Postcondición de migración a validar
   * @returns {object} Resultado de validación con isValid y errors
   */
  static validateMigrationPostcondition(postcondition: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!postcondition || typeof postcondition !== 'object') {
      errors.push('La postcondición de migración no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar nombre de la postcondición
    if (!('name' in postcondition)) {
      errors.push('name es requerido');
    } else if (typeof postcondition.name !== 'string') {
      errors.push('name debe ser una cadena');
    } else if (postcondition.name.length === 0) {
      errors.push('name no puede estar vacío');
    } else if (postcondition.name.length > 100) {
      errors.push('name no debe exceder 100 caracteres');
    }
    
    // Validar función de verificación
    if (!('check' in postcondition)) {
      errors.push('check es requerido');
    } else if (typeof postcondition.check !== 'function') {
      errors.push('check debe ser una función');
    }
    
    // Validar mensaje de error
    if ('errorMessage' in postcondition) {
      if (typeof postcondition.errorMessage !== 'string') {
        errors.push('errorMessage debe ser una cadena');
      } else if (postcondition.errorMessage.length > 200) {
        errors.push('errorMessage no debe exceder 200 caracteres');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}