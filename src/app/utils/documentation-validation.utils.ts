import { ValidationUtils } from './validation.utils';

/**
 * @file documentation-validation.utils.ts
 * @description Utilidades de validación avanzada para documentación en el sistema MicroTrust
 * @author Víctor Cuaresma <victor.cuaresma@utec.edu.pe>
 * @copyright 2025-2026 Víctor Cuaresma
 * @since 2025-10-13
 * @version 1.0.0
 */

/**
 * @class DocumentationValidationUtils
 * @description Clase que contiene métodos de validación para documentación del sistema
 */
export class DocumentationValidationUtils {
  /**
   * @method validateDocumentationConfig
   * @description Valida la configuración de documentación
   * @param {any} config - Configuración de documentación a validar
   * @returns {object} Resultado de validación con isValid y errors
   */
  static validateDocumentationConfig(config: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!config || typeof config !== 'object') {
      errors.push('La configuración de documentación no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar título
    if (!('title' in config)) {
      errors.push('title es requerido');
    } else if (typeof config.title !== 'string') {
      errors.push('title debe ser una cadena');
    } else if (config.title.length === 0) {
      errors.push('title no puede estar vacío');
    } else if (config.title.length > 255) {
      errors.push('title no debe exceder 255 caracteres');
    }
    
    // Validar versión
    if ('version' in config) {
      if (typeof config.version !== 'string') {
        errors.push('version debe ser una cadena');
      } else if (config.version.length === 0) {
        errors.push('version no puede estar vacía');
      } else if (config.version.length > 20) {
        errors.push('version no debe exceder 20 caracteres');
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
    
    // Validar autor
    if ('author' in config) {
      if (typeof config.author !== 'string') {
        errors.push('author debe ser una cadena');
      } else if (config.author.length > 100) {
        errors.push('author no debe exceder 100 caracteres');
      }
    }
    
    // Validar secciones
    if ('sections' in config) {
      if (!Array.isArray(config.sections)) {
        errors.push('sections debe ser un array');
      } else {
        for (let i = 0; i < config.sections.length; i++) {
          const sectionValidation = this.validateDocumentationSection(config.sections[i]);
          if (!sectionValidation.isValid) {
            errors.push(...sectionValidation.errors.map(err => `section[${i}] error: ${err}`));
          }
        }
      }
    }
    
    // Validar formato
    if ('format' in config) {
      const validFormats = ['markdown', 'html', 'pdf', 'doc'];
      if (typeof config.format !== 'string' || !validFormats.includes(config.format)) {
        errors.push(`format debe ser una de: ${validFormats.join(', ')}`);
      }
    }
    
    // Validar idioma
    if ('language' in config) {
      if (typeof config.language !== 'string') {
        errors.push('language debe ser una cadena');
      } else if (config.language.length > 10) {
        errors.push('language no debe exceder 10 caracteres');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * @method validateDocumentationSection
   * @description Valida una sección de documentación
   * @param {any} section - Sección de documentación a validar
   * @returns {object} Resultado de validación con isValid y errors
   */
  static validateDocumentationSection(section: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!section || typeof section !== 'object') {
      errors.push('La sección de documentación no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar título de la sección
    if (!('title' in section)) {
      errors.push('title es requerido');
    } else if (typeof section.title !== 'string') {
      errors.push('title debe ser una cadena');
    } else if (section.title.length === 0) {
      errors.push('title no puede estar vacío');
    } else if (section.title.length > 100) {
      errors.push('title no debe exceder 100 caracteres');
    }
    
    // Validar contenido
    if (!('content' in section)) {
      errors.push('content es requerido');
    } else if (typeof section.content !== 'string') {
      errors.push('content debe ser una cadena');
    } else if (section.content.length === 0) {
      errors.push('content no puede estar vacío');
    }
    
    // Validar tipo de sección
    if ('type' in section) {
      const validTypes = ['introduction', 'installation', 'usage', 'api', 'examples', 'troubleshooting', 'faq', 'conclusion'];
      if (typeof section.type !== 'string' || !validTypes.includes(section.type)) {
        errors.push(`type debe ser una de: ${validTypes.join(', ')}`);
      }
    }
    
    // Validar subsecciones
    if ('subsections' in section) {
      if (!Array.isArray(section.subsections)) {
        errors.push('subsections debe ser un array');
      } else {
        for (let i = 0; i < section.subsections.length; i++) {
          const subsectionValidation = this.validateDocumentationSubsection(section.subsections[i]);
          if (!subsectionValidation.isValid) {
            errors.push(...subsectionValidation.errors.map(err => `subsection[${i}] error: ${err}`));
          }
        }
      }
    }
    
    // Validar ejemplos
    if ('examples' in section) {
      if (!Array.isArray(section.examples)) {
        errors.push('examples debe ser un array');
      } else {
        for (let i = 0; i < section.examples.length; i++) {
          const exampleValidation = this.validateDocumentationExample(section.examples[i]);
          if (!exampleValidation.isValid) {
            errors.push(...exampleValidation.errors.map(err => `example[${i}] error: ${err}`));
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
   * @method validateDocumentationSubsection
   * @description Valida una subsección de documentación
   * @param {any} subsection - Subsección de documentación a validar
   * @returns {object} Resultado de validación con isValid y errors
   */
  static validateDocumentationSubsection(subsection: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!subsection || typeof subsection !== 'object') {
      errors.push('La subsección de documentación no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar título de la subsección
    if (!('title' in subsection)) {
      errors.push('title es requerido');
    } else if (typeof subsection.title !== 'string') {
      errors.push('title debe ser una cadena');
    } else if (subsection.title.length === 0) {
      errors.push('title no puede estar vacío');
    } else if (subsection.title.length > 100) {
      errors.push('title no debe exceder 100 caracteres');
    }
    
    // Validar contenido
    if (!('content' in subsection)) {
      errors.push('content es requerido');
    } else if (typeof subsection.content !== 'string') {
      errors.push('content debe ser una cadena');
    } else if (subsection.content.length === 0) {
      errors.push('content no puede estar vacío');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * @method validateDocumentationExample
   * @description Valida un ejemplo de documentación
   * @param {any} example - Ejemplo de documentación a validar
   * @returns {object} Resultado de validación con isValid y errors
   */
  static validateDocumentationExample(example: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!example || typeof example !== 'object') {
      errors.push('El ejemplo de documentación no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar título del ejemplo
    if (!('title' in example)) {
      errors.push('title es requerido');
    } else if (typeof example.title !== 'string') {
      errors.push('title debe ser una cadena');
    } else if (example.title.length === 0) {
      errors.push('title no puede estar vacío');
    } else if (example.title.length > 100) {
      errors.push('title no debe exceder 100 caracteres');
    }
    
    // Validar código
    if (!('code' in example)) {
      errors.push('code es requerido');
    } else if (typeof example.code !== 'string') {
      errors.push('code debe ser una cadena');
    } else if (example.code.length === 0) {
      errors.push('code no puede estar vacío');
    }
    
    // Validar lenguaje
    if ('language' in example) {
      if (typeof example.language !== 'string') {
        errors.push('language debe ser una cadena');
      } else if (example.language.length > 20) {
        errors.push('language no debe exceder 20 caracteres');
      }
    }
    
    // Validar descripción
    if ('description' in example) {
      if (typeof example.description !== 'string') {
        errors.push('description debe ser una cadena');
      } else if (example.description.length > 500) {
        errors.push('description no debe exceder 500 caracteres');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}