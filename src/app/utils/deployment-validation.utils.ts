import { ValidationUtils } from './validation.utils';

/**
 * @file deployment-validation.utils.ts
 * @description Utilidades de validación avanzada para despliegue en el sistema MicroTrust
 * @author Víctor Cuaresma <victor.cuaresma@utec.edu.pe>
 * @copyright 2025-2026 Víctor Cuaresma
 * @since 2025-10-13
 * @version 1.0.0
 */

/**
 * @class DeploymentValidationUtils
 * @description Clase que contiene métodos de validación para configuraciones de despliegue
 */
export class DeploymentValidationUtils {
  /**
   * @method validateDeploymentConfig
   * @description Valida la configuración de despliegue
   * @param {any} config - Configuración de despliegue a validar
   * @returns {object} Resultado de validación con isValid y errors
   */
  static validateDeploymentConfig(config: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!config || typeof config !== 'object') {
      errors.push('La configuración de despliegue no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar nombre del despliegue
    if (!('name' in config)) {
      errors.push('name es requerido');
    } else if (typeof config.name !== 'string') {
      errors.push('name debe ser una cadena');
    } else if (config.name.length === 0) {
      errors.push('name no puede estar vacío');
    } else if (config.name.length > 100) {
      errors.push('name no debe exceder 100 caracteres');
    }
    
    // Validar entorno
    if (!('environment' in config)) {
      errors.push('environment es requerido');
    } else {
      const validEnvironments = ['development', 'testing', 'staging', 'production'];
      if (typeof config.environment !== 'string' || !validEnvironments.includes(config.environment)) {
        errors.push(`environment debe ser una de: ${validEnvironments.join(', ')}`);
      }
    }
    
    // Validar versión
    if (!('version' in config)) {
      errors.push('version es requerido');
    } else if (typeof config.version !== 'string') {
      errors.push('version debe ser una cadena');
    } else if (config.version.length === 0) {
      errors.push('version no puede estar vacía');
    } else if (config.version.length > 20) {
      errors.push('version no debe exceder 20 caracteres');
    }
    
    // Validar servidores
    if ('servers' in config) {
      if (!Array.isArray(config.servers)) {
        errors.push('servers debe ser un array');
      } else {
        for (let i = 0; i < config.servers.length; i++) {
          const serverValidation = this.validateServerConfig(config.servers[i]);
          if (!serverValidation.isValid) {
            errors.push(...serverValidation.errors.map(err => `server[${i}] error: ${err}`));
          }
        }
      }
    }
    
    // Validar estrategia de despliegue
    if ('strategy' in config) {
      const validStrategies = ['rolling', 'blue-green', 'canary', 'recreate'];
      if (typeof config.strategy !== 'string' || !validStrategies.includes(config.strategy)) {
        errors.push(`strategy debe ser una de: ${validStrategies.join(', ')}`);
      }
    }
    
    // Validar tiempo de espera
    if ('timeout' in config) {
      if (typeof config.timeout !== 'number' || config.timeout <= 0) {
        errors.push('timeout debe ser un número positivo');
      }
    }
    
    // Validar número de réplicas
    if ('replicas' in config) {
      if (typeof config.replicas !== 'number' || config.replicas < 0) {
        errors.push('replicas debe ser un número no negativo');
      }
    }
    
    // Validar health checks
    if ('healthChecks' in config) {
      if (!Array.isArray(config.healthChecks)) {
        errors.push('healthChecks debe ser un array');
      } else {
        for (let i = 0; i < config.healthChecks.length; i++) {
          const healthCheckValidation = this.validateHealthCheck(config.healthChecks[i]);
          if (!healthCheckValidation.isValid) {
            errors.push(...healthCheckValidation.errors.map(err => `healthCheck[${i}] error: ${err}`));
          }
        }
      }
    }
    
    // Validar recursos
    if ('resources' in config) {
      const resourcesValidation = this.validateResourceConfig(config.resources);
      if (!resourcesValidation.isValid) {
        errors.push(...resourcesValidation.errors.map(err => `resources error: ${err}`));
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * @method validateServerConfig
   * @description Valida la configuración de un servidor
   * @param {any} config - Configuración de servidor a validar
   * @returns {object} Resultado de validación con isValid y errors
   */
  static validateServerConfig(config: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!config || typeof config !== 'object') {
      errors.push('La configuración de servidor no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar host
    if (!('host' in config)) {
      errors.push('host es requerido');
    } else if (typeof config.host !== 'string') {
      errors.push('host debe ser una cadena');
    } else if (config.host.length === 0) {
      errors.push('host no puede estar vacío');
    } else if (config.host.length > 255) {
      errors.push('host no debe exceder 255 caracteres');
    }
    
    // Validar puerto
    if ('port' in config) {
      if (typeof config.port !== 'number' || config.port < 1 || config.port > 65535) {
        errors.push('port debe ser un número entre 1 y 65535');
      }
    }
    
    // Validar protocolo
    if ('protocol' in config) {
      const validProtocols = ['http', 'https', 'ssh', 'ftp'];
      if (typeof config.protocol !== 'string' || !validProtocols.includes(config.protocol)) {
        errors.push(`protocol debe ser una de: ${validProtocols.join(', ')}`);
      }
    }
    
    // Validar credenciales
    if ('credentials' in config) {
      const credentialsValidation = this.validateCredentials(config.credentials);
      if (!credentialsValidation.isValid) {
        errors.push(...credentialsValidation.errors.map(err => `credentials error: ${err}`));
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * @method validateCredentials
   * @description Valida las credenciales de acceso
   * @param {any} credentials - Credenciales a validar
   * @returns {object} Resultado de validación con isValid y errors
   */
  static validateCredentials(credentials: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!credentials || typeof credentials !== 'object') {
      errors.push('Las credenciales no son un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar nombre de usuario
    if (!('username' in credentials)) {
      errors.push('username es requerido');
    } else if (typeof credentials.username !== 'string') {
      errors.push('username debe ser una cadena');
    } else if (credentials.username.length === 0) {
      errors.push('username no puede estar vacío');
    } else if (credentials.username.length > 100) {
      errors.push('username no debe exceder 100 caracteres');
    }
    
    // Validar contraseña o token
    if (!('password' in credentials) && !('token' in credentials)) {
      errors.push('Se requiere password o token');
    }
    
    if ('password' in credentials) {
      if (typeof credentials.password !== 'string') {
        errors.push('password debe ser una cadena');
      } else if (credentials.password.length === 0) {
        errors.push('password no puede estar vacía');
      }
    }
    
    if ('token' in credentials) {
      if (typeof credentials.token !== 'string') {
        errors.push('token debe ser una cadena');
      } else if (credentials.token.length === 0) {
        errors.push('token no puede estar vacío');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * @method validateHealthCheck
   * @description Valida una verificación de salud
   * @param {any} healthCheck - Verificación de salud a validar
   * @returns {object} Resultado de validación con isValid y errors
   */
  static validateHealthCheck(healthCheck: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!healthCheck || typeof healthCheck !== 'object') {
      errors.push('La verificación de salud no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar nombre
    if (!('name' in healthCheck)) {
      errors.push('name es requerido');
    } else if (typeof healthCheck.name !== 'string') {
      errors.push('name debe ser una cadena');
    } else if (healthCheck.name.length === 0) {
      errors.push('name no puede estar vacío');
    } else if (healthCheck.name.length > 100) {
      errors.push('name no debe exceder 100 caracteres');
    }
    
    // Validar endpoint
    if (!('endpoint' in healthCheck)) {
      errors.push('endpoint es requerido');
    } else if (typeof healthCheck.endpoint !== 'string') {
      errors.push('endpoint debe ser una cadena');
    } else if (healthCheck.endpoint.length === 0) {
      errors.push('endpoint no puede estar vacío');
    } else if (healthCheck.endpoint.length > 255) {
      errors.push('endpoint no debe exceder 255 caracteres');
    }
    
    // Validar método HTTP
    if ('method' in healthCheck) {
      const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS'];
      if (typeof healthCheck.method !== 'string' || !validMethods.includes(healthCheck.method.toUpperCase())) {
        errors.push(`method debe ser una de: ${validMethods.join(', ')}`);
      }
    }
    
    // Validar código de estado esperado
    if ('expectedStatus' in healthCheck) {
      if (typeof healthCheck.expectedStatus !== 'number' || healthCheck.expectedStatus < 100 || healthCheck.expectedStatus > 599) {
        errors.push('expectedStatus debe ser un número entre 100 y 599');
      }
    }
    
    // Validar intervalo
    if ('interval' in healthCheck) {
      if (typeof healthCheck.interval !== 'number' || healthCheck.interval <= 0) {
        errors.push('interval debe ser un número positivo');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * @method validateResourceConfig
   * @description Valida la configuración de recursos
   * @param {any} resources - Configuración de recursos a validar
   * @returns {object} Resultado de validación con isValid y errors
   */
  static validateResourceConfig(resources: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!resources || typeof resources !== 'object') {
      errors.push('La configuración de recursos no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar CPU
    if ('cpu' in resources) {
      if (typeof resources.cpu !== 'string') {
        errors.push('cpu debe ser una cadena');
      } else if (resources.cpu.length === 0) {
        errors.push('cpu no puede estar vacía');
      } else if (resources.cpu.length > 20) {
        errors.push('cpu no debe exceder 20 caracteres');
      }
    }
    
    // Validar memoria
    if ('memory' in resources) {
      if (typeof resources.memory !== 'string') {
        errors.push('memory debe ser una cadena');
      } else if (resources.memory.length === 0) {
        errors.push('memory no puede estar vacía');
      } else if (resources.memory.length > 20) {
        errors.push('memory no debe exceder 20 caracteres');
      }
    }
    
    // Validar almacenamiento
    if ('storage' in resources) {
      if (typeof resources.storage !== 'string') {
        errors.push('storage debe ser una cadena');
      } else if (resources.storage.length === 0) {
        errors.push('storage no puede estar vacío');
      } else if (resources.storage.length > 20) {
        errors.push('storage no debe exceder 20 caracteres');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}