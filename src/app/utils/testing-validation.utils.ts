import { ValidationUtils } from './validation.utils';

/**
 * @file testing-validation.utils.ts
 * @description Utilidades de validación avanzada para pruebas en el sistema MicroTrust
 * @author Víctor Cuaresma <victor.cuaresma@utec.edu.pe>
 * @copyright 2025-2026 Víctor Cuaresma
 * @since 2025-10-13
 * @version 1.0.0
 */

/**
 * @class TestingValidationUtils
 * @description Clase que contiene métodos de validación para configuraciones de pruebas
 */
export class TestingValidationUtils {
  /**
   * @method validateTestConfig
   * @description Valida la configuración de una prueba
   * @param {any} config - Configuración de prueba a validar
   * @returns {object} Resultado de validación con isValid y errors
   */
  static validateTestConfig(config: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!config || typeof config !== 'object') {
      errors.push('La configuración de prueba no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar nombre de la prueba
    if (!('name' in config)) {
      errors.push('name es requerido');
    } else if (typeof config.name !== 'string') {
      errors.push('name debe ser una cadena');
    } else if (config.name.length === 0) {
      errors.push('name no puede estar vacío');
    } else if (config.name.length > 255) {
      errors.push('name no debe exceder 255 caracteres');
    }
    
    // Validar tipo de prueba
    if ('type' in config) {
      const validTypes = ['unit', 'integration', 'e2e', 'performance', 'security'];
      if (typeof config.type !== 'string' || !validTypes.includes(config.type)) {
        errors.push(`type debe ser una de: ${validTypes.join(', ')}`);
      }
    }
    
    // Validar descripción
    if ('description' in config) {
      if (typeof config.description !== 'string') {
        errors.push('description debe ser una cadena');
      } else if (config.description.length > 1000) {
        errors.push('description no debe exceder 1000 caracteres');
      }
    }
    
    // Validar suites
    if ('suites' in config) {
      if (!Array.isArray(config.suites)) {
        errors.push('suites debe ser un array');
      } else {
        for (let i = 0; i < config.suites.length; i++) {
          const suiteValidation = this.validateTestSuite(config.suites[i]);
          if (!suiteValidation.isValid) {
            errors.push(...suiteValidation.errors.map(err => `suite[${i}] error: ${err}`));
          }
        }
      }
    }
    
    // Validar timeout
    if ('timeout' in config) {
      if (typeof config.timeout !== 'number' || config.timeout <= 0) {
        errors.push('timeout debe ser un número positivo');
      }
    }
    
    // Validar retries
    if ('retries' in config) {
      if (typeof config.retries !== 'number' || config.retries < 0) {
        errors.push('retries debe ser un número no negativo');
      }
    }
    
    // Validar entornos
    if ('environments' in config) {
      if (!Array.isArray(config.environments)) {
        errors.push('environments debe ser un array');
      } else {
        const validEnvironments = ['development', 'testing', 'staging', 'production'];
        for (const env of config.environments) {
          if (typeof env !== 'string' || !validEnvironments.includes(env)) {
            errors.push(`Entorno inválido: ${env}. Debe ser una de: ${validEnvironments.join(', ')}`);
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
   * @method validateTestSuite
   * @description Valida una suite de pruebas
   * @param {any} suite - Suite de pruebas a validar
   * @returns {object} Resultado de validación con isValid y errors
   */
  static validateTestSuite(suite: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!suite || typeof suite !== 'object') {
      errors.push('La suite de pruebas no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar nombre de la suite
    if (!('name' in suite)) {
      errors.push('name es requerido');
    } else if (typeof suite.name !== 'string') {
      errors.push('name debe ser una cadena');
    } else if (suite.name.length === 0) {
      errors.push('name no puede estar vacío');
    } else if (suite.name.length > 100) {
      errors.push('name no debe exceder 100 caracteres');
    }
    
    // Validar descripción
    if ('description' in suite) {
      if (typeof suite.description !== 'string') {
        errors.push('description debe ser una cadena');
      } else if (suite.description.length > 500) {
        errors.push('description no debe exceder 500 caracteres');
      }
    }
    
    // Validar tests
    if ('tests' in suite) {
      if (!Array.isArray(suite.tests)) {
        errors.push('tests debe ser un array');
      } else {
        for (let i = 0; i < suite.tests.length; i++) {
          const testValidation = this.validateTestCase(suite.tests[i]);
          if (!testValidation.isValid) {
            errors.push(...testValidation.errors.map(err => `test[${i}] error: ${err}`));
          }
        }
      }
    }
    
    // Validar setup
    if ('setup' in suite) {
      if (typeof suite.setup !== 'function') {
        errors.push('setup debe ser una función');
      }
    }
    
    // Validar teardown
    if ('teardown' in suite) {
      if (typeof suite.teardown !== 'function') {
        errors.push('teardown debe ser una función');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * @method validateTestCase
   * @description Valida un caso de prueba
   * @param {any} testCase - Caso de prueba a validar
   * @returns {object} Resultado de validación con isValid y errors
   */
  static validateTestCase(testCase: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!testCase || typeof testCase !== 'object') {
      errors.push('El caso de prueba no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar nombre del caso de prueba
    if (!('name' in testCase)) {
      errors.push('name es requerido');
    } else if (typeof testCase.name !== 'string') {
      errors.push('name debe ser una cadena');
    } else if (testCase.name.length === 0) {
      errors.push('name no puede estar vacío');
    } else if (testCase.name.length > 100) {
      errors.push('name no debe exceder 100 caracteres');
    }
    
    // Validar función de prueba
    if (!('testFunction' in testCase)) {
      errors.push('testFunction es requerido');
    } else if (typeof testCase.testFunction !== 'function') {
      errors.push('testFunction debe ser una función');
    }
    
    // Validar expectativas
    if ('expectations' in testCase) {
      if (!Array.isArray(testCase.expectations)) {
        errors.push('expectations debe ser un array');
      } else {
        for (let i = 0; i < testCase.expectations.length; i++) {
          const expectationValidation = this.validateExpectation(testCase.expectations[i]);
          if (!expectationValidation.isValid) {
            errors.push(...expectationValidation.errors.map(err => `expectation[${i}] error: ${err}`));
          }
        }
      }
    }
    
    // Validar datos de prueba
    if ('testData' in testCase) {
      if (typeof testCase.testData !== 'object') {
        errors.push('testData debe ser un objeto');
      }
    }
    
    // Validar mocks
    if ('mocks' in testCase) {
      if (!Array.isArray(testCase.mocks)) {
        errors.push('mocks debe ser un array');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * @method validateExpectation
   * @description Valida una expectativa de prueba
   * @param {any} expectation - Expectativa a validar
   * @returns {object} Resultado de validación con isValid y errors
   */
  static validateExpectation(expectation: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!expectation || typeof expectation !== 'object') {
      errors.push('La expectativa no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar descripción
    if (!('description' in expectation)) {
      errors.push('description es requerido');
    } else if (typeof expectation.description !== 'string') {
      errors.push('description debe ser una cadena');
    } else if (expectation.description.length === 0) {
      errors.push('description no puede estar vacío');
    } else if (expectation.description.length > 200) {
      errors.push('description no debe exceder 200 caracteres');
    }
    
    // Validar función de validación
    if (!('validate' in expectation)) {
      errors.push('validate es requerido');
    } else if (typeof expectation.validate !== 'function') {
      errors.push('validate debe ser una función');
    }
    
    // Validar mensaje de error
    if ('errorMessage' in expectation) {
      if (typeof expectation.errorMessage !== 'string') {
        errors.push('errorMessage debe ser una cadena');
      } else if (expectation.errorMessage.length > 200) {
        errors.push('errorMessage no debe exceder 200 caracteres');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}