import { ValidationUtils } from './validation.utils';

/**
 * @file monitoring-validation.utils.ts
 * @description Utilidades de validación avanzada para monitoreo en el sistema MicroTrust
 * @author Víctor Cuaresma <victor.cuaresma@utec.edu.pe>
 * @copyright 2025-2026 Víctor Cuaresma
 * @since 2025-10-13
 * @version 1.0.0
 */

/**
 * @class MonitoringValidationUtils
 * @description Clase que contiene métodos de validación para configuraciones de monitoreo
 */
export class MonitoringValidationUtils {
  /**
   * @method validateMonitoringConfig
   * @description Valida la configuración de monitoreo
   * @param {any} config - Configuración de monitoreo a validar
   * @returns {object} Resultado de validación con isValid y errors
   */
  static validateMonitoringConfig(config: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!config || typeof config !== 'object') {
      errors.push('La configuración de monitoreo no es un objeto válido');
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
    
    // Validar métricas
    if ('metrics' in config) {
      if (!Array.isArray(config.metrics)) {
        errors.push('metrics debe ser un array');
      } else {
        for (let i = 0; i < config.metrics.length; i++) {
          const metricValidation = this.validateMetricConfig(config.metrics[i]);
          if (!metricValidation.isValid) {
            errors.push(...metricValidation.errors.map(err => `metric[${i}] error: ${err}`));
          }
        }
      }
    }
    
    // Validar alertas
    if ('alerts' in config) {
      if (!Array.isArray(config.alerts)) {
        errors.push('alerts debe ser un array');
      } else {
        for (let i = 0; i < config.alerts.length; i++) {
          const alertValidation = this.validateAlertConfig(config.alerts[i]);
          if (!alertValidation.isValid) {
            errors.push(...alertValidation.errors.map(err => `alert[${i}] error: ${err}`));
          }
        }
      }
    }
    
    // Validar dashboards
    if ('dashboards' in config) {
      if (!Array.isArray(config.dashboards)) {
        errors.push('dashboards debe ser un array');
      } else {
        for (let i = 0; i < config.dashboards.length; i++) {
          const dashboardValidation = this.validateDashboardConfig(config.dashboards[i]);
          if (!dashboardValidation.isValid) {
            errors.push(...dashboardValidation.errors.map(err => `dashboard[${i}] error: ${err}`));
          }
        }
      }
    }
    
    // Validar intervalo de recolección
    if ('collectionInterval' in config) {
      if (typeof config.collectionInterval !== 'number' || config.collectionInterval <= 0) {
        errors.push('collectionInterval debe ser un número positivo');
      }
    }
    
    // Validar retención de datos
    if ('dataRetention' in config) {
      if (typeof config.dataRetention !== 'number' || config.dataRetention <= 0) {
        errors.push('dataRetention debe ser un número positivo');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * @method validateMetricConfig
   * @description Valida la configuración de una métrica
   * @param {any} config - Configuración de métrica a validar
   * @returns {object} Resultado de validación con isValid y errors
   */
  static validateMetricConfig(config: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!config || typeof config !== 'object') {
      errors.push('La configuración de métrica no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar nombre de la métrica
    if (!('name' in config)) {
      errors.push('name es requerido');
    } else if (typeof config.name !== 'string') {
      errors.push('name debe ser una cadena');
    } else if (config.name.length === 0) {
      errors.push('name no puede estar vacío');
    } else if (config.name.length > 100) {
      errors.push('name no debe exceder 100 caracteres');
    }
    
    // Validar tipo de métrica
    if (!('type' in config)) {
      errors.push('type es requerido');
    } else {
      const validTypes = ['counter', 'gauge', 'histogram', 'summary'];
      if (typeof config.type !== 'string' || !validTypes.includes(config.type)) {
        errors.push(`type debe ser una de: ${validTypes.join(', ')}`);
      }
    }
    
    // Validar descripción
    if ('description' in config) {
      if (typeof config.description !== 'string') {
        errors.push('description debe ser una cadena');
      } else if (config.description.length > 500) {
        errors.push('description no debe exceder 500 caracteres');
      }
    }
    
    // Validar etiquetas
    if ('labels' in config) {
      if (!Array.isArray(config.labels)) {
        errors.push('labels debe ser un array');
      } else {
        for (const label of config.labels) {
          if (typeof label !== 'string') {
            errors.push('Cada etiqueta debe ser una cadena');
            break;
          }
        }
      }
    }
    
    // Validar función de recolección
    if (!('collector' in config)) {
      errors.push('collector es requerido');
    } else if (typeof config.collector !== 'function') {
      errors.push('collector debe ser una función');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * @method validateAlertConfig
   * @description Valida la configuración de una alerta
   * @param {any} config - Configuración de alerta a validar
   * @returns {object} Resultado de validación con isValid y errors
   */
  static validateAlertConfig(config: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!config || typeof config !== 'object') {
      errors.push('La configuración de alerta no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar nombre de la alerta
    if (!('name' in config)) {
      errors.push('name es requerido');
    } else if (typeof config.name !== 'string') {
      errors.push('name debe ser una cadena');
    } else if (config.name.length === 0) {
      errors.push('name no puede estar vacío');
    } else if (config.name.length > 100) {
      errors.push('name no debe exceder 100 caracteres');
    }
    
    // Validar métrica asociada
    if (!('metric' in config)) {
      errors.push('metric es requerido');
    } else if (typeof config.metric !== 'string') {
      errors.push('metric debe ser una cadena');
    } else if (config.metric.length === 0) {
      errors.push('metric no puede estar vacía');
    } else if (config.metric.length > 100) {
      errors.push('metric no debe exceder 100 caracteres');
    }
    
    // Validar condición
    if (!('condition' in config)) {
      errors.push('condition es requerido');
    } else if (typeof config.condition !== 'object') {
      errors.push('condition debe ser un objeto');
    } else {
      const conditionValidation = this.validateConditionConfig(config.condition);
      if (!conditionValidation.isValid) {
        errors.push(...conditionValidation.errors.map(err => `condition error: ${err}`));
      }
    }
    
    // Validar notificaciones
    if ('notifications' in config) {
      if (!Array.isArray(config.notifications)) {
        errors.push('notifications debe ser un array');
      } else {
        for (let i = 0; i < config.notifications.length; i++) {
          const notificationValidation = this.validateNotificationConfig(config.notifications[i]);
          if (!notificationValidation.isValid) {
            errors.push(...notificationValidation.errors.map(err => `notification[${i}] error: ${err}`));
          }
        }
      }
    }
    
    // Validar duración
    if ('duration' in config) {
      if (typeof config.duration !== 'number' || config.duration <= 0) {
        errors.push('duration debe ser un número positivo');
      }
    }
    
    // Validar resolución automática
    if ('autoResolve' in config) {
      if (typeof config.autoResolve !== 'boolean') {
        errors.push('autoResolve debe ser un valor booleano');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * @method validateConditionConfig
   * @description Valida la configuración de una condición
   * @param {any} config - Configuración de condición a validar
   * @returns {object} Resultado de validación con isValid y errors
   */
  static validateConditionConfig(config: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!config || typeof config !== 'object') {
      errors.push('La configuración de condición no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar operador
    if (!('operator' in config)) {
      errors.push('operator es requerido');
    } else {
      const validOperators = ['>', '<', '>=', '<=', '==', '!='];
      if (typeof config.operator !== 'string' || !validOperators.includes(config.operator)) {
        errors.push(`operator debe ser uno de: ${validOperators.join(', ')}`);
      }
    }
    
    // Validar valor
    if (!('value' in config)) {
      errors.push('value es requerido');
    }
    
    // Validar función de agregación
    if ('aggregation' in config) {
      const validAggregations = ['avg', 'min', 'max', 'sum', 'count'];
      if (typeof config.aggregation !== 'string' || !validAggregations.includes(config.aggregation)) {
        errors.push(`aggregation debe ser una de: ${validAggregations.join(', ')}`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * @method validateNotificationConfig
   * @description Valida la configuración de una notificación
   * @param {any} config - Configuración de notificación a validar
   * @returns {object} Resultado de validación con isValid y errors
   */
  static validateNotificationConfig(config: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!config || typeof config !== 'object') {
      errors.push('La configuración de notificación no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar tipo de notificación
    if (!('type' in config)) {
      errors.push('type es requerido');
    } else {
      const validTypes = ['email', 'sms', 'slack', 'webhook'];
      if (typeof config.type !== 'string' || !validTypes.includes(config.type)) {
        errors.push(`type debe ser una de: ${validTypes.join(', ')}`);
      }
    }
    
    // Validar destinatarios
    if (!('recipients' in config)) {
      errors.push('recipients es requerido');
    } else if (!Array.isArray(config.recipients)) {
      errors.push('recipients debe ser un array');
    } else {
      for (const recipient of config.recipients) {
        if (typeof recipient !== 'string') {
          errors.push('Cada destinatario debe ser una cadena');
          break;
        }
      }
    }
    
    // Validar plantilla
    if ('template' in config) {
      if (typeof config.template !== 'string') {
        errors.push('template debe ser una cadena');
      } else if (config.template.length > 1000) {
        errors.push('template no debe exceder 1000 caracteres');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * @method validateDashboardConfig
   * @description Valida la configuración de un dashboard
   * @param {any} config - Configuración de dashboard a validar
   * @returns {object} Resultado de validación con isValid y errors
   */
  static validateDashboardConfig(config: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!config || typeof config !== 'object') {
      errors.push('La configuración de dashboard no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar nombre del dashboard
    if (!('name' in config)) {
      errors.push('name es requerido');
    } else if (typeof config.name !== 'string') {
      errors.push('name debe ser una cadena');
    } else if (config.name.length === 0) {
      errors.push('name no puede estar vacío');
    } else if (config.name.length > 100) {
      errors.push('name no debe exceder 100 caracteres');
    }
    
    // Validar widgets
    if ('widgets' in config) {
      if (!Array.isArray(config.widgets)) {
        errors.push('widgets debe ser un array');
      } else {
        for (let i = 0; i < config.widgets.length; i++) {
          const widgetValidation = this.validateWidgetConfig(config.widgets[i]);
          if (!widgetValidation.isValid) {
            errors.push(...widgetValidation.errors.map(err => `widget[${i}] error: ${err}`));
          }
        }
      }
    }
    
    // Validar intervalo de actualización
    if ('refreshInterval' in config) {
      if (typeof config.refreshInterval !== 'number' || config.refreshInterval <= 0) {
        errors.push('refreshInterval debe ser un número positivo');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * @method validateWidgetConfig
   * @description Valida la configuración de un widget
   * @param {any} config - Configuración de widget a validar
   * @returns {object} Resultado de validación con isValid y errors
   */
  static validateWidgetConfig(config: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!config || typeof config !== 'object') {
      errors.push('La configuración de widget no es un objeto válido');
      return { isValid: false, errors };
    }
    
    // Validar título del widget
    if (!('title' in config)) {
      errors.push('title es requerido');
    } else if (typeof config.title !== 'string') {
      errors.push('title debe ser una cadena');
    } else if (config.title.length === 0) {
      errors.push('title no puede estar vacío');
    } else if (config.title.length > 100) {
      errors.push('title no debe exceder 100 caracteres');
    }
    
    // Validar tipo de widget
    if (!('type' in config)) {
      errors.push('type es requerido');
    } else {
      const validTypes = ['line-chart', 'bar-chart', 'pie-chart', 'gauge', 'table', 'text'];
      if (typeof config.type !== 'string' || !validTypes.includes(config.type)) {
        errors.push(`type debe ser una de: ${validTypes.join(', ')}`);
      }
    }
    
    // Validar métrica asociada
    if (!('metric' in config)) {
      errors.push('metric es requerido');
    } else if (typeof config.metric !== 'string') {
      errors.push('metric debe ser una cadena');
    } else if (config.metric.length === 0) {
      errors.push('metric no puede estar vacía');
    } else if (config.metric.length > 100) {
      errors.push('metric no debe exceder 100 caracteres');
    }
    
    // Validar opciones
    if ('options' in config) {
      if (typeof config.options !== 'object') {
        errors.push('options debe ser un objeto');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}