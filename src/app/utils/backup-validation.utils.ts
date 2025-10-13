import { ValidationUtils } from './validation.utils';

/**
 * @file backup-validation.utils.ts
 * @description Utilidades de validación avanzada para respaldo en el sistema MicroTrust
 * @author Víctor Cuaresma <victor.cuaresma@utec.edu.pe>
 * @copyright 2025-2026 Víctor Cuaresma
 * @since 2025-10-13
 * @version 1.0.0
 */

/**
 * @class BackupValidationUtils
 * @description Clase que contiene métodos de validación para configuraciones de respaldo
 */
export class BackupValidationUtils {
  /**
   * @method validateBackupConfig
   * @description Valida la configuración de respaldo
   * @param {any} config - Configuración de respaldo a validar
   * @returns {object} Resultado de validación con isValid y errors
   */
  static validateBackupConfig(config: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!config || typeof config !== 'object') {
      errors.push('La configuración de respaldo no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar nombre de la configuración
    if (!('name' in config)) {
      errors.push('name es requerido');
    } else if (typeof config.name !== 'string') {
      errors.push('name debe ser una cadena');
    } else if (config.name.length === 0) {
      errors.push('name no puede estar vacío');
    } else if (config.name.length > 100) {
      errors.push('name no debe exceder 100 caracteres');
    }
    
    // Validar estrategia de respaldo
    if (!('strategy' in config)) {
      errors.push('strategy es requerido');
    } else {
      const validStrategies = ['full', 'incremental', 'differential'];
      if (typeof config.strategy !== 'string' || !validStrategies.includes(config.strategy)) {
        errors.push(`strategy debe ser una de: ${validStrategies.join(', ')}`);
      }
    }
    
    // Validar frecuencia
    if (!('frequency' in config)) {
      errors.push('frequency es requerido');
    } else {
      const frequencyValidation = this.validateBackupFrequency(config.frequency);
      if (!frequencyValidation.isValid) {
        errors.push(...frequencyValidation.errors.map(err => `frequency error: ${err}`));
      }
    }
    
    // Validar destino
    if (!('destination' in config)) {
      errors.push('destination es requerido');
    } else {
      const destinationValidation = this.validateBackupDestination(config.destination);
      if (!destinationValidation.isValid) {
        errors.push(...destinationValidation.errors.map(err => `destination error: ${err}`));
      }
    }
    
    // Validar retención
    if ('retention' in config) {
      const retentionValidation = this.validateBackupRetention(config.retention);
      if (!retentionValidation.isValid) {
        errors.push(...retentionValidation.errors.map(err => `retention error: ${err}`));
      }
    }
    
    // Validar compresión
    if ('compression' in config) {
      if (typeof config.compression !== 'boolean') {
        errors.push('compression debe ser un valor booleano');
      }
    }
    
    // Validar encriptación
    if ('encryption' in config) {
      if (typeof config.encryption !== 'boolean') {
        errors.push('encryption debe ser un valor booleano');
      }
    }
    
    // Validar verificación
    if ('verification' in config) {
      if (typeof config.verification !== 'boolean') {
        errors.push('verification debe ser un valor booleano');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * @method validateBackupFrequency
   * @description Valida la frecuencia de respaldo
   * @param {any} frequency - Frecuencia de respaldo a validar
   * @returns {object} Resultado de validación con isValid y errors
   */
  static validateBackupFrequency(frequency: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!frequency || typeof frequency !== 'object') {
      errors.push('La frecuencia de respaldo no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar tipo de frecuencia
    if (!('type' in frequency)) {
      errors.push('type es requerido');
    } else {
      const validTypes = ['daily', 'weekly', 'monthly', 'custom'];
      if (typeof frequency.type !== 'string' || !validTypes.includes(frequency.type)) {
        errors.push(`type debe ser una de: ${validTypes.join(', ')}`);
      }
    }
    
    // Validar hora
    if ('time' in frequency) {
      if (typeof frequency.time !== 'string') {
        errors.push('time debe ser una cadena');
      } else if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(frequency.time)) {
        errors.push('time debe tener el formato HH:MM');
      }
    }
    
    // Validar días (para frecuencia semanal)
    if (frequency.type === 'weekly' && 'days' in frequency) {
      if (!Array.isArray(frequency.days)) {
        errors.push('days debe ser un array');
      } else {
        const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        for (const day of frequency.days) {
          if (typeof day !== 'string' || !validDays.includes(day.toLowerCase())) {
            errors.push(`Día inválido: ${day}. Debe ser uno de: ${validDays.join(', ')}`);
            break;
          }
        }
      }
    }
    
    // Validar día del mes (para frecuencia mensual)
    if (frequency.type === 'monthly' && 'dayOfMonth' in frequency) {
      if (typeof frequency.dayOfMonth !== 'number' || frequency.dayOfMonth < 1 || frequency.dayOfMonth > 31) {
        errors.push('dayOfMonth debe ser un número entre 1 y 31');
      }
    }
    
    // Validar expresión cron (para frecuencia personalizada)
    if (frequency.type === 'custom' && 'cronExpression' in frequency) {
      if (typeof frequency.cronExpression !== 'string') {
        errors.push('cronExpression debe ser una cadena');
      } else if (frequency.cronExpression.length === 0) {
        errors.push('cronExpression no puede estar vacía');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * @method validateBackupDestination
   * @description Valida el destino de respaldo
   * @param {any} destination - Destino de respaldo a validar
   * @returns {object} Resultado de validación con isValid y errors
   */
  static validateBackupDestination(destination: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!destination || typeof destination !== 'object') {
      errors.push('El destino de respaldo no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar tipo de destino
    if (!('type' in destination)) {
      errors.push('type es requerido');
    } else {
      const validTypes = ['local', 'remote', 'cloud'];
      if (typeof destination.type !== 'string' || !validTypes.includes(destination.type)) {
        errors.push(`type debe ser una de: ${validTypes.join(', ')}`);
      }
    }
    
    // Validar ruta (para destino local)
    if (destination.type === 'local' && 'path' in destination) {
      if (typeof destination.path !== 'string') {
        errors.push('path debe ser una cadena');
      } else if (destination.path.length === 0) {
        errors.push('path no puede estar vacío');
      }
    }
    
    // Validar host y credenciales (para destino remoto)
    if (destination.type === 'remote') {
      if (!('host' in destination)) {
        errors.push('host es requerido para destino remoto');
      } else if (typeof destination.host !== 'string') {
        errors.push('host debe ser una cadena');
      } else if (destination.host.length === 0) {
        errors.push('host no puede estar vacío');
      }
      
      if ('credentials' in destination) {
        const credentialsValidation = this.validateBackupCredentials(destination.credentials);
        if (!credentialsValidation.isValid) {
          errors.push(...credentialsValidation.errors.map(err => `credentials error: ${err}`));
        }
      }
    }
    
    // Validar proveedor y credenciales (para destino en la nube)
    if (destination.type === 'cloud') {
      if (!('provider' in destination)) {
        errors.push('provider es requerido para destino en la nube');
      } else {
        const validProviders = ['aws', 'azure', 'gcp'];
        if (typeof destination.provider !== 'string' || !validProviders.includes(destination.provider)) {
          errors.push(`provider debe ser uno de: ${validProviders.join(', ')}`);
        }
      }
      
      if ('credentials' in destination) {
        const credentialsValidation = this.validateBackupCredentials(destination.credentials);
        if (!credentialsValidation.isValid) {
          errors.push(...credentialsValidation.errors.map(err => `credentials error: ${err}`));
        }
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * @method validateBackupCredentials
   * @description Valida las credenciales de respaldo
   * @param {any} credentials - Credenciales a validar
   * @returns {object} Resultado de validación con isValid y errors
   */
  static validateBackupCredentials(credentials: any): { isValid: boolean; errors: string[] } {
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
   * @method validateBackupRetention
   * @description Valida la política de retención de respaldos
   * @param {any} retention - Política de retención a validar
   * @returns {object} Resultado de validación con isValid y errors
   */
  static validateBackupRetention(retention: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!retention || typeof retention !== 'object') {
      errors.push('La política de retención no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar tipo de retención
    if (!('type' in retention)) {
      errors.push('type es requerido');
    } else {
      const validTypes = ['count', 'time'];
      if (typeof retention.type !== 'string' || !validTypes.includes(retention.type)) {
        errors.push(`type debe ser una de: ${validTypes.join(', ')}`);
      }
    }
    
    // Validar valor según tipo
    if (retention.type === 'count') {
      if (!('count' in retention)) {
        errors.push('count es requerido para tipo count');
      } else if (typeof retention.count !== 'number' || retention.count < 1) {
        errors.push('count debe ser un número positivo');
      }
    }
    
    if (retention.type === 'time') {
      if (!('days' in retention)) {
        errors.push('days es requerido para tipo time');
      } else if (typeof retention.days !== 'number' || retention.days < 1) {
        errors.push('days debe ser un número positivo');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}