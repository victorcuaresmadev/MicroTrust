import { ValidationUtils } from './validation.utils';

/**
 * @file i18n-advanced-validation.utils.ts
 * @description Utilidades de validación avanzada para internacionalización en el sistema MicroTrust
 * @author Víctor Cuaresma <victor.cuaresma@utec.edu.pe>
 * @copyright 2025-2026 Víctor Cuaresma
 * @since 2025-10-13
 * @version 1.0.0
 */

/**
 * @class I18nAdvancedValidationUtils
 * @description Clase que contiene métodos de validación avanzada para internacionalización
 */
export class I18nAdvancedValidationUtils {
  /**
   * @method validateI18nConfig
   * @description Valida la configuración de internacionalización
   * @param {any} config - Configuración de i18n a validar
   * @returns {object} Resultado de validación con isValid y errors
   */
  static validateI18nConfig(config: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!config || typeof config !== 'object') {
      errors.push('La configuración de i18n no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar idioma por defecto
    if (!('defaultLanguage' in config)) {
      errors.push('defaultLanguage es requerido');
    } else if (typeof config.defaultLanguage !== 'string') {
      errors.push('defaultLanguage debe ser una cadena');
    } else if (config.defaultLanguage.length === 0) {
      errors.push('defaultLanguage no puede estar vacío');
    } else if (config.defaultLanguage.length > 10) {
      errors.push('defaultLanguage no debe exceder 10 caracteres');
    }
    
    // Validar idiomas soportados
    if (!('supportedLanguages' in config)) {
      errors.push('supportedLanguages es requerido');
    } else if (!Array.isArray(config.supportedLanguages)) {
      errors.push('supportedLanguages debe ser un array');
    } else if (config.supportedLanguages.length === 0) {
      errors.push('supportedLanguages no puede estar vacío');
    } else {
      for (const lang of config.supportedLanguages) {
        if (typeof lang !== 'string') {
          errors.push('Cada idioma debe ser una cadena');
          break;
        }
        if (lang.length === 0) {
          errors.push('Los códigos de idioma no pueden estar vacíos');
          break;
        }
        if (lang.length > 10) {
          errors.push('Los códigos de idioma no deben exceder 10 caracteres');
          break;
        }
      }
    }
    
    // Validar fallback language
    if ('fallbackLanguage' in config) {
      if (typeof config.fallbackLanguage !== 'string') {
        errors.push('fallbackLanguage debe ser una cadena');
      } else if (config.fallbackLanguage.length === 0) {
        errors.push('fallbackLanguage no puede estar vacío');
      } else if (config.fallbackLanguage.length > 10) {
        errors.push('fallbackLanguage no debe exceder 10 caracteres');
      }
    }
    
    // Validar carga perezosa
    if ('lazyLoad' in config) {
      if (typeof config.lazyLoad !== 'boolean') {
        errors.push('lazyLoad debe ser un valor booleano');
      }
    }
    
    // Validar namespaces
    if ('namespaces' in config) {
      if (!Array.isArray(config.namespaces)) {
        errors.push('namespaces debe ser un array');
      } else {
        for (const ns of config.namespaces) {
          if (typeof ns !== 'string') {
            errors.push('Cada namespace debe ser una cadena');
            break;
          }
          if (ns.length === 0) {
            errors.push('Los namespaces no pueden estar vacíos');
            break;
          }
          if (ns.length > 50) {
            errors.push('Los namespaces no deben exceder 50 caracteres');
            break;
          }
        }
      }
    }
    
    // Validar formato de archivos
    if ('fileFormat' in config) {
      const validFormats = ['json', 'yaml', 'yml', 'po', 'mo'];
      if (typeof config.fileFormat !== 'string' || !validFormats.includes(config.fileFormat)) {
        errors.push(`fileFormat debe ser uno de: ${validFormats.join(', ')}`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * @method validateTranslationFile
   * @description Valida un archivo de traducción
   * @param {any} file - Archivo de traducción a validar
   * @returns {object} Resultado de validación con isValid y errors
   */
  static validateTranslationFile(file: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!file || typeof file !== 'object') {
      errors.push('El archivo de traducción no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar idioma
    if (!('language' in file)) {
      errors.push('language es requerido');
    } else if (typeof file.language !== 'string') {
      errors.push('language debe ser una cadena');
    } else if (file.language.length === 0) {
      errors.push('language no puede estar vacío');
    } else if (file.language.length > 10) {
      errors.push('language no debe exceder 10 caracteres');
    }
    
    // Validar namespace
    if (!('namespace' in file)) {
      errors.push('namespace es requerido');
    } else if (typeof file.namespace !== 'string') {
      errors.push('namespace debe ser una cadena');
    } else if (file.namespace.length === 0) {
      errors.push('namespace no puede estar vacío');
    } else if (file.namespace.length > 50) {
      errors.push('namespace no debe exceder 50 caracteres');
    }
    
    // Validar traducciones
    if (!('translations' in file)) {
      errors.push('translations es requerido');
    } else if (typeof file.translations !== 'object') {
      errors.push('translations debe ser un objeto');
    } else {
      const translationValidation = this.validateTranslations(file.translations);
      if (!translationValidation.isValid) {
        errors.push(...translationValidation.errors.map(err => `translations error: ${err}`));
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * @method validateTranslations
   * @description Valida un conjunto de traducciones
   * @param {any} translations - Conjunto de traducciones a validar
   * @returns {object} Resultado de validación con isValid y errors
   */
  static validateTranslations(translations: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!translations || typeof translations !== 'object') {
      errors.push('Las traducciones no son un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar cada clave y valor
    for (const [key, value] of Object.entries(translations)) {
      if (typeof key !== 'string') {
        errors.push('Las claves de traducción deben ser cadenas');
        break;
      }
      
      if (key.length === 0) {
        errors.push('Las claves de traducción no pueden estar vacías');
        break;
      }
      
      if (key.length > 255) {
        errors.push('Las claves de traducción no deben exceder 255 caracteres');
        break;
      }
      
      if (typeof value !== 'string' && typeof value !== 'object') {
        errors.push(`El valor de la traducción para "${key}" debe ser una cadena o un objeto`);
        break;
      }
      
      // Si el valor es un objeto, validar recursivamente
      if (typeof value === 'object' && value !== null) {
        const nestedValidation = this.validateTranslations(value);
        if (!nestedValidation.isValid) {
          errors.push(...nestedValidation.errors.map(err => `nested translation "${key}" error: ${err}`));
        }
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * @method validatePluralization
   * @description Valida las reglas de pluralización
   * @param {any} pluralization - Reglas de pluralización a validar
   * @returns {object} Resultado de validación con isValid y errors
   */
  static validatePluralization(pluralization: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!pluralization || typeof pluralization !== 'object') {
      errors.push('Las reglas de pluralización no son un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar idioma
    if (!('language' in pluralization)) {
      errors.push('language es requerido');
    } else if (typeof pluralization.language !== 'string') {
      errors.push('language debe ser una cadena');
    } else if (pluralization.language.length === 0) {
      errors.push('language no puede estar vacío');
    } else if (pluralization.language.length > 10) {
      errors.push('language no debe exceder 10 caracteres');
    }
    
    // Validar función de pluralización
    if (!('pluralFunction' in pluralization)) {
      errors.push('pluralFunction es requerido');
    } else if (typeof pluralization.pluralFunction !== 'function') {
      errors.push('pluralFunction debe ser una función');
    }
    
    // Validar categorías
    if ('categories' in pluralization) {
      if (!Array.isArray(pluralization.categories)) {
        errors.push('categories debe ser un array');
      } else {
        for (const category of pluralization.categories) {
          if (typeof category !== 'string') {
            errors.push('Cada categoría debe ser una cadena');
            break;
          }
          if (category.length === 0) {
            errors.push('Las categorías no pueden estar vacías');
            break;
          }
          if (category.length > 20) {
            errors.push('Las categorías no deben exceder 20 caracteres');
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
   * @method validateInterpolation
   * @description Valida la configuración de interpolación
   * @param {any} interpolation - Configuración de interpolación a validar
   * @returns {object} Resultado de validación con isValid y errors
   */
  static validateInterpolation(interpolation: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!interpolation || typeof interpolation !== 'object') {
      errors.push('La configuración de interpolación no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar prefijo
    if ('prefix' in interpolation) {
      if (typeof interpolation.prefix !== 'string') {
        errors.push('prefix debe ser una cadena');
      } else if (interpolation.prefix.length > 10) {
        errors.push('prefix no debe exceder 10 caracteres');
      }
    }
    
    // Validar sufijo
    if ('suffix' in interpolation) {
      if (typeof interpolation.suffix !== 'string') {
        errors.push('suffix debe ser una cadena');
      } else if (interpolation.suffix.length > 10) {
        errors.push('suffix no debe exceder 10 caracteres');
      }
    }
    
    // Validar función de escape
    if ('escapeFunction' in interpolation) {
      if (typeof interpolation.escapeFunction !== 'function') {
        errors.push('escapeFunction debe ser una función');
      }
    }
    
    // Validar formato
    if ('format' in interpolation) {
      if (typeof interpolation.format !== 'object') {
        errors.push('format debe ser un objeto');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}