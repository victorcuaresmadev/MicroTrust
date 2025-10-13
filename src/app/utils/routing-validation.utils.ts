import { ValidationUtils } from './validation.utils';

/**
 * @file routing-validation.utils.ts
 * @description Utilidades de validación avanzada para routing en el sistema MicroTrust
 * @author Víctor Cuaresma <victor.cuaresma@utec.edu.pe>
 * @copyright 2025-2026 Víctor Cuaresma
 * @since 2025-10-13
 * @version 1.0.0
 */

/**
 * @class RoutingValidationUtils
 * @description Clase que contiene métodos de validación para configuración de rutas
 */
export class RoutingValidationUtils {
  /**
   * @method validateRouteConfig
   * @description Valida la configuración de una ruta
   * @param {any} config - Configuración de ruta a validar
   * @returns {object} Resultado de validación con isValid y errors
   */
  static validateRouteConfig(config: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!config || typeof config !== 'object') {
      errors.push('La configuración de ruta no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar path
    if (!('path' in config)) {
      errors.push('path es requerido');
    } else if (typeof config.path !== 'string') {
      errors.push('path debe ser una cadena');
    } else if (config.path.length === 0) {
      errors.push('path no puede estar vacío');
    } else if (config.path.length > 255) {
      errors.push('path no debe exceder 255 caracteres');
    }
    
    // Validar componente
    if (!('component' in config)) {
      errors.push('component es requerido');
    } else if (typeof config.component !== 'function' && typeof config.component !== 'string') {
      errors.push('component debe ser una función o cadena');
    }
    
    // Validar ruta hija
    if ('children' in config) {
      if (!Array.isArray(config.children)) {
        errors.push('children debe ser un array');
      } else {
        for (let i = 0; i < config.children.length; i++) {
          const childValidation = this.validateRouteConfig(config.children[i]);
          if (!childValidation.isValid) {
            errors.push(...childValidation.errors.map(err => `child[${i}] error: ${err}`));
          }
        }
      }
    }
    
    // Validar guards
    if ('canActivate' in config) {
      if (!Array.isArray(config.canActivate)) {
        errors.push('canActivate debe ser un array');
      }
    }
    
    if ('canDeactivate' in config) {
      if (!Array.isArray(config.canDeactivate)) {
        errors.push('canDeactivate debe ser un array');
      }
    }
    
    if ('canLoad' in config) {
      if (!Array.isArray(config.canLoad)) {
        errors.push('canLoad debe ser un array');
      }
    }
    
    // Validar data
    if ('data' in config) {
      if (typeof config.data !== 'object') {
        errors.push('data debe ser un objeto');
      }
    }
    
    // Validar redirectTo
    if ('redirectTo' in config) {
      if (typeof config.redirectTo !== 'string') {
        errors.push('redirectTo debe ser una cadena');
      } else if (config.redirectTo.length === 0) {
        errors.push('redirectTo no puede estar vacío');
      }
    }
    
    // Validar pathMatch
    if ('pathMatch' in config) {
      const validPathMatch = ['full', 'prefix'];
      if (typeof config.pathMatch !== 'string' || !validPathMatch.includes(config.pathMatch)) {
        errors.push(`pathMatch debe ser una de: ${validPathMatch.join(', ')}`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * @method validateRouterConfig
   * @description Valida la configuración completa del router
   * @param {any} config - Configuración del router a validar
   * @returns {object} Resultado de validación con isValid y errors
   */
  static validateRouterConfig(config: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!config || typeof config !== 'object') {
      errors.push('La configuración del router no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar rutas
    if (!('routes' in config)) {
      errors.push('routes es requerido');
    } else if (!Array.isArray(config.routes)) {
      errors.push('routes debe ser un array');
    } else {
      for (let i = 0; i < config.routes.length; i++) {
        const routeValidation = this.validateRouteConfig(config.routes[i]);
        if (!routeValidation.isValid) {
          errors.push(...routeValidation.errors.map(err => `route[${i}] error: ${err}`));
        }
      }
    }
    
    // Validar modo de ubicación
    if ('locationStrategy' in config) {
      const validStrategies = ['hash', 'path'];
      if (typeof config.locationStrategy !== 'string' || !validStrategies.includes(config.locationStrategy)) {
        errors.push(`locationStrategy debe ser una de: ${validStrategies.join(', ')}`);
      }
    }
    
    // Validar prefijo base
    if ('baseHref' in config) {
      if (typeof config.baseHref !== 'string') {
        errors.push('baseHref debe ser una cadena');
      } else if (config.baseHref.length > 255) {
        errors.push('baseHref no debe exceder 255 caracteres');
      }
    }
    
    // Validar scrollPositionRestoration
    if ('scrollPositionRestoration' in config) {
      const validOptions = ['disabled', 'enabled', 'top'];
      if (typeof config.scrollPositionRestoration !== 'string' || !validOptions.includes(config.scrollPositionRestoration)) {
        errors.push(`scrollPositionRestoration debe ser una de: ${validOptions.join(', ')}`);
      }
    }
    
    // Validar anchorScrolling
    if ('anchorScrolling' in config) {
      const validOptions = ['disabled', 'enabled'];
      if (typeof config.anchorScrolling !== 'string' || !validOptions.includes(config.anchorScrolling)) {
        errors.push(`anchorScrolling debe ser una de: ${validOptions.join(', ')}`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * @method validateNavigation
   * @description Valida una navegación
   * @param {any} navigation - Navegación a validar
   * @returns {object} Resultado de validación con isValid y errors
   */
  static validateNavigation(navigation: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!navigation || typeof navigation !== 'object') {
      errors.push('La navegación no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar commands
    if (!('commands' in navigation)) {
      errors.push('commands es requerido');
    } else if (!Array.isArray(navigation.commands)) {
      errors.push('commands debe ser un array');
    }
    
    // Validar extras
    if ('extras' in navigation) {
      if (typeof navigation.extras !== 'object') {
        errors.push('extras debe ser un objeto');
      } else {
        // Validar queryParams
        if ('queryParams' in navigation.extras) {
          if (typeof navigation.extras.queryParams !== 'object') {
            errors.push('extras.queryParams debe ser un objeto');
          }
        }
        
        // Validar fragment
        if ('fragment' in navigation.extras) {
          if (typeof navigation.extras.fragment !== 'string') {
            errors.push('extras.fragment debe ser una cadena');
          }
        }
        
        // Validar queryParamsHandling
        if ('queryParamsHandling' in navigation.extras) {
          const validOptions = ['merge', 'preserve'];
          if (typeof navigation.extras.queryParamsHandling !== 'string' || 
              !validOptions.includes(navigation.extras.queryParamsHandling)) {
            errors.push(`extras.queryParamsHandling debe ser una de: ${validOptions.join(', ')}`);
          }
        }
        
        // Validar preserveFragment
        if ('preserveFragment' in navigation.extras) {
          if (typeof navigation.extras.preserveFragment !== 'boolean') {
            errors.push('extras.preserveFragment debe ser un valor booleano');
          }
        }
        
        // Validar skipLocationChange
        if ('skipLocationChange' in navigation.extras) {
          if (typeof navigation.extras.skipLocationChange !== 'boolean') {
            errors.push('extras.skipLocationChange debe ser un valor booleano');
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